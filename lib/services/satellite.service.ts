// Import constants and types
import {
    SSCWEB_API_BASE_URL,
    COORDINATE_SYSTEMS,
} from '../constants/satellite.constant'
import type {
    Observatory,
    ObservatoriesResponse,
    GroundStation,
    GroundStationsResponse,
    LocationRequest,
    LocationsResponse,
    LocationResultData,
    CoordinateSystem,
} from '../types/satellite.type'

// Generic fetch function for SSCWeb API
async function fetchSSC<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T | null> {
    const url = `${SSCWEB_API_BASE_URL}${endpoint}`

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        if (!response.ok) {
            console.error(
                `SSCWeb API Error: ${response.status} ${response.statusText}`
            )
            return null
        }

        return response.json()
    } catch (error) {
        console.error('SSCWeb API fetch error:', error)
        return null
    }
}

// ============ Observatory Endpoints ============

// Get all available observatories/spacecraft
export async function getObservatories(): Promise<Observatory[]> {
    const response = await fetchSSC<ObservatoriesResponse>('/observatories')
    return response?.Observatory || []
}

// Get observatory by ID
export async function getObservatoryById(
    id: string
): Promise<Observatory | null> {
    const observatories = await getObservatories()
    return observatories.find((obs) => obs.Id === id) || null
}

// Get currently active observatories
export async function getActiveObservatories(): Promise<Observatory[]> {
    const observatories = await getObservatories()
    const now = new Date()

    return observatories.filter((obs) => {
        const endTime = new Date(obs.EndTime)
        return endTime > now
    })
}

// ============ Ground Station Endpoints ============

// Get all ground stations
export async function getGroundStations(): Promise<GroundStation[]> {
    const response = await fetchSSC<GroundStationsResponse>('/groundStations')
    return response?.GroundStation || []
}

// ============ Locations Endpoints ============

// Get spacecraft locations
export async function getLocations(
    request: LocationRequest
): Promise<LocationResultData[]> {
    // Build the request body for SSCWeb
    const requestBody = {
        Request: {
            TimeInterval: {
                Start: request.startTime,
                End: request.endTime,
            },
            Satellites: request.satellites.map((id) => ({
                Id: id,
                ResolutionFactor: 1,
            })),
            OutputOptions: {
                CoordinateOptions: [
                    {
                        CoordinateSystem:
                            request.coordinateSystem || COORDINATE_SYSTEMS.GEO,
                        Component: 'all',
                    },
                ],
                AllLocationFilters: request.allLocationFilters ?? false,
                BFieldTraceOptions: request.bFieldTraceData
                    ? [
                          {
                              CoordinateSystem: 'GEO',
                              Hemisphere: 'North',
                              FootpointLatitude: true,
                              FootpointLongitude: true,
                          },
                          {
                              CoordinateSystem: 'GEO',
                              Hemisphere: 'South',
                              FootpointLatitude: true,
                              FootpointLongitude: true,
                          },
                      ]
                    : [],
                RegionOptions: request.regionData
                    ? {
                          SpacecraftRegion: true,
                          RadialTracedFootpointRegion: true,
                          NorthBTracedFootpointRegion: true,
                          SouthBTracedFootpointRegion: true,
                      }
                    : undefined,
            },
        },
    }

    const response = await fetchSSC<LocationsResponse>('/locations', {
        method: 'POST',
        body: JSON.stringify(requestBody),
    })

    return response?.Data || []
}

// Get simple location data for a single satellite
export async function getSatelliteLocation(
    satelliteId: string,
    startTime: string,
    endTime: string,
    coordinateSystem: CoordinateSystem = 'GEO'
): Promise<LocationResultData | null> {
    const results = await getLocations({
        satellites: [satelliteId],
        startTime,
        endTime,
        coordinateSystem,
    })

    return results[0] || null
}

// ============ Utility Functions ============

// Format date for SSCWeb API (ISO 8601)
export function formatDateForSSC(date: Date): string {
    return date.toISOString()
}

// Get date range for last N hours
export function getHoursAgo(hours: number): { start: string; end: string } {
    const end = new Date()
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000)

    return {
        start: formatDateForSSC(start),
        end: formatDateForSSC(end),
    }
}

// Get date range for last N days
export function getDaysAgo(days: number): { start: string; end: string } {
    const end = new Date()
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)

    return {
        start: formatDateForSSC(start),
        end: formatDateForSSC(end),
    }
}

// Calculate distance between two 3D points (in km)
export function calculateDistance(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
): number {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
    )
}

// Search observatories by name
export async function searchObservatories(
    searchTerm: string
): Promise<Observatory[]> {
    const observatories = await getObservatories()
    const term = searchTerm.toLowerCase()

    return observatories.filter(
        (obs) =>
            obs.Name.toLowerCase().includes(term) ||
            obs.Id.toLowerCase().includes(term)
    )
}

// Get popular/well-known satellites
export function getPopularSatellites(): string[] {
    return [
        'themisa',
        'themisb',
        'themisc',
        'themisd',
        'themise',
        'mms1',
        'mms2',
        'mms3',
        'mms4',
        'cluster1',
        'cluster2',
        'cluster3',
        'cluster4',
        'goes16',
        'goes17',
        'dscovr',
        'ace',
        'wind',
        'geotail',
    ]
}
