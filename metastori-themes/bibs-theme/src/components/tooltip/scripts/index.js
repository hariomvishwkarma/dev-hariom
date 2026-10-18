import { createPopper } from '@popperjs/core';

function createPopperInstance(triggerEl, targetEl) {
  return createPopper(triggerEl, targetEl, {
    placement: triggerEl.dataset.tooltipPlacement || 'bottom',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 2],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          altAxis: true,
          padding: 10,
        },
      },
    ],
  });
}

function buildTooltip(trigger) {
  const tooltip = document.createElement('div');

  tooltip.classList.add('invisible', 'opacity-0');
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('inert', true);
  tooltip.innerHTML = trigger.dataset.tooltip;

  const noArrows = trigger.dataset.noArrows;

  if (!noArrows) {
    const arrow = document.createElement('div');
    arrow.setAttribute('data-popper-arrow', '');

    tooltip.appendChild(arrow);
  }
  trigger.appendChild(tooltip);
  return tooltip;
}

function displayTooltip(e, popperInstance) {
  const trigger = e.target;
  const tooltip = trigger.querySelector('[role=tooltip]');

  popperInstance.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      {
        name: 'eventListeners',
        enabled: true,
      },
    ],
  }));

  popperInstance.update();

  tooltip.classList.remove('invisible', 'opacity-0');
}

function hideTooltip(e, popperInstance) {
  const tooltip = e.target.querySelector('[role=tooltip]');

  popperInstance.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      {
        name: 'eventListeners',
        enabled: false,
      },
    ],
  }));

  tooltip.classList.add('invisible', 'opacity-0');
}

export function initTooltip() {
  if (window.theme.settings.disable_tooltips) return;
  const tooltips = Array.from(document.querySelectorAll('[data-tooltip]'));
  const DELAY = 0;
  let tooltipTimer = null;

  tooltips.forEach((trigger) => {
    const tooltip = buildTooltip(trigger);
    const popperInstance = createPopperInstance(trigger, tooltip);

    trigger.addEventListener('mouseenter', (e) => {
      clearTimeout(tooltipTimer);

      tooltipTimer = setTimeout(() => {
        displayTooltip(e, popperInstance);
      }, DELAY);
    });

    trigger.addEventListener('mouseleave', (e) => {
      clearTimeout(tooltipTimer);
      hideTooltip(e, popperInstance);
    });
  });
}

initTooltip();
