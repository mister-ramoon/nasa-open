// Import constants and types
import { LIBRARY_API_BASE_URL } from '../constants/library.constant'
import type {
    LibrarySearchResponse,
    LibrarySearchParams,
    AssetManifestResponse,
    ProcessedLibraryItem,
    LibraryItem,
} from '../types/library.type'

// Build query params
function buildQueryParams(params: LibrarySearchParams): URLSearchParams {
    // Initialize URLSearchParams
    const queryParams = new URLSearchParams()

    // Append each parameter if it exists
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value))
        }
    })

    return queryParams
}

// Generic fetch function
async function fetchLibrary<T>(
    endpoint: string,
    params?: URLSearchParams
): Promise<T | null> {
    // Construct full URL
    const queryString = params ? `?${params.toString()}` : ''
    const url = `${LIBRARY_API_BASE_URL}${endpoint}${queryString}`

    // Fetch data from the API
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            console.error(
                `Library API Error: ${response.status} ${response.statusText}`
            )
            return null
        }

        return response.json()
    } catch (error) {
        console.error('Library API fetch error:', error)
        return null
    }
}

// Search the library
export async function searchLibrary(
    params: LibrarySearchParams
): Promise<LibrarySearchResponse | null> {
    // Build query parameters
    const queryParams = buildQueryParams(params)
    return fetchLibrary<LibrarySearchResponse>('/search', queryParams)
}

// Search by keyword (simplified)
export async function searchByKeyword(
    keyword: string,
    mediaType?: 'image' | 'video' | 'audio',
    page: number = 1
): Promise<LibrarySearchResponse | null> {
    // Build search parameters
    const params: LibrarySearchParams = {
        q: keyword,
        page,
    }

    // Add media type if specified
    if (mediaType) {
        params.media_type = mediaType
    }

    // Perform search
    return searchLibrary(params)
}

// Get recent images
export async function getRecentImages(
    page: number = 1
): Promise<LibrarySearchResponse | null> {
    // Get the current year
    const currentYear = new Date().getFullYear()

    // Search for images from the current and previous year
    return searchLibrary({
        media_type: 'image',
        year_start: String(currentYear - 1),
        year_end: String(currentYear),
        page,
    })
}

// Get asset manifest (all available files for an asset)
export async function getAssetManifest(
    nasaId: string
): Promise<AssetManifestResponse | null> {
    // Fetch asset manifest
    return fetchLibrary<AssetManifestResponse>(`/asset/${nasaId}`)
}

// Get metadata location
export async function getMetadataLocation(
    nasaId: string
): Promise<{ location: string } | null> {
    // Fetch metadata location
    return fetchLibrary<{ location: string }>(`/metadata/${nasaId}`)
}

// Get captions location (for videos)
export async function getCaptionsLocation(
    nasaId: string
): Promise<{ location: string } | null> {
    // Fetch captions location
    return fetchLibrary<{ location: string }>(`/captions/${nasaId}`)
}

// Process library items for easier consumption
export function processLibraryItems(
    items: LibraryItem[]
): ProcessedLibraryItem[] {
    return items.map((item) => {
        // Extract relevant data
        const data = item.data[0]
        const previewLink = item.links?.find((link) => link.rel === 'preview')

        // Return processed item
        return {
            id: data.nasa_id,
            title: data.title,
            description: data.description || '',
            dateCreated: data.date_created,
            mediaType: data.media_type,
            center: data.center,
            keywords: data.keywords || [],
            thumbnailUrl: previewLink?.href,
            previewUrl: previewLink?.href,
            photographer: data.photographer,
            location: data.location,
        }
    })
}

// Search and process results
export async function searchAndProcess(params: LibrarySearchParams): Promise<{
    items: ProcessedLibraryItem[]
    totalHits: number
    hasMore: boolean
}> {
    // Perform search
    const response = await searchLibrary(params)

    // Handle empty response
    if (!response || !response.collection) {
        return { items: [], totalHits: 0, hasMore: false }
    }

    // Process items
    const items = processLibraryItems(response.collection.items)
    const totalHits = response.collection.metadata?.total_hits || 0
    const hasMore =
        response.collection.links?.some((link) => link.rel === 'next') || false

    return { items, totalHits, hasMore }
}

// Get popular/featured content
export async function getFeaturedContent(): Promise<ProcessedLibraryItem[]> {
    // Define popular searches
    const searches = ['Mars Perseverance', 'James Webb Telescope', 'Artemis']
    const results: ProcessedLibraryItem[] = []

    // Perform searches and aggregate results
    for (const query of searches) {
        const response = await searchLibrary({
            q: query,
            media_type: 'image',
            page_size: 4,
        })

        if (response?.collection?.items) {
            const processed = processLibraryItems(
                response.collection.items.slice(0, 2)
            )
            results.push(...processed)
        }
    }

    return results
}

// Get images by NASA center
export async function getImagesByCenter(
    center: string,
    page: number = 1
): Promise<LibrarySearchResponse | null> {
    // Search images by center
    return searchLibrary({
        center,
        media_type: 'image',
        page,
    })
}

// Get videos
export async function getVideos(
    query?: string,
    page: number = 1
): Promise<LibrarySearchResponse | null> {
    // Search for videos
    return searchLibrary({
        q: query,
        media_type: 'video',
        page,
    })
}

// Get audio files
export async function getAudio(
    query?: string,
    page: number = 1
): Promise<LibrarySearchResponse | null> {
    // Search for audio files
    return searchLibrary({
        q: query,
        media_type: 'audio',
        page,
    })
}
