/* Taklifnoma: render, til, scroll sahnalari, zarrachalar, musiqa. Kutubxonasiz. */
(() => {
  'use strict';
  const C = window.INVITATION;
  const I = window.I18N;
  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowEnd = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.connection && navigator.connection.saveData);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
    .replace(/ﷺ/g, '<span class="saw" lang="ar">ﷺ</span>');
  const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
  const KEY_PARAM = { men: 'erkak', women: 'ayol' };
  const LANG_KEY = 'taklif-til';

  /* ---------- Sana ---------- */
  const [Y, M, D] = C.date.split('-').map(Number);
  const WD = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
  const startOf = key => new Date(`${C.date}T${C[key].time}:00${C.tz}`);
  const dateHero = () => fmt(U.date_hero, { d: D, m: U.months[M - 1], y: Y, w: U.weekdays[WD] });
  const dateLong = () => fmt(U.date_long, { d: D, m: U.months[M - 1], y: Y, w: U.weekdays[WD] });

  /* ---------- Til ---------- */
  let guest = null, lang, U, T;
  function merge(a, b) {
    if (!b || typeof b !== 'object' || Array.isArray(b)) return b === undefined ? a : b;
    const o = Array.isArray(a) ? a.slice() : Object.assign({}, a);
    for (const k of Object.keys(b)) o[k] = merge(a ? a[k] : undefined, b[k]);
    return o;
  }
  function textFor(l) {
    if (l === 'cyrl') return merge(I.deepCyrl(C.text.uz), C.text.cyrl || {});
    return C.text[l] || C.text.uz;
  }
  function pickLang() {
    let l = null;
    try { l = localStorage.getItem(LANG_KEY); } catch (e) { /* saqlash yopiq — standart til */ }
    const p = new URLSearchParams(location.search).get('til');
    if (p && I.ui[p]) l = p;
    return I.ui[l] ? l : (I.ui[C.defaultLang] ? C.defaultLang : 'uz');
  }
  function applyStatic() {
    root.lang = U.html_lang;
    document.title = U.doc_title;
    document.querySelectorAll('[data-i]').forEach(el => { el.textContent = U[el.dataset.i]; });
    document.querySelectorAll('[data-ih]').forEach(el => { el.innerHTML = U[el.dataset.ih]; });
    document.querySelectorAll('[data-ia]').forEach(el => { el.setAttribute('aria-label', U[el.dataset.ia]); });
    document.querySelectorAll('.choice').forEach(b => {
      const g = b.dataset.pick;
      b.querySelector('b').textContent = T[g].label;
      b.querySelector('small').textContent = T[g].choiceSummary || `${T[g].event} · ${C[g].time}`;
    });
    document.querySelectorAll('.js-signoff').forEach(el => { el.textContent = T.signOff; });
    document.querySelectorAll('.js-parents').forEach(el => { el.textContent = T.parents; });
    $('gate-sign').textContent = `${T.signOff} ${T.parents}`;
    $('lang-code').textContent = U.lang_code;
    document.querySelectorAll('.langs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    setPlaying(M_.playing);
  }
  function setLang(l) {
    lang = l; U = I.ui[l]; T = textFor(l);
    try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* saqlash yopiq — faqat shu safar */ }
    applyStatic();
    if (guest) render(guest);
    const mf = document.querySelector('#map iframe');
    if (mf && !mf.src.endsWith(`lang=${U.map_lang}`)) mf.src = `${C.venue.mapEmbed}&lang=${U.map_lang}`;
  }
  function buildLangButtons() {
    const html = I.order.map(l => `<button type="button" data-lang="${l}" lang="${I.ui[l].html_lang}">${I.ui[l].lang_name}</button>`).join('');
    document.querySelectorAll('.langs').forEach(box => {
      box.innerHTML = html;
      box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) setLang(b.dataset.lang); }));
    });
  }

  window.__taklif = { vol: () => (M_.yt && M_.yt.getVolume ? M_.yt.getVolume() : null), muted: () => (M_.yt && M_.yt.isMuted ? M_.yt.isMuted() : null), ytState: () => (M_.yt && M_.yt.getPlayerState ? M_.yt.getPlayerState() : null), video: () => (M_.yt && M_.yt.getVideoData ? M_.yt.getVideoData().video_id : null), quality: () => (M_.yt && M_.yt.getPlaybackQuality ? M_.yt.getPlaybackQuality() : null), levels: () => (M_.yt && M_.yt.getAvailableQualityLevels ? M_.yt.getAvailableQualityLevels() : null), mode: () => M_.mode, lang: () => lang };

  /* ---------- Yordamchi ---------- */
  function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600);
  }
  function words(text) {
    // Xitoy tilida bo‘shliq yo‘q — belgilar bo‘yicha bo‘linadi
    if (lang === 'zh') return Array.from(text).map(ch => `<span class="w">${esc(ch)}</span>`).join('');
    return text.split(/\s+/).filter(Boolean).map(w => `<span class="w">${esc(w)}</span>`).join(' ');
  }
  function src(el, label, url) { el.textContent = label; el.href = url; }

  /* ---------- Render ---------- */
  function render(key) {
    guest = key;
    const g = T[key], c = C[key];
    root.dataset.guest = key;
    document.querySelector('meta[name="theme-color"]').content = key === 'men' ? '#0b1f1a' : '#fbf6f2';
    $('switch-label').textContent = `${g.short} · ${c.time}`;

    // Hero
    $('hero-lead').textContent = T.hero.lead;
    $('groom').innerHTML = T.hero.names
      ? `<span class="nm">${esc(T.hero.names[0])}</span><span class="amp">${esc(T.hero.and)}</span><span class="nm">${esc(T.hero.names[1])}</span>`
      : esc(T.hero.name);
    $('hero-name').setAttribute('aria-label', T.hero.name);
    $('hero-title').textContent = T.hero.title;
    $('hero-verse').innerHTML = T.hero.verse.map(esc).join('<br>');
    $('hero-date').textContent = dateHero();
    $('hero-time').textContent = fmt(U.time_at, { t: c.time });
    $('hero-event').textContent = g.event;
    $('hero-where-text').textContent = `«${T.venue.name}», ${T.venue.city}`;

    // Taklif
    $('invite-title').textContent = g.greeting;
    $('invite-body').innerHTML = g.invitation.map((p, i) => `<p data-r="up" style="--d:${i + 1}">${esc(p).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`).join('');

    // Oyat
    $('ayah-ar').textContent = C.quran.arabic;
    $('ayah-uz').innerHTML = words(T.quran.meaning);
    src($('ayah-src'), T.quran.source, C.quran.url);

    // Hadislar
    $('hadith-list').innerHTML = g.hadiths.map((h, i) => `
      <article class="hd">
        <span class="hd-num" data-px="0.22" data-base="translateX(-50%)" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <p class="kicker" data-r="up">${esc(fmt(U.hadith_n, { n: String(i + 1).padStart(2, '0') }))}</p>
        <h3 class="hd-theme" data-r="up" style="--d:1">${esc(h.theme)}</h3>
        <p class="hd-ar shimmer" lang="ar" dir="rtl" data-r="ar" style="--d:2">${esc(c.hadiths[i].arabic)}</p>
        <p class="hd-uz scrub">${words(h.text)}</p>
        <div class="hd-meta" data-r="up"><span>${esc(h.narrator)}</span><a class="src" href="${esc(c.hadiths[i].url)}" target="_blank" rel="noopener noreferrer">${esc(h.source)}</a></div>
        ${i < g.hadiths.length - 1 ? `<svg class="hd-sep" data-r="spin" aria-hidden="true" viewBox="108 0 24 24"><path d="M120 0l3.4 8.6L132 12l-8.6 3.4L120 24l-3.4-8.6L108 12l8.6-3.4z"/></svg>` : ''}
      </article>`).join('');

    // Rivoyat
    const s = g.story;
    $('story-kicker').textContent = s.kicker.toUpperCase();
    $('story-title').innerHTML = lang === 'zh' ? esc(s.title) : esc(s.title).replace(/ (\S+)$/, ' <em>$1</em>');
    $('story-beats').innerHTML = s.beats.map(b => `<li data-r="up">${esc(b)}</li>`).join('');
    $('story-quote').innerHTML = `<p class="sq-ar shimmer" lang="ar" dir="rtl" data-r="ar">${esc(c.story.quoteArabic)}</p><p class="sq-uz scrub">${words(s.quote)}</p>`;
    $('story-ending').innerHTML = esc(s.ending);
    src($('story-src'), s.source, c.story.url);

    // Dastur
    $('timeline').innerHTML = g.program.map((p, i) => `
      <li data-r="up"><span class="tl-dot">${i + 1}</span>${p.time ? `<span class="tl-time">${esc(fmt(U.time_at, { t: p.time }))}</span>` : ''}<h3>${esc(p.title)}</h3>${p.text ? `<p>${esc(p.text)}</p>` : ''}</li>`).join('');
    $('program-note').textContent = g.programNote;

    // Manzil
    $('venue-title').textContent = `«${T.venue.name}»`;
    $('venue-addr').textContent = T.venue.address;
    const lm = $('venue-landmark'); lm.hidden = !T.venue.landmark; lm.textContent = T.venue.landmark ? fmt(U.landmark, { x: T.venue.landmark }) : '';
    $('venue-when').textContent = fmt(U.venue_when, { date: dateLong(), t: c.time });
    $('route-lead').innerHTML = fmt(U.route_lead, { name: esc(T.venue.name) });
    $('venue-coords').textContent = C.venue.coords;
    $('map-route').href = C.venue.routeUrl;
    $('map-google').href = C.venue.googleUrl;
    const mf = document.querySelector('#map iframe'); if (mf) mf.title = fmt(U.map_title, { name: T.venue.name });

    // Duo
    $('dua-ar').textContent = C.dua.arabic;
    $('dua-tr').textContent = T.dua.translit;
    $('dua-uz').innerHTML = words(T.dua.text);
    src($('dua-src'), T.dua.source, C.dua.url);

    // Yakun
    $('cl-1').textContent = g.closingTitle[0];
    $('cl-2').textContent = g.closingTitle[1];
    $('closing-text').textContent = g.closing;
    if (C.phone) { const ph = $('call'); ph.hidden = false; ph.href = `tel:${C.phone.replace(/[^+\d]/g, '')}`; }

    $('music-title').textContent = g.musicTitle;
    $('music-kicker').textContent = key === 'women' ? U.music_kicker_women : U.music_kicker_men;
    if (!M_.failed) $('music-note').textContent = key === 'women' ? U.music_note_women : U.music_note_men;
    $('foot-name').textContent = T.groomNom || T.groom;
    $('foot-date').textContent = `${String(D).padStart(2, '0')} · ${String(M).padStart(2, '0')} · ${Y}`;

    updateCountdown();
    if (body.classList.contains('live')) wireDynamic();
    fitName();
  }

  /* ---------- Ismni sig‘dirish ---------- */
  function fitName() {
    const el = $('groom');
    const avail = Math.min(680, document.documentElement.clientWidth - 40);
    el.style.fontSize = '100px';
    const w = el.getBoundingClientRect().width || 1;
    const max = Math.min(104, innerWidth * 0.17);
    let fs = Math.min(max, (avail * 0.88 / w) * 100);
    el.style.fontSize = `${fs.toFixed(1)}px`;
    for (let i = 0; i < 25 && el.getBoundingClientRect().width > avail * 0.94; i++) { fs *= 0.95; el.style.fontSize = `${fs.toFixed(1)}px`; }
  }
  if ('ResizeObserver' in window) {
    let fitting = false;
    new ResizeObserver(() => {
      if (fitting) return;
      const avail = Math.min(680, document.documentElement.clientWidth - 40);
      if ($('groom').getBoundingClientRect().width > avail * 0.94) { fitting = true; fitName(); requestAnimationFrame(() => { fitting = false; }); }
    }).observe($('groom'));
  }
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', () => fitName());
  [400, 1500, 4000].forEach(t => setTimeout(fitName, t));

  /* ---------- Paydo bo‘lish ---------- */
  // clip-path bilan to‘liq yopilgan element kuzatuvchiga «ko‘rinmas» — shuning uchun ularning ota-elementi kuzatiladi.
  const revealTargets = new Map();
  const revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      (revealTargets.get(e.target) || []).forEach(el => el.classList.add('in'));
      revealTargets.delete(e.target); revealIO.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -7% 0px', threshold: 0.12 }) : null;
  function reveal(el) {
    const clipped = el.dataset.r === 'name' || el.dataset.r === 'ar';
    const target = clipped ? el.parentElement : el;
    const list = revealTargets.get(target);
    if (list) { if (!list.includes(el)) list.push(el); } else { revealTargets.set(target, [el]); revealIO.observe(target); }
  }

  const active = new Set();
  const activeIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const e of entries) e.isIntersecting ? active.add(e.target) : active.delete(e.target);
    queue();
  }, { rootMargin: '25% 0px 25% 0px' }) : null;

  function wireDynamic() {
    document.querySelectorAll('[data-r]:not(.in)').forEach(el => {
      if (reduced || !revealIO) el.classList.add('in'); else reveal(el);
    });
    document.querySelectorAll('.scrub').forEach(el => {
      el._w = el.querySelectorAll('.w'); el._k = -1;
      if (reduced || !activeIO) el._w.forEach(w => w.classList.add('on'));
    });
    if (activeIO) {
      activeIO.disconnect(); active.clear();
      document.querySelectorAll('.scrub, [data-px], .story-track, .timeline').forEach(el => activeIO.observe(el));
    }
    queue();
  }

  /* ---------- Scroll sahnalari ---------- */
  let ticking = false;
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }
  function tick() {
    ticking = false;
    const vh = innerHeight;
    if (revealIO) for (const [t, els] of revealTargets) {
      if (t.getBoundingClientRect().top < vh) { els.forEach(el => el.classList.add('in')); revealTargets.delete(t); revealIO.unobserve(t); }
    }
    const max = Math.max(1, root.scrollHeight - vh);
    const y = scrollY;
    if (guest === 'men') {
      const d = Math.pow(clamp(y / max), 0.85).toFixed(3);
      if (d !== dawn) { dawn = d; backdrop.style.setProperty('--dawn', d); }   // faqat fon qatlamida: butun sahifa qayta hisoblanmaydi
    }
    topbar.classList.toggle('solid', y > vh * 0.7);
    if (reduced) return;

    for (const el of active) {
      if (el.classList.contains('scrub')) {
        const r = el.getBoundingClientRect();
        const p = clamp((vh * 0.9 - r.top) / (r.height + vh * 0.42));
        const n = el._w ? el._w.length : 0;
        const k = Math.round(p * n * 1.12);
        if (k !== el._k) { el._k = k; for (let i = 0; i < n; i++) el._w[i].classList.toggle('on', i < k); }
      } else if (el.dataset.px) {
        const r = el.parentElement.getBoundingClientRect();
        const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.px);
        el.style.transform = `${el.dataset.base || ''} translate3d(0, ${off.toFixed(1)}px, 0)`;
      } else {
        const r = el.getBoundingClientRect();
        const fill = el.querySelector('.story-line i, .tl-line i');
        if (fill) fill.style.setProperty('--fill', clamp((vh * 0.62 - r.top) / r.height).toFixed(3));
      }
    }
  }
  const topbar = document.querySelector('.topbar');
  const backdrop = document.querySelector('.backdrop');
  let dawn = '0';
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', () => { clearTimeout(tick.r); tick.r = setTimeout(() => { fitName(); sizeCanvas(); queue(); }, 150); });

  /* ---------- Zarrachalar ---------- */
  const cv = $('particles'); const ctx = cv.getContext('2d');
  let parts = [], stars = [], raf = 0, last = 0, sprites = {};
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  function sizeCanvas() {
    cv.width = Math.round(innerWidth * DPR); cv.height = Math.round(innerHeight * DPR);
    seed();
  }
  function sprite(key, size, draw) {
    if (sprites[key]) return sprites[key];
    const c = document.createElement('canvas'); c.width = c.height = size;
    draw(c.getContext('2d'), size); return (sprites[key] = c);
  }
  const mote = () => sprite('mote', 64, (g, s) => {
    const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    gr.addColorStop(0, 'rgba(255,236,180,1)'); gr.addColorStop(.25, 'rgba(244,205,120,.55)'); gr.addColorStop(1, 'rgba(244,205,120,0)');
    g.fillStyle = gr; g.fillRect(0, 0, s, s);
  });
  const petal = i => sprite('petal' + i, 64, (g, s) => {
    const tints = [['#f9dfe0', '#e3a2ab'], ['#fbe9e4', '#eab7b4'], ['#f6d3d8', '#d98f9b']];
    const [a, b] = tints[i];
    const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, a); gr.addColorStop(1, b);
    g.fillStyle = gr; g.beginPath();
    g.moveTo(s * .5, s * .04);
    g.bezierCurveTo(s * .95, s * .2, s * .9, s * .78, s * .5, s * .96);
    g.bezierCurveTo(s * .1, s * .78, s * .05, s * .2, s * .5, s * .04);
    g.fill();
    g.strokeStyle = 'rgba(168,95,108,.18)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(s * .5, s * .12); g.quadraticCurveTo(s * .55, s * .5, s * .5, s * .88); g.stroke();
  });
  const rnd = (a, b) => a + Math.random() * (b - a);
  function seed() {
    const W = cv.width, H = cv.height, small = innerWidth < 700;
    const f = lowEnd ? 0.6 : 1;
    parts = []; stars = [];
    if (guest === 'men') {
      const ns = Math.round((small ? 46 : 90) * f);
      for (let i = 0; i < ns; i++) stars.push({ x: rnd(0, W), y: rnd(0, H * .72), r: rnd(.5, 1.6) * DPR, a: rnd(.35, .95), s: rnd(.6, 2.2), p: rnd(0, 6.28) });
      const nm = Math.round((small ? 18 : 34) * f);
      for (let i = 0; i < nm; i++) parts.push({ x: rnd(0, W), y: rnd(0, H), z: rnd(4, 16) * DPR, vy: rnd(.08, .32) * DPR, sw: rnd(.3, 1.2), p: rnd(0, 6.28), a: rnd(.18, .55) });
    } else if (guest === 'women') {
      const np = Math.round((small ? 13 : 24) * f);
      for (let i = 0; i < np; i++) parts.push({ x: rnd(0, W), y: rnd(-H, H), z: rnd(14, 30) * DPR, vy: rnd(.35, .9) * DPR, vx: rnd(-.25, .25) * DPR, rot: rnd(0, 6.28), vr: rnd(-.012, .012), flip: rnd(0, 6.28), vf: rnd(.01, .03), t: i % 3, a: rnd(.55, .9), sw: rnd(.4, 1.4), p: rnd(0, 6.28) });
    }
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(3, (now - last) / 16.67 || 1); last = now;
    const W = cv.width, H = cv.height, t = now / 1000;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
    if (guest === 'men') {
      const sa = 1 - parseFloat(dawn) * 0.85;
      ctx.fillStyle = '#fff8e6';
      for (const s of stars) {
        ctx.globalAlpha = s.a * sa * (.55 + .45 * Math.sin(t * s.s + s.p));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      }
      const m = mote();
      for (const q of parts) {
        q.y -= q.vy * dt; q.x += Math.sin(t * q.sw + q.p) * .25 * dt;
        if (q.y < -q.z) { q.y = H + q.z; q.x = rnd(0, W); }
        ctx.globalAlpha = q.a * (.6 + .4 * Math.sin(t * 1.3 + q.p));
        ctx.drawImage(m, q.x - q.z / 2, q.y - q.z / 2, q.z, q.z);
      }
    } else {
      for (const q of parts) {
        q.y += q.vy * dt; q.x += (q.vx + Math.sin(t * q.sw + q.p) * .5 * DPR) * dt; q.rot += q.vr * dt; q.flip += q.vf * dt;
        if (q.y > H + q.z) { q.y = -q.z; q.x = rnd(0, W); }
        const sp = petal(q.t), sx = Math.cos(q.flip);
        ctx.globalAlpha = q.a;
        ctx.setTransform(Math.cos(q.rot) * sx, Math.sin(q.rot) * sx, -Math.sin(q.rot), Math.cos(q.rot), q.x, q.y);
        ctx.drawImage(sp, -q.z / 2, -q.z * .6, q.z, q.z * 1.2);
      }
    }
    ctx.globalAlpha = 1;
  }
  function startParticles() {
    cancelAnimationFrame(raf); sizeCanvas();
    if (reduced) { last = performance.now(); frame(last); cancelAnimationFrame(raf); return; }
    last = performance.now(); raf = requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (guest && !reduced) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });

  /* ---------- Musiqa ---------- */
  const sound = $('sound'), hint = $('sound-hint'), audio = $('local-audio');
  const M_ = { yt: null, ready: false, current: null, want: null, playing: false, mode: 'yt', failed: false };
  function setPlaying(on) {
    M_.playing = on;
    sound.classList.toggle('playing', on);
    sound.setAttribute('aria-pressed', String(on));
    sound.setAttribute('aria-label', on ? U.sound_off : U.sound_on);
    hint.textContent = U.sound_on;
    $('sound-use').setAttribute('href', on ? '#i-pause' : '#i-play');
    if (on) sound.classList.remove('nudge');
  }
  function note(msg, key) {
    $('music-note').innerHTML = `${esc(msg)} <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${C[key].music.youtubeId}">${esc(U.yt_link)}</a>`;
  }

  function loadYouTube() {
    if (location.protocol === 'file:') { M_.failed = true; note(U.music_file, 'men'); return; }
    const first = preselect || 'men';
    M_.current = C[first].music.youtubeId;
    window.onYouTubeIframeAPIReady = () => {
      M_.yt = new YT.Player('yt-player', {
        host: 'https://www.youtube.com', videoId: M_.current, width: '100%', height: '100%',
        playerVars: { playsinline: 1, rel: 0, controls: 1, loop: 1, playlist: M_.current, origin: location.origin },
        events: {
          onReady: () => { M_.ready = true; if (M_.want) applyWant(); },
          onStateChange: e => {
            if (e.data === 1) setPlaying(true);
            else if (e.data === 2) setPlaying(false);
            else if (e.data === 0) { M_.yt.seekTo(0); M_.yt.playVideo(); }
          },
          onError: () => { M_.failed = true; setPlaying(false); note(U.music_err, guest || 'men'); }
        }
      });
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api'; s.async = true;
    s.onerror = () => { M_.failed = true; note(U.yt_err, 'men'); };
    document.head.appendChild(s);
  }
  function applyWant() {
    const id = C[M_.want].music.youtubeId;
    try {
      if (M_.current !== id) { M_.current = id; M_.yt.loadVideoById({ videoId: id }); }
      else M_.yt.playVideo();
      M_.yt.unMute();
      M_.yt.setVolume(C[M_.want].music.volume || 60);
    } catch (e) { /* API hali tayyor emas — onReady qayta chaqiradi */ }
  }
  function playMusic(key) {
    M_.want = key;
    const file = C[key].music.file;
    sound.hidden = false;
    if (file) {
      M_.mode = 'local';
      if (M_.ready) try { M_.yt.pauseVideo(); } catch (e) { /* YouTube ishlatilmayapti */ }
      if (!audio.src.endsWith(file)) audio.src = file;
      audio.volume = Math.min(1, (C[key].music.volume || 70) / 100);
      audio.play().catch(() => { M_.mode = 'yt'; if (M_.ready) applyWant(); });
    } else {
      M_.mode = 'yt'; audio.pause();
      if (M_.ready) applyWant();
    }
    clearTimeout(playMusic.t);
    playMusic.t = setTimeout(() => { if (!M_.playing) sound.classList.add('nudge'); }, 5500);
  }
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('error', () => { if (M_.mode === 'local') { M_.mode = 'yt'; if (M_.ready) applyWant(); } });
  sound.addEventListener('click', () => {
    if (M_.mode === 'local') { audio.paused ? audio.play() : audio.pause(); return; }
    if (M_.playing) { try { M_.yt.pauseVideo(); } catch (e) { /* pleyer yo‘q */ } return; }
    if (M_.ready && !M_.failed) {
      applyWant();
      setTimeout(() => {
        if (!M_.playing) { $('music-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); toast(U.press_play); }
      }, 1600);
    } else {
      $('music-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  /* ---------- Sanoq ---------- */
  function updateCountdown() {
    if (!guest) return;
    const diff = startOf(guest) - Date.now();
    const pad = n => String(n).padStart(2, '0');
    const v = Math.max(0, diff);
    $('c-d').textContent = pad(Math.floor(v / 864e5));
    $('c-h').textContent = pad(Math.floor(v / 36e5) % 24);
    $('c-m').textContent = pad(Math.floor(v / 6e4) % 60);
    $('c-s').textContent = pad(Math.floor(v / 1e3) % 60);
    $('count-msg').textContent = diff > 0 ? fmt(U.count_wait, { date: dateLong(), t: C[guest].time })
      : diff > -6 * 36e5 ? U.count_live : U.count_done;
  }
  setInterval(updateCountdown, 1000);

  /* ---------- Xarita ---------- */
  let mapLoaded = false;
  function loadMap() {
    if (mapLoaded) return; mapLoaded = true;
    const f = document.createElement('iframe');
    f.src = `${C.venue.mapEmbed}&lang=${U.map_lang}`; f.title = fmt(U.map_title, { name: T.venue.name }); f.loading = 'lazy';
    f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin';
    $('map').appendChild(f);
  }
  if ('IntersectionObserver' in window) {
    const mio = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { loadMap(); mio.disconnect(); } }, { rootMargin: '700px 0px' });
    mio.observe($('map'));
  } else loadMap();

  /* ---------- Kalendar va ulashish ---------- */
  $('ics').addEventListener('click', () => {
    const g = T[guest], time = C[guest].time; const s = startOf(guest);
    const f = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const e = v => String(v).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[;,]/g, m => '\\' + m);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Taklifnoma//UZ', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      `UID:${C.date}-${guest}@taklifnoma`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(s)}`,
      `SUMMARY:${e(fmt(U.ics_summary, { groom: T.groom, event: g.event }))}`,
      `LOCATION:${e(`«${T.venue.name}», ${T.venue.address}`)}`,
      `DESCRIPTION:${e(fmt(U.ics_desc, { parents: T.parents, event: g.event, time, url: C.venue.mapUrl }))}`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `Taklifnoma-${KEY_PARAM[guest]}.ics`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
  });
  $('copy-addr').addEventListener('click', async () => {
    const lm = T.venue.landmark ? ` (${fmt(U.landmark, { x: T.venue.landmark })})` : '';
    const text = fmt(U.copy_text, { name: T.venue.name, address: T.venue.address + lm, coords: C.venue.coords, url: C.venue.mapUrl });
    try { await navigator.clipboard.writeText(text); toast(U.copied); }
    catch (e) { prompt(U.copy_prompt, text); }
  });
  $('share').addEventListener('click', async () => {
    const g = T[guest];
    const url = `${location.origin}${location.pathname}?mehmon=${KEY_PARAM[guest]}`;
    const text = fmt(U.share_text, { parents: T.parents, groom: T.groom, date: dateLong(), venue: T.venue.name, address: T.venue.address, event: g.event, time: C[guest].time });
    if (navigator.share) { try { await navigator.share({ title: U.share_title, text, url }); return; } catch (e) { if (e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(`${text}\n${url}`); toast(U.share_copied); }
    catch (e) { prompt(U.share_prompt, url); }
  });

  /* ---------- Eshik va tanlov ---------- */
  const gate = $('gate'), site = $('site'), dlg = $('switch-dialog');
  const param = new URLSearchParams(location.search).get('mehmon');
  const preselect = param === 'erkak' || param === 'men' ? 'men' : param === 'ayol' || param === 'women' ? 'women' : null;
  if (preselect) gate.querySelectorAll(`[data-pick="${preselect}"]`).forEach(b => b.classList.add('preselected'));
  if (preselect) {
    const firstTouch = e => {
      ['pointerdown', 'touchstart', 'keydown'].forEach(t => removeEventListener(t, firstTouch, true));
      if (!e.target.closest || !e.target.closest('[data-pick]')) playMusic(preselect);
    };
    ['pointerdown', 'touchstart', 'keydown'].forEach(t => addEventListener(t, firstTouch, { capture: true, passive: true }));
  }
  body.classList.add('locked');

  function open(key) {
    if (gate.classList.contains('opening')) return;
    render(key);
    playMusic(key);                 // aynan bosish ichida — brauzer ovozga ruxsat beradi
    history.replaceState(null, '', `?mehmon=${KEY_PARAM[key]}`);
    gate.dataset.open = key;
    gate.classList.add('opening');
    const t = reduced ? 50 : 1250;
    setTimeout(() => {
      gate.classList.add('zoom');
      site.inert = false; body.classList.remove('locked'); body.classList.add('live');
      scrollTo(0, 0);
      startParticles(); wireDynamic();
      $('main').focus({ preventScroll: true });
    }, t);
    setTimeout(() => { gate.hidden = true; }, t + 1400);
  }
  gate.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => open(b.dataset.pick)));

  const openDialog = () => (dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', ''));
  $('switch').addEventListener('click', openDialog);
  $('lang-btn').addEventListener('click', openDialog);
  $('sw-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', () => {
    const key = b.dataset.pick; dlg.close();
    if (key === guest) return;
    render(key); playMusic(key);
    history.replaceState(null, '', `?mehmon=${KEY_PARAM[key]}`);
    scrollTo({ top: 0, behavior: 'instant' });
    startParticles(); queue();
  }));

  buildLangButtons();
  setLang(pickLang());
  loadYouTube();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitName);
})();
