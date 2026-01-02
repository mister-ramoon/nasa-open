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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
