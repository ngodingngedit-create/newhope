<template>
  <div class="booking-checkout-page">
    <div class="container">
      <!-- Title -->
      <div class="page-header">
        <h2 class="title-display">Informasi Pemesanan</h2>
      </div>

      <!-- Main Layout -->
      <div class="booking-checkout-container" v-if="bookingSchedules && bookingSchedules.length > 0">
        
        <!-- LEFT COLUMN: Customer Form & Selected Schedules -->
        <div class="checkout-left-col">
          
          <!-- Accordion Card: Data Pemesan -->
          <div class="checkout-card accordion-card" :class="{ 'card-collapsed': !isFormExpanded }">
            <div class="card-header-row" @click="isFormExpanded = !isFormExpanded">
              <div class="header-title-wrap">
                <div class="header-icon-box">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3>Data Pemesan</h3>
              </div>
              <button class="btn-toggle-accordion" aria-label="Toggle details">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" class="chevron-icon" :class="{ rotated: !isFormExpanded }">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
            
            <div class="card-body-expandable" v-show="isFormExpanded">
              <div class="input-group">
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  v-model="fullName" 
                  placeholder="Nama Lengkap" 
                  class="checkout-input"
                  :class="{ 'input-error': errors.fullName }"
                />
                <span class="error-msg" v-if="errors.fullName">{{ errors.fullName }}</span>
              </div>
              
              <div class="input-group">
                <label>Email</label>
                <input 
                  type="email" 
                  v-model="email" 
                  placeholder="Contoh: nama@email.com" 
                  class="checkout-input"
                  :class="{ 'input-error': errors.email }"
                />
                <span class="error-msg" v-if="errors.email">{{ errors.email }}</span>
              </div>
              
              <div class="input-group">
                <label>No Telepon</label>
                <div class="phone-input-combo">
                  <div class="prefix-dropdown-wrapper">
                    <select v-model="phonePrefix" class="phone-prefix-select">
                      <option value="+62">+62</option>
                      <option value="+1">+1</option>
                      <option value="+65">+65</option>
                      <option value="+60">+60</option>
                    </select>
                    <div class="select-chevron">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                  <input 
                    type="tel" 
                    v-model="phoneNumber" 
                    placeholder="81234567890" 
                    class="checkout-input phone-number-input"
                    :class="{ 'input-error': errors.phoneNumber }"
                    @input="cleanPhoneNumber"
                  />
                </div>
                <span class="error-msg" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</span>
              </div>
            </div>
          </div>

          <!-- Card: Jadwal Dipilih -->
          <div class="checkout-card schedules-card">
            <div class="card-header-row-static">
              <div class="header-title-wrap">
                <div class="header-icon-box">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3>Jadwal Dipilih</h3>
              </div>
              <button class="btn-clear-all" @click="clearAllSchedules">Hapus Semua</button>
            </div>

            <!-- List of Schedules -->
            <div class="checkout-slots-list">
              <div 
                v-for="slot in bookingSchedules" 
                :key="slot.id" 
                class="slot-detail-item"
              >
                <!-- Remove item x -->
                <button class="btn-remove-slot-item" @click="removeScheduleSlot(slot.id)" aria-label="Remove slot">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div class="slot-item-info-row">
                  <div class="slot-white-box">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <path d="M9 16l2 2 4-4" />
                    </svg>
                  </div>
                  <div class="slot-meta">
                    <div class="slot-title">{{ slot.area }} • {{ slot.dateStr }}</div>
                    <div class="slot-sub">{{ formatWib(slot.timeRange) }} - Rp {{ formatPrice(slot.price) }}</div>
                  </div>
                </div>

                <!-- Notes Input -->
                <div class="slot-note-wrapper">
                  <input 
                    type="text" 
                    v-model="slot.notes" 
                    placeholder="Catatan tambahan (Opsional)" 
                    class="slot-note-input"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: Venue Details, Voucher, Summary -->
        <div class="checkout-right-col">
          
          <!-- Card: Venue Overview -->
          <div class="checkout-card venue-overview-card" v-if="bookingVenue">
            <div class="venue-image-wrap">
              <img :src="bookingVenue.image" :alt="bookingVenue.name" class="venue-image" />
              <div class="venue-name-overlay">{{ bookingVenue.name }}</div>
            </div>
            
            <div class="venue-host-row">
              <div class="host-avatar-box">
                <img :src="bookingVenue.organizer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'" alt="Host Avatar" />
              </div>
              <div class="host-info">
                <span class="host-label">Penyelenggara</span>
                <span class="host-name">{{ bookingVenue.organizer?.name || 'CBN Hall' }}</span>
              </div>
            </div>
          </div>

          <!-- Card: Voucher -->
          <div class="checkout-card voucher-card">
            <div class="card-header-row-static">
              <div class="header-title-wrap">
                <div class="header-icon-box">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
                  </svg>
                </div>
                <h3>Voucher</h3>
              </div>
            </div>
            
            <div class="voucher-input-group">
              <div class="voucher-input-row">
                <input 
                  type="text" 
                  v-model="voucherCode" 
                  placeholder="Kode Voucher" 
                  class="checkout-input voucher-text-input"
                  :disabled="isVoucherApplied"
                />
                <button 
                  class="btn-apply-voucher" 
                  @click="applyVoucherCode"
                  :disabled="!voucherCode"
                >
                  {{ isVoucherApplied ? 'Applied' : 'Submit' }}
                </button>
              </div>
              <p class="voucher-success-text" v-if="isVoucherApplied">
                Voucher berhasil digunakan! Diskon {{ discountPercent }}% telah diterapkan.
                <button class="btn-remove-voucher" @click="removeVoucher">Batal</button>
              </p>
              <p class="voucher-error-text" v-if="voucherError">{{ voucherError }}</p>
              
              <button class="btn-add-voucher-dashed" @click="suggestVoucherCode">
                + Tambah Voucher
              </button>
            </div>
          </div>

          <!-- Card: Ringkasan Pesanan -->
          <div class="checkout-card summary-card">
            <div class="card-header-row-static">
              <div class="header-title-wrap">
                <div class="header-icon-box">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </div>
                <h3>Ringkasan Pesanan</h3>
              </div>
            </div>

            <!-- List in Summary -->
            <div class="summary-slots-mini-list">
              <div v-for="slot in bookingSchedules" :key="'mini-'+slot.id" class="summary-mini-item">
                <div class="mini-item-left">
                  <div class="mini-icon">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <path d="M9 16l2 2 4-4" />
                    </svg>
                  </div>
                  <div class="mini-details">
                    <div class="mini-title">{{ slot.dateStr }} • {{ slot.area }}</div>
                    <div class="mini-sub">{{ formatWib(slot.timeRange) }}</div>
                  </div>
                </div>
                <div class="mini-price">Rp {{ formatPrice(slot.price) }}</div>
              </div>
            </div>

            <!-- Summary Dividers and Prices -->
            <hr class="summary-divider-dashed" />
            
            <div class="summary-fee-rows">
              <div class="fee-row">
                <span class="fee-label">Jumlah ({{ bookingSchedules.length }} Slot)</span>
                <span class="fee-value">Rp {{ formatPrice(subtotalPrice) }}</span>
              </div>
              <div class="fee-row">
                <span class="fee-label">Biaya Admin</span>
                <span class="fee-value">Rp {{ formatPrice(adminFee) }}</span>
              </div>
              <div class="fee-row discount-row" v-if="isVoucherApplied">
                <span class="fee-label">Diskon ({{ discountPercent }}%)</span>
                <span class="fee-value">- Rp {{ formatPrice(discountAmount) }}</span>
              </div>
            </div>

            <hr class="summary-divider-dashed" />

            <div class="summary-total-row">
              <span class="total-label">Total</span>
              <span class="total-value text-white">Rp {{ formatPrice(grandTotalPrice) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Empty State / Direct Access Fallback -->
      <div class="checkout-empty-state-card" v-else>
        <div class="empty-icon-wrap">
          <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#a1a1aa" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h3>Belum ada jadwal yang dipilih</h3>
        <p>Silakan kembali ke katalog dan pilih jadwal venue yang Anda inginkan terlebih dahulu.</p>
        <button class="btn-back-home" @click="goToHome">Kembali ke Beranda</button>
      </div>
    </div>

    <!-- Sticky Bottom Footer Bar -->
    <div class="checkout-footer-bar" v-if="bookingSchedules && bookingSchedules.length > 0">
      <div class="container footer-bar-content">
        <div class="countdown-container">
          <div class="countdown-capsule">
            <span class="countdown-time">{{ formattedTime }}</span>
            <span class="countdown-divider">|</span>
            <span class="countdown-msg">Segera selesaikan pesananmu</span>
          </div>
        </div>
        <button class="btn-checkout-submit" @click="handlePaymentSubmit">
          SELANJUTNYA
        </button>
      </div>
    </div>

    <!-- Booking Confirmation Overlay Modal -->
    <div class="success-overlay" v-if="showSuccessModal" @click.self="goToHome">
      <div class="success-modal-card">
        <div class="success-icon-wrap">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2>Booking Berhasil!</h2>
        <p class="success-desc">
          Terima kasih <strong>{{ fullName }}</strong>, pesanan booking Anda untuk <strong>{{ bookingVenue?.name }}</strong> telah berhasil kami proses.
        </p>
        
        <div class="success-details-box">
          <div class="success-detail-row">
            <span>Metode:</span>
            <strong>Transfer Bank / E-Wallet</strong>
          </div>
          <div class="success-detail-row">
            <span>Jumlah Jadwal:</span>
            <strong>{{ bookingSchedules.length }} Slot</strong>
          </div>
          <div class="success-detail-row" v-if="isVoucherApplied">
            <span>Voucher Dipakai:</span>
            <strong>{{ voucherCode }} (Diskon {{ discountPercent }}%)</strong>
          </div>
          <div class="success-detail-row total-row-highlight">
            <span>Total Pembayaran:</span>
            <strong class="text-white">Rp {{ formatPrice(grandTotalPrice) }}</strong>
          </div>
        </div>
        
        <button class="btn-success-close" @click="goToHome">Kembali ke Beranda</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { bookingVenue, bookingSchedules, navigateTo } from '../store';
import { BookedSlot } from '../types';

// Form Fields & Expand State
const isFormExpanded = ref(true);
const fullName = ref('');
const email = ref('');
const phonePrefix = ref('+62');
const phoneNumber = ref('');

// Voucher States
const voucherCode = ref('');
const isVoucherApplied = ref(false);
const discountPercent = ref(0);
const voucherError = ref('');

// Timer countdown states (15 minutes = 900 seconds)
const timeLeft = ref(900);
const timerInterval = ref<any>(null);

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Errors object
const errors = ref({
  fullName: '',
  email: '',
  phoneNumber: ''
});

// Modal State
const showSuccessModal = ref(false);

// Formatting functions
const formatPrice = (val: number) => {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatWib = (timeStr: string) => {
  if (!timeStr.includes('WIB')) {
    return timeStr + ' WIB';
  }
  return timeStr;
};

// Clean non-numeric input for phone numbers
const cleanPhoneNumber = () => {
  phoneNumber.value = phoneNumber.value.replace(/\D/g, '');
};

// Subtotal & Totals calculations
const subtotalPrice = computed(() => {
  return bookingSchedules.value.reduce((sum, slot) => sum + slot.price, 0);
});

const adminFee = ref(8000);

const discountAmount = computed(() => {
  if (!isVoucherApplied.value) return 0;
  return Math.round((subtotalPrice.value * discountPercent.value) / 100);
});

const grandTotalPrice = computed(() => {
  return subtotalPrice.value + adminFee.value - discountAmount.value;
});

// Apply Voucher Code
const applyVoucherCode = () => {
  voucherError.value = '';
  const code = voucherCode.value.trim().toUpperCase();
  
  if (code === 'NEWHOPE10' || code === 'DISCOUNT10') {
    discountPercent.value = 10;
    isVoucherApplied.value = true;
  } else if (code === 'NEWHOPE20') {
    discountPercent.value = 20;
    isVoucherApplied.value = true;
  } else {
    voucherError.value = 'Kode voucher tidak valid.';
  }
};

const suggestVoucherCode = () => {
  voucherCode.value = 'NEWHOPE10';
  voucherError.value = '';
  applyVoucherCode();
};

const removeVoucher = () => {
  isVoucherApplied.value = false;
  discountPercent.value = 0;
  voucherCode.value = '';
  voucherError.value = '';
};

// Actions for schedules list
const removeScheduleSlot = (slotId: string) => {
  bookingSchedules.value = bookingSchedules.value.filter(s => s.id !== slotId);
};

const clearAllSchedules = () => {
  if (confirm('Apakah Anda yakin ingin menghapus semua jadwal terpilih?')) {
    bookingSchedules.value = [];
  }
};

// Back to catalog
const goToHome = () => {
  bookingSchedules.value = [];
  showSuccessModal.value = false;
  navigateTo('/');
};

// Validate Form Fields
const validateForm = () => {
  let isValid = true;
  errors.value = {
    fullName: '',
    email: '',
    phoneNumber: ''
  };

  // Full Name Validation
  if (!fullName.value.trim()) {
    errors.value.fullName = 'Nama lengkap wajib diisi.';
    isValid = false;
  }

  // Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    errors.value.email = 'Email wajib diisi.';
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = 'Format email tidak valid.';
    isValid = false;
  }

  // Phone Validation
  if (!phoneNumber.value.trim()) {
    errors.value.phoneNumber = 'Nomor telepon wajib diisi.';
    isValid = false;
  } else if (phoneNumber.value.length < 8) {
    errors.value.phoneNumber = 'Nomor telepon minimal 8 karakter.';
    isValid = false;
  }

  return isValid;
};

// Payment button handler
const handlePaymentSubmit = () => {
  if (validateForm()) {
    showSuccessModal.value = true;
  } else {
    // Scroll to the accordion card to show errors
    isFormExpanded.value = true;
    setTimeout(() => {
      document.querySelector('.accordion-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
};

// Lifecycle
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // If previewing directly, load beautiful mock data
  if (!bookingVenue.value) {
    bookingVenue.value = {
      id: 99,
      name: "CBN Hall Sanctuary",
      price: 1000000,
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop",
      organizer: {
        name: "CBN Hall",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
      }
    };
  }
  
  if (!bookingSchedules.value || bookingSchedules.value.length === 0) {
    bookingSchedules.value = [
      { id: "preview-1", dateStr: "17 Jul 2026", area: "Main Hall", timeRange: "09:00 - 10:00 WIB", price: 1000000, notes: "" },
      { id: "preview-2", dateStr: "17 Jul 2026", area: "Main Hall", timeRange: "10:00 - 11:00 WIB", price: 1000000, notes: "" },
      { id: "preview-3", dateStr: "17 Jul 2026", area: "Main Hall", timeRange: "11:00 - 12:00 WIB", price: 1000000, notes: "" },
      { id: "preview-4", dateStr: "17 Jul 2026", area: "Main Hall", timeRange: "12:00 - 13:00 WIB", price: 1000000, notes: "" }
    ];
  }

  // Start the countdown timer
  timerInterval.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval.value);
      alert('Waktu pengisian formulir pemesanan telah habis.');
      goToHome();
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<style scoped>
.booking-checkout-page {
  padding-top: 6rem;
  padding-bottom: 12rem; /* Give room for sticky footer */
  background-color: var(--bg-dark);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 2rem;
}

.title-display {
  font-family: var(--font-heading);
  font-size: 2.75rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.booking-checkout-container {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2.25rem;
  align-items: start;
}

/* Card Styling */
.checkout-card {
  background-color: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
}

/* Accordion Header Row */
.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.card-header-row-static {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.header-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff; /* Changed from blue to white */
}

.header-title-wrap h3 {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-transform: none;
  letter-spacing: 0;
}

.btn-toggle-accordion {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.chevron-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

/* Expandable Area styling */
.card-body-expandable {
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1.5rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form Fields */
.input-group {
  margin-bottom: 1.25rem;
}

.input-group label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.checkout-input {
  width: 100%;
  background-color: #0c0c0e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.checkout-input::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.checkout-input:focus {
  border-color: #ffffff; /* Changed focus border to white */
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.input-error {
  border-color: #ef4444 !important;
}

.error-msg {
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.35rem;
}

/* Phone combo field */
.phone-input-combo {
  display: flex;
  gap: 0.65rem;
}

.prefix-dropdown-wrapper {
  position: relative;
  width: 80px;
  flex-shrink: 0;
}

.phone-prefix-select {
  width: 100%;
  background-color: #0c0c0e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.85rem 1.5rem 0.85rem 0.85rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: #ffffff;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.phone-prefix-select:focus {
  border-color: #ffffff;
}

.select-chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-muted);
}

.phone-number-input {
  flex-grow: 1;
}

/* Schedules Card & Slots list */
.btn-clear-all {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  transition: color 0.2s;
}

.btn-clear-all:hover {
  color: #f87171;
  text-decoration: underline;
}

.checkout-slots-list {
  max-height: 480px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

/* Custom scrollbar for slot list */
.checkout-slots-list::-webkit-scrollbar {
  width: 6px;
}
.checkout-slots-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 3px;
}
.checkout-slots-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.slot-detail-item {
  position: relative;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.btn-remove-slot-item {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: var(--text-muted);
  transition: color 0.2s;
}

.btn-remove-slot-item:hover {
  color: #ef4444;
}

.slot-item-info-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.slot-white-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05); /* Changed from blue to transparent white */
  color: #ffffff; /* Changed from blue to white */
  flex-shrink: 0;
}

.slot-meta {
  display: flex;
  flex-direction: column;
}

.slot-title {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: #ffffff;
}

.slot-sub {
  font-family: var(--font-body);
  font-size: 0.825rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.slot-note-wrapper {
  margin-top: 0.5rem;
}

.slot-note-input {
  width: 100%;
  background-color: #08080a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s;
}

.slot-note-input::placeholder {
  color: var(--text-muted);
  opacity: 0.5;
}

.slot-note-input:focus {
  border-color: rgba(255, 255, 255, 0.3);
}

/* Venue overview card (Right column) */
.venue-overview-card {
  padding: 0;
  overflow: hidden;
}

.venue-image-wrap {
  position: relative;
  width: 100%;
  height: 180px;
}

.venue-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.venue-name-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 1.25rem 0.75rem;
  background: linear-gradient(to top, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0) 100%);
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
}

.venue-host-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background-color: #1a1a1e;
}

.host-avatar-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.host-avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.host-info {
  display: flex;
  flex-direction: column;
}

.host-label {
  font-size: 0.725rem;
  color: var(--text-muted);
}

.host-name {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}

/* Voucher Card */
.voucher-input-group {
  margin-top: 0.5rem;
}

.voucher-input-row {
  display: flex;
  gap: 0.75rem;
}

.voucher-text-input {
  flex-grow: 1;
}

.btn-apply-voucher {
  background-color: #ffffff;
  color: #000000;
  border-radius: 10px;
  padding: 0.85rem 1.25rem;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn-apply-voucher:hover:not(:disabled) {
  background-color: #e5e5e5;
}

.btn-apply-voucher:disabled {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
  cursor: not-allowed;
}

.voucher-success-text {
  font-size: 0.775rem;
  color: #22c55e;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-remove-voucher {
  color: #ef4444;
  font-weight: 600;
  text-decoration: underline;
  font-size: 0.775rem;
}

.voucher-error-text {
  font-size: 0.775rem;
  color: #ef4444;
  margin-top: 0.5rem;
}

.btn-add-voucher-dashed {
  width: 100%;
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.2); /* Changed from blue to thin white dashed */
  color: #ffffff; /* Changed from blue to white */
  padding: 0.8rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
  transition: all 0.2s;
}

.btn-add-voucher-dashed:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Order Summary Card */
.summary-slots-mini-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.summary-mini-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.mini-item-left {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
}

.mini-icon {
  color: #ffffff; /* Changed from blue to white */
  margin-top: 0.15rem;
}

.mini-details {
  display: flex;
  flex-direction: column;
}

.mini-title {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}

.mini-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.mini-price {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
}

.summary-divider-dashed {
  border: none;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  margin: 1.25rem 0;
}

.summary-fee-rows {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.fee-label {
  color: var(--text-muted);
}

.fee-value {
  color: #ffffff;
  font-weight: 500;
}

.discount-row {
  color: #22c55e;
}

.discount-row .fee-label,
.discount-row .fee-value {
  color: #22c55e;
}

.summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.total-value {
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff; /* Changed from blue to white */
}

.checkout-footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #18181b; /* Matches var(--bg-card) */
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  padding: 1.25rem 0; /* Taller bar */
  z-index: 999;
  box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.5);
}

.footer-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.countdown-capsule {
  display: inline-flex;
  align-items: center;
  background-color: #ef4444; /* Premium red background exactly like in the picture */
  color: #ffffff;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.78rem;
  gap: 0.75rem;
}

.countdown-time {
  font-variant-numeric: tabular-nums;
  font-size: 0.82rem;
}

.countdown-divider {
  opacity: 0.6;
}

.countdown-msg {
  font-weight: 600;
}

.btn-checkout-submit {
  background-color: #ffffff; /* White background matching style.css */
  color: #000000; /* Black text */
  border: 1px solid #ffffff;
  border-radius: 100px; /* Capsule shape */
  padding: 0.75rem 2.25rem;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);
}

.btn-checkout-submit:hover {
  background-color: #e5e5e5;
  border-color: #e5e5e5;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
}

/* Empty State styling */
.checkout-empty-state-card {
  background-color: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  max-width: 600px;
  margin: 2rem auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.empty-icon-wrap {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
}

.checkout-empty-state-card h3 {
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
  text-transform: none;
  letter-spacing: 0;
}

.checkout-empty-state-card p {
  color: var(--text-muted);
  font-size: 0.82rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.btn-back-home {
  background-color: #ffffff;
  color: #000000;
  padding: 0.85rem 2rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-back-home:hover {
  background-color: #e5e5e5;
}

/* Modal Overlay & Card */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(9, 9, 11, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.success-modal-card {
  background-color: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.success-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  margin: 0 auto 1.5rem;
}

.success-modal-card h2 {
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
  text-transform: none;
  letter-spacing: 0;
}

.success-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.success-details-box {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  text-align: left;
}

.success-detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.65rem;
}

.success-detail-row:last-child {
  margin-bottom: 0;
}

.success-detail-row span {
  color: var(--text-muted);
}

.success-detail-row strong {
  color: #ffffff;
  font-weight: 600;
}

.total-row-highlight {
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 0.65rem;
  margin-top: 0.65rem;
}

.total-row-highlight strong {
  color: #ffffff !important; /* Changed from blue to white */
  font-size: 1.05rem;
  font-weight: 800;
}

.btn-success-close {
  background-color: #ffffff;
  color: #000000;
  width: 100%;
  padding: 0.9rem;
  border-radius: 12px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-success-close:hover {
  background-color: #e5e5e5;
}

/* Helper text class override */
.text-white {
  color: #ffffff !important;
}

/* Accordion collapsed/expanded states behavior override */
.card-collapsed .card-body-expandable {
  display: none;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .booking-checkout-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .booking-checkout-page {
    padding-top: 5rem;
    padding-bottom: 12rem;
  }
  
  .title-display {
    font-size: 2.25rem;
  }
  
  .checkout-card {
    padding: 1.25rem;
  }
  
  .success-modal-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 600px) {
  .checkout-footer-bar {
    padding: 0.95rem 0; /* Taller on mobile too */
  }
  
  .footer-bar-content {
    padding: 0 4.5%;
    gap: 0.75rem;
  }
  
  .countdown-capsule {
    padding: 0.45rem 0.85rem; font-size: 0.75rem; gap: 0.5rem; border-radius: 5px;
  }
  
  .countdown-msg {
    display: none; /* Hide label text on narrow viewports to preserve space */
  }
  
  .btn-checkout-submit {
    padding: 0.55rem 1.25rem; font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .phone-input-combo {
    flex-direction: row;
  }
  
  .slot-item-info-row {
    flex-direction: row;
    align-items: center;
  }
}
</style>
