document.addEventListener("DOMContentLoaded", function () {
  var burgers = Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"), 0);
  burgers.forEach(function (burger) {
    burger.addEventListener("click", function () {
      var targetId = burger.dataset.target;
      var target = document.getElementById(targetId);
      burger.classList.toggle("is-active");
      if (target) {
        target.classList.toggle("is-active");
      }
    });
  });

  var sliders = Array.prototype.slice.call(document.querySelectorAll(".comparison-slider"), 0);
  sliders.forEach(function (sliderRoot) {
    var overlay = sliderRoot.querySelector(".comparison-overlay");
    var divider = sliderRoot.querySelector(".comparison-divider");
    var stage = sliderRoot.querySelector(".comparison-stage");
    if (!overlay || !divider || !stage) {
      return;
    }

    function syncOverlayWidth() {
      var overlayInner = overlay.querySelector(".comparison-inner");
      if (overlayInner) {
        overlayInner.style.width = stage.getBoundingClientRect().width + "px";
      }
    }

    function applyValue(value) {
      var safeValue = Math.max(0, Math.min(100, Number(value)));
      syncOverlayWidth();
      overlay.style.width = safeValue + "%";
      divider.style.left = safeValue + "%";
    }

    function updateFromClientX(clientX) {
      var rect = stage.getBoundingClientRect();
      if (!rect.width) {
        return;
      }
      var percent = ((clientX - rect.left) / rect.width) * 100;
      applyValue(percent);
    }

    stage.addEventListener("pointermove", function (event) {
      updateFromClientX(event.clientX);
    });

    stage.addEventListener("pointerdown", function (event) {
      updateFromClientX(event.clientX);
    });

    stage.addEventListener("touchstart", function (event) {
      if (event.touches[0]) {
        updateFromClientX(event.touches[0].clientX);
      }
    }, { passive: true });

    stage.addEventListener("touchmove", function (event) {
      if (event.touches[0]) {
        updateFromClientX(event.touches[0].clientX);
      }
    }, { passive: true });

    stage.addEventListener("mouseleave", function () {
      applyValue(sliderRoot.dataset.initial || 50);
    });

    window.addEventListener("resize", function () {
      syncOverlayWidth();
      applyValue(sliderRoot.dataset.initial || 50);
    });

    applyValue(sliderRoot.dataset.initial || 50);
  });
});
