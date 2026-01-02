// Import constants and types
import { EXOPLANET_API_BASE_URL } from '../constants/exoplanet.constant'
import type { Exoplanet, KeplerCandidate } from '../types/exoplanet.type'

// Build query URL - using proper encoding
function buildQueryUrl(query: string): string {
    // Clean and encode the query string
    const cleanQuery = query.replace(/\s+/g, ' ').trim()

    // Construct URL with query parameters
    const params = new URLSearchParams({
        query: cleanQuery,
        format: 'json',
    })

    // return the full URL
    return `${EXOPLANET_API_BASE_URL}?${params.toString()}`
}

// Generic fetch function
async function fetchExoplanet<T>(query: string): Promise<T[]> {
    // Build the query URL
    const url = buildQueryUrl(query)

    // Make the API request with error handling
    try {
        const response = await fetch(url, {
            next: { revalidate: 86400 },
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`Exoplanet API Error: ${response.status}`, errorText)
            return []
        }

        return response.json()
    } catch (error) {
        console.error('Exoplanet API fetch error:', error)
        return []
    }
}

// Get confirmed exoplanets
export async function getConfirmedExoplanets(
    limit: number = 100
): Promise<Exoplanet[]> {
    // Fetch confirmed exoplanets ordered by discovery year
    const query = `SELECT TOP ${limit} pl_name,hostname,pl_letter,discoverymethod,disc_year,disc_facility,pl_orbper,pl_orbsmax,pl_rade,pl_bmasse,pl_eqt,sy_dist,sy_snum,sy_pnum FROM ps ORDER BY disc_year DESC`
    return fetchExoplanet<Exoplanet>(query)
}

// Get exoplanets by discovery method
export async function getExoplanetsByMethod(
    method: string,
    limit: number = 50
): Promise<Exoplanet[]> {
    // Fetch exoplanets discovered by a specific method
    const query = `SELECT TOP ${limit} pl_name,hostname,discoverymethod,disc_year,disc_facility,pl_orbper,pl_rade,pl_bmasse,pl_eqt,sy_dist FROM ps WHERE discoverymethod='${method}' ORDER BY disc_year DESC`
    return fetchExoplanet<Exoplanet>(query)
}

// Get exoplanets in the habitable zone
export async function getHabitableExoplanets(
    limit: number = 50
): Promise<Exoplanet[]> {
    // Fetch exoplanets in the habitable zone
    const query = `SELECT TOP ${limit} pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,pl_eqt,sy_dist,st_teff FROM ps WHERE pl_eqt>=180 AND pl_eqt<=310 AND pl_rade<2 ORDER BY pl_eqt ASC`
    return fetchExoplanet<Exoplanet>(query)
}

// Get exoplanets discovered in a specific year
export async function getExoplanetsByYear(
    year: number,
    limit: number = 100
): Promise<Exoplanet[]> {
    const query = `SELECT TOP ${limit} pl_name,hostname,discoverymethod,disc_year,disc_facility,pl_orbper,pl_rade,pl_bmasse,pl_eqt,sy_dist FROM ps WHERE disc_year=${year} ORDER BY pl_name ASC`
    return fetchExoplanet<Exoplanet>(query)
}

// Get Kepler candidates
export async function getKeplerCandidates(
    limit: number = 50
): Promise<KeplerCandidate[]> {
    // Fetch Kepler candidates ordered by score
    const query = `SELECT TOP ${limit} kepid,kepoi_name,kepler_name,koi_disposition,koi_pdisposition,koi_score,koi_period,koi_prad,koi_teq,koi_insol,koi_steff,koi_srad,ra,dec FROM cumulative WHERE koi_disposition='CANDIDATE' ORDER BY koi_score DESC`
    return fetchExoplanet<KeplerCandidate>(query)
}

// Get habitable candidates
export async function getHabitableCandidates(
    limit: number = 50
): Promise<KeplerCandidate[]> {
    // Fetch habitable Kepler candidates
    const query = `SELECT TOP ${limit} kepid,kepoi_name,kepler_name,koi_disposition,koi_score,koi_period,koi_prad,koi_teq,koi_insol,koi_steff FROM cumulative WHERE koi_prad<2 AND koi_teq>=180 AND koi_teq<=303 AND koi_disposition='CANDIDATE' ORDER BY koi_score DESC`
    return fetchExoplanet<KeplerCandidate>(query)
}

// Get transiting exoplanets
export async function getTransitingExoplanets(
    limit: number = 50
): Promise<Exoplanet[]> {
    // Fetch transiting exoplanets
    const query = `SELECT TOP ${limit} pl_name,hostname,discoverymethod,disc_year,disc_facility,pl_orbper,pl_rade,pl_bmasse,pl_eqt,sy_dist FROM ps WHERE tran_flag=1 ORDER BY disc_year DESC`
    return fetchExoplanet<Exoplanet>(query)
}

// Get discovery statistics
export async function getDiscoveryStats(): Promise<
    { discoverymethod: string; count: number }[]
> {
    // Fetch discovery method statistics
    const query = `SELECT discoverymethod,COUNT(*) as count FROM ps GROUP BY discoverymethod ORDER BY count DESC`
    return fetchExoplanet<{ discoverymethod: string; count: number }>(query)
}

// Custom query
export async function queryExoplanets<T>(
    selectFields: string,
    table: string = 'ps',
    whereClause?: string,
    orderBy?: string,
    limit: number = 100
): Promise<T[]> {
    // Build and execute a custom query
    let query = `SELECT TOP ${limit} ${selectFields} FROM ${table}`
    if (whereClause) query += ` WHERE ${whereClause}`
    if (orderBy) query += ` ORDER BY ${orderBy}`
    return fetchExoplanet<T>(query)
}
