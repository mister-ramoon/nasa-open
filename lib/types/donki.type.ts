// Common Date Range Params
export interface DonkiDateParams {
    startDate?: string // YYYY-MM-DD
    endDate?: string // YYYY-MM-DD
}

// CME Analysis Params
export interface CMEAnalysisParams extends DonkiDateParams {
    mostAccurateOnly?: boolean
    completeEntryOnly?: boolean
    speed?: number
    halfAngle?: number
    catalog?: 'ALL' | 'SWRC_CATALOG' | 'JANG_ET_AL_CATALOG'
    keyword?: string
}

// IPS Params
export interface IPSParams extends DonkiDateParams {
    location?: 'ALL' | 'Earth' | 'MESSENGER' | 'STEREO A' | 'STEREO B'
    catalog?: 'ALL' | 'SWRC_CATALOG' | 'WINSLOW_MESSENGER_ICME_CATALOG'
}

// Notifications Params
export interface NotificationsParams extends DonkiDateParams {
    type?:
        | 'all'
        | 'FLR'
        | 'SEP'
        | 'CME'
        | 'IPS'
        | 'MPC'
        | 'GST'
        | 'RBE'
        | 'report'
}

// CME Response
export interface CMEEvent {
    activityID: string
    catalog: string
    startTime: string
    sourceLocation: string
    activeRegionNum: number | null
    link: string
    note: string
    instruments: { displayName: string }[]
    cmeAnalyses: CMEAnalysis[] | null
}

// CME Analysis Response
export interface CMEAnalysis {
    time21_5: string
    latitude: number
    longitude: number
    halfAngle: number
    speed: number
    type: string
    isMostAccurate: boolean
    note: string
    levelOfData: number
    link: string
}

// GST Response
export interface GSTEvent {
    gstID: string
    startTime: string
    allKpIndex: {
        observedTime: string
        kpIndex: number
        source: string
    }[]
    link: string
}

// FLR Response
export interface FLREvent {
    flrID: string
    instruments: { displayName: string }[]
    beginTime: string
    peakTime: string
    endTime: string | null
    classType: string
    sourceLocation: string
    activeRegionNum: number
    link: string
}

// SEP Response
export interface SEPEvent {
    sepID: string
    eventTime: string
    instruments: { displayName: string }[]
    link: string
}

// MPC Response
export interface MPCEvent {
    mpcID: string
    eventTime: string
    instruments: { displayName: string }[]
    link: string
}

// RBE Response
export interface RBEEvent {
    rbeID: string
    eventTime: string
    instruments: { displayName: string }[]
    link: string
}

// HSS Response
export interface HSSEvent {
    hssID: string
    eventTime: string
    instruments: { displayName: string }[]
    link: string
}

// IPS Response
export interface IPSEvent {
    catalog: string
    activityID: string
    location: string
    eventTime: string
    link: string
    instruments: { displayName: string }[]
}

// WSA Enlil Simulation Response
export interface WSAEnlilSimulation {
    simulationID: string
    modelCompletionTime: string
    au: number
    cmeInputs: {
        cmeStartTime: string
        latitude: number
        longitude: number
        speed: number
        halfAngle: number
    }[]
    estimatedShockArrivalTime: string | null
    estimatedDuration: number | null
    rpiSafeEstimate: string | null
    kp18Estimate: number | null
    kp90Estimate: number | null
    isEarthGB: boolean
    link: string
}

// Notification Response
export interface DonkiNotification {
    messageType: string
    messageID: string
    messageURL: string
    messageIssueTime: string
    messageBody: string
}
