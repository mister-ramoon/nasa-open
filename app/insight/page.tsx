// Import services
import {
    getProcessedSols,
    checkDataAvailability,
} from '@/lib/services/insight.service'
import InsightClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InsightPage() {
    // Fetch sols and availability in parallel
    const [sols, availability] = await Promise.all([
        getProcessedSols().catch(() => []),
        checkDataAvailability().catch(() => ({
            available: false,
            solCount: 0,
            oldestSol: null,
            newestSol: null,
        })),
    ])

    return (
        <InsightClient
            sols={sols || []}
            availability={
                availability || {
                    available: false,
                    solCount: 0,
                    oldestSol: null,
                    newestSol: null,
                }
            }
        />
    )
}
