// Import necessary modules and types
import type { Asteroid } from '@/lib/types/asteroid.type'
import { getAsteroidFeed } from '@/lib/services/asteroid.service'
import AsteroidsClient from './client'

// Define metadata for the Asteroids page
export const metadata = {
    title: 'Near-Earth Asteroids',
    description:
        'Track and analyze potentially hazardous asteroids approaching Earth with real-time data from NASA.',
}

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export default async function AsteroidsPage() {
    // Get today's date and 7 days ago
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    const startDate = sevenDaysAgo.toISOString().split('T')[0]
    const endDate = today.toISOString().split('T')[0]

    // Fetch asteroid data
    const data = await getAsteroidFeed({
        start_date: startDate,
        end_date: endDate,
    })

    // Get all asteroids from all dates
    const allAsteroids: Asteroid[] = Object.values(
        data.near_earth_objects
    ).flat()

    return (
        <AsteroidsClient
            allAsteroids={allAsteroids}
            startDate={startDate}
            endDate={endDate}
        />
    )
}
