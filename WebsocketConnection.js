const Error = require('./essentials/Error');
const {
    WS_Connection,
    Binance_WS_Connection
} = require('./essentials/WS');

const SECOND = 1000;
const MINUTE = 60 * SECOND;

class Websocket_Connection {

    /**
     * IGNORE
     * @type {Binance_WS_Connection}
     */
    WS_handler;

    /**
     * IGNORE
     * @type {Function}
     */
    callback;

    /**
     * IGNORE
     * @type {Function|null}
     */
    subscription_converter = null;


    constructor(baseURL, path_or_paths, callback, response_converter, subscription_converter) {
        this.WS_handler = new WS_Connection(baseURL, path_or_paths);

        if (typeof callback !== 'function') throw `'callback' must be of type 'Function', instead received '${callback}': '${typeof callback}'`;
        this.callback = callback;

        if (typeof subscription_converter !== 'function') throw `'subscription_converter' must be of type 'Function'`;
        this.subscription_converter = subscription_converter;

        if (typeof response_converter !== 'function') throw `'response_converter' must be of type 'Function'`;

        this.WS_handler.eventEmitter.on(
            'message'
            ,
            (msg) => this.callback(response_converter(msg))
        )
    }

    /**
     * - Immediately terminates the connection FOR GOOD.
     */
    close() {
        this.WS_handler.close();
    }

    /**
     * @returns {Promise <string[]>}
     */
    async list_subscriptions() {
        const response = await this.WS_handler.list_subscriptions();
        if (response.error) return response;

        return response.result;
    }

    /**
     * @returns { {result:null, id:any}|{error?:Error} }
     */
    subscribe(...args) {
        return this.WS_handler.subscribe(
            this.subscription_converter(...args)
        );
    }

    /**
     * @returns { {result:null, id:any}|{error?:Error} }
     */
    batch_subscribe(...subscriptions) {

        return this.WS_handler.subscribe(
            subscriptions.map(item => Array.isArray(item) ? this.subscription_converter(...item) : this.subscription_converter(item))
        )
    }

    /**
     * - It is recommended to use the library's `.subscribe()` or `.batch_subscribe()` functions to subscribe to new websocket connections
     * - But if needed, use this function if you don't want to use the simplified converters of the library
     * @param {...string} paths
     * @returns { {result:null, id:any}|{error?:Error} }
     */
    raw_subscribe(...paths) {
        return this.WS_handler.subscribe(paths);
    }

    /**
     * @returns { {result:null, id:any}|{error?:Error} }
     */
    unsubscribe(...args) {
        return this.WS_handler.unsubscribe(
            this.subscription_converter(...args)
        );
    }

    /**
     * @returns { {result:null, id:any}|{error?:Error} }
     */
    batch_unsubscribe(...subscriptions) {

        return this.WS_handler.unsubscribe(
            subscriptions.map(item => Array.isArray(item) ? this.subscription_converter(...item) : this.subscription_converter(item))
        )
    }

    /**
     * - It is recommended to use the library's `.unsubscribe()` or `.batch_unsubscribe()` functions to subscribe to new websocket connections
     * - But if needed, use this function if you don't want to use the simplified converters of the library
     * @param {...string} paths
     * @returns { {result:null, id:any}|{error?:Error} }
     */
    raw_unsubscribe(...paths) {
        return this.WS_handler.unsubscribe(paths);
    }

}

class Binance_userData_WS_Connection {

    /**
    * IGNORE
    * @type {WS_Connection}
    */
    WS_handler;

    /**
     * - This is the current valid listenKey
     * @type {string}
     */
    listenKey;

    /**
     * IGNORE
     */
    interval_ID;

    constructor(baseURL, listenKey, callback, response_converter, keepAlive_function) {
        this.WS_handler = new WS_Connection(baseURL, listenKey);
        this.listenKey = listenKey;

        if (typeof callback !== 'function') throw `'callback' must be of type 'Function', instead received '${callback}': '${typeof callback}'`;
        this.callback = callback;

        if (typeof response_converter !== 'function') throw `'response_converter' must be of type 'Function'`;
        if (typeof keepAlive_function !== 'function') throw `'keepAlive_function' must be of type 'Function'`;

        this.WS_handler.eventEmitter.on(
            'message'
            ,
            (msg) => this.callback(response_converter(msg))
        );

        this.interval_ID = setInterval(
            () => keepAlive_function().then((resp) => console.log('keeping alive!', { resp }))
            ,
            10 * MINUTE
        )
    }

    /**
     * - Immediately terminates the connection FOR GOOD.
     */
    close() {
        this.WS_handler.close();
        clearInterval(this.interval_ID);
    }

}



module.exports = {
    Websocket_Connection,
    Binance_userData_WS_Connection
};