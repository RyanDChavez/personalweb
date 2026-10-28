// The Living Room: ryandchavez.com as a pixel-art midcentury living room.
// Scene is drawn into a 320x180 canvas and scaled up with crisp pixels.
(function () {
var SW = 320, SH = 180, FLOOR = 128, CELL = 3;

var TOKENS = {
  light: { wallFill: "#C6CDB5", rugFill: "#1C251B", ink: "#1D251C", hud: "rgba(29, 37, 28, 0.92)", hudInk: "#EEF0E2", hudLine: "#5E7A58", gold: "#E2BF5E", frame: "#1D251C", panel: "#EEF0E2", panelInk: "#1D251C", panelMuted: "#465643", dial: "#E9DDB8", invBg: "#2A3829", invOn: "#E2BF5E" },
  dark:  { wallFill: "#2A3130", rugFill: "#0C100B", ink: "#E6EDD8", hud: "rgba(10, 14, 10, 0.9)", hudInk: "#E6EDD8", hudLine: "#3A4A38", gold: "#E2BF5E", frame: "#050805", panel: "#1F291F", panelInk: "#E6EDD8", panelMuted: "#A7B79F", dial: "#F2C46B", invBg: "#141A14", invOn: "#E2BF5E" }
};

var C = {
  wall: [206, 214, 190], fleck: [196, 205, 180],
  slatA: [138, 90, 52], slatB: [122, 78, 44], slatGap: [70, 42, 22],
  teak: [138, 90, 52], teakD: [94, 58, 30], teakL: [176, 124, 76],
  gold: [201, 166, 70], goldL: [226, 196, 110], mat: [232, 226, 206], cream: [233, 221, 184],
  sage: [94, 122, 88], deep: [31, 42, 30], black: [26, 28, 24],
  metal: [176, 170, 150], metalD: [110, 106, 94], rust: [181, 67, 42],
  leather: [44, 60, 42], leatherL: [74, 98, 68], leatherD: [30, 40, 29],
  leafA: [74, 106, 82], leafB: [134, 173, 140], pot: [51, 66, 50], rug: [22, 30, 21]
};
var BOOKC = [[51, 66, 50], [201, 166, 70], [138, 90, 52], [74, 106, 82], [154, 78, 42], [233, 221, 184], [31, 42, 30], [62, 38, 20]];
var RUG = [[[31, 42, 30], [51, 66, 50], [79, 106, 76]], [[44, 58, 42], [94, 122, 88], [155, 181, 143]], [[51, 51, 28], [110, 106, 52], [176, 168, 92]], [[36, 51, 40], [74, 106, 82], [134, 173, 140]]];
var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(function (v) { return (v + 0.5) / 16; });

// Object ids painted into the scene, used for in-scene highlights.
var OBJ = { window: 1, shelf: 2, clock: 3, radio: 4, record: 5, portrait: 6, lamp: 7, chair: 8, contact: 9, plant: 11 };

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
    "bbbbbbbbbhhbllhhhhhllbhhaaaaaaaaa",
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

function drawFront(put, setCur) {
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
  rect(264, 120, 40, 3, C.teakL); rect(264, 123, 40, 2, C.teak);
  for (i = 0; i < 22; i++) { put(268 + i / 6, 125 + i, C.black); put(300 - i / 6, 125 + i, C.black); }
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
  rect(287, 116, 14, 4, C.black); rect(288, 115, 12, 1, C.metalD);
  for (i = 0; i < 6; i++) rect(289 + i * 2, 106 + (i % 2), 1, 10 - (i % 2), i % 3 === 0 ? [217, 201, 152] : C.cream);
  rect(288, 110, 12, 1, C.metal); put(287, 110, C.black); put(300, 110, C.black);
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
  { id: "plant", name: "the snake plant", verb: "Water", x: 0, y: 96, w: 24, h: 80 }
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
  plant: { x: 0, y: 92, w: 60, h: 88 }
};
var ZONE_FOR = { window: "window", shelf: "shelf", clock: "clock", radio: "credenza", record: "credenza", portrait: "portrait", chair: "chair", contact: "table", plant: "plant" };
var PANELS = { shelf: 1, radio: 1, contact: 1 };

var BOOKS = [
  ["Fintech", 140, "#334232", "#EEF0E2", "Fintech. Most of my career has been at venture-backed fintech startups."],
  ["Series A–B", 124, "#C9A646", "#1D251C", "Series A–B. The stage of the startups I've worked at."],
  ["Product", 150, "#8A5A34", "#F7EEE0", "Product. What I do now."],
  ["Operations", 132, "#4A6A52", "#F4F4EA", "Operations. Some of my startup roles were on the operations side."],
  ["Teaching", 116, "#9A4E2A", "#FFF4E6", "Teaching. I've taught."],
  ["NGO work", 136, "#E9DDB8", "#1D251C", "NGO work. I've worked at an NGO."],
  ["On tour", 126, "#1F2A1E", "#E6EDD8", "On tour. I've toured with a band."],
  ["East African History", 160, "#3E2614", "#F4EBDD", "East African History. What I studied at Princeton."],
  ["Princeton", 120, "#C9A646", "#1D251C", "Princeton. Where I studied East African history."]
];

var STATIONS = {
  before: { label: "Before", needle: 10, kicker: "Before", title: "Teaching, an NGO, a band", text: "I've taught, worked at an NGO and toured with a band." },
  startups: { label: "Startups", needle: 48, kicker: "Startups", title: "Series A–B fintech", text: "Product and operations roles at several venture-backed fintech startups." },
  now: { label: "Now", needle: 88, kicker: "Now", title: "Senior Product Manager, Conduit Financial", text: "I'm in New York, building an AI-native, multi-bank and stablecoin USD money-movement API for cross-border payments. Small team, shipping quickly." }
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

function storedMode() {
  try { var m = localStorage.getItem(THEME_KEY); if (m === "light" || m === "dark") return m; } catch (e) {}
  return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function storeMode(m) { try { localStorage.setItem(THEME_KEY, m); } catch (e) {} }

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
  var mode = storedMode(), intro = introFor(mode);
  this.state = { mode: mode, open: null, zone: null, hover: null, say: intro, n: intro.length, book: -1, station: "now", vw: 1440, vh: 900 };
  this.raf = 0; this.tw = 0; this.last = null;
  this.fluffing = false; this.builtFor = null; this.brushed = false; this.paintedHover = null;
  this.renderedMode = null; this.renderedCam = null;

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
    panels: { shelf: $("panel-shelf"), radio: $("panel-radio"), contact: $("panel-contact") },
    bookLine: $("book-line"), needle: $("needle"),
    kicker: $("station-kicker"), title: $("station-title"), text: $("station-text"),
    themeColor: document.querySelector('meta[name="theme-color"]')
  };

  this.back = function () { self.setState({ open: null, zone: null }); self.say("You step back."); };
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
    b.addEventListener("click", function () { self.act(h.id); });
    // Hover highlight for a real mouse or keyboard focus only; taps would leave it stuck on.
    b.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") enter(); });
    b.addEventListener("pointerleave", leave);
    b.addEventListener("focus", function () { if (b.matches(":focus-visible")) enter(); });
    b.addEventListener("blur", leave);
    self.cam.appendChild(b);
    self.hotEls[h.id] = b;
  });

  // HUD inventory: the accessible / mobile way around the room.
  this.invEls = [];
  var inv = $("inv");
  [["shelf", "Books"], ["radio", "Radio"], ["contact", "Contact"], ["window", "Window"], ["chair", "Chair"], ["lamp", "Lamp"], ["fluff", "Fluff rug"], ["room", "Room"]].forEach(function (d) {
    var b = el("button", "pbtn inv-btn", d[1]);
    b.type = "button";
    b.addEventListener("click", d[0] === "fluff" ? self.fluff : (d[0] === "room" ? self.back : function () { self.act(d[0]); }));
    inv.appendChild(b);
    self.invEls.push({ id: d[0], el: b });
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
    if (!self.state.zone || (e.target !== self.canvas && e.target !== root)) return;
    if (e.target === self.canvas && downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8) return;
    self.back();
  });
  this.canvas.addEventListener("pointermove", function (e) { self.brush(e); });
  this.canvas.addEventListener("pointerleave", function () { self.last = null; });
  this.canvas.addEventListener("pointerup", function () { self.last = null; });

  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && self.state.zone) self.back(); });

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
  if (this.builtFor !== this.mode() || this.paintedHover !== this.state.hover) this.kick();
};

Room.prototype.say = function (text) {
  var self = this;
  clearInterval(this.tw);
  this.setState({ say: text, n: 0 });
  this.tw = setInterval(function () {
    self.setState(function (s) {
      if (s.n >= s.say.length) { clearInterval(self.tw); return null; }
      return { n: Math.min(s.say.length, s.n + 2) };
    });
  }, 24);
};

Room.prototype.act = function (id) {
  var night = this.mode() === "dark";
  if (id === "lamp") {
    var next = night ? "light" : "dark";
    storeMode(next);
    this.setState({ mode: next });
    this.say(next === "dark" ? "You turn on the lamp." : "You turn off the lamp.");
    return;
  }
  var lines = {
    window: (night
      ? "The Hudson at night, from the northwest Bronx. The GWB is lit up to the south."
      : "The Hudson and the Palisades, from the northwest Bronx. The George Washington Bridge is to the south.")
      + (this.plane ? " A plane is on its way down to Newark." : ""),
    clock: "The clock says 10:09. It's actually " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".",
    record: "You put a record on.",
    portrait: "A poster of Ryan.",
    chair: "You sit in the swivel chair and spin around once.",
    plant: "You water the snake plant.",
    shelf: "Pick a book.",
    radio: "The receiver warms up. Pick a station.",
    contact: "You open the Rolodex to Ryan's card."
  };
  this.setState({ zone: ZONE_FOR[id] || null, open: PANELS[id] ? id : null });
  this.say(lines[id]);
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
  if (this.plane) {
    // Repaint only when the plane moves a pixel or its lights blink.
    var px = Math.round(PLANE.x0 - (performance.now() - this.plane.t0) / 1000 * PLANE.speed);
    if (px < PLANE.x1) { this.plane = null; px = null; this.schedulePlane(); }
    var key = px == null ? null : px + ":" + planeBlink();
    if (key !== this.planeKey) { this.planeKey = key; this.planeX = px; this.dirty = true; }
  }
  if (this.dirty) { this.dirty = false; this.paint(); }
  if (this.fluffing || this.plane) this.tick();
};

// Every so often a plane crosses the window, heading southwest and down toward Newark.
Room.prototype.schedulePlane = function (first) {
  var self = this;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  clearTimeout(this.planeTimer);
  this.planeTimer = setTimeout(function () {
    if (document.hidden) { self.schedulePlane(); return; }
    self.plane = { t0: performance.now() };
    self.tick();
  }, first ? 6000 + Math.random() * 6000 : 20000 + Math.random() * 25000);
};

Room.prototype.brush = function (e) {
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
  var cv = this.canvas; if (!cv) return;
  var mode = this.mode();
  if (this.builtFor !== mode) { this.scene = makeScene(mode); this.light = makeLight(mode); this.builtFor = mode; }
  var col = new Uint8ClampedArray(this.scene.col), emis = new Uint8Array(this.scene.emis), obj = new Uint8Array(this.scene.obj);
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
  drawFront(put, setCur);
  var ctx = cv.getContext("2d"), img = ctx.createImageData(SW, SH), out = img.data, L = this.light;
  var hv = this.state.hover ? OBJ[this.state.hover] : 0;
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
  this.paintedHover = this.state.hover;
  ctx.putImageData(img, 0, 0);
};

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
  // The fill around the room splits wall/rug at the room's floor line, so any exposed edge continues it.
  this.split = Math.round(ty + FLOOR * S0);
  var z = s.zone ? ZONES[s.zone] : null;
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
    document.documentElement.setAttribute("data-theme", mode);
    if (d.themeColor) d.themeColor.setAttribute("content", mode === "dark" ? "#0A0E0A" : "#1D251C");
    this.renderedMode = mode;
  }

  var cam = this.camera();
  if (cam !== this.renderedCam) {
    this.cam.style.transform = cam; this.renderedCam = cam;
    this.stage.style.setProperty("--split", this.split + "px");
    this.stage.style.setProperty("--hud-h", (s.hud || 236) + "px");
  }

  var lampVerb = mode === "dark" ? "Turn off" : "Turn on";
  HOTS.forEach(function (h) { setAttr(this.hotEls[h.id], "aria-label", (h.id === "lamp" ? lampVerb : h.verb) + " " + h.name); }, this);

  var hov = HOTS.filter(function (h) { return h.id === s.hover; })[0];
  setText(d.action, hov
    ? (hov.id === "lamp" ? lampVerb + " the lamp" : hov.verb + " " + hov.name)
    : (s.zone ? "Looking closer · click Room to step back" : "Walk around the room"));
  setText(d.shown, s.say.slice(0, s.n));
  setText(d.caret, s.n < s.say.length ? "▌" : "");
  setText(d.live, s.say);

  this.invEls.forEach(function (v) {
    var on = (open && open === v.id) || (!open && s.zone && v.id === "window" && s.zone === "window") || (v.id === "room" && !s.zone);
    if (v.id === "lamp") setText(v.el, mode === "dark" ? "Lamp off" : "Lamp on");
    v.el.classList.toggle("on", !!on);
  });

  for (var p in d.panels) d.panels[p].hidden = open !== p;
  this.stage.classList.toggle("panel-open", !!open);
  if (open) this.checkMore();

  this.bookEls.forEach(function (b, i) {
    setAttr(b, "aria-pressed", s.book === i ? "true" : "false");
    b.style.marginBottom = (s.book === i ? 10 : 0) + "px";
  });
  setText(d.bookLine, s.book >= 0 ? BOOKS[s.book][4] : "Pull a book off the shelf.");

  var st = STATIONS[s.station];
  for (var key in this.stationEls) setAttr(this.stationEls[key], "aria-pressed", s.station === key ? "true" : "false");
  d.needle.style.left = st.needle + "%";
  setText(d.kicker, st.kicker); setText(d.title, st.title); setText(d.text, st.text);
};

var stage = document.getElementById("stage");
if (stage && document.getElementById("room").getContext) new Room(stage);
})();
