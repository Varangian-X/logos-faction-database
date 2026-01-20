import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, XCircle, File, Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function SmartFileDrop({
  onUploadComplete,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
  label = 'Upload Image',
  description = 'Drag & drop or click to select',
  showPreview = true,
  className
}) {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, success, error
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files first
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      const errors = rejection.errors || [];
      
      if (errors.some(e => e.code === 'file-too-large')) {
        setErrorMessage(`File too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`);
      } else if (errors.some(e => e.code === 'file-invalid-type')) {
        setErrorMessage('Invalid file type. Please upload an image.');
      } else {
        setErrorMessage('File validation failed. Please try again.');
      }
      
      setUploadState('error');
      setTimeout(() => setUploadState('idle'), 3000);
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadedFile(file);
    setUploadState('uploading');
    setProgress(0);
    setErrorMessage('');

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 150);

      // Upload to Base44
      const result = await base44.integrations.Core.UploadFile({ file });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result?.file_url) {
        setUploadedUrl(result.file_url);
        setUploadState('success');
        
        // Call completion handler
        if (onUploadComplete) {
          onUploadComplete(result.file_url, file);
        }
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('Upload failed. Please try again.');
      setUploadState('error');
      setTimeout(() => setUploadState('idle'), 3000);
    }
  }, [maxSize, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize,
    multiple: false,
    disabled: uploadState === 'uploading'
  });

  const resetUpload = () => {
    setUploadState('idle');
    setUploadedFile(null);
    setUploadedUrl(null);
    setErrorMessage('');
    setProgress(0);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
          "bg-slate-900/50 backdrop-blur-sm",
          
          // State-based styling
          uploadState === 'idle' && !isDragActive && "border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/5",
          isDragActive && !isDragReject && "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20",
          isDragReject && "border-red-400 bg-red-500/10",
          uploadState === 'uploading' && "border-amber-500/50 bg-amber-500/5",
          uploadState === 'success' && "border-green-500/50 bg-green-500/5",
          uploadState === 'error' && "border-red-500/50 bg-red-500/5",
          uploadState === 'uploading' && "cursor-wait"
        )}
      >
        <input {...getInputProps()} />
        
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>

        <div className="relative p-8">
          <AnimatePresence mode="wait">
            {/* Idle State */}
            {uploadState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <motion.div
                  animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  className={cn(
                    "w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br transition-all duration-300",
                    isDragActive 
                      ? "from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/30" 
                      : "from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30"
                  )}
                >
                  <Upload className={cn(
                    "w-8 h-8 transition-colors",
                    isDragActive ? "text-cyan-300" : "text-cyan-500"
                  )} />
                </motion.div>
                
                <h3 className="text-lg font-bold text-cyan-400 mb-2">{label}</h3>
                <p className={cn(
                  "text-sm transition-colors",
                  isDragActive ? "text-cyan-300 font-semibold" : "text-gray-400"
                )}>
                  {isDragActive ? 'Release to upload' : description}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Max {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </motion.div>
            )}

            {/* Uploading State */}
            {uploadState === 'uploading' && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
                
                <h3 className="text-lg font-bold text-amber-400 mb-2">Uploading...</h3>
                <p className="text-sm text-gray-400 mb-3">{uploadedFile?.name}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{progress}%</p>
              </motion.div>
            )}

            {/* Success State */}
            {uploadState === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-xl bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </motion.div>
                
                <h3 className="text-lg font-bold text-green-400 mb-2">Upload Complete</h3>
                <p className="text-sm text-gray-400 mb-3">{uploadedFile?.name}</p>
                
                {showPreview && uploadedUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-green-500/30">
                    <img 
                      src={uploadedUrl} 
                      alt="Uploaded preview" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                
                <Button
                  onClick={resetUpload}
                  variant="outline"
                  className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  Upload Another
                </Button>
              </motion.div>
            )}

            {/* Error State */}
            {uploadState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center"
                >
                  <XCircle className="w-8 h-8 text-red-400" />
                </motion.div>
                
                <h3 className="text-lg font-bold text-red-400 mb-2">Upload Failed</h3>
                <p className="text-sm text-gray-400 mb-4">{errorMessage}</p>
                
                <Button
                  onClick={resetUpload}
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drag overlay effect */}
        <AnimatePresence>
          {isDragActive && !isDragReject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-cyan-500/20 backdrop-blur-sm border-2 border-cyan-400 rounded-xl flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-cyan-300 mx-auto mb-2 animate-pulse" />
                <p className="text-cyan-200 font-bold">Drop to upload</p>
              </div>
            </motion.div>
          )}
          
          {isDragReject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500/20 backdrop-blur-sm border-2 border-red-400 rounded-xl flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-300 mx-auto mb-2" />
                <p className="text-red-200 font-bold">Invalid file type</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* File info display when success */}
      {uploadState === 'success' && uploadedFile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-slate-800/50 rounded-lg p-2 border border-slate-700"
        >
          <File className="w-3 h-3" />
          <span className="flex-1 truncate">{uploadedFile.name}</span>
          <span>{(uploadedFile.size / 1024).toFixed(1)} KB</span>
        </motion.div>
      )}
    </div>
  );
}