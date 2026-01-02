// Export SSCWeb API URLs
export const SSCWEB_API_BASE_URL = 'https://sscweb.gsfc.nasa.gov/WS/sscr/2'

// Export SSCWeb Constants
export const SATELLITE_Constants = {
    title: 'SSCWeb - Satellite Situation Center',
    description:
        'The Satellite Situation Center Web (SSCWeb) service provides geocentric spacecraft location information, geophysical region mappings, and magnetic field line tracings. Operated jointly by NASA/GSFC Space Physics Data Facility (SPDF) and the National Space Science Data Center (NSSDC).',
    dataSource: 'NASA/GSFC Space Physics Data Facility',
}

// Export Coordinate Systems
export const COORDINATE_SYSTEMS = {
    GEO: 'GEO', // Geographic
    GM: 'GM', // Geomagnetic
    GSE: 'GSE', // Geocentric Solar Ecliptic
    GSM: 'GSM', // Geocentric Solar Magnetospheric
    SM: 'SM', // Solar Magnetic
    GEI_TOD: 'GEI_TOD', // Geocentric Equatorial Inertial (True of Date)
    GEI_J2000: 'GEI_J2000', // Geocentric Equatorial Inertial (J2000)
} as const

// Export Region Types
export const REGION_TYPES = {
    interplanetaryMedium: 'InterplanetaryMedium',
    daysideMagnetosheath: 'DaysideMagnetosheath',
    nightsideMagnetosheath: 'NightsideMagnetosheath',
    daysideMagnetosphere: 'DaysideMagnetosphere',
    nightsideMagnetosphere: 'NightsideMagnetosphere',
    plasmaSheet: 'PlasmaSheet',
    tailLobe: 'TailLobe',
    highLatitudeBoundaryLayer: 'HighLatitudeBoundaryLayer',
    lowLatitudeBoundaryLayer: 'LowLatitudeBoundaryLayer',
    daysidePlasmasphere: 'DaysidePlasmasphere',
    nightsidePlasmasphere: 'NightsidePlasmasphere',
} as const

// Export Output Options
export const OUTPUT_OPTIONS = {
    allLocationFilters: 'AllLocationFilters',
    coordinateData: 'CoordinateData',
    bFieldTraceData: 'BFieldTraceData',
    regionData: 'RegionData',
} as const
