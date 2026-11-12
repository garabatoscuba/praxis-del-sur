// Simulacro de Praxis del Sur. Las páginas reproducen la estructura HTML del tema
// por defecto de OJS 3.5 (clases pkp_* y obj_*) para reutilizar el CSS en el tema hijo.
// ARTIFACT=1 genera la versión para claude.ai: CSS en línea, fuentes de Google Fonts
// y la portada sin <!doctype> (claude.ai le pone su propio esqueleto).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export default function (eleventyConfig) {
  const artifact = process.env.ARTIFACT === '1';
  eleventyConfig.addGlobalData('site', { artifact });

  if (!artifact) {
    eleventyConfig.addPassthroughCopy({ 'src/css': 'css', 'src/img': 'img' });
    eleventyConfig.addPassthroughCopy({ 'node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-*.woff2': 'fonts' });
    eleventyConfig.addPassthroughCopy({ 'node_modules/@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-*.woff2': 'fonts' });
  }

  const CSS = ['tokens.css', 'base.css', 'components.css', 'movimiento.css', 'movil.css'];
  eleventyConfig.addShortcode('estilos', () => {
    if (artifact) return '<style>\n' + CSS.map((f) => readFileSync(join('src/css', f), 'utf8')).join('\n') + '\n</style>';
    return ['fonts.css', ...CSS].map((f) => `<link rel="stylesheet" href="css/${f}">`).join('\n');
  });

  const fmt = (iso, opts) => new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', ...opts }).format(new Date(`${iso}T00:00:00Z`));
  eleventyConfig.addFilter('fecha', (iso) => (iso ? fmt(iso, { day: 'numeric', month: 'long', year: 'numeric' }) : ''));
  eleventyConfig.addFilter('fechaCorta', (iso) => (iso ? fmt(iso, { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '') : ''));
  eleventyConfig.addFilter('dia', (iso) => fmt(iso, { day: 'numeric' }));
  eleventyConfig.addFilter('mesAnio', (iso) => fmt(iso, { month: 'long', year: 'numeric' }));
  const DIA = 86400000;
  eleventyConfig.addFilter('dias', (desde, hasta) => Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / DIA));
  eleventyConfig.addFilter('meses', (dias) => Math.max(1, Math.round(dias / 30.44)));
  // Evento de día completo en formato iCalendar (.ics), como enlace de descarga.
  eleventyConfig.addFilter('ics', (iso, titulo, nombre) => {
    const d = iso.replaceAll('-', '');
    const fin = new Date(Date.parse(`${iso}T00:00:00Z`) + DIA).toISOString().slice(0, 10).replaceAll('-', '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Praxis del Sur//Calendario//ES', 'BEGIN:VEVENT',
      `UID:${d}-${titulo.toLowerCase().replace(/[^a-z]+/g, '-')}@praxisdelsur`, `DTSTAMP:${d}T000000Z`,
      `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${fin}`, `SUMMARY:${nombre}: ${titulo}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  });
  eleventyConfig.addFilter('bySlug', (arr, slug) => (arr || []).find((x) => x.slug === slug));
  eleventyConfig.addFilter('where', (arr, key, value) => (arr || []).filter((x) => x[key] === value));
  eleventyConfig.addFilter('navActivo', (item, here) => item.url === here || (item.children || []).some((c) => c.url === here));
  eleventyConfig.addFilter('nombreCompleto', (a) => `${a.nombre} ${a.apellidos}`);
  eleventyConfig.addFilter('buscar', (arr, q) => (arr || []).filter((a) => `${a.titulo} ${a.resumen}`.toLowerCase().includes(q.toLowerCase())));

  // Cita en APA 7, versión en español ("y" en lugar de "&").
  const iniciales = (nombre) => nombre.split(/\s+/).map((p) => `${p[0]}.`).join(' ');
  eleventyConfig.addFilter('apa', (art, revista, numero) => {
    const nombres = art.autores.map((a) => `${a.apellidos}, ${iniciales(a.nombre)}`);
    const autores = nombres.length === 1 ? nombres[0] : `${nombres.slice(0, -1).join(', ')}, y ${nombres.at(-1)}`;
    return `${autores} (${art.publicado.slice(0, 4)}). ${art.titulo}. <i>${revista.nombre}</i>, <i>${numero.volumen}</i>(${numero.numero}), ${art.id}. https://doi.org/${art.doi}`;
  });

  return {
    dir: { input: 'src', output: artifact ? '_artifact' : '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk',
  };
}
