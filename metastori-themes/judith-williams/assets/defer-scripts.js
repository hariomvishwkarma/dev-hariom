(function () {
  var blockedResources = [
    { "src": "bambuser" },
    { "src": "smile.io" },
  ];
  
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        var addedNodes = Array.from(mutation.addedNodes);
        if(window.scriptsDeffered) {
          addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'SCRIPT') {
                if (shouldBlockResource(node, blockedResources)) {
                  node.setAttribute('defer', '');
                }
              }
            }
          });
        } else {
          addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'SCRIPT') {
                if (shouldBlockResource(node, blockedResources)) {
                  node.setAttribute('data-src', node.src);
                  node.src = '';
                }
              } else if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
                if (shouldBlockResource(node, blockedResources)) {
                  node.setAttribute('data-href', node.href);
                  node.media = 'print';
                  node.href = '';
                }
              } else if (node.tagName === 'IFRAME') {
                if (shouldBlockResource(node, blockedResources)) {
                  node.setAttribute('data-src', node.src);
                  node.src = '';
                }
              }
            }
          });
        }
      }
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  // Funktion zum Blockieren von Ressourcen basierend auf den Blockierungskriterien
  function blockAndReloadResources(blockedResources) {
    // Blockieren von Scripten
    var scripts = document.querySelectorAll('script');
    scripts.forEach(function (script) {
      if (shouldBlockResource(script, blockedResources)) {
        script.setAttribute('data-src', script.src);
        script.src = '';
      }
    });
    var stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(function (stylesheet) {
      if (shouldBlockResource(stylesheet, blockedResources)) {
        stylesheet.setAttribute('data-href', stylesheet.href);
        stylesheet.media = 'print';
        stylesheet.href = '';
      }
    });
    var iframes = document.querySelectorAll('iframe');
    iframes.forEach(function (iframe) {
      if (shouldBlockResource(iframe, blockedResources)) {
        iframe.setAttribute('data-src', iframe.src);
        iframe.src = '';
      }
    });
  }
  
  // Funktion zum Überprüfen, ob eine Ressource blockiert werden soll
  function shouldBlockResource(resource, blockedResources) {
    for (var i = 0; i < blockedResources.length; i++) {
      var blockedResource = blockedResources[i];
      for (var key in blockedResource) {
        if (resource[key] && resource[key].indexOf(blockedResource[key]) !== -1) {
          return true;
        }
      }
    }
    return false;
  }
  
  // Funktion zum Nachladen von blockierten Ressourcen
  function reloadBlockedResources() {
    window.scriptsDeffered = true;

    var blockedScripts = document.querySelectorAll('script[data-src]');
    blockedScripts.forEach(function (script) {
      script.src = script.getAttribute('data-src');
      script.removeAttribute('data-src');
      script.setAttribute('defer', '');
    });
  
    var blockedStylesheets = document.querySelectorAll('link[rel="stylesheet"][data-href]');
    blockedStylesheets.forEach(function (stylesheet) {
      var newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = stylesheet.getAttribute('data-href') || stylesheet.href;
      newLink.media = 'print';
      newLink.onload = function() {
        this.media = 'all';
      };
      stylesheet.parentNode.removeChild(stylesheet);
      document.body.appendChild(newLink);
    });
  
    var blockedIframes = document.querySelectorAll('iframe[data-src]');
    blockedIframes.forEach(function (iframe) {
      iframe.src = iframe.getAttribute('data-src');
      iframe.removeAttribute('data-src');
    });
  }
  
  // Blockieren von Ressourcen
  blockAndReloadResources(blockedResources);
  
  // Nachladen der blockierten Ressourcen
  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      reloadBlockedResources();
    }, 1000);
  });
}());