import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { School, Eye, EyeOff, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import API from '../../services/api';

export default function Login() {
  const [loginType, setLoginType] = useState('staff');
  const [form, setForm] = useState({ email: '', password: '', admissionNo: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotData, setForgotData] = useState({ email: '', code: '', newPassword: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginType === 'student') {
        const res = await authAPI.loginStudent({
          admissionNo: form.admissionNo,
          password: form.password
        });
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

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      if (forgotStep === 1) {
        const res = await API.post('/password/forgot', { email: forgotData.email });
        if (res.data.code) {
          toast.success(`Reset code: ${res.data.code} (dev mode)`);
        } else {
          toast.success('Reset code sent!');
        }
        setForgotStep(2);
      } else {
        await API.post('/password/reset', forgotData);
        toast.success('Password reset successfully! Please login.');
        setShowForgot(false);
        setForgotStep(1);
        setForgotData({ email: '', code: '', newPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
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
          <button onClick={() => setLoginType('staff')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${loginType === 'staff' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'}`}>
            <Shield className="w-4 h-4" /> Staff / Admin
          </button>
          <button onClick={() => setLoginType('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${loginType === 'student' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'}`}>
            <User className="w-4 h-4" /> Student
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginType === 'staff' ? (
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="your@email.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
          ) : (
            <div>
              <label className="label">Admission Number</label>
              <input className="input" placeholder="e.g. SL260001"
                value={form.admissionNo} onChange={e => setForm({...form, admissionNo: e.target.value})} required />
            </div>
          )}
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} className="input pr-10"
                placeholder="Enter your password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div className="text-center">
            <button type="button" onClick={() => setShowForgot(true)}
              className="text-xs text-primary-600 hover:underline">
              Forgot password?
            </button>
          </div>
        </form>

        <div className="mt-5 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-medium mb-2">Demo credentials:</p>
          <p className="text-xs text-gray-600">Admin — admin@sierraleone-sms.com / admin123</p>
          <p className="text-xs text-gray-600">Student — Use admission number / student123</p>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">Reset Password</h2>
            <p className="text-sm text-gray-500 mb-5">
              {forgotStep === 1 ? 'Enter your email to receive a reset code' : 'Enter the reset code and your new password'}
            </p>
            <form onSubmit={handleForgot} className="space-y-4">
              {forgotStep === 1 ? (
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" required
                    placeholder="your@email.com"
                    value={forgotData.email}
                    onChange={e => setForgotData({...forgotData, email: e.target.value})} />
                </div>
              ) : (
                <>
                  <div>
                    <label className="label">Reset Code</label>
                    <input className="input text-center text-xl tracking-widest font-mono" required
                      placeholder="000000" maxLength={6}
                      value={forgotData.code}
                      onChange={e => setForgotData({...forgotData, code: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <input type="password" className="input" required
                      placeholder="Enter new password (min 6 chars)"
                      minLength={6}
                      value={forgotData.newPassword}
                      onChange={e => setForgotData({...forgotData, newPassword: e.target.value})} />
                  </div>
                </>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForgot(false); setForgotStep(1); }}
                  className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  {forgotStep === 1 ? 'Send Reset Code' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}