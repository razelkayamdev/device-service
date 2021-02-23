import { Environment } from '../Environment/Environment';
import { ExpressServer } from './ExpressServer'

export class Server {

    private experssServer: ExpressServer
    private environment: Environment;
    
    constructor(environment: Environment) {
        this.environment = environment;
        this.experssServer = new ExpressServer(this.environment.httpPort, {
            devicesPath: this.environment.devicesJsonPath, 
            cranesPath: this.environment.cranesJsonPath
        });
    }

    public createServer() {
        this.experssServer.listen();
        this.gracefullyShutdown();
        console.log('Server strated');
    }

    private gracefullyShutdown() {
        process.on('SIGTERM', () => {
            console.log('Server shutting down');
            this.experssServer.close(() => {
                process.exitCode = 0;
            })
        });
    }
}