# Site Ground Rules

This site is maintained as a static GitHub Pages site with a small build step.

## Source Of Truth

- Edit structured content in `site-src/content/`.
- Edit shared page layouts in `site-src/templates/`.
- Edit shared helpers in `site-src/lib/`.
- Edit shared runtime styling and behavior in `assets/styles.css`, `assets/main.js`, and `assets/analytics.js`.
- Edit the cloud widget only in `toys/`.

## Generated Files

Do not hand-edit these unless you are debugging generated output temporarily.

- `index.html`
- `gallery/index.html`
- `projects/*/index.html` for generated project pages
- `about/index.html`
- `cv/index.html`
- `PnP/index.html`
- `v2/**/*.html` redirect shims
- `assets/site-config.js`

After changing content or templates, rebuild them instead of editing output files directly.

## Rebuild Commands

Main site:

```powershell
node scripts/build-site.mjs
```

Cloud widget:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\toys\build-for-site.ps1
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

1. Add an entry to `site-src/content/publications.js`.
2. Run `node scripts/build-site.mjs`.

Use the shared card structure unless the publication truly needs a rich custom page like `drc-3dgs`.

### New project

1. Add an entry to `site-src/content/projects.js`.
2. If it needs a detail page, include `slug` and `detail`.
3. Run `node scripts/build-site.mjs`.

Projects with `slug` and `detail` automatically generate `/projects/<slug>/index.html`.

### New gallery item

1. Add the image asset under `artworks/`.
2. Add an item to the correct category in `site-src/content/gallery.js`.
3. Run `node scripts/build-site.mjs`.

### Site-wide settings

Update `site-src/content/site.js` for:

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

- `toys/` is the only editable source for the cloud widget.
- `embeds/cloud/` is built output and should not be treated as the source of truth.
- Keep the widget isolated from the main homepage runtime through the iframe boundary.

## Editing Discipline

- Prefer changing content files over generated HTML.
- Prefer changing shared templates over patching several pages separately.
- Rebuild after every structural content change.
- Preview locally before pushing.
- Avoid reintroducing Jekyll or another full framework unless there is a strong maintenance reason.

