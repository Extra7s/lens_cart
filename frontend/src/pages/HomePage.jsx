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
    <div className="min-h-screen">
      {/* Hero */}
      {!isFiltered && (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden noise-overlay">
          {/* Background */}
          <div className="absolute inset-0 bg-obsidian-950">
            <img src="https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=1600&auto=format&fit=crop&q=60" alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/40 via-obsidian-950/60 to-obsidian-950" />
          </div>

          {/* Decorative lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-obsidian-800/60 backdrop-blur-sm border border-obsidian-700 px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-obsidian-400 tracking-widest uppercase">New Arrivals for 2024</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-6">
              <span className="text-obsidian-50">See the</span><br/>
              <span className="text-gradient">World</span>
              <span className="text-obsidian-50"> in Focus</span>
            </h1>
            <p className="text-obsidian-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Professional cameras for photographers who refuse to compromise. From mirrorless to medium format — find your perfect tool.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })} className="btn-primary px-8 py-4 text-sm">
                Shop Now
              </button>
              <Link to="/?category=Mirrorless" className="btn-secondary px-8 py-4 text-sm">
                View Mirrorless
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-obsidian-600 animate-bounce">
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
              <p className="text-xs font-mono text-gold-500 tracking-widest uppercase mb-1">Handpicked Selection</p>
              <h2 className="section-title">Featured Cameras</h2>
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
        <section className="border-y border-obsidian-800 bg-obsidian-900/50 py-8 overflow-x-auto">
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
                  <Link key={cat} to={`/?category=${cat}`} className="group flex flex-col items-center gap-2 px-6 py-3 border border-obsidian-700 hover:border-gold-500 transition-all duration-200 cursor-pointer hover:bg-gold-500/5">
                    <div className="text-obsidian-400 group-hover:text-gold-400 transition-colors">
                      {getCategoryIcon()}
                    </div>
                    <span className="text-xs font-mono text-obsidian-400 group-hover:text-gold-400 tracking-wider uppercase transition-colors">{cat}</span>
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
                <p className="text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-1">Search Results</p>
                <h2 className="section-title text-2xl">"{search}"</h2>
              </div>
            ) : (
              <div>
                <p className="text-xs font-mono text-gold-500 uppercase tracking-widest mb-1">{category !== 'All' ? category : 'All Cameras'}</p>
                <h2 className="section-title text-2xl">{category !== 'All' ? `${category} Cameras` : 'Our Collection'}</h2>
              </div>
            )}
            {!loading && <p className="text-obsidian-500 text-sm mt-1">{totalCount} {totalCount === 1 ? 'product' : 'products'} found</p>}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="input w-full md:w-48 bg-obsidian-900"
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
                <p className="text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-3">Category</p>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setParam('category', cat)}
                      className={`w-full text-left px-3 py-2 text-sm transition-all duration-150 border-l-2 ${
                        category === cat ? 'border-gold-500 text-gold-400 bg-gold-500/5' : 'border-transparent text-obsidian-400 hover:text-obsidian-200 hover:border-obsidian-600'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <p className="text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-3">Brand</p>
                <div className="space-y-1">
                  {brands.map(b => (
                    <button key={b} onClick={() => setParam('brand', b)}
                      className={`w-full text-left px-3 py-2 text-sm transition-all duration-150 border-l-2 ${
                        brand === b ? 'border-gold-500 text-gold-400 bg-gold-500/5' : 'border-transparent text-obsidian-400 hover:text-obsidian-200 hover:border-obsidian-600'
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {isFiltered && (
                <button onClick={() => setSearchParams({})} className="w-full text-xs font-mono text-ember-400 hover:text-ember-300 border border-ember-500/30 hover:border-ember-500/60 py-2 transition-colors">
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
                <div className="w-20 h-20 bg-obsidian-800 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-obsidian-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <h3 className="font-display text-xl text-obsidian-300 mb-2">No Cameras Found</h3>
                <p className="text-obsidian-600 text-sm mb-6">Try adjusting your filters or search query</p>
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
