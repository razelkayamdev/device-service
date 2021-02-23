import { expect } from 'chai';
import { CranesWorker } from '../src/Cranes/CranesWorker';

describe('Cranes Worker Tests - Validating crane id', () => {
    it('Should not find the crane id', async () => {
        const cranesWorker = new CranesWorker('Tests/Resources/cranes.json');
        let result = await cranesWorker.isCraneIdExists('God all mighty');
        expect(result).to.be.false;
        result = await cranesWorker.isCraneIdExists('another_id');
    });

    it('Should find the crane id', async () => {
        const cranesWorker = new CranesWorker('Tests/Resources/cranes.json');
        let result = await cranesWorker.isCraneIdExists('another_id');
        expect(result).to.be.true;
    });
});