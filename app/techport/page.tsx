// Import constants and services
import {
    TECHPORT_Constants,
    TRL_LEVELS,
    TECHNOLOGY_AREAS,
    MISSION_DIRECTORATES,
    STATUS_COLORS,
    TRL_COLORS,
} from '@/lib/constants/techport.constant'
import {
    getProjectsSummary,
    getSampleProjects,
    getRecentProjects,
    getTechportSummary,
    processProject,
    getStatusBadgeClass,
    getTrlDescription,
    truncateDescription,
    getTrlProgress,
} from '@/lib/services/techport.service'

export default async function TechportPage() {
    // Fetch data in parallel with error handling
    const [summary, recentProjectsSummary, sampleProjects] = await Promise.all([
        getTechportSummary().catch(() => ({
            totalProjects: 0,
            activeProjects: 0,
            recentlyUpdated: 0,
        })),
        getRecentProjects(60).catch(() => []),
        getSampleProjects(6).catch(() => []),
    ])

    // Process sample projects
    const processedProjects = sampleProjects.map(processProject)
    const hasProjects = processedProjects.length > 0
    const hasRecentSummary = recentProjectsSummary.length > 0

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {TECHPORT_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {TECHPORT_Constants.description}
                </p>
            </div>

            {/* Summary Statistics */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center bg-blue-50">
                        <p className="text-3xl font-bold text-blue-600">
                            {summary.totalProjects || '—'}
                        </p>
                        <p className="text-sm text-gray-600">Total Projects</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center bg-green-50">
                        <p className="text-3xl font-bold text-green-600">
                            {summary.activeProjects || '—'}
                        </p>
                        <p className="text-sm text-gray-600">Active Projects</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center bg-purple-50">
                        <p className="text-3xl font-bold text-purple-600">
                            {summary.recentlyUpdated || '—'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Updated (60 days)
                        </p>
                    </div>
                </div>
            </section>

            {/* Sample Projects */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Sample Projects</h3>
                {hasProjects ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {processedProjects.map((project) => (
                            <div
                                key={project.id}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${getStatusBadgeClass(
                                            project.status
                                        )}`}
                                    >
                                        {project.status}
                                    </span>
                                    {project.acronym && (
                                        <span className="text-xs text-gray-500 font-mono">
                                            {project.acronym}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-sm line-clamp-2 mt-2">
                                    {project.title}
                                </h4>
                                {project.leadOrganization && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {project.leadOrganization}
                                    </p>
                                )}
                                {project.description && (
                                    <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                                        {truncateDescription(
                                            project.description,
                                            150
                                        )}
                                    </p>
                                )}

                                {/* TRL Progress */}
                                {project.trlCurrent && (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>TRL</span>
                                            <span>
                                                {project.trlStart || 1} →{' '}
                                                {project.trlCurrent} →{' '}
                                                {project.trlEnd || 9}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    TRL_COLORS[
                                                        project.trlCurrent as keyof typeof TRL_COLORS
                                                    ] || 'bg-blue-500'
                                                }`}
                                                style={{
                                                    width: `${(project.trlCurrent / 9) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Technology Areas */}
                                {project.technologyAreas.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {project.technologyAreas
                                            .slice(0, 2)
                                            .map((area, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                                >
                                                    {area.length > 30
                                                        ? area.substring(
                                                              0,
                                                              30
                                                          ) + '...'
                                                        : area}
                                                </span>
                                            ))}
                                    </div>
                                )}

                                <a
                                    href={`https://techport.nasa.gov/view/${project.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs mt-3 inline-block"
                                >
                                    View Project →
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        Data temporarily unavailable. Please try again later.
                    </div>
                )}
            </section>

            {/* Recently Updated Projects */}
            {hasRecentSummary && (
                <section className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">
                        Recently Updated ({recentProjectsSummary.length})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2 text-left">
                                        Project
                                    </th>
                                    <th className="border p-2 text-left">
                                        Status
                                    </th>
                                    <th className="border p-2 text-center">
                                        Years
                                    </th>
                                    <th className="border p-2 text-left">
                                        Last Updated
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProjectsSummary
                                    .slice(0, 10)
                                    .map((project) => (
                                        <tr
                                            key={project.projectId}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border p-2">
                                                <a
                                                    href={`https://techport.nasa.gov/view/${project.projectId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    {project.title.length > 60
                                                        ? project.title.substring(
                                                              0,
                                                              60
                                                          ) + '...'
                                                        : project.title}
                                                </a>
                                                {project.acronym && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        ({project.acronym})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="border p-2">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded ${getStatusBadgeClass(
                                                        project.statusDescription
                                                    )}`}
                                                >
                                                    {project.statusDescription}
                                                </span>
                                            </td>
                                            <td className="border p-2 text-center text-sm">
                                                {project.startYear &&
                                                project.endYear
                                                    ? `${project.startYear}-${project.endYear}`
                                                    : project.startYear || '—'}
                                            </td>
                                            <td className="border p-2 text-sm text-gray-600">
                                                {project.lastUpdated
                                                    ? new Date(
                                                          project.lastUpdated
                                                      ).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* TRL Scale Reference */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Technology Readiness Levels (TRL)
                </h3>
                <div className="grid gap-2">
                    {Object.entries(TRL_LEVELS).map(([level, description]) => (
                        <div
                            key={level}
                            className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50"
                        >
                            <span
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                    TRL_COLORS[
                                        Number(level) as keyof typeof TRL_COLORS
                                    ] || 'bg-gray-500'
                                }`}
                            >
                                {level}
                            </span>
                            <span className="text-sm text-gray-700">
                                {description}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Technology Areas */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Technology Areas</h3>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(TECHNOLOGY_AREAS).map(([code, name]) => (
                        <div
                            key={code}
                            className="border rounded p-3 hover:bg-gray-50"
                        >
                            <span className="font-mono font-bold text-blue-600">
                                {code}
                            </span>
                            <span className="text-sm text-gray-600 ml-2">
                                {name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission Directorates */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Mission Directorates
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(MISSION_DIRECTORATES).map(
                        ([acronym, name]) => (
                            <div
                                key={acronym}
                                className="border rounded-lg p-4 hover:bg-gray-50"
                            >
                                <p className="font-bold">{acronym}</p>
                                <p className="text-sm text-gray-600">{name}</p>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* API Documentation */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">API Endpoints</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-2 font-mono">
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /api/projects - List all project IDs
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /api/projects?updatedSince=YYYY-MM-DD - Filter by
                            update date
                        </li>
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /api/projects/&#123;projectId&#125; - Get project
                            details
                        </li>
                    </ul>
                    <div className="mt-4">
                        <a
                            href="https://techport.nasa.gov/help/api"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View Full API Documentation →
                        </a>
                    </div>
                </div>
            </section>

            {/* Example Queries */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Example API Calls</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        <code>
                            {`# Get all project IDs
                                curl "https://techport.nasa.gov/api/projects"

                                # Get projects updated in last 30 days
                                curl "https://techport.nasa.gov/api/projects?updatedSince=2025-12-01"

                                # Get specific project details
                                curl "https://techport.nasa.gov/api/projects/117805"

                                # Get project details in XML format
                                curl "https://techport.nasa.gov/api/projects/117805.xml"`}
                        </code>
                    </pre>
                </div>
            </section>

            {/* Links */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Resources</h3>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="https://techport.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                        TechPort Website
                    </a>
                    <a
                        href="https://techport.nasa.gov/help/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                        API Documentation
                    </a>
                    <a
                        href="https://techport.nasa.gov/search"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                    >
                        Search Projects
                    </a>
                </div>
            </section>
        </div>
    )
}
