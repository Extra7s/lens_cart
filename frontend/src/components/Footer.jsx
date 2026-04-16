import { faFacebook, faInstagram, faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <footer className="bg-white border-t border-pastelblue mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-lavender">
                <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.2"/>
                <circle cx="12" cy="14" r="2" fill="currentColor"/>
                <circle cx="20" cy="14" r="2" fill="currentColor"/>
                <path d="M12 20 Q16 24 20 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                <ellipse cx="16" cy="18" rx="1" ry="0.5" fill="currentColor"/>
              </svg>
              <span className="font-display text-lg font-bold bg-gradient-to-r from-lavender to-softpink bg-clip-text text-transparent">
                DIGIPIXEL.NP
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">Premium cameras for professionals and enthusiasts. Capture every moment with precision.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-700 font-semibold text-sm uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-2.5">
              {settings.whatsapp && <li><a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-lavender text-sm transition-colors flex items-center gap-2"><FontAwesomeIcon icon={faWhatsapp} /> WhatsApp: {settings.whatsapp}</a></li>}
              {settings.facebook && <li><a href={`https://facebook.com/${settings.facebook.replace(/^(?:https?:\/\/)?(?:www\.)?facebook\.com\//,'')}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-lavender text-sm transition-colors flex items-center gap-2"><FontAwesomeIcon icon={faFacebook} /> Facebook: {settings.facebook}</a></li>}
              {settings.instagram && <li><a href={`https://instagram.com/${settings.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-lavender text-sm transition-colors flex items-center gap-2"><FontAwesomeIcon icon={faInstagram} /> Instagram: {settings.instagram}</a></li>}
              {settings.telegram && <li><a href={`https://t.me/${settings.telegram.replace('@','')}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-lavender text-sm transition-colors flex items-center gap-2"><FontAwesomeIcon icon={faTelegram} /> Telegram: {settings.telegram}</a></li>}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold text-sm uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[['All Cameras', '/'], ['Mirrorless', '/?category=Mirrorless'], ['DSLR', '/?category=DSLR'], ['Action Cameras', '/?category=Action'], ['Compact', '/?category=Compact']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-gray-600 hover:text-lavender text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-700 font-semibold text-sm uppercase tracking-widest mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[['Sign In', '/auth'], ['Register', '/auth'], ['My Cart', '/cart'], ['Wishlist', '/wishlist']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-gray-600 hover:text-lavender text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-pastelblue">
          <div className="bg-pastelblue/50 border border-lavender/20 rounded-lg p-4 mb-8">
            <p className="text-xs text-lavender font-semibold mb-2">⚠️ DISCLAIMER:</p>
            <p className="text-xs text-gray-600">This website is for VIEWING PURPOSE ONLY and is NOT a dedicated ecommerce platform for purchasing products online. All orders placed through this platform require manual verification and confirmation from our team via social media contact. This is NOT an automated purchase system.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs font-mono">© 2024 DIGIPIXEL.NP. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-xs">Privacy Policy</span>
              <span className="text-gray-500 text-xs">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
