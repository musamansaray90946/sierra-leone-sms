import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Camera, User, Mail, Shield } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const roleLabels = {
  SUPER_ADMIN: 'Super Administrator',
  SCHOOL_ADMIN: 'School Administrator',
  PRINCIPAL: 'Principal',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent / Guardian',
};

const roleColors = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  SCHOOL_ADMIN: 'bg-blue-100 text-blue-700',
  PRINCIPAL: 'bg-green-100 text-green-700',
  TEACHER: 'bg-cyan-100 text-cyan-700',
  STUDENT: 'bg-amber-100 text-amber-700',
  PARENT: 'bg-pink-100 text-pink-700',
};

export default function Profile() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user?.profile?.photoUrl || '');
  const fileRef = useRef();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const res = await API.post(`/upload/photo/${user.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPhotoUrl(res.data.url);
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Your EduManage SL account</p>
      </div>

      <div className="card">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-primary-100 flex items-center justify-center overflow-hidden border-2 border-primary-200">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-primary-400" />
              )}
            </div>
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-md"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.email}</h2>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-2 ${roleColors[user?.role]}`}>
              <Shield className="w-3.5 h-3.5" />
              {roleLabels[user?.role]}
            </div>
            {uploading && <p className="text-sm text-gray-400 mt-2">Uploading photo...</p>}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-900">{roleLabels[user?.role]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Unique ID</p>
              <p className="text-sm font-mono text-gray-900">{user?.id?.slice(0, 16)}...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-r from-primary-900 to-sierra-green text-white">
        <p className="text-sm opacity-80">Powered by</p>
        <p className="text-lg font-bold">EduManage SL v2.0</p>
        <p className="text-sm opacity-70 mt-1">Designed & built by Musa Mansaray · Full-Stack Developer · Sierra Leone</p>
      </div>
    </div>
  );
}