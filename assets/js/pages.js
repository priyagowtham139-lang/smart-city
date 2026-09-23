/* =========================================================
   STACKLY - pages.js : per-page widgets for the public site
   ========================================================= */
(function () {
  'use strict';
  var Stk = window.Stk, C = Stk.charts, $ = Stk.$, $$ = Stk.$$;
  if (!Stk || !C) return;

  $$('[data-spark]').forEach(function (h) { C.spark(h, h.getAttribute('data-spark').split(',').map(Number), h.getAttribute('data-color') || '#38d5f5'); });

  /* home: live dashboard */
  var gc = $('#gridChart');
  if (gc) {
    var hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];
    C.line(gc, { label: 'Grid demand and solar supply over 24 hours', labels: hours, fmt: function (v) { return Math.round(v); },
      series: [{ name: 'Demand', color: '#38d5f5', data: [410, 380, 360, 420, 540, 600, 640, 620, 660, 720, 610, 480] }, { name: 'Solar', color: '#ffc857', data: [0, 0, 0, 40, 180, 330, 420, 400, 260, 60, 0, 0] }] });
  }
  var md = $('#modeDonut');
  if (md) C.donut(md, [{ v: 46, c: '#38d5f5' }, { v: 24, c: '#ffc857' }, { v: 18, c: '#7b8cff' }, { v: 12, c: '#5eead4' }], { big: '46%', small: 'Public transit', label: 'Transport mode share' });

  var live = $$('[data-live]');
  if (live.length) {
    var ranges = { traffic: [82, 94, 0], grid: [610, 690, 0], aqi: [36, 48, 0], water: [308, 326, 0] };
    setInterval(function () {
      if (document.hidden) return;
      live.forEach(function (n) {
        var k = n.getAttribute('data-live'), r = ranges[k]; if (!r) return;
        var v = Math.round(r[0] + Math.random() * (r[1] - r[0]));
        n.textContent = v + (n.getAttribute('data-fmt') || ''); n.classList.remove('flash'); void n.offsetWidth; n.classList.add('flash');
      });
    }, 3200);
  }

  /* projects */
  var ic = $('#investChart');
  if (ic) C.bars(ic, { label: 'Budget by sector', labels: ['Mobility', 'Energy', 'Water', 'Safety', 'Health', 'Green'], data: [735, 700, 310, 210, 260, 140], colors: ['#38d5f5', '#ffc857', '#7b8cff', '#ff6b8a', '#5eead4', '#4ade80'] });

  /* sustainability */
  var sc = $('#solarChart');
  if (sc) C.line(sc, { label: 'Monthly solar generation', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], min: 0,
    series: [{ name: '2026', color: '#ffc857', data: [180, 210, 260, 310, 350, 330, 300, 320, 340, 360, 300, 240] }, { name: '2025', color: '#7b8cff', data: [150, 180, 220, 260, 300, 290, 260, 280, 290, 250, 200, 165] }] });
  var co = $('#co2Chart');
  if (co) C.bars(co, { label: 'City emissions in kilotonnes', labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'], data: [4200, 4050, 3800, 3550, 3320, 3100, 2900], colors: ['#38d5f5', '#7b8cff', '#38d5f5', '#7b8cff', '#38d5f5', '#7b8cff', '#ffc857'] });
  var ag = $('#aqiGauge');
  if (ag) C.gauge(ag, 42, 'AQI (lower is better)', '#34d399', { pct: 100 - Math.min(100, 42 / 3), suffix: '' });

  /* contact: highlight today's opening hours */
  var hrs = $('[data-hours]');
  if (hrs) { var today = String(new Date().getDay()); $$('li', hrs).forEach(function (li) { li.classList.toggle('today', li.getAttribute('data-day') === today); }); }
})();
