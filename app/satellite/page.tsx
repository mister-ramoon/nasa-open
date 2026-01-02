// Import Constants and services
import { SATELLITE_Constants } from '@/lib/constants/satellite.constant'
import {
    getObservatories,
    getActiveObservatories,
    getGroundStations,
    getPopularSatellites,
} from '@/lib/services/satellite.service'

export default async function SatellitePage() {
    // Fetch observatories and ground stations in parallel
    const [allObservatories, activeObservatories, groundStations] =
        await Promise.all([
            getObservatories(),
            getActiveObservatories(),
            getGroundStations(),
        ])

    // Determine if data is available
    const hasObservatories = allObservatories && allObservatories.length > 0
    const hasActive = activeObservatories && activeObservatories.length > 0
    const hasGroundStations = groundStations && groundStations.length > 0
    const popularSatellites = getPopularSatellites()

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {SATELLITE_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {SATELLITE_Constants.description}
                </p>
            </div>

            {/* Statistics */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-blue-600">
                            {allObservatories.length}
                        </p>
                        <p className="text-sm text-gray-600">
                            Total Spacecraft
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">
                            {activeObservatories.length}
                        </p>
                        <p className="text-sm text-gray-600">
                            Currently Active
                        </p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-purple-600">
                            {groundStations.length}
                        </p>
                        <p className="text-sm text-gray-600">Ground Stations</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-orange-600">7</p>
                        <p className="text-sm text-gray-600">
                            Coordinate Systems
                        </p>
                    </div>
                </div>
            </section>

            {/* Popular Satellites */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Popular Satellites</h3>
                <div className="flex flex-wrap gap-2">
                    {popularSatellites.map((sat) => (
                        <span
                            key={sat}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-mono"
                        >
                            {sat}
                        </span>
                    ))}
                </div>
            </section>

            {/* Active Observatories */}
            {hasActive && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Active Spacecraft ({activeObservatories.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeObservatories.slice(0, 12).map((obs) => (
                            <div
                                key={obs.Id}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h4 className="font-bold">{obs.Name}</h4>
                                <p className="text-sm text-gray-500 font-mono">
                                    ID: {obs.Id}
                                </p>
                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                    <p>
                                        <span className="font-semibold">
                                            Start:
                                        </span>{' '}
                                        {new Date(
                                            obs.StartTime
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            End:
                                        </span>{' '}
                                        {new Date(
                                            obs.EndTime
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Resolution:
                                        </span>{' '}
                                        {obs.Resolution} min
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Ground Stations */}
            {hasGroundStations && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Ground Stations ({groundStations.length})
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {groundStations.slice(0, 8).map((station) => (
                            <div
                                key={station.Id}
                                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                            >
                                <p className="font-bold text-sm">
                                    {station.Name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {station.Latitude.toFixed(2)}°,{' '}
                                    {station.Longitude.toFixed(2)}°
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Coordinate Systems */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Coordinate Systems</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <div className="border rounded-lg p-4">
                        <p className="font-bold font-mono">GEO</p>
                        <p className="text-sm text-gray-600">Geographic</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="font-bold font-mono">GM</p>
                        <p className="text-sm text-gray-600">Geomagnetic</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="font-bold font-mono">GSE</p>
                        <p className="text-sm text-gray-600">
                            Geocentric Solar Ecliptic
                        </p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="font-bold font-mono">GSM</p>
                        <p className="text-sm text-gray-600">
                            Geocentric Solar Magnetospheric
                        </p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="font-bold font-mono">SM</p>
                        <p className="text-sm text-gray-600">Solar Magnetic</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="font-bold font-mono">GEI_J2000</p>
                        <p className="text-sm text-gray-600">
                            Geocentric Equatorial Inertial
                        </p>
                    </div>
                </div>
            </section>

            {/* API Endpoints */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">API Endpoints</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-2 font-mono">
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /observatories - List all spacecraft
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /groundStations - List ground stations
                        </li>
                        <li>
                            <span className="text-green-600">POST</span>{' '}
                            /locations - Get spacecraft locations
                        </li>
                        <li>
                            <span className="text-green-600">POST</span>{' '}
                            /conjunctions - Find satellite conjunctions
                        </li>
                    </ul>
                    <div className="mt-4">
                        <a
                            href="https://sscweb.gsfc.nasa.gov/WebServices/REST/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View Full API Documentation →
                        </a>
                    </div>
                </div>
            </section>

            {/* Example Query */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Example Query</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        <code>
                            {`# Get all observatories
                                curl "https://sscweb.gsfc.nasa.gov/WS/sscr/2/observatories" \\
                                -H "Accept: application/json"

                                # Get spacecraft locations (POST request)
                                curl -X POST "https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations" \\
                                -H "Content-Type: application/json" \\
                                -H "Accept: application/json" \\
                                -d '{"Request": {"TimeInterval": {...}, "Satellites": [...]}}'`}
                        </code>
                    </pre>
                </div>
            </section>
        </div>
    )
}
