// Import Types
import type { ApodImage } from '@/lib/types/apod.type'

// Import Services
import { getApod } from '@/lib/services/apod.service'

// Import Constants
import { APOD_Constants } from '@/lib/constants/apod.constant'

// Import Client Component
import ApodClient from './client'

// APOD Page Component
export default async function ApodPage() {
    // Fetch APOD Data
    const apod = (await getApod()) as ApodImage

    return <ApodClient apod={apod} constants={APOD_Constants} />
}
