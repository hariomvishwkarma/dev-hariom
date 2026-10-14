/**
 * Custom T-shirt page (pages/custom-tshirt.html)
 * ---------------------------------------------------------------------------
 *  - colour / size / quantity, price + savings, sticky mobile bar, size guide
 *  - lazy-loads the canvas engine (tshirt-customizer.js) when the designer is near the viewport
 *  - editor panel <-> engine wiring (layers, text controls, sliders), front/back tabs, thumbnails
 *  - draft saved in IndexedDB so a refresh keeps the design
 *  - order: validates, then shares the preview image + details to WhatsApp (Web Share on phones,
 *    download + wa.me link on desktop). No backend needed.
 *
 * Config lives on <main id="tee" data-price data-mrp data-whatsapp data-max-mb>.
 */
(function () {
  'use strict';

  var root = document.getElementById('tee');
  if (!root) return;

  var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '');
  var cfg = {
    price: +root.dataset.price || 0,
    mrp: +root.dataset.mrp || 0,
    whatsapp: (root.dataset.whatsapp || '').replace(/\D/g, ''),
    maxMb: +root.dataset.maxMb || 10,
    areas: { front: { x: 310, y: 252, w: 380, h: 480 }, back: { x: 290, y: 204, w: 420, h: 540 } },
    productionDays: 3, shipMin: 3, shipMax: 6
  };

  var $ = function (s, r) { return (r || root).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); };
  var debounce = function (fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; };
  var cssColor = (function () {
    var ctx = document.createElement('canvas').getContext('2d');
    return function (c) { ctx.fillStyle = '#cccccc'; ctx.fillStyle = c; return ctx.fillStyle; };
  })();
  var money = function (n) { return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n); };

  var els = {
    canvas: $('[data-tee-canvas]'), stage: $('[data-tee-stage]'), loading: $('[data-tee-loading]'),
    file: $('[data-tee-file]'), editor: $('[data-tee-editor]'), czErr: $('[data-tee-cz-error]'), czWarn: $('[data-tee-cz-warn]'),
    layers: $('[data-tee-layers]'), layersList: $('[data-tee-layers-list]'), errors: $('[data-tee-errors]'),
    success: $('[data-tee-success]'), successText: $('[data-tee-success-text]'), qty: $('[data-tee-qty]'),
    price: $('[data-tee-price]'), mrp: $('[data-tee-mrp]'), save: $('[data-tee-save]'),
    sticky: $('[data-tee-sticky]'), stickyPrice: $('[data-tee-sticky-price]'), stickySummary: $('[data-tee-sticky-summary]'),
    dialog: $('[data-tee-dialog]'), live: $('[data-tee-live]'), draft: $('[data-tee-draft]'), eta: $('[data-tee-eta]'),
    orderBtn: $('[data-tee-order]'), textErr: $('[data-tee-text-error]'), preview: $('[data-action="toggle-preview"]'),
    mini: $('[data-tee-mini]'), cta: $('[data-tee-cta]')
  };
  var state = { color: null, colorHex: '#ffffff', size: null, qty: 1, side: 'front', busy: false, busyAction: '' };
  var cz = null, czPromise = null, Cz = null;
  var announce = function (m) { els.live.textContent = ''; setTimeout(function () { els.live.textContent = m; }, 30); };
  var show = function (el, msg) { el.textContent = msg; el.hidden = !msg; };

  /* ----------------------------------------------------------- draft (IndexedDB) */
  var DB = {
    run: function (mode, fn) {
      return new Promise(function (res, rej) {
        if (!window.indexedDB) return rej();
        var r = indexedDB.open('baal-shakha-tee', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('drafts'); };
        r.onerror = function () { rej(r.error); };
        r.onsuccess = function () {
          var db = r.result, tx = db.transaction('drafts', mode), req = fn(tx.objectStore('drafts'));
          tx.oncomplete = function () { res(req && req.result); db.close(); };
          tx.onerror = tx.onabort = function () { rej(tx.error); db.close(); };
        };
      });
    },
    get: function () { return DB.run('readonly', function (s) { return s.get('draft'); }); },
    set: function (v) { return DB.run('readwrite', function (s) { return s.put(v, 'draft'); }); },
    del: function () { return DB.run('readwrite', function (s) { return s.delete('draft'); }); }
  };

  /* ----------------------------------------------------------- price / options */
  function updatePrice() {
    els.price.textContent = money(cfg.price);
    var sale = cfg.mrp > cfg.price;
    els.mrp.hidden = els.save.hidden = !sale;
    if (sale) {
      els.mrp.textContent = money(cfg.mrp);
      els.save.textContent = money(cfg.mrp - cfg.price) + ' की बचत (' + Math.round((cfg.mrp - cfg.price) * 100 / cfg.mrp) + '% छूट)';
    }
    els.stickyPrice.textContent = money(cfg.price * state.qty);
    els.stickySummary.textContent = state.size
      ? state.color + ' · ' + state.size + (state.qty > 1 ? ' · ' + state.qty + ' पीस' : '')
      : 'साइज़ चुनें';
  }
  function readOptions() {
    var c = $('input[name="tee-color"]:checked'), s = $('input[name="tee-size"]:checked');
    state.color = c ? c.value : null; state.colorHex = c ? cssColor(c.dataset.hex) : '#ffffff';
    state.size = s ? s.value : null;
    $$('[data-tee-opt]').forEach(function (fs) {
      var lab = $('[data-tee-opt-label]', fs), v = fs.dataset.teeOpt === 'color' ? state.color : state.size;
      if (v) lab.textContent = v; else lab.innerHTML = '<span class="tee-muted">चुनें</span>';
    });
    root.style.setProperty('--tee-shirt', state.colorHex);
    if (cz) cz.setColor(state.colorHex);
    updatePrice();
  }
  $$('[data-tee-opt] input').forEach(function (i) {
    i.addEventListener('change', function () { clearErrors(); readOptions(); saveDraft(); });
  });
  function setQty(n) {
    state.qty = Math.min(99, Math.max(1, parseInt(n, 10) || 1)); els.qty.value = state.qty; updatePrice();
  }
  els.qty.addEventListener('change', function () { setQty(els.qty.value); });

  /* ----------------------------------------------------------- messages */
  function clearErrors() {
    els.errors.hidden = true; els.errors.textContent = ''; els.success.hidden = true;
    var e = $('[data-tee-opt-error]'); e.hidden = true; e.textContent = '';
  }
  function czError(m) { show(els.czErr, m); if (m) show(els.czWarn, ''); }

  /* ================================================================ engine */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = res; s.onerror = function () { rej(new Error('load')); }; document.head.appendChild(s);
    });
  }
  function ready() {
    if (czPromise) return czPromise;
    czPromise = (window.CTPCustomizer ? Promise.resolve() : loadScript(BASE + 'tshirt-customizer.js')).then(boot).catch(function (e) {
      czPromise = null; els.loading.hidden = true;
      czError('डिज़ाइनर लोड नहीं हो सका। इंटरनेट जाँचें और पेज रीफ़्रेश करें।');
      throw e;
    });
    return czPromise;
  }
  function boot() {
    Cz = window.CTPCustomizer;
    cz = new Cz({
      canvas: els.canvas, areas: cfg.areas, maxBytes: cfg.maxMb * 1048576,
      accent: (getComputedStyle(root).getPropertyValue('--tee-accent') || '#f97316').trim(),
      on: { select: onSelect, change: syncEditor, commit: onCommit, preview: onPreviewMode, side: syncSideUI }
    });
    var fsel = $('[data-ctrl="font"]');
    Cz.FONTS.forEach(function (f) { var o = document.createElement('option'); o.value = f.name; o.textContent = f.label; fsel.appendChild(o); });
    cz.setColor(state.colorHex);
    root.classList.add('is-ready'); els.loading.hidden = true;
    return restoreDraft().then(function () { updateThumbs(); syncSideUI(); renderLayers(); });
  }
  var kick = function () { ready().catch(function () {}); };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); kick(); } }, { rootMargin: '300px' });
    io.observe(els.stage);
  } else setTimeout(kick, 800);
  ['pointerdown', 'focusin', 'touchstart'].forEach(function (ev) { $('[data-tee-customizer]').addEventListener(ev, kick, { once: true, passive: true }); });

  /* ----------------------------------------------------------- sides + thumbs */
  $$('[data-tee-side], [data-tee-thumb]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.side = b.dataset.teeSide || b.dataset.teeThumb; syncSideUI();
      ready().then(function () { cz.setSide(state.side); }).catch(function () {});
    });
  });
  function syncSideUI() {
    var side = cz ? cz.side : state.side;
    $$('[data-tee-side]').forEach(function (b) { var on = b.dataset.teeSide === side; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
    $$('[data-tee-thumb]').forEach(function (b) { b.classList.toggle('is-active', b.dataset.teeThumb === side); });
    ['front', 'back'].forEach(function (s) { var d = $('[data-tee-dot="' + s + '"]'); if (d) d.hidden = !(cz && cz.hasDesign(s)); });
  }
  var updateThumbs = debounce(function () {
    if (!cz) return;
    ['front', 'back'].forEach(function (s) {
      var img = $('[data-tee-thumb-img="' + s + '"]');
      if (img) img.src = cz.exportCanvas(s, 200, '#ebe6de').toDataURL('image/jpeg', .72);
    });
  }, 350);

  /* ----------------------------------------------------------- mini preview (phones) */
  var miniImg = els.mini.querySelector('img'), stageVisible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { stageVisible = e[0].isIntersecting; refreshMini(); }, { threshold: 0.05 }).observe(els.stage);
  }
  els.mini.addEventListener('click', function () { els.stage.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
  var drawMini = debounce(function () {
    if (cz && !els.mini.hidden) miniImg.src = cz.exportCanvas(cz.side, 220, '#ebe6de').toDataURL('image/jpeg', .7);
  }, 120);
  function refreshMini() {
    var any = cz && (cz.hasDesign('front') || cz.hasDesign('back'));
    els.mini.hidden = stageVisible || !any || window.innerWidth >= 900;
    if (!els.mini.hidden) drawMini();
  }
  window.addEventListener('resize', debounce(refreshMini, 200));

  /* ----------------------------------------------------------- editor panel */
  var ctrl = function (n) { return $('[data-ctrl="' + n + '"]'); };
  function setVal(el, v, suffix) {
    if (el.value !== String(v)) el.value = v;
    var out = el.parentNode.querySelector('output'); if (out) out.textContent = v + (suffix || '');
  }
  function syncEditor() {
    var o = cz && cz.selected();
    els.editor.hidden = !o;
    if (!o) return;
    var a = cz.areas[cz.side], isText = o.type === 'text';
    $('[data-tee-editor-title]').textContent = isText ? 'टेक्स्ट बदलें' : 'इमेज बदलें';
    $('[data-tee-group="text"]').hidden = !isText;
    $('[data-tee-size-text]').hidden = !isText;
    $('[data-tee-size-image]').hidden = isText;
    if (isText) {
      if (document.activeElement !== ctrl('text')) ctrl('text').value = o.text;
      ctrl('font').value = o.font; ctrl('color').value = cssColor(o.color);
      ctrl('bold').setAttribute('aria-pressed', !!o.bold); ctrl('italic').setAttribute('aria-pressed', !!o.italic);
      $$('[data-align]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.align === o.align); });
      $$('[data-color]').forEach(function (b) { b.classList.toggle('is-active', cssColor(b.dataset.color) === cssColor(o.color)); });
      setVal(ctrl('spacing'), o.spacing, '');
      setVal(ctrl('size'), Math.round(o.scale * Cz.TEXT_BASE), 'px');
    } else setVal(ctrl('scale'), Math.round(o.scale * 100), '%');
    setVal(ctrl('rot'), Math.round(o.rot), '°');
    setVal(ctrl('nx'), Math.round((o.x - a.x) / a.w * 100), '%');
    setVal(ctrl('ny'), Math.round((o.y - a.y) / a.h * 100), '%');
  }
  function layerLabel(o) {
    if (o.type === 'text') return 'टेक्स्ट: ' + (String(o.text).trim().slice(0, 18) || '(खाली)');
    var im = cz.images[o.imgId]; return 'इमेज: ' + (im ? im.name.slice(0, 18) : 'डिज़ाइन');
  }
  function renderLayers() {
    if (!cz) return;
    var list = cz.objects(), sel = cz.selected();
    els.layers.hidden = !list.length; els.layersList.textContent = '';
    list.forEach(function (o) {
      var on = sel && sel.id === o.id, b = document.createElement('button');
      b.type = 'button'; b.className = 'tee-layer' + (on ? ' is-active' : ''); b.dataset.id = o.id;
      b.setAttribute('role', 'option'); b.setAttribute('aria-selected', !!on);
      b.innerHTML = '<svg class="tee-i" aria-hidden="true"><use href="#tee-i-' + (o.type === 'text' ? 'text' : 'image') + '"/></svg>';
      var s = document.createElement('span'); s.textContent = layerLabel(o); b.appendChild(s); els.layersList.appendChild(b);
    });
  }
  els.layersList.addEventListener('click', function (e) {
    var b = e.target.closest('.tee-layer'); if (!b || !cz) return;
    if (cz.previewMode) cz.setPreview(false);
    cz.select(b.dataset.id);
  });
  function onSelect() { renderLayers(); syncEditor(); }
  function onCommit() {
    renderLayers(); syncSideUI(); updateThumbs(); saveDraft(); refreshMini();
    var t = cz.selected();
    show(els.textErr, t && t.type === 'text' && !String(t.text).trim() ? 'टेक्स्ट खाली नहीं हो सकता। कुछ लिखें या इस लेयर को हटाएँ।' : '');
    if (cz.hasDesign('front') || cz.hasDesign('back')) { czError(''); els.errors.hidden = true; }
  }
  function onPreviewMode() {
    els.preview.setAttribute('aria-pressed', cz.previewMode);
    els.preview.querySelector('span').textContent = cz.previewMode ? 'डिज़ाइन बदलें' : 'साफ़ प्रीव्यू';
  }
  els.editor.addEventListener('input', function (e) {
    var k = e.target.dataset.ctrl, v = e.target.value;
    if (!cz || !k) return;
    var map = {
      text: { text: v }, font: { font: v }, color: { color: v }, spacing: { spacing: +v },
      scale: { scale: v / 100 }, size: { size: +v }, rot: { rot: +v }, nx: { nx: v / 100 }, ny: { ny: v / 100 }
    };
    if (map[k]) cz.update(map[k]);
  });
  els.editor.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t || !cz) return;
    var o = cz.selected();
    if (t.dataset.ctrl === 'bold' && o) cz.update({ bold: !o.bold });
    else if (t.dataset.ctrl === 'italic' && o) cz.update({ italic: !o.italic });
    else if (t.dataset.align) cz.update({ align: t.dataset.align });
    else if (t.dataset.color) cz.update({ color: t.dataset.color });
  });

  /* ----------------------------------------------------------- actions */
  var actions = {
    upload: function () { czError(''); els.file.click(); },     // must stay synchronous (user gesture)
    'add-text': function () {
      czError('');
      ready().then(function () {
        if (cz.previewMode) cz.setPreview(false);
        cz.addText();
        var ta = ctrl('text'); setTimeout(function () { ta.focus(); ta.select(); }, 60);
      }).catch(function () {});
    },
    'delete-layer': function () { cz && cz.remove(); },
    'reset-layer': function () { cz && cz.reset(); },
    'centre-x': function () { cz && cz.centre('x'); },
    'centre-y': function () { cz && cz.centre('y'); },
    done: function () { if (cz) cz.setPreview(true); els.stage.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
    'toggle-preview': function () { if (cz) cz.setPreview(!cz.previewMode); },
    'clear-side': function () {
      if (cz && cz.objects().length && window.confirm('इस साइड का पूरा डिज़ाइन हटाएँ?')) cz.clearSide();
    },
    'qty-minus': function () { setQty(state.qty - 1); },
    'qty-plus': function () { setQty(state.qty + 1); },
    'size-guide': function () { if (els.dialog.showModal) els.dialog.showModal(); else els.dialog.setAttribute('open', ''); },
    'close-dialog': function () { if (els.dialog.close) els.dialog.close(); else els.dialog.removeAttribute('open'); },
    order: function () { order(); },
    download: function () { download(); }
  };
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-action]');
    if (!b || !root.contains(b)) return;
    var fn = actions[b.dataset.action];
    if (fn) { e.preventDefault(); fn(); }
  });
  $('[data-tee-form]').addEventListener('submit', function (e) { e.preventDefault(); order(); });
  els.dialog.addEventListener('click', function (e) { if (e.target === els.dialog) actions['close-dialog'](); });
  $$('[data-unit]', els.dialog).forEach(function (b) {
    b.addEventListener('click', function () {
      $('[data-tee-sizetable]').dataset.unit = b.dataset.unit;
      $$('[data-unit]', els.dialog).forEach(function (x) { var on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', on); });
    });
  });

  /* ----------------------------------------------------------- upload */
  function handleFile(file) {
    if (!file) return;
    czError(''); show(els.czWarn, '');
    ready().then(function () {
      if (cz.previewMode) cz.setPreview(false);
      return cz.addImage(file);
    }).then(function (r) {
      if (r.lowRes) show(els.czWarn, 'यह इमेज छोटी है, प्रिंट थोड़ा धुँधला आ सकता है। सबसे साफ़ नतीजे के लिए बड़ी इमेज चुनें।');
      announce('इमेज जुड़ गई। उसे टी-शर्ट पर खींचकर सही जगह रखें।');
    }).catch(function (err) { czError(err && err.code ? translate(err) : 'अपलोड नहीं हो सका। कृपया दूसरी इमेज के साथ दोबारा कोशिश करें।'); });
  }
  // engine messages are English; show Hindi to visitors
  function translate(err) {
    var m = { type: 'यह फ़ाइल प्रकार समर्थित नहीं है। कृपया PNG, JPG या WEBP इमेज अपलोड करें।',
      empty: 'यह फ़ाइल खाली लगती है। कृपया दूसरी इमेज चुनें।',
      size: 'इमेज बहुत बड़ी है। कृपया ' + cfg.maxMb + ' MB से छोटी इमेज अपलोड करें।',
      decode: 'हम यह इमेज पढ़ नहीं सके। फ़ाइल खराब हो सकती है या आपका ब्राउज़र इस फ़ॉर्मेट को सपोर्ट नहीं करता।' };
    return m[err.code] || err.message;
  }
  els.file.addEventListener('change', function () { handleFile(els.file.files[0]); els.file.value = ''; });
  var dz = $('[data-tee-dropzone]'), depth = 0;
  var hasFiles = function (e) { return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') > -1; };
  els.stage.addEventListener('dragenter', function (e) { if (hasFiles(e)) { e.preventDefault(); depth++; dz.hidden = false; } });
  els.stage.addEventListener('dragover', function (e) { if (hasFiles(e)) e.preventDefault(); });
  els.stage.addEventListener('dragleave', function () { if (--depth <= 0) { depth = 0; dz.hidden = true; } });
  els.stage.addEventListener('drop', function (e) { if (!hasFiles(e)) return; e.preventDefault(); depth = 0; dz.hidden = true; handleFile(e.dataTransfer.files[0]); });

  /* ----------------------------------------------------------- sticky bar + ETA */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      var hide = e[0].isIntersecting;
      els.sticky.classList.toggle('is-visible', !hide); els.sticky.setAttribute('aria-hidden', hide);
      $$('button', els.sticky).forEach(function (b) { b.tabIndex = hide ? -1 : 0; });
    }, { threshold: 0.2 }).observe(els.orderBtn);
  }
  (function eta() {
    var add = function (n) { var d = new Date(); while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) n--; } return d; };
    var f = function (d) { return d.toLocaleDateString('hi-IN', { weekday: 'short', day: 'numeric', month: 'short' }); };
    els.eta.textContent = f(add(cfg.productionDays + cfg.shipMin)) + ' – ' + f(add(cfg.productionDays + cfg.shipMax));
  })();

  /* ----------------------------------------------------------- draft */
  var saveDraft = debounce(function () {
    if (!cz) return;
    var has = cz.hasDesign('front') || cz.hasDesign('back');
    var p = has ? DB.set({ ts: Date.now(), state: cz.serialize(), blobs: cz.imageBlobs(), side: cz.side, color: state.color, size: state.size }) : DB.del();
    p.then(function () { els.draft.hidden = !has; els.draft.textContent = 'ड्राफ़्ट इस डिवाइस पर सेव है'; }, function () {});
  }, 700);
  function restoreDraft() {
    return DB.get().then(function (d) {
      if (!d || Date.now() - d.ts > 7 * 864e5) return;
      return cz.hydrate(d.state, d.blobs).then(function () {
        [['color', d.color], ['size', d.size]].forEach(function (p) {
          var i = $$('input[name="tee-' + p[0] + '"]').filter(function (x) { return x.value === p[1]; })[0]; if (i) i.checked = true;
        });
        readOptions();
        if (d.side && d.side !== 'front') cz.setSide(d.side);
        els.draft.hidden = false; els.draft.textContent = 'आपका पिछला डिज़ाइन वापस लाया गया';
      });
    }).catch(function () {});
  }

  /* ================================================================= order */
  function validate() {
    var errs = [];
    if (!state.color) errs.push({ msg: 'कृपया रंग चुनें।', el: $('[data-tee-opt="color"]') });
    if (!state.size) {
      var e = $('[data-tee-opt-error]'); e.textContent = 'कृपया साइज़ चुनें।'; e.hidden = false;
      errs.push({ msg: 'कृपया साइज़ चुनें।', el: $('[data-tee-opt="size"]') });
    }
    var any = cz && (cz.hasDesign('front') || cz.hasDesign('back'));
    if (!any) errs.push({ msg: 'पहले अपना डिज़ाइन जोड़ें: इमेज अपलोड करें या टेक्स्ट लिखें।', el: $('[data-tee-customizer]') });
    if (cz) {
      var empty = cz.emptyTexts();
      if (empty.length) {
        errs.push({ msg: (empty[0].side === 'front' ? 'आगे' : 'पीछे') + ' की साइड पर एक टेक्स्ट खाली है। कुछ लिखें या उसे हटाएँ।', el: $('[data-tee-customizer]') });
        if (cz.side !== empty[0].side) cz.setSide(empty[0].side);
        cz.select(empty[0].id);
      }
    }
    return errs;
  }
  function showErrors(errs) {
    els.errors.textContent = '';
    errs.forEach(function (e) { var p = document.createElement('p'); p.textContent = e.msg; els.errors.appendChild(p); });
    els.errors.hidden = false;
    var t = errs[0].el || els.errors, top = t.getBoundingClientRect().top;
    if (top < 80 || top > innerHeight - 160) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
    var inp = t.tagName === 'FIELDSET' && t.querySelector('input:not(:disabled)'); if (inp) inp.focus({ preventScroll: true });
    announce(errs[0].msg);
  }
  function setBusy(on, action, label) {
    state.busy = on; state.busyAction = action;
    $$('[data-action="order"], [data-action="download"]').forEach(function (b) {
      var mine = b.dataset.action === action, l = b.querySelector('.tee-btn__label');
      b.disabled = on; b.classList.toggle('is-busy', on && mine);
      if (!l.dataset.t) l.dataset.t = l.textContent;
      l.textContent = on && mine ? label : l.dataset.t;
    });
  }
  function sideName(s) { return s === 'front' ? 'आगे' : 'पीछे'; }
  function summaryText() {
    var d = cz.serialize(), lines = ['नमस्ते Baal Shakha! मुझे कस्टम टी-शर्ट ऑर्डर करनी है:', '',
      '• रंग: ' + state.color, '• साइज़: ' + state.size, '• मात्रा: ' + state.qty,
      '• कीमत: ' + money(cfg.price) + ' × ' + state.qty + ' = ' + money(cfg.price * state.qty)];
    ['front', 'back'].forEach(function (s) {
      if (!d.sides[s].length) return;
      var bits = d.sides[s].map(function (o) {
        if (o.type === 'text') return 'टेक्स्ट "' + o.text.replace(/\n/g, ' ') + '" (' + o.font + ')';
        return 'इमेज (' + ((d.images[o.imgId] || {}).name || 'डिज़ाइन') + ')';
      });
      lines.push('• ' + sideName(s) + ': ' + bits.join(' + '));
    });
    lines.push('', 'डिज़ाइन का प्रीव्यू साथ में भेज रहा/रही हूँ।');
    return lines.join('\n');
  }
  function sidesWithDesign() { return ['front', 'back'].filter(function (s) { return cz.hasDesign(s); }); }
  function previewFile() {
    return cz.toBlob(cz.exportComposite(sidesWithDesign(), 1400, '#ebe6de'), 'image/png').then(function (b) {
      return new File([b], 'tshirt-design-preview.png', { type: 'image/png' });
    });
  }
  function saveBlob(file) {
    var a = document.createElement('a'), u = URL.createObjectURL(file);
    a.href = u; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
  }
  function waUrl(text) { return 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(text); }
  function done(msg, link) {
    els.successText.textContent = msg; els.success.hidden = false;
    var old = $('a', els.success); if (old) old.remove();
    if (link) { var a = document.createElement('a'); a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = 'WhatsApp खोलें'; els.success.appendChild(a); }
    announce(msg);
  }

  function order() {
    if (state.busy) return;
    clearErrors();
    var errs = validate();
    if (errs.length) return showErrors(errs);
    setBusy(true, 'order', 'तैयार हो रहा है…');
    var text = summaryText(), imgs = cz.imageBlobs();
    previewFile().then(function (pf) {
      var files = [pf];
      Object.keys(imgs).forEach(function (id) { var b = imgs[id]; files.push(b instanceof File ? b : new File([b], (cz.images[id] || {}).name || id, { type: b.type })); });
      var canShare = navigator.canShare && navigator.canShare({ files: files });
      if (canShare) {
        return navigator.share({ files: files, text: text, title: 'कस्टम टी-शर्ट ऑर्डर' }).then(function () {
          done('धन्यवाद! WhatsApp में Baal Shakha को चुनकर भेजें।');
        }, function (e) { if (e && e.name !== 'AbortError') throw e; });
      }
      saveBlob(pf);                                    // desktop: attach it manually in the chat
      var url = waUrl(text + '\n\n(कृपया "tshirt-design-preview.png" फ़ाइल चैट में जोड़ें)');
      window.open(url, '_blank', 'noopener');
      done('प्रीव्यू डाउनलोड हो गया है। WhatsApp चैट में उसे अटैच करके भेजें।', url);
    }).catch(function () {
      els.errors.textContent = 'ऑर्डर तैयार नहीं हो सका। कृपया दोबारा कोशिश करें।'; els.errors.hidden = false;
    }).then(function () { setBusy(false, ''); });
  }
  function download() {
    if (state.busy) return;
    clearErrors();
    if (!cz || !(cz.hasDesign('front') || cz.hasDesign('back'))) {
      return showErrors([{ msg: 'डाउनलोड के लिए पहले अपना डिज़ाइन जोड़ें।', el: $('[data-tee-customizer]') }]);
    }
    setBusy(true, 'download', 'तैयार हो रहा है…');
    previewFile().then(function (f) { saveBlob(f); done('प्रीव्यू डाउनलोड हो गया।'); })
      .catch(function () { els.errors.textContent = 'प्रीव्यू बन नहीं सका। कृपया दोबारा कोशिश करें।'; els.errors.hidden = false; })
      .then(function () { setBusy(false, ''); });
  }

  /* ----------------------------------------------------------- start */
  readOptions();
})();
