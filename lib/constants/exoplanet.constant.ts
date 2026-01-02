// Export Exoplanet Archive API URL (uses TAP service)
export const EXOPLANET_API_BASE_URL =
    'https://exoplanetarchive.ipac.caltech.edu/TAP/sync'

// Export Exoplanet Constants
export const EXOPLANET_Constants = {
    title: 'Exoplanet Archive',
    description:
        'The NASA Exoplanet Archive is an online astronomical exoplanet and stellar catalog and data service that collects and serves public data that support the search for and characterization of extra-solar planets (exoplanets) and their host stars.',
}

// ExportAvailable Tables
export const EXOPLANET_TABLES = {
    ps: 'ps', // Planetary Systems
    pscomppars: 'pscomppars', // Planetary Systems Composite Parameters
    cumulative: 'cumulative', // Kepler Cumulative
    koi: 'koi', // Kepler Objects of Interest
    k2candidates: 'k2candidates', // K2 Candidates
} as const

// Export Discovery Methods
export const DISCOVERY_METHODS = [
    'Transit',
    'Radial Velocity',
    'Imaging',
    'Microlensing',
    'Eclipse Timing Variations',
    'Pulsar Timing',
    'Transit Timing Variations',
    'Orbital Brightness Modulation',
    'Astrometry',
    'Disk Kinematics',
] as const
