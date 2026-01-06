// Import services
import {
    getProcessedSols,
    checkDataAvailability,
} from '@/lib/services/insight.service'
import InsightClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export default async function InsightPage() {
    // Fetch sols and availability in parallel
    const [sols, availability] = await Promise.all([
        getProcessedSols(),
        checkDataAvailability(),
    ])

    return <InsightClient sols={sols || []} availability={availability} />
}
