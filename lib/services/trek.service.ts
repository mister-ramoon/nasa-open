// Import constants and types
import {
    TREK_BASE_URLS,
    TREK_TILE_URLS,
    MOON_MOSAICS,
    MARS_MOSAICS,
    VESTA_MOSAICS,
    ALL_MOSAICS,
    TREK_BODIES,
    MARS_LANDING_SITES,
    MOON_LANDING_SITES,
} from '../constants/trek.constant'
import type {
    TrekBody,
    TileFormat,
    TileCoordinates,
    MosaicPreset,
    TileRequestOptions,
    LandingSite,
    TrekStats,
    TrekProjection,
} from '../types/trek.type'

// ============ Tile URL Generation ============

// Build tile URL from components
export function buildTileUrl(options: TileRequestOptions): string {
    const {
        body,
        layer,
        style = 'default',
        tileMatrixSet = 'default028mm',
        zoom,
        row,
        col,
        format = 'jpg',
    } = options

    // Use the standard Trek URL format
    const baseUrl = TREK_BASE_URLS[body]

    return `${baseUrl}/EQ/${layer}/1.0.0/${style}/${tileMatrixSet}/${zoom}/${row}/${col}.${format}`
}

// Build tile URL from mosaic preset
export function buildTileUrlFromPreset(
    preset: MosaicPreset,
    tile: TileCoordinates
): string {
    return `${preset.tileEndpoint}/1.0.0/${preset.style}/${preset.tileMatrixSet}/${tile.zoom}/${tile.row}/${tile.col}.${preset.format}`
}

// Get base tile URL for a mosaic (zoom level 0)
export function getBaseTileUrls(preset: MosaicPreset): string[] {
    // At zoom level 0, there are 2 columns and 1 row for equirectangular
    return [
        buildTileUrlFromPreset(preset, { zoom: 0, row: 0, col: 0 }),
        buildTileUrlFromPreset(preset, { zoom: 0, row: 0, col: 1 }),
    ]
}

// ============ Mosaic Retrieval ============

// Get mosaics by body
export function getMosaicsByBody(body: TrekBody): MosaicPreset[] {
    switch (body) {
        case 'moon':
            return MOON_MOSAICS
        case 'mars':
            return MARS_MOSAICS
        case 'vesta':
            return VESTA_MOSAICS
        default:
            return []
    }
}

// Get all mosaics
export function getAllMosaics(): MosaicPreset[] {
    return ALL_MOSAICS
}

// Get mosaic by ID
export function getMosaicById(id: string): MosaicPreset | undefined {
    return ALL_MOSAICS.find((m) => m.id === id)
}

// Get global mosaics (coverage === 'Global')
export function getGlobalMosaics(body?: TrekBody): MosaicPreset[] {
    const mosaics = body ? getMosaicsByBody(body) : ALL_MOSAICS
    return mosaics.filter((m) => m.coverage === 'Global')
}

// Get regional mosaics
export function getRegionalMosaics(body?: TrekBody): MosaicPreset[] {
    const mosaics = body ? getMosaicsByBody(body) : ALL_MOSAICS
    return mosaics.filter((m) => m.coverage === 'Regional')
}

// Get featured mosaic for each body
export function getFeaturedMosaics(): MosaicPreset[] {
    return [
        MOON_MOSAICS[0], // LRO WAC Global
        MARS_MOSAICS[0], // Viking Color
        VESTA_MOSAICS[0], // Dawn HAMO Global
    ].filter(Boolean)
}

// ============ Landing Sites ============

// Get landing sites by body
export function getLandingSitesByBody(body: TrekBody): LandingSite[] {
    switch (body) {
        case 'moon':
            return MOON_LANDING_SITES
        case 'mars':
            return MARS_LANDING_SITES
        default:
            return []
    }
}

// Get all landing sites
export function getAllLandingSites(): LandingSite[] {
    return [...MOON_LANDING_SITES, ...MARS_LANDING_SITES]
}

// ============ WMTS Capabilities ============

// Fetch WMTS capabilities XML (returns raw text)
export async function fetchWMTSCapabilities(
    capabilitiesUrl: string
): Promise<string | null> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(capabilitiesUrl, {
            signal: controller.signal,
            next: { revalidate: 86400 }, // Cache for 24 hours
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            console.error(`WMTS Capabilities Error: ${response.status}`)
            return null
        }

        return response.text()
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('WMTS Capabilities fetch error:', error)
        }
        return null
    }
}

// Fetch capabilities for a mosaic
export async function getMosaicCapabilities(
    preset: MosaicPreset
): Promise<string | null> {
    return fetchWMTSCapabilities(preset.wmtsCapabilitiesUrl)
}

// ============ Tile Validation ============

// Check if a tile exists (by fetching it)
export async function checkTileExists(url: string): Promise<boolean> {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return response.ok
    } catch {
        return false
    }
}

// Get tile count for a zoom level (for equirectangular projection)
export function getTileCount(zoom: number): { cols: number; rows: number } {
    // At zoom 0: 2x1, zoom 1: 4x2, zoom 2: 8x4, etc.
    const cols = Math.pow(2, zoom + 1)
    const rows = Math.pow(2, zoom)
    return { cols, rows }
}

// ============ Coordinate Conversions ============

// Convert lat/lon to tile coordinates
export function latLonToTile(
    lat: number,
    lon: number,
    zoom: number
): TileCoordinates {
    // For equirectangular projection
    const n = Math.pow(2, zoom)

    // Normalize longitude to 0-360
    const lonNorm = ((lon % 360) + 360) % 360

    // Calculate column (0 to 2n-1)
    const col = Math.floor((lonNorm / 360) * 2 * n)

    // Calculate row (0 to n-1)
    // Latitude -90 to 90 maps to row 0 to n-1
    const row = Math.floor(((90 - lat) / 180) * n)

    return {
        zoom,
        row: Math.max(0, Math.min(row, n - 1)),
        col: Math.max(0, Math.min(col, 2 * n - 1)),
    }
}

// Convert tile coordinates to center lat/lon
export function tileToLatLon(tile: TileCoordinates): {
    lat: number
    lon: number
} {
    const n = Math.pow(2, tile.zoom)

    // Calculate center longitude
    const lon = ((tile.col + 0.5) / (2 * n)) * 360

    // Calculate center latitude
    const lat = 90 - ((tile.row + 0.5) / n) * 180

    return {
        lat,
        lon: lon > 180 ? lon - 360 : lon,
    }
}

// ============ Body Information ============

// Get body info
export function getBodyInfo(body: TrekBody) {
    return TREK_BODIES[body]
}

// Get body color classes
export function getBodyColorClasses(body: TrekBody): {
    bg: string
    text: string
    border: string
} {
    return TREK_BODIES[body].color
}

// ============ Statistics ============

// Get trek statistics
export function getTrekStats(): TrekStats {
    return {
        moonLayers: MOON_MOSAICS.length,
        marsLayers: MARS_MOSAICS.length,
        vestaLayers: VESTA_MOSAICS.length,
        totalMosaics: ALL_MOSAICS.length,
    }
}

// ============ Formatting Functions ============

// Format resolution for display
export function formatResolution(resolution?: string): string {
    return resolution || 'Unknown'
}

// Format coordinates for display
export function formatCoordinates(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`
}

// Get projection display name
export function getProjectionName(projection: TrekProjection): string {
    const names: Record<TrekProjection, string> = {
        EQ: 'Equirectangular',
        NP: 'North Polar',
        SP: 'South Polar',
    }
    return names[projection] || projection
}

// Truncate description
export function truncateDescription(
    description: string,
    maxLength: number = 150
): string {
    if (!description) return ''
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).trim() + '...'
}

// ============ Sample Tile URLs ============

// Get sample tile URLs for demonstration
export function getSampleTileUrls(body: TrekBody, count: number = 4): string[] {
    const mosaics = getMosaicsByBody(body)
    if (mosaics.length === 0) return []

    const urls: string[] = []
    const mosaic = mosaics[0] // Use first mosaic

    // Get tiles at zoom level 1 (4 tiles covering whole globe)
    for (let row = 0; row < 2 && urls.length < count; row++) {
        for (let col = 0; col < 4 && urls.length < count; col++) {
            urls.push(buildTileUrlFromPreset(mosaic, { zoom: 1, row, col }))
        }
    }

    return urls
}

// Get example WMTS URL template
export function getWMTSUrlTemplate(body: TrekBody): string {
    const baseUrl = TREK_BASE_URLS[body]
    return `${baseUrl}/EQ/{Layer}/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{format}`
}

// ============ Landing Site Utilities ============

// Get tile for landing site
export function getLandingSiteTile(
    site: LandingSite,
    zoom: number = 5
): TileCoordinates {
    return latLonToTile(site.latitude, site.longitude, zoom)
}

// Get tile URL for landing site
export function getLandingSiteTileUrl(
    site: LandingSite,
    zoom: number = 5
): string | null {
    const mosaics = getMosaicsByBody(site.body)
    if (mosaics.length === 0) return null

    const tile = getLandingSiteTile(site, zoom)
    return buildTileUrlFromPreset(mosaics[0], tile)
}
