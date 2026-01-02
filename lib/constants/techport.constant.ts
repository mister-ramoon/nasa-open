// Export TechPort API Base URL
export const TECHPORT_API_BASE_URL = 'https://techport.nasa.gov/api'

// Export API Endpoints
export const TECHPORT_ENDPOINTS = {
    PROJECTS: '/projects',
    PROJECT: '/projects/{projectId}',
    SEARCH: '/projects/search',
} as const

// Export Constants
export const TECHPORT_Constants = {
    title: 'NASA TechPort',
    description:
        "TechPort is NASA's technology inventory, showcasing the portfolio of active and completed technology projects. It facilitates collaboration, partnership opportunities, and analysis of how NASA meets mission needs.",
    dataSource: 'NASA Office of the Chief Technologist',
}

// Export Project Status Types
export const PROJECT_STATUS = {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    CANCELED: 'Canceled',
    NOT_STARTED: 'Not Started',
} as const

// Export Technology Readiness Levels (TRL)
export const TRL_LEVELS = {
    1: 'Basic principles observed and reported',
    2: 'Technology concept and/or application formulated',
    3: 'Analytical and experimental critical function and/or characteristic proof of concept',
    4: 'Component and/or breadboard validation in laboratory environment',
    5: 'Component and/or breadboard validation in relevant environment',
    6: 'System/subsystem model or prototype demonstration in relevant environment',
    7: 'System prototype demonstration in an operational environment',
    8: 'Actual system completed and qualified through test and demonstration',
    9: 'Actual system proven through successful mission operations',
} as const

// Export Mission Directorates
export const MISSION_DIRECTORATES = {
    ARMD: 'Aeronautics Research Mission Directorate',
    ESDMD: 'Exploration Systems Development Mission Directorate',
    SMD: 'Science Mission Directorate',
    SOMD: 'Space Operations Mission Directorate',
    STMD: 'Space Technology Mission Directorate',
} as const

// Export Technology Areas (Top Level)
export const TECHNOLOGY_AREAS = {
    TA01: 'Launch Propulsion Systems',
    TA02: 'In-Space Propulsion Technologies',
    TA03: 'Space Power and Energy Storage',
    TA04: 'Robotics and Autonomous Systems',
    TA05: 'Communications, Navigation, and Orbital Debris Tracking',
    TA06: 'Human Health, Life Support, and Habitation Systems',
    TA07: 'Human Exploration Destination Systems',
    TA08: 'Science Instruments, Observatories, and Sensor Systems',
    TA09: 'Entry, Descent, and Landing Systems',
    TA10: 'Nanotechnology',
    TA11: 'Modeling, Simulation, Information Technology, and Processing',
    TA12: 'Materials, Structures, Mechanical Systems, and Manufacturing',
    TA13: 'Ground, Test, and Surface Systems',
    TA14: 'Thermal Management Systems',
    TA15: 'Aeronautics',
} as const

// Export Status Colors for UI
export const STATUS_COLORS = {
    Active: { bg: 'bg-green-100', text: 'text-green-800' },
    Completed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    Canceled: { bg: 'bg-red-100', text: 'text-red-800' },
    'Not Started': { bg: 'bg-gray-100', text: 'text-gray-800' },
} as const

// Export TRL Color Scale
export const TRL_COLORS = {
    1: 'bg-red-500',
    2: 'bg-red-400',
    3: 'bg-orange-500',
    4: 'bg-orange-400',
    5: 'bg-yellow-500',
    6: 'bg-yellow-400',
    7: 'bg-green-400',
    8: 'bg-green-500',
    9: 'bg-green-600',
} as const
