import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ordersAPI } from '../utils/api.js';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/auth');
    if (!isAdmin) return navigate('/');
    fetchOrders();
  }, [user, isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await ordersAPI.getAll();
      setOrders(data || []);
    } catch (err) {
      toast({ message: err?.response?.data?.message || 'Failed to load orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      setOrders(o => o.map(order => order._id === orderId ? { ...order, status } : order));
      toast({ message: 'Order status updated', type: 'success' });
    } catch (err) {
      toast({ message: err?.response?.data?.message || 'Status update failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-obsidian-50">Orders</h1>
            <p className="text-obsidian-400 text-sm">Admin view of placed orders and customer delivery details.</p>
          </div>
          <button onClick={() => navigate('/admin')} className="btn-secondary">← Back to Admin</button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-obsidian-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-obsidian-400">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto bg-obsidian-900 border border-obsidian-800 rounded-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-obsidian-800 text-obsidian-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Delivery</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-t border-obsidian-800 hover:bg-obsidian-900/60">
                    <td className="px-4 py-3">#{order._id.slice(-6)}</td>
                    <td className="px-4 py-3">{order.user?.name || order.userName || 'Unknown'}<br/><span className="text-xs text-obsidian-500">{order.user?.email || '-'}</span></td>
                    <td className="px-4 py-3">{order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)} items</td>
                    <td className="px-4 py-3 text-xs">{order.deliveryLocation}</td>
                    <td className="px-4 py-3 text-xs">{order.contactMethod}: {order.contactHandle}</td>
                    <td className="px-4 py-3">Rs {order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3">
                      <select value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)} className="input bg-obsidian-800 text-obsidian-200">
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
