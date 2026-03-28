import { Lock, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { orderAPI, settingsAPI } from '../utils/api.js';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [contactHandle, setContactHandle] = useState('');
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

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 bg-obsidian-800 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-obsidian-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <h2 className="font-display text-2xl text-obsidian-200 mb-3">Sign In to View Cart</h2>
        <p className="text-obsidian-500 text-sm mb-6">Your cart is waiting for you</p>
        <Link to="/auth" className="btn-primary">Sign In</Link>
      </div>
    </div>
  );

  if (orderPlaced) return (
    <div className="min-h-screen flex items-center justify-center pt-20 page-enter">
      <div className="text-center max-w-md px-4">
        <div className="w-24 h-24 bg-gold-500/20 border border-gold-500/40 flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="font-display text-3xl font-bold text-obsidian-50 mb-3">Order Placed Successfully!</h2>
        <p className="text-obsidian-400 mb-4">Thank you for your order. Please contact us for delivery confirmation and any clarifications.</p>
        <div className="bg-obsidian-800 border border-gold-500/30 p-4 rounded mb-6 text-left">
          <p className="text-sm font-semibold text-gold-400 mb-3">📞 Contact us via:</p>
          <div className="space-y-2 text-xs text-obsidian-300">
            {settings.whatsapp && <p><span className="text-gold-400">WhatsApp:</span> {settings.whatsapp}</p>}
            {settings.facebook && <p><span className="text-gold-400">Facebook:</span> {settings.facebook}</p>}
            {settings.instagram && <p><span className="text-gold-400">Instagram:</span> {settings.instagram}</p>}
            {settings.telegram && <p><span className="text-gold-400">Telegram:</span> {settings.telegram}</p>}
          </div>
        </div>
        <p className="text-obsidian-500 text-sm mb-6">Delivery Location: <span className="text-obsidian-300 font-semibold">{deliveryLocation}</span></p>
        <p className="text-obsidian-500 text-xs mb-8">Our team will contact you via your provided {contactMethod} handle to confirm delivery details.</p>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    </div>
  );

  const handleCheckout = async () => {
    if (!deliveryLocation.trim()) {
      toast({ message: 'Please enter your delivery location', type: 'error' });
      return;
    }
    if (!contactHandle.trim()) {
      toast({ message: `Please enter your ${contactMethod} handle`, type: 'error' });
      return;
    }
    
    setCheckingOut(true);
    try {
      // Validate all items have sufficient stock
      for (const item of cart) {
        const cam = item.cameraId;
        if (!cam || cam.stock < item.quantity) {
          throw { response: { data: { message: `${cam?.name || 'Item'} has insufficient stock` } } };
        }
      }
      
      // Prepare order data
      const orderData = {
        items: cart.map(item => ({
          camera: item.cameraId._id,
          name: item.cameraId.name,
          price: item.cameraId.price,
          quantity: item.quantity,
        })),
        subtotal: cartTotal,
        shipping: shipping,
        tax: tax,
        total: total,
        deliveryLocation: deliveryLocation,
        contactMethod: contactMethod,
        contactHandle: contactHandle,
      };
      
      // Create order (which decreases stock)
      await orderAPI.create(orderData);
      toast({ message: 'Order placed successfully!', type: 'success' });
      
      // Clear cart after successful order
      await clearCart();
      setOrderPlaced(true);
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Failed to place order';
      toast({ message: errMsg, type: 'error' });
    } finally {
      setCheckingOut(false);
    }
  };

  const shipping = cartTotal >= 500 ? 0 : 25;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <div className="min-h-screen pt-20 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-obsidian-50 mb-2">Shopping Cart</h1>
        <p className="text-obsidian-500 text-sm mb-10">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-obsidian-800 border border-obsidian-700 flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-obsidian-600" />
            </div>
            <h3 className="font-display text-xl text-obsidian-300 mb-2">Your cart is empty</h3>
            <p className="text-obsidian-600 text-sm mb-6">Add some cameras to get started</p>
            <Link to="/" className="btn-primary">Browse Cameras</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => {
                const cam = item.cameraId;
                if (!cam || typeof cam !== 'object') return null;
                return (
                  <div key={cam._id} className="flex gap-4 p-4 bg-obsidian-900 border border-obsidian-800 hover:border-obsidian-600 transition-colors animate-fade-in">
                    <Link to={`/camera/${cam._id}`} className="w-24 h-24 shrink-0 bg-obsidian-800 overflow-hidden">
                      <img src={cam.image} alt={cam.name} className="w-full h-full object-cover" onError={e => e.target.src='https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop'} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-gold-500 uppercase tracking-wider">{cam.brand}</p>
                      <Link to={`/camera/${cam._id}`} className="font-display font-semibold text-obsidian-100 hover:text-gold-400 transition-colors line-clamp-2">{cam.name}</Link>
                      <p className="text-xs text-obsidian-500 mt-0.5">{cam.category}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-obsidian-700">
                          <button onClick={() => updateQuantity(cam._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-obsidian-400 hover:text-gold-400 transition-colors">−</button>
                          <span className="w-8 h-8 flex items-center justify-center text-obsidian-200 font-mono text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(cam._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-obsidian-400 hover:text-gold-400 transition-colors">+</button>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-display font-bold text-gold-400">Rs {(cam.price * item.quantity).toLocaleString()}</p>
                          <button onClick={() => { removeFromCart(cam._id); toast({ message: 'Item removed', type: 'info' }); }} className="text-obsidian-600 hover:text-ember-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-obsidian-900 border border-obsidian-800 p-6">
                <h3 className="font-display text-lg font-bold text-obsidian-100 mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-obsidian-400">Subtotal</span><span className="text-obsidian-200">Rs {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-obsidian-400">Shipping</span><span className={shipping === 0 ? 'text-emerald-400' : 'text-obsidian-200'}>{shipping === 0 ? 'Free' : `Rs ${shipping}`}</span></div>
                  {shipping === 0 && <p className="text-xs text-emerald-500 italic">Free shipping on orders over Rs 50,000!</p>}
                  <div className="flex justify-between text-sm"><span className="text-obsidian-400">Tax (8%)</span><span className="text-obsidian-200">Rs {tax.toFixed(2)}</span></div>
                  <div className="divider" />
                  <div className="flex justify-between"><span className="font-semibold text-obsidian-100">Total</span><span className="font-display text-xl font-bold text-gold-400">Rs {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                </div>
                <button onClick={() => setShowCheckoutForm(true)} className="w-full btn-primary py-4">Proceed to Checkout</button>
                <p className="text-center text-xs text-obsidian-600 mt-3">Demo mode — for viewing purposes</p>
                <div className="mt-6 pt-4 border-t border-obsidian-800">
                  <div className="flex items-center gap-2 text-obsidian-500 text-xs"><Lock className="w-3 h-3" /><span>Secure checkout. Your data is protected.</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center pt-20 z-50">
          <div className="bg-obsidian-900 border border-obsidian-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
            <h2 className="font-display text-2xl font-bold text-obsidian-50 mb-6">Delivery & Contact Details</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs uppercase text-obsidian-500 block mb-2">Delivery Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Kathmandu, Pokhara" 
                  value={deliveryLocation} 
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="input w-full"
                />
                <p className="text-xs text-obsidian-600 mt-1">Please provide your city/area for delivery</p>
              </div>

              <div>
                <label className="text-xs uppercase text-obsidian-500 block mb-2">Contact Method *</label>
                <select 
                  value={contactMethod} 
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="input w-full bg-obsidian-800"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="telegram">Telegram</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase text-obsidian-500 block mb-2">{contactMethod.charAt(0).toUpperCase() + contactMethod.slice(1)} Handle/Username *</label>
                <input 
                  type="text" 
                  placeholder={`e.g., your_${contactMethod}_handle`}
                  value={contactHandle} 
                  onChange={(e) => setContactHandle(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div className="bg-gold-500/10 border border-gold-500/30 p-3 rounded">
                <p className="text-xs text-gold-400 font-semibold mb-2">📢 Important Note:</p>
                <p className="text-xs text-obsidian-300">Our team will reach you via your provided contact method to confirm delivery location and process your order. This is NOT an automated purchase.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowCheckoutForm(false)}
                className="flex-1 btn-secondary py-2"
              >
                Cancel
              </button>
              <button 
                onClick={handleCheckout}
                disabled={checkingOut}
                className="flex-1 btn-primary py-2 flex items-center justify-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing...
                  </>
                ) : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
