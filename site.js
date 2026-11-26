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
        box.classList.remove('book');
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
        if (!cur) return;
        box.classList.add('book');
        open(cur.getAttribute('src'), cur.alt, 'Provenance', stage);
      };
      var turn = function (d) {
        show(i + d);
        var cur = stage.querySelector('img.on');
        big.src = cur.getAttribute('src'); big.alt = cur.alt;
      };
      box.querySelector('.lb-prev').addEventListener('click', function () { turn(-1); });
      box.querySelector('.lb-next').addEventListener('click', function () { turn(1); });
      var bx = null;
      box.addEventListener('touchstart', function (e) { bx = e.touches[0].clientX; }, { passive: true });
      box.addEventListener('touchend', function (e) {
        if (bx === null || !box.classList.contains('book')) return;
        var dx = e.changedTouches[0].clientX - bx; bx = null;
        if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1);
      });
      document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('show') || !box.classList.contains('book')) return;
        if (e.key === 'ArrowLeft') turn(-1);
        if (e.key === 'ArrowRight') turn(1);
      });
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
