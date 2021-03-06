const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');
const mocks = require('node-mocks-http');

chai.should();
chai.use(chaiHttp);

const Boleto = require('../src/controllers/boleto');
const BankTitle = require('../src/class/bankTitle');
const DealershipTitle = require('../src/class/dealershipTitle');
// const req = require('express/lib/request');
// const res = require('express/lib/response');
const boleto = new Boleto(BankTitle, DealershipTitle);

const validResponde = {
	amount: "1.00",
	expirationDate: "2007-12-31",
	barCode: "00190500954014481606906809350314337370000000100"
};
const barCodeWithChar = '8321312371293173891379278ab';
const barCodeWithWrongLenght = '00190500954014123456786809350314337370000000100123123';

const validBankTitleCode = '00190500954014481606906809350314337370000000100';
const invalidBankTitleCode = '00190500954014123456786809350314337370000099100';

const validDealerShipTitleCode = '836500000002825300863255834233587015100110136924';
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
                            res.body.should.have.property('amount').eql('82.53');
                            res.body.should.have.property('expirationDate').eql('Not Found');
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

        describe('Function', () => {
            let req = {};
            let res = {};
            beforeEach(() => {
                req = mocks.createRequest();
                res = mocks.createResponse();
            });
            describe('Happy path', () => {
                it('User send a valid bank title barcode', async () => {
                    req.params.id = validBankTitleCode;

                    await boleto.consultLines(req,res);
                    expect(res.statusCode).to.be.eq(200);
                });

                it('User send a valid dealership barcode', async () => {
                    req.params.id = validDealerShipTitleCode;

                    await boleto.consultLines(req,res);
                    expect(res.statusCode).to.be.eq(200);
                });
            });

            describe('sad path', () => {

                it('User send a barcode with a char', async () => {
                    req.params.id = barCodeWithChar;

                    await boleto.consultLines(req,res);
                    expect(res.statusCode).to.be.eq(400);
                });
                it('User send a barcode with a wrong lenght', async () => {
                    req.params.id = barCodeWithWrongLenght;

                    await boleto.consultLines(req,res);
                    expect(res.statusCode).to.be.eq(400);
                });

                it('User send a banktitle barcode but he is invalid', async () => {
                    req.params.id = invalidBankTitleCode;

                    await boleto.consultLines(req,res);
                    expect(res.statusCode).to.be.eq(400);
                });
            });
        });
    });

    describe('validateBoleto', () => {
        const barCode47Lenght = '00190500954014481606906809350314337370000000100';
        const barCode48Lenght = '001905009540144816069068093503143373700000001000';

        describe('Happy path', () => {
            it('User send a valid barcode with 47 lenght', () => {
                const result = boleto.validateBoleto(barCode47Lenght);
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
                expect(result).to.be.eq('Caracteres n??o s??o permitidos no campo de c??digo de barras!');
            });
            it('User send a barcode with a wrong lenght', () => {
                const result = boleto.validateBoleto(barCodeWithWrongLenght);
                expect(result).to.be.eq('C??digo de barras com tamanho inv??lido!');
            });
        });
    });
});