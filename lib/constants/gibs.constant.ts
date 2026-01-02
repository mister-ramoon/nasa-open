// Export GIBS API URLs
export const GIBS_WMTS_URL =
    'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best'
export const GIBS_WMS_URL =
    'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi'
export const GIBS_TWMS_URL =
    'https://gibs.earthdata.nasa.gov/twms/epsg4326/best/twms.cgi'

// Export GIBS Constants
export const GIBS_Constants = {
    title: 'GIBS - Global Imagery Browse Services',
    description:
        "NASA's Global Imagery Browse Services (GIBS) delivers global, full-resolution satellite imagery to users in a highly responsive manner. GIBS provides quick access to over 1,000 satellite imagery products, covering every part of the world.",
}

// Export Projections
export const GIBS_PROJECTIONS = {
    geographic: 'EPSG:4326',
    webMercator: 'EPSG:3857',
    arcticPolar: 'EPSG:3413',
    antarcticPolar: 'EPSG:3031',
} as const

// Export Popular Layers
export const GIBS_POPULAR_LAYERS = [
    {
        id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        title: 'MODIS Terra True Color',
        description:
            'True color corrected reflectance imagery from Terra MODIS',
        category: 'Corrected Reflectance',
    },
    {
        id: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
        title: 'MODIS Aqua True Color',
        description: 'True color corrected reflectance imagery from Aqua MODIS',
        category: 'Corrected Reflectance',
    },
    {
        id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
        title: 'VIIRS SNPP True Color',
        description: 'True color corrected reflectance from Suomi NPP VIIRS',
        category: 'Corrected Reflectance',
    },
    {
        id: 'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
        title: 'VIIRS NOAA-20 True Color',
        description: 'True color corrected reflectance from NOAA-20 VIIRS',
        category: 'Corrected Reflectance',
    },
    {
        id: 'BlueMarble_NextGeneration',
        title: 'Blue Marble Next Generation',
        description: 'Monthly global imagery from NASA Blue Marble',
        category: 'Base Layers',
    },
    {
        id: 'VIIRS_Black_Marble',
        title: 'Black Marble (Night Lights)',
        description: 'Nighttime lights imagery from VIIRS',
        category: 'Night Imagery',
    },
    {
        id: 'MODIS_Terra_Aerosol_Optical_Depth',
        title: 'Aerosol Optical Depth',
        description: 'Aerosol optical depth from Terra MODIS',
        category: 'Atmosphere',
    },
    {
        id: 'MODIS_Terra_Land_Surface_Temp_Day',
        title: 'Land Surface Temperature (Day)',
        description: 'Daytime land surface temperature from Terra MODIS',
        category: 'Land Surface',
    },
    {
        id: 'MODIS_Terra_Snow_Cover',
        title: 'Snow Cover',
        description: 'Snow cover from Terra MODIS',
        category: 'Cryosphere',
    },
    {
        id: 'MODIS_Terra_Chlorophyll_A',
        title: 'Chlorophyll A',
        description: 'Ocean chlorophyll concentration from Terra MODIS',
        category: 'Ocean',
    },
    {
        id: 'IMERG_Precipitation_Rate',
        title: 'Precipitation Rate',
        description: 'Global precipitation rate from GPM IMERG',
        category: 'Precipitation',
    },
    {
        id: 'MODIS_Terra_Fires_All',
        title: 'Active Fires',
        description: 'Active fire detections from Terra MODIS',
        category: 'Fires',
    },
] as const

// Export Default tile size
export const GIBS_TILE_SIZE = 256

// Export Max zoom levels per projection
export const GIBS_MAX_ZOOM = {
    'EPSG:4326': 9,
    'EPSG:3857': 9,
    'EPSG:3413': 5,
    'EPSG:3031': 5,
} as const
