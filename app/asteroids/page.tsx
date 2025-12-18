// Import Types
import type { Asteroid } from '@/lib/types/asteroid.type'

// Import Services
import { getAsteroidFeed } from '@/lib/services/asteroid.service'

// Import Constants
import { ASTEROIDS_Constants } from '@/lib/constants/asteroids.constant'

export default async function AsteroidsPage() {
    // Get today's date and 7 days ago
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    // Format dates to YYYY-MM-DD
    const startDate = sevenDaysAgo.toISOString().split('T')[0]
    const endDate = today.toISOString().split('T')[0]

    // Fetch asteroid data
    const data = await getAsteroidFeed({
        start_date: startDate,
        end_date: endDate,
    })

    // Get all asteroids from all dates
    const allAsteroids: Asteroid[] = Object.values(
        data.near_earth_objects
    ).flat()

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {ASTEROIDS_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {ASTEROIDS_Constants.description}
                </p>
            </div>

            <div className="mb-4">
                <p className="text-lg font-semibold">
                    Showing {data.element_count} asteroids from {startDate} to{' '}
                    {endDate}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allAsteroids.map((asteroid) => (
                    <div
                        key={asteroid.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="text-xl font-bold mb-2">
                            {asteroid.name}
                        </h3>

                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-semibold">ID:</span>{' '}
                                {asteroid.id}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Absolute Magnitude:
                                </span>{' '}
                                {asteroid.absolute_magnitude_h}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Estimated Diameter:
                                </span>{' '}
                                {asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(
                                    2
                                )}{' '}
                                -{' '}
                                {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(
                                    2
                                )}{' '}
                                m
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Potentially Hazardous:
                                </span>{' '}
                                <span
                                    className={
                                        asteroid.is_potentially_hazardous_asteroid
                                            ? 'text-red-600 font-bold'
                                            : 'text-green-600'
                                    }
                                >
                                    {asteroid.is_potentially_hazardous_asteroid
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </p>

                            {asteroid.close_approach_data.length > 0 && (
                                <div className="mt-3 pt-3 border-t">
                                    <p className="font-semibold mb-1">
                                        Close Approach:
                                    </p>
                                    <p>
                                        Date:{' '}
                                        {
                                            asteroid.close_approach_data[0]
                                                .close_approach_date
                                        }
                                    </p>
                                    <p>
                                        Velocity:{' '}
                                        {parseFloat(
                                            asteroid.close_approach_data[0]
                                                .relative_velocity
                                                .kilometers_per_hour
                                        ).toFixed(2)}{' '}
                                        km/h
                                    </p>
                                    <p>
                                        Miss Distance:{' '}
                                        {parseFloat(
                                            asteroid.close_approach_data[0]
                                                .miss_distance.kilometers
                                        ).toFixed(2)}{' '}
                                        km
                                    </p>
                                </div>
                            )}
                        </div>

                        <a
                            href={asteroid.nasa_jpl_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block text-blue-600 hover:underline text-sm"
                        >
                            View on NASA JPL →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}
