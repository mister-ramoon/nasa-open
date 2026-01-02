// Import constants and services for Tech Transfer
import {
    TECHTRANSFER_Constants,
    NASA_CENTERS,
    TECH_CATEGORIES,
    SOFTWARE_RELEASE_TYPES,
    TYPE_COLORS,
    EXAMPLE_SEARCHES,
    TECHTRANSFER_ENDPOINTS,
} from '@/lib/constants/techtransfer.constant'
import {
    getSampleData,
    truncateDescription,
    getTypeDisplayName,
    getTypeBadgeClass,
    getCenterFullName,
} from '@/lib/services/techtransfer.service'

export default async function TechtransferPage() {
    // Fetch sample data with error handling
    const sampleData = await getSampleData().catch(() => ({
        patents: [],
        software: [],
        spinoffs: [],
    }))

    // Destructure sample data
    const { patents, software, spinoffs } = sampleData
    const hasPatents = patents.length > 0
    const hasSoftware = software.length > 0
    const hasSpinoffs = spinoffs.length > 0
    const hasData = hasPatents || hasSoftware || hasSpinoffs

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-4xl font-extrabold">
                    {TECHTRANSFER_Constants.title}
                </h2>
                <p className="mt-2 text-gray-600">
                    {TECHTRANSFER_Constants.description}
                </p>
            </div>

            {/* Quick Stats */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Data Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div
                        className={`border rounded-lg p-4 text-center ${TYPE_COLORS.patent.bg} ${TYPE_COLORS.patent.border}`}
                    >
                        <p
                            className={`text-3xl font-bold ${TYPE_COLORS.patent.text}`}
                        >
                            {patents.length || '—'}
                        </p>
                        <p className="text-sm text-gray-600">Sample Patents</p>
                    </div>
                    <div
                        className={`border rounded-lg p-4 text-center ${TYPE_COLORS.patent_issued.bg} ${TYPE_COLORS.patent_issued.border}`}
                    >
                        <p
                            className={`text-3xl font-bold ${TYPE_COLORS.patent_issued.text}`}
                        >
                            🔎
                        </p>
                        <p className="text-sm text-gray-600">Issued Patents</p>
                    </div>
                    <div
                        className={`border rounded-lg p-4 text-center ${TYPE_COLORS.software.bg} ${TYPE_COLORS.software.border}`}
                    >
                        <p
                            className={`text-3xl font-bold ${TYPE_COLORS.software.text}`}
                        >
                            {software.length || '—'}
                        </p>
                        <p className="text-sm text-gray-600">Sample Software</p>
                    </div>
                    <div
                        className={`border rounded-lg p-4 text-center ${TYPE_COLORS.spinoff.bg} ${TYPE_COLORS.spinoff.border}`}
                    >
                        <p
                            className={`text-3xl font-bold ${TYPE_COLORS.spinoff.text}`}
                        >
                            {spinoffs.length || '—'}
                        </p>
                        <p className="text-sm text-gray-600">Sample Spinoffs</p>
                    </div>
                </div>
            </section>

            {/* Patents Section */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Patents
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        (Sample results for &quot;technology&quot;)
                    </span>
                </h3>
                {hasPatents ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {patents.map((patent, index) => (
                            <div
                                key={patent.id || index}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${getTypeBadgeClass(
                                            'patent'
                                        )}`}
                                    >
                                        Patent
                                    </span>
                                    {patent.center && (
                                        <span className="text-xs text-gray-500">
                                            {patent.center}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-sm line-clamp-2 mt-2">
                                    {patent.title}
                                </h4>
                                {patent.patent_number && (
                                    <p className="text-xs text-gray-500 font-mono mt-1">
                                        #{patent.patent_number}
                                    </p>
                                )}
                                <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                                    {truncateDescription(
                                        patent.description,
                                        150
                                    )}
                                </p>
                                {patent.category && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                        {patent.category}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        No patent data available. Try searching with a specific
                        term.
                    </div>
                )}
            </section>

            {/* Software Section */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Software
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        (Sample results for &quot;analysis&quot;)
                    </span>
                </h3>
                {hasSoftware ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {software.map((sw, index) => (
                            <div
                                key={sw.id || index}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${getTypeBadgeClass(
                                            'software'
                                        )}`}
                                    >
                                        Software
                                    </span>
                                    {sw.release_type && (
                                        <span className="text-xs text-gray-500">
                                            {sw.release_type}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-sm line-clamp-2 mt-2">
                                    {sw.title}
                                </h4>
                                {sw.center && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getCenterFullName(sw.center)}
                                    </p>
                                )}
                                <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                                    {truncateDescription(sw.description, 150)}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {sw.category && (
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                            {sw.category}
                                        </span>
                                    )}
                                    {sw.software_class && (
                                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                                            {sw.software_class}
                                        </span>
                                    )}
                                </div>
                                {sw.external_url && (
                                    <a
                                        href={sw.external_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-xs mt-2 inline-block"
                                    >
                                        View Details →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        No software data available. Try searching with a
                        specific term.
                    </div>
                )}
            </section>

            {/* Spinoffs Section */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Spinoffs
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        (Sample results for &quot;space&quot;)
                    </span>
                </h3>
                {hasSpinoffs ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {spinoffs.map((spinoff, index) => (
                            <div
                                key={spinoff.id || index}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded ${getTypeBadgeClass(
                                            'spinoff'
                                        )}`}
                                    >
                                        Spinoff
                                    </span>
                                    {spinoff.year && (
                                        <span className="text-xs text-gray-500">
                                            {spinoff.year}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-bold text-sm line-clamp-2 mt-2">
                                    {spinoff.title}
                                </h4>
                                {spinoff.company && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {spinoff.company}
                                        {spinoff.city && spinoff.state && (
                                            <span>
                                                {' '}
                                                • {spinoff.city},{' '}
                                                {spinoff.state}
                                            </span>
                                        )}
                                    </p>
                                )}
                                <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                                    {truncateDescription(
                                        spinoff.description,
                                        150
                                    )}
                                </p>
                                {spinoff.category && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded">
                                        {spinoff.category}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 p-4 border rounded-lg bg-gray-50">
                        No spinoff data available. Try searching with a specific
                        term.
                    </div>
                )}
            </section>

            {/* NASA Centers */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">NASA Centers</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {Object.entries(NASA_CENTERS).map(([code, info]) => (
                        <div
                            key={code}
                            className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                        >
                            <p className="font-bold text-blue-600">{code}</p>
                            <p className="text-sm text-gray-700">{info.name}</p>
                            <p className="text-xs text-gray-500">
                                {info.location}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Technology Categories */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Technology Categories
                </h3>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(TECH_CATEGORIES).map(([key, name]) => (
                        <div
                            key={key}
                            className="border rounded p-2 text-sm hover:bg-gray-50"
                        >
                            {name}
                        </div>
                    ))}
                </div>
            </section>

            {/* Software Release Types */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Software Release Types
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(SOFTWARE_RELEASE_TYPES).map(
                        ([key, name]) => (
                            <div
                                key={key}
                                className="border rounded-lg p-3 bg-green-50 text-center"
                            >
                                <p className="text-sm font-medium text-green-800">
                                    {name}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* API Endpoints */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">API Endpoints</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="text-sm text-gray-600 space-y-2 font-mono">
                        <li>
                            <span className="text-blue-600">GET</span>{' '}
                            /techtransfer/patent/?&#123;query&#125; - Search
                            patents
                        </li>
                        <li>
                            <span className="text-indigo-600">GET</span>{' '}
                            /techtransfer/patent_issued/?&#123;query&#125; -
                            Search issued patents
                        </li>
                        <li>
                            <span className="text-green-600">GET</span>{' '}
                            /techtransfer/software/?&#123;query&#125; - Search
                            software
                        </li>
                        <li>
                            <span className="text-orange-600">GET</span>{' '}
                            /techtransfer/spinoff/?&#123;query&#125; - Search
                            spinoffs
                        </li>
                    </ul>
                </div>
            </section>

            {/* Example Searches */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                    Example Search Terms
                </h3>
                <div className="flex flex-wrap gap-2">
                    {EXAMPLE_SEARCHES.map((term) => (
                        <span
                            key={term}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                        >
                            {term}
                        </span>
                    ))}
                </div>
            </section>

            {/* Example API Calls */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Example API Calls</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                        <code>
                            {`# Search patents for "engine"
                                curl "https://api.nasa.gov/techtransfer/patent/?engine&api_key=DEMO_KEY"

                                # Search issued patents for "solar"
                                curl "https://api.nasa.gov/techtransfer/patent_issued/?solar&api_key=DEMO_KEY"

                                # Search software for "analysis"
                                curl "https://api.nasa.gov/techtransfer/software/?analysis&api_key=DEMO_KEY"

                                # Search spinoffs for "medical"
                                curl "https://api.nasa.gov/techtransfer/spinoff/?medical&api_key=DEMO_KEY"`}
                        </code>
                    </pre>
                </div>
            </section>

            {/* Resources */}
            <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Resources</h3>
                <div className="flex flex-wrap gap-3">
                    <a
                        href="https://technology.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                        NASA Technology Transfer
                    </a>
                    <a
                        href="https://software.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                    >
                        NASA Software Catalog
                    </a>
                    <a
                        href="https://spinoff.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors"
                    >
                        NASA Spinoff
                    </a>
                    <a
                        href="https://api.nasa.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                    >
                        NASA API Portal
                    </a>
                </div>
            </section>
        </div>
    )
}
