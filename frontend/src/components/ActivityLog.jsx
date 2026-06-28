import { useState, useEffect } from 'react';
import { ScrollText, Loader2 } from 'lucide-react';
import { fetchLogs } from '../services/api';

const ActivityLog = ({ logs: logsProp = [], fullPage = false }) => {
  const [logs, setLogs] = useState(logsProp);
  const [loading, setLoading] = useState(fullPage);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fullPage) {
      setLoading(true);
      setError(null);
      fetchLogs()
        .then((data) => {
          setLogs(Array.isArray(data) ? data : (data?.logs || []));
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Failed to load activity logs');
          setLogs([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLogs(logsProp);
    }
  }, [fullPage, logsProp]);

  const getFilename = (log) => {
    return log.meta?.originalName || (log.message && log.message.match(/[\w.-]+\.[a-zA-Z0-9]+/)?.[0]) || '-';
  };

  return (
    <div className={`space-y-5 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ${fullPage ? 'pb-20' : ''}`}>
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <ScrollText className="text-indigo-600" size={24} />
          <h3 className="font-bold text-slate-900 text-lg">Activity Log</h3>
        </div>
        <p className="text-slate-500 text-sm">Track your backup, encryption, delete, and restore actions.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-slate-500 font-medium">Loading activity logs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600 font-medium">{error}</div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No activity yet. Upload a file to see logs.</div>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{(log.action || 'unknown').toUpperCase()}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(log.date || log.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-slate-600 mt-1">{log.message}</p>
                  {getFilename(log) !== '-' && (
                    <p className="text-xs text-indigo-600 font-medium mt-1 truncate">{getFilename(log)}</p>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-indigo-600 uppercase shrink-0">{log.meta?.fileId ? 'File' : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;