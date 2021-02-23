import * as fs from 'fs';
import { Device } from '../Shared/Interfaces';

export class DeviceFileHandler {

    private path: string
    constructor(path: string){
        this.path = path;
    }

    private isErrorFileDoesntExist(error: NodeJS.ErrnoException): boolean {
        return (error.errno == -2 && error.code == 'ENOENT' && error.syscall == 'open');
    }

    public async readDevices(): Promise<Device[] | undefined> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, (error, data) => {
                if (error) {
                    if (this.isErrorFileDoesntExist(error)) {
                        resolve(undefined);
                    } else {
                        reject(error);
                    }
                } else {
                    if (data.length == 0) {
                        resolve([]);
                    } else {
                        let devices: Array<Device> = JSON.parse(data.toString());
                        resolve(devices);
                    }
                }
            });
        });
    }

    public async writeDevices(devices: Device[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let data = JSON.stringify(devices)
            fs.writeFile(this.path, data, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }
}