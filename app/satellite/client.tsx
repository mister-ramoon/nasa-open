'use client'

// Import necessary modules and types
import { useState, useMemo } from 'react'
import type { Observatory, GroundStation } from '@/lib/types/satellite.type'

// Props interface
interface SatelliteClientProps {
    observatories: Observatory[]
    activeObservatories: Observatory[]
    groundStations: GroundStation[]
    popularSatellites: string[]
    coordinateSystems: Record<string, string>
}

// Coordinate system config
const COORD_CONFIG: Record<
    string,
    { icon: string; color: string; fullName: string }
> = {
    GEO: {
        icon: '🌍',
        color: 'from-green-500 to-emerald-500',
        fullName: 'Geographic',
    },
    GM: {
        icon: '🧲',
        color: 'from-purple-500 to-violet-500',
        fullName: 'Geomagnetic',
    },
    GSE: {
        icon: '☀️',
        color: 'from-yellow-500 to-orange-500',
        fullName: 'Geocentric Solar Ecliptic',
    },
    GSM: {
        icon: '🌀',
        color: 'from-blue-500 to-cyan-500',
        fullName: 'Geocentric Solar Magnetospheric',
    },
    SM: {
        icon: '💫',
        color: 'from-pink-500 to-rose-500',
        fullName: 'Solar Magnetic',
    },
    GEI_TOD: {
        icon: '🔭',
        color: 'from-indigo-500 to-blue-500',
        fullName: 'Geocentric Equatorial Inertial (ToD)',
    },
    GEI_J2000: {
        icon: '⭐',
        color: 'from-amber-500 to-yellow-500',
        fullName: 'Geocentric Equatorial Inertial (J2000)',
    },
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
                    <p className="text-3xl font-bold text-white">{value}</p>
                    <p className="text-white/70 text-sm">{label}</p>
                </div>
                <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform">
                    {icon}
                </span>
            </div>
        </div>
    )
}

// Observatory Card Component
function ObservatoryCard({
    observatory,
    index,
}: {
    observatory: Observatory
    index: number
}) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Calculate if active
    const now = new Date()
    const endTime = new Date(observatory.EndTime)
    const isActive = endTime > now

    // Calculate mission duration
    const startDate = new Date(observatory.StartTime)
    const durationDays = Math.ceil(
        (endTime.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const durationYears = (durationDays / 365).toFixed(1)

    // Format date
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        } catch {
            return dateStr
        }
    }

    return (
        <div
            className="glass-card group hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Status indicator bar */}
            <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${isActive ? 'bg-linear-to-r from-green-500 to-emerald-500' : 'bg-linear-to-r from-gray-500 to-slate-500'}`}
            />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h4 className="font-bold text-white group-hover:text-gradient transition-all line-clamp-1">
                            {observatory.Name}
                        </h4>
                        <p className="text-xs text-white/50 font-mono mt-1">
                            {observatory.Id}
                        </p>
                    </div>
                    <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}
                        />
                        {isActive ? 'Active' : 'Inactive'}
                    </div>
                </div>

                {/* Timeline */}
                <div className="glass-card-inner p-3 mb-3">
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <p className="text-white/50 text-xs">Launch</p>
                            <p className="text-white font-medium text-sm">
                                {formatDate(observatory.StartTime)}
                            </p>
                        </div>
                        <div className="flex-1 mx-3 h-px bg-linear-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-500 rounded-full" />
                        </div>
                        <div className="text-right">
                            <p className="text-white/50 text-xs">End</p>
                            <p className="text-white font-medium text-sm">
                                {formatDate(observatory.EndTime)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                        <p className="text-lg text-cyan-400 font-bold">
                            {observatory.Resolution}
                        </p>
                        <p className="text-xs text-white/50">Min Resolution</p>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                        <p className="text-lg text-purple-400 font-bold">
                            {durationYears}
                        </p>
                        <p className="text-xs text-white/50">Years Mission</p>
                    </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in-up">
                        {observatory.ResourceId && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-white/50">
                                    Resource ID:
                                </span>
                                <code className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-xs">
                                    {observatory.ResourceId}
                                </code>
                            </div>
                        )}
                        <div className="mt-3 flex items-center gap-2 text-sm text-white/50">
                            <span>📅</span>
                            <span>
                                {durationDays.toLocaleString()} days total
                                mission duration
                            </span>
                        </div>
                    </div>
                )}

                {/* Expand indicator */}
                <div className="mt-3 text-center">
                    <span
                        className={`text-white/30 text-xs transition-transform inline-block ${isExpanded ? 'rotate-180' : ''}`}
                    >
                        ▼
                    </span>
                </div>
            </div>
        </div>
    )
}

// Ground Station Card
function GroundStationCard({
    station,
    index,
}: {
    station: GroundStation
    index: number
}) {
    // Determine hemisphere
    const isNorth = station.Latitude >= 0
    const isEast = station.Longitude >= 0

    return (
        <div
            className="glass-card group hover:scale-105 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center">
                        <span className="text-xl">📡</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-gradient">
                            {station.Name}
                        </h4>
                        <p className="text-xs text-white/50 font-mono">
                            {station.Id}
                        </p>
                    </div>
                </div>

                {/* Coordinates */}
                <div className="glass-card-inner p-3">
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                            <p className="text-white font-mono text-sm">
                                {Math.abs(station.Latitude).toFixed(2)}°{' '}
                                {isNorth ? 'N' : 'S'}
                            </p>
                            <p className="text-xs text-white/40">Latitude</p>
                        </div>
                        <div>
                            <p className="text-white font-mono text-sm">
                                {Math.abs(station.Longitude).toFixed(2)}°{' '}
                                {isEast ? 'E' : 'W'}
                            </p>
                            <p className="text-xs text-white/40">Longitude</p>
                        </div>
                    </div>
                </div>

                {/* Hemisphere badge */}
                <div className="mt-3 flex items-center justify-center gap-2">
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${isNorth ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'}`}
                    >
                        {isNorth ? '🌐 Northern' : '🌐 Southern'}
                    </span>
                </div>
            </div>
        </div>
    )
}

// Coordinate System Card
function CoordSystemCard({ code, index }: { code: string; index: number }) {
    const config = COORD_CONFIG[code] || {
        icon: '📐',
        color: 'from-gray-500 to-slate-500',
        fullName: code,
    }

    return (
        <div
            className="glass-card group hover:scale-105 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Gradient hover overlay */}
            <div
                className={`absolute inset-0 bg-linear-to-br ${config.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}
            />

            <div className="p-5 relative">
                {/* Icon and code */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{config.icon}</span>
                    <code className="text-lg font-bold text-white font-mono group-hover:text-gradient">
                        {code}
                    </code>
                </div>

                {/* Full name */}
                <p className="text-sm text-white/60">{config.fullName}</p>

                {/* Bottom gradient bar */}
                <div
                    className={`absolute bottom-0 left-4 right-4 h-1 bg-linear-to-r ${config.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                />
            </div>
        </div>
    )
}

// Satellite Tag Component
function SatelliteTag({ name, index }: { name: string; index: number }) {
    // Cycle through colors
    const colors = [
        'from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30',
        'from-purple-500/20 to-pink-500/20 text-pink-300 border-pink-500/30',
        'from-green-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/30',
        'from-orange-500/20 to-amber-500/20 text-amber-300 border-amber-500/30',
        'from-indigo-500/20 to-violet-500/20 text-violet-300 border-violet-500/30',
    ]
    const colorClass = colors[index % colors.length]

    return (
        <span
            className={`px-4 py-2 bg-linear-to-r ${colorClass} rounded-full text-sm font-mono border hover:scale-105 transition-transform cursor-pointer animate-fade-in-up`}
            style={{ animationDelay: `${index * 30}ms` }}
        >
            🛰️ {name}
        </span>
    )
}

// API Endpoint Component
function APIEndpoint({
    method,
    path,
    description,
}: {
    method: string
    path: string
    description: string
}) {
    const methodColor =
        method === 'GET'
            ? 'bg-blue-500/20 text-blue-400'
            : 'bg-green-500/20 text-green-400'

    return (
        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <span
                className={`px-2 py-1 ${methodColor} text-xs rounded font-bold shrink-0`}
            >
                {method}
            </span>
            <div>
                <code className="text-cyan-400 text-sm font-mono">{path}</code>
                <p className="text-white/50 text-xs mt-1">{description}</p>
            </div>
        </div>
    )
}

// Main Client Component
export default function SatelliteClient({
    observatories,
    activeObservatories,
    groundStations,
    popularSatellites,
    coordinateSystems,
}: SatelliteClientProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'spacecraft' | 'stations'>(
        'spacecraft'
    )
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'active' | 'inactive'
    >('all')

    // Filter observatories
    const filteredObservatories = useMemo(() => {
        return observatories.filter((obs) => {
            const matchesSearch =
                !searchTerm ||
                obs.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                obs.Id.toLowerCase().includes(searchTerm.toLowerCase())

            if (statusFilter === 'all') return matchesSearch

            const now = new Date()
            const endTime = new Date(obs.EndTime)
            const isActive = endTime > now

            if (statusFilter === 'active') return matchesSearch && isActive
            if (statusFilter === 'inactive') return matchesSearch && !isActive

            return matchesSearch
        })
    }, [observatories, searchTerm, statusFilter])

    // Filter ground stations
    const filteredStations = useMemo(() => {
        if (!searchTerm) return groundStations
        return groundStations.filter(
            (station) =>
                station.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                station.Id.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [groundStations, searchTerm])

    // Stats
    const totalSpacecraft = observatories.length
    const activeCount = activeObservatories.length
    const stationCount = groundStations.length
    const coordCount = Object.keys(coordinateSystems).length

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-8 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: '1s' }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-3xl" />

                    {/* Orbiting elements */}
                    <div
                        className="absolute top-1/4 right-1/4 animate-spin"
                        style={{ animationDuration: '20s' }}
                    >
                        <span className="text-4xl opacity-20">🛰️</span>
                    </div>
                    <div
                        className="absolute bottom-1/3 left-1/3 animate-spin"
                        style={{
                            animationDuration: '30s',
                            animationDirection: 'reverse',
                        }}
                    >
                        <span className="text-3xl opacity-20">🌍</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative">
                    <header className="relative pb-4">
                        <div className="mx-auto">
                            <div className="animate-fade-in-up space-y-4 mb-8">
                                <h1 className="title-section text-white">
                                    <span className="text-gradient">
                                        Satellite Situation
                                    </span>
                                </h1>
                                <p className="text-white/60 text-lg max-w-2xl">
                                    Track spacecraft locations, geophysical
                                    regions, and magnetic field tracings. Access
                                    real-time data from NASA&apos;s Space
                                    Physics Data Facility.
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
                            value={totalSpacecraft}
                            label="Total Spacecraft"
                            icon="🚀"
                            gradient="from-blue-600/20 to-blue-800/20"
                        />
                        <StatsCard
                            value={activeCount}
                            label="Currently Active"
                            icon="✨"
                            gradient="from-green-600/20 to-green-800/20"
                        />
                        <StatsCard
                            value={stationCount}
                            label="Ground Stations"
                            icon="📡"
                            gradient="from-purple-600/20 to-purple-800/20"
                        />
                        <StatsCard
                            value={coordCount}
                            label="Coordinate Systems"
                            icon="🌐"
                            gradient="from-orange-600/20 to-orange-800/20"
                        />
                    </div>

                    {/* Search and Filters */}
                    <div
                        className="glass-card p-6 animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search spacecraft, stations, IDs..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:!outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as
                                            | 'all'
                                            | 'active'
                                            | 'inactive'
                                    )
                                }
                                className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:!outline-none focus:border-blue-500/50 min-w-40 cursor-pointer"
                            >
                                <option value="all" className="bg-gray-900">
                                    All Status
                                </option>
                                <option value="active" className="bg-gray-900">
                                    Active Only
                                </option>
                                <option
                                    value="inactive"
                                    className="bg-gray-900"
                                >
                                    Inactive
                                </option>
                            </select>

                            {/* Tab Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('spacecraft')}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                        activeTab === 'spacecraft'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    🛰️ Spacecraft
                                </button>
                                <button
                                    onClick={() => setActiveTab('stations')}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                        activeTab === 'stations'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    📡 Stations
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Satellites */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">⭐</span>
                    Popular Satellites
                </h2>
                <div className="flex flex-wrap gap-3">
                    {popularSatellites.map((sat, index) => (
                        <SatelliteTag key={sat} name={sat} index={index} />
                    ))}
                </div>
            </section>

            {/* Main Content - Spacecraft or Stations */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                {activeTab === 'spacecraft' ? (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🛰️</span>
                            Spacecraft Registry
                            <span className="text-sm font-normal text-white/50 ml-2">
                                ({filteredObservatories.length} results)
                            </span>
                        </h2>

                        {filteredObservatories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredObservatories
                                    .slice(0, 15)
                                    .map((obs, index) => (
                                        <ObservatoryCard
                                            key={obs.Id}
                                            observatory={obs}
                                            index={index}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🛰️</span>
                                <p className="text-white/60">
                                    No spacecraft found matching your criteria
                                </p>
                            </div>
                        )}

                        {filteredObservatories.length > 15 && (
                            <div className="text-center mt-8">
                                <p className="text-white/50 text-sm">
                                    Showing 15 of {filteredObservatories.length}{' '}
                                    spacecraft
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">📡</span>
                            Ground Stations
                            <span className="text-sm font-normal text-white/50 ml-2">
                                ({filteredStations.length} stations)
                            </span>
                        </h2>

                        {filteredStations.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {filteredStations.map((station, index) => (
                                    <GroundStationCard
                                        key={station.Id}
                                        station={station}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">📡</span>
                                <p className="text-white/60">
                                    No ground stations found
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Coordinate Systems */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🌐</span>
                    Coordinate Systems
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.keys(coordinateSystems).map((code, index) => (
                        <CoordSystemCard key={code} code={code} index={index} />
                    ))}
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
                            <APIEndpoint
                                method="GET"
                                path="/observatories"
                                description="List all available spacecraft/observatories"
                            />
                            <APIEndpoint
                                method="GET"
                                path="/groundStations"
                                description="List all ground stations"
                            />
                            <APIEndpoint
                                method="POST"
                                path="/locations"
                                description="Get spacecraft locations for time range"
                            />
                            <APIEndpoint
                                method="POST"
                                path="/conjunctions"
                                description="Find satellite conjunctions"
                            />
                        </div>
                        <a
                            href="https://sscweb.gsfc.nasa.gov/WebServices/REST/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button mt-6 w-full text-center block"
                        >
                            View Full API Documentation →
                        </a>
                    </div>

                    {/* Code Examples */}
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-2xl">💻</span>
                            Example Queries
                        </h2>
                        <div className="bg-gray-900/50 rounded-xl p-4 overflow-x-auto border border-white/10">
                            <pre className="text-sm">
                                <code className="text-green-400">
                                    {`# Get all observatories
curl "https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories" \\
  -H "Accept: application/json"

# Get ground stations
curl "https://sscweb.gsfc.nasa.gov/WS/sscr/2/groundStations" \\
  -H "Accept: application/json"

# Get spacecraft locations (POST)
curl -X POST "https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"Request": {...}}'`}
                                </code>
                            </pre>
                        </div>
                        <div className="mt-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <div className="flex items-start gap-3">
                                <span className="text-xl">💡</span>
                                <div>
                                    <p className="text-white font-medium text-sm">
                                        Pro Tip
                                    </p>
                                    <p className="text-white/60 text-xs mt-1">
                                        Use the{' '}
                                        <code className="text-cyan-400">
                                            coordinateSystem
                                        </code>{' '}
                                        parameter to specify output format: GEO,
                                        GM, GSE, GSM, SM, GEI_TOD, or GEI_J2000
                                    </p>
                                </div>
                            </div>
                        </div>
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
                        Access comprehensive spacecraft location data, magnetic
                        field tracings, and geophysical region mappings from
                        NASA&apos;s Space Physics Data Facility.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://sscweb.gsfc.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            🛰️ Visit SSCWeb
                        </a>
                        <a
                            href="https://sscweb.gsfc.nasa.gov/WebServices/REST/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3"
                        >
                            📚 API Documentation
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
