import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { gallery } from "../site-src/gallery/content.js"
import { home } from "../site-src/home/content.js"
import { projects } from "../site-src/projects/content.js"
import { publications } from "../site-src/publications/content.js"
import { redirects } from "../site-src/shared/redirects.js"
import { site } from "../site-src/shared/site.js"
import { renderGalleryPage } from "../site-src/gallery/template.js"
import { renderHomePage } from "../site-src/home/template.js"
import { renderProjectPage } from "../site-src/projects/template.js"
import { renderRedirectPage } from "../site-src/shared/templates/redirect.js"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..")

function writeFile(relativePath, content) {
  const outputPath = path.join(repoRoot, relativePath)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, content, "utf8")
}

function buildSiteConfig() {
  return `window.SITE_CONFIG = Object.assign(
  {
    ga4MeasurementId: "${site.ga4MeasurementId}",
    ga4Debug: false,
    themeStorageKey: "${site.themeStorageKey}",
  },
  window.SITE_CONFIG || {}
)
`
}

function buildProjectTemplate(project) {
  if (!project.slug || !project.detail) {
    return
  }
  writeFile(`projects/${project.slug}/index.html`, renderProjectPage({ site, project }))
}

writeFile("index.html", renderHomePage({ site, home, publications, projects }))
writeFile("gallery/index.html", renderGalleryPage({ site, gallery }))
writeFile("assets/site-config.js", buildSiteConfig())

projects.forEach(buildProjectTemplate)

redirects.forEach((redirect) => {
  writeFile(
    redirect.outputPath,
    renderRedirectPage({
      title: redirect.title,
      target: redirect.target,
      bodyHtml: redirect.bodyHtml,
    })
  )
})

console.log("Built site HTML and site config.")
