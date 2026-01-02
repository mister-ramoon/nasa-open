// Import constants and types
import {
    GIBS_WMTS_URL,
    GIBS_WMS_URL,
    GIBS_TILE_SIZE,
    GIBS_PROJECTIONS,
    GIBS_POPULAR_LAYERS,
} from '../constants/gibs.constant'
import type {
    GIBSProjection,
    GIBSImageParams,
    GIBSWMSParams,
    PopularLayer,
} from '../types/gibs.type'

// Build WMTS tile URL
export function buildWMTSTileUrl(params: GIBSImageParams): string {
    const {
        layer,
        date,
        projection = 'EPSG:4326',
        format = 'png',
        tileMatrix = 0,
        tileRow = 0,
        tileCol = 0,
    } = params

    // Determine the correct WMTS endpoint based on projection
    const baseUrl = getWMTSBaseUrl(projection)

    // Build the tile matrix set identifier
    const tileMatrixSet = getTileMatrixSet(projection)

    return `${baseUrl}/1.0.0/${layer}/default/${date}/${tileMatrixSet}/${tileMatrix}/${tileRow}/${tileCol}.${format}`
}

// Build WMS image URL
export function buildWMSImageUrl(params: GIBSWMSParams): string {
    // Destructure parameters with defaults
    const {
        layers,
        date,
        bbox,
        width = 512,
        height = 512,
        format = 'image/png',
        projection = 'EPSG:4326',
    } = params

    // Get the correct WMS base URL
    const baseUrl = getWMSBaseUrl(projection)

    // Build query parameters
    const queryParams = new URLSearchParams({
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        VERSION: '1.1.1',
        LAYERS: layers,
        FORMAT: format,
        TRANSPARENT: 'true',
        WIDTH: width.toString(),
        HEIGHT: height.toString(),
        SRS: projection,
        BBOX: bbox,
        TIME: date,
    })

    // Return full WMS URL
    return `${baseUrl}?${queryParams.toString()}`
}

// Get WMTS base URL for projection
function getWMTSBaseUrl(projection: GIBSProjection): string {
    // Build projection-specific WMTS base URL
    const projectionPath = projection.replace(':', '').toLowerCase()
    return `https://gibs.earthdata.nasa.gov/wmts/${projectionPath}/best`
}

// Get WMS base URL for projection
function getWMSBaseUrl(projection: GIBSProjection): string {
    // Build projection-specific WMS base URL
    const projectionPath = projection.replace(':', '').toLowerCase()
    return `https://gibs.earthdata.nasa.gov/wms/${projectionPath}/best/wms.cgi`
}

// Get tile matrix set identifier
function getTileMatrixSet(projection: GIBSProjection): string {
    // Return tile matrix set based on projection
    switch (projection) {
        case 'EPSG:4326':
            return '250m'
        case 'EPSG:3857':
            return 'GoogleMapsCompatible_Level9'
        case 'EPSG:3413':
            return '250m'
        case 'EPSG:3031':
            return '250m'
        default:
            return '250m'
    }
}

// Get thumbnail URL for a layer
export function buildThumbnailUrl(
    layer: string,
    date: string,
    projection: GIBSProjection = 'EPSG:4326'
): string {
    // Use WMS with a global bounding box for thumbnail
    return buildWMSImageUrl({
        layers: layer,
        date,
        bbox: '-180,-90,180,90',
        width: 400,
        height: 200,
        projection,
    })
}

// Get regional image URL
export function buildRegionalImageUrl(
    layer: string,
    date: string,
    region:
        | 'global'
        | 'northAmerica'
        | 'europe'
        | 'asia'
        | 'africa'
        | 'australia',
    projection: GIBSProjection = 'EPSG:4326'
): string {
    // Define bounding boxes for regions
    const bboxMap: Record<string, string> = {
        global: '-180,-90,180,90',
        northAmerica: '-170,10,-50,75',
        europe: '-25,35,45,72',
        asia: '60,5,150,55',
        africa: '-20,-40,55,40',
        australia: '110,-50,180,-5',
    }

    // Build WMS URL for the specified region
    return buildWMSImageUrl({
        layers: layer,
        date,
        bbox: bboxMap[region],
        width: 800,
        height: 600,
        projection,
    })
}

// Get popular layers
export function getPopularLayers(): PopularLayer[] {
    // Map GIBS_POPULAR_LAYERS to include projection
    return GIBS_POPULAR_LAYERS.map((layer) => ({
        ...layer,
        projection: 'EPSG:4326' as GIBSProjection,
    }))
}

// Get layers by category
export function getLayersByCategory(category: string): PopularLayer[] {
    // Filter popular layers by category
    return getPopularLayers().filter((layer) => layer.category === category)
}

// Get yesterday's date (most recent imagery usually)
export function getYesterdayDate(): string {
    // Calculate yesterday's date
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
}

// Get date range for the last N days
export function getDateRange(days: number): string[] {
    // Generate an array of date strings for the past N days
    const dates: string[] = []
    const today = new Date()

    // Loop to get past dates
    for (let i = 1; i <= days; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        dates.push(date.toISOString().split('T')[0])
    }

    // Return array of date strings
    return dates
}

// Validate date for GIBS (most products start from 2012)
export function isValidGIBSDate(date: string): boolean {
    // Check if date is within valid range
    const dateObj = new Date(date)
    const minDate = new Date('2012-05-08')
    const maxDate = new Date()

    // Return true if date is valid
    return dateObj >= minDate && dateObj <= maxDate
}

// Get available categories
export function getCategories(): string[] {
    // Extract unique categories from popular layers
    const categories = new Set(
        GIBS_POPULAR_LAYERS.map((layer) => layer.category)
    )
    return Array.from(categories)
}
