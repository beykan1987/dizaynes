// Dizaynes — sayfa etkileşimleri
(function () {
  'use strict';

  // Kayan galeri: kesintisiz döngü için içeriği bir kez çoğalt
  var marq = document.getElementById('marq');
  if (marq) {
    Array.prototype.slice.call(marq.children).forEach(function (el) {
      var copy = el.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      marq.appendChild(copy);
    });
  }

  // Proje filtresi
  var chips = document.querySelectorAll('.chip[data-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('#projectGrid .card'));
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      var i = 0;
      cards.forEach(function (card) {
        var show = f === 'all' || card.getAttribute('data-cat') === f;
        card.hidden = !show;
        if (show) {
          // Görünen kartları sırayla yeniden canlandır
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
          card.style.animationDelay = (i * 70) + 'ms';
          i++;
        }
      });
    });
  });

  // Proje penceresi (lightbox)
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCat = document.getElementById('lbCat');
  var lbTitle = document.getElementById('lbTitle');
  var lbText = document.getElementById('lbText');
  var lbLink = document.getElementById('lbLink');
  var current = 0;
  var lastFocus = null;

  function fill(idx) {
    current = (idx + cards.length) % cards.length;
    var c = cards[current];
    var img = c.querySelector('img');
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.getAttribute('alt');
    lbCat.textContent = c.getAttribute('data-cat');
    lbTitle.textContent = c.querySelector('strong').textContent;
    lbText.textContent = c.querySelector('.meta span:last-child').textContent;
    var msg = 'Merhaba, sitenizde "' + lbTitle.textContent + '" projesini gördüm. Benzer bir çalışma için bilgi almak istiyorum.';
    lbLink.href = 'https://wa.me/905333061802?text=' + encodeURIComponent(msg);
  }
  function open(idx) {
    lastFocus = document.activeElement;
    fill(idx);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('lbClose').focus();
  }
  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  cards.forEach(function (card, i) {
    card.addEventListener('click', function () { open(i); });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbNext').addEventListener('click', function () { fill(current + 1); });
  document.getElementById('lbPrev').addEventListener('click', function () { fill(current - 1); });
  document.getElementById('lbAsk').addEventListener('click', close);
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

  // Adres #proje-... ise o projeyi doğrudan aç (eski proje bağlantıları buraya yönlenir)
  function openFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (id.indexOf('proje-') !== 0) return;
    var idx = cards.findIndex(function (c) { return c.id === id; });
    if (idx < 0) return;
    cards[idx].scrollIntoView({ block: 'center' });
    open(idx);
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') fill(current + 1);
    if (e.key === 'ArrowLeft') fill(current - 1);
  });

  // İletişim formu: mesajı e-posta uygulamasında hazırla
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = 'Lütfen isim, e-posta ve konu alanlarını doldurun.';
        form.reportValidity();
        return;
      }
      var d = new FormData(form);
      var body = 'İsim: ' + d.get('isim') + '\nE-posta: ' + d.get('eposta') + '\n\n' + (d.get('mesaj') || '');
      window.location.href = 'mailto:info@dizaynes.com?subject=' +
        encodeURIComponent('[Web] ' + d.get('konu')) + '&body=' + encodeURIComponent(body);
      note.textContent = 'E-posta uygulamanız açıldı. Mesajı oradan gönderebilirsiniz.';
    });
  }
})();

// Ürünler vitrini: kendiliğinden kayar, fare üzerindeyken durur; oklar da çalışır
(function () {
  var track = document.getElementById('urunTrack');
  if (!track) return;
  var items = Array.prototype.slice.call(track.querySelectorAll('.urun'));
  if (!items.length) return;
  // Kesintisiz döngü için kartları bir kez çoğalt
  items.forEach(function (li) {
    var c = li.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.classList.add('urun-dup');
    Array.prototype.forEach.call(c.querySelectorAll('a,button'), function (el) { el.setAttribute('tabindex', '-1'); });
    track.appendChild(c);
  });
  track.style.scrollSnapType = 'none';
  var firstDup = track.querySelector('.urun-dup');
  function loopW() { return firstDup.offsetLeft - items[0].offsetLeft; }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var speed = 32;            // piksel / saniye
  var paused = false, hover = false, visible = true, resumeAt = 0;
  var pos = track.scrollLeft, last = 0;

  function frame(t) {
    var dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    if (Math.abs(track.scrollLeft - pos) > 2) pos = track.scrollLeft;   // kullanıcı elle kaydırdıysa
    if (!reduce && !paused && !hover && visible && t >= resumeAt) {
      pos += speed * dt;
      var w = loopW();
      if (w > 0 && pos >= w) pos -= w;
      track.scrollLeft = pos;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function pauseFor(ms) { resumeAt = performance.now() + ms; }
  track.addEventListener('mouseenter', function () { hover = true; });
  track.addEventListener('mouseleave', function () { hover = false; pos = track.scrollLeft; });
  track.addEventListener('focusin', function () { paused = true; });
  track.addEventListener('focusout', function () { paused = false; pos = track.scrollLeft; });
  track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
  track.addEventListener('touchend', function () { paused = false; pos = track.scrollLeft; pauseFor(3000); }, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(track);
  }

  function step(dir) {
    var card = items[0];
    var amount = (card.getBoundingClientRect().width + 20) * 2;
    var w = loopW();
    if (dir < 0 && track.scrollLeft < amount && w > 0) { track.scrollLeft += w; }
    if (dir > 0 && track.scrollLeft + amount >= w * 2 - track.clientWidth && w > 0) { track.scrollLeft -= w; }
    pauseFor(4000);
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    setTimeout(function () { pos = track.scrollLeft; }, 700);
  }
  document.getElementById('urunPrev').addEventListener('click', function () { step(-1); });
  document.getElementById('urunNext').addEventListener('click', function () { step(1); });
})();

// Malzeme şeridi: mobilde kesintisiz kayan şerit için içeriği bir kez çoğalt
(function () {
  var t = document.getElementById('stripTrack');
  if (!t) return;
  Array.prototype.slice.call(t.children).forEach(function (el) {
    var c = el.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.classList.add('strip-dup');
    t.appendChild(c);
  });
})();
