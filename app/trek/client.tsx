'use client'

// Import necessary modules and types
import { useState } from 'react'
import type { TrekBody, MosaicPreset, LandingSite } from '@/lib/types/trek.type'

// ============ Types ============
interface TrekBodyInfo {
    name: string
    description: string
    radius: number
    missions: string[]
    color: { bg: string; text: string; border: string }
}

interface TrekStats {
    moonLayers: number
    marsLayers: number
    vestaLayers: number
    totalMosaics: number
}

interface ProjectionInfo {
    name: string
    description: string
}

interface TrekClientProps {
    stats: TrekStats
    featuredMosaics: MosaicPreset[]
    globalMosaics: MosaicPreset[]
    moonMosaics: MosaicPreset[]
    marsMosaics: MosaicPreset[]
    vestaMosaics: MosaicPreset[]
    moonLandingSites: LandingSite[]
    marsLandingSites: LandingSite[]
    bodies: Record<TrekBody, TrekBodyInfo>
    projections: Record<string, ProjectionInfo>
    zoomLevels: Record<string, number>
    portalUrls: Record<TrekBody, string>
    apiDocUrls: Record<TrekBody, string>
    constants: {
        title: string
        description: string
        dataSource: string
    }
}

// ============ Helper Functions ============
function getBodyColorClasses(body: TrekBody): {
    bg: string
    text: string
    border: string
    glow: string
} {
    const colors: Record<
        TrekBody,
        { bg: string; text: string; border: string; glow: string }
    > = {
        moon: {
            bg: 'from-slate-400/20 to-slate-500/10',
            text: 'text-slate-300',
            border: 'border-slate-400/30',
            glow: 'shadow-slate-400/20',
        },
        mars: {
            bg: 'from-red-400/20 to-orange-500/10',
            text: 'text-red-300',
            border: 'border-red-400/30',
            glow: 'shadow-red-400/20',
        },
        vesta: {
            bg: 'from-amber-400/20 to-yellow-500/10',
            text: 'text-amber-300',
            border: 'border-amber-400/30',
            glow: 'shadow-amber-400/20',
        },
    }
    return colors[body]
}

function getBodyEmoji(body: TrekBody): string {
    const emojis: Record<TrekBody, string> = {
        moon: '🌙',
        mars: '🔴',
        vesta: '🪨',
    }
    return emojis[body]
}

function formatCoordinates(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`
}

function truncateDescription(
    description: string,
    maxLength: number = 150
): string {
    if (!description) return ''
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).trim() + '...'
}

// ============ Components ============

// Stats Card
function StatsCard({
    label,
    value,
    icon,
    delay = 0,
}: {
    label: string
    value: string | number
    icon: React.ReactNode
    delay?: number
}) {
    return (
        <div
            className="glass-card group animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="glass-card-inner p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {value}
                        </p>
                        <p className="text-sm text-white/60 mt-1">{label}</p>
                    </div>
                    <div className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Body Card
function BodyCard({
    bodyKey,
    body,
    mosaicCount,
    delay = 0,
}: {
    bodyKey: TrekBody
    body: TrekBodyInfo
    mosaicCount: number
    delay?: number
}) {
    const colors = getBodyColorClasses(bodyKey)
    const emoji = getBodyEmoji(bodyKey)

    return (
        <div
            className="glass-card group animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div
                className={`absolute inset-0 bg-linear-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
            />
            <div className="glass-card-inner p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{emoji}</span>
                        <div>
                            <h3 className={`text-xl font-bold ${colors.text}`}>
                                {body.name}
                            </h3>
                            <p className="text-xs text-white/50">
                                {body.radius.toLocaleString()} km radius
                            </p>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm font-medium">
                        {mosaicCount} mosaics
                    </span>
                </div>

                <p className="text-white/70 text-sm mb-4">{body.description}</p>

                <div className="flex flex-wrap gap-2">
                    {body.missions.slice(0, 5).map((mission) => (
                        <span
                            key={mission}
                            className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors"
                        >
                            {mission}
                        </span>
                    ))}
                    {body.missions.length > 5 && (
                        <span className="px-2 py-1 text-white/40 text-xs">
                            +{body.missions.length - 5} more
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

// Mosaic Card
function MosaicCard({
    mosaic,
    delay = 0,
    featured = false,
}: {
    mosaic: MosaicPreset
    delay?: number
    featured?: boolean
}) {
    const colors = getBodyColorClasses(mosaic.body)
    const emoji = getBodyEmoji(mosaic.body)

    return (
        <div
            className={`glass-card group animate-fade-in-up overflow-hidden ${featured ? 'md:col-span-1' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div
                className={`absolute inset-0 bg-linear-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
            />

            {/* Preview Image Area */}
            <div className="relative h-32 bg-linear-to-br from-white/5 to-white/0 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                        {emoji}
                    </div>
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                    <span
                        className={`px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm ${colors.text} text-xs font-medium`}
                    >
                        {mosaic.body.charAt(0).toUpperCase() +
                            mosaic.body.slice(1)}
                    </span>
                    {mosaic.coverage && (
                        <span className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white/70 text-xs">
                            {mosaic.coverage}
                        </span>
                    )}
                </div>
                {mosaic.format && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white/50 text-xs font-mono">
                        .{mosaic.format}
                    </span>
                )}
            </div>

            <div className="glass-card-inner p-4 relative z-10">
                <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {mosaic.name}
                </h4>
                <p className="text-xs text-white/60 mt-2 line-clamp-2">
                    {truncateDescription(mosaic.description, 100)}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                    {mosaic.instrument && (
                        <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs">
                            📷 {mosaic.instrument}
                        </span>
                    )}
                    {mosaic.resolution && (
                        <span className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs">
                            📐 {mosaic.resolution}
                        </span>
                    )}
                </div>

                <div className="flex gap-3 mt-4 pt-3 border-t border-white/10">
                    <a
                        href={mosaic.wmtsCapabilitiesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        WMTS Capabilities →
                    </a>
                    <a
                        href={mosaic.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Preview →
                    </a>
                </div>
            </div>
        </div>
    )
}

// Landing Site Card
function LandingSiteCard({
    site,
    delay = 0,
}: {
    site: LandingSite
    delay?: number
}) {
    const colors = getBodyColorClasses(site.body)

    return (
        <div
            className="glass-card group animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div
                className={`absolute inset-0 bg-linear-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
            />
            <div className="glass-card-inner p-4 relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-bold text-sm ${colors.text}`}>
                        {site.mission}
                    </h4>
                    <span className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-xs">
                        {site.year}
                    </span>
                </div>
                <p className="text-white/70 text-sm">{site.name}</p>
                <p className="text-xs text-cyan-400/70 font-mono mt-2">
                    📍 {formatCoordinates(site.latitude, site.longitude)}
                </p>
                {site.description && (
                    <p className="text-xs text-white/50 mt-2 italic line-clamp-2">
                        {site.description}
                    </p>
                )}
            </div>
        </div>
    )
}

// Projection Card
function ProjectionCard({
    projKey,
    projection,
    delay = 0,
}: {
    projKey: string
    projection: ProjectionInfo
    delay?: number
}) {
    return (
        <div
            className="glass-card group animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="glass-card-inner p-5 relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-blue-300 group-hover:text-blue-200 transition-colors">
                        {projection.name}
                    </h4>
                    <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-mono">
                        {projKey}
                    </span>
                </div>
                <p className="text-sm text-white/60">
                    {projection.description}
                </p>
            </div>
        </div>
    )
}

// Zoom Level Card
function ZoomLevelCard({
    name,
    level,
    delay = 0,
}: {
    name: string
    level: number
    delay?: number
}) {
    return (
        <div
            className="glass-card group animate-fade-in-up text-center"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="glass-card-inner p-4 relative z-10">
                <p className="text-2xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                    {level}
                </p>
                <p className="text-xs text-white/50 capitalize mt-1">
                    {name.replace('_', ' ').toLowerCase()}
                </p>
            </div>
        </div>
    )
}

// Tab Button
function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                active
                    ? 'bg-white/20 text-white shadow-lg shadow-white/10'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
        >
            {children}
        </button>
    )
}

// ============ Main Component ============
export default function TrekClient({
    stats,
    featuredMosaics,
    moonMosaics,
    marsMosaics,
    vestaMosaics,
    moonLandingSites,
    marsLandingSites,
    bodies,
    projections,
    zoomLevels,
    portalUrls,
    apiDocUrls,
    constants,
}: TrekClientProps) {
    const [activeTab, setActiveTab] = useState<
        'featured' | 'moon' | 'mars' | 'vesta'
    >('featured')
    const [sitesTab, setSitesTab] = useState<'moon' | 'mars'>('moon')

    const currentMosaics =
        activeTab === 'featured'
            ? featuredMosaics
            : activeTab === 'moon'
              ? moonMosaics
              : activeTab === 'mars'
                ? marsMosaics
                : vestaMosaics

    const currentSites =
        sitesTab === 'moon' ? moonLandingSites : marsLandingSites

    return (
        <div className="min-h-screen relative">
            {/* Animated Background */}

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="relative pb-4">
                    <div className="mx-auto">
                        <div className="animate-fade-in-up space-y-4 mb-8">
                            <h1 className="title-section text-white">
                                <span className="text-gradient">
                                    {constants.title}
                                </span>
                            </h1>
                            <p className="text-white/60 text-lg max-w-2xl">
                                {constants.description}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <StatsCard
                        label="Moon Layers"
                        value={stats.moonLayers}
                        icon="🌙"
                        delay={0}
                    />
                    <StatsCard
                        label="Mars Layers"
                        value={stats.marsLayers}
                        icon="🔴"
                        delay={100}
                    />
                    <StatsCard
                        label="Vesta Layers"
                        value={stats.vestaLayers}
                        icon="🪨"
                        delay={200}
                    />
                    <StatsCard
                        label="Total Mosaics"
                        value={stats.totalMosaics}
                        icon="🗺️"
                        delay={300}
                    />
                </section>

                {/* Celestial Bodies */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">🌌</span>
                        Supported Celestial Bodies
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {(
                            Object.entries(bodies) as [TrekBody, TrekBodyInfo][]
                        ).map(([key, body], index) => {
                            const count =
                                key === 'moon'
                                    ? stats.moonLayers
                                    : key === 'mars'
                                      ? stats.marsLayers
                                      : stats.vestaLayers
                            return (
                                <BodyCard
                                    key={key}
                                    bodyKey={key}
                                    body={body}
                                    mosaicCount={count}
                                    delay={index * 100}
                                />
                            )
                        })}
                    </div>
                </section>

                {/* Mosaics Section */}
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-3xl">🗺️</span>
                            Map Mosaics
                        </h2>
                        <div className="flex gap-2 p-1 rounded-xl bg-white/5 backdrop-blur-sm">
                            <TabButton
                                active={activeTab === 'featured'}
                                onClick={() => setActiveTab('featured')}
                            >
                                ⭐ Featured
                            </TabButton>
                            <TabButton
                                active={activeTab === 'moon'}
                                onClick={() => setActiveTab('moon')}
                            >
                                🌙 Moon ({moonMosaics.length})
                            </TabButton>
                            <TabButton
                                active={activeTab === 'mars'}
                                onClick={() => setActiveTab('mars')}
                            >
                                🔴 Mars ({marsMosaics.length})
                            </TabButton>
                            <TabButton
                                active={activeTab === 'vesta'}
                                onClick={() => setActiveTab('vesta')}
                            >
                                🪨 Vesta ({vestaMosaics.length})
                            </TabButton>
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {currentMosaics.map((mosaic, index) => (
                            <MosaicCard
                                key={mosaic.id}
                                mosaic={mosaic}
                                delay={index * 50}
                                featured={activeTab === 'featured'}
                            />
                        ))}
                    </div>
                </section>

                {/* Landing Sites */}
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="text-3xl">🚀</span>
                            Historical Landing Sites
                        </h2>
                        <div className="flex gap-2 p-1 rounded-xl bg-white/5 backdrop-blur-sm">
                            <TabButton
                                active={sitesTab === 'moon'}
                                onClick={() => setSitesTab('moon')}
                            >
                                🌙 Moon ({moonLandingSites.length})
                            </TabButton>
                            <TabButton
                                active={sitesTab === 'mars'}
                                onClick={() => setSitesTab('mars')}
                            >
                                🔴 Mars ({marsLandingSites.length})
                            </TabButton>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {currentSites.map((site, index) => (
                            <LandingSiteCard
                                key={site.name}
                                site={site}
                                delay={index * 50}
                            />
                        ))}
                    </div>
                </section>

                {/* Projections */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">🌐</span>
                        Map Projections
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        {Object.entries(projections).map(
                            ([key, proj], index) => (
                                <ProjectionCard
                                    key={key}
                                    projKey={key}
                                    projection={proj}
                                    delay={index * 100}
                                />
                            )
                        )}
                    </div>
                </section>

                {/* Zoom Levels */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">🔍</span>
                        Zoom Levels
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Object.entries(zoomLevels).map(
                            ([name, level], index) => (
                                <ZoomLevelCard
                                    key={name}
                                    name={name}
                                    level={level}
                                    delay={index * 50}
                                />
                            )
                        )}
                    </div>
                </section>

                {/* WMTS URL Format */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">🔗</span>
                        WMTS URL Format
                    </h2>
                    <div className="glass-card animate-fade-in-up">
                        <div className="glass-card-inner p-6">
                            <p className="text-white/70 mb-4">
                                The basic URL template for requesting tiles from
                                the WMTS service:
                            </p>
                            <div className="bg-black/40 rounded-xl p-4 overflow-x-auto">
                                <pre className="text-sm text-emerald-400 font-mono whitespace-pre-wrap">
                                    {`{BaseURL}/EQ/{Layer}/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{format}

# Variables:
# - BaseURL: https://trek.nasa.gov/tiles/{Body}
# - Layer: Mosaic identifier (e.g., LRO_WAC_Mosaic_Global_303ppd_v02)
# - Style: Usually "default"
# - TileMatrixSet: Usually "default028mm"
# - TileMatrix: Zoom level (0, 1, 2, ...)
# - TileRow: Row index
# - TileCol: Column index
# - format: png or jpg`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Example Tile URLs */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">📋</span>
                        Example Tile URLs
                    </h2>
                    <div className="glass-card animate-fade-in-up">
                        <div className="glass-card-inner p-6">
                            <div className="bg-black/40 rounded-xl p-4 overflow-x-auto">
                                <pre className="text-sm text-cyan-400 font-mono whitespace-pre-wrap">
                                    {`# Moon - LRO WAC Global Mosaic (Zoom 0, Tile 0,0)
https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/0/0/0.jpg

# Moon - LRO WAC Global Mosaic (Zoom 0, Tile 0,1)
https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/0/0/1.jpg

# Mars - Viking Color Mosaic (Zoom 1, Tile 0,0)
https://trek.nasa.gov/tiles/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/1/0/0.jpg

# Vesta - Dawn HAMO Global (Zoom 0, Tile 0,0)
https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_FC_HAMO_Mosaic_Global_74ppd/1.0.0/default/default028mm/0/0/0.png`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tile Grid System */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">📊</span>
                        Tile Grid System
                    </h2>
                    <div className="glass-card animate-fade-in-up">
                        <div className="glass-card-inner p-6">
                            <p className="text-white/70 mb-4">
                                For equirectangular projection, each zoom level
                                doubles the number of tiles:
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="text-left py-3 px-4 text-white/80 font-semibold">
                                                Zoom Level
                                            </th>
                                            <th className="text-center py-3 px-4 text-white/80 font-semibold">
                                                Columns
                                            </th>
                                            <th className="text-center py-3 px-4 text-white/80 font-semibold">
                                                Rows
                                            </th>
                                            <th className="text-center py-3 px-4 text-white/80 font-semibold">
                                                Total Tiles
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[0, 1, 2, 3, 4, 5].map((zoom) => {
                                            const cols = Math.pow(2, zoom + 1)
                                            const rows = Math.pow(2, zoom)
                                            return (
                                                <tr
                                                    key={zoom}
                                                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="py-3 px-4 font-mono text-cyan-300">
                                                        {zoom}
                                                    </td>
                                                    <td className="text-center py-3 px-4 font-mono text-white/70">
                                                        {cols}
                                                    </td>
                                                    <td className="text-center py-3 px-4 font-mono text-white/70">
                                                        {rows}
                                                    </td>
                                                    <td className="text-center py-3 px-4 font-mono text-emerald-300">
                                                        {cols * rows}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Documentation & Portals */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">📚</span>
                        API Documentation & Portals
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                        {(
                            Object.entries(apiDocUrls) as [TrekBody, string][]
                        ).map(([body, url], index) => {
                            const colors = getBodyColorClasses(body)
                            const emoji = getBodyEmoji(body)
                            const bodyInfo = bodies[body]
                            return (
                                <a
                                    key={body}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-card group animate-fade-in-up hover:scale-105 transition-transform"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div
                                        className={`absolute inset-0 bg-linear-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                                    />
                                    <div className="glass-card-inner p-5 relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">
                                                {emoji}
                                            </span>
                                            <h4
                                                className={`font-bold ${colors.text}`}
                                            >
                                                {bodyInfo.name} API
                                            </h4>
                                        </div>
                                        <p className="text-sm text-white/60">
                                            Complete layer listing and
                                            capabilities
                                        </p>
                                        <p className="text-xs text-cyan-400 mt-3">
                                            View Documentation →
                                        </p>
                                    </div>
                                </a>
                            )
                        })}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {(
                            Object.entries(portalUrls) as [TrekBody, string][]
                        ).map(([body, url]) => {
                            const colors = getBodyColorClasses(body)
                            const emoji = getBodyEmoji(body)
                            const bodyInfo = bodies[body]
                            return (
                                <a
                                    key={body}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`glass-button hover:scale-105 transition-all ${colors.text}`}
                                >
                                    {emoji} {bodyInfo.name} Trek
                                </a>
                            )
                        })}
                        <a
                            href="https://trek.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass-button hover:scale-105 transition-all text-blue-300"
                        >
                            🏠 NASA Trek Main Portal
                        </a>
                    </div>
                </section>

                {/* WMTS Capabilities */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="text-3xl">⚙️</span>
                        WMTS Capabilities URLs
                    </h2>
                    <div className="glass-card animate-fade-in-up">
                        <div className="glass-card-inner p-6">
                            <p className="text-white/70 mb-4">
                                Each mosaic has a WMTS GetCapabilities XML
                                document describing its properties:
                            </p>
                            <div className="space-y-4">
                                {featuredMosaics.slice(0, 3).map((mosaic) => {
                                    const colors = getBodyColorClasses(
                                        mosaic.body
                                    )
                                    return (
                                        <div
                                            key={mosaic.id}
                                            className="p-4 rounded-xl bg-white/5 border border-white/10"
                                        >
                                            <p
                                                className={`font-medium ${colors.text} mb-2`}
                                            >
                                                {mosaic.name}
                                            </p>
                                            <a
                                                href={
                                                    mosaic.wmtsCapabilitiesUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-cyan-400 hover:text-cyan-300 break-all transition-colors"
                                            >
                                                {mosaic.wmtsCapabilitiesUrl}
                                            </a>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resources */}
                <section className="py-4 max-w-7xl mx-auto px-4">
                    <div className="glass-card-glow p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🔗</span>
                            Resources
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="https://trek.nasa.gov/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button hover:scale-105 transition-all text-blue-300"
                            >
                                🌐 NASA Trek Portal
                            </a>
                            <a
                                href="https://www.opengeospatial.org/standards/wmts"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button hover:scale-105 transition-all text-emerald-300"
                            >
                                📐 WMTS Standard (OGC)
                            </a>
                            <a
                                href="https://sservi.nasa.gov/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button hover:scale-105 transition-all text-purple-300"
                            >
                                🔬 NASA SSERVI
                            </a>
                            <a
                                href="https://www.jpl.nasa.gov/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-button hover:scale-105 transition-all text-orange-300"
                            >
                                🚀 JPL
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
