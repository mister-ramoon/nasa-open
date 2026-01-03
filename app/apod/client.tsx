'use client'

// Import necessary modules and types
import { useState } from 'react'
import Image from 'next/image'
import type { ApodImage } from '@/lib/types/apod.type'

interface ApodClientProps {
    apod: ApodImage
    constants: {
        title: string
        description: string
    }
}

// Format date for display
function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

// Stats Card Component
function StatsCard({
    label,
    value,
    icon,
    delay = 0,
}: {
    label: string
    value: string | number
    icon: React.ReactNode
    delay?: number
}) {
    return (
        <div
            className="glass-card group animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="glass-card-inner p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {value}
                        </p>
                        <p className="text-sm text-white/60 mt-1">{label}</p>
                    </div>
                    <div className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Info Card Component
function InfoCard({
    title,
    value,
    icon,
    href,
    delay = 0,
}: {
    title: string
    value: string
    icon: string
    href?: string
    delay?: number
}) {
    const content = (
        <div className="glass-card-inner p-5 relative z-10">
            <div className="flex items-start gap-3">
                <span className="text-2xl">{icon}</span>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/50 mb-1">{title}</p>
                    {href ? (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm break-all transition-colors"
                        >
                            {value}
                        </a>
                    ) : (
                        <p className="text-white font-medium">{value}</p>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div
            className="glass-card group animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            {content}
        </div>
    )
}

export default function ApodClient({ apod, constants }: ApodClientProps) {
    const [isHdLoaded, setIsHdLoaded] = useState(false)
    const [showFullscreen, setShowFullscreen] = useState(false)

    return (
        <div className="min-h-screen relative">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-indigo-900/30 to-slate-900" />
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: '1s' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="relative pb-4">
                    <div className="mx-auto">
                        <div className="animate-fade-in-up space-y-4 mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                <span className="text-white/80 text-sm">
                                    Daily Cosmic Wonder
                                </span>
                            </div>
                            <h1 className="title-section text-white">
                                <span className="text-gradient">
                                    {constants.title}
                                </span>
                            </h1>
                            <p className="text-white/60 text-lg max-w-2xl">
                                {constants.description.substring(0, 200)}...
                            </p>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <StatsCard
                        label="Picture Date"
                        value={apod.date}
                        icon="📅"
                        delay={0}
                    />
                    <StatsCard
                        label="Media Type"
                        value={apod.media_type === 'image' ? 'Image' : 'Video'}
                        icon={apod.media_type === 'image' ? '🖼️' : '🎬'}
                        delay={100}
                    />
                    <StatsCard
                        label="API Version"
                        value={apod.service_version}
                        icon="⚙️"
                        delay={200}
                    />
                    <StatsCard
                        label="Since 1995"
                        value="10K+"
                        icon="✨"
                        delay={300}
                    />
                </section>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto">
                    {/* Title */}
                    <h2
                        className="text-3xl md:text-4xl font-bold text-white text-center mb-8 animate-fade-in-up"
                        style={{ animationDelay: '150ms' }}
                    >
                        {apod.title}
                    </h2>

                    {/* Media Container */}
                    <div
                        className="glass-card overflow-hidden mb-8 animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="relative group">
                            {apod.media_type === 'image' ? (
                                <>
                                    <div className="relative w-full aspect-video md:aspect-auto md:min-h-96">
                                        <Image
                                            src={apod.hdurl || apod.url}
                                            alt={apod.title}
                                            fill
                                            className="object-contain"
                                            priority
                                            onLoad={() => setIsHdLoaded(true)}
                                        />
                                        {!isHdLoaded && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2" />
                                                    <p className="text-white/60 text-sm">
                                                        Loading HD Image...
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Controls */}
                                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {apod.hdurl && (
                                            <a
                                                href={apod.hdurl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-white text-sm hover:bg-black/80 transition-colors flex items-center gap-2"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                    />
                                                </svg>
                                                HD Image
                                            </a>
                                        )}
                                        <button
                                            onClick={() =>
                                                setShowFullscreen(true)
                                            }
                                            className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm text-white text-sm hover:bg-black/80 transition-colors flex items-center gap-2"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                                />
                                            </svg>
                                            Fullscreen
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="relative w-full aspect-video">
                                    <iframe
                                        src={apod.url}
                                        className="absolute inset-0 w-full h-full"
                                        allowFullScreen
                                        title={apod.title}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Explanation */}
                    <div
                        className="glass-card mb-8 animate-fade-in-up"
                        style={{ animationDelay: '250ms' }}
                    >
                        <div className="glass-card-inner p-6 md:p-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-2xl">📖</span>
                                About This Image
                            </h3>
                            <p className="text-white/70 leading-relaxed text-lg">
                                {apod.explanation}
                            </p>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div
                        className="grid gap-4 md:grid-cols-2 animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        {apod.copyright && (
                            <InfoCard
                                title="Copyright"
                                value={apod.copyright}
                                icon="©"
                                delay={0}
                            />
                        )}
                        <InfoCard
                            title="Formatted Date"
                            value={formatDate(apod.date)}
                            icon="📆"
                            delay={50}
                        />
                        <InfoCard
                            title="Image URL"
                            value={apod.url}
                            icon="🔗"
                            href={apod.url}
                            delay={100}
                        />
                        {apod.hdurl && (
                            <InfoCard
                                title="HD Image URL"
                                value={apod.hdurl}
                                icon="🖼️"
                                href={apod.hdurl}
                                delay={150}
                            />
                        )}
                    </div>

                    {/* Fun Facts Section */}
                    <section
                        className="mt-12 glass-card animate-fade-in-up"
                        style={{ animationDelay: '350ms' }}
                    >
                        <div className="glass-card-inner p-6 md:p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-2xl">✨</span>
                                APOD Fun Facts
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-3xl font-bold text-gradient mb-1">
                                        1995
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        Year APOD was launched
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-3xl font-bold text-gradient mb-1">
                                        10K+
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        Images published to date
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-3xl font-bold text-gradient mb-1">
                                        1M+
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        Daily page views
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-3xl font-bold text-gradient mb-1">
                                        21+
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        Languages available
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-3xl font-bold text-gradient mb-1">
                                        NASA
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        Most popular website
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <p className="text-3xl font-bold text-gradient mb-1">
                                        MTU
                                    </p>
                                    <p className="text-white/60 text-sm">
                                        Co-managed with Michigan Tech
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Resources */}
                    <section className="py-8 mt-8">
                        <div className="glass-card-glow p-8 text-center">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2">
                                <span className="text-2xl">🔗</span>
                                Resources
                            </h3>
                            <div className="flex flex-wrap gap-3 justify-center">
                                <a
                                    href="https://apod.nasa.gov/apod/astropix.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button hover:scale-105 transition-all text-blue-300"
                                >
                                    🌐 Official APOD Website
                                </a>
                                <a
                                    href="https://apod.nasa.gov/apod/archivepix.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button hover:scale-105 transition-all text-purple-300"
                                >
                                    📚 APOD Archive
                                </a>
                                <a
                                    href="https://api.nasa.gov"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button hover:scale-105 transition-all text-emerald-300"
                                >
                                    🔑 NASA API Portal
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {showFullscreen && apod.media_type === 'image' && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setShowFullscreen(false)}
                >
                    <button
                        className="absolute top-4 right-4 p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
                        onClick={() => setShowFullscreen(false)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <Image
                        src={apod.hdurl || apod.url}
                        alt={apod.title}
                        fill
                        className="object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    )
}
