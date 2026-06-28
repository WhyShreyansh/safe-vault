import React from 'react';
import { HardDrive, Files, History, ArrowUpRight, MoreVertical, Download, ExternalLink, Shield } from 'lucide-react';
import { formatBytes, getFileIcon } from '../constants';
import ActivityLog from './ActivityLog';

// Safe date format - avoid 1/1/1970 for invalid dates
const formatDateSafe = (val) => {
  if (!val) return 'N/A';
  const d = val instanceof Date ? val : new Date(val);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const Dashboard = ({ dashboard = {}, files = [], logs = [], onViewVault, onDownload }) => {
  const totalFiles = dashboard.totalFiles ?? files.length;
  const storageUsed = dashboard.storageUsed ?? files.reduce((acc, f) => acc + (f.size || 0), 0);
  const lastUpload = formatDateSafe(dashboard.lastUpload || files[0]?.uploadDate);
  const backupSuccessRate = dashboard.backupSuccessRate ?? 99.8;

  const recentFiles = [...files]
    .sort((a, b) => {
      const da = a.uploadDate instanceof Date ? a.uploadDate : new Date(a.uploadDate || 0);
      const db = b.uploadDate instanceof Date ? b.uploadDate : new Date(b.uploadDate || 0);
      return db.getTime() - da.getTime();
    })
    .slice(0, 5);

  const stats = [
    { label: 'Total Files', value: totalFiles, icon: <Files className="text-indigo-600" />, trend: `${dashboard.recoveryCount ?? 0} recoveries` },
    { label: 'Storage Used', value: formatBytes(storageUsed), icon: <HardDrive className="text-emerald-600" />, trend: `${dashboard.versionCount ?? 0} versions` },
    { label: 'Last Upload', value: lastUpload, icon: <History className="text-amber-600" />, trend: 'Synchronized' },
    { label: 'Backup Success Rate', value: `${backupSuccessRate}%`, icon: <Shield className="text-indigo-600" />, trend: 'AES-256 protected' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Welcome back!</h1>
          <p className="text-slate-500 text-sm sm:text-base">Here&apos;s what&apos;s happening in your vault today.</p>
        </div>
        <button
          onClick={onViewVault}
          className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-all hover:translate-x-1"
        >
          View All Files <ArrowUpRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50/50 rounded-xl">{stat.icon}</div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold mb-1 text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-400 font-medium">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-900">Recent Files</h2>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Size</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
                          {getFileIcon(file.type)}
                        </div>
                        <span className="font-semibold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 capitalize whitespace-nowrap">{file.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{formatBytes(file.size)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {formatDateSafe(file.uploadDate)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.preventDefault(); onDownload?.(file.id, file.originalName || file.name); }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Download size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentFiles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic">
                      No files found. Start by uploading some!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1">
          <ActivityLog logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
