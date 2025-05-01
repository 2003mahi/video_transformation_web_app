import React, { useEffect, useState } from 'react';
import { UserCircle as LoaderCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import ProgressBar from './ui/ProgressBar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { getTransformationStatus } from '../api';

interface ProcessingStatusProps {
  jobId: string;
  onComplete?: (resultUrl: string) => void;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ jobId, onComplete }) => {
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | undefined>(undefined);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await getTransformationStatus(jobId);
        setStatus(result.status);
        
        if (result.status === 'completed' && result.resultUrl) {
          setResultUrl(result.resultUrl);
          if (onComplete) {
            onComplete(result.resultUrl);
          }
        }
      } catch (error) {
        console.error('Error checking transformation status:', error);
      }
    };

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        
        const increment = Math.random() * 5;
        return Math.min(prev + increment, 95);
      });
    }, 2000);

    // Track elapsed time
    const timerInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    // Check status every 5 seconds
    const statusInterval = setInterval(checkStatus, 5000);
    checkStatus(); // Initial check

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      clearInterval(timerInterval);
    };
  }, [jobId, onComplete]);

  // Format time elapsed as mm:ss
  const formatTimeElapsed = () => {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <LoaderCircle className="h-10 w-10 text-blue-500 animate-spin mr-4" />;
      case 'completed':
        return <CheckCircle className="h-10 w-10 text-green-500 mr-4" />;
      case 'failed':
        return <XCircle className="h-10 w-10 text-red-500 mr-4" />;
      default:
        return <Clock className="h-10 w-10 text-gray-500 mr-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Your video is being transformed by AI...';
      case 'completed':
        return 'Transformation complete! Your video is ready.';
      case 'failed':
        return 'We encountered an error while processing your video.';
      default:
        return 'Preparing your video...';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { name: 'Uploading', status: 'completed' },
      { name: 'Processing', status: status === 'processing' ? 'current' : (status === 'completed' ? 'completed' : 'failed') },
      { name: 'Finalizing', status: status === 'completed' ? 'completed' : 'upcoming' },
    ];

    return steps;
  };

  const steps = getStatusSteps();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Video Transformation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-medium">{getStatusText()}</h3>
            <p className="text-sm text-gray-500">
              {status === 'processing' 
                ? `Elapsed time: ${formatTimeElapsed()}`
                : status === 'completed' 
                  ? 'Processing completed successfully'
                  : 'Something went wrong during processing'}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <ProgressBar 
            progress={status === 'completed' ? 100 : progress} 
            variant={status === 'completed' ? 'success' : 'primary'} 
            size="md"
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.name} className="flex flex-col items-center relative">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-600 border-green-200' 
                    : step.status === 'current' 
                      ? 'bg-blue-100 text-blue-600 border-blue-200'
                      : step.status === 'failed'
                        ? 'bg-red-100 text-red-600 border-red-200'
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                } border-2`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : step.status === 'current' ? (
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                ) : step.status === 'failed' ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <span className="w-2 h-2 bg-gray-300 rounded-full" />
                )}
              </div>
              
              <span className={`mt-2 text-sm ${
                step.status === 'completed' 
                  ? 'text-green-600' 
                  : step.status === 'current' 
                    ? 'text-blue-600 font-medium'
                    : step.status === 'failed'
                      ? 'text-red-600'
                      : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              
              {index < steps.length - 1 && (
                <div className={`absolute top-5 left-[55px] w-[calc(100%-30px)] h-0.5 ${
                  step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {status === 'processing' && (
          <div className="text-center text-sm text-gray-500">
            <p>This may take a few minutes depending on the length and complexity of your video.</p>
            <p className="mt-1">You'll receive a notification when it's ready.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessingStatus;