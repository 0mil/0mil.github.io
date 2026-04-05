# v2_tiny Cloud Widget

This directory is the isolated source for the `v2` homepage cloud widget.

## Source of truth
- Edit the cloud implementation here, not in `v2/embeds/cloud/`.
- `v2/embeds/cloud/` contains generated static build output only.

## Rebuild and publish
From the repo root, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\v2_tiny\build-for-v2.ps1
```

This script:
- uses the local Node runtime in `.conda-node`
- builds the app with `PUBLIC_URL=.` for nested static hosting
- publishes the output into `v2/embeds/cloud/`

## Local preview before GitHub Pages
From the repo root, run:

```powershell
python -m http.server 8000
```

Then open:
- `http://localhost:8000/v2/`
- `http://localhost:8000/v2/embeds/cloud/`