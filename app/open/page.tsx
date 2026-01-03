// Import constants and services
import {
    OSDR_DATA_SOURCES,
    OSDR_ENTITY_TYPES,
} from '@/lib/constants/open.constant'
import { getAllMissions, getFeaturedStudies } from '@/lib/services/open.service'
import OpenClient from './client'

export default async function OpenPage() {
    // Fetch featured studies and missions in parallel
    const [featuredStudies, missions] = await Promise.all([
        getFeaturedStudies(),
        getAllMissions(),
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
