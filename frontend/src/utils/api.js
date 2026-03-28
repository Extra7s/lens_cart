import axios from 'axios';
import { MOCK_CAMERAS } from './mockData.js';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Detect if running in demo mode (no backend)
export const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lc_token');
      localStorage.removeItem('lc_user');
    }
    return Promise.reject(err);
  }
);

// ——— MOCK HELPERS (demo / Vercel mode) ———
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

function getMockStore() {
  return {
    cameras: JSON.parse(localStorage.getItem('lc_cameras') || 'null') || MOCK_CAMERAS,
    cart: JSON.parse(localStorage.getItem('lc_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('lc_wishlist') || '[]'),
    users: JSON.parse(localStorage.getItem('lc_users') || '[{"id":"admin1","name":"Admin","email":"admin@lenscart.com","password":"admin123","role":"admin"}]'),
  };
}
function saveMock(key, val) { localStorage.setItem(`lc_${key}`, JSON.stringify(val)); }

// ——— AUTH ———
export const authAPI = {
  register: async (data) => {
    if (IS_DEMO) {
      await delay();
      const store = getMockStore();
      if (store.users.find(u => u.email === data.email)) throw { response: { data: { message: 'Email already registered' } } };
      const user = { id: Date.now().toString(), name: data.name, email: data.email, password: data.password, role: 'user' };
      store.users.push(user);
      saveMock('users', store.users);
      const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 * 7 }));
      return { data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } };
    }
    return api.post('/auth/register', data);
  },
  login: async (data) => {
    if (IS_DEMO) {
      await delay();
      const store = getMockStore();
      const user = store.users.find(u => u.email === data.email && u.password === data.password);
      if (!user) throw { response: { data: { message: 'Invalid credentials' } } };
      const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 * 7 }));
      return { data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } };
    }
    return api.post('/auth/login', data);
  },
};

// ——— PRODUCTS ———
export const productsAPI = {
  getAll: async (params = {}) => {
    if (IS_DEMO) {
      await delay(400);
      let cams = getMockStore().cameras;
      if (params.category && params.category !== 'All') cams = cams.filter(c => c.category === params.category);
      if (params.brand && params.brand !== 'All') cams = cams.filter(c => c.brand === params.brand);
      if (params.search) { const q = params.search.toLowerCase(); cams = cams.filter(c => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)); }
      if (params.minPrice) cams = cams.filter(c => c.price >= Number(params.minPrice));
      if (params.maxPrice) cams = cams.filter(c => c.price <= Number(params.maxPrice));
      if (params.sort === 'price_asc') cams = [...cams].sort((a, b) => a.price - b.price);
      if (params.sort === 'price_desc') cams = [...cams].sort((a, b) => b.price - a.price);
      if (params.sort === 'rating') cams = [...cams].sort((a, b) => b.rating - a.rating);
      return { data: cams };
    }
    return api.get('/products', { params });
  },
  getById: async (id) => {
    if (IS_DEMO) {
      await delay(200);
      const cam = getMockStore().cameras.find(c => c._id === id);
      if (!cam) throw { response: { data: { message: 'Camera not found' } } };
      return { data: cam };
    }
    return api.get(`/products/${id}`);
  },
  create: async (data) => {
    if (IS_DEMO) {
      await delay(300);
      const store = getMockStore();
      const cam = { ...data, _id: Date.now().toString(), rating: 4.5, reviewCount: 0, featured: false };
      store.cameras.unshift(cam);
      saveMock('cameras', store.cameras);
      return { data: cam };
    }
    return api.post('/products', data);
  },
  update: async (id, data) => {
    if (IS_DEMO) {
      await delay(300);
      const store = getMockStore();
      const idx = store.cameras.findIndex(c => c._id === id);
      if (idx === -1) throw { response: { data: { message: 'Not found' } } };
      store.cameras[idx] = { ...store.cameras[idx], ...data };
      saveMock('cameras', store.cameras);
      return { data: store.cameras[idx] };
    }
    return api.put(`/products/${id}`, data);
  },
  delete: async (id) => {
    if (IS_DEMO) {
      await delay(300);
      const store = getMockStore();
      saveMock('cameras', store.cameras.filter(c => c._id !== id));
      return { data: { message: 'Deleted' } };
    }
    return api.delete(`/products/${id}`);
  },
};

// ——— CART ———
export const cartAPI = {
  get: async () => {
    if (IS_DEMO) {
      await delay(200);
      const { cart, cameras } = getMockStore();
      const populated = cart.map(item => ({ ...item, cameraId: cameras.find(c => c._id === item.cameraId) || item.cameraId })).filter(i => i.cameraId);
      return { data: { items: populated } };
    }
    return api.get('/cart');
  },
  add: async (cameraId, quantity = 1) => {
    if (IS_DEMO) {
      await delay(200);
      const store = getMockStore();
      const camera = store.cameras.find(c => c._id === cameraId);
      if (!camera) throw { response: { data: { message: 'Camera not found' } } };
      if (camera.stock < quantity) throw { response: { data: { message: `Only ${camera.stock} units available` } } };
      const existing = store.cart.find(i => i.cameraId === cameraId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (camera.stock < newQty) throw { response: { data: { message: `Only ${camera.stock} units available in total` } } };
        existing.quantity = newQty;
      } else {
        store.cart.push({ cameraId, quantity });
      }
      saveMock('cart', store.cart);
      return cartAPI.get();
    }
    return api.post('/cart/add', { cameraId, quantity });
  },
  update: async (cameraId, quantity) => {
    if (IS_DEMO) {
      await delay(200);
      const store = getMockStore();
      const camera = store.cameras.find(c => c._id === cameraId);
      if (quantity > 0 && camera && camera.stock < quantity) {
        throw { response: { data: { message: `Only ${camera.stock} units available` } } };
      }
      if (quantity <= 0) store.cart = store.cart.filter(i => i.cameraId !== cameraId);
      else { const item = store.cart.find(i => i.cameraId === cameraId); if (item) item.quantity = quantity; }
      saveMock('cart', store.cart);
      return cartAPI.get();
    }
    return api.put(`/cart/item/${cameraId}`, { quantity });
  },
  remove: async (cameraId) => {
    if (IS_DEMO) {
      await delay(200);
      const store = getMockStore();
      saveMock('cart', store.cart.filter(i => i.cameraId !== cameraId));
      return cartAPI.get();
    }
    return api.delete(`/cart/item/${cameraId}`);
  },
  clear: async () => {
    if (IS_DEMO) { saveMock('cart', []); return { data: { items: [] } }; }
    return api.delete('/cart/clear');
  },
};

// ——— WISHLIST ———
export const wishlistAPI = {
  get: async () => {
    if (IS_DEMO) {
      await delay(200);
      const { wishlist, cameras } = getMockStore();
      return { data: wishlist.map(id => cameras.find(c => c._id === id)).filter(Boolean) };
    }
    return api.get('/wishlist');
  },
  toggle: async (cameraId) => {
    if (IS_DEMO) {
      await delay(200);
      const store = getMockStore();
      const idx = store.wishlist.indexOf(cameraId);
      if (idx > -1) store.wishlist.splice(idx, 1);
      else store.wishlist.push(cameraId);
      saveMock('wishlist', store.wishlist);
      return { data: { wishlist: store.wishlist, added: idx === -1 } };
    }
    return api.post('/wishlist/toggle', { cameraId });
  },
};

// ——— ORDERS ———
export const orderAPI = {
  create: async (orderData) => {
    if (IS_DEMO) {
      await delay(300);
      const store = getMockStore();
      // Validate stock for all items before creating order
      for (const item of orderData.items) {
        const cam = store.cameras.find(c => c._id === item.camera);
        if (!cam || cam.stock < item.quantity) {
          throw { response: { data: { message: `Insufficient stock for ${cam?.name || 'item'}` } } };
        }
      }
      // Create order and decrease stock
      const order = {
        _id: Date.now().toString(),
        user: localStorage.getItem('lc_user') ? JSON.parse(localStorage.getItem('lc_user')).id : 'guest',
        items: orderData.items,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      const orders = JSON.parse(localStorage.getItem('lc_orders') || '[]');
      orders.push(order);
      localStorage.setItem('lc_orders', JSON.stringify(orders));
      // Decrease stock for each item
      for (const item of orderData.items) {
        const cam = store.cameras.find(c => c._id === item.camera);
        if (cam) cam.stock -= item.quantity;
      }
      saveMock('cameras', store.cameras);
      return { data: order };
    }
    return api.post('/orders', orderData);
  },
  getMyOrders: async () => {
    if (IS_DEMO) {
      await delay(200);
      const user = localStorage.getItem('lc_user') ? JSON.parse(localStorage.getItem('lc_user')) : null;
      if (!user) throw { response: { data: { message: 'Not authenticated' } } };
      const orders = JSON.parse(localStorage.getItem('lc_orders') || '[]');
      return { data: orders.filter(o => o.user === user.id) };
    }
    return api.get('/orders/my-orders');
  },
};

// ——— ORDERS (Admin) ———
export const ordersAPI = {
  getAll: async () => {
    if (IS_DEMO) {
      await delay(200);
      const orders = JSON.parse(localStorage.getItem('lc_orders') || '[]');
      const store = getMockStore();
      const users = store.users;
      return { data: orders.map(o => ({ ...o, user: users.find(u => u.id === o.user), userName: users.find(u => u.id === o.user)?.name })) };
    }
    return api.get('/orders');
  },
  updateStatus: async (orderId, status) => {
    if (IS_DEMO) {
      await delay(200);
      const orders = JSON.parse(localStorage.getItem('lc_orders') || '[]');
      const order = orders.find(o => o._id === orderId);
      if (order) order.status = status;
      localStorage.setItem('lc_orders', JSON.stringify(orders));
      return { data: order };
    }
    return api.put(`/orders/${orderId}`, { status });
  },
};

// ——— USER ———
export const userAPI = {
  updateProfile: async (data) => {
    if (IS_DEMO) {
      await delay();
      const store = getMockStore();
      const token = localStorage.getItem('lc_token');
      const decoded = token ? JSON.parse(atob(token)) : null;
      const userIdx = store.users.findIndex(u => u.id === decoded?.id);
      if (userIdx > -1) {
        store.users[userIdx] = { ...store.users[userIdx], ...data };
        saveMock('users', store.users);
        return { data: { user: { id: store.users[userIdx].id, name: store.users[userIdx].name, email: store.users[userIdx].email, role: store.users[userIdx].role } } };
      }
      throw { response: { data: { message: 'User not found' } } };
    }
    return api.put('/auth/profile', data);
  },
  updatePassword: async (data) => {
    if (IS_DEMO) {
      await delay();
      const store = getMockStore();
      const token = localStorage.getItem('lc_token');
      const decoded = token ? JSON.parse(atob(token)) : null;
      const userIdx = store.users.findIndex(u => u.id === decoded?.id);
      if (userIdx === -1) throw { response: { data: { message: 'User not found' } } };
      if (store.users[userIdx].password !== data.currentPassword) throw { response: { data: { message: 'Current password is incorrect' } } };
      store.users[userIdx].password = data.newPassword;
      saveMock('users', store.users);
      return { data: { message: 'Password updated successfully' } };
    }
    return api.put('/auth/password', data);
  },
};

// ——— SETTINGS ———
const DEFAULT_SETTINGS = {
  whatsapp: '+977-9841234567',
  facebook: 'LensCart.Nepal',
  instagram: '@lenscart_nepal',
  telegram: '@lenscart_support',
};

export const settingsAPI = {
  getAll: async () => {
    if (IS_DEMO) {
      await delay(200);
      const settings = JSON.parse(localStorage.getItem('lc_settings') || JSON.stringify(DEFAULT_SETTINGS));
      return { data: settings };
    }
    try {
      return await api.get('/settings');
    } catch (err) {
      // Fallback to defaults if backend unreachable (e.g., frontend-only deploy, no backend)
      console.warn('Settings API unavailable, using defaults:', err.message);
      return { data: DEFAULT_SETTINGS };
    }
  },
  update: async (data) => {
    if (IS_DEMO) {
      await delay(200);
      localStorage.setItem('lc_settings', JSON.stringify(data));
      return { data };
    }
    try {
      return await api.put('/settings', data);
    } catch (err) {
      // Silently fall back to local storage if backend unreachable
      console.warn('Settings update failed, saving locally:', err.message);
      localStorage.setItem('lc_settings', JSON.stringify(data));
      return { data };
    }
  },
};

export default api;
