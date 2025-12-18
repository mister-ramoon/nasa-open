/// APOD Query Parameters Type
export interface ApodQueryParams {
    date?: string
    start_date?: string
    end_date?: string
    count?: number
    thumbs?: boolean
}

/// APOD Image Response Type
export interface ApodImage {
    date: string
    explanation: string
    hdurl?: string
    media_type: 'image' | 'video'
    service_version: string
    title: string
    url: string
    copyright?: string
    thumbnail_url?: string
}
