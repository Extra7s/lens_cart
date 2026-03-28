import { Globe, RotateCcw, Shield, Truck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageLoader } from '../components/Skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { productsAPI } from '../utils/api.js';

export default function CameraDetailPage() {
  const { id } = useParams();
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await productsAPI.getById(id);
        setCamera(data);
      } catch { } finally { setLoading(false); }
    })();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast({ message: 'Sign in to add to cart', type: 'info' }); return; }
    if (quantity > camera.stock) {
      toast({ message: `Only ${camera.stock} units available`, type: 'error' });
      return;
    }
    try {
      setAdding(true);
      await addToCart(camera._id, quantity);
      toast({ message: `${camera.name} added to cart`, type: 'success' });
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Failed to add to cart';
      toast({ message: errMsg, type: 'error' });
    }
    finally { setAdding(false); }
  };

  const handleWishlist = async () => {
    if (!user) { toast({ message: 'Sign in to save to wishlist', type: 'info' }); return; }
    const added = await toggleWishlist(camera._id);
    toast({ message: added ? 'Saved to wishlist' : 'Removed from wishlist', type: 'success' });
  };

  if (loading) return <PageLoader />;
  if (!camera) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h2 className="font-display text-2xl text-obsidian-300 mb-4">Camera Not Found</h2><Link to="/" className="btn-primary">Back to Shop</Link></div>
    </div>
  );

  const fallbackImg = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60';
  const wishlisted = isWishlisted(camera._id);
  const specs = camera.specifications || {};

  return (
    <div className="min-h-screen pt-20 page-enter">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-obsidian-500">
          <Link to="/" className="hover:text-gold-400 transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/?category=${camera.category}`} className="hover:text-gold-400 transition-colors">{camera.category}</Link>
          <span>/</span>
          <span className="text-obsidian-300 truncate">{camera.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-obsidian-900 overflow-hidden relative group border border-obsidian-800">
              <img
                src={imgError ? fallbackImg : camera.image}
                alt={camera.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {camera.featured && (
                <div className="absolute bottom-4 left-4">
                  <span className="badge bg-gold-500 text-obsidian-950">Featured</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="badge bg-obsidian-800 text-obsidian-400 border border-obsidian-700">{camera.category}</span>
            </div>
            <p className="font-mono text-gold-500 text-sm tracking-widest uppercase mb-2">{camera.brand}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-obsidian-50 leading-tight mb-4">{camera.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className={`w-4 h-4 ${i <= Math.round(camera.rating) ? 'text-gold-400' : 'text-obsidian-700'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <span className="text-obsidian-300 text-sm font-medium">{camera.rating.toFixed(1)}</span>
              <span className="text-obsidian-600 text-sm">({camera.reviewCount} reviews)</span>
            </div>

            <p className="text-obsidian-400 leading-relaxed mb-8">{camera.description}</p>

            <div className="divider mb-8" />

            {/* Price */}
            <div className="flex items-end gap-4 mb-8">
              <p className="font-display text-4xl font-bold text-gold-400">Rs {camera.price.toLocaleString()}</p>
              <div className="pb-1">
                {camera.stock > 0 ? (
                  <span className={`text-sm font-medium ${camera.stock <= 5 ? 'text-gold-400' : 'text-emerald-400'}`}>
                    {camera.stock <= 5 ? `Only ${camera.stock} left` : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-ember-400 text-sm font-medium">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Quantity + Actions */}
            {camera.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-obsidian-700">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-obsidian-400 hover:text-gold-400 transition-colors text-lg">−</button>
                  <span className="w-10 h-10 flex items-center justify-center text-obsidian-100 font-mono font-medium text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(camera.stock, q + 1))} className="w-10 h-10 flex items-center justify-center text-obsidian-400 hover:text-gold-400 transition-colors text-lg">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={adding} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {adding ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Adding...</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg> Add to Cart</>}
                </button>
                <button onClick={handleWishlist} className={`w-12 h-12 border flex items-center justify-center transition-all ${wishlisted ? 'border-ember-500 text-ember-400 bg-ember-500/10' : 'border-obsidian-700 text-obsidian-400 hover:border-ember-500 hover:text-ember-400'}`}>
                  <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[[Truck, 'Free Shipping', 'On orders over Rs 50,000'], [RotateCcw, 'Free Returns', '30-day policy'], [Shield, 'Warranty', '2-year coverage']].map(([Icon, title, sub]) => (
                <div key={title} className="text-center p-3 bg-obsidian-900 border border-obsidian-800">
                  <Icon className="w-5 h-5 mx-auto mb-1 text-obsidian-400" />
                  <p className="text-xs font-medium text-obsidian-300">{title}</p>
                  <p className="text-xs text-obsidian-600 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-obsidian-800 gap-8 mb-8">
            {['specs', 'description', 'shipping'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-gold-500 text-gold-400' : 'border-transparent text-obsidian-500 hover:text-obsidian-300'}`}>
                {tab === 'specs' ? 'Specifications' : tab === 'description' ? 'Description' : 'Shipping & Returns'}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {Object.entries(specs).filter(([, v]) => v).map(([key, value]) => (
                <div key={key} className="p-4 bg-obsidian-900 border border-obsidian-800">
                  <p className="text-xs font-mono text-obsidian-500 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-sm text-obsidian-200 font-medium">{value}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'description' && (
            <div className="max-w-3xl animate-fade-in">
              <p className="text-obsidian-400 leading-relaxed text-base">{camera.description}</p>
              <div className="mt-6 p-6 bg-obsidian-900 border border-obsidian-800">
                <p className="text-sm font-mono text-obsidian-500 uppercase tracking-widest mb-3">In The Box</p>
                <ul className="space-y-2">
                  {['Camera body', 'Battery', 'Battery charger', 'Shoulder strap', 'USB cable', 'Lens cap', 'User manual'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-obsidian-300"><span className="w-1 h-1 bg-gold-500 rounded-full" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="max-w-3xl grid gap-4 animate-fade-in">
              {[[Truck, 'Free Standard Shipping', 'Free on orders over Rs 50,000. 5-7 business days.'], [Zap, 'Express Delivery', 'Available for Rs 3,000. 2-3 business days.'], [Globe, 'International', 'Available to 50+ countries. 7-14 business days.'], [RotateCcw, 'Free Returns', '30-day return policy. Item must be in original condition.']].map(([Icon, title, desc]) => (
                <div key={title} className="p-5 bg-obsidian-900 border border-obsidian-800">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-obsidian-200 font-medium mb-1">{title}</h4>
                      <p className="text-sm text-obsidian-500">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
