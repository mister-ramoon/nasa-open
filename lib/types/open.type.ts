// Study File Type
export interface StudyFile {
    category: string
    date_created: number
    date_updated: string
    file_name: string
    file_size: number
    organization: string
    remote_url: string
    restricted: boolean
    subcategory: string
    subdirectory: string
    visible: boolean
}

// Study Data Type
export interface StudyData {
    file_count: number
    study_files: StudyFile[]
}

// Study Files Response
export interface StudyFilesResponse {
    hits: number
    input: string
    page_number: number
    page_size: number
    page_total: number
    studies: Record<string, StudyData>
    success: boolean
    total_hits: number
    valid_input: string[]
}

// Study Metadata Comment
export interface StudyComment {
    name: string
    value: string
}

// Study Publication
export interface StudyPublication {
    authorList: string
    comments: unknown[]
    doi: string
    pubMedID: string
    status: {
        annotationValue: string
        termAccession: string
        termSource: string
    }
    title: string
}

// Study Details
export interface StudyDetails {
    comments: StudyComment[]
    description: string
    identifier: string
    publicReleaseDate: string
    publications: StudyPublication[]
    submissionDate: string
    title: string
}

// Study Metadata Response
export interface StudyMetadataResponse {
    hits: number
    input: string
    study: Record<
        string,
        {
            additionalInformation: unknown
            comments: unknown[]
            studies: StudyDetails[]
            version: number
        }
    >
    success: boolean
}

// Search Result Item
export interface SearchResultItem {
    Accession: string
    'Study Title': string
    'Study Description'?: string
    organism?: string
    'Project Type'?: string
    'Flight Program'?: string
    'Data Source Type': string
    links?: string[]
}

// Search Response
export interface SearchResponse {
    hits: {
        hits: Array<{
            _source: SearchResultItem
        }>
        total: {
            value: number
        }
    }
    success: boolean
}

// Search Parameters
export interface OSDRSearchParams {
    term?: string
    from?: number
    size?: number
    type?: string // cgene, nih_geo_gse, ebi_pride, mg_rast
    sort?: string
    order?: 'ASC' | 'DESC'
    ffield?: string | string[]
    fvalue?: string | string[]
}

// Mission Type
export interface Mission {
    id: string
    identifier: string
    aliases: string[]
    startDate: string
    endDate: string
    vehicle?: {
        vehicle: string
    }
    people: Array<{
        institution: string
        roles: string[]
        person: {
            firstName: string
            middleName: string
            lastName: string
            emailAddress: string
        }
    }>
    parents?: {
        payload?: Array<{ payload: string }>
        experiment?: Array<{ experiment: string }>
        GLDS_Study?: Array<{ GLDS_Study: string }>
    }
}

// Experiment Type
export interface Experiment {
    id: string
    identifier: string
    title?: string
    description?: string
}

// Payload Type
export interface Payload {
    id: string
    identifier: string
    description?: string
}

// Vehicle Type
export interface Vehicle {
    id: string
    identifier: string
    files: Array<{
        fullPath: string
        subcategory: string
        description: string
    }>
    parents?: {
        mission?: Array<{ mission: string }>
    }
}

// Hardware Type
export interface Hardware {
    id: string
    identifier: string
    description?: string
}

// Subject Type
export interface Subject {
    id: string
    identifier: string
}

// Biospecimen Type
export interface Biospecimen {
    id: string
    identifier: string
}

// Processed Study for easier consumption
export interface ProcessedStudy {
    id: string
    title: string
    description: string
    organism?: string
    projectType?: string
    flightProgram?: string
    releaseDate: string
    fileCount: number
    dataSourceType: string
}
