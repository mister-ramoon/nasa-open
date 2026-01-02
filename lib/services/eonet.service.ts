// Import constants and types
import { EONET_API_BASE_URL } from '../constants/eonet.constant'
import type {
    EONETEventsResponse,
    EONETCategoriesResponse,
    EONETLayersResponse,
    EONETEventsParams,
    EONETEvent,
} from '../types/eonet.type'

// Helper function to build query params
function buildQueryParams(params?: Record<string, unknown>): URLSearchParams {
    // Initialize query parameters
    const queryParams = new URLSearchParams()

    // Append additional parameters if provided
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value))
            }
        })
    }

    return queryParams
}

// Generic fetch function
async function fetchEONET<T>(
    endpoint: string,
    params?: Record<string, unknown>
): Promise<T> {
    // Build query parameters
    const queryParams = buildQueryParams(params)
    const queryString = queryParams.toString()
    const url = `${EONET_API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`

    // Make the API request
    const response = await fetch(url)

    // Handle response errors
    if (!response.ok) {
        throw new Error(`EONET ${endpoint} API Error: ${response.statusText}`)
    }

    return response.json()
}

// Get all events
export async function getEvents(
    params?: EONETEventsParams
): Promise<EONETEventsResponse> {
    // Fetch all events with optional query parameters
    return fetchEONET<EONETEventsResponse>('events', { ...params })
}

// Get events by category
export async function getEventsByCategory(
    categoryId: string,
    params?: EONETEventsParams
): Promise<EONETEventsResponse> {
    // Fetch events for a specific category with optional query parameters
    return fetchEONET<EONETEventsResponse>(`categories/${categoryId}`, {
        ...params,
    })
}

// Get a specific event by ID
export async function getEventById(eventId: string): Promise<EONETEvent> {
    // Fetch event details by event ID
    return fetchEONET<EONETEvent>(`events/${eventId}`)
}

// Get all categories
export async function getCategories(): Promise<EONETCategoriesResponse> {
    // Fetch all categories
    return fetchEONET<EONETCategoriesResponse>('categories')
}

// Get all layers
export async function getLayers(): Promise<EONETLayersResponse> {
    // Fetch all layers
    return fetchEONET<EONETLayersResponse>('layers')
}

// Get layers by category
export async function getLayersByCategory(
    categoryId: string
): Promise<EONETLayersResponse> {
    // Fetch layers for a specific category
    return fetchEONET<EONETLayersResponse>(`layers/${categoryId}`)
}
