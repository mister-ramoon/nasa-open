// Import constants and types
import {
    DONKI_API_BASE_URL,
    NASA_API_KEY,
    DONKI_ENDPOINTS,
} from '../constants/donki.constant'
import type {
    DonkiDateParams,
    CMEAnalysisParams,
    IPSParams,
    NotificationsParams,
    CMEEvent,
    CMEAnalysis,
    GSTEvent,
    FLREvent,
    SEPEvent,
    MPCEvent,
    RBEEvent,
    HSSEvent,
    IPSEvent,
    WSAEnlilSimulation,
    DonkiNotification,
} from '../types/donki.type'

// Helper function to build query params
function buildQueryParams(params?: Record<string, unknown>): URLSearchParams {
    // Initialize query parameters with API key
    const queryParams = new URLSearchParams({
        api_key: NASA_API_KEY,
    })

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
async function fetchDonki<T>(
    endpoint: string,
    params?: Record<string, unknown>
): Promise<T> {
    // Build query parameters
    const queryParams = buildQueryParams(params)

    // Make the API request
    const response = await fetch(
        `${DONKI_API_BASE_URL}/${endpoint}?${queryParams.toString()}`
    )

    // Handle response errors
    if (!response.ok) {
        throw new Error(`DONKI ${endpoint} API Error: ${response.statusText}`)
    }

    // Return the parsed JSON response
    return response.json()
}

// Coronal Mass Ejection (CME)
export async function getCME(params?: DonkiDateParams): Promise<CMEEvent[]> {
    // Fetch CME events
    return fetchDonki<CMEEvent[]>(DONKI_ENDPOINTS.CME, { ...params })
}

// CME Analysis
export async function getCMEAnalysis(
    params?: CMEAnalysisParams
): Promise<CMEAnalysis[]> {
    // Fetch CME Analysis data
    return fetchDonki<CMEAnalysis[]>(DONKI_ENDPOINTS.CMEAnalysis, { ...params })
}

// Geomagnetic Storm (GST)
export async function getGST(params?: DonkiDateParams): Promise<GSTEvent[]> {
    // Fetch GST events
    return fetchDonki<GSTEvent[]>(DONKI_ENDPOINTS.GST, { ...params })
}

// Interplanetary Shock (IPS)
export async function getIPS(params?: IPSParams): Promise<IPSEvent[]> {
    // Fetch IPS events
    return fetchDonki<IPSEvent[]>(DONKI_ENDPOINTS.IPS, { ...params })
}

// Solar Flare (FLR)
export async function getFLR(params?: DonkiDateParams): Promise<FLREvent[]> {
    // Fetch FLR events
    return fetchDonki<FLREvent[]>(DONKI_ENDPOINTS.FLR, { ...params })
}

// Solar Energetic Particle (SEP)
export async function getSEP(params?: DonkiDateParams): Promise<SEPEvent[]> {
    // Fetch SEP events
    return fetchDonki<SEPEvent[]>(DONKI_ENDPOINTS.SEP, { ...params })
}

// Magnetopause Crossing (MPC)
export async function getMPC(params?: DonkiDateParams): Promise<MPCEvent[]> {
    // Fetch MPC events
    return fetchDonki<MPCEvent[]>(DONKI_ENDPOINTS.MPC, { ...params })
}

// Radiation Belt Enhancement (RBE)
export async function getRBE(params?: DonkiDateParams): Promise<RBEEvent[]> {
    // Fetch RBE events
    return fetchDonki<RBEEvent[]>(DONKI_ENDPOINTS.RBE, { ...params })
}

// High Speed Stream (HSS)
export async function getHSS(params?: DonkiDateParams): Promise<HSSEvent[]> {
    // Fetch HSS events
    return fetchDonki<HSSEvent[]>(DONKI_ENDPOINTS.HSS, { ...params })
}

// WSA+Enlil Simulation
export async function getWSAEnlilSimulations(
    params?: DonkiDateParams
): Promise<WSAEnlilSimulation[]> {
    // Fetch WSA+Enlil Simulations
    return fetchDonki<WSAEnlilSimulation[]>(
        DONKI_ENDPOINTS.WSAEnlilSimulations,
        { ...params }
    )
}

// Notifications
export async function getNotifications(
    params?: NotificationsParams
): Promise<DonkiNotification[]> {
    //
    return fetchDonki<DonkiNotification[]>(DONKI_ENDPOINTS.notifications, {
        ...params,
    })
}
