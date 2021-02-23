import { Environment } from './Environment/Environment';
import { Server } from './Server/Server'

class Launcher {

    private server: Server;

    constructor() {
        this.server = new Server(new Environment());
    }

    public launchApp() {
        console.log('Started app');
        this.server.createServer();
    }
}

new Launcher().launchApp();