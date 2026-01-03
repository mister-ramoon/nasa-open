'use client'

import { useState } from 'react'
import type { CMEEvent, FLREvent, GSTEvent } from '@/lib/types/donki.type'

// Tab type
type TabType = 'overview' | 'cme' | 'flr' | 'gst'

// Flare class severity
function getFlareClass(classType: string): {
    color: string
    label: string
    severity: number
} {
    if (classType.startsWith('X')) {
        return {
            color: 'from-red-600 to-red-400',
            label: 'Extreme',
            severity: 5,
        }
    }
    if (classType.startsWith('M')) {
        return {
            color: 'from-orange-600 to-orange-400',
            label: 'Strong',
            severity: 4,
        }
    }
    if (classType.startsWith('C')) {
        return {
            color: 'from-yellow-600 to-yellow-400',
            label: 'Moderate',
            severity: 3,
        }
    }
    if (classType.startsWith('B')) {
        return {
            color: 'from-blue-600 to-blue-400',
            label: 'Minor',
            severity: 2,
        }
    }
    return {
        color: 'from-green-600 to-green-400',
        label: 'Minimal',
        severity: 1,
    }
}

// Kp index severity
function getKpSeverity(kp: number): { color: string; label: string } {
    if (kp >= 8)
        return { color: 'from-red-600 to-red-400', label: 'Extreme (G5)' }
    if (kp >= 7)
        return { color: 'from-red-500 to-orange-400', label: 'Severe (G4)' }
    if (kp >= 6)
        return { color: 'from-orange-500 to-yellow-400', label: 'Strong (G3)' }
    if (kp >= 5)
        return {
            color: 'from-yellow-500 to-yellow-400',
            label: 'Moderate (G2)',
        }
    if (kp >= 4)
        return { color: 'from-yellow-400 to-green-400', label: 'Minor (G1)' }
    return { color: 'from-green-500 to-green-400', label: 'Quiet' }
}

// Stats Card Component
interface StatsCardProps {
    label: string
    value: string | number
    icon: string
    subtext?: string
    gradient?: string
    delay?: number
}

// Stats Card Component
function StatsCard({
    label,
    value,
    icon,
    subtext,
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
                    {subtext && (
                        <p className="text-white/50 text-xs mt-1">{subtext}</p>
                    )}
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

// Activity Level Indicator
function ActivityIndicator({ level, label }: { level: number; label: string }) {
    const bars = 5
    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                {Array.from({ length: bars }).map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-6 rounded-full transition-all duration-300 ${
                            i < level
                                ? level >= 4
                                    ? 'bg-red-500'
                                    : level >= 3
                                      ? 'bg-orange-500'
                                      : level >= 2
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                : 'bg-white/10'
                        }`}
                        style={{ height: `${12 + i * 4}px` }}
                    />
                ))}
            </div>
            <span className="text-sm text-white/70">{label}</span>
        </div>
    )
}

// CME Card Component
function CMECard({ event, index }: { event: CMEEvent; index: number }) {
    return (
        <div
            className="glass-card glass-card-glow p-6 opacity-0 animate-fade-in-up group"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-white mb-1 group-hover:text-gradient transition-all">
                        CME Event
                    </h3>
                    <p className="text-white/50 text-xs font-mono">
                        {event.activityID}
                    </p>
                </div>
                <div className="text-3xl">💥</div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/70">
                    <span>Start Time:</span>
                    <span className="text-white font-medium">
                        {new Date(event.startTime).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex justify-between text-white/70">
                    <span>Time:</span>
                    <span className="text-white font-medium">
                        {new Date(event.startTime).toLocaleTimeString()}
                    </span>
                </div>
                <div className="flex justify-between text-white/70">
                    <span>Source Location:</span>
                    <span className="text-white font-medium">
                        {event.sourceLocation || 'Unknown'}
                    </span>
                </div>
            </div>

            {event.note && (
                <p className="mt-4 text-xs text-white/50 line-clamp-2 border-t border-white/10 pt-4">
                    {event.note}
                </p>
            )}

            <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
                <span>View Details</span>
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
}

// FLR Card Component
function FLRCard({ event, index }: { event: FLREvent; index: number }) {
    const flareInfo = getFlareClass(event.classType)

    return (
        <div
            className="glass-card glass-card-glow p-6 opacity-0 animate-fade-in-up group"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-white group-hover:text-gradient transition-all">
                            Solar Flare
                        </h3>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold bg-linear-to-r ${flareInfo.color} text-white`}
                        >
                            {event.classType}
                        </span>
                    </div>
                    <p className="text-white/50 text-xs">
                        {flareInfo.label} intensity
                    </p>
                </div>
                <div className="text-3xl">☀️</div>
            </div>

            {/* Severity Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Intensity</span>
                    <span>{flareInfo.label}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-linear-to-r ${flareInfo.color} transition-all duration-500`}
                        style={{ width: `${flareInfo.severity * 20}%` }}
                    />
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                    <span>Begin:</span>
                    <span className="text-white font-medium">
                        {new Date(event.beginTime).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between text-white/70">
                    <span>Peak:</span>
                    <span className="text-white font-medium">
                        {new Date(event.peakTime).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between text-white/70">
                    <span>Source:</span>
                    <span className="text-white font-medium">
                        {event.sourceLocation}
                    </span>
                </div>
            </div>

            <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
                <span>View Details</span>
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
}

// GST Card Component
function GSTCard({ event, index }: { event: GSTEvent; index: number }) {
    const maxKp =
        event.allKpIndex && event.allKpIndex.length > 0
            ? Math.max(...event.allKpIndex.map((k) => k.kpIndex))
            : 0
    const kpInfo = getKpSeverity(maxKp)

    return (
        <div
            className="glass-card glass-card-glow p-6 opacity-0 animate-fade-in-up group"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-white group-hover:text-gradient transition-all">
                            Geomagnetic Storm
                        </h3>
                    </div>
                    <p className="text-white/50 text-xs font-mono">
                        {event.gstID}
                    </p>
                </div>
                <div className="text-3xl">🌍</div>
            </div>

            {/* Kp Index */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Kp Index</span>
                    <span>{kpInfo.label}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-linear-to-r ${kpInfo.color} transition-all duration-500`}
                        style={{ width: `${(maxKp / 9) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-2xl font-bold text-gradient">
                        {maxKp}
                    </span>
                    <span className="text-xs text-white/50">Max recorded</span>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white/70">
                    <span>Start Time:</span>
                    <span className="text-white font-medium">
                        {new Date(event.startTime).toLocaleString()}
                    </span>
                </div>
            </div>

            <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            >
                <span>View Details</span>
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
}

// Tab Button Component
function TabButton({
    active,
    onClick,
    icon,
    label,
    count,
}: {
    active: boolean
    onClick: () => void
    icon: string
    label: string
    count?: number
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                active
                    ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
        >
            <span className="text-lg">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
            {count !== undefined && (
                <span
                    className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-white/10'}`}
                >
                    {count}
                </span>
            )}
        </button>
    )
}

// Main Client Component
interface DonkiClientProps {
    cmeEvents: CMEEvent[]
    flrEvents: FLREvent[]
    gstEvents: GSTEvent[]
    startDate: string
    endDate: string
}

export default function DonkiClient({
    cmeEvents,
    flrEvents,
    gstEvents,
    startDate,
    endDate,
}: DonkiClientProps) {
    const [activeTab, setActiveTab] = useState<TabType>('overview')

    // Calculate statistics
    const totalEvents = cmeEvents.length + flrEvents.length + gstEvents.length
    const xClassFlares = flrEvents.filter((f) =>
        f.classType.startsWith('X')
    ).length

    // M-Class flares count
    const mClassFlares = flrEvents.filter((f) =>
        f.classType.startsWith('M')
    ).length
    const maxKp =
        gstEvents.length > 0
            ? Math.max(
                  ...gstEvents.flatMap(
                      (g) => g.allKpIndex?.map((k) => k.kpIndex) || [0]
                  )
              )
            : 0

    // Calculate activity level (1-5)
    const activityLevel = Math.min(
        5,
        Math.ceil((xClassFlares * 2 + mClassFlares + gstEvents.length) / 3)
    )

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <header className="relative px-6 pt-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-fade-in-up space-y-4 mb-8">
                        <h1 className="title-section text-white">
                            <span className="text-gradient">DONKI</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Database Of Notifications, Knowledge, Information —
                            Real-time space weather monitoring
                        </p>
                        <p className="text-white/50 text-sm">
                            Data from {startDate} to {endDate}
                        </p>
                    </div>

                    {/* Current Activity Status */}
                    <div
                        className="glass-card p-6 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '100ms' }}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-white mb-2">
                                    Current Solar Activity
                                </h2>
                                <ActivityIndicator
                                    level={activityLevel}
                                    label={
                                        activityLevel >= 4
                                            ? 'High'
                                            : activityLevel >= 2
                                              ? 'Moderate'
                                              : 'Low'
                                    }
                                />
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gradient">
                                        {totalEvents}
                                    </div>
                                    <div className="text-xs text-white/50">
                                        Total Events
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-400">
                                        {xClassFlares}
                                    </div>
                                    <div className="text-xs text-white/50">
                                        X-Class Flares
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-400">
                                        {mClassFlares}
                                    </div>
                                    <div className="text-xs text-white/50">
                                        M-Class Flares
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-400">
                                        Kp {maxKp}
                                    </div>
                                    <div className="text-xs text-white/50">
                                        Max Kp Index
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            label="Coronal Mass Ejections"
                            value={cmeEvents.length}
                            icon="💥"
                            subtext="Last 30 days"
                            gradient="from-purple-500 to-pink-500"
                            delay={200}
                        />
                        <StatsCard
                            label="Solar Flares"
                            value={flrEvents.length}
                            icon="☀️"
                            subtext={`${xClassFlares} X-class, ${mClassFlares} M-class`}
                            gradient="from-orange-500 to-red-500"
                            delay={300}
                        />
                        <StatsCard
                            label="Geomagnetic Storms"
                            value={gstEvents.length}
                            icon="🌍"
                            subtext={
                                gstEvents.length > 0
                                    ? `Max Kp: ${maxKp}`
                                    : 'None recorded'
                            }
                            gradient="from-blue-500 to-cyan-500"
                            delay={400}
                        />
                        <StatsCard
                            label="Activity Level"
                            value={
                                activityLevel >= 4
                                    ? 'High'
                                    : activityLevel >= 2
                                      ? 'Moderate'
                                      : 'Low'
                            }
                            icon="📊"
                            subtext="Based on recent events"
                            gradient="from-green-500 to-emerald-500"
                            delay={500}
                        />
                    </div>
                </div>
            </section>

            {/* Info Section */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="glass-card p-8 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '700ms' }}
                    >
                        <h2 className="text-xl font-bold text-white mb-4">
                            Understanding Space Weather
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <div className="text-2xl mb-2">💥</div>
                                <h3 className="font-semibold text-white mb-2">
                                    Coronal Mass Ejections
                                </h3>
                                <p className="text-white/60">
                                    Large expulsions of plasma and magnetic
                                    field from the Sun&apos;s corona. Can cause
                                    geomagnetic storms when directed at Earth.
                                </p>
                            </div>
                            <div>
                                <div className="text-2xl mb-2">☀️</div>
                                <h3 className="font-semibold text-white mb-2">
                                    Solar Flares
                                </h3>
                                <p className="text-white/60">
                                    Sudden eruptions of electromagnetic
                                    radiation from the Sun. Classified by
                                    intensity: A, B, C, M, X (weakest to
                                    strongest).
                                </p>
                            </div>
                            <div>
                                <div className="text-2xl mb-2">🌍</div>
                                <h3 className="font-semibold text-white mb-2">
                                    Geomagnetic Storms
                                </h3>
                                <p className="text-white/60">
                                    Disturbances in Earth&apos;s magnetosphere
                                    caused by solar wind. Measured by Kp index
                                    (0-9). Can affect satellites and power
                                    grids.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="px-6 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="flex flex-wrap gap-2 animate-fade-in-up opacity-0"
                        style={{ animationDelay: '600ms' }}
                    >
                        <TabButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon="📊"
                            label="Overview"
                        />
                        <TabButton
                            active={activeTab === 'cme'}
                            onClick={() => setActiveTab('cme')}
                            icon="💥"
                            label="CME"
                            count={cmeEvents.length}
                        />
                        <TabButton
                            active={activeTab === 'flr'}
                            onClick={() => setActiveTab('flr')}
                            icon="☀️"
                            label="Solar Flares"
                            count={flrEvents.length}
                        />
                        <TabButton
                            active={activeTab === 'gst'}
                            onClick={() => setActiveTab('gst')}
                            icon="🌍"
                            label="Geomagnetic"
                            count={gstEvents.length}
                        />
                    </div>
                </div>
            </section>

            {/* Content based on active tab */}
            <section className="px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-12">
                            {/* Recent CME Events */}
                            <div>
                                <h2
                                    className="text-2xl font-bold text-white mb-6 animate-fade-in-up opacity-0"
                                    style={{ animationDelay: '100ms' }}
                                >
                                    Recent Coronal Mass Ejections
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {cmeEvents.slice(0, 3).map((event, idx) => (
                                        <CMECard
                                            key={event.activityID}
                                            event={event}
                                            index={idx}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Recent Solar Flares */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Recent Solar Flares
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {flrEvents.slice(0, 3).map((event, idx) => (
                                        <FLRCard
                                            key={event.flrID}
                                            event={event}
                                            index={idx}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Recent Geomagnetic Storms */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Recent Geomagnetic Storms
                                </h2>
                                {gstEvents.length === 0 ? (
                                    <div className="glass-card p-8 text-center">
                                        <div className="text-4xl mb-4">🌍</div>
                                        <p className="text-white/60">
                                            No geomagnetic storms recorded in
                                            this period
                                        </p>
                                        <p className="text-white/40 text-sm mt-2">
                                            Earth&apos;s magnetic field is
                                            currently stable
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {gstEvents
                                            .slice(0, 3)
                                            .map((event, idx) => (
                                                <GSTCard
                                                    key={event.gstID}
                                                    event={event}
                                                    index={idx}
                                                />
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CME Tab */}
                    {activeTab === 'cme' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">
                                All Coronal Mass Ejections ({cmeEvents.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cmeEvents.map((event, idx) => (
                                    <CMECard
                                        key={event.activityID}
                                        event={event}
                                        index={idx}
                                    />
                                ))}
                            </div>
                            {cmeEvents.length === 0 && (
                                <div className="glass-card p-8 text-center">
                                    <div className="text-4xl mb-4">💥</div>
                                    <p className="text-white/60">
                                        No CME events recorded in this period
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FLR Tab */}
                    {activeTab === 'flr' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">
                                All Solar Flares ({flrEvents.length})
                            </h2>

                            {/* Flare Class Legend */}
                            <div className="glass-card p-4 mb-6 flex flex-wrap gap-4">
                                <span className="text-white/60 text-sm">
                                    Flare Classes:
                                </span>
                                {['X', 'M', 'C', 'B', 'A'].map((cls) => {
                                    const info = getFlareClass(cls)
                                    return (
                                        <span
                                            key={cls}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <span
                                                className={`w-3 h-3 rounded-full bg-linear-to-r ${info.color}`}
                                            ></span>
                                            <span className="text-white/70">
                                                {cls} - {info.label}
                                            </span>
                                        </span>
                                    )
                                })}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {flrEvents.map((event, idx) => (
                                    <FLRCard
                                        key={event.flrID}
                                        event={event}
                                        index={idx}
                                    />
                                ))}
                            </div>
                            {flrEvents.length === 0 && (
                                <div className="glass-card p-8 text-center">
                                    <div className="text-4xl mb-4">☀️</div>
                                    <p className="text-white/60">
                                        No solar flares recorded in this period
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* GST Tab */}
                    {activeTab === 'gst' && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">
                                All Geomagnetic Storms ({gstEvents.length})
                            </h2>

                            {/* Kp Index Legend */}
                            <div className="glass-card p-4 mb-6">
                                <div className="flex flex-wrap gap-4">
                                    <span className="text-white/60 text-sm">
                                        Kp Index Scale:
                                    </span>
                                    {[
                                        {
                                            kp: '0-3',
                                            label: 'Quiet',
                                            color: 'bg-green-500',
                                        },
                                        {
                                            kp: '4',
                                            label: 'G1 Minor',
                                            color: 'bg-yellow-400',
                                        },
                                        {
                                            kp: '5',
                                            label: 'G2 Moderate',
                                            color: 'bg-yellow-500',
                                        },
                                        {
                                            kp: '6',
                                            label: 'G3 Strong',
                                            color: 'bg-orange-500',
                                        },
                                        {
                                            kp: '7',
                                            label: 'G4 Severe',
                                            color: 'bg-red-500',
                                        },
                                        {
                                            kp: '8-9',
                                            label: 'G5 Extreme',
                                            color: 'bg-red-600',
                                        },
                                    ].map((item) => (
                                        <span
                                            key={item.kp}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <span
                                                className={`w-3 h-3 rounded-full ${item.color}`}
                                            ></span>
                                            <span className="text-white/70">
                                                {item.kp}: {item.label}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {gstEvents.length === 0 ? (
                                <div className="glass-card p-8 text-center">
                                    <div className="text-4xl mb-4">🌍</div>
                                    <p className="text-white/60">
                                        No geomagnetic storms recorded in this
                                        period
                                    </p>
                                    <p className="text-white/40 text-sm mt-2">
                                        Earth&apos;s magnetic field is currently
                                        stable
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {gstEvents.map((event, idx) => (
                                        <GSTCard
                                            key={event.gstID}
                                            event={event}
                                            index={idx}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
