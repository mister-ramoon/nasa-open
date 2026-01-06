// Import constants and services
import {
    NASA_CENTERS,
    POPULAR_SEARCHES,
} from '@/lib/constants/library.constant'
import {
    searchAndProcess,
    getFeaturedContent,
} from '@/lib/services/library.service'
import LibraryClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LibraryPage() {
    // Fetch featured content and recent images with error handling
    const [featured, recentMars, recentMoon] = await Promise.all([
        getFeaturedContent().catch(() => []),
        searchAndProcess({ q: 'Mars', media_type: 'image', page_size: 6 }).catch(() => ({ items: [], totalHits: 0 })),
        searchAndProcess({ q: 'Moon', media_type: 'image', page_size: 6 }).catch(() => ({ items: [], totalHits: 0 })),
    ])

    return (
        <LibraryClient
            featured={featured || []}
            marsItems={recentMars.items}
            moonItems={recentMoon.items}
            marsTotalHits={recentMars.totalHits}
            moonTotalHits={recentMoon.totalHits}
            popularSearches={POPULAR_SEARCHES}
            nasaCenters={NASA_CENTERS}
        />
    )
}
