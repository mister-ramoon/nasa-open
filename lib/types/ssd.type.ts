// ============ CAD (Close Approach Data) Types ============

export interface CloseApproachData {
    des: string // Object designation
    orbit_id: string // Orbit ID
    jd: string // Close approach Julian date
    cd: string // Close approach date/time (TDB)
    dist: string // Nominal approach distance (au)
    dist_min: string // Minimum approach distance (au)
    dist_max: string // Maximum approach distance (au)
    v_rel: string // Velocity relative to approach body (km/s)
    v_inf: string // Velocity at infinity (km/s)
    t_sigma_f: string // 3-sigma uncertainty in time (formatted)
    h: string // Absolute magnitude H
    diameter?: string // Diameter (km)
    diameter_sigma?: string // Diameter uncertainty (km)
    fullname?: string // Full name/designation
}

export interface CADResponse {
    signature: {
        version: string
        source: string
    }
    count: string
    fields: string[]
    data: string[][]
}

export interface CADParams {
    date_min?: string // Start date (YYYY-MM-DD or 'now')
    date_max?: string // End date (YYYY-MM-DD or '+60' days)
    dist_min?: string // Minimum distance (au)
    dist_max?: string // Maximum distance (au, default 0.05)
    h_min?: number // Minimum absolute magnitude
    h_max?: number // Maximum absolute magnitude
    v_inf_min?: number // Minimum velocity (km/s)
    v_inf_max?: number // Maximum velocity (km/s)
    v_rel_min?: number // Minimum relative velocity
    v_rel_max?: number // Maximum relative velocity
    class?: string // Orbit class (e.g., 'ATE', 'APO', 'AMO')
    pha?: boolean // PHAs only
    nea?: boolean // NEAs only
    comet?: boolean // Comets only
    neo_only?: boolean // NEOs only
    kind?: 'a' | 'c' | 'ac' // Asteroid, comet, or both
    body?: string // Body to find close approaches (default: 'Earth')
    sort?: 'date' | 'dist' | 'dist-min' | 'v-inf' | 'v-rel' | 'h' | 'object'
    limit?: number // Maximum results
    fullname?: boolean // Include full name
}

// ============ Fireball Types ============

export interface FireballData {
    date: string // Datetime (UTC)
    lat: string | null // Latitude (degrees)
    lat_dir: 'N' | 'S' | null // Latitude direction
    lon: string | null // Longitude (degrees)
    lon_dir: 'E' | 'W' | null // Longitude direction
    alt: string | null // Altitude (km)
    vel: string | null // Velocity (km/s)
    energy: string // Total radiated energy (J)
    impact_e: string | null // Impact energy (kt)
    vx?: string // Velocity component X
    vy?: string // Velocity component Y
    vz?: string // Velocity component Z
}

export interface FireballResponse {
    signature: {
        version: string
        source: string
    }
    count: string
    fields: string[]
    data: (string | null)[][]
}

export interface FireballParams {
    date_min?: string // Minimum date
    date_max?: string // Maximum date
    energy_min?: number // Minimum energy (kt)
    energy_max?: number // Maximum energy (kt)
    impact_e_min?: number // Minimum impact energy
    impact_e_max?: number // Maximum impact energy
    vel_min?: number // Minimum velocity
    vel_max?: number // Maximum velocity
    alt_min?: number // Minimum altitude
    alt_max?: number // Maximum altitude
    req_loc?: boolean // Require location
    req_alt?: boolean // Require altitude
    req_vel?: boolean // Require velocity
    req_vel_comp?: boolean // Require velocity components
    vel_comp?: boolean // Include velocity components
    sort?: 'date' | 'energy' | 'impact-e' | 'vel' | 'alt'
    limit?: number // Maximum results
}

// ============ NHATS (Human-Accessible NEOs) Types ============

export interface NHATSObject {
    des: string // Designation
    orbit_id: string // Orbit ID
    fullname: string // Full name
    h: number // Absolute magnitude
    min_dv: number // Minimum delta-v (km/s)
    min_dur: number // Minimum mission duration (days)
    n_via_traj: number // Number of viable trajectories
    min_size?: number // Minimum size (m)
    max_size?: number // Maximum size (m)
    obs_start?: string // Observation arc start
    obs_end?: string // Observation arc end
}

export interface NHATSResponse {
    signature: {
        version: string
        source: string
    }
    count: number
    data: NHATSObject[]
}

export interface NHATSParams {
    dv?: number // Maximum delta-v (km/s)
    dur?: number // Maximum duration (days)
    stay?: number // Maximum stay (days)
    launch?: string // Launch window (YYYY-YYYY)
    h?: number // Maximum absolute magnitude
    occ?: number // Minimum observation coverage
    spk?: string // Specific SPK ID
    des?: string // Specific designation
    plot?: boolean // Include plot data
}

// ============ Scout Types ============

export interface ScoutObject {
    objectName: string // Object name/designation
    neoScore: number // NEO score (0-100)
    ieoScore: number // IEO score
    n_obs: number // Number of observations
    arc: number // Observation arc (days)
    H: number // Absolute magnitude
    rating: number // Overall rating
    lastRun: string // Last computation time
    Vmag: number // Apparent V magnitude
    unc: number // Uncertainty
    geocentricScore?: number
    tisserandScore?: number
    phaScore?: number // PHA score
}

export interface ScoutResponse {
    signature: {
        version: string
        source: string
    }
    count: number
    data: ScoutObject[]
}

export interface ScoutParams {
    tdes?: string // Temporary designation
    plot?: string // Plot type
    file?: string // Output format
    orbits?: boolean // Include orbits
    eph?: boolean // Include ephemerides
}

// ============ Sentry Types ============

export interface SentryObject {
    des: string // Designation
    fullname: string // Full name
    id: string // ID
    ip: string // Cumulative impact probability
    ps: string // Palermo scale
    ts: string // Torino scale
    n_imp: number // Number of potential impacts
    last_obs: string // Last observation date
    h: number // Absolute magnitude
    diameter?: string // Diameter (km)
    range?: string // Year range of potential impacts
    v_inf?: string // Velocity at infinity
}

export interface SentryVirtualImpactor {
    date: string // Impact date
    dist: string // Distance (LD)
    width: string // Width (km)
    sigma: string // Sigma
    energy: string // Impact energy (MT)
    ps: string // Palermo scale
    ts: string // Torino scale
    ip: string // Impact probability
}

export interface SentryDetailResponse {
    signature: {
        version: string
        source: string
    }
    summary: SentryObject
    data?: SentryVirtualImpactor[]
}

export interface SentryResponse {
    signature: {
        version: string
        source: string
    }
    count: number
    data: SentryObject[]
}

export interface SentryParams {
    des?: string // Designation
    spk?: string // SPK ID
    h_max?: number // Maximum absolute magnitude
    ps_min?: number // Minimum Palermo scale
    ip_min?: number // Minimum impact probability
    last_obs_days?: number // Max days since last observation
    complete?: boolean // Include complete data
    removed?: boolean // Show removed objects
    all?: boolean // Show all (including removed)
}

// ============ Mission Design Types ============

export interface MissionDesignTrajectory {
    launch_date: string
    arrival_date: string
    dv_launch: number // km/s
    dv_total: number // km/s
    duration: number // days
    c3: number // km²/s²
}

export interface MissionDesignResponse {
    signature: {
        version: string
        source: string
    }
    object: {
        des: string
        fullname: string
        h: number
    }
    count: number
    trajectories: MissionDesignTrajectory[]
}

export interface MissionDesignParams {
    des: string // Target designation (required)
    mjd0?: number // Earliest launch date (MJD)
    span?: number // Launch window span (days)
    tof_min?: number // Minimum time of flight (days)
    tof_max?: number // Maximum time of flight (days)
    step?: number // Step size (days)
}

// ============ Processed/Utility Types ============

export interface ProcessedCloseApproach {
    name: string
    date: Date
    distance_au: number
    distance_km: number
    distance_ld: number // Lunar distances
    velocity_km_s: number
    magnitude: number
    diameter_m?: number
    isPHA: boolean
}

export interface ProcessedFireball {
    date: Date
    location: {
        lat: number | null
        lon: number | null
    } | null
    altitude_km: number | null
    velocity_km_s: number | null
    energy_kt: number
    impact_energy_kt: number | null
}
