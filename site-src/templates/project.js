import { escapeHtml, resolvePath } from "../lib/html.js"
import {
  renderBackHeader,
  renderDocument,
  renderFooter,
  renderHead,
} from "./shared.js"

export function renderProjectPage({ site, project }) {
  const { detail } = project
  const mediaLinks = detail.mediaLinks || []

  const body = `  <div class="container page-shell">
    ${renderBackHeader({ href: "../../", label: "Project" })}

    <section class="page-hero">
      <div class="section-header">
        <div class="section-label">Project Page</div>
      </div>
      <h1 class="page-title">${escapeHtml(project.title)}</h1>
      <div class="page-intro">
        <p>${escapeHtml(detail.intro)}</p>
      </div>
      <div class="page-meta-inline">
        <span><strong>Organization</strong> ${escapeHtml(detail.organization)}</span>
        <span><strong>Period</strong> ${escapeHtml(detail.period)}</span>
        <span><strong>Keywords</strong> ${escapeHtml(detail.keywords)}</span>
      </div>
    </section>

    <main class="main-content">
      <div class="detail-layout detail-layout-single">
        <div>
          <img class="detail-hero-image" src="${resolvePath("../../", detail.heroImage)}" alt="${escapeHtml(detail.heroAlt)}">
          ${
            mediaLinks.length
              ? `<div class="project-media-links">
            ${mediaLinks
              .map(
                (link) =>
                  `<a href="${escapeHtml(link.href)}" class="pub-link" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`
              )
              .join("\n            ")}
          </div>`
              : ""
          }
          <section class="section">
            <div class="section-header">
              <div class="section-label">Overview</div>
            </div>
            <div class="detail-copy">
              ${detail.overview
                .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
                .join("\n              ")}
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>

  ${renderFooter({
    text: site.title,
    linkHref: "../../",
    linkLabel: "return to homepage",
  })}

  <script src="../../assets/main.js"></script>`

  return renderDocument({
    head: renderHead({
      site,
      pageTitle: `${project.title} - ${site.title}`,
      description: detail.metaDescription,
      toRoot: "../../",
    }),
    body,
    bodyTheme: "light",
  })
}
