'use client'

// Import necessary modules and types
import { useState, useMemo } from 'react'
import type { EONETEvent, EONETCategory } from '@/lib/types/eonet.type'

// Category icons and colors
const categoryStyles: Record<string, { icon: string; gradient: string }> = {
    wildfires: { icon: '🔥', gradient: 'from-orange-500 to-red-500' },
    volcanoes: { icon: '🌋', gradient: 'from-red-600 to-orange-500' },
    severeStorms: { icon: '🌀', gradient: 'from-blue-500 to-purple-500' },
    earthquakes: { icon: '🌍', gradient: 'from-amber-600 to-yellow-500' },
    floods: { icon: '🌊', gradient: 'from-blue-400 to-cyan-500' },
    landslides: { icon: '⛰️', gradient: 'from-stone-500 to-stone-400' },
    seaLakeIce: { icon: '🧊', gradient: 'from-cyan-400 to-blue-300' },
    snow: { icon: '❄️', gradient: 'from-slate-300 to-blue-200' },
    drought: { icon: '🏜️', gradient: 'from-yellow-600 to-amber-400' },
    dustHaze: { icon: '💨', gradient: 'from-stone-400 to-stone-300' },
    tempExtremes: { icon: '🌡️', gradient: 'from-red-500 to-blue-500' },
    waterColor: { icon: '💧', gradient: 'from-teal-400 to-green-400' },
    manmade: { icon: '🏭', gradient: 'from-gray-500 to-gray-400' },
}

// Get style for category
function getCategoryStyle(categoryId: string): {
    icon: string
    gradient: string
} {
    const id = categoryId.toLowerCase()
    for (const [key, value] of Object.entries(categoryStyles)) {
        if (id.includes(key.toLowerCase())) return value
    }
    return { icon: '📍', gradient: 'from-purple-500 to-pink-500' }
}

// Stats Card Component
interface StatsCardProps {
    label: string
    value: string | number
    icon: string
    gradient?: string
    delay?: number
}

// Stats Card Component
function StatsCard({
    label,
    value,
    icon,
    gradient = 'from-blue-500 to-purple-500',
    delay = 0,
}: StatsCardProps) {
    return (
        <div
            className="glass-card p-6 animate-fade-in-up opacity-0"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/60 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gradient">{value}</p>
                </div>
                <div
                    className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center text-2xl`}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}

// Category Badge Component
function CategoryBadge({
    category,
    active,
    onClick,
    count,
}: {
    category: EONETCategory
    active: boolean
    onClick: () => void
    count: number
}) {
    const style = getCategoryStyle(category.id)

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                active
                    ? `bg-linear-to-r ${style.gradient} text-white shadow-lg scale-105`
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
        >
            <span>{style.icon}</span>
            <span>{category.title}</span>
            <span
                className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-white/10'}`}
            >
                {count}
            </span>
        </button>
    )
}

// Event Card Component
function EventCard({ event, index }: { event: EONETEvent; index: number }) {
    const categoryStyle = getCategoryStyle(event.categories[0]?.id || '')
    const latestGeometry = event.geometry[event.geometry.length - 1]
    const coordinates = latestGeometry?.coordinates

    return (
        <div
            className="glass-card glass-card-glow p-6 opacity-0 animate-fade-in-up group"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className={`w-10 h-10 rounded-xl bg-linear-to-br ${categoryStyle.gradient} flex items-center justify-center text-lg`}
                        >
                            {categoryStyle.icon}
                        </span>
                        <div>
                            <span className="text-xs text-white/50 uppercase tracking-wide">
                                {event.categories
                                    .map((c) => c.title)
                                    .join(', ')}
                            </span>
                        </div>
                    </div>
                    <h3 className="font-bold text-lg text-white group-hover:text-gradient transition-all line-clamp-2">
                        {event.title}
                    </h3>
                </div>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        event.closed
                            ? 'bg-white/10 text-white/50'
                            : 'bg-green-500/20 text-green-400'
                    }`}
                >
                    {event.closed ? 'Closed' : 'Active'}
                </span>
            </div>

            {/* Geometry Info */}
            {latestGeometry && (
                <div className="mb-4 p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-white/50 text-xs">
                            📍 Last recorded location
                        </span>
                    </div>
                    {coordinates && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-white/50">Lat:</span>
                                <span className="text-white ml-1 font-mono">
                                    {Array.isArray(coordinates[1])
                                        ? coordinates[1][0]?.toFixed(4)
                                        : coordinates[1]?.toFixed(4)}
                                    °
                                </span>
                            </div>
                            <div>
                                <span className="text-white/50">Lon:</span>
                                <span className="text-white ml-1 font-mono">
                                    {Array.isArray(coordinates[0])
                                        ? coordinates[0][0]?.toFixed(4)
                                        : coordinates[0]?.toFixed(4)}
                                    °
                                </span>
                            </div>
                        </div>
                    )}
                    {latestGeometry.magnitudeValue && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                            <span className="text-white/50 text-sm">
                                Magnitude:{' '}
                            </span>
                            <span className="text-white font-semibold">
                                {latestGeometry.magnitudeValue}{' '}
                                {latestGeometry.magnitudeUnit}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-white/70">
                    <span>First detected:</span>
                    <span className="text-white font-medium">
                        {event.geometry.length > 0
                            ? new Date(
                                  event.geometry[0].date
                              ).toLocaleDateString()
                            : 'N/A'}
                    </span>
                </div>
                <div className="flex justify-between text-white/70">
                    <span>Last updated:</span>
                    <span className="text-white font-medium">
                        {latestGeometry
                            ? new Date(latestGeometry.date).toLocaleDateString()
                            : 'N/A'}
                    </span>
                </div>
                <div className="flex justify-between text-white/70">
                    <span>Data points:</span>
                    <span className="text-white font-medium">
                        {event.geometry.length}
                    </span>
                </div>
            </div>

            {/* Sources */}
            {event.sources.length > 0 && (
                <div className="mb-4">
                    <span className="text-white/50 text-xs">Sources: </span>
                    <span className="text-white/70 text-xs">
                        {event.sources.map((s) => s.id).join(', ')}
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
                <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 glass-button text-sm justify-center"
                >
                    View Details
                </a>
                {event.sources.length > 0 && (
                    <a
                        href={event.sources[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 glass-button text-sm justify-center"
                    >
                        Source Data
                    </a>
                )}
            </div>
        </div>
    )
}

// Main Client Component
interface EonetClientProps {
    events: EONETEvent[]
    categories: EONETCategory[]
}

export default function EonetClient({ events, categories }: EonetClientProps) {
    // State for filters
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    )
    const [showClosed, setShowClosed] = useState(false)

    // Filter events
    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            // Filter by category
            if (
                selectedCategory &&
                !event.categories.some((c) => c.id === selectedCategory)
            ) {
                return false
            }
            // Filter by status
            if (!showClosed && event.closed) {
                return false
            }
            return true
        })
    }, [events, selectedCategory, showClosed])

    // Count events per category
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        events.forEach((event) => {
            event.categories.forEach((cat) => {
                counts[cat.id] = (counts[cat.id] || 0) + 1
            })
        })
        return counts
    }, [events])

    // Stats
    const activeEvents = events.filter((e) => !e.closed).length
    const totalDataPoints = events.reduce(
        (sum, e) => sum + e.geometry.length,
        0
    )
    const uniqueCategories = new Set(
        events.flatMap((e) => e.categories.map((c) => c.id))
    ).size

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <header className="relative px-6 pt-8 pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-fade-in-up space-y-4 mb-8">
                        <h1 className="title-section text-white">
                            <span className="text-gradient">
                                Natural Events Tracker
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Monitor natural events happening around the world —
                            wildfires, storms, volcanoes, and more in real-time
                        </p>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            label="Active Events"
                            value={activeEvents}
                            icon="🔴"
                            gradient="from-red-500 to-orange-500"
                            delay={0}
                        />
                        <StatsCard
                            label="Total Events"
                            value={events.length}
                            icon="📊"
                            gradient="from-blue-500 to-cyan-500"
                            delay={100}
                        />
                        <StatsCard
                            label="Categories"
                            value={uniqueCategories}
                            icon="🏷️"
                            gradient="from-purple-500 to-pink-500"
                            delay={200}
                        />
                        <StatsCard
                            label="Data Points"
                            value={totalDataPoints}
                            icon="📍"
                            gradient="from-green-500 to-emerald-500"
                            delay={300}
                        />
                    </div>
                </div>
            </section>

            {/* World Map Placeholder */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="glass-card p-8 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '700ms' }}
                    >
                        <h2 className="text-xl font-bold text-white mb-4">
                            Event Locations
                        </h2>
                        <div className="relative aspect-2/1 bg-white/5 rounded-xl overflow-hidden">
                            {/* Simple SVG World Map outline */}
                            <svg
                                viewBox="0 0 1000 500"
                                className="w-full h-full opacity-30"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                            >
                                <ellipse
                                    cx="500"
                                    cy="250"
                                    rx="480"
                                    ry="230"
                                    className="text-white/20"
                                />
                                <line
                                    x1="20"
                                    y1="250"
                                    x2="980"
                                    y2="250"
                                    className="text-white/10"
                                />
                                <line
                                    x1="500"
                                    y1="20"
                                    x2="500"
                                    y2="480"
                                    className="text-white/10"
                                />
                            </svg>

                            {/* Event markers */}
                            <div className="absolute inset-0">
                                {filteredEvents.slice(0, 20).map((event) => {
                                    const coord =
                                        event.geometry[
                                            event.geometry.length - 1
                                        ]?.coordinates
                                    if (!coord) return null

                                    const lon = Array.isArray(coord[0])
                                        ? coord[0][0]
                                        : coord[0]
                                    const lat = Array.isArray(coord[1])
                                        ? coord[1][0]
                                        : coord[1]

                                    // Convert lat/lon to x/y position (simple projection)
                                    const x = ((lon + 180) / 360) * 100
                                    const y = ((90 - lat) / 180) * 100

                                    const style = getCategoryStyle(
                                        event.categories[0]?.id || ''
                                    )

                                    return (
                                        <div
                                            key={event.id}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                                            style={{
                                                left: `${x}%`,
                                                top: `${y}%`,
                                            }}
                                        >
                                            <div
                                                className={`w-3 h-3 rounded-full bg-linear-to-r ${style.gradient} animate-pulse shadow-lg`}
                                            />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                <div className="glass-card px-3 py-2 text-xs whitespace-nowrap">
                                                    <p className="font-semibold text-white">
                                                        {event.title.slice(
                                                            0,
                                                            30
                                                        )}
                                                        ...
                                                    </p>
                                                    <p className="text-white/60">
                                                        {
                                                            event.categories[0]
                                                                ?.title
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="glass-card p-8 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '800ms' }}
                    >
                        <h2 className="text-xl font-bold text-white mb-4">
                            About EONET
                        </h2>
                        <p className="text-white/60 mb-6">
                            The Earth Observatory Natural Event Tracker (EONET)
                            is a repository of metadata about natural events. It
                            provides a curated source of information about
                            events like wildfires, volcanoes, storms, and more.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                {
                                    icon: '🔥',
                                    label: 'Wildfires',
                                    desc: 'Forest fires & burns',
                                },
                                {
                                    icon: '🌋',
                                    label: 'Volcanoes',
                                    desc: 'Eruptions & activity',
                                },
                                {
                                    icon: '🌀',
                                    label: 'Storms',
                                    desc: 'Hurricanes & cyclones',
                                },
                                {
                                    icon: '🌊',
                                    label: 'Floods',
                                    desc: 'Flooding events',
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="text-center p-4 bg-white/5 rounded-xl"
                                >
                                    <div className="text-3xl mb-2">
                                        {item.icon}
                                    </div>
                                    <div className="font-semibold text-white text-sm">
                                        {item.label}
                                    </div>
                                    <div className="text-white/50 text-xs">
                                        {item.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Filter */}
            <section className="px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="glass-card p-6 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '400ms' }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">
                                Filter by Category
                            </h2>
                            <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showClosed}
                                    onChange={(e) =>
                                        setShowClosed(e.target.checked)
                                    }
                                    className="w-4 h-4 rounded bg-white/10 border-white/20"
                                />
                                Show closed events
                            </label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    selectedCategory === null
                                        ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                All Events ({events.length})
                            </button>
                            {categories.map((category) => (
                                <CategoryBadge
                                    key={category.id}
                                    category={category}
                                    active={selectedCategory === category.id}
                                    onClick={() =>
                                        setSelectedCategory(
                                            selectedCategory === category.id
                                                ? null
                                                : category.id
                                        )
                                    }
                                    count={categoryCounts[category.id] || 0}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2
                            className="text-2xl font-bold text-white animate-fade-in-up opacity-0"
                            style={{ animationDelay: '500ms' }}
                        >
                            {selectedCategory
                                ? `${categories.find((c) => c.id === selectedCategory)?.title || 'Events'}`
                                : 'All Events'}
                            <span className="text-white/50 text-lg ml-2">
                                ({filteredEvents.length})
                            </span>
                        </h2>
                    </div>

                    {filteredEvents.length === 0 ? (
                        <div
                            className="glass-card p-12 text-center animate-fade-in-up opacity-0"
                            style={{ animationDelay: '600ms' }}
                        >
                            <div className="text-6xl mb-4">🌍</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No events found
                            </h3>
                            <p className="text-white/60">
                                {selectedCategory
                                    ? 'No events match the selected category. Try selecting a different filter.'
                                    : 'No natural events are currently being tracked.'}
                            </p>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="mt-4 glass-button"
                                >
                                    Show all events
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event, idx) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    index={idx}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
