import {
    SSD_Constants,
    ORBIT_CLASSES,
    SSD_ENDPOINTS,
} from '@/lib/constants/ssd.constant'
import {
    getUpcomingCloseApproaches,
    processCloseApproaches,
    getRecentFireballs,
    processFireballs,
    getAllSentryObjects,
    getNHATSObjects,
    getCurrentScoutObjects,
    getSSDSummary,
    getSizeCategory,
    safeToFixed,
} from '@/lib/services/ssd.service'

export default async function SsdPage() {
    // Fetch all data in parallel with individual error handling
    const [
        closeApproachesRaw,
        fireballsRaw,
        sentryObjects,
        nhatsResponse,
        scoutObjects,
        summary,
    ] = await Promise.all([
        getUpcomingCloseApproaches(60).catch(() => null),
        getRecentFireballs(365).catch(() => null),
        getAllSentryObjects().catch(() => []),
        getNHATSObjects({ dv: 8 }).catch(() => null),
        getCurrentScoutObjects().catch(() => []),
        getSSDSummary().catch(() => ({
            upcomingApproaches: 0,
            recentFireballs: 0,
            sentryObjects: 0,
            nhatsObjects: 0,
        })),
    ])

    // Process the data safely
    const closeApproaches = closeApproachesRaw
        ? processCloseApproaches(closeApproachesRaw).slice(0, 10)
        : []
    const fireballs = fireballsRaw
        ? processFireballs(fireballsRaw).slice(0, 6)
        : []
    const nhatsObjects = nhatsResponse?.data?.slice(0, 8) || []
    const safeSentryObjects = sentryObjects || []
    const safeScoutObjects = scoutObjects || []

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {SSD_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {SSD_Constants.description}
                </p>
            </div>

            {/* Summary Statistics */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4 text-center bg-blue-50">
                        <p className="text-3xl font-bold text-blue-600">
                            {summary.upcomingApproaches || '—'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Close Approaches (60 days)
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center bg-orange-50">
                        <p className="text-3xl font-bold text-orange-600">
                            {summary.recentFireballs || '—'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Fireballs (1 year)
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center bg-red-50">
                        <p className="text-3xl font-bold text-red-600">
                            {summary.sentryObjects || '—'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Sentry Monitored
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center bg-green-50">
                        <p className="text-3xl font-bold text-green-600">
                            {summary.nhatsObjects || '—'}
                        </p>
                        <p className="text-sm text-gray-600">Accessible NEOs</p>
                    </div>
                </div>
            </section>

            {/* Upcoming Close Approaches */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Upcoming Close Approaches
                </h3>
                {closeApproaches.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2 text-left">
                                        Object
                                    </th>
                                    <th className="border p-2 text-left">
                                        Date
                                    </th>
                                    <th className="border p-2 text-right">
                                        Distance (LD)
                                    </th>
                                    <th className="border p-2 text-right">
                                        Velocity (km/s)
                                    </th>
                                    <th className="border p-2 text-left">
                                        Size
                                    </th>
                                    <th className="border p-2 text-center">
                                        PHA
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {closeApproaches.map((ca, index) => (
                                    <tr
                                        key={`${ca.name}-${index}`}
                                        className={
                                            ca.isPHA
                                                ? 'bg-red-50'
                                                : 'hover:bg-gray-50'
                                        }
                                    >
                                        <td className="border p-2 font-mono text-sm">
                                            {ca.name}
                                        </td>
                                        <td className="border p-2 text-sm">
                                            {ca.date.toLocaleDateString()}
                                        </td>
                                        <td className="border p-2 text-right text-sm">
                                            {ca.distance_ld.toFixed(1)}
                                        </td>
                                        <td className="border p-2 text-right text-sm">
                                            {ca.velocity_km_s.toFixed(1)}
                                        </td>
                                        <td className="border p-2 text-sm">
                                            {getSizeCategory(ca.magnitude)}
                                        </td>
                                        <td className="border p-2 text-center">
                                            {ca.isPHA ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                    PHA
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        Data temporarily unavailable. Please try again later.
                    </div>
                )}
            </section>

            {/* Recent Fireballs */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Recent Fireballs</h3>
                {fireballs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {fireballs.map((fb, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="font-bold">
                                        {fb.date.toLocaleDateString()}
                                    </p>
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                        {fb.energy_kt.toFixed(2)} kt
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                    {fb.location && (
                                        <p>
                                            Location:{' '}
                                            {fb.location.lat?.toFixed(1)}°,{' '}
                                            {fb.location.lon?.toFixed(1)}°
                                        </p>
                                    )}
                                    {fb.altitude_km && (
                                        <p>
                                            Altitude:{' '}
                                            {fb.altitude_km.toFixed(1)} km
                                        </p>
                                    )}
                                    {fb.velocity_km_s && (
                                        <p>
                                            Velocity:{' '}
                                            {fb.velocity_km_s.toFixed(1)} km/s
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        Data temporarily unavailable. Please try again later.
                    </div>
                )}
            </section>

            {/* Sentry Objects */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Sentry Risk Monitoring
                    {safeSentryObjects.length > 0 &&
                        ` (${safeSentryObjects.length} objects)`}
                </h3>
                {safeSentryObjects.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {safeSentryObjects.slice(0, 6).map((obj, index) => (
                            <div
                                key={obj.id || index}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="font-bold font-mono">
                                        {obj.des}
                                    </p>
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${
                                            parseInt(obj.ts) > 0
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        TS: {obj.ts}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {obj.fullname}
                                </p>
                                <div className="mt-2 text-xs text-gray-500 space-y-1">
                                    <p>Impact prob: {obj.ip}</p>
                                    <p>Palermo scale: {obj.ps}</p>
                                    <p>Potential impacts: {obj.n_imp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        Data temporarily unavailable. Please try again later.
                    </div>
                )}
            </section>

            {/* NHATS Objects */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Human-Accessible NEOs (NHATS)
                </h3>
                {nhatsObjects.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {nhatsObjects.map((obj, index) => (
                            <div
                                key={obj.des || index}
                                className="border rounded-lg p-3 hover:bg-green-50 transition-colors"
                            >
                                <p className="font-bold font-mono text-sm">
                                    {obj.des}
                                </p>
                                <div className="mt-2 text-xs text-gray-600 space-y-1">
                                    <p>
                                        ΔV:{' '}
                                        <strong>
                                            {safeToFixed(obj.min_dv)} km/s
                                        </strong>
                                    </p>
                                    <p>
                                        Min duration:{' '}
                                        {safeToFixed(obj.min_dur, 0)} days
                                    </p>
                                    <p>
                                        Viable trajectories:{' '}
                                        {obj.n_via_traj ?? '—'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        Data temporarily unavailable. Please try again later.
                    </div>
                )}
            </section>

            {/* Scout Objects */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Scout - NEOCP Objects
                    {safeScoutObjects.length > 0 &&
                        ` (${safeScoutObjects.length})`}
                </h3>
                {safeScoutObjects.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {safeScoutObjects.slice(0, 8).map((obj, index) => (
                            <div
                                key={obj.objectName || index}
                                className="border rounded-lg p-3"
                            >
                                <p className="font-bold font-mono text-sm">
                                    {obj.objectName}
                                </p>
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>NEO Score</span>
                                        <span
                                            className={`font-bold ${
                                                (typeof obj.neoScore ===
                                                'number'
                                                    ? obj.neoScore
                                                    : 0) >= 50
                                                    ? 'text-red-600'
                                                    : 'text-gray-600'
                                            }`}
                                        >
                                            {safeToFixed(obj.neoScore, 0)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${
                                                (typeof obj.neoScore ===
                                                'number'
                                                    ? obj.neoScore
                                                    : 0) >= 50
                                                    ? 'bg-red-500'
                                                    : 'bg-blue-500'
                                            }`}
                                            style={{
                                                width: `${Math.min(
                                                    typeof obj.neoScore ===
                                                        'number'
                                                        ? obj.neoScore
                                                        : 0,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {obj.n_obs ?? '—'} obs,{' '}
                                        {safeToFixed(obj.arc, 1)} day arc
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        No objects currently being tracked or data unavailable.
                    </div>
                )}
            </section>

            {/* API Endpoints */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">API Services</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(SSD_ENDPOINTS).map(([name, endpoint]) => (
                        <div key={name} className="border rounded-lg p-4">
                            <p className="font-bold">{name}</p>
                            <p className="text-sm text-gray-500 font-mono mt-1">
                                {endpoint}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Orbit Classes Reference */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Orbit Classes</h3>
                <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {Object.entries(ORBIT_CLASSES).map(([code, name]) => (
                        <div
                            key={code}
                            className="border rounded p-2 text-sm hover:bg-gray-50"
                        >
                            <span className="font-mono font-bold">{code}</span>
                            <span className="text-gray-600"> - {name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Example Queries */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Example API Calls</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        <code>
                            {`# Close approaches in next 30 days within 0.05 AU
                                    curl "https://ssd-api.jpl.nasa.gov/cad.api?date-min=now&date-max=%2B30&dist-max=0.05"

                                    # Recent fireballs with energy > 1 kiloton
                                    curl "https://ssd-api.jpl.nasa.gov/fireball.api?energy-min=1"

                                    # Sentry monitored objects
                                    curl "https://ssd-api.jpl.nasa.gov/sentry.api"

                                    # NHATS accessible NEOs with delta-v < 6 km/s
                                    curl "https://ssd-api.jpl.nasa.gov/nhats.api?dv=6"

                                    # Scout NEOCP candidates
                                    curl "https://ssd-api.jpl.nasa.gov/scout.api"`}
                        </code>
                    </pre>
                </div>
            </section>

            {/* Documentation Links */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Documentation</h3>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="https://ssd-api.jpl.nasa.gov/doc/cad.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                        CAD API Docs
                    </a>
                    <a
                        href="https://ssd-api.jpl.nasa.gov/doc/fireball.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors"
                    >
                        Fireball API Docs
                    </a>
                    <a
                        href="https://ssd-api.jpl.nasa.gov/doc/sentry.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                    >
                        Sentry API Docs
                    </a>
                    <a
                        href="https://ssd-api.jpl.nasa.gov/doc/nhats.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                        NHATS API Docs
                    </a>
                    <a
                        href="https://cneos.jpl.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                    >
                        CNEOS Website
                    </a>
                </div>
            </section>
        </div>
    )
}
