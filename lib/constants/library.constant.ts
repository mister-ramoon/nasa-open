// Export NASA Image and Video Library API URL
export const LIBRARY_API_BASE_URL = 'https://images-api.nasa.gov'

// Export Library Constants
export const LIBRARY_Constants = {
    title: 'NASA Image and Video Library',
    description:
        'Access the NASA Image and Video Library, containing a vast collection of images, videos, and audio files from NASA missions, events, and discoveries.',
}

// Export NASA Centers
export const NASA_CENTERS = [
    { id: 'ARC', name: 'Ames Research Center' },
    { id: 'AFRC', name: 'Armstrong Flight Research Center' },
    { id: 'GRC', name: 'Glenn Research Center' },
    { id: 'GSFC', name: 'Goddard Space Flight Center' },
    { id: 'HQ', name: 'NASA Headquarters' },
    { id: 'JPL', name: 'Jet Propulsion Laboratory' },
    { id: 'JSC', name: 'Johnson Space Center' },
    { id: 'KSC', name: 'Kennedy Space Center' },
    { id: 'LaRC', name: 'Langley Research Center' },
    { id: 'MSFC', name: 'Marshall Space Flight Center' },
    { id: 'SSC', name: 'Stennis Space Center' },
] as const

// Export Media Types
export const MEDIA_TYPES = {
    image: 'image',
    video: 'video',
    audio: 'audio',
} as const

// Export Popular search terms
export const POPULAR_SEARCHES = [
    'Mars',
    'Moon',
    'Apollo',
    'Space Shuttle',
    'ISS',
    'Hubble',
    'James Webb',
    'Saturn',
    'Jupiter',
    'Earth',
    'Astronaut',
    'Rocket Launch',
] as const
