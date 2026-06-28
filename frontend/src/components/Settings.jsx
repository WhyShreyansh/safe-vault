import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Bell, Key, LogOut, Camera, Loader2 } from 'lucide-react';
import { fetchMe } from '../services/api';

const Settings = ({ user: userProp, onLogout }) => {
  const [user, setUser] = useState(userProp);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMe()
      .then((data) => setUser((prev) => ({ ...(prev || {}), ...data })))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load profile');
        setUser(userProp);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '—';
  const verified = user?.verified !== false;

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Account Settings</h1>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Profile Section */}
      <section className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-8 shadow-sm w-full">
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="relative group">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=128&background=6366f1&color=fff`}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-slate-50 shadow-xl"
              alt="Profile"
            />
            <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
              <Camera size={18} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">{displayName}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-slate-500 text-sm">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                <Mail size={16} /> {displayEmail}
              </span>
              {verified && (
                <span className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs">
                  <Shield size={14} /> Verified Account
                </span>
              )}
            </div>
          </div>

          <button className="w-full md:w-auto bg-slate-100 text-slate-800 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95">
            Edit Profile
          </button>
        </div>
      </section>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Key size={20} className="text-indigo-600" /> Security
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 hover:bg-slate-50 rounded-2xl transition-colors flex justify-between items-center group border border-transparent hover:border-slate-100">
                <div>
                  <p className="font-bold text-slate-700">Change Password</p>
                  <p className="text-xs text-slate-400">Last changed 3 months ago</p>
                </div>
                <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">→</div>
              </button>
              <button className="w-full text-left p-4 hover:bg-slate-50 rounded-2xl transition-colors flex justify-between items-center group border border-transparent hover:border-slate-100">
                <div>
                  <p className="font-bold text-slate-700">Two-Factor Authentication</p>
                  <p className="text-xs text-emerald-600 font-medium">Active (SMS/Email)</p>
                </div>
                <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">→</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Bell size={20} className="text-indigo-600" /> Notifications
            </h3>
            <div className="space-y-2">
              {['Upload completion', 'Security alerts', 'Storage warnings'].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <span className="text-slate-600 font-semibold text-sm">{item}</span>
                  <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -translate-y-12 translate-x-12" />
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2">Upgrade to Enterprise</h3>
              <p className="text-indigo-200 text-sm mb-6 leading-relaxed max-w-sm">
                Get unlimited storage, advanced team collaboration, and priority 24/7 support.
              </p>
              <button className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-95">
                Upgrade Now
              </button>
            </div>
          </div>

          <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100">
            <h3 className="text-red-600 font-bold mb-4 flex items-center gap-2">
              <Shield size={18} /> Danger Zone
            </h3>
            <button className="w-full flex items-center justify-center gap-2 text-red-600 bg-white border border-red-200 py-3.5 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
              <LogOut size={20} /> Logout from all devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
