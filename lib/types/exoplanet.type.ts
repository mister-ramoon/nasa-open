// Confirmed Exoplanet Type
export interface Exoplanet {
    pl_name: string // Planet Name
    hostname: string // Host Star Name
    pl_letter: string // Planet Letter
    hd_name: string | null // HD Name
    hip_name: string | null // HIP Name
    tic_id: string | null // TIC ID
    gaia_id: string | null // Gaia ID
    sy_snum: number // Number of Stars
    sy_pnum: number // Number of Planets
    discoverymethod: string // Discovery Method
    disc_year: number // Discovery Year
    disc_facility: string // Discovery Facility
    pl_orbper: number | null // Orbital Period (days)
    pl_orbsmax: number | null // Orbit Semi-Major Axis (AU)
    pl_rade: number | null // Planet Radius (Earth Radius)
    pl_bmasse: number | null // Planet Mass (Earth Mass)
    pl_orbeccen: number | null // Eccentricity
    pl_eqt: number | null // Equilibrium Temperature (K)
    st_spectype: string | null // Stellar Spectral Type
    st_teff: number | null // Stellar Effective Temperature (K)
    st_rad: number | null // Stellar Radius (Solar Radius)
    st_mass: number | null // Stellar Mass (Solar Mass)
    sy_dist: number | null // Distance (pc)
    pl_tranflag: number // Transit Flag (1 = transits)
    pl_kepflag: number // Kepler Field Flag
    pl_k2flag: number // K2 Flag
    pl_ttvflag: number // TTV Flag
    rowupdate: string // Row Update Date
}

// Kepler Object of Interest (KOI) Type
export interface KeplerCandidate {
    kepid: number // Kepler ID
    kepoi_name: string // KOI Name
    kepler_name: string | null // Kepler Name
    koi_disposition: string // Disposition (CANDIDATE, CONFIRMED, FALSE POSITIVE)
    koi_pdisposition: string // Planet Disposition
    koi_score: number // Score
    koi_period: number | null // Orbital Period (days)
    koi_prad: number | null // Planet Radius (Earth Radius)
    koi_teq: number | null // Equilibrium Temperature (K)
    koi_insol: number | null // Insolation Flux
    koi_steff: number | null // Stellar Effective Temperature (K)
    koi_srad: number | null // Stellar Radius (Solar Radius)
    ra: number // Right Ascension
    dec: number // Declination
}

// Query Parameters
export interface ExoplanetQueryParams {
    table?: 'ps' | 'pscomppars' | 'cumulative' | 'koi' | 'k2candidates'
    select?: string
    where?: string
    order?: string
    format?: 'json' | 'csv' | 'ipac' | 'votable'
    limit?: number
}

// Discovery Methods
export type DiscoveryMethod =
    | 'Transit'
    | 'Radial Velocity'
    | 'Imaging'
    | 'Microlensing'
    | 'Eclipse Timing Variations'
    | 'Pulsar Timing'
    | 'Transit Timing Variations'
    | 'Orbital Brightness Modulation'
    | 'Astrometry'
    | 'Disk Kinematics'
