export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function resolvePath(toRoot, relativePath) {
  return `${toRoot}${relativePath}`
}

export function renderTextParts(parts) {
  return parts
    .map((part) => {
      const text = escapeHtml(part.text)
      let inner = text

      if (part.strong) {
        inner = `<strong>${inner}</strong>`
      }

      if (!part.href) {
        return inner
      }

      const classAttr = part.accent ? ' class="news-link-accent"' : ""
      return `<a href="${escapeHtml(part.href)}"${classAttr}>${inner}</a>`
    })
    .join("")
}

export function indent(text, prefix = "  ") {
  return text
    .split("\n")
    .map((line) => (line ? `${prefix}${line}` : line))
    .join("\n")
}
