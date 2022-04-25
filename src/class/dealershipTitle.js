class DealershipTitle {
    /**
     * validate dv number, to validate barcode
     * @function isValid
     * @param {string} barCode 
     */
    isValid(barCode) {
        const barCodeWithoutDv = this.removeDv(barCode);
        const dv = barCode[3];
        const calculatedDv = this.findDv(barCodeWithoutDv);
        
        return calculatedDv === parseInt(dv);
    }

    /**
     * @function removeDv
     * @param {string} barCode 
     * @returns {Array}
     */
    removeDv(barCode) {
        const start = barCode.substring(0, 3); 
        const end = barCode.substring(4); 
        return `${start}${end}`;
    }

    /**
     * finde the dv from barCode
     * @function findDv
     * @param {string} barCode 
     * @returns {Array}
     */
    findDv(barCode) {
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
        return {
            amount: 'XX.XX',
            expirationDate: 'XXXX-XX-XX',
        };
    }
};

module.exports = new DealershipTitle();