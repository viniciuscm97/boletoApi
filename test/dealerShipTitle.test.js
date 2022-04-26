const DealerShipTitle = require('../src/class/dealershipTitle');

const { expect } = require('chai');

const validDealerShipTitleCode = '836500000002825300863255834233587015100110136924';
const invalidDealerShipTitleCode = '836500000002825300863255202204267015100110136924';

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
        it('Send a barcode, with a date', () => {
            DealerShipTitle.validBarCode = '83670000000825300863252022042670110011013692'
            const result = DealerShipTitle.extractData();
            expect(result).to.eql({
                amount: '82.53',
                expirationDate: '2022-04-26'
            });
        });
        it('Send a barcode, without a date', () => {
            DealerShipTitle.validBarCode = '83650000000825300863258342335870110011013692'
            const result = DealerShipTitle.extractData();
            expect(result).to.eql({
                amount: '82.53',
                expirationDate: 'Not Found'
            });
        });
    });
});