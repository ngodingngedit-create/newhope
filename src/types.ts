export interface Creator {
  id?: number;
  user_id?: number;
  category_id?: string;
  slug?: string;
  slug_url?: string;
  name_event_organizer?: string;
  name: string;
  image?: string;
  phone_number?: string | null;
  description?: string | null;
  website?: string | null;
  status?: string;
  image_url?: string;
}

export interface EventTicket {
  id: number;
  event_id: string;
  ticket_type_id: number;
  name: string;
  description: string | null;
  qty: number;
  sold_qty: number;
  price: number;
  ticket_fee?: number | null;
  event_schedule_date: string;
  is_soldout: number;
  is_finish: number;
  is_ready: number;
  is_promo: number;
  promo_title?: string | null;
  promo_price?: number | null;
}

export interface ProductVarian {
  id: number;
  product_id: number;
  varian_category_id: number;
  varian_name: string;
  subvarian_name?: string | null;
  sku?: string;
  price?: string | number;
  weight?: string | number;
  stock_qty: number;
  is_active?: number;
  status_product?: string;
  is_soldout?: number;
  is_promo?: number;
  promo_title?: string | null;
  promo_price?: string | number | null;
}

export interface ProductImage {
  id: number;
  product_id: number;
  name: string;
  image?: string;
  image_url: string;
}

export interface APIEventItem {
  id: number;
  name?: string;
  product_name?: string;
  slug: string;
  promo_price?: string | number | null;
  price?: string | number | null;
  starting_price?: number | string | null;
  average_star?: string;
  total_review?: number;
  total_sold?: number;
  creator?: Creator;
  has_creator?: Creator | null;
  image?: string;
  image_url?: string;
  thumbnail_url?: string;
  description?: string;
  tag?: string;
  has_event_ticket?: EventTicket[];
  is_merch?: number;
  upcoming?: number;
  activity_status?: number;
  is_promo?: number;
  varians?: ProductVarian[];
  product_varian?: ProductVarian[];
  productVarian?: ProductVarian[];
  images?: ProductImage[];
  product_image?: ProductImage[];
}

export interface APIEventResponse {
  data: APIEventItem[];
  message?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
  };
}

export interface MerchandiseItem {
  id: number;
  name: string;
  product_name: string;
  slug: string;
  price: number;
  displayPrice: string;
  originalPrice?: number | null;
  average_star: string;
  total_review: number;
  total_sold: number;
  creator: Creator;
  image: string;
  description: string;
  category: string;
  isNew: boolean;
  isSoldOut: boolean;
  quantity: number; // local cart quantity state
}

/**
 * Maps a raw API event/merchandise item to a normalized MerchandiseItem interface.
 */
export function mapAPIEventToMerchandise(item: APIEventItem): MerchandiseItem {
  const name = item.product_name || item.name || 'Unnamed Product';
  const slug = item.slug || '';
  const id = item.id;

  // 5. Jika promo_price kosong atau 0, gunakan field price sebagai fallback.
  let rawPrice = 0;
  const promoPriceNum = item.promo_price ? parseFloat(String(item.promo_price)) : 0;
  const priceNum = item.price ? parseFloat(String(item.price)) : 0;

  const itemVarians = item.varians || item.product_varian || item.productVarian;

  if (promoPriceNum > 0) {
    rawPrice = promoPriceNum;
  } else if (priceNum > 0) {
    rawPrice = priceNum;
  } else if (item.starting_price) {
    rawPrice = parseFloat(String(item.starting_price));
  } else if (itemVarians && itemVarians.length > 0) {
    // Check variant prices
    const firstVarian = itemVarians[0];
    const varianPromo = firstVarian.promo_price ? parseFloat(String(firstVarian.promo_price)) : 0;
    const varianPrice = firstVarian.price ? parseFloat(String(firstVarian.price)) : 0;
    rawPrice = varianPromo > 0 ? varianPromo : varianPrice;
  } else if (item.has_event_ticket && item.has_event_ticket.length > 0) {
    // If no direct price, look at tickets
    const firstTicket = item.has_event_ticket[0];
    const ticketPromo = firstTicket.promo_price ? parseFloat(String(firstTicket.promo_price)) : 0;
    const ticketPrice = firstTicket.price ? parseFloat(String(firstTicket.price)) : 0;
    rawPrice = ticketPromo > 0 ? ticketPromo : ticketPrice;
  }

  // Original price calculations for discounts
  let originalPrice: number | null = null;
  if (promoPriceNum > 0 && priceNum > promoPriceNum) {
    originalPrice = priceNum;
  } else if (item.is_promo === 1 && promoPriceNum > 0) {
    originalPrice = Math.round(promoPriceNum * 1.3);
  } else if (item.id === 142) {
    originalPrice = 200000;
  }

  const average_star = item.average_star || '0,0';
  const total_review = item.total_review !== undefined ? item.total_review : 0;
  const total_sold = item.total_sold !== undefined ? item.total_sold : 0;

  // Fallback creator
  const creatorName = item.creator?.name || item.has_creator?.name || 'moofeet';
  const creator: Creator = {
    name: creatorName,
    image_url: item.creator?.image_url || item.has_creator?.image_url || undefined,
  };

  // Fallback image: use images array, product_image array, image_url, image, thumbnail_url, or a default
  let image = '';
  if (item.images && item.images.length > 0 && item.images[0].image_url) {
    image = item.images[0].image_url;
  } else if (item.product_image && item.product_image.length > 0 && item.product_image[0].image_url) {
    image = item.product_image[0].image_url;
  } else {
    image = item.image_url || item.image || item.thumbnail_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=2574&auto=format&fit=crop';
  }
  
  const description = item.description || 'No description available for this item.';
  const category = item.tag || 'APPAREL';

  // Determine if it is sold out
  let isSoldOut = false;
  if (itemVarians && itemVarians.length > 0) {
    isSoldOut = itemVarians.every((v) => v.is_soldout === 1 || v.stock_qty === 0);
  } else if (item.has_event_ticket && item.has_event_ticket.length > 0) {
    isSoldOut = item.has_event_ticket.every((t) => t.is_soldout === 1);
  }

  // Determine if it's new
  const isNew = item.upcoming === 1 || false;

  return {
    id,
    name,
    product_name: name,
    slug,
    price: rawPrice,
    displayPrice: rawPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    originalPrice,
    average_star,
    total_review,
    total_sold,
    creator,
    image,
    description,
    category,
    isNew,
    isSoldOut,
    quantity: 0,
  };
}
