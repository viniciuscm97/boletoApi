class BankTitle {
    /**
     * find the fields and validate dv numbers
     * @function isValid
     * @param {string} barCode 
     */
    isValid(barCode) {
        const fields = this.getFieldsWithDV(barCode)

        const validDvNumbers = fields.every(e => this.validateDv(e));
        
        return validDvNumbers;
    }

    /**
     * @function getFieldsWithDV
     * @param {string} barCode 
     * @returns {Array}
     */
    getFieldsWithDV(barCode) {
        return [
            barCode.substring(0, 10),
            barCode.substring(10, 21),
            barCode.substring(21, 32)
        ];
    }

    /**
     * from the field revert and remove dv, find the total from this array
     * if the product from multiplication has 2 integer numbers, sum theses
     * @function validateDv
     * @param {string} field 
     * @returns {Array}
     */
    validateDv(field) {
        const fieldArray = [...field];
        const dv = fieldArray.reverse().shift();

        const total = fieldArray.reduce((total, multiplying, i) => {
            const multiplier = i % 2 === 0 ? 2 : 1;
            let produto = multiplier * multiplying;

            if (produto.toString().length > 1) {
                produto = this.sumNumbers(produto);
            }

            return total += produto;
        }, 0);
        const rest = (total % 10);
        const nextTen = this.findNextTen(rest);
        return dv == (nextTen - rest);
    }
    
    /**
     * sum numbers of a integer
     * @function sumNumbers
     * @param {string} integer 
     * @returns {Array}
     */
    sumNumbers(integer) {
        const [n1, n2] = integer.toString();
        return (+n1) + (+n2);
    }

    /**
     * find next ten
     * @function findNextTen
     * @param {string} integer 
     * @returns {string}
     */
    findNextTen(integer) {
        let nextTen = integer;

        do {
            ++nextTen;
        } while (nextTen % 10 != 0);

        return nextTen;
    }

    /**
     * try extract amount and expiration data from barcode
     * @function extractData
     * @param {string} barCode 
     * @returns {string}
     */
    extractData(barCode) {
        const amount = this.getAmount(barCode.substring(37));
        const expirationDate = this.getExpirationDate(barCode.substring(33,37));
        return {
            amount,
            expirationDate
        };
    }

    /**
     * find amount in barCode
     * @function getAmount
     * @param {string} amountCode 
     * @returns {string}
     */
    getAmount(amountCode) {
        const cents = amountCode.substring(8);
        const integers = parseInt(amountCode.slice(0,-2));
        return `${integers}.${cents}` || 'XX.XX';
    }    

    /**
     * find amount in barCode
     * @function getExpirationDate
     * @param {string} dueDateFactor 
     * @returns {string}
     */
    getExpirationDate(dueDateFactor) {
        const baseData = new Date(1997,9,7);
        const expirationDate = new Date(baseData.getTime());
        expirationDate.setDate(baseData.getDate() + parseInt(dueDateFactor));
        const formatedDate = expirationDate.toLocaleDateString('en-CA')
        return formatedDate || 'XXXX-XX-XX';
    }
};

module.exports = new BankTitle();