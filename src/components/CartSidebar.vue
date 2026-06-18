<script setup lang="ts">
import { computed } from 'vue';
import { merchItems, isCartOpen, toggleCart, increaseQty, decreaseQty, removeCartItem, clearCart, navigateTo } from '../store';

const cartItems = computed(() => merchItems.value.filter(item => item.quantity > 0));

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const checkout = () => {
  toggleCart();
  navigateTo('/checkout');
};
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop overlay -->
    <transition name="fade">
      <div v-if="isCartOpen" class="cart-backdrop" @click="toggleCart"></div>
    </transition>

    <!-- Sidebar Drawer -->
    <transition name="slide">
      <div v-if="isCartOpen" class="cart-drawer">
        <!-- Header -->
        <div class="cart-header">
          <h2 class="cart-title">KERANJANG BELANJA</h2>
          <div class="cart-header-actions">
            <!-- Clear All Button (Trash Icon) -->
            <button v-if="cartItems.length > 0" class="btn-clear-all-header" @click="clearCart" aria-label="Clear all items">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
            <!-- Close Button -->
            <button class="btn-close-cart" @click="toggleCart" aria-label="Close cart">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Cart Content -->
        <div class="cart-content">
          <!-- Empty State -->
          <div v-if="cartItems.length === 0" class="cart-empty">
            <div class="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <p class="empty-text">Keranjang belanja Anda kosong.</p>
            <button class="btn-shop-now" @click="toggleCart">BELANJA SEKARANG</button>
          </div>

          <!-- Items List -->
          <div v-else class="cart-items-wrapper">
            <div class="cart-items-list">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <div class="item-visual">
                  <img :src="item.image" :alt="item.name" />
                </div>
                
                <div class="item-details">
                  <span class="item-category">{{ item.category }}</span>
                  <h3 class="item-name">{{ item.name }}</h3>
                  
                  <!-- Store info -->
                  <div class="item-store">
                    <span class="store-badge">Store</span>
                    <span class="store-name">{{ item.creator.name }}</span>
                  </div>

                  <!-- Prices -->
                  <div class="item-prices">
                    <div class="item-price-current">Rp {{ formatPrice(item.price) }}</div>
                    <div v-if="item.originalPrice" class="item-price-original">Rp {{ formatPrice(item.originalPrice) }}</div>
                  </div>

                  <!-- Quantity and Delete actions -->
                  <div class="item-actions">
                    <div class="quantity-selector">
                      <button class="qty-btn" @click="decreaseQty(item)" aria-label="Decrease quantity">−</button>
                      <span class="qty-num">{{ item.quantity }}</span>
                      <button class="qty-btn" @click="increaseQty(item)" aria-label="Increase quantity">+</button>
                    </div>
                    
                    <button class="btn-delete-item" @click="removeCartItem(item)" aria-label="Delete item">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Summary -->
        <div v-if="cartItems.length > 0" class="cart-footer">
          <div class="summary-row">
            <span class="summary-label">TOTAL PEMBAYARAN</span>
            <span class="summary-value">Rp {{ formatPrice(subtotal) }}</span>
          </div>
          
          <button class="btn-checkout" @click="checkout">
            <span>CHECKOUT SEKARANG</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
          </button>
          
          <p class="footer-notice">Transaksi diproses secara aman oleh Kolektix.</p>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop overlay */
.cart-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 999998;
}

/* Sidebar Drawer */
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 440px;
  max-width: 100%;
  background-color: #0c0c0c;
  border-left: 1px solid #1a1a1a;
  z-index: 999999;
  display: flex;
  flex-direction: column;
  box-shadow: -20px 0 50px rgba(0, 0, 0, 0.8);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Header */
.cart-header {
  padding: 1.75rem 2rem;
  border-bottom: 1px solid #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-title {
  font-size: 1.1rem;
  font-weight: 950;
  letter-spacing: 1px;
  margin: 0;
}

.cart-header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-clear-all-header {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.25s;
}

.btn-clear-all-header:hover {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
}

.btn-close-cart {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}

.btn-close-cart:hover {
  background: #fff;
  color: #000;
}

/* Content Area */
.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Empty State */
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60%;
  text-align: center;
}

.empty-icon {
  margin-bottom: 1.5rem;
  opacity: 0.2;
}

.empty-text {
  color: #555;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  font-weight: 500;
}

.btn-shop-now {
  background: #fff;
  color: #000;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 900;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.3s;
}

.btn-shop-now:hover {
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Items Wrapper */
.cart-items-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cart-item {
  display: flex;
  gap: 1.25rem;
  background-color: #050505;
  border: 1px solid #111;
  border-radius: 16px;
  padding: 1rem;
}

.item-visual {
  width: 90px;
  height: 110px;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  flex-shrink: 0;
}

.item-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-category {
  font-size: 0.6rem;
  color: #444;
  font-weight: 800;
  letter-spacing: 1px;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  margin: 0.25rem 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-store {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.store-badge {
  font-size: 0.55rem;
  background: #18181b;
  color: #888;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.store-name {
  font-size: 0.75rem;
  color: #666;
  font-weight: 600;
  text-transform: capitalize;
}

.item-prices {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.item-price-current {
  font-size: 0.95rem;
  color: #fff;
  font-weight: 800;
}

.item-price-original {
  font-size: 0.75rem;
  color: #444;
  text-decoration: line-through;
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: #141414;
  border: 1px solid #27272a;
  border-radius: 100px;
  padding: 2px 4px;
  gap: 0.4rem;
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
  font-size: 0.8rem;
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
  font-size: 0.75rem;
  color: #ffffff;
  font-weight: 600;
  min-width: 14px;
  text-align: center;
}

.btn-delete-item {
  background: transparent;
  border: none;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.25s;
  padding: 0.25rem;
}

.btn-delete-item:hover {
  color: #ff4444;
}

/* Footer Summary */
.cart-footer {
  padding: 1.25rem 1.75rem;
  border-top: 1px solid #1a1a1a;
  background-color: #0c0c0c;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-label {
  font-size: 0.7rem;
  color: #555;
  font-weight: 800;
  letter-spacing: 1px;
}

.summary-value {
  font-size: 1.15rem;
  color: #fff;
  font-weight: 900;
}

.btn-checkout {
  width: 100%;
  background: #fff;
  color: #000;
  padding: 0.85rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 950;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: 0.5px;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
}

.footer-notice {
  font-size: 0.55rem;
  color: #222;
  text-align: center;
  margin-top: 0.75rem;
  text-transform: uppercase;
  font-weight: 800;
}

/* RESPONSIVENESS */
@media (max-width: 480px) {
  .cart-drawer {
    width: 100vw;
  }
  .cart-header {
    padding: 1.25rem 1.5rem;
  }
  .cart-content {
    padding: 1.5rem;
  }
  .cart-footer {
    padding: 1.25rem 1.5rem;
  }
}
</style>
