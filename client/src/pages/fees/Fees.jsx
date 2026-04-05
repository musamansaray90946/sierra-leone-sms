import { useState, useEffect } from 'react';
import { Plus, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { feesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const formatSLL = (amount) => `SLL ${Number(amount).toLocaleString()}`;

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [form, setForm] = useState({
    studentId: '', academicYearId: '', term: 'SECOND',
    amount: '', dueDate: '', description: ''
  });

  useEffect(() => { fetchFees(); }, [filter]);

  const fetchFees = async () => {
    try {
      const params = filter !== 'ALL' ? { status: filter } : {};
      const res = await feesAPI.getAll(params);
      setFees(res.data.data);
    } catch { toast.error('Failed to load fees'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await feesAPI.create({ ...form, amount: Number(form.amount) });
      toast.success('Fee assigned!');
      setShowForm(false);
      fetchFees();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handlePay = async (feeId) => {
    try {
      await feesAPI.pay(feeId, { amountPaid: Number(payAmount) });
      toast.success('Payment recorded!');
      setShowPayForm(null);
      setPayAmount('');
      fetchFees();
    } catch { toast.error('Failed to record payment'); }
  };

  const statusIcon = { PAID: CheckCircle, UNPAID: AlertCircle, PARTIAL: Clock };
  const statusColor = { PAID: 'text-green-500', UNPAID: 'text-red-500', PARTIAL: 'text-yellow-500' };
  const statusBadge = { PAID: 'badge-green', UNPAID: 'badge-red', PARTIAL: 'badge-yellow' };

  const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + f.amountPaid, 0);
  const totalUnpaid = totalAmount - totalPaid;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 text-sm mt-1">School fees in Sierra Leonean Leones (SLL)</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Assign Fee
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-blue-100">
          <p className="text-xs text-blue-600 font-medium mb-1">Total Fees</p>
          <p className="text-xl font-bold text-blue-700">{formatSLL(totalAmount)}</p>
        </div>
        <div className="card bg-green-50 border-green-100">
          <p className="text-xs text-green-600 font-medium mb-1">Total Collected</p>
          <p className="text-xl font-bold text-green-700">{formatSLL(totalPaid)}</p>
        </div>
        <div className="card bg-red-50 border-red-100">
          <p className="text-xs text-red-600 font-medium mb-1">Outstanding</p>
          <p className="text-xl font-bold text-red-700">{formatSLL(totalUnpaid)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['ALL', 'UNPAID', 'PARTIAL', 'PAID'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-gray-400">Loading...</p> :
        fees.length === 0 ? (
          <div className="card text-center py-16">
            <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No fees found</p>
          </div>
        ) : fees.map(fee => {
          const Icon = statusIcon[fee.status];
          const progress = fee.amount > 0 ? (fee.amountPaid / fee.amount) * 100 : 0;
          return (
            <div key={fee.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Icon className={`w-8 h-8 ${statusColor[fee.status]}`} />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {fee.student?.firstName} {fee.student?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{fee.student?.admissionNo} · {fee.term} Term · {fee.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-gray-400">Total: <span className="font-medium text-gray-700">{formatSLL(fee.amount)}</span></p>
                      <p className="text-xs text-gray-400">Paid: <span className="font-medium text-green-600">{formatSLL(fee.amountPaid)}</span></p>
                      <p className="text-xs text-gray-400">Due: <span className="font-medium text-red-600">{formatSLL(fee.amount - fee.amountPaid)}</span></p>
                    </div>
                    <div className="w-48 bg-gray-200 rounded-full h-1.5 mt-2">
                      <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusBadge[fee.status]}>{fee.status}</span>
                  {fee.status !== 'PAID' && (
                    <button onClick={() => setShowPayForm(fee.id)} className="btn-primary text-xs py-1.5">
                      Record Payment
                    </button>
                  )}
                </div>
              </div>

              {showPayForm === fee.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <div className="flex-1">
                    <label className="label">Amount Paid (SLL)</label>
                    <input type="number" className="input" placeholder="Enter amount paid" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => setShowPayForm(null)} className="btn-secondary">Cancel</button>
                    <button onClick={() => handlePay(fee.id)} className="btn-primary">Confirm</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-5">Assign School Fee</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="label">Student ID</label><input className="input" required placeholder="Paste student ID" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} /></div>
              <div><label className="label">Academic Year ID</label><input className="input" required placeholder="Paste academic year ID" value={form.academicYearId} onChange={e => setForm({...form, academicYearId: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Term</label>
                  <select className="input" value={form.term} onChange={e => setForm({...form, term: e.target.value})}>
                    <option value="FIRST">First Term</option>
                    <option value="SECOND">Second Term</option>
                    <option value="THIRD">Third Term</option>
                  </select>
                </div>
                <div><label className="label">Amount (SLL)</label><input type="number" className="input" required placeholder="e.g. 500000" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              </div>
              <div><label className="label">Due Date</label><input type="date" className="input" required value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
              <div><label className="label">Description</label><input className="input" placeholder="e.g. Second Term School Fees 2026" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Assign Fee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}