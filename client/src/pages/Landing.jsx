import { useNavigate } from 'react-router-dom';
import { School, Users, BookOpen, CreditCard, MessageSquare, FileText, Shield, Globe, CheckCircle, ExternalLink } from 'lucide-react';

const features = [
  { icon: Users, title: 'Multi-role logins', desc: 'Admin, Teacher, Student & Parent each get their own dashboard' },
  { icon: BookOpen, title: 'Lesson notes & assignments', desc: 'Teachers upload materials, students submit work online' },
  { icon: FileText, title: 'Exam results & report cards', desc: 'Auto-generate SL-format report cards as PDF' },
  { icon: CreditCard, title: 'Fee management (SLL)', desc: 'Track fees in Sierra Leonean Leones with receipts' },
  { icon: MessageSquare, title: 'SMS to parents', desc: 'Principal sends SMS alerts directly to parents & guardians' },
  { icon: Globe, title: 'Works for any SL school', desc: 'All 16 districts, NPSE · BECE · WASSCE curriculum' },
];

const plans = [
  { name: 'Basic', price: 'SLL 500K', period: 'per term', students: 'Up to 200 students', color: 'border-gray-200 bg-white', badge: '' },
  { name: 'Standard', price: 'SLL 1.2M', period: 'per term', students: 'Up to 500 students', color: 'border-primary-500 bg-primary-50', badge: 'Most Popular' },
  { name: 'Premium', price: 'SLL 2.5M', period: 'per term', students: 'Unlimited + SMS alerts', color: 'border-purple-400 bg-purple-50', badge: '' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">EduManage SL</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/musamansaray90946" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
              GitHub
            </a>
            <button onClick={() => navigate('/login')} className="btn-primary">Sign In</button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-sierra-green py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            Built specifically for Sierra Leone schools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            The complete school management system for Sierra Leone
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Manage students, teachers, exams, fees, attendance and communicate with parents — all in one place. Works for every school from Bo to Freetown.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Get Started Free
            </button>
            <a href="mailto:mmans.sl.001@gmail.com" className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              Contact Developer <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Everything your school needs</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">Designed for the Sierra Leone national curriculum — Primary, JSS and SSS levels with NPSE, BECE and WASSCE support.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-500 text-center mb-12">Contact the developer to get your school set up. All prices in Sierra Leonean Leones.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(({ name, price, period, students, color, badge }) => (
              <div key={name} className={`rounded-xl p-6 border-2 ${color} relative`}>
                {badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-3 py-1 rounded-full">{badge}</span>}
                <h3 className="font-bold text-lg text-gray-900 mb-1">{name}</h3>
                <div className="text-3xl font-bold text-primary-600 mb-1">{price}</div>
                <div className="text-gray-400 text-sm mb-4">{period}</div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {students}
                </div>
                <a href="mailto:mmans.sl.001@gmail.com" className="block text-center btn-primary w-full">Get this plan</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold">EduManage SL</p>
                <p className="text-gray-400 text-xs">Sierra Leone School Management System</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-300 text-sm">Designed & built by</p>
              <p className="font-bold text-white text-lg">Musa Mansaray</p>
              <p className="text-gray-400 text-xs">Full-Stack Developer · Sierra Leone</p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-400 text-right">
              <a href="mailto:mmans.sl.001@gmail.com" className="hover:text-white transition-colors">mmans.sl.001@gmail.com</a>
              <a href="https://github.com/musamansaray90946" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                github.com/musamansaray90946
              </a>
              <a href="https://musamansaray90946.github.io/portfolio-v2" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Portfolio</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} EduManage SL · All rights reserved · Built with React, Node.js & PostgreSQL
          </div>
        </div>
      </footer>
    </div>
  );
}