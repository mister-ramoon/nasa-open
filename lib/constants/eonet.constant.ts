// Exported EONET API Base URL
export const EONET_API_BASE_URL = 'https://eonet.gsfc.nasa.gov/api/v3'

// Exported EONET Constants
export const EONET_Constants = {
    title: 'EONET - Earth Observatory Natural Event Tracker',
    description:
        'The Earth Observatory Natural Event Tracker (EONET) is a prototype web service providing a curated source of continuously updated natural event metadata and linking those events to thematically-related web service-enabled image sources.',
}

// Exported EONET Categories
export const EONET_CATEGORIES = {
    drought: 'drought',
    dustHaze: 'dustHaze',
    earthquakes: 'earthquakes',
    floods: 'floods',
    landslides: 'landslides',
    manmade: 'manmade',
    seaLakeIce: 'seaLakeIce',
    severeStorms: 'severeStorms',
    snow: 'snow',
    tempExtremes: 'tempExtremes',
    volcanoes: 'volcanoes',
    waterColor: 'waterColor',
    wildfires: 'wildfires',
} as const
