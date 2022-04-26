class DealershipTitle {

    constructor() {
        this.validBarCode;
    }
    /**
     * validate dv number, to validate barcode
     * @function isValid
     * @param {string} fullBarCode 
     */
    isValid(fullBarCode) {
        const barCode = this.removeFieldsDV(fullBarCode);
        this.validBarCode = barCode;
        const barCodeWithoutDv = this.removeGeneralDv(barCode);
        const dv = barCode[3];
        const calculatedDv = this.findGeneralDv(barCodeWithoutDv);
        
        return calculatedDv === parseInt(dv);
    }

    /**
     * @function removeGeneralDv
     * @param {string} barCode 
     * @returns {Array}
     */
    removeGeneralDv(barCode) {
        const start = barCode.substring(0, 3); 
        const end = barCode.substring(4); 
        return `${start}${end}`;
    }

    /**
     * @function removeGeneralDv
     * @param {string} fullBarCode 
     * @returns {Array}
     */
    removeFieldsDV(fullBarCode) {
        const fields = [];
        fields.push([
                fullBarCode.slice(0,11),
                fullBarCode.slice(12,23),
                fullBarCode.slice(24,35),
                fullBarCode.slice(36,47),
            ]);
        return fields.join("").replace(/\,/g,'');
    }

    /**
     * finde the dv from barCode
     * @function findGeneralDv
     * @param {string} barCode 
     * @returns {Array}
     */
    findGeneralDv(barCode) {
        const barCodeArray = [...barCode];

        const total = barCodeArray.reduce((total, multiplying, i) => {
            const multiplier = i % 2 === 0 ? 2 : 1;
            let produto = multiplier * multiplying;

            if (produto.toString().length > 1) {
                produto = this.sumNumbers(produto);
            }

            return total += produto;
        }, 0);
        const rest = (total % 10);
        return (10 - rest);
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
     * @function extractData
     * @returns {string}
     */
    extractData() {
        const amount = this.getAmount(this.validBarCode.slice(4,15));
        const expirationDate = this.getExpirationDate(this.validBarCode.slice(22,30));
        return {
            amount,
            expirationDate,
        };
    }

    /**
     * find amount in barCode
     * @function getAmount
     * @param {string} amountCode 
     * @returns {string}
     */
    getAmount(amountCode) {
        const cents = amountCode.slice(-2);
        const integers = parseInt(amountCode.slice(0,-2));
        return `${integers}.${cents}`;
    }    

    /**
     * find amount in barCode
     * @function getExpirationDate
     * @param {string} dueDateFactor 
     * @returns {string}
     */
    getExpirationDate(dueDateFactor) {
        const [day, month, year] = [
            dueDateFactor.slice(-2),
            dueDateFactor.slice(4,6),
            dueDateFactor.slice(0,4)
        ];

        const createdDate = new Date(year, (month - 1), day);
        return createdDate.getDate() === parseInt(day) &&
        (createdDate.getMonth() + 1) === parseInt(month) &&
        createdDate.getFullYear() === parseInt(year) ? 
        createdDate.toLocaleDateString('en-CA') :
        'Not Found';
    }
};

module.exports = new DealershipTitle();