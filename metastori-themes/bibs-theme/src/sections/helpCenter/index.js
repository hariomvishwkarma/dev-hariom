(function () {
  function initSection(wrapper) {
    var SECTION_ID = wrapper.dataset.sectionId;
    var ROOT_URL = wrapper.dataset.rootUrl || '/';
    if (!SECTION_ID) return;

    var searchInput = document.getElementById('hc-faq-search-' + SECTION_ID);
    var categoryListEl = document.getElementById('hc-faq-categories-' + SECTION_ID);
    var contentEl = document.getElementById('hc-faq-content-' + SECTION_ID);
    var emptyEl = document.getElementById('hc-faq-empty-' + SECTION_ID);
    var breadcrumbEl = document.getElementById('hc-faq-breadcrumb-' + SECTION_ID);
    var mobileTarget = document.getElementById('hc-faq-mobile-breadcrumb-target-' + SECTION_ID);

    var categoryItems = categoryListEl ? categoryListEl.querySelectorAll('.hc-faq-sidebar__item') : [];
    var panels = contentEl ? contentEl.querySelectorAll('.hc-faq-content__panel') : [];
    var allQuestionLinks = contentEl ? contentEl.querySelectorAll('.hc-faq-question-link') : [];

    var currentCategory = categoryItems.length > 0 ? categoryItems[0].getAttribute('data-category') : '';
    var currentSearchQuery = '';
    var inDetailView = false;

    /* ===== BREADCRUMB REPOSITIONING ===== */
    function repositionBreadcrumb() {
      if (!breadcrumbEl) return;
      var isMobile = window.innerWidth < 990;
      if (isMobile) {
        if (mobileTarget && breadcrumbEl.parentNode !== mobileTarget) {
          mobileTarget.appendChild(breadcrumbEl);
        }
      } else {
        var activePanel = contentEl.querySelector('[data-panel="' + currentCategory + '"]');
        if (activePanel) {
          var desktopTarget = activePanel.querySelector('.hc-faq-desktop-breadcrumb-target');
          if (desktopTarget && breadcrumbEl.parentNode !== desktopTarget) {
            desktopTarget.appendChild(breadcrumbEl);
          }
        }
      }
    }

    /* ===== VIEW HELPERS ===== */
    function showListView(panelHandle) {
      inDetailView = false;
      var panel = contentEl.querySelector('[data-panel="' + panelHandle + '"]');
      if (!panel) return;

      var questionList = panel.querySelector('[data-questions-list]');
      if (questionList) questionList.style.display = '';

      var heading = panel.querySelector('.hc-faq-content__heading');
      if (heading) heading.style.display = '';

      var sub_heading = panel.querySelector('.hc-faq-content__description');
      if (sub_heading) sub_heading.style.display = '';

      var details = panel.querySelectorAll('.hc-faq-detail');
      details.forEach(function (d) {
        d.classList.remove('hc-faq-detail--visible');
      });

      updateBreadcrumb(panelHandle, panel.getAttribute('data-panel-label'), null);
    }

    function showDetailView(panelHandle, faqHandle) {
      inDetailView = true;
      var panel = contentEl.querySelector('[data-panel="' + panelHandle + '"]');
      if (!panel) return;

      var questionList = panel.querySelector('[data-questions-list]');
      if (questionList) questionList.style.display = 'none';

      var heading = panel.querySelector('.hc-faq-content__heading');
      if (heading) heading.style.display = 'none';

      var sub_heading = panel.querySelector('.hc-faq-content__description');
      if (sub_heading) sub_heading.style.display = 'none';

      var details = panel.querySelectorAll('.hc-faq-detail');
      details.forEach(function (d) {
        d.classList.remove('hc-faq-detail--visible');
      });

      var targetDetail = panel.querySelector('[data-detail-handle="' + faqHandle + '"]');
      if (targetDetail) {
        targetDetail.classList.add('hc-faq-detail--visible');
        var title = targetDetail.querySelector('.hc-faq-detail__title');
        var titleText = title ? title.textContent : '';
        updateBreadcrumb(panelHandle, panel.getAttribute('data-panel-label'), titleText);
      }
    }

    var breadcrumbCurrentEl = breadcrumbEl ? breadcrumbEl.querySelector('[data-breadcrumb-current]') : null;
    var breadcrumbBackEl = breadcrumbEl ? breadcrumbEl.querySelector('[data-breadcrumb-back]') : null;
    var breadcrumbDetailSep = breadcrumbEl ? breadcrumbEl.querySelector('[data-breadcrumb-detail-sep]') : null;

    if (breadcrumbBackEl) {
      breadcrumbBackEl.addEventListener('click', function () {
        showListView(currentCategory);
      });
    }

    function updateBreadcrumb(panelHandle, categoryLabel, questionTitle) {
      if (!breadcrumbEl) return;

      if (questionTitle) {
        breadcrumbBackEl.textContent = categoryLabel;
        breadcrumbBackEl.classList.remove('hidden');
        breadcrumbDetailSep.classList.remove('hidden');
        breadcrumbCurrentEl.textContent = questionTitle;
      } else {
        breadcrumbBackEl.classList.add('hidden');
        breadcrumbDetailSep.classList.add('hidden');
        breadcrumbCurrentEl.textContent = categoryLabel;
      }
      repositionBreadcrumb();
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    function switchCategory(handle, label) {
      currentCategory = handle;
      categoryItems.forEach(function (item) {
        item.classList.remove('hc-faq-sidebar__item--active');
        if (item.getAttribute('data-category') === handle) {
          item.classList.add('hc-faq-sidebar__item--active');
        }
      });
      panels.forEach(function (panel) {
        if (panel.getAttribute('data-panel') === handle) {
          panel.classList.remove('hidden');
          showListView(handle);
        } else {
          panel.classList.add('hidden');
        }
      });
      if (emptyEl) emptyEl.classList.remove('hc-faq-empty--visible');
      if (currentSearchQuery) highlightQuestionsInPanel(handle, currentSearchQuery);
      repositionBreadcrumb();
    }

    categoryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var handle = item.getAttribute('data-category');
        var label = item.getAttribute('data-category-label');
        switchCategory(handle, label);
        if (currentSearchQuery) highlightAndFilterPanel(handle, currentSearchQuery.toLowerCase());
      });
    });

    allQuestionLinks.forEach(function (link) {
      function openDetail() {
        var handle = link.getAttribute('data-handle');
        var type = link.getAttribute('data-type');
        showDetailView(type, handle);
      }
      link.addEventListener('click', openDetail);
      link.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      });
    });

    var helpfulBtns = wrapper.querySelectorAll('.hc-faq-helpful__btn');
    helpfulBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var container = btn.closest('.hc-faq-helpful');
        if (!container) return;
        var siblings = container.querySelectorAll('.hc-faq-helpful__btn');
        siblings.forEach(function (s) {
          s.classList.remove('hc-faq-helpful__btn--selected');
        });
        btn.classList.add('hc-faq-helpful__btn--selected');
        var thanks = container.querySelector('.hc-faq-helpful__thanks');
        if (thanks) thanks.classList.add('hc-faq-helpful__thanks--visible');
      });
    });

    function clearHighlights() {
      var titles = contentEl.querySelectorAll('.hc-faq-question-link__title');
      titles.forEach(function (titleEl) {
        if (titleEl.querySelector('.hc-faq-highlight')) {
          titleEl.textContent = titleEl.textContent;
        }
      });
      categoryItems.forEach(function (item) {
        item.classList.remove('hc-faq-sidebar__item--search-match');
      });
    }

    function highlightText(element, query) {
      var text = element.textContent;
      var lowerText = text.toLowerCase();
      var lowerQuery = query.toLowerCase();
      var idx = lowerText.indexOf(lowerQuery);
      if (idx === -1) return;
      var before = text.substring(0, idx);
      var match = text.substring(idx, idx + query.length);
      var after = text.substring(idx + query.length);
      element.innerHTML =
        escapeHtml(before) + '<span class="hc-faq-highlight">' + escapeHtml(match) + '</span>' + escapeHtml(after);
    }

    function highlightQuestionsInPanel(panelHandle, query) {
      var panel = contentEl.querySelector('[data-panel="' + panelHandle + '"]');
      if (!panel) return;
      var links = panel.querySelectorAll('.hc-faq-question-link');
      links.forEach(function (link) {
        var titleEl = link.querySelector('.hc-faq-question-link__title');
        if (titleEl) {
          titleEl.textContent = titleEl.textContent;
          highlightText(titleEl, query);
        }
      });
    }

    function doSearch(query) {
      currentSearchQuery = query;
      clearHighlights();
      if (inDetailView) showListView(currentCategory);
      if (!query || query.trim() === '') {
        panels.forEach(function (panel) {
          var links = panel.querySelectorAll('.hc-faq-question-link');
          links.forEach(function (l) {
            l.style.display = '';
          });
        });
        switchCategory(currentCategory, getCurrentCategoryLabel());
        if (emptyEl) emptyEl.classList.remove('hc-faq-empty--visible');
        return;
      }
      var lowerQuery = query.trim().toLowerCase();
      var matchingCategories = new Set();
      allQuestionLinks.forEach(function (link) {
        var questionText = link.querySelector('.hc-faq-question-link__title').textContent.toLowerCase();
        var qType = link.getAttribute('data-type');
        var panel = contentEl.querySelector('[data-panel="' + qType + '"]');
        var detail = panel
          ? panel.querySelector('[data-detail-handle="' + link.getAttribute('data-handle') + '"]')
          : null;
        var answerText = detail ? detail.querySelector('.hc-faq-detail__body').textContent.toLowerCase() : '';
        if (questionText.indexOf(lowerQuery) !== -1 || answerText.indexOf(lowerQuery) !== -1) {
          matchingCategories.add(qType);
        }
      });
      categoryItems.forEach(function (item) {
        var cat = item.getAttribute('data-category');
        if (matchingCategories.has(cat)) {
          item.classList.add('hc-faq-sidebar__item--search-match');
        } else {
          item.classList.remove('hc-faq-sidebar__item--search-match');
        }
      });
      if (matchingCategories.has(currentCategory)) {
        highlightAndFilterPanel(currentCategory, lowerQuery);
        if (emptyEl) emptyEl.classList.remove('hc-faq-empty--visible');
      } else if (matchingCategories.size > 0) {
        var firstMatch = Array.from(matchingCategories)[0];
        var label = '';
        categoryItems.forEach(function (item) {
          if (item.getAttribute('data-category') === firstMatch) label = item.getAttribute('data-category-label');
        });
        switchCategory(firstMatch, label);
        highlightAndFilterPanel(firstMatch, lowerQuery);
        if (emptyEl) emptyEl.classList.remove('hc-faq-empty--visible');
      } else {
        panels.forEach(function (p) {
          p.classList.add('hidden');
        });
        if (emptyEl) emptyEl.classList.add('hc-faq-empty--visible');
      }
    }

    function highlightAndFilterPanel(panelHandle, lowerQuery) {
      var panel = contentEl.querySelector('[data-panel="' + panelHandle + '"]');
      if (!panel) return;
      var links = panel.querySelectorAll('.hc-faq-question-link');
      links.forEach(function (link) {
        var questionText = link.querySelector('.hc-faq-question-link__title').textContent.toLowerCase();
        var detail = panel.querySelector('[data-detail-handle="' + link.getAttribute('data-handle') + '"]');
        var answerText = detail ? detail.querySelector('.hc-faq-detail__body').textContent.toLowerCase() : '';
        if (questionText.indexOf(lowerQuery) !== -1 || answerText.indexOf(lowerQuery) !== -1) {
          link.style.display = '';
          var titleEl = link.querySelector('.hc-faq-question-link__title');
          if (titleEl) {
            titleEl.textContent = titleEl.textContent;
            highlightText(titleEl, currentSearchQuery);
          }
        } else {
          link.style.display = 'none';
        }
      });
    }

    function getCurrentCategoryLabel() {
      var label = '';
      categoryItems.forEach(function (item) {
        if (item.getAttribute('data-category') === currentCategory) label = item.getAttribute('data-category-label');
      });
      return label;
    }

    var searchTimeout;
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
          doSearch(searchInput.value);
        }, 250);
      });
    }

    function handleHash() {
      var hash = window.location.hash.replace('#', '');
      if (hash) {
        categoryItems.forEach(function (item) {
          if (item.getAttribute('data-category') === hash)
            switchCategory(hash, item.getAttribute('data-category-label'));
        });
      }
    }

    handleHash();
    window.addEventListener('hashchange', handleHash);

    /* Resize listener */
    window.addEventListener('resize', repositionBreadcrumb);
    repositionBreadcrumb();
  }

  function initAll() {
    document.querySelectorAll('.hc-faq-wrapper[data-section-id]').forEach(function (wrapper) {
      initSection(wrapper);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (e) {
      var wrapper = e.target.querySelector('.hc-faq-wrapper[data-section-id]');
      if (wrapper) initSection(wrapper);
    });
  }
})();
