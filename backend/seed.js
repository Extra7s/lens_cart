const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Camera = require('./models/Camera');
const User = require('./models/User');

dotenv.config();

const cameras = [
  {
    name: 'Sony Alpha A7 IV', brand: 'Sony', price: 2498,
    description: 'The Sony A7 IV is a versatile full-frame mirrorless camera combining advanced stills and video capabilities in one refined body.',
    specifications: { sensor: '33MP Full-Frame BSI CMOS', resolution: '33 Megapixels', iso: '100-51200 (exp. 50-204800)', shutterSpeed: '1/8000 to 30s', autofocus: '759-point Phase Detection', video: '4K 60fps, FHD 120fps', battery: 'NP-FZ100, ~580 shots', weight: '658g', dimensions: '131.3 x 96.4 x 79.8mm' },
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
    stock: 15, category: 'Mirrorless', featured: true, rating: 4.8, reviewCount: 342,
  },
  {
    name: 'Canon EOS R5', brand: 'Canon', price: 3399,
    description: 'The Canon EOS R5 sets a new standard for full-frame mirrorless cameras with 45MP resolution and 8K RAW video recording.',
    specifications: { sensor: '45MP Full-Frame CMOS', resolution: '45 Megapixels', iso: '100-51200', shutterSpeed: '1/8000 to 30s', autofocus: 'Dual Pixel CMOS AF II', video: '8K RAW 30fps, 4K 120fps', battery: 'LP-E6NH, ~320 shots', weight: '738g', dimensions: '138.5 x 97.5 x 88mm' },
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=800&auto=format&fit=crop',
    stock: 8, category: 'Mirrorless', featured: true, rating: 4.9, reviewCount: 218,
  },
  {
    name: 'Nikon Z6 III', brand: 'Nikon', price: 1999,
    description: 'The Nikon Z6 III delivers stunning performance with a partially stacked CMOS sensor and pro-grade video capabilities.',
    specifications: { sensor: '24.5MP Partial Stacked CMOS', resolution: '24.5 Megapixels', iso: '100-64000', shutterSpeed: '1/8000 to 900s', autofocus: '273-point Phase Detection', video: '6K RAW 60fps', battery: 'EN-EL15c, ~340 shots', weight: '760g', dimensions: '139 x 102 x 69mm' },
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop',
    stock: 12, category: 'Mirrorless', featured: false, rating: 4.7, reviewCount: 156,
  },
  {
    name: 'Fujifilm X-T5', brand: 'Fujifilm', price: 1699,
    description: 'The X-T5 packs a 40MP sensor into a compact retro-styled body, perfect for photography purists who demand the best image quality.',
    specifications: { sensor: '40.2MP APS-C X-Trans CMOS 5 HR', resolution: '40.2 Megapixels', iso: '125-12800', shutterSpeed: '1/8000 to 900s', autofocus: '425-point Phase Detection', video: '6.2K 30fps, 4K 60fps', battery: 'NP-W235, ~580 shots', weight: '557g', dimensions: '129.5 x 91 x 63.8mm' },
    image: 'https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=800&auto=format&fit=crop',
    stock: 20, category: 'Mirrorless', featured: true, rating: 4.8, reviewCount: 289,
  },
  {
    name: 'Canon EOS 5D Mark IV', brand: 'Canon', price: 2499,
    description: 'The EOS 5D Mark IV is a workhorse DSLR beloved by professional photographers worldwide for its reliability and image quality.',
    specifications: { sensor: '30.4MP Full-Frame CMOS', resolution: '30.4 Megapixels', iso: '100-32000', shutterSpeed: '1/8000 to 30s', autofocus: '61-point AF', video: '4K 30fps, FHD 60fps', battery: 'LP-E6N, ~900 shots', weight: '800g', dimensions: '150.7 x 116.4 x 75.9mm' },
    image: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&auto=format&fit=crop',
    stock: 6, category: 'DSLR', featured: false, rating: 4.7, reviewCount: 524,
  },
  {
    name: 'Nikon D850', brand: 'Nikon', price: 2796,
    description: 'The D850 remains one of the finest DSLRs ever made, combining a 45.7MP sensor with extraordinary dynamic range and weather sealing.',
    specifications: { sensor: '45.7MP Full-Frame BSI CMOS', resolution: '45.7 Megapixels', iso: '64-25600', shutterSpeed: '1/8000 to 30s', autofocus: '153-point Multi-CAM 20K', video: '4K UHD 30fps', battery: 'EN-EL15b, ~1840 shots', weight: '915g', dimensions: '146 x 124 x 78.5mm' },
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop',
    stock: 9, category: 'DSLR', featured: false, rating: 4.9, reviewCount: 412,
  },
  {
    name: 'GoPro Hero 12 Black', brand: 'GoPro', price: 399,
    description: 'The ultimate action camera with 5.3K video, horizon lock, and incredible HyperSmooth 6.0 stabilization.',
    specifications: { sensor: '1/1.9" CMOS', resolution: '27MP', iso: '100-6400', shutterSpeed: '1/2000 to 1/120', autofocus: 'Fixed Focus', video: '5.3K 60fps, 4K 120fps', battery: 'Enduro, ~70 mins', weight: '154g', dimensions: '71.8 x 50.8 x 33.6mm' },
    image: 'https://images.unsplash.com/photo-1588624986527-cf26b69bc4a6?w=800&auto=format&fit=crop',
    stock: 35, category: 'Action', featured: false, rating: 4.6, reviewCount: 891,
  },
  {
    name: 'Sony ZV-1 II', brand: 'Sony', price: 749,
    description: 'A versatile vlogging compact camera with a wide zoom lens and excellent video autofocus for content creators.',
    specifications: { sensor: '1-inch Stacked CMOS', resolution: '20.1MP', iso: '125-12800', shutterSpeed: '1/2000 to 30s', autofocus: 'Fast Hybrid AF', video: '4K 30fps, FHD 60fps', battery: 'NP-BX1, ~260 shots', weight: '291g', dimensions: '105.5 x 60 x 43.5mm' },
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop',
    stock: 25, category: 'Compact', featured: false, rating: 4.5, reviewCount: 167,
  },
  {
    name: 'Leica M11', brand: 'Leica', price: 8995,
    description: 'The Leica M11 is the pinnacle of rangefinder photography, offering 60MP in an iconic, understated package.',
    specifications: { sensor: '60MP Full-Frame BSI CMOS', resolution: '60 Megapixels', iso: '64-50000', shutterSpeed: '1/4000 to 120min', autofocus: 'Manual Focus (Rangefinder)', video: 'No video', battery: 'BP-SCL7, ~700 shots', weight: '530g', dimensions: '138.6 x 80.3 x 38.5mm' },
    image: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=800&auto=format&fit=crop',
    stock: 3, category: 'Mirrorless', featured: true, rating: 5.0, reviewCount: 43,
  },
  {
    name: 'Olympus OM-5', brand: 'Olympus', price: 899,
    description: 'A compact weather-sealed micro four-thirds camera built for outdoor adventure photographers.',
    specifications: { sensor: '20.4MP Live MOS', resolution: '20.4 Megapixels', iso: '200-25600', shutterSpeed: '1/4000 to 60s', autofocus: '121-point Phase Detection', video: '4K 30fps', battery: 'BLS-50, ~360 shots', weight: '414g', dimensions: '124.8 x 85.3 x 49.7mm' },
    image: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&auto=format&fit=crop',
    stock: 14, category: 'Mirrorless', featured: false, rating: 4.4, reviewCount: 98,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lenscart');
  await Camera.deleteMany({});
  await User.deleteMany({ email: 'admin@lenscart.com' });
  await Camera.insertMany(cameras);
  await User.create({ name: 'Admin', email: 'admin@lenscart.com', password: 'admin123', role: 'admin' });
  console.log('Database seeded successfully');
  console.log('📧 Admin login: admin@lenscart.com / admin123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
