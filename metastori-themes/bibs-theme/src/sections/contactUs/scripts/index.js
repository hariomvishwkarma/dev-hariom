const contactUsForm = document.querySelector('#dixa-contact-form');

if (contactUsForm) {
  contactUsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactUsForm);

  const subjectData = formData.get('subject_data');
  if (!subjectData) return;
  const subjectSplitted = subjectData.split('_');
  if (subjectSplitted.length < 1) return;
  const subject = subjectSplitted[0] || 'Subject';
  const formUrl = subjectSplitted[1] || 'https://forms.dixa.io/v2/forms/1ET0avNzO6hPuuLGjv2NmS/66MajPgvDod5Q5NNAKLeoV';

  formData.append('subject', subject);

  fetch(formUrl, { method: 'POST', body: formData })
    .then((r) => r.json())
    .then((v) => {
      if (v.csid) {
        contactUsForm.classList.add('hidden');
        document.querySelector('[data-success')?.classList.remove('hidden');
      }
    })
    .catch((e) => console.error('An error has occurred :(', e));
  });
}
