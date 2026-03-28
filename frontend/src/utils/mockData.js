export const MOCK_CAMERAS = [
  {
    _id: '1', name: 'Sony Alpha A7 IV', brand: 'Sony', price: 2498,
    description: 'The Sony A7 IV is a versatile full-frame mirrorless camera combining advanced stills and video capabilities. With a 33MP BSI sensor, 759-point phase-detection AF, and 4K 60fps video, it\'s the perfect hybrid camera for photographers and videographers alike.',
    specifications: { sensor: '33MP Full-Frame BSI CMOS', resolution: '33 Megapixels', iso: '100–51200 (exp. 50–204800)', shutterSpeed: '1/8000 to 30s', autofocus: '759-point Phase Detection', video: '4K 60fps, FHD 120fps', battery: 'NP-FZ100 (~580 shots)', weight: '658g', dimensions: '131.3 × 96.4 × 79.8mm' },
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    stock: 15, category: 'Mirrorless', featured: true, rating: 4.8, reviewCount: 342,
  },
  {
    _id: '2', name: 'Canon EOS R5', brand: 'Canon', price: 3399,
    description: 'The Canon EOS R5 sets a new standard for full-frame mirrorless cameras with its groundbreaking 45MP resolution, in-body image stabilization, and extraordinary 8K RAW video recording capabilities.',
    specifications: { sensor: '45MP Full-Frame CMOS', resolution: '45 Megapixels', iso: '100–51200', shutterSpeed: '1/8000 to 30s', autofocus: 'Dual Pixel CMOS AF II', video: '8K RAW 30fps, 4K 120fps', battery: 'LP-E6NH (~320 shots)', weight: '738g', dimensions: '138.5 × 97.5 × 88mm' },
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop&q=80',
    stock: 8, category: 'Mirrorless', featured: true, rating: 4.9, reviewCount: 218,
  },
  {
    _id: '3', name: 'Nikon Z6 III', brand: 'Nikon', price: 1999,
    description: 'The Nikon Z6 III delivers stunning performance with a partially stacked CMOS sensor and pro-grade video capabilities including 6K RAW output, making it a powerhouse for content creators.',
    specifications: { sensor: '24.5MP Partial Stacked CMOS', resolution: '24.5 Megapixels', iso: '100–64000', shutterSpeed: '1/8000 to 900s', autofocus: '273-point Phase Detection', video: '6K RAW 60fps', battery: 'EN-EL15c (~340 shots)', weight: '760g', dimensions: '139 × 102 × 69mm' },
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    stock: 12, category: 'Mirrorless', featured: false, rating: 4.7, reviewCount: 156,
  },
  {
    _id: '4', name: 'Fujifilm X-T5', brand: 'Fujifilm', price: 1699,
    description: 'The X-T5 packs a 40MP sensor and Fujifilm\'s legendary film simulations into a compact retro-styled body, perfect for photography purists who demand the best image quality in a portable package.',
    specifications: { sensor: '40.2MP APS-C X-Trans CMOS 5 HR', resolution: '40.2 Megapixels', iso: '125–12800', shutterSpeed: '1/8000 to 900s', autofocus: '425-point Phase Detection', video: '6.2K 30fps, 4K 60fps', battery: 'NP-W235 (~580 shots)', weight: '557g', dimensions: '129.5 × 91 × 63.8mm' },
    image: 'https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=800&auto=format&fit=crop&q=80',
    stock: 20, category: 'Mirrorless', featured: true, rating: 4.8, reviewCount: 289,
  },
  {
    _id: '5', name: 'Canon EOS 5D Mark IV', brand: 'Canon', price: 2499,
    description: 'The EOS 5D Mark IV is a workhorse DSLR beloved by professional photographers worldwide for its reliability, outstanding image quality, and 4K video capabilities.',
    specifications: { sensor: '30.4MP Full-Frame CMOS', resolution: '30.4 Megapixels', iso: '100–32000', shutterSpeed: '1/8000 to 30s', autofocus: '61-point AF system', video: '4K 30fps, FHD 60fps', battery: 'LP-E6N (~900 shots)', weight: '800g', dimensions: '150.7 × 116.4 × 75.9mm' },
    image: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&auto=format&fit=crop&q=80',
    stock: 6, category: 'DSLR', featured: false, rating: 4.7, reviewCount: 524,
  },
  {
    _id: '6', name: 'Nikon D850', brand: 'Nikon', price: 2796,
    description: 'The D850 remains one of the finest DSLRs ever made, combining a 45.7MP BSI sensor with extraordinary dynamic range, 7fps burst shooting, and weather sealing.',
    specifications: { sensor: '45.7MP Full-Frame BSI CMOS', resolution: '45.7 Megapixels', iso: '64–25600', shutterSpeed: '1/8000 to 30s', autofocus: '153-point Multi-CAM 20K', video: '4K UHD 30fps', battery: 'EN-EL15b (~1840 shots)', weight: '915g', dimensions: '146 × 124 × 78.5mm' },
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&auto=format&fit=crop&q=80',
    stock: 9, category: 'DSLR', featured: false, rating: 4.9, reviewCount: 412,
  },
  {
    _id: '7', name: 'GoPro Hero 12 Black', brand: 'GoPro', price: 399,
    description: 'The ultimate action camera with 5.3K video at 60fps, HyperSmooth 6.0 stabilization, and a new 1/1.9" sensor for better low-light performance.',
    specifications: { sensor: '1/1.9" CMOS', resolution: '27MP', iso: '100–6400', shutterSpeed: '1/2000 to 1/120', autofocus: 'Fixed Focus', video: '5.3K 60fps, 4K 120fps', battery: 'Enduro (~70 mins)', weight: '154g', dimensions: '71.8 × 50.8 × 33.6mm' },
    image: 'https://images.unsplash.com/photo-1588624986527-cf26b69bc4a6?w=800&auto=format&fit=crop&q=80',
    stock: 35, category: 'Action', featured: false, rating: 4.6, reviewCount: 891,
  },
  {
    _id: '8', name: 'Sony ZV-1 II', brand: 'Sony', price: 749,
    description: 'Built for vloggers and content creators, the ZV-1 II features a wide 18-50mm equivalent zoom lens, excellent autofocus tracking, and a flip-out screen for self-shooting.',
    specifications: { sensor: '1-inch Stacked CMOS', resolution: '20.1MP', iso: '125–12800', shutterSpeed: '1/2000 to 30s', autofocus: 'Fast Hybrid AF', video: '4K 30fps, FHD 120fps', battery: 'NP-BX1 (~260 shots)', weight: '291g', dimensions: '105.5 × 60 × 43.5mm' },
    image: 'https://images.unsplash.com/photo-1608491569567-cb404b4db940?w=800&auto=format&fit=crop&q=80',
    stock: 25, category: 'Compact', featured: false, rating: 4.5, reviewCount: 167,
  },
  {
    _id: '9', name: 'Leica M11', brand: 'Leica', price: 8995,
    description: 'The Leica M11 is the pinnacle of rangefinder photography — 60MP in an iconic, understated package. Handcrafted in Germany, it represents the ultimate in photographic craftsmanship.',
    specifications: { sensor: '60MP Full-Frame BSI CMOS', resolution: '60 Megapixels', iso: '64–50000', shutterSpeed: '1/4000 to 120min', autofocus: 'Manual Focus (Rangefinder)', video: 'No video', battery: 'BP-SCL7 (~700 shots)', weight: '530g', dimensions: '138.6 × 80.3 × 38.5mm' },
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=800&auto=format&fit=crop&q=80',
    stock: 3, category: 'Mirrorless', featured: true, rating: 5.0, reviewCount: 43,
  },
  {
    _id: '10', name: 'Fujifilm GFX 100S II', brand: 'Fujifilm', price: 4999,
    description: 'Medium format photography democratized. The GFX 100S II offers a 102MP sensor in a relatively compact body, delivering unparalleled image quality and tonal depth.',
    specifications: { sensor: '102MP Medium Format BSI CMOS', resolution: '102 Megapixels', iso: '80–12800', shutterSpeed: '1/4000 to 3600s', autofocus: 'Phase Detection AF', video: '4K 30fps', battery: 'NP-W235 (~440 shots)', weight: '883g', dimensions: '150 × 104.2 × 87.2mm' },
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80',
    stock: 5, category: 'Medium Format', featured: true, rating: 4.9, reviewCount: 67,
  },
  {
    _id: '11', name: 'DJI Osmo Action 4', brand: 'DJI', price: 199,
    description: 'A robust action camera featuring a 1/1.3" sensor, 4K 120fps video, 10-bit D-Log, and bidirectional dual-screen design for extreme outdoor adventures.',
    specifications: { sensor: '1/1.3" CMOS', resolution: '10MP', iso: '100–6400', shutterSpeed: '1/8000 to 2s', autofocus: 'Fixed Focus', video: '4K 120fps, 2.7K 120fps', battery: 'Built-in (~160 mins)', weight: '145g', dimensions: '70.5 × 44.2 × 32.8mm' },
    image: 'https://images.unsplash.com/photo-1519183071298-a2962feb14f4?w=800&auto=format&fit=crop&q=80',
    stock: 40, category: 'Action', featured: false, rating: 4.5, reviewCount: 234,
  },
  {
    _id: '12', name: 'Pentax K-3 Mark III', brand: 'Pentax', price: 1599,
    description: 'A rugged, weather-sealed APS-C DSLR built to last a lifetime. The K-3 III features a 25.7MP sensor, 5-axis IBIS, and Ricoh\'s legendary build quality.',
    specifications: { sensor: '25.7MP APS-C CMOS', resolution: '25.7 Megapixels', iso: '100–1600000', shutterSpeed: '1/8000 to 30s', autofocus: '101-point SAFOX 13', video: '4K 30fps', battery: 'D-LI90P (~800 shots)', weight: '820g', dimensions: '134.5 × 103.5 × 73.5mm' },
    image: 'https://images.unsplash.com/photo-1584038877214-ebb1ad8c0d77?w=800&auto=format&fit=crop&q=80',
    stock: 7, category: 'DSLR', featured: false, rating: 4.6, reviewCount: 89,
  },
];

// Helper functions to get and manage dynamic categories and brands
export const getCategories = () => {
  try {
    const saved = localStorage.getItem('lc_categories');
    return saved ? JSON.parse(saved) : ['All', 'Mirrorless', 'DSLR', 'Compact', 'Action', 'Medium Format', 'Film'];
  } catch {
    return ['All', 'Mirrorless', 'DSLR', 'Compact', 'Action', 'Medium Format', 'Film'];
  }
};

export const getBrands = () => {
  try {
    const saved = localStorage.getItem('lc_brands');
    return saved ? JSON.parse(saved) : ['All', 'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Leica', 'GoPro', 'DJI', 'Pentax', 'Olympus'];
  } catch {
    return ['All', 'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Leica', 'GoPro', 'DJI', 'Pentax', 'Olympus'];
  }
};

export const addCategory = (category) => {
  try {
    const categories = getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      localStorage.setItem('lc_categories', JSON.stringify(categories));
    }
    return categories;
  } catch (err) {
    return getCategories();
  }
};

export const addBrand = (brand) => {
  try {
    const brands = getBrands();
    if (!brands.includes(brand) && brand !== 'All') {
      brands.push(brand);
      localStorage.setItem('lc_brands', JSON.stringify(brands));
    }
    return brands;
  } catch (err) {
    return getBrands();
  }
};

// Backward compatible exports for existing code
export const CATEGORIES = getCategories();
export const BRANDS = getBrands();
