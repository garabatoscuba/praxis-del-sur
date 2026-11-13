// Publica el simulacro en GitHub Pages para enseñarlo sin claude.ai (que no abre desde Cuba).
// Arma el sitio (_site) y lo sube al repositorio PÚBLICO garabatoscuba/praxis-del-sur-simulacro, que solo contiene el sitio armado:
// el acta, los borradores y el código siguen en el repositorio privado. Las páginas piden a los buscadores no aparecer (noindex).
// Uso, desde prototipo/:  npm run publicar
// La primera vez clona el repositorio público en _pages/ (no va al repositorio privado).
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync, cpSync, writeFileSync } from 'node:fs';

const REPO = 'https://github.com/garabatoscuba/praxis-del-sur-simulacro.git';
const WEB = 'https://garabatoscuba.github.io/praxis-del-sur-simulacro/';
const sh = (c, o = {}) => execSync(c, { stdio: 'inherit', ...o });

// 1. La versión pública, armada desde cero en _publico (sin páginas viejas y sin los nombres propios del equipo)
rmSync('_publico', { recursive: true, force: true });
sh('npx @11ty/eleventy --output=_publico', { env: { ...process.env, PUBLICO: '1' } });

// 2. La copia del repositorio público, con el sitio nuevo en lugar del anterior
if (!existsSync('_pages/.git')) sh(`git clone ${REPO} _pages`);
for (const f of readdirSync('_pages')) if (f !== '.git') rmSync('_pages/' + f, { recursive: true, force: true });
cpSync('_publico', '_pages', { recursive: true });
writeFileSync('_pages/.nojekyll', ''); // que GitHub sirva los archivos tal cual, sin procesarlos
writeFileSync('_pages/README.md', `# Praxis del Sur · simulacro de la web

Simulacro navegable de la web de *Praxis del Sur*, revista del Centro de Investigaciones Psicológicas y Sociológicas (CIPS).
Artículos, autores y datos de ejemplo; textos del equipo en borrador. Se ve en ${WEB}

Este repositorio solo contiene el sitio ya armado. Se genera desde el proyecto privado con \`npm run publicar\`: no se edita aquí.
`);

// 3. Subirlo, si algo cambió
sh('git add -A', { cwd: '_pages' });
if (!execSync('git status --porcelain', { cwd: '_pages' }).toString().trim()) {
  console.log('Sin cambios: el sitio publicado ya está al día.');
  process.exit(0);
}
const fecha = new Date().toISOString().slice(0, 10);
sh(`git commit -q -m "Actualizar el simulacro (${fecha})" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`, { cwd: '_pages' });
sh('git push origin HEAD:main', { cwd: '_pages' });
console.log(`Subido. En uno o dos minutos se ve en ${WEB}`);
