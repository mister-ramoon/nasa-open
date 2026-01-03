'use client'

// Import necessary modules and types
import { useState } from 'react'
import Image from 'next/image'
import type { ProcessedLibraryItem } from '@/lib/types/library.type'

// Define props interface
interface NASACenter {
    id: string
    name: string
}

// Define props interface
interface LibraryClientProps {
    featured: ProcessedLibraryItem[]
    marsItems: ProcessedLibraryItem[]
    moonItems: ProcessedLibraryItem[]
    marsTotalHits: number
    moonTotalHits: number
    popularSearches: readonly string[]
    nasaCenters: readonly NASACenter[]
}

// Media type icons and colors
const mediaTypeConfig: Record<string, { icon: string; color: string }> = {
    image: { icon: '📷', color: 'from-blue-500 to-cyan-500' },
    video: { icon: '🎬', color: 'from-purple-500 to-pink-500' },
    audio: { icon: '🎧', color: 'from-green-500 to-emerald-500' },
}

// Category colors for search tags
const searchTagColors = [
    'from-orange-500 to-red-500',
    'from-blue-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-green-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-blue-500',
    'from-yellow-500 to-amber-500',
    'from-teal-500 to-cyan-500',
]

// Image Card Component
function MediaCard({
    item,
    index,
    size = 'normal',
    onSelect,
}: {
    item: ProcessedLibraryItem
    index: number
    size?: 'normal' | 'large' | 'small'
    onSelect: () => void
}) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const config = mediaTypeConfig[item.mediaType] || mediaTypeConfig.image

    const heights = {
        small: 'h-32',
        normal: 'h-48',
        large: 'h-64',
    }

    return (
        <div
            className="glass-card overflow-hidden animate-fade-in-up opacity-0 group cursor-pointer hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: `${(index % 12) * 50}ms` }}
            onClick={onSelect}
        >
            {/* Image */}
            <div
                className={`relative ${heights[size]} bg-white/5 overflow-hidden`}
            >
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
                {item.thumbnailUrl && !imageError ? (
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        unoptimized
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                        <span className="text-4xl">{config.icon}</span>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Media Type Badge */}
                <div className="absolute top-3 right-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${config.color} text-white`}
                    >
                        {config.icon} {item.mediaType}
                    </span>
                </div>

                {/* View button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="glass-button text-sm">View Details</span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 text-sm">
                    {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                    <span>{item.center}</span>
                    <span>•</span>
                    <span>
                        {new Date(item.dateCreated).toLocaleDateString()}
                    </span>
                </div>
                {item.description && size !== 'small' && (
                    <p className="text-xs text-white/60 mt-2 line-clamp-2">
                        {item.description}
                    </p>
                )}
            </div>
        </div>
    )
}

// Featured Card (Large)
function FeaturedCard({
    item,
    index,
    onSelect,
}: {
    item: ProcessedLibraryItem
    index: number
    onSelect: () => void
}) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const config = mediaTypeConfig[item.mediaType] || mediaTypeConfig.image

    return (
        <div
            className="glass-card overflow-hidden animate-fade-in-up opacity-0 group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={onSelect}
        >
            <div className="relative h-72 bg-white/5 overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
                {item.thumbnailUrl && (
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className={`object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        unoptimized
                        onLoad={() => setImageLoaded(true)}
                        priority={index < 2}
                    />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${config.color} text-white mb-3`}
                    >
                        {config.icon} {item.mediaType}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                        {item.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2">
                        {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-white/50">
                        <span>{item.center}</span>
                        <span>•</span>
                        <span>
                            {new Date(item.dateCreated).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Media Detail Modal
function MediaModal({
    item,
    onClose,
}: {
    item: ProcessedLibraryItem
    onClose: () => void
}) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const config = mediaTypeConfig[item.mediaType] || mediaTypeConfig.image

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image */}
                {item.thumbnailUrl && (
                    <div className="relative aspect-video bg-white/5">
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                        <Image
                            src={item.thumbnailUrl.replace('~thumb', '~medium')}
                            alt={item.title}
                            fill
                            className={`object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            unoptimized
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${config.color} text-white mb-2`}
                            >
                                {config.icon} {item.mediaType}
                            </span>
                            <h2 className="text-2xl font-bold text-white">
                                {item.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white text-2xl transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/50 text-xs">Center</p>
                            <p className="text-white font-semibold">
                                {item.center}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/50 text-xs">Date</p>
                            <p className="text-white font-semibold">
                                {new Date(
                                    item.dateCreated
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        {item.photographer && (
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs">
                                    Photographer
                                </p>
                                <p className="text-white font-semibold">
                                    {item.photographer}
                                </p>
                            </div>
                        )}
                        {item.location && (
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs">
                                    Location
                                </p>
                                <p className="text-white font-semibold">
                                    {item.location}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {item.description && (
                        <div className="mb-4">
                            <p className="text-white/70 text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    )}

                    {/* Keywords */}
                    {item.keywords.length > 0 && (
                        <div className="mb-4">
                            <p className="text-white/50 text-xs mb-2">
                                Keywords
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {item.keywords
                                    .slice(0, 10)
                                    .map((keyword, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={`https://images.nasa.gov/details/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button"
                        >
                            🔗 View on NASA
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

// NASA Center Card
function CenterCard({ center, index }: { center: NASACenter; index: number }) {
    return (
        <div
            className="glass-card p-4 animate-fade-in-up opacity-0 group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            style={{ animationDelay: `${(index % 12) * 50}ms` }}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {center.id}
                </div>
                <div>
                    <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {center.id}
                    </p>
                    <p className="text-sm text-white/60">{center.name}</p>
                </div>
            </div>
        </div>
    )
}

export default function LibraryClient({
    featured,
    marsItems,
    moonItems,
    marsTotalHits,
    moonTotalHits,
    popularSearches,
    nasaCenters,
}: LibraryClientProps) {
    const [selectedItem, setSelectedItem] =
        useState<ProcessedLibraryItem | null>(null)
    const [activeTab, setActiveTab] = useState<'mars' | 'moon'>('mars')

    const currentItems = activeTab === 'mars' ? marsItems : moonItems
    const currentTotal = activeTab === 'mars' ? marsTotalHits : moonTotalHits

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <header className="relative px-6 pt-8 pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-fade-in-up space-y-4 mb-8">
                        <h1 className="title-section text-white">
                            <span className="text-gradient">
                                NASA Media Library
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Explore NASA&apos;s vast archive of images, videos,
                            and audio from missions, discoveries, and historic
                            moments in space exploration.
                        </p>
                    </div>
                </div>
            </header>

            {/* Popular Searches */}
            <section className="px-4 -mt-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-6 animate-fade-in-up opacity-0">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span>🔍</span> Popular Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {popularSearches.map((term, index) => (
                                <span
                                    key={term}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r ${searchTagColors[index % searchTagColors.length]} text-white cursor-pointer hover:scale-105 transition-transform`}
                                >
                                    {term}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 text-center">
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-3xl font-black text-gradient">
                                140K+
                            </p>
                            <p className="text-white/60 text-sm">Images</p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-1 text-center">
                            <div className="text-4xl mb-2">🎬</div>
                            <p className="text-3xl font-black text-purple-400">
                                15K+
                            </p>
                            <p className="text-white/60 text-sm">Videos</p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-2 text-center">
                            <div className="text-4xl mb-2">🎧</div>
                            <p className="text-3xl font-black text-green-400">
                                5K+
                            </p>
                            <p className="text-white/60 text-sm">Audio Files</p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-3 text-center">
                            <div className="text-4xl mb-2">🏛️</div>
                            <p className="text-3xl font-black text-amber-400">
                                {nasaCenters.length}
                            </p>
                            <p className="text-white/60 text-sm">
                                NASA Centers
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Content */}
            {featured.length > 0 && (
                <section className="px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 animate-fade-in-up opacity-0">
                            <span className="text-3xl">⭐</span>
                            Featured Content
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featured.slice(0, 6).map((item, index) => (
                                <FeaturedCard
                                    key={`${item.id}-${index}`}
                                    item={item}
                                    index={index}
                                    onSelect={() => setSelectedItem(item)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Mars/Moon Images */}
            <section className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('mars')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                                    activeTab === 'mars'
                                        ? 'bg-linear-to-r from-orange-500 to-red-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                🔴 Mars
                                <span className="text-xs opacity-70">
                                    ({marsTotalHits.toLocaleString()})
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('moon')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                                    activeTab === 'moon'
                                        ? 'bg-linear-to-r from-gray-400 to-slate-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                🌙 Moon
                                <span className="text-xs opacity-70">
                                    ({moonTotalHits.toLocaleString()})
                                </span>
                            </button>
                        </div>
                        <p className="text-white/50 text-sm">
                            Showing {currentItems.length} of{' '}
                            {currentTotal.toLocaleString()} results
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentItems.map((item, index) => (
                            <MediaCard
                                key={`${item.id}-${index}`}
                                item={item}
                                index={index}
                                onSelect={() => setSelectedItem(item)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* NASA Centers */}
            <section className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 animate-fade-in-up opacity-0">
                        <span className="text-3xl">🏛️</span>
                        NASA Centers
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {nasaCenters.map((center, index) => (
                            <CenterCard
                                key={center.id}
                                center={center}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* API Info */}
            <section className="px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-8 animate-fade-in-up opacity-0">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🔧</span>
                            API Endpoints
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="bg-white/5 rounded-lg p-4 font-mono text-sm">
                                    <span className="text-blue-400">GET</span>
                                    <span className="text-white/70">
                                        {' '}
                                        /search?q=
                                    </span>
                                    <span className="text-green-400">
                                        &#123;query&#125;
                                    </span>
                                    <p className="text-white/50 text-xs mt-1 font-sans">
                                        Search the library
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 font-mono text-sm">
                                    <span className="text-blue-400">GET</span>
                                    <span className="text-white/70">
                                        {' '}
                                        /asset/
                                    </span>
                                    <span className="text-green-400">
                                        &#123;nasa_id&#125;
                                    </span>
                                    <p className="text-white/50 text-xs mt-1 font-sans">
                                        Get asset manifest
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white/5 rounded-lg p-4 font-mono text-sm">
                                    <span className="text-blue-400">GET</span>
                                    <span className="text-white/70">
                                        {' '}
                                        /metadata/
                                    </span>
                                    <span className="text-green-400">
                                        &#123;nasa_id&#125;
                                    </span>
                                    <p className="text-white/50 text-xs mt-1 font-sans">
                                        Get metadata location
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 font-mono text-sm">
                                    <span className="text-blue-400">GET</span>
                                    <span className="text-white/70">
                                        {' '}
                                        /captions/
                                    </span>
                                    <span className="text-green-400">
                                        &#123;nasa_id&#125;
                                    </span>
                                    <p className="text-white/50 text-xs mt-1 font-sans">
                                        Get video captions
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <a
                                href="https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                View Full API Documentation →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Media Modal */}
            {selectedItem && (
                <MediaModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    )
}
