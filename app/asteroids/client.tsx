'use client'

import { useState, useMemo } from 'react'
import type { Asteroid } from '@/lib/types/asteroid.type'

// Stats card component
interface StatsCardProps {
    label: string
    value: string | number
    icon: string
    trend?: 'up' | 'down' | 'neutral'
    delay?: number
}

// Stats card component function
function StatsCard({ label, value, icon, delay = 0 }: StatsCardProps) {
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
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    )
}

// Asteroid table component
interface AsteroidTableProps {
    asteroids: Asteroid[]
    loading?: boolean
}

// Asteroid table component function
function AsteroidTable({ asteroids, loading = false }: AsteroidTableProps) {
    // Sorting state
    const [sortBy, setSortBy] = useState<
        'name' | 'size' | 'distance' | 'velocity'
    >('distance')

    // Memoized sorted asteroids
    const sortedAsteroids = useMemo(() => {
        const sorted = [...asteroids]
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name))
            case 'size':
                return sorted.sort(
                    (a, b) =>
                        b.estimated_diameter.meters.estimated_diameter_max -
                        a.estimated_diameter.meters.estimated_diameter_max
                )
            case 'distance':
                return sorted.sort((a, b) => {
                    const distA = parseFloat(
                        String(
                            a.close_approach_data[0]?.miss_distance
                                .kilometers || Infinity
                        )
                    )
                    const distB = parseFloat(
                        String(
                            b.close_approach_data[0]?.miss_distance
                                .kilometers || Infinity
                        )
                    )
                    return distA - distB
                })
            case 'velocity':
                return sorted.sort((a, b) => {
                    const velA = parseFloat(
                        String(
                            a.close_approach_data[0]?.relative_velocity
                                .kilometers_per_hour || 0
                        )
                    )
                    const velB = parseFloat(
                        String(
                            b.close_approach_data[0]?.relative_velocity
                                .kilometers_per_hour || 0
                        )
                    )
                    return velB - velA
                })
            default:
                return sorted
        }
    }, [asteroids, sortBy])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div
            className="glass-card overflow-hidden animate-fade-in-up opacity-0"
            style={{ animationDelay: '400ms' }}
        >
            {/* Sort controls */}
            <div className="p-6 border-b border-white/10 flex flex-wrap gap-2">
                <span className="text-white/60 text-sm">Sort by:</span>
                {(['name', 'size', 'distance', 'velocity'] as const).map(
                    (option) => (
                        <button
                            key={option}
                            onClick={() => setSortBy(option)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                                sortBy === option
                                    ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                    )
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="px-6 py-3 text-left text-white/70 font-semibold">
                                Name
                            </th>
                            <th className="px-6 py-3 text-right text-white/70 font-semibold">
                                Size (m)
                            </th>
                            <th className="px-6 py-3 text-right text-white/70 font-semibold">
                                Distance (km)
                            </th>
                            <th className="px-6 py-3 text-right text-white/70 font-semibold">
                                Velocity (km/h)
                            </th>
                            <th className="px-6 py-3 text-center text-white/70 font-semibold">
                                Hazard
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAsteroids.map((asteroid, idx) => (
                            <tr
                                key={asteroid.id}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors duration-300 group"
                                style={{
                                    animation: `fadeInUp ${0.5}s ease-out`,
                                    animationDelay: `${idx * 30}ms`,
                                }}
                            >
                                <td className="px-6 py-4 text-white font-medium group-hover:text-gradient transition-all">
                                    {asteroid.name}
                                </td>
                                <td className="px-6 py-4 text-right text-white/70">
                                    {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(
                                        2
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right text-white/70">
                                    {parseFloat(
                                        String(
                                            asteroid.close_approach_data[0]
                                                ?.miss_distance.kilometers ||
                                                '0'
                                        )
                                    ).toFixed(0)}
                                </td>
                                <td className="px-6 py-4 text-right text-white/70">
                                    {Math.round(
                                        parseFloat(
                                            String(
                                                asteroid.close_approach_data[0]
                                                    ?.relative_velocity
                                                    .kilometers_per_hour || '0'
                                            )
                                        )
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {asteroid.is_potentially_hazardous_asteroid ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                                            ⚠️ Yes
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                                            ✓ No
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Size category helper
function getSizeCategory(maxDiameter: number): string {
    if (maxDiameter > 1000) return 'Mega'
    if (maxDiameter > 100) return 'Large'
    if (maxDiameter > 10) return 'Medium'
    if (maxDiameter > 1) return 'Small'
    return 'Tiny'
}

// Color helper for size
function getSizeColor(maxDiameter: number): string {
    if (maxDiameter > 1000) return 'from-red-600 to-red-400'
    if (maxDiameter > 100) return 'from-orange-600 to-orange-400'
    if (maxDiameter > 10) return 'from-yellow-600 to-yellow-400'
    if (maxDiameter > 1) return 'from-blue-600 to-blue-400'
    return 'from-cyan-600 to-cyan-400'
}

// Interface for AsteroidsClient props
interface AsteroidsClientProps {
    allAsteroids: Asteroid[]
    startDate: string
    endDate: string
}

export default function AsteroidsClient({
    allAsteroids,
    startDate,
    endDate,
}: AsteroidsClientProps) {
    // Calculate statistics
    const totalAsteroids = allAsteroids.length
    const hazardousAsteroids = allAsteroids.filter(
        (a) => a.is_potentially_hazardous_asteroid
    ).length

    // Average size and largest asteroid
    const averageSize =
        allAsteroids.reduce(
            (sum, a) =>
                sum + a.estimated_diameter.meters.estimated_diameter_max,
            0
        ) / totalAsteroids
    const largestAsteroid = Math.max(
        ...allAsteroids.map(
            (a) => a.estimated_diameter.meters.estimated_diameter_max
        )
    )

    // Group asteroids by size category
    const sizeCategories = {
        Mega: allAsteroids.filter(
            (a) => a.estimated_diameter.meters.estimated_diameter_max > 1000
        ).length,
        Large: allAsteroids.filter(
            (a) =>
                a.estimated_diameter.meters.estimated_diameter_max > 100 &&
                a.estimated_diameter.meters.estimated_diameter_max <= 1000
        ).length,
        Medium: allAsteroids.filter(
            (a) =>
                a.estimated_diameter.meters.estimated_diameter_max > 10 &&
                a.estimated_diameter.meters.estimated_diameter_max <= 100
        ).length,
        Small: allAsteroids.filter(
            (a) =>
                a.estimated_diameter.meters.estimated_diameter_max > 1 &&
                a.estimated_diameter.meters.estimated_diameter_max <= 10
        ).length,
        Tiny: allAsteroids.filter(
            (a) => a.estimated_diameter.meters.estimated_diameter_max <= 1
        ).length,
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <header className="relative px-6 pt-8 pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-fade-in-up space-y-2 mb-8">
                        <h1 className="title-section text-white">
                            <span className="text-gradient">
                                Near-Earth Asteroids
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg">
                            Track and analyze potentially hazardous asteroids
                            approaching Earth
                        </p>
                        <p className="text-white/50 text-sm">
                            Data from {startDate} to {endDate}
                        </p>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            label="Total Asteroids"
                            value={totalAsteroids}
                            icon="☄️"
                            delay={0}
                        />
                        <StatsCard
                            label="Potentially Hazardous"
                            value={hazardousAsteroids}
                            icon="⚠️"
                            trend="up"
                            delay={100}
                        />
                        <StatsCard
                            label="Average Size"
                            value={`${averageSize.toFixed(1)}m`}
                            icon="📏"
                            delay={200}
                        />
                        <StatsCard
                            label="Largest Detected"
                            value={`${largestAsteroid.toFixed(0)}m`}
                            icon="🌍"
                            delay={300}
                        />
                    </div>
                </div>
            </section>

            {/* Size distribution */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="glass-card p-8 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '200ms' }}
                    >
                        <h2 className="text-xl font-bold text-white mb-6">
                            Asteroid Size Distribution
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {Object.entries(sizeCategories).map(
                                ([category, count], idx) => {
                                    const diameterMap: Record<string, number> =
                                        {
                                            Mega: 1001,
                                            Large: 101,
                                            Medium: 11,
                                            Small: 2,
                                            Tiny: 0.5,
                                        }
                                    return (
                                        <div
                                            key={category}
                                            className="relative group"
                                            style={{
                                                animation: `fadeInUp 0.5s ease-out`,
                                                animationDelay: `${idx * 50}ms`,
                                            }}
                                        >
                                            <div
                                                className={`bg-linear-to-b ${getSizeColor(diameterMap[category])} p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                                            >
                                                <div className="text-3xl font-bold text-white mb-2">
                                                    {count}
                                                </div>
                                                <div className="text-white/70 text-sm font-medium">
                                                    {category}
                                                </div>
                                                <div className="text-white/50 text-xs mt-1">
                                                    {(
                                                        (count /
                                                            totalAsteroids) *
                                                        100
                                                    ).toFixed(1)}
                                                    %
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Close Approaches Grid */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <h2
                        className="text-2xl font-bold text-white mb-6 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '500ms' }}
                    >
                        Closest Approaches
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allAsteroids
                            .filter((a) => a.close_approach_data.length > 0)
                            .sort(
                                (a, b) =>
                                    parseFloat(
                                        String(
                                            a.close_approach_data[0]
                                                .miss_distance.kilometers
                                        )
                                    ) -
                                    parseFloat(
                                        String(
                                            b.close_approach_data[0]
                                                .miss_distance.kilometers
                                        )
                                    )
                            )
                            .slice(0, 6)
                            .map((asteroid, idx) => {
                                const approach = asteroid.close_approach_data[0]
                                const distance = parseFloat(
                                    String(approach.miss_distance.kilometers)
                                )
                                const velocity = parseFloat(
                                    String(
                                        approach.relative_velocity
                                            .kilometers_per_hour
                                    )
                                )
                                const maxDiameter =
                                    asteroid.estimated_diameter.meters
                                        .estimated_diameter_max

                                return (
                                    <div
                                        key={asteroid.id}
                                        className="glass-card glass-card-glow p-6 opacity-0 animate-fade-in-up group"
                                        style={{
                                            animationDelay: `${600 + idx * 50}ms`,
                                        }}
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-gradient transition-all">
                                                    {asteroid.name}
                                                </h3>
                                                <p className="text-white/50 text-xs">
                                                    {getSizeCategory(
                                                        maxDiameter
                                                    )}{' '}
                                                    Size
                                                </p>
                                            </div>
                                            <div className="text-2xl">☄️</div>
                                        </div>

                                        {/* Distance Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-white/70 text-sm">
                                                    Distance
                                                </span>
                                                <span className="text-white font-semibold">
                                                    {distance.toFixed(0)} km
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                                                    style={{
                                                        width: `${Math.min((distance / 100000000) * 100, 100)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex justify-between text-white/70">
                                                <span>Velocity:</span>
                                                <span className="text-white font-medium">
                                                    {velocity.toFixed(0)} km/h
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-white/70">
                                                <span>Size:</span>
                                                <span className="text-white font-medium">
                                                    {maxDiameter.toFixed(1)} m
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-white/70">
                                                <span>Approach Date:</span>
                                                <span className="text-white font-medium">
                                                    {
                                                        approach.close_approach_date
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {/* Hazard Badge */}
                                        <div className="pt-4 border-t border-white/10">
                                            {asteroid.is_potentially_hazardous_asteroid ? (
                                                <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                                                    <span className="text-lg">
                                                        ⚠️
                                                    </span>
                                                    <span>
                                                        Potentially Hazardous
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                                                    <span className="text-lg">
                                                        ✓
                                                    </span>
                                                    <span>No Hazard</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Link */}
                                        <a
                                            href={asteroid.nasa_jpl_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                                        >
                                            <span>NASA JPL</span>
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
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </section>

            {/* Asteroids List */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <h2
                        className="text-2xl font-bold text-white mb-6 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '300ms' }}
                    >
                        Detailed Asteroid List
                    </h2>
                    <AsteroidTable asteroids={allAsteroids} />
                </div>
            </section>
        </div>
    )
}
