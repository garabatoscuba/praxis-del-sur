// Recorre páginas del simulacro bajando y subiendo poco a poco (40 px cada 35 ms), como una persona.
// Comprueba: bloques que se quedan escondidos a la vista, desbordes a lo ancho, errores de consola.
// Guarda fotos del camino y una hoja por tamaño y página.
// Uso: node tools/recorrido.mjs [pagina.html ...] con el sitio servido en el puerto 4318 (launch.json «prototipo»). Fotos en SALIDA o en la carpeta temporal.
import { chromium } from "file:///C:/Users/Alpha/Documents/GitHub/estudio-garabatos-showcase/node_modules/playwright-core/index.mjs";
import fs from "node:fs";
import os from "node:os";
const dir = (process.env.SALIDA || os.tmpdir() + "/praxis-recorrido").split("\\").join("/") + "/";
fs.mkdirSync(dir, { recursive: true });
const PAGS = process.argv.slice(2).length ? process.argv.slice(2) : ["index.html", "inicio-publicada.html", "flujo.html", "articulo-pensar-la-crisis-desde-el-sur.html"];
const TAM = [[390, 780, true], [412, 915, true], [490, 866, false], [1440, 820, false], [1920, 940, false]];
const b = await chromium.launch({ channel: "chrome", headless: true });
const informe = [];
for (const pag of PAGS) for (const [W, H, movil] of TAM) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, ...(movil ? { isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : {}) });
  const p = await ctx.newPage();
  const errores = [];
  p.on("console", (m) => { if (m.type() === "error") errores.push(m.text()); });
  p.on("pageerror", (e) => errores.push(String(e)));
  await p.goto("http://localhost:4318/" + pag, { waitUntil: "load" });
  const tag = `${pag.replace(".html", "").slice(0, 18)}-${W}`;
  const fotos = [];
  const foto = async (n) => { const f = `${tag}-${n}.png`; await p.screenshot({ path: dir + f }); fotos.push(f); };
  await p.waitForTimeout(300); await foto("0-entrando");
  await p.waitForTimeout(1600); await foto("1-entrada");
  // Escondidos a la vista: bloques en la franja visible (con margen) que no han aparecido tras asentarse.
  const atascados = () => p.evaluate(() => {
    const h = innerHeight; let n = 0, ej = [];
    document.querySelectorAll("[data-rev]").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height === 0 || r.bottom < h * 0.1 || r.top > h * 0.88) return;
      if (el.getAttribute("data-rev") !== "in" || parseFloat(getComputedStyle(el).opacity) < 0.05) { n++; ej.push(el.className || el.tagName); }
    });
    return { n, ej: ej.slice(0, 4) };
  });
  const prob = [];
  const fin = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let i = 0;
  for (let y = 0; y <= fin + 40; y += 40, i++) {
    await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
    await p.waitForTimeout(35);
    if (i % 25 === 12) await foto(`b${String(i).padStart(3, "0")}`);
    if (i % 25 === 24) { await p.waitForTimeout(1300); const a = await atascados(); if (a.n) prob.push(`bajando y=${y}: ${a.n} sin aparecer (${a.ej.join(" | ")})`); }
  }
  await p.waitForTimeout(1300);
  { const a = await atascados(); if (a.n) prob.push(`al final: ${a.n} sin aparecer (${a.ej.join(" | ")})`); }
  await foto("2-final");
  i = 0;
  for (let y = fin; y >= -40; y -= 40, i++) {
    await p.evaluate((y) => scrollTo({ top: Math.max(0, y), behavior: "instant" }), y);
    await p.waitForTimeout(35);
    if (i % 25 === 12) await foto(`s${String(i).padStart(3, "0")}`);
    if (i % 25 === 24) { await p.waitForTimeout(1300); const a = await atascados(); if (a.n) prob.push(`subiendo y=${y}: ${a.n} sin aparecer (${a.ej.join(" | ")})`); }
  }
  await p.waitForTimeout(1600);
  { const a = await atascados(); if (a.n) prob.push(`arriba otra vez: ${a.n} sin aparecer (${a.ej.join(" | ")})`); }
  await foto("3-arriba");
  const ancho = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, n: document.querySelectorAll("[data-rev]").length, mov: document.documentElement.classList.contains("ps-mov") }));
  if (ancho.sw > ancho.cw) prob.push(`desborde a lo ancho: ${ancho.sw} > ${ancho.cw}`);
  informe.push(`${tag}: ${ancho.n} bloques, ps-mov=${ancho.mov}, errores=${errores.length}${errores.length ? " (" + errores[0] + ")" : ""}${prob.length ? "\n   " + prob.join("\n   ") : " · sin problemas"}`);
  // Hoja de fotos
  const celdas = fotos.map((f) => `<figure><img src="data:image/png;base64,${fs.readFileSync(dir + f).toString("base64")}"><figcaption>${f}</figcaption></figure>`).join("");
  const hoja = await b.newPage({ viewport: { width: 2400, height: 900 } });
  const cols = W < 800 ? 8 : 4;
  await hoja.setContent(`<style>body{margin:0;background:#333;color:#ddd;font:13px sans-serif}main{display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px}figure{margin:0}img{width:100%;display:block}</style><main>${celdas}</main>`);
  await hoja.screenshot({ path: dir + `hoja-${tag}.png`, fullPage: true });
  await hoja.close();
  await ctx.close();
}
console.log(informe.join("\n"));
await b.close();
