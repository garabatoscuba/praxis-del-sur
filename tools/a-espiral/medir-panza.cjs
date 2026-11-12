const opentype = require('opentype.js');
const font = opentype.loadSync(__dirname + '/../../identidad/fuentes/IMFellDoublePica-Regular.ttf');
const cmds = font.charToGlyph('a').getPath(0, 0, font.unitsPerEm).commands;
const conts = []; let cur = null, last = null;
for (const c of cmds) {
  if (c.type === 'M') { cur = [[c.x, c.y]]; conts.push(cur); last = [c.x, c.y]; }
  else if (c.type === 'L') { cur.push([c.x, c.y]); last = [c.x, c.y]; }
  else if (c.type === 'Q') { for (let t = 0.1; t <= 1.0001; t += 0.1) { const u = 1 - t; cur.push([u*u*last[0] + 2*u*t*c.x1 + t*t*c.x, u*u*last[1] + 2*u*t*c.y1 + t*t*c.y]); } last = [c.x, c.y]; }
  else if (c.type === 'Z') cur.push(cur[0]);
}
function cruces(o, dir) { const out = []; for (const k of conts) for (let i = 0; i < k.length - 1; i++) { const [ax, ay] = k[i], [bx, by] = k[i + 1]; const ex = bx - ax, ey = by - ay, den = dir[0] * ey - dir[1] * ex; if (Math.abs(den) < 1e-9) continue; const t = ((ax - o[0]) * ey - (ay - o[1]) * ex) / den, s = ((ax - o[0]) * dir[1] - (ay - o[1]) * dir[0]) / den; if (t > 0 && s >= 0 && s <= 1) out.push(t); } return out.sort((a, b) => a - b); }
const C = [355, -290];
const out = [];
for (let a = -60; a >= -290; a -= 10) { const r = a * Math.PI / 180, d = [Math.cos(r), Math.sin(r)]; const xs = cruces(C, d); if (xs.length >= 2) { const m = (xs[0] + xs[1]) / 2; out.push([a, +(C[0] + d[0]*m).toFixed(0), +(C[1] + d[1]*m).toFixed(0), +((xs[1] - xs[0]) / 2).toFixed(0)]); } }
console.log(JSON.stringify(out));
