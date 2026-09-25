import React, { useState } from 'react';
import { CheckCircle2, User, Mail, Phone, KeyRound } from 'lucide-react';
import { UserProfile } from '../../types';
import { db } from '../../lib/db';
import { AdminPageHeader } from '../common/AdminComponents';

interface AdminProfileProps {
  currentUser: UserProfile;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({ currentUser }) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone);
  const [title, setTitle] = useState(currentUser.title);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateCurrentUser({
      fullName,
      phone,
      title
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordNotice('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordNotice('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordNotice('New password and confirm password do not match.');
      return;
    }

    db.addAuditLog('UPDATE', 'Security', `Updated admin security password for ${currentUser.email}`);
    setPasswordNotice('Admin password successfully updated in session.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordNotice(null), 4000);
  };

  return (
    <div className="space-y-8 w-full">
      <AdminPageHeader
        title="Admin Profile"
        subtitle="Manage personal credentials, designated role and administrative access"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Account Summary (Clean Minimalist Card) */}
        <div className="bg-white p-7 rounded-2xl shadow-premium border border-slate-200/80 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-900 text-white font-bold text-2xl flex items-center justify-center shadow-xs">
            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'A'}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-4">{currentUser.fullName}</h2>
          <p className="text-sm text-slate-500 font-mono mt-0.5">{currentUser.email}</p>

          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider rounded-md">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          <div className="w-full mt-7 pt-5 border-t border-slate-100 text-sm space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="font-medium text-slate-800">{currentUser.department || 'Operations'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Designation:</span>
              <span className="font-medium text-slate-800">{currentUser.title || 'Super Admin'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Admin Since:</span>
              <span className="font-medium text-slate-800">{currentUser.adminSince || 'Sep 2026'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile & Password Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* EDIT PROFILE INFO */}
          <div className="bg-white p-7 rounded-2xl shadow-premium border border-slate-200/80 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
              <p className="text-sm text-slate-500">Update your identity and contact info</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-sm sm:text-base">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full text-base bg-slate-100/70 border border-slate-200/70 rounded-lg px-3.5 py-2.5 text-slate-500 cursor-not-allowed font-mono shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00001"
                    className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Designation</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {profileSuccess && (
                  <span className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile saved successfully!</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* UPDATE SECURITY PASSWORD */}
          <div className="bg-white p-7 rounded-2xl shadow-premium border border-slate-200/80 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Security & Password</h3>
              <p className="text-sm text-slate-500">Change your administrative session password</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5 text-sm sm:text-base">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              {passwordNotice && (
                <div className="p-3.5 rounded-xl bg-slate-50 text-slate-800 text-sm flex items-center gap-2 border border-slate-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordNotice}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
