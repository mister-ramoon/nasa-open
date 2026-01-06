// Import necessary types and services
import {
    getConfirmedExoplanets,
    getDiscoveryStats,
    getHabitableExoplanets,
} from '@/lib/services/exoplanet.service'
import ExoplanetClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export default async function ExoplanetPage() {
    // Fetch data in parallel with increased limits for better visualization
    const [exoplanets, stats, habitableExoplanets] = await Promise.all([
        getConfirmedExoplanets(50),
        getDiscoveryStats(),
        getHabitableExoplanets(20),
    ])

    return (
        <ExoplanetClient
            exoplanets={exoplanets || []}
            stats={stats || []}
            habitableExoplanets={habitableExoplanets || []}
        />
    )
}
