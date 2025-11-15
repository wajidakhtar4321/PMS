# Public Assets

This folder contains all public static assets for the Mobiloitte PMS frontend.

## Files

### Logo
- **logo.png** - Company logo (4.1 KB)
  - Used in: Header component, About page
  - Path: `/logo.png`

### Slider Images
Located in `/Slider Image/` folder:

1. **slider1.jpg** (8.7 KB)
   - First slide in homepage hero slider
   - Path: `/Slider Image/slider1.jpg`
   
2. **slider2.jpg** (6.8 KB)
   - Second slide in homepage hero slider
   - Path: `/Slider Image/slider2.jpg`
   
3. **slider3.jpg** (7.8 KB)
   - Third slide in homepage hero slider
   - Path: `/Slider Image/slider3.jpg`

## Usage

Images in the `public` folder can be referenced directly in Next.js:

```jsx
// Logo example
<img src="/logo.png" alt="Mobiloitte" />

// Slider image example
<img src="/Slider Image/slider1.jpg" alt="Slide 1" />
```

## Adding New Images

To add new images:

1. Place files in this `public` folder
2. Reference them with a leading `/` in your components
3. Images are automatically optimized by Next.js

## Image Optimization

For better performance, consider using Next.js Image component:

```jsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  alt="Mobiloitte" 
  width={200} 
  height={50} 
/>
```
