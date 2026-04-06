# Jin-Hyeong Park Website

Static personal website for Jin-Hyeong Park.

## Site Structure

- `/` serves the main homepage directly.
- `/projects/`, `/publications/`, and `/gallery/` are static pages.
- `/embeds/cloud/` contains the built interactive cloud widget used by the homepage.
- `/toys/` contains the source for the cloud widget and its rebuild script.
- `/site-src/` contains structured content, shared templates, and helper code for generating the main static pages.
- `/scripts/build-site.mjs` regenerates the main static site outputs.

## Edit Flow

- Update homepage, project, publication card, gallery, redirect, or site-wide metadata in `site-src/content/`.
- Update repeated layouts in `site-src/templates/`.
- Rebuild the site with `node scripts/build-site.mjs`.
- Preview locally before pushing.

For the full maintenance rules, see `SITE_GROUND_RULES.md`.

## Local Preview

From the repo root:

```powershell
python -m http.server 8000
```

Then open:

- `http://localhost:8000/`
- `http://localhost:8000/gallery/`
- `http://localhost:8000/publications/drc-3dgs/`
- `http://localhost:8000/embeds/cloud/`

## Build Commands

Main site:

```powershell
node scripts/build-site.mjs
```

Cloud widget:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\toys\build-for-site.ps1
```

## Notes

- GA4 is configured through `site-src/content/site.js` and emitted to `assets/site-config.js` by the site build.
- Third-party attribution for the site template work is documented in `THIRD_PARTY_NOTICES.md`.

