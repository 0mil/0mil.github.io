import { escapeHtml, resolvePath } from "../lib/html.js"
import {
  renderBackHeader,
  renderDocument,
  renderFooter,
  renderHead,
} from "./shared.js"

function renderGalleryItem(item) {
  return `<article class="gallery-card">
            <a class="gallery-card-link" href="${escapeHtml(resolvePath("../", item.assetPath))}" data-gallery-item data-title="${escapeHtml(item.title)}" data-year="${escapeHtml(item.year)}">
              <img src="${escapeHtml(resolvePath("../", item.assetPath))}" alt="${escapeHtml(item.title)}">
              <div class="gallery-card-copy">
                <div class="gallery-card-title">${escapeHtml(item.title)}</div>
                <div class="gallery-card-meta">${escapeHtml(item.year)}</div>
              </div>
            </a>
          </article>`
}

export function renderGalleryPage({ site, gallery }) {
  const body = `  <div class="container page-shell">
    ${renderBackHeader({ href: "../", label: "Gallery" })}

    <section class="page-hero">
      <div class="section-header">
        <div class="section-label">Gallery</div>
      </div>
      <h1 class="page-title">${escapeHtml(gallery.title)}</h1>
      <div class="page-intro">
        <p>${escapeHtml(gallery.intro)}</p>
      </div>
    </section>

    <main class="main-content">
      ${gallery.categories
        .map(
          (category) => `<section class="section">
        <div class="section-header">
          <div class="section-label">${escapeHtml(category.label)}</div>
        </div>
        <div class="${escapeHtml(category.className)}">
          ${category.items.map(renderGalleryItem).join("\n          ")}
        </div>
      </section>`
        )
        .join("\n      ")}
    </main>
  </div>

  <div class="gallery-lightbox" data-gallery-lightbox aria-hidden="true">
    <div class="gallery-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Artwork preview">
      <button class="gallery-lightbox-close" type="button" aria-label="Close preview">&times;</button>
      <figure class="gallery-lightbox-figure">
        <img class="gallery-lightbox-image" src="" alt="">
        <figcaption class="gallery-lightbox-caption">
          <span class="gallery-lightbox-title"></span>
          <span class="gallery-lightbox-meta"></span>
        </figcaption>
      </figure>
    </div>
  </div>

  ${renderFooter({
    text: site.title,
    linkHref: "../",
    linkLabel: "back to main page",
  })}

  <script src="../assets/main.js"></script>`

  return renderDocument({
    head: renderHead({
      site,
      pageTitle: `Gallery - ${site.title}`,
      description: "Gallery of computer-generated works and analog drawings by Jin-Hyeong Park.",
      toRoot: "../",
    }),
    body,
    bodyTheme: "light",
  })
}


