// Exported Constants for Asteroids API
export const ASTEROIDS_API_BASE_URL = 'https://api.nasa.gov/neo/rest/v1'
export const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY'

// Export Asteroids Constants
export const ASTEROIDS_Constants = {
    title: 'Asteroids - NeoWs',
    description:
        'NeoWs (Near Earth Object Web Service) is a RESTful web service for near earth Asteroid information. With NeoWs a user can: search for Asteroids based on their closest approach date to Earth, lookup a specific Asteroid with its NASA JPL small body id, as well as browse the overall data-set.',
    dataSource: 'NASA JPL Asteroid team',
}
