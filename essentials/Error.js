class Error {

    /**
     * @type {number}
     */
    code = -1;

    /**
     * @type {string}
     */
    msg = 'Unhandled error';

    /**
     * @param {string} variableName
     * @param {"REQUIRED"|"WRONG_TYPE"|"INVALID_VALUE"} errorType
     * @param {any} value
     * @param {any[]|string} acceptable_type_or_value
     */
    constructor(variableName, errorType = 'REQUIRED', value, acceptable_type_or_value) {
        let string = `'${variableName}'`;

        if (errorType === 'REQUIRED') {
            this.code = -1;
            string += ` is required for this request.`;
        } else if (errorType === 'WRONG_TYPE') {
            this.code = -2;
            string += ` must be of type '${acceptable_type_or_value}', instead received: '${typeof value}': '${value}'`;
        } else if (errorType === 'INVALID_VALUE') {
            this.code = -3;
            string += ` : '${value}' is invalid.`;
            if (typeof acceptable_type_or_value !== 'undefined') string += ` Possible values are: '${acceptable_type_or_value.join("', '")}'`;
        }

        this.msg = string;
    }

}

module.exports = Error;