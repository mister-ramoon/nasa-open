// Patent Record
export interface Patent {
    id: string
    title: string
    description: string
    patent_number?: string
    serial_number?: string
    category?: string
    subcategory?: string
    center?: string // NASA center
    innovation_year?: number
    contact?: string
    contact_email?: string
    image_url?: string
    external_url?: string
    // Additional fields from API
    eRelations?: string
    concepts?: string
    reference_number?: string
    expiration_date?: string
    trl?: string
    benefits?: string
    applications?: string
}

// Patent Issued Record (specific to issued patents)
export interface PatentIssued extends Patent {
    issue_date?: string
    patent_status?: string
    inventors?: string
    assignee?: string
}

// Software Record
export interface Software {
    id: string
    title: string
    description: string
    category?: string
    subcategory?: string
    center?: string
    release_type?: string // Open Source, U.S. Release Only, etc.
    version?: string
    software_class?: string
    contact?: string
    contact_email?: string
    external_url?: string
    image_url?: string
    // Additional fields
    operating_system?: string
    programming_language?: string
    software_type?: string
    license?: string
    date_released?: string
}

// Spinoff Record
export interface Spinoff {
    id: string
    title: string
    description: string
    category?: string
    year?: number
    nasa_center?: string
    company?: string
    city?: string
    state?: string
    image_url?: string
    external_url?: string
    benefits?: string
    applications?: string
    technology_origin?: string
}

// API Response wrapper (returns array of arrays)
export interface TechTransferResponse<T> {
    results: T[]
    count: number
}

// Raw API response format (array of string arrays)
export type RawPatentResponse = (string | null)[][]
export type RawSoftwareResponse = (string | null)[][]
export type RawSpinoffResponse = (string | null)[][]

// Search Parameters
export interface TechTransferSearchParams {
    query: string
    limit?: number
}

// Search Type
export type TechTransferType =
    | 'patent'
    | 'patent_issued'
    | 'software'
    | 'spinoff'

// Processed Item (unified display format)
export interface ProcessedTechTransferItem {
    id: string
    type: TechTransferType
    title: string
    description: string
    category?: string
    center?: string
    year?: number
    imageUrl?: string
    externalUrl?: string
}

// Statistics
export interface TechTransferStats {
    patentCount: number
    softwareCount: number
    spinoffCount: number
}

// NASA Centers
export type NASACenter =
    | 'ARC' // Ames Research Center
    | 'AFRC' // Armstrong Flight Research Center
    | 'GRC' // Glenn Research Center
    | 'GSFC' // Goddard Space Flight Center
    | 'JPL' // Jet Propulsion Laboratory
    | 'JSC' // Johnson Space Center
    | 'KSC' // Kennedy Space Center
    | 'LaRC' // Langley Research Center
    | 'MSFC' // Marshall Space Flight Center
    | 'SSC' // Stennis Space Center

// Category types
export interface TechCategory {
    id: string
    name: string
    subcategories?: string[]
}

// Contact Info
export interface ContactInfo {
    name?: string
    email?: string
    phone?: string
    center?: string
}
