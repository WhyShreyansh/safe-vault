import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShieldCheck, Menu, X, LogOut } from 'lucide-react';
import { NAV_ITEMS } from './constants';
import { useToast } from './components/Toast';
import * as api from './services/api';
import { mapBackendFile } from './utils/fileHelpers';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import RecycleBin from './components/RecycleBin';
import Settings from './components/Settings';
import Upload from './components/Upload';
import Vault from './components/Vault';
import ActivityLog from './components/ActivityLog';

const App = () => {
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Real-time data from API
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('safevault_token');
    if (token) {
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem('safevault_user') || 'null'));
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      const [activeRes, deletedRes, dashboardRes, logsRes] = await Promise.all([
        api.fetchFiles(false),
        api.fetchFiles(true),
        api.fetchDashboard(),
        api.fetchLogs(),
      ]);
      setFiles((activeRes || []).map(mapBackendFile));
      setDeletedFiles((deletedRes || []).map(mapBackendFile));
      setDashboard(dashboardRes || null);
      setLogs(logsRes || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('safevault_token');
        localStorage.removeItem('safevault_user');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        addToast({ message: err.response?.data?.message || 'Failed to load data', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('safevault_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('safevault_token');
    localStorage.removeItem('safevault_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleUpload = async (uploadedFiles, onProgress) => {
    try {
      await api.uploadFiles(uploadedFiles, onProgress);
      addToast({ message: 'Files uploaded successfully', type: 'success' });
      await fetchAllData();
      setCurrentView('dashboard');
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Upload failed', type: 'error' });
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteFile(id);
      addToast({ message: 'File moved to recycle bin', type: 'success' });
      await fetchAllData();
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Delete failed', type: 'error' });
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.restoreFile(id);
      addToast({ message: 'File restored', type: 'success' });
      await fetchAllData();
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Restore failed', type: 'error' });
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await api.permanentDeleteFile(id);
      addToast({ message: 'File permanently deleted', type: 'success' });
      await fetchAllData();
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Delete failed', type: 'error' });
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      await api.downloadFile(id, filename);
      addToast({ message: 'Download started', type: 'success' });
    } catch (err) {
      addToast({ message: err.response?.data?.message || 'Download failed', type: 'error' });
    }
  };

  const toggleStar = (id) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)));
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLogin} />;
  }

  const activeFiles = files;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">ScholarSafe</span>
          </div>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                currentView === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'hover:bg-slate-800'
              }`}
            >
              {item.icon} <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 w-full">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden p-2.5 text-slate-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search your files..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-2xl outline-none focus:bg-white border-2 border-transparent focus:border-indigo-500/20 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-800">{user?.name || 'User'}</p>
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-tighter">Pro Plan</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366f1`}
              className="w-12 h-12 rounded-2xl shadow-md border-2 border-white object-cover"
              alt="Profile"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 w-full">
          <div className="w-full h-full max-w-[1920px] mx-auto">
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                {currentView === 'dashboard' && (
                  <Dashboard
                    dashboard={dashboard}
                    files={activeFiles}
                    logs={logs}
                    onViewVault={() => setCurrentView('vault')}
                    onDownload={handleDownload}
                  />
                )}
                {currentView === 'upload' && <Upload onUpload={handleUpload} />}
                {currentView === 'vault' && (
                  <Vault
                    files={activeFiles}
                    onDelete={handleDelete}
                    onToggleStar={toggleStar}
                    onDownload={handleDownload}
                  />
                )}
                {currentView === 'recent' && (
                  <Vault
                    files={activeFiles.slice(0, 10)}
                    onDelete={handleDelete}
                    onToggleStar={toggleStar}
                    onDownload={handleDownload}
                    title="Recently Uploaded"
                  />
                )}
                {currentView === 'recycle' && (
                  <RecycleBin
                    files={deletedFiles}
                    onRestore={handleRestore}
                    onPermanentDelete={handlePermanentDelete}
                  />
                )}
                {currentView === 'logs' && <ActivityLog logs={logs} fullPage />}
                {currentView === 'settings' && <Settings user={user} />}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
