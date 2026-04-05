import { useState, useEffect } from 'react';
import { Plus, PenTool, Calendar, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', term: 'SECOND', maxScore: 100, subjectId: '', teacherId: '' });

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      const res = await API.get('/assignments');
      setAssignments(res.data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/assignments', form);
      toast.success('Assignment created!');
      setShowForm(false);
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const isTeacher = ['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN'].includes(user?.role);
  const isOverdue = (date) => new Date(date) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500 text-sm mt-1">{assignments.length} assignments</p>
        </div>
        {isTeacher && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Assignment
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-gray-400">Loading...</p> :
        assignments.length === 0 ? (
          <div className="card text-center py-16">
            <PenTool className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No assignments yet</p>
          </div>
        ) : assignments.map(a => (
          <div key={a.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PenTool className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{a.title}</h3>
                  <p className="text-sm text-gray-500">{a.subject?.name} · by {a.teacher?.firstName} {a.teacher?.lastName}</p>
                  <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`flex items-center gap-1 text-xs font-medium ${isOverdue(a.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
                  <Calendar className="w-3 h-3" />
                  {new Date(a.dueDate).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">{a._count?.submissions || 0} submissions</div>
                <div className="text-xs text-gray-400">Max: {a.maxScore} marks</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-5">Create Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Title</label><input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><label className="label">Description / Instructions</label><textarea className="input" rows={4} required value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Due Date</label><input type="datetime-local" className="input" required value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
                <div><label className="label">Max Score</label><input type="number" className="input" value={form.maxScore} onChange={e => setForm({...form, maxScore: e.target.value})} /></div>
              </div>
              <div>
                <label className="label">Term</label>
                <select className="input" value={form.term} onChange={e => setForm({...form, term: e.target.value})}>
                  <option value="FIRST">First Term</option>
                  <option value="SECOND">Second Term</option>
                  <option value="THIRD">Third Term</option>
                </select>
              </div>
              <div><label className="label">Subject ID</label><input className="input" placeholder="Paste subject ID" value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})} /></div>
              <div><label className="label">Teacher ID</label><input className="input" placeholder="Paste teacher ID" value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}