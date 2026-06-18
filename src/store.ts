import { ref, computed } from 'vue';
import { MerchandiseItem, APIEventResponse, mapAPIEventToMerchandise } from './types';
import { getCatalog } from './api';

export const merchItems = ref<MerchandiseItem[]>([]);
export const isLoading = ref(false);
export const hasError = ref(false);
export const errorMessage = ref('');

// Safe API helpers
const getApiOrigin = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL || 'https://api.kolektix.my.id';
  try {
    return new URL(envUrl).origin;
  } catch (e) {
    return 'https://api.kolektix.my.id';
  }
};

export const getCatalogUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL || 'https://api.kolektix.my.id';
  if (envUrl.includes('/api/creator-maping-product/')) {
    return envUrl;
  }
  return `${getApiOrigin()}/api/event`;
};

export const getDetailUrl = (slug: string) => {
  return `${getApiOrigin()}/api/event/${slug}`;
};

/**
 * Fetches merchandise catalog items from the API and populates merchItems.
 */
export async function fetchMerchItems() {
  // If already loaded or currently loading, skip to avoid duplicate fetch issues
  if (isLoading.value) return;

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = '';

  try {
    const response = await getCatalog();
    const result = response.data;
    
    let rawItems: any[] = [];
    if (result && result.data && Array.isArray(result.data)) {
      rawItems = result.data;
    } else if (result && result.products && Array.isArray(result.products.data)) {
      rawItems = result.products.data;
    } else {
      throw new Error('API response format is invalid: products or data array is missing');
    }

    merchItems.value = rawItems.map(mapAPIEventToMerchandise);
  } catch (err: any) {
    console.error('Error fetching merchandise:', err);
    hasError.value = true;
    errorMessage.value = err.response?.data?.message || err.message || 'Gagal memuat data merchandise.';
  } finally {
    isLoading.value = false;
  }
}

/**
 * Total quantities of all items currently in the cart.
 */
export const totalCartQty = computed(() => {
  return merchItems.value.reduce((total, item) => total + (item.quantity || 0), 0);
});

/**
 * Increases checkout quantity for a merchandise item.
 */
export const increaseQty = (item: MerchandiseItem) => {
  if (item && !item.isSoldOut) {
    // Find the item in the reactive list to preserve reactivity
    const found = merchItems.value.find(x => x.id === item.id);
    if (found) {
      found.quantity = (found.quantity || 0) + 1;
    } else {
      item.quantity = (item.quantity || 0) + 1;
    }
  }
};

/**
 * Decreases checkout quantity for a merchandise item.
 */
export const decreaseQty = (item: MerchandiseItem) => {
  if (item && item.quantity > 0) {
    const found = merchItems.value.find(x => x.id === item.id);
    if (found) {
      found.quantity--;
    } else {
      item.quantity--;
    }
  }
};

export const isCartOpen = ref(false);

export const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
};

export const clearCart = () => {
  merchItems.value.forEach(item => {
    item.quantity = 0;
  });
};

export const removeCartItem = (item: MerchandiseItem) => {
  const found = merchItems.value.find(x => x.id === item.id);
  if (found) {
    found.quantity = 0;
  } else {
    item.quantity = 0;
  }
};

/**
 * Simple client-side routing helper using HTML5 History API.
 */
export const navigateTo = (path: string) => {
  history.pushState(null, '', path);
  window.dispatchEvent(new CustomEvent('navigation-change'));
};
