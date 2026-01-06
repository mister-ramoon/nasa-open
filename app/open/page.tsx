// Import constants and services
import {
    OSDR_DATA_SOURCES,
    OSDR_ENTITY_TYPES,
} from '@/lib/constants/open.constant'
import { getAllMissions, getFeaturedStudies } from '@/lib/services/open.service'
import OpenClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OpenPage() {
    // Fetch featured studies and missions in parallel with error handling
    const [featuredStudies, missions] = await Promise.all([
        getFeaturedStudies().catch(() => []),
        getAllMissions().catch(() => []),
    ])

    return (
        <OpenClient
            featuredStudies={featuredStudies || []}
            missions={missions || []}
            entityTypes={OSDR_ENTITY_TYPES}
            dataSources={OSDR_DATA_SOURCES}
        />
    )
}
