// Export InSight API URL
export const INSIGHT_API_BASE_URL = 'https://api.nasa.gov/insight_weather'
export const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY'

// Export InSight Constants
export const INSIGHT_Constants = {
    title: 'InSight - Mars Weather Service',
    description:
        "NASA's InSight Mars lander takes continuous weather measurements (temperature, wind, pressure) on the surface of Mars at Elysium Planitia, a flat, smooth plain near Mars' equator.",
    location: 'Elysium Planitia, Mars',
    coordinates: {
        latitude: 4.5,
        longitude: 135.9,
    },
    notice: 'This service has significant missing data due to InSight needing to manage power use. The mission ended in December 2022.',
}

// Export Compass points for wind direction
export const COMPASS_POINTS = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
] as const

// Export Mars seasons
export const MARS_SEASONS = {
    northern: ['spring', 'summer', 'fall', 'winter'],
    southern: ['fall', 'winter', 'spring', 'summer'],
} as const

// Export Unit conversions
export const INSIGHT_UNITS = {
    temperature: '°F', // API returns Fahrenheit
    pressure: 'Pa', // Pascals
    windSpeed: 'm/s', // meters per second
} as const
