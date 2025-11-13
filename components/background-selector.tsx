'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { replaceBackground } from '@/lib/canvas-utils';

export type BackgroundType = 'transparent' | 'gradient';

export interface BackgroundOption {
  id: string;
  type: BackgroundType;
  label: string;
  gradient?: { colors: string[]; angle?: number };
  preview: string;
}

interface BackgroundSelectorProps {
  maskedCanvas: HTMLCanvasElement | null;
  onBackgroundChange?: (canvas: HTMLCanvasElement) => void;
}

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'transparent',
    type: 'transparent',
    label: 'Transparent',
    preview: 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%)',
  },
  {
    id: 'gradient-1',
    type: 'gradient',
    label: 'Sunset',
    gradient: { colors: ['#ff6b6b', '#feca57', '#48dbfb'], angle: 135 },
    preview: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb)',
  },
  {
    id: 'gradient-2',
    type: 'gradient',
    label: 'Ocean',
    gradient: { colors: ['#667eea', '#764ba2', '#f093fb'], angle: 120 },
    preview: 'linear-gradient(120deg, #667eea, #764ba2, #f093fb)',
  },
  {
    id: 'gradient-3',
    type: 'gradient',
    label: 'Forest',
    gradient: { colors: ['#56ab2f', '#a8e063'], angle: 180 },
    preview: 'linear-gradient(180deg, #56ab2f, #a8e063)',
  },
  {
    id: 'gradient-4',
    type: 'gradient',
    label: 'Purple Dream',
    gradient: { colors: ['#a8edea', '#fed6e3'], angle: 45 },
    preview: 'linear-gradient(45deg, #a8edea, #fed6e3)',
  },
  {
    id: 'gradient-5',
    type: 'gradient',
    label: 'Fire',
    gradient: { colors: ['#f12711', '#f5af19'], angle: 90 },
    preview: 'linear-gradient(90deg, #f12711, #f5af19)',
  },
  {
    id: 'gradient-6',
    type: 'gradient',
    label: 'Sky',
    gradient: { colors: ['#0f2027', '#203a43', '#2c5364'], angle: 180 },
    preview: 'linear-gradient(180deg, #0f2027, #203a43, #2c5364)',
  },
  {
    id: 'gradient-7',
    type: 'gradient',
    label: 'Peach',
    gradient: { colors: ['#ED4264', '#FFEDBC'], angle: 135 },
    preview: 'linear-gradient(135deg, #ED4264, #FFEDBC)',
  },
];

export function BackgroundSelector({
  maskedCanvas,
  onBackgroundChange,
}: BackgroundSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>('transparent');

  const handleBackgroundSelect = (option: BackgroundOption) => {
    if (!maskedCanvas) return;

    setSelectedId(option.id);

    try {
      const resultCanvas = replaceBackground(
        maskedCanvas,
        option.type,
        option.type === 'gradient' ? { gradient: option.gradient } : undefined
      );

      if (onBackgroundChange) {
        onBackgroundChange(resultCanvas);
      }
    } catch (error) {
      console.error('Failed to replace background:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Choose Background</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {BACKGROUND_OPTIONS.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBackgroundSelect(option)}
            disabled={!maskedCanvas}
            className="relative"
          >
            <Card
              className={`
                overflow-hidden transition-all duration-200
                ${selectedId === option.id
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:ring-2 hover:ring-primary/50'
                }
                ${!maskedCanvas ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Preview */}
              <div
                className="w-full h-20 relative"
                style={{
                  background: option.preview,
                  backgroundSize: option.type === 'transparent' ? '20px 20px' : 'cover',
                }}
              >
                {/* Selected indicator */}
                {selectedId === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <div className="p-2 text-center">
                <p className="text-xs font-medium truncate">{option.label}</p>
              </div>
            </Card>
          </motion.button>
        ))}
      </div>

      {!maskedCanvas && (
        <p className="text-sm text-muted-foreground text-center">
          Click on your image to segment an object first
        </p>
      )}
    </motion.div>
  );
}
