const BankTitle = require('../src/class/bankTitle');

const { expect } = require('chai');

const validBankTitleCode = '00190500954014481606906809350314337370000000100';
const invalidBankTitleCode = '00190500954014123456786809350314337370000000100';

describe('Bank Title', () => {
    describe('isValid', () => {
        it('User send a valid barcode', () => {
            const result = BankTitle.isValid(validBankTitleCode);
            expect(result).to.be.true;
        });
        it('User send a invalid barcode', () => {
            const result = BankTitle.isValid(invalidBankTitleCode);
            expect(result).to.be.false;
        });
    });
    describe('bankTitleData', () => {
        it('Send a barcode', () => {
            const result = BankTitle.extractData(validBankTitleCode);
            expect(result).to.eql({
                amount: '1.00',
                expirationDate: '2007-12-31'
            });
        });
    });
});