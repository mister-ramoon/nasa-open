// Coordinate System Type
export type CoordinateSystem =
    | 'GEO'
    | 'GM'
    | 'GSE'
    | 'GSM'
    | 'SM'
    | 'GEI_TOD'
    | 'GEI_J2000'

// Spacecraft/Observatory Type
export interface Observatory {
    Id: string
    Name: string
    Resolution: number
    StartTime: string
    EndTime: string
    ResourceId?: string
}

// Observatories Response
export interface ObservatoriesResponse {
    Observatory: Observatory[]
}

// Ground Station Type
export interface GroundStation {
    Id: string
    Name: string
    Latitude: number
    Longitude: number
}

// Ground Stations Response
export interface GroundStationsResponse {
    GroundStation: GroundStation[]
}

// Coordinate Data
export interface CoordinateData {
    X: number[]
    Y: number[]
    Z: number[]
    Latitude?: number[]
    Longitude?: number[]
    LocalTime?: number[]
}

// B-Field Trace Data
export interface BFieldTraceData {
    Latitude: number[]
    Longitude: number[]
    ArcLength?: number[]
}

// Region Data
export interface RegionData {
    SpacecraftRegion?: string[]
    RadialTracedFootpointRegion?: string[]
    NorthBTracedFootpointRegion?: string[]
    SouthBTracedFootpointRegion?: string[]
}

// Location Result Data
export interface LocationResultData {
    Id: string
    CoordinateSystem: CoordinateSystem
    Time: string[]
    Coordinates?: CoordinateData
    BFieldTrace?: {
        North?: BFieldTraceData
        South?: BFieldTraceData
    }
    Regions?: RegionData
}

// Locations Response
export interface LocationsResponse {
    Data: LocationResultData[]
}

// Location Request Parameters
export interface LocationRequest {
    satellites: string[]
    startTime: string // ISO 8601 format
    endTime: string // ISO 8601 format
    coordinateSystem?: CoordinateSystem
    allLocationFilters?: boolean
    bFieldTraceData?: boolean
    regionData?: boolean
}

// Conjunction Query Parameters
export interface ConjunctionParams {
    satellites: string[]
    startTime: string
    endTime: string
    maxDistance?: number // in km
}

// Conjunction Result
export interface Conjunction {
    Time: string
    Satellites: {
        Id: string
        X: number
        Y: number
        Z: number
    }[]
    Distance: number
}

// Conjunctions Response
export interface ConjunctionsResponse {
    Conjunction: Conjunction[]
}

// Graph Request for Orbit Visualization
export interface GraphRequest {
    satellite: string
    startTime: string
    endTime: string
    coordinateSystem?: CoordinateSystem
    projection?: 'XY' | 'XZ' | 'YZ'
}
