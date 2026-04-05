import { useState, useEffect } from 'react';
import { Plus, GraduationCap, Phone, MapPin, BookOpen } from 'lucide-react';
import { teachersAPI } from '../../services/api';
import API from '../../services/api';
import toast from 'react-hot-toast';

const SL_DISTRICTS = ['Bo','Bombali','Bonthe','Falaba','Kailahun','Kambia','Karene','Kenema','Koinadugu','Kono','Moyamba','Port Loko','Pujehun','Tonkolili','Western Area Rural','Western Area Urban'];
const QUALIFICATIONS = ['BECE','WASSCE','Teachers Certificate','Diploma in Education','B.Ed','B.Sc','B.A','M.Ed','M.Sc','M.A','PhD'];

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: 'teacher123',
    gender: 'MALE', phone: '', address: '', district: '',
    qualification: '', staffId: '', schoolId: '', bio: ''
  });

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      const res = await teachersAPI.getAll();
      setTeachers(res.data.data);
    } catch { toast.error('Failed to load teachers'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { ...form, role: 'TEACHER' });
      toast.success(`${form.firstName} ${form.lastName} registered as teacher!`);
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', password: 'teacher123', gender: 'MALE', phone: '', address: '', district: '', qualification: '', staffId: '', schoolId: '', bio: '' });
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register teacher');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers & Staff</h1>
          <p className="text-gray-500 text-sm mt-1">{teachers.length} staff members registered</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400">Loading...</p> :
        teachers.length === 0 ? (
          <div className="col-span-3 card text-center py-16">
            <GraduationCap className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No teachers yet</p>
            <p className="text-gray-300 text-sm">Click "Add Teacher" to register staff</p>
          </div>
        ) : teachers.map(teacher => (
          <div key={teacher.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-green-600">
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{teacher.firstName} {teacher.lastName}</h3>
                <p className="text-xs text-gray-500">{teacher.user?.email}</p>
                {teacher.staffId && <p className="text-xs text-primary-600 font-medium">ID: {teacher.staffId}</p>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${teacher.gender === 'MALE' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                {teacher.gender}
              </span>
            </div>
            <div className="space-y-1.5">
              {teacher.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{teacher.phone}</span>
                </div>
              )}
              {teacher.address && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{teacher.address}</span>
                </div>
              )}
              {teacher.qualification && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{teacher.qualification}</span>
                </div>
              )}
            </div>
            {teacher.bio && (
              <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100 line-clamp-2">{teacher.bio}</p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">{teacher.school?.name}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-5">Register New Teacher</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">First Name</label><input className="input" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} /></div>
                <div><label className="label">Last Name</label><input className="input" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Email</label><input type="email" className="input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <div>
                  <label className="label">Gender</label>
                  <select className="input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Phone Number</label><input className="input" placeholder="+232 76 000000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div><label className="label">Staff ID</label><input className="input" placeholder="e.g. BGS-T001" value={form.staffId} onChange={e => setForm({...form, staffId: e.target.value})} /></div>
              </div>
              <div>
                <label className="label">Qualification</label>
                <select className="input" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})}>
                  <option value="">Select qualification</option>
                  {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Home Address</label>
                <input className="input" placeholder="e.g. 12 Main Street, Bo" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div>
                <label className="label">District</label>
                <select className="input" value={form.district} onChange={e => setForm({...form, district: e.target.value})}>
                  <option value="">Select district</option>
                  {SL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div><label className="label">School ID</label><input className="input" placeholder="Paste school ID" value={form.schoolId} onChange={e => setForm({...form, schoolId: e.target.value})} /></div>
              <div>
                <label className="label">Bio / Notes</label>
                <textarea className="input" rows={3} placeholder="e.g. Mathematics teacher with 5 years experience" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">Default password: <span className="font-mono">teacher123</span> — teacher can change after first login</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Register Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}