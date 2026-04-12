import { escapeHtml, resolvePath } from "../shared/lib/html.js"
import {
  renderBackHeader,
  renderDocument,
  renderFooter,
  renderHead,
} from "../shared/templates/shared.js"

function renderFigures(figures = [], layout = "auto") {
  if (!figures.length) {
    return ""
  }

  const figureClass = layout === "stack" || figures.length === 1 ? "detail-figure-stack" : layout === "asymmetric" ? "detail-figure-grid detail-figure-grid-asymmetric" : layout === "equal" ? "detail-figure-grid detail-figure-grid-equal" : "detail-figure-grid"
  return `<div class="${figureClass}">
              ${figures
                .map(
                  (figure) => `<figure class="detail-figure-card">
                <img src="${resolvePath("../../", figure.src)}" alt="${escapeHtml(figure.alt)}" class="detail-figure-image">
              </figure>`
                )
                .join("\n              ")}
            </div>`
}

function renderSection(section) {
  const figures = renderFigures(section.figures, section.figureLayout || "auto")
  const paragraphs = (section.paragraphs || [])
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n              ")

  const items = (section.items || []).length
    ? `<ul class="detail-list">
              ${section.items
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("\n              ")}
            </ul>`
    : ""

  const link = section.link
    ? `<p><a href="${escapeHtml(section.link.href)}" class="pub-link" target="_blank" rel="noopener noreferrer">${escapeHtml(section.link.label)}</a></p>`
    : ""

  return `<section class="section">
            <div class="section-header">
              <div class="section-label">${escapeHtml(section.label)}</div>
            </div>
            <div class="detail-copy">
              ${figures}
              ${paragraphs}
              ${items}
              ${link}
            </div>
          </section>`
}

export function renderProjectPage({ site, project }) {
  const { detail } = project
  const mediaLinks = detail.heroVideo ? [] : detail.mediaLinks || []
  const extraSections = detail.sections || []
  const heroMediaHtml = detail.heroVideo
    ? `<div class="detail-hero-video-shell">
          <video class="detail-hero-video-player" controls preload="metadata" playsinline>
            <source src="${resolvePath("../../", detail.heroVideo.src)}" type="${escapeHtml(detail.heroVideo.type || "video/mp4")}">
            Your browser does not support the video tag.
          </video>
        </div>`
    : `<img class="detail-hero-image" src="${resolvePath("../../", detail.heroImage)}" alt="${escapeHtml(detail.heroAlt)}">`

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
          ${heroMediaHtml}
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
          ${
            detail.quote
              ? `<blockquote class="detail-quote">${escapeHtml(detail.quote)}</blockquote>`
              : ""
          }
          <section class="section">
            <div class="section-header">
              <div class="section-label">Overview</div>
            </div>
            <div class="detail-copy">
              ${renderFigures(detail.overviewFigures || [])}
              ${detail.overview
                .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
                .join("\n              ")}
            </div>
          </section>
          ${extraSections.map(renderSection).join("\n          ")}
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



