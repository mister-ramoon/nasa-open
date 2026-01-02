// Export TLE API Base URL
export const TLE_API_BASE_URL = 'https://tle.ivanstanojevic.me'

// Export API Endpoints
export const TLE_ENDPOINTS = {
    SEARCH: '/api/tle',
    SINGLE: '/api/tle/{id}',
} as const

// Export Constants
export const TLE_Constants = {
    title: 'TLE API - Two Line Element Sets',
    description:
        'Up-to-date Two Line Element (TLE) set records for Earth-orbiting objects. TLE data encodes orbital elements for tracking satellites and predicting their positions.',
    dataSource: 'CelesTrak (updated daily)',
}

// Export Earth constants for orbital calculations
export const EARTH_CONSTANTS = {
    RADIUS_KM: 6378.137, // Equatorial radius in km
    MU: 398600.4418, // Standard gravitational parameter (km³/s²)
    J2: 0.00108263, // Second zonal harmonic
    ROTATION_RATE: 7.2921159e-5, // rad/s
    FLATTENING: 1 / 298.257223563,
} as const

// Export TLE Line format positions (1-indexed as per TLE spec)
export const TLE_LINE1_FIELDS = {
    LINE_NUMBER: { start: 1, end: 1 },
    SATELLITE_NUMBER: { start: 3, end: 7 },
    CLASSIFICATION: { start: 8, end: 8 },
    INTL_DESIGNATOR_YEAR: { start: 10, end: 11 },
    INTL_DESIGNATOR_LAUNCH: { start: 12, end: 14 },
    INTL_DESIGNATOR_PIECE: { start: 15, end: 17 },
    EPOCH_YEAR: { start: 19, end: 20 },
    EPOCH_DAY: { start: 21, end: 32 },
    MEAN_MOTION_DOT: { start: 34, end: 43 },
    MEAN_MOTION_DDOT: { start: 45, end: 52 },
    BSTAR: { start: 54, end: 61 },
    EPHEMERIS_TYPE: { start: 63, end: 63 },
    ELEMENT_SET_NUMBER: { start: 65, end: 68 },
    CHECKSUM: { start: 69, end: 69 },
} as const

export const TLE_LINE2_FIELDS = {
    LINE_NUMBER: { start: 1, end: 1 },
    SATELLITE_NUMBER: { start: 3, end: 7 },
    INCLINATION: { start: 9, end: 16 },
    RIGHT_ASCENSION: { start: 18, end: 25 },
    ECCENTRICITY: { start: 27, end: 33 },
    ARG_OF_PERIGEE: { start: 35, end: 42 },
    MEAN_ANOMALY: { start: 44, end: 51 },
    MEAN_MOTION: { start: 53, end: 63 },
    REVOLUTION_NUMBER: { start: 64, end: 68 },
    CHECKSUM: { start: 69, end: 69 },
} as const

// Export Well-known satellites
export const WELL_KNOWN_SATELLITES = {
    ISS: {
        id: 25544,
        name: 'International Space Station (ISS)',
        description: 'The largest modular space station in low Earth orbit',
        category: 'stations',
    },
    TIANGONG: {
        id: 48274,
        name: 'Tiangong Space Station',
        description: "China's modular space station",
        category: 'stations',
    },
    HUBBLE: {
        id: 20580,
        name: 'Hubble Space Telescope',
        description: 'Space telescope in low Earth orbit',
        category: 'science',
    },
    TERRA: {
        id: 25994,
        name: 'Terra (EOS AM-1)',
        description: 'NASA Earth observation satellite',
        category: 'science',
    },
    AQUA: {
        id: 27424,
        name: 'Aqua (EOS PM-1)',
        description: 'NASA Earth science satellite',
        category: 'science',
    },
    LANDSAT_9: {
        id: 49260,
        name: 'Landsat 9',
        description: 'Earth observation satellite',
        category: 'resource',
    },
    NOAA_20: {
        id: 43013,
        name: 'NOAA-20 (JPSS-1)',
        description: 'Weather satellite',
        category: 'weather',
    },
    GOES_16: {
        id: 41866,
        name: 'GOES-16 (GOES-R)',
        description: 'Geostationary weather satellite',
        category: 'goes',
    },
    GOES_17: {
        id: 43226,
        name: 'GOES-17 (GOES-S)',
        description: 'Geostationary weather satellite',
        category: 'goes',
    },
    GOES_18: {
        id: 51850,
        name: 'GOES-18 (GOES-T)',
        description: 'Geostationary weather satellite',
        category: 'goes',
    },
    JAMES_WEBB: {
        id: 50463,
        name: 'James Webb Space Telescope',
        description: 'Space telescope at L2 point',
        category: 'science',
    },
} as const

// Export Satellite categories
export const SATELLITE_CATEGORIES = {
    stations: 'Space Stations',
    visual: 'Brightest',
    active: 'Active Satellites',
    weather: 'Weather',
    noaa: 'NOAA',
    goes: 'GOES',
    resource: 'Earth Resources',
    science: 'Space & Earth Science',
    gps: 'GPS Operational',
    glonass: 'GLONASS Operational',
    galileo: 'Galileo',
    beidou: 'Beidou',
    starlink: 'Starlink',
    oneweb: 'OneWeb',
    iridium: 'Iridium',
    amateur: 'Amateur Radio',
    cubesat: 'CubeSats',
    military: 'Military',
    geo: 'Geostationary',
} as const

// Export Orbital regime classifications
export const ORBITAL_REGIMES = {
    LEO: {
        name: 'Low Earth Orbit',
        altitudeMin: 160,
        altitudeMax: 2000,
        periodMin: 88,
        periodMax: 127,
    },
    MEO: {
        name: 'Medium Earth Orbit',
        altitudeMin: 2000,
        altitudeMax: 35786,
        periodMin: 127,
        periodMax: 1436,
    },
    GEO: {
        name: 'Geostationary Orbit',
        altitudeMin: 35786,
        altitudeMax: 35786,
        periodMin: 1436,
        periodMax: 1436,
    },
    HEO: {
        name: 'Highly Elliptical Orbit',
        description: 'Orbit with high eccentricity (e > 0.25)',
    },
    SSO: {
        name: 'Sun-Synchronous Orbit',
        description: 'Orbit that precesses to maintain consistent solar angle',
    },
} as const

// Export TLE age thresholds (in days)
export const TLE_AGE_THRESHOLDS = {
    FRESH: 1, // Less than 1 day old
    RECENT: 7, // Less than 7 days old
    STALE: 30, // Less than 30 days old
    OLD: 30, // More than 30 days old
} as const

// Export TLE age status colors
export const TLE_AGE_COLORS = {
    fresh: { bg: 'bg-green-100', text: 'text-green-800' },
    recent: { bg: 'bg-blue-100', text: 'text-blue-800' },
    stale: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    old: { bg: 'bg-red-100', text: 'text-red-800' },
} as const

// Export Orbit type colors
export const ORBIT_COLORS = {
    LEO: { bg: 'bg-blue-100', text: 'text-blue-800' },
    MEO: { bg: 'bg-purple-100', text: 'text-purple-800' },
    GEO: { bg: 'bg-orange-100', text: 'text-orange-800' },
    HEO: { bg: 'bg-red-100', text: 'text-red-800' },
    SSO: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    Molniya: { bg: 'bg-pink-100', text: 'text-pink-800' },
    Other: { bg: 'bg-gray-100', text: 'text-gray-800' },
} as const
// Export Common search terms
export const COMMON_SEARCHES = [
    'ISS',
    'STARLINK',
    'NOAA',
    'GOES',
    'LANDSAT',
    'GPS',
    'IRIDIUM',
    'HUBBLE',
    'TERRA',
    'AQUA',
] as const
