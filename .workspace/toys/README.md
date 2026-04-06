# Toys Cloud Widget

This directory is the isolated source for the homepage cloud widget.

## Source of truth
- Edit the cloud implementation here, not in `embeds/cloud/`.
- `embeds/cloud/` contains generated static build output only.

## Rebuild and publish
From the repo root, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\toys\build-for-site.ps1
```

This script:
- uses the local Node runtime in `.conda-node`
- builds the app with `PUBLIC_URL=.` for nested static hosting
- publishes the output into `embeds/cloud/`

## Local preview before GitHub Pages
From the repo root, run:

```powershell
python -m http.server 8000
```

Then open:
- `http://localhost:8000/`
- `http://localhost:8000/embeds/cloud/`
