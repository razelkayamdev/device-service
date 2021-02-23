import { Device } from "./Interfaces";

export class Utils {
    public static isDeviceWithIdOrSerialExists(a: Device, devices: Device[]): boolean {
        const filteredDevices = devices.filter((b) => { return b.id == a.id || b.s_n == a.s_n});
        return filteredDevices.length > 0
    }

    public static isDeviceWithIdAndSerialAndModelExists(a: Device, devices: Device[]): boolean {
        const filteredDevices = devices.filter((b) => { return b.id == a.id && b.s_n == a.s_n && b.model == a.model});
        return filteredDevices.length > 0
    }

    public static deviceFromDevicesById(id: string, devices: Device[]): Device | undefined {
        let filtered = devices.filter((device) => { return device.id == id });
        return filtered[0];
    }

    public static updateDevice(device: Device, fromNewDevice: Device): Device {
        if (fromNewDevice.crane_id) { device.crane_id = fromNewDevice.crane_id; }
        if (fromNewDevice.s_n) { device.s_n = fromNewDevice.s_n; }
        if (fromNewDevice.model) { device.model = fromNewDevice.model; }
        if (fromNewDevice.description) { device.description = fromNewDevice.description }
        device.updated = new Date().toString();
        return device;
    }

    public static stripDeletedElement(devices: Device[]) {
        return devices.map((value) => {
            return { 
                id: value.id,
                crane_id: value.crane_id,
                s_n: value.s_n,
                model: value.model,
                description: value.description,
                created: value.created,
                updated: value.updated,
                deleted: undefined
            }
        });
    }
}