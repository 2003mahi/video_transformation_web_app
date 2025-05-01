import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Clock, SlidersHorizontal } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-700 transform -skew-y-3 origin-top-left h-[110%] z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Transform Your Videos with AI Magic
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-3xl">
                Upload, transform, and share stunning videos with our powerful AI-powered platform. 
                Turn ordinary clips into extraordinary content in just a few clicks.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link to="/transform">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Transforming
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20">
                    <Play className="mr-2 h-5 w-5" />
                    View Examples
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block w-full max-w-lg">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-40"></div>
                <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/2531709/pexels-photo-2531709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Video Transformation" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <p className="font-medium">Original Video</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative mt-4 ml-12">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg blur opacity-40"></div>
                <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/1910225/pexels-photo-1910225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="AI Transformed" 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <p className="font-medium">AI Transformed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your videos in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg relative">
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-800 text-white rounded-bl-lg flex items-center justify-center font-bold text-xl">
                1
              </div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center mb-4">
                  <Play className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Your Video</h3>
                <p className="text-gray-600">
                  Upload any video from your device. We support all popular formats and sizes up to 100MB.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg relative">
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-800 text-white rounded-bl-lg flex items-center justify-center font-bold text-xl">
                2
              </div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center mb-4">
                  <SlidersHorizontal className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Choose Transformation</h3>
                <p className="text-gray-600">
                  Select from various AI-powered transformations and customize settings to get the perfect result.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg relative">
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-800 text-white rounded-bl-lg flex items-center justify-center font-bold text-xl">
                3
              </div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Wait for AI Magic</h3>
                <p className="text-gray-600">
                  Our AI processes your video and applies the selected transformations. Download the result when ready.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Samples Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Transformation Samples</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              See what our AI can do with these before-and-after examples
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Style Transfer Example" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">Style Transfer</span>
                    <p className="font-medium mt-2">Transform ordinary footage into artistic masterpieces</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Quality Enhancement Example" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">Quality Enhancement</span>
                    <p className="font-medium mt-2">Upscale and enhance video quality with AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/gallery">
              <Button variant="outline">
                View All Examples
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-800 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to transform your videos?</h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of creators who are already using our AI-powered video transformations.
          </p>
          <div className="mt-10">
            <Link to="/transform">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;