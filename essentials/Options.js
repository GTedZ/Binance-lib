class Options {

    /**
     * @type {string|null}
     */
    APIKEY = null;

    /**
     * @type {string|null}
     */
    APISECRET = null;



    MAX_RECVWINDOW = 60_000;

    /**
     * @type {Boolean}
     */
    fetchFloats = false;

    /**
     * @type {Boolean}
     */
    useServerTime = false;

    /**
     * @type {Boolean}
     */
    showQueries = false;

    /**
     * @type {Boolean}
     */
    showWSQueries = false;

    /**
     * @type {Number}
     */
    recvWindow = 5000;

    /**
     * @type {Number}
     */
    extraTimestampOffset = 0;

    /**
     * @param { {fetchFloats?:Boolean, useServerTime?:Boolean, showQueries?:Boolean, showWSQueries?:Boolean, recvWindow?:Boolean, extraTimestampOffset?:Number} } opts
     */
    handle_newOptions(opts) {
        if (opts.fetchFloats) this.set_fetchFloats(opts.fetchFloats);
        if (opts.useServerTime) this.set_useServerTime(opts.useServerTime);
        if (opts.showQueries) this.set_showQueries(opts.showQueries);
        if (opts.showWSQueries) this.set_showWSQueries(opts.showWSQueries);
        if (opts.recvWindow) this.set_recvWindow(opts.recvWindow);
        if (opts.extraTimestampOffset) this.set_extraTimestampOffset(opts.extraTimestampOffset);
    }

    /**
     * @param {Boolean} value 
     */
    set_fetchFloats(value) {
        if (typeof value === 'boolean') this.fetchFloats = value;
        else throw new Error(`'value' must be of type 'Boolean', instead received: '${typeof value}': '${value}'`);
    }

    /**
     * @param {Boolean} value 
     */
    set_useServerTime(value) {
        if (typeof value === 'boolean') this.useServerTime = value;
        else throw new Error(`'value' must be of type 'Boolean', instead received: '${typeof value}': '${value}'`);
    }

    /**
     * @param {Boolean} value 
     */
    set_showQueries(value) {
        if (typeof value === 'boolean') this.showQueries = value;
        else throw new Error(`'value' must be of type 'Boolean', instead received: '${typeof value}': '${value}'`);
    }
    /**
     * @param {Boolean} value 
     */
    set_showWSQueries(value) {
        if (typeof value === 'boolean') this.showWSQueries = value;
        else throw new Error(`'value' must be of type 'Boolean', instead received: '${typeof value}': '${value}'`);
    }





    /**
     * @param {Number} value 
     */
    set_recvWindow(value) {
        if (typeof value === 'number') this.recvWindow = (value > this.MAX_RECVWINDOW) ? this.MAX_RECVWINDOW : value;
        else throw new Error(`'value' must be of type 'number', instead received: '${typeof value}': '${value}'`);
    }

    /**
     * @param {Number} value 
     */
    set_extraTimestampOffset(value) {
        if (typeof value === 'number') this.extraTimestampOffset = value;
        else throw new Error(`'value' must be of type 'number', instead received: '${typeof value}': '${value}'`);
    }



    /**
     * @param {string|null} APIKEY 
     */
    set_APIKEY(APIKEY) {
        if (typeof APIKEY === 'string') this.APIKEY = APIKEY;
        else if (APIKEY === null) this.APIKEY = null;
        else throw new Error(`'APIKEY' must be of either type 'String' or of value 'null', instead received '${typeof APIKEY}': '${APIKEY}'`);
    }

    /**
     * @param {string|null} APISECRET 
     */
    set_APISECRET(APISECRET) {
        if (typeof APISECRET === 'string') this.APISECRET = APISECRET;
        else if (APISECRET === null) this.APISECRET = null;
        else throw new Error(`'APISECRET' must be of either type 'String' or of value 'null', instead received '${typeof APISECRET}': '${APISECRET}'`);
    }

}

module.exports = Options;