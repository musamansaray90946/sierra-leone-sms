import { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { studentsAPI, teachersAPI, classesAPI, feesAPI } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0, unpaidFees: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, teachers, classes, fees] = await Promise.all([
          studentsAPI.getAll(),
          teachersAPI.getAll(),
          classesAPI.getAll(),
          feesAPI.getAll({ status: 'UNPAID' })
        ]);
        setStats({
          students: students.data.count || 0,
          teachers: teachers.data.count || 0,
          classes: classes.data.data?.length || 0,
          unpaidFees: fees.data.data?.length || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: Users, color: 'bg-blue-50 text-blue-600', trend: 'Enrolled this year' },
    { label: 'Total Teachers', value: stats.teachers, icon: GraduationCap, color: 'bg-green-50 text-green-600', trend: 'Active staff' },
    { label: 'Classes', value: stats.classes, icon: BookOpen, color: 'bg-purple-50 text-purple-600', trend: '2025/2026 year' },
    { label: 'Unpaid Fees', value: stats.unpaidFees, icon: CreditCard, color: 'bg-red-50 text-red-600', trend: 'Needs attention' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to Bo Government Secondary School — 2025/2026 Academic Year</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, trend }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '—' : value}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
              <p className="text-xs text-gray-400 mt-1">{trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Sierra Leone School Structure</h3>
          <div className="space-y-3">
            {[
              { level: 'Primary (P1–P6)', exam: 'NPSE', color: 'bg-blue-100 text-blue-700' },
              { level: 'JSS 1–3', exam: 'BECE', color: 'bg-green-100 text-green-700' },
              { level: 'SSS 1–3', exam: 'WASSCE', color: 'bg-purple-100 text-purple-700' },
            ].map(({ level, exam, color }) => (
              <div key={level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{level}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>{exam}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Academic Terms 2025/2026</h3>
          <div className="space-y-3">
            {[
              { term: 'First Term', dates: 'Sep 2025 – Dec 2025', status: 'Completed', color: 'badge-green' },
              { term: 'Second Term', dates: 'Jan 2026 – Apr 2026', status: 'Current', color: 'badge-blue' },
              { term: 'Third Term', dates: 'Apr 2026 – Jul 2026', status: 'Upcoming', color: 'badge-yellow' },
            ].map(({ term, dates, status, color }) => (
              <div key={term} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">{term}</p>
                  <p className="text-xs text-gray-400">{dates}</p>
                </div>
                <span className={color}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card border-l-4 border-l-sierra-gold bg-yellow-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">Getting Started</p>
            <p className="text-sm text-yellow-700 mt-1">
              Start by adding your school's classes, then enrol students. Use the sidebar to navigate between modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}