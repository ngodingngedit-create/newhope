<template>
  <footer class="footer">
    <div class="footer-container container">
      <!-- Top Section -->
      <div class="footer-top">
        <!-- Logo -->
        <a href="#beranda" class="logo" @click.prevent="goToHome">
          <img src="/logo.png" class="logo-img" alt="Newhope Logo" />
        </a>

        <!-- Social Icons Group -->
        <div class="footer-socials">
          <!-- Instagram Official -->
          <a href="https://www.instagram.com/newhope.inc_official/" target="_blank" class="social-icon" aria-label="Instagram Official" title="Instagram Official">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          


          

          <!-- TikTok -->
          <a href="https://www.tiktok.com/" target="_blank" class="social-icon" aria-label="TikTok">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
            </svg>
          </a>

          <!-- YouTube -->
          <a href="https://www.youtube.com/" target="_blank" class="social-icon" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>
      </div>

      <!-- Divider line -->
      <div class="footer-divider"></div>

      <!-- Bottom Section -->
      <div class="footer-bottom">
        <p class="copyright">&copy; 2026 NEWHOPE INC. All rights reserved. Built with Kolektix.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { navigateTo } from '../store';

const goToHome = () => {
  if (window.location.pathname !== '/') {
    navigateTo('/');
  } else {
    document.getElementById('beranda')?.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.footer {
  background-color: #08090b;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 40px 0 24px;
  position: relative;
  z-index: 10;
}

.footer-container {
  width: 100%;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 40px;
  width: auto;
  object-fit: contain;
  display: block;
  filter: brightness(1.2);
  transition: transform 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.03);
}

.footer-socials {
  display: flex;
  gap: 24px;
  align-items: center;
}

.social-icon {
  color: #a1a1aa;
  transition: color 0.3s ease, filter 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon:hover {
  color: #ffffff;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
}

.footer-divider {
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin-bottom: 20px;
}

.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
}

.copyright {
  font-size: 0.75rem;
  color: #71717a;
  letter-spacing: 0.5px;
  text-align: center;
}

/* Responsive Styles for Mobile */
@media (max-width: 768px) {
  .footer {
    padding: 30px 0 20px;
  }
  .footer-top {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    margin-bottom: 20px;
  }
  .logo-img {
    height: 35px;
  }
  .footer-socials {
    gap: 20px;
  }
  .footer-divider {
    margin-bottom: 16px;
  }
  .copyright {
    font-size: 0.7rem;
  }
}
</style>
