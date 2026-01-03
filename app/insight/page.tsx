// Import services
import {
    getProcessedSols,
    checkDataAvailability,
} from '@/lib/services/insight.service'
import InsightClient from './client'

export default async function InsightPage() {
    // Fetch sols and availability in parallel
    const [sols, availability] = await Promise.all([
        getProcessedSols(),
        checkDataAvailability(),
    ])

    return <InsightClient sols={sols || []} availability={availability} />
}
