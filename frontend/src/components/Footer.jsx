import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { settingsAPI } from '../utils/api.js';

export default function Footer() {
  const [settings, setSettings] = useState({ whatsapp: '', facebook: '', instagram: '', telegram: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await settingsAPI.getAll();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  return (
    <footer className="bg-obsidian-950 border-t border-obsidian-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gold-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-obsidian-950 fill-current"><circle cx="12" cy="12" r="4"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
              </div>
              <span className="font-display text-lg font-bold text-obsidian-50">Lens<span className="text-gold-500">Cart</span></span>
            </div>
            <p className="text-obsidian-500 text-sm leading-relaxed mb-4">Premium cameras for professionals and enthusiasts. Capture every moment with precision.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-obsidian-200 font-semibold text-sm uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-2.5">
              {settings.whatsapp && <li><a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-obsidian-500 hover:text-gold-400 text-sm transition-colors">📱 WhatsApp: {settings.whatsapp}</a></li>}
              {settings.facebook && <li><a href={`https://facebook.com/${settings.facebook.replace(/^(?:https?:\/\/)?(?:www\.)?facebook\.com\//,'')}`} target="_blank" rel="noreferrer" className="text-obsidian-500 hover:text-gold-400 text-sm transition-colors">📘 Facebook: {settings.facebook}</a></li>}
              {settings.instagram && <li><a href={`https://instagram.com/${settings.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-obsidian-500 hover:text-gold-400 text-sm transition-colors">📷 Instagram: {settings.instagram}</a></li>}
              {settings.telegram && <li><a href={`https://t.me/${settings.telegram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-obsidian-500 hover:text-gold-400 text-sm transition-colors">💬 Telegram: {settings.telegram}</a></li>}
            </ul>
          </div>

          <div>
            <h4 className="text-obsidian-200 font-semibold text-sm uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[['All Cameras', '/'], ['Mirrorless', '/?category=Mirrorless'], ['DSLR', '/?category=DSLR'], ['Action Cameras', '/?category=Action'], ['Compact', '/?category=Compact']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-obsidian-500 hover:text-gold-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-obsidian-200 font-semibold text-sm uppercase tracking-widest mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[['Sign In', '/auth'], ['Register', '/auth'], ['My Cart', '/cart'], ['Wishlist', '/wishlist']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-obsidian-500 hover:text-gold-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-obsidian-800">
          <div className="bg-obsidian-800/50 border border-gold-500/20 rounded p-4 mb-8">
            <p className="text-xs text-gold-400 font-semibold mb-2">⚠️ DISCLAIMER:</p>
            <p className="text-xs text-obsidian-300">This website is for VIEWING PURPOSE ONLY and is NOT a dedicated ecommerce platform for purchasing products online. All orders placed through this platform require manual verification and confirmation from our team via social media contact. This is NOT an automated purchase system.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-obsidian-600 text-xs font-mono">© 2024 LensCart. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-obsidian-600 text-xs">Privacy Policy</span>
              <span className="text-obsidian-600 text-xs">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
