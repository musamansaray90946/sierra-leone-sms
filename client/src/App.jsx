import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Students from './pages/students/Students';
import Teachers from './pages/teachers/Teachers';
import Classes from './pages/classes/Classes';
import Attendance from './pages/attendance/Attendance';
import Exams from './pages/exams/Exams';
import Fees from './pages/fees/Fees';
import Lessons from './pages/lessons/Lessons';
import Assignments from './pages/assignments/Assignments';
import Announcements from './pages/announcements/Announcements';
import Schools from './pages/schools/Schools';
import Profile from './pages/profile/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">Loading EduManage SL...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="exams" element={<Exams />} />
        <Route path="fees" element={<Fees />} />
        <Route path="lessons" element={<Lessons />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="schools" element={<Schools />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}