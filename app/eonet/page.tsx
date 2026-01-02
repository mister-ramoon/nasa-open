// Import Constants and services
import { EONET_Constants } from '@/lib/constants/eonet.constant'
import { getEvents, getCategories } from '@/lib/services/eonet.service'

export default async function EonetPage() {
    // Fetch events and categories in parallel
    const [eventsData, categoriesData] = await Promise.all([
        getEvents({ status: 'open', limit: 20 }),
        getCategories(),
    ])

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {EONET_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {EONET_Constants.description}
                </p>
            </div>

            {/* Categories */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {categoriesData.categories.map((category) => (
                        <span
                            key={category.id}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                            {category.title}
                        </span>
                    ))}
                </div>
            </section>

            {/* Active Events */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Active Events ({eventsData.events.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {eventsData.events.map((event) => (
                        <div
                            key={event.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h4 className="font-bold text-lg mb-2">
                                {event.title}
                            </h4>

                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="font-semibold">
                                        Category:
                                    </span>{' '}
                                    {event.categories
                                        .map((c) => c.title)
                                        .join(', ')}
                                </p>

                                {event.geometry.length > 0 && (
                                    <>
                                        <p>
                                            <span className="font-semibold">
                                                Last Updated:
                                            </span>{' '}
                                            {new Date(
                                                event.geometry[
                                                    event.geometry.length - 1
                                                ].date
                                            ).toLocaleDateString()}
                                        </p>
                                        {event.geometry[0].magnitudeValue && (
                                            <p>
                                                <span className="font-semibold">
                                                    Magnitude:
                                                </span>{' '}
                                                {
                                                    event.geometry[0]
                                                        .magnitudeValue
                                                }{' '}
                                                {
                                                    event.geometry[0]
                                                        .magnitudeUnit
                                                }
                                            </p>
                                        )}
                                    </>
                                )}

                                <p>
                                    <span className="font-semibold">
                                        Status:
                                    </span>{' '}
                                    <span
                                        className={
                                            event.closed
                                                ? 'text-gray-500'
                                                : 'text-green-600 font-medium'
                                        }
                                    >
                                        {event.closed ? 'Closed' : 'Active'}
                                    </span>
                                </p>

                                {event.sources.length > 0 && (
                                    <p>
                                        <span className="font-semibold">
                                            Sources:
                                        </span>{' '}
                                        {event.sources.length}
                                    </p>
                                )}
                            </div>

                            <div className="mt-3 flex gap-2">
                                <a
                                    href={event.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    View Details →
                                </a>
                                {event.sources.length > 0 && (
                                    <a
                                        href={event.sources[0].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Source →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
