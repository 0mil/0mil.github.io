import { escapeHtml } from "../shared/lib/html.js"
import { renderDocument } from "../shared/templates/shared.js"

export function renderPublicationPage({ site, publication }) {
  const { detail } = publication
  const authors = detail.authors.map((author) => {
    const name = escapeHtml(author.name)
    return `<span class="author-block">${author.href ? `<a href="${escapeHtml(author.href)}">${name}</a>` : name}<sup>${escapeHtml(author.affiliation)}</sup></span>`
  }).join(", ")
  const affiliations = detail.affiliations.map((affiliation) =>
    `<span class="author-block"><sup>${escapeHtml(affiliation.id)}</sup>${escapeHtml(affiliation.name)}</span>`
  ).join(" ")
  const resourceLinks = publication.links.filter((link) => link.label !== "project page").map((link) =>
    `<a class="button is-rounded is-dark" href="../../${escapeHtml(link.href)}">${escapeHtml(link.label === "manuscript" ? "Manuscript" : "Supplement")} <span class="file-type">PDF</span></a>`
  ).join("\n          ")
  const steps = detail.steps.map((step) =>
    `<li><strong>${escapeHtml(step.title)}.</strong> ${escapeHtml(step.text)}</li>`
  ).join("\n              ")
  const highlights = detail.highlights.map((item) =>
    `<div><dt>${escapeHtml(item.label)}</dt><dd class="highlight-value">${escapeHtml(item.value)}</dd><dd class="highlight-context">${escapeHtml(item.context)}</dd></div>`
  ).join("\n        ")
  const benchmarkRows = detail.benchmarkRows.map((row) =>
    `<tr${row.ours ? ' class="our-result"' : ""}><th scope="row">${escapeHtml(row.method)}</th>${row.values.map((value) => `<td>${row.ours ? `<strong>${escapeHtml(value)}</strong>` : escapeHtml(value)}</td>`).join("")}</tr>`
  ).join("\n              ")
  const paragraphs = (items) => items.map((text) => `<p>${escapeHtml(text)}</p>`).join("\n          ")
  const contact = site.socialLinks.find((link) => link.label === "Email")

  return renderDocument({
    head: `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${publication.unlisted ? '<meta name="robots" content="noindex, nofollow">' : ""}
  <meta name="description" content="${escapeHtml(detail.description)}">
  <title>${escapeHtml(publication.title)}</title>
  <link rel="icon" type="image/svg+xml" href="../../${escapeHtml(site.faviconPath)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css?family=Google+Sans|Noto+Sans" rel="stylesheet">
  <link rel="stylesheet" href="../drc-3dgs/static/css/bulma.min.css">
  <link rel="stylesheet" href="../drc-3dgs/static/css/index.css">
  <link rel="stylesheet" href="./static/css/project.css">
  <script defer src="../../assets/site-config.js"></script>
  <script defer src="../../assets/analytics.js"></script>`,
    body: `  <nav class="project-nav" aria-label="Project navigation">
    <a href="../../">Home</a>
    <div><a href="#overview">Overview</a><a href="#method">Method</a><a href="#results">Results</a></div>
  </nav>

  <header class="hero publication-header">
    <div class="hero-body">
      <div class="container is-max-desktop has-text-centered">
        <h1 class="title is-1 publication-title">${escapeHtml(publication.title)}</h1>
        <p class="publication-venue">${escapeHtml(publication.venue)}</p>
        <p class="is-size-5 publication-authors">${authors}</p>
        <p class="publication-affiliations">${affiliations}</p>
        <div class="publication-links">
          ${resourceLinks}
        </div>
      </div>
    </div>
  </header>

  <main class="project-main">
    <section class="teaser has-text-centered" aria-label="Research overview">
      <p class="project-summary">${escapeHtml(detail.summary)}</p>
      <dl class="research-highlights" aria-label="Key findings">
        ${highlights}
      </dl>
      <figure>
        <div class="comparison-scroll" tabindex="0" role="region" aria-label="Reconstruction comparison; scroll horizontally to see all methods">
          <a class="figure-link" href="./static/images/comparison.png" aria-label="View full-size reconstruction comparison">
            <img src="./static/images/comparison.png" width="2085" height="444"
                 alt="Reference and 100-bit reconstructions from INRSteg, GaussianImage, RoSteALS, and our Gabor Splatting method.">
          </a>
        </div>
        <div class="mobile-comparison">
          <a class="figure-link reference-panel" href="./static/images/comparison.png" aria-label="View the complete five-method comparison">
            <img src="./static/images/comparison.png" width="2085" height="444" alt="Reference reconstruction and stored phase, shown in the first panel of the comparison figure.">
          </a>
          <a class="figure-link ours-panel" href="./static/images/comparison.png" aria-label="View the complete five-method comparison">
            <img src="./static/images/comparison.png" width="2085" height="444" alt="Our Gabor Splatting reconstruction and stored phase, shown in the last panel of the comparison figure.">
          </a>
        </div>
        <p class="mobile-comparison-note">Reference and Ours. <a href="./static/images/comparison.png">View all methods</a>.</p>
        <p class="scroll-hint">Scroll horizontally to compare all methods.</p>
        <figcaption>${escapeHtml(detail.comparisonCaption)}</figcaption>
      </figure>
    </section>

    <section class="project-section" id="overview" aria-labelledby="overview-heading">
      <h2 class="title is-3" id="overview-heading">Information hiding in holographic content</h2>
      <div class="section-copy">
          ${paragraphs(detail.motivation)}
      </div>
    </section>

    <section class="project-section" id="method" aria-labelledby="method-heading">
      <h2 class="title is-3" id="method-heading">From a phase pattern to a keyed representation</h2>
      <div class="method-layout">
        <a class="figure-link method-figure" href="./static/images/method.png" aria-label="View full-size method pipeline">
          <img src="./static/images/method.png" width="893" height="1200" loading="lazy"
               alt="Pipeline: unpack the checkerboard hologram, fit two Gabor states, select a carrier by optical sensitivity, and use keyed QIM for embedding and recovery.">
        </a>
        <div class="method-copy">
          <p>${escapeHtml(detail.overview)}</p>
          <ol class="method-steps">
              ${steps}
          </ol>
        </div>
      </div>
    </section>

    <section class="project-section" id="results" aria-labelledby="results-heading">
      <h2 class="title is-3" id="results-heading">Reconstruction quality at a fixed payload</h2>
      <div class="section-copy">
        <p>${escapeHtml(detail.setup)}</p>
      </div>
      <div class="table-scroll" tabindex="0" role="region" aria-label="Quantitative results; scroll horizontally for all metrics">
        <table class="benchmark-table">
          <caption>Mean quality at 100 bits over 200 sources</caption>
          <thead>
            <tr><th scope="col">Method</th><th scope="col">PDA-PSNR ↑</th><th scope="col">PSNR ↑</th><th scope="col">SSIM ↑</th><th scope="col">LPIPS ↓</th></tr>
          </thead>
          <tbody>
              ${benchmarkRows}
          </tbody>
        </table>
      </div>
      <p class="table-hint">Scroll horizontally to see all reconstruction metrics.</p>
      <p class="figure-note">${escapeHtml(detail.benchmarkNote)}</p>
      <div class="section-copy benchmark-discussion">
        <p>${escapeHtml(detail.result)}</p>
        <p>${escapeHtml(detail.parameterNote)}</p>
      </div>

      <article class="result-block" aria-labelledby="payload-heading">
        <div class="result-copy">
          <h3 class="title is-4" id="payload-heading">${escapeHtml(detail.payload.title)}</h3>
          <p>${escapeHtml(detail.payload.text)}</p>
        </div>
        <figure>
          <a class="figure-link" href="./static/images/payload-distortion.png" aria-label="View full-size payload distortion plot">
            <img src="./static/images/payload-distortion.png" width="929" height="759" loading="lazy"
                 alt="Across 25 to 1,000 bits, embedding-only reconstruction PSNR decreases while end-to-end reconstruction PSNR stays nearly constant. Gabor Splatting has higher end-to-end fidelity than GaussianImage.">
          </a>
          <figcaption>${escapeHtml(detail.payload.caption)}</figcaption>
        </figure>
      </article>

      <article class="result-block" aria-labelledby="hardware-heading">
        <div class="result-copy">
          <h3 class="title is-4" id="hardware-heading">${escapeHtml(detail.hardware.title)}</h3>
          <p>${escapeHtml(detail.hardware.text)}</p>
        </div>
        <figure>
          <a class="figure-link" href="./static/images/hardware.png" aria-label="View full-size optical captures">
            <img src="./static/images/hardware.png" width="975" height="594" loading="lazy"
                 alt="Optical captures before and after embedding 100 bits, showing comparable scene structure and local detail.">
          </a>
          <figcaption>${escapeHtml(detail.hardware.caption)}</figcaption>
        </figure>
      </article>
    </section>

    <section class="project-section" aria-labelledby="scope-heading">
      <h2 class="title is-3" id="scope-heading">Scope and next steps</h2>
      <div class="section-copy">
          ${paragraphs(detail.scope)}
      </div>
      <div class="project-resources">
        <p>${escapeHtml(detail.releaseNote)}</p>
        ${contact ? `<p>Questions about this work? <a href="${escapeHtml(contact.href)}">Contact Jin-Hyeong Park</a>.</p>` : ""}
      </div>
    </section>
  </main>

  <footer class="project-footer">
    <p>Page based on the <a href="https://nerfies.github.io/">Nerfies</a> template.</p>
  </footer>`,
  })
}
