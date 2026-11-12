// Uso: node tools/a-espiral/generar.cjs identidad/a-espiral.html  (necesita opentype.js 1.3.4: npm install opentype.js@1.3.4 en esta carpeta)
// Genera identidad/a-espiral.html: la «a» de Praxis con la espiral, dibujada sobre el contorno real de la fuente
// (IM Fell Double Pica). La parte de la letra que se cambia se recorta y en su lugar va un trazo de pluma
// cuyo grosor sigue el de la letra, medido por rayos desde el centro del ojo (rayos.cjs).
const opentype = require('opentype.js');
const fs = require('fs');
const font = opentype.loadSync(__dirname + '/../../identidad/fuentes/IMFellDoublePica-Regular.ttf');
const UPM = font.unitsPerEm;
const f = (n) => +n.toFixed(1);

// ---------- Trazo de pluma: una curva suave por puntos de control [x, y, medio grosor] ----------
function densa(ctrl, pasos = 24) {
  const out = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[i - 1] || ctrl[i], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[i + 2] || p2;
    for (let s = 0; s < pasos; s++) {
      const t = s / pasos, t2 = t * t, t3 = t2 * t;
      const cr = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1]), p1[2] + (p2[2] - p1[2]) * t]);
    }
  }
  out.push(ctrl[ctrl.length - 1]);
  return out;
}
function pluma(ctrl) {
  const P = densa(ctrl), L = [], R = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const n = Math.hypot(tx, ty) || 1; tx /= n; ty /= n;
    const h = P[i][2];
    L.push([P[i][0] - ty * h, P[i][1] + tx * h]); R.push([P[i][0] + ty * h, P[i][1] - tx * h]);
  }
  // remate redondo al final
  const e = P[P.length - 1], h = e[2], pre = P[P.length - 2];
  const ang = Math.atan2(e[1] - pre[1], e[0] - pre[0]), cap = [];
  for (let k = 1; k < 12; k++) { const a = ang + Math.PI / 2 - Math.PI * k / 12; cap.push([e[0] + Math.cos(a) * h, e[1] + Math.sin(a) * h]); }
  const pts = L.concat(cap, R.reverse());
  return 'M' + pts.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
}

// ---------- La panza medida (rayos.cjs): [x, y, medio grosor], de la unión con el asta, por la izquierda, hasta abajo ----------
const PANZA = [[459,-470,38],[415,-455,35],[382,-442,34],[355,-431,32],[332,-421,30],[312,-409,27],[294,-397,26],[274,-387,31],[253,-376,36],[232,-361,41],[210,-343,48],[187,-320,56],[165,-290,64],[148,-253,71],[144,-213,76],[151,-172,79],[167,-132,83],[197,-102,78],[234,-80,77],[276,-72,76],[317,-74,71],[355,-85,60],[388,-103,47]];

const V = {
  // A: la panza no se cierra contra el asta: sigue y se enrolla hacia dentro, hasta el punto dorado.
  panza: {
    nombre: 'La panza en espiral', corta: 'La panza se enrolla hacia dentro',
    texto: 'La panza de la «a» no se cierra contra el asta: sigue girando y se enrolla hacia dentro hasta terminar en el punto dorado. El resto de la letra queda igual, así que se lee como una «a» de imprenta con un detalle propio.',
    vigilar: 'Es la más legible. En tamaños muy pequeños la vuelta de dentro se cierra; por debajo de 20 px conviene la «a» normal con el punto dorado.',
    recorte: 'M-300 -1200H1200V300H-300Z M-300 -560H488V300H-300Z',
    trazo: [[505,-492,40]].concat(PANZA, [[418,-128,40],[440,-180,33],[440,-248,29],[410,-294,26],[365,-306,24],[328,-274,22],[331,-232,21]]),
    punto: [331, -232, 34]
  },
  // B: el arco de arriba termina, en vez de en gota, en una voluta.
  cabeza: {
    nombre: 'La cabeza en espiral', corta: 'El arco de arriba acaba en una voluta',
    texto: 'Arriba, el arco de la «a» termina normalmente en una gota de tinta. Aquí esa gota se convierte en una pequeña voluta, una espiral que se enrolla hasta el punto dorado. Es el detalle más discreto: de lejos la letra es la de siempre.',
    vigilar: 'Es la más sutil; en tamaños pequeños la voluta se ve como la gota normal, y eso está bien.',
    recorte: 'M-300 -1200H1200V300H-300Z M-300 -1200H300V-560H-300Z',
    trazo: [[330,-838,36],[300,-832,36],[240,-810,40],[180,-765,43],[138,-700,42],[132,-630,38],[165,-575,32],[225,-560,27],[275,-595,23],[283,-655,21],[255,-700,19],[212,-705,18],[192,-674,17]],
    punto: [194, -672, 23]
  },
  // C: «a» de una sola panza: el cuerpo entero es una espiral pegada al asta.
  cuerpo: {
    nombre: 'Todo el cuerpo en espiral', corta: 'Una «a» de una sola panza',
    texto: 'Una «a» de una sola panza, como la escrita a mano: el asta se queda y todo el cuerpo es una espiral que nace arriba, da la vuelta por la izquierda y se enrolla hasta el punto dorado. Es la más llamativa.',
    vigilar: 'Es la que más se acerca a una arroba (@). Conviene probarla impresa y en pantalla antes de elegirla.',
    recorte: 'M-300 -1200H1200V300H-300Z M-300 -1200H505V300H-300Z',
    trazo: [[540,-834,38],[505,-842,36],[420,-862,34],[330,-848,34],[240,-805,40],[170,-735,52],[122,-640,64],[104,-520,72],[106,-390,76],[128,-262,78],[172,-150,76],[240,-75,66],[330,-48,54],[418,-68,44],[462,-160,38],[466,-320,34],[450,-500,31],[395,-635,29],[310,-680,27],[240,-620,26],[232,-510,24],[262,-440,22],[318,-442,21],[338,-492,20]],
    punto: [338, -492, 30]
  }
};
// D: la A con la línea de la espiral bajo «del Sur», como un horizonte.
V.horizonte = Object.assign({}, V.panza, {
  nombre: 'Panza en espiral y horizonte', corta: 'La A con una línea bajo «del Sur»',
  texto: 'La panza en espiral de la primera, y una línea fina bajo «del Sur», como el horizonte en el que termina la espiral abierta. Para la versión horizontal de la cabecera, la portada y los documentos.',
  vigilar: 'En la cabecera de la web pequeña la línea se ve muy fina: allí puede ir sin ella.',
  linea: true
});

// ---------- El nombre completo, con el espaciado y el kerning de la fuente ----------
const TEXTO = 'Praxıs del Sur';
function nombre(variante, col, oro, id) {
  const glifos = font.stringToGlyphs(TEXTO);
  let x = 0, piezas = '', xs = [];
  glifos.forEach((g, i) => {
    xs.push(x);
    const d = g.getPath(0, 0, UPM).toPathData(1);
    if (TEXTO[i] === 'a' && variante) {
      const v = V[variante];
      piezas += `<g transform="translate(${f(x)} 0)"><clipPath id="r-${id}"><path d="${v.recorte}" clip-rule="evenodd"/></clipPath>`
        + `<path d="${d}" fill="${col}" clip-path="url(#r-${id})"/><path d="${pluma(v.trazo)}" fill="${col}"/>`
        + `<circle cx="${v.punto[0]}" cy="${v.punto[1]}" r="${v.punto[2]}" fill="${oro}"/></g>`;
    } else if (d) piezas += `<path transform="translate(${f(x)} 0)" d="${d}" fill="${col}"/>`;
    x += g.advanceWidth;
    if (i < glifos.length - 1) x += font.getKerningValue(g, glifos[i + 1]);
  });
  const ancho = x;
  if (variante && V[variante].linea) {
    const x0 = xs[TEXTO.indexOf('d')] + 40;
    piezas += `<rect x="${f(x0)}" y="120" width="${f(ancho - x0 - 30)}" height="26" fill="${oro}"/>`;
  }
  return { svg: piezas, ancho };
}
function svgNombre(variante, col, oro, id, alto) {
  const n = nombre(variante, col, oro, id);
  const bb = font.getPath(TEXTO, 0, 0, UPM).getBoundingBox();
  return `<svg class="nm" viewBox="-40 ${f(bb.y1 - 40)} ${f(n.ancho + 80)} ${f(Math.max(bb.y2, 190) - bb.y1 + 80)}" style="height:${alto}" role="img" aria-label="Praxis del Sur">${n.svg}</svg>`;
}
function svgA(variante, col, oro, id) {
  const g = font.charToGlyph('a'), d = g.getPath(0, 0, UPM).toPathData(1);
  const v = V[variante];
  return `<svg class="aa" viewBox="-20 -1000 900 1060" aria-hidden="true"><clipPath id="ra-${id}"><path d="${v.recorte}" clip-rule="evenodd"/></clipPath>`
    + `<path d="${d}" fill="${col}" fill-opacity=".14"/>`
    + `<path d="${d}" fill="${col}" clip-path="url(#ra-${id})"/><path d="${pluma(v.trazo)}" fill="${col}"/>`
    + `<circle cx="${v.punto[0]}" cy="${v.punto[1]}" r="${v.punto[2]}" fill="${oro}"/></svg>`;
}

const VINO = '#662426', ORO = '#B6A160', BEIGE = '#DED8C7';
const orden = ['panza', 'cabeza', 'cuerpo', 'horizonte'];
let uid = 0;
const tarjetas = orden.map((k, i) => {
  const v = V[k];
  return `<section class="var" id="${k}">
    <div class="var-head"><h2><span>${i + 1}</span> ${v.nombre}</h2><p>${v.texto}</p><p class="vig"><b>A vigilar</b> ${v.vigilar}</p></div>
    <div class="fila">
      <figure class="claro letra">${svgA(k, VINO, ORO, ++uid)}<figcaption>La «a» en grande. En gris claro, la letra original.</figcaption></figure>
      <div class="cols">
        <figure class="claro">${svgNombre(k, VINO, ORO, ++uid, 'clamp(54px, 9vw, 92px)')}<p class="sig">Revista del CIPS</p><figcaption>Sobre blanco</figcaption></figure>
        <figure class="oscuro">${svgNombre(k, BEIGE, ORO, ++uid, 'clamp(54px, 9vw, 92px)')}<p class="sig">Revista del CIPS</p><figcaption>Sobre vino</figcaption></figure>
        <figure class="barra"><div class="cab">${svgNombre(k, VINO, ORO, ++uid, '30px')}<span>Inicio</span><span>Convocatoria</span><span>Números</span></div><figcaption>En la cabecera de la web, a su tamaño real</figcaption></figure>
      </div>
    </div>
  </section>`;
}).join('\n');

const html = `<title>La a en espiral</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..600;1,400&family=Source+Sans+3:wght@400;600;700&display=swap">
<style>
/* Layout: el nombre tal como lo trajo la usuaria; debajo, cuatro maneras de poner la espiral en la «a», cada una con la letra en grande, el nombre sobre blanco y sobre vino, y a tamaño de cabecera. */
:root{--bg:#F3F1EC;--surface:#FFFFFF;--fg:#1F1B18;--muted:#57524A;--line:#E0DBD0;--focus:#662426;
  --ui:"Source Sans 3",system-ui,-apple-system,"Segoe UI",sans-serif;--serif:"EB Garamond",Garamond,serif;
  --wine:#662426;--gold:#B6A160;--beige:#DED8C7;--olive:#4B483D;--paper:#FFFFFF;--brand-line:#E4DFD3}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#15120F;--surface:#1F1B17;--fg:#F1ECE3;--muted:#BEB6A8;--line:#3A342C;--focus:#E0C98A;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#15120F;--surface:#1F1B17;--fg:#F1ECE3;--muted:#BEB6A8;--line:#3A342C;--focus:#E0C98A;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--ui);font-size:16px;line-height:1.55;padding-inline:max(16px, env(safe-area-inset-left, 0px));-webkit-font-smoothing:antialiased}
.wrap{max-width:1160px;margin-inline:auto}
h1,h2{margin:0;font-family:var(--serif);font-weight:400;text-wrap:balance}
p{margin:0}
.intro{padding-block:52px 24px;display:grid;gap:14px}
.eyebrow{font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.intro h1{font-size:clamp(36px,5vw,58px);line-height:1.04}
.lead{max-width:66ch;font-size:18px;color:var(--muted)}
.ref{margin:8px 0 36px;padding:28px;border-radius:14px;background:var(--paper);border:1px solid var(--brand-line);display:grid;gap:10px;justify-items:center}
.ref figcaption{font-size:13px;color:#57524A}
.nm{display:block;width:auto;max-width:100%}
.var{padding-block:34px;border-top:1px solid var(--line);display:grid;gap:20px}
.var-head{display:grid;gap:10px;max-width:780px}
.var-head h2{font-size:clamp(28px,3.4vw,40px);line-height:1.1}
.var-head h2 span{font-style:italic;color:var(--muted)}
.var-head p{color:var(--muted);font-size:16.5px}
.vig b{display:inline-block;margin-right:6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg)}
.fila{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:14px;align-items:start}
@media (max-width:860px){.fila{grid-template-columns:minmax(0,1fr)}}
figure{margin:0;border-radius:12px;padding:20px;display:grid;gap:10px;justify-items:center;align-content:center;min-width:0}
figcaption{font-size:12.5px;justify-self:stretch}
.claro{background:var(--paper);border:1px solid var(--brand-line)}
.claro figcaption{color:#57524A}
.oscuro{background:var(--wine)}
.oscuro figcaption,.oscuro .sig{color:var(--beige)}
.letra .aa{width:100%;max-width:340px;height:auto;display:block}
.cols{display:grid;gap:14px;min-width:0}
.sig{font-size:12px;font-weight:600;letter-spacing:.17em;text-transform:uppercase;color:#7A4A4B}
.barra{background:var(--paper);border:1px solid var(--brand-line);justify-items:stretch}
.cab{display:flex;align-items:center;gap:22px;padding:6px 4px;border-bottom:1px solid var(--brand-line);font-size:14px;font-weight:600;color:#57524A;overflow:hidden}
.cab .nm{flex:none;margin-right:auto}
.barra figcaption{color:#57524A}
.fin{padding-block:36px 64px;border-top:1px solid var(--line);display:grid;gap:12px;max-width:760px}
.fin h2{font-size:clamp(26px,3vw,36px)}
.fin p{color:var(--muted)}
@media (max-width:560px){.cab span{display:none}}
</style>

<header class="intro wrap">
  <p class="eyebrow">Praxis del Sur · Identidad · La «a» en espiral</p>
  <h1>La «a» de Praxis, en espiral</h1>
  <p class="lead">Dibujadas sobre la letra real de tu tipografía (IM Fell Double Pica): la parte que cambia se recorta y en su lugar va un trazo de pluma que nace con el mismo grosor que la letra. El punto dorado pasa de la «ı» a la «a»: es donde termina la espiral. La «ı» se queda sin punto, como en tu versión.</p>
</header>
<div class="wrap"><figure class="ref">${svgNombre(null, VINO, ORO, ++uid, 'clamp(54px, 9vw, 92px)')}<figcaption>Tu versión, para comparar</figcaption></figure></div>
<main class="wrap">
${tarjetas}
</main>
<section class="fin wrap">
  <h2>Mi recomendación</h2>
  <p>La primera, la panza en espiral: se lee como una «a» de imprenta, el detalle se descubre al mirar, y con el punto dorado cuenta la idea de la praxis sin explicarla. La cuarta es la misma con su horizonte, para portadas y documentos. La tercera es la más llamativa, pero la que más se acerca a una arroba.</p>
  <p>Dime cuál te gusta y la afino: ajusto el grosor de la espiral a la tinta irregular de la letra, la paso a contorno para imprenta y preparo la versión pequeña.</p>
</section>`;
fs.writeFileSync(process.argv[2], html);
console.log('escrito', process.argv[2], html.length);
