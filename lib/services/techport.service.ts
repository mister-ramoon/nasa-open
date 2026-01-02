// Import constants and types
import {
    TECHPORT_API_BASE_URL,
    TRL_LEVELS,
} from '../constants/techport.constant'
import type {
    Project,
    ProjectSummary,
    ProjectListResponse,
    ProjectResponse,
    TechportSearchParams,
    ProcessedProject,
    ProjectStatus,
} from '../types/techport.type'

// Generic fetch function for TechPort API
async function fetchTechport<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
): Promise<T | null> {
    const url = new URL(`${TECHPORT_API_BASE_URL}${endpoint}`)

    // Add query parameters
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.append(key, String(value))
            }
        })
    }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout

        const response = await fetch(url.toString(), {
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
            next: { revalidate: 3600 }, // Cache for 1 hour
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            if (response.status !== 503) {
                console.error(
                    `TechPort API Error: ${response.status} ${response.statusText}`
                )
            }
            return null
        }

        return response.json()
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('TechPort API fetch error:', error)
        }
        return null
    }
}

// ============ Project Endpoints ============

// Get all project IDs updated since a date
export async function getProjectIds(updatedSince?: string): Promise<number[]> {
    const params: Record<string, string | undefined> = {}
    if (updatedSince) {
        params.updatedSince = updatedSince
    }

    const response = await fetchTechport<ProjectListResponse>(
        '/projects',
        params
    )

    if (!response?.projects?.projects) return []

    return response.projects.projects.map((p) => p.projectId)
}

// Get projects updated since a date (with summary info)
export async function getProjectsSummary(
    updatedSince?: string
): Promise<ProjectSummary[]> {
    const params: Record<string, string | undefined> = {}
    if (updatedSince) {
        params.updatedSince = updatedSince
    }

    const response = await fetchTechport<ProjectListResponse>(
        '/projects',
        params
    )
    return response?.projects?.projects || []
}

// Get single project by ID
export async function getProject(projectId: number): Promise<Project | null> {
    const response = await fetchTechport<ProjectResponse>(
        `/projects/${projectId}`
    )
    return response?.project || null
}

// Get multiple projects by IDs
export async function getProjects(projectIds: number[]): Promise<Project[]> {
    const projects = await Promise.all(
        projectIds.map((id) => getProject(id).catch(() => null))
    )
    return projects.filter((p): p is Project => p !== null)
}

// Search projects (using updated since as a basic filter)
export async function searchProjects(
    params: TechportSearchParams
): Promise<ProjectSummary[]> {
    const queryParams: Record<string, string | undefined> = {}

    if (params.updatedSince) {
        queryParams.updatedSince = params.updatedSince
    }

    const allProjects = await getProjectsSummary(params.updatedSince)

    // Filter locally if search query provided
    if (params.searchQuery) {
        const query = params.searchQuery.toLowerCase()
        return allProjects.filter(
            (p) =>
                p.title.toLowerCase().includes(query) ||
                p.acronym?.toLowerCase().includes(query)
        )
    }

    // Filter by status
    if (params.status) {
        return allProjects.filter((p) => p.statusDescription === params.status)
    }

    return allProjects
}

// Get recently updated projects
export async function getRecentProjects(
    days: number = 30
): Promise<ProjectSummary[]> {
    const date = new Date()
    date.setDate(date.getDate() - days)
    const dateStr = date.toISOString().split('T')[0]

    return getProjectsSummary(dateStr)
}

// Get active projects
export async function getActiveProjects(): Promise<ProjectSummary[]> {
    const projects = await getProjectsSummary()
    return projects.filter((p) => p.statusDescription === 'Active')
}

// Get completed projects
export async function getCompletedProjects(): Promise<ProjectSummary[]> {
    const projects = await getProjectsSummary()
    return projects.filter((p) => p.statusDescription === 'Completed')
}

// ============ Featured/Sample Projects ============

// Get featured projects (sample of recent active projects)
export async function getFeaturedProjects(
    limit: number = 10
): Promise<Project[]> {
    const recentIds = await getProjectIds()
    const sampleIds = recentIds.slice(0, Math.min(limit, recentIds.length))
    return getProjects(sampleIds)
}

// Get random sample projects
export async function getSampleProjects(count: number = 6): Promise<Project[]> {
    const allIds = await getProjectIds()

    if (allIds.length === 0) return []

    // Get random sample
    const shuffled = [...allIds].sort(() => 0.5 - Math.random())
    const sampleIds = shuffled.slice(0, Math.min(count, shuffled.length))

    return getProjects(sampleIds)
}

// ============ Utility Functions ============

// Process project for display
export function processProject(project: Project): ProcessedProject {
    return {
        id: project.projectId,
        title: project.title,
        acronym: project.acronym,
        status: project.statusDescription,
        description: project.description || '',
        startDate: project.startDateString,
        endDate: project.endDateString,
        leadOrganization: project.leadOrganization?.organizationName,
        trlStart: project.technologyMaturityStart,
        trlCurrent: project.technologyMaturityCurrent,
        trlEnd: project.technologyMaturityEnd,
        technologyAreas:
            project.primaryTaxonomyNodes?.map((t) => t.title) || [],
        website: project.website,
        lastUpdated: project.lastUpdated,
    }
}

// Process multiple projects
export function processProjects(projects: Project[]): ProcessedProject[] {
    return projects.map(processProject)
}

// Get TRL description
export function getTrlDescription(trl: number): string {
    return TRL_LEVELS[trl as keyof typeof TRL_LEVELS] || 'Unknown'
}

// Format date range
export function formatDateRange(startDate?: string, endDate?: string): string {
    if (!startDate && !endDate) return 'Dates not specified'
    if (startDate && !endDate) return `Started ${startDate}`
    if (!startDate && endDate) return `Ending ${endDate}`
    return `${startDate} - ${endDate}`
}

// Calculate project duration in months
export function calculateDuration(
    startYear?: number,
    startMonth?: number,
    endYear?: number,
    endMonth?: number
): number | null {
    if (!startYear || !endYear) return null

    const startMonthNum = startMonth || 1
    const endMonthNum = endMonth || 12

    return (endYear - startYear) * 12 + (endMonthNum - startMonthNum)
}

// Truncate description
export function truncateDescription(
    description: string,
    maxLength: number = 200
): string {
    if (!description) return ''
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).trim() + '...'
}

// Get status badge class
export function getStatusBadgeClass(status: ProjectStatus): string {
    const classes: Record<ProjectStatus, string> = {
        Active: 'bg-green-100 text-green-800',
        Completed: 'bg-blue-100 text-blue-800',
        Canceled: 'bg-red-100 text-red-800',
        'Not Started': 'bg-gray-100 text-gray-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
}

// Get TRL progress percentage
export function getTrlProgress(
    current?: number,
    start?: number,
    end?: number
): number {
    if (!current) return 0
    if (!start || !end || start === end) return (current / 9) * 100
    return ((current - start) / (end - start)) * 100
}

// Safely format numbers
export function safeToFixed(value: unknown, decimals: number = 2): string {
    if (typeof value === 'number' && !isNaN(value)) {
        return value.toFixed(decimals)
    }
    if (typeof value === 'string') {
        const parsed = parseFloat(value)
        if (!isNaN(parsed)) {
            return parsed.toFixed(decimals)
        }
    }
    return '—'
}

// Get summary statistics
export async function getTechportSummary(): Promise<{
    totalProjects: number
    activeProjects: number
    recentlyUpdated: number
}> {
    try {
        const [allProjects, recentProjects] = await Promise.all([
            getProjectsSummary().catch(() => []),
            getRecentProjects(30).catch(() => []),
        ])

        const activeCount = allProjects.filter(
            (p) => p.statusDescription === 'Active'
        ).length

        return {
            totalProjects: allProjects.length,
            activeProjects: activeCount,
            recentlyUpdated: recentProjects.length,
        }
    } catch {
        return {
            totalProjects: 0,
            activeProjects: 0,
            recentlyUpdated: 0,
        }
    }
}
