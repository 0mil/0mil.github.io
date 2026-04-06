import { escapeHtml, resolvePath } from "../lib/html.js"

export function renderThemeToggle() {
  return `<button class="theme-toggle" data-theme-toggle type="button" aria-label="Toggle theme">
          <i class="fa-solid fa-moon" data-theme-icon aria-hidden="true"></i>
        </button>`
}

export function renderHead({ site, pageTitle, description, toRoot }) {
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(description)}">
  <title>${escapeHtml(pageTitle)}</title>
  <link rel="icon" type="image/svg+xml" href="${resolvePath(toRoot, site.faviconPath)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${site.fontsUrl}" rel="stylesheet">
  <link rel="stylesheet" href="${site.fontAwesomeUrl}">
  <link rel="stylesheet" href="${resolvePath(toRoot, "assets/styles.css")}">
  <script defer src="${resolvePath(toRoot, "assets/site-config.js")}"></script>
  <script defer src="${resolvePath(toRoot, "assets/analytics.js")}"></script>`
}

export function renderSocialIcons(site) {
  return `<div class="social-icons">
${site.socialLinks
  .map(
    (link) => `          <a href="${escapeHtml(link.href)}" class="icon-link" aria-label="${escapeHtml(link.label)}">
            <i class="${escapeHtml(link.iconClass)}"></i>
          </a>`
  )
  .join("\n")}
        </div>`
}

export function renderBackHeader({ href, label }) {
  return `<header class="header">
      <a href="${escapeHtml(href)}" class="logo" aria-label="Back to home">
        ${label
          .split("")
          .map((char, index) => {
            const text = char === " " ? "&nbsp;" : escapeHtml(char)
            return `<span style="--i:${index}">${text}</span>`
          })
          .join("")}
      </a>
      <div class="header-right">
        ${renderThemeToggle()}
      </div>
    </header>`
}

export function renderFooter({ text, linkHref, linkLabel }) {
  if (!linkHref || !linkLabel) {
    return `<footer class="footer">
    <p><span class="copyright-name">Jin-Hyeong Park</span> &copy; 2026</p>
  </footer>`
  }

  return `<footer class="footer">
    <p><span class="copyright-name">Jin-Hyeong Park</span> &copy; 2026 &middot; <a href="${escapeHtml(linkHref)}">${escapeHtml(linkLabel)}</a></p>
  </footer>`
}

export function renderDocument({ htmlLang = "en", head, body, bodyTheme = "light" }) {
  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  ${head}
</head>
<body data-theme="${bodyTheme}">
${body}
</body>
</html>
`
}

