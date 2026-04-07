import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, CreditCard, ClipboardList, Megaphone, CheckCircle, XCircle, Clock } from 'lucide-react';
import API from '../../services/api';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (user?.profile?.students) {
      setChildren(user.profile.students);
      if (user.profile.students.length > 0) {
        setSelectedChild(user.profile.students[0]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!selectedChild) return;
    API.get('/attendance', { params: { studentId: selectedChild.id } })
      .then(res => setAttendance(res.data.data)).catch(() => {});
    API.get('/fees', { params: { studentId: selectedChild.id } })
      .then(res => setFees(res.data.data)).catch(() => {});
    API.get('/announcements')
      .then(res => setAnnouncements(res.data.data)).catch(() => {});
  }, [selectedChild]);

  const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
  const absentCount = attendance.filter(a => a.status === 'ABSENT').length;
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidFees = fees.reduce((sum, f) => sum + f.amountPaid, 0);
  const formatSLL = (n) => `SLL ${Number(n).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Parent Portal</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor your child's progress</p>
      </div>

      {children.length > 1 && (
        <div className="card">
          <label className="label">Select Child</label>
          <select className="input" onChange={e => setSelectedChild(children.find(c => c.id === e.target.value))}>
            {children.map(c => (
              <option key={c.id} value={c.id}>{c.firstName} {c.lastName} — {c.class?.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedChild && (
        <>
          <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                {selectedChild.firstName[0]}{selectedChild.lastName[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedChild.firstName} {selectedChild.lastName}</h2>
                <p className="text-white/80 text-sm">{selectedChild.class?.name} · {selectedChild.admissionNo}</p>
                <p className="text-white/70 text-xs mt-1">{selectedChild.school?.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-sm text-gray-500">Days Present</p>
            </div>
            <div className="card text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-sm text-gray-500">Days Absent</p>
            </div>
            <div className="card text-center">
              <CreditCard className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-600">{formatSLL(paidFees)}</p>
              <p className="text-sm text-gray-500">Fees Paid</p>
            </div>
            <div className="card text-center">
              <Clock className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-red-500">{formatSLL(totalFees - paidFees)}</p>
              <p className="text-sm text-gray-500">Outstanding</p>
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-200">
            {['overview', 'attendance', 'fees', 'notices'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'attendance' && (
            <div className="space-y-2">
              {attendance.length === 0 ? (
                <div className="card text-center py-8"><p className="text-gray-400">No attendance records yet</p></div>
              ) : attendance.slice(0, 30).map(a => (
                <div key={a.id} className="card py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{new Date(a.date).toLocaleDateString('en-SL', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    a.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                    a.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'fees' && (
            <div className="space-y-3">
              {fees.length === 0 ? (
                <div className="card text-center py-8"><p className="text-gray-400">No fee records yet</p></div>
              ) : fees.map(fee => (
                <div key={fee.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{fee.description || 'School Fees'}</p>
                      <p className="text-sm text-gray-500">{fee.term} Term · Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                      <p className="text-sm mt-1">
                        <span className="text-green-600 font-medium">{formatSLL(fee.amountPaid)} paid</span>
                        <span className="text-gray-400"> of {formatSLL(fee.amount)}</span>
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      fee.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      fee.status === 'UNPAID' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{fee.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'notices' && (
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className="card text-center py-8"><p className="text-gray-400">No announcements yet</p></div>
              ) : announcements.map(a => (
                <div key={a.id} className="card border-l-4 border-l-primary-500">
                  <h3 className="font-semibold text-gray-900">{a.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!selectedChild && (
        <div className="card text-center py-16">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No children linked to your account yet</p>
          <p className="text-gray-300 text-sm mt-1">Contact your school admin to link your children</p>
        </div>
      )}
    </div>
  );
}