import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  ClipboardList, FileText, CreditCard, School,
  Megaphone, BookMarked, PenTool, Building, User
} from 'lucide-react';

const allNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER','STUDENT','PARENT'] },
  { to: '/dashboard/schools', icon: Building, label: 'Schools', roles: ['SUPER_ADMIN'] },
  { to: '/dashboard/students', icon: Users, label: 'Students', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER'] },
  { to: '/dashboard/teachers', icon: GraduationCap, label: 'Teachers', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL'] },
  { to: '/dashboard/classes', icon: BookOpen, label: 'Classes', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER'] },
  { to: '/dashboard/attendance', icon: ClipboardList, label: 'Attendance', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER'] },
  { to: '/dashboard/lessons', icon: BookMarked, label: 'Lesson Notes', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','TEACHER','STUDENT'] },
  { to: '/dashboard/assignments', icon: PenTool, label: 'Assignments', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','TEACHER','STUDENT'] },
  { to: '/dashboard/exams', icon: FileText, label: 'Exams & Results', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER','STUDENT'] },
  { to: '/dashboard/fees', icon: CreditCard, label: 'Fees (SLL)', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','PARENT'] },
  { to: '/dashboard/announcements', icon: Megaphone, label: 'Announcements', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER','STUDENT','PARENT'] },
  { to: '/dashboard/profile', icon: User, label: 'My Profile', roles: ['SUPER_ADMIN','SCHOOL_ADMIN','PRINCIPAL','TEACHER','STUDENT','PARENT'] },
];

const roleColors = {
  SUPER_ADMIN: 'bg-purple-600',
  SCHOOL_ADMIN: 'bg-primary-600',
  PRINCIPAL: 'bg-sierra-green',
  TEACHER: 'bg-blue-600',
  STUDENT: 'bg-amber-600',
  PARENT: 'bg-pink-600',
};

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  SCHOOL_ADMIN: 'School Admin',
  PRINCIPAL: 'Principal',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
};

export default function Sidebar() {
  const { user } = useAuth();
  const navItems = allNavItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
            <School className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">EduManage SL</h1>
            <p className="text-xs text-gray-400">by Musa Mansaray</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-3 border-b border-gray-100">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${roleColors[user?.role] || 'bg-gray-600'} bg-opacity-10`}>
          <div className={`w-2 h-2 rounded-full ${roleColors[user?.role] || 'bg-gray-600'}`}></div>
          <span className="text-xs font-medium text-gray-700">{roleLabels[user?.role] || user?.role}</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border border-primary-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">2025/2026 Term 2</span>
        </div>
        <p className="text-xs text-gray-400 px-2 mt-1">Sierra Leone · EduManage SL v2.0</p>
      </div>
    </div>
  );
}