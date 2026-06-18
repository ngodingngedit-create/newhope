<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { MerchandiseItem, APIEventItem, mapAPIEventToMerchandise } from '../types';
import { increaseQty, decreaseQty, navigateTo, merchItems, isCartOpen } from '../store';
import { getDetail } from '../api';

const props = defineProps<{
  slug: string;
}>();

const item = ref<MerchandiseItem | null>(null);
const rawItem = ref<APIEventItem | null>(null);
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');

// E-commerce detail layout states
const activeIndex = ref(0);
const activeTab = ref('desc');
const selectedSize = ref('S');
const purchaseQty = ref(1);
const isWishlisted = ref(false);

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const goBack = () => {
  navigateTo('/merchandise');
};

const buyNow = () => {
  if (!item.value) return;
  const found = merchItems.value.find(x => x.id === item.value!.id);
  if (found) {
    found.quantity = (found.quantity || 0) + purchaseQty.value;
  } else {
    item.value.quantity = purchaseQty.value;
    merchItems.value.push(item.value);
  }
  navigateTo('/checkout');
};

const getCreatorImage = (item: any) => {
  const url = item.creator?.image_url || item.creator?.image || '';
  if (!url || url.endsWith('/creator') || url.endsWith('/creator/')) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.creator?.name || 'Mocca')}&background=ff5e81&color=fff&bold=true&rounded=true`;
  }
  return url;
};

const fetchItemDetails = async (slug: string) => {
  if (!slug) return;
  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';
  item.value = null;
  rawItem.value = null;
  activeIndex.value = 0;
  purchaseQty.value = 1;

  try {
    const response = await getDetail(slug);
    const result = response.data;
    const data: APIEventItem = result.data || result;
    
    if (data && data.id) {
      rawItem.value = data;
      const mapped = mapAPIEventToMerchandise(data);
      item.value = mapped;
      
      // If the category is apparel, provide default sizes for apparel items
      if (mapped.category === 'APPAREL') {
        selectedSize.value = 'M';
      }
    } else {
      throw new Error('Merchandise not found or invalid response format');
    }
  } catch (err: any) {
    console.error('Error fetching merchandise details:', err);
    hasError.value = true;
    errorMessage.value = err.response?.data?.message || err.message || 'Gagal memuat detail merchandise.';
  } finally {
    isLoading.value = false;
  }
};

// Compute thumbnails for the product gallery
const thumbnails = computed(() => {
  const list: string[] = [];
  if (!item.value) return list;

  // 1. Extract images from raw API event
  if (rawItem.value) {
    const imgs = rawItem.value.product_image || rawItem.value.images;
    if (imgs && imgs.length > 0) {
      list.push(...imgs.map(img => img.image_url));
    }
  }

  // 2. Add main image if list is empty
  if (list.length === 0 && item.value.image) {
    list.push(item.value.image);
  }

  // 3. Fallbacks to fill up 3 thumbnails matching the front/back/size-chart layout
  if (list.length < 2) {
    // Back view placeholder (clean back mockup style)
    list.push('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2574&auto=format&fit=crop');
  }
  if (list.length < 3) {
    // Size chart table layout mockup
    list.push('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=2574&auto=format&fit=crop');
  }

  return list.slice(0, 3);
});

const activeImage = computed(() => {
  if (thumbnails.value.length > 0 && thumbnails.value[activeIndex.value]) {
    return thumbnails.value[activeIndex.value];
  }
  return item.value?.image || '';
});

const subtotalPrice = computed(() => {
  return (item.value?.price || 0) * purchaseQty.value;
});

const cleanDescription = computed(() => {
  const desc = item.value?.description || '';
  if (!desc || desc.trim() === 'No description available for this item.' || desc.trim() === '<p>tes</p>') {
    return `Official merchandise dari Mocca dengan desain ikonik terinspirasi dari salah satu Artwork di album <i>My Diary – Telephone</i>. Menggunakan bahan cotton 24s yang nyaman dipakai untuk aktivitas sehari-hari. Cocok untuk para Mocca Friends yang ingin tampil simple, modis, dan timeless.`;
  }
  return desc;
});

// Navigation & Transaction Panel Handlers
const prevImage = () => {
  if (thumbnails.value.length === 0) return;
  activeIndex.value = (activeIndex.value - 1 + thumbnails.value.length) % thumbnails.value.length;
};

const nextImage = () => {
  if (thumbnails.value.length === 0) return;
  activeIndex.value = (activeIndex.value + 1) % thumbnails.value.length;
};

const increaseQuantity = () => {
  purchaseQty.value++;
};

const decreaseQuantity = () => {
  if (purchaseQty.value > 1) {
    purchaseQty.value--;
  }
};

const addToCartAction = () => {
  if (!item.value) return;
  const found = merchItems.value.find(x => x.id === item.value!.id);
  if (found) {
    found.quantity = (found.quantity || 0) + purchaseQty.value;
  } else {
    item.value.quantity = (item.value.quantity || 0) + purchaseQty.value;
  }
  isCartOpen.value = true;
};

const wishlistAction = () => {
  isWishlisted.value = !isWishlisted.value;
};

const shareAction = () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Link produk berhasil disalin ke clipboard!");
};

const chatAction = () => {
  alert("Menghubungkan Anda ke chat Mocca Official Store...");
};

// Fetch data on mount and watch slug changes
onMounted(() => {
  fetchItemDetails(props.slug);
});

watch(() => props.slug, (newSlug) => {
  fetchItemDetails(newSlug);
});
</script>

<template>
  <div class="detail-page-wrapper">
    <div class="container">
      
 

      <!-- Loading State (Skeleton Detail Page) -->
      <div v-if="isLoading" class="skeleton-detail-layout">
        <div class="skeleton-grid-cols">
          <div class="skeleton-col-left skeleton-pulse"></div>
          <div class="skeleton-col-mid">
            <div class="skeleton-line skeleton-pulse" style="width: 80%"></div>
            <div class="skeleton-line skeleton-pulse" style="width: 40%; margin-top: 1rem"></div>
            <div class="skeleton-line skeleton-pulse" style="width: 60%; margin-top: 2rem"></div>
            <div class="skeleton-line skeleton-pulse" style="width: 100%; margin-top: 3rem; height: 100px"></div>
          </div>
          <div class="skeleton-col-right skeleton-pulse"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="hasError" class="detail-error-card">
        <div class="error-container">
          <div class="error-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#ff4444" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="error-title">Gagal Memuat Detail</h3>
          <p class="error-message">{{ errorMessage || 'Terjadi kesalahan saat memuat detail produk.' }}</p>
          <button class="btn-retry" @click="fetchItemDetails(props.slug)">Coba Lagi</button>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="item" class="detail-columns-layout">
        
        <!-- COLUMN 1: PRODUCT MEDIA (LEFT) -->
        <div class="col-media">
          <div class="main-image-frame">
            <img :src="activeImage" :alt="item.name" />
          </div>
          <div class="gallery-wrapper">
            <button class="arrow-btn left" @click="prevImage" :disabled="thumbnails.length <= 1">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div class="thumbnails-row">
              <div 
                v-for="(thumb, idx) in thumbnails" 
                :key="idx" 
                class="thumb-item"
                :class="{ active: activeIndex === idx }"
                @click="activeIndex = idx"
              >
                <img :src="thumb" alt="Thumbnail" />
              </div>
            </div>
            <button class="arrow-btn right" @click="nextImage" :disabled="thumbnails.length <= 1">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- COLUMN 2: PRODUCT DETAILS (CENTER) -->
        <div class="col-details">
          <h1 class="product-title">{{ item.name }}</h1>
          <div class="sales-info">Terjual {{ item.total_sold }}</div>
          <div class="price-display">Rp {{ formatPrice(item.price) }}</div>
          
          <!-- Store Profile -->
          <div class="store-profile">
            <img :src="getCreatorImage(item)" class="store-avatar" />
            <div class="store-info-col">
              <div class="store-name-row">
                <span class="store-name">{{ item.creator.name }}</span>
                <!-- Verified Badge -->
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#0095f6" class="verified-icon">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span class="store-location">Jakarta</span>
            </div>
          </div>

          <!-- Size Selector -->
          <div class="size-selector-section" v-if="item.category === 'APPAREL'">
            <div class="size-label">Pilih Ukuran: <span>{{ selectedSize }}</span></div>
            <div class="size-options-row">
              <button 
                v-for="size in ['S', 'M', 'L', 'XL', 'XXL']" 
                :key="size"
                class="size-box"
                :class="{ active: selectedSize === size }"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Interactive Tabs -->
          <div class="description-tabs-section">
            <div class="tabs-header">
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'desc' }" 
                @click="activeTab = 'desc'"
              >
                Deskripsi Produk
              </button>
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'review' }" 
                @click="activeTab = 'review'"
              >
                Ulasan (0)
              </button>
            </div>
            
            <div class="tab-content" v-if="activeTab === 'desc'">
              <div class="product-description" v-html="cleanDescription"></div>
              
              <div class="specifications-list" v-if="item.category === 'APPAREL'">
                <div class="specs-title">Detail Produk :</div>
                <ul>
                  <li>Material : Cotton 24s</li>
                  <li>Printing : Sablon Plastisol</li>
                  <li>Size : S – XXL</li>
                  <li>Official Merchandise Mocca</li>
                </ul>
              </div>
            </div>
            
            <div class="tab-content reviews" v-else-if="activeTab === 'review'">
              <div class="reviews-empty">
                <p>Belum ada ulasan untuk produk ini.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMN 3: TRANSACTION PANEL (RIGHT) -->
        <div class="col-transaction">
          <div class="floating-panel">
            <h3 class="panel-title">Jumlah</h3>
            <div class="quantity-control-row" v-if="!item.isSoldOut">
              <div class="quantity-counter">
                <button class="qty-btn" @click="decreaseQuantity" :disabled="purchaseQty <= 1">−</button>
                <span class="qty-num">{{ purchaseQty }}</span>
                <button class="qty-btn" @click="increaseQuantity">+</button>
              </div>
              <div class="stock-info">Stok 2</div>
            </div>
            <div class="sold-out-box" v-else>OUT OF STOCK</div>

            <div class="subtotal-row" v-if="!item.isSoldOut">
              <span class="subtotal-label">Subtotal</span>
              <span class="subtotal-amount">Rp {{ formatPrice(subtotalPrice) }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons-stack">
              <button class="btn-add-cart" @click="addToCartAction" :disabled="item.isSoldOut">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                <span>Tambah Keranjang</span>
              </button>
              <button class="btn-buy-now" @click="buyNow" :disabled="item.isSoldOut">
                Beli Sekarang
              </button>
            </div>

            <!-- Micro Action Buttons -->
            <div class="micro-actions-row">
              <button class="micro-btn" @click="shareAction" aria-label="Share">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>
              <button class="micro-btn" @click="wishlistAction" :class="{ active: isWishlisted }" aria-label="Add to Wishlist">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-if="isWishlisted"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-else><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
              <button class="btn-chat-action" @click="chatAction">
                <span>Chat</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page-wrapper {
  background-color: #000;
  color: #fff;
  min-height: 85vh;
  padding: 8rem 0 5rem 0;
  display: flex;
  flex-direction: column;
}

.btn-back-to-catalog {
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
  margin-bottom: 2rem;
  transition: color 0.3s;
  padding: 0;
}

.btn-back-to-catalog:hover {
  color: #fff;
}

/* 3-COLUMN LAYOUT */
.detail-columns-layout {
  display: grid;
  grid-template-columns: minmax(300px, 1.2fr) minmax(350px, 1.5fr) minmax(280px, 1fr);
  gap: 3rem;
  align-items: start;
}

/* COLUMN 1: MEDIA (LEFT) */
.col-media {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-image-frame {
  aspect-ratio: 1/1;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #1a1a1a;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.arrow-btn {
  background: #141416;
  border: 1px solid #27272a;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.arrow-btn:hover:not(:disabled) {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.thumbnails-row {
  display: flex;
  gap: 0.75rem;
  flex-grow: 1;
  justify-content: center;
}

.thumb-item {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-item.active {
  border-color: #fff;
}

/* COLUMN 2: DETAILS (CENTER) */
.col-details {
  display: flex;
  flex-direction: column;
}

.product-title {
  font-family: var(--font-body);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  text-transform: none;
  letter-spacing: 0;
  margin-bottom: 0.5rem;
}

.sales-info {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 1rem;
}

.price-display {
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;
}

/* Store Profile */
.store-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #0c0c0e;
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.store-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.store-info-col {
  display: flex;
  flex-direction: column;
}

.store-name-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.store-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.verified-icon {
  flex-shrink: 0;
}

.store-location {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Size Selector */
.size-selector-section {
  margin-bottom: 2.5rem;
}

.size-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.size-label span {
  color: #fff;
  font-weight: 800;
  margin-left: 0.25rem;
}

.size-options-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.size-box {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  border: 1px solid #27272a;
  background: transparent;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-box:hover {
  border-color: #fff;
}

.size-box.active {
  background: #fff;
  color: #000;
  border-color: #fff;
  font-weight: 700;
}

/* Tabs Section */
.description-tabs-section {
  margin-top: 1rem;
}

.tabs-header {
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #1a1a1a;
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 0;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
}

.tab-btn:hover {
  color: #fff;
}

.tab-btn.active {
  color: #fff;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #fff;
}

.tab-content {
  padding-top: 1.5rem;
}

.product-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.specifications-list {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #101012;
}

.specs-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.75rem;
}

.specifications-list ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.25rem;
  list-style-type: disc;
}

.specifications-list li {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.reviews-empty {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* COLUMN 3: TRANSACTION PANEL (RIGHT) */
.col-transaction {
  position: sticky;
  top: 100px;
}

.floating-panel {
  background: rgba(24, 24, 27, 0.4);
  border: 1px solid #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(8px);
}

.panel-title {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  text-transform: none;
  letter-spacing: 0;
  margin-bottom: 1.25rem;
}

.quantity-control-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.quantity-counter {
  display: flex;
  align-items: center;
  background: #0f0f11;
  border: 1px solid #27272a;
  border-radius: 8px;
  padding: 2px;
}

.quantity-counter .qty-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.quantity-counter .qty-btn:hover:not(:disabled) {
  background: #27272a;
}

.quantity-counter .qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-num {
  min-width: 36px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
}

.stock-info {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.sold-out-box {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
  color: #ff4444;
  text-align: center;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
}

.subtotal-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-top: 1px solid #1a1a1a;
  padding-top: 1.25rem;
}

.subtotal-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.subtotal-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.action-buttons-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.btn-add-cart {
  background: #fff;
  color: #000;
  border: 1px solid #fff;
  border-radius: 8px;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-cart:hover:not(:disabled) {
  background: transparent;
  color: #fff;
}

.btn-add-cart:disabled {
  background: #1a1a1c;
  border-color: #1a1a1c;
  color: #555;
  cursor: not-allowed;
}

.btn-buy-now {
  background: transparent;
  color: #fff;
  border: 1px solid #27272a;
  border-radius: 8px;
  padding: 0.85rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-buy-now:hover:not(:disabled) {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.btn-buy-now:disabled {
  border-color: #1a1a1c;
  color: #555;
  cursor: not-allowed;
}

.micro-actions-row {
  display: flex;
  gap: 0.5rem;
}

.micro-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #27272a;
  border-radius: 8px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.micro-btn:hover {
  border-color: #fff;
  color: #fff;
}

.micro-btn.active {
  color: #ff4444;
  border-color: rgba(255, 68, 68, 0.4);
  background: rgba(255, 68, 68, 0.05);
}

.btn-chat-action {
  flex-grow: 1;
  height: 44px;
  border: 1px solid #27272a;
  border-radius: 8px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-chat-action:hover {
  border-color: #fff;
  color: #fff;
}

/* SKELETON LOADING EFFECTS */
.skeleton-detail-layout {
  pointer-events: none;
}

.skeleton-grid-cols {
  display: grid;
  grid-template-columns: minmax(300px, 1.2fr) minmax(350px, 1.5fr) minmax(280px, 1fr);
  gap: 3rem;
}

.skeleton-col-left {
  aspect-ratio: 1/1;
  border-radius: 12px;
}

.skeleton-col-mid {
  display: flex;
  flex-direction: column;
}

.skeleton-line {
  height: 20px;
  border-radius: 6px;
  background: #18181b;
}

.skeleton-col-right {
  height: 350px;
  border-radius: 12px;
}

.skeleton-pulse {
  background: linear-gradient(90deg, #0f0f11 25%, #1c1c21 37%, #0f0f11 63%);
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

/* ERROR STATE CARD */
.detail-error-card {
  background-color: #0c0c0c;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #1a1a1a;
  padding: 4rem 2rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 450px;
  margin: 0 auto;
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
}

.error-message {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.btn-retry {
  background: #fff;
  color: #000;
  border: 1px solid #fff;
  padding: 0.8rem 2.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
}

/* RESPONSIVE DESIGN */
@media (max-width: 1100px) {
  .detail-columns-layout,
  .skeleton-grid-cols {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
  .col-transaction,
  .skeleton-col-right {
    grid-column: span 2;
    position: static;
  }
  .floating-panel {
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .detail-columns-layout,
  .skeleton-grid-cols {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .col-transaction,
  .skeleton-col-right {
    grid-column: span 1;
  }
  .product-title {
    font-size: 1.6rem;
  }
  .price-display {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  .store-profile {
    margin-bottom: 1.5rem;
  }
  .size-selector-section {
    margin-bottom: 1.75rem;
  }
}

@media (max-width: 640px) {
  .detail-page-wrapper {
    padding: 6rem 0 4rem 0;
  }
  .main-image-frame {
    border-radius: 8px;
  }
  .thumb-item {
    width: 60px;
    height: 60px;
  }
}
</style>
