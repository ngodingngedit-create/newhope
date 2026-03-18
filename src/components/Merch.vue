<script setup>
import { ref } from 'vue';

const merchItems = ref([
  {
    name: 'WRETCHED OVERSIZED TEE',
    category: 'APPAREL',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2574&auto=format&fit=crop',
    description: 'Cotton Combed 24s. Screen printed with high quality ink. Relaxed fit for maximum comfort during the show.',
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    isSoldOut: false
  },
  {
    name: 'NEWHOPE FLEECE HOODIE',
    category: 'APPAREL',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2574&auto=format&fit=crop',
    description: 'Heavyweight fleece material. Durable and warm. Features embroidered chest logo and screen printed back.',
    sizes: ['M', 'L', 'XL'],
    isNew: false,
    isSoldOut: false
  },
  {
    name: 'DEATH SPELL SNAPBACK',
    category: 'ACCESSORIES',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1588850567047-1845a23d446d?q=80&w=2670&auto=format&fit=crop',
    description: '6-panel construction. Adjustable strap. High-definition 3D embroidery.',
    sizes: null,
    isNew: false,
    isSoldOut: true
  },
  {
    name: 'FESTIVAL TOTE BAG',
    category: 'ACCESSORIES',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2574&auto=format&fit=crop',
    description: '12oz Canvas with high strength straps. Perfect for carrying all your festival essentials.',
    sizes: null,
    isNew: false,
    isSoldOut: false
  },
  {
    name: 'STICKER PACK V.1',
    category: 'COLLECTIBLES',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?q=80&w=2570&auto=format&fit=crop',
    description: '10 exclusive vinyl stickers. Waterproof and UV resistant. High gloss finish.',
    sizes: null,
    isNew: true,
    isSoldOut: false
  },
  {
    name: 'ART PRINT POSTER',
    category: 'COLLECTIBLES',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2680&auto=format&fit=crop',
    description: 'Screen printed on premium 270gsm archive paper. Hand-numbered limited edition.',
    sizes: null,
    isNew: false,
    isSoldOut: false
  }
]);

const selectedItem = ref(null);
const isModalActive = ref(false);
const selectedSize = ref(null);

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(!=\d))/g, ".");
};

const openDetail = (item) => {
  selectedItem.value = item;
  selectedSize.value = item.sizes ? item.sizes[0] : null;
  setTimeout(() => {
    isModalActive.value = true;
  }, 10);
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalActive.value = false;
  setTimeout(() => {
    selectedItem.value = null;
    document.body.style.overflow = '';
  }, 400);
};

const buyNow = () => {
  window.open("https://kolektix.com/merchandise", "_blank");
};
</script>

<template>
  <section id="merch" class="merch-bw-section">
    <div class="container-fluid">
      <div class="merch-header-row">
        <div class="header-main">
          <h2 class="title-display">COLLECTION</h2>
          <div class="pill-accent"></div>
        </div>
        <div class="header-side">
          <p class="subtitle-text">Exclusive drops for the NEWHOPE tour '24.</p>
        </div>
      </div>

      <div class="merch-grid-bw">
        <div 
          v-for="(item, index) in merchItems" 
          :key="index" 
          class="card-bw"
          @click="openDetail(item)"
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
              <div class="price-group">
                <span class="p-currency">IDR</span>
                <span class="p-amount">{{ formatPrice(item.price) }}</span>
              </div>
              <div class="circle-arrow">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BW Modal Optimized for Multi-Device -->
    <Teleport to="body">
      <div 
        v-if="selectedItem" 
        class="modal-overlay-bw" 
        :class="{ 'active': isModalActive }"
        @click.self="closeModal"
      >
        <div class="modal-body-bw">
          <button class="btn-close-bw" @click="closeModal">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          
          <div class="modal-flex-layout">
            <div class="modal-visual-side">
              <img :src="selectedItem.image" :alt="selectedItem.name" />
            </div>
            
            <div class="modal-info-side">
              <div class="info-top-bw">
                <span class="info-label">{{ selectedItem.category }}</span>
                <h2 class="info-title">{{ selectedItem.name }}</h2>
                <div class="info-price">Rp {{ formatPrice(selectedItem.price) }}</div>
              </div>
              
              <div class="info-mid-bw">
                <p class="info-desc">{{ selectedItem.description }}</p>
                
                <div v-if="selectedItem.sizes" class="info-options">
                  <header class="options-header">SELECT SIZE</header>
                  <div class="options-grid">
                    <button 
                      v-for="size in selectedItem.sizes" 
                      :key="size" 
                      class="options-pill"
                      :class="{ active: selectedSize === size }"
                      @click="selectedSize = size"
                    >
                      {{ size }}
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="info-bottom-bw">
                <button @click="buyNow" class="btn-buy-bw" :disabled="selectedItem.isSoldOut">
                  <span>{{ selectedItem.isSoldOut ? 'STOCK HABIS' : 'PESAN SEKARANG' }}</span>
                  <svg v-if="!selectedItem.isSoldOut" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
                </button>
                <div class="note-guarantee">Quality Inspected • Secure Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.merch-bw-section {
  padding: 8rem 0;
  background-color: #000;
  color: #fff;
}

.container-fluid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4.5%;
}

.merch-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5rem;
}

.title-display {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  letter-spacing: -3px;
  margin: 0;
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
  border-radius: 20px;
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
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #111;
}

.price-group { display: flex; flex-direction: column; }
.p-currency { font-size: 0.6rem; color: #333; font-weight: 950; }
.p-amount { font-size: 1.1rem; color: #888; }

.circle-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.card-bw:hover .circle-arrow {
  background: #fff;
  color: #000;
  transform: translateX(4px);
}

/* Modal Body BW */
.modal-overlay-bw {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.95);
  backdrop-filter: blur(20px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s ease;
}

.modal-overlay-bw.active { opacity: 1; pointer-events: auto; }

.modal-body-bw {
  background-color: #0c0c0c;
  width: 100%;
  max-width: 850px;
  height: auto;
  max-height: 90vh;
  position: relative;
  border-radius: 24px;
  border: 1px solid #1a1a1a;
  overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.5);
  transform: translateY(30px);
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
}

.modal-overlay-bw.active .modal-body-bw { transform: translateY(0); }

.btn-close-bw {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255,255,255,0.05);
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-flex-layout {
  display: flex;
  width: 100%;
}

.modal-visual-side {
  flex: 1;
  background: #000;
}

.modal-visual-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.modal-info-side {
  flex: 1;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  background-color: #0c0c0c;
}

.info-label { font-size: 0.65rem; color: #888; font-weight: 800; letter-spacing: 3px; margin-bottom: 0.75rem; display: block; }
.info-title { font-size: 2rem; font-weight: 900; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 0.75rem; }
.info-price { font-size: 1.5rem; font-weight: 300; color: #fff; padding-bottom: 1.5rem; border-bottom: 1px solid #1a1a1a; }

.info-mid-bw { padding: 1.5rem 0; }
.info-desc { font-size: 0.95rem; color: #666; line-height: 1.6; margin-bottom: 1.5rem; }

.options-header { font-size: 0.6rem; font-weight: 800; color: #333; margin-bottom: 0.8rem; letter-spacing: 1px; }
.options-grid { display: flex; gap: 0.6rem; flex-wrap: wrap; }

.options-pill {
  background: none;
  border: 1px solid #1a1a1a;
  color: #888;
  padding: 0.6rem 1.4rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.options-pill.active { background: #fff; color: #000; border-color: #fff; }

.btn-buy-bw {
  width: 100%;
  background: #fff;
  color: #000;
  padding: 1.25rem;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 950;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.note-guarantee { font-size: 0.65rem; color: #222; text-align: center; font-weight: 700; text-transform: uppercase; }

/* REFINED MOBILE - SIMILAR TO DESKTOP BUT SCALED */
@media (max-width: 992px) {
  .merch-grid-bw { grid-template-columns: repeat(2, 1fr); gap: 2.5rem 1.25rem; }
}

@media (max-width: 640px) {
  .merch-bw-section { padding: 5rem 0; }
  .title-display { font-size: 2.5rem; }
  .header-side { display: none; }
  .subtitle-text { text-align: left; }
  
  .modal-body-bw { 
    max-width: 100%; 
    height: auto;
    /* KEEP HORIZONTAL LAYOUT BUT ADJUST RATIO */
    flex-direction: row; 
    border-radius: 20px;
  }
  
  .modal-flex-layout { flex-direction: row; }
  
  .modal-visual-side { 
    flex: 0.6; /* Narrower image on mobile to save space */
  }
  
  .modal-info-side { 
    flex: 1; 
    padding: 2rem 1.25rem; 
  }
  
  .info-title { font-size: 1.35rem; }
  .info-price { font-size: 1.1rem; padding-bottom: 1rem; }
  .info-desc { font-size: 0.8rem; line-height: 1.4; margin-bottom: 1rem; }
  .info-mid-bw { padding: 0.75rem 0; }
  
  .options-pill { padding: 0.5rem 1rem; font-size: 0.65rem; }
  .btn-buy-bw { padding: 1rem; font-size: 0.85rem; }
  .btn-close-bw { width: 32px; height: 32px; top: 0.75rem; right: 0.75rem; }
  
  .card-title { font-size: 0.9rem; }
  .p-amount { font-size: 0.9rem; }
}

/* Extra small fixes */
@media (max-width: 400px) {
  .modal-body-bw { flex-direction: column; }
  .modal-flex-layout { flex-direction: column; }
  .modal-visual-side { height: 220px; flex: none; }
  .modal-info-side { padding: 1.5rem 1rem; }
}
</style>
