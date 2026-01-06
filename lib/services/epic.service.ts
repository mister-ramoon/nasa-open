// Import constants and types
import {
    EPIC_API_BASE_URL,
    EPIC_ARCHIVE_URL,
    NASA_API_KEY,
} from '../constants/epic.constant'
import type {
    EPICImage,
    EPICAvailableDate,
    EPICCollection,
    EPICImageFormat,
} from '../types/epic.type'

// Generic fetch function
async function fetchEPIC<T>(endpoint: string): Promise<T> {
    // Construct the full URL with API key
    const url = `${EPIC_API_BASE_URL}/${endpoint}?api_key=${NASA_API_KEY}`

    // Make the API request with error handling and timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            cache: 'no-store',
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            console.error(
                `EPIC API Error: ${response.status} ${response.statusText}`
            )
            return [] as T
        }

        return response.json()
    } catch (error) {
        clearTimeout(timeoutId)
        console.error('EPIC API fetch error:', error)
        return [] as T
    }
}

// Get most recent natural color imagery
export async function getNaturalImages(): Promise<EPICImage[]> {
    // Fetch most recent natural color images
    return fetchEPIC<EPICImage[]>('natural')
}

// Get natural color imagery for a specific date
export async function getNaturalImagesByDate(
    date: string
): Promise<EPICImage[]> {
    // Fetch natural color images for a specific date
    return fetchEPIC<EPICImage[]>(`natural/date/${date}`)
}

// Get all available dates for natural color imagery
export async function getNaturalAvailableDates(): Promise<EPICAvailableDate[]> {
    // Fetch all available dates for natural color images
    return fetchEPIC<EPICAvailableDate[]>('natural/all')
}

// Get most recent enhanced color imagery
export async function getEnhancedImages(): Promise<EPICImage[]> {
    // Fetch most recent enhanced color images
    return fetchEPIC<EPICImage[]>('enhanced')
}

// Get enhanced color imagery for a specific date
export async function getEnhancedImagesByDate(
    date: string
): Promise<EPICImage[]> {
    // Fetch enhanced color images for a specific date
    return fetchEPIC<EPICImage[]>(`enhanced/date/${date}`)
}

// Get all available dates for enhanced color imagery
export async function getEnhancedAvailableDates(): Promise<
    EPICAvailableDate[]
> {
    // Fetch all available dates for enhanced color images
    return fetchEPIC<EPICAvailableDate[]>('enhanced/all')
}

// Generic function to get images by collection
export async function getImages(
    collection: EPICCollection = 'natural'
): Promise<EPICImage[]> {
    // Fetch images for the specified collection
    return fetchEPIC<EPICImage[]>(collection)
}

// Generic function to get images by collection and date
export async function getImagesByDate(
    collection: EPICCollection,
    date: string
): Promise<EPICImage[]> {
    // Fetch images for the specified collection and date
    return fetchEPIC<EPICImage[]>(`${collection}/date/${date}`)
}

// Generic function to get available dates by collection
export async function getAvailableDates(
    collection: EPICCollection
): Promise<EPICAvailableDate[]> {
    // Fetch available dates for the specified collection
    return fetchEPIC<EPICAvailableDate[]>(`${collection}/all`)
}

// Build image URL from EPIC image data
export function buildImageUrl(
    image: EPICImage,
    collection: EPICCollection = 'natural',
    format: EPICImageFormat = 'png'
): string {
    // Extract date components from the date string (format: "2019-05-30 01:13:59")
    const dateStr = image.date.split(' ')[0]
    const [year, month, day] = dateStr.split('-')

    // Construct and return the full image URL
    return `${EPIC_ARCHIVE_URL}/${collection}/${year}/${month}/${day}/${format}/${image.image}.${format === 'thumbs' ? 'jpg' : format}?api_key=${NASA_API_KEY}`
}

// Build thumbnail URL
export function buildThumbnailUrl(
    image: EPICImage,
    collection: EPICCollection = 'natural'
): string {
    return buildImageUrl(image, collection, 'thumbs')
}
