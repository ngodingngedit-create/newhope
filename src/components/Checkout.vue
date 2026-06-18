<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { merchItems, navigateTo, increaseQty, decreaseQty, removeCartItem } from '../store';

const cartItems = computed(() => merchItems.value.filter(item => item.quantity > 0));

// Step Visibility States
const isAddressComplete = ref(false);

// Address Sub-steps: 1 = Cari, 2 = Pinpoint, 3 = Detail
const addressSubStep = ref(1);

// Form States (Data Diri)
const namePemesan = ref('');
const emailPemesan = ref('');
const phonePemesanPrefix = ref('+62');
const phonePemesanNumber = ref('');

// Full phone calculated for API
const phonePemesan = computed(() => {
  return `${phonePemesanPrefix.value}${phonePemesanNumber.value}`;
});

// Recipient Form States (Alamat Pengiriman)
const namePenerima = ref('');
const phonePenerimaPrefix = ref('+62');
const phonePenerimaNumber = ref('');
const phonePenerima = computed(() => {
  return `${phonePenerimaPrefix.value}${phonePenerimaNumber.value}`;
});

// Address Step States
const searchLocationQuery = ref('');
const showSearchSuggestions = ref(false);
const mockSuggestions = [
  { name: 'Bundaran HI, Menteng, Jakarta Pusat', lat: -6.19492, lng: 106.82302 },
  { name: 'Grand Indonesia Mall, Kebon Melati, Jakarta Pusat', lat: -6.1952, lng: 106.8202 },
  { name: 'Hotel Indonesia Kempinski, Menteng, Jakarta Pusat', lat: -6.1960, lng: 106.8235 },
  { name: 'Plaza Indonesia, Gondangdia, Jakarta Pusat', lat: -6.1925, lng: 106.8218 },
  { name: 'Monumen Nasional (Monas), Gambir, Jakarta Pusat', lat: -6.1754, lng: 106.8272 },
];

const filteredSuggestions = computed(() => {
  if (!searchLocationQuery.value) return [];
  return mockSuggestions.filter(item => 
    item.name.toLowerCase().includes(searchLocationQuery.value.toLowerCase())
  );
});

// Selected Pinpoint Location
const resolvedAddressName = ref('');
const selectedLat = ref(-6.19492);
const selectedLng = ref(106.82302);

// Step 3 Detail Fields
const addressLabel = ref('');
const addressProvince = ref('');
const addressCity = ref('');
const addressDistrict = ref('');
const addressPostalCode = ref('');
const addressDetail = ref('');

// Courier States
const selectedCourierCode = ref('JNE');
const selectedCourierService = ref('REG');
const expandedCourierCode = ref('JNE');

const couriersData = ref([
  {
    code: 'Sicepat',
    name: 'SiCepat',
    services: [
      { code: 'REG', name: 'Reguler', desc: '1 - 2 hari', cost: 12000 },
      { code: 'BEST', name: 'Besok Sampai Tujuan', desc: '1 hari', cost: 18000 }
    ]
  },
  {
    code: 'Pos',
    name: 'Pos Indonesia',
    services: [
      { code: 'REG', name: 'Reguler', desc: '2 - 4 hari', cost: 12000 },
      { code: 'EXPRESS', name: 'Pos Express', desc: '1 - 2 hari', cost: 20000 }
    ]
  },
  {
    code: 'JNE',
    name: 'JNE',
    services: [
      { code: 'REG', name: 'Reguler', desc: '1 - 2 hari', cost: 14000 },
      { code: 'YES', name: 'Yakin Esok Sampai', desc: '1 hari', cost: 25000 }
    ]
  },
  {
    code: 'J&T',
    name: 'J&T',
    services: [
      { code: 'EZ', name: 'Reguler EZ', desc: '1 - 3 hari', cost: 14000 },
      { code: 'SUPER', name: 'J&T Super', desc: '1 hari', cost: 24000 }
    ]
  },
  {
    code: 'AnterAja',
    name: 'AnterAja',
    services: [
      { code: 'REG', name: 'Reguler', desc: '2 - 3 hari', cost: 15500 },
      { code: 'NEXTDAY', name: 'Next Day', desc: '1 hari', cost: 22000 }
    ]
  }
]);

const selectCourier = (courierCode: string) => {
  selectedCourierCode.value = courierCode;
  expandedCourierCode.value = courierCode;
  
  const courier = couriersData.value.find(c => c.code === courierCode);
  if (courier && courier.services.length > 0) {
    selectedCourierService.value = courier.services[0].code;
  }
};

const getMinCost = (courier: any) => {
  if (!courier.services || courier.services.length === 0) return 0;
  return Math.min(...courier.services.map((s: any) => s.cost));
};

const selectedCourier = computed(() => {
  const courier = couriersData.value.find(c => c.code === selectedCourierCode.value);
  if (!courier) {
    return { code: 'JNE', name: 'JNE', service: 'REG', desc: 'Reguler (1 - 2 hari)', cost: 14000 };
  }
  const service = courier.services.find(s => s.code === selectedCourierService.value) || courier.services[0];
  return {
    code: courier.code,
    name: courier.name,
    service: service.code,
    desc: `${service.name} (${service.desc})`,
    cost: service.cost
  };
});

// Payment Method States
const paymentMethod = ref('Qris');

const paymentMethods = [
  { id: 'Qris', name: 'QRIS (Gopay, OVO, Dana)', icon: '📱', desc: 'Instan & Tanpa Biaya Tambahan' },
  { id: 'BCA_VA', name: 'BCA Virtual Account', icon: '🏦', desc: 'Verifikasi otomatis 24 jam' },
  { id: 'Mandiri_VA', name: 'Mandiri Virtual Account', icon: '💳', desc: 'Verifikasi otomatis 24 jam' },
];

// Price Calculations
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const adminFee = ref(5000); // Realigned to 5,000 as per mockup

const grandTotal = computed(() => {
  return totalPrice.value + adminFee.value + (isAddressComplete.value ? selectedCourier.value.cost : 0);
});

// UI & Form Validation States
const errors = ref<{ [key: string]: string }>({});
const isSubmitting = ref(false);
const isSuccess = ref(false);
const checkoutPayload = ref<any>(null);

// Leaflet Map instance
let mapInstance: any = null;
let mapMarker: any = null;
const mapLoading = ref(false);

// Dynamic loading of Leaflet.js
const initLeafletMap = async () => {
  mapLoading.value = true;
  
  // Dynamic CDN Injector
  const loadLeafletResources = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).L) {
        resolve();
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Leaflet load failed'));
      document.head.appendChild(script);
    });
  };

  try {
    await loadLeafletResources();
    const L = (window as any).L;

    await nextTick();
    const mapDiv = document.getElementById('map-leaflet');
    if (!mapDiv) return;

    // Destroy existing instance if any
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }

    // Create Map centered at coordinates
    mapInstance = L.map('map-leaflet', {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([selectedLat.value, selectedLng.value], 16);

    // Add Tiles (Google Maps)
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '© Google'
    }).addTo(mapInstance);

    // Custom SVG Pinpoint Marker
    const pinSvg = `<svg viewBox="0 0 24 24" width="38" height="38" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4))">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ff3d00"/>
    </svg>`;
    
    const customIcon = L.divIcon({
      html: pinSvg,
      className: 'custom-map-pin',
      iconSize: [38, 38],
      iconAnchor: [19, 38]
    });

    // Create draggable marker
    mapMarker = L.marker([selectedLat.value, selectedLng.value], {
      icon: customIcon,
      draggable: true
    }).addTo(mapInstance);

    // Reverse-geocode pinpoint simulation
    const updateAddressFromCoords = (lat: number, lng: number) => {
      // Find closest mock or generate string
      const closest = mockSuggestions.find(
        m => Math.abs(m.lat - lat) < 0.002 && Math.abs(m.lng - lng) < 0.002
      );
      if (closest) {
        resolvedAddressName.value = closest.name;
      } else {
        resolvedAddressName.value = `Jl. M.H. Thamrin, Menteng, Jakarta Pusat (Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)})`;
      }
    };

    updateAddressFromCoords(selectedLat.value, selectedLng.value);

    // Drag Listener
    mapMarker.on('dragend', () => {
      const position = mapMarker.getLatLng();
      selectedLat.value = position.lat;
      selectedLng.value = position.lng;
      updateAddressFromCoords(position.lat, position.lng);
    });

    // Map Click Listener
    mapInstance.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      selectedLat.value = lat;
      selectedLng.value = lng;
      mapMarker.setLatLng([lat, lng]);
      updateAddressFromCoords(lat, lng);
    });

  } catch (e) {
    console.error('Failed to load map:', e);
    // Fallback static address string
    resolvedAddressName.value = 'Bundaran HI, Menteng, Jakarta Pusat';
  } finally {
    mapLoading.value = false;
  }
};

// Autocomplete click
const selectSuggestion = (sug: any) => {
  searchLocationQuery.value = sug.name;
  resolvedAddressName.value = sug.name;
  selectedLat.value = sug.lat;
  selectedLng.value = sug.lng;
  showSearchSuggestions.value = false;
  
  // Go to step 2 directly
  goToStep(2);
};

// Navigation Steps
const goToStep = (step: number) => {
  addressSubStep.value = step;
  if (step === 2) {
    // If transitioning to map, initialize it
    setTimeout(() => {
      initLeafletMap();
    }, 100);
  }
};

// Form Validations
const validateDataDiri = () => {
  const newErrors: { [key: string]: string } = {};

  if (!namePemesan.value.trim()) newErrors.emailName = 'Nama lengkap wajib diisi';
  
  if (!emailPemesan.value.trim()) {
    newErrors.email = 'Email wajib diisi';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPemesan.value)) {
    newErrors.email = 'Format email tidak valid';
  }

  if (!phonePemesanNumber.value.trim()) {
    newErrors.emailPhone = 'Nomor telepon wajib diisi';
  } else if (!/^[0-9]{8,13}$/.test(phonePemesanNumber.value.trim())) {
    newErrors.emailPhone = 'Nomor telepon tidak valid (8-13 digit)';
  }

  errors.value = { ...errors.value, ...newErrors };
  return Object.keys(newErrors).length === 0;
};

const validateAddressDetails = () => {
  const newErrors: { [key: string]: string } = {};

  if (!namePenerima.value.trim()) newErrors.name = 'Nama penerima wajib diisi';
  
  if (!phonePenerimaNumber.value.trim()) {
    newErrors.phone = 'Nomor telepon wajib diisi';
  } else if (!/^[0-9]{8,13}$/.test(phonePenerimaNumber.value.trim())) {
    newErrors.phone = 'Nomor telepon tidak valid (8-13 digit)';
  }

  if (!addressProvince.value.trim()) newErrors.province = 'Provinsi wajib diisi';
  if (!addressCity.value.trim()) newErrors.city = 'Kota/Kabupaten wajib diisi';
  if (!addressPostalCode.value.trim()) {
    newErrors.postalCode = 'Kode pos wajib diisi';
  } else if (!/^[0-9]{5}$/.test(addressPostalCode.value.trim())) {
    newErrors.postalCode = 'Kode pos harus 5 digit';
  }
  if (!addressDetail.value.trim()) newErrors.detail = 'Alamat lengkap wajib diisi';

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// Submit address to open Courier/Payment steps
const completeAddressDetails = () => {
  if (!validateAddressDetails()) {
    return;
  }

  isAddressComplete.value = true;

  // Scroll to courier section smoothly
  nextTick(() => {
    const courierSection = document.getElementById('step-courier');
    if (courierSection) {
      courierSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

const handleCheckout = () => {
  const isDataDiriValid = validateDataDiri();
  if (!isDataDiriValid) {
    const errorKey = Object.keys(errors.value)[0];
    const element = document.getElementById(`input-data-${errorKey}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element?.focus();
    return;
  }

  if (!isAddressComplete.value) {
    alert('Harap selesaikan pengisian alamat pengiriman terlebih dahulu.');
    return;
  }

  isSubmitting.value = true;

  const productsPayload = cartItems.value.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    category: item.category,
  }));

  checkoutPayload.value = {
    product: productsPayload,
    name_pemesan: namePemesan.value,
    email_pemesan: emailPemesan.value,
    phone_pemesan: phonePemesan.value,
    address: {
      province: addressProvince.value,
      city: addressCity.value,
      district: addressDistrict.value,
      postal_code: addressPostalCode.value,
      detail: addressDetail.value,
      label: addressLabel.value,
      recipient_name: namePenerima.value,
      recipient_phone: phonePenerima.value,
      coordinates: {
        latitude: selectedLat.value,
        longitude: selectedLng.value
      }
    },
    courier: {
      code: selectedCourier.value.code,
      service: selectedCourier.value.service,
      cost: selectedCourier.value.cost
    },
    payment_method: paymentMethod.value,
    total_price: totalPrice.value,
    admin_fee: adminFee.value,
    grandtotal: grandTotal.value
  };

  setTimeout(() => {
    isSubmitting.value = false;
    isSuccess.value = true;
  }, 1500);
};

// Confirm Pinpoint map to details
const usePinpointLocation = () => {
  addressDetail.value = resolvedAddressName.value;
  // Auto-fill province & city based on address search/coordinates
  if (resolvedAddressName.value.includes('Jakarta Pusat')) {
    addressProvince.value = 'DKI Jakarta';
    addressCity.value = 'Jakarta Pusat';
    addressDistrict.value = 'Menteng';
    addressPostalCode.value = '10310';
  } else if (resolvedAddressName.value.includes('Monas')) {
    addressProvince.value = 'DKI Jakarta';
    addressCity.value = 'Jakarta Pusat';
    addressDistrict.value = 'Gambir';
    addressPostalCode.value = '10110';
  }
  goToStep(3);
};

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const goBackToMerch = () => {
  navigateTo('/merchandise');
};

const resetCheckout = () => {
  merchItems.value.forEach(item => {
    item.quantity = 0;
  });
  isSuccess.value = false;
  navigateTo('/merchandise');
};

// Copy VA Number Helper
const copyStatus = ref(false);
const copyVAToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  copyStatus.value = true;
  setTimeout(() => {
    copyStatus.value = false;
  }, 2000);
};

// 15-Minute Countdown Timer
const totalTime = 15 * 60; // 15 mins in seconds
const timeRemaining = ref(totalTime);
let timerInterval: any = null;

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timerInterval);
      alert("Sesi checkout Anda telah berakhir. Silakan ulangi pembelian.");
      resetCheckout();
    }
  }, 1000);
};

const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const circleOffset = computed(() => {
  const circumference = 2 * Math.PI * 12; // ~75.4
  const progress = timeRemaining.value / totalTime;
  return circumference * (1 - progress);
});

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' });
  startTimer();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="checkout-page">
    <div class="container checkout-container">
      
      <!-- HEADER ROW -->
      <div class="checkout-header-section">
        <h1 class="checkout-title">CHECKOUT SEKARANG</h1>
      </div>

      <!-- EMPTY STATE -->
      <div v-if="cartItems.length === 0 && !isSuccess" class="checkout-empty-state">
        <div class="empty-icon-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <h2>Keranjang Anda Masih Kosong</h2>
        <p>Anda belum menambahkan merchandise apa pun ke keranjang belanja Anda.</p>
        <button class="btn-shop" @click="goBackToMerch">BELANJA SEKARANG</button>
      </div>

      <!-- MAIN LAYOUT -->
      <div v-else-if="!isSuccess" class="checkout-grid">
        
        <!-- COLUMN LEFT: FORM FIELDS -->
        <div class="checkout-form-col">
          
          <!-- STEP 1: DATA DIRI -->
          <div class="checkout-card">
            <div class="card-header">
              <span class="step-num">01</span>
              <h3>Data Diri</h3>
            </div>
            
            <div class="form-group-grid">
              <div class="form-field full">
                <label for="input-data-emailName">Nama Lengkap</label>
                <input 
                  id="input-data-emailName"
                  v-model="namePemesan"
                  type="text" 
                  placeholder="Nama Lengkap Anda"
                  :class="{ 'has-error': errors.emailName }"
                />
                <span v-if="errors.emailName" class="error-msg">{{ errors.emailName }}</span>
              </div>

              <div class="form-field half">
                <label for="input-email">Email</label>
                <input 
                  id="input-email"
                  v-model="emailPemesan"
                  type="email" 
                  placeholder="contoh@domain.com"
                  :class="{ 'has-error': errors.email }"
                />
                <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
              </div>

              <div class="form-field half">
                <label for="input-data-emailPhone">Nomor Telepon</label>
                <div class="phone-input-combo">
                  <select v-model="phonePemesanPrefix" class="phone-prefix-select">
                    <option value="+62">+62</option>
                    <option value="+1">+1</option>
                  </select>
                  <input 
                    id="input-data-emailPhone"
                    v-model="phonePemesanNumber"
                    type="tel" 
                    placeholder="812xxxxx"
                    :class="{ 'has-error': errors.emailPhone }"
                  />
                </div>
                <span v-if="errors.emailPhone" class="error-msg">{{ errors.emailPhone }}</span>
              </div>
            </div>
          </div>

          <!-- STEP 2: ALAMAT PENGIRIMAN -->
          <div class="checkout-card">
            <div class="card-header border-none">
              <div class="header-main-row">
                <span class="step-num">02</span>
                <h3>Alamat Pengiriman</h3>
              </div>
            </div>

            <!-- PROGRESS BAR SUBSTEPS -->
            <div class="step-progress-wizard">
              <div class="wizard-line">
                <div class="wizard-line-fill" :style="{ width: addressSubStep === 1 ? '0%' : addressSubStep === 2 ? '50%' : '100%' }"></div>
              </div>
              <div class="wizard-steps-row">
                <div class="wizard-step" :class="{ active: addressSubStep >= 1 }">
                  <div class="step-circle" @click="goToStep(1)">1</div>
                  <span class="step-label">Cari</span>
                </div>
                <div class="wizard-step" :class="{ active: addressSubStep >= 2 }">
                  <div class="step-circle" @click="searchLocationQuery ? goToStep(2) : null">2</div>
                  <span class="step-label">Pinpoint</span>
                </div>
                <div class="wizard-step" :class="{ active: addressSubStep >= 3 }">
                  <div class="step-circle">3</div>
                  <span class="step-label">Detail</span>
                </div>
              </div>
            </div>
            
            <!-- SUB-STEP 1: CARI LOKASI -->
            <div v-if="addressSubStep === 1" class="substep-container">
              <div class="form-field full location-search-field">
                <label for="input-search-location">Cari Lokasi</label>
                <div class="search-input-wrapper">
                  <input 
                    id="input-search-location"
                    v-model="searchLocationQuery"
                    type="text" 
                    placeholder="Ketik nama jalan, gedung, atau area..."
                    @focus="showSearchSuggestions = true"
                  />
                  <!-- Magnifier Icon -->
                  <svg class="search-field-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>

                <!-- Autocomplete suggestions -->
                <div v-if="showSearchSuggestions && filteredSuggestions.length > 0" class="search-suggestions-dropdown">
                  <div 
                    v-for="(sug, idx) in filteredSuggestions" 
                    :key="idx" 
                    class="suggestion-item"
                    @click="selectSuggestion(sug)"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="sug-icon">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                    <span>{{ sug.name }}</span>
                  </div>
                </div>
              </div>
              
              <button 
                class="btn-mocha-primary mt-2" 
                :disabled="!searchLocationQuery.trim()" 
                @click="goToStep(2)"
              >
                Lanjut Pinpoint Peta
              </button>
            </div>

            <!-- SUB-STEP 2: MAP PINPOINT -->
            <div v-if="addressSubStep === 2" class="substep-container">
              <h4 class="substep-title">Pinpoint Lokasi Anda</h4>
              
              <div class="map-outer-wrapper">
                <div id="map-leaflet" class="map-view-container"></div>
                <div v-if="mapLoading" class="map-loader-overlay">
                  <span class="map-spinner"></span>
                </div>
              </div>

              <!-- Map instructions bar -->
              <div class="map-resolved-address">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                <span>{{ resolvedAddressName || 'Memuat titik lokasi...' }}</span>
              </div>

              <!-- Action buttons under map -->
              <div class="map-actions-row">
                <button class="btn-mocha-text" @click="goToStep(1)">Kembali</button>
                <button class="btn-mocha-primary" @click="usePinpointLocation">Gunakan Lokasi Ini</button>
              </div>
            </div>

            <!-- SUB-STEP 3: FORM DETAIL -->
            <div v-if="addressSubStep === 3" class="substep-container">
              <div class="form-group-grid">
                <div class="form-field half">
                  <label for="input-label">Label Alamat</label>
                  <input 
                    id="input-label"
                    v-model="addressLabel"
                    type="text" 
                    placeholder="Cth: Rumah, Kantor, Kos"
                  />
                </div>

                <div class="form-field half">
                  <label for="input-name">Nama Penerima</label>
                  <input 
                    id="input-name"
                    v-model="namePenerima"
                    type="text" 
                    placeholder="Nama Lengkap Penerima"
                    :class="{ 'has-error': errors.name }"
                  />
                  <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                </div>

                <div class="form-field full">
                  <label for="input-phone">Nomor Telepon</label>
                  <div class="phone-input-combo">
                    <select v-model="phonePenerimaPrefix" class="phone-prefix-select">
                      <option value="+62">+62 (ID)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+65">+65 (SG)</option>
                    </select>
                    <input 
                      id="input-phone"
                      v-model="phonePenerimaNumber"
                      type="tel" 
                      placeholder="812xxxxx"
                      :class="{ 'has-error': errors.phone }"
                    />
                  </div>
                  <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
                </div>

                <div class="form-field half">
                  <label for="input-province">Provinsi</label>
                  <select 
                    id="input-province"
                    v-model="addressProvince"
                    :class="{ 'has-error': errors.province }"
                  >
                    <option value="">Pilih Provinsi</option>
                    <option value="DKI Jakarta">DKI Jakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                    <option value="Banten">Banten</option>
                  </select>
                  <span v-if="errors.province" class="error-msg">{{ errors.province }}</span>
                </div>

                <div class="form-field half">
                  <label for="input-city">Kota / Kabupaten</label>
                  <select 
                    id="input-city"
                    v-model="addressCity"
                    :class="{ 'has-error': errors.city }"
                  >
                    <option value="">Pilih Kota / Kabupaten</option>
                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                    <option value="Jakarta Barat">Jakarta Barat</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Tangerang">Tangerang</option>
                  </select>
                  <span v-if="errors.city" class="error-msg">{{ errors.city }}</span>
                </div>

                <div class="form-field full">
                  <label for="input-postalCode">Kode Pos</label>
                  <input 
                    id="input-postalCode"
                    v-model="addressPostalCode"
                    type="text" 
                    placeholder="Masukkan 5 digit kode pos"
                    maxlength="5"
                    :class="{ 'has-error': errors.postalCode }"
                  />
                  <span v-if="errors.postalCode" class="error-msg">{{ errors.postalCode }}</span>
                </div>

                <div class="form-field full">
                  <label for="input-detail">Alamat Lengkap</label>
                  <textarea 
                    id="input-detail"
                    v-model="addressDetail"
                    rows="3"
                    placeholder="Masukkan alamat lengkap pengiriman"
                    :class="{ 'has-error': errors.detail }"
                  ></textarea>
                  <span v-if="errors.detail" class="error-msg">{{ errors.detail }}</span>
                </div>
              </div>

              <!-- Actions inside Step 3 detail -->
              <div class="detail-actions-row">
                <button class="btn-mocha-text" @click="goToStep(2)">Ubah Pinpoint</button>
                <button class="btn-mocha-primary" @click="completeAddressDetails">
                  Pilih Metode Pengiriman
                </button>
              </div>
            </div>
          </div>

          <!-- DYNAMIC REVEAL: STEP 3 (COURIER) & STEP 4 (PAYMENT) -->
          <transition name="expand">
            <div v-if="isAddressComplete">
              
              <!-- STEP 3: METODE PENGIRIMAN -->
              <div id="step-courier" class="checkout-card">
                <div class="card-header border-none">
                  <div class="header-main-row flex-between width-100">
                    <div class="header-left-part">
                      <span class="step-num">03</span>
                      <h3>Metode Pengiriman</h3>
                    </div>
                    <button class="step-accordion-toggle" aria-label="Toggle section">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="18 15 12 9 6 15"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Kirim Melalui Kurir Radio Box -->
                <div class="shipping-type-container">
                  <div class="shipping-type-box active">
                    <div class="radio-indicator active">
                      <div class="inner-dot"></div>
                    </div>
                    <span class="shipping-type-text">Kirim Melalui Kurir</span>
                  </div>
                </div>

                <!-- Accordion Courier Options Stack -->
                <div class="couriers-accordion-stack">
                  <div 
                    v-for="courier in couriersData" 
                    :key="courier.code"
                    class="courier-accordion-item"
                    :class="{ active: selectedCourierCode === courier.code, expanded: expandedCourierCode === courier.code }"
                  >
                    <!-- Accordion Header -->
                    <div class="courier-accordion-header" @click="selectCourier(courier.code)">
                      <div class="header-left">
                        <div class="radio-indicator" :class="{ active: selectedCourierCode === courier.code }">
                          <div class="inner-dot"></div>
                        </div>
                        <span class="courier-brand-name">{{ courier.name }}</span>
                      </div>
                      <div class="header-right">
                        <span class="courier-starting-price">Mulai dari Rp {{ formatPrice(getMinCost(courier)) }}</span>
                        <span class="accordion-chevron">
                          <svg v-if="expandedCourierCode === courier.code" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="18 15 12 9 6 15"/>
                          </svg>
                          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <!-- Accordion Body (Services list) -->
                    <transition name="accordion-slide">
                      <div v-show="expandedCourierCode === courier.code" class="courier-accordion-body">
                        <div class="services-title">LAYANAN PENGIRIMAN</div>
                        <div class="services-list">
                          <div 
                            v-for="service in courier.services" 
                            :key="service.code"
                            class="service-option-card"
                            :class="{ active: selectedCourierCode === courier.code && selectedCourierService === service.code }"
                            @click.stop="selectedCourierService = service.code"
                          >
                            <div class="service-left">
                              <div class="radio-indicator" :class="{ active: selectedCourierCode === courier.code && selectedCourierService === service.code }">
                                <div class="inner-dot"></div>
                              </div>
                              <div class="service-info-details">
                                <span class="service-name">{{ service.name }}</span>
                                <span class="service-est">{{ service.desc }}</span>
                              </div>
                            </div>
                            <div class="service-right">
                              <span class="service-cost">Rp {{ formatPrice(service.cost) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>

              

            </div>
          </transition>
        </div>

        <!-- COLUMN RIGHT: ORDER SUMMARY -->
        <div class="checkout-summary-col">
          <div class="summary-floating-card">
            <h3 class="summary-card-title">Ringkasan Pesanan</h3>
            
            <!-- Products Card with Dashed Border -->
            <div class="summary-products-container">
              <div v-for="item in cartItems" :key="item.id" class="summary-product-card-mock">
                <div class="prod-card-top">
                  <div class="prod-card-img-box">
                    <img :src="item.image" :alt="item.name" />
                  </div>
                  
                  <div class="prod-card-info-box">
                    <h4 class="prod-card-title">{{ item.name }}</h4>
                    <span class="prod-card-variant">Varian: {{ item.category === 'APPAREL' ? 'S' : 'Default' }}</span>
                    
                    <div class="prod-card-shipping-origin">
                      <span class="shipping-label">Dikirim dari :</span>
                      <div class="shipping-location">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" class="origin-pin-icon">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span><b>TOKOMOCCA</b> , DKI Jakarta</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="prod-card-right-controls">
                    <span class="prod-card-unit-price">Rp {{ formatPrice(item.price) }}</span>
                    
                    <div class="prod-card-qty-row">
                      <button class="qty-control-circle-btn" @click="decreaseQty(item)" aria-label="Decrease quantity">
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      
                      <span class="qty-control-number">{{ item.quantity }}</span>
                      
                      <button class="qty-control-circle-btn" @click="increaseQty(item)" aria-label="Increase quantity">
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      
                      <button class="qty-control-trash-btn" @click="removeCartItem(item)" aria-label="Delete item">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Optional Note input -->
                <div class="prod-card-note-box">
                  <input type="text" placeholder="Tambah catatan (opsional)" class="prod-card-note-input" />
                </div>
              </div>
            </div>

            <!-- Voucher Section -->
            <div class="summary-voucher-card">
              <span class="voucher-label">Voucher</span>
              <div class="voucher-input-row">
                <input type="text" placeholder="Masukkan kode voucher" class="voucher-text-input" />
                <button class="btn-voucher-apply">Gunakan</button>
              </div>
            </div>

            <!-- Cost Breakdown -->
            <div class="price-breakdown-section">
              <div class="breakdown-row">
                <span>Subtotal ({{ cartItems.reduce((t, i) => t + i.quantity, 0) }} produk)</span>
                <span>Rp {{ formatPrice(totalPrice) }}</span>
              </div>
              <div class="breakdown-row">
                <span>Biaya Layanan</span>
                <span>Rp {{ formatPrice(adminFee) }}</span>
              </div>
              <div class="breakdown-divider"></div>
              <div class="breakdown-row grand-total-row">
                <span>Total Pembayaran</span>
                <span class="grand-price">Rp {{ formatPrice(grandTotal) }}</span>
              </div>
            </div>

            <!-- Secure Notice Box -->
            <div class="summary-secure-banner">
              <div class="secure-banner-icon-col">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div class="secure-banner-text-col">
                <h5 class="secure-banner-title">Pembayaran aman & terenkripsi</h5>
                <p class="secure-banner-desc">Informasi pembayaran Anda dijaga kerahasiaannya dengan enkripsi tingkat tinggi.</p>
              </div>
            </div>

            <!-- Disclaimer notice text -->
            <p class="summary-disclaimer-text">
              Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan dan Kebijakan Privasi kami.
            </p>
          </div>
        </div>

      </div>

      <!-- SUCCESS / INVOICE SCREEN -->
      <div v-else class="success-screen-wrapper">
        <div class="success-card">
          <div class="success-badge">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#00e676" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          
          <h2 class="success-title">Pemesanan Berhasil!</h2>
          <p class="success-subtitle">Menunggu Pembayaran. Silakan selesaikan transaksi Anda sebelum waktu habis.</p>

          <!-- Countdown -->
          <div class="timer-box">
            <span class="timer-label">BATAS WAKTU PEMBAYARAN</span>
            <span class="timer-countdown">23 : 59 : 59</span>
          </div>

          <!-- Dynamic payment info based on choice -->
          <div class="payment-instructions-box">
            <!-- QRIS INSTRUCTIONS -->
            <div v-if="checkoutPayload.payment_method === 'Qris'" class="qris-instruction">
              <p class="instr-title">Pindai Kode QRIS di bawah ini:</p>
              
              <div class="mock-qrcode-container">
                <div class="qr-corners"></div>
                <div class="qr-logo-overlay">K</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=KOLEKTIX_NEWHOPE_CHECKOUT_SUCCESS" alt="QRIS Code" class="qr-code-img" />
              </div>
              
              <div class="payment-steps">
                <ol>
                  <li>Buka aplikasi e-wallet pilihan Anda (Gopay, OVO, Dana, LinkAja, dll).</li>
                  <li>Pilih opsi <b>Pindai/Scan QR</b>.</li>
                  <li>Arahkan kamera ke Kode QR di atas.</li>
                  <li>Periksa jumlah pembayaran <b>Rp {{ formatPrice(checkoutPayload.grandtotal) }}</b>.</li>
                  <li>Masukkan PIN Anda untuk konfirmasi pembayaran.</li>
                </ol>
              </div>
            </div>

            <!-- VIRTUAL ACCOUNT BCA INSTRUCTIONS -->
            <div v-else-if="checkoutPayload.payment_method === 'BCA_VA'" class="va-instruction">
              <p class="instr-title">Virtual Account BCA</p>
              <div class="va-number-box">
                <span class="va-label">NOMOR VIRTUAL ACCOUNT</span>
                <div class="va-row">
                  <span class="va-number">8801202606191722</span>
                  <button class="btn-copy-va" @click="copyVAToClipboard('8801202606191722')">
                    {{ copyStatus ? 'Tersalin' : 'Salin' }}
                  </button>
                </div>
              </div>
              
              <div class="payment-steps">
                <ol>
                  <li>Buka M-Banking BCA atau kunjungi ATM BCA terdekat.</li>
                  <li>Pilih menu <b>Transaksi Lainnya</b> > <b>Transfer</b> > <b>Ke Rekening BCA Virtual Account</b>.</li>
                  <li>Masukkan Kode VA di atas: <b>8801202606191722</b>.</li>
                  <li>Pastikan nominal transfer sesuai: <b>Rp {{ formatPrice(checkoutPayload.grandtotal) }}</b>.</li>
                  <li>Selesaikan transaksi.</li>
                </ol>
              </div>
            </div>

            <!-- VIRTUAL ACCOUNT MANDIRI INSTRUCTIONS -->
            <div v-else class="va-instruction">
              <p class="instr-title">Virtual Account Mandiri</p>
              <div class="va-number-box">
                <span class="va-label">NOMOR VIRTUAL ACCOUNT</span>
                <div class="va-row">
                  <span class="va-number">8902202606193391</span>
                  <button class="btn-copy-va" @click="copyVAToClipboard('8902202606193391')">
                    {{ copyStatus ? 'Tersalin' : 'Salin' }}
                  </button>
                </div>
              </div>
              
              <div class="payment-steps">
                <ol>
                  <li>Buka aplikasi Livin' by Mandiri atau kunjungi ATM Mandiri.</li>
                  <li>Pilih menu <b>Bayar</b> > <b>Multipayment</b>.</li>
                  <li>Pilih penyedia jasa <b>Kolektix</b> atau masukkan kode institusi.</li>
                  <li>Masukkan Nomor Virtual Account di atas: <b>8902202606193391</b>.</li>
                  <li>Pastikan nominal transfer sesuai: <b>Rp {{ formatPrice(checkoutPayload.grandtotal) }}</b>.</li>
                  <li>Selesaikan transaksi.</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- Total Bill summary on confirmation screen -->
          <div class="bill-details-invoice">
            <div class="inv-row">
              <span>Nama Penerima</span>
              <span class="inv-val">{{ checkoutPayload.name_pemesan }}</span>
            </div>
            <div class="inv-row">
              <span>Alamat Pengiriman</span>
              <span class="inv-val">{{ checkoutPayload.address.detail }} ({{ checkoutPayload.address.label }})</span>
            </div>
            <div class="inv-row">
              <span>Kurir Pengiriman</span>
              <span class="inv-val">{{ checkoutPayload.courier.code }} ({{ checkoutPayload.courier.service }})</span>
            </div>
            <div class="inv-row">
              <span>Metode Pembayaran</span>
              <span class="inv-val">{{ checkoutPayload.payment_method }}</span>
            </div>
            <div class="inv-row total-inv-row">
              <span>Grand Total</span>
              <span class="inv-val grand-val">Rp {{ formatPrice(checkoutPayload.grandtotal) }}</span>
            </div>
          </div>

          <!-- Complete button -->
          <button class="btn-finish-checkout" @click="resetCheckout">
            Selesai & Kembali ke Catalog
          </button>
        </div>
      </div>

    </div>

    <!-- FIXED BOTTOM BAR -->
    <div v-if="cartItems.length > 0 && !isSuccess" class="checkout-bottom-bar">
      <div class="bottom-bar-container">
        <div class="bottom-bar-left">
          
          <div class="bottom-bar-timer">
            <div class="timer-circle-wrapper">
              <svg width="32" height="32" viewBox="0 0 32 32">
                <!-- Background Circle -->
                <circle 
                  cx="16" 
                  cy="16" 
                  r="12" 
                  fill="none" 
                  stroke="rgba(255, 255, 255, 0.1)" 
                  stroke-width="2.5"
                />
                <!-- Progress Circle -->
                <circle 
                  cx="16" 
                  cy="16" 
                  r="12" 
                  fill="none" 
                  stroke="#ffffff" 
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-dasharray="75.4"
                  :stroke-dashoffset="circleOffset"
                  transform="rotate(-90 16 16)"
                />
              </svg>
            </div>
            <span class="timer-text">{{ formattedTime }}</span>
          </div>
        </div>
        
        <div class="bottom-bar-right">
          <button 
            class="btn-bottom-submit" 
            :disabled="isSubmitting || !isAddressComplete"
            @click="handleCheckout"
          >
            <span v-if="!isSubmitting">BAYAR SEKARANG</span>
            <span v-else class="loader-spinner"></span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.checkout-page {
  background-color: var(--bg-dark);
  color: var(--text-main);
  min-height: 100vh;
  padding: 8rem 0 6rem 0;
  display: flex;
  flex-direction: column;
}

.checkout-container {
  max-width: 100% !important;
  width: 100% !important;
  padding: 0 4.5% !important;
}

/* HEADER ROW styling */
.checkout-header-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
  align-items: flex-start;
}

.btn-back {
  background: transparent;
  color: var(--text-muted);
  border: none;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0;
}

.btn-back:hover {
  color: #fff;
}

.checkout-title {
  font-family: var(--font-heading);
  font-size: 2.8rem;
  font-weight: 850;
  letter-spacing: 2px;
  color: #fff;
  margin: 0;
  line-height: 1;
}

/* EMPTY STATE styling */
.checkout-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background-color: rgba(24, 24, 27, 0.4);
  border: 1px solid #1a1a1a;
  border-radius: 20px;
  text-align: center;
  max-width: 650px;
  margin: 3rem auto;
  backdrop-filter: blur(10px);
}

.empty-icon-box {
  margin-bottom: 2rem;
  opacity: 0.3;
}

.checkout-empty-state h2 {
  font-family: var(--font-body);
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.checkout-empty-state p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
  max-width: 420px;
}

.btn-shop {
  background-color: #fff;
  color: #000;
  font-family: var(--font-body);
  font-weight: 950;
  font-size: 0.85rem;
  letter-spacing: 1px;
  padding: 1rem 2.5rem;
  border-radius: 100px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
}

.btn-shop:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(255, 255, 255, 0.2);
}

/* 2-COLUMN GRID layout */
.checkout-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 3rem;
}

/* CARD common styling */
.checkout-card {
  background-color: rgba(24, 24, 27, 0.4);
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #27272a;
  padding-bottom: 1.25rem;
  margin-bottom: 2rem;
}

.card-header.border-none {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 1.5rem;
}

.header-main-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-num {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 800;
  background-color: #fff;
  color: #000;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header h3 {
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 850;
  color: #fff;
  letter-spacing: 0;
  text-transform: none;
  margin: 0;
}

/* STEP WIZARD PROGRESS BAR STYLING */
.step-progress-wizard {
  position: relative;
  margin: 0.5rem 0 2.5rem 0;
  padding: 0 1.5rem;
}

.wizard-line {
  position: absolute;
  top: 18px;
  left: 2.5rem;
  right: 2.5rem;
  height: 2px;
  background-color: #27272a;
  z-index: 1;
}

.wizard-line-fill {
  height: 100%;
  background-color: #ffffff; /* Realigned with style.css */
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.wizard-steps-row {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.wizard-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.wizard-step .step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #18181b;
  border: 2px solid #27272a;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wizard-step.active .step-circle {
  background-color: #ffffff; /* White active step */
  border-color: #ffffff;
  color: #000000;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.35);
}

.wizard-step .step-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.wizard-step.active .step-label {
  color: #fff;
  font-weight: 700;
}

/* Search input autocomplete suggestions */
.location-search-field {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input-wrapper input {
  width: 100% !important;
}

.search-field-icon {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #0c0c0e;
  border: 1px solid #27272a;
  border-radius: 10px;
  margin-top: 0.5rem;
  z-index: 100;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.6);
}

.suggestion-item {
  padding: 0.9rem 1.25rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background-color: rgba(255,255,255,0.03);
  color: #fff;
}

.sug-icon {
  color: #ffffff;
  flex-shrink: 0;
}

/* Map views & pinpoint styling */
.substep-title {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 1rem;
}

.map-outer-wrapper {
  position: relative;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #27272a;
  overflow: hidden;
  margin-bottom: 1rem;
}

.map-view-container {
  height: 350px;
  width: 100%;
  background-color: #141416;
}

.map-loader-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(9,9,11,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.map-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Leaflet maps customisations to fit dark layout */
:deep(.leaflet-container) {
  background: #141416 !important;
  font-family: var(--font-body) !important;
}

:deep(.leaflet-bar) {
  border: 1px solid #27272a !important;
  box-shadow: none !important;
}

:deep(.leaflet-bar a) {
  background-color: #0c0c0e !important;
  color: #fff !important;
  border-bottom: 1px solid #27272a !important;
  transition: background 0.2s;
}

:deep(.leaflet-bar a:hover) {
  background-color: #18181b !important;
}

.map-resolved-address {
  background-color: rgba(255,255,255,0.02);
  border: 1px solid #1c1c1f;
  border-radius: 8px;
  padding: 0.9rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #eee;
  line-height: 1.4;
}

.map-resolved-address svg {
  color: #ffffff;
  flex-shrink: 0;
}

.map-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  border-top: 1px solid #27272a;
  padding-top: 1.5rem;
}

/* Phone prefix select style */
.phone-input-combo {
  display: flex;
  gap: 0.5rem;
}

.phone-prefix-select {
  background-color: #0c0c0e;
  border: 1px solid #27272a;
  border-radius: 10px;
  padding: 0.9rem;
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

.phone-input-combo input {
  flex-grow: 1;
}

/* Primary white/black themed buttons */
.btn-mocha-primary {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #ffffff;
  padding: 0.9rem 2rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.btn-mocha-primary:hover:not(:disabled) {
  background-color: transparent;
  color: #ffffff;
  border-color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.25);
}

.btn-mocha-primary:disabled {
  background-color: #27272a;
  border-color: #27272a;
  color: #555;
  cursor: not-allowed;
}

.btn-mocha-text {
  background: transparent;
  color: var(--text-muted);
  border: none;
  font-family: var(--font-body);
  font-weight: 750;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
}

.btn-mocha-text:hover {
  color: #ffffff;
}

.mt-2 {
  margin-top: 1rem;
}

/* Transition Expand for Courier and Payment Step */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(20px);
}

/* Form inputs styling */
.form-group-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full {
  grid-column: span 2;
}

@media (max-width: 768px) {
  .form-group-grid {
    grid-template-columns: 1fr;
  }
  .form-field.half, .form-field.full {
    grid-column: span 1;
  }
}

.form-field label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
}

.form-field input,
.form-field textarea,
.form-field select {
  background-color: #0c0c0e;
  border: 1px solid #27272a;
  border-radius: 10px;
  padding: 0.9rem 1.2rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: #fff;
  outline: none;
  transition: all 0.25s ease;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  background-color: #101012;
}

.form-field input.has-error,
.form-field textarea.has-error,
.form-field select.has-error {
  border-color: #ff4444;
  background-color: rgba(255, 68, 68, 0.02);
}

.error-msg {
  font-size: 0.75rem;
  color: #ff4444;
  font-weight: 500;
  margin-top: 2px;
}

/* Courier Selection Styling */
.courier-selection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 580px) {
  .courier-selection-grid {
    grid-template-columns: 1fr;
  }
}

.courier-card {
  border: 1px solid #1c1c1f;
  background-color: #0c0c0e;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.courier-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.courier-card.active {
  border-color: #fff;
  background-color: rgba(255, 255, 255, 0.02);
}

.courier-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.courier-brand-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.courier-logo-placeholder {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 900;
  background-color: #fff;
  color: #000;
  padding: 1px 6px;
  border-radius: 4px;
}

.courier-service {
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
}

.courier-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #eee;
}

.courier-desc {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.courier-price {
  font-size: 1rem;
  font-weight: 850;
  color: #fff;
}

.checkbox-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.courier-card.active .checkbox-indicator {
  border-color: #fff;
}

.inner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.2s;
}

.courier-card.active .inner-dot {
  background-color: #fff;
}

/* Payment Methods Stack */
.payment-methods-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-card {
  border: 1px solid #1c1c1f;
  background-color: #0c0c0e;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.payment-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.payment-card.active {
  border-color: #fff;
  background-color: rgba(255, 255, 255, 0.02);
}

.payment-icon-box {
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid #27272a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
  transition: all 0.2s;
}

.payment-card.active .payment-icon-box {
  background-color: #fff;
  color: #000;
  border-color: #fff;
}

.payment-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex-grow: 1;
}

.payment-name {
  font-size: 0.9rem;
  font-weight: 750;
  color: #fff;
}

.payment-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.radio-indicator {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-card.active .radio-indicator {
  border-color: #fff;
}

.inner-radio {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.2s;
}

.payment-card.active .inner-radio {
  background-color: #fff;
}

/* SUMMARY COLUMN styling */
.checkout-summary-col {
  position: relative;
}

.summary-floating-card {
  position: sticky;
  top: 120px;
  background-color: rgba(24, 24, 27, 0.6);
  border: 1px solid #1a1a1a;
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  z-index: 10;
}

.summary-card-title {
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: 850;
  color: #fff;
  letter-spacing: 0;
  text-transform: none;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid #27272a;
  padding-bottom: 1rem;
}

.summary-products-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin-bottom: 2rem;
}

.summary-products-list::-webkit-scrollbar {
  width: 4px;
}

.summary-products-list::-webkit-scrollbar-thumb {
  background-color: #27272a;
  border-radius: 2px;
}

.summary-product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.prod-img {
  width: 50px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #000;
  flex-shrink: 0;
}

.prod-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prod-details {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.prod-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  text-transform: none;
  letter-spacing: 0;
}

.prod-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.prod-qty {
  font-weight: 700;
}

.prod-total {
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.price-breakdown-section {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  border-top: 1px solid #27272a;
  padding-top: 1.5rem;
  margin-bottom: 2rem;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.text-italic {
  font-style: italic;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.breakdown-divider {
  height: 1px;
  background-color: #27272a;
  margin: 0.5rem 0;
}

.grand-total-row {
  font-size: 0.95rem;
  color: #fff;
  font-weight: 750;
}

.grand-price {
  font-size: 1.35rem;
  font-weight: 950;
  color: #fff;
}

.btn-submit-order {
  width: 100%;
  background-color: #fff;
  color: #000;
  border: none;
  padding: 1.1rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 950;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-submit-order:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15);
}

.btn-submit-order:disabled {
  background-color: #555;
  color: #222;
  cursor: not-allowed;
}

.loader-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #222;
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.secure-payment-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.65rem;
  text-align: center;
  line-height: 1.3;
}

/* SUCCESS SCREEN STYLING */
.success-screen-wrapper {
  max-width: 680px;
  margin: 0 auto;
}

.success-card {
  background-color: rgba(24, 24, 27, 0.4);
  border: 1px solid #1a1a1a;
  border-radius: 24px;
  padding: 3.5rem 2.5rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}

.success-badge {
  width: 80px;
  height: 80px;
  background-color: rgba(0, 230, 118, 0.08);
  border: 2px solid #00e676;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem auto;
}

.success-title {
  font-family: var(--font-body);
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 0.5rem;
  text-transform: none;
  letter-spacing: 0;
}

.success-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
  line-height: 1.5;
}

.timer-box {
  background-color: #0c0c0e;
  border: 1px solid #1c1c1f;
  border-radius: 12px;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 280px;
  margin: 0 auto 2.5rem auto;
}

.timer-label {
  font-size: 0.6rem;
  color: var(--text-muted);
  font-weight: 700;
  letter-spacing: 1px;
}

.timer-countdown {
  font-family: var(--font-body);
  font-size: 1.35rem;
  font-weight: 900;
  color: #ff3d00;
  letter-spacing: 1px;
}

.payment-instructions-box {
  background-color: #0c0c0e;
  border: 1px solid #1c1c1f;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  text-align: left;
}

.instr-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* QR Code styling */
.mock-qrcode-container {
  width: 220px;
  height: 220px;
  background-color: #fff;
  margin: 0 auto 2rem auto;
  border-radius: 12px;
  padding: 10px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-code-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-corners {
  position: absolute;
  inset: 5px;
  border: 2px solid transparent;
  pointer-events: none;
}

.qr-logo-overlay {
  position: absolute;
  background-color: #000;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.95rem;
  border: 2px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

/* VA Section styling */
.va-number-box {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid #27272a;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.va-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.va-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.va-number {
  font-family: var(--font-body);
  font-size: 1.4rem;
  font-weight: 850;
  color: #fff;
  letter-spacing: 1.5px;
}

.btn-copy-va {
  background-color: rgba(255, 255, 255, 0.06);
  color: #fff;
  border: 1px solid #27272a;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy-va:hover {
  background-color: #fff;
  color: #000;
  border-color: #fff;
}

/* Step-by-step numbers */
.payment-steps {
  border-top: 1px solid #1c1c1f;
  padding-top: 1.5rem;
}

.payment-steps ol {
  padding-left: 1.2rem;
  list-style-type: decimal;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-steps li {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.payment-steps li b {
  color: #fff;
}

/* Invoice Summary Card */
.bill-details-invoice {
  border: 1px solid #1c1c1f;
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.inv-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.inv-val {
  color: #fff;
  font-weight: 600;
}

.total-inv-row {
  border-top: 1px solid #1c1c1f;
  padding-top: 0.85rem;
  margin-top: 0.4rem;
  font-size: 0.95rem;
  color: #fff;
  font-weight: 750;
}

.grand-val {
  font-size: 1.25rem;
  font-weight: 900;
}

.btn-finish-checkout {
  width: 100%;
  background-color: #fff;
  color: #000;
  border: none;
  padding: 1.1rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 950;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-finish-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
}

/* RESPONSIVENESS AND POSITION LAYOUTS */
@media (max-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .checkout-summary-col {
    position: static;
  }
}

@media (max-width: 640px) {
  .checkout-page {
    padding: 6rem 0 10rem 0;
  }
  
  .checkout-title {
    font-size: 2.2rem;
  }
  
  .checkout-card,
  .summary-floating-card {
    padding: 1.25rem;
  }
  
  .success-card {
    padding: 2.5rem 1.5rem;
  }
  
  .summary-product-card-mock {
    padding: 0.75rem;
  }
  
  .voucher-text-input {
    width: 100%;
    min-width: 0;
  }
  
  .btn-voucher-apply {
    flex-shrink: 0;
  }
}

/* FIXED BOTTOM BAR STYLING */
.checkout-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(9, 9, 11, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem 0;
  z-index: 999;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
}

.bottom-bar-container {
  max-width: 100%;
  width: 100%;
  padding: 0 4.5%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom-bar-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.btn-bottom-back {
  background: transparent;
  color: var(--text-muted);
  border: none;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0.5rem 0;
}

.btn-bottom-back:hover {
  color: #ffffff;
}

.bottom-bar-timer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timer-circle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-text {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 850;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.bottom-bar-right {
  display: flex;
  align-items: center;
}

.btn-bottom-submit {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #ffffff;
  padding: 1rem 3rem;
  border-radius: 100px;
  font-family: var(--font-body);
  font-weight: 950;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-bottom-submit:hover:not(:disabled) {
  background-color: transparent;
  color: #ffffff;
  border-color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.25);
}

.btn-bottom-submit:disabled {
  background-color: #27272a;
  border-color: #27272a;
  color: #555;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .bottom-bar-left {
    gap: 1.25rem;
  }
  
  .btn-bottom-submit {
    padding: 0.8rem 1.8rem;
    font-size: 0.8rem;
  }
  
  .timer-text {
    font-size: 0.95rem;
  }
}

/* NEW SUMMARY MOCKUP LAYOUT STYLING */
.summary-products-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.summary-products-container::-webkit-scrollbar {
  width: 4px;
}

.summary-products-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.summary-product-card-mock {
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 1.25rem;
  background-color: rgba(255, 255, 255, 0.01);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.prod-card-top {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.prod-card-img-box {
  width: 64px;
  height: 76px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #000;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.prod-card-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prod-card-info-box {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
}

.prod-card-title {
  font-size: 0.85rem;
  font-weight: 750;
  color: #fff;
  margin: 0;
  line-height: 1.3;
  text-transform: none;
  letter-spacing: 0;
}

.prod-card-variant {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.prod-card-shipping-origin {
  font-size: 0.68rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.2rem;
}

.origin-pin-icon {
  color: #ffffff;
  flex-shrink: 0;
}

.prod-card-right-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  flex-shrink: 0;
}

.prod-card-unit-price {
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
}

.prod-card-qty-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-control-circle-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.qty-control-circle-btn:hover {
  border-color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
}

.qty-control-number {
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  min-width: 14px;
  text-align: center;
}

.qty-control-trash-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  padding: 0.25rem;
}

.qty-control-trash-btn:hover {
  color: #ff4444;
}

.prod-card-note-box {
  width: 100%;
}

.prod-card-note-input {
  width: 100%;
  background-color: #0c0c0e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.prod-card-note-input:focus {
  border-color: rgba(255, 255, 255, 0.25);
}

.summary-voucher-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(255, 255, 255, 0.01);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.voucher-label {
  font-size: 0.8rem;
  font-weight: 750;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.voucher-input-row {
  display: flex;
  gap: 0.75rem;
}

.voucher-text-input {
  flex-grow: 1;
  background-color: #0c0c0e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.voucher-text-input:focus {
  border-color: #fff;
}

.btn-voucher-apply {
  background-color: #ffffff;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.25rem;
  font-family: var(--font-body);
  font-weight: 850;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-voucher-apply:hover {
  background-color: #e5e5e5;
}

.summary-secure-banner {
  display: flex;
  gap: 1rem;
  background-color: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.secure-banner-icon-col {
  color: #ffffff;
  display: flex;
  align-items: flex-start;
  margin-top: 2px;
}

.secure-banner-text-col {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.secure-banner-title {
  font-size: 0.8rem;
  font-weight: 750;
  color: #fff;
  margin: 0;
  text-transform: none;
  letter-spacing: 0;
}

.secure-banner-desc {
  font-size: 0.7rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin: 0;
}

.summary-disclaimer-text {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.4;
  margin: 0;
}

/* SHIPPING METHOD ACCORDION STYLING */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.width-100 {
  width: 100%;
}

.header-left-part {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.step-accordion-toggle {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.step-accordion-toggle:hover {
  color: #fff;
}

.shipping-type-container {
  margin-bottom: 1.5rem;
}

.shipping-type-box {
  border: 1px solid var(--bg-alt);
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: border-color 0.25s ease, background-color 0.25s ease;
}

.shipping-type-box:hover {
  border-color: var(--text-muted);
}

.shipping-type-box.active {
  border-color: #fff;
  background-color: rgba(255, 255, 255, 0.02);
}

.shipping-type-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
}

.couriers-accordion-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.courier-accordion-item {
  border: 1px solid var(--bg-alt);
  background-color: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.25s ease, background-color 0.25s ease;
}

.courier-accordion-item:hover {
  border-color: var(--text-muted);
}

.courier-accordion-item.expanded {
  border-color: #fff;
  background-color: rgba(255, 255, 255, 0.02);
}

.courier-accordion-header {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.courier-accordion-header:hover {
  background-color: rgba(255, 255, 255, 0.01);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.courier-brand-name {
  font-size: 0.95rem;
  font-weight: 750;
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.courier-starting-price {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 700;
}

.accordion-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: color 0.2s;
}

.courier-accordion-item:hover .accordion-chevron {
  color: #fff;
}

.courier-accordion-body {
  padding: 0 1.25rem 1.25rem 1.25rem;
  border-top: 1px solid var(--bg-alt);
  background-color: var(--bg-dark);
}

.services-title {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin: 1rem 0 0.75rem 0;
  text-transform: uppercase;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-option-card {
  border: 1px solid var(--bg-alt);
  background-color: var(--bg-card);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.25s ease, background-color 0.25s ease;
}

.service-option-card:hover {
  border-color: var(--text-muted);
}

.service-option-card.active {
  border-color: #fff;
  background-color: rgba(255, 255, 255, 0.02);
}

.service-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.service-info-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: left;
}

.service-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.service-est {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.service-right {
  display: flex;
  align-items: center;
}

.service-cost {
  font-size: 0.9rem;
  font-weight: 800;
  color: #fff;
}

/* Custom Radio Indicator styling */
.radio-indicator {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.radio-indicator.active {
  border-color: #ffffff !important;
}

.radio-indicator .inner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: transparent !important;
  transition: background-color 0.2s;
}

.radio-indicator.active .inner-dot {
  background-color: #ffffff !important;
}

/* Transition Slide Animations */
.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
  max-height: 400px;
  overflow: hidden;
}
.accordion-slide-enter-from,
.accordion-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Shipping origin two-line styles in Summary */
.shipping-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: none;
  margin-bottom: 0.15rem;
}

.shipping-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@media (max-width: 640px) {
  .courier-accordion-header {
    padding: 1rem;
  }
  .courier-starting-price {
    font-size: 0.75rem;
  }
  .service-option-card {
    padding: 0.85rem 1rem;
  }
  .service-name {
    font-size: 0.8rem;
  }
  .service-cost {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .prod-card-top {
    display: grid;
    grid-template-columns: 64px 1fr;
    grid-template-areas: 
      "image info"
      "image controls";
    gap: 0.75rem;
  }
  
  .prod-card-img-box {
    grid-area: image;
  }
  
  .prod-card-info-box {
    grid-area: info;
  }
  
  .prod-card-right-controls {
    grid-area: controls;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 0.25rem;
  }
}
</style>
