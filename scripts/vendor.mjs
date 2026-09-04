/* ============================================================================
   scripts/vendor.mjs - copy anime.js out of node_modules and into the site
   ----------------------------------------------------------------------------
   The site has no build step and is served as plain files off GitHub Pages, so
   node_modules is not something a browser can reach. npm still owns the
   dependency and its version; this copies the one file the pages actually load
   into assets/vendor/, which is committed.

       npm install        gets the package
       npm run vendor     puts it where the browser can find it

   Run it after changing the animejs version in package.json.
   ========================================================================= */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const pkg = JSON.parse(
  await readFile(join(root, 'node_modules/animejs/package.json'), 'utf8')
);

// The bundles/ build is one self-contained file. dist/modules/ is split across
// a directory of relative imports, which would mean shipping the whole tree.
const from = join(root, 'node_modules/animejs/dist/bundles/anime.esm.min.js');
const to = join(root, 'assets/vendor/anime.esm.js');

const header =
  `/* anime.js v${pkg.version} - ${pkg.license} - ${pkg.homepage}\n` +
  `   Copied from node_modules by scripts/vendor.mjs. Do not edit by hand:\n` +
  `   change the version in package.json and run \`npm run vendor\`. */\n`;

const body = (await readFile(from, 'utf8'))
  // The source map is not vendored, so leaving the comment in makes devtools
  // request a file that is not there and log a failure on every page load.
  .replace(/^\s*\/\/# sourceMappingURL=.*$/m, '');

await mkdir(dirname(to), { recursive: true });
await writeFile(to, header + body, 'utf8');

const kb = (Buffer.byteLength(header + body) / 1024).toFixed(1);
console.log(`anime.js v${pkg.version} -> assets/vendor/anime.esm.js (${kb} KB)`);
