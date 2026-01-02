// Import Constants and services
import { INSIGHT_Constants } from '@/lib/constants/insight.constant'
import {
    getProcessedSols,
    fahrenheitToCelsius,
    checkDataAvailability,
} from '@/lib/services/insight.service'

export default async function InsightPage() {
    // Fetch sols and availability in parallel
    const [sols, availability] = await Promise.all([
        getProcessedSols(),
        checkDataAvailability(),
    ])

    // Check if there are any sols available
    const hasSols = sols && sols.length > 0

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {INSIGHT_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {INSIGHT_Constants.description}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Location: {INSIGHT_Constants.location}
                </p>
            </div>

            {/* Mission Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                    <span className="font-semibold">Notice:</span>{' '}
                    {INSIGHT_Constants.notice}
                </p>
            </div>

            {/* Data Availability */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Data Status</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-bold">
                                {availability.available ? (
                                    <span className="text-green-600">
                                        Available
                                    </span>
                                ) : (
                                    <span className="text-red-600">
                                        Unavailable
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Sols Available
                            </p>
                            <p className="font-bold">{availability.solCount}</p>
                        </div>
                        {availability.oldestSol && (
                            <div>
                                <p className="text-sm text-gray-500">
                                    Oldest Sol
                                </p>
                                <p className="font-bold">
                                    {availability.oldestSol}
                                </p>
                            </div>
                        )}
                        {availability.newestSol && (
                            <div>
                                <p className="text-sm text-gray-500">
                                    Newest Sol
                                </p>
                                <p className="font-bold">
                                    {availability.newestSol}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Weather Data */}
            {hasSols ? (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Mars Weather by Sol ({sols.length} days)
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {sols.map((sol) => (
                            <div
                                key={sol.sol}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="text-2xl font-bold">
                                            Sol {sol.sol}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {sol.earthDate}
                                        </p>
                                    </div>
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                        {sol.season}
                                    </span>
                                </div>

                                {/* Temperature */}
                                {sol.temperature ? (
                                    <div className="mb-3 p-3 bg-blue-50 rounded">
                                        <p className="text-sm font-semibold text-blue-800 mb-1">
                                            🌡️ Temperature
                                        </p>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Low
                                                </p>
                                                <p className="font-bold text-blue-600">
                                                    {fahrenheitToCelsius(
                                                        sol.temperature.min
                                                    )}
                                                    °C
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Avg
                                                </p>
                                                <p className="font-bold">
                                                    {fahrenheitToCelsius(
                                                        sol.temperature.average
                                                    )}
                                                    °C
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    High
                                                </p>
                                                <p className="font-bold text-red-600">
                                                    {fahrenheitToCelsius(
                                                        sol.temperature.max
                                                    )}
                                                    °C
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-3 p-3 bg-gray-50 rounded">
                                        <p className="text-sm text-gray-400">
                                            🌡️ Temperature data unavailable
                                        </p>
                                    </div>
                                )}

                                {/* Pressure */}
                                {sol.pressure ? (
                                    <div className="mb-3 p-3 bg-green-50 rounded">
                                        <p className="text-sm font-semibold text-green-800 mb-1">
                                            📊 Pressure
                                        </p>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Low
                                                </p>
                                                <p className="font-bold">
                                                    {sol.pressure.min} Pa
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Avg
                                                </p>
                                                <p className="font-bold">
                                                    {sol.pressure.average} Pa
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    High
                                                </p>
                                                <p className="font-bold">
                                                    {sol.pressure.max} Pa
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-3 p-3 bg-gray-50 rounded">
                                        <p className="text-sm text-gray-400">
                                            📊 Pressure data unavailable
                                        </p>
                                    </div>
                                )}

                                {/* Wind */}
                                {sol.windSpeed ? (
                                    <div className="p-3 bg-purple-50 rounded">
                                        <p className="text-sm font-semibold text-purple-800 mb-1">
                                            💨 Wind
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Speed
                                                </p>
                                                <p className="font-bold">
                                                    {sol.windSpeed.average}{' '}
                                                    {sol.windSpeed.unit}
                                                </p>
                                            </div>
                                            {sol.windDirection && (
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">
                                                        Direction
                                                    </p>
                                                    <p className="font-bold">
                                                        {
                                                            sol.windDirection
                                                                .mostCommon
                                                        }{' '}
                                                        (
                                                        {
                                                            sol.windDirection
                                                                .degrees
                                                        }
                                                        °)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded">
                                        <p className="text-sm text-gray-400">
                                            💨 Wind data unavailable
                                        </p>
                                    </div>
                                )}

                                <p className="text-xs text-gray-400 mt-3">
                                    Last updated: {sol.lastUpdated}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-600">
                        No weather data currently available from InSight.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        The InSight mission ended in December 2022. Historical
                        data may still be available.
                    </p>
                    <a
                        href="https://mars.nasa.gov/insight/weather/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mt-4 inline-block"
                    >
                        View Mars Weather on NASA.gov →
                    </a>
                </div>
            )}

            {/* Additional Info */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">About the Data</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li>
                            <strong>Sol:</strong> A Martian day, approximately
                            24 hours and 39 minutes.
                        </li>
                        <li>
                            <strong>Temperature:</strong> Measured in Fahrenheit
                            by the sensor, converted to Celsius for display.
                        </li>
                        <li>
                            <strong>Pressure:</strong> Measured in Pascals. Mars
                            atmospheric pressure is about 1% of Earth&apos;s.
                        </li>
                        <li>
                            <strong>Wind:</strong> Horizontal wind speed and
                            prevailing direction.
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
