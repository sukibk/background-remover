'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, disabled = false }: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed cursor-pointer transition-all duration-200
          ${isDragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-border hover:border-primary/50 hover:bg-accent/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isDragActive ? (
              <ImageIcon className="w-16 h-16 text-primary" />
            ) : (
              <Upload className="w-16 h-16 text-muted-foreground" />
            )}
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              {isDragActive ? 'Drop your image here' : 'Upload an image'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop an image, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: PNG, JPG, JPEG, WebP
            </p>
          </div>

          {!disabled && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              type="button"
            >
              Choose File
            </motion.button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
