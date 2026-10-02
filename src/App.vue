<template>
  <div class="app-wrapper">
    <div class="noise-overlay"></div>
    <div class="vignette-overlay"></div>
    <Navbar />
    <CartSidebar />
    
    <main>
      <!-- Halaman Detail Venue -->
      <div v-if="isVenueDetail">
        <Venue :detailId="venueId" />
      </div>
      <!-- Halaman Detail Merchandise -->
      <div v-else-if="isMerchDetail">
        <MerchDetail :slug="merchSlug" />
      </div>
      <!-- Halaman Checkout -->
      <div v-else-if="isCheckout">
        <Checkout />
      </div>
      <!-- Halaman Data Pemesan (Checkout Venue) -->
      <div v-else-if="isBookingCheckout">
        <DataPemesan />
      </div>
      <!-- Halaman Semua Merchandise -->
      <div v-else-if="isMerchAll">
        <AllMerch />
      </div>
      <div v-else>
        <Hero />
        <Marquee />
        <Merch />
        <Marquee />
        <Venue />
        <Marquee />
        <About />
        <Marquee />
        <Gallery />
      </div>
    </main>

    <Footer v-if="!isCheckout && !isBookingCheckout && !isVenueDetail" />
    <MobileNav v-if="!isCheckout && !isBookingCheckout" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import Hero from './components/Hero.vue';
import About from './components/About.vue';
import Venue from './components/Venue.vue';
import Merch from './components/Merch.vue';
import MerchDetail from './components/MerchDetail.vue';
import AllMerch from './components/AllMerch.vue';
import Checkout from './components/Checkout.vue';
import DataPemesan from './components/DataPemesan.vue';
import CartSidebar from './components/CartSidebar.vue';
// import Ticket from './components/Ticket.vue';
import Footer from './components/Footer.vue';
import Marquee from './components/Marquee.vue';
import Gallery from './components/Gallery.vue';
import MobileNav from './components/MobileNav.vue';

const currentPath = ref(window.location.pathname);

const isVenueDetail = computed(() => {
  return currentPath.value.startsWith('/venue/');
});

const venueId = computed(() => {
  if (isVenueDetail.value) {
    return parseInt(currentPath.value.split('/venue/')[1]) || 0;
  }
  return 0;
});

const isMerchDetail = computed(() => {
  return currentPath.value.startsWith('/merchandise/');
});

const isMerchAll = computed(() => {
  return currentPath.value === '/merchandise';
});

const isCheckout = computed(() => {
  return currentPath.value === '/checkout';
});

const isBookingCheckout = computed(() => {
  return currentPath.value === '/data-pemesan';
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
  position: relative;
}
</style>
