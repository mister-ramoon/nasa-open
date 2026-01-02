// Import constants and types
import {
    TECHTRANSFER_API_BASE_URL,
    TECHTRANSFER_ENDPOINTS,
    TYPE_COLORS,
} from '../constants/techtransfer.constant'
import type {
    Patent,
    PatentIssued,
    Software,
    Spinoff,
    RawPatentResponse,
    RawSoftwareResponse,
    RawSpinoffResponse,
    ProcessedTechTransferItem,
    TechTransferType,
    TechTransferStats,
} from '../types/techtransfer.type'

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'

// Generic fetch function for TechTransfer API
async function fetchTechTransfer<T>(
    endpoint: string,
    query: string
): Promise<T | null> {
    // URL encode the query and build the full URL
    const encodedQuery = encodeURIComponent(query)
    const url = `${TECHTRANSFER_API_BASE_URL}${endpoint}?${encodedQuery}&api_key=${NASA_API_KEY}`

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        const response = await fetch(url, {
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            if (response.status !== 503) {
                console.error(
                    `TechTransfer API Error: ${response.status} ${response.statusText}`
                )
            }
            return null
        }

        return response.json()
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('TechTransfer API fetch error:', error)
        }
        return null
    }
}

// ============ Patent Functions ============

// Search patents
export async function searchPatents(query: string): Promise<Patent[]> {
    const response = await fetchTechTransfer<{ results: RawPatentResponse }>(
        TECHTRANSFER_ENDPOINTS.PATENT,
        query
    )

    if (!response?.results) return []

    return response.results
        .map(parsePatent)
        .filter((p): p is Patent => p !== null)
}

// Search issued patents
export async function searchPatentsIssued(
    query: string
): Promise<PatentIssued[]> {
    const response = await fetchTechTransfer<{ results: RawPatentResponse }>(
        TECHTRANSFER_ENDPOINTS.PATENT_ISSUED,
        query
    )

    if (!response?.results) return []

    return response.results
        .map(parsePatentIssued)
        .filter((p): p is PatentIssued => p !== null)
}

// Parse raw patent data
function parsePatent(raw: (string | null)[]): Patent | null {
    if (!raw || raw.length < 4) return null

    return {
        id: raw[0] || `patent-${Date.now()}-${Math.random()}`,
        patent_number: raw[1] || undefined,
        center: raw[2] || undefined,
        title: raw[3] || 'Untitled Patent',
        description: raw[4] || '',
        category: raw[5] || undefined,
        subcategory: raw[6] || undefined,
        serial_number: raw[7] || undefined,
        contact: raw[8] || undefined,
        image_url: raw[9] || undefined,
    }
}

// Parse raw issued patent data
function parsePatentIssued(raw: (string | null)[]): PatentIssued | null {
    const patent = parsePatent(raw)
    if (!patent) return null

    return {
        ...patent,
        issue_date: raw[10] || undefined,
        patent_status: raw[11] || undefined,
        inventors: raw[12] || undefined,
        assignee: raw[13] || undefined,
    }
}

// ============ Software Functions ============

// Search software
export async function searchSoftware(query: string): Promise<Software[]> {
    const response = await fetchTechTransfer<{ results: RawSoftwareResponse }>(
        TECHTRANSFER_ENDPOINTS.SOFTWARE,
        query
    )

    if (!response?.results) return []

    return response.results
        .map(parseSoftware)
        .filter((s): s is Software => s !== null)
}

// Parse raw software data
function parseSoftware(raw: (string | null)[]): Software | null {
    if (!raw || raw.length < 2) return null

    return {
        id: raw[0] || `software-${Date.now()}-${Math.random()}`,
        title: raw[1] || 'Untitled Software',
        description: raw[2] || '',
        category: raw[3] || undefined,
        subcategory: raw[4] || undefined,
        center: raw[5] || undefined,
        release_type: raw[6] || undefined,
        software_class: raw[7] || undefined,
        contact: raw[8] || undefined,
        external_url: raw[9] || undefined,
        image_url: raw[10] || undefined,
    }
}

// ============ Spinoff Functions ============

// Search spinoffs
export async function searchSpinoffs(query: string): Promise<Spinoff[]> {
    const response = await fetchTechTransfer<{ results: RawSpinoffResponse }>(
        TECHTRANSFER_ENDPOINTS.SPINOFF,
        query
    )

    if (!response?.results) return []

    return response.results
        .map(parseSpinoff)
        .filter((s): s is Spinoff => s !== null)
}

// Parse raw spinoff data
function parseSpinoff(raw: (string | null)[]): Spinoff | null {
    if (!raw || raw.length < 2) return null

    return {
        id: raw[0] || `spinoff-${Date.now()}-${Math.random()}`,
        title: raw[1] || 'Untitled Spinoff',
        description: raw[2] || '',
        category: raw[3] || undefined,
        year: raw[4] ? parseInt(raw[4]) : undefined,
        nasa_center: raw[5] || undefined,
        company: raw[6] || undefined,
        city: raw[7] || undefined,
        state: raw[8] || undefined,
        image_url: raw[9] || undefined,
        external_url: raw[10] || undefined,
    }
}

// ============ Combined Search ============

// Search all types
export async function searchAll(query: string): Promise<{
    patents: Patent[]
    software: Software[]
    spinoffs: Spinoff[]
}> {
    const [patents, software, spinoffs] = await Promise.all([
        searchPatents(query).catch(() => []),
        searchSoftware(query).catch(() => []),
        searchSpinoffs(query).catch(() => []),
    ])

    return { patents, software, spinoffs }
}

// Search specific type
export async function searchByType(
    type: TechTransferType,
    query: string
): Promise<ProcessedTechTransferItem[]> {
    let results: ProcessedTechTransferItem[] = []

    switch (type) {
        case 'patent':
            const patents = await searchPatents(query)
            results = patents.map((p) => processPatent(p))
            break
        case 'patent_issued':
            const issued = await searchPatentsIssued(query)
            results = issued.map((p) => processPatent(p, 'patent_issued'))
            break
        case 'software':
            const software = await searchSoftware(query)
            results = software.map(processSoftware)
            break
        case 'spinoff':
            const spinoffs = await searchSpinoffs(query)
            results = spinoffs.map(processSpinoff)
            break
    }

    return results
}

// ============ Processing Functions ============

// Process patent to unified format
function processPatent(
    patent: Patent | PatentIssued,
    type: TechTransferType = 'patent'
): ProcessedTechTransferItem {
    return {
        id: patent.id,
        type,
        title: patent.title,
        description: patent.description,
        category: patent.category,
        center: patent.center,
        imageUrl: patent.image_url,
        externalUrl: patent.external_url,
    }
}

// Process software to unified format
function processSoftware(software: Software): ProcessedTechTransferItem {
    return {
        id: software.id,
        type: 'software',
        title: software.title,
        description: software.description,
        category: software.category,
        center: software.center,
        imageUrl: software.image_url,
        externalUrl: software.external_url,
    }
}

// Process spinoff to unified format
function processSpinoff(spinoff: Spinoff): ProcessedTechTransferItem {
    return {
        id: spinoff.id,
        type: 'spinoff',
        title: spinoff.title,
        description: spinoff.description,
        category: spinoff.category,
        center: spinoff.nasa_center,
        year: spinoff.year,
        imageUrl: spinoff.image_url,
        externalUrl: spinoff.external_url,
    }
}

// ============ Utility Functions ============

// Get sample data for each type
export async function getSampleData(): Promise<{
    patents: Patent[]
    software: Software[]
    spinoffs: Spinoff[]
}> {
    // Use common search terms to get sample data
    const [patents, software, spinoffs] = await Promise.all([
        searchPatents('technology').catch(() => []),
        searchSoftware('analysis').catch(() => []),
        searchSpinoffs('space').catch(() => []),
    ])

    return {
        patents: patents.slice(0, 6),
        software: software.slice(0, 6),
        spinoffs: spinoffs.slice(0, 6),
    }
}

// Get featured items (sample from each category)
export async function getFeaturedItems(
    count: number = 4
): Promise<ProcessedTechTransferItem[]> {
    const { patents, software, spinoffs } = await getSampleData()

    const items: ProcessedTechTransferItem[] = [
        ...patents.slice(0, count).map((p) => processPatent(p)),
        ...software.slice(0, count).map(processSoftware),
        ...spinoffs.slice(0, count).map(processSpinoff),
    ]

    // Shuffle and limit
    return items.sort(() => 0.5 - Math.random()).slice(0, count * 3)
}

// Get statistics
export async function getTechTransferStats(): Promise<TechTransferStats> {
    const { patents, software, spinoffs } = await getSampleData()

    return {
        patentCount: patents.length,
        softwareCount: software.length,
        spinoffCount: spinoffs.length,
    }
}

// Truncate description
export function truncateDescription(
    description: string,
    maxLength: number = 200
): string {
    if (!description) return ''
    // Strip HTML tags
    const stripped = description.replace(/<[^>]*>/g, '')
    if (stripped.length <= maxLength) return stripped
    return stripped.substring(0, maxLength).trim() + '...'
}

// Get type display name
export function getTypeDisplayName(type: TechTransferType): string {
    const names: Record<TechTransferType, string> = {
        patent: 'Patent',
        patent_issued: 'Issued Patent',
        software: 'Software',
        spinoff: 'Spinoff',
    }
    return names[type] || type
}

// Get type badge classes
export function getTypeBadgeClass(type: TechTransferType): string {
    const colors = TYPE_COLORS[type]
    return `${colors.bg} ${colors.text}`
}

// Get center full name
export function getCenterFullName(centerCode?: string): string {
    if (!centerCode) return 'NASA'

    const centers: Record<string, string> = {
        ARC: 'Ames Research Center',
        AFRC: 'Armstrong Flight Research Center',
        GRC: 'Glenn Research Center',
        GSFC: 'Goddard Space Flight Center',
        JPL: 'Jet Propulsion Laboratory',
        JSC: 'Johnson Space Center',
        KSC: 'Kennedy Space Center',
        LaRC: 'Langley Research Center',
        MSFC: 'Marshall Space Flight Center',
        SSC: 'Stennis Space Center',
    }

    return centers[centerCode] || centerCode
}

// Safely format numbers
export function safeToFixed(value: unknown, decimals: number = 2): string {
    if (typeof value === 'number' && !isNaN(value)) {
        return value.toFixed(decimals)
    }
    if (typeof value === 'string') {
        const parsed = parseFloat(value)
        if (!isNaN(parsed)) {
            return parsed.toFixed(decimals)
        }
    }
    return '—'
}
