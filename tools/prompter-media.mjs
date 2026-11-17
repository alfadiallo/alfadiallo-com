// Copies the square players (the right-hand animation of each video) next to the
// teleprompter, so its editor can show each section's frame. Run from the repo root:
//   node tools/prompter-media.mjs
// Output: teleprompter-media/<ID>/player.html (the player's index.html) + media/, and
// teleprompter-media/index.json { "C003": { "player": "C003/player", "steps": { "0": 0, … } } }.
// "player" is the clean URL: the site's cleanUrls redirect from .html (or index.html) drops the ?step.
// teleprompter-media/ is PIN-gated by middleware.js (it starts with "teleprompter"),
// kept out of git by .git/info/exclude (the repo is public), and uploaded by
// `vercel --prod` from this Mac. Deploying from anywhere else leaves it out.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.env.HOME, 'Projects/Understanding Healthcare/Modules/Animations');
const PLAYERS = { C003: 'c003-deptsim' };   // add C004, C005 … when their players exist
const OUT = 'teleprompter-media';

fs.rmSync(OUT, { recursive: true, force: true });
const index = {};
for (const [id, dir] of Object.entries(PLAYERS)) {
  const from = path.join(SRC, dir);
  const page = fs.readFileSync(path.join(from, 'index.html'), 'utf8');
  // STEPS lists one entry per step, each with its chunk; a chunk opens on its first step.
  const steps = {};
  [...page.matchAll(/\{\s*chunk:\s*(\d+)/g)].forEach((m, i) => { if (!(m[1] in steps)) steps[m[1]] = i; });
  if (!Object.keys(steps).length) throw new Error(`${dir}: no STEPS with chunk numbers found`);
  fs.mkdirSync(path.join(OUT, id), { recursive: true });
  fs.copyFileSync(path.join(from, 'index.html'), path.join(OUT, id, 'player.html'));
  // not: raw frames and scratch (names starting "_", e.g. media/video/_frames, 180+ MB), unfinished renders (.part.mp4),
  // media/lines (review stills and the contact sheet) and the joined *-all.mp4 cut: no step plays them
  const skip = p => { const b = path.basename(p); return b.startsWith('_') || b.endsWith('.part.mp4') || b.endsWith('-all.mp4') || p === path.join(from, 'media', 'lines'); };
  fs.cpSync(path.join(from, 'media'), path.join(OUT, id, 'media'), { recursive: true, filter: p => !skip(p) });
  index[id] = { player: `${id}/player`, steps };
  console.log(id, '←', dir, JSON.stringify(steps));
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2) + '\n');
