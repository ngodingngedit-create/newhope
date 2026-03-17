<template>
  <section id="beranda" class="hero">
    <!-- Background layers -->
    <div class="hero-bg-gradient"></div>
    <div class="hero-scanline"></div>
    <div class="hero-vignette"></div>

    <!-- Main content -->
    <div class="hero-content">

      <!-- Logo -->
      <div class="logo-container">
        <img src="/logo.png" alt="Newhope Logo" class="hero-logo" />
      </div>

      <!-- Event tagline -->
      <div class="hero-tagline">
        <!-- <span class="tagline-line"></span> -->
        <!-- <p class="tagline-text">ROCKFEST 2024</p> -->
      
         <!-- -->
      </div>

      <!-- Event meta info (Hidden by user request) -->
      <!--
      <div class="hero-meta">
        <div class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>SATURDAY, JUL 15 · 2024</span>
        </div>
        <div class="meta-divider">·</div>
        <div class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>JAKARTA, INDONESIA</span>
        </div>
        <div class="meta-divider">·</div>
        <div class="meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>16:00 – 23:00 WIB</span>
        </div>
      </div>
      -->

      <!-- CTA Button -->
      <div class="hero-actions">
        <a href="#tiket" class="cta-primary">
          TUESDAY, 28 April 2026
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg> -->
        </a>
        <!--
        <a href="#lineup" class="cta-secondary">
          LIHAT LINEUP
        </a>
        -->
      </div>

      <!-- Scroll indicator -->
      <!-- <div class="scroll-hint">
        <div class="scroll-dot"></div>
        <span>SCROLL</span>
      </div> -->

    </div>
  </section>
</template>

<style scoped>
/* ── Base ───────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg-dark);
}

/* ── Background Layers ──────────────────────────────── */
.hero-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 255, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 20% 80%, rgba(255, 255, 255, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 20%, rgba(255, 255, 255, 0.04) 0%, transparent 60%);
  z-index: 1;
  pointer-events: none;
}

.hero-scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  z-index: 2;
  pointer-events: none;
}

.hero-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%);
  z-index: 3;
  pointer-events: none;
}

/* ── Content ────────────────────────────────────────── */
.hero-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px; /* Diperbesar dari 900px supaya isi container bisa selebar 1200px */
  padding: 0 2rem;
  padding-top: 140px; /* Diturunkan dari 80px agar konten di Hero lebih ke tengah/bawah */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

/* ── Logo ───────────────────────────────────────────── */
.logo-container {
  position: relative;
  width: 100%;
  max-width: 1300px; 
  height: auto; 
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0px; 
}

/* Smooth radial glow behind logo — no rectangle */
.logo-container::before {
  content: '';
  position: absolute;
  width: 70%;
  height: 60%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  background: radial-gradient(ellipse at center,
    rgba(255,255,255,0.18) 0%,
    rgba(255,255,255,0.08) 35%,
    transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(30px);
  animation: glowPulse 4s ease-in-out infinite;
}

.hero-logo {
  width: 100%;
  max-width: 900px; /* Logo diperbesar tapi proporsional */
  height: auto;
  object-fit: contain;
  object-position: center;
  margin-top:-80px; /* Hapus margin negatif ekstrem yang bikin logo hilang! */
  margin-bottom: 50px; /* Tarik sedikit logo ke bawah dari dalam */
  flex-shrink: 0;
  filter: brightness(1.1);
  animation: heroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards, floatLogo 7s ease-in-out 1.4s infinite;
}

/* ── Tagline ────────────────────────────────────────── */
.hero-tagline {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.8rem;
  opacity: 0;
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
}

.tagline-line {
  display: block;
  height: 1px;
  width: 60px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4));
}

.hero-tagline:last-child .tagline-line {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
}

.tagline-text {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.4em;
  color: var(--accent-red);
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── Meta Info ──────────────────────────────────────── */
.hero-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  opacity: 0;
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
  flex-wrap: wrap;
  justify-content: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.meta-item svg {
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.meta-divider {
  color: rgba(255, 255, 255, 0.2);
  font-size: 1.2rem;
  line-height: 1;
}

/* ── CTA Actions (Date Rectangle) ───────────────────── */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 4rem;
  margin-top: -3rem; /* Tarik tombol TUESDAY ke atas agar nempel dengan logo, menutupi space kosong */
  position: relative;
  z-index: 20;
  opacity: 0;
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--text-main);
  color: var(--bg-dark);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.9rem 2.2rem;
  border-radius: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2), 0 4px 20px rgba(0,0,0,0.3);
  position: relative;
  top: 50px;
  overflow: hidden;
}

.cta-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
  transition: opacity 0.3s;
  opacity: 0;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 35px rgba(255, 255, 255, 0.3), 0 8px 30px rgba(0,0,0,0.4);
  background: var(--accent-red-hover);
}

.cta-primary:hover::before {
  opacity: 1;
}

.cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.65);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.9rem 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

/* ── Scroll Indicator ───────────────────────────────── */
.scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  animation: fadeInOnly 1s ease 1.6s forwards;
}

.scroll-hint span {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.25);
  text-transform: uppercase;
}

.scroll-dot {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

/* ── Animations ─────────────────────────────────────── */
@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
    filter: drop-shadow(0 0 0px rgba(255,255,255,0)) brightness(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: drop-shadow(0 0 60px rgba(255,255,255,0.25)) drop-shadow(0 0 120px rgba(255,255,255,0.1)) brightness(1.05);
  }
}

@keyframes float {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}

@keyframes floatLogo {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.8; transform: translate(-50%, -40%) scale(1); }
  50%       { opacity: 1;   transform: translate(-50%, -40%) scale(1.08); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInOnly {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
  50%       { opacity: 1;   transform: scaleY(1); }
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 768px) {
  .hero-content {
    padding-top: 100px;
    gap: 1rem;
  }

  .logo-container {
    height: auto;
    margin-bottom: 1rem;
    margin-top: 0;
  }

  .hero-logo {
    width: 100%;
    max-width: 320px;
    margin-top: 0;
    margin-bottom: 20px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
    margin-top: 0;
    margin-bottom: 2rem;
  }

  .cta-primary {
    top: 0;
    width: auto;
    max-width: 250px;
    padding: 0.8rem 1.5rem;
    font-size: 0.8rem;
    text-align: center;
  }

  .cta-primary,
  .cta-secondary {
    justify-content: center;
  }

  .scroll-hint {
    display: none;
  }
}
</style>
