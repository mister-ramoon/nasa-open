import {
    SSD_API_BASE_URL,
    SSD_ENDPOINTS,
    DISTANCE_CONVERSIONS,
} from '../constants/ssd.constant'
import type {
    CADResponse,
    CADParams,
    ProcessedCloseApproach,
    FireballResponse,
    FireballParams,
    ProcessedFireball,
    NHATSResponse,
    NHATSParams,
    NHATSObject,
    ScoutResponse,
    ScoutParams,
    ScoutObject,
    SentryResponse,
    SentryDetailResponse,
    SentryParams,
    SentryObject,
    MissionDesignResponse,
    MissionDesignParams,
} from '../types/ssd.type'

// Generic fetch function for SSD API
async function fetchSSD<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
): Promise<T | null> {
    const url = new URL(`${SSD_API_BASE_URL}${endpoint}`)

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.append(key, String(value))
            }
        })
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
            next: { revalidate: 300 },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            // Don't log 503 errors as they're expected during maintenance
            if (response.status !== 503) {
                console.error(
                    `SSD API Error: ${response.status} ${response.statusText} - URL: ${url.toString()}`
                )
            }
            return null
        }

        return response.json()
    } catch (error) {
        // Don't log abort errors
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('SSD API fetch error:', error)
        }
        return null
    }
}

// ============ CAD (Close Approach Data) ============

// Get close approach data with proper parameter names
export async function getCloseApproaches(
    params?: CADParams
): Promise<CADResponse | null> {
    const queryParams: Record<string, string | number | boolean | undefined> =
        {}

    // Map parameters to correct API parameter names (using hyphens)
    if (params?.date_min) queryParams['date-min'] = params.date_min
    if (params?.date_max) queryParams['date-max'] = params.date_max
    if (params?.dist_min) queryParams['dist-min'] = params.dist_min
    if (params?.dist_max) queryParams['dist-max'] = params.dist_max
    if (params?.h_min !== undefined) queryParams['h-min'] = params.h_min
    if (params?.h_max !== undefined) queryParams['h-max'] = params.h_max
    if (params?.v_inf_min !== undefined)
        queryParams['v-inf-min'] = params.v_inf_min
    if (params?.v_inf_max !== undefined)
        queryParams['v-inf-max'] = params.v_inf_max
    if (params?.v_rel_min !== undefined)
        queryParams['v-rel-min'] = params.v_rel_min
    if (params?.v_rel_max !== undefined)
        queryParams['v-rel-max'] = params.v_rel_max
    if (params?.class) queryParams['class'] = params.class
    if (params?.pha) queryParams['pha'] = params.pha
    if (params?.nea) queryParams['nea'] = params.nea
    if (params?.comet) queryParams['comet'] = params.comet
    if (params?.neo_only) queryParams['neo'] = params.neo_only
    if (params?.kind) queryParams['kind'] = params.kind
    if (params?.body) queryParams['body'] = params.body
    if (params?.sort) queryParams['sort'] = params.sort
    if (params?.limit) queryParams['limit'] = params.limit
    if (params?.fullname) queryParams['fullname'] = params.fullname

    return fetchSSD<CADResponse>(SSD_ENDPOINTS.CAD, queryParams)
}

// Get upcoming close approaches - use proper date format
export async function getUpcomingCloseApproaches(
    days: number = 60,
    distMax: string = '0.05'
): Promise<CADResponse | null> {
    return getCloseApproaches({
        date_min: 'now',
        date_max: `+${days}`,
        dist_max: distMax,
        sort: 'date',
    })
}

// Get close approaches for a specific object
export async function getObjectCloseApproaches(
    designation: string
): Promise<CADResponse | null> {
    const response = await getCloseApproaches({
        date_min: '-100',
        date_max: '+100',
    })

    if (!response) return null

    const filteredData = response.data.filter((row) =>
        row[0]?.toLowerCase().includes(designation.toLowerCase())
    )

    return {
        ...response,
        count: String(filteredData.length),
        data: filteredData,
    }
}

// Process raw CAD response into structured data
export function processCloseApproaches(
    response: CADResponse
): ProcessedCloseApproach[] {
    if (!response?.data || !response?.fields) return []

    const fieldIndexes: Record<string, number> = {}
    response.fields.forEach((field, index) => {
        fieldIndexes[field] = index
    })

    return response.data.map((row) => {
        const distAu = parseFloat(row[fieldIndexes['dist']] || '0')
        const h = parseFloat(row[fieldIndexes['h']] || '30')
        const diameterKm = (1329 * Math.pow(10, -h / 5)) / Math.sqrt(0.14)

        return {
            name: row[fieldIndexes['des']] || 'Unknown',
            date: new Date(row[fieldIndexes['cd']] || ''),
            distance_au: distAu,
            distance_km: distAu * DISTANCE_CONVERSIONS.AU_TO_KM,
            distance_ld: distAu * DISTANCE_CONVERSIONS.AU_TO_LD,
            velocity_km_s: parseFloat(row[fieldIndexes['v_rel']] || '0'),
            magnitude: h,
            diameter_m: diameterKm * 1000,
            isPHA: distAu <= 0.05 && h <= 22,
        }
    })
}

// ============ Fireball Data ============

// Get fireball events with proper parameter mapping
export async function getFireballs(
    params?: FireballParams
): Promise<FireballResponse | null> {
    const queryParams: Record<string, string | number | boolean | undefined> =
        {}

    if (params?.date_min) queryParams['date-min'] = params.date_min
    if (params?.date_max) queryParams['date-max'] = params.date_max
    if (params?.energy_min !== undefined)
        queryParams['energy-min'] = params.energy_min
    if (params?.energy_max !== undefined)
        queryParams['energy-max'] = params.energy_max
    if (params?.impact_e_min !== undefined)
        queryParams['impact-e-min'] = params.impact_e_min
    if (params?.impact_e_max !== undefined)
        queryParams['impact-e-max'] = params.impact_e_max
    if (params?.vel_min !== undefined) queryParams['vel-min'] = params.vel_min
    if (params?.vel_max !== undefined) queryParams['vel-max'] = params.vel_max
    if (params?.alt_min !== undefined) queryParams['alt-min'] = params.alt_min
    if (params?.alt_max !== undefined) queryParams['alt-max'] = params.alt_max
    if (params?.req_loc) queryParams['req-loc'] = params.req_loc
    if (params?.req_alt) queryParams['req-alt'] = params.req_alt
    if (params?.req_vel) queryParams['req-vel'] = params.req_vel
    if (params?.req_vel_comp) queryParams['req-vel-comp'] = params.req_vel_comp
    if (params?.vel_comp) queryParams['vel-comp'] = params.vel_comp
    if (params?.sort) queryParams['sort'] = params.sort
    if (params?.limit) queryParams['limit'] = params.limit

    return fetchSSD<FireballResponse>(SSD_ENDPOINTS.FIREBALL, queryParams)
}

// Get recent fireballs - no filter, get all and sort
export async function getRecentFireballs(
    days: number = 365
): Promise<FireballResponse | null> {
    // Fireball API returns all data by default, just limit results
    return getFireballs({
        limit: 100,
        sort: 'date',
    })
}

// Get large fireballs
export async function getLargeFireballs(
    minEnergyKt: number = 1
): Promise<FireballResponse | null> {
    return getFireballs({
        energy_min: minEnergyKt,
        sort: 'energy',
    })
}

// Process fireball data
export function processFireballs(
    response: FireballResponse
): ProcessedFireball[] {
    if (!response?.data || !response?.fields) return []

    const fieldIndexes: Record<string, number> = {}
    response.fields.forEach((field, index) => {
        fieldIndexes[field] = index
    })

    return response.data.map((row) => {
        const lat = row[fieldIndexes['lat']]
        const latDir = row[fieldIndexes['lat-dir']]
        const lon = row[fieldIndexes['lon']]
        const lonDir = row[fieldIndexes['lon-dir']]

        let location = null
        if (lat && lon) {
            location = {
                lat: parseFloat(lat) * (latDir === 'S' ? -1 : 1),
                lon: parseFloat(lon) * (lonDir === 'W' ? -1 : 1),
            }
        }

        return {
            date: new Date(row[fieldIndexes['date']] || ''),
            location,
            altitude_km: row[fieldIndexes['alt']]
                ? parseFloat(row[fieldIndexes['alt']] as string)
                : null,
            velocity_km_s: row[fieldIndexes['vel']]
                ? parseFloat(row[fieldIndexes['vel']] as string)
                : null,
            energy_kt: parseFloat(row[fieldIndexes['energy']] || '0'),
            impact_energy_kt: row[fieldIndexes['impact-e']]
                ? parseFloat(row[fieldIndexes['impact-e']] as string)
                : null,
        }
    })
}

// ============ NHATS (Human-Accessible NEOs) ============

// Get NHATS accessible NEOs
export async function getNHATSObjects(
    params?: NHATSParams
): Promise<NHATSResponse | null> {
    return fetchSSD<NHATSResponse>(SSD_ENDPOINTS.NHATS, { ...params })
}

// Get easiest to reach NEOs
export async function getEasiestNHATSObjects(
    maxDeltaV: number = 6
): Promise<NHATSObject[]> {
    const response = await getNHATSObjects({
        dv: maxDeltaV,
    })

    if (!response?.data) return []
    return response.data.sort((a, b) => a.min_dv - b.min_dv)
}

// Get NHATS object by designation
export async function getNHATSObject(
    designation: string
): Promise<NHATSObject | null> {
    const response = await getNHATSObjects({
        des: designation,
    })
    return response?.data?.[0] || null
}

// ============ Scout (NEOCP Risk Assessment) ============

// Get Scout data
export async function getScoutObjects(
    params?: ScoutParams
): Promise<ScoutResponse | null> {
    return fetchSSD<ScoutResponse>(SSD_ENDPOINTS.SCOUT, { ...params })
}

// Get all current Scout objects
export async function getCurrentScoutObjects(): Promise<ScoutObject[]> {
    const response = await getScoutObjects()
    return response?.data || []
}

// Get high-risk Scout objects
export async function getHighRiskScoutObjects(): Promise<ScoutObject[]> {
    const objects = await getCurrentScoutObjects()
    return objects.filter(
        (obj) => obj.neoScore >= 50 || (obj.phaScore && obj.phaScore >= 50)
    )
}

// Get Scout object by designation
export async function getScoutObject(
    designation: string
): Promise<ScoutObject | null> {
    const response = await getScoutObjects({
        tdes: designation,
    })
    return response?.data?.[0] || null
}

// ============ Sentry (Impact Risk Assessment) ============

// Get Sentry data
export async function getSentryObjects(
    params?: SentryParams
): Promise<SentryResponse | null> {
    return fetchSSD<SentryResponse>(SSD_ENDPOINTS.SENTRY, { ...params })
}

// Get all monitored Sentry objects
export async function getAllSentryObjects(): Promise<SentryObject[]> {
    const response = await getSentryObjects()
    return response?.data || []
}

// Get Sentry object details
export async function getSentryObjectDetails(
    designation: string
): Promise<SentryDetailResponse | null> {
    return fetchSSD<SentryDetailResponse>(SSD_ENDPOINTS.SENTRY, {
        des: designation,
    })
}

// Get highest risk Sentry objects
export async function getHighestRiskObjects(
    limit: number = 10
): Promise<SentryObject[]> {
    const objects = await getAllSentryObjects()
    return objects
        .sort((a, b) => parseFloat(b.ps) - parseFloat(a.ps))
        .slice(0, limit)
}

// Get removed objects from Sentry
export async function getRemovedSentryObjects(): Promise<SentryObject[]> {
    const response = await getSentryObjects({
        removed: true,
    })
    return response?.data || []
}

// ============ Mission Design ============

export async function getMissionDesign(
    params: MissionDesignParams
): Promise<MissionDesignResponse | null> {
    return fetchSSD<MissionDesignResponse>(SSD_ENDPOINTS.MISSION_DESIGN, {
        ...params,
    })
}

// ============ Utility Functions ============

export function formatDistance(
    distAu: number,
    unit: 'au' | 'km' | 'ld' = 'ld'
): string {
    switch (unit) {
        case 'au':
            return `${distAu.toFixed(4)} AU`
        case 'km':
            return `${(distAu * DISTANCE_CONVERSIONS.AU_TO_KM).toLocaleString()} km`
        case 'ld':
            return `${(distAu * DISTANCE_CONVERSIONS.AU_TO_LD).toFixed(1)} LD`
    }
}

export function getSizeCategory(h: number): string {
    if (h <= 17.75) return 'Very Large (>1 km)'
    if (h <= 20) return 'Large (300m - 1km)'
    if (h <= 22) return 'Medium (140m - 300m)'
    if (h <= 25) return 'Small (50m - 140m)'
    if (h <= 28) return 'Very Small (10m - 50m)'
    return 'Tiny (<10m)'
}

// Get summary statistics with error handling
export async function getSSDSummary(): Promise<{
    upcomingApproaches: number
    recentFireballs: number
    sentryObjects: number
    nhatsObjects: number
}> {
    // Fetch each independently to prevent one failure from affecting others
    const approachesPromise = getUpcomingCloseApproaches(60).catch(() => null)
    const fireballsPromise = getRecentFireballs(365).catch(() => null)
    const sentryPromise = getAllSentryObjects().catch(() => [])
    const nhatsPromise = getNHATSObjects({ dv: 12 }).catch(() => null)

    const [approaches, fireballs, sentry, nhats] = await Promise.all([
        approachesPromise,
        fireballsPromise,
        sentryPromise,
        nhatsPromise,
    ])

    return {
        upcomingApproaches: approaches?.count ? parseInt(approaches.count) : 0,
        recentFireballs: fireballs?.count ? parseInt(fireballs.count) : 0,
        sentryObjects: Array.isArray(sentry) ? sentry.length : 0,
        nhatsObjects: nhats?.count ?? 0,
    }
}

// Safely format a number to fixed decimal places
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
