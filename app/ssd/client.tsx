'use client'

// Import necessary modules and types
import { useState } from 'react'
import type {
    ProcessedCloseApproach,
    ProcessedFireball,
    SentryObject,
    NHATSObject,
    ScoutObject,
} from '@/lib/types/ssd.type'

// Props interface
interface SsdClientProps {
    closeApproaches: ProcessedCloseApproach[]
    fireballs: ProcessedFireball[]
    sentryObjects: SentryObject[]
    nhatsObjects: NHATSObject[]
    scoutObjects: ScoutObject[]
    summary: {
        upcomingApproaches: number
        recentFireballs: number
        sentryObjects: number
        nhatsObjects: number
    }
    orbitClasses: Record<string, string>
    endpoints: Record<string, string>
}

// Size category helper
function getSizeCategory(h: number): string {
    if (h <= 17.75) return 'Very Large (>1 km)'
    if (h <= 20) return 'Large (300m - 1km)'
    if (h <= 22) return 'Medium (140m - 300m)'
    if (h <= 25) return 'Small (50m - 140m)'
    if (h <= 28) return 'Very Small (10m - 50m)'
    return 'Tiny (<10m)'
}

// Safe toFixed helper
function safeToFixed(value: unknown, decimals: number = 2): string {
    if (typeof value === 'number' && !isNaN(value)) {
        return value.toFixed(decimals)
    }
    if (typeof value === 'string') {
        const parsed = parseFloat(value)
        if (!isNaN(parsed)) {
            return parsed.toFixed(decimals)
        }
    }
    return '—'
}

// Torino Scale config
const TORINO_CONFIG: Record<
    number,
    { label: string; color: string; bgColor: string }
> = {
    0: { label: 'No Hazard', color: 'text-white', bgColor: 'bg-white/20' },
    1: { label: 'Normal', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    2: {
        label: 'Attention',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
    },
    3: {
        label: 'Attention',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
    },
    4: {
        label: 'Attention',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
    },
    5: {
        label: 'Threatening',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/30',
    },
    6: {
        label: 'Threatening',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
    },
    7: {
        label: 'Threatening',
        color: 'text-red-500',
        bgColor: 'bg-red-500/30',
    },
    8: { label: 'Certain', color: 'text-red-600', bgColor: 'bg-red-600/40' },
    9: { label: 'Certain', color: 'text-red-600', bgColor: 'bg-red-600/50' },
    10: { label: 'Certain', color: 'text-red-700', bgColor: 'bg-red-700/60' },
}

// Tab type
type TabType = 'approaches' | 'fireballs' | 'sentry' | 'nhats' | 'scout'

// Stats Card Component
function StatsCard({
    value,
    label,
    icon,
    gradient,
    pulse,
}: {
    value: number | string
    label: string
    icon: string
    gradient: string
    pulse?: boolean
}) {
    return (
        <div
            className={`glass-card p-6 bg-linear-to-br ${gradient} border-0 group hover:scale-105 transition-transform`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p
                        className={`text-3xl font-bold text-white ${pulse ? 'animate-pulse' : ''}`}
                    >
                        {value}
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

// Close Approach Card Component
function CloseApproachCard({
    approach,
    index,
}: {
    approach: ProcessedCloseApproach
    index: number
}) {
    const distanceColor =
        approach.distance_ld < 1
            ? 'text-red-400'
            : approach.distance_ld < 5
              ? 'text-orange-400'
              : 'text-green-400'

    return (
        <div
            className={`glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up ${approach.isPHA ? 'ring-2 ring-red-500/50' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* PHA Warning bar */}
            {approach.isPHA && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 to-orange-500 rounded-t-2xl animate-pulse" />
            )}

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h4 className="font-bold text-white font-mono group-hover:text-gradient">
                            {approach.name}
                        </h4>
                        <p className="text-xs text-white/50 mt-1">
                            {approach.date.toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    {approach.isPHA && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30 animate-pulse">
                            ⚠️ PHA
                        </span>
                    )}
                </div>

                {/* Distance */}
                <div className="glass-card-inner p-3 mb-3">
                    <div className="text-center">
                        <p className={`text-2xl font-bold ${distanceColor}`}>
                            {approach.distance_ld.toFixed(1)} LD
                        </p>
                        <p className="text-xs text-white/40">Lunar Distances</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-center">
                        <div>
                            <p className="text-sm text-white">
                                {(approach.distance_km / 1000000).toFixed(2)}M
                                km
                            </p>
                            <p className="text-xs text-white/40">Distance</p>
                        </div>
                        <div>
                            <p className="text-sm text-white">
                                {approach.distance_au.toFixed(4)} AU
                            </p>
                            <p className="text-xs text-white/40">AU</p>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-white/5 rounded-lg">
                        <p className="text-sm text-cyan-400 font-bold">
                            {approach.velocity_km_s.toFixed(1)}
                        </p>
                        <p className="text-xs text-white/40">km/s</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                        <p className="text-sm text-purple-400 font-bold">
                            {approach.magnitude.toFixed(1)}
                        </p>
                        <p className="text-xs text-white/40">H mag</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                        <p className="text-sm text-amber-400 font-bold">
                            {approach.diameter_m
                                ? Math.round(approach.diameter_m)
                                : '—'}
                        </p>
                        <p className="text-xs text-white/40">m size</p>
                    </div>
                </div>

                {/* Size category */}
                <div className="mt-3 text-center">
                    <span className="text-xs text-white/50 bg-white/5 px-3 py-1 rounded-full">
                        {getSizeCategory(approach.magnitude)}
                    </span>
                </div>
            </div>
        </div>
    )
}

// Fireball Card Component
function FireballCard({
    fireball,
    index,
}: {
    fireball: ProcessedFireball
    index: number
}) {
    const energyColor =
        fireball.energy_kt > 1
            ? 'text-red-400'
            : fireball.energy_kt > 0.1
              ? 'text-orange-400'
              : 'text-yellow-400'

    return (
        <div
            className="glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Energy indicator bar */}
            <div
                className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-red-500 rounded-t-2xl"
                style={{ opacity: Math.min(fireball.energy_kt / 2, 1) }}
            />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <p className="text-sm text-white/50">
                            {fireball.date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                        <p className="text-xs text-white/30 mt-0.5">
                            {fireball.date.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}{' '}
                            UTC
                        </p>
                    </div>
                    <div className="text-right">
                        <span className={`text-2xl font-bold ${energyColor}`}>
                            {fireball.energy_kt.toFixed(2)}
                        </span>
                        <p className="text-xs text-white/40">kt TNT</p>
                    </div>
                </div>

                {/* Fireball icon */}
                <div className="text-center my-4">
                    <span className="text-5xl animate-pulse">☄️</span>
                </div>

                {/* Location */}
                {fireball.location && fireball.location.lat !== null && (
                    <div className="glass-card-inner p-3 mb-3">
                        <div className="text-center">
                            <p className="text-sm text-white font-mono">
                                {Math.abs(fireball.location.lat).toFixed(1)}°{' '}
                                {fireball.location.lat >= 0 ? 'N' : 'S'},{' '}
                                {Math.abs(fireball.location.lon || 0).toFixed(
                                    1
                                )}
                                °{' '}
                                {(fireball.location.lon || 0) >= 0 ? 'E' : 'W'}
                            </p>
                            <p className="text-xs text-white/40">Location</p>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-center">
                    {fireball.altitude_km && (
                        <div className="p-2 bg-white/5 rounded-lg">
                            <p className="text-sm text-cyan-400 font-bold">
                                {fireball.altitude_km.toFixed(1)}
                            </p>
                            <p className="text-xs text-white/40">km altitude</p>
                        </div>
                    )}
                    {fireball.velocity_km_s && (
                        <div className="p-2 bg-white/5 rounded-lg">
                            <p className="text-sm text-purple-400 font-bold">
                                {fireball.velocity_km_s.toFixed(1)}
                            </p>
                            <p className="text-xs text-white/40">
                                km/s velocity
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Sentry Object Card
function SentryCard({ obj, index }: { obj: SentryObject; index: number }) {
    const ts = parseInt(obj.ts) || 0
    const torinoConfig = TORINO_CONFIG[ts] || TORINO_CONFIG[0]
    const ps = parseFloat(obj.ps)

    return (
        <div
            className={`glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up ${ts > 0 ? 'ring-2 ring-red-500/30' : ''}`}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h4 className="font-bold text-white font-mono group-hover:text-gradient">
                            {obj.des}
                        </h4>
                        <p className="text-xs text-white/50 line-clamp-1 mt-1">
                            {obj.fullname}
                        </p>
                    </div>
                    <span
                        className={`px-2 py-1 ${torinoConfig.bgColor} ${torinoConfig.color} text-xs rounded-full`}
                    >
                        TS: {obj.ts}
                    </span>
                </div>

                {/* Torino Scale indicator */}
                <div className="glass-card-inner p-3 mb-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50">
                            Torino Scale
                        </span>
                        <span className={`font-bold ${torinoConfig.color}`}>
                            {torinoConfig.label}
                        </span>
                    </div>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all ${ts === 0 ? 'bg-green-500' : ts < 4 ? 'bg-yellow-500' : ts < 7 ? 'bg-orange-500' : 'bg-red-500'}`}
                            style={{ width: `${(ts / 10) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-white/50">
                            Impact Probability
                        </span>
                        <span className="text-white font-mono">{obj.ip}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50">Palermo Scale</span>
                        <span
                            className={`font-mono ${ps > -2 ? 'text-orange-400' : 'text-white'}`}
                        >
                            {obj.ps}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-white/50">Potential Impacts</span>
                        <span className="text-cyan-400 font-bold">
                            {obj.n_imp}
                        </span>
                    </div>
                </div>

                {/* Range */}
                {obj.range && (
                    <div className="mt-3 text-center">
                        <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
                            📅 {obj.range}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

// NHATS Object Card
function NHATSCard({ obj, index }: { obj: NHATSObject; index: number }) {
    const dvColor =
        obj.min_dv < 5
            ? 'text-green-400'
            : obj.min_dv < 7
              ? 'text-yellow-400'
              : 'text-orange-400'

    return (
        <div
            className="glass-card group hover:scale-105 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white font-mono text-sm group-hover:text-gradient">
                        {obj.des}
                    </h4>
                    <span className="text-lg">🎯</span>
                </div>

                {/* Delta-V */}
                <div className="glass-card-inner p-3 mb-3 text-center">
                    <p className={`text-2xl font-bold ${dvColor}`}>
                        {safeToFixed(obj.min_dv)} km/s
                    </p>
                    <p className="text-xs text-white/40">Minimum ΔV</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="p-2 bg-white/5 rounded-lg">
                        <p className="text-cyan-400 font-bold">
                            {safeToFixed(obj.min_dur, 0)}
                        </p>
                        <p className="text-xs text-white/40">days min</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                        <p className="text-purple-400 font-bold">
                            {obj.n_via_traj ?? '—'}
                        </p>
                        <p className="text-xs text-white/40">trajectories</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Scout Object Card
function ScoutCard({ obj, index }: { obj: ScoutObject; index: number }) {
    const neoScore = typeof obj.neoScore === 'number' ? obj.neoScore : 0
    const scoreColor =
        neoScore >= 80
            ? 'text-red-400'
            : neoScore >= 50
              ? 'text-orange-400'
              : 'text-green-400'

    return (
        <div
            className={`glass-card group hover:scale-105 transition-all duration-300 animate-fade-in-up ${neoScore >= 50 ? 'ring-2 ring-orange-500/30' : ''}`}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="p-4">
                {/* Header */}
                <h4 className="font-bold text-white font-mono text-sm mb-3 group-hover:text-gradient">
                    {obj.objectName}
                </h4>

                {/* NEO Score */}
                <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/50">NEO Score</span>
                        <span className={`font-bold ${scoreColor}`}>
                            {safeToFixed(neoScore, 0)}%
                        </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all ${neoScore >= 80 ? 'bg-red-500' : neoScore >= 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(neoScore, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white/5 rounded-lg text-center">
                        <p className="text-cyan-400 font-bold">
                            {obj.n_obs ?? '—'}
                        </p>
                        <p className="text-white/40">observations</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-center">
                        <p className="text-purple-400 font-bold">
                            {safeToFixed(obj.arc, 1)}
                        </p>
                        <p className="text-white/40">day arc</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Orbit Class Card
function OrbitClassCard({
    code,
    name,
    index,
}: {
    code: string
    name: string
    index: number
}) {
    // Determine color based on orbit type
    const getColor = () => {
        if (['ATE', 'APO', 'AMO', 'IEO'].includes(code))
            return 'from-red-500/20 to-orange-500/20 border-red-500/30'
        if (['MCA'].includes(code))
            return 'from-orange-500/20 to-amber-500/20 border-orange-500/30'
        if (['IMB', 'MBA', 'OMB'].includes(code))
            return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
        if (['TJN'].includes(code))
            return 'from-purple-500/20 to-violet-500/20 border-purple-500/30'
        if (['CEN', 'TNO'].includes(code))
            return 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30'
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30'
    }

    return (
        <div
            className={`glass-card bg-linear-to-br ${getColor()} group hover:scale-105 transition-all duration-300 animate-fade-in-up`}
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="p-3">
                <div className="flex items-center gap-2">
                    <code className="text-white font-bold font-mono">
                        {code}
                    </code>
                    <span className="text-white/50">—</span>
                    <span className="text-white/70 text-sm">{name}</span>
                </div>
            </div>
        </div>
    )
}

// Main Client Component
export default function SsdClient({
    closeApproaches,
    fireballs,
    sentryObjects,
    nhatsObjects,
    scoutObjects,
    summary,
    orbitClasses,
    endpoints,
}: SsdClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>('approaches')
    const [showAllApproaches, setShowAllApproaches] = useState(false)

    // Tab config
    const tabs = [
        {
            id: 'approaches' as TabType,
            label: 'Close Approaches',
            icon: '🌍',
            count: closeApproaches.length,
        },
        {
            id: 'fireballs' as TabType,
            label: 'Fireballs',
            icon: '☄️',
            count: fireballs.length,
        },
        {
            id: 'sentry' as TabType,
            label: 'Sentry',
            icon: '⚠️',
            count: sentryObjects.length,
        },
        {
            id: 'nhats' as TabType,
            label: 'NHATS',
            icon: '🎯',
            count: nhatsObjects.length,
        },
        {
            id: 'scout' as TabType,
            label: 'Scout',
            icon: '🔭',
            count: scoutObjects.length,
        },
    ]

    // Displayed approaches
    const displayedApproaches = showAllApproaches
        ? closeApproaches
        : closeApproaches.slice(0, 6)

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-8 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: '1s' }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-500/5 rounded-full blur-3xl" />

                    {/* Asteroid elements */}
                    <div
                        className="absolute top-1/4 right-1/4 animate-bounce"
                        style={{ animationDuration: '3s' }}
                    >
                        <span className="text-4xl opacity-30">☄️</span>
                    </div>
                    <div
                        className="absolute bottom-1/3 left-1/4 animate-bounce"
                        style={{
                            animationDuration: '4s',
                            animationDelay: '1s',
                        }}
                    >
                        <span className="text-3xl opacity-20">🪨</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative">
                    {/* Title */}
                    <header className="relative pb-4">
                        <div className="mx-auto">
                            <div className="animate-fade-in-up space-y-4 mb-8">
                                <h1 className="title-section text-white">
                                    <span className="text-gradient">
                                        Near-Earth Objects
                                    </span>
                                </h1>
                                <p className="text-white/60 text-lg max-w-2xl">
                                    Track asteroid close approaches, fireball
                                    events, impact risks, and human-accessible
                                    NEOs from JPL&apos;s Center for Near-Earth
                                    Object Studies.
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <StatsCard
                            value={summary.upcomingApproaches || '—'}
                            label="Close Approaches (60d)"
                            icon="🌍"
                            gradient="from-blue-600/20 to-blue-800/20"
                        />
                        <StatsCard
                            value={summary.recentFireballs || '—'}
                            label="Fireballs (1yr)"
                            icon="☄️"
                            gradient="from-orange-600/20 to-orange-800/20"
                        />
                        <StatsCard
                            value={summary.sentryObjects || '—'}
                            label="Sentry Monitored"
                            icon="⚠️"
                            gradient="from-red-600/20 to-red-800/20"
                            pulse={summary.sentryObjects > 0}
                        />
                        <StatsCard
                            value={summary.nhatsObjects || '—'}
                            label="Accessible NEOs"
                            icon="🎯"
                            gradient="from-green-600/20 to-green-800/20"
                        />
                    </div>

                    {/* Tab Navigation */}
                    <div
                        className="glass-card p-2 animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span className="hidden sm:inline">
                                        {tab.label}
                                    </span>
                                    {tab.count > 0 && (
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs ${
                                                activeTab === tab.id
                                                    ? 'bg-white/20'
                                                    : 'bg-white/10'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                {/* Close Approaches */}
                {activeTab === 'approaches' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🌍</span>
                            Upcoming Close Approaches
                        </h2>

                        {closeApproaches.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {displayedApproaches.map((ca, index) => (
                                        <CloseApproachCard
                                            key={`${ca.name}-${index}`}
                                            approach={ca}
                                            index={index}
                                        />
                                    ))}
                                </div>
                                {closeApproaches.length > 6 && (
                                    <div className="text-center mt-8">
                                        <button
                                            onClick={() =>
                                                setShowAllApproaches(
                                                    !showAllApproaches
                                                )
                                            }
                                            className="glass-button px-6 py-3"
                                        >
                                            {showAllApproaches
                                                ? 'Show Less'
                                                : `Show All ${closeApproaches.length} Approaches`}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🌍</span>
                                <p className="text-white/60">
                                    Data temporarily unavailable
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Fireballs */}
                {activeTab === 'fireballs' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">☄️</span>
                            Recent Fireballs
                        </h2>

                        {fireballs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {fireballs.map((fb, index) => (
                                    <FireballCard
                                        key={index}
                                        fireball={fb}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">☄️</span>
                                <p className="text-white/60">
                                    Data temporarily unavailable
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Sentry */}
                {activeTab === 'sentry' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">⚠️</span>
                            Sentry Risk Monitoring
                        </h2>

                        {sentryObjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sentryObjects.slice(0, 9).map((obj, index) => (
                                    <SentryCard
                                        key={obj.id || index}
                                        obj={obj}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">✅</span>
                                <p className="text-white/60">
                                    No objects currently being monitored or data
                                    unavailable
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* NHATS */}
                {activeTab === 'nhats' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🎯</span>
                            Human-Accessible NEOs (NHATS)
                        </h2>

                        {nhatsObjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {nhatsObjects.map((obj, index) => (
                                    <NHATSCard
                                        key={obj.des || index}
                                        obj={obj}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🎯</span>
                                <p className="text-white/60">
                                    Data temporarily unavailable
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Scout */}
                {activeTab === 'scout' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🔭</span>
                            Scout - NEOCP Objects
                        </h2>

                        {scoutObjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {scoutObjects.slice(0, 8).map((obj, index) => (
                                    <ScoutCard
                                        key={obj.objectName || index}
                                        obj={obj}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🔭</span>
                                <p className="text-white/60">
                                    No objects currently being tracked
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Orbit Classes Section */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🪐</span>
                    Orbit Classes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(orbitClasses).map(([code, name], index) => (
                        <OrbitClassCard
                            key={code}
                            code={code}
                            name={name}
                            index={index}
                        />
                    ))}
                </div>
            </section>

            {/* API & Documentation */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* API Services */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-2xl">⚡</span>
                            API Services
                        </h2>
                        <div className="space-y-3">
                            {Object.entries(endpoints).map(
                                ([name, endpoint]) => (
                                    <div
                                        key={name}
                                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <p className="font-bold text-white">
                                            {name}
                                        </p>
                                        <code className="text-cyan-400 text-sm font-mono">
                                            {endpoint}
                                        </code>
                                    </div>
                                )
                            )}
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
                                {`# Close approaches within 0.05 AU
curl "https://ssd-api.jpl.nasa.gov/cad.api?\\
date-min=now&date-max=+30&dist-max=0.05"

# Recent fireballs > 1 kiloton
curl "https://ssd-api.jpl.nasa.gov/fireball.api?\\
energy-min=1"

# Sentry monitored objects
curl "https://ssd-api.jpl.nasa.gov/sentry.api"

# NHATS NEOs with ΔV < 6 km/s
curl "https://ssd-api.jpl.nasa.gov/nhats.api?dv=6"`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Documentation Links */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <div className="glass-card-glow p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Explore NEO Data & Documentation
                    </h2>
                    <p className="text-white/60 mb-6 max-w-xl mx-auto">
                        Access comprehensive documentation for asteroid
                        tracking, impact risk assessment, and mission design
                        tools.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <a
                            href="https://ssd-api.jpl.nasa.gov/doc/cad.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            📘 CAD API
                        </a>
                        <a
                            href="https://ssd-api.jpl.nasa.gov/doc/fireball.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-6 py-3 bg-orange-500/20 hover:bg-orange-500/30"
                        >
                            🔥 Fireball API
                        </a>
                        <a
                            href="https://ssd-api.jpl.nasa.gov/doc/sentry.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-6 py-3 bg-red-500/20 hover:bg-red-500/30"
                        >
                            ⚠️ Sentry API
                        </a>
                        <a
                            href="https://ssd-api.jpl.nasa.gov/doc/nhats.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-6 py-3 bg-green-500/20 hover:bg-green-500/30"
                        >
                            🎯 NHATS API
                        </a>
                        <a
                            href="https://cneos.jpl.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30"
                        >
                            🌐 CNEOS Website
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
