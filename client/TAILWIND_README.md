# Tailwind CSS Setup for Travel Agency

This project has been configured with Tailwind CSS for modern, responsive styling.

## 🎨 Features

- **Tailwind CSS v4.1.11** - Latest version with all modern features
- **Custom Color Palette** - Primary, Secondary, and Accent color schemes
- **Custom Components** - Pre-built components for travel agency needs
- **Responsive Design** - Mobile-first approach with breakpoint utilities
- **Custom Animations** - Smooth transitions and hover effects
- **Font Awesome Icons** - Integrated for beautiful icons

## 🚀 Quick Start

### Installation
Tailwind CSS is already installed and configured. The following packages are included:

```bash
npm install -D tailwindcss postcss autoprefixer
```

### Configuration Files

1. **`tailwind.config.js`** - Main configuration with custom colors and animations
2. **`postcss.config.js`** - PostCSS configuration for processing
3. **`src/index.css`** - Main CSS file with Tailwind directives and custom styles

## 🎯 Custom Components

### Buttons
```jsx
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<button className="btn btn-accent">Accent Button</button>
<button className="btn btn-outline">Outline Button</button>
<button className="btn btn-ghost">Ghost Button</button>
```

### Forms
```jsx
<div className="form-group">
  <label className="form-label">Label</label>
  <input className="form-control" type="text" />
</div>
```

### Cards
```jsx
<div className="card">
  <div className="card-header">Header</div>
  <div className="card-body">Content</div>
  <div className="card-footer">Footer</div>
</div>
```

### Travel-Specific Components
```jsx
{/* Hero Section */}
<section className="hero-section">
  <div className="hero-overlay"></div>
  <div className="hero-content">
    <h1>Your Content</h1>
  </div>
</section>

{/* Destination Card */}
<div className="destination-card">
  <img className="destination-image" src="..." alt="..." />
  <div className="destination-overlay"></div>
  <div className="destination-content">
    <h3>Destination Name</h3>
  </div>
</div>

{/* Search Form */}
<div className="search-form">
  <input className="search-input" type="text" />
</div>
```

## 🎨 Color Palette

### Primary Colors (Blue)
- `primary-50` to `primary-900` - Blue shades
- Default: `primary-600` (#2563eb)

### Secondary Colors (Purple)
- `secondary-50` to `secondary-900` - Purple shades
- Default: `secondary-600` (#c026d3)

### Accent Colors (Orange)
- `accent-50` to `accent-900` - Orange shades
- Default: `accent-600` (#ea580c)

## 🎭 Animations

### Built-in Animations
```jsx
<div className="animate-fade-in">Fade In</div>
<div className="animate-slide-up">Slide Up</div>
<div className="animate-slide-down">Slide Down</div>
<div className="animate-scale-in">Scale In</div>
```

### Custom Keyframes
- `fadeIn` - Opacity transition
- `slideUp` - Translate Y with opacity
- `slideDown` - Translate Y negative with opacity
- `scaleIn` - Scale transform with opacity

## 📱 Responsive Design

### Breakpoints
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up
- `2xl:` - 1536px and up

### Example
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

## 🛠️ Custom Utilities

### Text Gradients
```jsx
<h1 className="text-gradient">Gradient Text</h1>
```

### Background Gradients
```jsx
<div className="bg-gradient-primary">Primary Gradient</div>
<div className="bg-gradient-secondary">Secondary Gradient</div>
<div className="bg-gradient-accent">Accent Gradient</div>
```

### Custom Shadows
```jsx
<div className="shadow-custom">Custom Shadow</div>
<div className="shadow-custom-lg">Large Custom Shadow</div>
```

## 📁 File Structure

```
client/
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── src/
│   ├── index.css              # Main CSS with Tailwind directives
│   └── components/
│       └── TailwindExample.js # Example component
└── TAILWIND_README.md         # This file
```

## 🎯 Best Practices

1. **Use Custom Components** - Leverage the pre-built components for consistency
2. **Mobile First** - Start with mobile styles and enhance for larger screens
3. **Semantic Class Names** - Use descriptive class names for better maintainability
4. **Component Composition** - Combine utility classes to create reusable patterns
5. **Performance** - Tailwind automatically purges unused styles in production

## 🔧 Development

### Running the Development Server
```bash
npm start
```

### Building for Production
```bash
npm run build
```

### Customizing Styles
1. Edit `tailwind.config.js` for theme customization
2. Add custom styles in `src/index.css` using `@layer` directives
3. Use `@apply` directive to compose utility classes

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Components](https://tailwindui.com/)
- [Custom CSS with Tailwind](https://tailwindcss.com/docs/adding-custom-styles)

## 🎨 Example Usage

See `src/components/TailwindExample.js` for a comprehensive example of how to use Tailwind CSS in this travel agency project, including:

- Hero sections with gradients
- Feature cards with hover effects
- Destination cards with image overlays
- Search forms with custom styling
- Testimonial sections
- Responsive layouts
- Custom animations and transitions