import { CreditCard } from 'lucide-react';

export default function Fees() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-gray-500 text-sm mt-1">Track school fees in Sierra Leonean Leones (SLL)</p>
      </div>
      <div className="card text-center py-16">
        <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 font-medium">Fees module</p>
        <p className="text-gray-300 text-sm mt-1">Assign and track student fee payments</p>
      </div>
    </div>
  );
}