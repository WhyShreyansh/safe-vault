import { useState, useRef } from 'react';
import { UploadCloud, File, CheckCircle2, Loader2 } from 'lucide-react';

const UPLOAD_STEPS = ['Uploading', 'Encrypting', 'Stored Successfully'];

const Upload = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) startUpload(e.dataTransfer.files);
  };

  const startUpload = async (files) => {
    const fileArray = Array.from(files);
    setUploading(true);
    setStep(0);
    setProgress(10);

    const onProgress = (ev) => {
      if (ev.loaded && ev.total) {
        const pct = Math.round((ev.loaded / ev.total) * 75);
        setProgress(10 + pct);
        if (pct > 25) setStep(1);
      }
    };

    try {
      await onUpload(fileArray, onProgress);
      setStep(2);
      setProgress(100);
    } catch {
      setUploading(false);
      setProgress(0);
      setStep(0);
      return;
    }
    setTimeout(() => {
      setUploading(false);
      setProgress(0);
      setStep(0);
    }, 800);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Upload Files</h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          Securely encrypt and store your documents in your private vault with AES-256 military-grade protection.
        </p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative min-h-[320px] lg:aspect-video w-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 gap-4 transition-all ${
          isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50/30'
        }`}
      >
        <div className="p-6 bg-indigo-50 rounded-full text-indigo-600">
          <UploadCloud size={48} strokeWidth={1.5} className="sm:w-16 sm:h-16" />
        </div>
        <div className="text-center px-4">
          <p className="text-lg sm:text-xl font-bold text-slate-800">Drag & Drop files here</p>
          <p className="text-slate-400 text-sm mt-1">Or click the button below to browse your computer</p>
        </div>
        <input type="file" ref={fileInputRef} multiple className="hidden" onChange={(e) => e.target.files?.length && startUpload(e.target.files)} />
        <button
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
        >
          Choose Files
        </button>

        {uploading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 sm:p-12 animate-in fade-in">
            <Loader2 className="animate-spin text-indigo-600 mb-6" size={48} />
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2 flex-wrap">
                  {UPLOAD_STEPS.map((s, i) => (
                    <span key={s} className={`text-xs font-bold px-2 py-1 rounded-lg ${i <= step ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
                      {s}
                    </span>
                  ))}
                </div>
                <span className="font-bold text-slate-800">{progress}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-center text-slate-500 text-xs sm:text-sm font-medium">
                {step === 0 && 'Uploading files to the server...'}
                {step === 1 && 'Encrypting with AES-256...'}
                {step === 2 && 'Stored securely in your vault!'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 w-full">
        <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0"><CheckCircle2 size={24} /></div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm sm:text-base">Encrypted End-to-End</h4>
            <p className="text-xs text-slate-500 font-medium">Only you hold the keys to your data.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><File size={24} /></div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm sm:text-base">Any File Format</h4>
            <p className="text-xs text-slate-500 font-medium">Support for photos, docs, and archives.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
