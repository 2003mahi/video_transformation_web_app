import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DropZone from '../components/ui/DropZone';
import Button from '../components/ui/Button';
import TransformationOptions from '../components/TransformationOptions';
import ProcessingStatus from '../components/ProcessingStatus';
import { uploadVideo, transformVideo } from '../api';
import { AlertCircle } from 'lucide-react';

const TransformPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'upload' | 'options' | 'processing'>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [selectedTransformation, setSelectedTransformation] = useState<string | null>(null);
  const [transformationOptions, setTransformationOptions] = useState<Record<string, any>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploadedFile(files[0]);
    setUploadProgress(0);
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await uploadVideo(files[0], (progress) => {
        setUploadProgress(progress);
      });
      
      setVideoId(result.id);
      setVideoUrl(result.url);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload video');
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    if (videoId && videoUrl) {
      setStep('options');
      setError(null);
    }
  };

  const handleTransformationSelect = (id: string, options: Record<string, any>) => {
    setSelectedTransformation(id);
    setTransformationOptions(options);
    setError(null);
  };

  const handleStartTransformation = async () => {
    if (!videoId || !selectedTransformation) {
      setError('Please select a transformation type');
      return;
    }
    
    try {
      setError(null);
      const result = await transformVideo(
        videoId,
        selectedTransformation,
        transformationOptions
      );
      
      setJobId(result.jobId);
      setStep('processing');
    } catch (error) {
      console.error('Error starting transformation:', error);
      setError(error instanceof Error ? error.message : 'Failed to start transformation');
    }
  };

  const handleTransformationComplete = (resultUrl: string) => {
    // Navigate to gallery page to view the transformed video
    navigate('/gallery');
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Upload Your Video</h1>
              <p className="mt-2 text-lg text-gray-600">
                Upload a video to start the transformation process
              </p>
            </div>
            
            <DropZone
              onDrop={handleFileUpload}
              className="mt-6"
            />

            {renderError()}

            {videoUrl && !isUploading && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="px-8"
                >
                  Continue to Transformation
                </Button>
              </div>
            )}

            {isUploading && (
              <div className="mt-6 text-center text-sm text-gray-600">
                Uploading video... {Math.round(uploadProgress)}%
              </div>
            )}
          </div>
        );
        
      case 'options':
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Choose Transformation</h1>
              <p className="mt-2 text-lg text-gray-600">
                Select how you want to transform your video
              </p>
            </div>
            
            {renderError()}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <TransformationOptions onSelect={handleTransformationSelect} />
              </div>
              
              <div>
                <div className="sticky top-24">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium">Preview</h3>
                    </div>
                    
                    {videoUrl && (
                      <video
                        src={videoUrl}
                        className="w-full aspect-video object-cover"
                        controls
                      />
                    )}
                    
                    <div className="p-4">
                      <h4 className="font-medium mb-2">
                        {uploadedFile?.name || 'Your video'}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        {uploadedFile && (
                          <>
                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </>
                        )}
                      </p>
                      
                      <Button
                        className="w-full"
                        disabled={!selectedTransformation}
                        onClick={handleStartTransformation}
                      >
                        Start Transformation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'processing':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Processing Your Video</h1>
              <p className="mt-2 text-lg text-gray-600">
                We're transforming your video with AI
              </p>
            </div>
            
            {renderError()}

            {jobId && (
              <ProcessingStatus 
                jobId={jobId} 
                onComplete={handleTransformationComplete}
              />
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-12">
            <nav className="flex justify-center">
              <ol className="flex items-center space-x-4 sm:space-x-8">
                <li className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step === 'upload' 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : 'border-blue-600 text-blue-600'
                  }`}>
                    1
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step === 'upload' ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    Upload
                  </span>
                </li>
                
                <div className="h-0.5 w-8 sm:w-16 bg-gray-200" />
                
                <li className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step === 'options' 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : step === 'processing' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step === 'options' 
                      ? 'text-blue-600' 
                      : step === 'processing' 
                        ? 'text-gray-700' 
                        : 'text-gray-500'
                  }`}>
                    Transform
                  </span>
                </li>
                
                <div className="h-0.5 w-8 sm:w-16 bg-gray-200" />
                
                <li className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step === 'processing' 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    3
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step === 'processing' ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    Processing
                  </span>
                </li>
              </ol>
            </nav>
          </div>
          
          {renderStepContent()}
        </div>
      </main>
    </div>
  );
};

export default TransformPage;