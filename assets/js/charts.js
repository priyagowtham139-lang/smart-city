/* =========================================================
   STACKLY - charts.js : tiny responsive SVG charts (no libraries)
   Charts redraw at the real pixel width so text stays readable on phones.
   ========================================================= */
(function () {
  'use strict';
  var W = window, D = document, Stk = W.Stk, C = Stk.charts = {};
  var uid = 0;
  function watch(host, draw) {
    var played = false, last = 0, ctl = { host: host, redraw: function () { draw(host.clientWidth || 300, played); } };
    function run() { var w = host.clientWidth; if (!w || Math.abs(w - last) < 2) return; last = w; draw(w, played); if (played) host.classList.add('play'); }
    if ('ResizeObserver' in W) new ResizeObserver(function () { requestAnimationFrame(run); }).observe(host); else W.addEventListener('resize', run);
    run();
    if ('IntersectionObserver' in W) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { played = true; host.classList.add('play'); io.disconnect(); } }, { threshold: .25 }); io.observe(host);
    } else { played = true; host.classList.add('play'); }
    ctl.draw = draw; return ctl;
  }
  function smooth(p) {
    if (p.length < 2) return '';
    var d = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
    for (var i = 0; i < p.length - 1; i++) {
      var a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += ' C' + (b[0] + (c[0] - a[0]) / 6).toFixed(1) + ' ' + (b[1] + (c[1] - a[1]) / 6).toFixed(1) + ',' + (c[0] - (e[0] - b[0]) / 6).toFixed(1) + ' ' + (c[1] - (e[1] - b[1]) / 6).toFixed(1) + ',' + c[0].toFixed(1) + ' ' + c[1].toFixed(1);
    }
    return d;
  }
  function nice(max) { var p = Math.pow(10, Math.floor(Math.log10(max || 1))), n = max / p; var steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]; for (var i = 0; i < steps.length; i++) if (n <= steps[i]) return steps[i] * p; return 10 * p; }

  /* sparkline */
  C.spark = function (host, data, color) {
    var id = 's' + (++uid);
    return watch(host, function (w) {
      var h = 44, mx = Math.max.apply(null, data), mn = Math.min.apply(null, data), rg = (mx - mn) || 1;
      var pts = data.map(function (v, i) { return [i * (w - 4) / (data.length - 1) + 2, h - 6 - (v - mn) / rg * (h - 12)]; }), d = smooth(pts);
      host.innerHTML = '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".35"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs><path class="ch-area" d="' + d + ' L' + (w - 2) + ' ' + h + ' L2 ' + h + 'Z" fill="url(#' + id + ')"/><path class="ch-line" pathLength="1" d="' + d + '" stroke="' + color + '" style="stroke-width:2"/></svg>';
    });
  };

  /* line / area chart, multiple series */
  C.line = function (host, o) {
    var id = 'l' + (++uid), ctl;
    ctl = watch(host, function (w) {
      var h = o.h || (w < 420 ? 210 : 260), L = 40, R = 12, T = 14, B = 28, all = [], s;
      o.series.forEach(function (x) { all = all.concat(x.data); });
      var mx = nice(Math.max.apply(null, all) * 1.08), mn = o.min || 0, n = o.labels.length, iw = w - L - R, ih = h - T - B, g = '', t = '', paths = '', k;
      var sx = function (i) { return L + i * iw / (n - 1); }, sy = function (v) { return T + ih - (v - mn) / (mx - mn) * ih; };
      for (k = 0; k <= 4; k++) { var yv = mn + (mx - mn) * k / 4, yy = sy(yv); g += '<line x1="' + L + '" x2="' + (w - R) + '" y1="' + yy + '" y2="' + yy + '"/>'; t += '<text class="ch-txt" x="' + (L - 8) + '" y="' + (yy + 4) + '" text-anchor="end">' + (o.fmt ? o.fmt(yv) : Math.round(yv)) + '</text>'; }
      var every = Math.ceil(n / Math.max(2, Math.floor(iw / 56)));
      o.labels.forEach(function (lb, i) { if (i % every === 0 || i === n - 1 && every === 1) t += '<text class="ch-txt" x="' + sx(i) + '" y="' + (h - 8) + '" text-anchor="middle">' + lb + '</text>'; });
      var defs = '';
      o.series.forEach(function (sr, si) {
        var pts = sr.data.map(function (v, i) { return [sx(i), sy(v)]; }), d = smooth(pts), col = sr.color || '#38d5f5';
        defs += '<linearGradient id="' + id + si + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + col + '" stop-opacity=".3"/><stop offset="1" stop-color="' + col + '" stop-opacity="0"/></linearGradient>';
        if (si === 0 && o.area !== false) paths += '<path class="ch-area" d="' + d + ' L' + sx(n - 1) + ' ' + (T + ih) + ' L' + sx(0) + ' ' + (T + ih) + 'Z" fill="url(#' + id + si + ')"/>';
        paths += '<path class="ch-line" pathLength="1" d="' + d + '" stroke="' + col + '"/>';
        var lp = pts[pts.length - 1]; paths += '<circle class="ch-dot" cx="' + lp[0] + '" cy="' + lp[1] + '" r="4.5" fill="' + col + '"/><circle class="ch-ping" cx="' + lp[0] + '" cy="' + lp[1] + '" r="4.5" fill="none" stroke="' + col + '"/>';
      });
      host.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + (o.label || 'Line chart') + '"><defs>' + defs + '</defs><g class="ch-grid">' + g + '</g>' + t + paths + '</svg>';
    });
    ctl.set = function (series, labels) { o.series = series; if (labels) o.labels = labels; ctl.redraw(); host.classList.add('play'); };
    return ctl;
  };

  /* bar chart */
  C.bars = function (host, o) {
    return watch(host, function (w) {
      var h = o.h || 240, L = 36, R = 6, T = 12, B = 28, n = o.data.length, iw = w - L - R, ih = h - T - B, mx = nice(Math.max.apply(null, o.data) * 1.08), bw = Math.min(46, iw / n * .6), g = '', t = '', b = '', k;
      for (k = 0; k <= 4; k++) { var yy = T + ih - ih * k / 4; g += '<line x1="' + L + '" x2="' + (w - R) + '" y1="' + yy + '" y2="' + yy + '"/>'; t += '<text class="ch-txt" x="' + (L - 8) + '" y="' + (yy + 4) + '" text-anchor="end">' + (o.fmt ? o.fmt(mx * k / 4) : Math.round(mx * k / 4)) + '</text>'; }
      var id = 'b' + (++uid);
      o.data.forEach(function (v, i) {
        var x = L + iw / n * (i + .5) - bw / 2, bh = v / mx * ih, col = (o.colors && o.colors[i % o.colors.length]) || '#38d5f5';
        b += '<rect class="ch-bar" style="--i:' + i + '" x="' + x.toFixed(1) + '" y="' + (T + ih - bh).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="' + Math.min(8, bw / 2) + '" fill="url(#' + id + (i % 4) + ')"/>';
        t += '<text class="ch-txt" x="' + (x + bw / 2) + '" y="' + (h - 8) + '" text-anchor="middle">' + o.labels[i] + '</text>';
      });
      var defs = ''; (o.colors || ['#38d5f5']).forEach(function (c, i) { defs += '<linearGradient id="' + id + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '" stop-opacity=".35"/></linearGradient>'; });
      host.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + (o.label || 'Bar chart') + '"><defs>' + defs + '</defs><g class="ch-grid">' + g + '</g>' + t + b + '</svg>';
    });
  };

  /* donut */
  C.donut = function (host, items, center) {
    var ctl = watch(host, function (w) {
      var s = Math.min(w, 180), r = s / 2 - 14, cx = s / 2, tot = items.reduce(function (a, i) { return a + i.v; }, 0), off = 0, seg = '';
      items.forEach(function (it, i) {
        var len = it.v / tot * 100;
        seg += '<circle class="ch-seg" style="--i:' + i + ';--len:' + (len - 1.2).toFixed(2) + '" cx="' + cx + '" cy="' + cx + '" r="' + r + '" pathLength="100" stroke="' + it.c + '" stroke-dashoffset="' + (-off).toFixed(2) + '"/>'; off += len;
      });
      host.innerHTML = '<svg viewBox="0 0 ' + s + ' ' + s + '" width="' + s + '" height="' + s + '" role="img" aria-label="' + (center && center.label || 'Donut chart') + '" style="margin:auto"><circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="rgba(140,180,255,.12)" stroke-width="16"/><g transform="rotate(-90 ' + cx + ' ' + cx + ')">' + seg + '</g>' + (center ? '<text x="' + cx + '" y="' + (cx + 4) + '" text-anchor="middle" class="ch-big">' + center.big + '</text><text x="' + cx + '" y="' + (cx + 22) + '" text-anchor="middle" class="ch-txt">' + center.small + '</text>' : '') + '</svg>';
    });
    ctl.set = function (n, c) { items = n; if (c) center = c; ctl.redraw(); host.classList.add('play'); };
    return ctl;
  };

  /* semi-circle gauge */
  C.gauge = function (host, value, label, color, opts) {
    opts = opts || {};
    var pct = opts.pct != null ? opts.pct : value, suffix = opts.suffix != null ? opts.suffix : '%';
    return watch(host, function (w) {
      var s = Math.min(w, 240), r = s / 2 - 16, cx = s / 2, cy = s / 2 + 6;
      var arc = 'M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy;
      host.innerHTML = '<svg viewBox="0 0 ' + s + ' ' + (s / 2 + 34) + '" width="' + s + '" height="' + (s / 2 + 34) + '" role="img" aria-label="' + label + ' ' + value + suffix + '" style="margin:auto"><path d="' + arc + '" fill="none" stroke="rgba(140,180,255,.14)" stroke-width="14" stroke-linecap="round"/><path class="ch-gauge" pathLength="100" style="--v:' + pct + '" d="' + arc + '" fill="none" stroke="' + (color || '#38d5f5') + '" stroke-width="14" stroke-linecap="round"/><text x="' + cx + '" y="' + (cy - 8) + '" text-anchor="middle" class="ch-big">' + value + suffix + '</text><text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" class="ch-txt">' + label + '</text></svg>';
    });
  };
})();
