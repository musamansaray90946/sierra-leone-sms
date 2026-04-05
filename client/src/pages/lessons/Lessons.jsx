import { useState, useEffect } from 'react';
import { Plus, BookMarked, Download, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function Lessons() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', term: 'SECOND', week: '', subjectId: '', teacherId: '' });
  const [file, setFile] = useState(null);

  useEffect(() => { fetchLessons(); }, []);

  const fetchLessons = async () => {
    try {
      const res = await API.get('/lessons');
      setLessons(res.data.data);
    } catch { toast.error('Failed to load lessons'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = '';
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const up = await API.post('/upload/document', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        fileUrl = up.data.url;
      }
      await API.post('/lessons', { ...form, fileUrl, week: form.week ? parseInt(form.week) : null });
      toast.success('Lesson note uploaded!');
      setShowForm(false);
      fetchLessons();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const canCreate = ['TEACHER', 'SCHOOL_ADMIN', 'SUPER_ADMIN'].includes(user?.role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Notes</h1>
          <p className="text-gray-500 text-sm mt-1">{lessons.length} notes available</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Upload Lesson Note
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400">Loading...</p> :
        lessons.length === 0 ? (
          <div className="col-span-3 text-center py-16">
            <BookMarked className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No lesson notes yet</p>
          </div>
        ) : lessons.map(lesson => (
          <div key={lesson.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookMarked className="w-5 h-5 text-blue-600" />
              </div>
              <span className="badge-blue">{lesson.term}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
            <p className="text-sm text-gray-500 mb-1">{lesson.subject?.name}</p>
            <p className="text-xs text-gray-400 mb-3">by {lesson.teacher?.firstName} {lesson.teacher?.lastName}</p>
            {lesson.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>}
            {lesson.fileUrl && (
              <a href={lesson.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary-600 text-sm hover:underline">
                <Download className="w-4 h-4" /> Download material
              </a>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-5">Upload Lesson Note</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Title</label><input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Term</label>
                  <select className="input" value={form.term} onChange={e => setForm({...form, term: e.target.value})}>
                    <option value="FIRST">First Term</option>
                    <option value="SECOND">Second Term</option>
                    <option value="THIRD">Third Term</option>
                  </select>
                </div>
                <div><label className="label">Week</label><input type="number" className="input" placeholder="e.g. 3" value={form.week} onChange={e => setForm({...form, week: e.target.value})} /></div>
              </div>
              <div><label className="label">Subject ID</label><input className="input" placeholder="Paste subject ID" value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})} /></div>
              <div><label className="label">Teacher ID</label><input className="input" placeholder="Paste teacher ID" value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})} /></div>
              <div>
                <label className="label">Upload File (PDF or Image)</label>
                <input type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}