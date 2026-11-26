(function () {
  // stamp menu
  var page = document.querySelector('.page'), stamp = document.querySelector('.stamp');
  if (page && stamp) {
    stamp.addEventListener('click', function () {
      var open = page.classList.toggle('open');
      stamp.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // book carousel
  var stage = document.querySelector('.stage');
  if (stage) {
    var slides = stage.querySelectorAll('img'), i = 0, x0 = null;
    var show = function (n) {
      i = (n + slides.length) % slides.length;
      for (var k = 0; k < slides.length; k++) {
        slides[k].classList.toggle('on', k === i);
        slides[k].setAttribute('aria-hidden', k === i ? 'false' : 'true');
      }
    };
    document.querySelector('.prev').addEventListener('click', function () { show(i - 1); });
    document.querySelector('.next').addEventListener('click', function () { show(i + 1); });
    stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
    });
    show(0);
  }

  // lightbox for Frame, the book and the collection
  var box = document.querySelector('.lightbox');
  if (box) {
    var big = box.querySelector('img'), title = box.querySelector('.t'), last = null;
    var close = function () { box.classList.remove('show'); if (last) last.focus(); };
    document.querySelectorAll('[data-full]').forEach(function (b) {
      b.addEventListener('click', function () {
        last = b; big.src = b.getAttribute('data-full'); big.alt = b.querySelector('img').alt;
        title.textContent = b.getAttribute('data-title'); box.classList.add('show');
        box.querySelector('.close').focus();
      });
    });
    var open = function (src, alt, t, from) {
      last = from; big.src = src; big.alt = alt; title.textContent = t;
      box.classList.add('show'); box.querySelector('.close').focus();
    };
    if (stage) {
      var moved = false;
      stage.addEventListener('touchmove', function () { moved = true; }, { passive: true });
      stage.addEventListener('touchstart', function () { moved = false; }, { passive: true });
      var openBook = function () {
        var cur = stage.querySelector('img.on');
        if (cur) open(cur.getAttribute('src'), cur.alt, 'Provenance', stage);
      };
      stage.addEventListener('click', function () { if (!moved) openBook(); });
      stage.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBook(); }
      });
    }
    box.querySelector('.close').addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('show')) close(); });
  }
})();
