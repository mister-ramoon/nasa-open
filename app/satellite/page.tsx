// Import Constants and services
import { COORDINATE_SYSTEMS } from '@/lib/constants/satellite.constant'
import {
    getObservatories,
    getActiveObservatories,
    getGroundStations,
    getPopularSatellites,
} from '@/lib/services/satellite.service'
import SatelliteClient from './client'

export default async function SatellitePage() {
    // Fetch observatories and ground stations in parallel
    const [allObservatories, activeObservatories, groundStations] =
        await Promise.all([
            getObservatories(),
            getActiveObservatories(),
            getGroundStations(),
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
