<template>
  <transition name="mobile-nav-hide">
    <nav class="mobile-nav" v-show="isMobile && !shouldHide">
    <div class="mobile-nav-container">
      <a href="#beranda" class="mobile-nav-item" :class="{ active: activePath === '#beranda' }" @click.prevent="goToHome">
        <img src="/NEWHOPE ARENA WHITE.webp" alt="Newhope" class="mobile-nav-logo" />
        <span class="dot"></span>
      </a>
      
      <a href="#merch" class="mobile-nav-item" :class="{ active: activePath === '#merch' }" @click.prevent="goToMerch">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <span class="dot"></span>
      </a>

      <a href="#venue" class="mobile-nav-item" :class="{ active: activePath === '#venue' }" @click.prevent="goToVenue">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span class="dot"></span>
      </a>

      <a href="#tentang" class="mobile-nav-item" :class="{ active: activePath === '#tentang' }" @click.prevent="goToTiket">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"></path>
          <line x1="13" y1="5" x2="13" y2="19"></line>
        </svg>
        <span class="dot"></span>
      </a>

      <a href="#gallery" class="mobile-nav-item" :class="{ active: activePath === '#gallery' }" @click.prevent="goToGallery">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <span class="dot"></span>
      </a>


    </div>
    </nav>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { navigateTo, hideMobileNavGlobal, isMobileDrawerOpen, isCartOpen } from '../store';


const isMobile = ref(false);
const activePath = ref('#beranda');
const shouldHide = computed(() => hideMobileNavGlobal.value || isMobileDrawerOpen.value || isCartOpen.value);

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const setActive = (path) => {
  activePath.value = path;
};

const triggerSearch = () => {
  // Dispatch a custom event that Navbar.vue can listen to
  window.dispatchEvent(new CustomEvent('toggle-search'));
};

const handleScroll = () => {
  if (window.location.pathname.startsWith('/merchandise')) {
    activePath.value = '#merch';
    return;
  }
  const sections = ['beranda', 'merch', 'venue', 'tentang', 'gallery'];
  for (const section of sections) {
    const el = document.getElementById(section);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        activePath.value = `#${section}`;
        break;
      }
    }
  }
};

const goToHome = () => {
  setActive('#beranda');
  if (window.location.pathname !== '/') {
    navigateTo('/');
  } else {
    document.getElementById('beranda')?.scrollIntoView({ behavior: 'smooth' });
  }
};

const goToMerch = () => {
  setActive('#merch');
  navigateTo('/merchandise');
};

const goToVenue = () => {
  setActive('#venue');
  if (window.location.pathname !== '/') {
    navigateTo('/');
    setTimeout(() => {
      document.getElementById('venue')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    document.getElementById('venue')?.scrollIntoView({ behavior: 'smooth' });
  }
};

const goToTiket = () => {
  setActive('#tentang');
  if (window.location.pathname !== '/') {
    navigateTo('/');
    setTimeout(() => {
      document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    document.getElementById('tentang')?.scrollIntoView({ behavior: 'smooth' });
  }
};

const goToGallery = () => {
  setActive('#gallery');
  if (window.location.pathname !== '/') {
    navigateTo('/');
    setTimeout(() => {
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  }
};

const syncActivePath = () => {
  if (window.location.pathname.startsWith('/merchandise')) {
    activePath.value = '#merch';
  } else {
    handleScroll();
  }
};

onMounted(() => {
  checkIfMobile();
  syncActivePath();
  window.addEventListener('resize', checkIfMobile);
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('navigation-change', syncActivePath);
  window.addEventListener('popstate', syncActivePath);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('navigation-change', syncActivePath);
  window.removeEventListener('popstate', syncActivePath);
});
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  min-width: 280px;
  max-width: 90%;
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  padding: 0.75rem 1.5rem;
  z-index: 1000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  animation: slideUpIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 1.5rem;
}

.mobile-nav-item:first-child {
  margin-right: -0.6rem;
}

.mobile-nav-item {
  position: relative;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-nav-item svg {
  width: 22px;
  height: 22px;
  transition: all 0.3s ease;
}

.mobile-nav-logo {
  height: 22px;
  width: auto;
  max-width: 60px;
  object-fit: contain;
  filter: brightness(1.2) grayscale(1);
  transition: all 0.3s ease;
  opacity: 0.5;
}

.mobile-nav-item.active .mobile-nav-logo {
  filter: brightness(1.5) grayscale(0) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  opacity: 1;
}

.mobile-nav-item.active {
  color: var(--text-main);
  transform: translateY(-2px);
}

.mobile-nav-item.active svg {
  stroke-width: 2.5;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
}

.dot {
  position: absolute;
  bottom: -4px;
  width: 4px;
  height: 4px;
  background-color: var(--text-main);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.3s ease;
}

.mobile-nav-item.active .dot {
  opacity: 1;
  transform: scale(1);
}

@keyframes slideUpIn {
  from {
    opacity: 0;
    transform: translate(-50%, 40px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.mobile-nav-hide-enter-active,
.mobile-nav-hide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.mobile-nav-hide-enter-from,
.mobile-nav-hide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(24px);
}

/* Responsive adjustment */
@media (max-width: 480px) {
  .mobile-nav {
    bottom: 1.5rem;
    padding: 0.6rem 1.2rem;
    min-width: 240px;
  }
  
  .mobile-nav-container {
    gap: 1rem;
  }
}
</style>
