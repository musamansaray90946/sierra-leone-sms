import { ClipboardList } from 'lucide-react';

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Track daily student attendance</p>
      </div>
      <div className="card text-center py-16">
        <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">Attendance module</p>
        <p className="text-gray-300 text-sm mt-1">Select a class and date to take attendance</p>
      </div>
    </div>
  );
}