import { DeviceFileHandler } from '../Filesystem/DeviceFileHandler';
import { Device } from '../Shared/Interfaces';

export class DevicesWorker {

    private deviceFileHandler: DeviceFileHandler;

    constructor(filePath: string) {
        this.deviceFileHandler = new DeviceFileHandler(filePath);
    }

    public async getDevices(): Promise<Device[] | undefined> {
        return await this.deviceFileHandler.readDevices();
    }

    public async postDevices(devices: Device[]): Promise<void> {
        await this.deviceFileHandler.writeDevices(devices);
    }

    public async getDevicesByDeletionState(deleted: boolean = false): Promise<Device[] | undefined> {
        const devices = await this.getDevices();
        if (devices) {
            const filteredDevices = devices.filter((device) => { return device.deleted == deleted });
            return filteredDevices;
        }
        return undefined;
    }

    public async getDeviceById(id: string): Promise<Device | undefined> {
        const devices = await this.getDevices();
        if (devices) {
            const filteredDevices = devices.filter((device) => { return device.id == id && device.deleted == false });
            if (filteredDevices.length >= 1) {
                return filteredDevices[0];
            } 
        }
        return undefined;
    }
}