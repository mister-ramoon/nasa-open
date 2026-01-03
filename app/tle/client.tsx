'use client'

// Import necessary modules and types
import { useState } from 'react'
import type {
    TLERecord,
    ParsedTLE,
    OrbitalRegime,
    TLEAgeStatus,
} from '@/lib/types/tle.type'

// Props interface
interface TLESummary {
    name: string
    id: number
    regime: OrbitalRegime
    period: string
    apogee: string
    perigee: string
    inclination: string
    age: string
    ageStatus: TLEAgeStatus
}

interface TleClientProps {
    recentTLEs: TLERecord[]
    wellKnownSummaries: TLESummary[]
    stats: { totalSatellites: number; recentUpdates: number }
    issTLE: TLERecord | null
    issParsed: ParsedTLE | null
    issRegime: OrbitalRegime | null
    orbitalRegimes: Record<
        string,
        {
            name: string
            altitudeMin?: number
            altitudeMax?: number
            periodMin?: number
            periodMax?: number
            description?: string
        }
    >
    satelliteCategories: Record<string, string>
    commonSearches: readonly string[]
    earthConstants: { RADIUS_KM: number; MU: number; J2: number }
    wellKnownCount: number
}

// Orbit colors for Liquid Glass
const ORBIT_COLORS: Record<
    string,
    { gradient: string; text: string; bg: string; icon: string }
> = {
    LEO: {
        gradient: 'from-blue-500/20 to-cyan-500/20',
        text: 'text-blue-400',
        bg: 'bg-blue-500/20',
        icon: '🌍',
    },
    MEO: {
        gradient: 'from-purple-500/20 to-violet-500/20',
        text: 'text-purple-400',
        bg: 'bg-purple-500/20',
        icon: '🛰️',
    },
    GEO: {
        gradient: 'from-orange-500/20 to-amber-500/20',
        text: 'text-orange-400',
        bg: 'bg-orange-500/20',
        icon: '📡',
    },
    HEO: {
        gradient: 'from-red-500/20 to-rose-500/20',
        text: 'text-red-400',
        bg: 'bg-red-500/20',
        icon: '🚀',
    },
    SSO: {
        gradient: 'from-cyan-500/20 to-teal-500/20',
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/20',
        icon: '☀️',
    },
    Molniya: {
        gradient: 'from-pink-500/20 to-rose-500/20',
        text: 'text-pink-400',
        bg: 'bg-pink-500/20',
        icon: '📶',
    },
    Other: {
        gradient: 'from-gray-500/20 to-slate-500/20',
        text: 'text-gray-400',
        bg: 'bg-gray-500/20',
        icon: '⚫',
    },
}

// Age colors for Liquid Glass
const AGE_COLORS: Record<string, { text: string; bg: string; icon: string }> = {
    fresh: { text: 'text-green-400', bg: 'bg-green-500/20', icon: '🟢' },
    recent: { text: 'text-blue-400', bg: 'bg-blue-500/20', icon: '🔵' },
    stale: { text: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: '🟡' },
    old: { text: 'text-red-400', bg: 'bg-red-500/20', icon: '🔴' },
}

// Helper functions (client-side)
function formatPeriod(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
}

function formatAltitude(km: number): string {
    if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`
    return `${Math.round(km)} km`
}

function formatInclination(deg: number): string {
    return `${deg.toFixed(2)}°`
}

function formatRelativeDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60))
        return `${diffMins}m ago`
    }
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString()
}

// Stats Card Component
function StatsCard({
    value,
    label,
    icon,
    gradient,
}: {
    value: number | string
    label: string
    icon: string
    gradient: string
}) {
    return (
        <div
            className={`glass-card p-6 bg-linear-to-br ${gradient} border-0 group hover:scale-105 transition-transform`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold text-white">
                        {typeof value === 'number'
                            ? value.toLocaleString()
                            : value}
                    </p>
                    <p className="text-white/70 text-sm">{label}</p>
                </div>
                <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform">
                    {icon}
                </span>
            </div>
        </div>
    )
}

// ISS Spotlight Component
function ISSSpotlight({
    issTLE,
    issParsed,
}: {
    issTLE: TLERecord
    issParsed: ParsedTLE
}) {
    return (
        <div className="glass-card-glow p-6 bg-linear-to-br from-blue-500/10 to-indigo-500/10">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">🛸</span>
                <div>
                    <h3 className="text-xl font-bold text-white">
                        ISS - International Space Station
                    </h3>
                    <p className="text-white/50 text-sm">Live orbital data</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Orbital Parameters */}
                <div className="glass-card-inner p-4">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span>📊</span> Orbital Parameters
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">
                                Perigee
                            </span>
                            <span className="text-cyan-400 font-mono">
                                {formatAltitude(issParsed.perigee)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">
                                Apogee
                            </span>
                            <span className="text-cyan-400 font-mono">
                                {formatAltitude(issParsed.apogee)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">
                                Period
                            </span>
                            <span className="text-cyan-400 font-mono">
                                {formatPeriod(issParsed.orbitalPeriod)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">
                                Inclination
                            </span>
                            <span className="text-cyan-400 font-mono">
                                {formatInclination(issParsed.inclination)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">
                                Eccentricity
                            </span>
                            <span className="text-cyan-400 font-mono">
                                {issParsed.eccentricity.toFixed(7)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">
                                Rev/day
                            </span>
                            <span className="text-cyan-400 font-mono">
                                {issParsed.meanMotion.toFixed(8)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/50 text-sm">
                                Revolutions
                            </span>
                            <span className="text-cyan-400 font-mono">
                                {issParsed.revolutionNumber.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* TLE Data */}
                <div className="glass-card-inner p-4">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <span>📄</span> TLE Data
                    </h4>
                    <div className="bg-gray-900/70 rounded-xl p-3 overflow-x-auto border border-white/10">
                        <pre className="text-xs text-green-400 font-mono">
                            {issTLE.name}
                            {issTLE.line1}
                            {issTLE.line2}
                        </pre>
                    </div>
                    <div className="mt-4 space-y-1 text-xs text-white/40">
                        <p>
                            NORAD ID:{' '}
                            <span className="text-white/60">
                                {issTLE.satelliteId}
                            </span>
                        </p>
                        <p>
                            Epoch:{' '}
                            <span className="text-white/60">
                                {issParsed.epochDate.toISOString()}
                            </span>
                        </p>
                        <p>
                            Updated:{' '}
                            <span className="text-white/60">
                                {formatRelativeDate(issTLE.date)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Satellite Card Component
function SatelliteCard({
    summary,
    index,
}: {
    summary: TLESummary
    index: number
}) {
    const orbitColors = ORBIT_COLORS[summary.regime] || ORBIT_COLORS.Other
    const ageColors = AGE_COLORS[summary.ageStatus] || AGE_COLORS.recent

    return (
        <div
            className="glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Top accent based on orbit type */}
            <div
                className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${orbitColors.gradient} rounded-t-2xl`}
            />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <span
                        className={`px-3 py-1 ${orbitColors.bg} ${orbitColors.text} text-xs rounded-full flex items-center gap-1`}
                    >
                        <span>{orbitColors.icon}</span>
                        {summary.regime}
                    </span>
                    <span className="text-xs text-white/40 font-mono bg-white/5 px-2 py-1 rounded">
                        #{summary.id}
                    </span>
                </div>

                {/* Name */}
                <h4 className="font-bold text-white line-clamp-1 mb-3 group-hover:text-gradient transition-all">
                    {summary.name}
                </h4>

                {/* Orbital Data Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="glass-card-inner p-2">
                        <span className="text-white/40">Period</span>
                        <p className="text-cyan-400 font-mono">
                            {summary.period}
                        </p>
                    </div>
                    <div className="glass-card-inner p-2">
                        <span className="text-white/40">Inc</span>
                        <p className="text-cyan-400 font-mono">
                            {summary.inclination}
                        </p>
                    </div>
                    <div className="glass-card-inner p-2">
                        <span className="text-white/40">Perigee</span>
                        <p className="text-cyan-400 font-mono">
                            {summary.perigee}
                        </p>
                    </div>
                    <div className="glass-card-inner p-2">
                        <span className="text-white/40">Apogee</span>
                        <p className="text-cyan-400 font-mono">
                            {summary.apogee}
                        </p>
                    </div>
                </div>

                {/* Age Badge */}
                <div className="flex items-center justify-between">
                    <span
                        className={`px-2 py-1 ${ageColors.bg} ${ageColors.text} text-xs rounded-full flex items-center gap-1`}
                    >
                        <span>{ageColors.icon}</span>
                        {summary.age}
                    </span>
                </div>
            </div>
        </div>
    )
}

// Recent TLE Row
function RecentTLERow({
    tle,
    summary,
    index,
}: {
    tle: TLERecord
    summary: TLESummary
    index: number
}) {
    const orbitColors = ORBIT_COLORS[summary.regime] || ORBIT_COLORS.Other
    const ageColors = AGE_COLORS[summary.ageStatus] || AGE_COLORS.recent

    return (
        <div
            className="glass-card p-4 flex flex-col lg:flex-row lg:items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{tle.name}</p>
                <p className="text-xs text-white/40 font-mono">
                    #{tle.satelliteId}
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <span
                    className={`px-2 py-1 ${orbitColors.bg} ${orbitColors.text} text-xs rounded-full`}
                >
                    {summary.regime}
                </span>
                <span className="text-xs text-white/60 font-mono min-w-16">
                    {summary.period}
                </span>
                <span className="text-xs text-white/60 font-mono min-w-16">
                    {summary.perigee}
                </span>
                <span className="text-xs text-white/60 font-mono min-w-20">
                    {summary.apogee}
                </span>
                <span
                    className={`px-2 py-1 ${ageColors.bg} ${ageColors.text} text-xs rounded-full`}
                >
                    {summary.age}
                </span>
            </div>
        </div>
    )
}

// Orbital Regime Card
function OrbitalRegimeCard({
    code,
    regime,
    index,
}: {
    code: string
    regime: {
        name: string
        altitudeMin?: number
        altitudeMax?: number
        periodMin?: number
        periodMax?: number
        description?: string
    }
    index: number
}) {
    const colors = ORBIT_COLORS[code] || ORBIT_COLORS.Other

    return (
        <div
            className={`glass-card bg-linear-to-br ${colors.gradient} group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up`}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{colors.icon}</span>
                        <h4 className={`font-bold ${colors.text}`}>
                            {regime.name}
                        </h4>
                    </div>
                    <span
                        className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded font-bold`}
                    >
                        {code}
                    </span>
                </div>
                {regime.altitudeMin !== undefined &&
                    regime.altitudeMax !== undefined && (
                        <p className="text-sm text-white/60 mt-2">
                            📏 Altitude: {regime.altitudeMin.toLocaleString()} -{' '}
                            {regime.altitudeMax.toLocaleString()} km
                        </p>
                    )}
                {regime.periodMin !== undefined &&
                    regime.periodMax !== undefined && (
                        <p className="text-sm text-white/50">
                            ⏱️ Period: {regime.periodMin} - {regime.periodMax}{' '}
                            min
                        </p>
                    )}
                {regime.description && (
                    <p className="text-sm text-white/50 mt-2">
                        {regime.description}
                    </p>
                )}
            </div>
        </div>
    )
}

// Search Tag
function SearchTag({ term }: { term: string }) {
    return (
        <span className="px-4 py-2 glass-card text-white/60 hover:text-white rounded-full text-sm transition-all hover:scale-105 cursor-pointer">
            🔍 {term}
        </span>
    )
}

// Category Card
function CategoryCard({
    code,
    name,
    index,
}: {
    code: string
    name: string
    index: number
}) {
    return (
        <div
            className="glass-card p-3 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 25}ms` }}
        >
            <code className="text-blue-400 font-bold text-sm">{code}</code>
            <span className="text-white/60 ml-2 text-sm">- {name}</span>
        </div>
    )
}

// Main Client Component
export default function TleClient({
    recentTLEs,
    wellKnownSummaries,
    stats,
    issTLE,
    issParsed,
    orbitalRegimes,
    satelliteCategories,
    commonSearches,
    earthConstants,
    wellKnownCount,
}: TleClientProps) {
    const [activeTab, setActiveTab] = useState<
        'featured' | 'recent' | 'orbits'
    >('featured')

    const hasRecentTLEs = recentTLEs.length > 0
    const hasWellKnown = wellKnownSummaries.length > 0

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-8 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: '1s' }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-3xl" />

                    {/* Orbital elements */}
                    <div
                        className="absolute top-1/4 right-1/4 animate-bounce"
                        style={{ animationDuration: '4s' }}
                    >
                        <span className="text-4xl opacity-20">🛰️</span>
                    </div>
                    <div
                        className="absolute bottom-1/3 left-1/4 animate-bounce"
                        style={{
                            animationDuration: '5s',
                            animationDelay: '1s',
                        }}
                    >
                        <span className="text-3xl opacity-20">🌍</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative">
                    {/* Title */}
                    <header className="relative pb-4">
                        <div className="mx-auto">
                            <div className="animate-fade-in-up space-y-4 mb-8">
                                <h1 className="title-section text-white">
                                    <span className="text-gradient">
                                        Orbital Tracking Data
                                    </span>
                                </h1>
                                <p className="text-white/60 text-lg max-w-2xl">
                                    Two-Line Element Sets for tracking
                                    Earth-orbiting satellites. Real-time orbital
                                    data updated daily from CelesTrak.
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <StatsCard
                            value={stats.totalSatellites}
                            label="Tracked Objects"
                            icon="🛰️"
                            gradient="from-blue-600/20 to-blue-800/20"
                        />
                        <StatsCard
                            value="Daily"
                            label="Update Frequency"
                            icon="🔄"
                            gradient="from-green-600/20 to-green-800/20"
                        />
                        <StatsCard
                            value={wellKnownCount}
                            label="Featured Satellites"
                            icon="⭐"
                            gradient="from-purple-600/20 to-purple-800/20"
                        />
                    </div>
                </div>
            </section>

            {/* ISS Spotlight */}
            {issTLE && issParsed && (
                <section className="py-8 max-w-7xl mx-auto px-4">
                    <ISSSpotlight issTLE={issTLE} issParsed={issParsed} />
                </section>
            )}

            {/* Content Section */}
            <section className="py-2 max-w-7xl mx-auto px-4">
                {/* Tab Navigation */}
                <div
                    className="glass-card p-2 animate-fade-in-up"
                    style={{ animationDelay: '300ms' }}
                >
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('featured')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                activeTab === 'featured'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <span>⭐</span>
                            Featured Satellites
                        </button>
                        <button
                            onClick={() => setActiveTab('recent')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                activeTab === 'recent'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <span>🕒</span>
                            Recently Updated
                            {hasRecentTLEs && (
                                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {recentTLEs.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('orbits')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                activeTab === 'orbits'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <span>🌐</span>
                            Orbital Regimes
                        </button>
                    </div>
                </div>
                {/* Featured Satellites */}
                {activeTab === 'featured' && (
                    <>
                        <h2 className="text-2xl font-bold text-white my-6 flex items-center gap-3">
                            <span className="text-3xl">⭐</span>
                            Featured Satellites
                        </h2>

                        {hasWellKnown ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {wellKnownSummaries.map((summary, index) => (
                                    <SatelliteCard
                                        key={summary.id}
                                        summary={summary}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🛰️</span>
                                <p className="text-white/60">
                                    Data temporarily unavailable
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Recently Updated */}
                {activeTab === 'recent' && (
                    <>
                        <h2 className="text-2xl font-bold text-white my-6 flex items-center gap-3">
                            <span className="text-3xl">🕒</span>
                            Recently Updated TLEs
                        </h2>

                        {hasRecentTLEs ? (
                            <div className="space-y-3">
                                {recentTLEs.map((tle, index) => {
                                    const summary = wellKnownSummaries.find(
                                        (s) => s.id === tle.satelliteId
                                    ) || {
                                        name: tle.name,
                                        id: tle.satelliteId,
                                        regime: 'LEO' as OrbitalRegime,
                                        period: '—',
                                        apogee: '—',
                                        perigee: '—',
                                        inclination: '—',
                                        age: formatRelativeDate(tle.date),
                                        ageStatus: 'recent' as TLEAgeStatus,
                                    }
                                    return (
                                        <RecentTLERow
                                            key={tle.satelliteId}
                                            tle={tle}
                                            summary={summary}
                                            index={index}
                                        />
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🕒</span>
                                <p className="text-white/60">
                                    No recent updates available
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Orbital Regimes */}
                {activeTab === 'orbits' && (
                    <>
                        <h2 className="text-2xl font-bold text-white my-6 flex items-center gap-3">
                            <span className="text-3xl">🌐</span>
                            Orbital Regimes
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(orbitalRegimes).map(
                                ([code, regime], index) => (
                                    <OrbitalRegimeCard
                                        key={code}
                                        code={code}
                                        regime={regime}
                                        index={index}
                                    />
                                )
                            )}
                        </div>
                    </>
                )}
            </section>

            {/* TLE Format Explanation */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        TLE Format
                    </h2>
                    <p className="text-white/60 text-sm mb-4">
                        A Two-Line Element Set (TLE) encodes orbital elements of
                        an Earth-orbiting object for a given epoch.
                    </p>
                    <div className="bg-gray-900/70 rounded-xl p-4 overflow-x-auto border border-white/10 mb-4">
                        <pre className="text-xs text-green-400 font-mono">
                            {`ISS (ZARYA)             
1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9025
2 25544  51.6416 208.8186 0006703  35.2587  45.1481 15.49066938480479`}
                        </pre>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="font-bold text-white mb-2 text-sm">
                                Line 1 Contains:
                            </h5>
                            <ul className="text-white/50 space-y-1 text-xs">
                                <li>• Satellite catalog number</li>
                                <li>• Classification (U=Unclassified)</li>
                                <li>• International designator</li>
                                <li>• Epoch (year + day of year)</li>
                                <li>
                                    • First/Second derivative of mean motion
                                </li>
                                <li>• BSTAR drag term</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold text-white mb-2 text-sm">
                                Line 2 Contains:
                            </h5>
                            <ul className="text-white/50 space-y-1 text-xs">
                                <li>• Inclination (degrees)</li>
                                <li>• Right ascension of ascending node</li>
                                <li>• Eccentricity</li>
                                <li>• Argument of perigee (degrees)</li>
                                <li>• Mean motion (revolutions/day)</li>
                                <li>• Revolution number at epoch</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Common Searches */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🔍</span>
                    Common Searches
                </h2>
                <div className="flex flex-wrap gap-3">
                    {commonSearches.map((term) => (
                        <SearchTag key={term} term={term} />
                    ))}
                </div>
            </section>

            {/* Satellite Categories */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">📂</span>
                    Satellite Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(satelliteCategories).map(
                        ([code, name], index) => (
                            <CategoryCard
                                key={code}
                                code={code}
                                name={name}
                                index={index}
                            />
                        )
                    )}
                </div>
            </section>

            {/* API Documentation */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* API Endpoints */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-2xl">⚡</span>
                            API Endpoints
                        </h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /api/tle
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    List all TLEs
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /api/tle?search=&#123;query&#125;
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    Search by satellite name
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /api/tle/&#123;id&#125;
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    Get TLE by NORAD catalog number
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Code Examples */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-2xl">💻</span>
                            Example Queries
                        </h2>
                        <div className="bg-gray-900/50 rounded-xl p-4 overflow-x-auto border border-white/10 text-sm">
                            <pre className="text-green-400">
                                {`# List all TLEs (paginated)
curl "https://tle.ivanstanojevic.me/api/tle"

# Search for ISS
curl "https://tle.ivanstanojevic.me/api/tle\\
?search=ISS"

# Get ISS TLE by NORAD ID
curl "https://tle.ivanstanojevic.me/api/tle/25544"

# Search with pagination
curl "https://tle.ivanstanojevic.me/api/tle\\
?search=STARLINK&page=1&page-size=50"`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Earth Constants */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🌍</span>
                    Earth Constants
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card p-4">
                        <p className="font-bold text-white">
                            Equatorial Radius
                        </p>
                        <p className="text-cyan-400 font-mono">
                            {earthConstants.RADIUS_KM.toLocaleString()} km
                        </p>
                    </div>
                    <div className="glass-card p-4">
                        <p className="font-bold text-white">
                            Gravitational Parameter (μ)
                        </p>
                        <p className="text-cyan-400 font-mono">
                            {earthConstants.MU.toLocaleString()} km³/s²
                        </p>
                    </div>
                    <div className="glass-card p-4">
                        <p className="font-bold text-white">J2 Coefficient</p>
                        <p className="text-cyan-400 font-mono">
                            {earthConstants.J2}
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <div className="glass-card-glow p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Track Satellites in Real-Time
                    </h2>
                    <p className="text-white/60 mb-6 max-w-xl mx-auto">
                        Access up-to-date orbital data for thousands of
                        satellites, from the ISS to Starlink constellation.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://tle.ivanstanojevic.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            📚 TLE API Documentation
                        </a>
                        <a
                            href="https://celestrak.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-green-500/20 hover:bg-green-500/30"
                        >
                            🌐 CelesTrak
                        </a>
                        <a
                            href="https://www.space-track.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-purple-500/20 hover:bg-purple-500/30"
                        >
                            🛰️ Space-Track.org
                        </a>
                        <a
                            href="https://en.wikipedia.org/wiki/Two-line_element_set"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3"
                        >
                            📖 TLE Format (Wikipedia)
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
