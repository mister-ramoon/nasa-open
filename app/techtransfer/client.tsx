'use client'

// Import necessary modules and types
import { useState } from 'react'
import type { Patent, Software, Spinoff } from '@/lib/types/techtransfer.type'

// Props interface
interface TechtransferClientProps {
    patents: Patent[]
    software: Software[]
    spinoffs: Spinoff[]
    nasaCenters: Record<string, { name: string; location: string }>
    techCategories: Record<string, string>
    softwareReleaseTypes: Record<string, string>
    exampleSearches: readonly string[]
}

// Type colors config for Liquid Glass
const TYPE_CONFIG = {
    patent: {
        gradient: 'from-blue-500/20 to-blue-700/20',
        text: 'text-blue-400',
        bg: 'bg-blue-500/20',
        icon: '📜',
        border: 'border-blue-500/30',
    },
    patent_issued: {
        gradient: 'from-indigo-500/20 to-indigo-700/20',
        text: 'text-indigo-400',
        bg: 'bg-indigo-500/20',
        icon: '✅',
        border: 'border-indigo-500/30',
    },
    software: {
        gradient: 'from-green-500/20 to-green-700/20',
        text: 'text-green-400',
        bg: 'bg-green-500/20',
        icon: '💻',
        border: 'border-green-500/30',
    },
    spinoff: {
        gradient: 'from-orange-500/20 to-orange-700/20',
        text: 'text-orange-400',
        bg: 'bg-orange-500/20',
        icon: '🚀',
        border: 'border-orange-500/30',
    },
}

// Center icons
const CENTER_ICONS: Record<string, string> = {
    ARC: '🔬',
    AFRC: '✈️',
    GRC: '⚡',
    GSFC: '🛰️',
    JPL: '🪐',
    JSC: '👨‍🚀',
    KSC: '🚀',
    LaRC: '🛫',
    MSFC: '🔧',
    SSC: '🔥',
}

// Helper functions
function truncateDescription(
    description: string,
    maxLength: number = 150
): string {
    if (!description) return ''
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).trim() + '...'
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
                    <p className="text-white/70 text-sm">{label}</p>
                </div>
                <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform">
                    {icon}
                </span>
            </div>
        </div>
    )
}

// Patent Card Component
function PatentCard({ patent, index }: { patent: Patent; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div
            className="glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 60}ms` }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-400 rounded-t-2xl" />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <span
                        className={`px-3 py-1 ${TYPE_CONFIG.patent.bg} ${TYPE_CONFIG.patent.text} text-xs rounded-full flex items-center gap-1`}
                    >
                        <span>{TYPE_CONFIG.patent.icon}</span>
                        Patent
                    </span>
                    {patent.center && (
                        <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                            {patent.center}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-white line-clamp-2 mb-2 group-hover:text-gradient transition-all">
                    {patent.title}
                </h4>

                {/* Patent Number */}
                {patent.patent_number && (
                    <p className="text-xs text-cyan-400 font-mono mb-2">
                        #{patent.patent_number}
                    </p>
                )}

                {/* Description */}
                {patent.description && (
                    <p className="text-sm text-white/60 mb-3 line-clamp-3">
                        {truncateDescription(patent.description)}
                    </p>
                )}

                {/* Category */}
                {patent.category && (
                    <span className="inline-block px-2 py-1 bg-white/5 text-white/60 text-xs rounded-lg">
                        {patent.category}
                    </span>
                )}

                {/* Expanded details */}
                {isExpanded && patent.serial_number && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in-up">
                        <p className="text-sm text-white/50">
                            <span className="text-white/30">Serial:</span>{' '}
                            {patent.serial_number}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Software Card Component
function SoftwareCard({ sw, index }: { sw: Software; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div
            className="glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 60}ms` }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 to-emerald-400 rounded-t-2xl" />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <span
                        className={`px-3 py-1 ${TYPE_CONFIG.software.bg} ${TYPE_CONFIG.software.text} text-xs rounded-full flex items-center gap-1`}
                    >
                        <span>{TYPE_CONFIG.software.icon}</span>
                        Software
                    </span>
                    {sw.release_type && (
                        <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                            {sw.release_type}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-white line-clamp-2 mb-2 group-hover:text-gradient transition-all">
                    {sw.title}
                </h4>

                {/* Center */}
                {sw.center && (
                    <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                        <span>🏛️</span>
                        {sw.center}
                    </p>
                )}

                {/* Description */}
                {sw.description && (
                    <p className="text-sm text-white/60 mb-3 line-clamp-3">
                        {truncateDescription(sw.description)}
                    </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {sw.category && (
                        <span className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-lg">
                            {sw.category}
                        </span>
                    )}
                    {sw.software_class && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
                            {sw.software_class}
                        </span>
                    )}
                </div>

                {/* External URL */}
                {sw.external_url && (
                    <a
                        href={sw.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button text-sm py-2 w-full text-center mt-3 group-hover:bg-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View Details
                        <span className="ml-2 transition-transform group-hover:translate-x-1 inline-block">
                            →
                        </span>
                    </a>
                )}
            </div>
        </div>
    )
}

// Spinoff Card Component
function SpinoffCard({ spinoff, index }: { spinoff: Spinoff; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div
            className="glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 60}ms` }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-amber-400 rounded-t-2xl" />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <span
                        className={`px-3 py-1 ${TYPE_CONFIG.spinoff.bg} ${TYPE_CONFIG.spinoff.text} text-xs rounded-full flex items-center gap-1`}
                    >
                        <span>{TYPE_CONFIG.spinoff.icon}</span>
                        Spinoff
                    </span>
                    {spinoff.year && (
                        <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded font-mono">
                            {spinoff.year}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-white line-clamp-2 mb-2 group-hover:text-gradient transition-all">
                    {spinoff.title}
                </h4>

                {/* Company & Location */}
                {spinoff.company && (
                    <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                        <span>🏢</span>
                        {spinoff.company}
                        {spinoff.city && spinoff.state && (
                            <span className="text-white/30">
                                {' '}
                                • {spinoff.city}, {spinoff.state}
                            </span>
                        )}
                    </p>
                )}

                {/* Description */}
                {spinoff.description && (
                    <p className="text-sm text-white/60 mb-3 line-clamp-3">
                        {truncateDescription(spinoff.description)}
                    </p>
                )}

                {/* Category */}
                {spinoff.category && (
                    <span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-lg">
                        {spinoff.category}
                    </span>
                )}
            </div>
        </div>
    )
}

// NASA Center Card
function CenterCard({
    code,
    info,
    index,
}: {
    code: string
    info: { name: string; location: string }
    index: number
}) {
    const icon = CENTER_ICONS[code] || '🏛️'

    return (
        <div
            className="glass-card group hover:scale-105 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{icon}</span>
                    <span className="text-lg font-bold text-blue-400">
                        {code}
                    </span>
                </div>
                <p className="text-sm text-white/80">{info.name}</p>
                <p className="text-xs text-white/50 flex items-center gap-1 mt-1">
                    <span>📍</span>
                    {info.location}
                </p>
            </div>
        </div>
    )
}

// Category Card
function CategoryCard({ name, index }: { name: string; index: number }) {
    return (
        <div
            className="glass-card p-3 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <p className="text-sm text-white/70">{name}</p>
        </div>
    )
}

// Search Tag
function SearchTag({ term }: { term: string }) {
    return (
        <span className="px-4 py-2 glass-card text-white/60 hover:text-white rounded-full text-sm transition-all hover:scale-105">
            🔍 {term}
        </span>
    )
}

// Main Client Component
export default function TechtransferClient({
    patents,
    software,
    spinoffs,
    nasaCenters,
    techCategories,
    softwareReleaseTypes,
    exampleSearches,
}: TechtransferClientProps) {
    const [activeTab, setActiveTab] = useState<
        'patents' | 'software' | 'spinoffs' | 'centers'
    >('patents')

    const hasPatents = patents.length > 0
    const hasSoftware = software.length > 0
    const hasSpinoffs = spinoffs.length > 0

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-8 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: '1s' }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-500/5 rounded-full blur-3xl" />

                    {/* Floating elements */}
                    <div
                        className="absolute top-1/4 right-1/4 animate-bounce"
                        style={{ animationDuration: '4s' }}
                    >
                        <span className="text-4xl opacity-20">💡</span>
                    </div>
                    <div
                        className="absolute bottom-1/3 left-1/4 animate-bounce"
                        style={{
                            animationDuration: '5s',
                            animationDelay: '1s',
                        }}
                    >
                        <span className="text-3xl opacity-20">🔧</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative">
                    <header className="relative pb-4">
                        <div className="mx-auto">
                            <div className="animate-fade-in-up space-y-4 mb-8">
                                <h1 className="title-section text-white">
                                    <span className="text-gradient">
                                        Innovation & Technology
                                    </span>
                                </h1>
                                <p className="text-white/60 text-lg max-w-2xl">
                                    Explore NASA&apos;s patents, software, and
                                    spinoff technologies available for public
                                    use and commercial licensing.
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
                            value={patents.length}
                            label="Sample Patents"
                            icon="📜"
                            gradient="from-blue-600/20 to-blue-800/20"
                        />
                        <StatsCard
                            value="🔎"
                            label="Issued Patents"
                            icon="✅"
                            gradient="from-indigo-600/20 to-indigo-800/20"
                        />
                        <StatsCard
                            value={software.length}
                            label="Sample Software"
                            icon="💻"
                            gradient="from-green-600/20 to-green-800/20"
                        />
                        <StatsCard
                            value={spinoffs.length}
                            label="Sample Spinoffs"
                            icon="🚀"
                            gradient="from-orange-600/20 to-orange-800/20"
                        />
                    </div>

                    {/* Tab Navigation */}
                    <div
                        className="glass-card p-2 animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTab('patents')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                    activeTab === 'patents'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>📜</span>
                                Patents
                                {hasPatents && (
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {patents.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('software')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                    activeTab === 'software'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>💻</span>
                                Software
                                {hasSoftware && (
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {software.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('spinoffs')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                    activeTab === 'spinoffs'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>🚀</span>
                                Spinoffs
                                {hasSpinoffs && (
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {spinoffs.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('centers')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                    activeTab === 'centers'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>🏛️</span>
                                NASA Centers
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-4">
                {/* Patents Tab */}
                {activeTab === 'patents' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="text-3xl">📜</span>
                            Patents
                        </h2>
                        <p className="text-white/50 text-sm mb-6">
                            Sample results for &quot;technology&quot;
                        </p>

                        {hasPatents ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {patents.map((patent, index) => (
                                    <PatentCard
                                        key={patent.id || index}
                                        patent={patent}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">📜</span>
                                <p className="text-white/60">
                                    No patent data available
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Software Tab */}
                {activeTab === 'software' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="text-3xl">💻</span>
                            Software
                        </h2>
                        <p className="text-white/50 text-sm mb-6">
                            Sample results for &quot;analysis&quot;
                        </p>

                        {hasSoftware ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {software.map((sw, index) => (
                                    <SoftwareCard
                                        key={sw.id || index}
                                        sw={sw}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">💻</span>
                                <p className="text-white/60">
                                    No software data available
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Spinoffs Tab */}
                {activeTab === 'spinoffs' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="text-3xl">🚀</span>
                            Spinoffs
                        </h2>
                        <p className="text-white/50 text-sm mb-6">
                            Sample results for &quot;space&quot;
                        </p>

                        {hasSpinoffs ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {spinoffs.map((spinoff, index) => (
                                    <SpinoffCard
                                        key={spinoff.id || index}
                                        spinoff={spinoff}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🚀</span>
                                <p className="text-white/60">
                                    No spinoff data available
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* NASA Centers Tab */}
                {activeTab === 'centers' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🏛️</span>
                            NASA Centers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {Object.entries(nasaCenters).map(
                                ([code, info], index) => (
                                    <CenterCard
                                        key={code}
                                        code={code}
                                        info={info}
                                        index={index}
                                    />
                                )
                            )}
                        </div>
                    </>
                )}
            </section>

            {/* Technology Categories Section */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🏷️</span>
                    Technology Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(techCategories).map(
                        ([key, name], index) => (
                            <CategoryCard key={key} name={name} index={index} />
                        )
                    )}
                </div>
            </section>

            {/* Software Release Types */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">📦</span>
                    Software Release Types
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(softwareReleaseTypes).map(
                        ([key, name], index) => (
                            <div
                                key={key}
                                className="glass-card bg-linear-to-br from-green-500/10 to-emerald-500/10 p-4 text-center animate-fade-in-up"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <span className="text-2xl mb-2 block">📋</span>
                                <p className="text-sm font-medium text-green-400">
                                    {name}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* Example Search Terms */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🔍</span>
                    Example Search Terms
                </h2>
                <div className="flex flex-wrap gap-3">
                    {exampleSearches.map((term) => (
                        <SearchTag key={term} term={term} />
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
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /techtransfer/patent/?&#123;query&#125;
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    Search patents
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /techtransfer/patent_issued/?&#123;query&#125;
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    Search issued patents
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /techtransfer/software/?&#123;query&#125;
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    Search software
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /techtransfer/spinoff/?&#123;query&#125;
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    Search spinoffs
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
                                {`# Search patents for "engine"
curl "https://api.nasa.gov/techtransfer/patent/\\
?engine&api_key=DEMO_KEY"

# Search issued patents for "solar"
curl "https://api.nasa.gov/techtransfer/\\
patent_issued/?solar&api_key=DEMO_KEY"

# Search software for "analysis"
curl "https://api.nasa.gov/techtransfer/software/\\
?analysis&api_key=DEMO_KEY"

# Search spinoffs for "medical"
curl "https://api.nasa.gov/techtransfer/spinoff/\\
?medical&api_key=DEMO_KEY"`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <div className="glass-card-glow p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Explore NASA Technology Transfer
                    </h2>
                    <p className="text-white/60 mb-6 max-w-xl mx-auto">
                        Discover cutting-edge innovations developed for space
                        exploration, now available for public and commercial
                        use.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://technology.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            💡 Technology Transfer Portal
                        </a>
                        <a
                            href="https://software.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-green-500/20 hover:bg-green-500/30"
                        >
                            💻 Software Catalog
                        </a>
                        <a
                            href="https://spinoff.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-orange-500/20 hover:bg-orange-500/30"
                        >
                            🚀 Spinoff Program
                        </a>
                        <a
                            href="https://api.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3"
                        >
                            📚 NASA API Portal
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
