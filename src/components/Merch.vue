<script setup lang="ts">
import { onMounted } from 'vue';
import { merchItems, isLoading, hasError, errorMessage, fetchMerchItems, navigateTo } from '../store';

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const getCreatorImage = (item: any) => {
  return item.creator?.image_url || item.creator?.image || '';
};

const navigateToDetail = (slug: string) => {
  navigateTo(`/merchandise/${slug}`);
};

const viewAllMerchandise = () => {
  navigateTo('/merchandise');
};

onMounted(() => {
  fetchMerchItems();
});
</script>

<template>
  <section id="merch" class="merch-bw-section">
    <div class="container">
      <div class="merch-header-row">
        <div class="header-main">
          <h2 class="title-display">COLLECTION</h2>
          <div class="pill-accent"></div>
        </div>
      </div>

      <!-- Loading State (Skeleton Grid) -->
      <div v-if="isLoading" class="merch-grid-bw">
        <div v-for="n in 4" :key="n" class="card-bw skeleton-card">
          <div class="card-image-wrap skeleton-image skeleton-pulse"></div>
          <div class="card-content-bw">
            <div class="skeleton-tag skeleton-pulse"></div>
            <div class="skeleton-title skeleton-pulse"></div>
            <div class="card-bottom">
              <div class="skeleton-price skeleton-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError">
        <div class="error-container">
          <div class="error-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ff4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3 class="error-title">Gagal Memuat Koleksi</h3>
          <p class="error-message">{{ errorMessage || 'Terjadi kesalahan koneksi saat memuat merchandise.' }}</p>
          <button class="btn-retry" @click="fetchMerchItems">Coba Lagi</button>
        </div>
      </div>

      <!-- Catalog Grid -->
      <div v-else class="merch-grid-bw">
        <div 
          v-for="(item, index) in merchItems.slice(0, 4)" 
          :key="item.id || index" 
          class="card-bw"
          @click="navigateToDetail(item.slug)"
        >
          <div class="card-image-wrap">
            <img :src="item.image" :alt="item.name" />
            <div v-if="item.isNew" class="badge-bw-new">N_W</div>
            <div v-if="item.isSoldOut" class="badge-bw-sold">OUT</div>
            <div class="card-tap-overlay">
              <span>EXPLORE</span>
            </div>
          </div>
          <div class="card-content-bw">
            <h3 class="card-title">{{ item.name }}</h3>
            <div class="card-shop-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="#000"/></svg>
              <span>{{ item.creator.name.endsWith('Shop') ? item.creator.name : item.creator.name + ' Shop' }}</span>
            </div>
            <div class="card-bottom">
              <div class="card-creator">
                <img :src="getCreatorImage(item)" :alt="item.creator.name" class="creator-avatar" />
                <div class="creator-info">
                  <span class="creator-label">Disediakan oleh</span>
                  <span class="creator-name">{{ item.creator.name }}</span>
                </div>
              </div>
              <div class="p-amount-wrapper">
                <div class="p-amount-white">Rp {{ formatPrice(item.price) }}</div>
                <div v-if="item.originalPrice" class="p-amount-original">Rp {{ formatPrice(item.originalPrice) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Button Lihat Semua -->
      <div class="view-all-wrapper" v-if="!isLoading && !hasError && merchItems.length > 4">
        <button class="btn-view-all" @click="viewAllMerchandise">
          <span>LIHAT SEMUA</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.merch-bw-section {
  padding: 2.5rem 0;
  background-color: #000;
  color: #fff;
}

.merch-header-row {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 2.5rem;
}

.header-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-display {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  letter-spacing: -1.5px;
  margin: 0;
  text-align: center;
}

.pill-accent {
  width: 60px;
  height: 8px;
  background-color: #fff;
  border-radius: 100px;
  margin-top: 1rem;
}

.subtitle-text {
  color: #555;
  font-size: 1.1rem;
  max-width: 300px;
  text-align: right;
  line-height: 1.4;
  margin: 0;
}

/* Card Grid */
.merch-grid-bw {
  display: flex;
  overflow-x: auto;
  gap: 1.75rem;
  padding-bottom: 2rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.merch-grid-bw::-webkit-scrollbar {
  height: 6px;
}
.merch-grid-bw::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 100px;
}
.merch-grid-bw::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 100px;
}
.merch-grid-bw::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.card-bw {
  flex: 0 0 300px;
  cursor: pointer;
  transition: all 0.4s ease;
  background: #101013;
  border-radius: 8px;
  overflow: hidden;
}

.card-image-wrap {
  position: relative;
  aspect-ratio: 4/5;
  background-color: #0c0c0c;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  margin-bottom: 0;
  border: none;
}

.card-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.card-bw:hover .card-image-wrap img {
  transform: scale(1.1);
}

.badge-bw-new {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: #fff;
  color: #000;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 900;
}

.badge-bw-sold {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: #111;
  color: #555;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 800;
}

.card-tap-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
}

.card-tap-overlay span {
  background: #fff;
  color: #000;
  padding: 0.7rem 1.8rem;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 900;
}

.card-bw:hover .card-tap-overlay { opacity: 1; }

.card-content-bw {
  background: #101013;
  border-radius: 0 0 8px 8px;
  padding: 1rem 1.1rem 1.1rem;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
}

.card-shop-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-shop-row svg {
  flex-shrink: 0;
}

.card-bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.9rem;
  border-top: 1px dashed rgba(255,255,255,0.15);
  gap: 0.75rem;
  width: 100%;
}

.card-creator {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  flex: 1;
}

.creator-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: none;
  background: #fff;
  flex-shrink: 0;
}

.creator-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.2;
}

.creator-label {
  font-size: 0.72rem;
  color: #71717a;
  font-weight: 500;
}

.creator-name {
  font-size: 0.88rem;
  color: #fff;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.p-amount-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.p-amount-white {
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
}

.p-amount-original {
  font-size: 0.8rem;
  color: #ff4444;
  text-decoration: line-through;
  line-height: 1.2;
  margin-top: 0.1rem;
}

.sold-out-text {
  font-size: 0.65rem;
  color: #555;
  font-weight: 700;
  letter-spacing: 1px;
}


/* Skeleton Loading Styling */
.skeleton-card {
  pointer-events: none;
}

.skeleton-image {
  aspect-ratio: 4/5;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 1.5rem;
}

.skeleton-tag {
  height: 0.65rem;
  width: 60px;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skeleton-title {
  height: 1.15rem;
  width: 85%;
  border-radius: 4px;
  margin-bottom: 1.25rem;
}

.skeleton-price {
  height: 1.1rem;
  width: 80px;
  border-radius: 4px;
}

.skeleton-pulse {
  background: linear-gradient(90deg, #0a0a0a 25%, #18181b 37%, #0a0a0a 63%);
  background-size: 400% 100%;
  animation: skeleton-loading-anim 1.4s ease infinite;
}

@keyframes skeleton-loading-anim {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

/* Error State Styling */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background-color: #050505;
  border: 1px solid rgba(255, 68, 68, 0.15);
  border-radius: 24px;
  text-align: center;
  max-width: 480px;
  margin: 3rem auto;
}

.error-icon {
  margin-bottom: 1.5rem;
  animation: error-bounce 1s ease infinite alternate;
}

@keyframes error-bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-6px);
  }
}

.error-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: #fff;
  letter-spacing: -0.5px;
}

.error-message {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.btn-retry {
  background: #fff;
  color: #000;
  border: none;
  padding: 0.8rem 2.2rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.5px;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
}

/* REFINED MOBILE - SIMILAR TO DESKTOP BUT SCALED */
@media (max-width: 768px) {
  .card-bw {
    flex: 0 0 250px;
  }
  .merch-grid-bw {
    gap: 1.25rem;
  }
}

@media (max-width: 640px) {
  .merch-bw-section { padding: 1.5rem 0; }
  .title-display { font-size: 1.6rem; }
  .view-all-wrapper { margin-top: 2rem; }
  .btn-view-all {
    padding: 0.6rem 1.2rem;
    font-size: 0.65rem;
    letter-spacing: 1px;
    gap: 0.5rem;
  }
  .btn-view-all svg { width: 13px; height: 13px; }
  
  .card-title { font-size: 0.9rem; }
  .card-shop-row { font-size: 0.75rem; }
  .p-amount-white { font-size: 0.85rem; }
  
  .card-bottom {
    padding-top: 0.75rem;
    gap: 0.5rem;
  }
  .creator-avatar {
    width: 26px;
    height: 26px;
  }
  .creator-label {
    font-size: 0.55rem;
  }
  .creator-name {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .card-bottom {
    flex-direction: row;
    align-items: center;
  }
  .p-amount-wrapper {
    align-items: flex-end;
    text-align: right;
  }
}

.view-all-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}

.btn-view-all {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.1rem 2.6rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 850;
  font-size: 0.8rem;
  letter-spacing: 1.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-transform: uppercase;
}

.btn-view-all:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
}

.btn-view-all svg {
  transition: transform 0.3s ease;
}

.btn-view-all:hover svg {
  transform: translateX(4px);
}
</style>
