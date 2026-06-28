import React from 'react';
import { RotateCcw, Trash2, ShieldAlert } from 'lucide-react';
import { formatBytes, getFileIcon } from '../constants';

const RecycleBin = ({ files = [], onRestore, onPermanentDelete }) => {
  const formatDate = (d) => {
    if (!d) return 'Recently';
    const date = d instanceof Date ? d : new Date(d);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Deleted Today';
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Recycle Bin</h1>
          <p className="text-slate-500 text-sm sm:text-base">Files here will be automatically purged after 30 days.</p>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 lg:py-32 flex flex-col items-center justify-center gap-4 text-slate-400 w-full">
          <div className="p-6 bg-slate-50 rounded-full">
            <Trash2 size={48} strokeWidth={1.5} />
          </div>
          <p className="text-lg font-medium">Your recycle bin is clean!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 w-full">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex items-center gap-4 group opacity-80 hover:opacity-100 transition-all shadow-sm hover:shadow-md"
            >
              <div className="p-3 bg-slate-50 rounded-xl shrink-0">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate text-sm sm:text-base">{file.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {formatBytes(file.size)} &bull; {formatDate(file.deletedAt)}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onRestore(file.id)}
                  title="Restore"
                  className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => onPermanentDelete(file.id)}
                  title="Delete Forever"
                  className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 p-5 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
        <div className="p-3 bg-white text-amber-500 rounded-xl shadow-sm shrink-0">
          <ShieldAlert size={24} />
        </div>
        <p className="text-sm text-amber-900 font-medium leading-relaxed">
          <span className="font-bold">Security Note:</span> Deleted items are stored for 30 days. Permanent deletion
          removes files from our encrypted clusters globally and cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default RecycleBin;
