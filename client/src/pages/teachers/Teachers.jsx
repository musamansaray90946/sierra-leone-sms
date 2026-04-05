import { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { teachersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teachersAPI.getAll()
      .then(res => setTeachers(res.data.data))
      .catch(() => toast.error('Failed to load teachers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <p className="text-gray-500 text-sm mt-1">{teachers.length} staff members</p>
      </div>
      <div className="card">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading teachers...</div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No teachers yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {teachers.map(teacher => (
              <div key={teacher.id} className="py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">{teacher.firstName[0]}{teacher.lastName[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{teacher.firstName} {teacher.lastName}</p>
                  <p className="text-sm text-gray-500">{teacher.user?.email} · {teacher.school?.name}</p>
                </div>
                <span className="ml-auto badge-green">{teacher.gender}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}