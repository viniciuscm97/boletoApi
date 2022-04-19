class Boleto {
    /**
     * @param {import('axios')} axios 
     */
    constructor(axios) {
        this.axios = axios;
        this.data = {
            amount: '',
            expirationDate: '',
            barCode: '',
        }
    }

    /**
     * @async
     * @function consultLines
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async consultLines(req, res){

        /**
         * status: 200 para linha válida ou 400 para linha inválida
            amount: O valor do boleto, se existir
            expirationDate: A data de vencimento do boleto, se existir
            barCode: Os 44 dígitos correspondentes ao código de barras desse boleto
         */

        const { id } = req.params;

        if((/\D/).test(id)) {
            this.data.barCode = id;
            res.status(400).json(this.data);
        }

        if (this.isBankTitle(id)) {
            
        }

        this.data.barCode = id;
        res.json(id);
    }

    /**
     * find the fields and validate dv numbers
     * @function isBankTitle
     * @param {string} barCode 
     */
    isBankTitle(barCode) {
        const fields = this.getFieldsWithDV(barCode)

        const validDvNumbers = fields.every(e => this.validatedDv(e));
        
        return validDvNumbers;
    }

    /**
     * @function getFieldsWithDV
     * @param {string} barCode 
     * @returns {Array}
     */
    getFieldsWithDV(barCode) {
        return [
            barCode.substring(0, 9),
            barCode.substring(10, 20),
            barCode.substring(21, 31)
        ];
    }

    /**
     * from the field revert and remove dv, find the total from this array
     * if the product from multiplication has 2 integer numbers, sum theses
     * @function validatedDv
     * @param {string} field 
     * @returns {Array}
     */
    validatedDv(field) {
        const dv = field.reserve().shift();

        const total = field.reduce((total, multiplying, i) => {
            const multiplier = i % 2 === 0 ? 2 : 1;
            let produto = multiplier * multiplying;

            if (produto.toString().length > 1) {
                const [p1, p2] = produto.toString();
                produto = (p1 + p2);
            }

            return total += produto;
        }, 0);

        return dv === (total % 10);
    }
    
};

module.exports = Boleto;