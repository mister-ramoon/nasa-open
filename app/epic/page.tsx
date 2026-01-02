// Import Constants and services
import { EPIC_Constants } from '@/lib/constants/epic.constant'
import {
    getNaturalImages,
    getEnhancedImages,
    buildImageUrl,
    buildThumbnailUrl,
} from '@/lib/services/epic.service'

// Import Next.js Image component
import Image from 'next/image'

export default async function EpicPage() {
    // Fetch natural and enhanced images in parallel
    const [naturalImages, enhancedImages] = await Promise.all([
        getNaturalImages(),
        getEnhancedImages(),
    ])

    const hasNaturalImages = naturalImages && naturalImages.length > 0
    const hasEnhancedImages = enhancedImages && enhancedImages.length > 0

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {EPIC_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {EPIC_Constants.description}
                </p>
            </div>

            {/* Service Unavailable Notice */}
            {!hasNaturalImages && !hasEnhancedImages && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800">
                        <span className="font-semibold">Notice:</span> The EPIC
                        API is currently unavailable. Please try again later.
                    </p>
                </div>
            )}

            {/* Natural Color Images */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Natural Color Images ({naturalImages?.length || 0})
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Most recent imagery from DSCOVR EPIC
                </p>
                {hasNaturalImages ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {naturalImages.slice(0, 6).map((image) => (
                            <div
                                key={image.identifier}
                                className="border rounded-lg p-4 shadow-sm"
                            >
                                <div className="relative aspect-square mb-3">
                                    <Image
                                        src={buildThumbnailUrl(
                                            image,
                                            'natural'
                                        )}
                                        alt={image.caption}
                                        fill
                                        className="object-cover rounded-lg"
                                        unoptimized
                                    />
                                </div>

                                <p className="text-sm text-gray-600 mb-2">
                                    {new Date(image.date).toLocaleString()}
                                </p>

                                <div className="text-xs text-gray-500 space-y-1">
                                    <p>
                                        <span className="font-semibold">
                                            Lat:
                                        </span>{' '}
                                        {image.centroid_coordinates.lat.toFixed(
                                            2
                                        )}
                                        °,{' '}
                                        <span className="font-semibold">
                                            Lon:
                                        </span>{' '}
                                        {image.centroid_coordinates.lon.toFixed(
                                            2
                                        )}
                                        °
                                    </p>
                                </div>

                                <a
                                    href={buildImageUrl(
                                        image,
                                        'natural',
                                        'png'
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                >
                                    View Full Resolution →
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        No images available at this time.
                    </p>
                )}
            </section>

            {/* Enhanced Color Images */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Enhanced Color Images ({enhancedImages.length})
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Color enhanced imagery for better visibility
                </p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {enhancedImages.slice(0, 6).map((image) => (
                        <div
                            key={image.identifier}
                            className="border rounded-lg p-4 shadow-sm"
                        >
                            <div className="relative aspect-square mb-3">
                                <Image
                                    src={buildThumbnailUrl(image, 'enhanced')}
                                    alt={image.caption}
                                    fill
                                    className="object-cover rounded-lg"
                                    unoptimized
                                />
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                                {new Date(image.date).toLocaleString()}
                            </p>

                            <div className="text-xs text-gray-500 space-y-1">
                                <p>
                                    <span className="font-semibold">Lat:</span>{' '}
                                    {image.centroid_coordinates.lat.toFixed(2)}
                                    °,{' '}
                                    <span className="font-semibold">
                                        Lon:
                                    </span>{' '}
                                    {image.centroid_coordinates.lon.toFixed(2)}°
                                </p>
                            </div>

                            <a
                                href={buildImageUrl(image, 'enhanced', 'png')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                            >
                                View Full Resolution →
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
