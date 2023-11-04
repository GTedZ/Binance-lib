const Error = require("../essentials/Error");
const Info = require("../essentials/Info");
const Options = require("../essentials/Options");
const { WS_Connection } = require("../essentials/WS");

const { exchangeInfo, exchangeInfo_mapped,
    ticker_24h, miniTicker_24h, bookTicker, kline_interval, orderSide, orderType, timeInForce, newOrderRespType, selfTradePreventionMode, cancelRestrictions,
    Account, Trade, AggTrade, Candlestick, Order, Account_mapped } = require('../types/Spot');

class Websocket_API {

    baseURL = 'wss://ws-api.binance.com:443/ws-api/v3';

    /**
     * @type {Options}
     */
    options;

    /**
     * @type {Info}
     */
    info;

    /**
     * @type {WS_Connection}
     */
    socket = null;

    /**
     * @type { {id:number, status:number, result:any|undefined, error:any|undefined, rateLimits:Array[]} }
     */
    last_full_response;

    rateLimits = [];

    constructor(options, info) {
        this.options = options;
        this.info = info;
    }

    async connect() {
        return new Promise(
            (res, rej) => {
                this.socket = new WS_Connection(this.baseURL);

                this.socket.Websocket.socket.once('open', res);

                this.socket.Websocket.socket.once('close', rej);
                this.socket.Websocket.socket.once('error', rej);
            }
        )
    }

    ping() {
        return this.request('ping');
    }

    serverTime() {
        return this.request('time');
    }

    /**
    * - Current exchange trading rules and symbol information
    * - Weight(IP): `10`
    * - If the value provided to `symbol` or `symbols` do not exist, the endpoint will throw an error saying the symbol is invalid.
    * - All parameters are optional.
    * - `permissions` can support single or multiple values (e.g. `SPOT` , `["MARGIN","LEVERAGED"]` )
    * - If `permissions` parameter not provided, the default values will be `["SPOT","MARGIN","LEVERAGED"]` . If one wants to view all symbols on `GET /api/v`3`/exchangeInfo` , then one has to search with all permissions explicitly specified (i.e. `permissions=["SPOT","MARGIN","LEVERAGED","TRD_GRP_`002`","TRD_GRP_`003`","TRD_GRP_`004`","TRD_GRP_`005`","TRD_GRP_`006`","TRD_GRP_`007`","TRD_GRP_`008`","TRD_GRP_`009`","TRD_GRP_`010`","TRD_GRP_`011`","TRD_GRP_`012`","TRD_GRP_`013`"]` )
    * - If one wants to view all symbols on `GET /api/v`3`/exchangeInfo` , then one has to search with all permissions explicitly specified (i.e. `permissions=["SPOT","MARGIN","LEVERAGED","TRD_GRP_`002`","TRD_GRP_`003`","TRD_GRP_`004`","TRD_GRP_`005`","TRD_GRP_`006`","TRD_GRP_`007`","TRD_GRP_`008`","TRD_GRP_`009`","TRD_GRP_`010`","TRD_GRP_`011`","TRD_GRP_`012`","TRD_GRP_`013`"]` )
    * 
    * @param {string | string[] | undefined} symbol_or_symbols
    * @param {string[] | undefined} permissions
    * @returns { Promise < exchangeInfo > }
    */
    async exchangeInfo(symbol_or_symbols, permissions) {

        let symbols;
        if (typeof symbol_or_symbols === 'undefined');
        else if (typeof symbol_or_symbols === 'string') symbols = [symbol_or_symbols];
        else if (Array.isArray(symbol_or_symbols)) symbols = symbol_or_symbols;
        else return new Error('symbol_or_symbols', 'INVALID_VALUE');

        if (typeof permissions === 'undefined');
        else if (typeof permissions === 'string') permissions = [permissions];
        else if (Array.isArray(permissions));
        else return new Error('permission', 'INVALID_VALUE');

        const resp = await this.request('exchangeInfo', { symbols, permissions });
        if (resp.error) return resp;

        return resp;
    }

    /**
     * - Current exchange trading rules and symbol information
     * - Weight(IP): `10`
     * - If the value provided to `symbol` or `symbols` do not exist, the endpoint will throw an error saying the symbol is invalid.
     * - All parameters are optional.
     * - `permissions` can support single or multiple values (e.g. `SPOT` , `["MARGIN","LEVERAGED"]` )
     * - If `permissions` parameter not provided, the default values will be `["SPOT","MARGIN","LEVERAGED"]` . If one wants to view all symbols on `GET /api/v`3`/exchangeInfo` , then one has to search with all permissions explicitly specified (i.e. `permissions=["SPOT","MARGIN","LEVERAGED","TRD_GRP_`002`","TRD_GRP_`003`","TRD_GRP_`004`","TRD_GRP_`005`","TRD_GRP_`006`","TRD_GRP_`007`","TRD_GRP_`008`","TRD_GRP_`009`","TRD_GRP_`010`","TRD_GRP_`011`","TRD_GRP_`012`","TRD_GRP_`013`"]` )
     * - If one wants to view all symbols on `GET /api/v`3`/exchangeInfo` , then one has to search with all permissions explicitly specified (i.e. `permissions=["SPOT","MARGIN","LEVERAGED","TRD_GRP_`002`","TRD_GRP_`003`","TRD_GRP_`004`","TRD_GRP_`005`","TRD_GRP_`006`","TRD_GRP_`007`","TRD_GRP_`008`","TRD_GRP_`009`","TRD_GRP_`010`","TRD_GRP_`011`","TRD_GRP_`012`","TRD_GRP_`013`"]` )
     * 
     * @param {string | string[] | undefined} symbol_or_symbols
     * @param {string[] | undefined} permissions
     * @returns { Promise < exchangeInfo_mapped > }
    */
    async exchangeInfo_mapped(symbol_or_symbols, permissions) {

        const resp = await this.exchangeInfo(symbol_or_symbols, permissions);
        if (resp.error) return resp;

        return new exchangeInfo_mapped(resp);
    }

    /**
     * - Kline/candlestick bars for a `symbol`. Klines are uniquely identified by their open time.
     * - Weight(IP): `2`
     * - Data Source: Database
     * - If `startTime` and `endTime` are not sent, the most recent klines are returned.
     * @param {string} symbol
     * @param {kline_interval} interval
     * @param {number | undefined} limit  - Default `500`; max `1000`.
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < Candlestick[] > }
    */
    async candlesticks(symbol, interval, limit, startTime, endTime) {

        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof interval === 'undefined') return new Error('interval', 'REQUIRED');

        const resp = await this.request('klines', { symbol, interval, limit, startTime, endTime })
        if (resp.error) return resp;

        return resp.map(candlestick => new Candlestick(candlestick));
    }

    ////////////////////////////////////

    /**
     * @param {string} method 
     * @param {object | undefined} params 
     * @param {'NONE' | 'TRADE' | 'USER_DATA'} type
     */
    async request(method, params = undefined, type = 'NONE') {

        if (typeof method === 'undefined') return new Error('method', 'REQUIRED');
        if (typeof method !== 'string') return new Error('method', 'WRONG_TYPE', undefined, 'string');
        if (typeof params !== 'undefined' && typeof params !== 'object') return new Error('params', 'WRONG_TYPE', undefined, 'object');

        if (type === 'TRADE' || type === 'USER_DATA') {
            if (typeof params !== 'object') params = {};
            params.timestamp = Math.floor(Date.now() + (this.options.extraTimestampOffset + this.info.timestamp_offset));
            params.signature = crypto.createHmac('sha256', this.options.APISECRET).update(createParamString(params)).digest('hex');
        }

        const response = await this.socket.sendPrivateMessage(
            {
                method
                ,
                params
            }
        );

        this.last_full_response = response;

        this.rateLimits = response.rateLimits;

        if (response.result) return response.result;
        else return response.error;
    }

}

function createParamString(q) {
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

module.exports = Websocket_API;