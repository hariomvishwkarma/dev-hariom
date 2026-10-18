const qtyBtns = document.querySelectorAll('.btnqty');

qtyBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const btn = e.target
    const qty = btn.closest('.form-field-select-wrapper').querySelector('input.form-field-input')
    const masterQtyInput = document.querySelector('.master-input')

    if (btn.classList.contains('qtyplus')) {
      masterQtyInput.value = ++qty.value
    } else {
      if(qty.value > 1) {
        masterQtyInput.value = --qty.value
      }
    }
    qty.dispatchEvent(new Event('change'))
  })
})