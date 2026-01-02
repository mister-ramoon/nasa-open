// Import DONKI Constants
import { DONKI_Constants } from '@/lib/constants/donki.constant'

// Import Services
import { getCME, getFLR, getGST } from '@/lib/services/donki.service'

export default async function DonkiPage() {
    // Get dates for last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    // Format dates to YYYY-MM-DD
    const startDate = thirtyDaysAgo.toISOString().split('T')[0]
    const endDate = today.toISOString().split('T')[0]

    // Fetch data in parallel
    const [cmeEvents, flrEvents, gstEvents] = await Promise.all([
        getCME({ startDate, endDate }),
        getFLR({ startDate, endDate }),
        getGST({ startDate, endDate }),
    ])

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {DONKI_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {DONKI_Constants.description}
                </p>
            </div>

            <p className="text-sm text-gray-500 mb-6">
                Showing data from {startDate} to {endDate}
            </p>

            {/* CME Section */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Coronal Mass Ejections ({cmeEvents.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cmeEvents.slice(0, 6).map((event) => (
                        <div
                            key={event.activityID}
                            className="border rounded-lg p-4 shadow-sm"
                        >
                            <p className="font-semibold text-sm">
                                {event.activityID}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Start:{' '}
                                {new Date(event.startTime).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                                Source: {event.sourceLocation || 'N/A'}
                            </p>
                            {event.note && (
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                    {event.note}
                                </p>
                            )}
                            <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                            >
                                View Details →
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Solar Flares Section */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Solar Flares ({flrEvents.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {flrEvents.slice(0, 6).map((event) => (
                        <div
                            key={event.flrID}
                            className="border rounded-lg p-4 shadow-sm"
                        >
                            <p className="font-semibold text-sm">
                                {event.flrID}
                            </p>
                            <p className="text-sm mt-1">
                                <span className="font-medium">Class:</span>{' '}
                                <span
                                    className={
                                        event.classType.startsWith('X')
                                            ? 'text-red-600 font-bold'
                                            : event.classType.startsWith('M')
                                              ? 'text-orange-600 font-bold'
                                              : ''
                                    }
                                >
                                    {event.classType}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Begin:{' '}
                                {new Date(event.beginTime).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                                Peak:{' '}
                                {new Date(event.peakTime).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                                Source: {event.sourceLocation}
                            </p>
                            <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                            >
                                View Details →
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Geomagnetic Storms Section */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Geomagnetic Storms ({gstEvents.length})
                </h3>
                {gstEvents.length === 0 ? (
                    <p className="text-gray-500">
                        No geomagnetic storms recorded in this period.
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {gstEvents.slice(0, 6).map((event) => (
                            <div
                                key={event.gstID}
                                className="border rounded-lg p-4 shadow-sm"
                            >
                                <p className="font-semibold text-sm">
                                    {event.gstID}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Start:{' '}
                                    {new Date(event.startTime).toLocaleString()}
                                </p>
                                {event.allKpIndex &&
                                    event.allKpIndex.length > 0 && (
                                        <p className="text-sm mt-1">
                                            <span className="font-medium">
                                                Max Kp:
                                            </span>{' '}
                                            {Math.max(
                                                ...event.allKpIndex.map(
                                                    (k) => k.kpIndex
                                                )
                                            )}
                                        </p>
                                    )}
                                <a
                                    href={event.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                >
                                    View Details →
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
