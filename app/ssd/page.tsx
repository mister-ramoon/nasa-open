// Import constants and services
import { ORBIT_CLASSES, SSD_ENDPOINTS } from '@/lib/constants/ssd.constant'
import {
    getUpcomingCloseApproaches,
    processCloseApproaches,
    getRecentFireballs,
    processFireballs,
    getAllSentryObjects,
    getNHATSObjects,
    getCurrentScoutObjects,
    getSSDSummary,
} from '@/lib/services/ssd.service'
import SsdClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SsdPage() {
    // Fetch all data in parallel with individual error handling
    const [
        closeApproachesRaw,
        fireballsRaw,
        sentryObjects,
        nhatsResponse,
        scoutObjects,
        summary,
    ] = await Promise.all([
        getUpcomingCloseApproaches(60).catch(() => null),
        getRecentFireballs(365).catch(() => null),
        getAllSentryObjects().catch(() => []),
        getNHATSObjects({ dv: 8 }).catch(() => null),
        getCurrentScoutObjects().catch(() => []),
        getSSDSummary().catch(() => ({
            upcomingApproaches: 0,
            recentFireballs: 0,
            sentryObjects: 0,
            nhatsObjects: 0,
        })),
    ])

    // Process the data safely
    const closeApproaches = closeApproachesRaw
        ? processCloseApproaches(closeApproachesRaw).slice(0, 12)
        : []
    const fireballs = fireballsRaw
        ? processFireballs(fireballsRaw).slice(0, 9)
        : []
    const nhatsObjects = nhatsResponse?.data?.slice(0, 8) || []
    const safeSentryObjects = sentryObjects || []
    const safeScoutObjects = scoutObjects || []

    return (
        <SsdClient
            closeApproaches={closeApproaches}
            fireballs={fireballs}
            sentryObjects={safeSentryObjects}
            nhatsObjects={nhatsObjects}
            scoutObjects={safeScoutObjects}
            summary={summary}
            orbitClasses={ORBIT_CLASSES}
            endpoints={SSD_ENDPOINTS}
        />
    )
}
