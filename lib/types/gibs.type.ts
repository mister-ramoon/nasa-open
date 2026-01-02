// Layer Type
export interface GIBSLayer {
    id: string
    title: string
    subtitle?: string
    description?: string
    startDate?: string
    endDate?: string
    ongoing?: boolean
    layerPeriod?: string
    format: 'image/png' | 'image/jpeg' | 'image/tiff'
    tileMatrixSet: string
    projections: GIBSProjection[]
}

// Projection Type
export type GIBSProjection =
    | 'EPSG:4326' // Geographic
    | 'EPSG:3857' // Web Mercator
    | 'EPSG:3413' // Arctic Polar Stereographic
    | 'EPSG:3031' // Antarctic Polar Stereographic

// Tile Matrix Set Type
export interface GIBSTileMatrixSet {
    id: string
    projection: GIBSProjection
    tileSize: number
    maxResolution: number
    numResolutions: number
}

// WMTS Capabilities Response
export interface WMTSCapabilities {
    layers: GIBSLayer[]
    tileMatrixSets: GIBSTileMatrixSet[]
}

// Image Request Parameters
export interface GIBSImageParams {
    layer: string
    date: string // YYYY-MM-DD
    projection?: GIBSProjection
    format?: 'png' | 'jpeg' | 'tiff'
    tileMatrix?: number // Zoom level
    tileRow?: number
    tileCol?: number
}

// WMS Request Parameters
export interface GIBSWMSParams {
    layers: string
    date: string
    bbox: string // min_lon,min_lat,max_lon,max_lat
    width?: number
    height?: number
    format?: 'image/png' | 'image/jpeg'
    projection?: GIBSProjection
}

// Popular Layer Info
export interface PopularLayer {
    id: string
    title: string
    description: string
    category: string
    defaultDate?: string
    projection: GIBSProjection
}
