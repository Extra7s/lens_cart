import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function CameraCard({ camera, index = 0 }) {
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const wishlisted = isWishlisted(camera._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast({ message: 'Sign in to add items to cart', type: 'info' }); return; }
    if (camera.stock === 0) return;
    try {
      setAdding(true);
      await addToCart(camera._id);
      toast({ message: `${camera.name} added to cart`, type: 'success' });
    } catch { toast({ message: 'Failed to add to cart', type: 'error' }); }
    finally { setAdding(false); }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast({ message: 'Sign in to save to wishlist', type: 'info' }); return; }
    try {
      const added = await toggleWishlist(camera._id);
      toast({ message: added ? `Saved to wishlist` : `Removed from wishlist`, type: 'success' });
    } catch { toast({ message: 'Failed to update wishlist', type: 'error' }); }
  };

  const fallbackImg = `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=60`;

  return (
    <div className="card group relative flex flex-col animate-fade-up" style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}>
      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="badge bg-obsidian-950/80 backdrop-blur-sm text-obsidian-300 border border-obsidian-700">{camera.category}</span>
      </div>

      {/* Stock Badge */}
      {camera.stock === 0 && (
        <div className="absolute top-3 right-12 z-10">
          <span className="badge bg-ember-500/20 text-ember-400 border border-ember-500/30">Out of Stock</span>
        </div>
      )}
      {camera.stock > 0 && camera.stock <= 5 && (
        <div className="absolute top-3 right-12 z-10">
          <span className="badge bg-gold-500/20 text-gold-400 border border-gold-500/30">Only {camera.stock} left</span>
        </div>
      )}

      {/* Wishlist */}
      <button onClick={handleWishlist} className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-200 ${wishlisted ? 'text-ember-400' : 'text-obsidian-500 hover:text-ember-400'}`}>
        <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>

      {/* Image */}
      <Link to={`/camera/${camera._id}`} className="block overflow-hidden aspect-[4/3] bg-obsidian-900">
        <img
          src={imgError ? fallbackImg : camera.image}
          alt={camera.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link to={`/camera/${camera._id}`} className="flex-1">
          <p className="text-xs font-mono text-obsidian-500 tracking-widest uppercase mb-1">{camera.brand}</p>
          <h3 className="font-display text-base font-semibold text-obsidian-100 group-hover:text-gold-400 transition-colors leading-tight mb-2 line-clamp-2">{camera.name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className={`w-3 h-3 ${i <= Math.round(camera.rating) ? 'text-gold-400' : 'text-obsidian-700'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-obsidian-500">({camera.reviewCount})</span>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-obsidian-700">
          <div>
            <p className="text-xl font-display font-bold text-gold-400">${camera.price.toLocaleString()}</p>
            {camera.stock > 0 && <p className="text-xs text-obsidian-500">{camera.stock} in stock</p>}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding || camera.stock === 0}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 active:scale-95
              ${camera.stock === 0 ? 'bg-obsidian-700 text-obsidian-500 cursor-not-allowed' : 'bg-gold-500 hover:bg-gold-400 text-obsidian-950 hover:shadow-[0_0_20px_rgba(232,169,0,0.3)]'}
              ${adding ? 'opacity-70' : ''}
            `}
          >
            {adding ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            )}
            {camera.stock === 0 ? 'Sold Out' : adding ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
