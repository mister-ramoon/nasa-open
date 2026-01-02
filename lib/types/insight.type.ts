// Atmospheric data (temperature, pressure)
export interface AtmosphericData {
    av: number // Average
    ct: number // Count of data points
    mn: number // Minimum
    mx: number // Maximum
}

// Wind Direction data
export interface WindDirectionData {
    compass_degrees: number
    compass_point: string // N, NE, E, SE, S, SW, W, NW
    compass_right: number
    compass_up: number
    ct: number // Count
}

// Wind Speed data
export interface WindSpeedData {
    av: number
    ct: number
    mn: number
    mx: number
}

// Sol (Martian Day) data
export interface SolData {
    AT?: AtmosphericData // Atmospheric Temperature
    HWS?: WindSpeedData // Horizontal Wind Speed
    PRE?: AtmosphericData // Atmospheric Pressure
    WD?: Record<string, WindDirectionData> // Wind Direction (keyed by compass sector 0-15)
    First_UTC: string // First timestamp of the Sol
    Last_UTC: string // Last timestamp of the Sol
    Month_ordinal: number // Month ordinal
    Northern_season: string // Northern hemisphere season
    PRE_sensor_type?: string // Pressure sensor type
    Season: string // Current season
    Southern_season: string // Southern hemisphere season
    sol_keys?: string[] // Available sol keys (only in validity_checks)
}

// Validity checks for sensors
export interface ValidityChecks {
    sol_hours_required: number
    sols_checked: string[]
    AT: SensorValidity
    HWS: SensorValidity
    PRE: SensorValidity
    WD: SensorValidity
}

export interface SensorValidity {
    sol_hours_with_data: number[]
    valid: boolean[]
}

// Full API Response
export interface InsightWeatherResponse {
    sol_keys: string[] // Array of available sol numbers
    validity_checks: ValidityChecks
    [sol: string]: SolData | string[] | ValidityChecks // Dynamic sol data
}

// Processed Sol for easier consumption
export interface ProcessedSol {
    sol: string
    earthDate: string
    lastUpdated: string
    season: string
    northernSeason: string
    southernSeason: string
    temperature?: {
        average: number
        min: number
        max: number
        unit: string
    }
    pressure?: {
        average: number
        min: number
        max: number
        unit: string
    }
    windSpeed?: {
        average: number
        min: number
        max: number
        unit: string
    }
    windDirection?: {
        mostCommon: string
        degrees: number
    }
}
