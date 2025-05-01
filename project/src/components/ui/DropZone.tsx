import React, { useCallback, useState } from 'react';
import { Upload, X, FileVideo } from 'lucide-react';

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  onDrop,
  accept = 'video/*',
  maxSize = 100,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }

    setError(null);
    return true;
  }, [maxSize]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    const file = files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onDrop([file]);
    }
  }, [onDrop, validateFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onDrop([file]);
    }
  }, [onDrop, validateFile]);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
  }, []);

  return (
    <div className={`${className}`}>
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex flex-col items-center justify-center">
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">
              Drag and drop your video here
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files (max {maxSize}MB)
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept={accept}
              onChange={handleFileInput}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
            >
              Select video
            </label>
            
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <FileVideo className="h-10 w-10 text-blue-500 mr-3" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="ml-2 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {preview && (
            <video 
              className="mt-3 w-full h-40 object-cover rounded-md" 
              src={preview} 
              controls
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DropZone;