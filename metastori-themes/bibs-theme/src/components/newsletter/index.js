
document.addEventListener('DOMContentLoaded', async () => {
  const newsletters = document.querySelectorAll('[data-newsletter]');
  newsletters.forEach((newsletter) => {
    const form = newsletter.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData);
      console.log('🚀 ~ data:', data);

      if (!data.email || !data.name) {
        if (!data.name) {
          const nameElement = newsletter.querySelector('#newsletter-name');
          if (nameElement) nameElement.style.border = '1px solid red';
        }
        if (!data.email) {
          const emailElement = newsletter.querySelector('#newsletter-email');
          if (emailElement) emailElement.style.border = '1px solid red';
        }
        return;
      }

      try {
        const domain = window.Shopify?.shop || window.shop?.domain || null;
        if (!domain) throw new Error("Missing shop domain");

        const res = await fetch(
          `https://bibsapi.netlify.app/.netlify/functions/createKlaviyoProfile?store=${encodeURIComponent(domain)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              email: data.email,
              name: data.name,
              market: data.market,
            }),
          }
        );

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          throw new Error(`createKlaviyoProfile failed: ${res.status} ${res.statusText} ${errText}`);
        }

        const content = newsletter.querySelector("#newsletter-content");
        const success = newsletter.querySelector("#newsletter-success");
        if (content) content.style.display = "none";
        if (success) success.style.display = "flex";
        return true;
      } catch (error) {
        console.log(error);
        return;
      }
    });
  });
});

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobile()) {
  const inputs = document.querySelectorAll('input[name="name"], input[name="email"]');
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  });
}