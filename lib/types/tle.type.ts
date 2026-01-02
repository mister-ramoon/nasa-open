// TLE Record (Two-Line Element Set)
export interface TLERecord {
    '@id': string
    '@type': string
    satelliteId: number
    name: string
    date: string // ISO date string
    line1: string
    line2: string
}

// TLE API Response for list
export interface TLEListResponse {
    '@context': string
    '@id': string
    '@type': string
    totalItems: number
    member: TLERecord[]
    parameters: {
        search?: string
        sort?: string
        'sort-dir'?: string
        page?: number
        'page-size'?: number
    }
    view?: {
        '@id': string
        '@type': string
        first: string
        next?: string
        previous?: string
        last: string
    }
}

// TLE API Response for single record
export interface TLESingleResponse extends TLERecord {
    '@context': string
}

// Search Parameters
export interface TLESearchParams {
    search?: string
    sort?: 'id' | 'name' | 'date'
    sortDir?: 'asc' | 'desc'
    page?: number
    pageSize?: number
}

// Parsed TLE Data (extracted orbital elements)
export interface ParsedTLE {
    // Identification
    satelliteId: number
    name: string
    classification: string // U = Unclassified, C = Classified, S = Secret
    internationalDesignator: string

    // Epoch
    epochYear: number
    epochDay: number
    epochDate: Date

    // Orbital Elements
    meanMotionFirstDerivative: number // rev/day²
    meanMotionSecondDerivative: number // rev/day³
    bstarDragTerm: number
    ephemerisType: number
    elementSetNumber: number

    // Line 2 Elements
    inclination: number // degrees
    rightAscension: number // degrees (RAAN)
    eccentricity: number
    argumentOfPerigee: number // degrees
    meanAnomaly: number // degrees
    meanMotion: number // rev/day
    revolutionNumber: number

    // Derived values
    orbitalPeriod: number // minutes
    apogee: number // km
    perigee: number // km
    semiMajorAxis: number // km
}

// Satellite Category
export type SatelliteCategory =
    | 'stations' // Space stations
    | 'visual' // Brightest satellites
    | 'active' // Active satellites
    | 'analyst' // Analyst satellites
    | 'weather' // Weather satellites
    | 'noaa' // NOAA satellites
    | 'goes' // GOES satellites
    | 'resource' // Earth resources
    | 'sarsat' // Search & Rescue
    | 'dmc' // Disaster Monitoring
    | 'tdrss' // Tracking and Data Relay
    | 'argos' // ARGOS Data Collection
    | 'geo' // Geostationary
    | 'intelsat' // Intelsat
    | 'ses' // SES
    | 'iridium' // Iridium
    | 'iridium-next' // Iridium NEXT
    | 'starlink' // Starlink
    | 'oneweb' // OneWeb
    | 'orbcomm' // Orbcomm
    | 'globalstar' // Globalstar
    | 'swarm' // Swarm
    | 'amateur' // Amateur radio
    | 'x-comm' // Experimental comm
    | 'gps-ops' // GPS Operational
    | 'glo-ops' // GLONASS Operational
    | 'galileo' // Galileo
    | 'beidou' // Beidou
    | 'sbas' // Satellite-Based Augmentation
    | 'nnss' // Navy Navigation Satellite System
    | 'musson' // Russian LEO Navigation
    | 'science' // Space & Earth Science
    | 'geodetic' // Geodetic
    | 'engineering' // Engineering
    | 'education' // Education
    | 'military' // Miscellaneous Military
    | 'radar' // Radar Calibration
    | 'cubesat' // CubeSats
    | 'other' // Other

// Well-known satellites
export interface WellKnownSatellite {
    id: number
    name: string
    description: string
    category: SatelliteCategory
}

// Satellite pass prediction (simplified)
export interface SatellitePass {
    satellite: string
    riseTime: Date
    riseAzimuth: number
    maxElevationTime: Date
    maxElevation: number
    setTime: Date
    setAzimuth: number
    duration: number // seconds
    brightness?: number // magnitude
}

// Observer location
export interface ObserverLocation {
    latitude: number
    longitude: number
    altitude: number // meters
}

// Orbital regime
export type OrbitalRegime =
    | 'LEO'
    | 'MEO'
    | 'GEO'
    | 'HEO'
    | 'SSO'
    | 'Molniya'
    | 'Other'

// TLE Age Status
export type TLEAgeStatus = 'fresh' | 'recent' | 'stale' | 'old'
