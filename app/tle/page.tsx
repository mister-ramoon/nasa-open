// Import constants and services
import {
    WELL_KNOWN_SATELLITES,
    SATELLITE_CATEGORIES,
    ORBITAL_REGIMES,
    COMMON_SEARCHES,
    EARTH_CONSTANTS,
} from '@/lib/constants/tle.constant'
import {
    getRecentTLEs,
    getWellKnownSatellites,
    getTLE,
    parseTLE,
    getOrbitalRegime,
    getTLESummary,
    getTLEStats,
} from '@/lib/services/tle.service'
import TleClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export default async function TlePage() {
    // Fetch data in parallel
    const [recentTLEs, wellKnownTLEs, stats, issTLE] = await Promise.all([
        getRecentTLEs(12).catch(() => []),
        getWellKnownSatellites().catch(() => []),
        getTLEStats().catch(() => ({ totalSatellites: 0, recentUpdates: 0 })),
        getTLE(WELL_KNOWN_SATELLITES.ISS.id).catch(() => null),
    ])

    // Parse ISS TLE for detailed display
    const issParsed = issTLE ? parseTLE(issTLE) : null
    const issRegime = issParsed ? getOrbitalRegime(issParsed) : null

    // Get summaries for well-known satellites
    const wellKnownSummaries = wellKnownTLEs.map((tle) => getTLESummary(tle))

    return (
        <TleClient
            recentTLEs={recentTLEs}
            wellKnownSummaries={wellKnownSummaries}
            stats={stats}
            issTLE={issTLE}
            issParsed={issParsed}
            issRegime={issRegime}
            orbitalRegimes={ORBITAL_REGIMES}
            satelliteCategories={SATELLITE_CATEGORIES}
            commonSearches={COMMON_SEARCHES}
            earthConstants={EARTH_CONSTANTS}
            wellKnownCount={Object.keys(WELL_KNOWN_SATELLITES).length}
        />
    )
}
