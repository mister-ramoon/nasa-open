// Celestial bodies supported by Trek
export type TrekBody = 'moon' | 'mars' | 'vesta'

// Projection types
export type TrekProjection = 'EQ' | 'NP' | 'SP' // Equirectangular, North Polar, South Polar

// Tile format
export type TileFormat = 'png' | 'jpg'

// Layer/Mosaic information
export interface TrekLayer {
    id: string
    name: string
    description?: string
    body: TrekBody
    projection: TrekProjection
    format: TileFormat
    tileMatrixSet: string
    style: string
    minZoom: number
    maxZoom: number
    bbox?: BoundingBox
    previewUrl?: string
    wmtsCapabilitiesUrl?: string
}

// Bounding box
export interface BoundingBox {
    west: number
    south: number
    east: number
    north: number
}

// Tile coordinates
export interface TileCoordinates {
    zoom: number
    row: number
    col: number
}

// Tile Matrix information (from WMTS capabilities)
export interface TileMatrix {
    identifier: string
    scaleDenominator: number
    topLeftCorner: [number, number]
    tileWidth: number
    tileHeight: number
    matrixWidth: number
    matrixHeight: number
}

// Tile Matrix Set
export interface TileMatrixSet {
    identifier: string
    supportedCRS: string
    tileMatrices: TileMatrix[]
}

// WMTS Layer (parsed from capabilities)
export interface WMTSLayer {
    identifier: string
    title: string
    abstract?: string
    formats: string[]
    styles: WMTSStyle[]
    tileMatrixSetLinks: string[]
    resourceUrls: WMTSResourceUrl[]
}

// WMTS Style
export interface WMTSStyle {
    identifier: string
    isDefault: boolean
    title?: string
}

// WMTS Resource URL
export interface WMTSResourceUrl {
    format: string
    resourceType: string
    template: string
}

// WMTS Capabilities (simplified)
export interface WMTSCapabilities {
    serviceIdentification: {
        title: string
        abstract?: string
        serviceType: string
        serviceTypeVersion: string
    }
    layers: WMTSLayer[]
    tileMatrixSets: TileMatrixSet[]
}

// Trek API endpoints
export interface TrekEndpoints {
    tiles: string
    wmts: string
    api: string
}

// Mosaic preset (known layers with metadata)
export interface MosaicPreset {
    id: string
    name: string
    description: string
    body: TrekBody
    instrument?: string
    resolution?: string
    coverage?: string
    previewUrl: string
    wmtsCapabilitiesUrl: string
    tileEndpoint: string
    style: string
    tileMatrixSet: string
    format: TileFormat
}

// Landing site
export interface LandingSite {
    name: string
    mission: string
    body: TrekBody
    latitude: number
    longitude: number
    year: number
    description?: string
}

// Feature of interest
export interface FeatureOfInterest {
    name: string
    body: TrekBody
    type:
        | 'crater'
        | 'mons'
        | 'vallis'
        | 'mare'
        | 'planitia'
        | 'region'
        | 'other'
    latitude: number
    longitude: number
    diameter?: number // km
    description?: string
}

// Map viewport
export interface MapViewport {
    center: {
        latitude: number
        longitude: number
    }
    zoom: number
    body: TrekBody
}

// Tile request options
export interface TileRequestOptions {
    body: TrekBody
    layer: string
    style?: string
    tileMatrixSet?: string
    zoom: number
    row: number
    col: number
    format?: TileFormat
}

// Trek statistics
export interface TrekStats {
    moonLayers: number
    marsLayers: number
    vestaLayers: number
    totalMosaics: number
}
