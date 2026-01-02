// Export EPIC API URLs
export const EPIC_API_BASE_URL = 'https://api.nasa.gov/EPIC/api'
export const EPIC_ARCHIVE_URL = 'https://api.nasa.gov/EPIC/archive'
export const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY'

// Export EPIC Constants
export const EPIC_Constants = {
    title: 'EPIC - Earth Polychromatic Imaging Camera',
    description:
        "The EPIC API provides information on the daily imagery collected by DSCOVR's Earth Polychromatic Imaging Camera (EPIC) instrument. Uniquely positioned at the Earth-Sun Lagrange point, EPIC provides full disc imagery of the Earth and captures unique perspectives of certain astronomical events such as lunar transits.",
}

// Export EPIC Collections
export const EPIC_COLLECTIONS = {
    natural: 'natural',
    enhanced: 'enhanced',
} as const

// Export EPIC Image Formats
export const EPIC_IMAGE_FORMATS = {
    png: 'png',
    jpg: 'jpg',
    thumbs: 'thumbs',
} as const
