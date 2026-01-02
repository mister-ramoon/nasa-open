// Import constants and services
import {
    OSDR_Constants,
    OSDR_DATA_SOURCES,
    OSDR_ENTITY_TYPES,
} from '@/lib/constants/open.constant'
import {
    searchStudies,
    getAllMissions,
    getFeaturedStudies,
    formatFileSize,
} from '@/lib/services/open.service'

export default async function OpenPage() {
    // Fetch featured studies and missions in parallel
    const [featuredStudies, missions, spaceflightResults] = await Promise.all([
        getFeaturedStudies(),
        getAllMissions(),
        searchStudies({ term: 'mouse', type: 'cgene', size: 6 }),
    ])

    // Check if there are results
    const hasFeatured = featuredStudies && featuredStudies.length > 0
    const hasMissions = missions && missions.length > 0

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {OSDR_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {OSDR_Constants.description}
                </p>
            </div>

            {/* Data Sources */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Data Sources</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(OSDR_DATA_SOURCES).map(([key, name]) => (
                        <div
                            key={key}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                            <p className="font-mono text-sm text-gray-500">
                                {key}
                            </p>
                            <p className="font-bold mt-1">{name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Studies */}
            {hasFeatured && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Featured Spaceflight Studies ({featuredStudies.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {featuredStudies.slice(0, 6).map((study, index) => (
                            <div
                                key={`${study.id}-${index}`}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-mono">
                                        {study.id}
                                    </span>
                                    {study.projectType && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                            {study.projectType}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-sm line-clamp-2 mt-2">
                                    {study.title}
                                </h4>
                                {study.organism && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Organism: {study.organism}
                                    </p>
                                )}
                                {study.description && (
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                                        {study.description}
                                    </p>
                                )}
                                <a
                                    href={`https://osdr.nasa.gov/bio/repo/data/studies/${study.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs mt-3 inline-block"
                                >
                                    View Study →
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Missions */}
            {hasMissions && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Missions ({missions.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {missions.slice(0, 8).map((mission, index) => (
                            <div
                                key={`${mission.identifier}-${index}`}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <h4 className="font-bold">
                                    {mission.identifier}
                                </h4>
                                {mission.aliases &&
                                    mission.aliases.length > 0 && (
                                        <p className="text-xs text-gray-500">
                                            Also:{' '}
                                            {mission.aliases
                                                .slice(0, 2)
                                                .join(', ')}
                                        </p>
                                    )}
                                <div className="mt-2 text-xs text-gray-600">
                                    {mission.startDate && (
                                        <p>Start: {mission.startDate}</p>
                                    )}
                                    {mission.endDate && (
                                        <p>End: {mission.endDate}</p>
                                    )}
                                </div>
                                {mission.people &&
                                    mission.people.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {mission.people.length} team members
                                        </p>
                                    )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Entity Types */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Available Data Types
                </h3>
                <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {Object.values(OSDR_ENTITY_TYPES).map((type) => (
                        <div
                            key={type}
                            className="border rounded-lg p-4 text-center hover:bg-gray-50 transition-colors"
                        >
                            <p className="font-bold capitalize">{type}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                /api/{type}
                            </p>
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
                            <span className="text-blue-600">GET</span>{' '}
                            /osdr/data/osd/files/&#123;study_ids&#125; - Get
                            study data files
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /osdr/data/osd/meta/&#123;study_id&#125; - Get study
                            metadata
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /osdr/data/search?term=&#123;query&#125; - Search
                            studies
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /geode-py/ws/api/missions - Get all missions
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /geode-py/ws/api/experiments - Get all experiments
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /geode-py/ws/api/payloads - Get all payloads
                        </li>
                    </ul>
                    <div className="mt-4">
                        <a
                            href="https://osdr.nasa.gov/bio/help/api.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View Full API Documentation →
                        </a>
                    </div>
                </div>
            </section>

            {/* Usage Examples */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Example Queries</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        <code>{`# Get study files
curl "https://osdr.nasa.gov/osdr/data/osd/files/87"

# Search for mouse studies
curl "https://osdr.nasa.gov/osdr/data/search?term=mouse&type=cgene"

# Get mission details
curl "https://osdr.nasa.gov/geode-py/ws/api/mission/SpaceX-12"

# Filter by organism
curl "https://osdr.nasa.gov/osdr/data/search?ffield=organism&fvalue=Mus%20musculus"`}</code>
                    </pre>
                </div>
            </section>
        </div>
    )
}
