import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { userAPI } from '../utils/api.js';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setName(user.name || '');
    setEmail(user.email || '');
  }, [user]);

  const submitProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await userAPI.updateProfile({ name });
      toast({ message: 'Profile updated', type: 'success' });
      if (data?.user) { setUser(data.user); localStorage.setItem('lc_user', JSON.stringify(data.user)); }
    } catch (err) {
      toast({ message: err?.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ message: 'New password must be at least 6 chars', type: 'error' });
      return;
    }
    setUpdatingPassword(true);
    try {
      await userAPI.updatePassword({ currentPassword, newPassword });
      toast({ message: 'Password changed successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast({ message: err?.response?.data?.message || 'Failed to change password', type: 'error' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-obsidian-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-obsidian-50">Profile Settings</h1>
          <p className="text-obsidian-400">Update your profile and password information.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={submitProfile} className="bg-obsidian-900 border border-obsidian-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-obsidian-100 mb-4">Account Details</h2>
            <div className="mb-4">
              <label className="text-xs uppercase text-obsidian-500">Name</label>
              <input className="input mt-1" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="text-xs uppercase text-obsidian-500">Email</label>
              <input className="input mt-1 bg-obsidian-900" value={email} disabled />
            </div>
            <button className="btn-primary w-full" type="submit" disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <form onSubmit={submitPassword} className="bg-obsidian-900 border border-obsidian-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-obsidian-100 mb-4">Change Password</h2>
            <div className="mb-4">
              <label className="text-xs uppercase text-obsidian-500">Current Password</label>
              <input type="password" className="input mt-1" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="text-xs uppercase text-obsidian-500">New Password</label>
              <input type="password" className="input mt-1" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <button className="btn-primary w-full" type="submit" disabled={updatingPassword}>
              {updatingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
