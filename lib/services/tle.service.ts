// Import constants and types
import {
    TLE_API_BASE_URL,
    EARTH_CONSTANTS,
    TLE_AGE_THRESHOLDS,
    ORBITAL_REGIMES,
    WELL_KNOWN_SATELLITES,
} from '../constants/tle.constant'
import type {
    TLERecord,
    TLEListResponse,
    TLESingleResponse,
    TLESearchParams,
    ParsedTLE,
    OrbitalRegime,
    TLEAgeStatus,
} from '../types/tle.type'

// Generic fetch function for TLE API
async function fetchTLE<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
): Promise<T | null> {
    const url = new URL(`${TLE_API_BASE_URL}${endpoint}`)

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.append(key, String(value))
            }
        })
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            // Log the full URL for debugging 400 errors
            if (response.status === 400) {
                console.error(
                    `TLE API 400 Bad Request for URL: ${url.toString()}`
                )
            } else if (response.status !== 503 && response.status !== 404) {
                console.error(
                    `TLE API Error: ${response.status} ${response.statusText}`
                )
            }
            return null
        }

        return response.json()
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('TLE API fetch error:', error)
        }
        return null
    }
}

// ============ Search & Retrieval ============

// Search satellites by name
export async function searchSatellites(
    params: TLESearchParams
): Promise<TLEListResponse | null> {
    const queryParams: Record<string, string | number | undefined> = {}

    if (params.search) queryParams.search = params.search
    if (params.sort) queryParams.sort = params.sort
    if (params.sortDir) queryParams['sort-dir'] = params.sortDir
    if (params.page) queryParams.page = params.page
    if (params.pageSize) queryParams['page-size'] = params.pageSize

    return fetchTLE<TLEListResponse>('/api/tle', queryParams)
}

// Search by name (simplified)
export async function searchByName(
    name: string,
    limit: number = 20
): Promise<TLERecord[]> {
    const response = await searchSatellites({
        search: name,
        pageSize: limit,
    })

    return response?.member || []
}

// Get single TLE by satellite ID
export async function getTLE(satelliteId: number): Promise<TLERecord | null> {
    const response = await fetchTLE<TLESingleResponse>(
        `/api/tle/${satelliteId}`
    )

    if (!response) return null

    return {
        '@id': response['@id'],
        '@type': response['@type'],
        satelliteId: response.satelliteId,
        name: response.name,
        date: response.date,
        line1: response.line1,
        line2: response.line2,
    }
}

// Get multiple TLEs by IDs
export async function getTLEs(satelliteIds: number[]): Promise<TLERecord[]> {
    const results = await Promise.all(
        satelliteIds.map((id) => getTLE(id).catch(() => null))
    )
    return results.filter((r): r is TLERecord => r !== null)
}

// Get recent/all TLEs (first page)
export async function getRecentTLEs(limit: number = 20): Promise<TLERecord[]> {
    // Only use page-size parameter to avoid potential API issues with sort params
    const response = await fetchTLE<TLEListResponse>('/api/tle', {
        'page-size': limit,
    })

    return response?.member || []
}

// ============ Well-Known Satellites ============

// Get well-known satellite TLE
export async function getWellKnownSatellite(
    key: keyof typeof WELL_KNOWN_SATELLITES
): Promise<TLERecord | null> {
    const satellite = WELL_KNOWN_SATELLITES[key]
    return getTLE(satellite.id)
}

// Get ISS TLE
export async function getISSTLE(): Promise<TLERecord | null> {
    return getTLE(WELL_KNOWN_SATELLITES.ISS.id)
}

// Get all well-known satellites
export async function getWellKnownSatellites(): Promise<TLERecord[]> {
    const ids = Object.values(WELL_KNOWN_SATELLITES).map((s) => s.id)
    return getTLEs(ids)
}

// ============ TLE Parsing ============

// Parse TLE lines into orbital elements
export function parseTLE(tle: TLERecord): ParsedTLE {
    const line1 = tle.line1
    const line2 = tle.line2

    // Line 1 parsing
    const classification = line1.charAt(7)
    const intlDesignator = line1.substring(9, 17).trim()
    const epochYearShort = parseInt(line1.substring(18, 20))
    const epochDay = parseFloat(line1.substring(20, 32))
    const meanMotionDot = parseFloat(line1.substring(33, 43))
    const meanMotionDDot = parseExponential(line1.substring(44, 52))
    const bstar = parseExponential(line1.substring(53, 61))
    const ephemerisType = parseInt(line1.charAt(62)) || 0
    const elementSetNumber = parseInt(line1.substring(64, 68))

    // Epoch year (handle Y2K)
    const epochYear =
        epochYearShort >= 57 ? 1900 + epochYearShort : 2000 + epochYearShort

    // Calculate epoch date
    const epochDate = dayOfYearToDate(epochYear, epochDay)

    // Line 2 parsing
    const inclination = parseFloat(line2.substring(8, 16))
    const rightAscension = parseFloat(line2.substring(17, 25))
    const eccentricity = parseFloat('0.' + line2.substring(26, 33))
    const argumentOfPerigee = parseFloat(line2.substring(34, 42))
    const meanAnomaly = parseFloat(line2.substring(43, 51))
    const meanMotion = parseFloat(line2.substring(52, 63))
    const revolutionNumber = parseInt(line2.substring(63, 68)) || 0

    // Derived values
    const orbitalPeriod = 1440 / meanMotion // minutes
    const semiMajorAxis = calculateSemiMajorAxis(meanMotion)
    const apogee =
        semiMajorAxis * (1 + eccentricity) - EARTH_CONSTANTS.RADIUS_KM
    const perigee =
        semiMajorAxis * (1 - eccentricity) - EARTH_CONSTANTS.RADIUS_KM

    return {
        satelliteId: tle.satelliteId,
        name: tle.name,
        classification,
        internationalDesignator: intlDesignator,
        epochYear,
        epochDay,
        epochDate,
        meanMotionFirstDerivative: meanMotionDot,
        meanMotionSecondDerivative: meanMotionDDot,
        bstarDragTerm: bstar,
        ephemerisType,
        elementSetNumber,
        inclination,
        rightAscension,
        eccentricity,
        argumentOfPerigee,
        meanAnomaly,
        meanMotion,
        revolutionNumber,
        orbitalPeriod,
        apogee,
        perigee,
        semiMajorAxis,
    }
}

// Parse TLE exponential format (e.g., " 12345-6" = 0.12345e-6)
function parseExponential(str: string): number {
    const trimmed = str.trim()
    if (!trimmed || trimmed === '00000-0' || trimmed === '00000+0') return 0

    // Handle format like " 12345-6" or "-12345-6"
    const sign = trimmed.charAt(0) === '-' ? -1 : 1
    const mantissaStr =
        trimmed.charAt(0) === '-' || trimmed.charAt(0) === ' '
            ? trimmed.substring(1, 6)
            : trimmed.substring(0, 5)
    const exponentStr = trimmed.slice(-2)

    const mantissa = parseFloat('0.' + mantissaStr)
    const exponent = parseInt(exponentStr)

    return sign * mantissa * Math.pow(10, exponent)
}

// Convert day of year to Date
function dayOfYearToDate(year: number, dayOfYear: number): Date {
    const date = new Date(year, 0, 1)
    const wholeDays = Math.floor(dayOfYear) - 1
    const fractionalDay = dayOfYear - Math.floor(dayOfYear)

    date.setDate(date.getDate() + wholeDays)
    date.setTime(date.getTime() + fractionalDay * 24 * 60 * 60 * 1000)

    return date
}

// Calculate semi-major axis from mean motion
function calculateSemiMajorAxis(meanMotion: number): number {
    // meanMotion is in rev/day, convert to rad/s
    const n = (meanMotion * 2 * Math.PI) / 86400
    // a = (μ/n²)^(1/3)
    return Math.pow(EARTH_CONSTANTS.MU / (n * n), 1 / 3)
}

// ============ Orbital Classification ============

// Determine orbital regime
export function getOrbitalRegime(parsed: ParsedTLE): OrbitalRegime {
    const { apogee, perigee, eccentricity, inclination, orbitalPeriod } = parsed

    // Check for highly elliptical orbit first
    if (eccentricity > 0.25) {
        return 'HEO'
    }

    // Geostationary check (period ~1436 min, low inclination)
    if (orbitalPeriod >= 1430 && orbitalPeriod <= 1450 && inclination < 5) {
        return 'GEO'
    }

    // Sun-synchronous (97-99° inclination, LEO altitude)
    if (inclination >= 96 && inclination <= 100 && perigee < 1000) {
        return 'SSO'
    }

    const avgAltitude = (apogee + perigee) / 2

    // LEO
    if (avgAltitude < 2000) {
        return 'LEO'
    }

    // MEO
    if (avgAltitude < 35000) {
        return 'MEO'
    }

    // GEO altitude but not geostationary
    if (avgAltitude >= 35000 && avgAltitude <= 36000) {
        return 'GEO'
    }

    return 'Other'
}

// ============ TLE Age & Status ============

// Calculate TLE age in days
export function getTLEAge(tle: TLERecord): number {
    const tleDate = new Date(tle.date)
    const now = new Date()
    const diffMs = now.getTime() - tleDate.getTime()
    return diffMs / (1000 * 60 * 60 * 24)
}

// Get TLE age status
export function getTLEAgeStatus(tle: TLERecord): TLEAgeStatus {
    const age = getTLEAge(tle)

    if (age < TLE_AGE_THRESHOLDS.FRESH) return 'fresh'
    if (age < TLE_AGE_THRESHOLDS.RECENT) return 'recent'
    if (age < TLE_AGE_THRESHOLDS.STALE) return 'stale'
    return 'old'
}

// ============ Formatting Functions ============

// Format orbital period
export function formatPeriod(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)

    if (hours === 0) {
        return `${mins}m`
    }
    return `${hours}h ${mins}m`
}

// Format altitude
export function formatAltitude(km: number): string {
    if (km >= 1000) {
        return `${(km / 1000).toFixed(1)}k km`
    }
    return `${Math.round(km)} km`
}

// Format inclination
export function formatInclination(deg: number): string {
    return `${deg.toFixed(2)}°`
}

// Format eccentricity
export function formatEccentricity(e: number): string {
    return e.toFixed(7)
}

// Format date relative
export function formatRelativeDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60))
        return `${diffMins} minutes ago`
    }
    if (diffHours < 24) {
        return `${diffHours} hours ago`
    }
    if (diffDays === 1) {
        return 'Yesterday'
    }
    if (diffDays < 7) {
        return `${diffDays} days ago`
    }
    return d.toLocaleDateString()
}

// Safely format numbers
export function safeToFixed(value: unknown, decimals: number = 2): string {
    if (typeof value === 'number' && !isNaN(value)) {
        return value.toFixed(decimals)
    }
    if (typeof value === 'string') {
        const parsed = parseFloat(value)
        if (!isNaN(parsed)) {
            return parsed.toFixed(decimals)
        }
    }
    return '—'
}

// ============ Summary Functions ============

// Get TLE summary for display
export function getTLESummary(tle: TLERecord): {
    name: string
    id: number
    regime: OrbitalRegime
    period: string
    apogee: string
    perigee: string
    inclination: string
    age: string
    ageStatus: TLEAgeStatus
} {
    const parsed = parseTLE(tle)
    const regime = getOrbitalRegime(parsed)
    const ageStatus = getTLEAgeStatus(tle)

    return {
        name: tle.name,
        id: tle.satelliteId,
        regime,
        period: formatPeriod(parsed.orbitalPeriod),
        apogee: formatAltitude(parsed.apogee),
        perigee: formatAltitude(parsed.perigee),
        inclination: formatInclination(parsed.inclination),
        age: formatRelativeDate(tle.date),
        ageStatus,
    }
}

// Get API stats
export async function getTLEStats(): Promise<{
    totalSatellites: number
    recentUpdates: number
}> {
    const response = await searchSatellites({ pageSize: 1 })

    return {
        totalSatellites: response?.totalItems || 0,
        recentUpdates: response?.totalItems || 0,
    }
}
