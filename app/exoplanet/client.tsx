'use client'
// Import necessary modules and types
import { useState, useMemo } from 'react'
import type { Exoplanet } from '@/lib/types/exoplanet.type'

interface DiscoveryStat {
    discoverymethod: string
    count: number
}

interface ExoplanetClientProps {
    exoplanets: Exoplanet[]
    stats: DiscoveryStat[]
    habitableExoplanets: Exoplanet[]
}

// Planet size classification
function getPlanetType(radius: number | null): {
    type: string
    color: string
    icon: string
} {
    if (!radius)
        return {
            type: 'Unknown',
            color: 'from-gray-500 to-gray-600',
            icon: '❓',
        }
    if (radius < 1)
        return {
            type: 'Sub-Earth',
            color: 'from-slate-400 to-slate-600',
            icon: '🌑',
        }
    if (radius < 1.5)
        return {
            type: 'Earth-like',
            color: 'from-emerald-400 to-teal-600',
            icon: '🌍',
        }
    if (radius < 2)
        return {
            type: 'Super-Earth',
            color: 'from-green-400 to-emerald-600',
            icon: '🌎',
        }
    if (radius < 4)
        return {
            type: 'Mini-Neptune',
            color: 'from-cyan-400 to-blue-600',
            icon: '🔵',
        }
    if (radius < 10)
        return {
            type: 'Neptune-like',
            color: 'from-blue-400 to-indigo-600',
            icon: '💙',
        }
    return {
        type: 'Gas Giant',
        color: 'from-orange-400 to-red-600',
        icon: '🟠',
    }
}

// Temperature classification
function getTempClass(temp: number | null): { zone: string; color: string } {
    if (!temp) return { zone: 'Unknown', color: 'text-gray-400' }
    if (temp < 200) return { zone: 'Frozen', color: 'text-blue-400' }
    if (temp < 280) return { zone: 'Cold', color: 'text-cyan-400' }
    if (temp < 320) return { zone: 'Habitable', color: 'text-green-400' }
    if (temp < 500) return { zone: 'Hot', color: 'text-orange-400' }
    return { zone: 'Scorching', color: 'text-red-400' }
}

// Discovery method icon
function getMethodIcon(method: string): string {
    const icons: Record<string, string> = {
        Transit: '🌑',
        'Radial Velocity': '📊',
        Imaging: '📸',
        Microlensing: '🔍',
        'Eclipse Timing Variations': '⏱️',
        'Pulsar Timing': '💫',
        'Transit Timing Variations': '⏰',
        'Orbital Brightness Modulation': '✨',
        Astrometry: '📐',
        'Disk Kinematics': '💿',
    }
    return icons[method] || '🔭'
}

// Planet Card Component
function PlanetCard({
    planet,
    index,
    isHabitable = false,
}: {
    planet: Exoplanet
    index: number
    isHabitable?: boolean
}) {
    const planetType = getPlanetType(planet.pl_rade)
    const tempClass = getTempClass(planet.pl_eqt)

    return (
        <div
            className={`glass-card p-5 animate-fade-in-up opacity-0 group hover:scale-[1.02] transition-all duration-300 ${isHabitable ? 'ring-2 ring-green-500/30' : ''}`}
            style={{ animationDelay: `${(index % 12) * 50}ms` }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                        {planet.pl_name}
                    </h4>
                    <p className="text-sm text-white/60">
                        Host: {planet.hostname}
                    </p>
                </div>
                <div className="text-3xl" title={planetType.type}>
                    {planetType.icon}
                </div>
            </div>

            {/* Planet Type Badge */}
            <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r ${planetType.color} text-white text-xs font-semibold mb-3`}
            >
                {planetType.type}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-sm">
                {planet.disc_year && (
                    <div className="bg-white/5 rounded-lg px-3 py-2">
                        <p className="text-white/50 text-xs">Discovered</p>
                        <p className="text-white font-semibold">
                            {planet.disc_year}
                        </p>
                    </div>
                )}
                {planet.discoverymethod && (
                    <div className="bg-white/5 rounded-lg px-3 py-2">
                        <p className="text-white/50 text-xs">Method</p>
                        <p
                            className="text-white font-semibold text-xs truncate"
                            title={planet.discoverymethod}
                        >
                            {getMethodIcon(planet.discoverymethod)}{' '}
                            {planet.discoverymethod}
                        </p>
                    </div>
                )}
                {planet.pl_rade && (
                    <div className="bg-white/5 rounded-lg px-3 py-2">
                        <p className="text-white/50 text-xs">Radius</p>
                        <p className="text-white font-semibold">
                            {planet.pl_rade.toFixed(2)} R⊕
                        </p>
                    </div>
                )}
                {planet.pl_bmasse && (
                    <div className="bg-white/5 rounded-lg px-3 py-2">
                        <p className="text-white/50 text-xs">Mass</p>
                        <p className="text-white font-semibold">
                            {planet.pl_bmasse.toFixed(2)} M⊕
                        </p>
                    </div>
                )}
                {planet.pl_orbper && (
                    <div className="bg-white/5 rounded-lg px-3 py-2">
                        <p className="text-white/50 text-xs">Orbital Period</p>
                        <p className="text-white font-semibold">
                            {planet.pl_orbper.toFixed(1)} days
                        </p>
                    </div>
                )}
                {planet.pl_eqt && (
                    <div className="bg-white/5 rounded-lg px-3 py-2">
                        <p className="text-white/50 text-xs">Temperature</p>
                        <p className={`font-semibold ${tempClass.color}`}>
                            {planet.pl_eqt.toFixed(0)} K ({tempClass.zone})
                        </p>
                    </div>
                )}
                {planet.sy_dist && (
                    <div className="bg-white/5 rounded-lg px-3 py-2 col-span-2">
                        <p className="text-white/50 text-xs">Distance</p>
                        <p className="text-white font-semibold">
                            {planet.sy_dist.toFixed(1)} parsecs (
                            {(planet.sy_dist * 3.26156).toFixed(1)} light years)
                        </p>
                    </div>
                )}
            </div>

            {/* Habitable Badge */}
            {isHabitable && (
                <div className="mt-3 flex items-center gap-2 text-green-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Potentially Habitable Zone
                </div>
            )}
        </div>
    )
}

// Discovery Method Chart
function MethodChart({ stats }: { stats: DiscoveryStat[] }) {
    const maxCount = Math.max(...stats.map((s) => s.count))
    const sortedStats = [...stats].sort((a, b) => b.count - a.count)

    return (
        <div className="space-y-3">
            {sortedStats.map((stat, index) => {
                const percentage = (stat.count / maxCount) * 100
                return (
                    <div key={stat.discoverymethod || index} className="group">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-white/80 text-sm flex items-center gap-2">
                                <span>
                                    {getMethodIcon(stat.discoverymethod)}
                                </span>
                                {stat.discoverymethod || 'Unknown'}
                            </span>
                            <span className="text-white font-bold">
                                {stat.count.toLocaleString()}
                            </span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${percentage}%`,
                                    animationDelay: `${index * 100}ms`,
                                }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// Size Distribution Visualization
function SizeDistribution({ planets }: { planets: Exoplanet[] }) {
    const distribution = useMemo(() => {
        const counts = {
            'Sub-Earth': 0,
            'Earth-like': 0,
            'Super-Earth': 0,
            'Mini-Neptune': 0,
            'Neptune-like': 0,
            'Gas Giant': 0,
            Unknown: 0,
        }

        planets.forEach((p) => {
            const type = getPlanetType(p.pl_rade).type
            counts[type as keyof typeof counts]++
        })

        return Object.entries(counts).filter(([, count]) => count > 0)
    }, [planets])

    const total = distribution.reduce((sum, [, count]) => sum + count, 0)

    const colors: Record<string, string> = {
        'Sub-Earth': 'bg-slate-500',
        'Earth-like': 'bg-emerald-500',
        'Super-Earth': 'bg-green-500',
        'Mini-Neptune': 'bg-cyan-500',
        'Neptune-like': 'bg-blue-500',
        'Gas Giant': 'bg-orange-500',
        Unknown: 'bg-gray-500',
    }

    return (
        <div className="space-y-4">
            {/* Visual Bar */}
            <div className="h-8 rounded-full overflow-hidden flex">
                {distribution.map(([type, count]) => (
                    <div
                        key={type}
                        className={`${colors[type]} transition-all duration-500 hover:brightness-125`}
                        style={{ width: `${(count / total) * 100}%` }}
                        title={`${type}: ${count}`}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {distribution.map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2 text-sm">
                        <div
                            className={`w-3 h-3 rounded-full ${colors[type]}`}
                        />
                        <span className="text-white/70">{type}</span>
                        <span className="text-white font-bold ml-auto">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ExoplanetClient({
    exoplanets,
    stats,
    habitableExoplanets,
}: ExoplanetClientProps) {
    // State for tabs, sorting, and search
    const [activeTab, setActiveTab] = useState<'recent' | 'habitable'>('recent')
    const [sortBy, setSortBy] = useState<
        'year' | 'distance' | 'radius' | 'mass'
    >('year')
    const [searchQuery, setSearchQuery] = useState('')

    // Calculate totals
    const totalPlanets = useMemo(
        () => stats.reduce((sum, s) => sum + s.count, 0),
        [stats]
    )

    // Filter and sort planets
    const filteredPlanets = useMemo(() => {
        let planets =
            activeTab === 'habitable' ? habitableExoplanets : exoplanets

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            planets = planets.filter(
                (p) =>
                    p.pl_name.toLowerCase().includes(query) ||
                    p.hostname.toLowerCase().includes(query) ||
                    p.discoverymethod?.toLowerCase().includes(query)
            )
        }

        // Sort
        return [...planets].sort((a, b) => {
            switch (sortBy) {
                case 'year':
                    return (b.disc_year || 0) - (a.disc_year || 0)
                case 'distance':
                    return (a.sy_dist || Infinity) - (b.sy_dist || Infinity)
                case 'radius':
                    return (b.pl_rade || 0) - (a.pl_rade || 0)
                case 'mass':
                    return (b.pl_bmasse || 0) - (a.pl_bmasse || 0)
                default:
                    return 0
            }
        })
    }, [exoplanets, habitableExoplanets, activeTab, sortBy, searchQuery])

    // Stats for cards
    const avgRadius = useMemo(() => {
        const withRadius = exoplanets.filter((p) => p.pl_rade)
        if (withRadius.length === 0) return 0
        return (
            withRadius.reduce((sum, p) => sum + (p.pl_rade || 0), 0) /
            withRadius.length
        )
    }, [exoplanets])

    // Number of potentially habitable exoplanets
    const nearestPlanet = useMemo(() => {
        return exoplanets.reduce(
            (nearest, p) => {
                if (!p.sy_dist) return nearest
                if (!nearest || p.sy_dist < (nearest.sy_dist || Infinity))
                    return p
                return nearest
            },
            null as Exoplanet | null
        )
    }, [exoplanets])

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <header className="relative px-6 pt-8 pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-fade-in-up space-y-4 mb-8">
                        <h1 className="title-section text-white">
                            <span className="text-gradient">
                                Exoplanet Archive
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Explore thousands of confirmed worlds orbiting
                            distant stars. From scorching gas giants to
                            potentially habitable Earth-like planets.
                        </p>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <section className="px-6 mt-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 text-center">
                            <div className="text-4xl mb-2">🪐</div>
                            <p className="text-3xl font-black text-gradient">
                                {totalPlanets.toLocaleString()}
                            </p>
                            <p className="text-white/60 text-sm">
                                Total Confirmed
                            </p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-1 text-center">
                            <div className="text-4xl mb-2">🌍</div>
                            <p className="text-3xl font-black text-green-400">
                                {habitableExoplanets.length}
                            </p>
                            <p className="text-white/60 text-sm">
                                Potentially Habitable
                            </p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-2 text-center">
                            <div className="text-4xl mb-2">📏</div>
                            <p className="text-3xl font-black text-cyan-400">
                                {avgRadius.toFixed(2)}
                            </p>
                            <p className="text-white/60 text-sm">
                                Avg Radius (R⊕)
                            </p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-3 text-center">
                            <div className="text-4xl mb-2">📍</div>
                            <p className="text-3xl font-black text-purple-400">
                                {nearestPlanet?.sy_dist?.toFixed(1) || '—'}
                            </p>
                            <p className="text-white/60 text-sm">
                                Nearest (parsecs)
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Discovery Methods Section */}
            {stats.length > 0 && (
                <section className="px-6 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid gap-8">
                            {/* Method Chart */}
                            <div className="glass-card p-6 animate-fade-in-up opacity-0">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-3xl">🔭</span>
                                    Discovery Methods
                                </h3>
                                <MethodChart stats={stats} />
                            </div>

                            {/* Size Distribution */}
                            <div className="glass-card p-6 animate-fade-in-up opacity-0 stagger-1">
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-3xl">📊</span>
                                    Size Distribution
                                </h3>
                                <SizeDistribution planets={exoplanets} />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* About Section */}
            <section className="px-6 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-8 animate-fade-in-up opacity-0">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">ℹ️</span>
                            About the Exoplanet Archive
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6 text-white/70">
                            <div>
                                <p className="mb-4">
                                    The NASA Exoplanet Archive is the official
                                    database for confirmed exoplanets discovered
                                    by missions like Kepler, TESS, and
                                    ground-based observatories. It contains
                                    detailed information about planetary systems
                                    beyond our solar system.
                                </p>
                                <p>
                                    <strong className="text-white">
                                        Habitable Zone:
                                    </strong>{' '}
                                    Planets are considered potentially habitable
                                    if they have equilibrium temperatures
                                    between 180-310K and radii less than 2 Earth
                                    radii, suggesting rocky composition.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🌑</span>
                                    <span>
                                        <strong className="text-white">
                                            Transit:
                                        </strong>{' '}
                                        Detecting dimming as a planet crosses
                                        its star
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📊</span>
                                    <span>
                                        <strong className="text-white">
                                            Radial Velocity:
                                        </strong>{' '}
                                        Measuring stellar wobble from planetary
                                        gravity
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📸</span>
                                    <span>
                                        <strong className="text-white">
                                            Direct Imaging:
                                        </strong>{' '}
                                        Photographing planets directly
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🔍</span>
                                    <span>
                                        <strong className="text-white">
                                            Microlensing:
                                        </strong>{' '}
                                        Using gravitational lensing effects
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Planet Explorer Section */}
            <section className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Controls */}
                    <div className="glass-card p-4 mb-6 animate-fade-in-up opacity-0">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Tabs */}
                            <div className="flex bg-white/5 rounded-xl p-1">
                                <button
                                    onClick={() => setActiveTab('recent')}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                        activeTab === 'recent'
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    🆕 Recent ({exoplanets.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('habitable')}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                        activeTab === 'habitable'
                                            ? 'bg-green-500/30 text-green-400'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    🌍 Habitable ({habitableExoplanets.length})
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search planets, stars, methods..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 pl-10 text-white placeholder-white/40 focus:!outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                                    🔍
                                </span>
                            </div>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as typeof sortBy)
                                }
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:!outline-none focus:ring-2 focus:ring-purple-500/50"
                            >
                                <option className="bg-gray-800" value="year">
                                    Sort by Year
                                </option>
                                <option
                                    className="bg-gray-800"
                                    value="distance"
                                >
                                    Sort by Distance
                                </option>
                                <option className="bg-gray-800" value="radius">
                                    Sort by Radius
                                </option>
                                <option className="bg-gray-800" value="mass">
                                    Sort by Mass
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <p className="text-white/60 mb-4 animate-fade-in-up opacity-0">
                        Showing {filteredPlanets.length}{' '}
                        {activeTab === 'habitable'
                            ? 'potentially habitable '
                            : ''}
                        planets
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>

                    {/* Planet Grid */}
                    {filteredPlanets.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredPlanets.map((planet, index) => (
                                <PlanetCard
                                    key={`${planet.pl_name}-${index}`}
                                    planet={planet}
                                    index={index}
                                    isHabitable={activeTab === 'habitable'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-12 text-center animate-fade-in-up opacity-0">
                            <div className="text-6xl mb-4">🔭</div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                No Planets Found
                            </h3>
                            <p className="text-white/60">
                                {searchQuery
                                    ? `No planets match "${searchQuery}". Try a different search.`
                                    : 'Unable to load exoplanet data. Please try again later.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
