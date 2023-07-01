const { AxiosError, AxiosResponse } = require('axios');
const Error = require('./Error');

class RequestResponse {

    /**
     * @type {boolean}
     */
    isSuccess;

    /**
     * @type {AxiosResponse}
     */
    successData;

    /**
     * @type {Error}
     */
    errorData;

    /**
     * @type {"EXTERNAL"|"LOCAL"|"AXIOS"|"LIBRARY"}
     */
    errorSource;

    /**
     * @param {boolean} isSuccess 
     * @param {AxiosError} successData 
     * @param {Error} errorData 
     * @param {"EXTERNAL"|"LOCAL"|"AXIOS"|"LIBRARY"} errorSource 
     */
    constructor(isSuccess, successData, errorData, errorSource) {
        this.isSuccess = isSuccess;
        this.successData = successData;
        this.errorData = errorData;
        this.errorSource = errorSource;
    }

}

module.exports = RequestResponse;