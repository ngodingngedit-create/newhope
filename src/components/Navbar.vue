<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="container nav-container">

      <!-- LOGO -->
      <div class="logo-wrapper">
        <a href="#beranda" class="brand-logo-link">
          <img src="/logo.png" alt="Newhope" class="brand-logo" />
        </a>
      </div>

      <!-- NAV LINKS -->
      <ul class="nav-links">
        <li><a href="#beranda">BERANDA</a></li>
        <li><a href="#tentang">TIKET</a></li>
        <li><a href="#lineup">LINE UP</a></li>
      </ul>

      <!-- RIGHT ACTIONS -->
      <div class="nav-actions">
        <!-- Search button -->
        <button class="nav-search-btn" @click="toggleSearch" :class="{ active: searchOpen }" aria-label="Search">
          <svg v-if="!searchOpen" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

      </div>
    </div>

    <!-- SEARCH POPUP -->
    <transition name="search-drop">
      <div v-if="searchOpen" class="search-popup">
        <div class="search-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon-inner">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Cari event, artis, lokasi..."
            class="search-input"
            @keydown.escape="closeSearch"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Backdrop -->
    <div v-if="searchOpen" class="search-backdrop" @click="closeSearch"></div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const isScrolled = ref(false);
const searchOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref(null);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

async function toggleSearch() {
  searchOpen.value = !searchOpen.value;
  if (searchOpen.value) {
    await nextTick();
    searchInput.value?.focus();
  }
}

function closeSearch() {
  searchOpen.value = false;
  searchQuery.value = '';
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('toggle-search', toggleSearch);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('toggle-search', toggleSearch);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 0;
  z-index: 100;
  transition: all 0.3s ease;
  background: transparent;
}

.navbar.scrolled {
  background: rgba(9, 9, 11, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ── LOGO ──────────────────────────────── */
.logo-wrapper {
  flex-shrink: 0;
}

/* Container crops the PNG */
.brand-logo-link {
  display: flex;
  align-items: center;
  width: 150px;
  height: 50px;
  overflow: hidden;
}

.brand-logo {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: contain;
  object-position: left center;
  flex-shrink: 0;
  filter: brightness(1.2);
}

/* ── NAV LINKS ─────────────────────────── */
.nav-links {
  display: flex;
  gap: 2.5rem;
}

.nav-links a {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 1px;
  color: var(--text-main);
  transition: color 0.3s ease;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: var(--text-main);
  transition: width 0.3s ease;
}

.nav-links a:hover { color: var(--text-muted); }
.nav-links a:hover::after { width: 100%; }

/* ── RIGHT ACTIONS ─────────────────────── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Search icon button */
.nav-search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.25s ease;
}
.nav-search-btn:hover,
.nav-search-btn.active {
  border-color: var(--text-main);
  background: rgba(255,255,255,0.08);
}

/* Ticket button */
.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-main);
  padding: 0.55rem 1.5rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: transparent;
  text-transform: uppercase;
}
.nav-btn:hover {
  border-color: var(--text-main);
  background-color: var(--text-main);
  color: var(--bg-dark);
  transform: translateY(-2px);
}
.nav-btn:hover svg { color: var(--bg-dark); }

/* ── SEARCH POPUP ──────────────────────── */
.search-popup {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0 1.5rem 1rem;
  background: rgba(9, 9, 11, 0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  z-index: 99;
}

.search-inner {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  transition: border-color 0.2s;
}
.search-inner:focus-within {
  border-color: rgba(255,255,255,0.3);
}

.search-icon-inner {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-main);
  font-family: var(--font-body);
  font-size: 1rem;
  caret-color: var(--text-main);
}
.search-input::placeholder { color: var(--text-muted); }

.search-clear {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.search-clear:hover { color: var(--text-main); }

/* Backdrop */
.search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 98;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
}

/* Transition */
.search-drop-enter-active,
.search-drop-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.search-drop-enter-from,
.search-drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── RESPONSIVE ────────────────────────── */
@media (max-width: 768px) {
  .nav-links { display: none; }
  
  .brand-logo-link {
    width: 100px;
    height: 40px;
  }
  
  .brand-logo {
    width: 80px;
    height: 80px;
  }

  .nav-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0; /* Hide text, keep icon */
    gap: 0;
  }
}
</style>
