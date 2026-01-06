// Import constants and services
import {
    TRL_LEVELS,
    TECHNOLOGY_AREAS,
    MISSION_DIRECTORATES,
} from '@/lib/constants/techport.constant'
import {
    getSampleProjects,
    getRecentProjects,
    getTechportSummary,
    processProject,
} from '@/lib/services/techport.service'
import TechportClient from './client'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'

export default async function TechportPage() {
    // Fetch data in parallel with error handling
    const [summary, recentProjectsSummary, sampleProjects] = await Promise.all([
        getTechportSummary().catch(() => ({
            totalProjects: 0,
            activeProjects: 0,
            recentlyUpdated: 0,
        })),
        getRecentProjects(60).catch(() => []),
        getSampleProjects(6).catch(() => []),
    ])

    // Process sample projects
    const processedProjects = sampleProjects.map(processProject)

    return (
        <TechportClient
            processedProjects={processedProjects}
            recentProjectsSummary={recentProjectsSummary}
            summary={summary}
            trlLevels={TRL_LEVELS}
            technologyAreas={TECHNOLOGY_AREAS}
            missionDirectorates={MISSION_DIRECTORATES}
        />
    )
}
