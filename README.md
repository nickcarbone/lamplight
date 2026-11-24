# Lamplight

Public-domain short stories read aloud, from a different city each night. Recordings are LibriVox volunteer readings hosted on archive.org; the page only streams the MP3s listed in `catalogue.json` and never calls an API.

Live: https://nickcarbone.github.io/lamplight/ · Review: https://nickcarbone.github.io/lamplight/?review

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole app: player, nightly rotation, sleep timer, lock-screen controls, resume, dim mode, review route. |
| `catalogue.json` | Generated. Do not hand-edit. |
| `data/sources.json` | The curated list: archive.org identifier, a regex for the track title, place, time zone, hook, moods. Edit this. |
| `data/resolved.json` | Snapshot of archive.org metadata (file names, durations, reader). Rebuilt with `--resolve`. |
| `data/vetting.json` | Your Keep / Drop / Fix decisions. |
| `data/vetting-patches/` | Drop review-mode exports here; the Action merges and deletes them. |
| `scripts/build-catalogue.mjs` | Builder and validator (Node 18+, no dependencies). |
| `.github/workflows/` | Rebuild on change; weekly dead-link check. |

## How a story is chosen

Each night (rolling over at 05:00 your time) the page goes to one country. Countries are ordered west to east and stepped through with a stride of about 0.38 of the list, so consecutive nights land far apart. Within that country it picks a story you haven't heard in 30 days; if there isn't one it moves to the next country in the cycle. The screen shows the city's real local time.

*Another story* stays in the same country, then the nearest time zone. *Continue the night* plays the next place west when a story ends, until the sleep timer.

Only stories marked **keep** play, plus **unvetted** and **fix** ones while *Include unvetted* is on (it stays on automatically until you have kept 10). **drop** never plays.

## The foreign-language card

Under tonight's story is a second card: a short piece (7–45 min) read in that country's own language, for the sound of the place. `langByCountry` in `data/sources.json` lists each country's languages in order of preference; pieces from the same country come first. If LibriVox has no solo recording in any of those languages, the card offers the nearest foreign piece by distance and labels it "Nearest available". Pieces live in the `foreign` list in `data/sources.json` and follow the same vetting rules as stories.

## Vetting from your phone

1. Open `?review`, play a story, tap Keep / Drop / Fix and add a note.
2. Tap *Export patch*, then upload the file to `data/vetting-patches/` in the GitHub app or website and commit to `main`.
3. The *Build catalogue* Action merges it into `data/vetting.json` and rebuilds `catalogue.json`.

## Adding stories

Add an entry to `data/sources.json`, then run the *Build catalogue* workflow with **resolve** ticked. The build fails (and tells you why) if the archive.org track can't be found, the reader isn't a single named reader in the item description, the duration is outside 7–45 minutes, or the time zone is invalid.

Locally: `node scripts/build-catalogue.mjs --resolve` (needs network), or without `--resolve` to rebuild from the snapshot.

## Weekly link check

Sundays 09:17 UTC. Dead MP3s open or update a `dead-links` issue and a pull request that marks those stories `fix`. For the PR step, enable *Settings → Actions → General → Allow GitHub Actions to create and approve pull requests*.

## Audio on iPhone

archive.org serves its MP3s with CORS headers (tested from nickcarbone.github.io on 24 Nov 2026), so Web Audio can work. iOS ignores page volume, so the fade and volume slider need Web Audio, and Safari may suspend Web Audio when the screen locks. The page therefore defaults to plain audio on iPhone, which pauses at the timer with no fade and leaves volume to the side buttons. *Settings → Smooth fade on iPhone* switches to Web Audio. If that keeps playing with the screen locked, leave it on.

## Credits

Recordings: LibriVox volunteers, public domain. Fonts: Cormorant Garamond and EB Garamond (SIL OFL 1.1), self-hosted. No analytics, no trackers, no third-party requests apart from archive.org audio.
