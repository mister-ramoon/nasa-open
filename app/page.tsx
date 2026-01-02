// Import Link from Next.js
import Link from 'next/link'

// Define a list of NASA APIs with their names, descriptions, and links
const apis = [
    {
        name: 'APOD',
        description: 'Astronomy Picture of the Day',
        href: '/apod',
    },
    {
        name: 'Asteroids',
        description: 'Near Earth Object Web Service',
        href: '/asteroids',
    },
    {
        name: 'DONKI',
        description:
            'Space Weather Database Of Notifications, Knowledge, Information',
        href: '/donki',
    },
    {
        name: 'EONET',
        description: 'Earth Observatory Natural Event Tracker',
        href: '/eonet',
    },
    {
        name: 'EPIC',
        description: 'Earth Polychromatic Imaging Camera',
        href: '/epic',
    },
    {
        name: 'Exoplanet',
        description: 'Exoplanet Archive',
        href: '/exoplanet',
    },
    {
        name: 'GIBS',
        description: 'Global Imagery Browse Services',
        href: '/gibs',
    },
    {
        name: 'InSight',
        description: 'InSight Mars Lander',
        href: '/insight',
    },
    {
        name: 'Library',
        description: 'NASA Image and Video Library',
        href: '/library',
    },
    {
        name: 'OPEN',
        description: 'Open Science Data Repository Public API',
        href: '/open',
    },
    {
        name: 'Satellite',
        description: 'Satellite Situation Center Web Services',
        href: '/satellite',
    },
    {
        name: 'SSD/CNEOS',
        description:
            'Solar System Dynamics / Center for Near Earth Object Studies',
        href: '/ssd',
    },
    {
        name: 'Techport',
        description:
            'API to make NASA technology project data available in a machine-readable format',
        href: '/techport',
    },
    {
        name: 'TechTransfer',
        description: 'Patents, Software, and Tech Transfer Reports',
        href: '/techtransfer',
    },
]

export default function Home() {
    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold">NASA Open APIs</h1>
                <p className="mt-2 text-gray-600">
                    Explore data from NASA&apos;s open APIs
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {apis.map((api) => (
                    <Link
                        key={api.href}
                        href={api.href}
                        className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-xl font-bold">{api.name}</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {api.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
