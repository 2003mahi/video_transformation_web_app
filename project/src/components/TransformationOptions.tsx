import React, { useState } from 'react';
import { Wand2, Sparkles, Star, Palette, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { TransformationOption } from '../types';

interface TransformationOptionsProps {
  onSelect: (id: string, options: Record<string, any>) => void;
}

const TransformationOptions: React.FC<TransformationOptionsProps> = ({ onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customOptions, setCustomOptions] = useState<Record<string, any>>({});

  const transformationOptions: TransformationOption[] = [
    {
      id: 'enhanceQuality',
      name: 'Enhance Quality',
      description: 'Upscale and enhance the video quality',
      icon: 'Sparkles',
      preview: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'styleTransfer',
      name: 'Style Transfer',
      description: 'Apply artistic styles to your video',
      icon: 'Palette',
      preview: 'https://images.pexels.com/photos/1910225/pexels-photo-1910225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'slowMotion',
      name: 'Slow Motion',
      description: 'Create smooth slow-motion effects',
      icon: 'Clock',
      preview: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'textToVideo',
      name: 'Text to Video',
      description: 'Generate video content from text description',
      icon: 'Wand2',
      preview: 'https://images.pexels.com/photos/5417704/pexels-photo-5417704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Wand2':
        return <Wand2 className="h-5 w-5" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5" />;
      case 'Palette':
        return <Palette className="h-5 w-5" />;
      case 'Clock':
        return <Clock className="h-5 w-5" />;
      case 'Star':
        return <Star className="h-5 w-5" />;
      default:
        return <Wand2 className="h-5 w-5" />;
    }
  };

  const handleOptionChange = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Reset custom options when changing transformation type
    const defaultOptions = getDefaultOptionsForType(optionId);
    setCustomOptions(defaultOptions);
    
    onSelect(optionId, defaultOptions);
  };

  const handleCustomOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
        
    const updatedOptions = { ...customOptions, [name]: newValue };
    setCustomOptions(updatedOptions);
    
    if (selectedOption) {
      onSelect(selectedOption, updatedOptions);
    }
  };

  const getDefaultOptionsForType = (type: string): Record<string, any> => {
    switch (type) {
      case 'enhanceQuality':
        return { resolution: '1080p', denoise: true, stabilize: false };
      case 'styleTransfer':
        return { style: 'cinematic', intensity: 0.7 };
      case 'slowMotion':
        return { factor: 2, smoothness: 0.8 };
      case 'textToVideo':
        return { prompt: '', duration: 5 };
      default:
        return {};
    }
  };

  const renderOptionsForm = () => {
    if (!selectedOption) return null;
    
    switch (selectedOption) {
      case 'enhanceQuality':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Resolution
              </label>
              <select
                name="resolution"
                value={customOptions.resolution}
                onChange={handleCustomOptionChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="4k">4K</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="denoise"
                name="denoise"
                checked={customOptions.denoise}
                onChange={handleCustomOptionChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="denoise" className="ml-2 text-sm text-gray-700">
                Noise Reduction
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="stabilize"
                name="stabilize"
                checked={customOptions.stabilize}
                onChange={handleCustomOptionChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="stabilize" className="ml-2 text-sm text-gray-700">
                Stabilize Video
              </label>
            </div>
          </div>
        );
        
      case 'styleTransfer':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                name="style"
                value={customOptions.style}
                onChange={handleCustomOptionChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="cinematic">Cinematic</option>
                <option value="anime">Anime</option>
                <option value="watercolor">Watercolor Painting</option>
                <option value="noir">Film Noir</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intensity: {customOptions.intensity}
              </label>
              <input
                type="range"
                name="intensity"
                min="0.1"
                max="1"
                step="0.1"
                value={customOptions.intensity}
                onChange={handleCustomOptionChange}
                className="w-full"
              />
            </div>
          </div>
        );
        
      case 'slowMotion':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slow Motion Factor: {customOptions.factor}x
              </label>
              <input
                type="range"
                name="factor"
                min="1.5"
                max="8"
                step="0.5"
                value={customOptions.factor}
                onChange={handleCustomOptionChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frame Smoothness: {customOptions.smoothness}
              </label>
              <input
                type="range"
                name="smoothness"
                min="0.1"
                max="1"
                step="0.1"
                value={customOptions.smoothness}
                onChange={handleCustomOptionChange}
                className="w-full"
              />
            </div>
          </div>
        );
        
      case 'textToVideo':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Prompt
              </label>
              <textarea
                name="prompt"
                value={customOptions.prompt}
                onChange={handleCustomOptionChange}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Describe the video you want to generate..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds): {customOptions.duration}s
              </label>
              <input
                type="range"
                name="duration"
                min="3"
                max="15"
                step="1"
                value={customOptions.duration}
                onChange={handleCustomOptionChange}
                className="w-full"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Select Transformation</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {transformationOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedOption === option.id 
                ? 'ring-2 ring-blue-500 transform scale-[1.02]' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleOptionChange(option.id)}
          >
            <div className="h-32 overflow-hidden">
              {option.preview ? (
                <img
                  src={option.preview}
                  alt={option.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  {getIconComponent(option.icon)}
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getIconComponent(option.icon)}
                  <h3 className="ml-2 font-medium">{option.name}</h3>
                </div>
                
                {selectedOption === option.id && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
              
              <p className="text-sm text-gray-500 mt-2">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedOption && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Transformation Options</CardTitle>
          </CardHeader>
          <CardContent>
            {renderOptionsForm()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransformationOptions;