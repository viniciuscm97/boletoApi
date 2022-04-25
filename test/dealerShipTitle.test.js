const DealerShipTitle = require('../src/class/dealershipTitle');

const { expect } = require('chai');

const validDealerShipTitleCode = '82210000215048200974123220154098290108605940';
const invalidDealerShipTitleCode = '82210000215048200974123999999098290108605940';

describe('Bank Title', () => {
    describe('isValid', () => {
        it('User send a valid barcode', () => {
            const result = DealerShipTitle.isValid(validDealerShipTitleCode);
            expect(result).to.be.true;
        });
        it('User send a invalid barcode', () => {
            const result = DealerShipTitle.isValid(invalidDealerShipTitleCode);
            expect(result).to.be.false;
        });
    });

    describe('Data', () => {
        it('Send a barcode', () => {
            const result = DealerShipTitle.extractData();
            expect(result).to.eql({
                amount: 'XX.XX',
                expirationDate: 'XXXX-XX-XX'
            });
        });
    });
});