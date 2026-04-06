import { escapeHtml } from "../lib/html.js"
import { renderDocument } from "./shared.js"

export function renderRedirectPage({ title, target, bodyHtml }) {
  const head = `<meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${escapeHtml(target)}">
  <script>window.location.replace('${target}');</script>`

  const body = `<body>
  <p>${bodyHtml}</p>
</body>`

  return renderDocument({
    head,
    body: body.replace(/^<body>/, "").replace(/<\/body>$/, ""),
    bodyTheme: "light",
  })
}
