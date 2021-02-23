import { Response, Request } from 'express';
import { CranesWorker } from '../Cranes/CranesWorker';
import { DevicesWorker } from '../Devices/DevicesWorker';
import { Device } from '../Shared/Interfaces';
import { Utils } from '../Shared/Utils';
import { Handler, RequestActionType } from './Interfaces';

export class DeviceHandler implements Handler {

    private devicesWorker: DevicesWorker;
    private cranesWorker: CranesWorker;
    private req: Request;
    private res: Response;

    constructor(req: Request, res: Response, paths: { devicesPath: string, cranesPath: string }) {
        this.req = req;
        this.res = res;
        this.devicesWorker = new DevicesWorker(paths.devicesPath);
        this.cranesWorker = new CranesWorker(paths.cranesPath);
    }
    
    public async handleRequest(actionType: RequestActionType): Promise<void> {
        switch (actionType) {
            case RequestActionType.GetNonDeletedDevices:
                await this.handleGettingAllDevices(false);
                break;
            case RequestActionType.GetOnlyDeletedDevices:
                await this.handleGettingAllDevices(true);
                break;
            case RequestActionType.GetDeviceByIdOrFail:
                await this.handleGettingDeviceById();
                break;
            case RequestActionType.PostDevice:
                await this.handlePostingDevice();
                break;
            case RequestActionType.PutDevice:
                let devices = await this.devicesWorker.getDevices();
                await this.handlePuttingDevice(devices);
                break;
            case RequestActionType.DeleteDevice:
                await this.handleDeviceDeletion();
                break;
            case RequestActionType.RestoreDevice:
                await this.handleDeviceRestoration();
                break;
            default:
                break;
        }
    }

    private async handleGettingAllDevices(deleted: boolean) {
        const devices = await this.devicesWorker.getDevicesByDeletionState(deleted);
        if (devices) {
            const stripedDevices = Utils.stripDeletedElement(devices);
            const devicesJson = JSON.stringify(stripedDevices);
            this.res.json(devicesJson);
        } else {
            this.res.json(JSON.stringify([]));
        }
    }

    private async handleGettingDeviceById() {
        const device = await this.devicesWorker.getDeviceById(this.req.params.id);
        if (device) {
            const stripedDevices = Utils.stripDeletedElement([device]);
            const deviceJson = JSON.stringify(stripedDevices[0]);
            this.res.json(deviceJson);
        } else {
            this.sendNotFound();
        }
    }

    private async handlePostingDevice() {
        const device = this.deviceFromQuery();
        if (!device.id || !device.crane_id || !device.s_n || !device.model || !device.description) {
            this.sendConflict();
        } else {
            let isCraneIdValid = await this.cranesWorker.isCraneIdExists(device.crane_id);
            if (isCraneIdValid) {
                let devices = await this.devicesWorker.getDevices();
                if (devices) {
                    if (Utils.isDeviceWithIdAndSerialAndModelExists(device, devices)) {
                        await this.putDevice(device, devices);
                    } else if (Utils.isDeviceWithIdOrSerialExists(device, devices)) {
                        this.sendConflict();
                    } else {
                        devices.push(device);
                        await this.devicesWorker.postDevices(devices);
                        this.sendCreated();
                    }
                } else {
                    await this.devicesWorker.postDevices([device]);
                    this.sendCreated();
                }
            } else {
                this.sendConflict();
            }
        }
    }

    private async handlePuttingDevice(devices: Device[] | undefined) {
        if (devices) {
            let deviceToUpdate = Utils.deviceFromDevicesById(this.req.params.id, devices);
            if (deviceToUpdate) {
                await this.putDevice(deviceToUpdate, devices)
            } else {
                this.sendNotFound();
            }
        } else {
            this.sendNotFound();
        }
    }

    private async putDevice(deviceToUpdate: Device, devices: Device[]) {
        if (deviceToUpdate!.deleted == false) {
            const updatedDevice = Utils.updateDevice(deviceToUpdate, this.deviceFromQuery());
            let isCraneIdValid = await this.cranesWorker.isCraneIdExists(updatedDevice.crane_id);
            if (isCraneIdValid) {
                let index = devices.findIndex((device => device.id == deviceToUpdate!.id));
                devices.splice(index, 1, updatedDevice);
                await this.devicesWorker.postDevices(devices);
                this.sendOK();
            } else {
                this.sendConflict();
            } 
        } else {
            this.sendNotFound();
        }
    }

    private async handleDeviceDeletion() {
        const devices = await this.devicesWorker.getDevices();
        if (devices) {
            let deviceToUpdate = Utils.deviceFromDevicesById(this.req.params.id, devices);
            if (deviceToUpdate) {
                deviceToUpdate.deleted = true;
                let index = devices.findIndex((device => device.id == deviceToUpdate!.id));
                devices.splice(index, 1, deviceToUpdate);
                await this.devicesWorker.postDevices(devices);
                this.sendOK(); 
            } else {
                this.sendNotFound();
            }
        } else {
            this.sendNotFound();
        }
    }

    private async handleDeviceRestoration() {
        const devices = await this.devicesWorker.getDevices();
        if (devices) {
            let deviceToRestore = Utils.deviceFromDevicesById(this.req.params.id, devices);
            if (deviceToRestore) {
                deviceToRestore.deleted = false;
                let index = devices.findIndex((device => device.id == deviceToRestore!.id));
                devices.splice(index, 1, deviceToRestore);
                await this.devicesWorker.postDevices(devices);
                this.sendOK();
            } else {
                this.sendNotFound();
            }
        } else {
            this.sendNotFound();
        }
    }

    private deviceFromQuery(): Device {
        return { 
            id: this.req.query.id as string,
            crane_id: this.req.query.crane_id as string,
            s_n: this.req.query.s_n as string,
            model: this.req.query.model as string,
            description: this.req.query.description as string,
            created: Date().toString(),
            updated: Date().toString(),
            deleted: false
        }
    }

    private sendOK() {
        this.res.sendStatus(200);
    }

    private sendCreated() {
        this.res.sendStatus(201)
    }

    private sendNotFound() {
        this.res.sendStatus(404);
    }

    private sendConflict() {
        this.res.sendStatus(409)
    }
}