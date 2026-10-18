document.querySelector('#filter .icon-sort')?.addEventListener('click', toggleShowSort);
document.querySelector('#filter label[for=SortBy]')?.addEventListener('click', toggleShowSort);

function toggleShowSort() {
  document.querySelector('#filter .sort-by-wrap').classList.toggle('hidden');
}

document.querySelectorAll('#filter filter-search').forEach((filterSearchBar) => {
  filterSearchBar.addEventListener('input', () => {
    const filtername = filterSearchBar.dataset.filter;
    const searchTerm = filterSearchBar.querySelector('input').value;
    const listToBeFiltered = document.querySelector(`filter-search[data-filter="${filtername}"] + .facets__list`);

    listToBeFiltered.querySelectorAll('li').forEach((label) => {
      const labeltext = label.querySelector('span').innerText;
      if (labeltext.includes(searchTerm)) {
        label.classList.remove('hidden');
      } else {
        label.classList.add('hidden');
      }
    });
  });
});

window.addEventListener('DOMContentLoaded', function () {
  function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromSlider, toSlider, toSlider);
    if (from > to) {
      fromSlider.value = to;
      fromInput.value = to;
    } else {
      fromSlider.value = from;
    }
  }

  function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromSlider, toSlider, toSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
      toSlider.value = to;
      toInput.value = to;
    } else {
      toInput.value = from;
    }
  }

  function controlFromSlider(fromSlider, toSlider, fromInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, toSlider);
    if (fromSlider.value !== fromSlider.min) {
      if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
      } else {
        fromInput.value = from;
      }
    } else {
      fromInput.value = '';
    }
  }

  function controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, toSlider);
    setToggleAccessible(toSlider);
    if (toSlider.value !== toSlider.max) {
      if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
      } else {
        toInput.value = from;
        toSlider.value = from;
      }
    } else {
      toInput.value = '';
    }
  }

  function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }

  function fillSlider(from, to, controlSlider) {
    const rangeDistance = to?.max - to?.min;
    const fromPosition = from?.value - to?.min;
    const toPosition = to?.value - to?.min;
    const sliderColor = 'rgb(229, 229, 229, 0)';
    let rangeColor;
    window.innerWidth < 640 ? (rangeColor = '#FFFFFF') : (rangeColor = '#082D78');
    if (controlToSlider) {
      controlSlider.style.background = `linear-gradient(
        to right,
        ${sliderColor} 0%,
        ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
        ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
        ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
        ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
        ${sliderColor} 100%)`;
    }
  }

  function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector('#toSlider');
    if (Number(currentTarget.value) <= 0) {
      toSlider.style.zIndex = 2;
    } else {
      toSlider.style.zIndex = 0;
    }
  }

  function updateSliderText(fromSlider, toSlider) {
    const fromValue = fromSlider.value;
    const toValue = toSlider.value;
    const fromTextField = document.querySelector('#filter_price_min_show');
    const toTextField = document.querySelector('#filter_price_max_show');
    fromTextField.innerText = fromValue;
    toTextField.innerText = toValue;
  }

  if (document.querySelector('.range_container')) {
    const fromSlider = document.querySelector('#fromSlider');
    const toSlider = document.querySelector('#toSlider');

    const fromInput = document.querySelector('#filter_price_min');
    const toInput = document.querySelector('#filter_price_max');

    fillSlider(fromSlider, toSlider, toSlider);
    setToggleAccessible(toSlider);

    fromSlider.oninput = () => {
      controlFromSlider(fromSlider, toSlider, fromInput);
      updateSliderText(fromSlider, toSlider);
    };
    toSlider.oninput = () => {
      controlToSlider(fromSlider, toSlider, toInput);
      updateSliderText(fromSlider, toSlider);
    };
    fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
    toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);
  }
});
