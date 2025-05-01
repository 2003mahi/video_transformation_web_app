import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import { getUserVideos } from '../api';
import { Video } from '../types';
import Button from '../components/ui/Button';
import VideoPlayer from '../components/ui/VideoPlayer';

const GalleryPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const fetchedVideos = await getUserVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handlePreviewVideo = (video: Video) => {
    setSelectedVideo(video);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedVideo(null);
  };

  const filteredVideos = videos.filter((video) => {
    // Filter by status
    if (filter !== 'all' && video.status !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900">Your Video Gallery</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse and manage your transformed videos
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search videos..."
                className="pl-10 pr-4 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Videos</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              
              <Button variant="outline" size="sm" className="ml-2">
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                More Filters
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800" />
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => handlePreviewVideo(video)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
              <p className="text-gray-500">
                {searchQuery || filter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload and transform your first video to get started'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Video Preview Modal */}
      {showPreview && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-lg">{selectedVideo.title}</h3>
              <button 
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4">
              <VideoPlayer 
                src={selectedVideo.transformedUrl || selectedVideo.sourceUrl} 
                className="w-full aspect-video"
              />
              
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedVideo.createdAt).toLocaleDateString()} • {selectedVideo.transformationType || 'Original'}
                  </p>
                </div>
                
                {selectedVideo.status === 'completed' && selectedVideo.transformedUrl && (
                  <Button>
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;