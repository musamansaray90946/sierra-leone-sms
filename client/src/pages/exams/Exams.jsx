import { FileText } from 'lucide-react';

export default function Exams() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exams & Results</h1>
        <p className="text-gray-500 text-sm mt-1">Manage NPSE, BECE, WASSCE and internal exams</p>
      </div>
      <div className="card text-center py-16">
        <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">Exams module</p>
        <p className="text-gray-300 text-sm mt-1">Create exams and enter student results</p>
      </div>
    </div>
  );
}