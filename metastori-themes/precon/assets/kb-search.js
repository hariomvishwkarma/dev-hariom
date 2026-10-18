/* Knowledge Base predictive search.
 *
 * Client-side search over a JSON index of all knowledgebase_faq entries
 * (rendered by the kb-search section). Matching is diacritic-folded so "diat"
 * matches "Diät". Progressive enhancement — with JS off the box does nothing.
 */
(function () {
  'use strict';

  function fold(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // strip combining accents
      .replace(/ß/g, 'ss');
  }

  function initBox(box) {
    var input = box.querySelector('[data-kb-search-input]');
    var results = box.querySelector('[data-kb-search-results]');
    var empty = box.querySelector('[data-kb-search-empty]');
    var form = box.querySelector('.kb-search__form');
    var dataEl = box.querySelector('[data-kb-search-index]');
    if (!input || !results || !dataEl) return;

    var index;
    try {
      index = JSON.parse(dataEl.textContent || '[]');
    } catch (e) {
      return;
    }
    if (!index.length) return;

    var limit = parseInt(box.getAttribute('data-limit'), 10) || 8;
    var minChars = parseInt(box.getAttribute('data-min'), 10) || 2;

    // dedupe by URL (a FAQ could appear in both a category and a subcategory)
    var seen = {};
    index = index.filter(function (it) {
      if (seen[it.u]) return false;
      seen[it.u] = true;
      return true;
    });

    // precompute folded haystacks once: _t = title only (for ranking),
    // _h = title + keywords + answer body (full-text match)
    index.forEach(function (it) {
      it._t = fold(it.t);
      it._h = fold(it.t + ' ' + (it.k || '') + ' ' + (it.a || ''));
    });

    var active = -1;

    function close() {
      results.hidden = true;
      empty.hidden = true;
      active = -1;
      input.setAttribute('aria-expanded', 'false');
    }

    // bold every occurrence of the typed query in the title (no innerHTML —
    // built from text nodes + <strong> to stay injection-safe)
    function appendHighlighted(el, text, rawq) {
      var q = (rawq || '').toLowerCase();
      if (!q) { el.textContent = text; return; }
      var lower = text.toLowerCase();
      var from = 0;
      var idx;
      while ((idx = lower.indexOf(q, from)) > -1) {
        el.appendChild(document.createTextNode(text.slice(from, idx)));
        var strong = document.createElement('strong');
        strong.textContent = text.slice(idx, idx + q.length);
        el.appendChild(strong);
        from = idx + q.length;
      }
      el.appendChild(document.createTextNode(text.slice(from)));
    }

    function render(list, rawq) {
      results.innerHTML = '';
      active = -1;
      if (!list.length) {
        results.hidden = true;
        empty.hidden = false;
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      empty.hidden = true;

      var resultsFor = input.getAttribute('result-for-label') || 'Results for';
      var head = document.createElement('li');
      head.className = 'kb-search__results-head';
      head.setAttribute('role', 'presentation');
      head.textContent = resultsFor + ' „' + rawq + '“';
      results.appendChild(head);

      list.forEach(function (it) {
        var li = document.createElement('li');
        li.className = 'kb-search__result';
        li.setAttribute('role', 'option');

        var a = document.createElement('a');
        a.className = 'kb-search__result-link';
        a.href = it.u;

        var title = document.createElement('span');
        title.className = 'kb-search__result-title';
        appendHighlighted(title, it.t, rawq);
        a.appendChild(title);

        if (it.c) {
          var path = document.createElement('span');
          path.className = 'kb-search__result-path';
          path.textContent = it.c;
          a.appendChild(path);
        }

        li.appendChild(a);
        results.appendChild(li);
      });
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function search(q) {
      var fq = fold(q.trim());
      if (fq.length < minChars) {
        close();
        return;
      }
      // rank: title starts-with > title contains > keyword-only match
      var starts = [];
      var titleHits = [];
      var keywordHits = [];
      for (var i = 0; i < index.length; i++) {
        var it = index[i];
        var ti = it._t.indexOf(fq);
        if (ti === 0) {
          starts.push(it);
        } else if (ti > 0) {
          titleHits.push(it);
        } else if (it._h.indexOf(fq) > -1) {
          keywordHits.push(it);
        }
      }
      render(starts.concat(titleHits, keywordHits).slice(0, limit), q.trim());
    }

    function setActive(items) {
      for (var i = 0; i < items.length; i++) {
        var on = i === active;
        items[i].classList.toggle('is-active', on);
        items[i].setAttribute('aria-selected', on ? 'true' : 'false');
        if (on) items[i].scrollIntoView({ block: 'nearest' });
      }
    }

    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () { search(input.value); }, 120);
    });

    input.addEventListener('focus', function () {
      if (input.value.trim().length >= minChars) search(input.value);
    });

    input.addEventListener('keydown', function (e) {
      var items = results.querySelectorAll('.kb-search__result');
      if (e.key === 'ArrowDown') {
        if (!items.length) return;
        e.preventDefault();
        active = active + 1 >= items.length ? 0 : active + 1;
        setActive(items);
      } else if (e.key === 'ArrowUp') {
        if (!items.length) return;
        e.preventDefault();
        active = active <= 0 ? items.length - 1 : active - 1;
        setActive(items);
      } else if (e.key === 'Enter') {
        var chosen = active > -1 && items[active] ? items[active] : items[0];
        var link = chosen ? chosen.querySelector('a') : null;
        if (link) {
          e.preventDefault();
          window.location.href = link.href;
        }
      } else if (e.key === 'Escape') {
        close();
        input.blur();
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = results.querySelector('.kb-search__result a');
      if (first) window.location.href = first.href;
    });

    document.addEventListener('click', function (e) {
      if (!box.contains(e.target)) close();
    });
  }

  document.querySelectorAll('[data-kb-search]').forEach(initBox);
})();
