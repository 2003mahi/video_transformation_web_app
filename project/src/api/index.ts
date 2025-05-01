import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const FAL_API_KEY = '30a9abbe-9d5a-43cc-a16b-ddc491c000f2:2128361b4eb268934d92be2c042dd147a';

// Supported video formats and max file size (100MB)
const SUPPORTED_FORMATS = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

// Validate video file
const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Unsupported file format. Please upload MP4, MOV, or AVI files only.' 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` 
    };
  }

  return { isValid: true };
};

// Validate transformation parameters
const validateTransformationParams = (
  type: string, 
  options: Record<string, any>
): { isValid: boolean; error?: string } => {
  if (!type) {
    return { isValid: false, error: 'Transformation type is required' };
  }

  switch (type) {
    case 'enhanceQuality':
      if (!options.resolution) {
        return { isValid: false, error: 'Resolution is required for quality enhancement' };
      }
      break;
    case 'styleTransfer':
      if (!options.style || !options.intensity) {
        return { isValid: false, error: 'Style and intensity are required for style transfer' };
      }
      if (options.intensity < 0 || options.intensity > 1) {
        return { isValid: false, error: 'Intensity must be between 0 and 1' };
      }
      break;
    case 'slowMotion':
      if (!options.factor || !options.smoothness) {
        return { isValid: false, error: 'Factor and smoothness are required for slow motion' };
      }
      break;
    case 'textToVideo':
      if (!options.prompt || !options.duration) {
        return { isValid: false, error: 'Prompt and duration are required for text to video' };
      }
      break;
    default:
      return { isValid: false, error: 'Invalid transformation type' };
  }

  return { isValid: true };
};

export const uploadVideo = async (
  file: File, 
  onProgress?: (progress: number) => void
): Promise<{ id: string; url: string }> => {
  try {
    // Validate file first
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Create a unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${randomString}_${file.name}`;

    // Upload to Supabase Storage with retry logic
    const maxRetries = 3;
    let attempt = 0;
    let lastError;

    while (attempt < maxRetries) {
      try {
        const { data, error } = await supabase.storage
          .from('videos')
          .upload(filename, file, {
            cacheControl: '3600',
            upsert: false,
            onUploadProgress: (progress) => {
              if (onProgress) {
                const percentage = (progress.loaded / progress.total) * 100;
                onProgress(percentage);
              }
            },
          });

        if (error) throw error;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(filename);

        // Save video metadata to database
        const { error: dbError } = await supabase
          .from('videos')
          .insert([
            {
              title: file.name,
              source_url: publicUrl,
              status: 'uploading'
            }
          ]);

        if (dbError) throw dbError;

        return {
          id: filename,
          url: publicUrl
        };
      } catch (error) {
        lastError = error;
        attempt++;
        if (attempt === maxRetries) break;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw lastError;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload video');
  }
};

export const transformVideo = async (
  videoId: string, 
  transformationType: string,
  options: Record<string, any>
): Promise<{ jobId: string }> => {
  try {
    // Validate transformation parameters
    const validation = validateTransformationParams(transformationType, options);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Verify video URL exists
    const videoUrlCheck = await fetch(videoId, { method: 'HEAD' });
    if (!videoUrlCheck.ok) {
      throw new Error('Invalid video URL or video not accessible');
    }

    const response = await fetch('https://fal.run/hunyuan-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Request-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}` // Idempotency key
      },
      body: JSON.stringify({
        input_url: videoId,
        transformation_type: transformationType,
        options: options,
        webhook_url: `${import.meta.env.VITE_API_URL}/video-callback`
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API request failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // Update video status in database
    await supabase
      .from('videos')
      .update({ 
        status: 'processing',
        transformation_type: transformationType,
        transformation_options: options
      })
      .eq('id', videoId);

    return { jobId: data.id };
  } catch (error) {
    console.error('Error transforming video:', error);
    
    // Update video status to failed in database
    await supabase
      .from('videos')
      .update({ 
        status: 'failed',
        transformation_type: transformationType,
        transformation_options: options
      })
      .eq('id', videoId);

    throw new Error(error instanceof Error ? error.message : 'Failed to transform video');
  }
};

export const getTransformationStatus = async (
  jobId: string
): Promise<{ 
  status: 'processing' | 'completed' | 'failed';
  resultUrl?: string;
}> => {
  try {
    const response = await fetch(`https://fal.run/status/${jobId}`, {
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }

    const data = await response.json();

    // If completed, verify the result URL is accessible
    if (data.status === 'completed' && data.result?.url) {
      const urlCheck = await fetch(data.result.url, { method: 'HEAD' });
      if (!urlCheck.ok) {
        throw new Error('Transformed video URL is not accessible');
      }
    }

    // Update video status in database
    if (data.status === 'completed' || data.status === 'failed') {
      await supabase
        .from('videos')
        .update({ 
          status: data.status,
          transformed_url: data.result?.url
        })
        .eq('job_id', jobId);
    }

    return {
      status: data.status,
      resultUrl: data.result?.url
    };
  } catch (error) {
    console.error('Error checking transformation status:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to check transformation status');
  }
};

export const getUserVideos = async (): Promise<any[]> => {
  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return videos || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};