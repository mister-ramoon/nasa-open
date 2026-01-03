'use client'

// Import necessary modules and types
import { useState, useMemo } from 'react'
import type { ProcessedSol } from '@/lib/types/insight.type'

// Define props interface
interface DataAvailability {
    available: boolean
    solCount: number
    oldestSol: string | null
    newestSol: string | null
}

interface InsightClientProps {
    sols: ProcessedSol[]
    availability: DataAvailability
}

// Convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit: number): number {
    return Math.round(((fahrenheit - 32) * 5) / 9)
}

// Get season icon
function getSeasonIcon(season: string): string {
    const seasonLower = season.toLowerCase()
    if (seasonLower.includes('spring')) return '🌸'
    if (seasonLower.includes('summer')) return '☀️'
    if (seasonLower.includes('fall') || seasonLower.includes('autumn'))
        return '🍂'
    if (seasonLower.includes('winter')) return '❄️'
    return '🔴'
}

// Get temperature color class
function getTempColorClass(tempC: number): string {
    if (tempC < -80) return 'text-blue-400'
    if (tempC < -60) return 'text-cyan-400'
    if (tempC < -40) return 'text-teal-400'
    if (tempC < -20) return 'text-yellow-400'
    return 'text-orange-400'
}

// Wind direction arrow
function WindArrow({ degrees }: { degrees: number }) {
    return (
        <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ transform: `rotate(${degrees}deg)` }}
        >
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-purple-400"
            >
                <path d="M12 2L4 14h6v8h4v-8h6L12 2z" />
            </svg>
        </div>
    )
}

// Temperature Bar Component
function TemperatureBar({
    min,
    max,
    avg,
}: {
    min: number
    max: number
    avg: number
}) {
    // Mars temperature range typically -100°C to 20°C
    const range = 120 // total range
    const offset = 100 // offset for negative values

    const minPos = ((min + offset) / range) * 100
    const maxPos = ((max + offset) / range) * 100
    const avgPos = ((avg + offset) / range) * 100

    return (
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            {/* Range bar */}
            <div
                className="absolute h-full bg-linear-to-r from-blue-500 via-cyan-400 to-orange-500 rounded-full"
                style={{
                    left: `${Math.max(0, minPos)}%`,
                    width: `${Math.min(100, maxPos - minPos)}%`,
                }}
            />
            {/* Average marker */}
            <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-white rounded-full shadow-lg"
                style={{ left: `${avgPos}%` }}
            />
        </div>
    )
}

// Sol Card Component
function SolCard({ sol, index }: { sol: ProcessedSol; index: number }) {
    const [expanded, setExpanded] = useState(false)

    const tempMin = sol.temperature
        ? fahrenheitToCelsius(sol.temperature.min)
        : null
    const tempMax = sol.temperature
        ? fahrenheitToCelsius(sol.temperature.max)
        : null
    const tempAvg = sol.temperature
        ? fahrenheitToCelsius(sol.temperature.average)
        : null

    return (
        <div
            className="glass-card p-5 animate-fade-in-up opacity-0 cursor-pointer group hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: `${(index % 9) * 50}ms` }}
            onClick={() => setExpanded(!expanded)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="text-3xl font-black text-white group-hover:text-orange-300 transition-colors">
                        Sol {sol.sol}
                    </h4>
                    <p className="text-sm text-white/60">{sol.earthDate}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">
                        {getSeasonIcon(sol.season)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-orange-500 to-red-500 text-white">
                        {sol.season}
                    </span>
                </div>
            </div>

            {/* Temperature */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                        🌡️ Temperature
                    </span>
                    {tempAvg !== null && (
                        <span
                            className={`font-bold text-lg ${getTempColorClass(tempAvg)}`}
                        >
                            {tempAvg}°C
                        </span>
                    )}
                </div>
                {sol.temperature ? (
                    <>
                        <TemperatureBar
                            min={tempMin!}
                            max={tempMax!}
                            avg={tempAvg!}
                        />
                        <div className="flex justify-between mt-1 text-xs text-white/50">
                            <span>{tempMin}°C</span>
                            <span>{tempMax}°C</span>
                        </div>
                    </>
                ) : (
                    <div className="h-3 bg-white/5 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white/30">No data</span>
                    </div>
                )}
            </div>

            {/* Pressure */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                        📊 Pressure
                    </span>
                    {sol.pressure && (
                        <span className="font-bold text-green-400">
                            {sol.pressure.average} Pa
                        </span>
                    )}
                </div>
                {sol.pressure ? (
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-xs text-white/50">Low</p>
                            <p className="font-semibold text-white">
                                {sol.pressure.min}
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 text-center">
                            <p className="text-xs text-white/50">Avg</p>
                            <p className="font-semibold text-green-400">
                                {sol.pressure.average}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-xs text-white/50">High</p>
                            <p className="font-semibold text-white">
                                {sol.pressure.max}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="h-12 bg-white/5 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-white/30">No data</span>
                    </div>
                )}
            </div>

            {/* Wind */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-sm flex items-center gap-2">
                        💨 Wind
                    </span>
                    {sol.windSpeed && (
                        <span className="font-bold text-purple-400">
                            {sol.windSpeed.average} m/s
                        </span>
                    )}
                </div>
                {sol.windSpeed ? (
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div>
                            <p className="text-xs text-white/50">Speed Range</p>
                            <p className="font-semibold text-white">
                                {sol.windSpeed.min} - {sol.windSpeed.max} m/s
                            </p>
                        </div>
                        {sol.windDirection && (
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className="text-xs text-white/50">
                                        Direction
                                    </p>
                                    <p className="font-semibold text-purple-400">
                                        {sol.windDirection.mostCommon}
                                    </p>
                                </div>
                                <WindArrow
                                    degrees={sol.windDirection.degrees}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-12 bg-white/5 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-white/30">No data</span>
                    </div>
                )}
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in-up">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/50 text-xs">
                                Northern Season
                            </p>
                            <p className="text-white font-semibold">
                                {sol.northernSeason}
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-white/50 text-xs">
                                Southern Season
                            </p>
                            <p className="text-white font-semibold">
                                {sol.southernSeason}
                            </p>
                        </div>
                    </div>
                    <p className="text-xs text-white/40 mt-3">
                        Last updated: {sol.lastUpdated}
                    </p>
                </div>
            )}

            {/* Expand indicator */}
            <div className="flex justify-center mt-3">
                <span
                    className={`text-white/30 text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}
                >
                    ▼
                </span>
            </div>
        </div>
    )
}

export default function InsightClient({
    sols,
    availability,
}: InsightClientProps) {
    // State for sorting
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

    // Sort sols
    const sortedSols = useMemo(() => {
        const sorted = [...sols]
        if (sortOrder === 'newest') {
            sorted.sort((a, b) => parseInt(b.sol) - parseInt(a.sol))
        } else {
            sorted.sort((a, b) => parseInt(a.sol) - parseInt(b.sol))
        }
        return sorted
    }, [sols, sortOrder])

    // Calculate averages
    const averages = useMemo(() => {
        const withTemp = sols.filter((s) => s.temperature)
        const withPressure = sols.filter((s) => s.pressure)
        const withWind = sols.filter((s) => s.windSpeed)

        return {
            temp:
                withTemp.length > 0
                    ? Math.round(
                          withTemp.reduce(
                              (sum, s) =>
                                  sum +
                                  fahrenheitToCelsius(s.temperature!.average),
                              0
                          ) / withTemp.length
                      )
                    : null,
            pressure:
                withPressure.length > 0
                    ? Math.round(
                          withPressure.reduce(
                              (sum, s) => sum + s.pressure!.average,
                              0
                          ) / withPressure.length
                      )
                    : null,
            wind:
                withWind.length > 0
                    ? Math.round(
                          (withWind.reduce(
                              (sum, s) => sum + s.windSpeed!.average,
                              0
                          ) /
                              withWind.length) *
                              10
                      ) / 10
                    : null,
        }
    }, [sols])

    const hasSols = sols.length > 0

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <header className="relative px-6 pt-8 pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-fade-in-up space-y-4 mb-8">
                        <h1 className="title-section text-white">
                            <span className="text-gradient">Mars Weather</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Real weather data from the surface of Mars,
                            collected by NASA&apos;s InSight lander at Elysium
                            Planitia.
                        </p>
                        <p className="text-sm text-white/50 mt-4 animate-fade-in-up opacity-0 stagger-3">
                            Elysium Planitia (4.5°N, 135.9°E)
                        </p>
                    </div>
                </div>
            </header>

            {/* Mission Notice */}
            <section className="px-4 -mt-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-4 border-l-4 border-amber-500 animate-fade-in-up opacity-0">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="font-semibold text-amber-400">
                                    Mission Status
                                </p>
                                <p className="text-white/70 text-sm">
                                    The InSight mission ended in December 2022.
                                    Historical weather data may still be
                                    available, but no new measurements are being
                                    collected.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 text-center">
                            <div className="text-4xl mb-2">📅</div>
                            <p className="text-3xl font-black text-gradient">
                                {availability.solCount}
                            </p>
                            <p className="text-white/60 text-sm">
                                Sols Recorded
                            </p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-1 text-center">
                            <div className="text-4xl mb-2">🌡️</div>
                            <p
                                className={`text-3xl font-black ${averages.temp !== null ? getTempColorClass(averages.temp) : 'text-white/30'}`}
                            >
                                {averages.temp !== null
                                    ? `${averages.temp}°C`
                                    : '—'}
                            </p>
                            <p className="text-white/60 text-sm">
                                Avg Temperature
                            </p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-2 text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <p className="text-3xl font-black text-green-400">
                                {averages.pressure !== null
                                    ? averages.pressure
                                    : '—'}
                            </p>
                            <p className="text-white/60 text-sm">
                                Avg Pressure (Pa)
                            </p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-3 text-center">
                            <div className="text-4xl mb-2">💨</div>
                            <p className="text-3xl font-black text-purple-400">
                                {averages.wind !== null
                                    ? `${averages.wind}`
                                    : '—'}
                            </p>
                            <p className="text-white/60 text-sm">
                                Avg Wind (m/s)
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Status */}
            <section className="px-4 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-6 animate-fade-in-up opacity-0">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-2xl">📡</span>
                            Data Status
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs mb-1">
                                    Status
                                </p>
                                <p
                                    className={`font-bold ${availability.available ? 'text-green-400' : 'text-red-400'}`}
                                >
                                    {availability.available
                                        ? '🟢 Available'
                                        : '🔴 Unavailable'}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-white/50 text-xs mb-1">
                                    Sols Available
                                </p>
                                <p className="font-bold text-white">
                                    {availability.solCount}
                                </p>
                            </div>
                            {availability.oldestSol && (
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-white/50 text-xs mb-1">
                                        Oldest Sol
                                    </p>
                                    <p className="font-bold text-white">
                                        Sol {availability.oldestSol}
                                    </p>
                                </div>
                            )}
                            {availability.newestSol && (
                                <div className="bg-white/5 rounded-lg p-3">
                                    <p className="text-white/50 text-xs mb-1">
                                        Newest Sol
                                    </p>
                                    <p className="font-bold text-white">
                                        Sol {availability.newestSol}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="px-4 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-8 animate-fade-in-up opacity-0">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">ℹ️</span>
                            About the Data
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                                    <span className="text-2xl">📅</span>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Sol (Martian Day)
                                        </p>
                                        <p className="text-sm text-white/60">
                                            A Martian day, approximately 24
                                            hours and 39 minutes long.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                                    <span className="text-2xl">🌡️</span>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Temperature
                                        </p>
                                        <p className="text-sm text-white/60">
                                            Measured in Fahrenheit by the
                                            sensor, displayed in Celsius. Mars
                                            is extremely cold!
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                                    <span className="text-2xl">📊</span>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Pressure
                                        </p>
                                        <p className="text-sm text-white/60">
                                            Measured in Pascals. Mars
                                            atmospheric pressure is about 1% of
                                            Earth&apos;s.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                                    <span className="text-2xl">💨</span>
                                    <div>
                                        <p className="font-semibold text-white">
                                            Wind
                                        </p>
                                        <p className="text-sm text-white/60">
                                            Horizontal wind speed in meters per
                                            second and prevailing direction.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Weather Data */}
            {hasSols ? (
                <section className="px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Controls */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="text-3xl">🌤️</span>
                                Weather by Sol ({sols.length} days)
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSortOrder('newest')}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                        sortOrder === 'newest'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    Newest First
                                </button>
                                <button
                                    onClick={() => setSortOrder('oldest')}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                        sortOrder === 'oldest'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    Oldest First
                                </button>
                            </div>
                        </div>

                        {/* Sol Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedSols.map((sol, index) => (
                                <SolCard
                                    key={sol.sol}
                                    sol={sol}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                <section className="px-4 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-card p-12 text-center animate-fade-in-up opacity-0">
                            <div className="text-6xl mb-4">🔴</div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                No Weather Data Available
                            </h3>
                            <p className="text-white/60 mb-4">
                                The InSight mission ended in December 2022.
                                Historical data may still be available.
                            </p>
                            <a
                                href="https://mars.nasa.gov/insight/weather/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button inline-flex items-center gap-2"
                            >
                                View Mars Weather on NASA.gov →
                            </a>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
