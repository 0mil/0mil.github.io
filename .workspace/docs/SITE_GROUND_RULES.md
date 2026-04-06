# Site Ground Rules

This site is maintained as a static GitHub Pages site with a small build step.

## Source Of Truth

- Edit homepage content in `.workspace/site-src/home/content.js`.
- Edit project content in `.workspace/site-src/projects/content.js`, publication cards in `.workspace/site-src/publications/content.js`, and gallery content in `.workspace/site-src/gallery/content.js`.
- Edit shared site config in `.workspace/site-src/shared/site.js`, redirects in `.workspace/site-src/shared/redirects.js`, and shared helpers/templates in `.workspace/site-src/shared/`.
- Edit shared runtime styling and behavior in `assets/styles.css`, `assets/main.js`, and `assets/analytics.js`.
- Edit the cloud widget only in `.workspace/toys/`.

## Generated Files

Do not hand-edit these unless you are debugging generated output temporarily.

- `index.html`
- `gallery/index.html`
- `projects/*/index.html` for generated project pages
- `publications/index.html`
- `assets/site-config.js`

After changing content or templates, rebuild them instead of editing output files directly.

## Rebuild Commands

Main site:

```powershell
./build-site.ps1
```

Cloud widget:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\.workspace\toys\build-for-site.ps1
```

## Local Preview

From the repo root:

```powershell
python -m http.server 8000
```

Then verify:

- `http://localhost:8000/`
- `http://localhost:8000/gallery/`
- `http://localhost:8000/projects/game-image-generation/`
- `http://localhost:8000/publications/drc-3dgs/`
- `http://localhost:8000/embeds/cloud/`

## How To Add Content

### New publication card on the homepage

1. Add an entry to `.workspace/site-src/publications/content.js`.
2. Run `./build-site.ps1`.

Use the shared card structure unless the publication truly needs a rich custom page like `drc-3dgs`.

### New project

1. Add an entry to `.workspace/site-src/projects/content.js`.
2. If it needs a detail page, include `slug` and `detail`.
3. Run `./build-site.ps1`.

Projects with `slug` and `detail` automatically generate `/projects/<slug>/index.html`.

### New gallery item

1. Add the image asset under `artworks/`.
2. Add an item to the correct category in `.workspace/site-src/gallery/content.js`.
3. Run `./build-site.ps1`.

### Site-wide settings

Update `.workspace/site-src/shared/site.js` for:

- site title
- GA4 measurement ID
- profile image path
- favicon path
- CV path
- social links
- theme storage key

Then rebuild the site.

## Asset Rules

- Keep PDFs in `files/` when they may be reused across pages.
- Keep publication-specific images inside that publication folder when they are page-specific.
- Keep project card and project-detail hero assets in stable shared paths like `images/PnP/` unless there is a strong reason to isolate them.
- Use lowercase kebab-case for slugs such as `game-image-generation`.

## Custom Page Rule

Use the shared generator by default.

Create or keep a hand-authored custom page only when:

- the page has rich bespoke interaction
- the layout is substantially different from the shared project template
- forcing it into the generator would make future edits harder

`publications/drc-3dgs/` is currently an intentional custom page.

## Cloud Widget Rule

- `.workspace/toys/` is the only editable source for the cloud widget.
- `embeds/cloud/` is built output and should not be treated as the source of truth.
- Keep the widget isolated from the main homepage runtime through the iframe boundary.

## Editing Discipline

- Prefer changing content files over generated HTML.
- Prefer changing shared templates over patching several pages separately.
- Rebuild after every structural content change.
- Preview locally before pushing.
- Avoid reintroducing Jekyll or another full framework unless there is a strong maintenance reason.
