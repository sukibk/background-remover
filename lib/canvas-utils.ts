/**
 * Canvas utility functions for image processing and background removal
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Loads an image from a File object and returns it as HTMLImageElement
 */
export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Resizes an image to fit within max dimensions while maintaining aspect ratio
 */
export function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let { width, height } = img;

  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width, height };
}

/**
 * Converts canvas coordinates to image coordinates
 */
export function canvasToImageCoords(
  canvasPoint: Point,
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number
): Point {
  return {
    x: (canvasPoint.x / canvasWidth) * imageWidth,
    y: (canvasPoint.y / canvasHeight) * imageHeight,
  };
}

/**
 * Applies a mask to an image, making non-masked areas transparent
 */
export function applyMaskToImage(
  sourceCanvas: HTMLCanvasElement,
  mask: ImageData,
  invert: boolean = false
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const ctx = canvas.getContext('2d')!;

  // Draw original image
  ctx.drawImage(sourceCanvas, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Resize mask if needed
  let maskToUse = mask;
  if (mask.width !== canvas.width || mask.height !== canvas.height) {
    console.log('Resizing mask from', mask.width, 'x', mask.height, 'to', canvas.width, 'x', canvas.height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = mask.width;
    tempCanvas.height = mask.height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(mask, 0, 0);

    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = canvas.width;
    resizedCanvas.height = canvas.height;
    const resizedCtx = resizedCanvas.getContext('2d')!;
    resizedCtx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

    maskToUse = resizedCtx.getImageData(0, 0, canvas.width, canvas.height);
  }

  const maskData = maskToUse.data;

  // Apply mask to alpha channel
  // The mask uses alpha channel (index 3) to represent the mask value
  for (let i = 0; i < data.length; i += 4) {
    const maskAlpha = maskData[i + 3]; // Use alpha channel from mask
    const alpha = invert ? 255 - maskAlpha : maskAlpha;
    data[i + 3] = alpha; // Set alpha channel
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Replaces the background of an image with a color or pattern
 */
export function replaceBackground(
  foregroundCanvas: HTMLCanvasElement,
  background: 'transparent' | 'color' | 'gradient' | 'image',
  options?: {
    color?: string;
    gradient?: { colors: string[]; angle?: number };
    image?: HTMLImageElement;
  }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = foregroundCanvas.width;
  canvas.height = foregroundCanvas.height;
  const ctx = canvas.getContext('2d')!;

  // Draw background
  if (background === 'transparent') {
    // Do nothing, canvas is already transparent
  } else if (background === 'color' && options?.color) {
    ctx.fillStyle = options.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (background === 'gradient' && options?.gradient) {
    const { colors, angle = 135 } = options.gradient;
    const rad = (angle * Math.PI) / 180;
    const x1 = canvas.width / 2 + Math.cos(rad) * canvas.width / 2;
    const y1 = canvas.height / 2 + Math.sin(rad) * canvas.height / 2;
    const x2 = canvas.width / 2 - Math.cos(rad) * canvas.width / 2;
    const y2 = canvas.height / 2 - Math.sin(rad) * canvas.height / 2;

    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (background === 'image' && options?.image) {
    ctx.drawImage(options.image, 0, 0, canvas.width, canvas.height);
  }

  // Draw foreground with transparency
  ctx.drawImage(foregroundCanvas, 0, 0);

  return canvas;
}

/**
 * Downloads a canvas as a PNG file
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}

/**
 * Creates a checkerboard pattern for transparent backgrounds
 */
export function createCheckerboardPattern(
  ctx: CanvasRenderingContext2D,
  size: number = 10
): CanvasPattern | null {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = size * 2;
  patternCanvas.height = size * 2;
  const patternCtx = patternCanvas.getContext('2d')!;

  patternCtx.fillStyle = '#ffffff';
  patternCtx.fillRect(0, 0, size * 2, size * 2);
  patternCtx.fillStyle = '#e0e0e0';
  patternCtx.fillRect(0, 0, size, size);
  patternCtx.fillRect(size, size, size, size);

  return ctx.createPattern(patternCanvas, 'repeat');
}
