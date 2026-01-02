// Import constants and services
import {
    TLE_Constants,
    WELL_KNOWN_SATELLITES,
    SATELLITE_CATEGORIES,
    ORBITAL_REGIMES,
    TLE_AGE_COLORS,
    ORBIT_COLORS,
    COMMON_SEARCHES,
    EARTH_CONSTANTS,
} from '@/lib/constants/tle.constant'
import {
    getRecentTLEs,
    getWellKnownSatellites,
    getTLE,
    parseTLE,
    getOrbitalRegime,
    getTLESummary,
    getTLEAgeStatus,
    formatPeriod,
    formatAltitude,
    formatInclination,
    formatRelativeDate,
    safeToFixed,
    getTLEStats,
} from '@/lib/services/tle.service'

export default async function TlePage() {
    // Fetch data in parallel
    const [recentTLEs, wellKnownTLEs, stats, issTLE] = await Promise.all([
        getRecentTLEs(12).catch(() => []),
        getWellKnownSatellites().catch(() => []),
        getTLEStats().catch(() => ({ totalSatellites: 0, recentUpdates: 0 })),
        getTLE(WELL_KNOWN_SATELLITES.ISS.id).catch(() => null),
    ])

    // Parse ISS TLE for detailed display
    const issParsed = issTLE ? parseTLE(issTLE) : null
    const issRegime = issParsed ? getOrbitalRegime(issParsed) : null

    // Get summaries for well-known satellites
    const wellKnownSummaries = wellKnownTLEs.map((tle) => getTLESummary(tle))

    const hasRecentTLEs = recentTLEs.length > 0
    const hasWellKnown = wellKnownTLEs.length > 0

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {TLE_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {TLE_Constants.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    Data source: {TLE_Constants.dataSource}
                </p>
            </div>

            {/* Quick Stats */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Database Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center bg-blue-50">
                        <p className="text-3xl font-bold text-blue-600">
                            {stats.totalSatellites.toLocaleString() || '—'}
                        </p>
                        <p className="text-sm text-gray-600">Tracked Objects</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center bg-green-50">
                        <p className="text-3xl font-bold text-green-600">
                            Daily
                        </p>
                        <p className="text-sm text-gray-600">
                            Update Frequency
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center bg-purple-50">
                        <p className="text-3xl font-bold text-purple-600">
                            {Object.keys(WELL_KNOWN_SATELLITES).length}
                        </p>
                        <p className="text-sm text-gray-600">
                            Featured Satellites
                        </p>
                    </div>
                </div>
            </section>

            {/* ISS Spotlight */}
            {issTLE && issParsed && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        🛰️ ISS - International Space Station
                    </h3>
                    <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Orbital Parameters */}
                            <div>
                                <h4 className="font-bold text-lg mb-3">
                                    Orbital Parameters
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Perigee:
                                        </span>
                                        <span className="font-mono">
                                            {formatAltitude(issParsed.perigee)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Apogee:
                                        </span>
                                        <span className="font-mono">
                                            {formatAltitude(issParsed.apogee)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Period:
                                        </span>
                                        <span className="font-mono">
                                            {formatPeriod(
                                                issParsed.orbitalPeriod
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Inclination:
                                        </span>
                                        <span className="font-mono">
                                            {formatInclination(
                                                issParsed.inclination
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Eccentricity:
                                        </span>
                                        <span className="font-mono">
                                            {issParsed.eccentricity.toFixed(7)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Rev/day:
                                        </span>
                                        <span className="font-mono">
                                            {issParsed.meanMotion.toFixed(8)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Revolutions:
                                        </span>
                                        <span className="font-mono">
                                            {issParsed.revolutionNumber.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* TLE Data */}
                            <div>
                                <h4 className="font-bold text-lg mb-3">
                                    TLE Data
                                </h4>
                                <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                                    <pre className="text-xs text-green-400 font-mono">
                                        <code>
                                            {issTLE.name}
                                            {'\n'}
                                            {issTLE.line1}
                                            {'\n'}
                                            {issTLE.line2}
                                        </code>
                                    </pre>
                                </div>
                                <div className="mt-3 text-xs text-gray-500">
                                    <p>NORAD ID: {issTLE.satelliteId}</p>
                                    <p>
                                        Epoch:{' '}
                                        {issParsed.epochDate.toISOString()}
                                    </p>
                                    <p>
                                        Updated:{' '}
                                        {formatRelativeDate(issTLE.date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Well-Known Satellites */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Featured Satellites</h3>
                {hasWellKnown ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {wellKnownSummaries.map((summary, index) => {
                            const ageColors = TLE_AGE_COLORS[summary.ageStatus]
                            const orbitColors =
                                ORBIT_COLORS[summary.regime] ||
                                ORBIT_COLORS.Other

                            return (
                                <div
                                    key={summary.id || index}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${orbitColors.bg} ${orbitColors.text}`}
                                        >
                                            {summary.regime}
                                        </span>
                                        <span className="text-xs text-gray-500 font-mono">
                                            #{summary.id}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-sm mt-2 line-clamp-1">
                                        {summary.name}
                                    </h4>
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">
                                                Period:
                                            </span>
                                            <span className="ml-1 font-mono">
                                                {summary.period}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Inc:
                                            </span>
                                            <span className="ml-1 font-mono">
                                                {summary.inclination}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Perigee:
                                            </span>
                                            <span className="ml-1 font-mono">
                                                {summary.perigee}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Apogee:
                                            </span>
                                            <span className="ml-1 font-mono">
                                                {summary.apogee}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded ${ageColors.bg} ${ageColors.text}`}
                                        >
                                            {summary.age}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        Data temporarily unavailable. Please try again later.
                    </div>
                )}
            </section>

            {/* Recently Updated TLEs */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Recently Updated</h3>
                {hasRecentTLEs ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2 text-left">
                                        Satellite
                                    </th>
                                    <th className="border p-2 text-center">
                                        NORAD ID
                                    </th>
                                    <th className="border p-2 text-center">
                                        Orbit
                                    </th>
                                    <th className="border p-2 text-right">
                                        Period
                                    </th>
                                    <th className="border p-2 text-right">
                                        Perigee
                                    </th>
                                    <th className="border p-2 text-right">
                                        Apogee
                                    </th>
                                    <th className="border p-2 text-left">
                                        Updated
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTLEs.map((tle, index) => {
                                    const summary = getTLESummary(tle)
                                    const orbitColors =
                                        ORBIT_COLORS[summary.regime] ||
                                        ORBIT_COLORS.Other
                                    const ageColors =
                                        TLE_AGE_COLORS[summary.ageStatus]

                                    return (
                                        <tr
                                            key={tle.satelliteId || index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border p-2 text-sm max-w-[200px] truncate">
                                                {tle.name}
                                            </td>
                                            <td className="border p-2 text-center text-sm font-mono">
                                                {tle.satelliteId}
                                            </td>
                                            <td className="border p-2 text-center">
                                                <span
                                                    className={`px-2 py-0.5 text-xs rounded ${orbitColors.bg} ${orbitColors.text}`}
                                                >
                                                    {summary.regime}
                                                </span>
                                            </td>
                                            <td className="border p-2 text-right text-sm font-mono">
                                                {summary.period}
                                            </td>
                                            <td className="border p-2 text-right text-sm font-mono">
                                                {summary.perigee}
                                            </td>
                                            <td className="border p-2 text-right text-sm font-mono">
                                                {summary.apogee}
                                            </td>
                                            <td className="border p-2">
                                                <span
                                                    className={`px-2 py-0.5 text-xs rounded ${ageColors.bg} ${ageColors.text}`}
                                                >
                                                    {summary.age}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        Data temporarily unavailable. Please try again later.
                    </div>
                )}
            </section>

            {/* Orbital Regimes */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Orbital Regimes</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(ORBITAL_REGIMES).map(([key, regime]) => {
                        const colors =
                            ORBIT_COLORS[key as keyof typeof ORBIT_COLORS] ||
                            ORBIT_COLORS.Other
                        return (
                            <div
                                key={key}
                                className={`border rounded-lg p-4 ${colors.bg}`}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold ${colors.text}`}>
                                        {regime.name}
                                    </h4>
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${colors.bg} ${colors.text} border`}
                                    >
                                        {key}
                                    </span>
                                </div>
                                {'altitudeMin' in regime &&
                                    'altitudeMax' in regime && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            Altitude:{' '}
                                            {regime.altitudeMin.toLocaleString()}{' '}
                                            -{' '}
                                            {regime.altitudeMax.toLocaleString()}{' '}
                                            km
                                        </p>
                                    )}
                                {'periodMin' in regime &&
                                    'periodMax' in regime && (
                                        <p className="text-sm text-gray-600">
                                            Period: {regime.periodMin} -{' '}
                                            {regime.periodMax} min
                                        </p>
                                    )}
                                {'description' in regime && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        {regime.description}
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* TLE Format Explanation */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">TLE Format</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-4">
                        A Two-Line Element Set (TLE) is a data format encoding
                        orbital elements of an Earth-orbiting object for a given
                        point in time (the Epoch).
                    </p>
                    <div className="bg-gray-900 rounded p-4 overflow-x-auto">
                        <pre className="text-xs text-green-400 font-mono">
                            <code>{`ISS (ZARYA)             
1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9025
2 25544  51.6416 208.8186 0006703  35.2587  45.1481 15.49066938480479`}</code>
                        </pre>
                    </div>
                    <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h5 className="font-bold mb-2">Line 1 Contains:</h5>
                            <ul className="text-gray-600 space-y-1 text-xs">
                                <li>• Satellite catalog number</li>
                                <li>• Classification (U=Unclassified)</li>
                                <li>• International designator</li>
                                <li>• Epoch (year + day of year)</li>
                                <li>• First derivative of mean motion</li>
                                <li>• Second derivative of mean motion</li>
                                <li>• BSTAR drag term</li>
                                <li>• Element set number</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-2">Line 2 Contains:</h5>
                            <ul className="text-gray-600 space-y-1 text-xs">
                                <li>• Inclination (degrees)</li>
                                <li>• Right ascension of ascending node</li>
                                <li>• Eccentricity</li>
                                <li>• Argument of perigee (degrees)</li>
                                <li>• Mean anomaly (degrees)</li>
                                <li>• Mean motion (revolutions/day)</li>
                                <li>• Revolution number at epoch</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Common Searches */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Common Searches</h3>
                <div className="flex flex-wrap gap-2">
                    {COMMON_SEARCHES.map((term) => (
                        <span
                            key={term}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                        >
                            {term}
                        </span>
                    ))}
                </div>
            </section>

            {/* Satellite Categories */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Satellite Categories
                </h3>
                <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {Object.entries(SATELLITE_CATEGORIES).map(([key, name]) => (
                        <div
                            key={key}
                            className="border rounded p-2 text-sm hover:bg-gray-50"
                        >
                            <span className="font-mono text-blue-600">
                                {key}
                            </span>
                            <span className="text-gray-600 ml-2">- {name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* API Endpoints */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">API Endpoints</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-2 font-mono">
                        <li>
                            <span className="text-blue-600">GET</span> /api/tle
                            - List all TLEs
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /api/tle?search=&#123;query&#125; - Search by
                            satellite name
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /api/tle/&#123;id&#125; - Get TLE by NORAD catalog
                            number
                        </li>
                    </ul>
                </div>
            </section>

            {/* Example API Calls */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Example API Calls</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        <code>{`# List all TLEs (paginated)
curl "https://tle.ivanstanojevic.me/api/tle"

# Search for ISS
curl "https://tle.ivanstanojevic.me/api/tle?search=ISS"

# Get ISS TLE by NORAD ID
curl "https://tle.ivanstanojevic.me/api/tle/25544"

# Search with pagination
curl "https://tle.ivanstanojevic.me/api/tle?search=STARLINK&page=1&page-size=50"

# Sort by date (newest first)
curl "https://tle.ivanstanojevic.me/api/tle?sort=date&sort-dir=desc"`}</code>
                    </pre>
                </div>
            </section>

            {/* Earth Constants */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Earth Constants (for calculations)
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <div className="border rounded-lg p-3">
                        <p className="font-bold">Equatorial Radius</p>
                        <p className="text-sm text-gray-600 font-mono">
                            {EARTH_CONSTANTS.RADIUS_KM.toLocaleString()} km
                        </p>
                    </div>
                    <div className="border rounded-lg p-3">
                        <p className="font-bold">Gravitational Parameter (μ)</p>
                        <p className="text-sm text-gray-600 font-mono">
                            {EARTH_CONSTANTS.MU.toLocaleString()} km³/s²
                        </p>
                    </div>
                    <div className="border rounded-lg p-3">
                        <p className="font-bold">J2 Coefficient</p>
                        <p className="text-sm text-gray-600 font-mono">
                            {EARTH_CONSTANTS.J2}
                        </p>
                    </div>
                </div>
            </section>

            {/* Resources */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Resources</h3>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="https://tle.ivanstanojevic.me/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                        TLE API Documentation
                    </a>
                    <a
                        href="https://celestrak.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                        CelesTrak
                    </a>
                    <a
                        href="https://www.space-track.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                    >
                        Space-Track.org
                    </a>
                    <a
                        href="https://en.wikipedia.org/wiki/Two-line_element_set"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                    >
                        TLE Format (Wikipedia)
                    </a>
                </div>
            </section>
        </div>
    )
}
