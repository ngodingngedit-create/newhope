<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="/logo.png" alt="Newhope Logo" class="footer-logo" />
          <p class="footer-desc">
            <!-- Organisasi independen yang mewadahi suara distorsi bagi skena hardcore, metal, dan sub-kultur musik ektstrem. Sejak 2020. -->
          </p>
        </div>
        
        <!-- <div class="footer-links">
          <h4>EXPLORE</h4>
          <ul>
            <li><a href="#beranda">Beranda</a></li>
            <li><a href="#tentang">Tentang Event</a></li>
            <li><a href="#lineup">Line Up Band</a></li>
            <li><a href="#tiket">Beli Tiket</a></li>
          </ul>
        </div> -->
        
        <div class="footer-social">
          <!-- <h4>IKUTI KAMI</h4>
          <div class="social-icons">
            <a href="https://www.instagram.com/newhope.inc_official/" target="_blank" class="social-icon">IG Official</a>
            <a href="https://www.instagram.com/newhope.inc_records/" target="_blank" class="social-icon">IG Records</a>
          </div> -->
        </div>
        
        <div class="footer-newsletter">
          <!-- <h4>SUBSCRIBE UPDATE</h4>
          <form @submit.prevent class="newsletter-form">
            <input type="email" placeholder="Email Anda..." required />
            <button type="submit" class="btn-primary">KIRIM</button>
          </form> -->
        </div>
      </div>
      
      <!-- <div class="footer-bottom">
        <p>&copy; 2026 NEWHOPE INC. All Rights Reserved. Built with Kolektix.</p>
      </div> -->
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #08090b;
  padding: 5rem 0 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.footer-logo {
  height: 70px;
  filter: brightness(0) invert(1);
  margin-bottom: 1rem;
}

.footer-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

h4 {
  color: var(--text-main);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.footer-links ul li {
  margin-bottom: 0.8rem;
}

.footer-links a {
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--accent-red);
  padding-left: 5px;
}

.social-icons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-icon {
  color: var(--text-muted);
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-icon::before {
  content: '→';
  color: var(--accent-red);
}

.social-icon:hover {
  color: var(--text-main);
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-form input {
  flex-grow: 1;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  color: var(--text-main);
  font-family: var(--font-body);
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--accent-red);
}

.newsletter-form button {
  padding: 0.8rem 1.5rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  color: var(--text-muted);
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .newsletter-form {
    flex-direction: column;
  }
  .footer-links a:hover {
    padding-left: 0;
  }
  .social-icons {
    align-items: center;
  }
}
</style>
