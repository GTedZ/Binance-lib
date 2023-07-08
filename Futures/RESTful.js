const Options = require('../essentials/Options');

const Info = require('../essentials/Info');

const Requests = require('../essentials/Requests');

const Error = require('../essentials/Error');

const Futures_Websockets = require('./Websockets');

const { Futures_exchangeInfo, Futures_exchangeInfo_mapped } = require('../types/Futures');

const { Futures_aggTrade, Futures_candlestick, Futures_orderBook,
    Futures_trade, Futures_indexCandlestick, Futures_markCandlestick, Futures_markPrice,
    Futures_fundingRate,
    Futures_ticker24h,
    Futures_priceTicker,
    Futures_symbolOrderBookTicker,
    Futures_openInterest,
    Futures_Long_Short_Ratio,
    Futures_openInterest_statistics,
    Futures_taker_buySell_ratio,
    Futures_historical_BLVT_NAV_candlestick,
    Futures_compositeIndex_Symbol,
    Futures_multiAssetMode_assetIndex,
    Futures_Order,
    Futures_Balance,
    Futures_Account,
    Futures_PositionInfo,

    Futures_interval,
    Futures_period,
    Futures_OrderType,
    Futures_PositionSide,
    Futures_TimeInForce,
    Futures_OrderSide,
    Futures_newOrderRespType,
    Futures_WorkingType,
    Futures_marginType,
    Futures_incomeType
} = require('../types/Futures')

/**
 * @type {Futures_exchangeInfo_mapped | null}
 */
let exchangeInfo = null;

class Futures {
    /**
     * @type {string}
     */
    baseURL = 'https://fapi.binance.com'

    /**
     * @type {Options}
     */
    options;

    /**
     * @type {Info}
     */
    info;

    /**
     * @type {Requests}
     */
    requests;

    /**
     * @type {Futures_Websockets}
     */
    websockets;

    constructor(options, info, requests) {
        this.options = options;
        this.info = info;
        this.requests = requests;
        this.websockets = new Futures_Websockets(options, info, this);
    }

    CONSTANTS = {
        requestTypes: ['NONE', 'USER_STREAM', 'MARKET_DATA', 'TRADE', 'USER_DATA'],
        open_requestTypes: ['NONE'],
        requestTypes_APIKEY_ONLY: ['USER_STREAM', 'MARKET_DATA'],
        requestTypes_SIGNED: ['TRADE', 'USER_DATA'],

        symbolTypes: ['FUTURE'],
        symbolTypes_mapped: {
            FUTURE: 'FUTURE'
        },

        contractTypes: ['PERPETUAL', 'CURRENT_MONTH', 'NEXT_MONTH', 'CURRENT_QUARTER', 'NEXT_QUARTER', 'PERPETUAL_DELIVERING'],
        contractTypes_mapped: {
            PERPETUAL: 'PERPETUAL',
            CURRENT_MONTH: 'CURRENT_MONTH',
            NEXT_MONTH: 'NEXT_MONTH',
            CURRENT_QUARTER: 'CURRENT_QUARTER',
            NEXT_QUARTER: 'NEXT_QUARTER',
            PERPETUAL_DELIVERING: 'PERPETUAL_DELIVERING'
        },

        contractStatus: ['PENDING_TRADING', 'TRADING', 'PRE_DELIVERING', 'DELIVERING', 'DELIVERED', 'PRE_SETTLE', 'SETTLING', 'CLOSE'],
        contractStatus_mapped: {
            PENDING_TRADING: 'PENDING_TRADING',
            TRADING: 'TRADING',
            PRE_DELIVERING: 'PRE_DELIVERING',
            DELIVERING: 'DELIVERING',
            PRE_SETTLE: 'PRE_SETTLE',
            SETTLING: 'SETTLING',
            CLOSE: 'CLOSE'
        },

        orderStatuses: ['NEW', 'PARTIALLY_FILLED', 'FILLED', 'CANCELED', 'REJECTED', 'EXPIRED'],
        orderStatuses_mapped: {
            NEW: 'NEW',
            PARTIALLY_FILLED: 'PARTIALLY_FILLED',
            FILLED: 'FILLED',
            CANCELED: 'CANCELED',
            REJECTED: 'REJECTED',
            EXPIRED: 'EXPIRED'
        },

        orderTypes: ['LIMIT', 'MARKET', 'STOP', 'STOP_MARKET', 'TAKE_PROFIT', 'TAKE_PROFIT_MARKET', 'TRAILING_STOP_MARKET'],
        orderTypes_mapped: {
            LIMIT: 'LIMIT',
            MARKET: 'MARKET',
            STOP: 'STOP',
            STOP_MARKET: 'STOP_MARKET',
            TAKE_PROFIT: 'TAKE_PROFIT',
            TAKE_PROFIT_MARKET: 'TAKE_PROFIT_MARKET',
            TRAILING_STOP_MARKET: 'TRAILING_STOP_MARKET'
        },

        orderSides: ['BUY', 'SELL'],
        orderSides_mapped: {
            BUY: 'BUY',
            SELL: 'SELL'
        },

        positionSides: ['BOTH', 'LONG', 'SHORT'],
        positionSides_mapped: {
            BOTH: 'BOTH',
            LONG: 'LONG',
            SHORT: 'SHORT'
        },

        timeInForces: ['GTC', 'IOC', 'FOK', 'GTX'],
        timeInForces_mapped: {
            GTC: 'GTC',
            IOC: 'IOC',
            FOK: 'FOK',
            GTX: 'GTX'
        },

        workingTypes: ['MARK_PRICE', 'CONTRACT_PRICE'],
        workingTypes_mapped: {
            MARK_PRICE: 'MARK_PRICE',
            CONTRACT_PRICE: 'CONTRACT_PRICE'
        },

        newOrderResponseTypes: ['ACK', 'RESULT'],
        newOrderResponseTypes_mapped: {
            ACK: 'ACK',
            RESULT: 'RESULT'
        },

        intervals: ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M'],
        intervals_mapped: {
            '1m': '1m',
            '3m': '3m',
            '5m': '5m',
            '15m': '15m',
            '30m': '30m',
            '1h': '1h',
            '2h': '2h',
            '4h': '4h',
            '6h': '6h',
            '8h': '8h',
            '12h': '12h',
            '1d': '1d',
            '3d': '3d',
            '1w': '1w',
            '1M': '1M'
        },

        periods: ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"],
        periods_mapped: {
            "5m": "5m",
            "15m": "15m",
            "30m": "30m",
            "1h": "1h",
            "2h": "2h",
            "4h": "4h",
            "6h": "6h",
            "12h": "12h",
            "1d": "1d"
        },

        rateLimitTypes: ['REQUEST_WEIGHT', 'ORDERS'],
        rateLimitTypes_mapped: {
            REQUEST_WEIGHT: 'REQUEST_WEIGHT',
            ORDERS: 'ORDERS'
        },

        rateLimit_intervals: ['MINUTE', 'SECOND'],
        rateLimit_intervals_mapped: {
            MINUTE: 'MINUTE',
            SECOND: 'SECOND'
        },

        underlyingTypes: ['COIN', 'INDEX'],
        underlyingTypes_mapped: {
            COIN: 'COIN',
            INDEX: 'INDEX'
        },

        underlyingSubTypes: [
            'PoW',
            'Layer-1',
            'Payment',
            'Oracle',
            'Layer-2',
            'Privacy',
            'Infrastructure',
            'NFT',
            'DeFi',
            'DEX',
            'Meme',
            'Index',
            'Storage',
            'AI',
            'Metaverse',
            'BUSD',
            'DEFI',
            'DAO',
            'CEX',
            'Cross Pair'
        ],
        underlyingSubTypes_mapped: {
            'PoW': 'PoW',
            'Layer-1': 'Layer-1',
            'Payment': 'Payment',
            'Oracle': 'Oracle',
            'Layer-2': 'Layer-2',
            'Privacy': 'Privacy',
            'Infrastructure': 'Infrastructure',
            'NFT': 'NFT',
            'DeFi': 'DeFi',
            'DEX': 'DEX',
            'Meme': 'Meme',
            'Index': 'Index',
            'Storage': 'Storage',
            'AI': 'AI',
            'Metaverse': 'Metaverse',
            'BUSD': 'BUSD',
            'DEFI': 'DEFI',
            'DAO': 'DAO',
            'CEX': 'CEX',
            'Cross Pair': 'Cross Pair'
        }
    }

    /**
     * @param {boolean|undefined} reconnect
     * @param {number|undefined} tries
     * @returns { Promise <{latency:number}> }
     * 
     * Test connectivity to the Rest API.
     */
    async ping(reconnect = false, tries = -1) {
        const startTime = performance.now();
        const response = await this.request('GET', '/fapi/v1/ping', undefined, 'NONE');
        if (response.error) {
            if (!reconnect || tries === 0) return response;
            return this.ping(reconnect, --tries);
        } else response.latency = performance.now() - startTime;
        return response;
    }

    /**
     * @param {boolean|undefined} reconnect
     * @param {number|undefined} tries
     * @returns { Promise.<{serverTime:number, latency:number}> }
     * 
     * Test connectivity to the Rest API and get the current server time.
     */
    async serverTime(reconnect = false, tries = -1) {
        const startTime = performance.now();
        const response = await this.request('GET', '/fapi/v1/time', undefined, 'NONE');
        if (response.error) {
            if (!reconnect || tries === 0) return response;
            return this.serverTime(reconnect, --tries);
        } else response.latency = performance.now() - startTime;
        return response;
    }

    /**
     * @param {boolean|undefined} reconnect
     * @param {number|undefined} tries
     * @returns { Promise <Futures_exchangeInfo> }
     * 
     * - Returns the current exchange trading rules and symbol information
     */
    async exchangeInfo(reconnect = false, tries = -1) {

        const response = await this.request('GET', '/fapi/v1/exchangeInfo', undefined, 'NONE');
        if (response.error) {
            if (!reconnect || tries === 0) return response;
            return this.exchangeInfo(reconnect, --tries);
        }

        exchangeInfo = new Futures_exchangeInfo_mapped(response);

        return response;
    }

    /**
     * @param {boolean|undefined} reconnect 
     * @param {number|undefined} tries 
     * @returns { Promise <Futures_exchangeInfo_mapped> }
     * 
     * - Returns the current exchange trading rules and symbol information
     * - ...But mapped and optimized for speed
     * - - `symbols_arr` contains the full array of symbols available in the response data.
     * - - `symbols` are mapped 1:1 by their symbolName, meaning `exchangeInfo_mapped.symbols.BTCUSDT` or `exchangeInfo_mapped.symbols[symbolVariable]` would instantly return BTCUSDT's info
     * - And much more mapped data in the response. 
     * - Everything is documented for IntelliSense.
     * - Some of the other mapped data:
     * - - `symbol`'s `filterTypes` are also mapped 1:1, 
     * - - `underlyingTypes`, `underlyingSubTypes`, `assets` are also mapped.
     * - 
     * @since v3.0.0
     */
    async exchangeInfo_mapped(reconnect = false, tries = -1) {
        const response = await this.exchangeInfo(reconnect, tries);
        if (response.error) return response;

        exchangeInfo = new Futures_exchangeInfo_mapped(response);

        return new Futures_exchangeInfo_mapped(response);
    }

    /**
     * Returns the orderBook for a symbol
     * @param {string} symbol - Represents the `symbol` for which you want the orders.
     * @param {'5'|'10'|'20'|'50'|'100'|'500'|'1000'|number} limit - Defaults to `500`
     * @returns {Promise<Futures_orderBook>} 
     * 
     * - `limit` Represents the number of each of the following: 
     * - - `bigs`
     * - - `asks`
     * 
     * - Possible values for `limit`:
     * - - `5`, `10`, `20`, `50` (costs `2` `weight`)
     * - - `100` (costs `5` `weight`)
     * - - `500` (costs `10` `weight`)
     * - - `1000` (costs `20` `weight`)
     * - 
     * @since v3.0.0
     */
    async orderBook(symbol, limit = undefined) {
        if (typeof symbol === 'undefined') return new Error(`symbol`, 'REQUIRED');
        if (typeof symbol !== 'string') return new Error(`symbol`, 'WRONG_TYPE', symbol, 'String');

        const resp = await this.request('GET', '/fapi/v1/depth', { symbol, limit }, 'NONE');
        if (resp.error) return resp;

        return new Futures_orderBook(resp);
    }

    /**
     * Returns the recent market trades
     * @param {string} symbol - Represents the `symbol` for which you want the orders.
     * @param {number|undefined} limit - Defaults to `500`, max `1000`, `Represents the number of market trades returned
     * @returns { Promise<Futures_trade[]>}
     * - Costs `5` Weight
     *  - Market trades means trades filled in the order book. Only market trades will be returned, which means the insurance fund trades and ADL trades won't be returned.
     * - 
     * @since v3.0.0
     */
    async recentTrades(symbol, limit = undefined) {
        if (typeof symbol === 'undefined') return new Error(`symbol`, 'REQUIRED');
        if (typeof symbol !== 'string') return new Error(`symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request('GET', '/fapi/v1/trades', { symbol, limit }, 'NONE');
    }

    /**
     * Returns older market historical trades.
     * @param {string} symbol 
     * @param {number|undefined} limit - Default `500`. Max is `1000`
     * @param {number|undefined} fromId - TradeId to fetch from. Default gets the most recent trades.
     * @returns { Promise<Futures_trade[]>}
     * - Costs `20` Weight
     * - Market trades means trades filled in the order book. Only market trades will be returned, which means the insurance fund trades and ADL trades won't be returned.
     */
    async historicalTrades(symbol, limit = undefined, fromId = undefined) {
        if (typeof symbol === 'undefined') return new Error(`symbol`, 'REQUIRED');
        if (typeof symbol !== 'string') return new Error(`symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request('GET', '/fapi/v1/historicalTrades', { symbol, limit, fromId }, 'MARKET_DATA');
    }

    /**
     * Returns compressed, aggregate market trades. Market trades that fill in 100ms with the same price and the same taking side will have the quantity aggregated.
     * @param {string} symbol 
     * @param {number|undefined} limit - Default `500`. max `1000`.
     * @param {number|undefined} fromId - ID to get aggregate trades from INCLUSIVE.
     * @param {number|undefined} startTime - Timestamp in ms to get aggregate trades from INCLUSIVE.
     * @param {number|undefined} endTime - Timestamp in ms to get aggregate trades until INCLUSIVE.
     * @returns { Promise < Futures_aggTrade[] > }
     * 
     * - If both `startTime` and `endTime` are sent, time between `startTime` and `endTime` must be less than `1 hour`.
     * - If `fromId`, `startTime`, and `endTime` are not sent, the most recent aggregate trades will be returned.
     * - Only market trades will be aggregated and returned, which means the insurance fund trades and ADL trades won't be aggregated.
     * - Sending both `startTime`/`endTime` and `fromId` might cause response timeout, please send either `fromId` or `startTime`/`endTime`.
     * - Costs `20` Weight
     * - 
     * @since v3.0.0
     */
    async aggTrades(symbol, limit, fromId, startTime, endTime) {
        if (typeof symbol === 'undefined') return new Error(`symbol`, 'REQUIRED');
        if (typeof symbol !== 'string') return new Error(`symbol`, 'WRONG_TYPE', symbol, 'String');

        const resp = await this.request('GET', '/fapi/v1/aggTrades', { symbol, limit, fromId, startTime, endTime }, 'NONE');
        if (resp.error) return resp;

        const response = [];

        for (const aggTrade of resp) {
            response.push(new Futures_aggTrade(aggTrade))
        }

        return response;
    }

    /**
     * - Kline/candlestick bars for a symbol. Klines are uniquely identified by their `openTime.
     * @param {string} symbol 
     * @param {Futures_interval} interval 
     * @param {number|undefined} limit - Default `500`, max `1500`.
     * @param {number|undefined} startTime 
     * @param {number|undefined} endTime 
     * @returns {Promise <Futures_candlestick[]>}
     * 
     * - If `startTime` and `endTime` are not sent, the most recent klines are returned.
     * - **Weight**: based on parameter `limit`:
     * - - [`1`, `100`] => `1` Weight
     * - - [`100`, `500`] => `2` Weight
     * - - [`500`, `1000`] => `5` Weight
     * - - \>`1000` => `10` Weight
     * - 
     * @since v3.0.0
     */
    async candlesticks(symbol, interval, limit, startTime, endTime) {
        if (typeof symbol === 'undefined') return new Error(`symbol`, 'REQUIRED');
        if (typeof symbol !== 'string') return new Error(`symbol`, 'WRONG_TYPE', symbol, 'String');

        if (typeof interval === 'undefined') return new Error(`interval`, 'REQUIRED');
        if (typeof interval !== 'string') return new Error(`symbol`, 'WRONG_TYPE', interval, 'String');

        const resp = await this.request('GET', '/fapi/v1/klines', { symbol, interval, limit, startTime, endTime }, 'NONE');
        if (resp.error) return resp;

        const response = [];
        for (const candlestick of resp) response.push(new Futures_candlestick(candlestick))

        return response;
    }

    /**
     * - Kline/candlestick bars for a specific `contractType`.
     * - Klines are uniquely identified by their `openTime`.
     * @param {string} pair 
     * @param {Futures_interval} interval 
     * @param {"PERPETUAL"|"CURRENT_QUARTER"|"NEXT_QUARTER"} contractType
     * @param {number|undefined} limit - Default `500`, max `1500`.
     * @param {number|undefined} startTime 
     * @param {number|undefined} endTime 
     * @returns {Promise <Futures_candlestick[]>}
     * 
     * - If `startTime` and `endTime` are not sent, the most recent klines are returned.
     * - **Weight**: based on parameter `limit`:
     * - - [`1`, `100`] => `1` Weight
     * - - [`100`, `500`] => `2` Weight
     * - - [`500`, `1000`] => `5` Weight
     * - - \>`1000` => `10` Weight
     * - 
     * @since v3.0.0
     */
    async continuousCandlesticks(pair, contractType, interval, limit, startTime, endTime) {
        if (typeof pair === 'undefined') return new Error(`symbol`, 'REQUIRED');
        if (typeof pair !== 'string') return new Error(`symbol`, 'WRONG_TYPE', pair, 'String');

        if (typeof contractType === 'undefined') return new Error(`contractType`, 'REQUIRED');
        if (typeof contractType !== 'string') return new Error(`symbol`, 'WRONG_TYPE', contractType, 'String');

        if (typeof interval === 'undefined') return new Error(`interval`, 'REQUIRED');
        if (typeof interval !== 'string') return new Error(`symbol`, 'WRONG_TYPE', interval, 'String');

        const resp = await this.request('GET', '/fapi/v1/continuousKlines', { pair, contractType, interval, limit, startTime, endTime }, 'NONE');
        if (resp.error) return resp;

        const response = [];
        for (const candlestick of resp) response.push(new Futures_candlestick(candlestick))

        return response;
    }

    /**
     * - Kline/candlestick bars for the index price of a `pair`.
     * - Klines are uniquely identified by their `openTime`.
     * @param {string} pair
     * @param {Futures_interval} interval
     * @param {number|undefined} limit - Default `500`, max `1500`
     * @param {number|undefined} startTime
     * @param {number|undefined} endTime
     * @returns {Promise <Futures_indexCandlestick[]>}
     * 
     * - Weight is based on parameter `limit`:
     * - - [`1`, `100`] => `1` Weight
     * - - [`100`, `500`] => `2` Weight
     * - - [`500`, `1000`] => `5` Weight
     * - - \> `1000` => `10` Weight
     * - 
     * @since v3.0.0
     */
    async indexPrice_candlesticks(pair, interval, limit, startTime, endTime) {
        if (typeof pair === 'undefined') return new Error(`symbol`, 'REQUIRED');
        if (typeof pair !== 'string') return new Error(`symbol`, 'WRONG_TYPE', pair, 'String');

        if (typeof interval === 'undefined') return new Error(`interval`, 'REQUIRED');
        if (typeof interval !== 'string') return new Error(`symbol`, 'WRONG_TYPE', interval, 'String');

        const resp = await this.request('GET', '/fapi/v1/indexPriceKlines', { pair, interval, limit, startTime, endTime }, 'NONE');
        if (resp.error) return resp;

        const response = [];
        for (const candlestick of resp) response.push(new Futures_indexCandlestick(candlestick))

        return response;
    }

    /**
     * - Kline/candlestick bars for the index price of a `pair`.
     * - Klines are uniquely identified by their `openTime`.
     * @param {string} pair
     * @param {Futures_interval} interval
     * @param {number|undefined} limit - Default `500`, max `1500`
     * @param {number|undefined} startTime
     * @param {number|undefined} endTime
     * @returns {Promise <Futures_markCandlestick[]>}
     * 
     * - Weight is based on parameter `limit`:
     * - - [`1`, `100`] => `1` Weight
     * - - [`100`, `500`] => `2` Weight
     * - - [`500`, `1000`] => `5` Weight
     * - - \> `1000` => `10` Weight
     * - 
     * @since v3.0.0
     */
    async markPrice_candlesticks(pair, interval, limit, startTime, endTime) {
        if (typeof pair === 'undefined') return new Error(`symbol`, 'REQUIRED');
        if (typeof pair !== 'string') return new Error(`symbol`, 'WRONG_TYPE', pair, 'String');

        if (typeof interval === 'undefined') return new Error(`interval`, 'REQUIRED');
        if (typeof interval !== 'string') return new Error(`symbol`, 'WRONG_TYPE', interval, 'String');

        const resp = await this.request('GET', '/fapi/v1/markPriceKlines', { pair, interval, limit, startTime, endTime }, 'NONE');
        if (resp.error) return resp;

        const response = [];
        for (const candlestick of resp) response.push(new Futures_markCandlestick(candlestick))

        return response;
    }

    /**
     * Returns:
     * - Mark Price
     * - Index Price
     * - Funding Rate
     * - Estimated Settle Price
     * - Last Funding Rate
     * - Next Funding Time (the time when the next Funding Rate will occur)
     * - Interest Rate
     * - Costs `1` Weight
     * @param {string} symbol 
     * @returns { Promise <Futures_markPrice> }
     * - 
     * @since v3.0.0
     */
    async markPrice(symbol) {
        return this.request('GET', '/fapi/v1/premiumIndex', { symbol }, 'NONE');
    }

    /**
     * Returns:
     * - Mark Price
     * - Index Price
     * - Funding Rate
     * - Estimated Settle Price
     * - Last Funding Rate
     * - Next Funding Time (the time when the next Funding Rate will occur)
     * - Interest Rate
     * - Costs `1` Weight
     * @returns { Promise <Futures_markPrice[]> }
     * - 
     * @since v3.0.0
     */
    async allMarkPrices() {
        return this.markPrice();
    }

    /**
     * @param {string|undefined} symbol -
     * @param {number|undefined} startTime - Timestamp in ms to get funding rate from INCLUSIVE.
     * @param {number|undefined} endTime - Timestamp in ms to get funding rate  until INCLUSIVE.
     * @param {number|undefined} limit - Default `100`; max `1000`
     * @return {Promise <Futures_fundingRate[]>}
     * - If `startTime` and `endTime` are not sent, the most recent limit datas are returned.
     * - If the number of data between `startTime` and `endTime` is larger than `limit`, return as `startTime` + `limit`.
     * - In ascending order => older to newer
     * - 
     * @since v3.0.0
    **/
    async fundingRate_history(symbol = undefined, limit = undefined, startTime = undefined, endTime = undefined) {
        const response = await this.request('GET', '/fapi/v1/fundingRate', { symbol, startTime, endTime, limit }, 'NONE');
        if (response.error) return response;
        return response;
    }

    /**
     * @param {string} symbol -
     * @return {Promise <Futures_ticker24h>}
     * - Costs `1` Weight for a single `symbol`
     * - Costs `40` Weight when the `symbol` parameter is omitted
     * - 
     * @since v3.0.0
    **/
    async ticker_24h(symbol) {
        const response = await this.request('GET', '/fapi/v1/ticker/24hr', { symbol }, 'NONE');
        if (response.error) return response
        return response;
    }

    /**
     * @returns {Promise <Futures_ticker24h[]>}
     * - Costs `40` Weight
     * - 
     * @since v3.0.0
     */
    async allTickers_24h() {
        return this.ticker_24h();
    }

    /**
     * - Latest price for a `symbol`.
     * @param {string} symbol -
     * @returns {Promise <Futures_priceTicker>}
     * - Costs `1` Weight for a single `symbol`
     * - Costs `2` Weight when the `symbol` parameter is omitted
     * - 
     * @since v3.0.0
    **/
    async priceTicker(symbol) {
        const response = await this.request('GET', '/fapi/v1/ticker/price', { symbol }, 'NONE');
        if (response.error) return response;
        return response;
    }

    /**
     * - Latest price for symbols.
     * @returns {Promise <Futures_priceTicker[]>}
     * - Costs `2` Weight
     * - 
     * @since v3.0.0
     **/
    async all_priceTickers() {
        return this.priceTicker();
    }

    /**
     * - Best price/qty on the order book for a `symbol`.
     * @param {String} symbol -
     * @returns {Promise <Futures_symbolOrderBookTicker>}
     * - Costs `2` Weight for a single `symbol`.
     * - Costs `5` Weight when the `symbol` parameter is omitted.
     * - 
     * @since v3.0.0
     **/
    async symbol_orderBook_ticker(symbol) {
        const response = await this.request('GET', '/fapi/v1/ticker/bookTicker', { symbol }, 'NONE');
        if (response.error) return response
        return response;
    }

    /**
     * - Best price/qty on the order book for symbols.
     * @returns {Futures_symbolOrderBookTicker[]}
     * - Costs `5` Weight.
     * - 
     * @since v3.0.0
     **/
    async all_symbol_orderBook_tickers() {
        return this.symbol_orderBook_ticker();
    }

    /**
     * - Get present open interest of a specific symbol.
     * @param {string} symbol -
     * @returns {Promise <Futures_openInterest>}
     * - Costs `1` Weight
     * - 
     * @since v3.0.0
     **/
    async openInterest(symbol) {
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const response = await this.request('GET', '/fapi/v1/openInterest', { symbol }, 'NONE');
        if (response.error) return response
        return response;
    }

    /**
     * - Get present open interest stats of a specific symbol.
     * @param {string} symbol -
     * @param {Futures_period} period -
     * @param {number|undefined} limit - Default `30`, max `500`
     * @param {startTime|undefined} startTime -
     * @param {endTime|undefined} endTime -
     * @returns {Promise <Futures_openInterest_statistics[]>}
     * - If `startTime` and `endTime` are not sent, the most recent data is returned.
     * - Only the data of the latest `30` days is available.
     * - 
     * @since v3.0.0
    **/
    async openInterest_statistics(symbol, period, limit, startTime, endTime) {
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof period === 'undefined') return new Error('period', 'REQUIRED');

        const response = await this.request('GET', '/futures/data/openInterestHist', { symbol, period, limit, startTime, endTime }, 'NONE');
        if (response.error) return response;

        return response;
    }

    /**
     * - Get present open interest stats of a specific symbol.
     * @param {string} symbol -
     * @param {Futures_period} period -
     * @param {number|undefined} limit - Default `30`, max `500`
     * @param {startTime|undefined} startTime -
     * @param {endTime|undefined} endTime -
     * @returns {Promise <Futures_Long_Short_Ratio[]>}
     * - If `startTime` and `endTime` are not sent, the most recent data is returned.
     * - Only the data of the latest `30` days is available.
     * - 
     * @since v3.0.0
     **/
    async topTrader_long_short_ratio_Accounts(symbol, period, limit, startTime, endTime) {
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof period === 'undefined') return new Error('period', 'REQUIRED');

        const response = await this.request('GET', '/futures/data/topLongShortAccountRatio', { symbol, period, limit, startTime, endTime }, 'NONE');
        if (response.error) return response;

        return response;
    }

    /**
     * - Get present open interest stats of a specific symbol.
     * @param {string} symbol -
     * @param {Futures_period} period -
     * @param {number|undefined} limit - Default `30`, max `500`
     * @param {startTime|undefined} startTime -
     * @param {endTime|undefined} endTime -
     * @returns {Promise <Futures_Long_Short_Ratio[]>}
     * - If `startTime` and `endTime` are not sent, the most recent data is returned.
     * - Only the data of the latest `30` days is available.
     * - 
     * @since v3.0.0
     **/
    async topTrader_long_short_ratio_Positions(symbol, period, limit, startTime, endTime) {
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof period === 'undefined') return new Error('period', 'REQUIRED');

        const response = await this.request('GET', '/futures/data/topLongShortPositionRatio', { symbol, period, limit, startTime, endTime }, 'NONE');
        if (response.error) return response;

        return response;
    }

    /**
     * - Get present open interest stats of a specific symbol.
     * @param {string} symbol -
     * @param {Futures_period} period -
     * @param {number|undefined} limit - Default `30`, max `500`
     * @param {startTime|undefined} startTime -
     * @param {endTime|undefined} endTime -
     * @returns {Promise <Futures_Long_Short_Ratio[]>}
     * - If `startTime` and `endTime` are not sent, the most recent data is returned.
     * - Only the data of the latest `30` days is available.
     * - 
     * @since v3.0.0
    **/
    async global_long_short_ratio(symbol, period, limit, startTime, endTime) {
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof period === 'undefined') return new Error('period', 'REQUIRED');

        const response = await this.request('GET', '/futures/data/globalLongShortAccountRatio', { symbol, period, limit, startTime, endTime }, 'NONE');
        if (response.error) return response;

        return response;
    }

    /**
     * - Get present open interest stats of a specific symbol.
     * @param {string} symbol -
     * @param {Futures_period} period -
     * @param {number|undefined} limit - Default `30`, max `500`
     * @param {startTime|undefined} startTime -
     * @param {endTime|undefined} endTime -
     * @returns {Promise <Futures_taker_buySell_ratio[]>}
     * - If `startTime` and `endTime` are not sent, the most recent data is returned.
     * - Only the data of the latest `30` days is available.
     * - 
     * @since v3.0.0
    **/
    async taker_buySell_ratio(symbol, period, limit, startTime, endTime) {
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof period === 'undefined') return new Error('period', 'REQUIRED');

        const response = await this.request('GET', '/futures/data/takerlongshortRatio', { symbol, period, limit, startTime, endTime }, 'NONE');
        if (response.error) return response;

        return response;
    }

    /**
     * - The BLVT NAV system is based on Binance Futures, so the endpoint is based on fapi
     * @param {string} symbol - token name, e.g. `BTCDOWN`, `BTCUP`
     * @param {Futures_interval} interval -
     * @param {number|undefined} limit - default `500`, max `1000`
     * @param {number|undefined} startTime -
     * @param {number|undefined} endTime -
     * @returns {Promise <Futures_historical_BLVT_NAV_candlestick[]>}
     * - Costs `1` Weight
     * - 
     * @since v3.0.0
    **/
    async historical_BLVT_NAV_candlesticks(symbol, interval, limit = undefined, startTime = undefined, endTime = undefined) {
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');
        if (typeof interval === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/lvtKlines', { symbol, interval, startTime, endTime, limit }, 'NONE');
        if (resp.error) return resp;

        const response = [];
        for (const candlestick of resp) response.push(new Futures_historical_BLVT_NAV_candlestick(candlestick));

        return response;
    }

    /**
     * - Only for composite index symbols, e.g: `DEFIUSDT`
     * @param {string} symbol -
     * @returns {Promise <Futures_compositeIndex_Symbol>}
     * - Costs `1` Weight
     * - 
     * @since v3.0.0
    **/
    async compositeIndex_symbolInfo(symbol) {
        const response = await this.request('GET', '/fapi/v1/indexInfo', { symbol }, 'NONE');
        if (response.error) return response
        return response;
    }

    /**
     * - Only for composite index symbols, e.g: `DEFIUSDT`
     * @returns {Promise <Futures_compositeIndex_Symbol[]>}
     * - Costs `1` Weight
     * - 
     * @since v3.0.0
    **/
    async all_compositeIndex_symbolInfo() {
        return this.compositeIndex_symbolInfo();
    }

    /**
     * - asset index for Multi-Assets mode
     * @param {string|undefined} symbol - Asset pair
     * @returns {Promise < Futures_multiAssetMode_assetIndex >}
     * - 
     * @since v3.0.0
    **/
    async multiAssetMode_assetIndex(symbol = undefined) {


        const response = await this.request('GET', '/fapi/v1/assetIndex', { symbol }, 'NONE');
        if (response.error) return response
        return response;
    }

    /**
     * - asset index for Multi-Assets mode
     * @returns {Promise < Futures_multiAssetMode_assetIndex[] >}
     * - 
     * @since v3.0.0
    **/
    async all_multiAssetMode_assetIndexes() {
        return this.multiAssetMode_assetIndex();
    }

    // HEREEEEEEEE

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Change user's position mode (Hedge Mode or One-way Mode ) on EVERY symbol
     * - Weight: `1`
     * @param {string} dualSidePosition  - "true": Hedge Mode; "false": One-way Mode
     * @returns { Promise < {"code":200,"msg":"success"} > }
     * - 
     * @since v3.0.0
    */
    async switch_positionMode(dualSidePosition) {
        // Expects (HMAC SHA256)
        if (typeof dualSidePosition === 'undefined') return new Error('dualSidePosition', 'REQUIRED');

        const resp = await this.request('POST', '/fapi/v1/positionSide/dual', { dualSidePosition }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Change user's position mode (Hedge Mode or One-way Mode ) on EVERY symbol
     * - Weight: `1`
     * @param {string} dualSidePosition  - "true": Hedge Mode; "false": One-way Mode
     * @returns { Promise < {"code":200,"msg":"success"} > }
     * - 
     * @since v3.0.0
    */
    async toggle_hedgeMode(dualSidePosition) {
        return this.switch_positionMode(dualSidePosition);
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get user's position mode (Hedge Mode or One-way Mode ) on EVERY symbol
     * - Weight: `30`
     * @returns { Promise < {"dualSidePosition":true|false} > }
     * - 
     * @since v3.0.0
    */
    async get_current_positionMode() {
        // Expects (HMAC SHA256)
        const resp = await this.request('GET', '/fapi/v1/positionSide/dual', {}, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Change user's Multi-Assets mode (Multi-Assets Mode or Single-Asset Mode) on Every symbol
     * - Weight: `1`
     * @param {string} multiAssetsMargin  - "true": Multi-Assets Mode; "false": Single-Asset Mode
     * @returns { Promise < {"code":200,"msg":"success"} > }
     * - 
     * @since v3.0.0
    */
    async change_multiAssetMode(multiAssetsMargin) {
        // Expects (HMAC SHA256)
        if (typeof multiAssetsMargin === 'undefined') return new Error('multiAssetsMargin', 'REQUIRED');

        const resp = await this.request('POST', '/fapi/v1/multiAssetsMargin', { multiAssetsMargin }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get user's Multi-Assets mode (Multi-Assets Mode or Single-Asset Mode) on Every symbol
     * - Weight: `30`
     * @returns { Promise < {"multiAssetsMargin":true} > }
    */
    async get_current_multiAssetMode() {
        // Expects (HMAC SHA256)
        const resp = await this.request('GET', '/fapi/v1/multiAssetsMargin', {}, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new order.
     * - Weight: `0`.
     * -
     * - Additional mandatory parameters based on type:
     * - - `LIMIT`: `timeInForce`, `quantity`, `price`.
     * - - `MARKET`: `quantity`.
     * - - `STOP`/`TAKE_PROFIT`: `quantity`, `price`, `stopPrice`.
     * - - `STOP_MARKET`/`TAKE_PROFIT_MARKET`: `stopPrice`.
     * - - `TRAILING_STOP_MARKET`: `callbackRate`
     * - 
     * - For `STOP`/`TAKE_PROFIT`: `timeInForce` can be sent (default `GTC`).
     * -
     * - Condition orders will be triggered when:
     * - - If parameter `priceProtect` is sent as `true`:
     * - - - when price reaches the `stopPrice`, the difference rate between `MARK_PRICE` and `CONTRACT_PRICE` cannot be larger than the `triggerProtect` of the symbol.
     * - - - `triggerProtect` of a symbol can be got from `.exchangeInfo()`.
     * -
     * - - `STOP`/`STOP_MARKET`:
     * - - - `BUY`: (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`.
     * - - - `SELL`: (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`.
     * -
     * - - `TAKE_PROFIT`/`TAKE_PROFIT_MARKET`:
     * - - - `BUY`: (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * - - - `SELL`: (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`
     * -
     * - - `TRAILING_STOP_MARKET`:
     * - - - `BUY`: (`lowest price after order placed` <= `activationPrice`) && (`latest price` >= `lowest price * (1 + callbackRate)`)
     * - - - `SELL`: `(highest price after order placed` >= `activationPrice`) && (`latest price` <= `highest price * (1 - callbackRate)`)
     * 
     * -
     * 
     * - For `TRAILING_STOP_MARKET`, if you got such error code: `{"code": -2021, "msg": "Order would immediately trigger."}` means that the parameters you send do not meet the following requirements:
     * - - `BUY`: `activationPrice` < `latest price`.
     * - - `SELL`: `activationPrice` > `latest price`.
     * 
     * -
     * 
     * If `newOrderRespType` is sent as `RESULT` (library default):
     * - `MARKET` order: the final `FILLED` result of the order will be return directly.
     * - `LIMIT` order with special `timeInForce`: the final status result of the order(`FILLED` or `EXPIRED`) will be returned directly.
     * 
     * -
     * 
     * - `STOP_MARKET`, `TAKE_PROFIT_MARKET` with `closePosition=true`:
     * - - Follow the same rules for condition orders.
     * - - If triggered，**closes all** current long position(if `SELL`) or current short position(if `BUY`).
     * - - Cannot be used with `quantity` paremeter.
     * - - Cannot be used with `reduceOnly` parameter.
     * - - In `Hedge Mode`, cannot be used with `BUY` orders in `LONG` positionSide. and cannot be used with `SELL` orders in `SHORT` positionSide.
     * 
     * @param {string} symbol
     * @param {Futures_OrderSide} side
     * @param {Futures_OrderType} type
     * @param {Futures_PositionSide | undefined} positionSide  - Default `BOTH` for One-way Mode ; `LONG` or `SHORT` for Hedge Mode. It must be sent in Hedge Mode.
     * @param {Futures_TimeInForce | undefined} timeInForce
     * @param {number | undefined} quantity  - Cannot be sent with `closePosition = true` (Close-All)
     * @param {boolean | undefined} reduceOnly  - `true` or `false`. default `false`. Cannot be sent in Hedge Mode. Cannot be sent with `closePosition = true`
     * @param {number | undefined} price
     * @param {string | undefined} newClientOrderId  - A unique id among open orders. Automatically generated if not sent. Can only be string following the rule: `^[\.A-Z\:/a-z0-9_-]{1,36}$`
     * @param {number | undefined} stopPrice  - Used with STOP/STOP_MARKET or TAKE_PROFIT/TAKE_PROFIT_MARKET orders.
     * @param {boolean | undefined} closePosition  - Close-All, used with `STOP_MARKET` or `TAKE_PROFIT_MARKET` .
     * @param {number | undefined} activationPrice  - Used with `TRAILING_STOP_MARKET` orders, default as the `latest price`(`CONTRACT_PRICE` or `MARK_PRICE`)
     * @param {number | undefined} callbackRate  - Used with `TRAILING_STOP_MARKET` orders, min `0`. `1`, max `5` where `1` for `1%`
     * @param {Futures_WorkingType | undefined} workingType  - `stopPrice` triggered by: `MARK_PRICE`, `CONTRACT_PRICE`. Default `CONTRACT_PRICE`.
     * @param {boolean|undefined} priceProtect  - `TRUE` or `FALSE`, default `FALSE`. Used with `STOP`/`STOP_MARKET` or `TAKE_PROFIT`/`TAKE_PROFIT_MARKET` orders.
     * @param {Futures_newOrderRespType | undefined} newOrderRespType  - `ACK`, `RESULT`, library default: `RESULT`
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
    */
    async new_Order(symbol, side, type, quantity, price, stopPrice, positionSide, timeInForce, reduceOnly, newClientOrderId, closePosition, activationPrice, callbackRate, workingType, priceProtect, newOrderRespType = 'RESULT') {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

        if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

        const resp = await this.request('POST', '/fapi/v1/order', { symbol, side, type, positionSide, timeInForce, quantity, reduceOnly, price, newClientOrderId, stopPrice, closePosition, activationPrice, callbackRate, workingType, priceProtect, newOrderRespType }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `MARKET` order.
     * - Weight: `0`.
     * - 
     * - If `newOrderRespType` is sent as `RESULT` (library default):
     * - - `MARKET` order: the final `FILLED` result of the order will be return directly.
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT`
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    market_Order(symbol, side, quantity, positionSide, newClientOrderId, reduceOnly, newOrderRespType) {

        if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

        return this.new_Order(symbol, side, 'MARKET', quantity, undefined, undefined, positionSide, undefined, reduceOnly, newClientOrderId, undefined, undefined, undefined, undefined, undefined, newOrderRespType)
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `MARKET` `BUY` order.
     * - Weight: `0`.
     * - 
     * - If `newOrderRespType` is sent as `RESULT` (library default):
     * - - `MARKET` order: the final `FILLED` result of the order will be return directly.
     * @param {string} symbol 
     * @param {number} quantity 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT`
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    marketBuy(symbol, quantity, positionSide, newClientOrderId, reduceOnly, newOrderRespType) {
        return this.market_Order(symbol, 'BUY', quantity, positionSide, newClientOrderId, reduceOnly, newOrderRespType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `MARKET` `SELL` order.
     * - Weight: `0`.
     * - 
     * - If `newOrderRespType` is sent as `RESULT` (library default):
     * - - `MARKET` order: the final `FILLED` result of the order will be return directly.
     * @param {string} symbol 
     * @param {number} quantity 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    marketSell(symbol, quantity, positionSide, newClientOrderId, reduceOnly, newOrderRespType) {
        return this.market_Order(symbol, 'SELL', quantity, positionSide, newClientOrderId, reduceOnly, newOrderRespType);
    }



    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `LIMIT` order.
     * - Weight: `0`.
     * - 
     * - If `newOrderRespType` is sent as `RESULT` (library default):
     * - - `LIMIT` order with special `timeInForce`: the final status result of the order(`FILLED` or `EXPIRED`) will be returned directly.
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    limit_Order(symbol, side, quantity, price, positionSide, timeInForce = 'GTC', newClientOrderId, reduceOnly, newOrderRespType) {

        if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');
        if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

        return this.new_Order(symbol, side, 'LIMIT', quantity, price, undefined, positionSide, timeInForce, reduceOnly, newClientOrderId, undefined, undefined, undefined, undefined, undefined, newOrderRespType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `LIMIT` `BUY` order.
     * - Weight: `0`.
     * - 
     * - If `newOrderRespType` is sent as `RESULT` (library default):
     * - - `LIMIT` order with special `timeInForce`: the final status result of the order(`FILLED` or `EXPIRED`) will be returned directly.
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {string | undefined} newClientOrderId  
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT`
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    limitBuy(symbol, quantity, price, positionSide, timeInForce = 'GTC', newClientOrderId, reduceOnly, newOrderRespType) {
        return this.limit_Order(symbol, 'BUY', quantity, price, positionSide, timeInForce, newClientOrderId, reduceOnly, newOrderRespType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `LIMIT` `SELL` order.
     * - Weight: `0`.
     * - 
     * - If `newOrderRespType` is sent as `RESULT` (library default):
     * - - `LIMIT` order with special `timeInForce`: the final status result of the order(`FILLED` or `EXPIRED`) will be returned directly.
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    limitSell(symbol, quantity, price, positionSide, timeInForce = 'GTC', newClientOrderId, reduceOnly, newOrderRespType) {
        return this.limit_Order(symbol, 'SELL', quantity, price, positionSide, timeInForce, newClientOrderId, reduceOnly, newOrderRespType);
    }


    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `STOP` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - `BUY`: (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`
     * - - `SELL`: (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * 
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {number} stopPrice 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    stopLoss_Order(symbol, side, quantity, price, stopPrice, positionSide, newClientOrderId, timeInForce, priceProtect, reduceOnly, newOrderRespType, workingType) {

        if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');
        if (typeof price === 'undefined') return new Error('price', 'REQUIRED');
        if (typeof stopPrice === 'undefined') return new Error('stopPrice', 'REQUIRED');

        return this.new_Order(symbol, side, 'STOP', quantity, price, stopPrice, positionSide, timeInForce, reduceOnly, newClientOrderId, undefined, undefined, workingType, priceProtect, newOrderRespType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `STOP` `BUY` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`
     * 
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {number} stopPrice 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    stopLossBuy(symbol, quantity, price, stopPrice, positionSide, newClientOrderId, timeInForce, priceProtect, reduceOnly, newOrderRespType, workingType) {
        return this.stopLoss_Order(symbol, 'BUY', quantity, price, stopPrice, positionSide, newClientOrderId, timeInForce, priceProtect, reduceOnly, newOrderRespType, workingType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `STOP` `BUY` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * 
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {number} stopPrice 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    stopLossSell(symbol, quantity, price, stopPrice, positionSide, newClientOrderId, timeInForce, priceProtect, reduceOnly, newOrderRespType, workingType) {
        return this.stopLoss_Order(symbol, 'SELL', quantity, price, stopPrice, positionSide, newClientOrderId, timeInForce, priceProtect, reduceOnly, newOrderRespType, workingType);
    }



    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - `BUY`: (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * - - `SELL`: (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`
     * 
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {number} stopPrice 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    takeProfit_Order(symbol, side, quantity, price, stopPrice, positionSide, newClientOrderId, timeInForce, priceProtect, reduceOnly, newOrderRespType, workingType) {

        if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');
        if (typeof price === 'undefined') return new Error('price', 'REQUIRED');
        if (typeof stopPrice === 'undefined') return new Error('stopPrice', 'REQUIRED');

        return this.new_Order(symbol, side, 'TAKE_PROFIT', quantity, price, stopPrice, positionSide, timeInForce, reduceOnly, newClientOrderId, undefined, undefined, workingType, priceProtect, newOrderRespType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * 
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {number} stopPrice 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    takeProfitBuy(symbol, quantity, price, stopPrice, positionSide, newClientOrderId, timeInForce, priceProtect, reduceOnly, newOrderRespType, workingType) {
        return this.takeProfit_Order(symbol, 'BUY', quantity, price, stopPrice, positionSide, timeInForce, reduceOnly, newClientOrderId, undefined, undefined, workingType, priceProtect, newOrderRespType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`
     * 
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} quantity 
     * @param {number} price 
     * @param {number} stopPrice 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {Futures_TimeInForce | undefined} timeInForce - Defaults to `GTC`: Good Til Cancel
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType - Defaults to `RESULT` 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    takeProfitSell(symbol, quantity, price, stopPrice, positionSide, newClientOrderId, timeInForce, priceProtect, reduceOnly, newOrderRespType, workingType) {
        return this.takeProfit_Order(symbol, 'SELL', quantity, price, stopPrice, positionSide, timeInForce, reduceOnly, newClientOrderId, undefined, undefined, workingType, priceProtect, newOrderRespType);
    }



    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * - 
     * - This condition order will be triggered when:
     * - - `BUY`: (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`
     * - - `SELL`: (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * - 
     * - WHEN WITH `closePosition=true`:
     * - - If triggered，**closes all** current `LONG` position(if `SELL`) or current `SHORT` position(if `BUY`).
     * - - Cannot be used with `quantity` paremeter.
     * - - Cannot be used with `reduceOnly` parameter.
     * - - In `Hedge Mode`, cannot be used with `BUY` orders in `LONG` positionSide. and cannot be used with `SELL` orders in `SHORT` positionSide.
     * 
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} stopPrice 
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    stopLossMarket_Order(symbol, side, stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType) {

        if (typeof stopPrice === 'undefined') return new Error('stopPrice', 'REQUIRED');

        return this.new_Order(symbol, side, 'STOP_MARKET', quantity, undefined, stopPrice, positionSide, undefined, reduceOnly, newClientOrderId, closePosition, undefined, undefined, workingType, priceProtect, newOrderRespType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * - 
     * - This condition order will be triggered when:
     * - - (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`
     * - 
     * - WHEN WITH `closePosition=true`:
     * - - If triggered，**closes all** current `SHORT` position.
     * - - Cannot be used with `quantity` paremeter.
     * - - Cannot be used with `reduceOnly` parameter.
     * - - In `Hedge Mode`, cannot be used with `LONG` positionSide.
     * 
     * @param {string} symbol 
     * @param {number} stopPrice 
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    stopLossMarketBuy(symbol, stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType) {
        return this.stopLossMarket_Order(symbol, 'BUY', stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * - 
     * - This condition order will be triggered when:
     * - - (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * - 
     * - WHEN WITH `closePosition=true`:
     * - - If triggered，**closes all** current `LONG` position.
     * - - Cannot be used with `quantity` paremeter.
     * - - Cannot be used with `reduceOnly` parameter.
     * - - In `Hedge Mode`, cannot be used `SHORT` positionSide.
     * 
     * @param {string} symbol 
     * @param {number} stopPrice 
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    stopLossMarketSell(symbol, stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType) {
        return this.stopLossMarket_Order(symbol, 'SELL', stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType);
    }


    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * - 
     * - This condition order will be triggered when:
     * - - `BUY`: (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * - - `SELL`: (`MARK_PRICE` or `CONTRACT_PRICE`) >= `stopPrice`
     * - 
     * - WHEN WITH `closePosition=true`:
     * - - If triggered，**closes all** current `LONG` position(if `SELL`) or current `SHORT` position(if `BUY`).
     * - - Cannot be used with `quantity` paremeter.
     * - - Cannot be used with `reduceOnly` parameter.
     * - - In `Hedge Mode`, cannot be used with `BUY` orders in `LONG` positionSide. and cannot be used with `SELL` orders in `SHORT` positionSide.
     * 
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} stopPrice 
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    takeProfitMarket_Order(symbol, side, stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType) {

        if (typeof stopPrice === 'undefined') return new Error('stopPrice', 'REQUIRED');

        return this.new_Order(symbol, side, 'TAKE_PROFIT_MARKET', quantity, undefined, stopPrice, positionSide, undefined, reduceOnly, newClientOrderId, closePosition, undefined, undefined, workingType, priceProtect, newOrderRespType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * - 
     * - This condition order will be triggered when:
     * - - (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * - 
     * - WHEN WITH `closePosition=true`:
     * - - If triggered，**closes all** current `LONG` position.
     * - - Cannot be used with `quantity` paremeter.
     * - - Cannot be used with `reduceOnly` parameter.
     * - - In `Hedge Mode`, cannot be used with `LONG` positionSide.
     * 
     * @param {string} symbol 
     * @param {number} stopPrice 
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    takeProfitMarketBuy(symbol, stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType) {
        return this.takeProfitMarket_Order(symbol, 'BUY', stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType);
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * - 
     * - This condition order will be triggered when:
     * - - (`MARK_PRICE` or `CONTRACT_PRICE`) <= `stopPrice`
     * - 
     * - WHEN WITH `closePosition=true`:
     * - - If triggered，**closes all** current `LONG` position(if `SELL`).
     * - - Cannot be used with `quantity` paremeter.
     * - - Cannot be used with `reduceOnly` parameter.
     * - - In `Hedge Mode`, cannot be used with `SELL` orders in `SHORT` positionSide.
     * 
     * @param {string} symbol 
     * @param {number} stopPrice 
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {string | undefined} newClientOrderId 
     * @param {boolean | undefined} priceProtect 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * @param {Futures_WorkingType | undefined} workingType 
     * @returns { Promise < Futures_Order > }
     * - 
     * @since v3.0.0
     */
    takeProfitMarketSell(symbol, stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType) {
        return this.takeProfitMarket_Order(symbol, 'SELL', stopPrice, quantity, closePosition, positionSide, newClientOrderId, priceProtect, reduceOnly, newOrderRespType, workingType);
    }



    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - `BUY`: `LOWEST price after order placed` <= `activationPrice` && `latest price` >= `LOWEST price * (1 + callbackRate)`
     * - - `SELL`: `HIGHEST price after order placed` >= `activationPrice` && `latest price` <= `HIGHEST price * (1 - callbackRate)`
     * -
     * - If you got such error code: `{"code": -2021, "msg": "Order would immediately trigger."}` means that the parameters you send do not meet the following requirements:
     * - - `BUY`: `activationPrice` should be smaller than `latest price`.
     * - - `SELL`: `activationPrice` should be larger than `latest price`.
     * -
     * @param {string} symbol 
     * @param {Futures_OrderSide} side 
     * @param {number} callbackRate - min `0.1,` max `5` where `1` for `1%`
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {number | undefined} activationPrice - defaults as the latest price (supporting different workingType)
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * - 
     * @since v3.0.0
     */
    trailingStopMarket_Order(symbol, side, callbackRate, quantity, closePosition, activationPrice, positionSide, reduceOnly, newOrderRespType, workingType) {

        if (typeof callbackRate === 'undefined') return new Error('callbackRate', 'REQUIRED');

        return this.new_Order(symbol, side, 'TRAILING_STOP_MARKET', quantity, undefined, undefined, positionSide, undefined, reduceOnly, newClientOrderId, closePosition, activationPrice, callbackRate, workingType, undefined, newOrderRespType)
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - `LOWEST price after order placed` <= `activationPrice` && `latest price` >= `LOWEST price * (1 + callbackRate)`
     * -
     * - If you got such error code: `{"code": -2021, "msg": "Order would immediately trigger."}` means that the parameters you send do not meet the following requirements:
     * - - `activationPrice` should be smaller than `latest price`.
     * -
     * @param {string} symbol 
     * @param {number} callbackRate - min `0.1,` max `5` where `1` for `1%`
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {number | undefined} activationPrice - defaults as the latest price (supporting different workingType)
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * - 
     * @since v3.0.0
     */
    trailingStopMarketBuy(symbol, callbackRate, quantity, closePosition, activationPrice, positionSide, reduceOnly, newOrderRespType, workingType) {
        return this.trailingStopMarket_Order(symbol, 'BUY', callbackRate, quantity, closePosition, activationPrice, positionSide, reduceOnly, newOrderRespType, workingType)
    }

    /**
     * - REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new `TAKE_PROFIT` order.
     * - Weight: `0`.
     * -
     * - This condition order will be triggered when:
     * - - `HIGHEST price after order placed` >= `activationPrice` && `latest price` <= `HIGHEST price * (1 - callbackRate)`
     * -
     * - If you got such error code: `{"code": -2021, "msg": "Order would immediately trigger."}` means that the parameters you send do not meet the following requirements:
     * - - `activationPrice` should be larger than `latest price`.
     * -
     * @param {string} symbol 
     * @param {number} callbackRate - min `0.1,` max `5` where `1` for `1%`
     * @param {number | undefined} quantity 
     * @param {boolean | undefined} closePosition 
     * @param {number | undefined} activationPrice - defaults as the latest price (supporting different workingType)
     * @param {Futures_PositionSide | undefined} positionSide 
     * @param {boolean | undefined} reduceOnly 
     * @param {Futures_newOrderRespType | undefined} newOrderRespType 
     * -
     * @since v3.0.0
     */
    trailingStopMarketSell(symbol, callbackRate, quantity, closePosition, activationPrice, positionSide, reduceOnly, newOrderRespType, workingType) {
        return this.trailingStopMarket_Order(symbol, 'SELL', callbackRate, quantity, closePosition, activationPrice, positionSide, reduceOnly, newOrderRespType, workingType)
    }



    /**
     * - Used to create `batchOrder()` requests
     * -
     * - HOW TO USE:
     * - 1_ Call this function: `const orderGenerator = binance.create_orderObject_generator()`
     * -
     * - 2_ Use the returned Object to call the `orderType` function you want (with await): `const orderObject = await orderGenerator.marketBuy('BTCUSDT', 0.01, 'LONG', '71nd02hcxs821')`
     * -
     * - Since you will be using it with `batchOrder`, it is best to push it into an array:
     * @example 
     * const orderGenerator = binance.futures.create_orderObject_generator();
     * const orders = [];
     * orders.push( await orderGenerator.marketBuy('BTCUSDT', 0.01, 'LONG', '71nd02hcxs821') )
     * orders.push( await orderGenerator.marketBuy('BNBUSDT', 0.2, 'SHORT', 'k173m38d1022sjkdk') )
     * orders.push( await orderGenerator.trailingStopMarketBuy(...) )
     * orders.push( await orderGenerator.stopLossMarketBuy(...) )
     * 
     * const response = await binance.batchOrder(orders);
     * @returns {Futures}
     * - This doesn't necessarily only work with trade orders, it will return ANY method's parameters object
     * @since v3.0.0
     */
    create_orderObject_generator() {
        const Binance = require('../Binance');
        const temp_binanceFutures = new Binance().futures;
        Object.assign(
            temp_binanceFutures
            ,
            {
                request: (ignore0, ignore1, params, ignore2) => {
                    for (const [key, value] of Object.entries(params)) if (value === undefined) delete params[key];
                    return params;
                }
            }
        );

        return temp_binanceFutures;
    }

    /**
     * - Use this function to convert your `quoteSize` to a valid `quantity`
     * - `quoteSize` is the **TOTAL** quote quantity **`(LEVERAGE INCLUDED!)`** you want to convert
     * - The first request using this method will take longer if `exchangeInfo()` or `exchangeInfo_mapped()` where never fetched since exchangeInfo is needed for the calculations.
     * @param {string} symbol
     * @param {number} quoteSize
     * @param {number | undefined} price
     * @returns {Promise < number >}
     */
    async convert_quoteSize_to_quantity(symbol, quoteSize, price) {

        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof quoteSize === 'undefined') return new Error('quoteSize', 'REQUIRED');
        if (typeof quoteSize === 'string') {
            quoteSize = parseFloat(quoteSize);
            if (isNaN(quoteSize)) return new Error('quoteSize', 'INVALID_VALUE', quoteSize);
        } else if (typeof quoteSize !== 'number') return new Error('quoteSize', 'WRONG_TYPE', quoteSize, 'Number');

        if (typeof price === 'undefined') {
            const price_response = await this.priceTicker(symbol)
            if (price_response.error) return price_response;
            price = price_response.price.parseFloat();
        } else if (typeof price === 'string') {
            price = parseFloat(price);
            if (isNaN(price)) return new Error('price', 'INVALID_VALUE', price);
        } else if (typeof price !== 'number') return new Error('price', 'WRONG_TYPE', price, 'Number');


        let exchangeInfo_symbol;

        if (exchangeInfo === null) {

            exchangeInfo = await this.exchangeInfo_mapped()
            if (exchangeInfo.error) return exchangeInfo;
            if (!exchangeInfo.symbols[symbol]) return new Error(`${symbol} wasn't found in exchangeInfo. If the symbol is newly listed it could a while to show up on exchangeInfo`);
            exchangeInfo_symbol = exchangeInfo.symbols[symbol];

        } else {

            if (!exchangeInfo.symbols[symbol]) {
                exchangeInfo = await this.exchangeInfo_mapped();
                if (exchangeInfo.error) return exchangeInfo;
                if (!exchangeInfo.symbols[symbol]) return new Error(`${symbol} wasn't found in exchangeInfo. If the symbol is newly listed it could a while to show up on exchangeInfo`);
            }
            exchangeInfo_symbol = exchangeInfo.symbols[symbol];
        }

        return this.toFixed(quoteSize / price, exchangeInfo_symbol.quantityPrecision)
    }

    /**
     * - Use this function to convert a symbol's `quantity` to the valid `quantityPrecision`
     * - The first request using this method will take longer if `exchangeInfo()` or `exchangeInfo_mapped()` where never fetched since exchangeInfo is needed for the calculations.
     * @param {string} symbol
     * @param {number} quantity
     * @returns {Promise < number >}
     */
    async convert_toValid_quantityPrecision(symbol, quantity) {

        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');
        if (typeof quantity === 'string') {
            quantity = parseFloat(quantity);
            if (isNaN(quantity)) return new Error('quantity', 'INVALID_VALUE', quantity);
        } else if (typeof quantity !== 'number') return new Error('quantity', 'WRONG_TYPE', quantity, 'Number');

        let exchangeInfo_symbol;

        if (exchangeInfo === null) {

            exchangeInfo = await this.exchangeInfo_mapped()
            if (exchangeInfo.error) return exchangeInfo;
            if (!exchangeInfo.symbols[symbol]) return new Error(`${symbol} wasn't found in exchangeInfo. If the symbol is newly listed it could a while to show up on exchangeInfo`);
            exchangeInfo_symbol = exchangeInfo.symbols[symbol];

        } else {

            if (!exchangeInfo.symbols[symbol]) {
                exchangeInfo = await this.exchangeInfo_mapped();
                if (exchangeInfo.error) return exchangeInfo;
                if (!exchangeInfo.symbols[symbol]) return new Error(`${symbol} wasn't found in exchangeInfo. If the symbol is newly listed it could a while to show up on exchangeInfo`);
            }
            exchangeInfo_symbol = exchangeInfo.symbols[symbol];
        }

        return this.toFixed(quantity, exchangeInfo_symbol.quantityPrecision)
    }

    /**
     * - Use this function to convert a symbol's `quantity` to the valid `pricePrecision`
     * - The first request using this method will take longer if `exchangeInfo()` or `exchangeInfo_mapped()` where never fetched since exchangeInfo is needed for the calculations.
     * @param {string} symbol
     * @param {number} price
     * @returns {Promise < number >}
     */
    async convert_toValid_pricePrecision(symbol, price) {

        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof price === 'undefined') return new Error('price', 'REQUIRED');
        else if (typeof price === 'string') {
            price = parseFloat(price);
            if (isNaN(price)) return new Error('price', 'INVALID_VALUE', price);
        } else if (typeof price !== 'number') return new Error('price', 'WRONG_TYPE', price, 'Number');

        let exchangeInfo_symbol;

        if (exchangeInfo === null) {

            exchangeInfo = await this.exchangeInfo_mapped()
            if (exchangeInfo.error) return exchangeInfo;
            if (!exchangeInfo.symbols[symbol]) return new Error(`${symbol} wasn't found in exchangeInfo. If the symbol is newly listed it could a while to show up on exchangeInfo`);
            exchangeInfo_symbol = exchangeInfo.symbols[symbol];

        } else {

            if (!exchangeInfo.symbols[symbol]) {
                exchangeInfo = await this.exchangeInfo_mapped();
                if (exchangeInfo.error) return exchangeInfo;
                if (!exchangeInfo.symbols[symbol]) return new Error(`${symbol} wasn't found in exchangeInfo. If the symbol is newly listed it could a while to show up on exchangeInfo`);
            }
            exchangeInfo_symbol = exchangeInfo.symbols[symbol];
        }

        return this.toFixed(price, exchangeInfo_symbol.pricePrecision)
    }



    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Order modify function, currently only `LIMIT` order modification is supported, modified orders will be reordered in the match queue
     * - Weight: `1`
     * - Either `orderId` or `origClientOrderId` must be sent, and the `orderId` will prevail if both are sent.
     * - Both `quantity` and `price` must be sent, which is different from `dapi` modify order endpoint.
     * - When the new `quantity` or `price` doesn't satisfy `PRICE_FILTER` / `PERCENT_FILTER` / `LOT_SIZE`, amendment will be rejected and the order will stay as it is.
     * - However the order will be cancelled by the amendment in the following situations: when the order is in partially filled status and the `new quantity` <= `executedQty` When the order is `GTX` and the new `price` will cause it to be executed immediately
     * - when the order is in partially filled status and the `new quantity` <= `executedQty`
     * - When the order is `GTX` and the new `price` will cause it to be executed immediately
     * - One order can only be modfied for less than `10000` times
     * @param {string} symbol
     * @param {Futures_OrderSide} side  - SELL , BUY
     * @param {number} quantity  - Order quantity, cannot be sent with closePosition=true
     * @param {number} price
     * @param {number | undefined} orderId
     * @param {string | undefined} origClientOrderId
     * @returns { Promise < {"orderId":20072994037,"symbol":"BTCUSDT","pair":"BTCUSDT","status":"NEW","clientOrderId":"LJ9R4QZDihCaS8UAOOLpgW","price":"30005","avgPrice":"0.0","origQty":"1","executedQty":"0","cumQty":"0","cumBase":"0","timeInForce":"GTC","type":"LIMIT","reduceOnly":false,"closePosition":false,"side":"BUY","positionSide":"LONG","stopPrice":"0","workingType":"CONTRACT_PRICE","priceProtect":false,"origType":"LIMIT","updateTime":1629182711600} > }
     * - 
     * @since v3.0.0
     */
    async modify_order(symbol, side, quantity, price, orderId, origClientOrderId) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

        if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

        if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

        const resp = await this.request('PUT', '/fapi/v1/order', { symbol, side, quantity, price, orderId, origClientOrderId }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `5`
     * - Example: `/fapi/v1/batchOrders?batchOrders=[{"type":"LIMIT","timeInForce":"GTC", "symbol":"BTCUSDT","side":"BUY","price":"10001","quantity":"0.001"}]`
     * - Paremeter rules are same with `New Order`
     * - Batch orders are processed concurrently, and the order of matching is not guaranteed.
     * - The order of returned contents for batch orders is the same as the order of the order list.
     * @param {{}[]} batchOrders  - order list. Max `5` orders
     * @returns { Promise < Futures_Order[] > }
     * - 
     * @since v3.0.0
    */
    async batchOrder(batchOrders) {
        // Expects (HMAC SHA256)
        if (!Array.isArray(batchOrders)) return new Error('batchOrders', 'WRONG_TYPE', batchOrders, 'Array');
        if (!batchOrders.every(item => typeof item === 'object')) return new Error(`Elements of 'batchOrders' must be of type 'Object'`);
        batchOrders = batchOrders.map(item => {
            for (const [key, value] of Object.entries(item)) {
                if (typeof value === 'number') item[key] = value.toString();
            }
            return item;
        })

        if (batchOrders.length > 5) {
            let batches_ofBatches = [];
            while (batchOrders.length > 0) batches_ofBatches.push(batchOrders.splice(0, 5));

            let responses = [];
            for await (const batch of batches_ofBatches) responses.push(...(await this.batchOrder(batch)));
            return responses;
        } else return this.request('POST', '/fapi/v1/batchOrders', { batchOrders }, 'TRADE');
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `5`
     * - Parameter rules are same with `Modify Order`
     * - Batch modify orders are processed concurrently, and the order of matching is not guaranteed.
     * - The order of returned contents for batch modify orders is the same as the order of the order list.
     * - One order can only be modfied for less than `10000` times
     * @param {{}[]} batchOrders  - order list. Max `5` orders
     * @returns { Promise < Futures_Order[] > }
     * - 
     * @since v3.0.0
    */
    async modify_multipleOrders(batchOrders) {
        // Expects (HMAC SHA256)
        if (!Array.isArray(batchOrders)) return new Error('batchOrders', 'WRONG_TYPE', batchOrders, 'Array');
        if (!batchOrders.every(item => typeof item === 'object')) return new Error(`Elements of 'batchOrders' must be of type 'Object'`);
        batchOrders = batchOrders.map(item => {
            for (const [key, value] of Object.entries(item)) {
                if (typeof value === 'number') item[key] = value.toString();
            }
            return item;
        })

        if (batchOrders.length > 5) {
            let batches_ofBatches = [];
            while (batchOrders.length > 0) batches_ofBatches.push(batchOrders.splice(0, 5));

            let responses = [];
            for await (const batch of batches_ofBatches) responses.push(...(await this.batchOrder(batch)));
            return responses;
        } else return this.request('PUT', '/fapi/v1/batchOrders', { batchOrders }, 'TRADE');
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get order modification history
     * - Weight: `1`
     * - Notes:
     * - Either `orderId` or `origClientOrderId` must be sent, and the `orderId` will prevail if both are sent.
     * @param {string} symbol
     * @param {number | undefined} limit  - Default `50`; max `100`
     * @param {number | undefined} orderId
     * @param {string | undefined} origClientOrderId
     * @param {number | undefined} startTime  - Timestamp in `ms` to get modification history from INCLUSIVE
     * @param {number | undefined} endTime  - Timestamp in `ms` to get modification history until INCLUSIVE
     * @returns { Promise < [{"amendmentId":5363,"symbol":"BTCUSDT","pair":"BTCUSDT","orderId":20072994037,"clientOrderId":"LJ9R4QZDihCaS8UAOOLpgW","time":1629184560899,"amendment":{"price":{"before":"30004","after":"30003.2"},"origQty":{"before":"1","after":"1"},"count":3}},{"amendmentId":5361,"symbol":"BTCUSDT","pair":"BTCUSDT","orderId":20072994037,"clientOrderId":"LJ9R4QZDihCaS8UAOOLpgW","time":1629184533946,"amendment":{"price":{"before":"30005","after":"30004"},"origQty":{"before":"1","after":"1"},"count":2}},{"amendmentId":5325,"symbol":"BTCUSDT","pair":"BTCUSDT","orderId":20072994037,"clientOrderId":"LJ9R4QZDihCaS8UAOOLpgW","time":1629182711787,"amendment":{"price":{"before":"30002","after":"30005"},"origQty":{"before":"1","after":"1"},"count":1}}] > }
    */
    async get_modifyOrder_history(symbol, limit, orderId, origClientOrderId, startTime, endTime) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/orderAmendment', { symbol, limit, orderId, origClientOrderId, startTime, endTime }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Check an order's status.
     * - Weight: `1`
     * - Notes:
     * - These orders will not be found: order status is `CANCELED` or `EXPIRED` , AND order has NO filled trade, AND created time + `3` days < current time
     * - order status is `CANCELED` or `EXPIRED` , AND
     * - order has NO filled trade, AND
     * - created time + `3` days < current time
     * - Either orderId or origClientOrderId must be sent.
     * - orderId is self-increment for each specific symbol
     * @param {string} symbol
     * @param {number | undefined} orderId
     * @param {string | undefined} origClientOrderId
     * @returns { Promise < Futures_Order > }
    */
    async query_order(symbol, orderId, origClientOrderId) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/order', { symbol, orderId, origClientOrderId }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Cancel an active order.
     * - Weight: `1`
     * - Either orderId or origClientOrderId must be sent.
     * @param {string} symbol
     * @param {number | undefined} orderId
     * @param {string | undefined} origClientOrderId
     * @returns { Promise < Futures_Order > }
    */
    async cancel_order(symbol, orderId, origClientOrderId) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('DELETE', '/fapi/v1/order', { symbol, orderId, origClientOrderId }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `1`
     * @param {string} symbol
     * @returns { Promise < {"code":200,"msg":"The operation of cancel all open order is done."} > }
    */
    async cancel_allOpenOrders(symbol) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('DELETE', '/fapi/v1/allOpenOrders', { symbol }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `1`
     * - Either orderIdList or origClientOrderIdList must be sent.
     * @param {string} symbol
     * @param {string[] | undefined} orderIdList  - max length `10` e.g. [`1234567`,`2345678`]
     * @param {string[] | undefined} origClientOrderIdList  - max length `10` e.g. `["my_id_1","my_id_2"]`, encode the double quotes. No space after comma.
     * @returns { Promise < Futures_Order[] > }
    */
    async cancel_multipleOrders(symbol, orderIdList, origClientOrderIdList) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('DELETE', '/fapi/v1/batchOrders', { symbol, orderIdList, origClientOrderIdList }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Cancel all open orders of the specified `symbol` at the end of the specified countdown.
     * - Weight: `10`
     * - The endpoint should be called repeatedly as heartbeats so that the existing countdown time can be canceled and replaced by a new one.
     * - Example usage: Call this endpoint at `30s` intervals with an `countdownTime` of `120000` (`120s`). If this endpoint is not called within `120` seconds, all your orders of the specified `symbol` will be automatically canceled. If this endpoint is called with an `countdownTime` of `0`, the countdown timer will be stopped.
     * - The system will check all countdowns approximately every `10` milliseconds , so please note that sufficient redundancy should be considered when using this function. We do not recommend setting the countdown time to be too precise or too small.
     * - The endpoint should be called repeatedly as heartbeats so that the existing countdown time can be canceled and replaced by a new one.
     * - Example usage: Call this endpoint at `30s` intervals with an `countdownTime` of `120000` (`120s`). If this endpoint is not called within `120` seconds, all your orders of the specified `symbol` will be automatically canceled. If this endpoint is called with an `countdownTime` of `0`, the countdown timer will be stopped.
     * - The system will check all countdowns approximately every `10` milliseconds , so please note that sufficient redundancy should be considered when using this function. We do not recommend setting the countdown time to be too precise or too small.
     * @param {string} symbol
     * @param {number} countdownTime  - countdown time, `1000` for `1` second. `0` to cancel the timer
     * @returns { Promise < {"symbol":"BTCUSDT","countdownTime":"100000"} > }
    */
    async autoCancelAll_openOrders(symbol, countdownTime) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof countdownTime === 'undefined') return new Error('countdownTime', 'REQUIRED');

        const resp = await this.request('POST', '/fapi/v1/countdownCancelAll', { symbol, countdownTime }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `1`
     * - Either orderId or origClientOrderId must be sent
     * - If the queried order has been filled or cancelled, the error message "Order does not exist" will be returned.
     * @param {string} symbol
     * @param {number | undefined} orderId
     * @param {string | undefined} origClientOrderId
     * @returns { Promise < Futures_Order > }
    */
    async query_current_openOrder(symbol, orderId, origClientOrderId) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/openOrder', { symbol, orderId, origClientOrderId }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get all open orders on a `symbol`. Careful when accessing this with no `symbol`.
     * - Weight: `1` for a single `symbol`; `40` when the `symbol` parameter is omitted
     * - If the `symbol` is not sent, orders for all symbols will be returned in an array.
     * @param {string | undefined} symbol
     * @returns { Promise < Futures_Order[] > }
    */
    async query_all_openOrders(symbol) {
        // Expects (HMAC SHA256)
        const resp = await this.request('GET', '/fapi/v1/openOrders', { symbol }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get all account orders; active, canceled, or filled.
     * - Weight: `5`
     * - These orders will not be found: order status is `CANCELED` or `EXPIRED` , AND order has NO filled trade, AND `created time` + `3 days` < `current time`
     * - order status is `CANCELED` or `EXPIRED` , AND
     * - order has NO filled trade, AND
     * - `created time + 3 days < current time`
     * - If orderId is set, it will get orders >= that orderId . Otherwise most recent orders are returned.
     * - The query time period must be less then `7 days`( default as the recent `7 days`).
     * @param {string} symbol
     * @param {number | undefined} limit  - Default `500`; max `1000`.
     * @param {number | undefined} orderId
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < Futures_Order[] > }
    */
    async query_all_orders(symbol, limit, orderId, startTime, endTime) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/allOrders', { symbol, limit, orderId, startTime, endTime }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `5`
     * @returns { Promise < Futures_Balance > }
    */
    async balance() {
        // Expects (HMAC SHA256)
        const resp = await this.request('GET', '/fapi/v2/balance', {}, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - single-asset mode
     * - OR multi-assets mode
     * - Get current account information. User in single-asset/ multi-assets mode will see different value, see comments in response section for detail.
     * - Weight: `5`
     * @returns { Promise < Futures_Account > }
    */
    async account() {
        // Expects (HMAC SHA256)
        const resp = await this.request('GET', '/fapi/v2/account', {}, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Change user's initial `leverage` of specific `symbol` market.
     * - Weight: `1`
     * @param {string} symbol
     * @param {number} leverage  - target initial leverage: int from `1` to `125`
     * @returns { Promise < {"leverage":21,"maxNotionalValue":"1000000","symbol":"BTCUSDT"} > }
    */
    async change_leverage(symbol, leverage) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof leverage === 'undefined') return new Error('leverage', 'REQUIRED');

        const resp = await this.request('POST', '/fapi/v1/leverage', { symbol, leverage }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `1`
     * @param {string} symbol
     * @param {Futures_marginType} marginType  - `ISOLATED`, `CROSSED`
     * @returns { Promise < {"code":200,"msg":"success"} > }
    */
    async change_marginType(symbol, marginType) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof marginType === 'undefined') return new Error('marginType', 'REQUIRED');

        const resp = await this.request('POST', '/fapi/v1/marginType', { symbol, marginType }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `1`
     * - Only for isolated `symbol`
     * @param {string} symbol
     * @param {number} amount
     * @param {'1'|'2'} type  - `1`: Add position margin,`2`: Reduce position margin
     * @param {Futures_PositionSide | undefined} positionSide  - Default BOTH for One-way Mode ; LONG or SHORT for Hedge Mode. It must be sent with Hedge Mode.
     * @returns { Promise < {"amount":100,"code":200,"msg":"Successfully modify position margin.","type":1} > }
    */
    async modify_isolatedPositionMargin(symbol, amount, type, positionSide) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

        if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

        const resp = await this.request('POST', '/fapi/v1/positionMargin', { symbol, amount, type, positionSide }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `1`
     * @param {string} symbol
     * @param {number | undefined} limit  - Default: `500`
     * @param {number | undefined} type  - `1`: Add position margin,`2`: Reduce position margin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < [{"symbol":"BTCUSDT","type":1,"deltaType":"USER_ADJUST","amount":"23.36332311","asset":"USDT","time":1578047897183,"positionSide":"BOTH"},{"symbol":"BTCUSDT","type":1,"deltaType":"USER_ADJUST","amount":"100","asset":"USDT","time":1578047900425,"positionSide":"LONG"}] > }
    */
    async get_positionMargin_history(symbol, limit, type, startTime, endTime) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/positionMargin/history', { symbol, limit, type, startTime, endTime }, 'TRADE');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - For One-way position mode:
     * - For Hedge position mode:
     * - Get current position information.
     * - Weight: `5`
     * @param {string | undefined} symbol
     * @returns { Promise < Futures_PositionInfo[] > }
    */
    async positions_info(symbol) {
        // Expects (HMAC SHA256)
        const resp = await this.request('GET', '/fapi/v2/positionRisk', { symbol }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - For One-way position mode:
     * - For Hedge position mode:
     * - Get current position information.
     * - Weight: `5`
     * - **NOTE**: Please use with user data stream `ACCOUNT_UPDATE` to meet your timeliness and accuracy needs.
     * @param {string | undefined} symbol
     * @returns { Promise < Futures_PositionInfo[] > }
    */
    async openPositions_info(symbol) {
        // Expects (HMAC SHA256)
        const resp = await this.positions_info(symbol);
        if (resp.error) return resp;

        return resp.filter(item => item.positionAmt.parseFloat() !== 0);
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get trades for a specific account and `symbol`.
     * - Weight: `5`
     * - If startTime and endTime are both not sent, then the last `7` days' data will be returned.
     * - The time between startTime and endTime cannot be longer than `7` days.
     * - The parameter fromId cannot be sent with startTime or endTime .
     * @param {string} symbol
     * @param {number | undefined} limit  - Default `500`; max `1000`.
     * @param {number | undefined} orderId  - This can only be used in combination with symbol
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} fromId  - Trade id to fetch from. Default gets most recent trades.
     * @returns { Promise < [{"buyer":false,"commission":"-0.07819010","commissionAsset":"USDT","id":698759,"maker":false,"orderId":25851813,"price":"7819.01","qty":"0.002","quoteQty":"15.63802","realizedPnl":"-0.91539999","side":"SELL","positionSide":"SHORT","symbol":"BTCUSDT","time":1569514978020}] > }
    */
    async userTrades(symbol, limit, orderId, startTime, endTime, fromId) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/userTrades', { symbol, limit, orderId, startTime, endTime, fromId }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `30`
     * - If neither startTime nor endTime is sent, the recent `7`-day data will be returned.
     * - If incomeType is not sent, all kinds of flow will be returned
     * - "trandId" is unique in the same `incomeType` for a user
     * - Income history only contains data for the last three months
     * @param {number | undefined} limit  - Default `100`; max `1000`
     * @param {string | undefined} symbol
     * @param {Futures_incomeType | undefined} incomeType  - TRANSFER, WELCOME_BONUS, REALIZED_PNL, FUNDING_FEE, COMMISSION, INSURANCE_CLEAR, REFERRAL_KICKBACK, COMMISSION_REBATE, API_REBATE, CONTEST_REWARD, CROSS_COLLATERAL_TRANSFER, OPTIONS_PREMIUM_FEE, OPTIONS_SETTLE_PROFIT, INTERNAL_TRANSFER, AUTO_EXCHANGE, DELIVERED_SETTELMENT, COIN_SWAP_DEPOSIT, COIN_SWAP_WITHDRAW, POSITION_LIMIT_INCREASE_FEE
     * @param {number | undefined} startTime  - Timestamp in ms to get funding from INCLUSIVE.
     * @param {number | undefined} endTime  - Timestamp in ms to get funding until INCLUSIVE.
     * @returns { Promise < [{"symbol":"","incomeType":"TRANSFER","income":"-0.37500000","asset":"USDT","info":"TRANSFER","time":1570608000000,"tranId":"9689322392","tradeId":""},{"symbol":"BTCUSDT","incomeType":"COMMISSION","income":"-0.01000000","asset":"USDT","info":"COMMISSION","time":1570636800000,"tranId":"9689322392","tradeId":"2059192"}] > }
    */
    async get_incomeHistory(symbol, incomeType, limit, startTime, endTime) {
        // Expects (HMAC SHA256)
        const resp = await this.request('GET', '/fapi/v1/income', { limit, symbol, incomeType, startTime, endTime }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `1`
     * @param {string | undefined} symbol
     * @returns { Promise < Futures_Leverage_Notional > }
    */
    async leverage_notional_brackets(symbol) {

        const resp = await this.request('GET', '/fapi/v1/leverageBracket', { symbol }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `1`
     * @returns { Promise < Futures_Leverage_Notional[] > }
    */
    async all_leverage_notional_brackets() {
        return this.leverage_notional_brackets();
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `5`
     * - Values update every `30`s.
     * - Values `0`, `1`, `2`, `3`, `4` shows the queue position and possibility of ADL from low to high.
     * - For positions of the `symbol` are in One-way Mode or isolated margined in Hedge Mode, "LONG", "SHORT", and "BOTH" will be returned to show the positions' adl quantiles of different position sides.
     * - If the positions of the `symbol` are crossed margined in Hedge Mode:
     * - Values update every `30`s.
     * - Values `0`, `1`, `2`, `3`, `4` shows the queue position and possibility of ADL from low to high.
     * - For positions of the `symbol` are in One-way Mode or isolated margined in Hedge Mode, "LONG", "SHORT", and "BOTH" will be returned to show the positions' adl quantiles of different position sides.
     * - If the positions of the `symbol` are crossed margined in Hedge Mode: "HEDGE" as a sign will be returned instead of "BOTH"; A same value caculated on unrealized pnls on long and short sides' positions will be shown for "LONG" and "SHORT" when there are positions in both of long and short sides.
     * - "HEDGE" as a sign will be returned instead of "BOTH";
     * - A same value caculated on unrealized pnls on long and short sides' positions will be shown for "LONG" and "SHORT" when there are positions in both of long and short sides.
     * @param {string | undefined} symbol
     * @returns { Promise < [{"symbol":"ETHUSDT","adlQuantile":{"LONG":3,"SHORT":3,"HEDGE":0}},{"symbol":"BTCUSDT","adlQuantile":{"LONG":1,"SHORT":2,"BOTH":0}}] > }
    */
    async position_adl_quantile_estimation(symbol) {

        const resp = await this.request('GET', '/fapi/v1/adlQuantile', { symbol }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `20` with `symbol`, `50` without `symbol`
     * - If "`autoCloseType`" is not sent, orders with both of the types will be returned
     * - If "`startTime`" is not sent, data within `7` days before "`endTime`" can be queried
     * @param {number | undefined} limit  - Default `50`; max `100`.
     * @param {string | undefined} symbol
     * @param {'LIQUIDATION' | 'ADL' | undefined} autoCloseType  - "LIQUIDATION" for liquidation orders, "ADL" for ADL orders.
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < Futures_Order[] > }
    */
    async user_forceOrders(limit, symbol, autoCloseType, startTime, endTime) {

        const resp = await this.request('GET', '/fapi/v1/forceOrders', { limit, symbol, autoCloseType, startTime, endTime }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Or (account violation triggered)
     * - For more information on this, please refer to the Futures Trading Quantitative Rules
     * - `1` for a single `symbol`
     * - `10` when the `symbol` parameter is omitted
     * @param {string | undefined} symbol
     * @returns { Promise < {"indicators":{"ACCOUNT":[{"indicator":"TMV","value":10,"triggerValue":1,"plannedRecoverTime":1644919865000,"isLocked":true}]},"updateTime":1644913304748} > }
    */
    async futures_trading_quantitative_rules_indicators(symbol) {

        const resp = await this.request('GET', '/fapi/v1/apiTradingStatus', { symbol }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `20`
     * @param {string} symbol
     * @returns { Promise < {"symbol":"BTCUSDT","makerCommissionRate":"0.0002","takerCommissionRate":"0.0004"} > }
    */
    async user_commissionRate(symbol) {
        // Expects (HMAC SHA256)
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/commissionRate', { symbol }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight: `5`
     * - Request Limitation is `5` times per month, shared by front end download page and rest api
     * @param {number} startTime
     * @param {number} endTime
     * @returns { Promise < {
     * "avgCostTimestampOfLast30d":7241837,
     * "downloadId":"546975389218332672"} 
     * > 
     * }
    */
    async get_download_id_for_futures_transaction_history(startTime, endTime) {
        // Expects (HMAC SHA256)
        if (typeof startTime === 'undefined') return new Error('startTime', 'REQUIRED');

        if (typeof endTime === 'undefined') return new Error('endTime', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/income/asyn', { startTime, endTime }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - OR (Response when server is processing)
     * - Weight: `5`
     * - Download link expiration: `24`h
     * @param {string} downloadId  - get by download id api
     * @returns { Promise < 
     *      {
     *          "downloadId":"545923594199212032",
     *          "status":"completed"|"processing",
     *          "url":"www.binance.com"|"",
     *          "notified":true, 
     *          "expirationTimestamp":number|-1,
     *          "isExpired":null
     *      }
     *  > 
     * }
    */
    async get_futures_transaction_history_download_link_by_id(downloadId) {
        // Expects (HMAC SHA256)
        if (typeof downloadId === 'undefined') return new Error('downloadId', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/income/asyn/id', { downloadId }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES `APIKEY`
     * - Start a new user data stream. The stream will close after `60` minutes unless a keepalive is sent. If the account has an active `listenKey` , that `listenKey` will be returned and its validity will be extended for `60` minutes.
     * - Weight: `1`
     * @returns { Promise < {"listenKey":"pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a65a1"} > }
    */
    async start_userData_stream() {

        const resp = await this.request('POST', '/fapi/v1/listenKey', {}, 'USER_STREAM');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES `APIKEY`
     * - Keepalive a user data stream to prevent a time out. User data streams will close after `60` minutes. It's recommended to send a ping about every `60` minutes.
     * - Weight: `1`
     * @returns { Promise < {} > }
    */
    async keepAlive_userData_stream() {

        const resp = await this.request('PUT', '/fapi/v1/listenKey', {}, 'USER_STREAM');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES `APIKEY`
     * - Close out a user data stream.
     * - Weight: `1`
     * @returns { Promise < {} > }
    */
    async close_userData_stream() {

        const resp = await this.request('DELETE', '/fapi/v1/listenKey', {}, 'USER_STREAM');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get Classic Portfolio Margin current account information.
     * - Weight(IP): `5`
     * - Here is the error JSON payload:
     * - Errors consist of two parts: an error code and a message. Codes are universal,but messages can vary.
     * - maxWithdrawAmount is for `asset` transfer out to the spot wallet.
     * @param {string} asset
     * @returns { Promise < {"maxWithdrawAmountUSD": "1627523.32459208", "asset": "BTC", "maxWithdrawAmount": "27.43689636"} > }
    */
    async classic_portfolio_margin_account_information(asset) {

        if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

        const resp = await this.request('GET', '/fapi/v1/pmAccountInfo', { asset }, 'USER_DATA');
        if (resp.error) return resp;

        return resp;
    }

    /**
     * @param {number} value 
     * @param {number} precision 
     * @returns {number}
     */
    toFixed(value, precision = 3) {
        return Math.floor((value * Math.pow(10, precision))) / Math.pow(10, precision);
    }

    // end of Futures API

    /**
     * @param {'GET'|'POST'|'DELETE'|'PUT'} method 
     * @param {string} path 
     * @param {Object.<string, any>} params 
     * @param {"NONE"|"USER_STREAM"|"MARKET_DATA"|"TRADE"|"USER_DATA"} type 
     * @param {Function} pre_adapter_cb
     */
    async request(method, path, params = {}, type, pre_adapter_cb = undefined) {
        let response;

        if (this.CONSTANTS.open_requestTypes.includes(type)) response = await this.requests.unsigned_request(method, this.baseURL, path, params, pre_adapter_cb);
        else if (this.CONSTANTS.requestTypes_APIKEY_ONLY.includes(type)) response = await this.requests.userData_request(method, this.baseURL, path, params, pre_adapter_cb);
        else if (this.CONSTANTS.requestTypes_SIGNED.includes(type)) response = await this.requests.signed_request(method, this.baseURL, path, params, pre_adapter_cb);
        if (response.isSuccess) return response.successData.data;
        else return {
            error: response.errorData
        }
    }

    // ERRORS

    ERRORS_CODES = {
        CODES: {
            '-1000': {
                code: -1000,
                name: 'UNKNOWN',
                description: ['An unknown error occured while processing the request.']
            },
            '-1001': {
                code: -1001,
                name: 'DISCONNECTED',
                description: [
                    'Internal error; unable to process your request. Please try again.'
                ]
            },
            '-1002': {
                code: -1002,
                name: 'UNAUTHORIZED',
                description: ['You are not authorized to execute this request.']
            },
            '-1003': {
                code: -1003,
                name: 'TOO_MANY_REQUESTS',
                description: [
                    'Too many requests queued.',
                    'Too many requests; please use the websocket for live updates.',
                    'Too many requests; current limit is %s requests per minute. Please use the websocket for live updates to avoid polling the API.',
                    'Way too many requests; IP banned until %s. Please use the websocket for live updates to avoid bans.'
                ]
            },
            '-1004': {
                code: -1004,
                name: 'DUPLICATE_IP',
                description: ['This IP is already on the white list']
            },
            '-1005': {
                code: -1005,
                name: 'NO_SUCH_IP',
                description: ['No such IP has been white listed']
            },
            '-1006': {
                code: -1006,
                name: 'UNEXPECTED_RESP',
                description: [
                    'An unexpected response was received from the message bus. Execution status unknown.'
                ]
            },
            '-1007': {
                code: -1007,
                name: 'TIMEOUT',
                description: [
                    'Timeout waiting for response from backend server. Send status unknown; execution status unknown.'
                ]
            },
            '-1010': {
                code: -1010,
                name: 'ERROR_MSG_RECEIVED',
                description: ['ERROR_MSG_RECEIVED.']
            },
            '-1011': {
                code: -1011,
                name: 'NON_WHITE_LIST',
                description: ['This IP cannot access this route.']
            },
            '-1013': {
                code: -1013,
                name: 'INVALID_MESSAGE',
                description: ['INVALID_MESSAGE.']
            },
            '-1014': {
                code: -1014,
                name: 'UNKNOWN_ORDER_COMPOSITION',
                description: ['Unsupported order combination.']
            },
            '-1015': {
                code: -1015,
                name: 'TOO_MANY_ORDERS',
                description: [
                    'Too many new orders.',
                    'Too many new orders; current limit is %s orders per %s.'
                ]
            },
            '-1016': {
                code: -1016,
                name: 'SERVICE_SHUTTING_DOWN',
                description: ['This service is no longer available.']
            },
            '-1020': {
                code: -1020,
                name: 'UNSUPPORTED_OPERATION',
                description: ['This operation is not supported.']
            },
            '-1021': {
                code: -1021,
                name: 'INVALID_TIMESTAMP',
                description: [
                    'Timestamp for this request is outside of the recvWindow.',
                    "Timestamp for this request was 1000ms ahead of the server's time."
                ]
            },
            '-1022': {
                code: -1022,
                name: 'INVALID_SIGNATURE',
                description: ['Signature for this request is not valid.']
            },
            '-1023': {
                code: -1023,
                name: 'START_TIME_GREATER_THAN_END_TIME',
                description: ['Start time is greater than end time.']
            },
            '-1100': {
                code: -1100,
                name: 'ILLEGAL_CHARS',
                description: [
                    'Illegal characters found in a parameter.',
                    "Illegal characters found in parameter '%s'; legal range is '%s'."
                ]
            },
            '-1101': {
                code: -1101,
                name: 'TOO_MANY_PARAMETERS',
                description: [
                    'Too many parameters sent for this endpoint.',
                    "Too many parameters; expected '%s' and received '%s'.",
                    'Duplicate values for a parameter detected.'
                ]
            },
            '-1102': {
                code: -1102,
                name: 'MANDATORY_PARAM_EMPTY_OR_MALFORMED',
                description: [
                    'A mandatory parameter was not sent, was empty/null, or malformed.',
                    "Mandatory parameter '%s' was not sent, was empty/null, or malformed.",
                    "Param '%s' or '%s' must be sent, but both were empty/null!"
                ]
            },
            '-1103': {
                code: -1103,
                name: 'UNKNOWN_PARAM',
                description: ['An unknown parameter was sent.']
            },
            '-1104': {
                code: -1104,
                name: 'UNREAD_PARAMETERS',
                description: [
                    'Not all sent parameters were read.',
                    "Not all sent parameters were read; read '%s' parameter(s) but was sent '%s'."
                ]
            },
            '-1105': {
                code: -1105,
                name: 'PARAM_EMPTY',
                description: ['A parameter was empty.', "Parameter '%s' was empty."]
            },
            '-1106': {
                code: -1106,
                name: 'PARAM_NOT_REQUIRED',
                description: [
                    'A parameter was sent when not required.',
                    "Parameter '%s' sent when not required."
                ]
            },
            '-1108': {
                code: -1108,
                name: 'BAD_ASSET',
                description: ['Invalid asset.']
            },
            '-1109': {
                code: -1109,
                name: 'BAD_ACCOUNT',
                description: ['Invalid account.']
            },
            '-1110': {
                code: -1110,
                name: 'BAD_INSTRUMENT_TYPE',
                description: ['Invalid symbolType.']
            },
            '-1111': {
                code: -1111,
                name: 'BAD_PRECISION',
                description: ['Precision is over the maximum defined for this asset.']
            },
            '-1112': {
                code: -1112,
                name: 'NO_DEPTH',
                description: ['No orders on book for symbol.']
            },
            '-1113': {
                code: -1113,
                name: 'WITHDRAW_NOT_NEGATIVE',
                description: ['Withdrawal amount must be negative.']
            },
            '-1114': {
                code: -1114,
                name: 'TIF_NOT_REQUIRED',
                description: ['TimeInForce parameter sent when not required.']
            },
            '-1115': {
                code: -1115,
                name: 'INVALID_TIF',
                description: ['Invalid timeInForce.']
            },
            '-1116': {
                code: -1116,
                name: 'INVALID_ORDER_TYPE',
                description: ['Invalid orderType.']
            },
            '-1117': {
                code: -1117,
                name: 'INVALID_SIDE',
                description: ['Invalid side.']
            },
            '-1118': {
                code: -1118,
                name: 'EMPTY_NEW_CL_ORD_ID',
                description: ['New client order ID was empty.']
            },
            '-1119': {
                code: -1119,
                name: 'EMPTY_ORG_CL_ORD_ID',
                description: ['Original client order ID was empty.']
            },
            '-1120': {
                code: -1120,
                name: 'BAD_INTERVAL',
                description: ['Invalid interval.']
            },
            '-1121': {
                code: -1121,
                name: 'BAD_SYMBOL',
                description: ['Invalid symbol.']
            },
            '-1125': {
                code: -1125,
                name: 'INVALID_LISTEN_KEY',
                description: [
                    'This listenKey does not exist. Please use POST /fapi/v1/listenKey to recreate listenKey'
                ]
            },
            '-1127': {
                code: -1127,
                name: 'MORE_THAN_XX_HOURS',
                description: [
                    'Lookup interval is too big.',
                    'More than %s hours between startTime and endTime.'
                ]
            },
            '-1128': {
                code: -1128,
                name: 'OPTIONAL_PARAMS_BAD_COMBO',
                description: ['Combination of optional parameters invalid.']
            },
            '-1130': {
                code: -1130,
                name: 'INVALID_PARAMETER',
                description: [
                    'Invalid data sent for a parameter.',
                    "Data sent for parameter '%s' is not valid."
                ]
            },
            '-1136': {
                code: -1136,
                name: 'INVALID_NEW_ORDER_RESP_TYPE',
                description: ['Invalid newOrderRespType.']
            },
            '-2010': {
                code: -2010,
                name: 'NEW_ORDER_REJECTED',
                description: ['NEW_ORDER_REJECTED']
            },
            '-2011': {
                code: -2011,
                name: 'CANCEL_REJECTED',
                description: ['CANCEL_REJECTED']
            },
            '-2013': {
                code: -2013,
                name: 'NO_SUCH_ORDER',
                description: ['Order does not exist.']
            },
            '-2014': {
                code: -2014,
                name: 'BAD_API_KEY_FMT',
                description: ['API-key format invalid.']
            },
            '-2015': {
                code: -2015,
                name: 'REJECTED_MBX_KEY',
                description: ['Invalid API-key, IP, or permissions for action.']
            },
            '-2016': {
                code: -2016,
                name: 'NO_TRADING_WINDOW',
                description: [
                    'No trading window could be found for the symbol. Try ticker/24hrs instead.'
                ]
            },
            '-2018': {
                code: -2018,
                name: 'BALANCE_NOT_SUFFICIENT',
                description: ['Balance is insufficient.']
            },
            '-2019': {
                code: -2019,
                name: 'MARGIN_NOT_SUFFICIEN',
                description: ['Margin is insufficient.']
            },
            '-2020': {
                code: -2020,
                name: 'UNABLE_TO_FILL',
                description: ['Unable to fill.']
            },
            '-2021': {
                code: -2021,
                name: 'ORDER_WOULD_IMMEDIATELY_TRIGGER',
                description: ['Order would immediately trigger.']
            },
            '-2022': {
                code: -2022,
                name: 'REDUCE_ONLY_REJECT',
                description: ['ReduceOnly Order is rejected.']
            },
            '-2023': {
                code: -2023,
                name: 'USER_IN_LIQUIDATION',
                description: ['User in liquidation mode now.']
            },
            '-2024': {
                code: -2024,
                name: 'POSITION_NOT_SUFFICIENT',
                description: ['Position is not sufficient.']
            },
            '-2025': {
                code: -2025,
                name: 'MAX_OPEN_ORDER_EXCEEDED',
                description: ['Reach max open order limit.']
            },
            '-2026': {
                code: -2026,
                name: 'REDUCE_ONLY_ORDER_TYPE_NOT_SUPPORTED',
                description: ['This OrderType is not supported when reduceOnly.']
            },
            '-2027': {
                code: -2027,
                name: 'MAX_LEVERAGE_RATIO',
                description: [
                    'Exceeded the maximum allowable position at current leverage.'
                ]
            },
            '-2028': {
                code: -2028,
                name: 'MIN_LEVERAGE_RATIO',
                description: [
                    'Leverage is smaller than permitted: insufficient margin balance.'
                ]
            },
            '-4000': {
                code: -4000,
                name: 'INVALID_ORDER_STATUS',
                description: ['Invalid order status.']
            },
            '-4001': {
                code: -4001,
                name: 'PRICE_LESS_THAN_ZERO',
                description: ['Price less than 0.']
            },
            '-4002': {
                code: -4002,
                name: 'PRICE_GREATER_THAN_MAX_PRICE',
                description: ['Price greater than max price.']
            },
            '-4003': {
                code: -4003,
                name: 'QTY_LESS_THAN_ZERO',
                description: ['Quantity less than zero.']
            },
            '-4004': {
                code: -4004,
                name: 'QTY_LESS_THAN_MIN_QTY',
                description: ['Quantity less than min quantity.']
            },
            '-4005': {
                code: -4005,
                name: 'QTY_GREATER_THAN_MAX_QTY',
                description: ['Quantity greater than max quantity.']
            },
            '-4006': {
                code: -4006,
                name: 'STOP_PRICE_LESS_THAN_ZERO',
                description: ['Stop price less than zero.']
            },
            '-4007': {
                code: -4007,
                name: 'STOP_PRICE_GREATER_THAN_MAX_PRICE',
                description: ['Stop price greater than max price.']
            },
            '-4008': {
                code: -4008,
                name: 'TICK_SIZE_LESS_THAN_ZERO',
                description: ['Tick size less than zero.']
            },
            '-4009': {
                code: -4009,
                name: 'MAX_PRICE_LESS_THAN_MIN_PRICE',
                description: ['Max price less than min price.']
            },
            '-4010': {
                code: -4010,
                name: 'MAX_QTY_LESS_THAN_MIN_QTY',
                description: ['Max qty less than min qty.']
            },
            '-4011': {
                code: -4011,
                name: 'STEP_SIZE_LESS_THAN_ZERO',
                description: ['Step size less than zero.']
            },
            '-4012': {
                code: -4012,
                name: 'MAX_NUM_ORDERS_LESS_THAN_ZERO',
                description: ['Max mum orders less than zero.']
            },
            '-4013': {
                code: -4013,
                name: 'PRICE_LESS_THAN_MIN_PRICE',
                description: ['Price less than min price.']
            },
            '-4014': {
                code: -4014,
                name: 'PRICE_NOT_INCREASED_BY_TICK_SIZE',
                description: ['Price not increased by tick size.']
            },
            '-4015': {
                code: -4015,
                name: 'INVALID_CL_ORD_ID_LEN',
                description: [
                    'Client order id is not valid.',
                    'Client order id length should not be more than 36 chars'
                ]
            },
            '-4016': {
                code: -4016,
                name: 'PRICE_HIGHTER_THAN_MULTIPLIER_UP',
                description: ['Price is higher than mark price multiplier cap.']
            },
            '-4017': {
                code: -4017,
                name: 'MULTIPLIER_UP_LESS_THAN_ZERO',
                description: ['Multiplier up less than zero.']
            },
            '-4018': {
                code: -4018,
                name: 'MULTIPLIER_DOWN_LESS_THAN_ZERO',
                description: ['Multiplier down less than zero.']
            },
            '-4019': {
                code: -4019,
                name: 'COMPOSITE_SCALE_OVERFLOW',
                description: ['Composite scale too large.']
            },
            '-4020': {
                code: -4020,
                name: 'TARGET_STRATEGY_INVALID',
                description: ["Target strategy invalid for orderType '%s',reduceOnly '%b'."]
            },
            '-4021': {
                code: -4021,
                name: 'INVALID_DEPTH_LIMIT',
                description: ['Invalid depth limit.', "'%s' is not valid depth limit."]
            },
            '-4022': {
                code: -4022,
                name: 'WRONG_MARKET_STATUS',
                description: ['market status sent is not valid.']
            },
            '-4023': {
                code: -4023,
                name: 'QTY_NOT_INCREASED_BY_STEP_SIZE',
                description: ['Qty not increased by step size.']
            },
            '-4024': {
                code: -4024,
                name: 'PRICE_LOWER_THAN_MULTIPLIER_DOWN',
                description: ['Price is lower than mark price multiplier floor.']
            },
            '-4025': {
                code: -4025,
                name: 'MULTIPLIER_DECIMAL_LESS_THAN_ZERO',
                description: ['Multiplier decimal less than zero.']
            },
            '-4026': {
                code: -4026,
                name: 'COMMISSION_INVALID',
                description: [
                    'Commission invalid.',
                    '%s less than zero.',
                    '%s absolute value greater than %s'
                ]
            },
            '-4027': {
                code: -4027,
                name: 'INVALID_ACCOUNT_TYPE',
                description: ['Invalid account type.']
            },
            '-4028': {
                code: -4028,
                name: 'INVALID_LEVERAGE',
                description: [
                    'Invalid leverage',
                    'Leverage %s is not valid',
                    'Leverage %s already exist with %s'
                ]
            },
            '-4029': {
                code: -4029,
                name: 'INVALID_TICK_SIZE_PRECISION',
                description: ['Tick size precision is invalid.']
            },
            '-4030': {
                code: -4030,
                name: 'INVALID_STEP_SIZE_PRECISION',
                description: ['Step size precision is invalid.']
            },
            '-4031': {
                code: -4031,
                name: 'INVALID_WORKING_TYPE',
                description: [
                    'Invalid parameter working type',
                    'Invalid parameter working type: %s'
                ]
            },
            '-4032': {
                code: -4032,
                name: 'EXCEED_MAX_CANCEL_ORDER_SIZE',
                description: [
                    'Exceed maximum cancel order size.',
                    'Invalid parameter working type: %s'
                ]
            },
            '-4033': {
                code: -4033,
                name: 'INSURANCE_ACCOUNT_NOT_FOUND',
                description: ['Insurance account not found.']
            },
            '-4044': {
                code: -4044,
                name: 'INVALID_BALANCE_TYPE',
                description: ['Balance Type is invalid.']
            },
            '-4045': {
                code: -4045,
                name: 'MAX_STOP_ORDER_EXCEEDED',
                description: ['Reach max stop order limit.']
            },
            '-4046': {
                code: -4046,
                name: 'NO_NEED_TO_CHANGE_MARGIN_TYPE',
                description: ['No need to change margin type.']
            },
            '-4047': {
                code: -4047,
                name: 'THERE_EXISTS_OPEN_ORDERS',
                description: ['Margin type cannot be changed if there exists open orders.']
            },
            '-4048': {
                code: -4048,
                name: 'THERE_EXISTS_QUANTITY',
                description: ['Margin type cannot be changed if there exists position.']
            },
            '-4049': {
                code: -4049,
                name: 'ADD_ISOLATED_MARGIN_REJECT',
                description: ['Add margin only support for isolated position.']
            },
            '-4050': {
                code: -4050,
                name: 'CROSS_BALANCE_INSUFFICIENT',
                description: ['Cross balance insufficient.']
            },
            '-4051': {
                code: -4051,
                name: 'ISOLATED_BALANCE_INSUFFICIENT',
                description: ['Isolated balance insufficient.']
            },
            '-4052': {
                code: -4052,
                name: 'NO_NEED_TO_CHANGE_AUTO_ADD_MARGIN',
                description: ['No need to change auto add margin.']
            },
            '-4053': {
                code: -4053,
                name: 'AUTO_ADD_CROSSED_MARGIN_REJECT',
                description: ['Auto add margin only support for isolated position.']
            },
            '-4054': {
                code: -4054,
                name: 'ADD_ISOLATED_MARGIN_NO_POSITION_REJECT',
                description: ['Cannot add position margin: position is 0.']
            },
            '-4055': {
                code: -4055,
                name: 'AMOUNT_MUST_BE_POSITIVE',
                description: ['Amount must be positive.']
            },
            '-4056': {
                code: -4056,
                name: 'INVALID_API_KEY_TYPE',
                description: ['Invalid api key type.']
            },
            '-4057': {
                code: -4057,
                name: 'INVALID_RSA_PUBLIC_KEY',
                description: ['Invalid api public key']
            },
            '-4058': {
                code: -4058,
                name: 'MAX_PRICE_TOO_LARGE',
                description: ['maxPrice and priceDecimal too large,please check.']
            },
            '-4059': {
                code: -4059,
                name: 'NO_NEED_TO_CHANGE_POSITION_SIDE',
                description: ['No need to change position side.']
            },
            '-4060': {
                code: -4060,
                name: 'INVALID_POSITION_SIDE',
                description: ['Invalid position side.']
            },
            '-4061': {
                code: -4061,
                name: 'POSITION_SIDE_NOT_MATCH',
                description: ["Order's position side does not match user's setting."]
            },
            '-4062': {
                code: -4062,
                name: 'REDUCE_ONLY_CONFLICT',
                description: ['Invalid or improper reduceOnly value.']
            },
            '-4063': {
                code: -4063,
                name: 'INVALID_OPTIONS_REQUEST_TYPE',
                description: ['Invalid options request type']
            },
            '-4064': {
                code: -4064,
                name: 'INVALID_OPTIONS_TIME_FRAME',
                description: ['Invalid options time frame']
            },
            '-4065': {
                code: -4065,
                name: 'INVALID_OPTIONS_AMOUNT',
                description: ['Invalid options amount']
            },
            '-4066': {
                code: -4066,
                name: 'INVALID_OPTIONS_EVENT_TYPE',
                description: ['Invalid options event type']
            },
            '-4067': {
                code: -4067,
                name: 'POSITION_SIDE_CHANGE_EXISTS_OPEN_ORDERS',
                description: [
                    'Position side cannot be changed if there exists open orders.'
                ]
            },
            '-4068': {
                code: -4068,
                name: 'POSITION_SIDE_CHANGE_EXISTS_QUANTITY',
                description: ['Position side cannot be changed if there exists position.']
            },
            '-4069': {
                code: -4069,
                name: 'INVALID_OPTIONS_PREMIUM_FEE',
                description: ['Invalid options premium fee']
            },
            '-4070': {
                code: -4070,
                name: 'INVALID_CL_OPTIONS_ID_LEN',
                description: [
                    'Client options id is not valid.',
                    'Client options id length should be less than 32 chars'
                ]
            },
            '-4071': {
                code: -4071,
                name: 'INVALID_OPTIONS_DIRECTION',
                description: ['Invalid options direction']
            },
            '-4072': {
                code: -4072,
                name: 'OPTIONS_PREMIUM_NOT_UPDATE',
                description: ['premium fee is not updated, reject order']
            },
            '-4073': {
                code: -4073,
                name: 'OPTIONS_PREMIUM_INPUT_LESS_THAN_ZERO',
                description: ['input premium fee is less than 0, reject order']
            },
            '-4074': {
                code: -4074,
                name: 'OPTIONS_AMOUNT_BIGGER_THAN_UPPER',
                description: [
                    'Order amount is bigger than upper boundary or less than 0, reject order'
                ]
            },
            '-4075': {
                code: -4075,
                name: 'OPTIONS_PREMIUM_OUTPUT_ZERO',
                description: ['output premium fee is less than 0, reject order']
            },
            '-4076': {
                code: -4076,
                name: 'OPTIONS_PREMIUM_TOO_DIFF',
                description: ['original fee is too much higher than last fee']
            },
            '-4077': {
                code: -4077,
                name: 'OPTIONS_PREMIUM_REACH_LIMIT',
                description: ['place order amount has reached to limit, reject order']
            },
            '-4078': {
                code: -4078,
                name: 'OPTIONS_COMMON_ERROR',
                description: ['options internal error']
            },
            '-4079': {
                code: -4079,
                name: 'INVALID_OPTIONS_ID',
                description: [
                    'invalid options id',
                    'invalid options id: %s',
                    'duplicate options id %d for user %d'
                ]
            },
            '-4080': {
                code: -4080,
                name: 'OPTIONS_USER_NOT_FOUND',
                description: ['user not found', 'user not found with id: %s']
            },
            '-4081': {
                code: -4081,
                name: 'OPTIONS_NOT_FOUND',
                description: ['options not found', 'options not found with id: %s']
            },
            '-4082': {
                code: -4082,
                name: 'INVALID_BATCH_PLACE_ORDER_SIZE',
                description: [
                    'Invalid number of batch place orders.',
                    'Invalid number of batch place orders: %s'
                ]
            },
            '-4083': {
                code: -4083,
                name: 'PLACE_BATCH_ORDERS_FAIL',
                description: ['Fail to place batch orders.']
            },
            '-4084': {
                code: -4084,
                name: 'UPCOMING_METHOD',
                description: ['Method is not allowed currently. Upcoming soon.']
            },
            '-4085': {
                code: -4085,
                name: 'INVALID_NOTIONAL_LIMIT_COEF',
                description: ['Invalid notional limit coefficient']
            },
            '-4086': {
                code: -4086,
                name: 'INVALID_PRICE_SPREAD_THRESHOLD',
                description: ['Invalid price spread threshold']
            },
            '-4087': {
                code: -4087,
                name: 'REDUCE_ONLY_ORDER_PERMISSION',
                description: ['User can only place reduce only order']
            },
            '-4088': {
                code: -4088,
                name: 'NO_PLACE_ORDER_PERMISSION',
                description: ['User can not place order currently']
            },
            '-4104': {
                code: -4104,
                name: 'INVALID_CONTRACT_TYPE',
                description: ['Invalid contract type']
            },
            '-4114': {
                code: -4114,
                name: 'INVALID_CLIENT_TRAN_ID_LEN',
                description: [
                    'clientTranId is not valid',
                    'Client tran id length should be less than 64 chars'
                ]
            },
            '-4115': {
                code: -4115,
                name: 'DUPLICATED_CLIENT_TRAN_ID',
                description: [
                    'clientTranId is duplicated',
                    'Client tran id should be unique within 7 days'
                ]
            },
            '-4118': {
                code: -4118,
                name: 'REDUCE_ONLY_MARGIN_CHECK_FAILED',
                description: [
                    'ReduceOnly Order Failed. Please check your existing position and open orders'
                ]
            },
            '-4131': {
                code: -4131,
                name: 'MARKET_ORDER_REJECT',
                description: [
                    "The counterparty's best price does not meet the PERCENT_PRICE filter limit"
                ]
            },
            '-4135': {
                code: -4135,
                name: 'INVALID_ACTIVATION_PRICE',
                description: ['Invalid activation price']
            },
            '-4137': {
                code: -4137,
                name: 'QUANTITY_EXISTS_WITH_CLOSE_POSITION',
                description: ['Quantity must be zero with closePosition equals true']
            },
            '-4138': {
                code: -4138,
                name: 'REDUCE_ONLY_MUST_BE_TRUE',
                description: ['Reduce only must be true with closePosition equals true']
            },
            '-4139': {
                code: -4139,
                name: 'ORDER_TYPE_CANNOT_BE_MKT',
                description: ["Order type can not be market if it's unable to cancel"]
            },
            '-4140': {
                code: -4140,
                name: 'INVALID_OPENING_POSITION_STATUS',
                description: ['Invalid symbol status for opening position']
            },
            '-4141': {
                code: -4141,
                name: 'SYMBOL_ALREADY_CLOSED',
                description: ['Symbol is closed']
            },
            '-4142': {
                code: -4142,
                name: 'STRATEGY_INVALID_TRIGGER_PRICE',
                description: [
                    'REJECT: take profit or stop order will be triggered immediately'
                ]
            },
            '-4144': {
                code: -4144,
                name: 'INVALID_PAIR',
                description: ['Invalid pair']
            },
            '-4161': {
                code: -4161,
                name: 'ISOLATED_LEVERAGE_REJECT_WITH_POSITION',
                description: [
                    'Leverage reduction is not supported in Isolated Margin Mode with open positions'
                ]
            },
            '-4164': {
                code: -4164,
                name: 'MIN_NOTIONAL',
                description: [
                    "Order's notional must be no smaller than 5.0 (unless you choose reduce only)",
                    "Order's notional must be no smaller than %s (unless you choose reduce only)"
                ]
            },
            '-4165': {
                code: -4165,
                name: 'INVALID_TIME_INTERVAL',
                description: ['Invalid time interval', 'Maximum time interval is %s days']
            },
            '-4183': {
                code: -4183,
                name: 'PRICE_HIGHTER_THAN_STOP_MULTIPLIER_UP',
                description: [
                    'Price is higher than stop price multiplier cap.',
                    "Limit price can't be higher than %s."
                ]
            },
            '-4184': {
                code: -4184,
                name: 'PRICE_LOWER_THAN_STOP_MULTIPLIER_DOWN',
                description: [
                    'Price is lower than stop price multiplier floor.',
                    "Limit price can't be lower than %s."
                ]
            },
            '-5021': {
                code: -5021,
                name: 'FOK_ORDER_REJECT',
                description: [
                    'Due to the order could not be filled immediately, the FOK order has been rejected.'
                ]
            },
            '-5022': {
                code: -5022,
                name: 'GTX_ORDER_REJECT',
                description: [
                    'Due to the order could not be executed as maker, the Post Only order will be rejected.'
                ]
            },
            '-5026': {
                code: -5026,
                name: 'Exceed_Maximum_Modify_Order_Limit',
                description: [
                    'The order has exceeded the maximum adjust limit, and no modifications are supported.'
                ]
            },
            '-5028': {
                code: -5028,
                name: 'ME_RECVWINDOW_REJECT',
                description: ['Timestamp for this request is outside of the ME recvWindow.']
            }
        },
        ERRORS: {
            UNKNOWN: {
                code: -1000,
                name: 'UNKNOWN',
                description: ['An unknown error occured while processing the request.']
            },
            DISCONNECTED: {
                code: -1001,
                name: 'DISCONNECTED',
                description: [
                    'Internal error; unable to process your request. Please try again.'
                ]
            },
            UNAUTHORIZED: {
                code: -1002,
                name: 'UNAUTHORIZED',
                description: ['You are not authorized to execute this request.']
            },
            TOO_MANY_REQUESTS: {
                code: -1003,
                name: 'TOO_MANY_REQUESTS',
                description: [
                    'Too many requests queued.',
                    'Too many requests; please use the websocket for live updates.',
                    'Too many requests; current limit is %s requests per minute. Please use the websocket for live updates to avoid polling the API.',
                    'Way too many requests; IP banned until %s. Please use the websocket for live updates to avoid bans.'
                ]
            },
            DUPLICATE_IP: {
                code: -1004,
                name: 'DUPLICATE_IP',
                description: ['This IP is already on the white list']
            },
            NO_SUCH_IP: {
                code: -1005,
                name: 'NO_SUCH_IP',
                description: ['No such IP has been white listed']
            },
            UNEXPECTED_RESP: {
                code: -1006,
                name: 'UNEXPECTED_RESP',
                description: [
                    'An unexpected response was received from the message bus. Execution status unknown.'
                ]
            },
            TIMEOUT: {
                code: -1007,
                name: 'TIMEOUT',
                description: [
                    'Timeout waiting for response from backend server. Send status unknown; execution status unknown.'
                ]
            },
            ERROR_MSG_RECEIVED: {
                code: -1010,
                name: 'ERROR_MSG_RECEIVED',
                description: ['ERROR_MSG_RECEIVED.']
            },
            NON_WHITE_LIST: {
                code: -1011,
                name: 'NON_WHITE_LIST',
                description: ['This IP cannot access this route.']
            },
            INVALID_MESSAGE: {
                code: -1013,
                name: 'INVALID_MESSAGE',
                description: ['INVALID_MESSAGE.']
            },
            UNKNOWN_ORDER_COMPOSITION: {
                code: -1014,
                name: 'UNKNOWN_ORDER_COMPOSITION',
                description: ['Unsupported order combination.']
            },
            TOO_MANY_ORDERS: {
                code: -1015,
                name: 'TOO_MANY_ORDERS',
                description: [
                    'Too many new orders.',
                    'Too many new orders; current limit is %s orders per %s.'
                ]
            },
            SERVICE_SHUTTING_DOWN: {
                code: -1016,
                name: 'SERVICE_SHUTTING_DOWN',
                description: ['This service is no longer available.']
            },
            UNSUPPORTED_OPERATION: {
                code: -1020,
                name: 'UNSUPPORTED_OPERATION',
                description: ['This operation is not supported.']
            },
            INVALID_TIMESTAMP: {
                code: -1021,
                name: 'INVALID_TIMESTAMP',
                description: [
                    'Timestamp for this request is outside of the recvWindow.',
                    "Timestamp for this request was 1000ms ahead of the server's time."
                ]
            },
            INVALID_SIGNATURE: {
                code: -1022,
                name: 'INVALID_SIGNATURE',
                description: ['Signature for this request is not valid.']
            },
            START_TIME_GREATER_THAN_END_TIME: {
                code: -1023,
                name: 'START_TIME_GREATER_THAN_END_TIME',
                description: ['Start time is greater than end time.']
            },
            ILLEGAL_CHARS: {
                code: -1100,
                name: 'ILLEGAL_CHARS',
                description: [
                    'Illegal characters found in a parameter.',
                    "Illegal characters found in parameter '%s'; legal range is '%s'."
                ]
            },
            TOO_MANY_PARAMETERS: {
                code: -1101,
                name: 'TOO_MANY_PARAMETERS',
                description: [
                    'Too many parameters sent for this endpoint.',
                    "Too many parameters; expected '%s' and received '%s'.",
                    'Duplicate values for a parameter detected.'
                ]
            },
            MANDATORY_PARAM_EMPTY_OR_MALFORMED: {
                code: -1102,
                name: 'MANDATORY_PARAM_EMPTY_OR_MALFORMED',
                description: [
                    'A mandatory parameter was not sent, was empty/null, or malformed.',
                    "Mandatory parameter '%s' was not sent, was empty/null, or malformed.",
                    "Param '%s' or '%s' must be sent, but both were empty/null!"
                ]
            },
            UNKNOWN_PARAM: {
                code: -1103,
                name: 'UNKNOWN_PARAM',
                description: ['An unknown parameter was sent.']
            },
            UNREAD_PARAMETERS: {
                code: -1104,
                name: 'UNREAD_PARAMETERS',
                description: [
                    'Not all sent parameters were read.',
                    "Not all sent parameters were read; read '%s' parameter(s) but was sent '%s'."
                ]
            },
            PARAM_EMPTY: {
                code: -1105,
                name: 'PARAM_EMPTY',
                description: ['A parameter was empty.', "Parameter '%s' was empty."]
            },
            PARAM_NOT_REQUIRED: {
                code: -1106,
                name: 'PARAM_NOT_REQUIRED',
                description: [
                    'A parameter was sent when not required.',
                    "Parameter '%s' sent when not required."
                ]
            },
            BAD_ASSET: {
                code: -1108,
                name: 'BAD_ASSET',
                description: ['Invalid asset.']
            },
            BAD_ACCOUNT: {
                code: -1109,
                name: 'BAD_ACCOUNT',
                description: ['Invalid account.']
            },
            BAD_INSTRUMENT_TYPE: {
                code: -1110,
                name: 'BAD_INSTRUMENT_TYPE',
                description: ['Invalid symbolType.']
            },
            BAD_PRECISION: {
                code: -1111,
                name: 'BAD_PRECISION',
                description: ['Precision is over the maximum defined for this asset.']
            },
            NO_DEPTH: {
                code: -1112,
                name: 'NO_DEPTH',
                description: ['No orders on book for symbol.']
            },
            WITHDRAW_NOT_NEGATIVE: {
                code: -1113,
                name: 'WITHDRAW_NOT_NEGATIVE',
                description: ['Withdrawal amount must be negative.']
            },
            TIF_NOT_REQUIRED: {
                code: -1114,
                name: 'TIF_NOT_REQUIRED',
                description: ['TimeInForce parameter sent when not required.']
            },
            INVALID_TIF: {
                code: -1115,
                name: 'INVALID_TIF',
                description: ['Invalid timeInForce.']
            },
            INVALID_ORDER_TYPE: {
                code: -1116,
                name: 'INVALID_ORDER_TYPE',
                description: ['Invalid orderType.']
            },
            INVALID_SIDE: {
                code: -1117,
                name: 'INVALID_SIDE',
                description: ['Invalid side.']
            },
            EMPTY_NEW_CL_ORD_ID: {
                code: -1118,
                name: 'EMPTY_NEW_CL_ORD_ID',
                description: ['New client order ID was empty.']
            },
            EMPTY_ORG_CL_ORD_ID: {
                code: -1119,
                name: 'EMPTY_ORG_CL_ORD_ID',
                description: ['Original client order ID was empty.']
            },
            BAD_INTERVAL: {
                code: -1120,
                name: 'BAD_INTERVAL',
                description: ['Invalid interval.']
            },
            BAD_SYMBOL: {
                code: -1121,
                name: 'BAD_SYMBOL',
                description: ['Invalid symbol.']
            },
            INVALID_LISTEN_KEY: {
                code: -1125,
                name: 'INVALID_LISTEN_KEY',
                description: [
                    'This listenKey does not exist. Please use POST /fapi/v1/listenKey to recreate listenKey'
                ]
            },
            MORE_THAN_XX_HOURS: {
                code: -1127,
                name: 'MORE_THAN_XX_HOURS',
                description: [
                    'Lookup interval is too big.',
                    'More than %s hours between startTime and endTime.'
                ]
            },
            OPTIONAL_PARAMS_BAD_COMBO: {
                code: -1128,
                name: 'OPTIONAL_PARAMS_BAD_COMBO',
                description: ['Combination of optional parameters invalid.']
            },
            INVALID_PARAMETER: {
                code: -1130,
                name: 'INVALID_PARAMETER',
                description: [
                    'Invalid data sent for a parameter.',
                    "Data sent for parameter '%s' is not valid."
                ]
            },
            INVALID_NEW_ORDER_RESP_TYPE: {
                code: -1136,
                name: 'INVALID_NEW_ORDER_RESP_TYPE',
                description: ['Invalid newOrderRespType.']
            },
            NEW_ORDER_REJECTED: {
                code: -2010,
                name: 'NEW_ORDER_REJECTED',
                description: ['NEW_ORDER_REJECTED']
            },
            CANCEL_REJECTED: {
                code: -2011,
                name: 'CANCEL_REJECTED',
                description: ['CANCEL_REJECTED']
            },
            NO_SUCH_ORDER: {
                code: -2013,
                name: 'NO_SUCH_ORDER',
                description: ['Order does not exist.']
            },
            BAD_API_KEY_FMT: {
                code: -2014,
                name: 'BAD_API_KEY_FMT',
                description: ['API-key format invalid.']
            },
            REJECTED_MBX_KEY: {
                code: -2015,
                name: 'REJECTED_MBX_KEY',
                description: ['Invalid API-key, IP, or permissions for action.']
            },
            NO_TRADING_WINDOW: {
                code: -2016,
                name: 'NO_TRADING_WINDOW',
                description: [
                    'No trading window could be found for the symbol. Try ticker/24hrs instead.'
                ]
            },
            BALANCE_NOT_SUFFICIENT: {
                code: -2018,
                name: 'BALANCE_NOT_SUFFICIENT',
                description: ['Balance is insufficient.']
            },
            MARGIN_NOT_SUFFICIENT: {
                code: -2019,
                name: 'MARGIN_NOT_SUFFICIEN',
                description: ['Margin is insufficient.']
            },
            UNABLE_TO_FILL: {
                code: -2020,
                name: 'UNABLE_TO_FILL',
                description: ['Unable to fill.']
            },
            ORDER_WOULD_IMMEDIATELY_TRIGGER: {
                code: -2021,
                name: 'ORDER_WOULD_IMMEDIATELY_TRIGGER',
                description: ['Order would immediately trigger.']
            },
            REDUCE_ONLY_REJECT: {
                code: -2022,
                name: 'REDUCE_ONLY_REJECT',
                description: ['ReduceOnly Order is rejected.']
            },
            USER_IN_LIQUIDATION: {
                code: -2023,
                name: 'USER_IN_LIQUIDATION',
                description: ['User in liquidation mode now.']
            },
            POSITION_NOT_SUFFICIENT: {
                code: -2024,
                name: 'POSITION_NOT_SUFFICIENT',
                description: ['Position is not sufficient.']
            },
            MAX_OPEN_ORDER_EXCEEDED: {
                code: -2025,
                name: 'MAX_OPEN_ORDER_EXCEEDED',
                description: ['Reach max open order limit.']
            },
            REDUCE_ONLY_ORDER_TYPE_NOT_SUPPORTED: {
                code: -2026,
                name: 'REDUCE_ONLY_ORDER_TYPE_NOT_SUPPORTED',
                description: ['This OrderType is not supported when reduceOnly.']
            },
            MAX_LEVERAGE_RATIO: {
                code: -2027,
                name: 'MAX_LEVERAGE_RATIO',
                description: [
                    'Exceeded the maximum allowable position at current leverage.'
                ]
            },
            MIN_LEVERAGE_RATIO: {
                code: -2028,
                name: 'MIN_LEVERAGE_RATIO',
                description: [
                    'Leverage is smaller than permitted: insufficient margin balance.'
                ]
            },
            INVALID_ORDER_STATUS: {
                code: -4000,
                name: 'INVALID_ORDER_STATUS',
                description: ['Invalid order status.']
            },
            PRICE_LESS_THAN_ZERO: {
                code: -4001,
                name: 'PRICE_LESS_THAN_ZERO',
                description: ['Price less than 0.']
            },
            PRICE_GREATER_THAN_MAX_PRICE: {
                code: -4002,
                name: 'PRICE_GREATER_THAN_MAX_PRICE',
                description: ['Price greater than max price.']
            },
            QTY_LESS_THAN_ZERO: {
                code: -4003,
                name: 'QTY_LESS_THAN_ZERO',
                description: ['Quantity less than zero.']
            },
            QTY_LESS_THAN_MIN_QTY: {
                code: -4004,
                name: 'QTY_LESS_THAN_MIN_QTY',
                description: ['Quantity less than min quantity.']
            },
            QTY_GREATER_THAN_MAX_QTY: {
                code: -4005,
                name: 'QTY_GREATER_THAN_MAX_QTY',
                description: ['Quantity greater than max quantity.']
            },
            STOP_PRICE_LESS_THAN_ZERO: {
                code: -4006,
                name: 'STOP_PRICE_LESS_THAN_ZERO',
                description: ['Stop price less than zero.']
            },
            STOP_PRICE_GREATER_THAN_MAX_PRICE: {
                code: -4007,
                name: 'STOP_PRICE_GREATER_THAN_MAX_PRICE',
                description: ['Stop price greater than max price.']
            },
            TICK_SIZE_LESS_THAN_ZERO: {
                code: -4008,
                name: 'TICK_SIZE_LESS_THAN_ZERO',
                description: ['Tick size less than zero.']
            },
            MAX_PRICE_LESS_THAN_MIN_PRICE: {
                code: -4009,
                name: 'MAX_PRICE_LESS_THAN_MIN_PRICE',
                description: ['Max price less than min price.']
            },
            MAX_QTY_LESS_THAN_MIN_QTY: {
                code: -4010,
                name: 'MAX_QTY_LESS_THAN_MIN_QTY',
                description: ['Max qty less than min qty.']
            },
            STEP_SIZE_LESS_THAN_ZERO: {
                code: -4011,
                name: 'STEP_SIZE_LESS_THAN_ZERO',
                description: ['Step size less than zero.']
            },
            MAX_NUM_ORDERS_LESS_THAN_ZERO: {
                code: -4012,
                name: 'MAX_NUM_ORDERS_LESS_THAN_ZERO',
                description: ['Max mum orders less than zero.']
            },
            PRICE_LESS_THAN_MIN_PRICE: {
                code: -4013,
                name: 'PRICE_LESS_THAN_MIN_PRICE',
                description: ['Price less than min price.']
            },
            PRICE_NOT_INCREASED_BY_TICK_SIZE: {
                code: -4014,
                name: 'PRICE_NOT_INCREASED_BY_TICK_SIZE',
                description: ['Price not increased by tick size.']
            },
            INVALID_CL_ORD_ID_LEN: {
                code: -4015,
                name: 'INVALID_CL_ORD_ID_LEN',
                description: [
                    'Client order id is not valid.',
                    'Client order id length should not be more than 36 chars'
                ]
            },
            PRICE_HIGHTER_THAN_MULTIPLIER_UP: {
                code: -4016,
                name: 'PRICE_HIGHTER_THAN_MULTIPLIER_UP',
                description: ['Price is higher than mark price multiplier cap.']
            },
            MULTIPLIER_UP_LESS_THAN_ZERO: {
                code: -4017,
                name: 'MULTIPLIER_UP_LESS_THAN_ZERO',
                description: ['Multiplier up less than zero.']
            },
            MULTIPLIER_DOWN_LESS_THAN_ZERO: {
                code: -4018,
                name: 'MULTIPLIER_DOWN_LESS_THAN_ZERO',
                description: ['Multiplier down less than zero.']
            },
            COMPOSITE_SCALE_OVERFLOW: {
                code: -4019,
                name: 'COMPOSITE_SCALE_OVERFLOW',
                description: ['Composite scale too large.']
            },
            TARGET_STRATEGY_INVALID: {
                code: -4020,
                name: 'TARGET_STRATEGY_INVALID',
                description: ["Target strategy invalid for orderType '%s',reduceOnly '%b'."]
            },
            INVALID_DEPTH_LIMIT: {
                code: -4021,
                name: 'INVALID_DEPTH_LIMIT',
                description: ['Invalid depth limit.', "'%s' is not valid depth limit."]
            },
            WRONG_MARKET_STATUS: {
                code: -4022,
                name: 'WRONG_MARKET_STATUS',
                description: ['market status sent is not valid.']
            },
            QTY_NOT_INCREASED_BY_STEP_SIZE: {
                code: -4023,
                name: 'QTY_NOT_INCREASED_BY_STEP_SIZE',
                description: ['Qty not increased by step size.']
            },
            PRICE_LOWER_THAN_MULTIPLIER_DOWN: {
                code: -4024,
                name: 'PRICE_LOWER_THAN_MULTIPLIER_DOWN',
                description: ['Price is lower than mark price multiplier floor.']
            },
            MULTIPLIER_DECIMAL_LESS_THAN_ZERO: {
                code: -4025,
                name: 'MULTIPLIER_DECIMAL_LESS_THAN_ZERO',
                description: ['Multiplier decimal less than zero.']
            },
            COMMISSION_INVALID: {
                code: -4026,
                name: 'COMMISSION_INVALID',
                description: [
                    'Commission invalid.',
                    '%s less than zero.',
                    '%s absolute value greater than %s'
                ]
            },
            INVALID_ACCOUNT_TYPE: {
                code: -4027,
                name: 'INVALID_ACCOUNT_TYPE',
                description: ['Invalid account type.']
            },
            INVALID_LEVERAGE: {
                code: -4028,
                name: 'INVALID_LEVERAGE',
                description: [
                    'Invalid leverage',
                    'Leverage %s is not valid',
                    'Leverage %s already exist with %s'
                ]
            },
            INVALID_TICK_SIZE_PRECISION: {
                code: -4029,
                name: 'INVALID_TICK_SIZE_PRECISION',
                description: ['Tick size precision is invalid.']
            },
            INVALID_STEP_SIZE_PRECISION: {
                code: -4030,
                name: 'INVALID_STEP_SIZE_PRECISION',
                description: ['Step size precision is invalid.']
            },
            INVALID_WORKING_TYPE: {
                code: -4031,
                name: 'INVALID_WORKING_TYPE',
                description: [
                    'Invalid parameter working type',
                    'Invalid parameter working type: %s'
                ]
            },
            EXCEED_MAX_CANCEL_ORDER_SIZE: {
                code: -4032,
                name: 'EXCEED_MAX_CANCEL_ORDER_SIZE',
                description: [
                    'Exceed maximum cancel order size.',
                    'Invalid parameter working type: %s'
                ]
            },
            INSURANCE_ACCOUNT_NOT_FOUND: {
                code: -4033,
                name: 'INSURANCE_ACCOUNT_NOT_FOUND',
                description: ['Insurance account not found.']
            },
            INVALID_BALANCE_TYPE: {
                code: -4044,
                name: 'INVALID_BALANCE_TYPE',
                description: ['Balance Type is invalid.']
            },
            MAX_STOP_ORDER_EXCEEDED: {
                code: -4045,
                name: 'MAX_STOP_ORDER_EXCEEDED',
                description: ['Reach max stop order limit.']
            },
            NO_NEED_TO_CHANGE_MARGIN_TYPE: {
                code: -4046,
                name: 'NO_NEED_TO_CHANGE_MARGIN_TYPE',
                description: ['No need to change margin type.']
            },
            THERE_EXISTS_OPEN_ORDERS: {
                code: -4047,
                name: 'THERE_EXISTS_OPEN_ORDERS',
                description: ['Margin type cannot be changed if there exists open orders.']
            },
            THERE_EXISTS_QUANTITY: {
                code: -4048,
                name: 'THERE_EXISTS_QUANTITY',
                description: ['Margin type cannot be changed if there exists position.']
            },
            ADD_ISOLATED_MARGIN_REJECT: {
                code: -4049,
                name: 'ADD_ISOLATED_MARGIN_REJECT',
                description: ['Add margin only support for isolated position.']
            },
            CROSS_BALANCE_INSUFFICIENT: {
                code: -4050,
                name: 'CROSS_BALANCE_INSUFFICIENT',
                description: ['Cross balance insufficient.']
            },
            ISOLATED_BALANCE_INSUFFICIENT: {
                code: -4051,
                name: 'ISOLATED_BALANCE_INSUFFICIENT',
                description: ['Isolated balance insufficient.']
            },
            NO_NEED_TO_CHANGE_AUTO_ADD_MARGIN: {
                code: -4052,
                name: 'NO_NEED_TO_CHANGE_AUTO_ADD_MARGIN',
                description: ['No need to change auto add margin.']
            },
            AUTO_ADD_CROSSED_MARGIN_REJECT: {
                code: -4053,
                name: 'AUTO_ADD_CROSSED_MARGIN_REJECT',
                description: ['Auto add margin only support for isolated position.']
            },
            ADD_ISOLATED_MARGIN_NO_POSITION_REJECT: {
                code: -4054,
                name: 'ADD_ISOLATED_MARGIN_NO_POSITION_REJECT',
                description: ['Cannot add position margin: position is 0.']
            },
            AMOUNT_MUST_BE_POSITIVE: {
                code: -4055,
                name: 'AMOUNT_MUST_BE_POSITIVE',
                description: ['Amount must be positive.']
            },
            INVALID_API_KEY_TYPE: {
                code: -4056,
                name: 'INVALID_API_KEY_TYPE',
                description: ['Invalid api key type.']
            },
            INVALID_RSA_PUBLIC_KEY: {
                code: -4057,
                name: 'INVALID_RSA_PUBLIC_KEY',
                description: ['Invalid api public key']
            },
            MAX_PRICE_TOO_LARGE: {
                code: -4058,
                name: 'MAX_PRICE_TOO_LARGE',
                description: ['maxPrice and priceDecimal too large,please check.']
            },
            NO_NEED_TO_CHANGE_POSITION_SIDE: {
                code: -4059,
                name: 'NO_NEED_TO_CHANGE_POSITION_SIDE',
                description: ['No need to change position side.']
            },
            INVALID_POSITION_SIDE: {
                code: -4060,
                name: 'INVALID_POSITION_SIDE',
                description: ['Invalid position side.']
            },
            POSITION_SIDE_NOT_MATCH: {
                code: -4061,
                name: 'POSITION_SIDE_NOT_MATCH',
                description: ["Order's position side does not match user's setting."]
            },
            REDUCE_ONLY_CONFLICT: {
                code: -4062,
                name: 'REDUCE_ONLY_CONFLICT',
                description: ['Invalid or improper reduceOnly value.']
            },
            INVALID_OPTIONS_REQUEST_TYPE: {
                code: -4063,
                name: 'INVALID_OPTIONS_REQUEST_TYPE',
                description: ['Invalid options request type']
            },
            INVALID_OPTIONS_TIME_FRAME: {
                code: -4064,
                name: 'INVALID_OPTIONS_TIME_FRAME',
                description: ['Invalid options time frame']
            },
            INVALID_OPTIONS_AMOUNT: {
                code: -4065,
                name: 'INVALID_OPTIONS_AMOUNT',
                description: ['Invalid options amount']
            },
            INVALID_OPTIONS_EVENT_TYPE: {
                code: -4066,
                name: 'INVALID_OPTIONS_EVENT_TYPE',
                description: ['Invalid options event type']
            },
            POSITION_SIDE_CHANGE_EXISTS_OPEN_ORDERS: {
                code: -4067,
                name: 'POSITION_SIDE_CHANGE_EXISTS_OPEN_ORDERS',
                description: [
                    'Position side cannot be changed if there exists open orders.'
                ]
            },
            POSITION_SIDE_CHANGE_EXISTS_QUANTITY: {
                code: -4068,
                name: 'POSITION_SIDE_CHANGE_EXISTS_QUANTITY',
                description: ['Position side cannot be changed if there exists position.']
            },
            INVALID_OPTIONS_PREMIUM_FEE: {
                code: -4069,
                name: 'INVALID_OPTIONS_PREMIUM_FEE',
                description: ['Invalid options premium fee']
            },
            INVALID_CL_OPTIONS_ID_LEN: {
                code: -4070,
                name: 'INVALID_CL_OPTIONS_ID_LEN',
                description: [
                    'Client options id is not valid.',
                    'Client options id length should be less than 32 chars'
                ]
            },
            INVALID_OPTIONS_DIRECTION: {
                code: -4071,
                name: 'INVALID_OPTIONS_DIRECTION',
                description: ['Invalid options direction']
            },
            OPTIONS_PREMIUM_NOT_UPDATE: {
                code: -4072,
                name: 'OPTIONS_PREMIUM_NOT_UPDATE',
                description: ['premium fee is not updated, reject order']
            },
            OPTIONS_PREMIUM_INPUT_LESS_THAN_ZERO: {
                code: -4073,
                name: 'OPTIONS_PREMIUM_INPUT_LESS_THAN_ZERO',
                description: ['input premium fee is less than 0, reject order']
            },
            OPTIONS_AMOUNT_BIGGER_THAN_UPPER: {
                code: -4074,
                name: 'OPTIONS_AMOUNT_BIGGER_THAN_UPPER',
                description: [
                    'Order amount is bigger than upper boundary or less than 0, reject order'
                ]
            },
            OPTIONS_PREMIUM_OUTPUT_ZERO: {
                code: -4075,
                name: 'OPTIONS_PREMIUM_OUTPUT_ZERO',
                description: ['output premium fee is less than 0, reject order']
            },
            OPTIONS_PREMIUM_TOO_DIFF: {
                code: -4076,
                name: 'OPTIONS_PREMIUM_TOO_DIFF',
                description: ['original fee is too much higher than last fee']
            },
            OPTIONS_PREMIUM_REACH_LIMIT: {
                code: -4077,
                name: 'OPTIONS_PREMIUM_REACH_LIMIT',
                description: ['place order amount has reached to limit, reject order']
            },
            OPTIONS_COMMON_ERROR: {
                code: -4078,
                name: 'OPTIONS_COMMON_ERROR',
                description: ['options internal error']
            },
            INVALID_OPTIONS_ID: {
                code: -4079,
                name: 'INVALID_OPTIONS_ID',
                description: [
                    'invalid options id',
                    'invalid options id: %s',
                    'duplicate options id %d for user %d'
                ]
            },
            OPTIONS_USER_NOT_FOUND: {
                code: -4080,
                name: 'OPTIONS_USER_NOT_FOUND',
                description: ['user not found', 'user not found with id: %s']
            },
            OPTIONS_NOT_FOUND: {
                code: -4081,
                name: 'OPTIONS_NOT_FOUND',
                description: ['options not found', 'options not found with id: %s']
            },
            INVALID_BATCH_PLACE_ORDER_SIZE: {
                code: -4082,
                name: 'INVALID_BATCH_PLACE_ORDER_SIZE',
                description: [
                    'Invalid number of batch place orders.',
                    'Invalid number of batch place orders: %s'
                ]
            },
            PLACE_BATCH_ORDERS_FAIL: {
                code: -4083,
                name: 'PLACE_BATCH_ORDERS_FAIL',
                description: ['Fail to place batch orders.']
            },
            UPCOMING_METHOD: {
                code: -4084,
                name: 'UPCOMING_METHOD',
                description: ['Method is not allowed currently. Upcoming soon.']
            },
            INVALID_NOTIONAL_LIMIT_COEF: {
                code: -4085,
                name: 'INVALID_NOTIONAL_LIMIT_COEF',
                description: ['Invalid notional limit coefficient']
            },
            INVALID_PRICE_SPREAD_THRESHOLD: {
                code: -4086,
                name: 'INVALID_PRICE_SPREAD_THRESHOLD',
                description: ['Invalid price spread threshold']
            },
            REDUCE_ONLY_ORDER_PERMISSION: {
                code: -4087,
                name: 'REDUCE_ONLY_ORDER_PERMISSION',
                description: ['User can only place reduce only order']
            },
            NO_PLACE_ORDER_PERMISSION: {
                code: -4088,
                name: 'NO_PLACE_ORDER_PERMISSION',
                description: ['User can not place order currently']
            },
            INVALID_CONTRACT_TYPE: {
                code: -4104,
                name: 'INVALID_CONTRACT_TYPE',
                description: ['Invalid contract type']
            },
            INVALID_CLIENT_TRAN_ID_LEN: {
                code: -4114,
                name: 'INVALID_CLIENT_TRAN_ID_LEN',
                description: [
                    'clientTranId is not valid',
                    'Client tran id length should be less than 64 chars'
                ]
            },
            DUPLICATED_CLIENT_TRAN_ID: {
                code: -4115,
                name: 'DUPLICATED_CLIENT_TRAN_ID',
                description: [
                    'clientTranId is duplicated',
                    'Client tran id should be unique within 7 days'
                ]
            },
            REDUCE_ONLY_MARGIN_CHECK_FAILED: {
                code: -4118,
                name: 'REDUCE_ONLY_MARGIN_CHECK_FAILED',
                description: [
                    'ReduceOnly Order Failed. Please check your existing position and open orders'
                ]
            },
            MARKET_ORDER_REJECT: {
                code: -4131,
                name: 'MARKET_ORDER_REJECT',
                description: [
                    "The counterparty's best price does not meet the PERCENT_PRICE filter limit"
                ]
            },
            INVALID_ACTIVATION_PRICE: {
                code: -4135,
                name: 'INVALID_ACTIVATION_PRICE',
                description: ['Invalid activation price']
            },
            QUANTITY_EXISTS_WITH_CLOSE_POSITION: {
                code: -4137,
                name: 'QUANTITY_EXISTS_WITH_CLOSE_POSITION',
                description: ['Quantity must be zero with closePosition equals true']
            },
            REDUCE_ONLY_MUST_BE_TRUE: {
                code: -4138,
                name: 'REDUCE_ONLY_MUST_BE_TRUE',
                description: ['Reduce only must be true with closePosition equals true']
            },
            ORDER_TYPE_CANNOT_BE_MKT: {
                code: -4139,
                name: 'ORDER_TYPE_CANNOT_BE_MKT',
                description: ["Order type can not be market if it's unable to cancel"]
            },
            INVALID_OPENING_POSITION_STATUS: {
                code: -4140,
                name: 'INVALID_OPENING_POSITION_STATUS',
                description: ['Invalid symbol status for opening position']
            },
            SYMBOL_ALREADY_CLOSED: {
                code: -4141,
                name: 'SYMBOL_ALREADY_CLOSED',
                description: ['Symbol is closed']
            },
            STRATEGY_INVALID_TRIGGER_PRICE: {
                code: -4142,
                name: 'STRATEGY_INVALID_TRIGGER_PRICE',
                description: [
                    'REJECT: take profit or stop order will be triggered immediately'
                ]
            },
            INVALID_PAIR: {
                code: -4144,
                name: 'INVALID_PAIR',
                description: ['Invalid pair']
            },
            ISOLATED_LEVERAGE_REJECT_WITH_POSITION: {
                code: -4161,
                name: 'ISOLATED_LEVERAGE_REJECT_WITH_POSITION',
                description: [
                    'Leverage reduction is not supported in Isolated Margin Mode with open positions'
                ]
            },
            MIN_NOTIONAL: {
                code: -4164,
                name: 'MIN_NOTIONAL',
                description: [
                    "Order's notional must be no smaller than 5.0 (unless you choose reduce only)",
                    "Order's notional must be no smaller than %s (unless you choose reduce only)"
                ]
            },
            INVALID_TIME_INTERVAL: {
                code: -4165,
                name: 'INVALID_TIME_INTERVAL',
                description: ['Invalid time interval', 'Maximum time interval is %s days']
            },
            PRICE_HIGHTER_THAN_STOP_MULTIPLIER_UP: {
                code: -4183,
                name: 'PRICE_HIGHTER_THAN_STOP_MULTIPLIER_UP',
                description: [
                    'Price is higher than stop price multiplier cap.',
                    "Limit price can't be higher than %s."
                ]
            },
            PRICE_LOWER_THAN_STOP_MULTIPLIER_DOWN: {
                code: -4184,
                name: 'PRICE_LOWER_THAN_STOP_MULTIPLIER_DOWN',
                description: [
                    'Price is lower than stop price multiplier floor.',
                    "Limit price can't be lower than %s."
                ]
            },
            FOK_ORDER_REJECT: {
                code: -5021,
                name: 'FOK_ORDER_REJECT',
                description: [
                    'Due to the order could not be filled immediately, the FOK order has been rejected.'
                ]
            },
            GTX_ORDER_REJECT: {
                code: -5022,
                name: 'GTX_ORDER_REJECT',
                description: [
                    'Due to the order could not be executed as maker, the Post Only order will be rejected.'
                ]
            },
            Exceed_Maximum_Modify_Order_Limit: {
                code: -5026,
                name: 'Exceed_Maximum_Modify_Order_Limit',
                description: [
                    'The order has exceeded the maximum adjust limit, and no modifications are supported.'
                ]
            },
            ME_RECVWINDOW_REJECT: {
                code: -5028,
                name: 'ME_RECVWINDOW_REJECT',
                description: ['Timestamp for this request is outside of the ME recvWindow.']
            }
        }
    }
}

module.exports = Futures;