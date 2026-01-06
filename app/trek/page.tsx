import {
    TREK_Constants,
    TREK_BODIES,
    TREK_PORTAL_URLS,
    TREK_API_DOC_URLS,
    PROJECTIONS,
    ZOOM_LEVELS,
} from '@/lib/constants/trek.constant'
import {
    getTrekStats,
    getFeaturedMosaics,
    getGlobalMosaics,
    getMosaicsByBody,
    getLandingSitesByBody,
} from '@/lib/services/trek.service'
import TrekClient from './client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function TrekPage() {
    // Get statistics
    const stats = getTrekStats()
    const featuredMosaics = getFeaturedMosaics()
    const globalMosaics = getGlobalMosaics()

    // Get mosaics by body
    const moonMosaics = getMosaicsByBody('moon')
    const marsMosaics = getMosaicsByBody('mars')
    const vestaMosaics = getMosaicsByBody('vesta')

    // Get landing sites
    const moonLandingSites = getLandingSitesByBody('moon')
    const marsLandingSites = getLandingSitesByBody('mars')

    return (
        <TrekClient
            stats={stats}
            featuredMosaics={featuredMosaics}
            globalMosaics={globalMosaics}
            moonMosaics={moonMosaics}
            marsMosaics={marsMosaics}
            vestaMosaics={vestaMosaics}
            moonLandingSites={moonLandingSites}
            marsLandingSites={marsLandingSites}
            bodies={TREK_BODIES}
            projections={PROJECTIONS}
            zoomLevels={ZOOM_LEVELS}
            portalUrls={TREK_PORTAL_URLS}
            apiDocUrls={TREK_API_DOC_URLS}
            constants={TREK_Constants}
        />
    )
}
