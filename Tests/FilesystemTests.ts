import { expect } from 'chai';
import { CranesFileHandler } from "../src/Filesystem/CranesFileHandler";
import { DeviceFileHandler } from "../src/Filesystem/DeviceFileHandler";

describe('File System Tests - CranesFileHandler', () => {
    it('Should read the file succesfuly', async () => {
        const cranesFileHandler: CranesFileHandler = new CranesFileHandler('Tests/Resources/cranes.json');
        let cranes = await cranesFileHandler.readCranes();
        expect(cranes.identifiers.length).to.be.equal(2);
        expect(cranes.identifiers[0]).to.be.equal('some_id');
    });
});

describe('File System Tests - DeviceFileHandler', () => {

    it('Should read a static file succesfuly', async () => {
        const deviceFileHandler: DeviceFileHandler = new DeviceFileHandler('Tests/Resources/read_only_devices.json');
        let devices = await deviceFileHandler.readDevices();
        if (devices) {
            expect(devices.length).to.be.equal(2);
        } else {
            expect(devices).to.not.be.undefined;
        }
    });

    it('Should have the expected count', async () => {
        const deviceFileHandler: DeviceFileHandler = new DeviceFileHandler('Tests/Resources/read_only_devices.json');
        let devices = await deviceFileHandler.readDevices();

        if (devices) {
            expect(devices[0].deleted).to.be.false;
            expect(devices[1].deleted).to.be.true;
        } else {
            expect(devices).to.not.be.undefined;
        }
    });

    it('Should write the file succesfuly', async () => {
        const deviceFileHandler: DeviceFileHandler = new DeviceFileHandler('Tests/Resources/devices_write.json');
        let result = await deviceFileHandler.writeDevices([{
            id: 'id',
            crane_id: 'crane_id',
            s_n: 's_n',
            model: 'model',
            description: 'description',
            created: 'created',
            updated: 'updated',
            deleted: true
        }]);

        expect(result).to.be.true;
    });

    it('Should read and validate the written object succesfuly', async () => {
        const deviceFileHandler: DeviceFileHandler = new DeviceFileHandler('Tests/Resources/devices_write.json');
        let devices = await deviceFileHandler.readDevices();
        if (devices) {
            expect(devices[0].id).to.be.equal('id');
            expect(devices[0].crane_id).to.be.equal('crane_id');
            expect(devices[0].s_n).to.be.equal('s_n');
            expect(devices[0].model).to.be.equal('model');
            expect(devices[0].description).to.be.equal('description');
            expect(devices[0].created).to.be.equal('created');
            expect(devices[0].updated).to.be.equal('updated');
            expect(devices[0].deleted).to.be.true;
        } else {
            expect(devices).to.not.be.undefined;
        }
    });

});