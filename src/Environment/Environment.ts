import * as dotenv from 'dotenv';

export class Environment {

    public readonly httpPort!: number
    public readonly devicesJsonPath!: string
    public readonly cranesJsonPath!: string
 
    constructor() {

        dotenv.config();

        const port = Number(process.env.HTTP_PORT);
        if (port) {
            this.httpPort = port;
        } else {
            throw new Error("Please define HTTP_PORT in .env file.");
        }

        const devicesPath = process.env.DEVICES_JSON
        if (devicesPath && typeof devicesPath === 'string' ) {
            this.devicesJsonPath = devicesPath as string;
        } else {
            throw new Error("Please define DEVICES_JSON in .env file.");
        }

        const cranesPath = process.env.CRANES_JSON;
        if (cranesPath && typeof cranesPath === 'string') {
            this.cranesJsonPath = cranesPath as string;
        } else {
            throw new Error("Please define CRANES_JSON in .env file.");
        }
    }
}