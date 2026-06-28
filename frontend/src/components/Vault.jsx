import React, { useState, useEffect } from 'react';
import { Download, Trash2, Star, BrainCircuit, Shield } from 'lucide-react';
import { formatBytes, getFileIcon } from '../constants';
import { fetchVersions } from '../services/api';

const formatDateSafe = (d) => {
  if (!d) return '—';
  const dt = d instanceof Date ? d : new Date(d);
  return isNaN(dt.getTime()) ? '—' : dt.toLocaleDateString();
};

const Vault = ({ files = [], onDelete, onToggleStar, onDownload, title = 'My Secure Vault' }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 w-full">
      {/* Responsive Header: Stacks on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 text-sm sm:text-base">{files.length} secure items found</p>
        </div>
        
        {/* Responsive Filters */}
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="flex-1 sm:w-40 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer">
            <option>All Types</option>
            <option>Images</option>
            <option>Documents</option>
          </select>
          <select className="flex-1 sm:w-40 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm cursor-pointer">
            <option>Newest First</option>
            <option>Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Grid: 1 col on mobile, 2 on phablet, 3 on tablet, 4 on small laptop, 5 on desktop, 6 on extra-wide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full">
        {files.map(file => (
          <div 
            key={file.id} 
            className="group relative bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer shadow-sm"
            onClick={() => setSelectedFile(file)}
          >
            <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-indigo-50 overflow-hidden">
              <div className="transform scale-125 transition-transform duration-300 group-hover:scale-150">
                {getFileIcon(file.type)}
              </div>
              
              {/* Desktop Hover Actions (hidden on mobile via opacity-0 and group-hover) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 bg-indigo-900/10 backdrop-blur-[2px] rounded-2xl transition-all duration-300">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleStar(file.id); }}
                  className={`p-2.5 bg-white rounded-lg shadow-md hover:scale-110 transition-all ${file.starred ? 'text-amber-500' : 'text-slate-400'}`}
                >
                  <Star size={18} fill={file.starred ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDownload?.(file.id, file.originalName || file.name); }}
                  className="p-2.5 bg-white rounded-lg shadow-md text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all"
                >
                  <Download size={18} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
                  className="p-2.5 bg-white rounded-lg shadow-md text-slate-400 hover:text-red-500 hover:scale-110 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-sm truncate text-slate-800">{file.name}</h3>
                {file.encrypted && (
                  <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                    <Shield size={10} /> AES-256
                  </span>
                )}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                <span>{formatBytes(file.size)}</span>
                <span>{formatDateSafe(file.uploadDate)}</span>
              </div>
              {(file.version != null || file.encrypted) && (
                <div className="text-[10px] text-slate-400">v{file.version ?? 1} {file.encrypted && '• Encrypted'}</div>
              )}
            </div>
            
            {/* AI Snippet - Responsive display */}
            {file.contentSnippet && (
              <div className="mt-3 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100 hidden group-hover:block animate-in fade-in duration-300">
                <p className="text-[10px] text-indigo-700 line-clamp-2 leading-relaxed italic">
                  "AI Insight: {file.contentSnippet}"
                </p>
              </div>
            )}
          </div>
        ))}
        
        {/* Empty State */}
        {files.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center gap-4 text-slate-400 bg-white/50 rounded-3xl border border-dashed border-slate-200">
             <div className="p-6 bg-slate-100 rounded-full"><BrainCircuit size={48} strokeWidth={1.5} /></div>
             <p className="text-lg font-medium">No files match your criteria</p>
          </div>
        )}
      </div>

      {/* File Preview Modal with Version History */}
      {selectedFile && (
        <VaultModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDownload={onDownload}
          getFileIcon={getFileIcon}
          formatBytes={formatBytes}
        />
      )}
    </div>
  );
};

const XIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Modal with Version History and Restore
const VaultModal = ({ file, onClose, onDownload, getFileIcon, formatBytes }) => {
  const [versions, setVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(true);

  useEffect(() => {
    const name = file.originalName || file.name;
    if (!name) return;
    setLoadingVersions(true);
    fetchVersions(name)
      .then((v) => setVersions(Array.isArray(v) ? v : []))
      .catch(() => setVersions([]))
      .finally(() => setLoadingVersions(false));
  }, [file?.id]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
              <div className="p-4 bg-slate-100 rounded-2xl shrink-0">{getFileIcon(file.type)}</div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900 truncate max-w-[250px]">{file.name}</h2>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                  {file.type} &bull; {formatBytes(file.size)} {file.encrypted && '&bull; AES-256 Encrypted'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
              <XIcon size={24} />
            </button>
          </div>

          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <h4 className="flex items-center gap-2 font-bold mb-2 text-indigo-800">
              <BrainCircuit size={18} />
              Version History
            </h4>
            {loadingVersions ? (
              <p className="text-sm text-slate-600">Loading versions...</p>
            ) : versions.length > 0 ? (
              <ul className="space-y-2">
                {versions.map((v) => (
                  <li key={v.id} className="flex justify-between items-center gap-2 text-sm">
                    <span className="text-slate-700">Version {v.version}</span>
                    <span className="text-slate-500 text-xs">{new Date(v.uploadDate).toLocaleDateString()}</span>
                    <button
                      onClick={() => onDownload?.(v.id, v.originalName || file.name)}
                      className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1"
                    >
                      <Download size={14} /> Restore
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">No version history</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onDownload?.(file.id, file.originalName || file.name)}
              className="flex-1 bg-slate-100 text-slate-800 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
            >
              Download Latest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vault;