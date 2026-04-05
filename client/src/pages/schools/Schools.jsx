import { useState, useEffect } from 'react';
import { Plus, Building, Users, GraduationCap } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function Schools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', district: '', phone: '', email: '', subscriptionPlan: 'BASIC', maxStudents: 200 });

  const districts = ['Bo','Bombali','Bonthe','Falaba','Kailahun','Kambia','Karene','Kenema','Koinadugu','Kono','Moyamba','Port Loko','Pujehun','Tonkolili','Western Area Rural','Western Area Urban'];
  const planColors = { BASIC: 'badge-green', STANDARD: 'badge-blue', PREMIUM: 'badge-yellow', TRIAL: 'badge-red' };

  useEffect(() => {
    API.get('/schools')
      .then(res => setSchools(res.data.data))
      .catch(() => toast.error('Failed to load schools'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/schools', form);
      setSchools([res.data.data, ...schools]);
      toast.success('School registered!');
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
          <p className="text-gray-500 text-sm mt-1">{schools.length} schools registered on EduManage SL</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Register School
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <p className="text-gray-400">Loading...</p> :
        schools.map(school => (
          <div key={school.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-primary-600" />
              </div>
              <span className={planColors[school.subscriptionPlan] || 'badge-blue'}>{school.subscriptionPlan}</span>
            </div>
            <h3 className="font-semibold text-gray-900">{school.name}</h3>
            <p className="text-sm text-gray-500">{school.address} · {school.district}</p>
            {school.phone && <p className="text-xs text-gray-400 mt-1">{school.phone}</p>}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                {school._count?.students || 0} students
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <GraduationCap className="w-4 h-4" />
                {school._count?.teachers || 0} teachers
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-5">Register New School</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">School Name</label><input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><label className="label">Address</label><input className="input" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">District</label>
                  <select className="input" value={form.district} onChange={e => setForm({...form, district: e.target.value})}>
                    <option value="">Select district</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Subscription Plan</label>
                  <select className="input" value={form.subscriptionPlan} onChange={e => setForm({...form, subscriptionPlan: e.target.value})}>
                    <option value="BASIC">Basic — SLL 500K</option>
                    <option value="STANDARD">Standard — SLL 1.2M</option>
                    <option value="PREMIUM">Premium — SLL 2.5M</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              </div>
              <div><label className="label">Max Students</label><input type="number" className="input" value={form.maxStudents} onChange={e => setForm({...form, maxStudents: parseInt(e.target.value)})} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Register School</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}