// Export OSDR API URLs
export const OSDR_API_BASE_URL = 'https://osdr.nasa.gov/osdr/data'
export const OSDR_GEODE_API_URL = 'https://osdr.nasa.gov/geode-py/ws/api'
export const OSDR_FILE_BASE_URL = 'https://osdr.nasa.gov'

// Export OSDR Constants
export const OSDR_Constants = {
    title: 'Open Science Data Repository',
    description:
        'NASA OSDR provides a RESTful API to its full-text search, data file retrieval, and metadata retrieval capabilities. Access study datasets, experiments, missions, payloads, and more from NASA space biology research.',
}

// Export Data Source Types
export const OSDR_DATA_SOURCES = {
    cgene: 'NASA OSDR',
    nih_geo_gse: 'NIH Gene Expression Omnibus',
    ebi_pride: 'EBI Proteomics Identification',
    mg_rast: 'Metagenomics RAST',
} as const

// Export Entity Types
export const OSDR_ENTITY_TYPES = {
    experiments: 'experiments',
    missions: 'missions',
    payloads: 'payloads',
    hardware: 'hardware',
    vehicles: 'vehicles',
    subjects: 'subjects',
    biospecimens: 'biospecimens',
} as const

// Export Filter Fields
export const OSDR_FILTER_FIELDS = [
    'Accession',
    'organism',
    'Project Type',
    'Flight Program',
    'Material Type',
    'Study Assay Technology Type',
    'Managing NASA Center',
    'Space Program',
] as const
