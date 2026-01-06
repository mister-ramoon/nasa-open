// Import constants and services for Tech Transfer
import {
    NASA_CENTERS,
    TECH_CATEGORIES,
    SOFTWARE_RELEASE_TYPES,
    EXAMPLE_SEARCHES,
} from '@/lib/constants/techtransfer.constant'
import { getSampleData } from '@/lib/services/techtransfer.service'
import TechtransferClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TechtransferPage() {
    // Fetch sample data with error handling
    const sampleData = await getSampleData().catch(() => ({
        patents: [],
        software: [],
        spinoffs: [],
    }))

    // Destructure sample data
    const { patents, software, spinoffs } = sampleData

    return (
        <TechtransferClient
            patents={patents}
            software={software}
            spinoffs={spinoffs}
            nasaCenters={NASA_CENTERS}
            techCategories={TECH_CATEGORIES}
            softwareReleaseTypes={SOFTWARE_RELEASE_TYPES}
            exampleSearches={EXAMPLE_SEARCHES}
        />
    )
}
