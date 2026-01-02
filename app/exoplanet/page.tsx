// Import constants and services
import { EXOPLANET_Constants } from '@/lib/constants/exoplanet.constant'
import {
    getConfirmedExoplanets,
    getDiscoveryStats,
    getHabitableExoplanets,
} from '@/lib/services/exoplanet.service'

export default async function ExoplanetPage() {
    // Fetch data in parallel
    const [exoplanets, stats, habitableExoplanets] = await Promise.all([
        getConfirmedExoplanets(20),
        getDiscoveryStats(),
        getHabitableExoplanets(10),
    ])

    // Check data availability
    const hasExoplanets = exoplanets && exoplanets.length > 0
    const hasStats = stats && stats.length > 0

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {EXOPLANET_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {EXOPLANET_Constants.description}
                </p>
            </div>

            {/* Discovery Statistics */}
            {hasStats && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Discovery Methods
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {stats.map((stat, index) => (
                            <div
                                key={`${stat.discoverymethod}-${index}`}
                                className="bg-gray-100 rounded-lg px-4 py-2"
                            >
                                <p className="font-semibold">
                                    {stat.discoverymethod || 'Unknown'}
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stat.count.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Potentially Habitable */}
            {habitableExoplanets && habitableExoplanets.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Potentially Habitable Exoplanets (
                        {habitableExoplanets.length})
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Small rocky planets ({'<'}2 Earth radii) with
                        equilibrium temperatures between 180-310K
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {habitableExoplanets.map((planet, index) => (
                            <div
                                key={`${planet.pl_name}-${index}`}
                                className="border rounded-lg p-4 shadow-sm bg-green-50"
                            >
                                <h4 className="font-bold text-lg">
                                    {planet.pl_name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Host: {planet.hostname}
                                </p>
                                <div className="mt-2 space-y-1 text-sm">
                                    {planet.pl_rade && (
                                        <p>
                                            <span className="font-semibold">
                                                Radius:
                                            </span>{' '}
                                            {planet.pl_rade.toFixed(2)} Earth
                                            radii
                                        </p>
                                    )}
                                    {planet.pl_eqt && (
                                        <p>
                                            <span className="font-semibold">
                                                Temp:
                                            </span>{' '}
                                            {planet.pl_eqt.toFixed(0)} K
                                        </p>
                                    )}
                                    {planet.sy_dist && (
                                        <p>
                                            <span className="font-semibold">
                                                Distance:
                                            </span>{' '}
                                            {planet.sy_dist.toFixed(1)} pc
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Discoveries */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Recent Discoveries ({exoplanets?.length || 0})
                </h3>
                {hasExoplanets ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {exoplanets.map((planet, index) => (
                            <div
                                key={`${planet.pl_name}-${index}`}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h4 className="font-bold text-lg">
                                    {planet.pl_name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Host: {planet.hostname}
                                </p>

                                <div className="mt-2 space-y-1 text-sm">
                                    <p>
                                        <span className="font-semibold">
                                            Discovered:
                                        </span>{' '}
                                        {planet.disc_year}
                                    </p>
                                    <p>
                                        <span className="font-semibold">
                                            Method:
                                        </span>{' '}
                                        {planet.discoverymethod}
                                    </p>
                                    {planet.disc_facility && (
                                        <p>
                                            <span className="font-semibold">
                                                Facility:
                                            </span>{' '}
                                            {planet.disc_facility}
                                        </p>
                                    )}
                                    {planet.pl_orbper && (
                                        <p>
                                            <span className="font-semibold">
                                                Orbital Period:
                                            </span>{' '}
                                            {planet.pl_orbper.toFixed(2)} days
                                        </p>
                                    )}
                                    {planet.pl_rade && (
                                        <p>
                                            <span className="font-semibold">
                                                Radius:
                                            </span>{' '}
                                            {planet.pl_rade.toFixed(2)} Earth
                                            radii
                                        </p>
                                    )}
                                    {planet.pl_bmasse && (
                                        <p>
                                            <span className="font-semibold">
                                                Mass:
                                            </span>{' '}
                                            {planet.pl_bmasse.toFixed(2)} Earth
                                            masses
                                        </p>
                                    )}
                                    {planet.sy_dist && (
                                        <p>
                                            <span className="font-semibold">
                                                Distance:
                                            </span>{' '}
                                            {planet.sy_dist.toFixed(1)} parsecs
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">
                            Unable to load exoplanet data. Please try again
                            later.
                        </p>
                    </div>
                )}
            </section>
        </div>
    )
}
