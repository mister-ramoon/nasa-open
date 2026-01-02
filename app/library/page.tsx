// Import constants and services
import {
    LIBRARY_Constants,
    NASA_CENTERS,
    POPULAR_SEARCHES,
} from '@/lib/constants/library.constant'
import {
    searchAndProcess,
    getFeaturedContent,
} from '@/lib/services/library.service'

// Import Image component
import Image from 'next/image'

export default async function LibraryPage() {
    // Fetch featured content and recent images
    const [featured, recentMars, recentMoon] = await Promise.all([
        getFeaturedContent(),
        searchAndProcess({ q: 'Mars', media_type: 'image', page_size: 6 }),
        searchAndProcess({ q: 'Moon', media_type: 'image', page_size: 6 }),
    ])

    // Check if featured content exists
    const hasFeatured = featured && featured.length > 0

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {LIBRARY_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {LIBRARY_Constants.description}
                </p>
            </div>

            {/* Popular Searches */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                        <span
                            key={term}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                        >
                            {term}
                        </span>
                    ))}
                </div>
            </section>

            {/* Featured Content */}
            {hasFeatured && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Featured Content
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {featured.slice(0, 6).map((item, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {item.thumbnailUrl && (
                                    <div className="relative h-48">
                                        <Image
                                            src={item.thumbnailUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        <span className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                            {item.mediaType}
                                        </span>
                                    </div>
                                )}
                                <div className="p-4">
                                    <h4 className="font-bold text-sm line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.center} •{' '}
                                        {new Date(
                                            item.dateCreated
                                        ).toLocaleDateString()}
                                    </p>
                                    {item.description && (
                                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Mars Images */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Mars Images</h3>
                    <span className="text-sm text-gray-500">
                        {recentMars.totalHits.toLocaleString()} results
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentMars.items.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {item.thumbnailUrl && (
                                <div className="relative h-40">
                                    <Image
                                        src={item.thumbnailUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className="p-3">
                                <h4 className="font-bold text-sm line-clamp-1">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {new Date(
                                        item.dateCreated
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Moon Images */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">Moon Images</h3>
                    <span className="text-sm text-gray-500">
                        {recentMoon.totalHits.toLocaleString()} results
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recentMoon.items.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {item.thumbnailUrl && (
                                <div className="relative h-40">
                                    <Image
                                        src={item.thumbnailUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <div className="p-3">
                                <h4 className="font-bold text-sm line-clamp-1">
                                    {item.title}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {new Date(
                                        item.dateCreated
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* NASA Centers */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">NASA Centers</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {NASA_CENTERS.map((center) => (
                        <div
                            key={center.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <p className="font-bold">{center.id}</p>
                            <p className="text-sm text-gray-600">
                                {center.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* API Info */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">API Endpoints</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-2 font-mono">
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /search?q=&#123;query&#125; - Search the library
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /asset/&#123;nasa_id&#125; - Get asset manifest
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /metadata/&#123;nasa_id&#125; - Get metadata
                            location
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /captions/&#123;nasa_id&#125; - Get video captions
                        </li>
                    </ul>
                    <div className="mt-4">
                        <a
                            href="https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf"
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
