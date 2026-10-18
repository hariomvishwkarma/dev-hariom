const sizeChartContent = document.getElementById('size-chart-data')?.textContent;
let sizeChartData = "";
if (sizeChartContent) sizeChartData = JSON.parse(sizeChartContent);
const sizeChartButton = document.getElementById('size-chart-button');

const currentProductSizeData = findProductSizeData();
const table = document.getElementById('size-chart-table');
const currentVariant = getCurrentVariant();
let originalSizeUnit = '';
let sizeUnitPlacements = {};

if (currentProductSizeData && table) {
  buildHead();
  buildVariantUnitButtons();
  buildBody();
  highlightCurrentVariant(currentVariant);
}

if (!currentProductSizeData && sizeChartButton) {
  sizeChartButton.style.display = 'none';
}

const drawer = document.querySelector("[data-component-id='size-chart-drawer']");
if (drawer) {
  drawer.addEventListener('drawer-opened', function (event) {
    const currentVariant = getCurrentVariant();
    highlightCurrentVariant(currentVariant);
  });
}

function findProductType() {
  const sizeChartContainer = document.getElementById('size-chart-container');
  const productType = sizeChartContainer.getAttribute('data-product-type')?.toLowerCase();
  const productTypeExtension = sizeChartContainer.getAttribute('data-product-type-extension')?.toLowerCase();

  if (productType && productTypeExtension) {
    return `${productType}_${productTypeExtension}`;
  }

  return productType;
}

function findProductSizeData() {
  const sizeChartContainer = document.getElementById('size-chart-container');
  if (!sizeChartContainer) return;
  const vendor = sizeChartContainer.getAttribute('data-vendor')?.toLowerCase();
  const productType = findProductType();

  let gender = sizeChartContainer.getAttribute('data-gender')?.toLowerCase();

  try {
    if (vendor && productType && gender) {
      let currentProductSizeData = false;
      const productTypeBase = productType.split("_")[0];
      const vendorData = sizeChartData[vendor];

      if (vendorData) {
        const productTypeData = vendorData[productType] || vendorData[productTypeBase];

        if (productTypeData && productTypeData[gender]) {
          currentProductSizeData = productTypeData[gender];
        }
      }

      return currentProductSizeData;
    }
  } catch (error) {
    console.log('🚀 ~ error:', error);
    return null;
  }
}

function sortProductSizeData(data) {
  //check if datakeys include slashes
  let includesSlashes = false;
  for (key in data) {
    if (key.toLowerCase().includes('input') == false) {
      if (key != '' && key.toLowerCase().includes('/')) {
        includesSlashes = true;
      }
    }
  }

  // converting the size keys to floats so we can sort them if none of the keys include slashes
  let dataWithIntKeys = {};
  for (key in data) {
    if (key != '' && key.toLowerCase().includes('input') == false && key != undefined) {
      let intKey;
      if (!includesSlashes) {
        intKey = parseFloat(key);
      } else {
        intKey = key;
      }
      let intKeyData = { [intKey]: key };
      Object.assign(dataWithIntKeys, intKeyData);
    }
  }

  const numericKeys = Object.keys(dataWithIntKeys).filter((key) => key !== '');
  const sortedNumericKeys = numericKeys.sort((a, b) => parseFloat(a) - parseFloat(b));
  return sortedNumericKeys;
}

function buildHead() {
  const headers = getHeader(currentProductSizeData);
  const thead = table.querySelector('thead tr');

  for (let i = 0; i < headers.length; i++) {
    const th = document.createElement('th');
    th.textContent = headers[i];
    thead.appendChild(th);
  }
}

function buildBody() {
  const body = getBody(currentProductSizeData);
  const tbody = table.querySelector('tbody');

  for (const row of body) {
    if (!row) continue;
    const newRow = document.createElement('tr');

    for (const cell of row) {
      const td = document.createElement('td');
      td.textContent = cell;
      newRow.appendChild(td);
    }
    tbody.appendChild(newRow);
  }
}

function getHeader(currentProductSizeData) {
  for (let key in currentProductSizeData) {
    if (key.toLowerCase().includes('input')) {
      originalSizeUnit = key.toUpperCase().replace('INPUT_', '');
      return currentProductSizeData[key];
    }
  }
  return null; // or whatever default/fallback value you want
}

function getBody(currentProductSizeData) {
  const sorted_array = sortProductSizeData(currentProductSizeData);
  const array = sorted_array.map((key) => {
    return currentProductSizeData[key];
  })
  return array;
}

function highlightCurrentVariant(currentVariant) {
  const tbody = table.querySelector('tbody');

  for (const row of tbody.rows) {
    row.classList.remove('highlight');
    const firstCell = row.cells[0]?.textContent;

    if (firstCell === currentVariant) {
      row.classList.add('highlight');
    }
  }
}

function getCurrentVariant() {
  const radioButtons = document.getElementsByName('Size');
  let selectedValue;
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      selectedValue = radioButtons[i].value;
      break;
    }
  }

  return selectedValue;
}

function buildVariantUnitButtons() {
  const headers = getHeader(currentProductSizeData);
  const sizeUnitSelectorWrapper = document.querySelector('.size-unit-selector-wrapper');

  for (let i = 0; i < headers.length; i++) {
    if (!headers[i].toLowerCase().includes('input')) {
      const button = document.createElement('div');
      button.textContent = headers[i];
      button.classList.add('product-sizes__size');
      button.dataset.active = false;
      button.dataset.size = headers[i];
      if (i > 1) {
        const divider = document.createElement('span');
        divider.classList.add('divider');
        sizeUnitSelectorWrapper.appendChild(divider);
      }
      sizeUnitPlacements[headers[i]] = i;
      sizeUnitSelectorWrapper.appendChild(button);
    }
  }

  document.querySelectorAll('.product-sizes__size').forEach((elm) => {
    const unit = elm.dataset.size;
    elm.addEventListener('click', () => {
      selectSizeUnit(unit);
    });
  });

  selectSizeUnit(Object.keys(sizeUnitPlacements)[0]);
}

function selectSizeUnit(selectedSizeUnit) {
  document.querySelectorAll('.product-sizes__size').forEach((elm) => {
    elm.dataset.active = false;
  });
  document.querySelector('.product-sizes__size[data-size="' + selectedSizeUnit + '"]').dataset.active = true;

  changeVariantUnits(selectedSizeUnit, sizeUnitPlacements);
}

function changeVariantUnits(selectedSizeUnit, sizeUnitPlacements) {
  let unitIndex = sizeUnitPlacements[selectedSizeUnit];

  document.querySelectorAll('.size-variants label').forEach((label) => {
    const oriSize = label.dataset.originalSize;
    if (currentProductSizeData[oriSize]) {
      label.innerText = currentProductSizeData[oriSize][unitIndex];
    }
  });
}
