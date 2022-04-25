const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

chai.should();
chai.use(chaiHttp);

const Boleto = require('../src/controllers/boleto');
const BankTitle = require('../src/class/bankTitle');
const DealershipTitle = require('../src/class/dealershipTitle');
const boleto = new Boleto(BankTitle, DealershipTitle);

const validResponde = {
	amount: "1.00",
	expirationDate: "2007-12-31",
	barCode: "00190500954014481606906809350314337370000000100"
};
const barCodeWithChar = '8321312371293173891379278ab';
const barCodeWithWrongLenght = '00190500954014123456786809350314337370000000100123123';

const validBankTitleCode = '00190500954014481606906809350314337370000000100';
const invalidBankTitleCode = '00190500954014123456786809350314337370000000100';

const validDealerShipTitleCode = '82210000215048200974123220154098290108605940';
const invalidDealerShipTitleCode = '82210000215048200974123999999098290108605940';

describe('boleto', () => {
    describe('consultLines', () => {
        describe('/GET', () => {
            const BOLETO_BASE_URL = 'http://localhost:8080/boleto/';
            describe('Happy path', () => {
                it('User send a valid bank title barcode', (done) => {
                    chai.request(BOLETO_BASE_URL)
                        .get(validBankTitleCode)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('amount').eql(validResponde.amount);
                            res.body.should.have.property('expirationDate').eql(validResponde.expirationDate);
                            res.body.should.have.property('barCode').eql(validResponde.barCode);
                            return done();
                        })
                });

                it('User send a valid dealership barcode', (done) => {
                    chai.request(BOLETO_BASE_URL)
                        .get(validDealerShipTitleCode)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('amount').eql('XX.XX');
                            res.body.should.have.property('expirationDate').eql('XXXX-XX-XX');
                            res.body.should.have.property('barCode').eql(validDealerShipTitleCode);
                            return done();
                        })
                });
            });
            describe('Sad path', () => {
                it('User send a barcode with a char', (done) => {
                    chai.request(BOLETO_BASE_URL)
                        .get(barCodeWithChar)
                        .end((err, res) => {
                            res.should.have.status(400);
                            return done();
                        })
                });
                it('User send a barcode with a wrong lenght', (done) => {
                    chai.request(BOLETO_BASE_URL)
                        .get(barCodeWithWrongLenght)
                        .end((err, res) => {
                            res.should.have.status(400);
                            return done();
                        })
                });
                it('User send a banktitle barcode but he is invalid', (done) => {
                    chai.request(BOLETO_BASE_URL)
                        .get(invalidBankTitleCode)
                        .end((err, res) => {
                            res.should.have.status(400);
                            return done();
                        })
                });
            });
        });
    });

    describe('validateBoleto', () => {
        const barCode44Lenght = '00190500954014481606906809350314337370000000';
        const barCode48Lenght = '00190500954014481606906809350314337370000000100';

        describe('Happy path', () => {
            it('User send a valid barcode with 44 lenght', () => {
                const result = boleto.validateBoleto(barCode44Lenght);
                expect(result).to.be.undefined;
            });
            it('User send a valid barcode with 48 lenght', () => {
                const result = boleto.validateBoleto(barCode48Lenght);
                expect(result).to.be.undefined;
            });
        });

        describe('Sad path', () => {
            it('User send a barcode with a char', () => {
                const result = boleto.validateBoleto(barCodeWithChar);
                expect(result).to.be.eq('Caracteres não são permitidos no campo de código de barras!');
            });
            it('User send a barcode with a wrong lenght', () => {
                const result = boleto.validateBoleto(barCodeWithWrongLenght);
                expect(result).to.be.eq('Código de barras com tamanho inválido!');
            });
        });
    });
});