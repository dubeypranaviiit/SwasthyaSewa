import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { sampleReports } from '../../data/mockAiData';

const ReportUploader = ({ onUpload, onSelectDemo, isUploading = false, className = '' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const maxSizeBytes = 10 * 1024 * 1024;

  const handleValidateAndSetFile = (file) => {
    setErrorMessage('');
    if (!file) return;

    if (!allowedTypes.includes(file.type) && !/\.(pdf|jpg|jpeg|png)$/i.test(file.name)) {
      setErrorMessage('Invalid file format. Please upload a PDF, JPG, or PNG document.');
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller document.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleValidateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    if (onUpload) {
      onUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all duration-300 ${
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-gray-300 hover:border-primary/60 bg-white hover:bg-gray-50/50'
        } ${selectedFile ? 'border-primary/50 bg-indigo-50/20' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleInputChange}
          className="hidden"
          id="report-file-input"
          disabled={isUploading}
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight mb-1">
              Upload your medical report
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-5">
              Drag & drop your lab results or browse your files. Supported formats: <span className="font-semibold text-gray-700">PDF, JPG, JPEG, PNG</span> (Max 10MB)
            </p>

            <label
              htmlFor="report-file-input"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-opacity-90 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary/20 cursor-pointer transition active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Browse Files</span>
            </label>

            <div className="flex items-center gap-2 mt-6 text-[11px] text-gray-400 font-medium">
              <span>🔒 256-bit encrypted • Private & Secure</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center flex-shrink-0">
                  {selectedFile.type?.includes('image') ? (
                    <ImageIcon className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {formatFileSize(selectedFile.size)} • Ready for analysis
                  </p>
                </div>
              </div>

              <button
                onClick={handleRemove}
                disabled={isUploading}
                aria-label="Remove File"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <button
                onClick={handleRemove}
                disabled={isUploading}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition"
              >
                Remove File
              </button>

              <button
                onClick={handleAnalyze}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-7 py-2.5 bg-primary hover:bg-opacity-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary/25 transition active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>{isUploading ? 'Uploading & Analyzing...' : 'Analyze Report Now'}</span>
                {!isUploading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-150">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Or explore a sample demo report:
          </p>
          <span className="text-[11px] text-gray-400">1-click demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleReports.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectDemo && onSelectDemo(sample)}
              className="text-left bg-white hover:bg-indigo-50/50 border border-gray-200 hover:border-primary/50 rounded-2xl p-3.5 transition-all shadow-xs hover:shadow-sm group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {sample.title}
                  </span>
                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                    Demo
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {sample.summary.overviewText}
                </p>
              </div>

              <span className="mt-2.5 text-[11px] text-primary font-bold inline-flex items-center gap-1 group-hover:underline">
                View Demo Report <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportUploader;
