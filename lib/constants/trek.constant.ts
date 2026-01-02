import type {
    TrekBody,
    MosaicPreset,
    LandingSite,
    TrekProjection,
} from '../types/trek.type'

// Export Base URLs for Trek services
export const TREK_BASE_URLS = {
    moon: 'https://trek.nasa.gov/tiles/Moon',
    mars: 'https://trek.nasa.gov/tiles/Mars',
    vesta: 'https://trek.nasa.gov/tiles/Vesta',
} as const

// Export Legacy tile endpoints (still functional)
export const TREK_TILE_URLS = {
    moon: 'https://moontrek.jpl.nasa.gov/trektiles/Moon',
    mars: 'https://marstrek.jpl.nasa.gov/trektiles/Mars',
    vesta: 'https://vestatrek.jpl.nasa.gov/trektiles/Vesta',
} as const

// Export API documentation
export const TREK_API_DOC_URLS = {
    moon: 'https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=moon',
    mars: 'https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars',
    vesta: 'https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=vesta',
} as const

// Export Portal URLs
export const TREK_PORTAL_URLS = {
    moon: 'https://trek.nasa.gov/moon/',
    mars: 'https://trek.nasa.gov/mars/',
    vesta: 'https://trek.nasa.gov/vesta/',
} as const

// Export Constants
export const TREK_Constants = {
    title: 'Trek WMTS - Planetary Map Tiles',
    description:
        'Web Map Tile Service (WMTS) for Moon, Mars, and Vesta exploration imagery. High-resolution mosaics from NASA missions including LRO, MRO, and Dawn.',
    dataSource: 'NASA SSERVI & JPL Trek Team',
}

// Export Projection info
export const PROJECTIONS: Record<
    TrekProjection,
    { name: string; description: string }
> = {
    EQ: {
        name: 'Equirectangular',
        description: 'Standard cylindrical projection covering full globe',
    },
    NP: {
        name: 'North Polar Stereographic',
        description: 'Stereographic projection centered on north pole',
    },
    SP: {
        name: 'South Polar Stereographic',
        description: 'Stereographic projection centered on south pole',
    },
}

// Export Body information
export const TREK_BODIES: Record<
    TrekBody,
    {
        name: string
        description: string
        radius: number // km
        missions: string[]
        color: { bg: string; text: string; border: string }
    }
> = {
    moon: {
        name: 'Moon',
        description: "Earth's only natural satellite",
        radius: 1737.4,
        missions: [
            'Apollo',
            'LRO',
            'Clementine',
            'GRAIL',
            'LADEE',
            'Chandrayaan',
        ],
        color: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-300',
        },
    },
    mars: {
        name: 'Mars',
        description: 'The Red Planet - fourth from the Sun',
        radius: 3389.5,
        missions: [
            'MRO',
            'Curiosity',
            'Perseverance',
            'Viking',
            'Opportunity',
            'Spirit',
            'Phoenix',
        ],
        color: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-300',
        },
    },
    vesta: {
        name: 'Vesta',
        description: 'Second-largest asteroid in the asteroid belt',
        radius: 262.7,
        missions: ['Dawn'],
        color: {
            bg: 'bg-amber-100',
            text: 'text-amber-800',
            border: 'border-amber-300',
        },
    },
}

// Export Moon Mosaics
export const MOON_MOSAICS: MosaicPreset[] = [
    {
        id: 'LRO_WAC_Mosaic_Global_303ppd_v02',
        name: 'LRO WAC Global Mosaic',
        description:
            'Lunar Reconnaissance Orbiter Wide Angle Camera global mosaic at 303 pixels per degree',
        body: 'moon',
        instrument: 'LRO WAC',
        resolution: '100m/pixel',
        coverage: 'Global',
        previewUrl:
            'https://trek.nasa.gov/moon/TrekWS/rest/cat/resources/html/preview/Moon_LRO_WAC_Mosaic_Global_303ppd_v02.png',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'jpg',
    },
    {
        id: 'LRO_NAC_Mosaic_Aristarchus_Plateau',
        name: 'LRO NAC Aristarchus Plateau',
        description: 'High-resolution mosaic of the Aristarchus Plateau region',
        body: 'moon',
        instrument: 'LRO NAC',
        resolution: '2m/pixel',
        coverage: 'Regional',
        previewUrl: 'https://trek.nasa.gov/moon/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Mosaic_Aristarchus_Plateau/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Mosaic_Aristarchus_Plateau',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
    {
        id: 'LRO_LOLA_ClrShade_Global_128ppd_v04',
        name: 'LOLA Color Shaded Relief',
        description: 'Lunar Orbiter Laser Altimeter color shaded relief map',
        body: 'moon',
        instrument: 'LRO LOLA',
        resolution: '237m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/moon/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
]

// Export Mars Mosaics
export const MARS_MOSAICS: MosaicPreset[] = [
    {
        id: 'Viking_MDIM21_ClrMosaic_global_232m',
        name: 'Viking Color Mosaic - Global',
        description: 'Viking Orbiter global color mosaic of Mars',
        body: 'mars',
        instrument: 'Viking Orbiter',
        resolution: '232m/pixel',
        coverage: 'Global',
        previewUrl: 'https://api.nasa.gov/assets/img/mars-background.png',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Mars/EQ/Viking_MDIM21_ClrMosaic_global_232m',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'jpg',
    },
    {
        id: 'Mars_MGS_MOLA_ClrShade_merge_global_463m',
        name: 'MOLA Color Hillshade',
        description:
            'Mars Orbiter Laser Altimeter color hillshade elevation map',
        body: 'mars',
        instrument: 'MGS MOLA',
        resolution: '463m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/mars/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'jpg',
    },
    {
        id: 'Mars_MGS_MOLA_DEM_mosaic_global_463m_8Bit',
        name: 'MOLA DEM Grayscale',
        description: 'Mars Orbiter Laser Altimeter digital elevation model',
        body: 'mars',
        instrument: 'MGS MOLA',
        resolution: '463m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/mars/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_DEM_mosaic_global_463m_8Bit/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_DEM_mosaic_global_463m_8Bit',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'jpg',
    },
    {
        id: 'Mars_MRO_CTX_Mosaic_Gale_Crater',
        name: 'CTX Mosaic - Curiosity Landing Site',
        description:
            'Context Camera mosaic of Gale Crater (Curiosity landing site)',
        body: 'mars',
        instrument: 'MRO CTX',
        resolution: '6m/pixel',
        coverage: 'Regional',
        previewUrl: 'https://trek.nasa.gov/mars/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MRO_CTX_Mosaic_Gale_Crater/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MRO_CTX_Mosaic_Gale_Crater',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
    {
        id: 'Mars_MRO_HiRISE_Mosaic_Gale_Crater',
        name: 'HiRISE Mosaic - Curiosity Landing Site',
        description:
            'High Resolution Imaging Science Experiment mosaic of Gale Crater',
        body: 'mars',
        instrument: 'MRO HiRISE',
        resolution: '0.25m/pixel',
        coverage: 'Regional',
        previewUrl: 'https://trek.nasa.gov/mars/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MRO_HiRISE_Mosaic_Gale_Crater/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MRO_HiRISE_Mosaic_Gale_Crater',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
    {
        id: 'Mars_MGS_TES_Albedo_mosaic_global_7410m',
        name: 'TES Albedo Mosaic',
        description: 'Thermal Emission Spectrometer albedo mosaic',
        body: 'mars',
        instrument: 'MGS TES',
        resolution: '7.4km/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/mars/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_TES_Albedo_mosaic_global_7410m/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_TES_Albedo_mosaic_global_7410m',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'jpg',
    },
    {
        id: 'Mars_ODY_THEMIS_IR_Day_mosaic_global_100m_v12',
        name: 'THEMIS IR Day',
        description: 'Thermal Emission Imaging System infrared daytime mosaic',
        body: 'mars',
        instrument: 'Odyssey THEMIS',
        resolution: '100m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/mars/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_ODY_THEMIS_IR_Day_mosaic_global_100m_v12/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_ODY_THEMIS_IR_Day_mosaic_global_100m_v12',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'jpg',
    },
    {
        id: 'Mars_ODY_THEMIS_IR_Night_mosaic_global_100m_v12',
        name: 'THEMIS IR Night',
        description:
            'Thermal Emission Imaging System infrared nighttime mosaic',
        body: 'mars',
        instrument: 'Odyssey THEMIS',
        resolution: '100m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/mars/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_ODY_THEMIS_IR_Night_mosaic_global_100m_v12/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Mars/EQ/Mars_ODY_THEMIS_IR_Night_mosaic_global_100m_v12',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'jpg',
    },
]

// Export Vesta Mosaics
export const VESTA_MOSAICS: MosaicPreset[] = [
    {
        id: 'Vesta_Dawn_FC_HAMO_Mosaic_Global_74ppd',
        name: 'Dawn HAMO Global Mosaic',
        description: 'Dawn Framing Camera High Altitude Mapping Orbit mosaic',
        body: 'vesta',
        instrument: 'Dawn FC',
        resolution: '60m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/vesta/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_FC_HAMO_Mosaic_Global_74ppd/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_FC_HAMO_Mosaic_Global_74ppd',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
    {
        id: 'Vesta_Dawn_HAMO_DTM_DLR_Global_48ppd',
        name: 'Dawn HAMO DTM',
        description: 'Digital Terrain Model from Dawn HAMO observations',
        body: 'vesta',
        instrument: 'Dawn FC',
        resolution: '93m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/vesta/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_DTM_DLR_Global_48ppd/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_DTM_DLR_Global_48ppd',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
    {
        id: 'Vesta_Dawn_Geology_Global_32ppd_IAU',
        name: 'Vesta Geology Map',
        description: 'Geologic map of Vesta from Dawn observations',
        body: 'vesta',
        instrument: 'Dawn',
        resolution: '140m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/vesta/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_Geology_Global_32ppd_IAU/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_Geology_Global_32ppd_IAU',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
    {
        id: 'Vesta_Dawn_HAMO_ClrShade_DLR_Global_48ppd_IAU',
        name: 'Vesta Color Hillshade',
        description: 'Color shaded relief map from Dawn HAMO',
        body: 'vesta',
        instrument: 'Dawn FC',
        resolution: '93m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/vesta/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_ClrShade_DLR_Global_48ppd_IAU/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_ClrShade_DLR_Global_48ppd_IAU',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
    {
        id: 'Vesta_Dawn_HAMO_TrueClr_DLR_global_74ppd',
        name: 'Vesta True Color',
        description: 'True color mosaic from Dawn Framing Camera',
        body: 'vesta',
        instrument: 'Dawn FC',
        resolution: '60m/pixel',
        coverage: 'Global',
        previewUrl: 'https://trek.nasa.gov/vesta/',
        wmtsCapabilitiesUrl:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_TrueClr_DLR_global_74ppd/1.0.0/WMTSCapabilities.xml',
        tileEndpoint:
            'https://trek.nasa.gov/tiles/Vesta/EQ/Vesta_Dawn_HAMO_TrueClr_DLR_global_74ppd',
        style: 'default',
        tileMatrixSet: 'default028mm',
        format: 'png',
    },
]

// Export All mosaics combined
export const ALL_MOSAICS = [...MOON_MOSAICS, ...MARS_MOSAICS, ...VESTA_MOSAICS]

// Export Mars Landing Sites
export const MARS_LANDING_SITES: LandingSite[] = [
    {
        name: 'Jezero Crater',
        mission: 'Perseverance',
        body: 'mars',
        latitude: 18.4447,
        longitude: 77.4508,
        year: 2021,
        description:
            'Ancient river delta, searching for signs of past microbial life',
    },
    {
        name: 'Gale Crater',
        mission: 'Curiosity',
        body: 'mars',
        latitude: -4.5895,
        longitude: 137.4417,
        year: 2012,
        description: 'Mount Sharp exploration, evidence of ancient water',
    },
    {
        name: 'Meridiani Planum',
        mission: 'Opportunity',
        body: 'mars',
        latitude: -1.9462,
        longitude: 354.4734,
        year: 2004,
        description: 'Explored for 15 years, found evidence of past water',
    },
    {
        name: 'Gusev Crater',
        mission: 'Spirit',
        body: 'mars',
        latitude: -14.5718,
        longitude: 175.4785,
        year: 2004,
        description: 'Columbia Hills exploration',
    },
    {
        name: 'Green Valley',
        mission: 'Phoenix',
        body: 'mars',
        latitude: 68.2188,
        longitude: 234.2508,
        year: 2008,
        description: 'North polar region, confirmed water ice',
    },
    {
        name: 'Chryse Planitia',
        mission: 'Viking 1',
        body: 'mars',
        latitude: 22.697,
        longitude: 312.0568,
        year: 1976,
        description: 'First successful Mars landing',
    },
    {
        name: 'Utopia Planitia',
        mission: 'Viking 2',
        body: 'mars',
        latitude: 48.269,
        longitude: 134.0103,
        year: 1976,
        description: 'Northern plains exploration',
    },
    {
        name: 'Ares Vallis',
        mission: 'Pathfinder/Sojourner',
        body: 'mars',
        latitude: 19.33,
        longitude: 326.45,
        year: 1997,
        description: 'First Mars rover (Sojourner)',
    },
]

// Export Moon Landing Sites
export const MOON_LANDING_SITES: LandingSite[] = [
    {
        name: 'Sea of Tranquility',
        mission: 'Apollo 11',
        body: 'moon',
        latitude: 0.6875,
        longitude: 23.4333,
        year: 1969,
        description: 'First human Moon landing',
    },
    {
        name: 'Ocean of Storms',
        mission: 'Apollo 12',
        body: 'moon',
        latitude: -3.0128,
        longitude: 336.5783,
        year: 1969,
        description: 'Precision landing near Surveyor 3',
    },
    {
        name: 'Fra Mauro',
        mission: 'Apollo 14',
        body: 'moon',
        latitude: -3.6453,
        longitude: 342.5225,
        year: 1971,
        description: 'Explored hilly terrain',
    },
    {
        name: 'Hadley-Apennine',
        mission: 'Apollo 15',
        body: 'moon',
        latitude: 26.1322,
        longitude: 3.6339,
        year: 1971,
        description: 'First use of Lunar Roving Vehicle',
    },
    {
        name: 'Descartes Highlands',
        mission: 'Apollo 16',
        body: 'moon',
        latitude: -8.9734,
        longitude: 15.5011,
        year: 1972,
        description: 'Highland terrain exploration',
    },
    {
        name: 'Taurus-Littrow Valley',
        mission: 'Apollo 17',
        body: 'moon',
        latitude: 20.1908,
        longitude: 30.7717,
        year: 1972,
        description: 'Last crewed Moon mission, found orange soil',
    },
]

// Export Common zoom levels
export const ZOOM_LEVELS = {
    GLOBAL: 0,
    HEMISPHERE: 2,
    REGIONAL: 5,
    LOCAL: 8,
    DETAIL: 12,
    HIGH_RES: 15,
} as const
