import axios from 'axios';

const API = (import.meta as any).env?.VITE_API_URL || 'https://api.kolektix.my.id';

export const getCatalog = () =>
  axios.get(`${API}/api/creator-maping-product/tokomocca.id`);

export const getDetail = (slug: string) =>
  axios.get(`${API}/api/product/${slug}`);
