# Qora - NFT Platform Structure

## 📁 Project Structure

### Components Organization

\`\`\`
components/
├── ui/                          # shadcn UI components
├── background-gradients.tsx     # Atmospheric gradient blurs
├── cosmic-background.tsx        # Animated stars background
├── footer.tsx                   # Site footer
├── hero-section.tsx             # Main hero with CTA button
├── how-it-works.tsx            # Feature cards section
├── info-section.tsx            # Bottom info columns
├── nft-cards-showcase.tsx      # NFT cards display
├── nft-fragments-section.tsx   # Fragments connection section
├── site-header.tsx             # Navigation header with glassmorphism
└── theme-provider.tsx          # Theme management
\`\`\`

## 🎨 Design Features

### Glassmorphism Elements
- **Header**: Fixed header with `backdrop-blur-xl` and semi-transparent background
- **Cards**: Feature cards with `backdrop-blur-md` and glassmorphic borders
- **Buttons**: Semi-transparent buttons with blur effects
- **Footer**: Footer with `backdrop-blur-xl`

### Typography
- **Headings**: Space Grotesk (modern, geometric)
- **Body Text**: Inter (clean, readable)
- **Logo**: MuseoModerno

### Color Palette
- Primary Blue: `#0900FF`
- Cyan: `#25DBFF`, `#00C8FF`
- Purple: `#7300FF`
- Pink: `#FF00BF`

## 🚀 Component Usage

### Main Page Structure
\`\`\`tsx
<CosmicBackground />        // Animated stars
<BackgroundGradients />     // Colored blurs
<SiteHeader />              // Navigation
<HeroSection />             // Title + CTA
<NFTCardsShowcase />        // Card images
<HowItWorks />              // Feature cards
<NFTFragmentsSection />     // Fragments info
<InfoSection />             // Bottom columns
<Footer />                  // Copyright
\`\`\`

## 🔧 Maintenance

### Adding New Sections
1. Create new component in `components/`
2. Import and use in `app/page.tsx`
3. Follow glassmorphism design pattern

### Styling Guidelines
- Use `backdrop-blur-*` for glass effects
- Apply `rgba()` colors with low opacity
- Add subtle borders with `border-white/10`
- Use smooth transitions for hover states

## 📦 Dependencies
- Next.js 16
- React 19
- Tailwind CSS 4
- shadcn/ui components
- Space Grotesk & Inter fonts
