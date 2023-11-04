const Options = require("./essentials/Options");

const Info = require('./essentials/Info');

const Requests = require('./essentials/Requests');

const Constants = require('./essentials/Constants');

const Spot = require('./Spot/RESTful');

const Futures = require('./Futures/RESTful');

require('./Spot/Websockets');       // this is for intellisense
require('./Futures/Websockets');    // this is for intellisense
require('./types/Spot');            // this is for intellisense
require('./types/Futures');         // this is for intellisense
require('./Spot/Websocket_API');

class Binance {

    options = new Options();

    info = new Info();

    requests = new Requests(this.options, this.info);



    spot = new Spot(this.options, this.info, this.requests);

    futures = new Futures(this.options, this.info, this.requests);

    /**
     * @param {string|undefined|null} APIKEY - 
     * - This is provided by Binance and can be copied from `https://www.binance.com/en/my/settings/api-management`
     * - Allows `read-only access` to your account data.
     * @param {string|undefined|null} APISECRET - 
     * - This is provided by Binance only ONCE (upon creation) from `https://www.binance.com/en/my/settings/api-management`
     * - Allows `administrative access` like purchases and permission changes
     * - You are supposed to save it somewhere secure, NEVER SHARE IT WITH ANYONE.
     * @param { {fetchFloats?:Boolean, useServerTime?:Boolean, showQueries?:Boolean, showWSQueries?:Boolean, recvWindow?:number, extraTimestampOffset?:number} } opts -
     * 
     * - `fetchFloats`: handles converting all incoming strings into numbers. Meant to simplify conversions when not in need of string data
     * - `useServerTime`: when true, the library will periodically fetch the Binance server's time and check the offset between the local time and the server time. This offset will be stored in `info.timestamp_offset`
     * - `showQueries`: when true, the library will console.log the HTTP Requests' info, such as `url`, `baseURL`, `path`, `data` and `headers`, IMPORTANT: headers MIGHT include your APIKEY, so use with CAUTION
     * - `showWSQueries`: when true, the library will console.log the WS Requests' info upon connection and disconnection
     * - `recvWindow`: defaults to 5000 (unit: `milliseconds`), this represents how long the HTTP Request can last before reaching the server, if the request took longer than the specified `recvWindow`, the server will reject it and return an error
     * - `extraTimestampOffset`: defaults to 0, this is a local value (unit: `milliseconds`) that gets added to the timestamp of any request, regardless if `useServerTime` is used or not
     */
    constructor(APIKEY, APISECRET, opts) {
        if (typeof APIKEY !== 'undefined' && APIKEY) this.options.set_APIKEY(APIKEY);
        if (typeof APISECRET !== 'undefined' && APISECRET) this.options.set_APISECRET(APISECRET);
        if (typeof opts !== 'undefined') this.options.handle_newOptions(opts);

        if (this.options.useServerTime) {
            this.update_timestamp_offset();
            setInterval(() => this.update_timestamp_offset(), Constants.HOUR);
        }
    }

    /**
     * - Checks the server's time and updates the offset needed to *hopefully* fix any timestamp issues when requesting any `USER_DATA` or `TRADE` requests.
     * - This is an **accurate** version of checking for the offset, taking it total 4 seperate serialized requests taking into account the latency between the client and server.
     * - For **faster** and **quick** results, please use the `.fast_update_timestamp_offset()` request instead, which only uses 1 request instead.
     */
    async update_timestamp_offset() {
        const response = await this.futures.serverTime(true);
        const difference = response.serverTime - Date.now();
        this.info.latency = response.latency;
        this.info.timestamp_offset = Math.floor(difference + (this.info.latency / 3));

        let latencies = [];
        for (let x = 0; x < 3; x++) {
            latencies.push((await this.futures.ping(true)).latency);
            this.info.latency = Math.min(...latencies);
            this.info.timestamp_offset = Math.floor(difference + (this.info.latency / 3));
        }
    }

    async fast_update_timestamp_offset() {
        const response = await this.futures.serverTime(true);
        this.info.timestamp_offset = Math.floor((response.serverTime - Date.now()) + (response.latency / 4));   // 4 is the safer option, since usually the first HTTP request takes MUCH longer than any subsequent requests (I assume DNS or routing related)
    }

}

module.exports = Binance;