import { AlertTriangle, ArrowLeft, Camera, Check, DollarSign, Edit2, Loader2, Plus, Settings, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { productsAPI, settingsAPI } from '../utils/api.js';
import { addBrand, addCategory, getBrands, getCategories } from '../utils/mockData.js';

const EMPTY_FORM = {
  name: '', brand: '', price: '', category: 'Mirrorless', stock: '',
  description: '', image: '',
  specifications: { sensor: '', resolution: '', iso: '', shutterSpeed: '', autofocus: '', video: '', battery: '', weight: '', dimensions: '' },
};

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list | add | edit | settings
  const [editCamera, setEditCamera] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState(getCategories());
  const [brands, setBrands] = useState(getBrands());
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [imageInputMode, setImageInputMode] = useState('url'); // 'url' | 'file'
  const [settings, setSettings] = useState({ whatsapp: '', facebook: '', instagram: '', telegram: '' });
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) { navigate('/auth'); return; }
    fetchCameras();
    fetchSettings();
  }, [user, isAdmin]);

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const { data } = await productsAPI.getAll();
      setCameras(data);
    } catch { toast({ message: 'Failed to load cameras', type: 'error' }); }
    finally { setLoading(false); }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await settingsAPI.getAll();
      setSettings(data);
    } catch { toast({ message: 'Failed to load settings', type: 'error' }); }
  };

  const setField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };
  const setSpec = (key, value) => {
    setForm(f => ({ ...f, specifications: { ...f.specifications, [key]: value } }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({ message: 'Category name cannot be empty', type: 'error' });
      return;
    }
    const updated = addCategory(newCategory.trim());
    setCategories(updated);
    setForm(f => ({ ...f, category: newCategory.trim() }));
    setNewCategory('');
    setShowNewCategory(false);
    toast({ message: `Category "${newCategory}" added`, type: 'success' });
  };

  const handleAddBrand = () => {
    if (!newBrand.trim()) {
      toast({ message: 'Brand name cannot be empty', type: 'error' });
      return;
    }
    const updated = addBrand(newBrand.trim());
    setBrands(updated);
    setForm(f => ({ ...f, brand: newBrand.trim() }));
    setNewBrand('');
    setShowNewBrand(false);
    toast({ message: `Brand "${newBrand}" added`, type: 'success' });
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditCamera(null); setView('add'); setImageInputMode('url'); };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ message: 'Please select a valid image file', type: 'error' }); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ message: 'Image must be smaller than 5MB', type: 'error' }); return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setField('image', base64);
      setImageInputMode('file');
    };
    reader.readAsDataURL(file);
  };

  const openEdit = (cam) => {
    setEditCamera(cam);
    setForm({
      name: cam.name || '', brand: cam.brand || '', price: cam.price || '', category: cam.category || 'Mirrorless',
      stock: cam.stock || '', description: cam.description || '', image: cam.image || '',
      specifications: { sensor: '', resolution: '', iso: '', shutterSpeed: '', autofocus: '', video: '', battery: '', weight: '', dimensions: '', ...(cam.specifications || {}) },
    });
    setView('edit');
    setImageInputMode(cam.image?.startsWith('data:') ? 'file' : 'url');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.price || !form.image) {
      toast({ message: 'Name, brand, price, and image are required', type: 'error' }); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) || 0 };
      if (view === 'edit' && editCamera) {
        await productsAPI.update(editCamera._id, payload);
        toast({ message: 'Camera updated successfully', type: 'success' });
      } else {
        await productsAPI.create(payload);
        toast({ message: 'Camera added successfully', type: 'success' });
      }
      await fetchCameras();
      setView('list');
    } catch (err) {
      toast({ message: err?.response?.data?.message || 'Save failed', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await productsAPI.delete(id);
      toast({ message: 'Camera deleted', type: 'success' });
      setCameras(c => c.filter(cam => cam._id !== id));
      setDeleteId(null);
    } catch { toast({ message: 'Delete failed', type: 'error' }); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await settingsAPI.update(settings);
      toast({ message: 'Settings saved successfully', type: 'success' });
    } catch (err) {
      toast({ message: err?.response?.data?.message || 'Failed to save settings', type: 'error' });
    } finally {
      setSettingsSaving(false);
    }
  };

  const filtered = cameras.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.brand?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: cameras.length,
    inStock: cameras.filter(c => c.stock > 0).length,
    outOfStock: cameras.filter(c => c.stock === 0).length,
    totalValue: cameras.reduce((s, c) => s + c.price * c.stock, 0),
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pt-20 bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-gold-500 uppercase tracking-widest mb-1">Dashboard</p>
            <h1 className="font-display text-3xl font-bold text-obsidian-50">Admin Panel</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/orders" className="btn-secondary flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              View Orders
            </Link>
            <button onClick={() => setView(view === 'settings' ? 'list' : 'settings')} className={`flex items-center gap-2 ${view === 'settings' ? 'btn-primary' : 'btn-secondary'}`}>
              <Settings className="w-4 h-4" />
              Settings
            </button>
            {view === 'list' ? (
              <button onClick={openAdd} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Camera
              </button>
            ) : view !== 'settings' && (
              <button onClick={() => setView('list')} className="btn-secondary flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {view === 'list' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Products', value: stats.total, Icon: Camera, color: 'text-gold-400' },
              { label: 'In Stock', value: stats.inStock, Icon: Check, color: 'text-emerald-400' },
              { label: 'Out of Stock', value: stats.outOfStock, Icon: AlertTriangle, color: 'text-ember-400' },
              { label: 'Inventory Value', value: `Rs ${stats.totalValue.toLocaleString()}`, Icon: DollarSign, color: 'text-gold-400' },
            ].map(s => (
              <div key={s.label} className="bg-obsidian-900 border border-obsidian-800 p-5">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-mono text-obsidian-500 uppercase tracking-wider">{s.label}</p>
                  <s.Icon className="w-5 h-5 text-obsidian-600" />
                </div>
                <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <>
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, brand or category..."
                className="input max-w-md"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-10 h-10 border-2 border-obsidian-700 border-t-gold-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-obsidian-900 border border-obsidian-800 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[80px_1fr_100px_100px_100px_120px] gap-4 px-6 py-3 bg-obsidian-800 text-xs font-mono text-obsidian-500 uppercase tracking-widest">
                  <span>Image</span><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span>
                </div>

                {filtered.length === 0 ? (
                  <div className="py-16 text-center text-obsidian-500">No cameras found</div>
                ) : (
                  filtered.map((cam, i) => (
                    <div key={cam._id} className={`grid grid-cols-1 md:grid-cols-[80px_1fr_100px_100px_100px_120px] gap-4 items-center px-6 py-4 border-b border-obsidian-800 hover:bg-obsidian-800/50 transition-colors ${i % 2 === 0 ? '' : 'bg-obsidian-900/50'}`}>
                      {/* Image */}
                      <div className="w-16 h-16 bg-obsidian-800 overflow-hidden shrink-0">
                        <img src={cam.image} alt={cam.name} className="w-full h-full object-cover"
                          onError={e => e.target.src='https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&auto=format&fit=crop'} />
                      </div>
                      {/* Name */}
                      <div className="min-w-0">
                        <p className="font-medium text-obsidian-100 truncate">{cam.name}</p>
                        <p className="text-xs text-obsidian-500 font-mono">{cam.brand}</p>
                      </div>
                      {/* Category */}
                      <div>
                        <span className="badge bg-obsidian-800 text-obsidian-400 border border-obsidian-700">{cam.category}</span>
                      </div>
                      {/* Price */}
                      <p className="font-mono text-gold-400 font-medium">Rs {cam.price.toLocaleString()}</p>
                      {/* Stock */}
                      <p className={`font-mono text-sm font-medium ${cam.stock === 0 ? 'text-ember-400' : cam.stock <= 5 ? 'text-gold-400' : 'text-emerald-400'}`}>
                        {cam.stock === 0 ? 'Out' : cam.stock}
                      </p>
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(cam)} className="p-2 text-obsidian-400 hover:text-gold-400 border border-obsidian-700 hover:border-gold-500 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(cam._id)} className="p-2 text-obsidian-400 hover:text-ember-400 border border-obsidian-700 hover:border-ember-500 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* Settings View */}
        {view === 'settings' && (
          <div className="animate-fade-up max-w-2xl">
            <h2 className="font-display text-xl font-bold text-obsidian-100 mb-6">Social Media & Contact Settings</h2>
            <form onSubmit={handleSaveSettings} className="bg-obsidian-900 border border-obsidian-800 p-6 space-y-6">
              <div>
                <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">WhatsApp</label>
                <input 
                  type="text" 
                  value={settings.whatsapp} 
                  onChange={e => setSettings(s => ({ ...s, whatsapp: e.target.value }))}
                  placeholder="e.g., +977-9841234567"
                  className="input w-full"
                />
                <p className="text-xs text-obsidian-600 mt-1">Phone number or link</p>
              </div>

              <div>
                <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Facebook</label>
                <input 
                  type="text" 
                  value={settings.facebook} 
                  onChange={e => setSettings(s => ({ ...s, facebook: e.target.value }))}
                  placeholder="e.g., LensCart.Nepal"
                  className="input w-full"
                />
                <p className="text-xs text-obsidian-600 mt-1">Facebook page name or URL</p>
              </div>

              <div>
                <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Instagram</label>
                <input 
                  type="text" 
                  value={settings.instagram} 
                  onChange={e => setSettings(s => ({ ...s, instagram: e.target.value }))}
                  placeholder="e.g., @lenscart_nepal"
                  className="input w-full"
                />
                <p className="text-xs text-obsidian-600 mt-1">Instagram handle or URL</p>
              </div>

              <div>
                <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Telegram</label>
                <input 
                  type="text" 
                  value={settings.telegram} 
                  onChange={e => setSettings(s => ({ ...s, telegram: e.target.value }))}
                  placeholder="e.g., @lenscart_support"
                  className="input w-full"
                />
                <p className="text-xs text-obsidian-600 mt-1">Telegram username or link</p>
              </div>

              <div className="bg-obsidian-800/50 border border-obsidian-700 p-4 rounded">
                <p className="text-xs text-obsidian-300">
                  <span className="text-gold-400 font-semibold">Note:</span> These details will be displayed to users when they place an order, allowing them to contact your team for confirmation.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={settingsSaving}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {settingsSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Add / Edit Form */}
        {(view === 'add' || view === 'edit') && (
          <div className="animate-fade-up">
            <h2 className="font-display text-xl font-bold text-obsidian-100 mb-6">
              {view === 'edit' ? `Edit: ${editCamera?.name}` : 'Add New Camera'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="bg-obsidian-900 border border-obsidian-800 p-6">
                    <h3 className="text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-5">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Name *</label>
                        <input type="text" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Sony Alpha A7 IV" className="input" required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Brand *</label>
                        <div className="space-y-2">
                          {showNewBrand ? (
                            <div className="flex gap-2">
                              <input type="text" value={newBrand} onChange={e => setNewBrand(e.target.value)} placeholder="Enter brand name" className="input flex-1" />
                              <button type="button" onClick={handleAddBrand} className="btn-primary px-3 text-xs">Add</button>
                              <button type="button" onClick={() => { setShowNewBrand(false); setNewBrand(''); }} className="btn-secondary px-3 text-xs">Cancel</button>
                            </div>
                          ) : (
                            <>
                              <select value={form.brand} onChange={e => setField('brand', e.target.value)} className="input">
                                <option value="">Select or add brand</option>
                                {brands.filter(b => b !== 'All').map(b => <option key={b} value={b}>{b}</option>)}
                              </select>
                              <button type="button" onClick={() => setShowNewBrand(true)} className="text-xs text-gold-400 hover:text-gold-300 font-mono">+ Add New Brand</button>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Price (Rs) *</label>
                        <input type="number" value={form.price} onChange={e => setField('price', e.target.value)} placeholder="2498" min="0" className="input" required />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Category *</label>
                        <div className="space-y-2">
                          {showNewCategory ? (
                            <div className="flex gap-2">
                              <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Enter category name" className="input flex-1" />
                              <button type="button" onClick={handleAddCategory} className="btn-primary px-3 text-xs">Add</button>
                              <button type="button" onClick={() => { setShowNewCategory(false); setNewCategory(''); }} className="btn-secondary px-3 text-xs">Cancel</button>
                            </div>
                          ) : (
                            <>
                              <select value={form.category} onChange={e => setField('category', e.target.value)} className="input">
                                <option value="">Select or add category</option>
                                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                              <button type="button" onClick={() => setShowNewCategory(true)} className="text-xs text-gold-400 hover:text-gold-300 font-mono">+ Add New Category</button>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Stock *</label>
                        <input type="number" value={form.stock} onChange={e => setField('stock', e.target.value)} placeholder="10" min="0" className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2 flex items-center gap-2">Image *
                          <div className="flex gap-1 ml-auto bg-obsidian-800 rounded px-2 py-1 font-sans">
                            <button type="button" onClick={() => { setImageInputMode('url'); setField('image', ''); }} className={`px-2 py-0.5 text-xs rounded transition-colors ${imageInputMode === 'url' ? 'bg-gold-500 text-obsidian-950' : 'text-obsidian-400 hover:text-obsidian-300'}`}>URL</button>
                            <button type="button" onClick={() => { setImageInputMode('file'); setField('image', ''); }} className={`px-2 py-0.5 text-xs rounded transition-colors ${imageInputMode === 'file' ? 'bg-gold-500 text-obsidian-950' : 'text-obsidian-400 hover:text-obsidian-300'}`}>Upload</button>
                          </div>
                        </label>
                        {imageInputMode === 'url' ? (
                          <input type="url" value={form.image} onChange={e => setField('image', e.target.value)} placeholder="https://unsplash.com/..." className="input" />
                        ) : (
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="input file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gold-500 file:text-obsidian-950 hover:file:bg-gold-400" />
                        )}
                        <p className="text-xs text-obsidian-600 mt-1">{imageInputMode === 'url' ? 'Paste an image URL' : 'Select a local image (max 5MB)'}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">Description *</label>
                      <textarea value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Write a detailed description..." rows={4} className="input resize-none" required />
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="bg-obsidian-900 border border-obsidian-800 p-6">
                    <h3 className="text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-5">Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.keys(EMPTY_FORM.specifications).map(key => (
                        <div key={key}>
                          <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input type="text" value={form.specifications[key]} onChange={e => setSpec(key, e.target.value)} placeholder={key === 'sensor' ? '33MP Full-Frame BSI CMOS' : ''} className="input" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview + Submit */}
                <div className="space-y-5">
                  {/* Image Preview */}
                  <div className="bg-obsidian-900 border border-obsidian-800 p-6">
                    <h3 className="text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-4">Image Preview</h3>
                    <div className="aspect-square bg-obsidian-800 overflow-hidden">
                      {form.image ? (
                        <img src={form.image} alt="Preview" className="w-full h-full object-cover"
                          onError={e => { e.target.style.display='none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-obsidian-600">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-obsidian-600 mt-2 text-center">Paste an Unsplash URL above</p>
                  </div>

                  {/* Submit */}
                  <div className="bg-obsidian-900 border border-obsidian-800 p-6 space-y-3">
                    <button type="submit" disabled={saving} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : view === 'edit' ? <>Update Camera</> : <>Add Camera</>}
                    </button>
                    <button type="button" onClick={() => setView('list')} className="w-full btn-secondary py-3">Cancel</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-obsidian-900 border border-obsidian-700 p-8 max-w-sm w-full animate-fade-up">
            <div className="w-12 h-12 bg-ember-500/20 border border-ember-500/40 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-ember-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-obsidian-100 mb-2">Delete Camera?</h3>
            <p className="text-obsidian-400 text-sm mb-6">This action cannot be undone. The camera will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-ember-500 hover:bg-ember-400 text-white font-semibold py-2.5 text-sm uppercase tracking-wider transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
