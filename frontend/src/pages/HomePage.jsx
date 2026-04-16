import { Camera, ChevronDown, Film, Smartphone } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CameraCard from '../components/CameraCard.jsx';
import { CameraCardSkeleton } from '../components/Skeleton.jsx';
import { productsAPI } from '../utils/api.js';
import { getBrands, getCategories } from '../utils/mockData.js';

const SORT_OPTIONS = [
  { value: '', label: 'Latest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState(getCategories());
  const [brands, setBrands] = useState(getBrands());

  const category = searchParams.get('category') || 'All';
  const brand = searchParams.get('brand') || 'All';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    setCategories(getCategories());
    setBrands(getBrands());
  }, []);

  const setParam = (key, val) => {
    const params = new URLSearchParams(searchParams);
    if (!val || val === 'All' || val === '') params.delete(key);
    else params.set(key, val);
    setSearchParams(params);
  };

  const fetchCameras = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (brand !== 'All') params.brand = brand;
      if (sort) params.sort = sort;
      if (search) params.search = search;
      const { data } = await productsAPI.getAll(params);
      setCameras(data);
      setTotalCount(data.length);
    } catch { setCameras([]); } finally { setLoading(false); }
  }, [category, brand, sort, search]);

  useEffect(() => { fetchCameras(); }, [fetchCameras]);

  const featuredCameras = cameras.filter(c => c.featured).slice(0, 3);
  const isFiltered = category !== 'All' || brand !== 'All' || search || sort;

  return (
    <div className="min-h-screen bg-skyblue">
      {/* Hero */}
      {!isFiltered && (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-skyblue via-pastelblue to-mint opacity-80"></div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            {/* Mascot and Camera Illustration */}
            <div className="flex items-center justify-center gap-6 mb-8 animate-fade-up">
              <svg width="80" height="80" viewBox="0 0 32 32" className="text-lavender drop-shadow-lg animate-float">
                <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.2"/>
                <circle cx="12" cy="14" r="2" fill="currentColor"/>
                <circle cx="20" cy="14" r="2" fill="currentColor"/>
                <path d="M12 20 Q16 24 20 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                <ellipse cx="16" cy="18" rx="1" ry="0.5" fill="currentColor"/>
              </svg>
              <svg width="60" height="60" viewBox="0 0 24 24" className="text-softpink drop-shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                <rect x="3" y="6" width="18" height="12" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="19" cy="9" r="1.5" fill="currentColor"/>
              </svg>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-6 bg-gradient-to-r from-lavender via-softpink to-lavender bg-clip-text text-transparent animate-fade-up">
              DIGIPIXEL.NP
            </h1>
            <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up">
              Capture every moment with creativity and precision. Premium cameras for photographers and dreamers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
              <button onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })} className="btn-primary px-8 py-4 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                Shop Now
              </button>
              <Link to="/?category=Mirrorless" className="btn-secondary px-8 py-4 text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                View Mirrorless
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
            <span className="text-xs font-mono tracking-widest">SCROLL</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </section>
      )}

      {/* Featured */}
      {!isFiltered && featuredCameras.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-mono text-lavender tracking-widest uppercase mb-1">Handpicked Selection</p>
              <h2 className="text-3xl font-bold text-gray-800">Featured Cameras</h2>
            </div>
            <Link to="/?sort=rating" className="btn-ghost hidden sm:block">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCameras.map((cam, i) => <CameraCard key={cam._id} camera={cam} index={i} />)}
          </div>
        </section>
      )}

      {/* Category Strip */}
      {!isFiltered && (
        <section className="border-y border-pastelblue bg-pastelblue/20 py-8 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex gap-4 min-w-max">
              {categories.filter(c => c !== 'All').map(cat => {
                const getCategoryIcon = () => {
                  switch(cat) {
                    case 'Mirrorless': return <Camera className="w-6 h-6" />;
                    case 'DSLR': return <Camera className="w-6 h-6" />;
                    case 'Compact': return <Smartphone className="w-6 h-6" />;
                    case 'Action': return <Film className="w-6 h-6" />;
                    case 'Medium Format': return <Film className="w-6 h-6" />;
                    default: return <Film className="w-6 h-6" />;
                  }
                };
                return (
                  <Link key={cat} to={`/?category=${cat}`} className="group flex flex-col items-center gap-2 px-6 py-3 border border-pastelblue hover:border-lavender transition-all duration-200 cursor-pointer hover:bg-lavender/10 rounded-xl">
                    <div className="text-gray-600 group-hover:text-lavender transition-colors">
                      {getCategoryIcon()}
                    </div>
                    <span className="text-xs font-mono text-gray-600 group-hover:text-lavender tracking-wider uppercase transition-colors">{cat}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Shop */}
      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            {search ? (
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Search Results</p>
                <h2 className="text-2xl font-bold text-gray-800">"{search}"</h2>
              </div>
            ) : (
              <div>
                <p className="text-xs font-mono text-lavender uppercase tracking-widest mb-1">{category !== 'All' ? category : 'All Cameras'}</p>
                <h2 className="text-2xl font-bold text-gray-800">{category !== 'All' ? `${category} Cameras` : 'Our Collection'}</h2>
              </div>
            )}
            {!loading && <p className="text-gray-500 text-sm mt-1">{totalCount} {totalCount === 1 ? 'product' : 'products'} found</p>}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="input w-full md:w-48 bg-white"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Category Filter */}
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Category</p>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setParam('category', cat)}
                      className={`w-full text-left px-3 py-2 text-sm transition-all duration-150 border-l-2 rounded-r-lg ${
                        category === cat ? 'border-lavender text-lavender bg-lavender/10' : 'border-transparent text-gray-600 hover:text-lavender hover:border-pastelblue hover:bg-pastelblue/10'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3">Brand</p>
                <div className="space-y-1">
                  {brands.map(b => (
                    <button key={b} onClick={() => setParam('brand', b)}
                      className={`w-full text-left px-3 py-2 text-sm transition-all duration-150 border-l-2 rounded-r-lg ${
                        brand === b ? 'border-lavender text-lavender bg-lavender/10' : 'border-transparent text-gray-600 hover:text-lavender hover:border-pastelblue hover:bg-pastelblue/10'
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {isFiltered && (
                <button onClick={() => setSearchParams({})} className="w-full text-xs font-mono text-softpink hover:text-lavender border border-softpink/30 hover:border-softpink/60 py-2 transition-colors rounded-lg">
                  CLEAR FILTERS
                </button>
              )}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => <CameraCardSkeleton key={i} />)}
              </div>
            ) : cameras.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-pastelblue flex items-center justify-center mb-6 rounded-full shadow-sm">
                  <svg className="w-10 h-10 text-lavender" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <h3 className="font-display text-xl text-gray-700 mb-2">No Cameras Found</h3>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search query</p>
                <button onClick={() => setSearchParams({})} className="btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {cameras.map((cam, i) => <CameraCard key={cam._id} camera={cam} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      {!isFiltered && (
        <section className="bg-obsidian-900 border-y border-obsidian-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[['10,000+', 'Happy Customers'], ['150+', 'Camera Models'], ['24/7', 'Expert Support'], ['Free', 'Returns']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-gradient mb-1">{num}</p>
                <p className="text-obsidian-500 text-sm uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
