# 🚀 NASA Open APIs Explorer

A modern, responsive web application that provides an intuitive interface to explore NASA's Open APIs. Built with Next.js 16 and featuring Apple's "Liquid Glass" design system for a stunning visual experience.

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)

## ✨ Features

- **16 NASA APIs** - Comprehensive access to NASA's public data
- **Liquid Glass Design** - Apple-inspired glassmorphism UI with smooth animations
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Dark Theme** - Easy on the eyes with a space-themed dark interface
- **Smooth Animations** - Subtle transitions and hover effects
- **Loading States** - Skeleton loaders and animated fallbacks
- **Scroll Restoration** - Automatic scroll-to-top on navigation

## 🌌 Available APIs

### 🌟 Space & Astronomy

| API                   | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| **APOD**              | Astronomy Picture of the Day - Daily curated space images    |
| **Asteroids (NeoWs)** | Near Earth Object Web Service - Asteroid tracking data       |
| **DONKI**             | Space Weather Database - Solar events and geomagnetic storms |
| **Exoplanet Archive** | Confirmed exoplanets and stellar data                        |

### 🌍 Earth Observation

| API       | Description                                              |
| --------- | -------------------------------------------------------- |
| **EONET** | Earth Observatory Natural Event Tracker                  |
| **EPIC**  | Earth Polychromatic Imaging Camera - Daily Earth images  |
| **GIBS**  | Global Imagery Browse Services - Satellite imagery tiles |

### 🔴 Mars Exploration

| API         | Description                                        |
| ----------- | -------------------------------------------------- |
| **InSight** | Mars Weather Service - Martian meteorological data |
| **Trek**    | Planetary mapping and terrain data                 |

### 📊 Data & Archives

| API                    | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| **NASA Image Library** | Vast archive of NASA images and media                 |
| **Open Science**       | Scientific datasets and research data                 |
| **SSD/CNEOS**          | Solar System Dynamics - Orbit and close approach data |
| **Satellite (TLE)**    | Two-Line Element sets for satellite tracking          |
| **TLE API**            | Satellite orbital parameters                          |

### 🔧 Technology & Innovation

| API              | Description                                 |
| ---------------- | ------------------------------------------- |
| **TechPort**     | NASA technology projects portfolio          |
| **TechTransfer** | Patents, software, and spinoff technologies |

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Paradigm:** Server Components + Client Components
- **Fonts:** Geist Sans & Geist Mono
- **Package Manager:** pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/nasa-open.git
    cd nasa-open
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Add your NASA API key (get one free at [api.nasa.gov](https://api.nasa.gov/)):

    ```env
    NASA_API_KEY=your_api_key_here
    ```

4. **Start the development server**

    ```bash
    pnpm dev
    ```

5. **Open your browser**

    Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
nasa-open/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Navbar
│   ├── page.tsx            # Home page
│   ├── loading.tsx         # Global loading state
│   ├── globals.css         # Global styles & design system
│   ├── apod/               # APOD page
│   ├── asteroids/          # Asteroids page
│   ├── donki/              # DONKI page
│   ├── eonet/              # EONET page
│   ├── epic/               # EPIC page
│   ├── exoplanet/          # Exoplanet page
│   ├── gibs/               # GIBS page
│   ├── insight/            # InSight page
│   ├── library/            # NASA Library page
│   ├── open/               # Open Science page
│   ├── satellite/          # Satellite page
│   ├── ssd/                # SSD/CNEOS page
│   ├── techport/           # TechPort page
│   ├── techtransfer/       # TechTransfer page
│   ├── tle/                # TLE page
│   └── trek/               # Trek page
├── components/             # Reusable UI components
│   ├── Navbar.tsx          # Responsive navigation
│   ├── BackToTop.tsx       # Scroll-to-top button
│   ├── Loading.tsx         # Skeleton components
│   └── ScrollRestoration.tsx # Route change scroll fix
├── lib/
│   ├── constants/          # API constants & configurations
│   ├── services/           # API service functions
│   └── types/              # TypeScript type definitions
└── public/                 # Static assets
```

## 🎨 Design System

### Liquid Glass Components

The UI implements Apple's "Liquid Glass" design language with:

- **Glass Cards** - Translucent containers with backdrop blur
- **Gradient Backgrounds** - Animated cosmic gradients
- **Floating Particles** - Ambient particle effects
- **Glow Effects** - Subtle glows on interactive elements
- **Smooth Transitions** - 300ms ease-out animations

### CSS Classes

```css
.glass-card        /* Base glass container */
.glass-card-glow   /* Glass with hover glow effect */
.glass-card-inner  /* Nested glass element */
.glass-button      /* Interactive glass button */
.text-gradient     /* Gradient text effect */
.animate-fade-in-up /* Entry animation */
```

### Color Palette

| Color           | Usage           |
| --------------- | --------------- |
| `slate-900`     | Base background |
| `purple-500/20` | Accent glow     |
| `cyan-500/20`   | Secondary glow  |
| `white/10`      | Glass surfaces  |
| `white/20`      | Glass borders   |

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NASA Open APIs](https://api.nasa.gov/) for providing free access to space data
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- Apple's design team for the Liquid Glass inspiration

---

<p align="center">
  Made with ❤️ for space enthusiasts
  <br>
  <a href="https://api.nasa.gov/">NASA Open APIs</a> •
  <a href="https://nextjs.org/">Next.js</a> •
  <a href="https://tailwindcss.com/">Tailwind CSS</a>
</p>
