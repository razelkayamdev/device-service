export interface Device {
    id: string,
    crane_id: string,
    s_n: string,
    model: string,
    description: string,
    created: string,
    updated: string,
    deleted: boolean
}

export interface Cranes {
    identifiers: string[]
}