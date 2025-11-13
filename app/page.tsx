'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, RotateCcw, Zap } from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';
import { CanvasEditor } from '@/components/canvas-editor';
import { BackgroundSelector } from '@/components/background-selector';
import { Button } from '@/components/ui/button';
import { downloadCanvas } from '@/lib/canvas-utils';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [maskedCanvas, setMaskedCanvas] = useState<HTMLCanvasElement | null>(null);
  const [finalCanvas, setFinalCanvas] = useState<HTMLCanvasElement | null>(null);

  const handleReset = () => {
    setSelectedImage(null);
    setMaskedCanvas(null);
    setFinalCanvas(null);
  };

  const handleDownload = () => {
    if (finalCanvas) {
      downloadCanvas(finalCanvas, 'background-removed.png');
    } else if (maskedCanvas) {
      downloadCanvas(maskedCanvas, 'background-removed.png');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <header className="border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  AI Background Remover
                </h1>
                <p className="text-sm text-muted-foreground">
                  Powered by Google MediaPipe - 100% in your browser
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-950 rounded-full">
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  100% Client-Side
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {!selectedImage ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Remove Backgrounds
                <br />
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  with AI Magic
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Upload an image, click on any object, and watch Google MediaPipe automatically
                segment it with precision. Replace the background or make it transparent.
              </p>
            </motion.div>

            <ImageUpload onImageSelect={setSelectedImage} />

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid sm:grid-cols-3 gap-4 mt-12"
            >
              {[
                {
                  icon: Sparkles,
                  title: 'AI-Powered',
                  description: 'Google MediaPipe segmentation',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description: 'Runs entirely in your browser',
                },
                {
                  icon: Download,
                  title: 'Easy Export',
                  description: 'Download as PNG with transparency',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur border"
                >
                  <feature.icon className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Editor Section */
          <div className="space-y-6">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>

              <Button
                onClick={handleDownload}
                disabled={!maskedCanvas}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </Button>
            </motion.div>

            {/* Editor Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Canvas Editor */}
              <div className="lg:col-span-2">
                <CanvasEditor
                  imageFile={selectedImage}
                  onMaskGenerated={(canvas) => {
                    setMaskedCanvas(canvas);
                    setFinalCanvas(canvas);
                  }}
                  finalCanvas={finalCanvas}
                />
              </div>

              {/* Background Selector */}
              <div className="lg:col-span-1">
                <BackgroundSelector
                  maskedCanvas={maskedCanvas}
                  onBackgroundChange={setFinalCanvas}
                />
              </div>
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Tip:</strong> Click directly on the object you want to segment.
                Google MediaPipe will automatically detect the boundaries and remove the background.
                Try different backgrounds to find the perfect look!
              </p>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-2"
          >
            <p className="text-sm text-muted-foreground">
              Powered by{' '}
              <a
                href="https://ai.google.dev/edge/mediapipe/solutions/vision/image_segmenter"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                Google MediaPipe
              </a>
              {' '}with{' '}
              <a
                href="https://nextjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                Next.js 15
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              All processing happens locally in your browser. Your images never leave your device.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
