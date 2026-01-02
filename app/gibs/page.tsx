// Import constants and services
import { GIBS_Constants } from '@/lib/constants/gibs.constant'
import {
    getPopularLayers,
    getCategories,
    buildThumbnailUrl,
    buildRegionalImageUrl,
    getYesterdayDate,
} from '@/lib/services/gibs.service'

// Import Next.js Image component
import Image from 'next/image'

export default function GibsPage() {
    // Fetch popular layers and categories
    const layers = getPopularLayers()
    const categories = getCategories()
    const yesterday = getYesterdayDate()

    // Featured layers for display
    const featuredLayers = [
        'MODIS_Terra_CorrectedReflectance_TrueColor',
        'VIIRS_SNPP_CorrectedReflectance_TrueColor',
        'BlueMarble_NextGeneration',
    ]

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {GIBS_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {GIBS_Constants.description}
                </p>
            </div>

            {/* Featured Global Views */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Global Views - {yesterday}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {featuredLayers.map((layerId) => {
                        const layer = layers.find((l) => l.id === layerId)
                        if (!layer) return null

                        return (
                            <div
                                key={layerId}
                                className="border rounded-lg overflow-hidden shadow-sm"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={buildThumbnailUrl(
                                            layerId,
                                            yesterday
                                        )}
                                        alt={layer.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold">{layer.title}</h4>
                                    <p className="text-sm text-gray-600">
                                        {layer.description}
                                    </p>
                                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs rounded">
                                        {layer.category}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Categories */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <span
                            key={category}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            </section>

            {/* All Available Layers */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Available Layers ({layers.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {layers.map((layer) => (
                        <div
                            key={layer.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h4 className="font-bold text-sm">{layer.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">
                                {layer.description}
                            </p>
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs rounded">
                                {layer.category}
                            </span>
                            <div className="mt-3">
                                <a
                                    href={buildThumbnailUrl(
                                        layer.id,
                                        yesterday
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs"
                                >
                                    View Image →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Usage Info */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">API Usage</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 mb-2">
                        GIBS provides imagery through WMTS and WMS protocols:
                    </p>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>
                            <strong>WMTS:</strong> Tiled imagery for web maps
                        </li>
                        <li>
                            <strong>WMS:</strong> Custom bounding box requests
                        </li>
                        <li>
                            <strong>Projections:</strong> Geographic
                            (EPSG:4326), Web Mercator (EPSG:3857), Polar
                        </li>
                        <li>
                            <strong>Formats:</strong> PNG, JPEG, GeoTIFF
                        </li>
                    </ul>
                    <div className="mt-4">
                        <a
                            href="https://nasa-gibs.github.io/gibs-api-docs/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View Full API Documentation →
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
