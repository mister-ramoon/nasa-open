// Import constants and types
import { APOD_API_URL, NASA_API_KEY } from '../constants/apod.constant'
import type { ApodImage, ApodQueryParams } from '../types/apod.type'

// Fetch Astronomy Picture of the Day (APOD) data
export async function getApod(
    params?: ApodQueryParams
): Promise<ApodImage | ApodImage[]> {
    // Construct query parameters
    const queryParams = new URLSearchParams({
        api_key: NASA_API_KEY,
    })

    // Append optional query parameters
    if (params?.date) queryParams.append('date', params.date)
    if (params?.start_date) queryParams.append('start_date', params.start_date)
    if (params?.end_date) queryParams.append('end_date', params.end_date)
    if (params?.count) queryParams.append('count', params.count.toString())
    if (params?.thumbs) queryParams.append('thumbs', 'true')

    // Make the API request
    const response = await fetch(`${APOD_API_URL}?${queryParams.toString()}`)

    // Handle response errors
    if (!response.ok) {
        throw new Error(`APOD API Error: ${response.statusText}`)
    }

    // Return the parsed JSON response
    return response.json()
}
