// Genera prototipo/_artifact: la versión del simulacro que se publica en claude.ai.
import { rmSync } from 'node:fs';

process.env.ARTIFACT = '1';
rmSync('_artifact', { recursive: true, force: true });
const mod = await import('@11ty/eleventy');
const Eleventy = mod.Eleventy || mod.default;
await new Eleventy().write();
