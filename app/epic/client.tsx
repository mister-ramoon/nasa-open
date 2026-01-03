'use client'

//
import { useState } from 'react'
import Image from 'next/image'
import type { EPICImage } from '@/lib/types/epic.type'

// Tab type
type ImageType = 'natural' | 'enhanced'

// Build image URLs (same logic as service)
function buildThumbnailUrl(image: EPICImage, type: ImageType): string {
    const date = new Date(image.date)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `https://epic.gsfc.nasa.gov/archive/${type}/${year}/${month}/${day}/thumbs/${image.image}.jpg`
}

// Build full image URL
function buildImageUrl(image: EPICImage, type: ImageType): string {
    const date = new Date(image.date)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `https://epic.gsfc.nasa.gov/archive/${type}/${year}/${month}/${day}/png/${image.image}.png`
}

// Stats Card Component
interface StatsCardProps {
    label: string
    value: string | number
    icon: string
    gradient?: string
    delay?: number
}

// Stats Card Component
function StatsCard({
    label,
    value,
    icon,
    gradient = 'from-blue-500 to-cyan-500',
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
                    <p className="text-2xl font-bold text-gradient">{value}</p>
                </div>
                <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center text-xl`}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}

// Image Card Component
interface ImageCardProps {
    image: EPICImage
    type: ImageType
    index: number
    onClick: () => void
}

function ImageCard({ image, type, index, onClick }: ImageCardProps) {
    // Image load states
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    return (
        <div
            className="glass-card glass-card-glow overflow-hidden opacity-0 animate-fade-in-up group cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={onClick}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                        <div className="text-4xl">🌍</div>
                    </div>
                )}
                {imageError ? (
                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🌍</div>
                            <p className="text-white/50 text-sm">
                                Image unavailable
                            </p>
                        </div>
                    </div>
                ) : (
                    <Image
                        src={buildThumbnailUrl(image, type)}
                        alt={image.caption || 'Earth from DSCOVR'}
                        fill
                        className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        unoptimized
                    />
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="glass-button text-sm">View Full Size</span>
                </div>

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            type === 'natural'
                                ? 'bg-green-500/80 text-white'
                                : 'bg-purple-500/80 text-white'
                        }`}
                    >
                        {type === 'natural' ? 'Natural' : 'Enhanced'}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-white font-medium mb-2">
                    {new Date(image.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </p>
                <p className="text-white/50 text-sm mb-3">
                    {new Date(image.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}{' '}
                    UTC
                </p>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/5 rounded-lg p-2">
                        <span className="text-white/50">Lat</span>
                        <p className="text-white font-mono">
                            {image.centroid_coordinates.lat.toFixed(2)}°
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                        <span className="text-white/50">Lon</span>
                        <p className="text-white font-mono">
                            {image.centroid_coordinates.lon.toFixed(2)}°
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Image Modal Component
interface ImageModalProps {
    image: EPICImage | null
    type: ImageType
    onClose: () => void
}

// Image Modal Component
function ImageModal({ image, type, onClose }: ImageModalProps) {
    if (!image) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-scale"
            onClick={onClose}
        >
            <div
                className="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            Earth from DSCOVR EPIC
                        </h3>
                        <p className="text-white/50 text-sm">
                            {new Date(image.date).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Image */}
                <div className="relative aspect-square max-h-[60vh]">
                    <Image
                        src={buildThumbnailUrl(image, type)}
                        alt={image.caption || 'Earth from DSCOVR'}
                        fill
                        className="object-contain"
                        unoptimized
                    />
                </div>

                {/* Info */}
                <div className="p-4 border-t border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-white/50">Centroid Lat</span>
                            <p className="text-white font-mono">
                                {image.centroid_coordinates.lat.toFixed(4)}°
                            </p>
                        </div>
                        <div>
                            <span className="text-white/50">Centroid Lon</span>
                            <p className="text-white font-mono">
                                {image.centroid_coordinates.lon.toFixed(4)}°
                            </p>
                        </div>
                        <div>
                            <span className="text-white/50">
                                Sun Position (J2000)
                            </span>
                            <p className="text-white font-mono text-xs">
                                X: {image.sun_j2000_position.x.toFixed(0)}
                            </p>
                        </div>
                        <div>
                            <span className="text-white/50">
                                DSCOVR Position
                            </span>
                            <p className="text-white font-mono text-xs">
                                X: {image.dscovr_j2000_position.x.toFixed(0)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <a
                            href={buildImageUrl(image, type)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 glass-button justify-center"
                        >
                            <span>Download Full Resolution</span>
                            <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Main Client Component
interface EpicClientProps {
    naturalImages: EPICImage[]
    enhancedImages: EPICImage[]
}

export default function EpicClient({
    naturalImages,
    enhancedImages,
}: EpicClientProps) {
    // Component state
    const [activeType, setActiveType] = useState<ImageType>('natural')
    const [selectedImage, setSelectedImage] = useState<EPICImage | null>(null)

    // Determine current images and availability
    const currentImages =
        activeType === 'natural' ? naturalImages : enhancedImages
    const hasImages = naturalImages.length > 0 || enhancedImages.length > 0

    // Get latest image date
    const latestDate = currentImages[0]?.date
        ? new Date(currentImages[0].date).toLocaleDateString()
        : 'N/A'

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <header className="relative px-6 pt-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-fade-in-up space-y-4 mb-8">
                        <h1 className="title-section text-white">
                            <span className="text-gradient">
                                Earth Polychromatic
                            </span>
                            <br />
                            <span className="text-white">Imaging Camera</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-2xl">
                            Daily views of Earth from the DSCOVR spacecraft at
                            Lagrange point 1, approximately 1.5 million
                            kilometers from Earth
                        </p>
                    </div>

                    {/* Featured Image */}
                    {currentImages[0] && (
                        <div
                            className="glass-card overflow-hidden animate-fade-in-up opacity-0 cursor-pointer group"
                            style={{ animationDelay: '100ms' }}
                            onClick={() => setSelectedImage(currentImages[0])}
                        >
                            <div className="relative aspect-video md:aspect-21/9 overflow-hidden">
                                <Image
                                    src={buildThumbnailUrl(
                                        currentImages[0],
                                        activeType
                                    )}
                                    alt="Latest Earth image"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    unoptimized
                                    priority
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-white/70 text-sm mb-1">
                                                Latest Image
                                            </p>
                                            <p className="text-white text-xl font-bold">
                                                {new Date(
                                                    currentImages[0].date
                                                ).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <span className="glass-button text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Full Size
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Unavailable Notice */}
            {!hasImages && (
                <section className="px-6 pb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="glass-card p-8 text-center border border-yellow-500/20">
                            <div className="text-5xl mb-4">🛰️</div>
                            <h2 className="text-xl font-bold text-white mb-2">
                                Service Temporarily Unavailable
                            </h2>
                            <p className="text-white/60">
                                The EPIC API is currently unavailable. Please
                                try again later.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {hasImages && (
                <>
                    {/* Stats Grid */}
                    <section className="px-6 pb-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatsCard
                                    label="Natural Images"
                                    value={naturalImages.length}
                                    icon="🌍"
                                    gradient="from-green-500 to-emerald-500"
                                    delay={200}
                                />
                                <StatsCard
                                    label="Enhanced Images"
                                    value={enhancedImages.length}
                                    icon="✨"
                                    gradient="from-purple-500 to-pink-500"
                                    delay={300}
                                />
                                <StatsCard
                                    label="Latest Capture"
                                    value={latestDate}
                                    icon="📅"
                                    gradient="from-blue-500 to-cyan-500"
                                    delay={400}
                                />
                                <StatsCard
                                    label="Distance"
                                    value="1.5M km"
                                    icon="🚀"
                                    gradient="from-orange-500 to-red-500"
                                    delay={500}
                                />
                            </div>
                        </div>
                    </section>

                    {/* About EPIC Section */}
                    <section className="px-6 pb-12">
                        <div className="max-w-7xl mx-auto">
                            <div
                                className="glass-card p-8 animate-fade-in-up opacity-0"
                                style={{ animationDelay: '800ms' }}
                            >
                                <h2 className="text-xl font-bold text-white mb-6">
                                    About DSCOVR EPIC
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-white/60 mb-4">
                                            EPIC (Earth Polychromatic Imaging
                                            Camera) is a 4 megapixel CCD camera
                                            and telescope on the DSCOVR (Deep
                                            Space Climate Observatory)
                                            spacecraft.
                                        </p>
                                        <p className="text-white/60">
                                            Located at the Lagrange point 1
                                            (L1), DSCOVR provides a unique view
                                            of the sunlit side of Earth,
                                            capturing images that reveal the
                                            full disk of our planet multiple
                                            times per day.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-xl p-4 text-center">
                                            <div className="text-3xl mb-2">
                                                📍
                                            </div>
                                            <p className="text-white font-semibold">
                                                L1 Point
                                            </p>
                                            <p className="text-white/50 text-xs">
                                                Orbital Position
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 text-center">
                                            <div className="text-3xl mb-2">
                                                📏
                                            </div>
                                            <p className="text-white font-semibold">
                                                1.5M km
                                            </p>
                                            <p className="text-white/50 text-xs">
                                                From Earth
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 text-center">
                                            <div className="text-3xl mb-2">
                                                📷
                                            </div>
                                            <p className="text-white font-semibold">
                                                4 MP
                                            </p>
                                            <p className="text-white/50 text-xs">
                                                CCD Camera
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 text-center">
                                            <div className="text-3xl mb-2">
                                                🌐
                                            </div>
                                            <p className="text-white font-semibold">
                                                Full Disk
                                            </p>
                                            <p className="text-white/50 text-xs">
                                                Earth View
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Type Tabs */}
                    <section className="px-6 pb-8">
                        <div className="max-w-7xl mx-auto">
                            <div
                                className="glass-card p-4 animate-fade-in-up opacity-0"
                                style={{ animationDelay: '600ms' }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setActiveType('natural')
                                            }
                                            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                                activeType === 'natural'
                                                    ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <span>🌍</span>
                                            <span>Natural Color</span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs ${
                                                    activeType === 'natural'
                                                        ? 'bg-white/20'
                                                        : 'bg-white/10'
                                                }`}
                                            >
                                                {naturalImages.length}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveType('enhanced')
                                            }
                                            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                                activeType === 'enhanced'
                                                    ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <span>✨</span>
                                            <span>Enhanced</span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs ${
                                                    activeType === 'enhanced'
                                                        ? 'bg-white/20'
                                                        : 'bg-white/10'
                                                }`}
                                            >
                                                {enhancedImages.length}
                                            </span>
                                        </button>
                                    </div>
                                    <p className="text-white/50 text-sm">
                                        {activeType === 'natural'
                                            ? 'True color images of Earth'
                                            : 'Color enhanced for better visibility'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Image Gallery */}
                    <section className="px-6 pb-12">
                        <div className="max-w-7xl mx-auto">
                            <h2
                                className="text-2xl font-bold text-white mb-6 animate-fade-in-up opacity-0"
                                style={{ animationDelay: '700ms' }}
                            >
                                {activeType === 'natural'
                                    ? 'Natural Color Gallery'
                                    : 'Enhanced Gallery'}
                            </h2>

                            {currentImages.length === 0 ? (
                                <div className="glass-card p-12 text-center">
                                    <div className="text-5xl mb-4">📷</div>
                                    <p className="text-white/60">
                                        No images available for this type
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {currentImages.map((image, idx) => (
                                        <ImageCard
                                            key={image.identifier}
                                            image={image}
                                            type={activeType}
                                            index={idx}
                                            onClick={() =>
                                                setSelectedImage(image)
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* Image Modal */}
            {selectedImage && (
                <ImageModal
                    image={selectedImage}
                    type={activeType}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    )
}
