export enum RequestActionType {
    GetNonDeletedDevices,
    GetOnlyDeletedDevices,
    GetDeviceByIdOrFail,
    PostDevice,
    PutDevice,
    DeleteDevice, 
    RestoreDevice
}

export interface Handler {
    handleRequest(actionType: RequestActionType): Promise<void>
}

export interface Paths {
    devicesPath: string, 
    cranesPath: string
}