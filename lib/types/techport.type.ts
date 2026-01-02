// Project Status
export type ProjectStatus = 'Active' | 'Completed' | 'Canceled' | 'Not Started'

// Responsible Program
export interface ResponsibleProgram {
    programId: number
    programName: string
    acronym?: string
    responsibleMd?: string
    responsibleMdId?: number
}

// Organization
export interface Organization {
    organizationId: number
    organizationName: string
    organizationType?: string
    acronym?: string
    city?: string
    state?: string
    country?: string
}

// Contact
export interface Contact {
    contactId: number
    firstName: string
    lastName: string
    fullName: string
    email?: string
    phone?: string
    organization?: Organization
}

// Principal Investigator
export interface PrincipalInvestigator {
    contactId: number
    firstName: string
    lastName: string
    fullName: string
    middleInitial?: string
    primaryEmail?: string
}

// Destination
export interface Destination {
    lkuCodeId: number
    code: string
    description: string
}

// Technology Area (Taxonomy)
export interface TechnologyArea {
    id: number
    code: string
    title: string
    priority?: number
}

// Work Location
export interface WorkLocation {
    locationId: number
    facilityName?: string
    city?: string
    stateTerritory?: string
    country?: string
}

// File/Document
export interface ProjectFile {
    fileId: number
    fileName: string
    filePath?: string
    fileExtension?: string
    fileSize?: number
    mediaType?: string
}

// Library Item
export interface LibraryItem {
    id: number
    title: string
    description?: string
    url?: string
    publishedDate?: string
    files?: ProjectFile[]
}

// Closeout Document
export interface CloseoutDocument {
    id: number
    title?: string
    document?: ProjectFile
}

// State of the Art Description
export interface StateOfTheArt {
    id: number
    description: string
}

// Project Benefits
export interface ProjectBenefit {
    id: number
    benefit?: string
    potentialBenefit?: string
}

// Project (Full Detail)
export interface Project {
    projectId: number
    title: string
    acronym?: string
    statusDescription: ProjectStatus
    description: string

    // Dates
    startDateString?: string
    endDateString?: string
    startYear?: number
    startMonth?: number
    endYear?: number
    endMonth?: number
    lastUpdated?: string

    // Relationships
    responsibleProgram?: ResponsibleProgram
    responsibleMissionDirectorateId?: number
    leadOrganization?: Organization
    supportingOrganizations?: Organization[]
    coFundingPartners?: Organization[]

    // People
    programDirectors?: Contact[]
    programManagers?: Contact[]
    projectManagers?: Contact[]
    principalInvestigators?: PrincipalInvestigator[]
    coInvestigators?: Contact[]

    // Technical Details
    technologyMaturityStart?: number
    technologyMaturityCurrent?: number
    technologyMaturityEnd?: number
    benefits?: string

    // Classifications
    primaryTaxonomyNodes?: TechnologyArea[]
    additionalTaxonomyNodes?: TechnologyArea[]
    destinations?: Destination[]

    // Documentation
    website?: string
    libraryItems?: LibraryItem[]
    closeoutDocuments?: CloseoutDocument[]
    closeoutSummary?: string

    // Locations
    workLocations?: WorkLocation[]

    // Related Projects
    supportedMissionType1?: string
    supportedMissionType2?: string
    statesWithWork?: string[]

    // Additional
    viewCount?: number
}

// Project Summary (for listings)
export interface ProjectSummary {
    projectId: number
    title: string
    acronym?: string
    statusDescription: ProjectStatus
    startYear?: number
    endYear?: number
    lastUpdated?: string
}

// Search/List Response
export interface ProjectListResponse {
    projects: {
        totalCount: number
        projects: ProjectSummary[]
    }
}

// Single Project Response
export interface ProjectResponse {
    project: Project
}

// Projects by ID Response
export interface ProjectsByIdResponse {
    projects: Project[]
}

// Search Parameters
export interface TechportSearchParams {
    updatedSince?: string // YYYY-MM-DD format
    searchQuery?: string
    missionDirectorate?: number
    program?: number
    technologyArea?: number
    status?: ProjectStatus
}

// API Types Response
export interface ApiTypesResponse {
    types: {
        id: number
        name: string
        description?: string
    }[]
}

// Organization Types
export interface OrganizationType {
    organizationTypeId: number
    name: string
}

// Mission Directorate
export interface MissionDirectorate {
    missionDirectorateId: number
    name: string
    acronym?: string
}

// Program
export interface Program {
    programId: number
    title: string
    acronym?: string
    active: boolean
    missionDirectorateId?: number
}

// Processed Project (for display)
export interface ProcessedProject {
    id: number
    title: string
    acronym?: string
    status: ProjectStatus
    description: string
    startDate?: string
    endDate?: string
    leadOrganization?: string
    trlStart?: number
    trlCurrent?: number
    trlEnd?: number
    technologyAreas: string[]
    website?: string
    lastUpdated?: string
}
