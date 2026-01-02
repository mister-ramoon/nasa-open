// Media Type
export type MediaType = 'image' | 'video' | 'audio'

// Search Item Data
export interface LibraryItemData {
    center: string
    title: string
    nasa_id: string
    date_created: string
    keywords?: string[]
    media_type: MediaType
    description?: string
    description_508?: string
    secondary_creator?: string
    photographer?: string
    location?: string
    album?: string[]
}

// Search Item Link
export interface LibraryItemLink {
    href: string
    rel: 'preview' | 'captions'
    render?: 'image' | 'video'
}

// Search Item
export interface LibraryItem {
    href: string
    data: LibraryItemData[]
    links?: LibraryItemLink[]
}

// Search Collection
export interface LibraryCollection {
    version: string
    href: string
    items: LibraryItem[]
    metadata?: {
        total_hits: number
    }
    links?: {
        rel: 'next' | 'prev'
        prompt: string
        href: string
    }[]
}

// Search Response
export interface LibrarySearchResponse {
    collection: LibraryCollection
}

// Asset Manifest Response
export interface AssetManifestResponse {
    collection: {
        version: string
        href: string
        items: {
            href: string
        }[]
    }
}

// Metadata Response
export interface MetadataResponse {
    location: string
}

// Captions Response
export interface CaptionsResponse {
    location: string
}

// Search Parameters
export interface LibrarySearchParams {
    q?: string
    center?: string
    description?: string
    description_508?: string
    keywords?: string
    location?: string
    media_type?: MediaType | string // Can be comma-separated
    nasa_id?: string
    page?: number
    page_size?: number
    photographer?: string
    secondary_creator?: string
    title?: string
    year_start?: string
    year_end?: string
}

// Processed Library Item for easier consumption
export interface ProcessedLibraryItem {
    id: string
    title: string
    description: string
    dateCreated: string
    mediaType: MediaType
    center: string
    keywords: string[]
    thumbnailUrl?: string
    previewUrl?: string
    photographer?: string
    location?: string
}
