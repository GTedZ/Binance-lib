const { request, AxiosError, AxiosResponse } = require('axios');

const JSON_Bigint = require('json-bigint')({ storeAsString: true });

const crypto = require('crypto');

const Options = require('./Options');

const RequestResponse = require('./RequestResponse');

const Error = require('./Error');
const Info = require('./Info');

const SUCCESS = true, ERROR = false;

class Requests {
    /**
     * @type {Options} 
     */
    options;

    /**
     * @type {Info}
     */
    info;

    /**
     * @param {Options} Options 
     * @param {Info} Info
     */
    constructor(Options, Info) {
        this.options = Options;
        this.info = Info;
    }

    /**
     * @param {string} baseURL 
     * @param {string} path 
     * @param {Object.<string, any>|undefined} params 
     * @param {Function} pre_adapter_cb
     */
    async unsigned_request(method, baseURL, path, params = {}, pre_adapter_cb = undefined) {
        if (typeof params !== 'object') throw new Error(`'params' must be of type 'object', instead received '${typeof params}': '${params}'`);

        const paramString = this.createParamString(params);

        return this.request(method, baseURL, path, paramString, undefined, undefined, pre_adapter_cb)
    }

    /**
     * @param {string} baseURL 
     * @param {string} path 
     * @param {Object.<string, any>|undefined} params 
     * @param {Function} pre_adapter_cb
     */
    async userData_request(method, baseURL, path, params = {}, pre_adapter_cb = undefined) {
        if (typeof params !== 'object') throw new Error(`'params' must be of type 'object', instead received '${typeof params}': '${params}'`);
        if (this.options.APIKEY === null) return new RequestResponse(ERROR, null, new Error('APIKEY', 'REQUIRED'), 'LIBRARY');

        const paramString = this.createParamString(params);

        return this.request(method, baseURL, path, paramString, { "X-MBX-APIKEY": this.options.APIKEY }, undefined, pre_adapter_cb);
    }

    /**
     * @param {string} baseURL 
     * @param {string} path 
     * @param {Object.<string, any>|undefined} params 
     * @param {Function} pre_adapter_cb
     */
    async signed_request(method, baseURL, path, params = {}, pre_adapter_cb = undefined) {
        if (typeof params !== 'object') throw new Error(`'params' must be of type 'object', instead received '${typeof params}': '${params}'`);
        if (this.options.APIKEY === null) return new RequestResponse(ERROR, null, new Error('APIKEY', 'REQUIRED'), 'LIBRARY');
        if (this.options.APISECRET === null) return new RequestResponse(ERROR, null, new Error('APISECRET', 'REQUIRED'), 'LIBRARY');

        if (this.options.recvWindow !== 5000) params.recvWindow = this.options.recvWindow;
        params.timestamp = Math.floor(Date.now() + (this.options.extraTimestampOffset + this.info.timestamp_offset));
        let paramString = this.createParamString(params);
        const signature = crypto.createHmac('sha256', this.options.APISECRET).update(paramString).digest('hex');
        paramString += `&signature=${signature}`;

        return this.request(method, baseURL, path, paramString, { "X-MBX-APIKEY": this.options.APIKEY }, undefined, pre_adapter_cb);
    }




    createParamString(q) {
        return Object.keys(q).sort()
            .reduce((a, k) => {
                if (Array.isArray(q[k])) q[k] = JSON.stringify(q[k]);
                if (q[k] !== undefined) {
                    a.push(k + "=" + encodeURIComponent(q[k]));
                }
                return a;
            }, [])
            .join("&");
        ;
    }

    /**
     * @param {'get'|'post'|'delete'|'put'} method
     * @param {string} baseURL 
     * @param {string} path 
     * @param {string} paramString 
     * @param {Object.<string, string>|undefined} headers 
     * @param {Function|undefined} pre_adapter_cb 
     * @returns { {isSuccess:Boolean, successData:AxiosResponse|null, errorData:AxiosError|null, errorSource:"LOCAL"|"EXTERNAL"|"AXIOS"|null} }
     */
    async request(method, baseURL, path, paramString = '', headers = {}, data = '', pre_adapter_cb = undefined) {

        if (this.options.showQueries) console.log({ method, baseURL, path, paramString, headers, data })

        try {
            /**
             * @type {AxiosResponse}
             */
            let response = await request(
                {
                    method: method.toLowerCase(),
                    baseURL,
                    url: path + `${paramString ? `?${paramString}` : ''}`,
                    data,
                    headers
                }
            );

            if (typeof pre_adapter_cb === 'function') {
                response.data = pre_adapter_cb(response.data);
                if (typeof response.data === 'undefined') throw new Error(`'pre_adapter_cb' must alter the data and return it. Instead it returned '${typeof response}': '${response}'`)
            }

            if (this.options.fetchFloats === true) response.data = parseAllPropertiesToFloat(response.data);

            return new RequestResponse(SUCCESS, response, null, null);
        } catch (err) {
            return handle_HTTP_Error(err);
        }

        /**
         * @param {AxiosError} err 
         * @returns { {isSuccess:false, successData:null, errorData:AxiosError, errorSource:"EXTERNAL"|"LOCAL"|"AXIOS"} }
         */
        function handle_HTTP_Error(err) {
            let errorSource;
            let errorData = {};

            if (err.response) {             // Binance Errors
                // const { data, status, headers } = err.response;
                errorSource = "EXTERNAL"
                errorData = err.response.data;
            } else if (err.request) {       // Local Errors
                // const { request } = err;
                errorSource = "LOCAL"
                errorData.code = -10;
                errorData.msg = `Response timeout or disconnection`;
            } else {                        // Axios Error
                // const { message } = err;
                errorSource = "AXIOS"
                errorData.code = -20;
                errorData.msg = `Request Error`;
            }

            return new RequestResponse(ERROR, null, errorData, errorSource);
        }
    }

}

function parseAllPropertiesToFloat(obj) {
    if (obj === null) return obj;
    if (Array.isArray(obj)) obj.map(item => parseAllPropertiesToFloat(item))
    else if (typeof obj === 'object') for (let key of Object.keys(obj)) obj[key] = parseAllPropertiesToFloat(obj[key]);
    else obj = getNumberOrString(obj);
    return obj;
}

function getNumberOrString(item) {
    let i = parseFloat(item);
    if (i == i) {
        try {
            return JSON_Bigint.parse(item);
        } catch (err) {
            return item;
        }
    } else return item;
}

module.exports = Requests;