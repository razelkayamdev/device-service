import { CranesFileHandler } from "../Filesystem/CranesFileHandler";

export class CranesWorker {

    private cranesFileHandler: CranesFileHandler;

    constructor(filePath: string) {
        this.cranesFileHandler = new CranesFileHandler(filePath);
    }

    public async isCraneIdExists(id: string): Promise<boolean> {
        const cranes = await this.cranesFileHandler.readCranes();
        const result = cranes.identifiers.findIndex(value => value == id);
        return (result != -1);
    }
}