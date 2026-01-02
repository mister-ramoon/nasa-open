// Import constants and types
import {
    INSIGHT_API_BASE_URL,
    NASA_API_KEY,
    COMPASS_POINTS,
    INSIGHT_UNITS,
} from '../constants/insight.constant'
import type {
    InsightWeatherResponse,
    SolData,
    ProcessedSol,
    WindDirectionData,
} from '../types/insight.type'

// Fetch InSight weather data
export async function getInsightWeather(): Promise<InsightWeatherResponse | null> {
    // Construct API URL
    const url = `${INSIGHT_API_BASE_URL}/?api_key=${NASA_API_KEY}&feedtype=json&ver=1.0`

    // Fetch data from InSight API
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        if (!response.ok) {
            console.error(
                `InSight API Error: ${response.status} ${response.statusText}`
            )
            return null
        }

        return response.json()
    } catch (error) {
        console.error('InSight API fetch error:', error)
        return null
    }
}

// Get processed sol data for easier consumption
export async function getProcessedSols(): Promise<ProcessedSol[]> {
    // Fetch raw InSight weather data
    const data = await getInsightWeather()

    // Handle missing or invalid data
    if (!data || !data.sol_keys || data.sol_keys.length === 0) {
        return []
    }

    // Process each sol and return the array of processed sols
    return data.sol_keys.map((solKey) => {
        const sol = data[solKey] as SolData
        return processSolData(solKey, sol)
    })
}

// Process raw sol data into a cleaner format
function processSolData(solKey: string, sol: SolData): ProcessedSol {
    // Initialize processed sol object
    const processed: ProcessedSol = {
        sol: solKey,
        earthDate: sol.First_UTC
            ? new Date(sol.First_UTC).toLocaleDateString()
            : 'N/A',
        lastUpdated: sol.Last_UTC
            ? new Date(sol.Last_UTC).toLocaleString()
            : 'N/A',
        season: sol.Season || 'N/A',
        northernSeason: sol.Northern_season || 'N/A',
        southernSeason: sol.Southern_season || 'N/A',
    }

    // Temperature
    if (sol.AT) {
        processed.temperature = {
            average: Math.round(sol.AT.av),
            min: Math.round(sol.AT.mn),
            max: Math.round(sol.AT.mx),
            unit: INSIGHT_UNITS.temperature,
        }
    }

    // Pressure
    if (sol.PRE) {
        processed.pressure = {
            average: Math.round(sol.PRE.av),
            min: Math.round(sol.PRE.mn),
            max: Math.round(sol.PRE.mx),
            unit: INSIGHT_UNITS.pressure,
        }
    }

    // Wind Speed
    if (sol.HWS) {
        processed.windSpeed = {
            average: Math.round(sol.HWS.av * 10) / 10,
            min: Math.round(sol.HWS.mn * 10) / 10,
            max: Math.round(sol.HWS.mx * 10) / 10,
            unit: INSIGHT_UNITS.windSpeed,
        }
    }

    // Wind Direction (find most common)
    if (sol.WD) {
        const mostCommonDirection = getMostCommonWindDirection(sol.WD)
        if (mostCommonDirection) {
            processed.windDirection = mostCommonDirection
        }
    }

    return processed
}

// Find the most common wind direction
function getMostCommonWindDirection(
    wd: Record<string, WindDirectionData>
): { mostCommon: string; degrees: number } | null {
    // Initialize counters
    let maxCount = 0
    let mostCommon: WindDirectionData | null = null

    // Iterate through wind direction data
    Object.values(wd).forEach((direction) => {
        if (direction.ct > maxCount) {
            maxCount = direction.ct
            mostCommon = direction
        }
    })

    // Return the most common wind direction if found
    if (mostCommon) {
        return {
            mostCommon: (mostCommon as WindDirectionData).compass_point,
            degrees: (mostCommon as WindDirectionData).compass_degrees,
        }
    }

    return null
}

// Convert Fahrenheit to Celsius
export function fahrenheitToCelsius(fahrenheit: number): number {
    // Convert and round to nearest integer
    return Math.round(((fahrenheit - 32) * 5) / 9)
}

// Get latest sol data
export async function getLatestSol(): Promise<ProcessedSol | null> {
    // Fetch processed sols
    const sols = await getProcessedSols()

    // Handle no sols available
    if (sols.length === 0) {
        return null
    }

    // Return the most recent sol (last in array)
    return sols[sols.length - 1]
}

// Get sol by number
export async function getSolByNumber(
    solNumber: string
): Promise<ProcessedSol | null> {
    // Fetch processed sols
    const sols = await getProcessedSols()
    return sols.find((sol) => sol.sol === solNumber) || null
}

// Check data availability
export async function checkDataAvailability(): Promise<{
    available: boolean
    solCount: number
    oldestSol: string | null
    newestSol: string | null
}> {
    // Fetch raw InSight weather data
    const data = await getInsightWeather()

    // Handle missing or invalid data
    if (!data || !data.sol_keys || data.sol_keys.length === 0) {
        return {
            available: false,
            solCount: 0,
            oldestSol: null,
            newestSol: null,
        }
    }

    // Return availability info
    return {
        available: true,
        solCount: data.sol_keys.length,
        oldestSol: data.sol_keys[0],
        newestSol: data.sol_keys[data.sol_keys.length - 1],
    }
}
