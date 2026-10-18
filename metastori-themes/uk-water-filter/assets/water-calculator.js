document.addEventListener('DOMContentLoaded', function () {

  var $ = function(id) { return document.getElementById(id); };

  function safeEl(id) {
    return $(id) || null;
  }

  function safeAddEvent(id, event, cb) {
    var el = safeEl(id);
    if (el) el.addEventListener(event, cb);
  }

  function fmt(n) {
    return '£' + Math.round(Math.abs(n || 0)).toLocaleString('en-GB');
  }

  function fmtDay(n) {
    n = n || 0;
    return n < 1
      ? Math.round(n * 100) + 'p per day'
      : '£' + n.toFixed(2) + ' per day';
  }

  function setText(id, value) {
    var el = safeEl(id);
    if (el) el.textContent = value;
  }

  function setHTML(id, value) {
    var el = safeEl(id);
    if (el) el.innerHTML = value;
  }

  function setSliderBg(el) {
    if (!el) return;

    var min = parseFloat(el.min) || 0;
    var max = parseFloat(el.max) || 100;
    var val = parseFloat(el.value) || 0;

    if (max === min) return;

    el.style.setProperty('--pct', ((val - min) / (max - min) * 100).toFixed(1) + '%');
  }

  function calc() {
    var people        = parseInt(safeEl('wfPeople')?.value) || 0;
    var bottleWk      = parseFloat(safeEl('wfBottle')?.value) || 0;
    var years         = parseInt(safeEl('wfYears')?.value) || 1;
    var filterCost    = parseFloat(safeEl('wfFilterCost')?.value) || 0;
    var cartridgeCost = parseFloat(safeEl('wfCartridgeCost')?.value) || 0;

    var bottledAnnual  = people * bottleWk * 52;
    var filterY1       = filterCost + cartridgeCost;
    var filterOngoing  = cartridgeCost;

    var savingsY1      = bottledAnnual - filterY1;
    var savingsOngoing = bottledAnnual - filterOngoing;
    var totalSavings   = savingsY1 + (savingsOngoing * (years - 1));

    var dayRate        = filterOngoing / 365;
    var bottlesPerYear = Math.round(people * (bottleWk / 3.5) * 260);

    var monthlySaving = (bottledAnnual - cartridgeCost) / 12;
    var paybackMo = (filterCost > 0 && monthlySaving > 0)
      ? Math.ceil(filterCost / monthlySaving)
      : 0;

    setText('wfSavingsY1', fmt(savingsY1));
    setText('wfCostPerDay', fmtDay(dayRate));
    setText('wfBottles', bottlesPerYear.toLocaleString('en-GB'));
    setText('wfPayback', paybackMo > 0 ? paybackMo + ' mo' : '< 1 mo');

    var co2kg = Math.round(bottlesPerYear * years * 0.082);

    setHTML('wfEnvText',
      'Switching to a filter avoids an estimated <strong>' +
      co2kg.toLocaleString('en-GB') +
      ' kg of plastic CO\u2082</strong> over ' +
      years + ' year' + (years > 1 ? 's' : '') +
      ' \u2014 and eliminates the hassle of buying and carrying heavy bottles.'
    );

    var v    = safeEl('wfVerdict');
    var vt   = safeEl('wfVerdictText');
    var tick = safeEl('wfVerdictTick');

    if (v && vt && tick) {
      if (savingsY1 >= 0) {
        v.className = 'verdict-bar vb-positive';
        tick.textContent = '\u2713';
        vt.innerHTML =
          'Good news \u2014 a filter saves you <strong>' + fmt(savingsY1) + '</strong> in year\u00a01 alone. ' +
          'Over ' + years + ' years that\u2019s <strong>' + fmt(totalSavings) + '</strong> back in your pocket, ' +
          'for water that\u2019s just as clean and fresh.';
      } else {
        v.className = 'verdict-bar vb-neutral';
        tick.textContent = '!';
        vt.innerHTML =
          'At this usage level the filter pays for itself in <strong>' + paybackMo + ' months</strong>. ' +
          'After that you\u2019re saving <strong>' + fmt(savingsOngoing) + ' every year</strong> \u2014 ' +
          'and never hauling heavy bottles again.';
      }
    }

    ['wfPeople', 'wfBottle', 'wfYears'].forEach(function(id) {
      setSliderBg(safeEl(id));
    });
  }

  safeAddEvent('wfPeople', 'input', function() {
    var v = parseInt(this.value) || 0;
    setText('wfPeopleVal', v + (v === 1 ? ' person' : ' people'));
    calc();
  });

  safeAddEvent('wfBottle', 'input', function() {
    setText('wfBottleVal', '£' + (parseFloat(this.value) || 0).toFixed(2));
    calc();
  });

  safeAddEvent('wfYears', 'input', function() {
    var v = parseInt(this.value) || 1;
    setText('wfYearsVal', v + ' year' + (v === 1 ? '' : 's'));
    calc();
  });

  safeAddEvent('wfFilterCost', 'input', calc);
  safeAddEvent('wfCartridgeCost', 'input', calc);

  ['wfPeople', 'wfBottle', 'wfYears'].forEach(function(id) {
    setSliderBg(safeEl(id));
  });

  calc();
});