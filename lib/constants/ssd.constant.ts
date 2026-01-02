// API Base URLs
export const SSD_API_BASE_URL = 'https://ssd-api.jpl.nasa.gov'

// Individual API endpoints
export const SSD_ENDPOINTS = {
    CAD: '/cad.api', // Close Approach Data
    FIREBALL: '/fireball.api', // Fireball atmospheric impact data
    NHATS: '/nhats.api', // Human-accessible NEOs
    SCOUT: '/scout.api', // NEOCP orbits and impact risk
    SENTRY: '/sentry.api', // NEO Earth impact risk
    MISSION_DESIGN: '/mdesign.api', // Mission design suite
} as const

// Constants
export const SSD_Constants = {
    title: 'SSD/CNEOS - Solar System Dynamics',
    description:
        "JPL's Solar System Dynamics (SSD) and Center for Near-Earth Object Studies (CNEOS) provides data on asteroid and comet close approaches, fireball events, potentially hazardous asteroids, and mission design parameters.",
    dataSource: 'NASA/JPL Solar System Dynamics Group',
}

// Orbit Classes
export const ORBIT_CLASSES = {
    ATE: 'Aten', // Earth-crossing with a < 1 au
    APO: 'Apollo', // Earth-crossing with a > 1 au
    AMO: 'Amor', // Earth-approaching but not crossing
    IEO: 'Interior Earth Object', // Orbit inside Earth's
    MCA: 'Mars-crossing Asteroid',
    IMB: 'Inner Main-belt Asteroid',
    MBA: 'Main-belt Asteroid',
    OMB: 'Outer Main-belt Asteroid',
    TJN: 'Jupiter Trojan',
    CEN: 'Centaur',
    TNO: 'Trans-Neptunian Object',
    COM: 'Comet',
    HYP: 'Hyperbolic Comet',
    PAR: 'Parabolic Comet',
} as const

// Close Approach Bodies
export const APPROACH_BODIES = {
    Earth: 'Earth',
    Moon: 'Moon',
    Mercury: 'Merc',
    Venus: 'Venus',
    Mars: 'Mars',
    Jupiter: 'Juptr',
    Saturn: 'Satrn',
    Uranus: 'Urnus',
    Neptune: 'Neptn',
} as const

// Torino Scale (impact hazard)
export const TORINO_SCALE = {
    0: 'No hazard',
    1: 'Normal',
    2: 'Meriting attention',
    3: 'Meriting attention',
    4: 'Meriting attention',
    5: 'Threatening',
    6: 'Threatening',
    7: 'Threatening',
    8: 'Certain collision',
    9: 'Certain collision',
    10: 'Certain collision',
} as const

// Distance units
export const DISTANCE_CONVERSIONS = {
    AU_TO_KM: 149597870.7,
    AU_TO_LD: 389.17, // Lunar distances
    LD_TO_KM: 384400,
} as const

// Sort options
export const CAD_SORT_OPTIONS = [
    { value: 'date', label: 'Date' },
    { value: 'dist', label: 'Distance' },
    { value: 'dist-min', label: 'Minimum Distance' },
    { value: 'v-inf', label: 'Velocity at Infinity' },
    { value: 'v-rel', label: 'Relative Velocity' },
    { value: 'h', label: 'Absolute Magnitude' },
    { value: 'object', label: 'Object Name' },
] as const

// Fireball sort options
export const FIREBALL_SORT_OPTIONS = [
    { value: 'date', label: 'Date' },
    { value: 'energy', label: 'Total Energy' },
    { value: 'impact-e', label: 'Impact Energy' },
    { value: 'vel', label: 'Velocity' },
    { value: 'alt', label: 'Altitude' },
] as const
