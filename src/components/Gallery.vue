<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const images = [
  '/galerry/IMG_8975.webp',
  '/galerry/IMG_8983.webp',
  '/galerry/IMG_9032.webp',
  '/galerry/IMG_9102.webp',
  '/galerry/IMG_9130.webp',
  '/galerry/IMG_9215.webp',
  '/galerry/IMG_9308.webp',
  '/galerry/IMG_9332.webp',
  '/galerry/IMG_9383.webp',
  '/galerry/IMG_9436.webp',
  '/galerry/IMG_9507.webp',
];

const activeIndex = ref<number | null>(null);

const openAt = (i: number) => { activeIndex.value = i; };
const close = () => { activeIndex.value = null; };
const prev = () => {
  if (activeIndex.value === null) return;
  activeIndex.value = (activeIndex.value - 1 + images.length) % images.length;
};
const next = () => {
  if (activeIndex.value === null) return;
  activeIndex.value = (activeIndex.value + 1) % images.length;
};

const onKey = (e: KeyboardEvent) => {
  if (activeIndex.value === null) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
};

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <section id="gallery" class="gallery-section">
    <div class="container">
      <div class="gallery-header">
        <h2 class="title-display">GALLERY</h2>
        <div class="pill-accent"></div>
      </div>
      <div class="gallery-grid">
        <div v-for="(src, i) in images" :key="i" class="gallery-item" @click="openAt(i)">
          <img :src="src" :alt="'Gallery ' + (i + 1)" loading="lazy" />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="activeIndex !== null" class="lightbox" @click.self="close">
        <button class="lb-close" @click="close" aria-label="Close">✕</button>
        <button class="lb-nav prev" @click.stop="prev" aria-label="Previous">‹</button>
        <img :src="images[activeIndex]" class="lb-img" :alt="'Gallery ' + (activeIndex + 1)" />
        <button class="lb-nav next" @click.stop="next" aria-label="Next">›</button>
        <div class="lb-counter">{{ activeIndex + 1 }} / {{ images.length }}</div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.gallery-section {
  padding: 2.5rem 0;
  background-color: #000;
  color: #fff;
}
.gallery-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
}
.title-display {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -1.5px;
  margin: 0;
}
.pill-accent {
  width: 60px;
  height: 8px;
  background-color: #fff;
  border-radius: 100px;
  margin-top: 1rem;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}
.gallery-item {
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  background: #0c0c0c;
  cursor: zoom-in;
}
.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.gallery-item:hover img {
  transform: scale(1.05);
}
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-img {
  max-width: min(90vw, 1000px);
  max-height: 80vh;
  border-radius: 8px;
  object-fit: contain;
}
.lb-close {
  position: absolute;
  top: 1rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}
.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-nav:hover { background: #fff; color: #000; }
.lb-nav.prev { left: 1rem; }
.lb-nav.next { right: 1rem; }
.lb-counter {
  position: absolute;
  bottom: 1.25rem;
  color: #a1a1aa;
  font-size: 0.85rem;
}
@media (max-width: 992px) {
  .gallery-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .gallery-section { padding: 1.5rem 0; }
  .gallery-grid {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .gallery-grid::-webkit-scrollbar { display: none; }
  .gallery-item {
    flex: 0 0 100%;
    scroll-snap-align: center;
    aspect-ratio: 4 / 3;
  }
  .lb-nav.prev { left: 0.5rem; }
  .lb-nav.next { right: 0.5rem; }
}
</style>
