// Exported Constants for DONKI API
export const DONKI_API_BASE_URL = 'https://api.nasa.gov/DONKI'
export const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY'

// Export DONKI Constants
export const DONKI_Constants = {
    title: 'DONKI - Space Weather Database',
    description:
        'The Space Weather Database Of Notifications, Knowledge, Information (DONKI) is a comprehensive on-line tool for space weather forecasters, scientists, and the general space science community.',
}

// Export DONKI Endpoints
export const DONKI_ENDPOINTS = {
    CME: 'CME',
    CMEAnalysis: 'CMEAnalysis',
    GST: 'GST',
    IPS: 'IPS',
    FLR: 'FLR',
    SEP: 'SEP',
    MPC: 'MPC',
    RBE: 'RBE',
    HSS: 'HSS',
    WSAEnlilSimulations: 'WSAEnlilSimulations',
    notifications: 'notifications',
} as const
