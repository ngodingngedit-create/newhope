<template>
  <div class="app-wrapper">
    <div class="noise-overlay"></div>
    <div class="vignette-overlay"></div>
    <Navbar />
    <CartSidebar />
    
    <main>
      <!-- Halaman Detail Merchandise -->
      <div v-if="isMerchDetail">
        <MerchDetail :slug="merchSlug" />
      </div>
      <!-- Halaman Checkout -->
      <div v-else-if="isCheckout">
        <Checkout />
      </div>
      <!-- Halaman Semua Merchandise -->
      <div v-else-if="isMerchAll">
        <AllMerch />
      </div>
      <!-- Halaman Landing Page Utama -->
      <div v-else>
        <Hero />
        <Marquee />
        <Merch />
        <Marquee />
        <Lineup />
        <Marquee />
        <About />
      </div>
    </main>

    <Footer v-if="!isCheckout" />
    <MobileNav v-if="!isCheckout" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import Hero from './components/Hero.vue';
import About from './components/About.vue';
import Lineup from './components/Lineup.vue';
import Merch from './components/Merch.vue';
import MerchDetail from './components/MerchDetail.vue';
import AllMerch from './components/AllMerch.vue';
import Checkout from './components/Checkout.vue';
import CartSidebar from './components/CartSidebar.vue';
// import Ticket from './components/Ticket.vue';
import Footer from './components/Footer.vue';
import Marquee from './components/Marquee.vue';
import MobileNav from './components/MobileNav.vue';

const currentPath = ref(window.location.pathname);

const isMerchDetail = computed(() => {
  return currentPath.value.startsWith('/merchandise/');
});

const isMerchAll = computed(() => {
  return currentPath.value === '/merchandise';
});

const isCheckout = computed(() => {
  return currentPath.value === '/checkout';
});

const merchSlug = computed(() => {
  if (isMerchDetail.value) {
    return currentPath.value.split('/merchandise/')[1] || '';
  }
  return '';
});

onMounted(() => {
  const handlePathChange = () => {
    currentPath.value = window.location.pathname;
  };
  window.addEventListener('popstate', handlePathChange);
  window.addEventListener('navigation-change', handlePathChange);
});
</script>

<style>
/* Any global scope specific to the app */
html {
  scroll-behavior: smooth;
}
.app-wrapper {
  overflow-x: hidden;
  position: relative;
}
</style>
