// Imported Constants and Types
import {
    ASTEROIDS_API_BASE_URL,
    NASA_API_KEY,
} from '../constants/asteroids.constant'
import type {
    Asteroid,
    AsteroidFeedResponse,
    AsteroidBrowseResponse,
    AsteroidFeedParams,
    AsteroidBrowseParams,
} from '../types/asteroid.type'

// Fetch Asteroid Feed Data
export async function getAsteroidFeed(
    params?: AsteroidFeedParams
): Promise<AsteroidFeedResponse> {
    // Construct query parameters
    const queryParams = new URLSearchParams({
        api_key: NASA_API_KEY,
    })

    // Append optional query parameters
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)

    // Make the API request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
        const response = await fetch(
            `${ASTEROIDS_API_BASE_URL}/feed?${queryParams.toString()}`,
            {
                signal: controller.signal,
                cache: 'no-store',
            }
        )

        clearTimeout(timeoutId)

        // Handle response errors
        if (!response.ok) {
            throw new Error(`Asteroid Feed API Error: ${response.statusText}`)
        }

        // Return the parsed JSON response
        return response.json()
    } catch (error) {
        clearTimeout(timeoutId)
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Asteroid Feed API Error: Request timeout')
        }
        throw error
    }
}

// Fetch Asteroid Browse Data
export async function getAsteroidById(asteroidId: string): Promise<Asteroid> {
    // Construct query parameters
    const queryParams = new URLSearchParams({
        api_key: NASA_API_KEY,
    })

    // Make the API request
    const response = await fetch(
        `${ASTEROIDS_API_BASE_URL}/neo/${asteroidId}?${queryParams.toString()}`
    )

    // Handle response errors
    if (!response.ok) {
        throw new Error(`Asteroid Lookup API Error: ${response.statusText}`)
    }

    // Return the parsed JSON response
    return response.json()
}

// Browse Asteroids Data
export async function browseAsteroids(
    params?: AsteroidBrowseParams
): Promise<AsteroidBrowseResponse> {
    // Construct query parameters
    const queryParams = new URLSearchParams({
        api_key: NASA_API_KEY,
    })

    // Append optional query parameters
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.size) queryParams.append('size', params.size.toString())

    // Make the API request
    const response = await fetch(
        `${ASTEROIDS_API_BASE_URL}/neo/browse?${queryParams.toString()}`
    )

    // Handle response errors
    if (!response.ok) {
        throw new Error(`Asteroid Browse API Error: ${response.statusText}`)
    }

    // Return the parsed JSON response
    return response.json()
}
