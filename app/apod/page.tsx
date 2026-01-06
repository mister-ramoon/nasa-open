// Import Types
import type { ApodImage } from '@/lib/types/apod.type'

// Import Services
import { getApod } from '@/lib/services/apod.service'

// Import Constants
import { APOD_Constants } from '@/lib/constants/apod.constant'

// Import Client Component
import ApodClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

// APOD Page Component
export default async function ApodPage() {
    try {
        // Fetch APOD Data
        const apod = (await getApod()) as ApodImage

        return <ApodClient apod={apod} constants={APOD_Constants} />
    } catch (error) {
        console.error('Error fetching APOD:', error)
        // Return a fallback UI or error message
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Unable to load APOD data
                    </h1>
                    <p className="text-gray-600">
                        Please try again later. The NASA API might be temporarily
                        unavailable.
                    </p>
                </div>
            </div>
        )
    }
}
