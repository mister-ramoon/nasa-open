// Import Constants and services
import { COORDINATE_SYSTEMS } from '@/lib/constants/satellite.constant'
import {
    getObservatories,
    getActiveObservatories,
    getGroundStations,
    getPopularSatellites,
} from '@/lib/services/satellite.service'
import SatelliteClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SatellitePage() {
    // Fetch observatories and ground stations in parallel with error handling
    const [allObservatories, activeObservatories, groundStations] =
        await Promise.all([
            getObservatories().catch(() => []),
            getActiveObservatories().catch(() => []),
            getGroundStations().catch(() => []),
        ])

    const popularSatellites = getPopularSatellites()

    return (
        <SatelliteClient
            observatories={allObservatories || []}
            activeObservatories={activeObservatories || []}
            groundStations={groundStations || []}
            popularSatellites={popularSatellites}
            coordinateSystems={COORDINATE_SYSTEMS}
        />
    )
}
