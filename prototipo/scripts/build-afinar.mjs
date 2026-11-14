// Prepara prototipo/_afinar: las herramientas para afinar el movimiento (index.html) y elegir el calendario (calendario.html), con páginas reales dentro.
// Usa la versión para claude.ai (ejecutar antes scripts/build-artifact.mjs).
// A cada página le añade al principio un script que toma los valores de las barras de la herramienta
// (window.__psAfinar en la página de fuera), para que entre ya con ellos.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

rmSync('_afinar', { recursive: true, force: true });
mkdirSync('_afinar');
// (__psSinCarga: la herramienta pide que la página de dentro no enseñe la pantalla de carga)
const previo = '<script>try{if(window.parent!==window&&window.parent.__psSinCarga){sessionStorage.setItem("ps-carga","1");window.__psEnHerramienta=true;}'
  + 'var f=window.parent!==window&&window.parent.__psAfinar;'
  + 'if(f){var o=f(),r=document.documentElement.style;for(var k in o)r.setProperty(k,o[k]);}'
  + 'var c=window.parent!==window&&window.parent.__psCalAfinar;if(c)window.PS_CAL=c();'
  + 'var m=window.parent!==window&&window.parent.__psMovilAfinar;if(m)window.PS_MOVIL=m();}catch(e){}</script>';
const esqueleto = (cuerpo) => '<!doctype html><html lang="es"><head><meta charset="utf-8">'
  + '<meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0">'
  + previo + cuerpo + '</body></html>';
const conPrevio = (html) => html.replace(/<body[^>]*>/, (m) => m + previo);

writeFileSync('_afinar/portada.html', esqueleto(readFileSync('_artifact/index.html', 'utf8')));
writeFileSync('_afinar/portada-numero.html', conPrevio(readFileSync('_artifact/inicio-publicada.html', 'utf8')));
writeFileSync('_afinar/articulo.html', conPrevio(readFileSync('_artifact/articulo-pensar-la-crisis-desde-el-sur.html', 'utf8')));
writeFileSync('_afinar/envios.html', conPrevio(readFileSync('_artifact/envios.html', 'utf8')));
writeFileSync('_afinar/acceso.html', conPrevio(readFileSync('_artifact/acceso.html', 'utf8')));
writeFileSync('_afinar/botones.html', readFileSync('afinar/botones.html', 'utf8'));
writeFileSync('_afinar/index.html', readFileSync('afinar/movimiento.html', 'utf8'));
writeFileSync('_afinar/calendario.html', readFileSync('afinar/calendario.html', 'utf8'));
writeFileSync('_afinar/movil.html', readFileSync('afinar/movil.html', 'utf8'));
writeFileSync('_afinar/letras.html', readFileSync('afinar/letras.html', 'utf8'));
writeFileSync('_afinar/cabecera.html', readFileSync('afinar/cabecera.html', 'utf8'));
writeFileSync('_afinar/fondo.html', readFileSync('afinar/fondo.html', 'utf8'));
// la foto de la portada, para que portada.html la encuentre
cpSync('_artifact/img', '_afinar/img', { recursive: true });
console.log('Listo: _afinar/index.html (movimiento), calendario.html, movil.html, portada.html, portada-numero.html y articulo.html');
