// The Living Room: ryandchavez.com as a pixel-art midcentury living room.
// Scene is drawn into a 320x180 canvas and scaled up with crisp pixels.
(function () {
var SW = 320, SH = 180, FLOOR = 128, CELL = 3;

var TOKENS = {
  light: { wallFill: "#C6CDB5", rugFill: "#1C251B", ink: "#1D251C", hud: "rgba(29, 37, 28, 0.92)", hudInk: "#EEF0E2", hudLine: "#5E7A58", gold: "#E2BF5E", frame: "#1D251C", panel: "#EEF0E2", panelInk: "#1D251C", panelMuted: "#465643", dial: "#E9DDB8", invBg: "#2A3829", invOn: "#E2BF5E", hallWall: "#D6CDB4", hallFloor: "#BDBBB3", bedWall: "#AEBBC1", bedFloor: "#9C7048", themeColor: "#1D251C" },
  dark:  { wallFill: "#2A3130", rugFill: "#0C100B", ink: "#E6EDD8", hud: "rgba(10, 14, 10, 0.9)", hudInk: "#E6EDD8", hudLine: "#3A4A38", gold: "#E2BF5E", frame: "#050805", panel: "#1F291F", panelInk: "#E6EDD8", panelMuted: "#A7B79F", dial: "#F2C46B", invBg: "#141A14", invOn: "#E2BF5E", hallWall: "#5E594F", hallFloor: "#3A3936", bedWall: "#353C40", bedFloor: "#2E241C", themeColor: "#0A0E0A" }
};

var C = {
  wall: [206, 214, 190], fleck: [196, 205, 180],
  slatA: [138, 90, 52], slatB: [122, 78, 44], slatGap: [70, 42, 22],
  teak: [138, 90, 52], teakD: [94, 58, 30], teakL: [176, 124, 76],
  gold: [201, 166, 70], goldL: [226, 196, 110], mat: [232, 226, 206], black: [26, 28, 24],
  metal: [176, 170, 150], metalD: [110, 106, 94], rust: [181, 67, 42], rug: [22, 30, 21]
};
var RUG = [[[31, 42, 30], [51, 66, 50], [79, 106, 76]], [[44, 58, 42], [94, 122, 88], [155, 181, 143]], [[51, 51, 28], [110, 106, 52], [176, 168, 92]], [[36, 51, 40], [74, 106, 82], [134, 173, 140]]];
var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(function (v) { return (v + 0.5) / 16; });

// Object ids painted into the scene, used for in-scene highlights.
var OBJ = { window: 1, shelf: 2, clock: 3, radio: 4, record: 5, portrait: 6, lamp: 7, chair: 8, contact: 9, plant: 11, door: 12, bell: 13, bwindow: 14, bshelf: 15, desk: 16, blamp: 17, dchair: 18, bass: 19, apple: 20, bed: 21, nlamp: 22, map: 23 };

function rng(seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

function makeScene(mode) {
  var col = new Uint8ClampedArray(SW * SH * 3), emis = new Uint8Array(SW * SH), obj = new Uint8Array(SW * SH), cur = 0;
  function put(x, y, c, e) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= SW || y >= SH) return; var i = y * SW + x; col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; emis[i] = e ? 1 : 0; obj[i] = cur; }
  function rect(x, y, w, h, c, e) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) put(i, j, c, e); }
  var night = mode === "dark", x, y, i, r = rng(night ? 11 : 5);

  for (y = 0; y < FLOOR; y++) for (x = 0; x < SW; x++) put(x, y, ((x * 7 + y * 3) % 11 === 0) ? C.fleck : C.wall);
  rect(0, 0, SW, 3, C.teakD); rect(0, 3, SW, 1, C.teak);
  for (y = 4; y < 120; y++) for (x = 208; x < SW; x++) {
    var k = (x - 208) % 6;
    var c = k === 5 ? C.slatGap : ((((x - 208) / 6) | 0) % 2 ? C.slatA : C.slatB);
    if (k !== 5 && (y * 13 + x * 7) % 23 === 0) c = C.teakD;
    put(x, y, c);
  }
  rect(0, 120, SW, 2, C.teakL); rect(0, 122, SW, 6, C.teakD);

  // ---- window: from the northwest Bronx, looking across the Hudson to the Palisades, the GWB off to the south ----
  cur = OBJ.window;
  rect(12, 14, 86, 74, C.teak);
  var X0 = 15, X1 = 95, Y0 = 17, Y1 = 85, WATER = 68;
  for (y = Y0; y < Y1; y++) {
    var band = Math.floor(((y - Y0) / (WATER - Y0)) * 6) / 5;
    var sky = night ? mix([8, 12, 26], [40, 34, 58], band) : mix([132, 178, 196], [226, 222, 198], band);
    for (x = X0; x < X1; x++) put(x, y, sky, true);
  }
  if (night) { for (i = 0; i < 18; i++) put(X0 + r() * 80, Y0 + r() * 20, r() < 0.3 ? [255, 240, 200] : [170, 180, 200], true); rect(60, 22, 2, 2, [214, 96, 62], true); }
  else { rect(62, 22, 4, 4, [255, 244, 210], true); rect(61, 23, 6, 2, [255, 244, 210], true); rect(28, 24, 10, 2, [240, 244, 236], true); rect(26, 26, 14, 1, [240, 244, 236], true); }
  // Fort Lee towers on top of the cliffs
  [[50, 3, 8], [54, 3, 11], [58, 2, 6]].forEach(function (t) {
    for (y = 56 - t[2]; y < 56; y++) for (x = t[0]; x < t[0] + t[1]; x++) {
      var lit = night && (x + y) % 2 === 0 && r() < 0.35;
      put(x, y, night ? (lit ? [240, 206, 128] : [30, 34, 46]) : ((x - t[0]) === t[1] - 1 ? [150, 156, 160] : [178, 184, 186]), true);
    }
  });
  // the Palisades: wooded ridge over sheer basalt columns
  for (x = X0; x < X1; x++) {
    var ridge = 57 - Math.round((x - X0) * 0.03) + Math.round(Math.sin(x * 0.45) * 0.8 + Math.sin(x * 0.13 + 2) * 1.0);
    for (y = ridge; y < WATER; y++) {
      var c;
      if (y < ridge + 3) c = night ? [16, 22, 18] : ((x + y) % 3 === 0 ? [92, 120, 72] : [74, 100, 60]);
      else if (night) c = (x % 3 === 0) ? [22, 22, 26] : [28, 28, 32];
      else c = (x % 3 === 0) ? [118, 104, 92] : ((x + y) % 7 === 0 ? [150, 136, 120] : [136, 122, 108]);
      put(x, y, c, true);
    }
    for (y = WATER - 3; y < WATER; y++) put(x, y, night ? [18, 20, 22] : [104, 120, 84], true);
  }
  // the Hudson
  for (y = WATER; y < Y1; y++) for (x = X0; x < X1; x++) {
    var wc = night ? [10, 16, 30] : mix([96, 132, 150], [70, 100, 118], (y - WATER) / 17);
    if (!night && (x * 3 + y * 7) % 19 === 0) wc = [176, 202, 210];
    put(x, y, wc, true);
  }
  // the George Washington Bridge: bare steel lattice towers, Manhattan tower nearer and taller
  var steel = night ? [44, 48, 58] : [150, 156, 162], steelD = night ? [30, 32, 40] : [112, 118, 126];
  var light = [255, 232, 168];
  var DECK = 58, T1 = 24, T2 = 46, TT1 = 42, TT2 = 46;
  var DX1 = T2 + 6;
  rect(X0, DECK, DX1 - X0, 1, steel, true);
  for (x = X0; x < DX1; x += 2) put(x, DECK + 1, steelD, true);
  function cableY(x) {
    if (x < T1 + 2) return TT1 + (T1 + 2 - x) * ((DECK - 1 - TT1) / (T1 + 2 - X0));
    if (x > T2 + 1) return x > DX1 ? 99 : TT2 + (x - T2 - 1) * ((DECK - 1 - TT2) / (DX1 - T2 - 1));
    var x0 = T1 + 2, x1 = T2 + 1, u2 = (x - x0) / (x1 - x0);
    var straight = TT1 + (TT2 - TT1) * u2;
    return straight + (DECK - 2 - (TT1 + TT2) / 2) * 4 * u2 * (1 - u2);
  }
  for (x = X0; x < X1; x++) {
    var cy = Math.round(cableY(x));
    if (cy >= DECK) continue;
    put(x, cy, steel, true);
    if (x % 3 === 0 && x > T1 + 4 && x < T2 - 1) for (y = cy + 1; y < DECK; y++) if ((y + x) % 2 === 0) put(x, y, steelD, true);
    if (night && x % 3 === 0) put(x, cy, light, true);
  }
  [[T1, TT1, 4], [T2, TT2, 3]].forEach(function (tw) {
    var tx = tw[0], top = tw[1], wdt = tw[2], base = tx === T1 ? WATER + 1 : WATER - 1;
    for (y = top; y < base; y++) {
      put(tx, y, steel, true); put(tx + wdt - 1, y, steel, true);
      if ((y - top) % 5 === 0) rect(tx, y, wdt, 1, steel, true);
      else if (wdt > 3 && (y - top) % 5 === 2) rect(tx + 1, y, wdt - 2, 1, steelD, true);
    }
    if (tx === T1) rect(tx - 1, WATER, wdt + 2, 2, night ? [24, 26, 32] : [104, 108, 112], true);
    if (night) { put(tx + (wdt >> 1), top - 1, [236, 70, 56], true); }
  });
  if (night) {
    for (x = X0; x < DX1; x += 3) put(x, DECK - 1, light, true);
    for (y = WATER + 2; y < Y1; y += 2) for (x = X0 + 2; x < X1; x += 6) if (r() < 0.45) rect(x, y, 2, 1, [150, 120, 70], true);
  }
  rect(41, Y0, 2, Y1 - Y0, C.teak); rect(68, Y0, 2, Y1 - Y0, C.teak);
  rect(9, 88, 92, 3, C.teakL);
  // three cacti in small pots on the sill, clear of the mullions
  var CG = [74, 124, 76], CGL = [110, 160, 98], CGD = [46, 84, 54], SPINE = [236, 232, 204];
  rect(21, 84, 7, 4, [176, 92, 56]); rect(21, 84, 7, 1, [204, 118, 76]); rect(22, 87, 5, 1, [140, 70, 42]);
  rect(23, 72, 3, 12, CG); rect(23, 72, 1, 12, CGL); rect(25, 73, 1, 11, CGD); rect(24, 71, 1, 1, CG);
  rect(20, 77, 3, 2, CG); rect(20, 74, 2, 3, CG); put(20, 74, CGL); put(20, 75, CGL);
  rect(26, 79, 2, 2, CG); rect(27, 75, 2, 4, CG); put(28, 75, CGD); put(28, 77, CGD);
  [[24, 74], [24, 78], [24, 82], [21, 75], [28, 76]].forEach(function (p) { put(p[0], p[1], SPINE); });
  rect(52, 84, 8, 4, [238, 234, 222]); rect(52, 84, 8, 1, [250, 248, 240]); rect(53, 87, 6, 1, [196, 190, 176]);
  for (y = -3; y <= 3; y++) for (x = -4; x <= 4; x++) if (x * x / 16 + y * y / 9 <= 1) put(56 + x, 80 + y, x < -1 ? CGL : (x > 1 ? CGD : (x % 2 === 0 ? CG : CGD)));
  put(55, 76, [232, 108, 140]); put(56, 76, [246, 150, 176]); put(57, 76, [232, 108, 140]); put(56, 75, [232, 108, 140]);
  [[54, 79], [58, 79], [56, 82]].forEach(function (p) { put(p[0], p[1], SPINE); });
  rect(80, 84, 7, 4, [196, 152, 60]); rect(80, 84, 7, 1, [222, 182, 90]); rect(81, 87, 5, 1, [150, 112, 40]);
  [[83, 79, 3, 4], [80, 75, 2, 3], [86, 74, 2, 3]].forEach(function (pd) {
    for (y = -pd[3]; y <= pd[3]; y++) for (x = -pd[2]; x <= pd[2]; x++) if (x * x / (pd[2] * pd[2]) + y * y / (pd[3] * pd[3]) <= 1) put(pd[0] + x, pd[1] + y, x < 0 ? CGL : CG);
    put(pd[0], pd[1], SPINE);
  });

  // ---- bookshelf: walnut ladder shelves with a drawer cabinet, open back ----
  cur = OBJ.shelf;
  var WAL = [132, 82, 44], WALL2 = [168, 112, 64], WALD = [88, 52, 26], PULL = [40, 36, 32];
  var BK = [[51, 66, 50], [201, 166, 70], [138, 90, 52], [74, 106, 82], [176, 60, 44], [233, 221, 184], [31, 42, 30], [62, 38, 20], [226, 196, 72], [70, 120, 140], [240, 236, 226], [150, 70, 96]];
  function railL(yy) { return Math.round(106 - (yy - 18) * 0.05); }
  function railR(yy) { return Math.round(150 + (yy - 18) * 0.05); }
  function books(base, x0, x1, hmin, hmax) {
    var xx = x0;
    while (xx < x1) {
      var w = 2 + Math.floor(r() * 2), h = hmin + Math.floor(r() * (hmax - hmin));
      if (xx + w > x1) break;
      var bc = BK[Math.floor(r() * BK.length)];
      rect(xx, base - h, w, h, bc);
      if (r() < 0.6) put(xx, base - h + 2 + Math.floor(r() * 3), bc === BK[5] || bc === BK[10] ? [60, 60, 60] : C.goldL);
      xx += w + (r() < 0.05 ? 1 : 0);
    }
  }
  // shelf contents first, then the frame over them
  // top shelf: tiger figurine on a short stack, then a long run of books
  rect(108, 34, 9, 3, [233, 221, 184]); rect(108, 31, 9, 3, [240, 236, 226]);
  for (x = 109; x < 116; x++) put(x, 28, (x % 2) ? [230, 120, 30] : [30, 26, 22]);
  rect(109, 29, 7, 2, [230, 120, 30]); put(111, 29, [30, 26, 22]); put(113, 29, [30, 26, 22]);
  rect(115, 26, 3, 3, [230, 120, 30]); put(117, 27, [30, 26, 22]); put(108, 27, [230, 120, 30]); put(107, 26, [230, 120, 30]);
  put(109, 30, [30, 26, 22]); put(114, 30, [30, 26, 22]);
  books(38, 119, 149, 12, 18);
  // second shelf: books, a stack of magazines, a stone vase
  books(58, 108, 124, 10, 15);
  for (y = 50; y < 58; y++) rect(125, y, 12, 1, BK[(y * 5) % BK.length]);
  rect(139, 49, 4, 9, [70, 86, 78]); rect(140, 47, 2, 2, [70, 86, 78]);
  books(58, 144, 149, 10, 15);
  // third shelf: books and sunflowers in a white vase
  books(78, 108, 137, 12, 17);
  rect(139, 72, 6, 6, [240, 236, 226]); rect(140, 71, 4, 1, [240, 236, 226]);
  [[138, 66], [142, 64], [145, 67], [140, 69]].forEach(function (f) {
    for (var fy = -1; fy <= 1; fy++) for (var fx = -1; fx <= 1; fx++) if (fx * fx + fy * fy <= 1) put(f[0] + fx, f[1] + fy, [244, 196, 40]);
    put(f[0], f[1], [96, 58, 24]);
  });
  put(141, 70, [74, 106, 82]); put(143, 70, [74, 106, 82]); put(144, 69, [74, 106, 82]);
  // cabinet top: a stack of books lying flat, a run of standing books, the wooden pelican
  [[110, 15, 4], [111, 13, 2], [110, 14, 8], [112, 11, 1], [111, 13, 9], [110, 15, 6]].forEach(function (bk, k) { rect(bk[0], 97 - k, bk[1], 1, BK[bk[2]]); });
  books(98, 127, 139, 9, 13);
  rect(141, 91, 5, 5, [190, 140, 92]); rect(144, 87, 2, 4, [190, 140, 92]); rect(143, 86, 3, 2, [190, 140, 92]);
  rect(139, 87, 4, 1, [214, 170, 110]); put(139, 88, [214, 170, 110]); put(142, 96, [150, 100, 60]); put(144, 96, [150, 100, 60]);
  // the frame: splayed ladder rails, shelf planks, drawer cabinet, tapered legs
  for (y = 18; y < 128; y++) {
    var lx = railL(y), rx = railR(y);
    put(lx, y, WALL2); put(lx + 1, y, WAL); put(rx - 1, y, WAL); put(rx, y, WALD);
  }
  [38, 58, 78].forEach(function (sy) {
    for (x = railL(sy) + 2; x < railR(sy) - 1; x++) { put(x, sy, WALL2); put(x, sy + 1, WAL); put(x, sy + 2, WALD); }
  });
  for (y = 98; y < 120; y++) for (x = railL(y) + 2; x < railR(y) - 1; x++) put(x, y, y === 98 ? WALL2 : (y === 99 || y === 119 ? WALD : WAL));
  for (y = 101; y < 117; y++) { put(railL(y) + 3, y, WALD); put(railR(y) - 3, y, WALD); }
  for (x = railL(101) + 3; x < railR(101) - 2; x++) { put(x, 101, WALD); put(x, 116, WALL2); }
  rect(121, 106, 14, 1, PULL); rect(121, 107, 14, 1, [90, 84, 78]);
  for (y = 120; y < 128; y++) { put(railL(y) + 1, y, WALD); put(railR(y) - 1, y, WALD); }

  // ---- wall clock: German functionalist, after the classic Braun designs ----
  cur = OBJ.clock;
  var ccx = 178, ccy = 34, RIM = [38, 38, 36], FACE = [240, 238, 230], INK = [34, 34, 32], SEC = [242, 190, 36];
  for (y = -10; y <= 10; y++) for (x = -10; x <= 10; x++) {
    var rr2 = x * x + y * y;
    if (rr2 <= 90) put(ccx + x, ccy + y, rr2 <= 64 ? FACE : RIM);
  }
  for (i = 0; i < 12; i++) {
    var ta = i * Math.PI / 6, quarter = i % 3 === 0;
    put(ccx + Math.round(Math.cos(ta) * 7), ccy + Math.round(Math.sin(ta) * 7), INK);
    if (quarter) put(ccx + Math.round(Math.cos(ta) * 6), ccy + Math.round(Math.sin(ta) * 6), INK);
  }
  function hand(ang, len, c) { for (var k = 0; k <= len * 2; k++) put(ccx + Math.cos(ang) * k / 2, ccy + Math.sin(ang) * k / 2, c); }
  hand(-Math.PI / 2 + (10.15 / 12) * Math.PI * 2, 4.5, INK);
  hand(-Math.PI / 2 + (9 / 60) * Math.PI * 2, 7, INK);
  hand(-Math.PI / 2 + (31 / 60) * Math.PI * 2, 6, SEC);
  put(ccx - Math.round(Math.cos(-Math.PI / 2 + (31 / 60) * Math.PI * 2) * 2), ccy - Math.round(Math.sin(-Math.PI / 2 + (31 / 60) * Math.PI * 2) * 2), SEC);
  put(ccx, ccy, SEC);

  // ---- portrait: a stylized midcentury-poster Ryan ----
  cur = OBJ.portrait;
  rect(254, 26, 39, 57, C.gold); rect(255, 27, 37, 1, C.goldL); rect(256, 28, 35, 53, C.mat);
  var PP = { b: [94, 122, 88], a: [118, 146, 108], l: [236, 194, 164], n: [204, 150, 120], h: [44, 30, 24], H: [92, 64, 46], g: [70, 38, 26], G: [150, 116, 62], u: [176, 108, 60], c: [238, 228, 206], k: [112, 76, 52], K: [80, 52, 38] };
  var PR = [
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbaaaaaa",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbaaaaaaa",
    "bbbbbbbbbbbHhhhhhhHhbbbbbbaaaaaaa",
    "bbbbbbbbbhhhhHhhhhhhHhhhbaaaaaaaa",
    "bbbbbbbbbhhhhhhHhhhhhhHhaaaaaaaaa",
    "bbbbbbbbbhHhhhhhhHhhhhhhaaaaaaaaa",
    "bbbbbbbbbhhhHhhhhhhHhhhhaaaaaaaaa",
    "bbbbbbbbbhhhlhHhhhhhlHhhaaaaaaaaa",
    "bbbbbbbbbhhhllhhhhhllhhhaaaaaaaaa",
    "bbbbbbbbbhhlllllhlllllhhaaaaaaaaa",
    "bbbbbbbbbhhlllllllllllhhaaaaaaaaa",
    "bbbbbbbbbhhlllllllllllhhaaaaaaaaa",
    "bbbbbbbbbhlllllllllllllhaaaaaaaaa",
    "bbbbbbbbbhgggggglgggggghaaaaaaaaa",
    "bbbbbbbbbllGlllGGGlllGllaaaaaaaaa",
    "bbbbbbbbbllGlllGlGlllGllaaaaaaaaa",
    "bbbbbbbbbllGlllGlGlllGllaaaaaaaaa",
    "bbbbbbbbbbllGGGlllGGGllaaaaaaaaaa",
    "bbbbbbbbbbblllllllllllaaaaaaaaaaa",
    "bbbbbbbbbbblllllllllllaaaaaaaaaaa",
    "bbbbbbbbbbblllnlllnlllaaaaaaaaaaa",
    "bbbbbbbbbbbblllnnnlllaaaaaaaaaaaa",
    "bbbbbbbbbbbbblllllllaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbblllllaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbannlnnaaaaaaaaaaaaaa",
    "bbbbbbbbbbbbbannnnnaaaaaaaaaaaaaa",
    "bbbbbbbbbbcccKKKKKKKcccaaaaaaaaaa",
    "bbbbbbbbbccKKcccccccKKccaaaaaaaaa",
    "bbbbbbbbkkkkkkkkkkkkkkkkkaaaaaaaa",
    "bbbbbbbcccccccccccccccccccaaaaaaa",
    "bbbbbcccccccccccccccccccccccaaaaa",
    "bbbbkkkkkkkkkkkkkkkkkkkkkkkkkaaaa",
    "bbbcccccccccccccccccccccccccccaaa",
    "bbcccccccccccccccccccccccccccccaa",
    "bbkkkkkkkkkkkkkkkkkkkkkkkkkkkkkaa",
    "bbcccccccccccccccccccccccccccccaa",
    "bbcccccccccccccccccccccccccccccaa",
    "bbkkkkkkkkkkkkkkkkkkkkkkkkkkkkkaa",
    "bbcccccccccccccccccccccccccccccaa",
    "bbcccccccccccccccccccccccccccccaa",
    "bbkkkkkkkkkkkkkkkkkkkkkkkkkkkkkaa",
    "bbcccccccccccccccccccccccccccccaa",
    "bbcccccccccccccccccccccccccccccaa",
    "bbkkkkkkkkkkkkkkkkkkkkkkkkkkkkkaa"
  ];
  for (y = 0; y < PR.length; y++) for (x = 0; x < PR[y].length; x++) put(257 + x, 29 + y, PP[PR[y][x]]);

  // ---- record console: walnut box, plywood edges, acrylic sliding doors, black steel base ----
  cur = 0;
  var WN = [110, 66, 38], WND = [78, 46, 26], PLY = [220, 192, 146], PLYD = [186, 156, 112], STEEL = [30, 30, 30], STEELL = [70, 70, 68];
  var SLEEVE = [[233, 221, 184], [31, 42, 30], [176, 60, 44], [226, 196, 72], [70, 120, 140], [240, 236, 226], [62, 38, 20], [150, 70, 96], [94, 122, 88], [200, 120, 60], [44, 44, 52], [210, 200, 190]];
  rect(158, 90, 94, 26, WN);
  rect(158, 90, 94, 1, PLY); rect(158, 91, 94, 1, WND);
  [[160, 180], [183, 203], [206, 226], [229, 249]].forEach(function (cb, n) {
    for (x = cb[0]; x <= cb[1]; x++) {
      var sc = SLEEVE[(x * 7 + n * 3 + ((x * x) % 5)) % SLEEVE.length];
      var top = 94 + ((x * 3 + n) % 4 === 0 ? 1 : 0);
      for (y = 93; y <= 114; y++) {
        var c = y < top ? [56, 36, 22] : sc;
        if (y >= top && (x + y) % 9 === 0 && sc[0] > 100) c = [Math.max(0, sc[0] - 40), Math.max(0, sc[1] - 40), Math.max(0, sc[2] - 40)];
        // acrylic door: a soft lift and a diagonal glare
        var gl = (x - cb[0]) + (y - 93) * 0.6;
        var lift = (gl > 6 && gl < 8.5) ? 0.45 : 0.12;
        put(x, y, [c[0] + (255 - c[0]) * lift, c[1] + (255 - c[1]) * lift, c[2] + (255 - c[2]) * lift]);
      }
    }
    var mx = (cb[0] + cb[1]) >> 1;
    put(mx - 1, 110, [240, 240, 236]); put(mx + 1, 110, [240, 240, 236]); put(mx, 109, [240, 240, 236]); put(mx, 111, [240, 240, 236]);
    rect(cb[0] - 1, 92, cb[1] - cb[0] + 3, 1, PLYD); rect(cb[0] - 1, 115, cb[1] - cb[0] + 3, 1, PLY);
  });
  [181, 204, 227].forEach(function (dx) { rect(dx, 92, 1, 24, PLY); rect(dx + 1, 92, 1, 24, WND); });
  rect(158, 90, 1, 26, WND); rect(159, 92, 1, 24, PLY); rect(250, 92, 1, 24, PLY); rect(251, 90, 1, 26, WND);
  rect(158, 90, 94, 1, WN); rect(159, 90, 92, 1, PLY);
  rect(158, 116, 94, 2, STEEL); rect(158, 116, 94, 1, STEELL);
  [[159, 2], [204, 2], [249, 2]].forEach(function (lg) { rect(lg[0], 118, lg[1], 9, STEEL); put(lg[0], 127, [150, 150, 146]); put(lg[0] + 1, 127, [150, 150, 146]); });
  // stereo receiver: walnut case with a vented top, black face, long tuning dial, signal meter, silver knobs
  cur = OBJ.radio;
  var RW = [126, 78, 42], RWL = [156, 102, 58], RBK = [26, 24, 22], SIL = [196, 196, 190], SILD = [120, 120, 116];
  var DIAL = night ? [242, 200, 120] : [222, 214, 184];
  rect(161, 79, 40, 3, RW); rect(161, 79, 40, 1, RWL);
  for (x = 170; x < 192; x++) if (x % 2 === 0) put(x, 80, [60, 40, 24]);
  rect(161, 82, 40, 8, RBK); rect(161, 89, 40, 1, [14, 13, 12]);
  rect(163, 83, 27, 3, DIAL, night);
  for (x = 164; x < 189; x += 2) put(x, 85, [70, 60, 40], night);
  put(176, 83, C.rust, night); put(176, 84, C.rust, night); put(176, 85, C.rust, night);
  rect(192, 83, 5, 3, DIAL, night); put(193, 85, [70, 60, 40], night); put(194, 84, [70, 60, 40], night); put(195, 83, [70, 60, 40], night);
  [164, 167, 170, 173, 176, 180, 184].forEach(function (kx) { put(kx, 87, SIL); put(kx, 88, SILD); });
  rect(193, 86, 3, 3, SIL); put(194, 87, SILD); put(196, 87, SILD); put(194, 89, SILD);
  put(198, 83, SIL); put(198, 85, SIL); put(198, 87, SIL);
  // direct-drive turntable: black plinth, strobe-dotted platter, S-shaped tonearm, open clear dust cover
  cur = OBJ.record;
  var TBK = [34, 34, 36], TTOP = [56, 56, 60], TDK = [18, 18, 20], TSIL = [190, 190, 194], LID = [206, 220, 226];
  for (x = 205; x <= 233; x++) { put(x, 72, LID); }
  for (y = 72; y < 83; y++) { put(205 + Math.round((y - 72) * 0.1), y, LID); put(233 - Math.round((y - 72) * 0.1), y, LID); }
  put(219, 73, [150, 156, 160]); put(220, 73, [150, 156, 160]);
  rect(207, 83, 3, 1, TSIL); rect(229, 83, 3, 1, TSIL);
  rect(203, 84, 33, 3, TTOP); rect(203, 87, 33, 3, TBK); rect(203, 89, 33, 1, TDK);
  rect(204, 90, 3, 1, TDK); rect(232, 90, 3, 1, TDK);
  for (x = 206; x <= 225; x++) {
    var edge = x === 206 || x === 225;
    put(x, 84, x % 2 ? TSIL : TDK); put(x, 86, x % 2 ? TDK : TSIL);
    put(x, 85, edge ? TSIL : TDK);
  }
  put(215, 85, TSIL);
  rect(230, 83, 2, 2, TSIL); put(232, 83, TDK); put(233, 83, TDK);
  put(229, 84, TSIL); put(228, 85, TSIL); put(227, 85, TSIL); put(226, 85, TDK); put(226, 86, [80, 200, 120]);
  put(234, 85, TDK); put(234, 86, TSIL);
  put(205, 88, TSIL); put(206, 88, [200, 60, 50]);
  // ---- arc lamp ----
  cur = OBJ.lamp;
  for (i = 0; i <= 900; i++) {
    var t = i / 900, u = 1 - t;
    var px = u * u * 313 + 2 * u * t * 306 + t * t * 238;
    var py = u * u * 146 + 2 * u * t * -60 + t * t * 40;
    put(px, py, C.metal); put(px + 1, py + 1, C.metalD);
  }
  for (y = 40; y < 50; y++) { var sw = Math.round(2 + (y - 40) * 1.0); rect(238 - sw, y, sw * 2 + 1, 1, y < 42 ? C.goldL : C.gold); }
  rect(226, 50, 25, 1, C.teakD);
  rect(236, 51, 5, 1, night ? [255, 232, 176] : [214, 208, 186], night);
  return { col: col, emis: emis, obj: obj };
}

function makeLight(mode) {
  var A = new Float32Array(SW * SH), G = new Float32Array(SW * SH);
  var q = function (v, steps, b) { return Math.floor(v * steps + b) / steps; };
  for (var y = 0; y < SH; y++) for (var x = 0; x < SW; x++) {
    var i = y * SW + x, b = BAYER[(y & 3) * 4 + (x & 3)], g = 0, a;
    if (mode === "dark") {
      a = 0.28;
      var dx = x - 238, dy = y - 54, d = Math.sqrt(dx * dx + dy * dy * 1.3);
      g = Math.pow(Math.max(0, 1 - d / 120), 1.8) * 0.95;
      if (y > 50 && Math.abs(dx) < (y - 50) * 0.9 + 10) g += 0.3 * Math.max(0, 1 - (y - 50) / 130);
      if (y < 40) g *= 0.6;
      var rx = x - 188, ry = y - 82, rd = Math.sqrt(rx * rx + ry * ry);
      g += Math.max(0, 1 - rd / 22) * 0.35;
      g = q(Math.min(1.25, g), 6, b);
    } else {
      a = q(1.0 - 0.14 * (x / SW), 12, b);
      if (y >= FLOOR - 2) {
        var off = (y - FLOOR) * 1.3, x0 = 22 + off, x1 = 96 + off;
        var edge = Math.min(x - x0, x1 - x);
        var m1 = 48 + off, m2 = 75 + off;
        if (edge > 0 && Math.abs(x - m1) > 1.2 && Math.abs(x - m2) > 1.2) g = edge > 2 ? 0.26 : (b < edge / 2 ? 0.26 : 0);
      }
      if (y > 90 && y < 120 && x > 14 && x < 100) { var w0 = 16 + (y - 90) * 0.3, w1 = 94 + (y - 90) * 0.3; if (x > w0 && x < w1) g = Math.max(g, b < 0.5 ? 0.1 : 0.06); }
    }
    A[i] = a; G[i] = g;
  }
  return mode === "dark" ? { A: A, G: G, at: [0.84, 0.92, 1.08], gt: [1.24, 1.02, 0.72] } : { A: A, G: G, at: [1, 1, 1], gt: [1.1, 1.04, 0.84] };
}

function drawFront(put, setCur, rdxOpen) {
  var x, y, i;
  function rect(rx, ry, w, h, c) { for (var j = ry; j < ry + h; j++) for (var k = rx; k < rx + w; k++) put(k, j, c); }
  setCur(OBJ.chair);
  // tufted orange corduroy swivel lounge chair on a chrome star base
  var OR = [214, 104, 40], ORL = [238, 140, 70], ORD = [168, 72, 28], ORX = [128, 52, 22];
  var CH = [214, 214, 208], CHD = [118, 118, 114];
  for (y = 100; y < 125; y++) {
    var inset = y < 102 ? 2 : (y < 104 ? 1 : 0);
    for (x = 222 + inset; x <= 253 - inset; x++) {
      var c = (x % 2 === 0) ? OR : ORL;
      if (x >= 251 - inset) c = ORD;
      if (y === 100) c = ORL;
      put(x, y, c);
    }
  }
  for (y = 103; y < 123; y += 2) put(238, y, ORD);
  [[231, 107], [245, 107], [231, 116], [245, 116]].forEach(function (b) { put(b[0], b[1], ORX); put(b[0] + 1, b[1], ORD); });
  for (x = 223; x <= 252; x++) put(x, 124, ORD);
  for (y = 125; y < 136; y++) {
    var ins = y === 125 ? 2 : (y === 135 ? 2 : (y === 126 || y === 134 ? 1 : 0));
    for (x = 217 + ins; x <= 259 - ins; x++) {
      var c2 = y < 130 ? ((x % 2 === 0) ? ORL : OR) : ((x % 2 === 0) ? OR : ORD);
      if (x >= 256 - ins) c2 = ORD;
      if (y === 130) c2 = ORD;
      put(x, y, c2);
    }
  }
  [[229, 127], [247, 127]].forEach(function (b) { put(b[0], b[1], ORX); });
  for (x = 226; x <= 250; x++) { put(x, 136, ORX); put(x, 137, ORD); }
  for (y = 138; y < 143; y++) { put(237, y, CHD); put(238, y, CH); put(239, y, CHD); }
  [[-22, 5], [-12, 9], [0, 11], [12, 9], [22, 5]].forEach(function (leg) {
    var n = 24;
    for (var k = 0; k <= n; k++) { var t2 = k / n; put(238 + leg[0] * t2, 143 + leg[1] * t2, CH); put(238 + leg[0] * t2, 144 + leg[1] * t2, CHD); }
    put(238 + leg[0], 144 + leg[1], C.black);
  });
  setCur(0);
  // phone stand: a small midcentury chest in acacia, with an open cubby, two drawers
  // with dark knobs, and splayed tapered legs
  var AC = [196, 132, 66], ACL = [224, 162, 94], ACD = [150, 96, 46], ACG = [180, 118, 58], ACIN = [116, 72, 36], KNOB = [56, 42, 34];
  // legs: back pair short and dark, front pair 2px wide, splaying out one pixel every four rows, tapering at the foot
  for (i = 0; i < 9; i++) { put(272, 142 + i, ACD); put(295, 142 + i, ACD); }
  for (i = 0; i < 12; i++) {
    var lo = (i / 4) | 0, lx = 266 - lo, rx = 300 + lo;
    if (i < 10) { put(lx, 142 + i, ACL); put(lx + 1, 142 + i, AC); put(rx, 142 + i, AC); put(rx + 1, 142 + i, ACD); }
    else { put(lx, 142 + i, AC); put(rx + 1, 142 + i, AC); }
  }
  rect(264, 120, 40, 22, AC);
  rect(264, 120, 40, 1, ACL); rect(264, 120, 2, 22, ACL); rect(302, 120, 2, 22, ACD);
  rect(266, 122, 36, 6, ACIN); rect(266, 122, 36, 1, [92, 56, 28]);
  rect(265, 128, 38, 1, ACL); rect(266, 129, 36, 1, ACD);
  [130, 136].forEach(function (dy) {
    for (y = dy; y < dy + 5; y++) for (x = 266; x < 302; x++) put(x, y, (x * 7 + y * 3) % 11 === 0 ? ACG : AC);
    rect(266, dy + 5, 36, 1, ACD);
    put(272, dy + 2, KNOB); put(295, dy + 2, KNOB);
  });
  rect(264, 141, 40, 1, ACD);
  setCur(OBJ.contact);
  // sage rotary desk phone with a clear dial and a coiled cord
  var PH = [146, 170, 120], PHL = [178, 198, 150], PHD = [104, 126, 86], CLR = [222, 226, 210], CRD = [126, 148, 104];
  for (y = 111; y < 120; y++) {
    var hw3 = 8 + ((y - 111) >> 2);
    for (x = 276 - hw3; x <= 276 + hw3; x++) put(x, y, x > 276 + hw3 - 2 ? PHD : (y === 111 ? PHL : PH));
  }
  for (x = 266; x <= 286; x++) put(x, 119, PHD);
  for (y = -4; y <= 4; y++) for (x = -4; x <= 4; x++) {
    var d2 = x * x + y * y;
    if (d2 <= 17) put(276 + x, 115 + y, d2 >= 9 ? ((x + y) % 2 === 0 ? CLR : PHL) : (d2 <= 2 ? PHD : CLR));
  }
  put(280, 117, [230, 230, 226]); put(279, 118, [230, 230, 226]);
  rect(269, 109, 2, 2, PH); rect(282, 109, 2, 2, PH);
  for (x = 267; x <= 285; x++) { put(x, 107, PH); put(x, 108, PHD); }
  rect(265, 105, 5, 3, PH); rect(283, 105, 5, 3, PH);
  for (x = 266; x <= 268; x++) put(x, 104, PHL);
  for (x = 284; x <= 286; x++) put(x, 104, PHL);
  for (x = 268; x <= 284; x++) put(x, 106, PHL);
  for (i = 0; i < 9; i++) { put(264 - (i % 2), 108 + i * 1.4, i % 2 ? CRD : PHL); put(265 - (i % 2), 109 + i * 1.4, CRD); }
  setCur(OBJ.contact);
  // swivel Rolodex, after the NSW-35C: ribbed knobs on a black cradle, round pedestal base. Closed, the smoked
  // cover is down over the cards; open (while looking at the phone table) it's rolled back to show cream cards
  // with blue tabs, split across the rail by two black clips.
  var RDX = { k: [24, 24, 26], K: [96, 96, 104], f: [34, 34, 38], F: [84, 84, 92], s: [92, 86, 108], S: [160, 154, 176], c: [248, 240, 214], l: [206, 194, 160], t: [96, 150, 186], x: [24, 24, 26], b: [72, 72, 80], B: [28, 28, 30], n: [40, 40, 44], d: [150, 140, 156], e: [126, 118, 136], w: [196, 196, 204], m: [212, 200, 166], r: [70, 62, 56] };
  var RDX_TOP = rdxOpen ? [
    "...sSsssssss...",
    "..sSsttsssttss.",
    "..scccccccccs..",
    "..slllllllllS..",
    "..scccccccccs..",
    "..flllllllllf..",
    "kKfcccccccccfKk",
    "KkfmxmmmmmxmfkK",
    "kKfrxrrrrrxrfKk",
    "KkfcxcccccxcfkK",
    "kKfcccccccccfKk",
    "..fcccccctccf.."
  ] : [
    "...sSSssssss...",
    "..sSdddddddds..",
    "..sSdeeeeeeds..",
    "..sSdddddddds..",
    "..sSdeeeeeeds..",
    "..sSdddddddds..",
    "kKfSddddddddfKk",
    "KkfSddddddddfkK",
    "kKfSddwwwwddfKk",
    "KkfSddddddddfkK",
    "kKfSddddddddfKk",
    "..fSddddddddf.."
  ];
  RDX_TOP.concat([
    "..FFFFFFFFFFF..",
    "..fffffffffff..",
    ".....nnnnn.....",
    ".....nnnnn.....",
    "..bbbbbbbbbbb..",
    ".BBBBBBBBBBBBB.",
    "..BBBBBBBBBBB.."
  ]).forEach(function (row, ry) { for (var rx = 0; rx < row.length; rx++) if (row[rx] !== ".") put(289 + rx, 101 + ry, RDX[row[rx]]); });
  setCur(OBJ.lamp);
  rect(306, 146, 14, 3, C.black); rect(308, 145, 10, 1, C.metal);
  setCur(OBJ.plant);
  // cream ceramic planter on black legs, so it reads against the green shag
  var POT = [226, 216, 190], POTL = [244, 238, 220], POTD = [176, 162, 132];
  for (y = 147; y < 170; y++) {
    var pin = Math.round((y - 147) * 0.12);
    for (x = 2 + pin; x <= 21 - pin; x++) put(x, y, x <= 3 + pin ? POTL : (x >= 19 - pin ? POTD : POT));
  }
  rect(1, 144, 22, 2, POTL); rect(1, 146, 22, 1, POTD);
  rect(4, 170, 2, 6, C.black); rect(18, 170, 2, 6, C.black);
  // sword leaves: dark green with lighter cross-bands and a yellow edge, tapering to a point
  var LEAF = [40, 74, 48], BAND = [86, 124, 78], EDGE = [214, 198, 92];
  [[6, 30, -4], [17, 28, 4], [9, 40, -2], [14, 36, 2], [12, 46, 0]].forEach(function (bl, n) {
    for (var j = 0; j < bl[1]; j++) {
      var lx = bl[0] + Math.round(bl[2] * j / bl[1]), w = j < bl[1] * 0.7 ? 3 : (j < bl[1] * 0.9 ? 2 : 1);
      for (var k = 0; k < w; k++) put(lx + k - 1, 143 - j, w > 1 && k === w - 1 ? EDGE : ((j + n * 2) % 6 < 2 ? BAND : LEAF));
    }
  });
  setCur(0);
}

var PLANE = { x0: 97, x1: 8, speed: 11 };
function planeBlink() { return Math.floor(performance.now() / 450) % 2; }
function drawPlane(px, night, col, emis, obj) {
  var py = Math.round(23 + (PLANE.x0 - px) * 0.07), blink = planeBlink();
  var body = night ? [70, 74, 92] : [238, 240, 242], belly = night ? [46, 48, 60] : [168, 174, 184];
  // nose to the left: fuselage, tail fin, swept wing
  var pts = [[0, 0, belly], [1, 0, body], [2, 0, body], [3, 0, body], [4, 0, body], [5, 0, body], [6, 0, body], [6, -1, body], [7, -1, body], [7, -2, body], [3, 1, belly], [4, 1, belly], [5, 1, belly]];
  if (night) {
    pts.push([0, 0, [255, 236, 190]]);
    if (blink) pts.push([7, -2, [255, 255, 255]]);
    pts.push([5, 1, blink ? [230, 60, 50] : [120, 40, 36]]);
  }
  pts.forEach(function (p) {
    var x = px + p[0], y = py + p[1], i = y * SW + x;
    if (x < 15 || x > 94 || y < 17 || y > 50) return;
    if (!emis[i] || obj[i] !== OBJ.window) return; // sky only: not the mullions
    col[i * 3] = p[2][0]; col[i * 3 + 1] = p[2][1]; col[i * 3 + 2] = p[2][2];
  });
}

// ---- the hallway outside: navy front door with a brass peephole, and a push-button doorbell with RDC on the nameplate ----
var HALL = { DX: 128, DY: 30, DW: 64, DH: 120, FLOOR: 150 };
var BRASS = [200, 160, 70], BRASSL = [240, 210, 124], BRASSD = [132, 98, 40];
var GLYPHS = { R: ["110", "101", "110", "101", "101"], D: ["110", "101", "101", "101", "110"], C: ["011", "100", "100", "100", "011"] };

function makeHall(mode) {
  var col = new Uint8ClampedArray(SW * SH * 3), emis = new Uint8Array(SW * SH), obj = new Uint8Array(SW * SH), cur = 0;
  function put(x, y, c) { if (x < 0 || y < 0 || x >= SW || y >= SH) return; var i = y * SW + x; col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; obj[i] = cur; }
  function rect(x, y, w, h, c) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) put(i, j, c); }
  var x, y, DX = HALL.DX, DY = HALL.DY, DW = HALL.DW, DH = HALL.DH;
  var PLASTER = [222, 214, 192], FLECK = [210, 202, 180], TRIM = [236, 230, 212], TRIMD = [184, 176, 154];
  var WAIN = [66, 84, 64], WAINL = [84, 104, 80], WAIND = [46, 60, 44];

  // plaster above a painted beadboard wainscot, chair rail, crown and baseboard
  for (y = 0; y < 100; y++) for (x = 0; x < SW; x++) put(x, y, (x * 5 + y * 3) % 13 === 0 ? FLECK : PLASTER);
  rect(0, 0, SW, 3, TRIM); rect(0, 3, SW, 1, TRIMD);
  for (y = 104; y < 146; y++) for (x = 0; x < SW; x++) { var k = x % 8; put(x, y, k === 0 ? WAIND : (k === 1 ? WAINL : WAIN)); }
  rect(0, 100, SW, 3, TRIM); rect(0, 103, SW, 1, TRIMD);
  rect(0, 146, SW, 4, [46, 38, 30]); rect(0, 146, SW, 1, [70, 58, 44]);
  // prewar penny-ish mosaic floor: white tiles, grey grout, a scatter of black
  for (y = HALL.FLOOR; y < SH; y++) for (x = 0; x < SW; x++) {
    var tx = (x / 3) | 0, ty = ((y - HALL.FLOOR) / 3) | 0, grout = x % 3 === 2 || (y - HALL.FLOOR) % 3 === 2;
    put(x, y, grout ? [150, 150, 146] : ((tx * 3 + ty * 5) % 11 === 0 ? [44, 44, 46] : [226, 224, 216]));
  }
  // coir doormat
  rect(132, 152, 56, 9, [112, 82, 46]); rect(133, 153, 54, 7, [164, 124, 70]);
  for (x = 134; x < 186; x += 2) put(x, 155 + (x % 3), [138, 102, 56]);

  // door casing, jamb reveal
  rect(DX - 6, DY - 6, DW + 12, DH + 6, TRIM);
  rect(DX - 6, DY - 6, DW + 12, 1, TRIMD);
  for (y = DY - 6; y < DY + DH; y++) { put(DX - 6, y, TRIMD); put(DX + DW + 5, y, TRIMD); }
  rect(DX - 2, DY - 2, DW + 4, 2, TRIMD); rect(DX - 2, DY - 2, 2, DH + 2, TRIMD); rect(DX + DW, DY - 2, 2, DH + 2, [204, 196, 174]);

  // doorbell: brass plate, RDC nameplate card, round pearl push button
  cur = OBJ.bell;
  rect(205, 76, 17, 26, BRASSD); rect(206, 77, 15, 24, BRASS); rect(206, 77, 15, 1, BRASSL); rect(206, 77, 1, 24, BRASSL);
  rect(207, 79, 13, 9, [238, 232, 212]); rect(207, 87, 13, 1, [196, 188, 164]);
  "RDC".split("").forEach(function (ch, n) {
    GLYPHS[ch].forEach(function (row, gy) { for (var gx = 0; gx < 3; gx++) if (row[gx] === "1") put(208 + n * 4 + gx, 81 + gy, [44, 32, 22]); });
  });
  for (y = -3; y <= 3; y++) for (x = -3; x <= 3; x++) {
    var d2 = x * x + y * y;
    if (d2 <= 10) put(213 + x, 94 + y, d2 >= 5 ? BRASSD : (x + y < 0 ? [252, 250, 240] : (x + y > 1 ? [196, 190, 176] : [240, 236, 224])));
  }
  cur = 0;

  // door slab texture (64x120): navy with four recessed panels, brass peephole, knob, deadbolt and kick plate
  var tex = new Uint8ClampedArray(DW * DH * 3);
  function tput(x, y, c) { if (x < 0 || y < 0 || x >= DW || y >= DH) return; var i = (y * DW + x) * 3; tex[i] = c[0]; tex[i + 1] = c[1]; tex[i + 2] = c[2]; }
  function trect(x, y, w, h, c) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) tput(i, j, c); }
  var NAVY = [30, 46, 92], NAVYL = [52, 74, 130], NAVYD = [16, 26, 58], FIELD = [36, 55, 106];
  trect(0, 0, DW, DH, NAVY);
  trect(0, 0, 1, DH, NAVYL); trect(0, 0, DW, 1, NAVYL); trect(DW - 1, 0, 1, DH, NAVYD);
  [[6, 8, 22, 48], [36, 8, 22, 48], [6, 64, 22, 48], [36, 64, 22, 48]].forEach(function (pn) {
    trect(pn[0], pn[1], pn[2], pn[3], FIELD);
    trect(pn[0], pn[1], pn[2], 1, NAVYD); trect(pn[0], pn[1], 1, pn[3], NAVYD);
    trect(pn[0], pn[1] + pn[3] - 1, pn[2], 1, NAVYL); trect(pn[0] + pn[2] - 1, pn[1], 1, pn[3], NAVYL);
    trect(pn[0] + 3, pn[1] + 3, pn[2] - 6, pn[3] - 6, NAVY);
  });
  trect(30, 29, 3, 3, BRASS); tput(30, 29, BRASSL); tput(32, 31, BRASSD); tput(31, 30, [14, 12, 10]);
  trect(58, 49, 3, 3, BRASS); tput(59, 50, BRASSD);
  trect(58, 56, 3, 11, BRASSD); trect(57, 60, 5, 3, BRASS); tput(57, 60, BRASSL); tput(58, 60, BRASSL); tput(61, 62, BRASSD);
  trect(2, 112, 60, 6, BRASS); trect(2, 112, 60, 1, BRASSL); trect(2, 117, 60, 1, BRASSD);
  return { col: col, emis: emis, obj: obj, tex: tex };
}

function makeHallLight(mode) {
  var A = new Float32Array(SW * SH), G = new Float32Array(SW * SH), dark = mode === "dark";
  for (var y = 0; y < SH; y++) for (var x = 0; x < SW; x++) {
    var i = y * SW + x, b = BAYER[(y & 3) * 4 + (x & 3)];
    var dx = x - 160, dy = (y - 4) * 1.3, pool = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 190);
    A[i] = Math.floor((dark ? 0.42 + 0.62 * pool * pool : 0.8 + 0.26 * pool) * 10 + b) / 10;
  }
  return dark ? { A: A, G: G, at: [1.06, 0.96, 0.82], gt: [0, 0, 0] } : { A: A, G: G, at: [1, 0.99, 0.96], gt: [0, 0, 0] };
}

// The slab swings in on its left hinge (p 0..1), showing the living room through the doorway.
function drawDoor(h, col, emis, obj, p, peek) {
  var DX = HALL.DX, DY = HALL.DY, DW = HALL.DW, DH = HALL.DH, x, y, i;
  if (p > 0) for (y = DY; y < DY + DH; y++) for (x = DX; x < DX + DW; x++) {
    i = y * SW + x;
    var r = ((((y - DY) * 1.5) | 0) * SW + 112 + (((x - DX) * 1.5) | 0)) * 4;
    col[i * 3] = peek ? peek[r] : 20; col[i * 3 + 1] = peek ? peek[r + 1] : 18; col[i * 3 + 2] = peek ? peek[r + 2] : 16;
    emis[i] = 1; obj[i] = 0;
  }
  var ws = Math.max(3, Math.round(DW * (1 - p))), shade = 1 - p * 0.45;
  for (var c = 0; c < ws; c++) {
    var inset = Math.round(c / ws * p * 10), tc = Math.min(DW - 1, (c / ws * DW) | 0), hh = DH - 2 * inset;
    for (y = DY + inset; y < DY + DH - inset; y++) {
      var tr = Math.min(DH - 1, (((y - DY - inset) / hh) * DH) | 0), t = (tr * DW + tc) * 3;
      i = y * SW + DX + c;
      col[i * 3] = h.tex[t] * shade; col[i * 3 + 1] = h.tex[t + 1] * shade; col[i * 3 + 2] = h.tex[t + 2] * shade;
      emis[i] = 0; obj[i] = OBJ.door;
    }
  }
}

// ---- the bedroom (behind the apartment flag): window across the street, ladder bookshelf, mid-century desk with a
// green banker's lamp, wooden desk chair, and a black Fender Jazz Bass on its stand ----
var BFLOOR = 132;

// World map for the bedroom wall, 112x44 (Natural Earth 1:50m, rasterized), framed like the close-up: longitude
// -162..130, latitude 70..-44. "." is water, "#" land, and a letter a country Ryan has been to ("a" is PLACES[0]).
var WORLD = [
  "aaaaaaaafffffffffffffffffffffffffffff#...############...............#########..#.###############################",
  "aaaaaaaafffffffffffffffffffffff.#ffffff...#######....gggg..........#############################################",
  "aaaaaaaaffffffffffffffffffff#ff#ffffff....#####......#gg#........###############################################",
  "aaaaaaaaffffffffffffffffff#....#ffff##.....###...............#..#####.##########################################",
  "aaaa#....aaffffffffffffffff.....ffffff#....................#h#..#####.##########################################",
  "aa........aaffffffffffffffffff#fffffffff...................hhh...###..##########################################",
  "...........ffffffffffffffffffffffffffffff.................iihhh.#lllnnn#########################################",
  ".............ffffffffffffffffffffffffffff#................#.hhkklllmmnn#########################################",
  "..............aaaaaaaaaaaaafffffffffff#fff..................kkkkkll#############################################",
  "..............aaaaaaaaaaaaaaaafffffafff......................kkkkoo##############.##############################",
  "..............aaaaaaaaaaaaaaaaffaaa#.......................###kkk#oo#####.....###.##############################",
  "..............aaaaaaaaaaaaaaaaaaaa#.......................jj###..o.oo############..#############################",
  "...............aaaaaaaaaaaaaaaaaa#.................#......#j##.....o#.###########..##########################.##",
  "...............aaaaaaaaaaaaaaaaaa...........................######..........###############r################..##",
  ".................caaaaaaaaaaaaaa..........................##########..##...###############rrr################...",
  ".................#ccccaaaaaaaaa...........................################################rrr################...",
  "..................cccccca.....aa.........................########################.#######rrrrrrrrrr##########...",
  "...................cccccc......#........................############################....#rrrrrrrrrr##########...",
  ".b...................cccc..#c.###.......................####################.########...rrrrrrrr#####tt##u......",
  "..#..................#cccc#cc....###....................#####################.######......rrrrr#..#ss#t.#...#...",
  ".......................ccccc#...........................#####################.#####.......rrrr....##ssst....v...",
  "..........................####.........................##########################.........rrr.......ssst....vv..",
  ".............................#....##....................#######################..#.........rr....#..s#tt....vv#.",
  ".............................dd########..................#########################.........rr......#s.t....#.vv.",
  "................................#########.................#######################............#......s#.....##vv.",
  "................................###########......................#########p#####...................###...###....",
  "................................###########.......................########pp###.....................##..####...#",
  "...............................##############....................#########qq##......................###.###.##..",
  "...............................#################..................#######qqqq#.......................##..##.#..#",
  "...............................##################..................######qqqqq........................####......",
  "................................#################..................#######qqqq............................#####.",
  "................................################...................########qq#..................................",
  ".................................##############....................###########..##............................##",
  "..................................#############....................##########..##............................###",
  "...................................############....................#########...##...........................####",
  "...................................#ee########.....................#########...##.........................######",
  "...................................#eeee####........................########...#.........................#######",
  "...................................eeeeeee##........................#######...............................######",
  "...................................eeeeee##..........................#####................................######",
  "..................................#eeeee##...........................####.................................#####.",
  "..................................#eeeee#.................................................................##....",
  "..................................#eeeee#.......................................................................",
  "..................................eeeee.........................................................................",
  "..................................eeee.........................................................................."
];
// The map close-up: everywhere Ryan has been, by country, as [place, latitude, longitude].
var PLACES = [
  ["USA", [["Arcadia", 34.14, -118.04], ["Los Angeles", 34.05, -118.24], ["San Diego", 32.72, -117.16], ["San Francisco", 37.77, -122.42], ["Oakland", 37.8, -122.27], ["Seattle", 47.61, -122.33], ["Austin", 30.27, -97.74], ["St. Louis", 38.63, -90.2], ["Chicago", 41.88, -87.63], ["Nashville", 36.16, -86.78], ["Atlanta", 33.75, -84.39], ["Tampa", 27.95, -82.46], ["Orlando", 28.54, -81.38], ["The Keys", 24.56, -81.78], ["Pittsburgh", 40.44, -79.99], ["Washington, DC", 38.91, -77.04], ["Baltimore", 39.29, -76.61], ["Princeton", 40.35, -74.66], ["New York", 40.71, -74.01], ["New Haven", 41.31, -72.92], ["Boston", 42.36, -71.06], ["Portland, Maine", 43.66, -70.26]]],
  ["Hawaii", [["Kauai", 22.07, -159.5], ["Oahu", 21.47, -157.98], ["Maui", 20.8, -156.33]]],
  ["Mexico", [["Baja", 28.0, -113.5], ["Parral", 26.93, -105.67], ["Mexico City", 19.43, -99.13]]],
  ["Costa Rica", [["Papagayo", 10.6, -85.7]]],
  ["Argentina", [["Buenos Aires", -34.6, -58.38]]],
  ["Canada", [["Montreal", 45.5, -73.57]]],
  ["Iceland", [["Reykjavik", 64.15, -21.94]]],
  ["UK", [["London", 51.51, -0.13], ["York", 53.96, -1.08], ["Bath", 51.38, -2.36]]],
  ["Ireland", [["Dublin", 53.35, -6.26], ["Galway", 53.27, -9.05]]],
  ["Portugal", [["Lisbon", 38.72, -9.14], ["Porto", 41.15, -8.61]]],
  ["France", [["Paris", 48.86, 2.35]]],
  ["Germany", [["Berlin", 52.52, 13.4]]],
  ["Czechia", [["Prague", 50.08, 14.44]]],
  ["Poland", [["Warsaw", 52.23, 21.01], ["Łódź", 51.76, 19.46], ["Gdańsk", 54.35, 18.65], ["Kraków", 50.06, 19.94], ["Zakopane", 49.3, 19.95]]],
  ["Italy", [["Rome", 41.9, 12.5], ["Florence", 43.77, 11.26], ["Venice", 45.44, 12.32]]],
  ["Uganda", [["Kampala", 0.35, 32.58]]],
  ["Tanzania", [["Arusha", -3.37, 36.68], ["Zanzibar", -6.16, 39.2], ["Dar es Salaam", -6.79, 39.21]]],
  ["India", [["Delhi", 28.61, 77.21], ["Goa", 15.3, 74.12]]],
  ["Thailand", [["Bangkok", 13.76, 100.5], ["Chiang Mai", 18.79, 98.98]]],
  ["Vietnam", [["Hanoi", 21.03, 105.85], ["Saigon", 10.82, 106.63]]],
  ["Hong Kong", [["Hong Kong", 22.32, 114.17]]],
  ["Philippines", [["Manila", 14.6, 120.98], ["Boracay", 11.97, 121.92]]]
];
// Map for the close-up (Natural Earth 1:50m, rasterized): 3px per degree, longitude -162..130, latitude 67..-39.
// Each pixel is 0 for water, 1 for land, or 2 + the PLACES index of a country Ryan has been to (Hawaii apart from
// the mainland; mainland France only). Rows split on "|"; each run is a base-36 value and a two-digit base-36 length.
var ATLAS = { w: 876, h: 318, lon0: -162, lat0: 67, k: 3, rle: "21r74x00r70z00o11m03z12b00912a00514q|20300121n74v00q71200n11m00y80200h80302e11q00210100110h00410200512800414t|00121q74l00370400170100q70m00270d00p11i01080700380100280200180200180802911u00910700517e|21r74k00170400170300s70j00670a00r11f01180800380i02811v00h17h|21r74c00170500270600l70200770m00570600w11301a80w02610t00910t00f17j|21r74i00270900h70x00570500x11201f80s02410t00b10s00310100210300717i|21r74h00370c00c71201410z01e80v02110w00910w00510600417i|00221p74g00470e00b70a00170s01211001i80o02310w00810x00617r|00321o74f00570e00270100b70100b70o01310y01j80k02510x00811200517o|00321o74900970a00370700n70p01210x01i80i02710x00718x|21r74700b70100370400870300670300170200e70b00170b01310v01q80702710z00718z|21r74700f70300j70300h70c00270701510t04310y007192|21r74600m70500w70d00370401710q04110z009192|21r74300o70500d70500670200970100370900470201610p040110009193|21r74100r70200870300370h00c70801d10n02w10300y11200b192|21r74001270300470i00g70200270201a10m02x10100z11100c192|21r73y01c70i00j70201a10l02y10100z11100c192|21r73x01c70l01v10i03y11200c192|20v00120c00220h73w01b70s01r10h03h90100h11100c192|20u00220b00320h73w01e70o00470200870201j10903g90200i11300a192|20t00220e00720h73p01f70o00470100970201l10703g90200i11500310200510a00b18f|20s00220800420200820100920873o01770100770o00d70401n10204211600s18h|20p00520600v20470620473d01e70q00b70605q11500h10900218i|20o00620301020470320673c01d70s00a70705090300m10g00110o00e18w|20400120l01a20b73c00170101970v00670a04z90200o10c00510k00d10300118w|00820200320c00220201820c73e01870v00370d04p90100390600q10a00710h00f10400118v|00d20b00220401a20a73d01a71a04l90300390600t10600910g00g10200518t|00d20800320501b20b73d01b71a04k90100390601a10f00510200g18t|00c20700320701d20a73d01170100971904j90100190f00y10300410e00410300810400418t|00a20700520601e20600120473c00270401571a04h90200190e00w10600410f00310200810600218u|00820700920101j20a73m01071a04m90b00w10600610e00c193|00620700920201l20100120973m00p70300671904m90b00w10900510c00d193|00420701y20100120c73k00n70400671b04l90a00w10700610b00f193|20800b20101t20b73n00j70200771e04i90d00u10700310900k193|20502820b73q00n71g04j90d00u10700110400210400k193|00320502520b73z00c71m048a0490300390b00u10300110300110300710100i193|02f20300320274100871t043a0490500190c00td0500210500gf03004196|02l74200871v042a0290800590900sd05002d01003d04008f08001f03195|02f70400474000971u03xa08901a0290300310100390a00qd07002d07003f0q18v|02f70400374200871x03va0b00a90900pd0if0s18v|02f70300474200971x03ta0d00490100390b00h103d0mf0s18v|02g70300574300671y03ua0b00490f00d101001105d0mf0t18u|02h70200773y00170300571y03ua0b00490j009107d0mf0t18u|02i70200773y00971x03ta0c00590i009106d0of0r18v|02j70200873x00570100271x03sa0c00590j008107d0of0r18v|02t73z00571x03ta0800790k008106d0qf0r18v|02t74000271x00170303sa0300e90g007108d0rf0q18v|02v75s00470404a90h00410ad0rf0r18u|02t75s00570400170104890h002c05108d0oe04f0q18u|02t75r00570404a90500ec07107d0le0af0o18t|02u75600870100270600870504790300290100fc09101c01103d0je0gf0i18v|02w70700174t00770500f70700470104jc0f102d0je0jf0d18x|02y70700174q00b70500b70e04bc03003c0jd0je0jf0b18y|03070700174m00470700370500a70f04bc0rd0he0g104f01106f0318x|03270600122d72600370b00g70f046c02004c0td0he04101e0819c|03470422k71z00170d00g70i040c13d0h101e0219m|03422r70920271j00170e00h70h042c11d0g19r|03423471x00f70k041c10d0g19r|03523671t00870200670200570100270a045c0wd02103d08102d0119r|03523871d20470900970100h703002705047c0s1a9|03523a71920770900170100970200d702003701001702048c0r10bg0612200411000816f|03623a71820770900170700370204vc0q10ag0b11g00210c00610z00b16f|03623c71520870b00170400370504vc0p103g02101g0e11f00310a00910x00c16f|03623d71420870f00270604wc0pg0k11e00910500810w00e16f|03623f71120970l04yc0pg0i00211c00910800210100410t00g16g|03623g70y20c70500270c04zc0pg0g00411c00b11600c16k|03623h70l20p70100370a053c0pg0h00310100111a00c10500610t00c16l|03623h70k20o004709056c0pg0g00711700d10300b10q00b16n|03523i70i20m008706059c0rg02003g0a00711500u10q00a16m|03523i70h20m009705059c0sg01006g0a00611400w10o00b16l|03523i70a20q00e70104r10a003102005c0q00ag0a00711200x10n00c16k|03423j70a20p05410nc0f006c0400bg0b00710z01110m00c16j|03423j70a20p05410pc0d00hc02001g0c00810100110w01310k00e16h|03423i70820s05510wc0500gc03004g0a00c10s01510k00e16g|03523g70620v055102b0110y00gc03006g0900d10r01510k00d16g|03523g703210053b0810s00hc03007g0d00910q00e10800j10l00b10200316c|03524i054b0910p00jc02009g0b00a10r00a10e00f10n00g16a001|03524a00120205ab0610p00mg0200ag0c00711i00a10p00h169001|03524c05bb0610n00lg0500dg0b00510h00110600611o00g169001|03524805eb0710m00ng0500eg0b00310e00710300110100211s00815o00510l002|03524705fb0610m00og0400gg05003g0300210a00210200510100111y00915n00510k004|03624605fb0610l00810200210100cg0400ig03004g0100410a00610100211y00c15j00510800110b006|03624503lb0101tb0610l00810300fg0400jg0300810a00911y00c15i006104008107007|03624405gb0710k00qg0400jg0400910900110100611x00e15g008102009107007|03724203zb0101gb0810l00410100lg0100lg0300b10900911v00f15b00a10200a109006|03824103vb0201kb0610l01cg0300b10100110a00511x00f15b00m10b004|03923w00120305ib0610j014g03002g0600c10100210a00511w00f15e00i10c004|03a23v001202044b0301cb0510k013g0900g10800110100210100511v00f15f00510100c102001109003|03a23v00120105kb0510k014g0800i10600510100511v00e15f00310700d108002|03b23u05mb0510h00w10400ag0500j10400710100511x00b15q00c108002|03c23u05t10d00f10600210g00ag0300j10400c10100211x00610200115n00d10b001|03c23v05s10500h10u01i10500410700517300g10a001|03d23u05t10200h10v01f10200410100710400617300i108002|03d23v05s10200e10y00b10101r17100k109001|03f23r05u10300b11101210200810100p13ij0113h00k109002|03f23q05u11g01210800i10500613fj0313g00l109002|03g23p05u11g01s104006137j01106j0613f00k108004|03g23m05w11g023136j0g13f00i103009|03k23h05x11e025136j0g13g00t|03m23e05x11g001101021138j0f13h00s|03o23905x11l021138j0f13h00h102009|03q23705v11p01y139j0g13h00g101008102|03q235057b0200n11x00l10501113aj0f13h00n101002101|03q10140722w05w12100g10900z13bj0e13i00q|03r40a22r05y12200e10c00w13dj0b13l00p|03s40c22n05y12300e10f00t13bj0e13l00o|03s40600140820a40622405x12500d10k00b10500713cj0e13k00p|03t40500440n22105y12900910o00510900113gj0f13j00p|03t40500440o22005y12d00514ij0j13g00p|03u40400540o21z05z12d00314jj0k13d00r|03u40500440p21b00220100620e05z14w001121j0m13e00p|03v40400540o20640221200120100920400220705y14v00611xj0m13h00n|03w40600240p20540520k00620900i20705w14v00811vj0m13h00o|03y40500140r20240720h00b20200120100120200i20605m10100913l00111a00711vj0m116j0612500o|03y40500141020g01220605810100b10100813n00111a00811sj0o114j0912300p|03z40400440y20d01420705710100b10100715000711rj0r110j0b12300p|03w40100240500440y20a01520805910300210100a13s00111900811qj0s10lj0110cj0e12000n101002|03x40700540y20801620805e10100713w00110100311500811jj1110hj03108j0h11z00r|03y40700540y20701720705l13x00511600911gj1810bj03108j0g11z00s|03z40700540x20601820805k13y00511600911ej1a10aj03109j0d101j0111y00t|04040700540w20601920700610105c13z00611600b108002111j1d107j05101j0h12200t|04340500640v20601820700810105914000711600d101006113j2412200n101006|04440400640x20401920600810105814200611700g102001113j1j101j0k12100o101006|04540400441201a20505g14400611500210200d101003112j1j104j0g12200v|04540400541001c20305h14400611500110300c102007110j1j102j0g12300u|04540500740x01c20305g14600611800a10400e10500c10cj1j103j0e12200610200o|04540500740x01d20100710200410105314600711700910500v10dj1g10bj0812100610300o|04640400840v01m10200610105014800611600910700w10aj1h10bj0712100610400o|04840500740t01n10100610104z14a00611700110300110a00v104j1o108j0911z00710400p|04940400840s01o10105414b00811m00u101j1q107j08101j0111y00710500p|04b40300840r06t14b00911p00sj1p107j03101j0311z00910500p|04b40300940q01a10300110105d14c00911p00tj1p107j02101j0310yl0310x00a10400q|04c40100a40q01610c00g10104t14d00911p00tj1o10aj0310rl01102l01101l0810s00c10400q|04p40o01410400310800210105514f00811r00tj1m10aj0310ql0e10mm0100i10200r|00730104h40o01410300410d05214h00711q00sj1o106002102j0310rl0d10l001m0100j10100r|00530100130104h40o01310100410100710900g10104k14i00611q00tj1n10200110100410wl0f10h01f|00b30204d40o00q40600b10100c10505014i00611p00vj08001j1800e10wl0g10100210801j|00e30204a40o00l40b00o10900610204o14j00511o00xj06002j1700f10wl0f00610301m|00f30304740q00j40c00p10804x14i00611m00zj03004j1700g10wl0d00710201n|04p40q00j40c00s10804u14i00711m015j1700h10zl0700910301m|00i30104640r00i40a00u10a04t14h00811i018j1600i10jk0510cl0501z|00i30304540r00h40a00t10200410100610300210404i14h00a11f019j1500l10ek01101k0610cl0400a10501l|00i30404440r00h40a01710a04f14i00a11f019j1200p10ck0b108l0600810701l|00i30204740r00f40b01810b04e14h00b11f018j1100q10ck0b108l0500910601m|04u40p00c40c01710100110c04d14i00a11d01aj1000r10ck0b10al0300910600xn0100o|04v40r00340i00s10400810i00310400410104014j00a11a01cj0z00u109k0c106k01104l0300810500vn03001n0100n|04w41810200t10600710100110700b10500710103x14j00a11901dj0x00v10ak0b102k01102k04103l03016n0600n|05041310300v10200110100e10104m14k00911601gj0w00w10ak0a101k09104l03015n0600n|05140w10806114l00911401hj0u00z10ak0k103l03015n0600n|05340u10802710103110100q14m00a11301hj0t00z10bk0l104l02014n0700m|05640s10706014n00710100210x01nj0r010108001103k0k104l03013n0700m|05840r10602810103310100m14o00a10u01qj0r010107002103k0k105l03012n0600n|05b40o10502810203710100i14o00a10t01rj0o012106004104k0k105l0400yn0700o|05e40500640610a00110b05n14o00210100710t01sj0m015103006102k0m104l0500xn0600p|05q40410p05l14p00910s01tj0k01g102k0m105l0400yn0500p|05r40310q04y10100110100i14s00710q01vj0k01g101k0n105l0500xn0500p|05s40210q01u10103n14u00710m01zj0j01g101k0n105l0500xn0600o|05t10r01v10103n14v00510j023j0i01h101k0m105l0600xn0400p|05v10p05j14w00410i024j0i01h102k0d10dl0600yn0700l|05z10l01v10103o14w00410d029j0h01h103k0b10el0600wn01001n0b00h|06110j05k14x00310b02bj0h01i102k0b10el0600xn03001n03001n02001n0100h|06410200110d01u10100410103j14z00210702fj0h011j0100g102k03002k0510fl0600xn04004n0300i|06710d05j15000110502hj0h011j0100h101k03002k0610el0700xn03004n0400h|06810c00z10104j15100u10301qj0g011j0100g103k02006k0210el0600zn02001n02001n0700e|06910a00z10300210104h14z02nj0f012j0100h102k02007k0110dl0700vn02002n01005n03001n0400d|06a10900y10300310204g14z00l103020j0e011j0200g103k02008k01109l0a00vn01006n01004n01002n0300d|06b10800w10300510504f14x00j105021j0d012j0100h102k0100a108l0b00vn01006n04003n0400d|06c10150110500s10800210804c10200114x00b10b022j0d01k101k0200a109l0800wn01007n03002n01001n0400d|06c50700p10l00l10103u14x00510200110e021j0d011j0100g102k0300a101001104l0a00xn01007n06001n0300e|06d50700n10t00510600210203v15i022j0c011j0100h101k0200d102l0a00yn03006n07001n0200e|06c50900m10c00110i00110800210203w15g023j0a01l101k0200gl0700zn0200an05001n0300d|06d50900l10b00310t03z15e023j0a00210101ik0300gl0600zn0200an07002n0300b|06g50610100810300910c00210u03y15e024j0800310201hk0300gl0600yn0200bn03006n0200c|06i50410100610700510e00110w03y15c025j0800310301gk0500el0400zn0200dn03005n0300b|06j50310900210400311b03z15c026j0500510301fk0600el02010n0200kn0500b|06j50310900310400111f03w15b027j0500510401ek0701fn0100gn03001n0600b|06l50100110600611l03v159029j0300510600yj0200ek0601un0d00a|06p10500511m03u15902h10601ek01001k0401tn0e00a|06o10100210300511n03t15802i10601gk0501sn05001n0800a|07011n03v15502i10700zj0100gk0401d10100dn02005n0800a|07111n03v15302j10700zj0100hk0601910200kn05001n0100b|07211n03w15102k10501i101k0601710400cn02005n05001n0100b|07111p03w11100913p02l10401l102k0310101510500an01008n0500d|07211y03o10x00c13o04a102k03102014107008n0100an0300d|07212103m10t00f13n03v10300d10801110b00x|07212203m10q00i13l03x10700810901010c001n0200t|07212403m10700c10200l13l03x10800710900y10b00z|07212503n10301210800113a03z10800710900v10e00y|071127051122h0111504110700710900d10100g10d00q101009|07212704z10100111th01101h01101h0611304310700610800e10100f10d011|07212704y10200211rh0c11104610700510800t10d00n10100d|07112805311qh0c11004810700510700s10e011|07012a05111rh0c10z04410100410800410700o10i011|06y12c05111rh0d10x04b10800410700m10k00v101004|06y12d05011sh0c10w04d10a00210600m10k00u102004|00d10106j12f04z11sh0c10u04h10900310500f10200310l00t101006|06x12f04y11sh0d10t04d10100410b00310300e10s00j102006102001101004|06w12g04y11qh0e10s04g10100410b00410200d10u005103008102007104004|06u12h05011ph0d10s04i10100310d00310100d10r00110200310e008103005|06u12i04y11ph0e10r04n10e00g10q00710e008104004|06u12j04o10100811ph0d10r04p10d00g10q00610200m101006|05v10200w12n04u11ph0d10q04r10c00210200c10q00610100n101006|05v10200110100t12g00210704s11qh0d10p04o10100410b00210100d10q00610100510100f102001101005|05v10300310100q12u04m11qh0e10p04u10a00h10p00610200510400d102005|06r12p00110704l11ph03i0c10n04q10100410c00f10n00710400210400110100k|06r13004i11qh01102i0d10k04r10200410c00210200c10k00810900110300b102006|06r13104i11si0f10h04y10c00210300b10k00810700810600a101|06r13204h11si0h10e04z10d00210200b10k00710800c10100c|06s13200110304d11qi0j10c05110h00310100610k00710900o|06t13d04611pi0l10904z10100310g00210300510j00710600110400i102001101001|06u13e04511pi0l10805010100210e00510200a10400110900710500210400b103002107|06s13i04411ni0m10705610c00h10100710600810400110500b104003101004|06r13k04411mi0n10605710b00q10300110100910300210500c101009|06q13m04411ki0q10305910a00q10100e10200310600k|06q13n04411hi0t10105b10901510200310600k|06q13p04211hi0u05c10801410300410100110200l|06q13u03y11gi0u001i0105b10701410300410100110200l|06r13t03y11gi0t05f10601410300610200l|06r13u03y11fi0u05f101024|06r13u03y11fi0v05i10701110100s|06t13s03y11gi0u05i10900610101l|06u13r03z11gi0s05i10l00210301c|06v13r03y11hi0s05k10m01d|06v13r03z11gi0r05n10i01f|06w13q03z11gi0t05u10d00y103009101|06x13p04011gi0q05y10f00510300d10100410200f|06x13o04111gi0q06710300110200110500110300110d001101003106008|01t10105413n04011ji0p06d10900310600910500a|06y13m04111li0n07210500c|06z13k04211oi0k06m10400a10400f|01w10105213k04311ri0h06m10400910400f|06z13j04411ri0i06n10200810300h|07013h04611qi0j06r10100o|07113e04811ri0g10206v10100k|07113e04811ri0e10407g|07213c04911ri0a10807g|07213b04a12907g|07313a04a12900b10100d10106q|07313904a12a00o10306p|07413804912b00d10100b10306o|07513504a12c00o10406o|07513404a12d00n10506o|07513404a12d00l10806d102007101|07513404a12d00m10706b105005102|07613304a12d00l108069108004102|07713204912f00j10906810d001101|07813104912e00j10b06610g|07913004912e00h10c06610h|07b12z04712e00g10c00110106610h|07d12w04812d00e10g06710h|07f12u04812c00e10h06410k|07h12s04812b00f10h06210200110j|07i12r04812900g10h06110400110j|01110106i12p04812600j10h06110o|01210106h12o04912400l10h06110o|07m12l04a12400l10g06310n|07n12k04b12200m10g06110p|07n12k04c12000n10g06110p|07n12k04d11x00q10e06110q|07n12k04d11w00r10e06010r|07n12j04f11u00s10e05y10t|07n12j04f11t00t10d00q10105310y|07n12i04h11s00s10e00q101050111|07n12h04i11t00r10e00k101052115|07n12h04j11t00p10e00l10204z117|07n12g04k11t00o10f05l118|07n10c60112304l11s00o10f05j11a|07n10b60610260411t04m11r00o10e05h11d|07n10a60e11q04o11s00n10e05h11d|07n10960g11o04p11s00n10e05h11d|07m10a60h11h04v11s00o10c05i11d|07m10a60j11c04y11r00p10c05i11d|07m10a60k11a04z11s00o10c05h11e|07m10860p11305311s00o10b05i11e|07m10660t11005511q00p10b05i11e|07m10660v10w05711o00s10a05j11d|07m10660x10t05811l00w10705l11d|07m10660y10860210h05911j01010205p11c|07m10660x10960310g05a11h06p10200111c|07m10660w10a60310g05a11i06p11e|07m10660w10960410f05b11i06p11e|07l10860u10960510f05b11i06q11d|07l10660w10860510g05c11h06q11d|07l10661810i05b11g06s11c|07k10661710k05c11f06s11c|07k10561710k05e11e06t11b|07k10561610l05f11c06u11b|07k10461510m05h11a06w11a|07j10561510l05i11906x11a|07k10461410l05k11706z119|07k10461310l05l116070119|07j10561210m05m115070119|07j10461210k00110105n114071119|07j10461210j00110105p112072119|07j10361310i00110205p111074118|07j10361210i00210105r10z076117|07j10361210j05t10y077113004|07j10461110i05v10w078110007|07j10461110h05w10v07910u00d|07j10461110h05u10w07a10s00f|07j10461010h05w10t07c10q00h|07j10560z10g05y10r07c10q00i|07i10660z10f05z10m07g10q00j|07i10660z10e06010b00710207i10e00v|07i10561000210b06310507x10b00w|07h10661200310606710108010700z|07h1056140fm|07g1066150fl|07g1076130fm|07f1076150fl|07f1066170fk|07e1066180fk|07d1076180fk|07d1076170fl|07d1076160fm|07d1086150fm|07d1086130fo|07e10660z0ft" };

function makeBedroom(mode) {
  var col = new Uint8ClampedArray(SW * SH * 3), emis = new Uint8Array(SW * SH), obj = new Uint8Array(SW * SH), cur = 0;
  var ox = 0; // shifts a whole piece of furniture into place
  function put(x, y, c, e) { x = Math.round(x + ox); y = Math.round(y); if (x < 0 || y < 0 || x >= SW || y >= SH) return; var i = y * SW + x; col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; emis[i] = e ? 1 : 0; obj[i] = cur; }
  function rect(x, y, w, h, c, e) { for (var j = y; j < y + h; j++) for (var i = x; i < x + w; i++) put(i, j, c, e); }
  function ellipse(cx, cy, rx, ry, fn) { for (var y = -ry; y <= ry; y++) for (var x = -rx; x <= rx; x++) if (x * x / (rx * rx) + y * y / (ry * ry) <= 1) fn(cx + x, cy + y, x, y); }
  var night = mode === "dark", x, y, i, r = rng(night ? 23 : 17);

  // dusty blue plaster, wood crown, white baseboard, oak plank floor
  for (y = 0; y < BFLOOR; y++) for (x = 0; x < SW; x++) put(x, y, (x * 5 + y * 7) % 13 === 0 ? [168, 181, 188] : [178, 190, 196]);
  rect(0, 0, SW, 3, C.teakD); rect(0, 3, SW, 1, C.teak);
  rect(0, BFLOOR - 5, SW, 4, [236, 230, 212]); rect(0, BFLOOR - 1, SW, 1, [184, 176, 154]);
  var OAK = [176, 128, 82], OAKL = [196, 148, 98], OAKD = [148, 104, 64], SEAM = [112, 76, 44];
  for (y = BFLOOR; y < SH; y++) {
    var row = ((y - BFLOOR) / 4) | 0, ry = (y - BFLOOR) % 4;
    for (x = 0; x < SW; x++) {
      var off = (row * 37) % 60, plank = ((x + off) / 60) | 0, pxp = (x + off) % 60;
      var c = ry === 3 || pxp === 0 ? SEAM : [OAKL, OAK, OAKD][(plank + row) % 3];
      if (ry !== 3 && pxp !== 0 && (x * 7 + y * 13) % 29 === 0) c = OAKD;
      put(x, y, c);
    }
  }

  // Ryan's rug on the floor in front of the desk, widening toward the viewer; the chair stands on it and it tucks
  // under the bed. Cream field of coral, blue and gold flowers on green leaves; blue bands around a cream border of
  // pink roses and green sprigs
  var RY0 = 134, RY1 = 176, RCR = [236, 228, 206], RBL = [78, 108, 176], RBD = [60, 86, 150], LEAF = [74, 130, 92];
  var FLOWERS = [[214, 96, 72], [110, 140, 206], [214, 170, 90]], ROSE = [226, 150, 140];
  for (y = RY0; y <= RY1; y++) {
    var rt = (y - RY0) / (RY1 - RY0), rs = (y + 200) / (RY0 + 200), rl = 160 - 132 * rs, rr = 160 + 24 * rs, rw = rr - rl;
    for (x = Math.ceil(rl); x <= Math.floor(rr); x++) {
      var ru = (x - rl) / rw, bu = Math.min(ru, 1 - ru) * rw, bv = Math.min(rt, 1 - rt) * (RY1 - RY0) * 1.6, rd = Math.min(bu, bv), rc;
      if (rd < 1) rc = RBD;
      else if (rd < 2.5) rc = (x + y) % 3 === 0 ? RCR : RBL;
      else if (rd < 6.5) { var bm = (x * 7 + y * 3) % 9; rc = bm === 0 ? ROSE : (bm === 4 ? LEAF : RCR); }
      else if (rd < 8) rc = (x + y * 2) % 4 === 0 ? RCR : RBL;
      else {
        // flower clusters on a staggered grid: a blossom, a stem and a pair of leaves per cell
        var cy2 = Math.floor(rt * 6), fv = rt * 6 - cy2, uu = ru * 16 + (cy2 % 2) * 0.5, cx2 = Math.floor(uu), fu = uu - cx2;
        var dxu = (fu - 0.5) * (rw / 16), dvv = (fv - 0.32) * ((RY1 - RY0) / 6);
        rc = RCR;
        if (dxu * dxu + dvv * dvv <= 2.2) rc = FLOWERS[(cx2 * 7 + cy2 * 13) % 3];
        else if (Math.abs(dxu) < 0.6 && fv > 0.45 && fv < 0.92) rc = LEAF;
        else if (fv > 0.55 && fv < 0.82 && Math.abs(Math.abs(dxu) - 1.7) < 0.75) rc = LEAF;
        else if ((x * 5 + y * 11) % 23 === 0) rc = ROSE;
      }
      put(x, y, rc);
    }
  }

  // framed world map over the desk: the countries Ryan has been to filled in, and a pin in every city
  cur = OBJ.map;
  var MX = 80, MY = 10, OCN = [150, 186, 196], OCNL = [164, 198, 206], LND = [226, 210, 160], LNDD = [196, 176, 124];
  rect(MX - 2, MY - 2, 116, 48, [120, 80, 44]); rect(MX - 2, MY - 2, 116, 1, [160, 112, 66]); rect(MX - 1, MY - 1, 114, 46, [236, 230, 212]);
  var VIS = [150, 180, 116], VISD = [110, 142, 84];
  var cell = function (mx, my) { return my >= 0 && my < 44 && mx >= 0 && mx < 112 ? WORLD[my][mx] : "."; };
  var landAt = function (mx, my) { return cell(mx, my) !== "."; }, been = function (mx, my) { var c = cell(mx, my); return c !== "." && c !== "#"; };
  for (y = 0; y < 44; y++) for (x = 0; x < 112; x++) {
    // the countries Ryan has been to are filled in green, edged darker where they meet the sea or other land
    if (been(x, y)) put(MX + x, MY + y, been(x - 1, y) && been(x + 1, y) && been(x, y - 1) && been(x, y + 1) ? VIS : VISD);
    else if (landAt(x, y)) put(MX + x, MY + y, landAt(x - 1, y) && landAt(x + 1, y) && landAt(x, y - 1) && landAt(x, y + 1) ? LND : LNDD);
    else put(MX + x, MY + y, (x + 1) % 17 === 0 || (y + 7) % 17 === 0 ? OCNL : OCN);
  }
  // a pin in every city
  PLACES.forEach(function (c) { c[1].forEach(function (pl) { put(MX + Math.floor((pl[2] + 162) * 112 / 292), MY + Math.floor((70 - pl[1]) * 44 / 114), [214, 52, 44]); }); });

  ox = 111; // the bed's on the right, the window above it
  // window above the bed: across the street, a brick building (lit windows at night)
  cur = OBJ.bwindow;
  rect(96, 18, 63, 52, C.teak);
  var GX0 = 99, GX1 = 156, GY0 = 21, GY1 = 67, ROOF = 32;
  for (y = GY0; y < GY1; y++) for (x = GX0; x < GX1; x++) put(x, y, night ? mix([10, 14, 30], [36, 32, 54], (y - GY0) / 12) : mix([136, 182, 204], [214, 224, 214], Math.min(1, (y - GY0) / 12)), true);
  var BR = night ? [52, 30, 28] : [156, 82, 60], BRD = night ? [40, 24, 22] : [130, 66, 48], MORT = night ? [62, 52, 50] : [196, 176, 160];
  rect(GX0, ROOF - 2, GX1 - GX0, 2, night ? [40, 40, 44] : [112, 112, 114], true);
  for (y = ROOF; y < GY1; y++) for (x = GX0; x < GX1; x++) {
    var brow = ((y - ROOF) / 3) | 0, bo = brow % 2 ? 3 : 0;
    put(x, y, (y - ROOF) % 3 === 2 || (x + bo) % 6 === 0 ? MORT : ((x * 3 + brow) % 7 === 0 ? BRD : BR), true);
  }
  for (var wy = ROOF + 4; wy < GY1 - 10; wy += 15) for (var wx = GX0 + 4; wx < GX1 - 8; wx += 13) {
    var lit = night && r() < 0.55, TR = night ? [70, 64, 60] : [214, 206, 192];
    rect(wx - 1, wy - 1, 9, 12, TR, true); rect(wx, wy, 7, 10, lit ? [244, 206, 128] : (night ? [20, 22, 30] : [80, 104, 118]), true); rect(wx, wy + 5, 7, 1, TR, true);
    rect(wx - 2, wy + 11, 11, 1, night ? [84, 78, 74] : [232, 226, 214], true); // stone sill
  }
  rect(127, GY0, 2, GY1 - GY0, C.teak);
  rect(93, 70, 69, 3, C.teakL);

  ox = -94; // far left
  // ladder bookshelf, like the living room's but without the drawer cabinet: four shelves
  cur = OBJ.bshelf;
  var WAL = [132, 82, 44], WALL2 = [168, 112, 64], WALD = [88, 52, 26];
  var BK = [[51, 66, 50], [201, 166, 70], [138, 90, 52], [74, 106, 82], [176, 60, 44], [233, 221, 184], [31, 42, 30], [62, 38, 20], [226, 196, 72], [70, 120, 140], [240, 236, 226], [150, 70, 96]];
  function railL(yy) { return Math.round(104 - (yy - 28) * 0.04); }
  function railR(yy) { return Math.round(146 + (yy - 28) * 0.04); }
  // packed tight: spines edge to edge, a stack lying flat at one end, and more books laid flat across the tops
  // wherever the row dips
  var spine = function (bc, x0, y0) { if (r() < 0.6) put(x0, y0, bc === BK[5] || bc === BK[10] ? [60, 60, 60] : C.goldL); };
  var flat = function (x0, y0, w) { var bc = BK[Math.floor(r() * BK.length)]; rect(x0, y0, w, 2, bc); put(x0 + 1 + Math.floor(r() * (w - 2)), y0, bc === BK[5] || bc === BK[10] ? [60, 60, 60] : C.goldL); };
  function books(base, room, stackLeft) {
    var x0 = 107, x1 = 143, sw = 9, vx0 = stackLeft ? x0 + sw : x0, vx1 = stackLeft ? x1 : x1 - sw, xx = vx0, hs = [];
    while (xx < vx1) {
      var w = Math.min(vx1 - xx, 2 + Math.floor(r() * 2)), h = room - 5 + Math.floor(r() * 5), bc = BK[Math.floor(r() * BK.length)];
      if (vx1 - xx - w === 1) w++;
      rect(xx, base - h, w, h, bc); spine(bc, xx, base - h + 2 + Math.floor(r() * 3));
      for (var k = 0; k < w; k++) hs.push([xx + k, h]);
      xx += w;
    }
    // the flat stack fills its end of the shelf nearly to the shelf above
    var sx = stackLeft ? x0 : x1 - sw, sy = base;
    while (base - sy + 2 <= room - 2) { var ww = sw - Math.floor(r() * 2); sy -= 2; flat(sx + (stackLeft ? 0 : sw - ww), sy, ww); }
    // books laid across the tops of shorter runs
    for (var i = 0; i + 8 <= hs.length; i += 9 + Math.floor(r() * 5)) {
      var mh = 0; for (k = i; k < i + 8; k++) mh = Math.max(mh, hs[k][1]);
      for (var ty = base - mh - 2; ty >= base - room; ty -= 2) flat(hs[i][0], ty, 8);
    }
  }
  books(48, 19, false);
  books(70, 18, true);
  books(92, 18, false);
  books(114, 18, true);
  books(BFLOOR - 1, 13, false); // and a row on the floor under the bottom shelf
  for (y = 28; y < BFLOOR; y++) { var lx = railL(y), rx = railR(y); put(lx, y, WALL2); put(lx + 1, y, WAL); put(rx - 1, y, WAL); put(rx, y, WALD); }
  [48, 70, 92, 114].forEach(function (sy) { for (x = railL(sy) + 2; x < railR(sy) - 1; x++) { put(x, sy, WALL2); put(x, sy + 1, WAL); put(x, sy + 2, WALD); } });

  ox = -78; // desk, Apple II, banker's lamp and chair in the middle
  // mid-century walnut desk: thin top, two-drawer apron, splayed tapered legs
  cur = OBJ.desk;
  var DW = [154, 98, 54], DWL = [186, 128, 76], DWD = [108, 66, 34];
  // legs: a steady 2px wide, splaying out just two pixels over their length (fewer steps reads cleaner), tapering
  // at the foot; the desk stands out from the wall, so the back pair (darker, inset) reaches the floor just past the
  // baseboard and the front pair comes down onto the rug
  for (i = 0; i < 33; i++) {
    var lo = (i / 12) | 0;
    if (i < 28) { put(172 - lo, 107 + i, DWD); put(251 + lo, 107 + i, DWD); }
    if (i < 30) { put(164 - lo, 107 + i, DW); put(165 - lo, 107 + i, DWD); put(258 + lo, 107 + i, DW); put(259 + lo, 107 + i, DWD); }
    else { put(164 - lo, 107 + i, DW); put(259 + lo, 107 + i, DW); }
  }
  rect(160, 96, 104, 1, DWL); rect(160, 97, 104, 1, DW); rect(160, 98, 104, 1, DWD);
  rect(162, 99, 100, 8, DW); rect(162, 106, 100, 1, DWD); rect(211, 100, 1, 6, DWD);
  for (y = 100; y < 106; y++) for (x = 163; x < 261; x++) if (x !== 211 && (x * 7 + y * 3) % 13 === 0) put(x, y, [140, 88, 48]);
  put(186, 102, [214, 180, 120]); put(236, 102, [214, 180, 120]); put(186, 103, [150, 112, 60]); put(236, 103, [150, 112, 60]);
  // on the desk: a notebook and a mug
  rect(205, 94, 13, 2, [240, 236, 226]); rect(205, 95, 13, 1, [200, 196, 186]); put(211, 94, [176, 60, 44]);
  rect(220, 90, 5, 6, [226, 216, 190]); put(225, 92, [226, 216, 190]); put(226, 93, [226, 216, 190]); rect(221, 90, 3, 1, [90, 60, 40]);

  // Apple II: beige case with its built-in keyboard and rainbow logo, a Disk II drive on top, and a monitor with a
  // green phosphor screen showing the ] prompt
  cur = OBJ.apple;
  var BG = [214, 202, 170], BGL = [234, 224, 196], BGD = [168, 154, 122], KEY = [86, 72, 60];
  rect(163, 85, 39, 11, BG); rect(165, 85, 35, 1, BGL); rect(163, 95, 39, 1, BGD); rect(201, 86, 1, 9, BGD); rect(163, 86, 1, 9, BGL);
  for (x = 166; x < 199; x += 2) { put(x, 89, KEY); put(x + 1, 91, KEY); }
  rect(176, 93, 13, 1, KEY);
  [[166, [98, 178, 80]], [167, [244, 200, 64]], [168, [236, 128, 48]], [169, [214, 64, 64]], [170, [150, 80, 160]], [171, [64, 140, 206]]].forEach(function (p) { put(p[0], 86, p[1]); });
  rect(169, 80, 27, 5, BG); rect(169, 80, 27, 1, BGL); rect(173, 82, 14, 1, [44, 40, 36]); rect(190, 81, 3, 3, BGD); put(191, 82, [200, 60, 50], night);
  rect(167, 58, 31, 22, [204, 194, 166]); rect(167, 58, 31, 1, BGL); rect(167, 58, 1, 22, BGL); rect(197, 59, 1, 21, BGD); rect(167, 79, 31, 1, BGD);
  rect(170, 61, 25, 15, [12, 26, 16], true);
  var PH = [70, 222, 112], PHD = [40, 150, 76];
  [[63, 4, 14], [66, 4, 18], [69, 4, 9]].forEach(function (ln) { for (x = 172; x < 172 + ln[2]; x++) if ((x * 5 + ln[0]) % 7 !== 0) put(x, ln[0], (x * 3) % 5 === 0 ? PHD : PH, true); });
  put(173, 72, PH, true); put(173, 73, PH, true); put(173, 74, PH, true); put(172, 72, PH, true); put(172, 74, PH, true);
  rect(175, 72, 2, 3, PH, true);
  put(170, 61, [204, 194, 166]); put(194, 61, [204, 194, 166]); put(170, 75, [204, 194, 166]); put(194, 75, [204, 194, 166]);
  put(194, 77, [90, 200, 110], true);

  // green banker's lamp: brass base and stem, green glass shade
  cur = OBJ.blamp;
  var BRS = [200, 160, 70], BRSL = [240, 210, 124], BRSD = [132, 98, 40];
  var GRN = [30, 104, 66], GRNL = [84, 170, 116], GRND = [18, 66, 42];
  rect(236, 93, 15, 3, BRS); rect(237, 93, 13, 1, BRSL); rect(236, 95, 15, 1, BRSD);
  rect(243, 86, 2, 7, BRS); put(243, 86, BRSL);
  rect(237, 80, 14, 1, GRND); rect(235, 81, 18, 1, GRN); rect(233, 82, 22, 4, GRN);
  rect(236, 81, 6, 1, GRNL); rect(234, 82, 9, 1, GRNL); rect(234, 83, 4, 1, GRNL);
  rect(233, 85, 22, 1, GRND); rect(233, 86, 22, 1, BRS);
  rect(235, 87, 18, 1, night ? [255, 232, 170] : [214, 206, 180], night);
  put(252, 87, BRSD); put(252, 88, BRS); put(252, 89, BRS); put(252, 90, BRSL);

  // wooden mid-century desk chair, pushed in, seen from behind
  cur = OBJ.dchair;
  var CO = [184, 132, 80], COL = [212, 160, 104], COD = [134, 92, 52];
  for (i = 0; i < 18; i++) { put(197, 115 + i, COD); put(211, 115 + i, COD); }
  for (i = 0; i < 22; i++) { var co = (i / 11) | 0; put(192 - co, 115 + i, CO); put(193 - co, 115 + i, COD); put(215 + co, 115 + i, CO); put(216 + co, 115 + i, COD); }
  rect(190, 112, 28, 3, CO); rect(190, 112, 28, 1, COL); rect(190, 114, 28, 1, COD);
  rect(193, 101, 2, 11, CO); rect(213, 101, 2, 11, COD);
  [199, 204, 209].forEach(function (sx) { rect(sx, 101, 1, 11, CO); });
  rect(189, 97, 30, 1, COL); rect(188, 98, 32, 3, CO); rect(188, 100, 32, 1, COD); put(188, 97, CO); put(219, 97, CO);

  ox = 0;
  // black Fender Jazz Bass on a stand (after Ryan's), at real scale: well under the bookshelf's height. Offset body
  // with the longer horn on the left, white pickguard, chrome bridge and control plate, maple neck with black blocks
  cur = OBJ.bass;
  var STD = [40, 40, 44], STDL = [84, 84, 90];
  rect(66, 84, 1, 41, STD); rect(64, 83, 5, 1, STD); put(64, 82, STD); put(68, 82, STD);
  for (i = 0; i < 8; i++) { put(64 - i * 0.7, 125 + i, STD); put(68 + i * 0.7, 125 + i, STD); put(66, 125 + i, i < 4 ? STDL : STD); }
  rect(61, 124, 11, 1, STD);
  var BLK = [22, 22, 24], BLKL = [84, 84, 92], GRD = [238, 238, 232], GRDD = [210, 210, 204], CHR = [196, 196, 202], MPL = [222, 186, 124], MPLD = [186, 146, 88];
  var BX = 58, BY = 106;
  var SPANS = [[[2, 3]], [[1, 4], [12, 13]], [[1, 5], [11, 13]], [[1, 6], [10, 14]], [[1, 14]], [[2, 14]], [[2, 13]], [[3, 13]], [[2, 14]], [[1, 15]],
    [[0, 15]], [[0, 15]], [[0, 15]], [[0, 15]], [[0, 15]], [[1, 15]], [[1, 14]], [[3, 13]], [[6, 10]]];
  SPANS.forEach(function (row, ry) {
    row.forEach(function (sp) {
      for (var cx = sp[0]; cx <= sp[1]; cx++) {
        var c = cx === sp[0] ? BLKL : BLK;
        if (cx > sp[0] && cx < sp[1] && ry >= 4 && ry <= 13 && cx >= 3 && cx <= (ry <= 8 ? 11 : 9)) c = cx === 3 || ry === 13 ? GRDD : GRD;
        put(BX + cx, BY + ry, c);
      }
    });
  });
  rect(BX + 4, BY + 6, 7, 1, [34, 34, 36]); rect(BX + 5, BY + 11, 6, 1, [34, 34, 36]);
  rect(BX + 11, BY + 11, 3, 5, CHR); put(BX + 12, BY + 13, [60, 60, 64]);
  rect(BX + 5, BY + 15, 5, 1, CHR);
  rect(65, 80, 2, 30, MPL); rect(66, 80, 1, 30, MPLD);
  [3, 5, 7, 9, 12].forEach(function (n) { rect(65, 80 + 2 * (n - 1), 2, 1, [24, 24, 26]); });
  rect(65, 74, 4, 6, MPL); rect(66, 72, 3, 2, MPL); rect(65, 74, 1, 6, [182, 140, 84]);
  [74, 76, 78].forEach(function (py) { put(64, py, CHR); });

  ox = 0;
  function line(x0, y0, x1, y1, c, e) { var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (var k = 0; k <= n; k++) put(x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, c, e); }

  ox = 120; // right of the bed
  // pine nightstand with two drawers, a black task lamp and a few books
  cur = 0;
  var PN = [212, 160, 98], PNL = [232, 186, 124], PND = [168, 118, 64];
  rect(172, 110, 25, 2, PNL); rect(172, 112, 25, 17, PN); rect(172, 128, 25, 1, PND); rect(196, 112, 1, 16, PND);
  rect(174, 119, 21, 1, PND); put(184, 115, [120, 84, 44]); put(184, 123, [120, 84, 44]);
  rect(173, 129, 2, 3, PND); rect(194, 129, 2, 3, PND);
  rect(174, 108, 8, 2, [70, 120, 140]); rect(174, 106, 9, 2, [233, 221, 184]); rect(174, 104, 7, 2, [176, 60, 44]);
  // the task lamp leans left, toward the bed; it switches the light like the banker's lamp
  cur = OBJ.nlamp;
  var TL = [30, 30, 32], TLL = [84, 84, 90];
  rect(185, 107, 8, 3, TL); rect(186, 107, 6, 1, TLL);
  line(188, 106, 193, 96, TL); line(193, 96, 186, 90, TL); put(193, 96, TLL);
  rect(183, 88, 4, 1, TL); rect(182, 89, 5, 1, TL); rect(181, 90, 5, 1, TL); rect(180, 91, 5, 1, TLL);
  rect(180, 92, 4, 1, night ? [255, 232, 170] : [90, 90, 96], night);
  cur = 0;

  ox = 111;
  // the bed: pine plank headboard, pillows (two white, a gray one, the bird pillow), and a quilt of green and
  // white flower tiles on a blue grid, foreshortened so the tiles grow toward the foot of the bed
  cur = OBJ.bed;
  rect(86, 78, 83, 33, PN); rect(86, 78, 83, 2, PNL); rect(86, 80, 83, 1, PND);
  for (x = 105; x < 166; x += 19) rect(x, 81, 1, 30, PND);
  rect(86, 78, 3, 54, PN); rect(86, 78, 1, 54, PNL); rect(166, 78, 3, 54, PN); rect(168, 78, 1, 54, PND);
  [[98, 88], [131, 95], [150, 84], [118, 85]].forEach(function (k) { put(k[0], k[1], PND); put(k[0] + 1, k[1], [190, 138, 80]); });
  var QG = [96, 150, 108], QW = [236, 232, 218], QB = [44, 92, 186];
  var quilt = function (u, v) {
    var ti = Math.floor(u), tj = Math.floor(v), fu = u - ti, fv = v - tj;
    if (fu < 0.07 || fv < 0.07) return QB;
    var green = (ti + tj) % 2 === 0, bg = green ? QG : QW, fg = green ? QW : QG, cx = fu - 0.53;
    var hy = fv - 0.27, head = cx * cx / 0.085 + hy * hy / 0.028 <= 1, hole = cx * cx / 0.016 + hy * hy / 0.005 <= 1;
    var stem = Math.abs(cx) < 0.045 && fv > 0.4;
    var leaf = (Math.abs(fv - 0.58) < 0.06 || Math.abs(fv - 0.8) < 0.06) && Math.abs(Math.abs(cx) - 0.17) < 0.11;
    return (head && !hole) || stem || leaf ? fg : bg;
  };
  var shade = function (c, k) { return [c[0] * k, c[1] * k, c[2] * k]; };
  // the rug and the bed share one vanishing point, high above the middle of the room (x 160 is 49 here)
  var YB = 108, YF = 158, NX = 4, NY = 3.4;
  var bedL = function (y) { return Math.round(49 + 41 * (Math.min(y, YF) + 200) / (YB + 200)); };
  var bedR = function (y) { return Math.round(49 + 115 * (Math.min(y, YF) + 200) / (YB + 200)); };
  for (y = YB; y <= 166; y++) {
    var xl = bedL(y), xr = bedR(y);
    var v = y <= YF ? (y - YB) / (YF - YB) * NY : NY + (y - YF) / 9, dk = y <= YF ? 1 : 0.84;
    for (x = xl; x <= xr; x++) put(x, y, shade(quilt((x - xl) / (xr - xl + 1) * NX, v), dk));
    if (y > YB + 3) for (var sx = 1; sx <= 3; sx++) { put(xl - sx, y, shade(quilt(0.3 + sx * 0.08, v), 0.7)); put(xr + sx, y, shade(quilt(3.7 - sx * 0.08, v), 0.7)); }
  }
  // the navy waffle throw across the lower half, draped over the sides; the quilt still shows at the foot
  var NV = [50, 72, 120], NVL = [76, 100, 152], NVD = [32, 48, 86];
  for (y = 128; y <= 153; y++) {
    var l2 = bedL(y) - 3, r2 = bedR(y) + 3;
    for (x = l2; x <= r2; x++) {
      var nc = y === 128 ? NVL : (y >= 152 ? NVD : ((x % 3 === 0 || y % 3 === 0) ? NVL : NV));
      put(x, y, x < l2 + 3 || x > r2 - 3 ? shade(nc, 0.75) : nc);
    }
  }
  // footboard rail and tapered pine legs at the foot corners
  var FL = bedL(YF) - 3, FR = bedR(YF) + 3;
  rect(FL, 167, FR - FL + 1, 3, PN); rect(FL, 167, FR - FL + 1, 1, PNL); rect(FL, 169, FR - FL + 1, 1, PND);
  for (i = 0; i < 6; i++) { var lw = i < 4 ? 3 : 2; rect(FL + 1, 170 + i, lw, 1, PN); put(FL + lw, 170 + i, PND); rect(FR - lw, 170 + i, lw, 1, PN); put(FR - 1, 170 + i, PND); }
  var PW = [244, 242, 236], PWD = [212, 208, 198];
  var pillow = function (x0, y0, w, h, c, cd) { for (var yy = 0; yy < h; yy++) for (var xx = 0; xx < w; xx++) if (!((yy === 0 || yy === h - 1) && (xx === 0 || xx === w - 1))) put(x0 + xx, y0 + yy, yy >= h - 2 ? cd : c); };
  pillow(94, 99, 32, 10, PW, PWD); pillow(130, 99, 32, 10, PW, PWD);
  pillow(119, 103, 20, 9, [150, 156, 164], [122, 128, 136]);
  pillow(106, 106, 25, 13, [236, 230, 212], [204, 196, 176]);
  rect(108, 113, 21, 1, [150, 146, 136]);
  [[110, 110, [226, 190, 60], [70, 120, 160]], [115, 111, [70, 120, 160], [226, 190, 60]], [120, 110, [226, 190, 60], [40, 48, 60]], [125, 111, [40, 48, 60], [226, 190, 60]]].forEach(function (bd) {
    rect(bd[0], bd[1], 3, 2, bd[2]); put(bd[0] + 1, bd[1] + 2, bd[3]); put(bd[0] + 3, bd[1], [214, 96, 70]);
  });
  ox = 0;
  return { col: col, emis: emis, obj: obj };
}

function makeBedroomLight(mode) {
  var A = new Float32Array(SW * SH), G = new Float32Array(SW * SH), q = function (v, steps, b) { return Math.floor(v * steps + b) / steps; };
  for (var y = 0; y < SH; y++) for (var x = 0; x < SW; x++) {
    var i = y * SW + x, b = BAYER[(y & 3) * 4 + (x & 3)], g = 0, a;
    if (mode === "dark") {
      // the banker's lamp: a warm pool on the desk and the floor below it
      a = 0.28;
      var dx = x - 165, dy = y - 92, d = Math.sqrt(dx * dx + dy * dy * 1.6);
      g = Math.pow(Math.max(0, 1 - d / 78), 1.6) * 0.95;
      var sx = x - 104, sy = y - 69, sd = Math.sqrt(sx * sx + sy * sy * 1.4);
      g += Math.max(0, 1 - sd / 30) * 0.35;
      var nx = x - 301, ny = y - 100, nd = Math.sqrt(nx * nx + ny * ny * 1.5);
      g += Math.pow(Math.max(0, 1 - nd / 30), 1.4) * 0.5; // the nightstand lamp
      g = q(Math.min(1.2, g), 6, b);
    } else {
      a = q(1.0 - 0.12 * (x / SW), 12, b);
      if (y >= BFLOOR - 2) { var off = (y - BFLOOR) * 1.4, x0 = 223 + off, x1 = 279 + off, e = Math.min(x - x0, x1 - x); if (e > 0 && Math.abs(x - (251 + off)) > 1.2) g = e > 2 ? 0.24 : (b < e / 2 ? 0.24 : 0); }
    }
    A[i] = a; G[i] = g;
  }
  return mode === "dark" ? { A: A, G: G, at: [0.84, 0.92, 1.08], gt: [1.22, 1.06, 0.72] } : { A: A, G: G, at: [1, 1, 1], gt: [1.1, 1.04, 0.84] };
}

var HOTS = [
  { id: "window", name: "the window", verb: "Look out", x: 12, y: 14, w: 86, h: 77 },
  { id: "shelf", name: "the bookshelf", verb: "Browse", x: 100, y: 16, w: 57, h: 112 },
  { id: "clock", name: "the wall clock", verb: "Look at", x: 166, y: 22, w: 24, h: 24 },
  { id: "radio", name: "the stereo receiver", verb: "Turn on", x: 159, y: 76, w: 44, h: 16 },
  { id: "record", name: "the turntable", verb: "Play", x: 201, y: 70, w: 36, h: 21 },
  { id: "portrait", name: "the portrait", verb: "Look at", x: 252, y: 24, w: 43, h: 61 },
  { id: "lamp", name: "the lamp", verb: "Pull the chain on", x: 224, y: 36, w: 30, h: 18 },
  { id: "chair", name: "the swivel chair", verb: "Sit in", x: 214, y: 98, w: 48, h: 58 },
  { id: "contact", name: "the phone and Rolodex", verb: "Pick up", x: 263, y: 102, w: 41, h: 20 },
  { id: "plant", name: "the snake plant", verb: "Water", x: 0, y: 96, w: 24, h: 80 },
  { id: "door", scene: "hall", name: "the door", verb: "Open", x: 128, y: 30, w: 64, h: 120 },
  { id: "bell", scene: "hall", name: "the doorbell", verb: "Ring", x: 203, y: 74, w: 21, h: 30 },
  { id: "bwindow", scene: "bedroom", name: "the window", verb: "Look out", x: 204, y: 16, w: 69, h: 58 },
  { id: "map", scene: "bedroom", name: "the map", verb: "Look at", x: 78, y: 8, w: 116, h: 48 },
  { id: "bshelf", scene: "bedroom", name: "the bookshelf", verb: "Browse", x: 6, y: 26, w: 50, h: 106 },
  { id: "bass", scene: "bedroom", name: "the bass", verb: "Play", x: 56, y: 70, w: 21, h: 64 },
  { id: "bed", scene: "bedroom", name: "the bed", verb: "Lie down on", x: 187, y: 78, w: 114, h: 98 },
  { id: "desk", scene: "bedroom", name: "the desk", verb: "Look at", x: 80, y: 86, w: 108, h: 54 },
  { id: "dchair", scene: "bedroom", name: "the desk chair", verb: "Sit in", x: 108, y: 96, w: 36, h: 41 },
  { id: "apple", scene: "bedroom", name: "the computer", verb: "Use", x: 84, y: 56, w: 41, h: 41 },
  { id: "nlamp", scene: "bedroom", name: "the bedside lamp", verb: "Turn on", x: 298, y: 85, w: 18, h: 27 },
  { id: "blamp", scene: "bedroom", name: "the banker's lamp", verb: "Turn on", x: 152, y: 78, w: 26, h: 19 }
];

// Camera zones: the part of the room each object zooms to.
var ZONES = {
  window: { x: 6, y: 8, w: 100, h: 88 },
  shelf: { x: 92, y: 14, w: 72, h: 118 },
  credenza: { x: 150, y: 60, w: 112, h: 66 },
  clock: { x: 150, y: 14, w: 60, h: 40 },
  portrait: { x: 238, y: 18, w: 70, h: 72 },
  table: { x: 252, y: 96, w: 60, h: 36 },
  chair: { x: 200, y: 84, w: 116, h: 70 },
  plant: { x: 0, y: 92, w: 60, h: 88 },
  // walking in: the doorway in the hall and the part of the room it frames fill the screen identically
  // (framed just past the hinge, so the swung-open slab is off screen when the scenes swap)
  doorway: { x: HALL.DX + 3, y: HALL.DY, w: HALL.DW - 3, h: HALL.DH, cover: true },
  entry: { x: 116.5, y: 0, w: 91.5, h: 180, cover: true },
  bwindow: { x: 193, y: 8, w: 92, h: 72 },
  bshelf: { x: 0, y: 20, w: 64, h: 118 },
  map: { x: 70, y: 2, w: 132, h: 60 },
  bass: { x: 36, y: 60, w: 60, h: 80 },
  bed: { x: 179, y: 68, w: 141, h: 108 },
  desk: { x: 70, y: 50, w: 130, h: 88 }
};
var ZONE_FOR = { window: "window", shelf: "shelf", clock: "clock", radio: "credenza", record: "credenza", portrait: "portrait", chair: "chair", contact: "table", plant: "plant", bwindow: "bwindow", bshelf: "bshelf", desk: "desk", dchair: "desk", apple: "desk", bass: "bass", bed: "bed", map: "map" };
// The receiver's Now panel is parked until the radio gets a proper interaction.
var PANELS = { shelf: 1, contact: 1, map: 1 };

// The shelf reads left to right, oldest first: [spine, height, color, ink, kicker, title, paragraph]
var BOOKS = [
  ["Idi Amin's Uganda", 156, "#3E2614", "#F4EBDD", "Princeton · 2015–2019", "Idi Amin’s Uganda", "I went to Princeton to study history and ended up focused on East Africa: I studied Swahili and earned a certificate in African Studies. My senior thesis, “Idi Amin’s Uganda and Tanzanian Foreign Policy 1971–1972: From Mwongozo wa TANU to The Mogadishu Agreement,” won the prize for best thesis in African History."],
  ["City in the Clouds", 152, "#4B3F72", "#EEE8FA", "College · 2015–2019", "City in the Clouds", "Alongside school I played bass in a band, City in the Clouds. We toured a couple of times and played around SXSW in 2019. Our album, Lost in the City, is out on Spotify."],
  ["Kampala", 124, "#C9A646", "#1D251C", "Kampala, Uganda · Princeton in Africa", "Rockies", "After graduating I moved to Kampala on a Princeton in Africa fellowship, in the country my thesis was about. I worked at Rockies, a small NGO focused on youth arts and entertainment with a social enterprise side, across communications and monitoring and evaluation."],
  ["Nearside", 148, "#334232", "#EEF0E2", "San Francisco · 2020–2023", "Nearside", "In 2020 I joined Nearside, a business neobank and lending platform, as employee 18. I started in operations, running identity checks for new customers, then moved into product to work on debit cards and business lines of credit. I stayed through the acquisition."],
  ["Stanford Law", 132, "#8C1515", "#FFF4E6", "After Nearside", "Stanford Law", "When Nearside wrapped up, I applied to law school and got into Stanford Law. Then I decided I didn’t want to be a lawyer."],
  ["Teaching", 116, "#9A4E2A", "#FFF4E6", "Arcadia, CA · New York", "Teaching", "So I tried teaching instead. I taught in my hometown of Arcadia, California, then moved to New York with Teach For America, slated to teach history. After summer school I realized it wasn’t for me. I missed building, so I went back to startups."],
  ["Thatch", 138, "#4A6A52", "#F4F4EA", "New York · 2024–2025", "Thatch Health", "I came back through Thatch Health, a health benefits startup in New York. On a four-person carrier ops team, we built the processes for enrollments and payments across more than 60 insurance carriers. During open enrollment I did the data work, building the dashboards we used to process about 2,000 enrollments."],
  ["Conduit", 150, "#8A5A34", "#F7EEE0", "New York · 2025–now", "Conduit Financial", "Now I’m a Product Manager at Conduit Financial, back in fintech and into crypto. We built a multi-bank and stablecoin USD money-movement API for cross-border payments from zero to one in four months, and I’ve shipped 86 pull requests of production code myself."]
];
var SHELF_INTRO = ["Oldest first", "Start on the left", ""];

var STATIONS = {
  before: { label: "Before", needle: 10, kicker: "Before", title: "Teaching, an NGO, a band", text: "I've taught, worked at an NGO and toured with a band." },
  startups: { label: "Startups", needle: 48, kicker: "Startups", title: "Series A–B fintech", text: "Product and operations roles at several venture-backed fintech startups." },
  now: { label: "Now", needle: 88, kicker: "Now", title: "Product Manager, Conduit Financial", text: "I'm in New York, building an AI-native, multi-bank and stablecoin USD money-movement API for cross-border payments. Small team, shipping quickly." }
};

var CARD_ROWS = [
  ["City", "New York, NY"],
  ["Web", "ryandchavez.com", "https://ryandchavez.com"],
  ["LinkedIn", "ryan-d-chavez", "https://www.linkedin.com/in/ryan-d-chavez"],
  ["X", "@ry_and_chavez", "https://x.com/ry_and_chavez"],
  ["Instagram", "@ry_and_chavez", "https://www.instagram.com/ry_and_chavez"]
].map(function (r) { return { k: r[0], v: r[1], href: r[2] || "", isLink: !!r[2], isText: !r[2] }; });

// ---- the room: a small state -> render loop over the static markup in index.html ----

var THEME_KEY = "theme";

// Evening if the browser is in dark mode; otherwise follow the visitor's clock (evening 6pm-6am).
// Flipping the lamp sticks for this visit only, so the next visit starts from these defaults again.
function reducedMotion() { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }

function storedMode() {
  try { localStorage.removeItem(THEME_KEY); } catch (e) {} // the old site kept this for good
  try { var m = sessionStorage.getItem(THEME_KEY); if (m === "light" || m === "dark") return m; } catch (e) {}
  if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  var h = new Date().getHours();
  return h >= 18 || h < 6 ? "dark" : "light";
}
function storeMode(m) { try { sessionStorage.setItem(THEME_KEY, m); } catch (e) {} }

var HALL_INTRO = "You're at Ryan's front door.";
var BEDROOM_INTRO = "Ryan's bedroom. Have a look around."; // placeholder copy

// Unreleased rooms sit behind this flag. Try them on the live site with ?apartment=1 (sticks for the tab; ?apartment=0
// turns it off). Release by setting apartment to true.
var FLAGS = { apartment: false };
try {
  var flagParam = /[?&]apartment=([01])/.exec(location.search);
  if (flagParam) { if (flagParam[1] === "1") sessionStorage.setItem("flag-apartment", "1"); else sessionStorage.removeItem("flag-apartment"); }
  if (sessionStorage.getItem("flag-apartment") === "1") FLAGS.apartment = true;
} catch (e) {}
function entered() { try { return sessionStorage.getItem("entered") === "1"; } catch (e) { return false; } }

function introFor(m) {
  return m === "dark"
    ? "Evening in Ryan's living room. Have a look around."
    : "Afternoon in Ryan's living room. Have a look around.";
}

function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function setText(e, v) { if (e.textContent !== v) e.textContent = v; }
function setAttr(e, k, v) { if (e.getAttribute(k) !== v) e.setAttribute(k, v); }

function Room(root) {
  var self = this;
  var $ = function (id) { return root.querySelector("#" + id); };
  // Start at the front door once per visit; later loads in the same tab go straight in.
  var mode = storedMode(), scene = entered() ? "room" : "hall", intro = scene === "hall" ? HALL_INTRO : introFor(mode);
  this.state = { scene: scene, mode: mode, open: null, zone: null, hover: null, say: intro, n: intro.length, sayN: 0, focusId: null, book: -1, station: "now", place: -1, vw: 1440, vh: 900 };
  this.raf = 0; this.tw = 0; this.last = null;
  this.fluffing = false; this.builtFor = null; this.brushed = false; this.paintedHover = null;
  this.renderedMode = null; this.renderedCam = null;
  this.buf = { col: new Uint8ClampedArray(SW * SH * 3), emis: new Uint8Array(SW * SH), obj: new Uint8Array(SW * SH), img: new ImageData(SW, SH) };

  var r = rng(4242);
  this.strands = [];
  for (var n = 0; n < 6600; n++) {
    var fam = RUG[Math.floor(r() * RUG.length)];
    this.strands.push({ x: Math.floor(r() * SW), y: FLOOR + 3 + Math.floor(r() * (SH - FLOOR + 2)), len: 3 + Math.floor(r() * 4), lean: (r() - 0.5) * 2, fam: fam, bend: r() < 0.5 ? -1 : 1, give: 0.7 + r() * 0.6 });
  }
  this.strands.sort(function (a, b) { return a.y - b.y; });
  this.GW = Math.ceil(SW / CELL) + 1; this.GH = Math.ceil(SH / CELL) + 2;
  this.bx = new Float32Array(this.GW * this.GH); this.by = new Float32Array(this.GW * this.GH);

  this.stage = root;
  this.cam = $("cam");
  this.canvas = $("room");
  this.dom = {
    action: $("action"), shown: $("say-shown"), caret: $("caret"), live: $("say-live"),
    panels: { shelf: $("panel-shelf"), radio: $("panel-radio"), contact: $("panel-contact"), map: $("panel-map") },
    atlas: $("atlas"), atlasWrap: $("atlas-wrap"), atlasTip: $("atlas-tip"), placeTitle: $("place-title"), placeText: $("place-text"), placePrev: $("place-prev"), placeNext: $("place-next"),
    bookKicker: $("book-kicker"), bookTitle: $("book-title"), bookText: $("book-text"), bookPrev: $("book-prev"), bookNext: $("book-next"), needle: $("needle"),
    kicker: $("station-kicker"), title: $("station-title"), text: $("station-text"),
    themeColor: document.querySelector('meta[name="theme-color"]')
  };

  this.back = function () {
    if (!self.state.zone && !self.state.open) return;
    var opened = self.state.open, panel = opened && self.dom.panels[opened];
    var hadFocus = panel && panel.contains(document.activeElement);
    self.setState({ open: null, zone: null, focusId: null });
    self.say("You step back.");
    // Keyboard users go back to whatever opened the panel (or that object's hotspot if it's gone).
    if (hadFocus && self.kbd) {
      var to = self.opener && self.opener.offsetParent ? self.opener : self.hotEls[opened];
      if (to) to.focus({ preventScroll: true });
    }
  };
  this.fluff = function () { self.fluffing = true; self.kick(); self.say("You fluff the shag rug."); };

  // Hotspots: real buttons over each object, positioned in scene percentages.
  this.hotEls = {};
  HOTS.forEach(function (h) {
    var b = el("button", "hot");
    b.type = "button";
    b.style.left = (h.x / SW * 100).toFixed(2) + "%"; b.style.top = (h.y / SH * 100).toFixed(2) + "%";
    b.style.width = (h.w / SW * 100).toFixed(2) + "%"; b.style.height = (h.h / SH * 100).toFixed(2) + "%";
    var enter = function () { self.setState({ hover: h.id }); };
    var leave = function () { self.setState(function (s) { return s.hover === h.id ? { hover: null } : null; }); };
    b.addEventListener("click", function () { if (h.scene === "hall") self.enter(h.id === "bell"); else self.act(h.id); });
    // Hover highlight for a real mouse or keyboard focus only; taps would leave it stuck on.
    b.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") enter(); });
    b.addEventListener("pointerleave", leave);
    b.addEventListener("focus", function () { if (b.matches(":focus-visible")) enter(); });
    b.addEventListener("blur", function () { if (!b.matches(":hover")) leave(); });
    self.cam.appendChild(b);
    self.hotEls[h.id] = b;
  });

  // HUD inventory: the accessible / mobile way around the room.
  this.invEls = [];
  var inv = $("inv");
  // Rooms in the apartment (behind the flag): a tab row at the top of the menu.
  this.tabEls = [];
  if (FLAGS.apartment) {
    var tabs = el("div", "room-tabs");
    tabs.setAttribute("role", "group"); tabs.setAttribute("aria-label", "Rooms");
    [["room", "Living room"], ["bedroom", "Bedroom"]].forEach(function (d) {
      var b = el("button", "pbtn room-tab", d[1]);
      b.type = "button";
      b.addEventListener("click", function () { self.goTo(d[0]); });
      tabs.appendChild(b);
      self.tabEls.push({ scene: d[0], el: b });
    });
    inv.appendChild(tabs);
    this.tabsEl = tabs;
  }
  var addInv = function (scene, id, label, onClick, cls) {
    var b = el("button", "pbtn inv-btn" + (cls ? " " + cls : ""), label);
    b.type = "button";
    b.addEventListener("click", onClick);
    inv.appendChild(b);
    self.invEls.push({ id: id, el: b, scene: scene });
  };
  [["shelf", "About me"], ["radio", "Radio"], ["contact", "Contact"], ["window", "Window"], ["chair", "Chair"], ["lamp", "Lamp"], ["fluff", "Fluff rug"], ["room", "Room"]].forEach(function (d) {
    addInv("room", d[0], d[1], d[0] === "fluff" ? self.fluff : (d[0] === "room" ? self.back : function () { self.act(d[0]); }));
  });
  [["desk", "Desk"], ["apple", "Computer"], ["bshelf", "Books"], ["bass", "Bass"], ["bed", "Bed"], ["map", "Map"], ["blamp", "Lamp"], ["room", "Room"]].forEach(function (d) {
    addInv("bedroom", d[0], d[1], d[0] === "room" ? self.back : function () { self.act(d[0]); });
  });
  [["bell", "Ring the bell"], ["door", "Open the door"]].forEach(function (d) {
    addInv("hall", d[0], d[1], function () { self.enter(d[0] === "bell"); }, "inv-hall");
  });

  // Bookshelf panel: clickable spines.
  this.bookEls = [];
  var shelf = $("books");
  BOOKS.forEach(function (bk, i) {
    var b = el("button", "pbtn spine");
    b.type = "button";
    b.style.height = bk[1] + "px"; b.style.background = bk[2]; b.style.color = bk[3];
    b.appendChild(el("span", null, bk[0]));
    b.addEventListener("click", function () { self.setState({ book: i }); });
    shelf.appendChild(b);
    self.bookEls.push(b);
  });
  // The next book isn't written yet: a blank spine at the end that opens the Rolodex.
  var nextBook = el("button", "pbtn spine spine-next");
  nextBook.type = "button";
  nextBook.setAttribute("aria-label", "Next? Open the Rolodex");
  nextBook.appendChild(el("span", null, "Next?"));
  nextBook.addEventListener("click", function () { self.act("contact"); });
  shelf.appendChild(nextBook);

  // Read the shelf in order.
  this.dom.bookPrev.addEventListener("click", function () { self.setState({ book: Math.max(0, self.state.book - 1) }); });
  // Past the last book the story continues on the Rolodex: what's next is up to whoever's reading.
  this.dom.bookNext.addEventListener("click", function () {
    if (self.state.book >= BOOKS.length - 1) self.act("contact");
    else self.setState({ book: self.state.book + 1 });
  });

  // Map panel: step through the countries (everywhere comes first and between laps), or click a pin on the map.
  var stepPlace = function (dir) { self.setState(function (st) { return { place: (st.place + 1 + dir + PLACES.length + 1) % (PLACES.length + 1) - 1 }; }); };
  this.dom.placePrev.addEventListener("click", function () { stepPlace(-1); });
  this.dom.placeNext.addEventListener("click", function () { stepPlace(1); });
  var atlas = this.dom.atlas, tip = this.dom.atlasTip;
  var nearest = function (e, reach) {
    var rc = atlas.getBoundingClientRect(), sc = ATLAS.w / atlas.clientWidth;
    var cx = (e.clientX - rc.left - atlas.clientLeft) * sc, cy = (e.clientY - rc.top - atlas.clientTop) * sc, best = null, bd = reach * reach;
    PLACES.forEach(function (c, i) {
      c[1].forEach(function (pl) {
        var q = atlasXY(pl), dd = (q[0] - cx) * (q[0] - cx) + (q[1] - cy) * (q[1] - cy);
        if (dd < bd) { bd = dd; best = { country: i, place: pl, x: q[0], y: q[1] }; }
      });
    });
    if (!best) {
      // no pin in reach: the visited country under the pointer, if any
      var mx = Math.floor(cx), my = Math.floor(cy), v = self.atlasMask && mx >= 0 && my >= 0 && mx < ATLAS.w && my < ATLAS.h ? self.atlasMask[my * ATLAS.w + mx] : 0;
      if (v >= 2) best = { country: v - 2, name: PLACES[v - 2][0], x: cx, y: cy };
    } else best.name = best.place[0];
    return best;
  };
  var showTip = function (hit) {
    if (!hit) { tip.hidden = true; atlas.style.cursor = ""; return; }
    var sc = atlas.clientWidth / ATLAS.w, x = atlas.offsetLeft + atlas.clientLeft + hit.x * sc, y = atlas.offsetTop + atlas.clientTop + hit.y * sc;
    tip.textContent = hit.name;
    tip.hidden = false;
    tip.classList.toggle("below", hit.y * sc < 40);
    tip.style.left = x.toFixed(1) + "px"; tip.style.top = y.toFixed(1) + "px";
    atlas.style.cursor = "pointer";
  };
  atlas.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") showTip(nearest(e, 10)); });
  atlas.addEventListener("pointerleave", function () { showTip(null); });
  // On a phone the map scrolls sideways; its native scroll bar is hidden for a chunky one of our own under the map,
  // which follows the scroll and can be dragged or tapped.
  var wrap = this.dom.atlasWrap, bar = $("atlas-bar"), thumb = bar.firstElementChild;
  this.syncAtlasBar = function () {
    var sw = wrap.scrollWidth, cw = wrap.clientWidth;
    bar.hidden = sw <= cw + 1;
    if (bar.hidden) return;
    var tw = cw / sw * 100;
    thumb.style.width = tw.toFixed(2) + "%";
    thumb.style.left = (wrap.scrollLeft / (sw - cw) * (100 - tw)).toFixed(2) + "%";
  };
  wrap.addEventListener("scroll", this.syncAtlasBar, { passive: true });
  var dragBar = function (e) {
    var rc = bar.getBoundingClientRect(), tw = thumb.offsetWidth, f = (e.clientX - rc.left - tw / 2) / Math.max(1, rc.width - tw);
    wrap.scrollLeft = Math.max(0, Math.min(1, f)) * (wrap.scrollWidth - wrap.clientWidth);
  };
  bar.addEventListener("pointerdown", function (e) { bar.setPointerCapture(e.pointerId); dragBar(e); });
  bar.addEventListener("pointermove", function (e) { if (bar.hasPointerCapture(e.pointerId)) dragBar(e); });

  atlas.addEventListener("click", function (e) {
    var hit = nearest(e, 16);
    if (hit) { self.setState({ place: hit.country }); showTip(hit); }
  });

  // Receiver panel: station buttons.
  this.stationEls = {};
  var stations = $("stations");
  Object.keys(STATIONS).forEach(function (k) {
    var b = el("button", "pbtn station", STATIONS[k].label);
    b.type = "button";
    b.addEventListener("click", function () { self.setState({ station: k }); });
    stations.appendChild(b);
    self.stationEls[k] = b;
  });

  // Rolodex card rows.
  var card = $("card-rows");
  CARD_ROWS.forEach(function (row) {
    var d = el("div", "card-row");
    d.appendChild(el("span", "card-k", row.k));
    if (row.isLink) {
      var a = el("a", "card-v", row.v);
      a.href = row.href;
      if (row.href.indexOf("https://ryandchavez.com") !== 0) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      d.appendChild(a);
    } else d.appendChild(el("span", "card-v", row.v));
    card.appendChild(d);
  });

  root.querySelectorAll("[data-back]").forEach(function (b) { b.addEventListener("click", self.back); });
  // Panels that overflow show a "More" hint at the bottom until scrolled to the end.
  Object.keys(this.dom.panels).forEach(function (k) { self.dom.panels[k].addEventListener("scroll", function () { self.checkMore(); }, { passive: true }); });

  // Rug brushing.
  var downAt = null;
  this.canvas.addEventListener("pointerdown", function (e) { downAt = { x: e.clientX, y: e.clientY }; self.last = null; self.brush(e); });
  // While zoomed in, a tap or click on anything that isn't an object steps back to the full room (but not the end of a rug stroke).
  root.addEventListener("click", function (e) {
    if (self.state.scene === "hall" || !self.state.zone || (e.target !== self.canvas && e.target !== root)) return;
    if (e.target === self.canvas && downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
    self.back();
  });
  this.canvas.addEventListener("pointermove", function (e) { self.brush(e); });
  this.canvas.addEventListener("pointerleave", function () { self.last = null; });
  this.canvas.addEventListener("pointerup", function () { self.last = null; });
  this.canvas.addEventListener("pointercancel", function () { self.last = null; });
  // Remember whether the visitor is on the keyboard, for focus handling around panels.
  document.addEventListener("keydown", function () { self.kbd = true; }, true);
  // The computer screen pauses while the tab is hidden; pick it back up on return.
  document.addEventListener("visibilitychange", function () { if (!document.hidden && self.state.scene === "bedroom") self.kick(); });
  document.addEventListener("pointerdown", function () { self.kbd = false; }, true);

  // A mouse click or tap shouldn't leave a button focused: a later key press (like Esc) would make the browser
  // draw its keyboard focus ring around it. Keyboard presses (detail 0) keep focus where it is.
  root.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest("button");
    if (btn && e.detail > 0) btn.blur();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && self.state.scene !== "hall" && self.state.zone) self.back(); });

  // Stage size, plus how much of the bottom the HUD takes up (phones sit the room right on top of it).
  var hudEl = root.querySelector(".hud");
  var measure = function () {
    var b = root.getBoundingClientRect(), hb = hudEl.getBoundingClientRect();
    var hud = hb.height ? Math.round(b.bottom - hb.top) : self.state.hud;
    if (b.width && (Math.abs(b.width - self.state.vw) > 1 || Math.abs(b.height - self.state.vh) > 1 || Math.abs(hud - self.state.hud) > 1)) self.setState({ vw: b.width, vh: b.height, hud: hud });
  };
  measure();
  window.addEventListener("resize", function () { self.checkMore(); });
  if (typeof ResizeObserver !== "undefined") { var ro = new ResizeObserver(measure); ro.observe(root); ro.observe(hudEl); }
  else window.addEventListener("resize", measure);

  this.render();
  this.paint();
  this.schedulePlane(true);
  // Turn the camera glide on only after the first placement, so the page doesn't swoop in on load.
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add("ready"); }); });
}

Room.prototype.mode = function () { return this.state.mode; };

Room.prototype.checkMore = function () {
  var self = this;
  cancelAnimationFrame(this.moreRaf);
  this.moreRaf = requestAnimationFrame(function () {
    var p = self.state.open && self.dom.panels[self.state.open];
    if (p) p.classList.toggle("can-scroll", p.scrollHeight - p.clientHeight - p.scrollTop > 8);
  });
};

Room.prototype.setState = function (patch) {
  if (typeof patch === "function") patch = patch(this.state);
  if (!patch) return;
  var changed = false;
  for (var k in patch) if (this.state[k] !== patch[k]) { this.state[k] = patch[k]; changed = true; }
  if (!changed) return;
  this.render();
  if (this.paintedMode !== this.mode() || this.paintedHover !== this.state.hover || this.paintedScene !== this.state.scene || this.paintedRdx !== (this.state.open === "contact")) this.kick();
};

Room.prototype.say = function (text) {
  var self = this, d = this.dom, instant = reducedMotion();
  clearInterval(this.tw);
  this.setState({ say: text, n: instant ? text.length : 0, sayN: this.state.sayN + 1 });
  if (instant) return;
  // Typing touches only the narrator line, not the rest of the page.
  this.tw = setInterval(function () {
    var s = self.state;
    s.n = Math.min(s.say.length, s.n + 2);
    setText(d.shown, s.say.slice(0, s.n));
    setText(d.caret, s.n < s.say.length ? "▌" : "");
    if (s.n >= s.say.length) clearInterval(self.tw);
  }, 24);
};

Room.prototype.act = function (id) {
  var night = this.mode() === "dark";
  if (id === "lamp" || id === "blamp" || id === "nlamp") {
    var next = night ? "light" : "dark", which = id === "blamp" ? "the banker's lamp" : (id === "nlamp" ? "the bedside lamp" : "the lamp");
    storeMode(next);
    this.setState({ mode: next });
    this.say(next === "dark" ? "You turn on " + which + "." : "You turn off " + which + ".");
    return;
  }
  var lines = {
    window: (night
      ? "The Hudson at night, from the northwest Bronx. The GWB is lit up to the south."
      : "The Hudson and the Palisades, from the northwest Bronx. The George Washington Bridge is to the south.")
      + (night ? " The cacti on the sill look sleepy." : " The cacti on the sill look happy.")
      + (this.plane ? " A plane is on its way down to Newark." : ""),
    clock: "The clock says 10:09. It's actually " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".",
    record: "You put a record on.",
    portrait: "A poster of Ryan.",
    chair: "You sit in the swivel chair and spin around once.",
    plant: "You water the snake plant.",
    shelf: "The bookshelf appears to be a kind of archive of Ryan's life.",
    radio: "The receiver's broken. It won't turn on.",
    contact: "You open the Rolodex to Ryan's card.",
    // bedroom: placeholder copy
    bwindow: night ? "Across the street, a few windows are lit." : "Across the street, a brick building.",
    bshelf: "More books. The full catalog will live here.",
    desk: "A mid-century walnut desk. The projects will live here.",
    apple: "The computer says HELLO. The software projects will boot up here.",
    dchair: "A wooden desk chair, pushed in.",
    bass: "A black Fender Jazz Bass on its stand. It's got plenty of dings picked up on the road.",
    bed: "The bed's made, under a green flower quilt.",
    map: "A world map with pins in Arcadia, San Francisco, Austin, Princeton, New York and Kampala."
  };
  var opener = document.activeElement;
  this.setState({ zone: ZONE_FOR[id] || null, open: PANELS[id] ? id : null, focusId: id });
  this.say(lines[id]);
  if (PANELS[id]) {
    this.opener = opener;
    if (this.kbd) this.dom.panels[id].focus({ preventScroll: true });
  }
};

// Map pixel for a place.
var atlasXY = function (pl) { return [Math.round((pl[2] - ATLAS.lon0) * ATLAS.k), Math.round((ATLAS.lat0 - pl[1]) * ATLAS.k)]; };

// The map close-up: paper-blue ocean with a graticule every 15 degrees, sand land with a darker coast, and a round
// pin per city. Countries Ryan has been to are filled in; a picked country turns gold, its pins grow, and the rest
// shrink back.
Room.prototype.drawAtlas = function (pick) {
  var A = ATLAS, W = A.w, H = A.h, cv = this.dom.atlas, x, y;
  if (!this.atlasMask) {
    var m = new Uint8Array(W * H);
    A.rle.split("|").forEach(function (row, yy) {
      var xx = 0;
      for (var i = 0; i < row.length; i += 3) {
        var n = parseInt(row.substr(i + 1, 2), 36);
        m.fill(parseInt(row.charAt(i), 36), yy * W + xx, yy * W + xx + n);
        xx += n;
      }
    });
    this.atlasMask = m;
  }
  var mask = this.atlasMask, ctx = cv.getContext("2d"), img = ctx.createImageData(W, H), px = img.data;
  var OCN = [150, 186, 196], OCNL = [164, 198, 206], LND = [226, 210, 160], LNDD = [196, 176, 124];
  var VIS = [150, 180, 116], VISD = [104, 136, 78], PICK = [234, 188, 82], PICKD = [170, 120, 40];
  var at = function (xx, yy) { return xx >= 0 && yy >= 0 && xx < W && yy < H ? mask[yy * W + xx] : 0; };
  var put = function (xx, yy, c) { if (xx < 0 || yy < 0 || xx >= W || yy >= H) return; var o = (yy * W + xx) * 4; px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2]; px[o + 3] = 255; };
  for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
    var v = at(x, y), inner = at(x - 1, y) === v && at(x + 1, y) === v && at(x, y - 1) === v && at(x, y + 1) === v;
    // countries Ryan has been to are filled in, the picked one in gold; each has a darker edge
    if (pick >= 0 && v === pick + 2) put(x, y, inner ? PICK : PICKD);
    else if (v >= 2) put(x, y, inner ? VIS : VISD);
    else if (v === 1) put(x, y, inner || at(x - 1, y) > 1 || at(x + 1, y) > 1 || at(x, y - 1) > 1 || at(x, y + 1) > 1 ? LND : LNDD);
    else put(x, y, (x + A.lon0 * A.k) % (15 * A.k) === 0 || (A.lat0 * A.k - y) % (15 * A.k) === 0 ? OCNL : OCN);
  }
  // a disc: dark rim out to r2, red inside to r1, a glint up and to the left
  var disc = function (q, r2, r1, rim, fill, glint) {
    for (var yy = -3; yy <= 3; yy++) for (var xx = -3; xx <= 3; xx++) {
      var dd = xx * xx + yy * yy;
      if (dd <= r1) put(q[0] + xx, q[1] + yy, fill); else if (dd <= r2) put(q[0] + xx, q[1] + yy, rim);
    }
    if (glint) put(q[0] - 1, q[1] - 1, glint);
  };
  PLACES.forEach(function (c, i) {
    if (i === pick) return;
    c[1].forEach(function (pl) { if (pick >= 0) disc(atlasXY(pl), 2, 0, [150, 92, 80], [178, 112, 98]); else disc(atlasXY(pl), 5, 2, [96, 24, 20], [218, 56, 46], [250, 160, 140]); });
  });
  if (pick >= 0) PLACES[pick][1].forEach(function (pl) { disc(atlasXY(pl), 10, 5, [80, 18, 14], [232, 64, 50], [255, 186, 166]); });
  ctx.putImageData(img, 0, 0);
};

// Walk to another room in the apartment: a quick fade, then the new room from its overview.
Room.prototype.goTo = function (scene) {
  var self = this, st = this.stage;
  if (this.state.scene === scene || this.state.scene === "hall" || this.moving) return;
  var swap = function () {
    st.classList.remove("ready");
    self.setState({ scene: scene, zone: null, open: null, focusId: null, hover: null });
    self.say(scene === "bedroom" ? BEDROOM_INTRO : introFor(self.mode()));
    st.getBoundingClientRect();
    st.classList.add("ready");
  };
  if (reducedMotion()) { swap(); return; }
  this.moving = true; st.classList.add("fading");
  setTimeout(function () { swap(); st.classList.remove("fading"); self.moving = false; }, 360);
};

// Ring or open: the door swings in, the camera walks through the doorway, and the room takes over.
Room.prototype.enter = function (viaBell) {
  var self = this;
  if (this.state.scene !== "hall" || this.entering) return;
  this.entering = true;
  try { sessionStorage.setItem("entered", "1"); } catch (e) {}
  this.setState({ hover: null });
  if (reducedMotion()) {
    this.setState({ scene: "room", zone: null }); this.say(introFor(this.mode())); this.entering = false;
    return;
  }
  this.say(viaBell ? "Ding-dong. The door swings open." : "You open the door.");
  this.peek = new Uint8ClampedArray(this.roomImage(0).data);
  setTimeout(function () { self.door = { t0: performance.now() }; self.tick(); }, viaBell ? 700 : 150);
};

Room.prototype.walkIn = function () {
  var self = this, st = this.stage;
  this.setState({ zone: "doorway" });
  setTimeout(function () {
    st.classList.remove("ready");
    self.doorP = 0; self.peek = null;
    self.setState({ scene: "room", zone: "entry" });
    st.getBoundingClientRect();
    requestAnimationFrame(function () {
      st.classList.add("ready");
      requestAnimationFrame(function () { self.setState({ zone: null }); self.say(introFor(self.mode())); self.entering = false; });
    });
  }, 1000);
};

Room.prototype.kick = function () { this.dirty = true; this.tick(); };
Room.prototype.tick = function () {
  var self = this;
  if (!this.raf) this.raf = requestAnimationFrame(function () { self.raf = 0; self.frame(); });
};

Room.prototype.frame = function () {
  if (this.fluffing) {
    var left = 0;
    for (var i = 0; i < this.bx.length; i++) { this.bx[i] *= 0.8; this.by[i] *= 0.8; left += Math.abs(this.bx[i]) + Math.abs(this.by[i]); }
    if (left < 0.4) { this.bx.fill(0); this.by.fill(0); this.fluffing = false; }
    this.dirty = true;
  }
  if (this.door) {
    var dp = Math.min(1, Math.round((performance.now() - this.door.t0) / 700 * 10) / 10);
    if (dp !== this.doorP) { this.doorP = dp; this.dirty = true; }
    if (dp >= 1) { this.door = null; this.walkIn(); }
  }
  if (this.plane) {
    // Repaint only when the plane moves a pixel or its lights blink.
    var px = Math.round(PLANE.x0 - (performance.now() - this.plane.t0) / 1000 * PLANE.speed);
    if (px < PLANE.x1) { this.plane = null; px = null; this.schedulePlane(); }
    var key = px == null ? null : px + ":" + planeBlink();
    if (key !== this.planeKey) { this.planeKey = key; this.planeX = px; if (this.state.scene === "room") this.dirty = true; }
  }
  if (this.dirty) { this.dirty = false; this.paint(); }
  if (this.fluffing || this.plane || this.door) this.tick();
};

// Every so often a plane crosses the window, heading southwest and down toward Newark.
Room.prototype.schedulePlane = function (first) {
  var self = this;
  if (reducedMotion()) return;
  clearTimeout(this.planeTimer);
  this.planeTimer = setTimeout(function () {
    if (document.hidden) { self.schedulePlane(); return; }
    self.plane = { t0: performance.now() };
    self.tick();
  }, first ? 6000 + Math.random() * 6000 : 20000 + Math.random() * 25000);
};

Room.prototype.brush = function (e) {
  if (this.state.scene !== "room") return;
  var rect = this.canvas.getBoundingClientRect();
  var lx = (e.clientX - rect.left) / rect.width * SW, ly = (e.clientY - rect.top) / rect.height * SH;
  if (ly < FLOOR - 4) { this.last = null; return; }
  if (!this.last) { this.last = { x: lx, y: ly }; return; }
  var sx = this.last.x, sy = this.last.y, dx = lx - sx, dy = ly - sy, sp = Math.hypot(dx, dy);
  if (sp < 0.3) return;
  this.last = { x: lx, y: ly };
  this.fluffing = false;
  if (!this.brushed) { this.brushed = true; this.say("You brush the shag rug. The lines stay."); }
  var maxB = 5, tgx = dx / sp * maxB, tgy = dy / sp * maxB * 0.75;
  var rc = 6 / CELL, steps = Math.max(1, Math.ceil(sp / CELL)), GW = this.GW, GH = this.GH;
  for (var s = 1; s <= steps; s++) {
    var cx = (sx + dx * s / steps) / CELL, cy = (sy + dy * s / steps) / CELL;
    for (var gy = Math.max(0, Math.floor(cy - rc)); gy <= Math.min(GH - 1, Math.ceil(cy + rc)); gy++)
      for (var gx = Math.max(0, Math.floor(cx - rc)); gx <= Math.min(GW - 1, Math.ceil(cx + rc)); gx++) {
        var d = Math.hypot(gx - cx, gy - cy) / rc;
        if (d >= 1) continue;
        var w = Math.min(1, (d < 0.55 ? 1 : (1 - d) / 0.45) * 0.55), k = gy * GW + gx;
        this.bx[k] += (tgx - this.bx[k]) * w; this.by[k] += (tgy - this.by[k]) * w;
      }
  }
  this.kick();
};

Room.prototype.paint = function () {
  var hv = this.state.hover ? OBJ[this.state.hover] : 0;
  var sc = this.state.scene, img = sc === "hall" ? this.hallImage(hv) : (sc === "bedroom" ? this.bedroomImage(hv) : this.roomImage(hv));
  this.paintedHover = this.state.hover; this.paintedScene = this.state.scene; this.paintedMode = this.mode(); this.paintedRdx = this.state.open === "contact";
  this.canvas.getContext("2d").putImageData(img, 0, 0);
};

Room.prototype.hallImage = function (hv) {
  var mode = this.mode();
  if (this.hallFor !== mode) { this.hall = makeHall(mode); this.hallLight = makeHallLight(mode); this.hallFor = mode; }
  var h = this.hall, B = this.buf, col = B.col, emis = B.emis, obj = B.obj;
  col.set(h.col); emis.set(h.emis); obj.set(h.obj);
  drawDoor(h, col, emis, obj, this.doorP || 0, this.peek);
  return composite(col, emis, obj, this.hallLight, hv, B.img);
};

// The computer's screen is a blank prompt: just the block cursor blinking in the corner (steady with reduced motion).
var SCREEN = { x: 92, y: 61, w: 25, h: 15, loop: 600 };
function screenFrame(t, still) { return { cur: still || t < 300 }; }
function drawScreen(col, emis, obj, f) {
  var S = SCREEN, BGS = [12, 26, 16], PH = [70, 222, 112];
  var px = function (x, y, c) { var i = y * SW + x; col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; emis[i] = 1; obj[i] = OBJ.apple; };
  for (var y = 0; y < S.h; y++) for (var x = 0; x < S.w; x++) if (!((x === 0 || x === S.w - 1) && (y === 0 || y === S.h - 1))) px(S.x + x, S.y + y, BGS);
  if (f.cur) for (var cy = 0; cy < 5; cy++) for (var cx = 0; cx < 3; cx++) px(S.x + 2 + cx, S.y + 2 + cy, PH);
}
function screenKey(f) { return f.cur ? "1" : "0"; }

// Pigeons out the bedroom window: three on the parapet across the street and one on a window sill. Now and then one
// pecks at the ledge, and one turns around; at night they sleep with their heads tucked. Sprites face right:
// h head, n green neck, k beak, b body, w wing, t tail, f feet.
var PIGEONS = [
  { x: 213, y: 25, dir: 1, per: 5300, ph: 0 }, { x: 221, y: 25, dir: -1, per: 7100, ph: 2100 },
  { x: 248, y: 25, dir: 1, per: 6100, ph: 3900, turns: true }, { x: 253, y: 42, dir: -1, per: 8300, ph: 1200 }
];
var PIGEON_POSES = {
  stand: ["...hh..", "...nhk.", ".bbbn..", "twwbb..", "..f.f.."],
  peck: [".......", ".......", ".bbbnh.", "twwbnhh", "..f.fk."],
  sleep: [".......", ".......", "...hh..", ".bbbnh.", "twwbbb."]
};
var PIGEON_INK = { h: [96, 104, 124], n: [88, 142, 118], k: [58, 54, 54], b: [150, 156, 170], w: [186, 190, 200], t: [70, 74, 86], f: [204, 100, 104] };
function pigeonFrame(t, still, night) {
  return PIGEONS.map(function (pg) {
    if (night) return ["sleep", pg.dir];
    if (still) return ["stand", pg.dir];
    var u = (t + pg.ph) % pg.per, lap = Math.floor((t + pg.ph) / pg.per);
    return [u < 450 || (u > 700 && u < 1050) ? "peck" : "stand", pg.turns && lap % 4 >= 2 ? -pg.dir : pg.dir];
  });
}
function drawPigeons(col, emis, obj, poses, night) {
  poses.forEach(function (ps, i) {
    var pg = PIGEONS[i], rows = PIGEON_POSES[ps[0]];
    for (var y = 0; y < 5; y++) for (var x = 0; x < 7; x++) {
      var ch = rows[y][x];
      if (ch === ".") continue;
      var c = PIGEON_INK[ch], k = (pg.y + y) * SW + pg.x + (ps[1] > 0 ? x : 6 - x);
      col[k * 3] = night ? c[0] * 0.3 : c[0]; col[k * 3 + 1] = night ? c[1] * 0.3 : c[1]; col[k * 3 + 2] = night ? c[2] * 0.34 : c[2];
      emis[k] = 1; obj[k] = OBJ.bwindow;
    }
  });
}
function pigeonKey(poses) { return poses.map(function (ps) { return ps.join(""); }).join("/"); }

Room.prototype.bedroomImage = function (hv) {
  var mode = this.mode();
  if (this.bedFor !== mode) { this.bed = makeBedroom(mode); this.bedLight = makeBedroomLight(mode); this.bedFor = mode; }
  var B = this.buf;
  B.col.set(this.bed.col); B.emis.set(this.bed.emis); B.obj.set(this.bed.obj);
  var still = reducedMotion(), now = performance.now(), f = screenFrame(now % SCREEN.loop, still), pf = pigeonFrame(now, still, mode === "dark");
  drawScreen(B.col, B.emis, B.obj, f);
  drawPigeons(B.col, B.emis, B.obj, pf, mode === "dark");
  this.screenShown = screenKey(f) + "#" + pigeonKey(pf);
  if (!still) this.watchScreen();
  return composite(B.col, B.emis, B.obj, this.bedLight, hv, B.img);
};

// While the bedroom is on screen, check the computer and the pigeons every 100ms and repaint only when one changes.
Room.prototype.watchScreen = function () {
  var self = this;
  if (this.screenTimer) return;
  this.screenTimer = setTimeout(function () {
    self.screenTimer = 0;
    if (self.state.scene !== "bedroom" || document.hidden) return;
    var now = performance.now();
    if (screenKey(screenFrame(now % SCREEN.loop, false)) + "#" + pigeonKey(pigeonFrame(now, false, self.mode() === "dark")) !== self.screenShown) self.kick();
    else self.watchScreen();
  }, 100);
};

Room.prototype.roomImage = function (hv) {
  var mode = this.mode();
  if (this.builtFor !== mode) { this.scene = makeScene(mode); this.light = makeLight(mode); this.builtFor = mode; }
  // Draw into scratch buffers kept on the room, so painting doesn't allocate every frame.
  var B = this.buf, col = B.col, emis = B.emis, obj = B.obj;
  col.set(this.scene.col); emis.set(this.scene.emis); obj.set(this.scene.obj);
  var cur = 0;
  var put = function (x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= SW || y >= SH) return; var i = y * SW + x; col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; emis[i] = 0; obj[i] = cur; };
  var setCur = function (v) { cur = v; };
  for (var y = FLOOR; y < SH; y++) for (var x = 0; x < SW; x++) put(x, y, C.rug);
  var maxB = 5, GW = this.GW;
  for (var n = 0; n < this.strands.length; n++) {
    var st = this.strands[n];
    var gi = Math.min(this.GH - 1, (st.y / CELL) | 0) * GW + ((st.x / CELL) | 0);
    var fx = this.bx[gi] * st.give, fy = this.by[gi] * st.give;
    var shade = Math.max(-1, Math.min(1, (this.by[gi] + this.bx[gi] * 0.45) / maxB));
    var rootEnd = 0.3 - shade * 0.25, hi = shade > 0.35 ? 2 : (shade < -0.4 ? 0 : 1);
    var shown = Math.max(2, Math.round(st.len * (1 - Math.min(0.3, Math.hypot(fx, fy) / (maxB * 3))))), lf = st.len - 1;
    for (var j = 0; j < shown; j++) {
      var f = j / lf, ff = f * f;
      put(st.x + st.lean * f + fx * ff + st.bend * Math.sin(f * 3.1) * 0.5, st.y - j + fy * ff, f < rootEnd ? st.fam[0] : (j >= shown - hi ? st.fam[2] : st.fam[1]));
    }
  }
  if (this.planeX != null) drawPlane(this.planeX, mode === "dark", col, emis, obj);
  drawFront(put, setCur, this.state.open === "contact");
  return composite(col, emis, obj, this.light, hv, B.img);
};

// Light the color buffer, then highlight and outline the hovered object.
function composite(col, emis, obj, L, hv, img) {
  var out = img.data;
  for (var i = 0; i < SW * SH; i++) {
    var o = i * 4, p = i * 3;
    if (emis[i]) { out[o] = col[p]; out[o + 1] = col[p + 1]; out[o + 2] = col[p + 2]; }
    else {
      var a = L.A[i], g = L.G[i];
      out[o] = col[p] * (a * L.at[0] + g * L.gt[0]);
      out[o + 1] = col[p + 1] * (a * L.at[1] + g * L.gt[1]);
      out[o + 2] = col[p + 2] * (a * L.at[2] + g * L.gt[2]);
    }
    if (hv && obj[i] === hv) { out[o] = out[o] * 1.18 + 14; out[o + 1] = out[o + 1] * 1.18 + 12; out[o + 2] = out[o + 2] * 1.12 + 4; }
    out[o + 3] = 255;
  }
  // Pixel outline around the hovered object, the classic adventure-game highlight.
  if (hv) {
    for (var yy = 0; yy < SH; yy++) for (var xx = 0; xx < SW; xx++) {
      var k = yy * SW + xx;
      if (obj[k] === hv) continue;
      if ((xx > 0 && obj[k - 1] === hv) || (xx < SW - 1 && obj[k + 1] === hv) || (yy > 0 && obj[k - SW] === hv) || (yy < SH - 1 && obj[k + SW] === hv)) {
        var q = k * 4; out[q] = 255; out[q + 1] = 214; out[q + 2] = 102;
      }
    }
  }
  return img;
}

Room.prototype.camera = function () {
  var s = this.state, vw = s.vw || 1440, vh = s.vh || 900, narrow = vw < 760;
  var hud = narrow ? (s.hud || 236) : 150;
  var S0, tx, ty;
  if (narrow) {
    // The whole room, full width, resting on the HUD: wall fills the space above, rug the space around the HUD.
    S0 = vw / SW;
    tx = 0; ty = vh - hud - SH * S0;
  } else {
    S0 = Math.max(vw / SW, vh / SH);
    tx = (vw - SW * S0) / 2; ty = (vh - SH * S0) / 2;
  }
  // The fill around the scene splits wall/floor at the scene's floor line, so any exposed edge continues it.
  var floorY = s.scene === "hall" ? HALL.FLOOR : (s.scene === "bedroom" ? BFLOOR : FLOOR);
  this.split = Math.round(ty + floorY * S0);
  var z = s.zone ? ZONES[s.zone] : null;
  if (z && z.cover) {
    var Sc = Math.max(vw / z.w, vh / z.h);
    tx = vw / 2 - (z.x + z.w / 2) * Sc; ty = vh / 2 - (z.y + z.h / 2) * Sc;
    this.split = Math.round(ty + floorY * Sc);
    return "translate(" + tx.toFixed(1) + "px, " + ty.toFixed(1) + "px) scale(" + Sc.toFixed(4) + ")";
  }
  if (!z) return "translate(" + tx.toFixed(1) + "px, " + ty.toFixed(1) + "px) scale(" + S0.toFixed(4) + ")";
  var panel = !!s.open;
  var area = narrow
    ? (panel ? { x: 0, y: 0, w: vw, h: vh * 0.37 } : { x: 0, y: 0, w: vw, h: vh - hud })
    : (panel ? { x: 0, y: 0, w: vw * 0.56, h: vh - hud + 30 } : { x: 0, y: 0, w: vw, h: vh - hud + 30 });
  var S = Math.max(S0 * 1.15, Math.min(area.w / z.w, area.h / z.h) * 0.94);
  tx = area.x + area.w / 2 - (z.x + z.w / 2) * S;
  ty = area.y + area.h / 2 - (z.y + z.h / 2) * S;
  // Don't slide past the room's edges (the window and plant sit at the far left); the object goes off-center instead.
  // Edges the panel covers don't count.
  var right = panel && !narrow ? area.w : vw, bottom = panel && narrow ? area.h : vh;
  if (SW * S >= right) tx = Math.min(0, Math.max(right - SW * S, tx));
  if (SH * S >= bottom) ty = Math.min(0, Math.max(bottom - SH * S, ty));
  this.split = Math.round(ty + FLOOR * S);
  return "translate(" + tx.toFixed(1) + "px, " + ty.toFixed(1) + "px) scale(" + S.toFixed(4) + ")";
};

Room.prototype.render = function () {
  var s = this.state, mode = this.mode(), t = TOKENS[mode], open = s.open, d = this.dom;

  if (this.renderedMode !== mode) {
    for (var k in t) this.stage.style.setProperty("--" + k, t[k]);
    if (d.themeColor) d.themeColor.setAttribute("content", t.themeColor);
    this.renderedMode = mode;
  }

  var cam = this.camera();
  if (cam !== this.renderedCam) {
    this.cam.style.transform = cam; this.renderedCam = cam;
    this.stage.style.setProperty("--split", this.split + "px");
    this.stage.style.setProperty("--hud-h", (s.hud || 236) + "px");
  }

  var lampVerb = mode === "dark" ? "Turn off" : "Turn on";
  var hall = s.scene === "hall", isLamp = function (id) { return id === "lamp" || id === "blamp" || id === "nlamp"; };
  this.stage.classList.toggle("in-hall", hall);
  this.stage.classList.toggle("in-bedroom", s.scene === "bedroom");
  HOTS.forEach(function (h) {
    var b = this.hotEls[h.id];
    b.hidden = (h.scene || "room") !== s.scene;
    setAttr(b, "aria-label", (isLamp(h.id) ? lampVerb : h.verb) + " " + h.name);
  }, this);

  var hov = HOTS.filter(function (h) { return h.id === s.hover; })[0];
  setText(d.action, hov
    ? (isLamp(hov.id) ? lampVerb : hov.verb) + " " + hov.name
    : (hall ? "Ring the bell or open the door" : (s.zone && !ZONES[s.zone].cover ? "Looking closer · click Room to step back" : (s.scene === "bedroom" ? "Walk around the bedroom" : "Walk around the room"))));
  setText(d.shown, s.say.slice(0, s.n));
  setText(d.caret, s.n < s.say.length ? "▌" : "");
  // A trailing no-break space on alternate lines makes a repeated line still count as new for screen readers.
  setText(d.live, s.say + (s.sayN % 2 ? "\u00A0" : ""));

  this.invEls.forEach(function (v) {
    v.el.hidden = v.scene !== s.scene;
    var on = (v.id === "room" && !s.zone) || (!!s.zone && s.focusId === v.id);
    if (isLamp(v.id)) setText(v.el, mode === "dark" ? "Lamp off" : "Lamp on");
    v.el.classList.toggle("on", !!on);
  });

  if (this.tabsEl) {
    this.tabsEl.hidden = hall;
    this.tabEls.forEach(function (tb) { tb.el.classList.toggle("on", tb.scene === s.scene); if (tb.scene === s.scene) tb.el.setAttribute("aria-current", "true"); else tb.el.removeAttribute("aria-current"); });
  }

  for (var p in d.panels) d.panels[p].hidden = open !== p;
  this.stage.classList.toggle("panel-open", !!open);
  if (open) this.checkMore();

  this.bookEls.forEach(function (b, i) {
    setAttr(b, "aria-pressed", s.book === i ? "true" : "false");
    b.style.marginBottom = (s.book === i ? 10 : 0) + "px";
  });
  var bk = s.book >= 0 ? BOOKS[s.book].slice(4) : SHELF_INTRO;
  setText(d.bookKicker, bk[0]); setText(d.bookTitle, bk[1]); setText(d.bookText, bk[2]);
  d.bookPrev.disabled = s.book <= 0;
  var last = s.book >= BOOKS.length - 1;
  setText(d.bookNext, s.book < 0 ? "Start →" : (last ? "Next?" : "Next →"));
  if (last) setAttr(d.bookNext, "aria-label", "Next? Open the Rolodex"); else d.bookNext.removeAttribute("aria-label");

  if (open === "map") {
    var pc = PLACES[s.place], total = PLACES.reduce(function (n, c) { return n + c[1].length; }, 0);
    var nameAt = function (i) { i = (i + 1 + PLACES.length + 1) % (PLACES.length + 1) - 1; return i < 0 ? "Everywhere" : PLACES[i][0]; };
    setText(d.placePrev, "← " + nameAt(s.place - 1)); setText(d.placeNext, nameAt(s.place + 1) + " →");
    setText(d.placeTitle, pc ? pc[0] : "Places Ryan has been");
    setText(d.placeText, pc ? pc[1].map(function (p) { return p[0]; }).join(" · ") : total + " places.");
    if (this.drawnPlace !== s.place) {
      this.drawAtlas(s.place); this.drawnPlace = s.place;
      // on a phone the map scrolls sideways: bring the picked country's pins into view
      var wrap = d.atlasWrap;
      if (pc && wrap.scrollWidth > wrap.clientWidth) {
        var xs = pc[1].map(function (pl) { return atlasXY(pl)[0]; }), mid = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2;
        wrap.scrollLeft = mid * d.atlas.clientWidth / ATLAS.w - wrap.clientWidth / 2;
      }
    }
    this.syncAtlasBar();
  }
  if (!PANELS.radio) return; // the receiver's panel is parked; skip updating it
  var st = STATIONS[s.station];
  for (var key in this.stationEls) setAttr(this.stationEls[key], "aria-pressed", s.station === key ? "true" : "false");
  d.needle.style.left = st.needle + "%";
  setText(d.kicker, st.kicker); setText(d.title, st.title); setText(d.text, st.text);
};

// If the room can't start, drop the "js" class so the plain text version shows instead.
var stage = document.getElementById("stage"), roomCanvas = document.getElementById("room");
try {
  if (!stage || !roomCanvas.getContext || !roomCanvas.getContext("2d")) throw new Error("No canvas support");
  new Room(stage);
} catch (e) {
  document.documentElement.classList.remove("js");
  if (window.console) console.error(e);
}
})();
