// Category Type
export interface EONETCategory {
    id: string
    title: string
    link: string
    description: string
    layers: string
}

// Source Type
export interface EONETSource {
    id: string
    url: string
}

// Geometry Type
export interface EONETGeometry {
    magnitudeValue: number | null
    magnitudeUnit: string | null
    date: string
    type: 'Point' | 'Polygon'
    coordinates: number[] | number[][]
}

// Event Type
export interface EONETEvent {
    id: string
    title: string
    description: string | null
    link: string
    closed: string | null
    categories: EONETCategory[]
    sources: EONETSource[]
    geometry: EONETGeometry[]
}

// Events Response Type
export interface EONETEventsResponse {
    title: string
    description: string
    link: string
    events: EONETEvent[]
}

// Categories Response Type
export interface EONETCategoriesResponse {
    title: string
    description: string
    link: string
    categories: EONETCategory[]
}

// Layers Response Type
export interface EONETLayer {
    name: string
    serviceUrl: string
    serviceTypeId: string
    parameters: {
        TILEMATRIXSET?: string
        FORMAT?: string
    }[]
}

export interface EONETLayersResponse {
    title: string
    description: string
    link: string
    categories: {
        id: string
        title: string
        layers: EONETLayer[]
    }[]
}

// Query Parameters
export interface EONETEventsParams {
    source?: string
    status?: 'open' | 'closed' | 'all'
    limit?: number
    days?: number
    start?: string // YYYY-MM-DD
    end?: string // YYYY-MM-DD
    bbox?: string // min_lon,min_lat,max_lon,max_lat
}

export interface EONETCategoryEventsParams extends EONETEventsParams {
    categoryId: string
}
