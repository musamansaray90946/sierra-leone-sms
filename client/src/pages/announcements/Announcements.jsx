import { useState, useEffect } from 'react';
import { Plus, Megaphone, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function Announcements() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', schoolId: '', sendSMS: false });

  useEffect(() => {
    fetchAnnouncements();
    API.get('/schools').then(res => {
      setSchools(res.data.data);
      if (res.data.data.length > 0) {
        setForm(f => ({ ...f, schoolId: res.data.data[0].id }));
      }
    }).catch(() => {});
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('/announcements');
      setItems(res.data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.schoolId) return toast.error('No school found');
    try {
      await API.post('/announcements', form);
      toast.success(form.sendSMS ? 'Announcement sent + SMS to parents!' : 'Announcement published!');
      setShowForm(false);
      setForm(f => ({ ...f, title: '', message: '', sendSMS: false }));
      fetchAnnouncements();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const canCreate = ['SUPER_ADMIN', 'ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL'].includes(user?.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">School notices and alerts</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading ? <p className="text-gray-400">Loading...</p> :
        items.length === 0 ? (
          <div className="card text-center py-16">
            <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No announcements yet</p>
            {canCreate && (
              <button onClick={() => setShowForm(true)} className="mt-4 btn-primary">
                Create First Announcement
              </button>
            )}
          </div>
        ) : items.map(item => (
          <div key={item.id} className="card border-l-4 border-l-primary-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Megaphone className="w-4 h-4 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.sendSMS && (
                    <span className="badge-green flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> SMS sent
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{item.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {item.principal ? `By ${item.principal.firstName} ${item.principal.lastName} · ` : ''}
                  {new Date(item.createdAt).toLocaleDateString('en-SL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-5">New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {schools.length > 1 && (
                <div>
                  <label className="label">School</label>
                  <select className="input" value={form.schoolId} onChange={e => setForm({...form, schoolId: e.target.value})}>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="label">Title</label>
                <input className="input" required placeholder="e.g. End of Term Examination Notice" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea className="input" rows={5} required placeholder="Write your announcement here..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <input type="checkbox" id="sms" checked={form.sendSMS} onChange={e => setForm({...form, sendSMS: e.target.checked})} className="w-4 h-4 accent-green-600" />
                <label htmlFor="sms" className="text-sm text-green-800 font-medium cursor-pointer">
                  Send SMS to all parents & guardians (Premium plan)
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}