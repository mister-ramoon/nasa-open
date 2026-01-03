'use client'

// Import necessary modules and types
import { useState, useMemo } from 'react'
import type { ProcessedStudy, Mission } from '@/lib/types/open.type'

// Props interface
interface OpenClientProps {
    featuredStudies: ProcessedStudy[]
    missions: Mission[]
    entityTypes: Record<string, string>
    dataSources: Record<string, string>
}

// Data source config with icons and colors
const DATA_SOURCE_CONFIG: Record<
    string,
    { icon: string; gradient: string; description: string }
> = {
    cgene: {
        icon: '🧬',
        gradient: 'from-blue-500 to-cyan-500',
        description: 'NASA Open Science Data Repository',
    },
    nih_geo_gse: {
        icon: '🔬',
        gradient: 'from-purple-500 to-pink-500',
        description: 'NIH Gene Expression Omnibus',
    },
    ebi_pride: {
        icon: '🧪',
        gradient: 'from-green-500 to-emerald-500',
        description: 'EBI Proteomics Identification Database',
    },
    mg_rast: {
        icon: '🦠',
        gradient: 'from-orange-500 to-amber-500',
        description: 'Metagenomics Rapid Annotation',
    },
}

// Entity type config
const ENTITY_CONFIG: Record<
    string,
    { icon: string; color: string; description: string }
> = {
    experiments: {
        icon: '🔬',
        color: 'text-blue-400',
        description: 'Scientific experiments conducted in space',
    },
    missions: {
        icon: '🚀',
        color: 'text-purple-400',
        description: 'Space missions and expeditions',
    },
    payloads: {
        icon: '📦',
        color: 'text-green-400',
        description: 'Payloads and cargo for experiments',
    },
    hardware: {
        icon: '⚙️',
        color: 'text-orange-400',
        description: 'Equipment and hardware used',
    },
    vehicles: {
        icon: '🛸',
        color: 'text-cyan-400',
        description: 'Spacecraft and transport vehicles',
    },
    subjects: {
        icon: '🐭',
        color: 'text-pink-400',
        description: 'Research subjects and organisms',
    },
    biospecimens: {
        icon: '🧫',
        color: 'text-amber-400',
        description: 'Biological specimens and samples',
    },
}

// Study Card Component
function StudyCard({ study, index }: { study: ProcessedStudy; index: number }) {
    const [isHovered, setIsHovered] = useState(false)

    // Determine color based on project type
    const getTypeColor = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'spaceflight':
                return 'from-blue-500/30 to-cyan-500/30'
            case 'ground':
                return 'from-green-500/30 to-emerald-500/30'
            case 'radiation':
                return 'from-purple-500/30 to-pink-500/30'
            default:
                return 'from-gray-500/30 to-slate-500/30'
        }
    }

    return (
        <div
            className={`glass-card group cursor-pointer transition-all duration-500 ${isHovered ? 'scale-[1.02]' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header gradient bar */}
            <div
                className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${getTypeColor(study.projectType)} rounded-t-2xl`}
            />

            {/* Content */}
            <div className="p-5">
                {/* ID and Type badges */}
                <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-mono border border-blue-500/30">
                        {study.id}
                    </span>
                    {study.projectType && (
                        <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                            {study.projectType}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-blue-300 transition-colors">
                    {study.title}
                </h4>

                {/* Organism */}
                {study.organism && (
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🧬</span>
                        <span className="text-sm text-white/60">
                            {study.organism}
                        </span>
                    </div>
                )}

                {/* Description */}
                {study.description && (
                    <p className="text-sm text-white/50 line-clamp-3 mb-4">
                        {study.description}
                    </p>
                )}

                {/* Flight Program badge */}
                {study.flightProgram && (
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                            <span>🚀</span>
                            {study.flightProgram}
                        </span>
                    </div>
                )}

                {/* View Study Link */}
                <a
                    href={`https://osdr.nasa.gov/bio/repo/data/studies/${study.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button text-sm py-2 w-full text-center group-hover:bg-white/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    View Study
                    <span className="ml-2 transition-transform group-hover:translate-x-1 inline-block">
                        →
                    </span>
                </a>
            </div>

            {/* Hover glow */}
            <div
                className={`absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
            />
        </div>
    )
}

// Mission Card Component
function MissionCard({ mission, index }: { mission: Mission; index: number }) {
    const [expanded, setExpanded] = useState(false)

    // Count related entities
    const experimentCount = mission.parents?.experiment?.length || 0
    const payloadCount = mission.parents?.payload?.length || 0
    const studyCount = mission.parents?.GLDS_Study?.length || 0
    const crewCount = mission.people?.length || 0

    // Format date
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD'
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

    // Calculate mission duration
    const getDuration = () => {
        if (!mission.startDate || !mission.endDate) return null
        try {
            const start = new Date(mission.startDate)
            const end = new Date(mission.endDate)
            const days = Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            )
            return days > 0 ? `${days} days` : null
        } catch {
            return null
        }
    }

    const duration = getDuration()

    return (
        <div
            className="glass-card group animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="p-5">
                {/* Mission identifier */}
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-white text-lg group-hover:text-gradient transition-all">
                        {mission.identifier}
                    </h4>
                    <span className="text-2xl">🚀</span>
                </div>

                {/* Aliases */}
                {mission.aliases && mission.aliases.length > 0 && (
                    <p className="text-xs text-white/50 mb-3">
                        aka: {mission.aliases.slice(0, 2).join(', ')}
                    </p>
                )}

                {/* Date range */}
                <div className="glass-card-inner p-3 mb-3">
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <p className="text-white/50 text-xs">Launch</p>
                            <p className="text-white font-medium">
                                {formatDate(mission.startDate)}
                            </p>
                        </div>
                        <div className="text-white/30">→</div>
                        <div className="text-right">
                            <p className="text-white/50 text-xs">End</p>
                            <p className="text-white font-medium">
                                {formatDate(mission.endDate)}
                            </p>
                        </div>
                    </div>
                    {duration && (
                        <div className="text-center mt-2 pt-2 border-t border-white/10">
                            <span className="text-xs text-cyan-400">
                                {duration}
                            </span>
                        </div>
                    )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                        { label: 'Crew', value: crewCount, icon: '👨‍🚀' },
                        { label: 'Exp', value: experimentCount, icon: '🔬' },
                        { label: 'Payload', value: payloadCount, icon: '📦' },
                        { label: 'Studies', value: studyCount, icon: '📊' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-lg">{stat.icon}</p>
                            <p className="text-white font-bold text-sm">
                                {stat.value}
                            </p>
                            <p className="text-white/40 text-xs">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Vehicle info */}
                {mission.vehicle && (
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                        <span>🛸</span>
                        <span className="text-sm text-white/70">
                            {mission.vehicle.vehicle}
                        </span>
                    </div>
                )}

                {/* Expandable crew list */}
                {crewCount > 0 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full mt-3 text-sm text-white/60 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        {expanded ? 'Hide' : 'Show'} Crew
                        <span
                            className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}
                        >
                            ▼
                        </span>
                    </button>
                )}

                {expanded && mission.people && (
                    <div className="mt-3 space-y-2 animate-fade-in-up">
                        {mission.people.slice(0, 5).map((member, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 text-sm p-2 bg-white/5 rounded-lg"
                            >
                                <span>👨‍🔬</span>
                                <div>
                                    <p className="text-white">
                                        {member.person.firstName}{' '}
                                        {member.person.lastName}
                                    </p>
                                    <p className="text-white/50 text-xs">
                                        {member.roles?.join(', ') ||
                                            'Team Member'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// Data Source Card
function DataSourceCard({
    sourceKey,
    name,
    index,
}: {
    sourceKey: string
    name: string
    index: number
}) {
    const config = DATA_SOURCE_CONFIG[sourceKey] || {
        icon: '📊',
        gradient: 'from-gray-500 to-slate-500',
        description: '',
    }

    return (
        <div
            className="glass-card group hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Gradient overlay on hover */}
            <div
                className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}
            />

            <div className="p-6 text-center relative">
                {/* Icon */}
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                    {config.icon}
                </div>

                {/* Source key badge */}
                <span className="px-3 py-1 bg-white/10 text-white/60 text-xs rounded-full font-mono">
                    {sourceKey}
                </span>

                {/* Name */}
                <h4 className="font-bold text-white mt-3 group-hover:text-gradient transition-all">
                    {name}
                </h4>

                {/* Description */}
                <p className="text-sm text-white/50 mt-2">
                    {config.description}
                </p>

                {/* Bottom gradient bar */}
                <div
                    className={`absolute bottom-0 left-4 right-4 h-1 bg-linear-to-r ${config.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                />
            </div>
        </div>
    )
}

// Entity Type Card
function EntityCard({ type, index }: { type: string; index: number }) {
    const config = ENTITY_CONFIG[type] || {
        icon: '📁',
        color: 'text-gray-400',
        description: '',
    }

    return (
        <div
            className="glass-card group hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="p-5">
                <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl ${config.color}`}>
                        {config.icon}
                    </span>
                    <h4 className="font-bold text-white capitalize group-hover:text-gradient">
                        {type}
                    </h4>
                </div>
                <p className="text-sm text-white/50 mb-3">
                    {config.description}
                </p>
                <code className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded font-mono">
                    /api/{type}
                </code>
            </div>
        </div>
    )
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
        <div className={`glass-card p-6 bg-linear-to-br ${gradient} border-0`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    <p className="text-white/70 text-sm">{label}</p>
                </div>
                <span className="text-4xl opacity-80">{icon}</span>
            </div>
        </div>
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
    return (
        <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-bold shrink-0">
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
export default function OpenClient({
    featuredStudies,
    missions,
    entityTypes,
    dataSources,
}: OpenClientProps) {
    const [activeTab, setActiveTab] = useState<'studies' | 'missions'>(
        'studies'
    )
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrganism, setSelectedOrganism] = useState<string>('all')

    // Get unique organisms from studies
    const organisms = useMemo(() => {
        const orgs = new Set<string>()
        featuredStudies.forEach((study) => {
            if (study.organism) orgs.add(study.organism)
        })
        return Array.from(orgs)
    }, [featuredStudies])

    // Filter studies
    const filteredStudies = useMemo(() => {
        return featuredStudies.filter((study) => {
            const matchesSearch =
                !searchTerm ||
                study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                study.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                study.organism?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesOrganism =
                selectedOrganism === 'all' ||
                study.organism === selectedOrganism

            return matchesSearch && matchesOrganism
        })
    }, [featuredStudies, searchTerm, selectedOrganism])

    // Stats
    const totalStudies = featuredStudies.length
    const totalMissions = missions.length
    const uniqueOrganisms = organisms.length
    const dataSourcCount = Object.keys(dataSources).length

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-8 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div
                        className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDelay: '1s' }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-cyan-500/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 relative">
                    {/* Title */}
                    <header className="relative pb-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="animate-fade-in-up space-y-4 mb-8">
                                <h1 className="title-section text-white">
                                    <span className="text-gradient">
                                        NASA Open Science
                                    </span>
                                </h1>
                                <p className="text-white/60 text-lg max-w-2xl">
                                    Access NASA&apos;s comprehensive space
                                    biology research data, including studies,
                                    experiments, missions, and biological
                                    specimens from spaceflight research.
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
                            value={totalStudies}
                            label="Studies"
                            icon="📊"
                            gradient="from-blue-600/20 to-blue-800/20"
                        />
                        <StatsCard
                            value={totalMissions}
                            label="Missions"
                            icon="🚀"
                            gradient="from-purple-600/20 to-purple-800/20"
                        />
                        <StatsCard
                            value={uniqueOrganisms}
                            label="Organisms"
                            icon="🧬"
                            gradient="from-green-600/20 to-green-800/20"
                        />
                        <StatsCard
                            value={dataSourcCount}
                            label="Data Sources"
                            icon="💾"
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
                                    placeholder="Search studies ..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:!outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>

                            {/* Organism Filter */}
                            <select
                                value={selectedOrganism}
                                onChange={(e) =>
                                    setSelectedOrganism(e.target.value)
                                }
                                className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:!outline-none focus:border-blue-500/50 min-w-45 cursor-pointer"
                            >
                                <option value="all" className="bg-gray-900">
                                    All Organisms
                                </option>
                                {organisms.map((org) => (
                                    <option
                                        key={org}
                                        value={org}
                                        className="bg-gray-900"
                                    >
                                        {org}
                                    </option>
                                ))}
                            </select>

                            {/* Tab Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('studies')}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                        activeTab === 'studies'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    📊 Studies
                                </button>
                                <button
                                    onClick={() => setActiveTab('missions')}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                                        activeTab === 'missions'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    🚀 Missions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Sources Section */}
            <section className="py-4 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">💾</span>
                    Data Sources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(dataSources).map(([key, name], index) => (
                        <DataSourceCard
                            key={key}
                            sourceKey={key}
                            name={name}
                            index={index}
                        />
                    ))}
                </div>
            </section>

            {/* Content Section - Studies or Missions */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                {activeTab === 'studies' ? (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">📊</span>
                            Spaceflight Studies
                            <span className="text-sm font-normal text-white/50 ml-2">
                                ({filteredStudies.length} results)
                            </span>
                        </h2>

                        {filteredStudies.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStudies.map((study, index) => (
                                    <StudyCard
                                        key={`${study.id}-${index}`}
                                        study={study}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🔬</span>
                                <p className="text-white/60">
                                    No studies found matching your criteria
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🚀</span>
                            Space Missions
                            <span className="text-sm font-normal text-white/50 ml-2">
                                ({missions.length} missions)
                            </span>
                        </h2>

                        {missions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {missions.slice(0, 12).map((mission, index) => (
                                    <MissionCard
                                        key={`${mission.identifier}-${index}`}
                                        mission={mission}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🚀</span>
                                <p className="text-white/60">
                                    No missions data available
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Entity Types Section */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">📁</span>
                    Available Data Types
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.values(entityTypes).map((type, index) => (
                        <EntityCard key={type} type={type} index={index} />
                    ))}
                </div>
            </section>

            {/* API Documentation Section */}
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
                                path="/osdr/data/osd/files/{study_ids}"
                                description="Get study data files by ID"
                            />
                            <APIEndpoint
                                method="GET"
                                path="/osdr/data/osd/meta/{study_id}"
                                description="Get study metadata"
                            />
                            <APIEndpoint
                                method="GET"
                                path="/osdr/data/search?term={query}"
                                description="Search studies by keyword"
                            />
                            <APIEndpoint
                                method="GET"
                                path="/geode-py/ws/api/missions"
                                description="Get all missions"
                            />
                            <APIEndpoint
                                method="GET"
                                path="/geode-py/ws/api/experiments"
                                description="Get all experiments"
                            />
                            <APIEndpoint
                                method="GET"
                                path="/geode-py/ws/api/payloads"
                                description="Get all payloads"
                            />
                        </div>
                        <a
                            href="https://osdr.nasa.gov/bio/help/api.html"
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
                                    {`# Get study files
                                        curl "https://osdr.nasa.gov/osdr/data/osd/files/87"

                                        # Search for mouse studies
                                        curl "https://osdr.nasa.gov/osdr/data/search?term=mouse&type=cgene"

                                        # Get mission details
                                        curl "https://osdr.nasa.gov/geode-py/ws/api/mission/SpaceX-12"

                                        # Filter by organism
                                        curl "https://osdr.nasa.gov/osdr/data/search?ffield=organism&fvalue=Mus%20musculus"

                                        # Get all experiments
                                        curl "https://osdr.nasa.gov/geode-py/ws/api/experiments"`}
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
                                            type
                                        </code>{' '}
                                        parameter to filter by data source:
                                        cgene, nih_geo_gse, ebi_pride, or
                                        mg_rast
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
                        Explore NASA&apos;s Open Science Data
                    </h2>
                    <p className="text-white/60 mb-6 max-w-xl mx-auto">
                        Access thousands of datasets from spaceflight
                        experiments, including genomics, proteomics, and
                        metabolomics data.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://osdr.nasa.gov"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            🔬 Visit OSDR Portal
                        </a>
                        <a
                            href="https://osdr.nasa.gov/bio/help/api.html"
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
