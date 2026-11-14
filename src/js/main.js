(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll-reveal: one authored moment, not scattered per-element effects
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Copy IBAN to clipboard
  var copyBtn = document.querySelector("[data-copy-iban]");
  if (copyBtn) {
    var label = copyBtn.querySelector("[data-copy-label]");
    var defaultLabel = label ? label.textContent : "";
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy-text") || "";
      var done = function () {
        copyBtn.setAttribute("data-copied", "true");
        if (label) label.textContent = "Kopiert!";
        setTimeout(function () {
          copyBtn.removeAttribute("data-copied");
          if (label) label.textContent = defaultLabel;
        }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text);
          done();
        });
      } else {
        fallbackCopy(text);
        done();
      }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }

  // Horizontally scrollable "Unsere Geschichte" gallery: prev/next + dots
  var gallery = document.getElementById("gallery");
  if (gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-item"));
    var dotsWrap = document.querySelector("[data-gallery-dots]");
    var prevBtn = document.querySelector("[data-gallery-prev]");
    var nextBtn = document.querySelector("[data-gallery-next]");
    var dots = [];

    items.forEach(function (item, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot";
      dot.setAttribute("aria-label", "Bild " + (i + 1) + " von " + items.length + " anzeigen");
      dot.addEventListener("click", function () {
        item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function currentIndex() {
      var galleryCenter = gallery.scrollLeft + gallery.clientWidth / 2;
      var closest = 0;
      var closestDist = Infinity;
      items.forEach(function (item, i) {
        var itemCenter = item.offsetLeft + item.clientWidth / 2;
        var dist = Math.abs(itemCenter - galleryCenter);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      return closest;
    }

    function updateDots() {
      var idx = currentIndex();
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    }

    function scrollBy(direction) {
      var idx = currentIndex();
      var target = items[Math.min(items.length - 1, Math.max(0, idx + direction))];
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { scrollBy(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollBy(1); });

    gallery.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); scrollBy(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollBy(-1); }
    });

    var scrollTimer;
    gallery.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateDots, 100);
    });

    updateDots();
  }
})();
