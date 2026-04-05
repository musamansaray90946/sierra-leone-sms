import { useState, useEffect } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { classesAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', level: '', stream: '', schoolId: 'school-001', academicYearId: '' });

  useEffect(() => {
    classesAPI.getAll()
      .then(res => setClasses(res.data.data))
      .catch(() => toast.error('Failed to load classes'))
      .finally(() => setLoading(false));
  }, []);

  const slLevels = ['P1','P2','P3','P4','P5','P6','JSS1','JSS2','JSS3','SSS1','SSS2','SSS3'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-500 text-sm mt-1">{classes.length} classes this year</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : classes.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No classes yet. Add your first class!</p>
          </div>
        ) : classes.map(cls => (
          <div key={cls.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <span className="badge-blue">{cls.level}</span>
            </div>
            <h3 className="font-semibold text-gray-900">{cls.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{cls.school?.name}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">{cls._count?.students || 0} students</span>
              <span className="text-xs text-gray-400">{cls.academicYear?.year}</span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-5">Add New Class</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Class Name</label>
                <input className="input" placeholder="e.g. JSS 1A" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Level</label>
                <select className="input" value={form.level} onChange={e => setForm({...form, level: e.target.value})}>
                  <option value="">Select level</option>
                  {slLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Stream (optional)</label>
                <input className="input" placeholder="e.g. A, B, Science" value={form.stream} onChange={e => setForm({...form, stream: e.target.value})} />
              </div>
              <div>
                <label className="label">Academic Year ID</label>
                <input className="input" placeholder="Paste academic year ID" value={form.academicYearId} onChange={e => setForm({...form, academicYearId: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={async () => {
                  try {
                    await classesAPI.create(form);
                    toast.success('Class created!');
                    setShowForm(false);
                    const res = await classesAPI.getAll();
                    setClasses(res.data.data);
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed');
                  }
                }} className="btn-primary flex-1">Create Class</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}