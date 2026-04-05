import { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock, Save } from 'lucide-react';
import { classesAPI, studentsAPI, attendanceAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [academicYearId, setAcademicYearId] = useState('');

  useEffect(() => {
    classesAPI.getAll().then(res => {
      setClasses(res.data.data);
      if (res.data.data.length > 0) {
        setAcademicYearId(res.data.data[0].academicYearId);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    studentsAPI.getAll({ classId: selectedClass }).then(res => {
      setStudents(res.data.data);
      const initial = {};
      res.data.data.forEach(s => { initial[s.id] = 'PRESENT'; });
      setAttendance(initial);
    });
  }, [selectedClass]);

  const setStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!selectedClass) return toast.error('Please select a class');
    setSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s.id,
        classId: selectedClass,
        academicYearId,
        date,
        term: 'SECOND',
        status: attendance[s.id] || 'PRESENT'
      }));
      await attendanceAPI.create({ records });
      toast.success(`Attendance saved for ${students.length} students!`);
    } catch (err) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const counts = {
    PRESENT: Object.values(attendance).filter(v => v === 'PRESENT').length,
    ABSENT: Object.values(attendance).filter(v => v === 'ABSENT').length,
    LATE: Object.values(attendance).filter(v => v === 'LATE').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Register</h1>
          <p className="text-gray-500 text-sm mt-1">Daily student attendance — Sierra Leone 2025/2026</p>
        </div>
        {students.length > 0 && (
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Register'}
          </button>
        )}
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Select Class</label>
            <select className="input" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name} — {cls.level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="card bg-green-50 border-green-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-700">{counts.PRESENT}</p>
                  <p className="text-sm text-green-600">Present</p>
                </div>
              </div>
            </div>
            <div className="card bg-red-50 border-red-100">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-700">{counts.ABSENT}</p>
                  <p className="text-sm text-red-600">Absent</p>
                </div>
              </div>
            </div>
            <div className="card bg-yellow-50 border-yellow-100">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-yellow-700">{counts.LATE}</p>
                  <p className="text-sm text-yellow-600">Late</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">
              {classes.find(c => c.id === selectedClass)?.name} — {new Date(date).toLocaleDateString('en-SL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <div className="space-y-2">
              {students.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-6">{index + 1}</span>
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-600">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-gray-400">{student.admissionNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatus(student.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          attendance[student.id] === status
                            ? status === 'PRESENT' ? 'bg-green-500 text-white'
                            : status === 'ABSENT' ? 'bg-red-500 text-white'
                            : status === 'LATE' ? 'bg-yellow-500 text-white'
                            : 'bg-gray-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        {status === 'PRESENT' ? 'P' : status === 'ABSENT' ? 'A' : status === 'LATE' ? 'L' : 'E'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!selectedClass && (
        <div className="card text-center py-16">
          <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Select a class to take attendance</p>
          <p className="text-gray-300 text-sm mt-1">P = Present · A = Absent · L = Late · E = Excused</p>
        </div>
      )}
    </div>
  );
}