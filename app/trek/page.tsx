import {
    TREK_Constants,
    TREK_BODIES,
    TREK_PORTAL_URLS,
    TREK_API_DOC_URLS,
    PROJECTIONS,
    ZOOM_LEVELS,
    MOON_MOSAICS,
    MARS_MOSAICS,
    VESTA_MOSAICS,
    MARS_LANDING_SITES,
    MOON_LANDING_SITES,
    TREK_BASE_URLS,
} from '@/lib/constants/trek.constant'
import {
    getTrekStats,
    getFeaturedMosaics,
    getGlobalMosaics,
    buildTileUrlFromPreset,
    getBodyColorClasses,
    formatCoordinates,
    getWMTSUrlTemplate,
    getSampleTileUrls,
    truncateDescription,
    getBaseTileUrls,
    getMosaicsByBody,
    getLandingSitesByBody,
} from '@/lib/services/trek.service'
import type { TrekBody, MosaicPreset } from '@/lib/types/trek.type'

export default function TrekPage() {
    // Get statistics
    const stats = getTrekStats()
    const featuredMosaics = getFeaturedMosaics()
    const globalMosaics = getGlobalMosaics()

    // Get mosaics by body
    const moonMosaics = getMosaicsByBody('moon')
    const marsMosaics = getMosaicsByBody('mars')
    const vestaMosaics = getMosaicsByBody('vesta')

    // Get landing sites
    const moonLandingSites = getLandingSitesByBody('moon')
    const marsLandingSites = getLandingSitesByBody('mars')

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {TREK_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {TREK_Constants.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Data source: {TREK_Constants.dataSource}
                </p>
            </div>

            {/* Quick Stats */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Available Mosaics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(Object.keys(TREK_BODIES) as TrekBody[]).map((body) => {
                        const bodyInfo = TREK_BODIES[body]
                        const colors = getBodyColorClasses(body)
                        const count =
                            body === 'moon'
                                ? stats.moonLayers
                                : body === 'mars'
                                  ? stats.marsLayers
                                  : stats.vestaLayers

                        return (
                            <div
                                key={body}
                                className={`border rounded-lg p-4 text-center ${colors.bg} ${colors.border}`}
                            >
                                <p
                                    className={`text-3xl font-bold ${colors.text}`}
                                >
                                    {count}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {bodyInfo.name}
                                </p>
                                <p className="text-xs text-gray-500">mosaics</p>
                            </div>
                        )
                    })}
                    <div className="border rounded-lg p-4 text-center bg-blue-50 border-blue-200">
                        <p className="text-3xl font-bold text-blue-600">
                            {stats.totalMosaics}
                        </p>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xs text-gray-500">all bodies</p>
                    </div>
                </div>
            </section>

            {/* Celestial Bodies */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Supported Bodies</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {(
                        Object.entries(TREK_BODIES) as [
                            TrekBody,
                            (typeof TREK_BODIES)[TrekBody],
                        ][]
                    ).map(([key, body]) => {
                        const colors = getBodyColorClasses(key)
                        return (
                            <div
                                key={key}
                                className={`border rounded-lg p-4 ${colors.bg} ${colors.border}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4
                                        className={`font-bold text-lg ${colors.text}`}
                                    >
                                        {body.name}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                        {body.radius.toLocaleString()} km
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    {body.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {body.missions
                                        .slice(0, 4)
                                        .map((mission) => (
                                            <span
                                                key={mission}
                                                className="px-2 py-0.5 bg-white text-gray-700 text-xs rounded border"
                                            >
                                                {mission}
                                            </span>
                                        ))}
                                    {body.missions.length > 4 && (
                                        <span className="px-2 py-0.5 text-gray-500 text-xs">
                                            +{body.missions.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Featured Mosaics */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Featured Mosaics</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {featuredMosaics.map((mosaic) => {
                        const colors = getBodyColorClasses(mosaic.body)
                        const tileUrls = getBaseTileUrls(mosaic)

                        return (
                            <div
                                key={mosaic.id}
                                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Tile preview placeholder */}
                                <div className="h-32 bg-gray-200 flex items-center justify-center overflow-hidden">
                                    <div className="flex">
                                        {tileUrls.map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt={`${mosaic.name} tile ${i}`}
                                                className="h-32 w-auto object-cover"
                                                loading="lazy"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${colors.bg} ${colors.text}`}
                                        >
                                            {TREK_BODIES[mosaic.body].name}
                                        </span>
                                        {mosaic.coverage && (
                                            <span className="text-xs text-gray-500">
                                                {mosaic.coverage}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-sm mt-2">
                                        {mosaic.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {truncateDescription(
                                            mosaic.description,
                                            100
                                        )}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {mosaic.instrument && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                                {mosaic.instrument}
                                            </span>
                                        )}
                                        {mosaic.resolution && (
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                                {mosaic.resolution}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Moon Mosaics */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    🌙 Moon Mosaics
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({moonMosaics.length} available)
                    </span>
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {moonMosaics.map((mosaic) => (
                        <MosaicCard key={mosaic.id} mosaic={mosaic} />
                    ))}
                </div>
            </section>

            {/* Mars Mosaics */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    🔴 Mars Mosaics
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({marsMosaics.length} available)
                    </span>
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {marsMosaics.map((mosaic) => (
                        <MosaicCard key={mosaic.id} mosaic={mosaic} />
                    ))}
                </div>
            </section>

            {/* Vesta Mosaics */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    🪨 Vesta Mosaics
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({vestaMosaics.length} available)
                    </span>
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vestaMosaics.map((mosaic) => (
                        <MosaicCard key={mosaic.id} mosaic={mosaic} />
                    ))}
                </div>
            </section>

            {/* Landing Sites - Moon */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Moon Landing Sites</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {moonLandingSites.map((site) => (
                        <div
                            key={site.name}
                            className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm">
                                    {site.mission}
                                </h4>
                                <span className="text-xs text-gray-500">
                                    {site.year}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                {site.name}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mt-1">
                                {formatCoordinates(
                                    site.latitude,
                                    site.longitude
                                )}
                            </p>
                            {site.description && (
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    {site.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Landing Sites - Mars */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Mars Landing Sites</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {marsLandingSites.map((site) => (
                        <div
                            key={site.name}
                            className="border rounded-lg p-3 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm text-red-800">
                                    {site.mission}
                                </h4>
                                <span className="text-xs text-gray-500">
                                    {site.year}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                {site.name}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mt-1">
                                {formatCoordinates(
                                    site.latitude,
                                    site.longitude
                                )}
                            </p>
                            {site.description && (
                                <p className="text-xs text-gray-500 mt-1 italic">
                                    {site.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Projections */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Available Projections
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {Object.entries(PROJECTIONS).map(([key, projection]) => (
                        <div
                            key={key}
                            className="border rounded-lg p-4 bg-blue-50"
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-blue-800">
                                    {projection.name}
                                </h4>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-mono">
                                    {key}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {projection.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Zoom Levels */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Zoom Levels</h3>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                    {Object.entries(ZOOM_LEVELS).map(([name, level]) => (
                        <div
                            key={name}
                            className="border rounded-lg p-3 text-center bg-gray-50"
                        >
                            <p className="text-2xl font-bold text-gray-700">
                                {level}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {name.replace('_', ' ').toLowerCase()}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* WMTS URL Format */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">WMTS URL Format</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-4">
                        The basic URL template for requesting tiles from the
                        WMTS service:
                    </p>
                    <div className="bg-gray-900 rounded p-4 overflow-x-auto">
                        <pre className="text-sm text-green-400 font-mono">
                            <code>{`{BaseURL}/EQ/{Layer}/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{format}

# Variables:
# - BaseURL: https://trek.nasa.gov/tiles/{Body}
# - Layer: Mosaic identifier (e.g., LRO_WAC_Mosaic_Global_303ppd_v02)
# - Style: Usually "default"
# - TileMatrixSet: Usually "default028mm"
# - TileMatrix: Zoom level (0, 1, 2, ...)
# - TileRow: Row index
# - TileCol: Column index
# - format: png or jpg`}</code>
                        </pre>
                    </div>
                </div>
            </section>

            {/* Example Tile URLs */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Example Tile URLs</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        <code>{`# Moon - LRO WAC Global Mosaic (Zoom 0, Tile 0,0)
https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/0/0/0.jpg

# Moon - LRO WAC Global Mosaic (Zoom 0, Tile 0,1)
https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/0/0/1.jpg

# Mars - Viking Color Mosaic (Zoom 1, Tile 0,0)
https://trek.nasa.gov/tiles/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/1/0/0.jpg

# Vesta - Dawn HAMO Global (Zoom 0, Tile 0,0)
https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_FC_HAMO_Mosaic_Global_74ppd/1.0.0/default/default028mm/0/0/0.png`}</code>
                    </pre>
                </div>
            </section>

            {/* Tile Grid Explanation */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Tile Grid System</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-4">
                        For equirectangular projection, each zoom level doubles
                        the number of tiles:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border p-2 text-left">
                                        Zoom Level
                                    </th>
                                    <th className="border p-2 text-center">
                                        Columns
                                    </th>
                                    <th className="border p-2 text-center">
                                        Rows
                                    </th>
                                    <th className="border p-2 text-center">
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
                                            className="hover:bg-gray-100"
                                        >
                                            <td className="border p-2 font-mono">
                                                {zoom}
                                            </td>
                                            <td className="border p-2 text-center font-mono">
                                                {cols}
                                            </td>
                                            <td className="border p-2 text-center font-mono">
                                                {rows}
                                            </td>
                                            <td className="border p-2 text-center font-mono">
                                                {cols * rows}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* API Documentation Links */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">API Documentation</h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {(
                        Object.entries(TREK_API_DOC_URLS) as [
                            TrekBody,
                            string,
                        ][]
                    ).map(([body, url]) => {
                        const colors = getBodyColorClasses(body)
                        return (
                            <a
                                key={body}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`border rounded-lg p-4 ${colors.bg} ${colors.border} hover:shadow-md transition-shadow`}
                            >
                                <h4 className={`font-bold ${colors.text}`}>
                                    {TREK_BODIES[body].name} API
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Complete layer listing and capabilities
                                </p>
                                <p className="text-xs text-blue-600 mt-2">
                                    View Documentation →
                                </p>
                            </a>
                        )
                    })}
                </div>
            </section>

            {/* Portal Links */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Trek Portals</h3>
                <div className="flex flex-wrap gap-3">
                    {(
                        Object.entries(TREK_PORTAL_URLS) as [TrekBody, string][]
                    ).map(([body, url]) => {
                        const colors = getBodyColorClasses(body)
                        return (
                            <a
                                key={body}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-4 py-2 rounded ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}
                            >
                                {TREK_BODIES[body].name} Trek
                            </a>
                        )
                    })}
                    <a
                        href="https://trek.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                        NASA Trek Main Portal
                    </a>
                </div>
            </section>

            {/* WMTS Capabilities Example */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    WMTS Capabilities URLs
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-4">
                        Each mosaic has a WMTS GetCapabilities XML document
                        describing its properties:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-2 font-mono">
                        {featuredMosaics.slice(0, 3).map((mosaic) => (
                            <li key={mosaic.id} className="break-all">
                                <span className="text-gray-500">
                                    {mosaic.name}:
                                </span>
                                <br />
                                <a
                                    href={mosaic.wmtsCapabilitiesUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs"
                                >
                                    {mosaic.wmtsCapabilitiesUrl}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Resources */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Resources</h3>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="https://trek.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                        NASA Trek Portal
                    </a>
                    <a
                        href="https://www.opengeospatial.org/standards/wmts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                        WMTS Standard (OGC)
                    </a>
                    <a
                        href="https://sservi.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                    >
                        NASA SSERVI
                    </a>
                    <a
                        href="https://www.jpl.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors"
                    >
                        JPL
                    </a>
                </div>
            </section>
        </div>
    )
}

// Mosaic Card Component
function MosaicCard({ mosaic }: { mosaic: MosaicPreset }) {
    const colors = getBodyColorClasses(mosaic.body)

    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <span
                    className={`px-2 py-1 text-xs rounded ${colors.bg} ${colors.text}`}
                >
                    {mosaic.coverage || 'Regional'}
                </span>
                {mosaic.format && (
                    <span className="text-xs text-gray-500 font-mono">
                        .{mosaic.format}
                    </span>
                )}
            </div>
            <h4 className="font-bold text-sm mt-2 line-clamp-1">
                {mosaic.name}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {mosaic.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
                {mosaic.instrument && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {mosaic.instrument}
                    </span>
                )}
                {mosaic.resolution && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                        {mosaic.resolution}
                    </span>
                )}
            </div>
            <div className="mt-3 flex gap-2">
                <a
                    href={mosaic.wmtsCapabilitiesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                >
                    WMTS Capabilities
                </a>
                <a
                    href={mosaic.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline"
                >
                    Preview
                </a>
            </div>
        </div>
    )
}
