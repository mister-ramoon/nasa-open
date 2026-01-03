'use client'

// Import necessary modules and types
import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { PopularLayer } from '@/lib/types/gibs.type'

// Define region types
type RegionType =
    | 'global'
    | 'northAmerica'
    | 'europe'
    | 'asia'
    | 'africa'
    | 'australia'

// URL building functions (moved to client to avoid passing functions from server)
function buildWMSImageUrl(params: {
    layers: string
    date: string
    bbox: string
    width?: number
    height?: number
    projection?: string
}): string {
    const {
        layers,
        date,
        bbox,
        width = 512,
        height = 512,
        projection = 'EPSG:4326',
    } = params

    // Construct the WMS GetMap URL
    const projectionPath = projection.replace(':', '').toLowerCase()
    const baseUrl = `https://gibs.earthdata.nasa.gov/wms/${projectionPath}/best/wms.cgi`

    const queryParams = new URLSearchParams({
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        VERSION: '1.1.1',
        LAYERS: layers,
        FORMAT: 'image/png',
        TRANSPARENT: 'true',
        WIDTH: width.toString(),
        HEIGHT: height.toString(),
        SRS: projection,
        BBOX: bbox,
        TIME: date,
    })

    return `${baseUrl}?${queryParams.toString()}`
}

// Build thumbnail URL
function buildThumbnailUrl(layer: string, date: string): string {
    return buildWMSImageUrl({
        layers: layer,
        date,
        bbox: '-180,-90,180,90',
        width: 400,
        height: 200,
    })
}

// Build regional image URL
function buildRegionalImageUrl(
    layer: string,
    date: string,
    region: RegionType
): string {
    const bboxMap: Record<RegionType, string> = {
        global: '-180,-90,180,90',
        northAmerica: '-170,10,-50,75',
        europe: '-25,35,45,72',
        asia: '60,5,150,55',
        africa: '-20,-40,55,40',
        australia: '110,-50,180,-5',
    }

    return buildWMSImageUrl({
        layers: layer,
        date,
        bbox: bboxMap[region],
        width: 800,
        height: 600,
    })
}

// Gibs Client Props
interface GibsClientProps {
    layers: PopularLayer[]
    categories: string[]
    yesterdayDate: string
}

// Category icons and colors
const categoryConfig: Record<
    string,
    { icon: string; gradient: string; color: string }
> = {
    'Corrected Reflectance': {
        icon: '🌍',
        gradient: 'from-blue-500 to-cyan-500',
        color: 'bg-blue-500',
    },
    'Base Layers': {
        icon: '🗺️',
        gradient: 'from-emerald-500 to-green-500',
        color: 'bg-emerald-500',
    },
    'Night Imagery': {
        icon: '🌙',
        gradient: 'from-indigo-500 to-purple-500',
        color: 'bg-indigo-500',
    },
    Atmosphere: {
        icon: '💨',
        gradient: 'from-sky-500 to-blue-500',
        color: 'bg-sky-500',
    },
    'Land Surface': {
        icon: '🏔️',
        gradient: 'from-amber-500 to-orange-500',
        color: 'bg-amber-500',
    },
    Cryosphere: {
        icon: '❄️',
        gradient: 'from-cyan-400 to-blue-400',
        color: 'bg-cyan-400',
    },
    Ocean: {
        icon: '🌊',
        gradient: 'from-teal-500 to-cyan-500',
        color: 'bg-teal-500',
    },
    Precipitation: {
        icon: '🌧️',
        gradient: 'from-blue-600 to-indigo-600',
        color: 'bg-blue-600',
    },
    Fires: {
        icon: '🔥',
        gradient: 'from-red-500 to-orange-500',
        color: 'bg-red-500',
    },
}

// Region configurations
const regions: { id: RegionType; name: string; icon: string }[] = [
    { id: 'global', name: 'Global', icon: '🌍' },
    { id: 'northAmerica', name: 'North America', icon: '🌎' },
    { id: 'europe', name: 'Europe', icon: '🏰' },
    { id: 'asia', name: 'Asia', icon: '🏯' },
    { id: 'africa', name: 'Africa', icon: '🦁' },
    { id: 'australia', name: 'Australia', icon: '🦘' },
]

// Layer Card Component
function LayerCard({
    layer,
    index,
    date,
    onSelect,
}: {
    layer: PopularLayer
    index: number
    date: string
    onSelect: () => void
}) {
    // Image load state
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const config = categoryConfig[layer.category] || {
        icon: '📡',
        gradient: 'from-gray-500 to-gray-600',
        color: 'bg-gray-500',
    }

    return (
        <div
            className="glass-card overflow-hidden animate-fade-in-up opacity-0 group cursor-pointer hover:scale-[1.02] transition-all duration-300"
            style={{ animationDelay: `${(index % 12) * 50}ms` }}
            onClick={onSelect}
        >
            {/* Image Preview */}
            <div className="relative h-40 bg-white/5 overflow-hidden">
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
                {!imageError ? (
                    <Image
                        src={buildThumbnailUrl(layer.id, date)}
                        alt={layer.title}
                        fill
                        className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        unoptimized
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                        <span className="text-4xl">{config.icon}</span>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="glass-button text-sm">Explore Layer</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${config.gradient} text-white`}
                    >
                        {config.icon} {layer.category}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {layer.title}
                </h4>
                <p className="text-sm text-white/60 mt-1 line-clamp-2">
                    {layer.description}
                </p>
            </div>
        </div>
    )
}

// Featured Layer Card (Large)
function FeaturedLayerCard({
    layer,
    date,
    onSelect,
    index,
}: {
    layer: PopularLayer
    date: string
    onSelect: () => void
    index: number
}) {
    // Image load state
    const [imageLoaded, setImageLoaded] = useState(false)
    const config = categoryConfig[layer.category] || {
        icon: '📡',
        gradient: 'from-gray-500 to-gray-600',
        color: 'bg-gray-500',
    }

    return (
        <div
            className="glass-card overflow-hidden animate-fade-in-up opacity-0 group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={onSelect}
        >
            <div className="relative h-64 bg-white/5 overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
                <Image
                    src={buildThumbnailUrl(layer.id, date)}
                    alt={layer.title}
                    fill
                    className={`object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    unoptimized
                    onLoad={() => setImageLoaded(true)}
                    priority={index < 2}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${config.gradient} text-white mb-3`}
                    >
                        {config.icon} {layer.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {layer.title}
                    </h3>
                    <p className="text-white/70 text-sm">{layer.description}</p>
                </div>
            </div>
        </div>
    )
}

// Layer Detail Modal
function LayerModal({
    layer,
    date,
    onClose,
}: {
    layer: PopularLayer
    date: string
    onClose: () => void
}) {
    const [selectedRegion, setSelectedRegion] = useState<RegionType>('global')
    const [imageLoaded, setImageLoaded] = useState(false)
    const config = categoryConfig[layer.category] || {
        icon: '📡',
        gradient: 'from-gray-500 to-gray-600',
        color: 'bg-gray-500',
    }

    const imageUrl = buildRegionalImageUrl(layer.id, date, selectedRegion)

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="glass-card max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-start justify-between">
                        <div>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${config.gradient} text-white mb-2`}
                            >
                                {config.icon} {layer.category}
                            </span>
                            <h2 className="text-2xl font-bold text-white">
                                {layer.title}
                            </h2>
                            <p className="text-white/60 mt-1">
                                {layer.description}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/60 hover:text-white text-2xl transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Region Selector */}
                <div className="p-4 border-b border-white/10">
                    <p className="text-white/60 text-sm mb-3">Select Region:</p>
                    <div className="flex flex-wrap gap-2">
                        {regions.map((region) => (
                            <button
                                key={region.id}
                                onClick={() => {
                                    setSelectedRegion(region.id)
                                    setImageLoaded(false)
                                }}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    selectedRegion === region.id
                                        ? 'bg-white/20 text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {region.icon} {region.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image */}
                <div className="relative aspect-video bg-white/5">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                    <Image
                        src={imageUrl}
                        alt={`${layer.title} - ${selectedRegion}`}
                        fill
                        className={`object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        unoptimized
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>

                {/* Actions */}
                <div className="p-6 flex flex-wrap gap-3">
                    <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button"
                    >
                        🔗 Open Full Resolution
                    </a>
                    <a
                        href={imageUrl}
                        download={`${layer.id}_${date}_${selectedRegion}.png`}
                        className="glass-button"
                    >
                        ⬇️ Download
                    </a>
                    <a
                        href="https://nasa-gibs.github.io/gibs-api-docs/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-button"
                    >
                        📖 API Docs
                    </a>
                </div>
            </div>
        </div>
    )
}

export default function GibsClient({
    layers,
    categories,
    yesterdayDate,
}: GibsClientProps) {
    // State management
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [selectedLayer, setSelectedLayer] = useState<PopularLayer | null>(
        null
    )
    const [searchQuery, setSearchQuery] = useState('')

    // Featured layers
    const featuredLayerIds = [
        'MODIS_Terra_CorrectedReflectance_TrueColor',
        'VIIRS_Black_Marble',
        'BlueMarble_NextGeneration',
    ]
    const featuredLayers = layers.filter((l) => featuredLayerIds.includes(l.id))

    // Filter layers
    const filteredLayers = useMemo(() => {
        let result = layers

        if (activeCategory) {
            result = result.filter((l) => l.category === activeCategory)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (l) =>
                    l.title.toLowerCase().includes(query) ||
                    l.description.toLowerCase().includes(query) ||
                    l.category.toLowerCase().includes(query)
            )
        }

        return result
    }, [layers, activeCategory, searchQuery])

    // Stats
    const stats = useMemo(() => {
        const byCategory: Record<string, number> = {}
        layers.forEach((l) => {
            byCategory[l.category] = (byCategory[l.category] || 0) + 1
        })
        return byCategory
    }, [layers])

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <header className="relative px-6 pt-8 pb-4">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-fade-in-up space-y-4 mb-8">
                        <h1 className="title-section text-white">
                            <span className="text-gradient">
                                Global Imagery
                            </span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Browse NASA&apos;s vast archive of satellite
                            imagery. From true-color views to specialized data
                            layers, explore Earth from space in stunning detail.
                        </p>
                        <p className="text-sm text-white/50 mt-4 animate-fade-in-up opacity-0 stagger-2">
                            Imagery Date:{' '}
                            {new Date(yesterdayDate).toLocaleDateString(
                                'en-US',
                                {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }
                            )}
                        </p>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <section className="px-4 mt-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 text-center">
                            <div className="text-4xl mb-2">🛰️</div>
                            <p className="text-3xl font-black text-gradient">
                                {layers.length}
                            </p>
                            <p className="text-white/60 text-sm">
                                Available Layers
                            </p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-1 text-center">
                            <div className="text-4xl mb-2">📂</div>
                            <p className="text-3xl font-black text-cyan-400">
                                {categories.length}
                            </p>
                            <p className="text-white/60 text-sm">Categories</p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-2 text-center">
                            <div className="text-4xl mb-2">🌐</div>
                            <p className="text-3xl font-black text-emerald-400">
                                4
                            </p>
                            <p className="text-white/60 text-sm">Projections</p>
                        </div>
                        <div className="glass-card p-5 animate-fade-in-up opacity-0 stagger-3 text-center">
                            <div className="text-4xl mb-2">📅</div>
                            <p className="text-3xl font-black text-purple-400">
                                Daily
                            </p>
                            <p className="text-white/60 text-sm">Updates</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Layers */}
            <section className="px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 animate-fade-in-up opacity-0">
                        <span className="text-3xl">⭐</span>
                        Featured Views
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {featuredLayers.map((layer, index) => (
                            <FeaturedLayerCard
                                key={layer.id}
                                layer={layer}
                                date={yesterdayDate}
                                onSelect={() => setSelectedLayer(layer)}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Filters */}
            <section className="px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-4 animate-fade-in-up opacity-0">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            {/* Categories */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                        activeCategory === null
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    All ({layers.length})
                                </button>
                                {categories.map((category) => {
                                    const config = categoryConfig[category] || {
                                        icon: '📡',
                                    }
                                    return (
                                        <button
                                            key={category}
                                            onClick={() =>
                                                setActiveCategory(
                                                    activeCategory === category
                                                        ? null
                                                        : category
                                                )
                                            }
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                                activeCategory === category
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            {config.icon} {category} (
                                            {stats[category] || 0})
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Search */}
                            <div className="relative w-full lg:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search layers..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full lg:w-64 bg-white/10 border border-white/20 rounded-xl px-4 py-2 pl-10 text-white placeholder-white/40 focus:!outline-none focus:ring-2 focus:ring-cyan-500/50"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                                    🔍
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layers Grid */}
            <section className="px-4 pb-12">
                <div className="max-w-7xl mx-auto">
                    <p className="text-white/60 mb-4 animate-fade-in-up opacity-0">
                        Showing {filteredLayers.length} layers
                        {activeCategory && ` in ${activeCategory}`}
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>

                    {filteredLayers.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredLayers.map((layer, index) => (
                                <LayerCard
                                    key={layer.id}
                                    layer={layer}
                                    index={index}
                                    date={yesterdayDate}
                                    onSelect={() => setSelectedLayer(layer)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-12 text-center animate-fade-in-up opacity-0">
                            <div className="text-6xl mb-4">🛰️</div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                No Layers Found
                            </h3>
                            <p className="text-white/60">
                                {searchQuery
                                    ? `No layers match "${searchQuery}". Try a different search.`
                                    : 'No layers available in this category.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* API Info Section */}
            <section className="px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-8 animate-fade-in-up opacity-0">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">🔧</span>
                            API Usage
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="text-white/70">
                                    GIBS provides satellite imagery through
                                    standard web mapping protocols, making it
                                    easy to integrate into any mapping
                                    application.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                                        <span className="text-xl">🗺️</span>
                                        <div>
                                            <p className="font-semibold text-white">
                                                WMTS
                                            </p>
                                            <p className="text-sm text-white/60">
                                                Tiled imagery for web maps
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                                        <span className="text-xl">🖼️</span>
                                        <div>
                                            <p className="font-semibold text-white">
                                                WMS
                                            </p>
                                            <p className="text-sm text-white/60">
                                                Custom bounding box requests
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-white">
                                    Supported Projections
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="font-mono text-sm text-cyan-400">
                                            EPSG:4326
                                        </p>
                                        <p className="text-xs text-white/60">
                                            Geographic
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="font-mono text-sm text-cyan-400">
                                            EPSG:3857
                                        </p>
                                        <p className="text-xs text-white/60">
                                            Web Mercator
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="font-mono text-sm text-cyan-400">
                                            EPSG:3413
                                        </p>
                                        <p className="text-xs text-white/60">
                                            Arctic Polar
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="font-mono text-sm text-cyan-400">
                                            EPSG:3031
                                        </p>
                                        <p className="text-xs text-white/60">
                                            Antarctic Polar
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href="https://nasa-gibs.github.io/gibs-api-docs/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    View Full Documentation →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layer Modal */}
            {selectedLayer && (
                <LayerModal
                    layer={selectedLayer}
                    date={yesterdayDate}
                    onClose={() => setSelectedLayer(null)}
                />
            )}
        </div>
    )
}
