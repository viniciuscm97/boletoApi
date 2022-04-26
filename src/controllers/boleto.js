var STATUS_CODE_BAD_REQUEST = 400;
var STATUS_CODE_OK = 200;

class Boleto {
    /**
     * 
     * @param {import('../class/bankTitle')} bankTitle 
     * @param {import('../class/dealershipTitle')} dealershipTitle 
     */
    constructor(bankTitle, dealershipTitle) {
        this.bankTitle = bankTitle;
        this.dealershipTitle = dealershipTitle;
    }

    /**
     * @async
     * @function consultLines
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async consultLines(req, res){
        const { id } = req.params;
        // remove spaces
        const barCode = id.replace(/\s/g,'');
        let data = {};
        let response = '';
        let status = '';

        const findBadRequest = this.validateBoleto(barCode);
        if (findBadRequest) {
            status = STATUS_CODE_BAD_REQUEST;
            response = findBadRequest;
        } else {
            if (this.bankTitle.isValid(barCode)) {
                status = STATUS_CODE_OK;
                data = this.bankTitle.extractData(barCode);
            } else if (this.dealershipTitle.isValid(barCode)) {
                status = STATUS_CODE_OK;
                data = this.dealershipTitle.extractData(barCode);
            } else {
                status = STATUS_CODE_BAD_REQUEST;
                response = 'Não foi possível validar os dados digitados!';

            }
        }
        data.barCode = barCode;

        if (status === STATUS_CODE_OK) {
            res.status(status).json(data);
        } else {
            res.status(status).send(response);
        }
    }    

    /**
     * check if barcode was valid 
     * and try to get a diferent response
     * @function validateBoleto
     * @param {string} barCode 
     * @returns {Array}
     */
    validateBoleto(barCode) {
        if ((/\D/).test(barCode)) {
            return 'Caracteres não são permitidos no campo de código de barras!';
        }
        if ((barCode.length != 47) && (barCode.length != 48)) {
            return 'Código de barras com tamanho inválido!';
        }
    }
};

module.exports = Boleto;