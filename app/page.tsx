// Import Link from Next.js
import Link from 'next/link'

// Define a list of NASA APIs with their names, descriptions, icons, and categories
const apis = [
    {
        name: 'APOD',
        description: 'Astronomy Picture of the Day',
        href: '/apod',
        category: 'space',
    },
    {
        name: 'Asteroids',
        description: 'Near Earth Object Web Service',
        href: '/asteroids',
        category: 'space',
    },
    {
        name: 'DONKI',
        description: 'Space Weather Database',
        href: '/donki',
        category: 'space',
    },
    {
        name: 'EONET',
        description: 'Earth Observatory Natural Event Tracker',
        href: '/eonet',
        category: 'earth',
    },
    {
        name: 'EPIC',
        description: 'Earth Polychromatic Imaging Camera',
        href: '/epic',
        category: 'earth',
    },
    {
        name: 'Exoplanet',
        description: 'Exoplanet Archive',
        href: '/exoplanet',
        category: 'space',
    },
    {
        name: 'GIBS',
        description: 'Global Imagery Browse Services',
        href: '/gibs',
        category: 'earth',
    },
    {
        name: 'InSight',
        description: 'InSight Mars Lander',
        href: '/insight',
        category: 'mars',
    },
    {
        name: 'Library',
        description: 'NASA Image and Video Library',
        href: '/library',
        category: 'data',
    },
    {
        name: 'OPEN',
        description: 'Open Science Data Repository',
        href: '/open',
        category: 'data',
    },
    {
        name: 'Satellite',
        description: 'Satellite Situation Center',
        href: '/satellite',
        category: 'space',
    },
    {
        name: 'SSD/CNEOS',
        description: 'Solar System Dynamics',
        href: '/ssd',
        category: 'space',
    },
    {
        name: 'Techport',
        description: 'Technology Projects',
        href: '/techport',
        category: 'tech',
    },
    {
        name: 'TechTransfer',
        description: 'Patents, Software & Tech Reports',
        href: '/techtransfer',
        category: 'tech',
    },
    {
        name: 'TLE',
        description: 'Two Line Element Sets',
        href: '/tle',
        category: 'data',
    },
    {
        name: 'TREK',
        description: 'Planetary Mapping',
        href: '/trek',
        category: 'space',
    },
]

// Define gradient backgrounds for each category
const categoryGradients: Record<string, string> = {
    space: 'from-purple-500 via-violet-500 to-indigo-500',
    earth: 'from-emerald-500 via-green-500 to-teal-500',
    mars: 'from-red-500 via-orange-500 to-amber-500',
    data: 'from-blue-500 via-cyan-500 to-sky-500',
    tech: 'from-pink-500 via-rose-500 to-fuchsia-500',
}

// Define labels for each category
const categoryLabels: Record<string, string> = {
    space: 'Space',
    earth: 'Earth',
    mars: 'Mars',
    data: 'Data',
    tech: 'Tech',
}

// Pre-defined particle positions for SSR compatibility
const particles = [
    { left: '5%', delay: '0s', duration: '18s' },
    { left: '15%', delay: '2s', duration: '22s' },
    { left: '25%', delay: '4s', duration: '16s' },
    { left: '35%', delay: '1s', duration: '20s' },
    { left: '45%', delay: '3s', duration: '19s' },
    { left: '55%', delay: '5s', duration: '21s' },
    { left: '65%', delay: '2.5s', duration: '17s' },
    { left: '75%', delay: '4.5s', duration: '23s' },
    { left: '85%', delay: '1.5s', duration: '18s' },
    { left: '95%', delay: '3.5s', duration: '20s' },
    { left: '10%', delay: '6s', duration: '19s' },
    { left: '20%', delay: '7s', duration: '21s' },
    { left: '30%', delay: '8s', duration: '17s' },
    { left: '40%', delay: '9s', duration: '22s' },
    { left: '50%', delay: '10s', duration: '16s' },
    { left: '60%', delay: '11s', duration: '20s' },
    { left: '70%', delay: '12s', duration: '18s' },
    { left: '80%', delay: '13s', duration: '21s' },
    { left: '90%', delay: '14s', duration: '19s' },
    { left: '100%', delay: '15s', duration: '17s' },
]

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Floating particles background */}
            <div className="particles">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: p.left,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                        }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <header className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                    {/* Main Title */}
                    <h1 className="title-hero">
                        <span className="text-gradient">NASA OPEN</span>
                        <br />
                        <span className="text-white">APIs Explorer</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-body text-white/60 max-w-2xl mx-auto">
                        Access NASA&apos;s incredible collection of open APIs.
                        From stunning space imagery to real-time asteroid
                        tracking, discover the cosmos through data.
                    </p>
                </div>
            </header>

            {/* API Grid Section */}
            <main className="px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12 animate-fade-in-up opacity-0 stagger-2">
                        <h2 className="title-section text-gradient-aurora mb-4">
                            Available APIs
                        </h2>
                        <p className="text-white/50">
                            Select an API to explore its data and capabilities
                        </p>
                    </div>

                    {/* API Cards Grid */}
                    <div className="api-grid">
                        {apis.map((api, index) => (
                            <Link
                                key={api.href}
                                href={api.href}
                                className={`
                                    glass-card glass-card-glow p-6 
                                    opacity-0 animate-fade-in-up stagger-${index + 1}
                                    group cursor-pointer
                                `}
                            >
                                {/* Content */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg text-white group-hover:text-gradient transition-all duration-300">
                                            {api.name}
                                        </h3>
                                        <span
                                            className={`
                                            text-xs px-2 py-0.5 rounded-full
                                            bg-linear-to-r ${categoryGradients[api.category]}
                                            text-white font-medium opacity-80
                                        `}
                                        >
                                            {categoryLabels[api.category]}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300">
                                        {api.description}
                                    </p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="mt-4 flex items-center text-white/30 group-hover:text-white/70 transition-all duration-300">
                                    <span className="text-sm">Explore</span>
                                    <svg
                                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-6 py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-xl font-semibold text-gradient">
                                NASA OPEN APIs Explorer
                            </span>
                        </div>
                        <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
                            All data provided by NASA&apos;s public APIs. This
                            is an educational project showcasing the incredible
                            data NASA makes available to everyone.
                        </p>
                        <div className="flex justify-center gap-4">
                            <a
                                href="https://api.nasa.gov"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button text-sm"
                            >
                                <span>Get API Key</span>
                                <svg
                                    className="w-4 h-4 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>
                        <div className="max-w-md mx-auto text-center">
                            <p className="text-sm text-white mt-6">
                                Develop by Ramón Ruiz and coffee ☕
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
