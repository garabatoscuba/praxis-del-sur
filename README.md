# Praxis del Sur

Identidad visual y sitio web de **Praxis del Sur**, revista científica del Centro de Investigaciones Psicológicas y Sociológicas (CIPS).

La revista funcionará sobre **OJS 3.5** (Open Journal Systems) con un tema propio. Hasta tener servidor, aquí se construye un simulacro navegable con la misma estructura de páginas de OJS, para reutilizar su diseño en el tema.

## Carpetas

| Carpeta | Contenido |
|---|---|
| `identidad/` | Logo, colores, tipografías y guía de uso |
| `prototipo/` | Simulacro navegable de la web de la revista |
| `docs/investigacion/` | Investigación sobre OJS, hosting y Cuba (octubre de 2026) |
| `docs/fuentes/` | Documentos del equipo: acta, proyecto de revista, convocatoria y flujo editorial (borradores) |

## Ver el simulacro en tu computadora

Funciona sin internet, por ejemplo para presentarlo durante un apagón de la conexión.

```bash
cd prototipo
npm install
npx @11ty/eleventy
cd ..
node tools/serve.mjs prototipo/_site 4318
```

Después abre `http://localhost:4318` en el navegador. Los textos, fechas, secciones y artículos de ejemplo están en `prototipo/src/_data/*.json`: se cambian ahí, sin tocar las plantillas.

## Documentos de trabajo

- [Informe: OJS para Praxis del Sur](https://claude.ai/artifact/Xvm6sjNDnaTRGkrmCCPd8x)
- [Servidor y dominio para Praxis del Sur](https://claude.ai/artifact/5bvdN3TxLzePX9qpffMBCg)

## Regla de trabajo

Convocatoria, flujo editorial, secciones y fechas son **propuestas del equipo sin aprobar**. Ningún texto, fecha ni sección se escribe dentro de las plantillas: todo vive en archivos de datos (y, en OJS, en su panel), para poder cambiarlo sin rediseñar.
