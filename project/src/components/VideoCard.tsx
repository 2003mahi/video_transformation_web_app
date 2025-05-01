import React from 'react';
import { Download, ExternalLink, PlayCircle } from 'lucide-react';
import { Video } from '../types';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const statusColors = {
    uploading: 'bg-blue-100 text-blue-800',
    processing: 'bg-amber-100 text-amber-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };

  const statusText = {
    uploading: 'Uploading',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed'
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <div className="aspect-video bg-gray-100 overflow-hidden group relative">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <PlayCircle className="h-10 w-10 text-gray-400" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="primary"
              onClick={onClick}
              className="transform scale-90 group-hover:scale-100 transition-transform"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Preview
            </Button>
          </div>
          
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${statusColors[video.status]}`}>
            {statusText[video.status]}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <h3 className="font-medium text-gray-900 truncate" title={video.title}>
            {video.title}
          </h3>
          
          <p className="text-xs text-gray-500">
            {new Date(video.createdAt).toLocaleDateString()} • {video.transformationType || 'Original'}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <Link to={`/video/${video.id}`}>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                Details
              </Button>
            </Link>
            
            {video.status === 'completed' && video.transformedUrl && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;