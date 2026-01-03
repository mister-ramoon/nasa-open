'use client'

// Import necessary modules and types
import { useState } from 'react'
import type {
    ProcessedProject,
    ProjectSummary,
} from '@/lib/types/techport.type'

// Props interface
interface TechportClientProps {
    processedProjects: ProcessedProject[]
    recentProjectsSummary: ProjectSummary[]
    summary: {
        totalProjects: number
        activeProjects: number
        recentlyUpdated: number
    }
    trlLevels: Record<string, string>
    technologyAreas: Record<string, string>
    missionDirectorates: Record<string, string>
}

// TRL Colors config
const TRL_COLORS: Record<number, { bg: string; gradient: string }> = {
    1: { bg: 'bg-red-500', gradient: 'from-red-500 to-red-600' },
    2: { bg: 'bg-red-400', gradient: 'from-red-400 to-red-500' },
    3: { bg: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600' },
    4: { bg: 'bg-orange-400', gradient: 'from-orange-400 to-yellow-500' },
    5: { bg: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-400' },
    6: { bg: 'bg-yellow-400', gradient: 'from-yellow-400 to-green-400' },
    7: { bg: 'bg-green-400', gradient: 'from-green-400 to-green-500' },
    8: { bg: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
    9: { bg: 'bg-green-600', gradient: 'from-green-600 to-emerald-500' },
}

// Status config
const STATUS_CONFIG: Record<
    string,
    { color: string; bgColor: string; icon: string }
> = {
    Active: { color: 'text-green-400', bgColor: 'bg-green-500/20', icon: '🟢' },
    Completed: {
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        icon: '✅',
    },
    Canceled: { color: 'text-red-400', bgColor: 'bg-red-500/20', icon: '❌' },
    'Not Started': {
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        icon: '⏳',
    },
}

// Mission Directorate icons
const MD_ICONS: Record<string, string> = {
    ARMD: '✈️',
    ESDMD: '🚀',
    SMD: '🔬',
    SOMD: '🛰️',
    STMD: '⚡',
}

// Technology Area icons (sample)
const TA_ICONS: Record<string, string> = {
    TA01: '🚀',
    TA02: '💨',
    TA03: '⚡',
    TA04: '🤖',
    TA05: '📡',
    TA06: '🧬',
    TA07: '🏠',
    TA08: '🔭',
    TA09: '🪂',
    TA10: '🔬',
    TA11: '💻',
    TA12: '🔧',
    TA13: '🏗️',
    TA14: '🌡️',
    TA15: '✈️',
}

// Helper functions
function getStatusBadgeClass(status: string): {
    color: string
    bgColor: string
    icon: string
} {
    return STATUS_CONFIG[status] || STATUS_CONFIG['Not Started']
}

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
                    <p className="text-3xl font-bold text-white">
                        {value || '—'}
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

// Project Card Component
function ProjectCard({
    project,
    index,
}: {
    project: ProcessedProject
    index: number
}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const statusConfig = getStatusBadgeClass(project.status)
    const trlColor = project.trlCurrent ? TRL_COLORS[project.trlCurrent] : null

    return (
        <div
            className="glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 60}ms` }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* TRL Progress bar at top */}
            {project.trlCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-t-2xl overflow-hidden">
                    <div
                        className={`h-full bg-linear-to-r ${trlColor?.gradient || 'from-gray-500 to-gray-400'}`}
                        style={{ width: `${(project.trlCurrent / 9) * 100}%` }}
                    />
                </div>
            )}

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <span
                        className={`px-3 py-1 ${statusConfig.bgColor} ${statusConfig.color} text-xs rounded-full flex items-center gap-1`}
                    >
                        <span>{statusConfig.icon}</span>
                        {project.status}
                    </span>
                    {project.acronym && (
                        <span className="text-xs text-white/50 font-mono bg-white/10 px-2 py-1 rounded">
                            {project.acronym}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-white line-clamp-2 mb-2 group-hover:text-gradient transition-all">
                    {project.title}
                </h4>

                {/* Lead Organization */}
                {project.leadOrganization && (
                    <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                        <span>🏛️</span>
                        {project.leadOrganization}
                    </p>
                )}

                {/* Description */}
                {project.description && (
                    <p className="text-sm text-white/60 mb-4 line-clamp-2">
                        {truncateDescription(project.description)}
                    </p>
                )}

                {/* TRL Progress */}
                {project.trlCurrent && (
                    <div className="glass-card-inner p-3 mb-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-white/50">
                                Technology Readiness
                            </span>
                            <span className="text-sm text-white font-bold">
                                TRL {project.trlCurrent}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                                <div
                                    key={level}
                                    className={`flex-1 h-2 rounded-full transition-all ${
                                        level <= (project.trlCurrent || 0)
                                            ? TRL_COLORS[level]?.bg ||
                                              'bg-gray-500'
                                            : 'bg-white/10'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-white/40 mt-1">
                            <span>Start: {project.trlStart || 1}</span>
                            <span>Target: {project.trlEnd || 9}</span>
                        </div>
                    </div>
                )}

                {/* Technology Areas */}
                {project.technologyAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologyAreas.slice(0, 2).map((area, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-lg"
                            >
                                {area.length > 25
                                    ? area.substring(0, 25) + '...'
                                    : area}
                            </span>
                        ))}
                    </div>
                )}

                {/* Expanded details */}
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in-up">
                        {project.startDate && (
                            <div className="flex items-center gap-2 text-sm text-white/50 mb-2">
                                <span>📅</span>
                                <span>
                                    {project.startDate}{' '}
                                    {project.endDate
                                        ? `→ ${project.endDate}`
                                        : ''}
                                </span>
                            </div>
                        )}
                        {project.lastUpdated && (
                            <div className="flex items-center gap-2 text-sm text-white/50">
                                <span>🔄</span>
                                <span>
                                    Updated:{' '}
                                    {new Date(
                                        project.lastUpdated
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* View Project Link */}
                <a
                    href={`https://techport.nasa.gov/view/${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button text-sm py-2 w-full text-center mt-3 group-hover:bg-white/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    View Project
                    <span className="ml-2 transition-transform group-hover:translate-x-1 inline-block">
                        →
                    </span>
                </a>
            </div>
        </div>
    )
}

// TRL Level Card
function TRLCard({
    level,
    description,
    index,
}: {
    level: string
    description: string
    index: number
}) {
    const levelNum = parseInt(level)
    const color = TRL_COLORS[levelNum]

    return (
        <div
            className="glass-card group hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="p-4 flex items-center gap-4">
                <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${color?.gradient || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                >
                    {level}
                </div>
                <p className="text-sm text-white/70 flex-1">{description}</p>
            </div>
        </div>
    )
}

// Technology Area Card
function TechAreaCard({
    code,
    name,
    index,
}: {
    code: string
    name: string
    index: number
}) {
    const icon = TA_ICONS[code] || '🔧'

    return (
        <div
            className="glass-card group hover:scale-105 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                        <code className="text-blue-400 font-bold font-mono text-sm">
                            {code}
                        </code>
                        <p className="text-white/60 text-xs mt-0.5 line-clamp-2">
                            {name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Mission Directorate Card
function DirectorateCard({
    acronym,
    name,
    index,
}: {
    acronym: string
    name: string
    index: number
}) {
    const icon = MD_ICONS[acronym] || '🚀'

    // Gradient based on directorate
    const gradients: Record<string, string> = {
        ARMD: 'from-cyan-500/20 to-blue-500/20',
        ESDMD: 'from-purple-500/20 to-pink-500/20',
        SMD: 'from-green-500/20 to-emerald-500/20',
        SOMD: 'from-orange-500/20 to-amber-500/20',
        STMD: 'from-blue-500/20 to-indigo-500/20',
    }

    return (
        <div
            className={`glass-card bg-linear-to-br ${gradients[acronym] || 'from-gray-500/20 to-slate-500/20'} group hover:scale-105 transition-all duration-300 animate-fade-in-up`}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="p-5">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{icon}</span>
                    <span className="text-xl font-bold text-white">
                        {acronym}
                    </span>
                </div>
                <p className="text-sm text-white/60">{name}</p>
            </div>
        </div>
    )
}

// Recent Project Row
function RecentProjectRow({
    project,
    index,
}: {
    project: ProjectSummary
    index: number
}) {
    const statusConfig = getStatusBadgeClass(project.statusDescription)

    return (
        <div
            className="glass-card p-4 flex flex-col md:flex-row md:items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex-1">
                <a
                    href={`https://techport.nasa.gov/view/${project.projectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-400 font-medium transition-colors"
                >
                    {project.title.length > 60
                        ? project.title.substring(0, 60) + '...'
                        : project.title}
                </a>
                {project.acronym && (
                    <span className="ml-2 text-xs text-white/40 font-mono">
                        ({project.acronym})
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4">
                <span
                    className={`px-2 py-1 ${statusConfig.bgColor} ${statusConfig.color} text-xs rounded-full`}
                >
                    {project.statusDescription}
                </span>
                <span className="text-sm text-white/50 min-w-20 text-center">
                    {project.startYear && project.endYear
                        ? `${project.startYear}-${project.endYear}`
                        : project.startYear || '—'}
                </span>
                <span className="text-xs text-white/40 min-w-24">
                    {project.lastUpdated
                        ? new Date(project.lastUpdated).toLocaleDateString()
                        : '—'}
                </span>
            </div>
        </div>
    )
}

// Main Client Component
export default function TechportClient({
    processedProjects,
    recentProjectsSummary,
    summary,
    trlLevels,
    technologyAreas,
    missionDirectorates,
}: TechportClientProps) {
    const [activeTab, setActiveTab] = useState<'projects' | 'recent' | 'trl'>(
        'projects'
    )
    const [showAllTRL, setShowAllTRL] = useState(false)

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
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-green-500/5 rounded-full blur-3xl" />

                    {/* Tech elements */}
                    <div
                        className="absolute top-1/4 right-1/4 animate-bounce"
                        style={{ animationDuration: '4s' }}
                    >
                        <span className="text-4xl opacity-20">🔬</span>
                    </div>
                    <div
                        className="absolute bottom-1/3 left-1/4 animate-bounce"
                        style={{
                            animationDuration: '5s',
                            animationDelay: '1s',
                        }}
                    >
                        <span className="text-3xl opacity-20">⚡</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative">
                    {/* Title */}
                    <header className="relative pb-4">
                        <div className="mx-auto">
                            <div className="animate-fade-in-up space-y-4 mb-8">
                                <h1 className="title-section text-white">
                                    <span className="text-gradient">
                                        NASA Technology Portfolio
                                    </span>
                                </h1>
                                <p className="text-white/60 text-lg max-w-2xl">
                                    Explore NASA&apos;s technology inventory
                                    showcasing active and completed projects,
                                    facilitating collaboration and partnership
                                    opportunities.
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <StatsCard
                            value={summary.totalProjects}
                            label="Total Projects"
                            icon="📊"
                            gradient="from-blue-600/20 to-blue-800/20"
                        />
                        <StatsCard
                            value={summary.activeProjects}
                            label="Active Projects"
                            icon="🚀"
                            gradient="from-green-600/20 to-green-800/20"
                        />
                        <StatsCard
                            value={summary.recentlyUpdated}
                            label="Updated (60 days)"
                            icon="🔄"
                            gradient="from-purple-600/20 to-purple-800/20"
                        />
                    </div>

                    {/* Tab Navigation */}
                    <div
                        className="glass-card p-2 animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                    activeTab === 'projects'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>🔬</span>
                                Sample Projects
                            </button>
                            <button
                                onClick={() => setActiveTab('recent')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                    activeTab === 'recent'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>🕒</span>
                                Recent Updates
                                {recentProjectsSummary.length > 0 && (
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {recentProjectsSummary.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('trl')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                    activeTab === 'trl'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <span>📈</span>
                                TRL Scale
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                {/* Sample Projects */}
                {activeTab === 'projects' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🔬</span>
                            Sample Projects
                        </h2>

                        {processedProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {processedProjects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        index={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <span className="text-5xl mb-4 block">🔬</span>
                                <p className="text-white/60">
                                    Data temporarily unavailable
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Recent Updates */}
                {activeTab === 'recent' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🕒</span>
                            Recently Updated Projects
                        </h2>

                        {recentProjectsSummary.length > 0 ? (
                            <div className="space-y-3">
                                {recentProjectsSummary
                                    .slice(0, 10)
                                    .map((project, index) => (
                                        <RecentProjectRow
                                            key={project.projectId}
                                            project={project}
                                            index={index}
                                        />
                                    ))}
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

                {/* TRL Scale */}
                {activeTab === 'trl' && (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">📈</span>
                            Technology Readiness Levels
                        </h2>

                        <div className="grid gap-3">
                            {Object.entries(trlLevels)
                                .slice(0, showAllTRL ? undefined : 5)
                                .map(([level, description], index) => (
                                    <TRLCard
                                        key={level}
                                        level={level}
                                        description={description}
                                        index={index}
                                    />
                                ))}
                        </div>

                        {Object.keys(trlLevels).length > 5 && (
                            <div className="text-center mt-6">
                                <button
                                    onClick={() => setShowAllTRL(!showAllTRL)}
                                    className="glass-button px-6 py-3"
                                >
                                    {showAllTRL
                                        ? 'Show Less'
                                        : 'Show All TRL Levels'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* Technology Areas Section */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🔧</span>
                    Technology Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(technologyAreas).map(
                        ([code, name], index) => (
                            <TechAreaCard
                                key={code}
                                code={code}
                                name={name}
                                index={index}
                            />
                        )
                    )}
                </div>
            </section>

            {/* Mission Directorates Section */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">🏛️</span>
                    Mission Directorates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(missionDirectorates).map(
                        ([acronym, name], index) => (
                            <DirectorateCard
                                key={acronym}
                                acronym={acronym}
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
                                        /api/projects
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    List all project IDs
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /api/projects?updatedSince=YYYY-MM-DD
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    Filter by update date
                                </p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded font-bold">
                                        GET
                                    </span>
                                    <code className="text-cyan-400 text-sm font-mono">
                                        /api/projects/&#123;projectId&#125;
                                    </code>
                                </div>
                                <p className="text-white/50 text-xs">
                                    Get project details
                                </p>
                            </div>
                        </div>
                        <a
                            href="https://techport.nasa.gov/help/api"
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
                        <div className="bg-gray-900/50 rounded-xl p-4 overflow-x-auto border border-white/10 text-sm">
                            <pre className="text-green-400">
                                {`# Get all project IDs
curl "https://techport.nasa.gov/api/projects"

# Get projects updated in last 30 days
curl "https://techport.nasa.gov/api/projects\\
?updatedSince=2025-12-01"

# Get specific project details
curl "https://techport.nasa.gov/api/projects/117805"

# Get project as XML
curl "https://techport.nasa.gov/api/projects/117805.xml"`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-12 max-w-7xl mx-auto px-4">
                <div className="glass-card-glow p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Explore NASA&apos;s Technology Portfolio
                    </h2>
                    <p className="text-white/60 mb-6 max-w-xl mx-auto">
                        Discover cutting-edge research projects, track
                        technology maturation, and find collaboration
                        opportunities.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://techport.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30"
                        >
                            🔬 Visit TechPort
                        </a>
                        <a
                            href="https://techport.nasa.gov/search"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button px-8 py-3 bg-purple-500/20 hover:bg-purple-500/30"
                        >
                            🔍 Search Projects
                        </a>
                        <a
                            href="https://techport.nasa.gov/help/api"
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
