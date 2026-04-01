# v2 Site Guide

This folder is the working homepage for the first migration pass.

## Folder structure

- `index.html`
  - main homepage
- `gallery/`
  - gallery page
- `projects/`
  - project detail pages
- `projects/_template/`
  - copy this when creating a new project page
- `publications/`
  - paper / poster style academic publication pages
- `assets/styles.css`
  - shared styles for every page
- `assets/main.js`
  - shared theme toggle behavior

## How to add a new project page

1. Copy `projects/_template/` to `projects/<your-slug>/`
2. Edit `projects/<your-slug>/index.html`
3. Replace:
   - page title
   - meta description
   - hero image
   - overview text
   - metadata fields
4. Open `index.html`
5. Add one more project card inside the `project-grid` block
6. Point its `project-page` link to `projects/<your-slug>/`

Example:

- `projects/hair-guide/`
- link from main page: `projects/hair-guide/`

## How to update publications

Open `index.html` and find the `pub-list` block.

- Duplicate one `article.pub-card`
- change title, authors, venue, image, and paper link

For publication-specific standalone pages:

- create `publications/<your-slug>/`
- keep a single `index.html` there
- use it for paper/poster pages that need a dedicated academic landing page

Example:

- `publications/drc-3dgs/`
- link from main page or publication list: `publications/drc-3dgs/`

## How to update gallery

Open `gallery/index.html`.

- Add or remove `article.gallery-card` blocks
- Images currently point to `../../artworks/...`

## When to edit shared styles

Only edit `assets/styles.css` when you want site-wide visual changes.

Examples:

- font sizes
- colors
- spacing
- card appearance
- mobile behavior

If you only want to add content, avoid editing CSS first.

## Recommended content workflow

1. Create the new project page from `projects/_template/`
2. Confirm the page works
3. Add the card to the main page
4. If relevant, add related artwork to the gallery page

## Notes

- Folder URLs are intentional. A page lives at `projects/<slug>/index.html` but links should use `projects/<slug>/`.
- Keep project images in the existing shared asset folders unless you later decide to move to per-project asset folders.
