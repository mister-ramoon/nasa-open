// API Base URL
export const TECHTRANSFER_API_BASE_URL = 'https://api.nasa.gov/techtransfer'

// API Endpoints
export const TECHTRANSFER_ENDPOINTS = {
    PATENT: '/patent/',
    PATENT_ISSUED: '/patent_issued/',
    SOFTWARE: '/software/',
    SPINOFF: '/spinoff/',
} as const

// Constants
export const TECHTRANSFER_Constants = {
    title: 'NASA Technology Transfer',
    description:
        "NASA's Technology Transfer Program ensures that innovations developed for exploration and discovery are broadly available to the public. Access NASA's patents, software, and technology spinoff descriptions.",
    dataSource: 'NASA Technology Transfer Program',
}

// NASA Centers
export const NASA_CENTERS = {
    ARC: {
        name: 'Ames Research Center',
        location: 'Mountain View, CA',
    },
    AFRC: {
        name: 'Armstrong Flight Research Center',
        location: 'Edwards, CA',
    },
    GRC: {
        name: 'Glenn Research Center',
        location: 'Cleveland, OH',
    },
    GSFC: {
        name: 'Goddard Space Flight Center',
        location: 'Greenbelt, MD',
    },
    JPL: {
        name: 'Jet Propulsion Laboratory',
        location: 'Pasadena, CA',
    },
    JSC: {
        name: 'Johnson Space Center',
        location: 'Houston, TX',
    },
    KSC: {
        name: 'Kennedy Space Center',
        location: 'Kennedy Space Center, FL',
    },
    LaRC: {
        name: 'Langley Research Center',
        location: 'Hampton, VA',
    },
    MSFC: {
        name: 'Marshall Space Flight Center',
        location: 'Huntsville, AL',
    },
    SSC: {
        name: 'Stennis Space Center',
        location: 'Stennis Space Center, MS',
    },
} as const

// Technology Categories
export const TECH_CATEGORIES = {
    AEROSPACE: 'Aerospace',
    COMMUNICATIONS: 'Communications',
    ELECTRICAL: 'Electrical and Electronics',
    ENVIRONMENT: 'Environment',
    HEALTH: 'Health, Medicine and Biotechnology',
    IT: 'Information Technology and Software',
    INSTRUMENTATION: 'Instrumentation',
    MANUFACTURING: 'Manufacturing',
    MATERIALS: 'Materials and Coatings',
    MECHANICAL: 'Mechanical and Fluid Systems',
    OPTICS: 'Optics',
    POWER: 'Power Generation and Storage',
    PROPULSION: 'Propulsion',
    ROBOTICS: 'Robotics, Automation and Control',
    SENSORS: 'Sensors',
} as const

// Software Release Types
export const SOFTWARE_RELEASE_TYPES = {
    OPEN_SOURCE: 'Open Source',
    US_RELEASE: 'U.S. Release Only',
    US_GOV: 'U.S. Government Purpose Release',
    GENERAL: 'General Public Release',
} as const

// Type Colors for UI
export const TYPE_COLORS = {
    patent: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
    },
    patent_issued: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
    },
    software: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
    },
    spinoff: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
    },
} as const

// Example search terms for demo
export const EXAMPLE_SEARCHES = [
    'engine',
    'solar',
    'battery',
    'robot',
    'sensor',
    'composite',
    'propulsion',
    'thermal',
    'antenna',
    'laser',
] as const

// Field mappings for raw API response arrays
// Patent fields (based on API response order)
export const PATENT_FIELD_MAP = {
    0: 'id',
    1: 'patent_number',
    2: 'center',
    3: 'title',
    4: 'description',
    5: 'category',
    6: 'subcategory',
    7: 'serial_number',
    8: 'contact',
    9: 'image_url',
} as const

// Software fields
export const SOFTWARE_FIELD_MAP = {
    0: 'id',
    1: 'title',
    2: 'description',
    3: 'category',
    4: 'subcategory',
    5: 'center',
    6: 'release_type',
    7: 'software_class',
    8: 'contact',
    9: 'external_url',
} as const

// Spinoff fields
export const SPINOFF_FIELD_MAP = {
    0: 'id',
    1: 'title',
    2: 'description',
    3: 'category',
    4: 'year',
    5: 'nasa_center',
    6: 'company',
    7: 'city',
    8: 'state',
    9: 'image_url',
} as const
