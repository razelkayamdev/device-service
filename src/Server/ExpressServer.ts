import * as express from 'express';
import { Application, Response, Request } from 'express';
import { Server } from 'http';
import { DeviceHandler } from './DeviceHandler';
import { RequestActionType, Paths } from './Interfaces';

export class ExpressServer {

    private app: Application
    private port: number
    private paths: Paths
    private server: Server | undefined
    private acceptingResponses = true

    constructor(port: number, paths: Paths) {
        this.app = express();
        this.port = port;
        this.paths = paths;
    }

    public close(callback: () => void) {
        this.acceptingResponses = false;
        this.server?.close(() => {
            callback();
        })
    }

    public listen() {
        this.server = this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
        
        /**
         * GET /health
         * Returns nothing, always succeeds.
         */
        this.app.get('/health', (_req: Request, res: Response) => {
            this.proccessIncomingConnection(res);
            res.sendStatus(200);
        });

        /*
        * GET /devices
        * Returns an array of all non-deleted devices.
        */
        this.app.get('/devices', async (req: Request, res: Response) => {
            this.proccessIncomingConnection(res);
            await new DeviceHandler(req, res, this.paths).handleRequest(RequestActionType.GetNonDeletedDevices);
        });

        /**
         * GET /devices/deleted
         * Returns an array of all deleted devices.
         */
        this.app.get('/devices/deleted', async (req: Request, res: Response) => {
            this.proccessIncomingConnection(res);
            await new DeviceHandler(req, res, this.paths).handleRequest(RequestActionType.GetOnlyDeletedDevices);
        });

        /**
         * GET /devices/{id}
         * Returns a device that matches the id in the path.
         * If the device is deleted the operation should fail (status 404).
         */
        this.app.get('/devices/:id', async (req: Request, res: Response) => {
            this.proccessIncomingConnection(res);
            await new DeviceHandler(req, res, this.paths).handleRequest(RequestActionType.GetDeviceByIdOrFail);
        });

        /**
         * POST /devices
         * Creates a new device. The properties of the device are the query parameters.
         */
        this.app.post('/devices', async (req: Request, res: Response) => {
            this.proccessIncomingConnection(res);
            await new DeviceHandler(req, res, this.paths).handleRequest(RequestActionType.PostDevice);
        });

        /**
         * PUT /devices/{id}
         * Update a single device. The properties to change are the query parameters.
         * If the device is deleted the operation should fail (status 404).
         */
        this.app.put('/devices/:id', async (req: Request, res: Response) => {
            this.proccessIncomingConnection(res);
            await new DeviceHandler(req, res, this.paths).handleRequest(RequestActionType.PutDevice);
        });

        /**
         * DELETE /devices/{id}
         * Marks a single device as deleted. 
         * If the device is deleted the operation is considered a success.
         */
        this.app.delete('/devices/:id', async (req: Request, res: Response) => {
            this.proccessIncomingConnection(res);
            await new DeviceHandler(req, res, this.paths).handleRequest(RequestActionType.DeleteDevice);
        });

        /**
         * POST /device/deleted/{id}/restore
         * Restore a single deleted device. 
         * If the device exists but not deleted the operation is considered a success.
         * If the device does not exist the operation should fail (404).
         */
        this.app.post('/devices/deleted/:id/restore', async (req: Request, res: Response) => {
            this.proccessIncomingConnection(res);
            await new DeviceHandler(req, res, this.paths).handleRequest(RequestActionType.RestoreDevice);
        });
    }

    private proccessIncomingConnection(res: Response) {
        if (this.acceptingResponses == false) {
            this.destory(res);
        }
    }

    private destory(res: Response) {
        res.connection?.destroy();
    }

    private async workAsyncly() {
        let promise = new Promise((resolve, reject) => {
          setTimeout(() => resolve("done!"), 5000)
        });
      
        let result = await promise; 
        console.log(result); // "done!"
    }
}

