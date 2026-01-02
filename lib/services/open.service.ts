// Import constants and types
import {
    OSDR_API_BASE_URL,
    OSDR_GEODE_API_URL,
    OSDR_FILE_BASE_URL,
} from '../constants/open.constant'
import type {
    StudyFilesResponse,
    StudyMetadataResponse,
    SearchResponse,
    OSDRSearchParams,
    Mission,
    Experiment,
    Payload,
    Vehicle,
    Hardware,
    Subject,
    Biospecimen,
    ProcessedStudy,
} from '../types/open.type'

// Generic fetch function
async function fetchOSDR<T>(url: string): Promise<T | null> {
    // Fetch data from the API
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            console.error(
                `OSDR API Error: ${response.status} ${response.statusText}`
            )
            return null
        }

        return response.json()
    } catch (error) {
        console.error('OSDR API fetch error:', error)
        return null
    }
}

// ============ Study Data File API ============

// Get study files by ID(s)
export async function getStudyFiles(
    studyIds: string,
    page: number = 0,
    size: number = 25,
    allFiles: boolean = false
): Promise<StudyFilesResponse | null> {
    // Build query parameters
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        all_files: allFiles.toString(),
    })
    const url = `${OSDR_API_BASE_URL}/osd/files/${studyIds}?${params.toString()}`
    return fetchOSDR<StudyFilesResponse>(url)
}

// Build download URL for a study file
export function buildFileDownloadUrl(remoteUrl: string): string {
    // Construct full download URL
    return `${OSDR_FILE_BASE_URL}${remoteUrl}`
}

// ============ Study Metadata API ============

// Get study metadata by ID
export async function getStudyMetadata(
    studyId: string
): Promise<StudyMetadataResponse | null> {
    // Construct URL
    const url = `${OSDR_API_BASE_URL}/osd/meta/${studyId}`
    return fetchOSDR<StudyMetadataResponse>(url)
}

// ============ Search API ============

// Search studies
export async function searchStudies(
    params: OSDRSearchParams
): Promise<SearchResponse | null> {
    // Build query parameters
    const queryParams = new URLSearchParams()

    // Append parameters if they exist
    if (params.term) queryParams.append('term', params.term)
    if (params.from !== undefined)
        queryParams.append('from', params.from.toString())
    if (params.size !== undefined)
        queryParams.append('size', params.size.toString())
    if (params.type) queryParams.append('type', params.type)
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.order) queryParams.append('order', params.order)

    // Handle multiple filter fields
    if (params.ffield && params.fvalue) {
        const ffields = Array.isArray(params.ffield)
            ? params.ffield
            : [params.ffield]
        const fvalues = Array.isArray(params.fvalue)
            ? params.fvalue
            : [params.fvalue]

        ffields.forEach((field, index) => {
            queryParams.append('ffield', field)
            queryParams.append('fvalue', fvalues[index] || '')
        })
    }

    // Construct full URL
    const url = `${OSDR_API_BASE_URL}/search?${queryParams.toString()}`
    return fetchOSDR<SearchResponse>(url)
}

// Simple keyword search
export async function searchByKeyword(
    keyword: string,
    dataSource: string = 'cgene',
    page: number = 0,
    size: number = 25
): Promise<SearchResponse | null> {
    // Search studies by keyword
    return searchStudies({
        term: keyword,
        type: dataSource,
        from: page,
        size,
    })
}

// Search by organism
export async function searchByOrganism(
    organism: string,
    page: number = 0,
    size: number = 25
): Promise<SearchResponse | null> {
    // Search studies by organism
    return searchStudies({
        ffield: 'organism',
        fvalue: organism,
        from: page,
        size,
    })
}

// ============ Entity APIs ============

// Get all entities of a type
async function getAllEntities<T>(entityType: string): Promise<T[]> {
    // Construct URL
    const url = `${OSDR_GEODE_API_URL}/${entityType}`
    const response = await fetchOSDR<T[]>(url)
    return response || []
}

// Get single entity by identifier
async function getEntity<T>(
    entityType: string,
    identifier: string
): Promise<T | null> {
    // Construct URL
    const url = `${OSDR_GEODE_API_URL}/${entityType.slice(0, -1)}/${identifier}`
    return fetchOSDR<T>(url)
}

// Experiments
export async function getAllExperiments(): Promise<Experiment[]> {
    // Fetch all experiments
    return getAllEntities<Experiment>('experiments')
}

export async function getExperiment(
    identifier: string
): Promise<Experiment | null> {
    // Fetch single experiment by ID
    return getEntity<Experiment>('experiments', identifier)
}

// Missions
export async function getAllMissions(): Promise<Mission[]> {
    // Fetch all missions
    return getAllEntities<Mission>('missions')
}

export async function getMission(identifier: string): Promise<Mission | null> {
    // Fetch single mission by ID
    return getEntity<Mission>('missions', identifier)
}

// Payloads
export async function getAllPayloads(): Promise<Payload[]> {
    // Fetch all payloads
    return getAllEntities<Payload>('payloads')
}

export async function getPayload(identifier: string): Promise<Payload | null> {
    // Fetch single payload by ID
    return getEntity<Payload>('payloads', identifier)
}

// Hardware
export async function getAllHardware(): Promise<Hardware[]> {
    // Fetch all hardware
    return getAllEntities<Hardware>('hardware')
}

export async function getHardwareById(
    identifier: string
): Promise<Hardware | null> {
    // Construct URL
    const url = `${OSDR_GEODE_API_URL}/hardware/${identifier}`
    return fetchOSDR<Hardware>(url)
}

// Vehicles
export async function getAllVehicles(): Promise<Vehicle[]> {
    // Fetch all vehicles
    return getAllEntities<Vehicle>('vehicles')
}

export async function getVehicle(identifier: string): Promise<Vehicle | null> {
    // Fetch single vehicle by ID
    return getEntity<Vehicle>('vehicles', identifier)
}

// Subjects
export async function getAllSubjects(): Promise<Subject[]> {
    // Fetch all subjects
    return getAllEntities<Subject>('subjects')
}

export async function getSubject(identifier: string): Promise<Subject | null> {
    // Fetch single subject by ID
    return getEntity<Subject>('subjects', identifier)
}

// Biospecimens
export async function getAllBiospecimens(): Promise<Biospecimen[]> {
    // Fetch all biospecimens
    return getAllEntities<Biospecimen>('biospecimens')
}

export async function getBiospecimen(
    identifier: string
): Promise<Biospecimen | null> {
    // Fetch single biospecimen by ID
    return getEntity<Biospecimen>('biospecimens', identifier)
}

// ============ Utility Functions ============

// Process search results for easier consumption
export function processSearchResults(
    response: SearchResponse
): ProcessedStudy[] {
    // Check for hits
    if (!response?.hits?.hits) return []

    // Map hits to processed studies
    return response.hits.hits.map((hit) => {
        const source = hit._source
        return {
            id: source.Accession,
            title: source['Study Title'] || 'Untitled Study',
            description: source['Study Description'] || '',
            organism: source.organism,
            projectType: source['Project Type'],
            flightProgram: source['Flight Program'],
            releaseDate: '',
            fileCount: 0,
            dataSourceType: source['Data Source Type'],
        }
    })
}

// Get featured studies (space-related)
export async function getFeaturedStudies(): Promise<ProcessedStudy[]> {
    // Search for spaceflight-related studies
    const response = await searchStudies({
        term: 'spaceflight',
        type: 'cgene',
        size: 10,
    })

    // Process and return results
    if (!response) return []
    return processSearchResults(response)
}

// Get studies by flight program
export async function getStudiesByFlightProgram(
    program: string,
    page: number = 0
): Promise<SearchResponse | null> {
    // Search studies by flight program
    return searchStudies({
        ffield: 'Flight Program',
        fvalue: program,
        from: page,
        size: 25,
    })
}

// Format file size
export function formatFileSize(bytes: number): string {
    // Convert bytes to human-readable format
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
