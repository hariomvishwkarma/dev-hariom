(async function() {
  let rawUrl = decodeURIComponent(window.location.href);
  let dataParam = null;
  
  if (rawUrl.includes('data=')) {
      dataParam = rawUrl.split('data=')[1].split('&')[0].split('#')[0];
  }

  if (dataParam) {
    try {
      let b64 = dataParam.replace(/ /g, '+'); 
      b64 = b64.replace(/%2B/g, '+');
      b64 = b64.replace(/[^A-Za-z0-9+/=]/g, '');
      while (b64.length % 4 !== 0) { b64 += '='; }
      
      const decodedData = JSON.parse(atob(b64));
      
      const step1 = document.getElementById('step1');
      const stepLoading = document.getElementById('stepLoading');
      const widgetWrapper = document.querySelector('.widget-wrapper');
      
      if (step1) step1.classList.remove('visible');
      if (stepLoading) stepLoading.classList.add('visible');
      if (widgetWrapper) widgetWrapper.classList.add('results-mode');

      const requestPayload = { ...decodedData };
      delete requestPayload.email; 
      const endpoint = 'https://precon-calculator-api.onrender.com/api/calculate';

      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            window.__preconApiData = data;
            window.__preconDecodedData = decodedData;
            
            if (window.__renderPreconResults) {
                window.__renderPreconResults();
            }
        } else {
            console.error("API Fehler:", xhr.status);
            if(stepLoading) stepLoading.classList.remove('visible');
            if(step1) step1.classList.add('visible');
            if(widgetWrapper) widgetWrapper.classList.remove('results-mode');
        }
      };
      
      xhr.onerror = function() {
        console.error("Netzwerkfehler");
        if(stepLoading) stepLoading.classList.remove('visible');
        if(step1) step1.classList.add('visible');
        if(widgetWrapper) widgetWrapper.classList.remove('results-mode');
      };
      
      xhr.send(JSON.stringify(requestPayload));

    } catch (e) {
      console.error("Decode Fehler (Sofort-Start):", e);
    }
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const settingsTag = document.getElementById('PreconCalculatorSettings');
  if (!settingsTag) return;
  
  const preconSettings = JSON.parse(settingsTag.textContent);

  const state = {
    gender: null, age: null, height: null,
    weight: null, targetWeight: null,
    beruf: null, sport: null,
    firstName: '', lastName: '', email: '', consent: false,
    current: 1,
    apiData: null
  };

  function loadChartJS() {
    return new Promise((resolve, reject) => {
      if (window.Chart) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Chart.js Error'));
      document.head.appendChild(script);
    });
  }

  function bmiCat(bmi) {
    if (bmi < 18.5) return preconSettings.results.cat1;
    if (bmi < 25)   return preconSettings.results.cat2;
    if (bmi < 30)   return preconSettings.results.cat3;
    if (bmi < 35)   return preconSettings.results.cat4;
    if (bmi < 40)   return preconSettings.results.cat5;
    return preconSettings.results.cat6;
  }
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgress(step) {
    for (let i = 1; i <= 7; i++) {
      const dot = document.getElementById('ps' + i);
      dot.className = 'prog-step';
      if (i < step) { dot.classList.add('done'); dot.innerHTML = '✓'; }
      else if (i === step) { dot.classList.add('active'); dot.innerHTML = i; }
      else { dot.innerHTML = i; }
      if (i < 7) {
        const line = document.getElementById('pl' + i);
        line.className = 'prog-line' + (i < step ? ' done' : '');
      }
    }
  }

  window.__renderPreconResults = async function() {
      if(!window.__preconApiData || !window.__preconDecodedData) return;
      
      const data = window.__preconApiData;
      state.apiData = data;
      
      const d = window.__preconDecodedData;
      state.firstName = d.firstName;
      state.lastName = d.lastName;
      state.weight = d.weight;
      state.targetWeight = d.targetWeight;
      state.gender = d.gender;

      try {
          await loadChartJS();
      } catch(e) {}

      document.getElementById('resGreeting').textContent = preconSettings.results.greeting.replace('{name}', state.firstName);
      document.getElementById('resBmiCurrent').innerHTML = data.bmi.current;
      document.getElementById('resBmiCurrentCat').textContent = bmiCat(data.bmi.current);
      document.getElementById('resBmiTarget').innerHTML = data.bmi.target;

      const BMI_MIN = 15, BMI_MAX = 42;
      const bmiPct = 2 + (Math.min(BMI_MAX, Math.max(BMI_MIN, data.bmi.current)) - BMI_MIN) / (BMI_MAX - BMI_MIN) * 96;
      document.getElementById('bmiNeedle').style.left = bmiPct.toFixed(1) + '%';
      
      document.getElementById('resBmr').innerHTML = data.calories.bmr + '<span class="res-unit">kcal</span>';
      document.getElementById('resLeistung').innerHTML = data.calories.leistung + '<span class="res-unit">kcal</span>';
      document.getElementById('resTotal').innerHTML = data.calories.total + '<span class="res-unit">kcal/Tag</span>';
      document.getElementById('resPrecon').textContent = data.calories.preconKcal;
      document.getElementById('resTotalMeal').textContent = data.calories.totalMeal;

      document.getElementById('stepLoading').classList.remove('visible');
      document.getElementById('stepResult').classList.add('visible');
      document.getElementById('footerNote').style.display = 'block';
      state.current = 8;
  };

  if(window.__preconApiData) {
      window.__renderPreconResults();
  }

  window.goStep = function(n, back) {
    document.getElementById('stepLoading').classList.remove('visible');
    document.getElementById('loadingBarFill').style.transition = 'none';
    document.getElementById('loadingBarFill').style.width = '0%';
    document.getElementById('loadingReview').classList.remove('visible');
    document.querySelector('.widget-wrapper').classList.remove('results-mode');

    const cur = document.getElementById(
      state.current === 8  ? 'stepResult' :
      state.current === 9  ? 'stepAbnehmplan' :
      state.current === 10 ? 'stepPhasen' :
      'step' + state.current
    );
    cur.classList.remove('visible');

    const next = document.getElementById('step' + n);
    next.classList.remove('slide-back');
    if (back) next.classList.add('slide-back');
    next.classList.add('visible');
    state.current = n;
    updateProgress(n);
    scrollToTop();
  };

  window.showPage = function(id) {
    ['stepResult','stepAbnehmplan','stepLoading','stepPhasen'].forEach(p => document.getElementById(p).classList.remove('visible'));
    for (let i = 1; i <= 7; i++) document.getElementById('step'+i).classList.remove('visible');
    document.getElementById(id).classList.add('visible');
    
    const isResults = ['stepResult','stepAbnehmplan','stepPhasen','stepLoading'].includes(id);
    document.querySelector('.widget-wrapper').classList.toggle('results-mode', isResults);
    
    if (id === 'stepResult') state.current = 8;
    if (id === 'stepAbnehmplan') state.current = 9;
    if (id === 'stepPhasen') {
      state.current = 10;
      const showWeeks   = state.apiData.plan.showWeeks || 0;
      const totalWeeks  = state.apiData.plan.totalActiveWeeks > 0 ? state.apiData.plan.totalActiveWeeks - 1 : 0;
      const lblWoche    = preconSettings.results.lbl_woche;
      const lblWochen   = preconSettings.results.lbl_wochen;

      const durationTxt = totalWeeks <= 11
        ? `${showWeeks} ${showWeeks === 1 ? lblWoche : lblWochen}`
        : `12 ${lblWochen} (von ${1 + totalWeeks} gesamt)`;
      document.getElementById('phaseAbnehmDuration').textContent = durationTxt;

      const halteWeeks  = state.apiData.plan.halteWeeks || 0;
      const halteSection = document.getElementById('phaseHalteSection');
      if (halteSection) halteSection.style.display = halteWeeks ? 'block' : 'none';
    }
    scrollToTop();
  };

  window.selectGender = function(g) {
    state.gender = g;
    document.getElementById('btn-frau').classList.toggle('selected', g === 'Frau');
    document.getElementById('btn-mann').classList.toggle('selected', g === 'Mann');
    hide('err-gender');
  };

  window.selectBeruf = function(val, el) {
    state.beruf = val;
    document.querySelectorAll('#beruf-choices .choice-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    hide('err-beruf');
  };

  window.selectSport = function(val, el) {
    state.sport = val;
    document.querySelectorAll('#sport-choices .choice-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
    hide('err-sport');
  };

  window.toggleConsent = function() {
    state.consent = !state.consent;
    document.getElementById('consentRow').classList.toggle('checked', state.consent);
    if (state.consent) hide('err-consent');
  };

  function show(id) { document.getElementById(id).classList.add('visible'); }
  function hide(id) { document.getElementById(id).classList.remove('visible'); }
  function getNum(id) { return parseFloat(document.getElementById(id).value); }
  
  function markErr(id, err) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('has-error', err);
  }

  window.goStep2 = function() {
    if (!state.gender) { show('err-gender'); return; }
    goStep(2);
  };

  window.goStep3 = function() {
    let ok = true;
    const age = getNum('age');
    const h = getNum('height');
    if (isNaN(age) || age < 18 || age > 100) { show('err-age'); markErr('age', true); ok = false; }
    else { hide('err-age'); markErr('age', false); state.age = age; }
    if (isNaN(h) || h < 140 || h > 220) { show('err-height'); markErr('height', true); ok = false; }
    else { hide('err-height'); markErr('height', false); state.height = h; }
    if (ok) goStep(3);
  };

  window.goStep4 = function() {
    let ok = true;
    const w = getNum('weight');
    const t = getNum('targetWeight');
    if (isNaN(w) || w < 45 || w > 200) {
      if (!isNaN(w) && w > 200) { show('err-weight-high'); hide('err-weight-low'); }
      else { show('err-weight-low'); hide('err-weight-high'); }
      markErr('weight', true); ok = false;
    } else { hide('err-weight-low'); hide('err-weight-high'); markErr('weight', false); state.weight = w; }

    hide('err-target'); hide('err-target-equal'); hide('err-target-high'); hide('err-target-bmi'); markErr('targetWeight', false);
    
    if (isNaN(t) || t < 45) {
      show('err-target'); markErr('targetWeight', true); ok = false;
    } else if (!isNaN(w) && t === w) {
      show('err-target-equal'); markErr('targetWeight', true); ok = false;
    } else if (!isNaN(w) && t > w) {
      show('err-target-high'); markErr('targetWeight', true); ok = false;
    } else if (!isNaN(w) && state.height) {
      const hm = state.height / 100;
      const targetBmi = t / (hm * hm);
      if (targetBmi < 18.5) {
        const minWeight = Math.ceil(18.5 * hm * hm * 10) / 10;
        const errMsg = preconSettings.errors.bmi_low.replace('{min_kg}', minWeight.toFixed(1).replace('.', ','));
        document.getElementById('err-target-bmi').textContent = errMsg;
        show('err-target-bmi'); markErr('targetWeight', true); ok = false;
      } else {
        state.targetWeight = t;
      }
    } else {
      state.targetWeight = t;
    }
    if (ok) goStep(4);
  };

  window.goStep5 = function() {
    if (!state.beruf) { show('err-beruf'); return; }
    goStep(5);
  };

  window.goStep6 = function() {
    if (!state.sport) { show('err-sport'); return; }
    goStep(6);
  };

  window.goStep7 = function() {
    let ok = true;
    const fn = document.getElementById('firstName').value.trim();
    const ln = document.getElementById('lastName').value.trim();
    if (!fn) { show('err-firstName'); ok = false; } else { hide('err-firstName'); state.firstName = fn; }
    if (!ln) { show('err-lastName'); ok = false; } else { hide('err-lastName'); state.lastName = ln; }
    if (ok) goStep(7);
  };

  window.calculate = async function() {
    let ok = true;
    const em = document.getElementById('email').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    if (!emailOk) { show('err-email'); markErr('email', true); ok = false; }
    else { hide('err-email'); markErr('email', false); state.email = em; }
    if (!state.consent) { show('err-consent'); ok = false; }
    if (!ok) return;

    const cur = document.getElementById('step' + state.current);
    cur.classList.remove('visible');
    const loader = document.getElementById('stepLoading');
    loader.classList.add('visible');
    document.querySelector('.widget-wrapper').classList.add('results-mode');
    scrollToTop();
    updateProgress(8);

    const bar = document.getElementById('loadingBarFill');
    requestAnimationFrame(() => { bar.style.width = '100%'; });

    setTimeout(() => {
      document.getElementById('loadingReview').classList.add('visible');
    }, 2000);

    try {
      let endpoint = preconSettings.api.renderUrl || 'https://precon-calculator-api.onrender.com';
      endpoint = endpoint.replace(/\/$/, '') + '/api/calculate';

      const currentShopUrl = window.location.href.split('?')[0].split('#')[0];

      const requestPayload = {
        shopUrl: currentShopUrl,
        gender: state.gender,
        age: state.age,
        height: state.height,
        weight: state.weight,
        targetWeight: state.targetWeight,
        beruf: state.beruf,
        sport: state.sport,
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email
      };

      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = async function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            state.apiData = data; 
            
            try { await loadChartJS(); } catch(e){}

            document.getElementById('resGreeting').textContent = preconSettings.results.greeting.replace('{name}', state.firstName);
            document.getElementById('resBmiCurrent').innerHTML = data.bmi.current;
            document.getElementById('resBmiCurrentCat').textContent = bmiCat(data.bmi.current);
            document.getElementById('resBmiTarget').innerHTML = data.bmi.target;

            const BMI_MIN = 15, BMI_MAX = 42;
            const bmiPct = 2 + (Math.min(BMI_MAX, Math.max(BMI_MIN, data.bmi.current)) - BMI_MIN) / (BMI_MAX - BMI_MIN) * 96;
            document.getElementById('bmiNeedle').style.left = bmiPct.toFixed(1) + '%';
            
            document.getElementById('resBmr').innerHTML = data.calories.bmr + '<span class="res-unit">kcal</span>';
            document.getElementById('resLeistung').innerHTML = data.calories.leistung + '<span class="res-unit">kcal</span>';
            document.getElementById('resTotal').innerHTML = data.calories.total + '<span class="res-unit">kcal/Tag</span>';
            document.getElementById('resPrecon').textContent = data.calories.preconKcal;
            document.getElementById('resTotalMeal').textContent = data.calories.totalMeal;

            loader.classList.remove('visible');
            document.getElementById('stepResult').classList.add('visible');
            document.getElementById('footerNote').style.display = 'block';
            state.current = 8;
            scrollToTop();
        } else {
            throw new Error('API Error');
        }
      };
      xhr.onerror = () => { throw new Error('API Error'); };
      xhr.send(JSON.stringify(requestPayload));

    } catch (error) {
      loader.classList.remove('visible');
      cur.classList.add('visible');
      document.querySelector('.widget-wrapper').classList.remove('results-mode');
    }
  };

  let weightChartInstance = null;

  window.showAbnehmplan = function() {
    const data = state.apiData;
    if (!data) return;

    const diff = data.plan.diff;
    const bmiT = data.bmi.target;
    const tw = state.targetWeight;
    const totalActiveWeeks = data.plan.totalActiveWeeks;
    const showWeeks = data.plan.showWeeks;
    const halteWeeks = data.plan.halteWeeks;
    const lossInPeriod = data.plan.lossInPeriod;
    const weightAtEnd = data.plan.weightAtEnd;

    let introHTML = `Dein Zielgewicht liegt bei <strong>${tw} kg</strong>, was einer Gewichtsabnahme von <strong>${diff.toFixed(1)} kg</strong> entspricht. Dies würde Deinen BMI auf <strong>${bmiT}</strong> bringen.<br><br>`;
    
    if (diff <= 12) {
      introHTML += preconSettings.results.intro_easy.replace('{weeks}', `<strong>${totalActiveWeeks}</strong>`);
    } else if (diff <= 24) {
      introHTML += preconSettings.results.intro_med;
    } else {
      introHTML += preconSettings.results.intro_hard;
    }
    document.getElementById('planIntro').innerHTML = introHTML;

    document.getElementById('planHighlightLabel').textContent = preconSettings.results.hl_label.replace('{weeks}', showWeeks);
    document.getElementById('planHighlightValue').innerHTML   = lossInPeriod + '<span class="res-unit">kg</span>';
    
    const hlSubTxt = preconSettings.results.hl_sub.replace('{w1}', state.weight).replace('{w2}', weightAtEnd);
    document.getElementById('planHighlightSub').textContent = hlSubTxt;
    
    if (weightChartInstance) weightChartInstance.destroy();
    const ctx = document.getElementById('weightChart').getContext('2d');

    const totalChartWeeks = showWeeks + halteWeeks;
    const chartPlugins = [];

    chartPlugins.push({
      id: 'startPhaseLabel',
      afterDraw(chart) {
        const { ctx: c, chartArea, scales } = chart;
        const xScale = scales.x;
        const x0 = xScale.getPixelForValue(0);
        const x1 = xScale.getPixelForValue(1);
        c.save();
        const xStart = x0 + (x1 - x0) * (2/7);
        c.strokeStyle = 'rgba(86,71,58,0.3)';
        c.lineWidth = 1;
        c.setLineDash([3, 3]);
        c.beginPath();
        c.moveTo(xStart, chartArea.top);
        c.lineTo(xStart, chartArea.bottom);
        c.stroke();
        c.setLineDash([]);
        c.fillStyle = preconSettings.colors.accent;
        c.font = '600 11px DM Sans, sans-serif';
        c.textAlign = 'left';
        c.fillText(preconSettings.pdf.lbl_startphase, xStart + 5, chartArea.top + 14);
        c.restore();
      }
    });

    if (halteWeeks) {
      chartPlugins.push({
        id: 'halteZone',
        afterDraw(chart) {
          const { ctx: c, chartArea, scales } = chart;
          const xScale = scales.x;
          const x0 = xScale.getPixelForValue(showWeeks);
          const x1 = xScale.getPixelForValue(totalChartWeeks);
          c.save();
          c.fillStyle = 'rgba(61,173,187,0.07)';
          c.fillRect(x0, chartArea.top, x1 - x0, chartArea.bottom - chartArea.top);
          c.strokeStyle = 'rgba(61,173,187,0.45)';
          c.lineWidth = 1.5;
          c.setLineDash([4, 3]);
          c.beginPath();
          c.moveTo(x0, chartArea.top);
          c.lineTo(x0, chartArea.bottom);
          c.stroke();
          c.setLineDash([]);
          c.fillStyle = preconSettings.colors.accent;
          c.font = '600 11px DM Sans, sans-serif';
          c.textAlign = 'center';
          c.fillText(preconSettings.results.lbl_haltephase, (x0 + x1) / 2, chartArea.top + 14);
          c.restore();
        }
      });
    }

    weightChartInstance = new Chart(ctx, {
      type: 'line',
      plugins: chartPlugins,
      data: {
        labels: data.chart.labels,
        datasets: [
          {
            label: 'Gewicht (kg)',
            data: data.chart.data.map((v, i) => i <= showWeeks ? v : null),
            borderColor: preconSettings.colors.accent,
            backgroundColor: 'rgba(61,173,187,0.10)',
            borderWidth: 2.5,
            pointBackgroundColor: preconSettings.colors.accent,
            pointRadius: totalChartWeeks <= 16 ? 4 : 2,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.35,
            spanGaps: false
          },
          {
            label: preconSettings.results.lbl_haltephase,
            data: halteWeeks ? data.chart.data.map((v, i) => i >= showWeeks ? v : null) : [],
            borderColor: preconSettings.colors.accent,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointBackgroundColor: 'rgba(61,173,187,0.45)',
            pointBorderColor: preconSettings.colors.accent,
            pointRadius: totalChartWeeks <= 16 ? 4 : 2,
            pointHoverRadius: 6,
            fill: false,
            tension: 0,
            spanGaps: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { font: { family: 'DM Sans', size: 11 }, color: preconSettings.colors.textSoft, maxRotation: 45, autoSkip: true, maxTicksLimit: 13 },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: {
            ticks: { font: { family: 'DM Sans', size: 11 }, color: preconSettings.colors.textSoft },
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });

    showPage('stepAbnehmplan');
  };

  window.downloadPDF = function() {
    const btn = document.querySelector('button[onclick="downloadPDF()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'PDF wird generiert...';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';

    try {
      const chartCanvas = document.getElementById('weightChart');
      const chartImage = chartCanvas ? chartCanvas.toDataURL('image/png', 1.0) : null;

      const payload = {
        firstName: state.firstName,
        lastName: state.lastName,
        weight: state.weight,
        targetWeight: state.targetWeight,
        calcData: state.apiData,
        chartImage: chartImage
      };

      let endpoint = preconSettings.api.renderUrl || 'https://precon-calculator-api.onrender.com';
      endpoint = endpoint.replace(/\/$/, '') + '/api/generate-pdf';

      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.responseType = 'blob';
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const blob = xhr.response;
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `Precon_Abnehmplan_${state.firstName}_${state.lastName}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(downloadUrl);
        }
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      };
      xhr.onerror = function() {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      };
      xhr.send(JSON.stringify(payload));
    } catch (error) {
      btn.innerHTML = originalText;
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    }
  };

  let rawUrl = decodeURIComponent(window.location.href);
  let dataParam = null;
  
  if (rawUrl.includes('data=')) {
      dataParam = rawUrl.split('data=')[1].split('&')[0].split('#')[0];
  }

  if (dataParam) {
    try {
      let b64 = dataParam.replace(/ /g, '+'); 
      b64 = b64.replace(/%2B/g, '+');
      b64 = b64.replace(/[^A-Za-z0-9+/=]/g, '');
      while (b64.length % 4 !== 0) { b64 += '='; }
      
      const decodedData = JSON.parse(atob(b64));
      
      document.getElementById('step1').classList.remove('visible');
      document.getElementById('stepLoading').classList.add('visible');
      document.querySelector('.widget-wrapper').classList.add('results-mode');
      
      state.firstName = decodedData.firstName;
      state.lastName = decodedData.lastName;
      state.weight = decodedData.weight;
      state.targetWeight = decodedData.targetWeight;
      state.gender = decodedData.gender;

      let endpoint = preconSettings.api.renderUrl || 'https://precon-calculator-api.onrender.com';
      endpoint = endpoint.replace(/\/$/, '') + '/api/calculate';

      const requestPayload = { ...decodedData };
      delete requestPayload.email; 

      if(!window.__preconApiData) {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', endpoint, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          
          xhr.onload = async function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                state.apiData = data; 
                
                try { await loadChartJS(); } catch(e){}

                document.getElementById('resGreeting').textContent = preconSettings.results.greeting.replace('{name}', state.firstName);
                document.getElementById('resBmiCurrent').innerHTML = data.bmi.current;
                document.getElementById('resBmiCurrentCat').textContent = bmiCat(data.bmi.current);
                document.getElementById('resBmiTarget').innerHTML = data.bmi.target;

                const BMI_MIN = 15, BMI_MAX = 42;
                const bmiPct = 2 + (Math.min(BMI_MAX, Math.max(BMI_MIN, data.bmi.current)) - BMI_MIN) / (BMI_MAX - BMI_MIN) * 96;
                document.getElementById('bmiNeedle').style.left = bmiPct.toFixed(1) + '%';
                
                document.getElementById('resBmr').innerHTML = data.calories.bmr + '<span class="res-unit">kcal</span>';
                document.getElementById('resLeistung').innerHTML = data.calories.leistung + '<span class="res-unit">kcal</span>';
                document.getElementById('resTotal').innerHTML = data.calories.total + '<span class="res-unit">kcal/Tag</span>';
                document.getElementById('resPrecon').textContent = data.calories.preconKcal;
                document.getElementById('resTotalMeal').textContent = data.calories.totalMeal;

                document.getElementById('stepLoading').classList.remove('visible');
                document.getElementById('stepResult').classList.add('visible');
                document.getElementById('footerNote').style.display = 'block';
                state.current = 8;
                scrollToTop();
            }
          };
          xhr.send(JSON.stringify(requestPayload));
      }

    } catch (e) {
      console.error("Decode Fehler (Regulär):", e);
    }
  }
});