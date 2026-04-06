(function () {
  var config = window.SITE_CONFIG || {}
  var measurementId = config.ga4MeasurementId

  if (!measurementId || /^G-?X+$/i.test(measurementId)) {
    return
  }

  if (!window.dataLayer) {
    window.dataLayer = []
  }

  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
  }

  if (!document.querySelector('script[data-ga4-loader="true"]')) {
    var loader = document.createElement('script')
    loader.async = true
    loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId)
    loader.setAttribute('data-ga4-loader', 'true')
    document.head.appendChild(loader)
  }

  if (!window.__siteGa4Initialized) {
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      send_page_view: false,
      anonymize_ip: true,
      debug_mode: Boolean(config.ga4Debug),
    })
    window.__siteGa4Initialized = true
  }

  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  })
})()


