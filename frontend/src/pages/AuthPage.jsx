import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        toast({ message: `Welcome back, ${user.name}!`, type: 'success' });
        navigate(user.role === 'admin' ? '/admin' : '/');
      } else {
        const user = await register(form.name, form.email, form.password);
        toast({ message: `Welcome to LensCart, ${user.name}!`, type: 'success' });
        navigate('/');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Something went wrong';
      toast({ message: msg, type: 'error' });
      setErrors({ submit: msg });
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => { setForm(f => ({ ...f, [field]: e.target.value })); if (errors[field]) setErrors(er => ({ ...er, [field]: '' })); };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-obsidian-900">
        <img src="https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=1200&auto=format&fit=crop&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-obsidian-950/80 via-obsidian-950/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-obsidian-950 fill-current"><circle cx="12" cy="12" r="4"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </div>
            <span className="font-display text-xl font-bold text-white">Lens<span className="text-gold-500">Cart</span></span>
          </Link>
          <div>
            <blockquote className="font-display text-3xl font-bold text-white leading-tight mb-4">
              "The best camera is the one that's <span className="text-gradient">with you.</span>"
            </blockquote>
            <p className="text-obsidian-400 text-sm">— Chase Jarvis</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[['150+', 'Cameras'], ['50+', 'Brands'], ['10K+', 'Customers']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold text-gold-400">{num}</p>
                  <p className="text-xs text-obsidian-500 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-20 bg-obsidian-950">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-gold-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-obsidian-950 fill-current"><circle cx="12" cy="12" r="4"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </div>
            <span className="font-display text-lg font-bold text-white">Lens<span className="text-gold-500">Cart</span></span>
          </Link>

          {/* Tabs */}
          <div className="flex border-b border-obsidian-800 mb-8">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                className={`pb-4 mr-8 text-sm font-medium uppercase tracking-wider transition-colors border-b-2 -mb-px ${mode === m ? 'border-gold-500 text-gold-400' : 'border-transparent text-obsidian-500 hover:text-obsidian-300'}`}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <h2 className="font-display text-2xl font-bold text-obsidian-50 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-obsidian-500 text-sm mb-8">
            {mode === 'login' ? 'Sign in to your LensCart account' : 'Join thousands of photography enthusiasts'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" value={form.name} onChange={set('name')} placeholder="John Doe" className={`input ${errors.name ? 'border-ember-500' : ''}`} />
                {errors.name && <p className="text-ember-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-2">Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={`input ${errors.email ? 'border-ember-500' : ''}`} />
              {errors.email && <p className="text-ember-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-obsidian-500 uppercase tracking-widest mb-2">Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" className={`input ${errors.password ? 'border-ember-500' : ''}`} />
              {errors.password && <p className="text-ember-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {errors.submit && <div className="p-3 bg-ember-500/10 border border-ember-500/30 text-ember-400 text-sm">{errors.submit}</div>}

            <button type="submit" disabled={loading} className="w-full btn-primary py-4 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-obsidian-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }} className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              {mode === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
