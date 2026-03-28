import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CameraCard from '../components/CameraCard.jsx';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 bg-obsidian-800 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-obsidian-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <h2 className="font-display text-2xl text-obsidian-200 mb-3">Sign In to View Wishlist</h2>
        <Link to="/auth" className="btn-primary">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-mono text-gold-500 uppercase tracking-widest mb-1">Saved Items</p>
            <h1 className="section-title">My Wishlist</h1>
            <p className="text-obsidian-500 text-sm mt-1">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-obsidian-800 border border-obsidian-700 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-obsidian-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </div>
            <h3 className="font-display text-xl text-obsidian-300 mb-2">Your wishlist is empty</h3>
            <p className="text-obsidian-600 text-sm mb-6">Save cameras you love for later</p>
            <Link to="/" className="btn-primary">Browse Cameras</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((cam, i) => <CameraCard key={cam._id} camera={cam} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
