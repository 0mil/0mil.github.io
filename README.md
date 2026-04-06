# Jin-Hyeong Park Website

Static personal website for Jin-Hyeong Park.

## Site Structure

- `/` serves the main homepage directly.
- `/projects/`, `/publications/`, and `/gallery/` are static pages.
- `/embeds/cloud/` contains the built interactive cloud widget used by the homepage.
- `/.workspace/toys/` contains the source for the cloud widget and its rebuild script.
- `/.workspace/site-src/home/`, `/.workspace/site-src/projects/`, `/.workspace/site-src/publications/`, `/.workspace/site-src/gallery/`, and `/.workspace/site-src/shared/` organize the editable source by page area.
- `/.workspace/scripts/build-site.mjs` regenerates the main static site outputs.
- `/build-site.ps1` is the short root helper you should use day to day.

## Edit Flow

- Update homepage, project, publication card, gallery, or site-wide metadata in the matching `.workspace/site-src/.../content.js` file or in `.workspace/site-src/shared/`.
- Update repeated layouts in the matching `.workspace/site-src/.../template.js` file or in `.workspace/site-src/shared/templates/`.
- Rebuild the site with `./build-site.ps1`.
- Preview locally before pushing.

For the full maintenance rules, see `.workspace/docs/SITE_GROUND_RULES.md`.

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
./build-site.ps1
```

Cloud widget:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\.workspace\toys\build-for-site.ps1
```

## Notes

- GA4 is configured in `.workspace/site-src/shared/site.js` and emitted to `assets/site-config.js` by the site build.
- Third-party attribution for the site template work is documented in `.workspace/docs/THIRD_PARTY_NOTICES.md`.
