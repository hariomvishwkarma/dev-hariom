/**
 * Custom T-shirt canvas engine  (plain JS, zero dependencies)
 * ---------------------------------------------------------------------------
 * Exposes `window.CTPCustomizer`. Loaded lazily by ctp-product.js.
 *
 * Coordinate model
 *  - Everything is stored in a fixed "logical" space of 1000 x 1200 units.
 *    The <canvas> is scaled to the screen, so the design, printable area and
 *    handles are fully responsive without recomputing any geometry.
 *  - Each object stores its CENTRE (x, y), a uniform `scale`, and `rot` (deg).
 *    `w`/`h` are the object's un-scaled size (image fit size or measured text).
 *  - Serialised designs use coordinates normalised to the printable area
 *    (0..1), so a print backend can reproduce the artwork at any resolution.
 *
 * Front and back sides are completely independent object lists.
 */
(function (global) {
  'use strict';

  var W = 1000, H = 1200;
  var TEXT_BASE = 64;            // font size (logical px) when scale === 1
  var MAX_BITMAP = 2400;         // longest edge kept in memory for uploaded art
  var ACCEPT = { 'image/png': 1, 'image/jpeg': 1, 'image/webp': 1 };
  var EXT_TYPE = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
  var DEFAULT_AREAS = {
    front: { x: 310, y: 250, w: 380, h: 480 },
    back:  { x: 290, y: 200, w: 420, h: 540 }
  };
  var FONTS = [
    { name: 'Poppins',          label: 'Poppins' },
    { name: 'Montserrat',       label: 'Montserrat' },
    { name: 'Playfair Display', label: 'Playfair Display' },
    { name: 'Oswald',           label: 'Oswald' },
    { name: 'Bebas Neue',       label: 'Bebas Neue' },
    { name: 'Anton',            label: 'Anton' },
    { name: 'Pacifico',         label: 'Pacifico (script)' },
    { name: 'Caveat',           label: 'Caveat (handwritten)' },
    { name: 'Hind',             label: 'Hind (Hindi + English)' }
  ];
  var FONT_CSS = 'https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@400;700' +
    '&family=Hind:wght@400;700&family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&family=Oswald:wght@400;700' +
    '&family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700' +
    '&family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap';

  /* ------------------------------------------------------------------ utils */
  var rad = function (d) { return d * Math.PI / 180; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var r4 = function (v) { return Math.round(v * 10000) / 10000; };
  var uid = function () { return 'o' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); };

  function luminance(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return 1;
    var n = parseInt(m[1], 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  }
  function shade(hex, amt) { // amt -1..1
    var n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255];
    return 'rgb(' + c.map(function (v) {
      return Math.round(clamp(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt, 0, 255));
    }).join(',') + ')';
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function fail(code, message) { var e = new Error(message); e.code = code; return e; }

  /* ------------------------------------------------------- T-shirt artwork */
  // Procedural mockup so the page works with zero image assets. A merchant can
  // override it with real photos via the section's mockup image settings.
  function shirtPath(side) {
    var p = new Path2D(), depth = side === 'front' ? 100 : 34;
    p.moveTo(392, 92);
    p.quadraticCurveTo(500, 92 + depth * 2, 608, 92);
    p.lineTo(818, 126);
    p.lineTo(978, 304);
    p.lineTo(872, 418);
    p.lineTo(792, 342);
    p.bezierCurveTo(798, 560, 790, 800, 796, 1044);
    p.quadraticCurveTo(500, 1072, 204, 1044);
    p.bezierCurveTo(210, 800, 202, 560, 208, 342);
    p.lineTo(128, 418);
    p.lineTo(22, 304);
    p.lineTo(182, 126);
    p.closePath();
    return p;
  }

  function paintShirt(ctx, side, color) {
    var path = shirtPath(side), lum = luminance(color), depth = side === 'front' ? 100 : 34;
    ctx.save();
    // body + soft ground shadow
    ctx.shadowColor = 'rgba(30,20,10,.22)'; ctx.shadowBlur = 36; ctx.shadowOffsetY = 20;
    ctx.fillStyle = color; ctx.fill(path);
    ctx.shadowColor = 'transparent';
    ctx.clip(path);
    // light falloff: edges darker, centre lifted
    var g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, 'rgba(0,0,0,.14)'); g.addColorStop(.28, 'rgba(0,0,0,0)');
    g.addColorStop(.5, lum < .35 ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,.16)');
    g.addColorStop(.72, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.16)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var v = ctx.createLinearGradient(0, 0, 0, H);
    v.addColorStop(0, 'rgba(255,255,255,.06)'); v.addColorStop(.7, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.12)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    // inside-of-collar (back of the neck is visible from the front)
    ctx.beginPath(); ctx.moveTo(392, 92); ctx.quadraticCurveTo(500, 92 + depth * 2, 608, 92); ctx.closePath();
    ctx.fillStyle = shade(color, -.28); ctx.fill();
    // folds and seams (very subtle)
    ctx.lineCap = 'round';
    ctx.strokeStyle = lum < .35 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)'; ctx.lineWidth = 3;
    [[186, 130, 214, 250, 208, 342], [814, 130, 786, 250, 792, 342]].forEach(function (s) {
      ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.quadraticCurveTo(s[2], s[3], s[4], s[5]); ctx.stroke();
    });
    // hem + cuff stitching
    ctx.setLineDash([9, 7]); ctx.lineWidth = 2.5; ctx.strokeStyle = lum < .35 ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.18)';
    ctx.beginPath(); ctx.moveTo(212, 1018); ctx.quadraticCurveTo(500, 1046, 788, 1018); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(962, 320); ctx.lineTo(864, 406); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(38, 320); ctx.lineTo(136, 406); ctx.stroke();
    ctx.setLineDash([]);
    // collar rib
    ctx.lineWidth = 20; ctx.strokeStyle = shade(color, lum < .35 ? .1 : -.1);
    ctx.beginPath(); ctx.moveTo(392, 92); ctx.quadraticCurveTo(500, 92 + depth * 2, 608, 92); ctx.stroke();
    ctx.restore();
    // outline
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(2, 1.4 / (ctx.getTransform().a || 1));
    ctx.strokeStyle = lum < .35 ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.24)'; ctx.stroke(path); ctx.restore();
  }

  /* ------------------------------------------------------------- Customizer */
  function Customizer(opts) {
    this.canvas = opts.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.areas = opts.areas || DEFAULT_AREAS;
    this.maxBytes = opts.maxBytes || 10 * 1024 * 1024;
    this.accent = opts.accent || '#e8590c';
    this.on = opts.on || {};
    this.side = 'front';
    this.color = '#ffffff';
    this.sides = { front: [], back: [] };
    this.sel = { front: null, back: null };
    this.images = {};
    this.mockups = { front: null, back: null };
    this.previewMode = false;
    this._ptrs = new Map();
    this._drag = null;
    this._pinch = null;
    this._touchUI = false;
    this._cache = null;
    this._raf = 0;
    this._dirty = false;
    this._fontsRequested = false;
    this._mctx = document.createElement('canvas').getContext('2d');
    this._bind();
    this._resize();
  }
  var P = Customizer.prototype;

  /* ---- public: configuration ------------------------------------------- */
  P.setSide = function (side) {
    if (side !== 'front' && side !== 'back') return;
    this.side = side; this._drag = null; this._pinch = null; this._ptrs.clear();
    this._cache = null; this.invalidate(); this._emit('select'); this._emit('side');
  };
  P.setColor = function (hex) {
    this.color = hex; this._cache = null;
    var c = luminance(hex) < .4 ? '#ffffff' : '#111111', changed = false;
    // text still using its automatic colour keeps contrasting with the shirt
    this.sides.front.concat(this.sides.back).forEach(function (o) { if (o.type === 'text' && o.autoColor && o.color !== c) { o.color = c; changed = true; } });
    this.invalidate(); if (changed) this._emit('commit');
  };
  P.setAreas = function (areas) { this.areas = areas; this.invalidate(); };
  P.setMockups = function (urls) {
    var self = this;
    ['front', 'back'].forEach(function (s) {
      if (!urls || !urls[s]) return;
      var im = new Image();
      im.crossOrigin = 'anonymous';           // keeps canvas export untainted
      im.onload = function () { self.mockups[s] = im; self._cache = null; self.invalidate(); };
      im.src = urls[s];
    });
  };
  P.setPreview = function (on) {
    this.previewMode = !!on;
    if (on) this.select(null);
    this.invalidate(); this._emit('preview');
  };

  /* ---- public: reading state ------------------------------------------- */
  P.objects = function (side) { return this.sides[side || this.side]; };
  P.selected = function () {
    var id = this.sel[this.side];
    return id ? this._find(id) : null;
  };
  P.hasDesign = function (side) { return this.sides[side].length > 0; };
  P.emptyTexts = function () {
    var out = [];
    for (var s in this.sides) this.sides[s].forEach(function (o) {
      if (o.type === 'text' && !String(o.text).trim()) out.push({ side: s, id: o.id });
    });
    return out;
  };
  P._find = function (id, side) {
    var list = this.sides[side || this.side];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };

  /* ---- public: adding / editing objects --------------------------------- */
  P.addImage = function (file) {
    var self = this, side = this.side;
    return this._validate(file).then(function () { return self._decode(file); }).then(function (dec) {
      var id = uid();
      self.images[id] = { id: id, src: dec.src, blob: file, name: file.name || 'design', w: dec.w, h: dec.h, type: file.type };
      var o = self._imageObject(id, side);
      self.sides[side].push(o);
      self._constrain(o, side, true);
      self.sel[side] = o.id;
      self.invalidate(); self._emit('select'); self._emit('commit');
      return { object: o, lowRes: Math.min(dec.w, dec.h) < 500 };
    });
  };

  P.addText = function (text) {
    var side = this.side, a = this.areas[side], n = this.sides[side].length;
    var o = {
      id: uid(), type: 'text', text: text || 'आपका टेक्स्ट', font: FONTS[0].name, autoColor: true, color: luminance(this.color) < .4 ? '#ffffff' : '#111111',
      bold: true, italic: false, align: 'center', spacing: 0,
      x: a.x + a.w / 2, y: a.y + a.h / 2 + n * 70, scale: 1, rot: 0, w: 10, h: TEXT_BASE * 1.2
    };
    this._requestFonts(o);
    this._measure(o);
    o.scale = Math.min(1, a.w * .9 / o.w);
    this.sides[side].push(o);
    this._constrain(o, side, true);
    this.sel[side] = o.id;
    this.invalidate(); this._emit('select'); this._emit('commit');
    return o;
  };

  /** patch keys: x,y,nx,ny (0..1 within print area), scale, size (text px), rot, text, font, color, bold, italic, align, spacing */
  P.update = function (patch, id) {
    var side = this.side, o = id ? this._find(id) : this.selected();
    if (!o) return;
    var a = this.areas[side], remeasure = false, rotOnly = false;
    Object.keys(patch).forEach(function (k) {
      var v = patch[k];
      switch (k) {
        case 'nx': o.x = a.x + v * a.w; break;
        case 'ny': o.y = a.y + v * a.h; break;
        case 'size': o.scale = v / TEXT_BASE; break;
        case 'rot': o.rot = ((v + 180) % 360 + 360) % 360 - 180; rotOnly = Object.keys(patch).length === 1; break;
        case 'text': case 'font': case 'bold': case 'italic': case 'spacing': o[k] = v; remeasure = true; break;
        case 'color': o.color = v; o.autoColor = false; break;
        default: o[k] = v;
      }
    });
    if (remeasure) { this._requestFonts(o); this._measure(o); }
    this._constrain(o, side, !rotOnly);
    this.invalidate(); this._emit('commit');
  };

  P.select = function (id) {
    var cur = this.sel[this.side];
    if (cur === id) return;
    this.sel[this.side] = id; this.invalidate(); this._emit('select');
  };
  P.bringForward = function () {
    var o = this.selected(), l = this.sides[this.side], i = o ? l.indexOf(o) : -1;
    if (i < 0 || i === l.length - 1) return;
    l.splice(i, 1); l.splice(i + 1, 0, o); this.invalidate(); this._emit('commit');
  };
  P.remove = function (id) {
    var side = this.side, l = this.sides[side], o = this._find(id || this.sel[side]);
    if (!o) return;
    l.splice(l.indexOf(o), 1);
    if (this.sel[side] === o.id) this.sel[side] = null;
    this._gcImages();
    this.invalidate(); this._emit('select'); this._emit('commit');
  };
  P.reset = function (id) {
    var o = id ? this._find(id) : this.selected();
    if (!o) return;
    var a = this.areas[this.side];
    o.x = a.x + a.w / 2; o.y = a.y + a.h / 2; o.rot = 0;
    if (o.type === 'image') o.scale = 1;
    else { o.scale = 1; o.font = FONTS[0].name; o.bold = true; o.italic = false; o.align = 'center'; o.spacing = 0;
      o.color = luminance(this.color) < .4 ? '#ffffff' : '#111111'; o.autoColor = true; this._measure(o); }
    this._constrain(o, this.side, true);
    this.invalidate(); this._emit('commit');
  };
  P.clearSide = function (side) {
    side = side || this.side; this.sides[side] = []; this.sel[side] = null;
    this._gcImages(); this.invalidate(); this._emit('select'); this._emit('commit');
  };
  P.centre = function (axis) {
    var o = this.selected(); if (!o) return;
    var a = this.areas[this.side];
    if (axis !== 'y') o.x = a.x + a.w / 2;
    if (axis !== 'x') o.y = a.y + a.h / 2;
    this._constrain(o, this.side, false); this.invalidate(); this._emit('commit');
  };

  /* ---- public: persistence ---------------------------------------------- */
  P.serialize = function () {
    var self = this, out = { v: 1, sides: {}, images: {} };
    ['front', 'back'].forEach(function (sd) {
      var a = self.areas[sd];
      out.sides[sd] = self.sides[sd].map(function (o) {
        var b = { id: o.id, type: o.type, nx: r4((o.x - a.x) / a.w), ny: r4((o.y - a.y) / a.h),
          nw: r4(o.w * o.scale / a.w), nh: r4(o.h * o.scale / a.h), rot: Math.round(o.rot * 10) / 10 };
        if (o.type === 'image') {
          b.imgId = o.imgId;
          var im = self.images[o.imgId];
          if (im) out.images[o.imgId] = { name: im.name, type: im.type, bytes: im.blob ? im.blob.size : 0, w: im.w, h: im.h };
        } else {
          b.text = o.text; b.font = o.font; b.color = o.color; b.bold = o.bold; b.italic = o.italic;
          b.align = o.align; b.spacing = o.spacing; if (o.autoColor) b.ac = 1; b.fs = Math.round(o.scale * TEXT_BASE * 10) / 10;
        }
        return b;
      });
    });
    return out;
  };
  P.imageBlobs = function () {
    var out = {}, self = this;
    ['front', 'back'].forEach(function (s) {
      self.sides[s].forEach(function (o) { if (o.type === 'image' && self.images[o.imgId]) out[o.imgId] = self.images[o.imgId].blob; });
    });
    return out;
  };
  /** Rebuild from serialize() output + {imgId: Blob}. Missing images are skipped. */
  P.hydrate = function (state, blobs) {
    var self = this;
    if (!state || state.v !== 1) return Promise.resolve();
    var ids = Object.keys(blobs || {});
    return Promise.all(ids.map(function (id) {
      var meta = (state.images || {})[id] || {};
      var f = blobs[id];
      return self._decode(f).then(function (dec) {
        self.images[id] = { id: id, src: dec.src, blob: f, name: meta.name || 'design', w: dec.w, h: dec.h, type: meta.type || f.type };
      }).catch(function () {});
    })).then(function () {
      ['front', 'back'].forEach(function (sd) {
        var a = self.areas[sd];
        self.sides[sd] = (state.sides[sd] || []).map(function (s) {
          var o = { id: s.id, type: s.type, x: a.x + s.nx * a.w, y: a.y + s.ny * a.h, rot: s.rot || 0, scale: 1 };
          if (s.type === 'image') {
            if (!self.images[s.imgId]) return null;
            var base = self._imageObject(s.imgId, sd);
            o.imgId = s.imgId; o.w = base.w; o.h = base.h; o.scale = (s.nw * a.w) / base.w;
          } else {
            o.text = s.text; o.font = s.font; o.color = s.color; o.bold = !!s.bold; o.italic = !!s.italic;
            o.align = s.align; o.spacing = s.spacing || 0; o.autoColor = !!s.ac; o.scale = (s.fs || TEXT_BASE) / TEXT_BASE;
            self._requestFonts(o); self._measure(o);
          }
          return o;
        }).filter(Boolean);
        self.sides[sd].forEach(function (o) { self._constrain(o, sd, true); });
        self.sel[sd] = null;
      });
      self.invalidate(); self._emit('select');
    });
  };

  /* ---- public: export ---------------------------------------------------- */
  P.exportCanvas = function (side, width, bg) {
    var cv = document.createElement('canvas'), ctx;
    cv.width = width; cv.height = Math.round(width * H / W);
    ctx = cv.getContext('2d');
    if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, cv.width, cv.height); }
    this._paint(ctx, width / W, side, false, false);
    return cv;
  };
  /** Side-by-side snapshot of the given sides (default: those with artwork). */
  P.exportComposite = function (sides, width, bg) {
    var self = this, n = sides.length, one = Math.round(width / n), h = Math.round(one * H / W);
    var cv = document.createElement('canvas'), ctx;
    cv.width = one * n; cv.height = h; ctx = cv.getContext('2d');
    ctx.fillStyle = bg || '#ebe6de'; ctx.fillRect(0, 0, cv.width, h);
    sides.forEach(function (s, i) {
      var part = self.exportCanvas(s, one);
      ctx.drawImage(part, i * one, 0);
    });
    return cv;
  };
  P.toBlob = function (cv, type, quality) {
    return new Promise(function (res, rej) {
      if (cv.toBlob) cv.toBlob(function (b) { b ? res(b) : rej(fail('export', 'Could not create the preview image.')); }, type, quality);
      else rej(fail('export', 'This browser cannot export the preview image.'));
    });
  };

  P.destroy = function () {
    this._ro && this._ro.disconnect();
    cancelAnimationFrame(this._raf);
    var c = this.canvas, h = this._h;
    for (var k in h) c.removeEventListener(k, h[k]);
  };

  /* ---------------------------------------------------------------- images */
  P._validate = function (file) {
    var self = this;
    return new Promise(function (res, rej) {
      if (!file) return rej(fail('empty', 'No file selected.'));
      var ext = (file.name || '').split('.').pop().toLowerCase();
      var type = file.type || EXT_TYPE[ext];
      if (!ACCEPT[type] && !(file.type === '' && EXT_TYPE[ext])) return rej(fail('type', 'Unsupported file type. Please upload a PNG, JPG or WEBP image.'));
      if (!file.size) return rej(fail('empty', 'That file looks empty. Please choose another image.'));
      if (file.size > self.maxBytes) {
        return rej(fail('size', 'This image is ' + (file.size / 1048576).toFixed(1) + ' MB. Please upload one under ' +
          Math.round(self.maxBytes / 1048576) + ' MB.'));
      }
      res();
    });
  };
  P._decode = function (file) {
    function finish(src, w, h) {
      var long = Math.max(w, h);
      if (long > MAX_BITMAP) {          // keep memory + draw cost bounded
        var k = MAX_BITMAP / long, cv = document.createElement('canvas');
        cv.width = Math.round(w * k); cv.height = Math.round(h * k);
        var c = cv.getContext('2d'); c.imageSmoothingQuality = 'high'; c.drawImage(src, 0, 0, cv.width, cv.height);
        if (src.close) src.close();
        return { src: cv, w: cv.width, h: cv.height };
      }
      return { src: src, w: w, h: h };
    }
    var bad = fail('decode', 'We could not read that image. It may be corrupted, or your browser may not support this format.');
    if (global.createImageBitmap) {
      return global.createImageBitmap(file).then(function (b) { return finish(b, b.width, b.height); }, function () { throw bad; });
    }
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); res(finish(im, im.naturalWidth, im.naturalHeight)); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(bad); };
      im.src = url;
    });
  };
  P._imageObject = function (imgId, side) {
    var im = this.images[imgId], a = this.areas[side];
    var fit = Math.min(a.w * .8 / im.w, a.h * .8 / im.h);
    return { id: uid(), type: 'image', imgId: imgId, x: a.x + a.w / 2, y: a.y + a.h / 2, scale: 1, rot: 0, w: im.w * fit, h: im.h * fit };
  };
  P._gcImages = function () {
    var used = {}, self = this;
    ['front', 'back'].forEach(function (s) { self.sides[s].forEach(function (o) { if (o.imgId) used[o.imgId] = 1; }); });
    Object.keys(this.images).forEach(function (id) {
      if (!used[id]) { var s = self.images[id].src; if (s && s.close) s.close(); delete self.images[id]; }
    });
  };

  /* ------------------------------------------------------------------ text */
  P._fontSpec = function (o) { return (o.italic ? 'italic ' : '') + (o.bold ? '700 ' : '400 ') + TEXT_BASE + 'px "' + o.font + '", sans-serif'; };
  P._lineWidth = function (c, line, sp) {
    if (!sp) return c.measureText(line).width;
    var w = 0, chars = Array.from(line);
    chars.forEach(function (ch) { w += c.measureText(ch).width + sp; });
    return chars.length ? w - sp : 0;
  };
  P._measure = function (o) {
    var c = this._mctx, self = this;
    c.font = this._fontSpec(o);
    o.lines = String(o.text).split('\n');
    o.lw = o.lines.map(function (l) { return self._lineWidth(c, l, o.spacing); });
    o.w = Math.max(60, Math.max.apply(null, o.lw));
    o.h = o.lines.length * TEXT_BASE * 1.2;
  };
  // Fonts are fetched only when text is first used (keeps initial load light).
  P._requestFonts = function (o) {
    var self = this;
    if (!this._fontsRequested) {
      this._fontsRequested = true;
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_CSS;
      document.head.appendChild(l);
    }
    if (!document.fonts || !document.fonts.load) return;
    var spec = this._fontSpec(o), sample = o.text || 'Aa';
    document.fonts.load(spec, sample).then(function () {
      self.sides.front.concat(self.sides.back).forEach(function (t) { if (t.type === 'text') self._measure(t); });
      self.invalidate();
    }, function () {});
  };

  /* -------------------------------------------------------------- geometry */
  P._px = function () { return W / (this.canvas.clientWidth || W); };  // logical units per CSS px
  P._toLocal = function (o, p) {
    var dx = p.x - o.x, dy = p.y - o.y, r = -rad(o.rot), c = Math.cos(r), s = Math.sin(r);
    return { x: (dx * c - dy * s) / o.scale, y: (dx * s + dy * c) / o.scale };
  };
  P._toWorld = function (o, lx, ly) {
    var r = rad(o.rot), c = Math.cos(r), s = Math.sin(r);
    return { x: o.x + (lx * c - ly * s) * o.scale, y: o.y + (lx * s + ly * c) * o.scale };
  };
  P._hit = function (o, p, pad) {
    var l = this._toLocal(o, p);
    return Math.abs(l.x) <= o.w / 2 + pad / o.scale && Math.abs(l.y) <= o.h / 2 + pad / o.scale;
  };
  P._handles = function (o) {
    var u = this._px(), r = rad(o.rot), top = this._toWorld(o, 0, -o.h / 2);
    return {
      del: this._toWorld(o, -o.w / 2, -o.h / 2),
      scale: this._toWorld(o, o.w / 2, o.h / 2),
      rotate: { x: top.x + Math.sin(r) * 34 * u, y: top.y - Math.cos(r) * 34 * u }
    };
  };
  P._hitHandle = function (o, p) {
    var h = this._handles(o), rad_ = (this._touchUI ? 24 : 15) * this._px();
    for (var k in h) if (Math.hypot(p.x - h[k].x, p.y - h[k].y) <= rad_) return k;
    return null;
  };
  /**
   * Keeps artwork fully inside the printable area.
   * fitScale=false is used while rotating so the object never silently shrinks.
   */
  P._constrain = function (o, side, fitScale) {
    var a = this.areas[side], r = rad(o.rot), c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r));
    var bw = c * o.w + s * o.h, bh = s * o.w + c * o.h;
    if (fitScale) {
      var maxS = Math.min(a.w / bw, a.h / bh), minS = Math.min(maxS, 28 / Math.max(o.w, o.h));
      o.scale = clamp(o.scale, minS, maxS);
    }
    var hw = bw * o.scale / 2, hh = bh * o.scale / 2;
    o.x = hw * 2 >= a.w ? a.x + a.w / 2 : clamp(o.x, a.x + hw, a.x + a.w - hw);
    o.y = hh * 2 >= a.h ? a.y + a.h / 2 : clamp(o.y, a.y + hh, a.y + a.h - hh);
  };

  /* ------------------------------------------------------------- rendering */
  P.invalidate = function () {
    var self = this;
    this._dirty = true;
    if (this._raf) return;
    this._raf = requestAnimationFrame(function () {
      self._raf = 0;
      if (!self._dirty) return;
      self._dirty = false;
      self._render();
      self._emit('change');
    });
  };
  P._resize = function () {
    var self = this, cv = this.canvas, wrap = cv.parentNode;
    var apply = function () {
      var cssW = cv.clientWidth || wrap.clientWidth;
      if (!cssW) return;
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      var pw = Math.round(cssW * dpr);
      if (cv.width !== pw) { cv.width = pw; cv.height = Math.round(pw * H / W); self._cache = null; self.invalidate(); }
    };
    apply();
    if (global.ResizeObserver) { this._ro = new ResizeObserver(apply); this._ro.observe(wrap); }
    else global.addEventListener('resize', apply);
  };
  P._render = function () {
    var cv = this.canvas, ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    this._paint(ctx, cv.width / W, this.side, true, true);
  };
  P._shirtLayer = function (ctx, side, s, useCache) {
    var key = side + '|' + this.color + '|' + s + '|' + !!this.mockups[side], layer;
    if (useCache && this._cache && this._cache.key === key) { ctx.drawImage(this._cache.cv, 0, 0, W, H); return; }
    layer = document.createElement('canvas');
    layer.width = Math.round(W * s); layer.height = Math.round(H * s);
    var c = layer.getContext('2d'); c.setTransform(s, 0, 0, s, 0, 0);
    var im = this.mockups[side];
    if (im) this._paintMockup(c, im, this.color, s); else paintShirt(c, side, this.color);
    if (useCache) this._cache = { key: key, cv: layer };
    ctx.drawImage(layer, 0, 0, W, H);
  };
  // Photo mockups: draw, tint with multiply (skipped for white), keep original alpha.
  P._paintMockup = function (c, im, color, s) {
    var k = Math.min(W / im.naturalWidth, H / im.naturalHeight) * .96;
    var w = im.naturalWidth * k, h = im.naturalHeight * k, x = (W - w) / 2, y = (H - h) / 2;
    var t = document.createElement('canvas'); t.width = Math.round(W * s); t.height = Math.round(H * s);
    var tc = t.getContext('2d'); tc.setTransform(s, 0, 0, s, 0, 0);
    tc.drawImage(im, x, y, w, h);
    if (luminance(color) < .97) {
      tc.globalCompositeOperation = 'multiply'; tc.fillStyle = color; tc.fillRect(0, 0, W, H);
      tc.globalCompositeOperation = 'destination-in'; tc.drawImage(im, x, y, w, h);
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(t, 0, 0); c.restore();
  };
  P._paint = function (ctx, s, side, ui, useCache) {
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    this._shirtLayer(ctx, side, s, useCache);
    var a = this.areas[side], self = this;
    ctx.save();
    ctx.beginPath(); ctx.rect(a.x, a.y, a.w, a.h); ctx.clip();   // artwork can never print outside the area
    this.sides[side].forEach(function (o) { self._drawObject(ctx, o); });
    ctx.restore();
    if (ui) this._paintUI(ctx, side);
  };
  P._drawObject = function (ctx, o) {
    ctx.save();
    ctx.translate(o.x, o.y); ctx.rotate(rad(o.rot)); ctx.scale(o.scale, o.scale);
    if (o.type === 'image') {
      var im = this.images[o.imgId];
      if (im) ctx.drawImage(im.src, -o.w / 2, -o.h / 2, o.w, o.h);
    } else {
      ctx.font = this._fontSpec(o); ctx.fillStyle = o.color; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
      var lh = TEXT_BASE * 1.2;
      for (var i = 0; i < o.lines.length; i++) {
        var lw = o.lw[i], y = -o.h / 2 + (i + .5) * lh;
        var x = o.align === 'left' ? -o.w / 2 : o.align === 'right' ? o.w / 2 - lw : -lw / 2;
        if (!o.spacing) ctx.fillText(o.lines[i], x, y);
        else Array.from(o.lines[i]).forEach(function (ch) { ctx.fillText(ch, x, y); x += ctx.measureText(ch).width + o.spacing; });
      }
    }
    ctx.restore();
  };
  P._paintUI = function (ctx, side) {
    var u = this._px(), a = this.areas[side], o = this.selected();
    var show = !this.previewMode && (o || !this.sides[side].length || this._drag);
    if (show) {                                    // print-area guide: only while editing
      var dark = luminance(this.color) < .45;
      ctx.save();
      ctx.strokeStyle = dark ? 'rgba(255,255,255,.6)' : 'rgba(20,20,20,.5)';
      ctx.fillStyle = dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.025)';
      ctx.lineWidth = 1.5 * u; ctx.setLineDash([7 * u, 6 * u]);
      rr(ctx, a.x, a.y, a.w, a.h, 12); ctx.fill(); ctx.stroke();
      ctx.restore();
      if (!this.sides[side].length) {
        ctx.save(); ctx.fillStyle = dark ? 'rgba(255,255,255,.7)' : 'rgba(20,20,20,.6)';
        ctx.font = '600 ' + 15 * u + 'px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('प्रिंट एरिया', a.x + a.w / 2, a.y + a.h / 2 - 6 * u);
        ctx.font = '400 ' + 13 * u + 'px system-ui, sans-serif';
        ctx.fillText('डिज़ाइन अपलोड करें या टेक्स्ट जोड़ें', a.x + a.w / 2, a.y + a.h / 2 + 14 * u);
        ctx.restore();
      }
    }
    if (!o || this.previewMode) return;
    // selection frame
    ctx.save();
    ctx.translate(o.x, o.y); ctx.rotate(rad(o.rot)); ctx.scale(o.scale, o.scale);
    ctx.strokeStyle = this.accent; ctx.lineWidth = 1.6 * u / o.scale; ctx.setLineDash([]);
    ctx.strokeRect(-o.w / 2, -o.h / 2, o.w, o.h);
    ctx.restore();
    // handles (constant on-screen size)
    var h = this._handles(o), r = (this._touchUI ? 15 : 11) * u, top = this._toWorld(o, 0, -o.h / 2);
    ctx.save();
    ctx.strokeStyle = this.accent; ctx.lineWidth = 1.4 * u;
    ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.lineTo(h.rotate.x, h.rotate.y); ctx.stroke();
    ['del', 'scale', 'rotate'].forEach(function (k) {
      var p = h[k];
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 6 * u; ctx.shadowOffsetY = 1 * u;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = k === 'del' ? '#d92d20' : '#111'; ctx.lineWidth = 1.8 * u; ctx.lineCap = 'round';
      ctx.beginPath();
      var k2 = r * .42;
      if (k === 'del') { ctx.moveTo(p.x - k2, p.y - k2); ctx.lineTo(p.x + k2, p.y + k2); ctx.moveTo(p.x + k2, p.y - k2); ctx.lineTo(p.x - k2, p.y + k2); }
      else if (k === 'scale') { ctx.moveTo(p.x - k2, p.y - k2); ctx.lineTo(p.x + k2, p.y + k2);
        ctx.moveTo(p.x + k2, p.y + k2); ctx.lineTo(p.x + k2, p.y + k2 * .1); ctx.moveTo(p.x + k2, p.y + k2); ctx.lineTo(p.x + k2 * .1, p.y + k2);
        ctx.moveTo(p.x - k2, p.y - k2); ctx.lineTo(p.x - k2, p.y - k2 * .1); ctx.moveTo(p.x - k2, p.y - k2); ctx.lineTo(p.x - k2 * .1, p.y - k2); }
      else { ctx.arc(p.x, p.y, k2 * 1.1, -1.2, 3.6); ctx.stroke(); ctx.beginPath();
        var ax = p.x + Math.cos(-1.2) * k2 * 1.1, ay = p.y + Math.sin(-1.2) * k2 * 1.1;
        ctx.moveTo(ax, ay); ctx.lineTo(ax + k2 * .7, ay + k2 * .1); ctx.moveTo(ax, ay); ctx.lineTo(ax + k2 * .1, ay - k2 * .7); }
      ctx.stroke();
    });
    ctx.restore();
  };

  /* ----------------------------------------------------------- interaction */
  P._emit = function (name) { var f = this.on[name]; if (f) f(this); };
  P._point = function (e) {
    var r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
  };
  P._bind = function () {
    var self = this, cv = this.canvas;
    cv.setAttribute('tabindex', '0');
    cv.style.touchAction = 'pan-y';        // vertical page scroll still works; drags on objects are claimed below
    this._h = {
      pointerdown: function (e) { self._down(e); },
      pointermove: function (e) { self._move(e); },
      pointerup: function (e) { self._up(e); },
      pointercancel: function (e) { self._up(e); },
      keydown: function (e) { self._key(e); },
      touchstart: function (e) { self._touchStart(e); }
    };
    for (var k in this._h) cv.addEventListener(k, this._h[k], k === 'touchstart' ? { passive: false } : false);
  };
  // Stop the browser from scrolling only when the touch is actually editing something.
  P._touchStart = function (e) {
    var o = this.selected(), t = e.touches[0];
    if (!t) return;
    if (o && e.touches.length > 1) return e.preventDefault();
    var p = this._point(t), u = this._px() * 8;
    if (o && (this._hitHandle(o, p) || this._hit(o, p, u))) return e.preventDefault();
    var list = this.sides[this.side];
    for (var i = list.length - 1; i >= 0; i--) if (this._hit(list[i], p, u)) return e.preventDefault();
  };
  P._down = function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this._touchUI = e.pointerType === 'touch';
    if (this.previewMode) this.setPreview(false);
    var p = this._point(e), o = this.selected(), self = this;
    this.canvas.focus({ preventScroll: true });
    this._ptrs.set(e.pointerId, p);
    try { this.canvas.setPointerCapture(e.pointerId); } catch (_) {}
    if (this._ptrs.size === 2 && o) {                // pinch: scale + rotate selected object
      var pts = Array.from(this._ptrs.values());
      this._pinch = { d: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
        a: Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x), s: o.scale, r: o.rot };
      this._drag = null;
      return;
    }
    if (this._ptrs.size > 1) return;
    if (o) {
      var hd = this._hitHandle(o, p);
      if (hd === 'del') { this._ptrs.clear(); return this.remove(o.id); }
      if (hd) {
        this._drag = { mode: hd, o: o, p0: p, s0: o.scale, r0: o.rot,
          d0: Math.hypot(p.x - o.x, p.y - o.y) || 1, a0: Math.atan2(p.y - o.y, p.x - o.x) };
        return this.invalidate();
      }
    }
    var list = this.sides[this.side], pad = this._px() * (this._touchUI ? 10 : 4), hit = null;
    for (var i = list.length - 1; i >= 0; i--) if (this._hit(list[i], p, pad)) { hit = list[i]; break; }
    if (hit) {
      this.select(hit.id);
      this._drag = { mode: 'move', o: hit, p0: p, x0: hit.x, y0: hit.y };
      e.preventDefault();
    } else { this.select(null); }
    this.invalidate();
  };
  P._move = function (e) {
    var p = this._point(e), o = this.selected();
    if (!this._ptrs.has(e.pointerId)) {              // hover cursor feedback (mouse)
      if (e.pointerType === 'mouse') {
        var c = 'default';
        if (o && this._hitHandle(o, p)) { var hd = this._hitHandle(o, p); c = hd === 'scale' ? 'nwse-resize' : hd === 'rotate' ? 'grab' : 'pointer'; }
        else { var l = this.sides[this.side]; for (var i = l.length - 1; i >= 0; i--) if (this._hit(l[i], p, 4)) { c = 'move'; break; } }
        this.canvas.style.cursor = c;
      }
      return;
    }
    this._ptrs.set(e.pointerId, p);
    if (this._pinch && o && this._ptrs.size >= 2) {
      var pts = Array.from(this._ptrs.values()), pn = this._pinch;
      o.scale = pn.s * (Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) / pn.d);
      o.rot = pn.r + (Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x) - pn.a) * 180 / Math.PI;
      o.rot = ((o.rot + 180) % 360 + 360) % 360 - 180;
      this._constrain(o, this.side, true);
      return this.invalidate();
    }
    var d = this._drag;
    if (!d) return;
    o = d.o;
    if (d.mode === 'move') {
      o.x = d.x0 + (p.x - d.p0.x); o.y = d.y0 + (p.y - d.p0.y);
      this._constrain(o, this.side, false);
    } else if (d.mode === 'scale') {
      o.scale = d.s0 * Math.hypot(p.x - o.x, p.y - o.y) / d.d0;
      this._constrain(o, this.side, true);
    } else if (d.mode === 'rotate') {
      var r = d.r0 + (Math.atan2(p.y - o.y, p.x - o.x) - d.a0) * 180 / Math.PI;
      r = ((r + 180) % 360 + 360) % 360 - 180;
      var snap = Math.round(r / 15) * 15;
      o.rot = Math.abs(r - snap) < 3 ? snap : r;       // gentle snap to 15° steps
      this._constrain(o, this.side, false);
    }
    this.invalidate();
  };
  P._up = function (e) {
    this._ptrs.delete(e.pointerId);
    try { this.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    if (this._ptrs.size < 2) this._pinch = null;
    if (!this._ptrs.size && this._drag) { this._drag = null; this.invalidate(); this._emit('commit'); }
    else if (!this._ptrs.size) this._emit('commit');
  };
  P._key = function (e) {
    var o = this.selected(), step = e.shiftKey ? 12 : 3, u = true;
    if (e.key === 'Enter') {                        // cycle through objects without a pointer
      var l = this.sides[this.side];
      if (l.length) this.select(l[(l.indexOf(o) + 1) % l.length].id);
      e.preventDefault(); return;
    }
    if (!o) return;
    switch (e.key) {
      case 'ArrowLeft': o.x -= step; break;
      case 'ArrowRight': o.x += step; break;
      case 'ArrowUp': o.y -= step; break;
      case 'ArrowDown': o.y += step; break;
      case '+': case '=': o.scale *= 1.05; break;
      case '-': case '_': o.scale /= 1.05; break;
      case '[': o.rot -= 5; break;
      case ']': o.rot += 5; break;
      case 'Delete': case 'Backspace': this.remove(o.id); e.preventDefault(); return;
      case 'Escape': this.select(null); return;
      default: u = false;
    }
    if (!u) return;
    e.preventDefault();
    o.rot = ((o.rot + 180) % 360 + 360) % 360 - 180;
    this._constrain(o, this.side, e.key !== '[' && e.key !== ']');
    this.invalidate(); this._emit('commit');
  };

  Customizer.FONTS = FONTS;
  Customizer.TEXT_BASE = TEXT_BASE;
  Customizer.DEFAULT_AREAS = DEFAULT_AREAS;
  global.CTPCustomizer = Customizer;
})(window);
