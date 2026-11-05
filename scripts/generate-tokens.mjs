import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const tokensDir = path.join(root, 'src/tokens');
const outputPath = path.join(root, 'src/styles/tokens.css');

const FONT_WEIGHT_MAP = {
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
};

function fontFallback(name) {
  if (name.includes('mono')) {
    return 'ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace';
  }

  return 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
}

const ROOT_FONT_SIZE = 16;

function toRem(px) {
  const rem = px / ROOT_FONT_SIZE;
  const formatted = parseFloat(rem.toFixed(4));
  return `${formatted}rem`;
}

function formatNumber(name, value) {
  if (name.startsWith('line-height-')) {
    return `${value}%`;
  }

  if (name.startsWith('size-') || name.startsWith('letter-spacing-')) {
    return toRem(value);
  }

  if (name.startsWith('columns-')) {
    return String(value);
  }

  return `${value}px`;
}

function flattenTokens(obj, prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const name = prefix ? `${prefix}-${key}` : key;

    if (value?.$type === 'color' && value?.$value?.hex) {
      result[name] = value.$value.hex;
      continue;
    }

    if (value?.$type === 'number' && typeof value?.$value === 'number') {
      result[name] = formatNumber(name, value.$value);
      continue;
    }

    if (value?.$type === 'string' && typeof value?.$value === 'string') {
      if (name.startsWith('font-weight-')) {
        result[name] = String(FONT_WEIGHT_MAP[value.$value] ?? value.$value);
        continue;
      }

      if (name.startsWith('font-family-')) {
        result[name] = `"${value.$value}", ${fontFallback(name)}`;
        continue;
      }

      result[name] = value.$value;
      continue;
    }

    if (value && typeof value === 'object') {
      Object.assign(result, flattenTokens(value, name));
    }
  }

  return result;
}

function loadTokens(relativePath) {
  const filePath = path.join(tokensDir, relativePath);
  return flattenTokens(JSON.parse(fs.readFileSync(filePath, 'utf8')));
}

function toCssBlock(tokens) {
  return Object.entries(tokens)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n');
}

const aliasLight = loadTokens('color-alias/light.tokens.json');
const aliasDark = loadTokens('color-alias/dark.tokens.json');
const baseLight = loadTokens('color-base/light.tokens.json');
const spacing = loadTokens('spacing/mode-1.tokens.json');
const typography = loadTokens('typography/value.tokens.json');
const numerics = loadTokens('numerics/value.tokens.json');
const icon = loadTokens('icon/value.tokens.json');
const viewport = loadTokens('viewport/value.tokens.json');
const grid = loadTokens('grid/value.tokens.json');

const css = `/* Generated from Figma variable exports. Run \`npm run tokens\` to regenerate. */

:root {
  color-scheme: light dark;

${toCssBlock(spacing)}

${toCssBlock(typography)}

${toCssBlock(numerics)}

${toCssBlock(icon)}

${toCssBlock(viewport)}

${toCssBlock(grid)}

${toCssBlock(baseLight)}

${toCssBlock(aliasLight)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${toCssBlock(aliasDark)}
  }
}

[data-theme="dark"] {
${toCssBlock(aliasDark)}
}
`;

const breakpointsPath = path.join(root, 'src/styles/breakpoints.css');
const mobileMax = Number(viewport['viewport-mobile-max'].replace('px', ''));
const desktopMin = mobileMax;

const viewportSizes = {
  xxs: Number(viewport['viewport-xxs'].replace('px', '')),
  xs: Number(viewport['viewport-xs'].replace('px', '')),
  s: Number(viewport['viewport-s'].replace('px', '')),
  m: Number(viewport['viewport-m'].replace('px', '')),
  l: Number(viewport['viewport-l'].replace('px', '')),
  xl: Number(viewport['viewport-xl'].replace('px', '')),
};

const columnCounts = {
  xxs: Number(grid['columns-xxs'].replace('px', '')),
  xs: Number(grid['columns-xs'].replace('px', '')),
  s: Number(grid['columns-s'].replace('px', '')),
  m: Number(grid['columns-m'].replace('px', '')),
  l: Number(grid['columns-l'].replace('px', '')),
  xl: Number(grid['columns-xl'].replace('px', '')),
};

const breakpointsCss = `/* Generated from src/tokens/viewport/ and src/tokens/grid/. Do not edit. */
/* CSS variables cannot be used in @media — use the literal values below. */

/*
 * Viewport breakpoints (px):
 *   xxs ${viewportSizes.xxs} | xs ${viewportSizes.xs} | s ${viewportSizes.s}
 *   m ${viewportSizes.m} | l ${viewportSizes.l} | xl ${viewportSizes.xl}
 *
 * Large navigation: min-width: ${viewport['viewport-xxl']}
 *
 * Column counts:
 *   xxs ${columnCounts.xxs} | xs ${columnCounts.xs} | s ${columnCounts.s}
 *   m ${columnCounts.m} | l ${columnCounts.l} | xl ${columnCounts.xl}
 *
 * Mobile overlay nav:  width < ${mobileMax}px  (below s)
 * Desktop sidebar:   min-width: ${desktopMin}px      (s and above)
 */
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, css);
fs.writeFileSync(breakpointsPath, breakpointsCss);

console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${breakpointsPath}`);
