<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { merchItems, isLoading, hasError, errorMessage, fetchMerchItems, increaseQty, decreaseQty, navigateTo } from '../store';

const selectedCategory = ref('ALL');

const categories = computed(() => {
  const uniq = new Set(merchItems.value.map(item => item.category.toUpperCase()));
  return ['ALL', ...Array.from(uniq)];
});

const filteredItems = computed(() => {
  if (selectedCategory.value === 'ALL') {
    return merchItems.value;
  }
  return merchItems.value.filter(item => item.category.toUpperCase() === selectedCategory.value);
});

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const getCreatorImage = (item: any) => {
  const url = item.creator?.image_url || item.creator?.image || '';
  if (!url || url.endsWith('/creator') || url.endsWith('/creator/')) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.creator?.name || 'Store')}&background=ff5e81&color=fff&bold=true&rounded=true`;
  }
  return url;
};

const navigateToDetail = (slug: string) => {
  navigateTo(`/merchandise/${slug}`);
};

const goBackHome = () => {
  navigateTo('/');
};

onMounted(() => {
  fetchMerchItems();
});
</script>

<template>
  <section class="all-merch-section">
    <div class="container">


      <!-- Section Title -->
      <div class="all-merch-header">
        <h1 class="title-display">ALL MERCHANDISE</h1>
        <div class="pill-accent"></div>
      </div>

      <!-- Category Filters -->
      <div v-if="!isLoading && !hasError && categories.length > 1" class="filters-wrapper">
        <div class="filters-row">
          <button 
            v-for="cat in categories" 
            :key="cat"
            class="filter-pill"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading State (Skeleton Grid) -->
      <div v-if="isLoading" class="all-merch-grid">
        <div v-for="n in 8" :key="n" class="card-bw skeleton-card">
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
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ff4444" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="error-title">Gagal Memuat Koleksi</h3>
          <p class="error-message">{{ errorMessage || 'Terjadi kesalahan koneksi saat memuat merchandise.' }}</p>
          <button class="btn-retry" @click="fetchMerchItems">Coba Lagi</button>
        </div>
      </div>

      <!-- No Items State -->
      <div v-else-if="filteredItems.length === 0" class="empty-state">
        <p>Tidak ada produk dalam kategori ini.</p>
      </div>

      <!-- Catalog Grid -->
      <div v-else class="all-merch-grid">
        <div 
          v-for="(item, index) in filteredItems" 
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
            <span class="card-tag">{{ item.category }}</span>
            <h3 class="card-title">{{ item.name }}</h3>
            <div class="card-bottom">
              <!-- Top-right portion: Price & Quantity selector -->
              <div class="price-quantity-wrapper">
                <div class="p-amount-wrapper">
                  <div class="p-amount-white">Rp {{ formatPrice(item.price) }}</div>
                  <div v-if="item.originalPrice" class="p-amount-original">Rp {{ formatPrice(item.originalPrice) }}</div>
                </div>
                
                <div class="quantity-selector" @click.stop v-if="!item.isSoldOut">
                  <button class="qty-btn" @click="decreaseQty(item)" :disabled="item.quantity === 0" aria-label="Decrease quantity">−</button>
                  <span class="qty-num">{{ item.quantity || 0 }}</span>
                  <button class="qty-btn" @click="increaseQty(item)" aria-label="Increase quantity">+</button>
                </div>
                <div class="sold-out-text" v-else>OUT OF STOCK</div>
              </div>

              <!-- Bottom-left portion: Creator section -->
              <div class="card-creator">
                <img :src="getCreatorImage(item)" :alt="item.creator.name" class="creator-avatar" />
                <div class="creator-info">
                  <span class="creator-label">Official Store</span>
                  <span class="creator-name">{{ item.creator.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.all-merch-section {
  padding: 8rem 0;
  background-color: #000;
  color: #fff;
  min-height: 90vh;
}

.btn-back-home {
  background: transparent;
  border: none;
  color: #888;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  margin-bottom: 3rem;
  transition: color 0.3s;
  padding: 0;
}

.btn-back-home:hover {
  color: #fff;
}

.all-merch-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 4rem;
}

.title-display {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -3px;
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

/* Category Filters */
.filters-wrapper {
  margin-bottom: 4rem;
  display: flex;
  justify-content: flex-start;
}

.filters-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-pill {
  background: none;
  border: 1px solid #1a1a1a;
  color: #888;
  padding: 0.6rem 1.4rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.5px;
}

.filter-pill.active {
  background: #fff;
  color: #000;
  border-color: #fff;
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.08);
}

.filter-pill:hover:not(.active) {
  border-color: #444;
  color: #fff;
}

/* Card Grid */
.all-merch-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3.5rem 1.75rem;
}

.card-bw {
  cursor: pointer;
  transition: all 0.4s ease;
}

.card-image-wrap {
  position: relative;
  aspect-ratio: 4/5;
  background-color: #0c0c0c;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255,255,255,0.05);
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

.card-tag {
  font-size: 0.65rem;
  color: #444;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
  display: block;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  line-height: 1.25;
}

.card-bottom {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 1.25rem;
  border-top: 1px solid #111;
  gap: 0.75rem;
  width: 100%;
}

.card-creator {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  align-self: flex-start;
  min-width: 0;
}

.creator-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.creator-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.creator-label {
  font-size: 0.65rem;
  color: #555;
  font-weight: 500;
  line-height: 1.25;
}

.creator-name {
  font-size: 0.8rem;
  color: #fff;
  font-weight: 750;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
}

.price-quantity-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  width: 100%;
}

.p-amount-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.p-amount-white {
  font-size: 1.05rem;
  color: #ffffff;
  font-weight: 700;
  line-height: 1.2;
}

.p-amount-original {
  font-size: 0.8rem;
  color: #ff4444;
  text-decoration: line-through;
  line-height: 1.2;
  margin-top: 0.1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: #141414;
  border: 1px solid #27272a;
  border-radius: 100px;
  padding: 2px 6px;
  gap: 0.5rem;
}

.qty-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #ffffff;
  border: none;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.qty-btn:hover:not(:disabled) {
  background: #27272a;
}

.qty-btn:disabled {
  color: #555;
  cursor: not-allowed;
}

.qty-num {
  font-size: 0.8rem;
  color: #ffffff;
  font-weight: 600;
  min-width: 14px;
  text-align: center;
  user-select: none;
}

.sold-out-text {
  font-size: 0.65rem;
  color: #555;
  font-weight: 700;
  letter-spacing: 1px;
}

.empty-state {
  text-align: center;
  padding: 5rem 0;
  color: #666;
  font-size: 1.1rem;
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

/* RESPONSIVE LAYOUT */
@media (max-width: 1024px) {
  .all-merch-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .all-merch-section {
    padding: 5rem 0;
  }
  .all-merch-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1.25rem;
  }
}

@media (max-width: 640px) {
  .title-display {
    font-size: 2.5rem;
  }
  .card-title {
    font-size: 0.9rem;
  }
  .p-amount-white {
    font-size: 0.85rem;
  }
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
  .quantity-selector {
    padding: 1px 4px;
    gap: 0.25rem;
  }
  .qty-btn {
    width: 16px;
    height: 16px;
    font-size: 0.75rem;
  }
  .qty-num {
    font-size: 0.75rem;
    min-width: 12px;
  }
}

@media (max-width: 480px) {
  .all-merch-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem 0;
  }
  .card-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }
  .price-quantity-wrapper {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    border-top: 1px dashed rgba(255, 255, 255, 0.05);
    padding-top: 0.5rem;
  }
}
</style>
