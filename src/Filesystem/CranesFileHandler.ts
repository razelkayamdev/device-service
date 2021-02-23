import * as fs from 'fs';
import { Cranes } from '../Shared/Interfaces';

export class CranesFileHandler {

    private path: string

    constructor(path: string){
        this.path = path;
    }

    public async readCranes(): Promise<Cranes> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, (error, data) => {
                if (error) {
                   reject(error);
                } else {
                    if (data.length == 0) {
                        resolve({
                            identifiers: []
                        });
                    } else {
                        let cranesIds: Array<string> = JSON.parse(data.toString());
                        resolve({
                            identifiers: cranesIds
                        });
                    }
                }
            });
        });
    }
}