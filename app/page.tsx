// Import Link from Next.js
import Link from 'next/link'

// Define a list of NASA APIs with their names, descriptions, icons, and categories
const apis = [
    {
        name: 'APOD',
        description: 'Astronomy Picture of the Day',
        href: '/apod',
        category: 'space',
        emoji: '🌌',
    },
    {
        name: 'Asteroids',
        description: 'Near Earth Object Web Service',
        href: '/asteroids',
        category: 'space',
        emoji: '☄️',
    },
    {
        name: 'DONKI',
        description: 'Space Weather Database',
        href: '/donki',
        category: 'space',
        emoji: '☀️',
    },
    {
        name: 'EONET',
        description: 'Earth Observatory Natural Event Tracker',
        href: '/eonet',
        category: 'earth',
        emoji: '🌍',
    },
    {
        name: 'EPIC',
        description: 'Earth Polychromatic Imaging Camera',
        href: '/epic',
        category: 'earth',
        emoji: '📷',
    },
    {
        name: 'Exoplanet',
        description: 'Exoplanet Archive',
        href: '/exoplanet',
        category: 'space',
        emoji: '🪐',
    },
    {
        name: 'GIBS',
        description: 'Global Imagery Browse Services',
        href: '/gibs',
        category: 'earth',
        emoji: '🗺️',
    },
    {
        name: 'InSight',
        description: 'InSight Mars Lander',
        href: '/insight',
        category: 'mars',
        emoji: '🔴',
    },
    {
        name: 'Library',
        description: 'NASA Image and Video Library',
        href: '/library',
        category: 'data',
        emoji: '📚',
    },
    {
        name: 'OPEN',
        description: 'Open Science Data Repository',
        href: '/open',
        category: 'data',
        emoji: '🔬',
    },
    {
        name: 'Satellite',
        description: 'Satellite Situation Center',
        href: '/satellite',
        category: 'space',
        emoji: '🛰️',
    },
    {
        name: 'SSD/CNEOS',
        description: 'Solar System Dynamics',
        href: '/ssd',
        category: 'space',
        emoji: '💫',
    },
    {
        name: 'Techport',
        description: 'Technology Projects',
        href: '/techport',
        category: 'tech',
        emoji: '🚀',
    },
    {
        name: 'TechTransfer',
        description: 'Patents, Software & Tech Reports',
        href: '/techtransfer',
        category: 'tech',
        emoji: '💡',
    },
    {
        name: 'TLE',
        description: 'Two Line Element Sets',
        href: '/tle',
        category: 'data',
        emoji: '📡',
    },
    {
        name: 'TREK',
        description: 'Planetary Mapping',
        href: '/trek',
        category: 'space',
        emoji: '🌙',
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

// Category descriptions
const categoryDescriptions: Record<string, string> = {
    space: 'Explore the cosmos, asteroids, and solar system',
    earth: 'Monitor our planet and natural events',
    mars: 'Data from Mars missions and exploration',
    data: 'Access NASA archives and scientific data',
    tech: 'Technology projects and innovations',
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
]

// Group APIs by category
const apisByCategory = apis.reduce(
    (acc, api) => {
        if (!acc[api.category]) {
            acc[api.category] = []
        }
        acc[api.category].push(api)
        return acc
    },
    {} as Record<string, typeof apis>
)

export default function Home() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900/30 to-slate-900" />
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: '1s' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

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
            <header className="relative px-4 sm:px-6 pt-8 pb-12 md:pt-16 md:pb-20 text-center">
                <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white/80 text-sm">
                            16 APIs Available
                        </span>
                    </div>

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

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4">
                        {Object.entries(categoryLabels).map(([key, label]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full bg-linear-to-r ${categoryGradients[key]}`}
                                />
                                <span className="text-white/50 text-sm">
                                    {apisByCategory[key]?.length || 0} {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* API Grid Section */}
            <main className="px-4 sm:px-6 pb-20">
                <div className="max-w-7xl mx-auto">
                    {/* Category Sections */}
                    {Object.entries(categoryLabels).map(
                        ([categoryKey, categoryLabel], catIndex) => (
                            <section key={categoryKey} className="mb-12">
                                {/* Category Header */}
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 animate-fade-in-up"
                                    style={{
                                        animationDelay: `${catIndex * 100}ms`,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl bg-linear-to-r ${categoryGradients[categoryKey]} flex items-center justify-center shadow-lg`}
                                        >
                                            <span className="text-lg">
                                                {categoryKey === 'space'
                                                    ? '🌌'
                                                    : categoryKey === 'earth'
                                                      ? '🌍'
                                                      : categoryKey === 'mars'
                                                        ? '🔴'
                                                        : categoryKey === 'data'
                                                          ? '📊'
                                                          : '⚡'}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">
                                            {categoryLabel}
                                        </h2>
                                    </div>
                                    <p className="text-white/40 text-sm sm:ml-2">
                                        {categoryDescriptions[categoryKey]}
                                    </p>
                                </div>

                                {/* API Cards Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {apisByCategory[categoryKey]?.map(
                                        (api, index) => (
                                            <Link
                                                key={api.href}
                                                href={api.href}
                                                className="glass-card group p-5 animate-fade-in-up hover:border-white/30"
                                                style={{
                                                    animationDelay: `${catIndex * 100 + index * 50}ms`,
                                                }}
                                            >
                                                {/* Hover gradient overlay */}
                                                <div
                                                    className={`absolute inset-0 bg-linear-to-br ${categoryGradients[api.category]} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                                                />

                                                {/* Content */}
                                                <div className="relative z-10">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">
                                                                {api.emoji}
                                                            </span>
                                                            <div>
                                                                <h3 className="font-semibold text-lg text-white group-hover:text-gradient transition-all duration-300">
                                                                    {api.name}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300 line-clamp-2">
                                                        {api.description}
                                                    </p>

                                                    {/* Arrow indicator */}
                                                    <div className="mt-4 flex items-center text-white/30 group-hover:text-cyan-400 transition-all duration-300">
                                                        <span className="text-sm">
                                                            Explore
                                                        </span>
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
                                                </div>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </section>
                        )
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="px-4 sm:px-6 py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-6 sm:p-8">
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* Brand */}
                            <div className="lg:col-span-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                        <span className="text-xl">🚀</span>
                                    </div>
                                    <span className="text-xl font-semibold text-gradient">
                                        NASA OPEN APIs
                                    </span>
                                </div>
                                <p className="text-white/50 text-sm">
                                    All data provided by NASA&apos;s public
                                    APIs. This is an educational project
                                    showcasing the incredible data NASA makes
                                    available to everyone.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div className="lg:col-span-1">
                                <h4 className="font-semibold text-white mb-4">
                                    Quick Links
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {apis.slice(0, 6).map((api) => (
                                        <Link
                                            key={api.href}
                                            href={api.href}
                                            className="text-white/50 hover:text-white text-sm transition-colors"
                                        >
                                            {api.emoji} {api.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="lg:col-span-1">
                                <h4 className="font-semibold text-white mb-4">
                                    Get Started
                                </h4>
                                <p className="text-white/50 text-sm mb-4">
                                    Get your free NASA API key to access all
                                    endpoints.
                                </p>
                                <a
                                    href="https://api.nasa.gov"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button text-sm inline-flex"
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
                        </div>

                        {/* Bottom */}
                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-sm text-white/40">
                                Developed by{' '}
                                <span className="text-white/60">
                                    Ramón Ruiz
                                </span>{' '}
                                and ☕
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
