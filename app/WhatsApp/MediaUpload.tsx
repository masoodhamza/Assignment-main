// src/components/WhatsApp/MediaUpload.tsx
import React from 'react';
import { Card, Button, Progress } from "@nextui-org/react";
import { Image, FileText, Download, Play, X } from "lucide-react";
import { MediaContent } from './types';

interface MediaPreviewProps {
  media: MediaContent;
  onDownload?: () => void;
  onRemove?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const MediaPreview = ({ 
  media, 
  onDownload, 
  onRemove,
  isUploading = false,
  uploadProgress = 0
}: MediaPreviewProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaContent = () => {
    switch (media.type) {
      case 'image':
        return (
          <div className="relative group">
            <img 
              src={media.url} 
              alt={media.filename}
              className="w-full max-h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {!isUploading && (
                <Button
                  isIconOnly
                  variant="flat"
                  className="bg-black/20 text-white"
                  onPress={onDownload}
                >
                  <Download size={18} />
                </Button>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="relative group">
            <div className="w-full h-48 bg-black rounded-lg flex items-center justify-center">
              <Play size={40} className="text-white" />
            </div>
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  isIconOnly
                  variant="flat"
                  className="bg-black/20 text-white"
                >
                  <Play size={18} />
                </Button>
                <Button
                  isIconOnly
                  variant="flat"
                  className="bg-black/20 text-white"
                  onPress={onDownload}
                >
                  <Download size={18} />
                </Button>
              </div>
            )}
          </div>
        );

      case 'document':
      case 'audio':
        return (
          <Card className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText size={24} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-small font-medium truncate">
                  {media.filename}
                </p>
                <p className="text-tiny text-default-400">
                  {formatFileSize(media.size)}
                </p>
              </div>
              {!isUploading && (
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={onDownload}
                >
                  <Download size={18} className="text-default-400" />
                </Button>
              )}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {getMediaContent()}
      
      {isUploading && (
        <>
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <Progress 
              size="sm"
              value={uploadProgress}
              className="max-w-[60%]"
            />
          </div>
          {onRemove && (
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              className="absolute top-2 right-2 bg-black/20 text-white"
              onPress={onRemove}
            >
              <X size={14} />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

interface MediaUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ 
  onUpload,
  accept = "image/*,video/*,.pdf,.doc,.docx",
  multiple = true 
}) => {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      await onUpload(files);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        multiple={multiple}
        onChange={handleUpload}
        accept={accept}
        className="hidden"
        id="media-upload"
      />
      <label
        htmlFor="media-upload"
        className="cursor-pointer block p-4 border-2 border-dashed border-divider rounded-lg text-center hover:bg-default-100"
      >
        {uploading ? (
          <div className="space-y-2">
            <Progress 
              value={progress} 
              size="sm"
              color="primary"
              className="max-w-md mx-auto"
            />
            <p className="text-small text-default-500">
              Uploading... {progress}%
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Image size={24} className="text-primary" />
            </div>
            <p className="text-default-500">
              Click or drag files to upload
            </p>
          </div>
        )}
      </label>
    </div>
  );
};