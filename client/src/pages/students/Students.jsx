import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Trash2, User } from 'lucide-react';
import { studentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', gender: 'MALE',
    dateOfBirth: '', address: '', district: '', classId: '', schoolId: 'school-001'
  });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async (searchTerm = '') => {
    try {
      const res = await studentsAPI.getAll(searchTerm ? { search: searchTerm } : {});
      setStudents(res.data.data);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchStudents(e.target.value);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentsAPI.delete(id);
      toast.success('Student deleted');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentsAPI.create(form);
      toast.success('Student enrolled successfully!');
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', gender: 'MALE', dateOfBirth: '', address: '', district: '', classId: '', schoolId: 'school-001' });
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enrol student');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} students enrolled</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Enrol Student
        </button>
      </div>

      <div className="card">
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input pl-9"
            placeholder="Search by name or admission number..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No students yet</p>
            <p className="text-gray-300 text-sm">Click "Enrol Student" to add your first student</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Student</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Admission No.</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Class</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Gender</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">District</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-600">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                          <p className="text-xs text-gray-400">{student.school?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3"><span className="badge-blue">{student.admissionNo}</span></td>
                    <td className="py-3 text-sm text-gray-600">{student.class?.name || '—'}</td>
                    <td className="py-3 text-sm text-gray-600">{student.gender}</td>
                    <td className="py-3 text-sm text-gray-600">{student.district || '—'}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Enrol New Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input className="input" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input className="input" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Gender</label>
                  <select className="input" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="label">Date of Birth</label>
                  <input type="date" className="input" required value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="label">District</label>
                <select className="input" value={form.district} onChange={e => setForm({...form, district: e.target.value})}>
                  <option value="">Select district</option>
                  {['Bo','Bombali','Bonthe','Falaba','Kailahun','Kambia','Karene','Kenema','Koinadugu','Kono','Moyamba','Port Loko','Pujehun','Tonkolili','Western Area Rural','Western Area Urban'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Address</label>
                <input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Enrol Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}