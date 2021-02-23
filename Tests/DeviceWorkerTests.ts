import { expect } from 'chai';
import { DevicesWorker } from '../src/Devices/DevicesWorker';

describe('Device Worker Functionality Tests', () => {
    it('Should return two devices', async () => {
        const devicesWorker = new DevicesWorker('Tests/Resources/read_only_devices.json');
        const devices = await devicesWorker.getDevices();
        if (devices) {
            expect(devices.length).to.be.equal(2);
        } else {
            expect(devices).to.not.be.undefined;
        }
    });

    it('Should return 1 deleted device', async () => {
        const devicesWorker = new DevicesWorker('Tests/Resources/read_only_devices.json');
        const devices = await devicesWorker.getDevicesByDeletionState(true);
        if (devices) {
            expect(devices.length).to.be.equal(1);
            expect(devices[0].deleted).to.be.true;
        } else {
            expect(devices).to.not.be.undefined;
        }
    });

    it('Should return 1 non deleted device', async () => {
        const devicesWorker = new DevicesWorker('Tests/Resources/read_only_devices.json');
        const devices = await devicesWorker.getDevicesByDeletionState(false);
        if (devices) {
            expect(devices.length).to.be.equal(1);
            expect(devices[0].deleted).to.be.false;
        } else {
            expect(devices).to.not.be.undefined;
        }
    });

    it('Should find a device by its id', async () => {
        const devicesWorker = new DevicesWorker('Tests/Resources/read_only_devices.json');
        const id = 'device01';
        const device = await devicesWorker.getDeviceById(id);
        if (device) {
            expect(device.id).to.be.equal(id);
        } else {
            expect(device).to.not.be.undefined;
        }
    });

    it('Should return undefined for device with non existing id', async () => {
        const devicesWorker = new DevicesWorker('Tests/Resources/read_only_devices.json');
        const id = 'some id that does not exist';
        const device = await devicesWorker.getDeviceById(id);
        expect(device).to.be.undefined;
    });

    it('Should write devices succesfuly', async () => {
        const devicesWorker = new DevicesWorker('Tests/Resources/devices_worker_write.json');
        await devicesWorker.postDevices([{
            id: 'id',
            crane_id: 'crane_id',
            s_n: 's_n',
            model: 'model',
            description: 'description',
            created: 'created',
            updated: 'updated',
            deleted: true
        }]);

        const devices = await devicesWorker.getDevices();
        if (devices) {
            expect(devices.length).to.be.equal(1);
        } else {
            expect(devices).to.not.be.undefined;
        }
    });
});

// public async postDevices(devices: Device[]): Promise<void>