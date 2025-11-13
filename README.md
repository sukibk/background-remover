# AI Background Remover

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![MediaPipe](https://img.shields.io/badge/Google-MediaPipe-green)

**Professional AI-powered background removal using Google MediaPipe** — Upload an image, click on any object, and watch AI segment it in real-time. Replace backgrounds with beautiful gradients or make them transparent. All processing happens locally in your browser with zero backend costs.

## ✨ Features

- 🎯 **Click-to-Segment**: Click on any object to segment it with AI precision
- 🚀 **100% Client-Side**: All processing happens locally - your images never leave your device
- 🎨 **Background Options**: Transparent backgrounds or 8 beautiful gradient presets
- ⚡ **GPU Accelerated**: Leverages WebGPU for fast inference
- 📱 **Fully Responsive**: Works beautifully on desktop, tablet, and mobile
- 🎭 **Beautiful UI**: Modern design with smooth animations
- 🔒 **Privacy First**: No data sent to servers, everything runs in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AI Model**: Google MediaPipe Image Segmentation
- **Animations**: Framer Motion
- **File Upload**: react-dropzone

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/sukibk/background-remover
cd background-remover

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎯 How It Works

1. **Upload an image** - Drag & drop or click to browse
2. **Click on object** - Click anywhere on the object you want to segment
3. **AI processes** - Google MediaPipe segments the object (1-2 seconds)
4. **Choose background** - Select transparent or pick from 8 gradient options
5. **Download** - Export as PNG with transparency

## 🤖 Google MediaPipe

This app uses **Google MediaPipe's Image Segmentation** API:

- ✅ **Official Google Technology** - 100% safe and trusted
- ✅ **Auto-downloaded** - Models load automatically from Google's CDN
- ✅ **Cached Forever** - Downloaded once, works offline after that
- ✅ **GPU Accelerated** - Uses WebGPU when available
- ✅ **~5MB Model** - Lightweight and fast

### First Use

- Downloads ~5MB model from Google's CDN
- Takes 5-10 seconds to initialize
- Cached in browser permanently

### Subsequent Uses

- Instant loading (cached)
- 1-2 second inference per image
- Works offline

## 📁 Project Structure

```
background-remover/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── image-upload.tsx      # Drag-and-drop upload
│   ├── canvas-editor.tsx     # Interactive canvas with segmentation
│   ├── background-selector.tsx # Background options
│   └── ui/                   # shadcn/ui components
└── lib/
    ├── mediapipe-segmentation.ts # Google MediaPipe integration
    └── canvas-utils.ts       # Image processing utilities
```

## 🎨 Customization

### Add Custom Gradients

Edit `components/background-selector.tsx`:

```typescript
const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'my-gradient',
    type: 'gradient',
    label: 'My Custom',
    gradient: { colors: ['#FF0000', '#0000FF'], angle: 90 },
    preview: 'linear-gradient(90deg, #FF0000, #0000FF)',
  },
  // ... existing options
];
```

### Adjust Segmentation

Modify `lib/mediapipe-segmentation.ts` to use different MediaPipe models or settings.

## 🐛 Troubleshooting

### Models Not Loading

**Issue**: "Failed to initialize MediaPipe"
**Solution**: Check internet connection. Models download from Google's CDN on first use.

### Segmentation Not Accurate

**MediaPipe works best with:**

- ✅ People and selfies
- ✅ Animals (dogs, cats, etc.)
- ✅ Common objects (cars, furniture)

**Less accurate with:**

- ⚠️ Abstract objects
- ⚠️ Very small objects
- ⚠️ Unusual items

For other use cases, see [SAFE-ALTERNATIVES.md](SAFE-ALTERNATIVES.md)

### Slow Performance

1. First load takes 5-10 seconds (normal - downloading model)
2. Enable GPU acceleration in browser settings
3. Use Chrome or Edge for best WebGPU support
4. Close other tabs to free up GPU memory

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy
```

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

The app is fully static and can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any static hosting

## 📊 Performance

| Metric          | Value                              |
| --------------- | ---------------------------------- |
| Model Size      | ~5MB                               |
| First Load      | 5-10 seconds                       |
| Inference Time  | 1-2 seconds                        |
| Browser Support | Chrome 94+, Edge 94+, Safari 16.4+ |
| Mobile Support  | ✅ Yes                             |

## 🎬 Demo Day Tips

When presenting this project:

1. **Show the working app** (2 min)

   - Upload → Click → Segment → Background change → Download

2. **Highlight key points** (3 min)

   - 100% client-side (no backend costs)
   - Google MediaPipe (trusted, official)
   - Beautiful UI with Framer Motion
   - TypeScript for type safety

3. **Code walkthrough** (5 min)

   - Show `lib/mediapipe-segmentation.ts`
   - Explain `canvas-editor.tsx` interaction
   - Demo `background-selector.tsx` gradients

4. **Q&A** (5 min)

## 📚 Learn More

- [Google MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/image_segmenter)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 📄 License

MIT License - feel free to use this for your projects!

## 🙏 Acknowledgments

- [Google MediaPipe](https://ai.google.dev/edge/mediapipe) for the AI model
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Vercel](https://vercel.com) for Next.js and hosting
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

Built for Technical Thursday Demo 🚀
