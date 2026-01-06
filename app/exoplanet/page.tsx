// Import necessary types and services
import {
    getConfirmedExoplanets,
    getDiscoveryStats,
    getHabitableExoplanets,
} from '@/lib/services/exoplanet.service'
import ExoplanetClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ExoplanetPage() {
    // Fetch data in parallel with increased limits for better visualization and error handling
    const [exoplanets, stats, habitableExoplanets] = await Promise.all([
        getConfirmedExoplanets(50).catch(() => []),
        getDiscoveryStats().catch(() => []),
        getHabitableExoplanets(20).catch(() => []),
    ])

    return (
        <ExoplanetClient
            exoplanets={exoplanets || []}
            stats={stats || []}
            habitableExoplanets={habitableExoplanets || []}
        />
    )
}
