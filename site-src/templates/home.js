import { escapeHtml, renderTextParts } from "../lib/html.js"
import {
  renderDocument,
  renderFooter,
  renderHead,
  renderSocialIcons,
  renderThemeToggle,
} from "./shared.js"

function renderPublicationCard(publication) {
  const imageMarkup =
    publication.image.type === "journal"
      ? `<div class="pub-image-container pub-image-container-text">
                    <div class="pub-journal-card">
                      ${publication.image.lines
                        .map(
                          (line) =>
                            `<span class="pub-journal-line">${escapeHtml(line)}</span>`
                        )
                        .join("\n                      ")}
                    </div>
                  </div>`
      : `<div class="pub-image-container">
                  <div class="img-after"><img src="${escapeHtml(publication.image.src)}" alt="${escapeHtml(publication.image.alt)}"></div>
                  <img src="${escapeHtml(publication.image.src)}" alt="${escapeHtml(publication.title)}">
                </div>`

  return `<article class="pub-card">
                ${imageMarkup}
                <div class="pub-info">
                  <h3 class="pub-title">${escapeHtml(publication.title)}</h3>
                  <p class="pub-authors">${escapeHtml(publication.authors)}</p>
                  <p class="pub-venue">${escapeHtml(publication.venue)}</p>
                  <div class="pub-links">
                    ${publication.links
                      .map(
                        (link) =>
                          `<a href="${escapeHtml(link.href)}" class="pub-link">${escapeHtml(link.label)}</a>`
                      )
                      .join("\n                    ")}
                  </div>
                </div>
              </article>`
}

function renderProjectCard(project) {
  const detailLink = project.slug
    ? [{ href: `projects/${project.slug}/`, label: "project page" }]
    : []
  const links = [...detailLink, ...(project.cardLinks || [])]

  return `<div class="project-card">
                <div class="pub-image-container">
                  <div class="img-after"><img src="${escapeHtml(project.cardImage.src)}" alt=""></div>
                  <img src="${escapeHtml(project.cardImage.src)}" alt="${escapeHtml(project.cardImage.alt)}">
                </div>
                <div class="project-info">
                  <h4 class="project-title">${escapeHtml(project.title)}</h4>
                  <p class="project-venue">${escapeHtml(project.venue)}</p>
                  <p class="project-desc">${escapeHtml(project.cardDescription)}</p>
                  ${
                    links.length
                      ? `<div class="project-links">
                    ${links
                      .map(
                        (link) =>
                          `<a href="${escapeHtml(link.href)}" class="pub-link">${escapeHtml(link.label)}</a>`
                      )
                      .join("\n                    ")}
                  </div>`
                      : ""
                  }
                </div>
              </div>`
}

export function renderHomePage({ site, home, publications, projects }) {
  const featuredPublications = publications.filter((item) => item.featured)
  const earlierPublications = publications.filter((item) => !item.featured)

  const body = `  <div class="container">
    <header class="header header-minimal">
      <div class="header-right">
        ${renderThemeToggle()}
      </div>
    </header>

    <section class="hero">
      <div class="hero-left">
        <div class="profile-coin" aria-label="${escapeHtml(site.title)} profile image">
          <div class="profile-coin-inner">
            <div class="profile-face profile-face-front">
              <img src="${escapeHtml(site.profileImagePath)}" alt="${escapeHtml(site.title)}" class="profile-image">
            </div>
            <div class="profile-face profile-face-back" aria-hidden="true">
              <img src="${escapeHtml(site.profileImagePath)}" alt="" class="profile-image profile-image-gray">
            </div>
          </div>
        </div>
        <a href="${escapeHtml(site.cvPath)}" class="cv-link">Curriculum Vitae</a>
        ${renderSocialIcons(site)}
      </div>

      <div class="hero-bio">
        <h1 class="hero-name" aria-label="${escapeHtml(site.title)}">${site.title
          .split("")
          .map((char, index) => {
            const text = char === " " ? "&nbsp;" : escapeHtml(char)
            return `<span style="--i:${index}">${text}</span>`
          })
          .join("")}</h1>
        ${home.introParagraphs
          .map((paragraph) => `        <p>${escapeHtml(paragraph)}</p>`)
          .join("\n")}
      </div>
    </section>

    <main class="main-content">
      <div class="organic-grid">
        <div class="left-column">
          <section class="section">
            <div class="section-header">
              <div class="section-label">News</div>
            </div>
            <div class="news-list news-list-template">
              ${home.news
                .map(
                  (item) => `<div class="news-item">
                <span class="news-date">${escapeHtml(item.date)}</span>
                <span class="news-text">${renderTextParts(item.parts)}</span>
              </div>`
                )
                .join("\n              ")}
            </div>
          </section>

          <section class="section">
            <div class="cloud-widget-card">
              <iframe
                src="${escapeHtml(home.cloudWidgetSrc)}"
                title="Interactive single cloud widget"
                loading="lazy"
                class="cloud-widget-frame"></iframe>
            </div>
          </section>
        </div>

        <div class="right-column">
          <section class="section">
            <div class="section-header">
              <div class="section-label">Experience</div>
            </div>
            <div class="news-list">
              ${home.experience
                .map(
                  (item) => `<div class="news-item">
                <span class="news-text"><strong>${escapeHtml(item.organization)}</strong><br>${escapeHtml(item.role)}</span>
                <span class="news-date">${escapeHtml(item.period)}</span>
              </div>`
                )
                .join("\n              ")}
            </div>
          </section>

          <section class="section" id="publications">
            <div class="section-header">
              <div class="section-label">Publications</div>
            </div>
            <div class="pub-list">
              ${featuredPublications.map(renderPublicationCard).join("\n              ")}

              <div class="pub-collapse" data-pub-collapse>
                <button class="pub-collapse-toggle" type="button" aria-expanded="false" data-pub-collapse-toggle>
                  <span>Earlier Publications</span>
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
                <div class="pub-collapse-panel" hidden data-pub-collapse-panel>
                  ${earlierPublications.map(renderPublicationCard).join("\n                  ")}
                </div>
              </div>
            </div>
          </section>

          <section class="section" id="projects">
            <div class="section-header">
              <div class="section-label">Projects</div>
            </div>
            <div class="project-grid">
              ${projects.map(renderProjectCard).join("\n              ")}
            </div>
          </section>

          <section class="section">
            <div class="section-header">
              <div class="section-label">Miscellany</div>
            </div>
            <p class="miscellany-copy">${escapeHtml(home.miscellany.copy)}</p>
            <div class="miscellany-links">
              <a href="${escapeHtml(home.miscellany.link.href)}" class="pub-link">${escapeHtml(home.miscellany.link.label)}</a>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>

  ${renderFooter({ text: site.title })} 

  <script src="assets/main.js"></script>`

  return renderDocument({
    head: renderHead({
      site,
      pageTitle: site.title,
      description: site.description,
      toRoot: "",
    }),
    body,
    bodyTheme: "light",
  })
}
