// Mobil menü (☰)
(function () {
  'use strict';
  var btn = document.querySelector('.menu-btn');
  var header = document.querySelector('.site-header');
  var nav = document.getElementById('anaMenu');
  if (!btn || !header || !nav) return;
  function set(open) {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  }
  btn.addEventListener('click', function () { set(!header.classList.contains('menu-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) { set(false); btn.focus(); }
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) set(false); });
})();
