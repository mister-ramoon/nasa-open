// Import Types
import type { ApodImage } from '@/lib/types/apod.type'

// Import Services
import { getApod } from '@/lib/services/apod.service'

// Import Image
import Image from 'next/image'

// Asteroids Page Component
export default async function ApodPage() {
    // Fetch APOD Data
    const apod = (await getApod()) as ApodImage

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{apod.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{apod.date}</p>

            {apod.media_type === 'image' ? (
                <Image
                    src={apod.url}
                    alt={apod.title}
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg"
                />
            ) : (
                <iframe
                    src={apod.url}
                    className="w-full aspect-video rounded-lg"
                    allowFullScreen
                />
            )}

            <p className="mt-4 text-gray-700">{apod.explanation}</p>

            {apod.copyright && (
                <p className="mt-2 text-sm text-gray-500">© {apod.copyright}</p>
            )}
        </div>
    )
}
