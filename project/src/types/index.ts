// Types for the application
export interface Video {
  id: string;
  title: string;
  sourceUrl: string;
  transformedUrl?: string;
  thumbnailUrl?: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  transformationType?: string;
  transformationOptions?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TransformationOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  preview?: string;
}