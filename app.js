// Shared media rendering + slideshow carousel, used by index.html and portfolio.html.

function videoFrame(m) {
  return `<div class="frame">
    <span class="badge">${m.label}</span>
    <video src="${m.src}" muted loop playsinline preload="metadata"
      onmouseover="this.play()" onmouseout="this.pause()"
      onclick="this.muted=!this.muted;this.play()"></video>
  </div>`;
}

function slideshowFrame(m) {
  const dots = m.slides.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
  return `<div class="frame ss-frame" data-slides='${JSON.stringify(m.slides)}' data-i="0">
    <span class="badge">${m.label}</span>
    <img src="${m.slides[0]}" alt="">
    <button class="nav prev" type="button" aria-label="Previous slide">‹</button>
    <button class="nav next" type="button" aria-label="Next slide">›</button>
    <div class="dots">${dots}</div>
  </div>`;
}

function mediaFrame(m) {
  return m.type === 'video' ? videoFrame(m) : slideshowFrame(m);
}

// Main-page card cover: prefer a video (lively on hover); else the first slide as a still.
function coverFrame(company) {
  const v = company.media.find((m) => m.type === 'video');
  const inner = v
    ? `<video src="${v.src}" muted loop playsinline preload="metadata"
         onmouseover="this.play()" onmouseout="this.pause()"></video>`
    : `<img src="${company.media[0].slides[0]}" alt="">`;
  return `<div class="frame">
    <span class="badge">${company.media.length} pieces</span>
    ${inner}
    <span class="viewall">View the batch →</span>
  </div>`;
}

// Slideshow arrows: one delegated listener handles every carousel on the page.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.ss-frame .nav');
  if (!btn) return;
  const f = btn.closest('.ss-frame');
  const slides = JSON.parse(f.dataset.slides);
  const dir = btn.classList.contains('next') ? 1 : -1;
  const i = (parseInt(f.dataset.i, 10) + dir + slides.length) % slides.length;
  f.dataset.i = i;
  f.querySelector('img').src = slides[i];
  f.querySelectorAll('.dots i').forEach((d, di) => d.classList.toggle('on', di === i));
});

// Free-list lead capture (Web3Forms: no backend, submissions emailed to you).
const _lf = document.getElementById('lead-form');
if (_lf) _lf.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('lead-msg');
  msg.className = 'lead-msg';
  msg.textContent = 'Sending…';
  const data = Object.fromEntries(new FormData(_lf).entries());
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: 'WEB3FORMS_ACCESS_KEY', subject: 'New Distro free-list lead', ...data }),
    });
    const j = await r.json();
    if (j.success) { _lf.reset(); msg.textContent = "You're on the list. We'll reach out when your batch is ready."; }
    else { msg.className = 'lead-msg err'; msg.textContent = 'Something went wrong, please try again.'; }
  } catch {
    msg.className = 'lead-msg err';
    msg.textContent = 'Something went wrong, please try again.';
  }
});
