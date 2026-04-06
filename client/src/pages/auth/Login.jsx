import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { School, Eye, EyeOff, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function Login() {
  const [loginType, setLoginType] = useState('staff');
  const [form, setForm] = useState({ email: '', password: '', admissionNo: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginType === 'student') {
        const res = await authAPI.loginStudent({ admissionNo: form.admissionNo, password: form.password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        if (res.data.school) localStorage.setItem('school', JSON.stringify(res.data.school));
        window.location.href = '/dashboard';
      } else {
        await login(form.email, form.password);
        toast.success('Welcome to EduManage SL!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-sierra-green flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <School className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EduManage SL</h1>
          <p className="text-gray-500 text-sm mt-1">Sierra Leone School Management System</p>
          <p className="text-xs text-gray-400 mt-1">by Musa Mansaray</p>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setLoginType('staff')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              loginType === 'staff' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Shield className="w-4 h-4" /> Staff / Admin
          </button>
          <button
            onClick={() => setLoginType('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              loginType === 'student' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
            }`}
          >
            <User className="w-4 h-4" /> Student
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginType === 'staff' ? (
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          ) : (
            <div>
              <label className="label">Admission Number</label>
              <input
                className="input"
                placeholder="e.g. SL260001"
                value={form.admissionNo}
                onChange={e => setForm({ ...form, admissionNo: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-medium mb-2">Demo credentials:</p>
          <p className="text-xs text-gray-600">Admin — admin@sierraleone-sms.com / admin123</p>
          <p className="text-xs text-gray-600">Student — Use admission number / student123</p>
        </div>
      </div>
    </div>
  );
}