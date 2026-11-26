(function () {
  // stamp menu
  var page = document.querySelector('.page'), stamp = document.querySelector('.stamp');
  if (page && stamp) {
    stamp.addEventListener('click', function () {
      var open = page.classList.toggle('open');
      stamp.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // a deliberate one-finger sideways swipe; ignores pinches, zoomed-in panning and slow drags
  var onSwipe = function (el, fn) {
    var sx = 0, sy = 0, t0 = 0, multi = false;
    el.addEventListener('touchstart', function (e) {
      if (e.touches.length > 1) { multi = true; return; }
      multi = false; sx = e.touches[0].clientX; sy = e.touches[0].clientY; t0 = Date.now();
    }, { passive: true });
    el.addEventListener('touchmove', function (e) { if (e.touches.length > 1) multi = true; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (multi || e.touches.length > 0) return;
      if (window.visualViewport && window.visualViewport.scale > 1.05) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy) && Date.now() - t0 < 700) fn(dx < 0 ? 1 : -1);
    });
  };

  // a fading carousel: stage element, its arrow buttons
  var carousel = function (stage, prevBtn, nextBtn) {
    var slides = stage.querySelectorAll('img'), c = { i: 0, moved: false };
    c.show = function (n) {
      c.i = (n + slides.length) % slides.length;
      for (var k = 0; k < slides.length; k++) {
        slides[k].classList.toggle('on', k === c.i);
        slides[k].setAttribute('aria-hidden', k === c.i ? 'false' : 'true');
      }
    };
    c.current = function () { return slides[c.i]; };
    prevBtn.addEventListener('click', function () { c.show(c.i - 1); });
    nextBtn.addEventListener('click', function () { c.show(c.i + 1); });
    onSwipe(stage, function (d) { c.moved = true; c.show(c.i + d); setTimeout(function () { c.moved = false; }, 400); });
    c.show(0);
    return c;
  };

  var bookStage = document.querySelector('.stage');
  var book = bookStage ? carousel(bookStage, document.querySelector('.prev'), document.querySelector('.next')) : null;
  var frameStage = document.querySelector('.fstage');
  var frame = frameStage ? carousel(frameStage, document.querySelector('.fprev'), document.querySelector('.fnext')) : null;

  // lightbox for Frame, the book and the collection
  var box = document.querySelector('.lightbox');
  if (!box) return;
  var big = box.querySelector('img'), title = box.querySelector('.t'), last = null, active = null;
  var close = function () { box.classList.remove('show', 'book'); active = null; if (last) last.focus(); };
  var open = function (src, alt, t, from) {
    last = from; big.src = src; big.alt = alt; title.textContent = t;
    box.classList.add('show'); box.querySelector('.close').focus();
  };
  document.querySelectorAll('[data-full]').forEach(function (b) {
    b.addEventListener('click', function () {
      box.classList.remove('book'); active = null;
      open(b.getAttribute('data-full'), b.querySelector('img').alt, b.getAttribute('data-title'), b);
    });
  });
  var openFrom = function (c, stage, t, isBook) {
    if (c.moved) return;
    active = c; box.classList.toggle('book', isBook);
    var cur = c.current(); open(cur.getAttribute('src'), cur.alt, t, stage);
  };
  var turn = function (d) {
    if (!active) return;
    active.show(active.i + d);
    var cur = active.current(); big.src = cur.getAttribute('src'); big.alt = cur.alt;
  };
  [[book, bookStage, 'Provenance', true], [frame, frameStage, 'Frame', false]].forEach(function (a) {
    if (!a[0]) return;
    a[1].addEventListener('click', function () { openFrom(a[0], a[1], a[2], a[3]); });
    a[1].addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFrom(a[0], a[1], a[2], a[3]); }
    });
  });
  box.querySelector('.lb-prev').addEventListener('click', function () { turn(-1); });
  box.querySelector('.lb-next').addEventListener('click', function () { turn(1); });
  onSwipe(box, turn);
  box.querySelector('.close').addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('show')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') turn(-1);
    if (e.key === 'ArrowRight') turn(1);
  });
})();
