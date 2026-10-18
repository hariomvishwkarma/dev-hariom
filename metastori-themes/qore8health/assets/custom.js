function injectShadowStyle() {
  const shadowHost = document.querySelector('#shadow-quiz');
  if (!shadowHost || !shadowHost.shadowRoot) return false;

  // dobara inject na ho
  if (shadowHost.shadowRoot.querySelector('#my-injected-style')) return true;

  const style = document.createElement('style');
  style.id = 'my-injected-style';
  style.textContent = `
    .content.results-content {
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
    }
    .result-bottom-bar__container {
        justify-content: center;
        background: transparent;
    }
    .results {
        overflow: hidden;
        margin-bottom: 30px;
    }
    .navigation-bar, .result-bottom-bar {
        bottom: 15px
    }
  `;
  shadowHost.shadowRoot.appendChild(style);
  return true;
}

// thodi der tak retry karo jab tak shadow root ready na ho
const timer = setInterval(() => {
  if (injectShadowStyle()) clearInterval(timer);
}, 300);

// safety: 15 sec baad band kardo
setTimeout(() => clearInterval(timer), 15000);
console.log(document.querySelector('#shadow-quiz').shadowRoot.innerHTML);