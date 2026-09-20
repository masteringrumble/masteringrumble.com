/* Mastering Rumble - site JS: exit-intent popup, copy buttons, mobile nav */
(function(){
  'use strict';

  /* Mobile nav */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Copy-to-clipboard buttons */
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var text = btn.getAttribute('data-copy');
      function done(){
        var old = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function(){ btn.textContent = old; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function(){ fallback(); });
      } else { fallback(); }
      function fallback(){
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch(e){}
        document.body.removeChild(ta);
      }
    });
  });

  /* Exit-intent popup (Sticker Mule affiliate offer) - once per session */
  var overlay = document.getElementById('exitOverlay');
  if (!overlay) return;
  var KEY = 'mr_exit_popup_shown';
  var shown = false;
  try { shown = sessionStorage.getItem(KEY) === '1'; } catch(e){}

  function show(){
    if (shown) return;
    shown = true;
    try { sessionStorage.setItem(KEY, '1'); } catch(e){}
    overlay.classList.add('show');
    var c = document.getElementById('exitClose');
    if (c) c.focus();
  }
  function hide(){ overlay.classList.remove('show'); }

  document.getElementById('exitClose').addEventListener('click', hide);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) hide(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') hide(); });

  /* Desktop: mouse leaves toward the top of the viewport */
  document.addEventListener('mouseout', function(e){
    if (!e.relatedTarget && e.clientY <= 0) show();
  });

  /* Touch devices: timed fallback after 45s */
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    setTimeout(show, 45000);
  }
})();
