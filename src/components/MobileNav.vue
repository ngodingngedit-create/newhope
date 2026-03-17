<template>
  <nav class="mobile-nav" v-if="isMobile">
    <div class="mobile-nav-container">
      <a href="#beranda" class="mobile-nav-item" :class="{ active: activePath === '#beranda' }" @click="setActive('#beranda')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span class="dot"></span>
      </a>
      
      <a href="#lineup" class="mobile-nav-item" :class="{ active: activePath === '#lineup' }" @click="setActive('#lineup')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span class="dot"></span>
      </a>

      <a href="#tentang" class="mobile-nav-item" :class="{ active: activePath === '#tentang' }" @click="setActive('#tentang')">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <span class="dot"></span>
      </a>

      <button class="mobile-nav-item" @click="triggerSearch">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isMobile = ref(false);
const activePath = ref('#beranda');

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
  const sections = ['beranda', 'lineup', 'tentang'];
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

onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile);
  window.removeEventListener('scroll', handleScroll);
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
