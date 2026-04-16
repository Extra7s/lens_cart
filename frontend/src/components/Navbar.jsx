import { Heart, Search, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { getBrands, getCategories } from '../utils/mockData.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(getCategories());
  const [brands, setBrands] = useState(getBrands());
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);
  
  useEffect(() => {
    setCategories(getCategories());
    setBrands(getBrands());
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-pastelblue shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {/* Mascot */}
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-lavender group-hover:text-softpink transition-colors animate-float">
                <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.2"/>
                <circle cx="12" cy="14" r="2" fill="currentColor"/>
                <circle cx="20" cy="14" r="2" fill="currentColor"/>
                <path d="M12 20 Q16 24 20 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                <ellipse cx="16" cy="18" rx="1" ry="0.5" fill="currentColor"/>
              </svg>
              {/* Camera Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-lavender group-hover:text-softpink transition-colors">
                <rect x="3" y="6" width="18" height="12" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="19" cy="9" r="1.5" fill="currentColor"/>
              </svg>
              <span className="font-display text-xl font-bold bg-gradient-to-r from-lavender to-softpink bg-clip-text text-transparent">
                DIGIPIXEL.NP
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-lavender transition-colors tracking-wide">Shop</Link>
              {categories.filter(c => c !== 'All').slice(0, 3).map(cat => (
                <Link key={cat} to={`/?category=${cat}`} className="text-sm font-medium text-gray-600 hover:text-lavender transition-colors tracking-wide">{cat}</Link>
              ))}
              {categories.filter(c => c !== 'All').length > 3 && (
                <div className="relative group">
                  <button className="text-sm font-medium text-gray-600 hover:text-lavender transition-colors tracking-wide flex items-center gap-1">
                    More
                    <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-pastelblue rounded-xl shadow-lg z-50 hidden group-hover:block">
                    {categories.filter(c => c !== 'All').slice(3).map(cat => (
                      <Link key={cat} to={`/?category=${cat}`} className="block px-4 py-2 text-sm text-gray-600 hover:text-lavender hover:bg-pastelblue/10 transition-colors border-b border-pastelblue/20 last:border-b-0 rounded-b-xl">
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {isAdmin && <Link to="/admin" className="text-sm font-medium text-gold-500 hover:text-gold-400 transition-colors tracking-wide border border-gold-500/30 px-3 py-1">Admin</Link>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)} className="p-2.5 text-gray-600 hover:text-lavender transition-colors rounded-full hover:bg-pastelblue/20">
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              {user && (
                <Link to="/wishlist" className="relative p-2.5 text-gray-600 hover:text-lavender transition-colors rounded-full hover:bg-pastelblue/20">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-softpink text-white text-[10px] font-bold flex items-center justify-center rounded-full">{wishlist.length}</span>}
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-lavender transition-colors rounded-full hover:bg-pastelblue/20">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-lavender text-white text-[10px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="hidden md:flex items-center gap-1 relative group">
                  <span className="text-sm text-gray-600 font-medium px-2 py-1 rounded hover:bg-pastelblue/20 transition-colors cursor-pointer">{user.name?.split(' ')[0]}</span>
                  <div className="absolute right-0 top-12 w-40 bg-white border border-pastelblue rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-600 hover:text-lavender hover:bg-pastelblue/10 transition-colors border-b border-pastelblue/20">Profile Settings</Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-softpink hover:bg-pastelblue/10 transition-colors rounded-b-xl">Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/auth" className="hidden md:block btn-primary py-2 px-4 text-xs">Sign In</Link>
              )}

              {/* Mobile menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 text-gray-600 hover:text-lavender transition-colors rounded-full hover:bg-pastelblue/20">
                <div className="w-5 flex flex-col gap-1">
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}/>
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
                  <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}/>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-pastelblue px-4 py-4 space-y-3 shadow-lg">
            <Link to="/" className="block text-sm font-medium text-gray-600 hover:text-lavender py-2 transition-colors">Shop All</Link>
            {categories.filter(c => c !== 'All').map(cat => (
              <Link key={cat} to={`/?category=${cat}`} className="block text-sm font-medium text-gray-600 hover:text-lavender py-2 transition-colors">{cat}</Link>
            ))}
            {isAdmin && <Link to="/admin" className="block text-sm font-medium text-lavender py-2">Admin Dashboard</Link>}
            <div className="pt-2 border-t border-pastelblue/30">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-medium px-2">{user.name}</p>
                  <Link to="/profile" className="block text-sm text-gray-600 hover:text-lavender hover:bg-pastelblue/10 px-2 py-2 rounded-lg transition-colors">Profile Settings</Link>
                  <button onClick={logout} className="w-full text-left text-sm text-softpink hover:text-lavender hover:bg-pastelblue/10 px-2 py-2 rounded-lg transition-colors">Logout</button>
                </div>
              ) : (
                <Link to="/auth" className="block btn-primary text-center py-3">Sign In / Register</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex items-start justify-center pt-24 px-4" onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
          <div className="w-full max-w-2xl animate-fade-up">
            <form onSubmit={handleSearch} className="flex gap-0">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cameras by name or brand..."
                className="input flex-1 text-base py-4 px-6 border-lavender"
              />
              <button type="submit" className="btn-primary px-8">Search</button>
            </form>
            <p className="text-gray-500 text-sm mt-3 text-center">Press <kbd className="font-mono bg-pastelblue px-1.5 py-0.5 text-gray-600">Esc</kbd> to close</p>
          </div>
        </div>
      )}
    </>
  );
}
