<template>
  <div class="app-wrapper">
    <div class="noise-overlay"></div>
    <div class="vignette-overlay"></div>
    <Navbar />
    <Hero />
    <Marquee />
    <Merch />
    <Marquee />
    <Lineup />
    <Marquee />
    <About />
    <!-- <Ticket /> -->
    <Footer />
    <MobileNav />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Hero from './components/Hero.vue';
import About from './components/About.vue';
import Lineup from './components/Lineup.vue';
import Merch from './components/Merch.vue';
// import Ticket from './components/Ticket.vue';
import Footer from './components/Footer.vue';
import Marquee from './components/Marquee.vue';
import MobileNav from './components/MobileNav.vue';
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
