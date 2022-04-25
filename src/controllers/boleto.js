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
        let data = {};
        let response = '';
        let status = '';

        const findBadRequest = this.validateBoleto(id);
        if (findBadRequest) {
            status = STATUS_CODE_BAD_REQUEST;
            response = findBadRequest || 'Solicitação inválida, verifique os dados enviados';
        } else {
            if (this.bankTitle.isValid(id)) {
                status = STATUS_CODE_OK;
                data = this.bankTitle.extractData(id);
            } else if (this.dealershipTitle.isValid(id)) {
                status = STATUS_CODE_OK;
                data = this.dealershipTitle.extractData(id);
            } else {
                status = STATUS_CODE_BAD_REQUEST;
            }
        }
        data.barCode = id;

        if (status === STATUS_CODE_OK) {
            res.status(status).json(data);
        } else {
            res.send(status, response);
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
        if ((barCode.length != 47) && (barCode.length != 44)) {
            return 'Código de barras com tamanho inválido!';
        }
    }
};

module.exports = Boleto;