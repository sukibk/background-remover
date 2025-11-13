'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MousePointerClick } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getMediaPipeSegmenter } from '@/lib/mediapipe-segmentation';
import {
  loadImage,
  applyMaskToImage,
  createCheckerboardPattern,
} from '@/lib/canvas-utils';

interface CanvasEditorProps {
  imageFile: File;
  onMaskGenerated?: (maskedCanvas: HTMLCanvasElement) => void;
  finalCanvas?: HTMLCanvasElement | null;
}

export function CanvasEditor({ imageFile, onMaskGenerated, finalCanvas }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [currentMask, setCurrentMask] = useState<ImageData | null>(null);
  const [clickPoint, setClickPoint] = useState<{ x: number; y: number } | null>(null);

  // Load image when file changes
  useEffect(() => {
    const loadImageFile = async () => {
      try {
        const img = await loadImage(imageFile);
        setOriginalImage(img);
        setCurrentMask(null);
        setClickPoint(null);

        // Draw original image on canvas
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d')!;

          // Set canvas size to match image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image
          ctx.drawImage(img, 0, 0);
        }
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    };

    loadImageFile();
  }, [imageFile]);

  // Initialize MediaPipe model
  useEffect(() => {
    const initModel = async () => {
      try {
        setIsProcessing(true);
        await getMediaPipeSegmenter();
        setIsModelLoaded(true);
      } catch (error) {
        console.error('Failed to initialize MediaPipe model:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    initModel();
  }, []);

  // Update canvas when finalCanvas changes (background selected)
  useEffect(() => {
    if (finalCanvas && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;

      // Clear and draw the final canvas with new background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(finalCanvas, 0, 0);

      // Re-draw click point indicator
      if (clickPoint) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.beginPath();
        ctx.arc(clickPoint.x, clickPoint.y, 10, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(clickPoint.x, clickPoint.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }, [finalCanvas, clickPoint]);

  // Handle canvas click for segmentation
  const handleCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('Canvas clicked!', {
      hasCanvas: !!canvasRef.current,
      hasImage: !!originalImage,
      modelLoaded: isModelLoaded,
      processing: isProcessing
    });

    if (!canvasRef.current || !originalImage) {
      console.log('Missing canvas or image');
      return;
    }

    if (!isModelLoaded) {
      console.log('Model not loaded yet');
      return;
    }

    if (isProcessing) {
      console.log('Already processing');
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Get click coordinates relative to canvas display size
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Convert to actual canvas coordinates (accounting for CSS scaling)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const imageX = clickX * scaleX;
    const imageY = clickY * scaleY;

    console.log('Click coordinates:', {
      display: { x: clickX, y: clickY },
      canvas: { x: imageX, y: imageY },
      canvasSize: { width: canvas.width, height: canvas.height },
      displaySize: { width: rect.width, height: rect.height }
    });

    setClickPoint({ x: imageX, y: imageY });
    setIsProcessing(true);

    try {
      // Get MediaPipe segmenter
      const segmenter = await getMediaPipeSegmenter();

      // Segment at click point using Google MediaPipe
      const result = await segmenter.segmentAtPoint(originalImage, imageX, imageY);

      console.log('Segmentation result:', { score: result.score });

      // Store mask
      setCurrentMask(result.mask);

      // Apply mask to image
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = canvas.width;
      sourceCanvas.height = canvas.height;
      const sourceCtx = sourceCanvas.getContext('2d')!;
      sourceCtx.drawImage(originalImage, 0, 0);

      console.log('Applying mask to image...', {
        maskSize: result.mask.width + 'x' + result.mask.height,
        canvasSize: sourceCanvas.width + 'x' + sourceCanvas.height
      });

      const maskedCanvas = applyMaskToImage(sourceCanvas, result.mask, false);

      console.log('Masked canvas created, redrawing...');

      // Redraw canvas with checkerboard + masked image
      redrawCanvas(maskedCanvas);

      // Notify parent component
      if (onMaskGenerated) {
        onMaskGenerated(maskedCanvas);
      }
    } catch (error) {
      console.error('Segmentation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Redraw canvas with checkerboard pattern and masked image
  const redrawCanvas = (maskedCanvas: HTMLCanvasElement) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw checkerboard pattern
    const pattern = createCheckerboardPattern(ctx, 10);
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw masked image
    ctx.drawImage(maskedCanvas, 0, 0);

    // Draw click point indicator
    if (clickPoint) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.beginPath();
      ctx.arc(clickPoint.x, clickPoint.y, 10, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(clickPoint.x, clickPoint.y, 10, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`w-full h-auto ${
            isModelLoaded && !isProcessing ? 'cursor-crosshair' : 'cursor-wait'
          }`}
          style={{ maxHeight: '70vh', objectFit: 'contain' }}
        />

        {/* Loading overlay */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm font-medium">
                {!isModelLoaded ? 'Loading Google MediaPipe...' : 'Segmenting image...'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Instruction overlay */}
        {isModelLoaded && !isProcessing && !currentMask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <MousePointerClick className="w-4 h-4 text-primary" />
              <span>Click on the object you want to segment</span>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
