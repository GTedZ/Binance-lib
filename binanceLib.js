// timeInForce is GTX for post, and GTC for limit orders apparently


let api = function everything(APIKEY = false, APISecret = false, options = { hedgeMode: false, recvWindow: 5000 }) {
    if (!new.target) return new api(options); // Legacy support for calling the constructor without 'new';
    const axios = require('axios')
    const crypto = require('crypto');
    const bigInt = require('json-bigint')({ storeAsString: true });

    const base = 'https://api.binance.com';
    const wapi = 'https://api.binance.com';
    const sapi = 'https://api.binance.com';
    const fapi = 'https://fapi.binance.com';
    const dapi = 'https://dapi.binance.com';

    const intervals = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"];
    const incomeTypes = ['TRANSFER', 'WELCOME_BONUS', 'REALIZED_PNL', 'FUNDING_FEE', 'COMMISSION', 'INSURANCE_CLEAR', 'REFERRAL_KICKBACK', 'COMMISSION_REBATE', 'MARKET_MAKER_REBATE', 'API_REBATE', 'CONTEST_REWARD', 'CROSS_COLLATERAL_TRANSFER', 'OPTIONS_PREMIUM_FEE', 'OPTIONS_SETTLE_PROFIT', 'INTERNAL_TRANSFER', 'AUTO_EXCHANGE', 'DELIVERED_SETTELMENT', 'COIN_SWAP_DEPOSIT', 'COIN_SWAP_WITHDRAW', 'POSITION_LIMIT_INCREASE_FEE']
    this.APIKEY = APIKEY;
    this.APISECRET = APISecret;
    this.timestamp_offset = 0;
    if (options.hedgeMode == true) this.hedgeMode = true; else this.hedgeMode = false;
    if (options.recvWindow) this.recvWindow = options.recvWindow; else this.recvWindow = 5000;
    if (options.extraResponseInfo && options.extraResponseInfo == true) this.extraResponseInfo = true; else this.extraResponseInfo = false;

    // public functions ////



    // futures ////

    // futures Market DATA ////

    this.futuresPing = async () => {
        let resp;
        let startTime = Date.now();
        resp = await request(
            {
                baseURL: fapi,
                path: '/fapi/v1/ping',
                method: 'get'
            }
        );
        let endTime = Date.now();

        if (resp.error) return this.futuresPing();
        resp.roundtrip_time_millis = endTime - startTime;
        return resp;
    }

    this.futuresServerTime = async () => {
        let resp;
        resp = await request(
            {
                baseURL: fapi,
                path: '/fapi/v1/time',
                method: 'get'
            });

        if (resp.error) {
            return this.futuresServerTime();
        }

        return resp.serverTime;
    }

    this.futuresExchangeInfo = async () => {
        let resp = await request(
            {
                baseURL: fapi,
                path: '/fapi/v1/exchangeInfo',
                method: 'get'
            });

        if (resp.error) {
            return this.exchangeInfo();
        }

        return resp.data;
    }

    this.futuresOrderBook = function (symbol, limit = 500) {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/depth',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (!number(limit)) return ERR('limit', 'type', 'Number');

        let options = {
            symbol: symbol,
            limit: limit
        }

        return request(params, options);
    }

    this.futuresRecentTrades = async (symbol, limit = 500) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/depth',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (!number(limit)) return ERR('limit', 'type', 'Number');

        let options = {
            symbol: symbol,
            limit: limit
        }

        return request(params, options);
    }

    this.futuresHistoricalTrades = async (symbol, limit = 500, fromId = 0) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/historicalTrades',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (!number(limit)) return ERR('limit', 'type', 'Number');

        let options = {
            symbol: symbol,
            limit: limit
        }
        if (fromId) options.fromId = fromId;

        return request(params, options);
    }

    this.futuresAggTrades = async (symbol, limit = 500, startTime = 0, endTime = 0, fromId = 0) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/aggTrades',
            method: 'get'
        }

        let options = {
            symbol: symbol,
            limit: limit
        }
        if (symbol == undefined) return ERR('symbol', 'required');
        if (!number(limit)) return ERR('limit', 'type', 'Number');
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;
        if (fromId) options.fromId = fromId;

        return request(params, options);
    }

    this.futuresCandlesticks = async (symbol, interval = '1m', limit = 500, startTime = 0, endTime = 0, fromId = 0) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/klines',
            method: 'get'
        }

        let options = {
            symbol: symbol,
            limit: limit,
            interval: interval
        }
        if (symbol == undefined) return ERR('symbol', 'required');
        if (!number(limit)) return ERR('limit', 'type', 'Number');
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;
        if (fromId) options.fromId = fromId;

        let response = await request(params, options)
        if (response.error) return response;
        response = handleArrayResponse(response, ['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time', 'quote_asset_volume', 'trades_count', 'Taker_buy_base_asset_volume', 'Taker_buy_quote_asset_volume', 'ignore'], 'number')
        return response;
    }

    this.futuresContinuousCandlesticks = async (pair, interval = '1m', contractType, limit = 500, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/continuousKlines',
            method: 'get'
        }

        let options = {
            pair: pair,
            interval: interval,
            contractType: contractType,
            limit: limit
        }
        if (pair == undefined) return ERR('pair', 'required');
        if (!number(limit)) return ERR('limit', 'type', 'Number');
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options)
        if (response.error) return response;
        response = handleArrayResponse(response, ['open_time', 'open', 'high', 'low', 'close', 'volume', 'close_time', 'quote_asset_volume', 'trades_count', 'Taker_buy_base_asset_volume', 'Taker_buy_quote_asset_volume', 'ignore'], 'number')
        return response;
    }

    this.futuresIndexPriceCandlesticks = async (pair, interval = '1m', limit = 500, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/indexPriceKlines',
            method: 'get'
        }

        let options = {
            pair: pair,
            interval: interval,
            limit: limit
        }
        if (pair == undefined) return ERR('pair', 'required');
        if (!number(limit)) return ERR('limit', 'type', 'Number');
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options)
        if (response.error) return response;
        response = handleArrayResponse(response, ['open_time', 'open', 'high', 'low', 'close', 'ignore', 'close_time', 'ignore', 'ignore', 'ignore', 'ignore', 'ignore'], 'number')
        return response;
    }

    this.futuresMarkPriceCandlesticks = async (symbol, interval = '1m', limit = 500, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/markPriceKlines',
            method: 'get'
        }

        let options = {
            symbol: symbol,
            interval: interval,
            limit: limit
        }
        if (symbol == undefined) return ERR('pair', 'required');
        if (!number(limit)) return ERR('limit', 'type', 'Number');
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options)
        if (response.error) return response;
        response = handleArrayResponse(response, ['open_time', 'open', 'high', 'low', 'close', 'ignore', 'close_time', 'ignore', 'ignore', 'ignore', 'ignore', 'ignore'], 'number')
        return response;
    }

    this.futuresMarkPrice = (symbol = undefined) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/premiumIndex',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;

        return request(params, options);
    }

    this.futuresFundingRate = (symbol = undefined, limit = 100, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/fundingRate',
            method: 'get'
        }

        let options = {
            limit: limit
        }
        if (!number(limit)) return ERR("limit", 'type', 'Number');
        if (symbol) options.symbol = symbol;
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options);
    }

    this.futures24hrTicker = (symbol = undefined) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/ticker/24hr',
            method: 'get'
        }
        let options = {};
        if (symbol) options.symbol = symbol;

        return request(params, options);
    }

    /**
     * returns the Last price of all symbols/symbol (Last price is the last executed trade's price on Binance)
     * @param {string} symbol - optional
     */
    this.futuresPrices = async (symbol = undefined) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/ticker/price',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;

        let data = await request(params, options);
        if (data.error) return response;
        return Array.isArray(data) ? data.reduce((out, i) => ((out[i.symbol] = parseFloat(i.price)), out), {}) : { symbol: data.symbol, price: parseFloat(data.price), time: data.time };
    }

    /**
     * returns bookTicker data for all symbols/symbol
     * @param {string} symbol - optional
     */
    this.futuresBookTicker = async (symbol = undefined) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/ticker/bookTicker',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;

        let response = await request(params, options);
        if (response.error) return response;
        return parseAllPropertiesToFloat(response);
    }

    /**
     * returns the present open interest of a specific symbol
     * @param symbol - required
     * @returns symbol {STRING}, openInterest {FLOAT}, time {INT}
     */
    this.futuresOpenInterest = async (symbol) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/openInterest',
            method: 'get'
        }
        if (symbol == undefined) return ERR("symbol", 'required');
        let options = {
            symbol: symbol
        }

        let response = await request(params, options);
        if (response.error) return response;
        return parseAllPropertiesToFloat(response);
    }

    /**
     * @param symbol - required
     * @param period - required: "5m","15m","30m","1h","2h","4h","6h","12h","1d"
     * @param limit - optional: default "30", max "500"
     * @param startTime - optional
     * @param endTime - optional
     */
    this.futuresOpenInterestStatistics = async (symbol, period, limit = 30, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/futures/data/openInterestHist',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (period == undefined) return ERR('period', 'required');
        if (!equal(period, "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d")) return ERR('period', 'value', false, ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"])


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options);
        if (response.error) return response;
        return parseAllPropertiesToFloat(response);
    }

    /**
     * @param symbol - required
     * @param period - required: "5m","15m","30m","1h","2h","4h","6h","12h","1d"
     * @param limit - optional: default "30", max "500"
     * @param startTime - optional
     * @param endTime - optional
     */
    this.futuresTopLongShortAccountRatio = async (symbol, period, limit = 30, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/futures/data/topLongShortAccountRatio',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (period == undefined) return ERR('period', 'required');
        if (!equal(period, "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d")) return ERR('period', 'value', false, ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"])


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options);
        if (response.error) return response;
        return parseAllPropertiesToFloat(response);
    }

    /**
     * @param symbol - required
     * @param period - required: "5m","15m","30m","1h","2h","4h","6h","12h","1d"
     * @param limit - optional: default "30", max "500"
     * @param startTime - optional
     * @param endTime - optional
     */
    this.futuresTopLongShortPositionRatio = async (symbol, period, limit = 30, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/futures/data/topLongShortPositionRatio',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (period == undefined) return ERR('period', 'required');
        if (!equal(period, "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d")) return ERR('period', 'value', false, ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"])


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options);
        if (response.error) return response;
        return parseAllPropertiesToFloat(response);
    }

    this.futuresGlobalLongShortAccountRatio = async (symbol, period, limit = 30, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/futures/data/globalLongShortAccountRatio',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (period == undefined) return ERR('period', 'required');
        if (!equal(period, "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d")) return ERR('period', 'value', false, ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"])


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options);
        if (response.error) return response;
        return parseAllPropertiesToFloat(response);
    }

    this.futuresTakerlongshortRatio = async (symbol, period, limit = 30, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/futures/data/takerlongshortRatio',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (period == undefined) return ERR('period', 'required');
        if (!equal(period, "5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d")) return ERR('period', 'value', false, ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"])


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options);
        if (response.error) return response;
        return parseAllPropertiesToFloat(response);
    }

    /**
     * @param symbol - required: example "BTCDOWN", "BTCUP"
     * @param interval - required: 
     * @param limit - optional: default "500", max "1000"
     * @param startTime - optional
     * @param endTime - optional
     */
    this.futuresBLVTCandlesticks = async (symbol, interval, limit = 500, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/lvtKlines',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (!equal(interval, ...intervals)) return ERR('interval', 'value', false, intervals);
        if (!number(limit)) return ERR('limit', 'type', 'Number');

        let options = {
            symbol: symbol,
            limit: limit,
            interval: interval
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let response = await request(params, options);
        if (response.error) return response;
        return handleArrayResponse(response, ['open_time', 'open', 'high', 'low', 'close', 'real_leverage', 'close_time', 'ignore', 'NAV_updates_count', 'ignore', 'ignore', 'ignore'], 'number')
    }

    /**
     * @param symbol - optional
     */
    this.futuresIndexInfo = async (symbol = false) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/indexInfo',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;

        return request(params, options);
    }

    this.futuresMultiAssetModeIndex = async (symbol = false) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/assetIndex',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;

        let response = await request(params, options);
        if (response.error) return response;
        return parseAllPropertiesToFloat(response);
    }

    // futures Market DATA \\\\

    // futures Account/Trade Endpoints ////

    this.futuresChangePositionSide = function (dualSidePosition, opts = { recvWindow: this.recvWindow }) {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/positionSide/dual',
            method: 'post'
        };

        let options = {
            dualSidePosition: dualSidePosition
        }

        Object.assign(options, opts)

        if (dualSidePosition == undefined) return ERR('dualSidePosition', 'required', false, ['true', 'false', 'for setting hedgeMode on or off']);

        return request(params, options, 'SIGNED');
    }

    this.futuresGetPositionSide = function (opts = { recvWindow: this.recvWindow }) {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/positionSide/dual',
            method: 'get'
        }

        let options = {}
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresChangeMultiAssetMargin = function (multiAssetsMargin, opts = { recvWindow: this.recvWindow }) {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/multiAssetsMargin',
            method: 'post'
        }

        let options = {
            multiAssetsMargin: multiAssetsMargin
        }
        Object.assign(options, opts);

        if (multiAssetsMargin == undefined) return ERR('multiAssetsMargin', 'required', false, ['true', 'false', 'for Multi-Asset Mode to be turned on or off']);

        return request(params, options, 'SIGNED'); // , 'SIGNED'
    }

    this.futuresGetMultiAssetMargin = function (opts = { recvWindow: this.recvWindow }) {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/multiAssetsMargin',
            method: 'get'
        }

        let options = {}
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresMarketBuy = async function (symbol, quantity, opts = {}) {
        return futuresMarket(symbol, quantity, 'BUY', opts);
    }

    this.futuresMarketSell = async function (symbol, quantity, opts = {}) {
        return futuresMarket(symbol, quantity, 'SELL', opts);
    }

    const futuresMarket = (symbol, quantity, side, opts) => {
        let options = {
            quantity: quantity,
            side: side
        }
        Object.assign(options, opts);

        if (quantity == undefined) return ERR('quantity', 'required');
        if (!number(quantity)) return ERR('quantity', 'type', 'Number');

        return this.futuresCreateOrder(symbol, 'SELL', 'MARKET', options);
    }

    this.futuresBuy = async function (symbol, quantity, price, opts = {}) {
        return futuresLimit(symbol, quantity, price, 'BUY', opts);
    }

    this.futuresSell = async function (symbol, quantity, price, opts = {}) {
        return futuresLimit(symbol, quantity, price, 'SELL', opts);
    }

    const futuresLimit = (symbol, quantity, price, side, opts) => {
        let options = {
            quantity: quantity,
            price: price
        }
        Object.assign(options, opts);

        if (quantity == undefined) return ERR('quantity', 'required');
        if (!number(quantity)) return ERR('quantity', 'type', 'Number');
        if (price == undefined) return ERR('price', 'required');
        if (!number(price)) return ERR('price', 'type', 'Number');

        return this.futuresCreateOrder(symbol, side, 'LIMIT', options);
    }

    this.futuresCreateOrder = async (symbol, side, type, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/order',
            method: 'post'
        }

        let options = {
            symbol: symbol,
            side: side,
            type: type,
            newOrderRespType: 'RESULT'
        }
        if (type == "LIMIT") options.timeInForce = 'GTC';

        Object.assign(options, opts);

        if (!symbol) return ERR('symbol', 'required');
        if (!side) return ERR('side', 'required');
        if (!type) return ERR('type', 'required');
        if (this.hedgeMode && !options.positionSide) return ERR('positionSide', 'required', false, ['LONG', 'SHORT']);
        if (options.positionSide) {
            if (number(options.positionSide)) return ERR('positionSide', 'type', 'String');
            options.positionSide = fixValue(options.positionSide, 'LONG', ['long', 'buy']);
            options.positionSide = fixValue(options.positionSide, 'SHORT', ['short', 'sell']);

            if (!equal(options.positionSide, 'LONG', 'SHORT')) return ERR('positionSide', 'value', false, ['LONG', 'SHORT']);
        }
        if (!this.hedgeMode) delete options.positionSide;

        let response = await request(params, options, 'SIGNED');
        if (response.error) {
            if (response.error.code && response.error.code == -2022) {
                response.error.from_dev = 'Reduce Only rejected because there is no position open on this symbol in your account.'
            }
            if (response.error.code && response.error.code == -4061) {  // POSITION_SIDE_NOT_MATCH user's setting
                this.hedgeMode = this.hedgeMode == true ? false : true;
                console.log({ _binance_lib: `Received an invalid user's setting error, so automatically toggling hedgeMode to` + this.hedgeMode + `and retrying again.` });
                return this.futuresCreateOrder(symbol, side, type, opts);
            }
        }

        return response = bigInt.parse(bigInt.stringify(parseAllPropertiesToFloat(response)));
    }

    /**
     * @param orders - array of objects that contain the parameters of the order
     */
    this.futuresMultipleOrders = async (orders, serialize = false) => {
        // TODO
        if (orders.length > 5) {
            if (serialize == false) return ERR(`A maximum of 5 orders per batch is allowed. To avoid this, send a second parameter as 'true' to serialize the batches`);
        }
    }

    this.futuresOrder = (symbol, orderId, origClientOrderId, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/order',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        let options = {
            symbol: symbol
        }
        if (orderId) options.orderId = orderId;
        if (origClientOrderId) options.origClientOrderId = origClientOrderId;
        Object.assign(options, opts);
        if (!opts.orderId && !opts.origClientOrderId) return ERR(`Either 'orderId' or 'origClientOrderId' need to be sent for this request.`);

        return request(params, options, 'SIGNED');
    }

    this.futuresCancelOrder = (symbol, orderId, origClientOrderId, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/order',
            method: 'delete'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        let options = {
            symbol: symbol
        }
        Object.assign(options, opts);
        if (orderId) options.orderId = orderId;
        if (origClientOrderId) options.origClientOrderId = origClientOrderId;
        if (!opts.orderId && !opts.origClientOrderId) return ERR(`Either 'orderId' or 'origClientOrderId' need to be sent for this request.`);

        return request(params, options, 'SIGNED');
    }

    this.futuresCancelAll = (symbol, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/allOpenOrders ',
            method: 'delete'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        let options = {
            symbol: symbol
        }
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresCancelBatchOrders = async () => {
        // TODO
    }

    /**
     * @param symbol - required
     * @param countdownTime - required: (millis) => every 1000 is 1sec 
     * @returns ({symbol, countdownTime})
     */
    this.futuresCountdownCancelAll = (symbol, countdownTime, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: "/fapi/v1/countdownCancelAll",
            method: 'post'
        }
        let options = {
            symbol: symbol,
            countdownTime: countdownTime
        }
        Object.assign(options, opts);
        if (symbol == undefined) return ERR("symbol", 'required');
        if (countdownTime == undefined) return ERR('countdownTime', 'required');
        if (!number(countdownTime)) return ERR('countdownTime', 'type', 'Number');

        return request(params, options, 'SIGNED');
    }

    this.futuresOpenOrder = (symbol, orderId = 0, origClientOrderId = 0, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/openOrder',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required')

        let options = {
            symbol: symbol
        }
        if (orderId) options.orderId = orderId;
        if (origClientOrderId) options.origClientOrderId = origClientOrderId;
        Object.assign(options, opts);
        if (!opts.orderId && !opts.origClientOrderId) return ERR(`Either 'orderId' or 'origClientOrderId' need to be sent for this request.`);

        return request(params, options, 'SIGNED');
    }

    this.futuresOpenOrders = (symbol = false, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/openOrders',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresAllOrders = (symbol, orderId = 0, limit = 500, startTime = 0, endTime = 0, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/allOrders',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');

        let options = {
            symbol: symbol,
            limit: limit
        }
        if (orderId) options.orderId = orderId;
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresBalance = (options = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v2/balance',
            method: 'get'
        }

        return request(params, options);
    }

    this.futuresAccount = (options = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v2/account',
            method: 'get'
        }

        return request(params, options);
    }

    this.leverage = (symbol, leverage, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/leverage',
            method: 'post'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (leverage == undefined) return ERR('leverage', 'required');
        if (!number(leverage)) return ERR('leverage', 'type', 'Number');

        let options = {
            symbol: symbol,
            leverage: leverage
        }
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresMarginType = (symbol, marginType, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/marginType',
            method: 'post'
        }

        let options = {
            symbol: symbol,
            marginType: marginType
        }
        Object.assign(options, opts);

        if (options.symbol == undefined) return ERR('symbol', 'required');
        options.marginType = fixValue(options.marginType, 'ISOLATED', ['iso', 'isolated']);
        options.marginType = fixValue(options.marginType, 'CROSSED', ['cross', 'crossed']);
        if (!equal(options.marginType, 'ISOLATED', 'CROSSED')) return ERR('marginType', 'value', false, ['ISOLATED', 'CROSSED']);

        return request(params, options, 'SIGNED');
    }

    /**
     * Change an ISOLATED position's margin
     */
    this.futuresPositionMargin = (symbol, amount = 0, type = undefined, opts = { positionSide: undefined }) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/positionMargin',
            method: 'post'
        }

        let options = {
            symbol: symbol,
            amount: amount,
            type: type
        }

        Object.assign(options, opts);
        if (symbol == undefined) return ERR('symbol', 'required');
        if (!amount) return ERR('amount', 'required');
        if (!number(amount)) return ERR('amount', 'type', 'Number');
        if (this.hedgeMode && !options.positionSide) return ERR('positionSide', 'required', false, ['LONG', 'SHORT']);
        options.type = fixValue(options.type, '1', ['1', 'add', 'ADD', 'increase', 'INCREASE', 'buy', 'long']);
        options.type = fixValue(options.type, '2', ['2', 'reduce', 'REDUCE', 'sell', 'short']);
        if (!equal(options.type, '1', '2')) return ERR('type', 'value', false, ['INCREASE', 'REDUCE']);

        return request(params, options, 'SIGNED');
    }

    this.futuresPositionMarginHistory = (symbol, limit = 500, type = 0, startTime = 0, endTime = 0, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/positionMargin/history',
            method: 'get'
        }

        if (symbol == undefined) return ERR("symbol", 'required');
        let options = {
            symbol: symbol,
            limit: limit,
            type: type
        }
        Object.assign(options, opts);

        if (options.type) {
            options.type = fixValue(options.type, '1', ['1', 'add', 'ADD', 'increase', 'INCREASE', 'buy', 'long']);
            options.type = fixValue(options.type, '2', ['2', 'reduce', 'REDUCE', 'sell', 'short']);
            if (!equal(options.type, '1', '2')) return ERR('type', 'value', false, ['INCREASE', 'REDUCE']);
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options, 'SIGNED');
    }

    /**
     * returns your current futures positions/position information
     * @param {string} symbol - optional
     * @options The parameters below should be wrapped in an object
     * @param {number} recvWindow - number
     * @returns Arrays of 1 Object for One-way-mode
     * @or 
     * @returns Arrays of 2 Objects for hedgeMode
     */
    this.futuresPositionRisk = (symbol = false, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v2/positionRisk',
            method: 'get'
        }

        let options = {}
        if (symbol) options.symbol = symbol;

        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresUserTrades = (symbol, limit = 500, opts = {}) => {

        let params = {
            baseURL: fapi,
            path: '/fapi/v1/userTrades',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (!number(limit)) return ERR(`limit`, 'type', 'Number')

        let options = {
            symbol: symbol,
            limit: limit
        }

        Object.assign(options, opts)

        return request(params, options, 'SIGNED');
    }

    this.futuresIncomeHistory = (symbol, limit = 100, incomeType = undefined, startTime = 0, endTime = 0, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/income',
            method: 'get'
        }

        let options = {
            symbol: symbol,
            limit: limit
        }
        Object.assign(options, opts);

        if (symbol == undefined) return ERR('symbol', 'required');
        if (incomeType) {
            if (!equal(incomeType), incomeTypes) return ERR('incomeType', 'value', false, incomeTypes);
            options.incomeType = incomeType;
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options, 'SIGNED');
    }

    this.futuresLeverageBrackets = (symbol = undefined, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/leverageBracket',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresADLQuantileEstimation = (symbol = undefined, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/adlQuantile',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    // TODO
    // futures Account/Trade Endpoints \

    // private functions ////

    request = async (params, options = {}, type = 'default') => {
        if (!options.recvWindow) options.recvWindow = this.recvWindow;

        if (type == "DATA" || type == 'SIGNED') {
            if (!this.APIKEY) return ERR('APIKEY is required for this request');
            params.headers = axios.defaults.headers[params.method];
            params.headers['X-MBX-APIKEY'] = this.APIKEY;
        }

        if (type == "SIGNED") {
            if (!this.APISECRET) return ERR('APISECRET is required for this request.');
            options.timestamp = Date.now() + this.timestamp_offset;
            query = makeQueryString(options);
            console.log(query)
            let signature = crypto.createHmac('sha256', this.APISECRET).update(query).digest('hex');
            options.signature = signature;
        }

        // console.log(params.baseURL + params.path, options);
        let startTime = Date.now(), latency;
        try {
            let response = await axios({
                method: params.method,
                url: params.baseURL + params.path,
                params: options,
                headers: params.headers,
                data: ''
            })
            latency = Date.now() - startTime;

            if (this.extraResponseInfo) {
                let data = {};
                if (response.headers['x-mbx-used-weight-1m']) data['x-mbx-used-weight-1m'] = response.headers['x-mbx-used-weight-1m'];
                if (response.headers['x-mbx-order-count-10s']) data['x-mbx-order-count-10s'] = response.headers['x-mbx-order-count-10s'];
                if (response.headers['x-mbx-order-count-1m']) data['x-mbx-order-count-1m'] = response.headers['x-mbx-order-count-1m'];
                if (response.headers['x-response-time']) data['server-process-time'] = response.headers['x-response-time'];
                data.latency_millis = latency;
                data.data = response.data;
                return data;
            }
            return response.data;

        } catch (err) {
            let error;
            if (err.response && err.response.data) {
                error = {
                    status: err.response.status,
                    statusText: err.response.statusText
                };
                Object.assign(error, err.response.data);
                if (!err.code) err.code = -2;
                if (!err.msg) err.msg = 'Unknown error, possibly connection error.'
            } else error = err;
            if (!err.code) err.code = -2;
            if (!err.msg) err.msg = 'Unknown error, possibly connection error.'
            return { error: error };
        }
    }

    const makeQueryString = (q) => {
        return Object.keys(q)
            .reduce((a, k) => {
                if (Array.isArray(q[k])) {
                    q[k].forEach(v => {
                        a.push(k + "=" + encodeURIComponent(v))
                    })
                } else if (q[k] !== undefined) {
                    a.push(k + "=" + encodeURIComponent(q[k]));
                }
                return a;
            }, [])
            .join("&");
    }

    const fetchOffset = async (tries = 0) => {
        let startTime = Date.now();
        let time = await this.futuresServerTime();
        let currentTime = Date.now();
        let delta = (currentTime - startTime) / 2;
        this.timestamp_offset = time + parseInt(delta) - currentTime;
        if (tries < 3) fetchOffset(++tries)
    }

    const handleArrayResponse = (Arr, keys, type) => {
        return Arr.map(item => {
            let ret = {};
            keys.forEach((key, c) => {
                if (type == 'number') ret[key] = getNumberOrString(item[c]);
                else ret[key] = item[c];
            });
            return ret;
        })
    }

    const parseAllPropertiesToFloat = (obj) => {
        if (Array.isArray(obj)) obj.forEach(propertiesToFloat);
        propertiesToFloat(obj);
        return obj;
    }

    const propertiesToFloat = (obj) => {
        for (let key of Object.keys(obj)) {
            obj[key] = getNumberOrString(obj[key]);
        }
    }

    const getNumberOrString = (item) => {
        let i = parseFloat(item);
        return i == i ? i : item;
    }

    const number = (num) => {
        return parseFloat(num) == parseFloat(num);
    }

    const equal = (variable, ...possibilities) => {
        return possibilities.filter(a => variable == a).length != 0;
    }

    const fixValue = (variable, end_value, possibilities) => {
        if (variable == undefined) return variable;
        variable = variable.toLowerCase();
        possibilities.push(end_value.toLowerCase());
        let lower = variable.toLowerCase();

        if (possibilities.filter(a => lower == a.toLowerCase()).length != 0) {
            return end_value;
        }

        return variable;
    }

    const ERR = (msg, errType = false, requiredType = false, possibilities = []) => {
        if (errType) {
            if (errType.toLowerCase() == 'required') msg = `Parameter '${msg}' is required for this request.`;
            if (errType.toLowerCase() == 'type') msg = `Parameter '${msg}' should be of type '${requiredType}'.`;
            if (errType.toLowerCase() == 'value') msg = `Parameter '${msg}' is invalid.`
            if (possibilities.length != 0) msg += ` Possible options:${possibilities.map(a => ` '${a}'`)}.`
        }

        return {
            status: 400,
            statusText: 'Local Error',
            code: -1,
            msg: msg
        }
    }

    // private functions \\\\

    if (options.useServerTime && options.useServerTime == true) { setInterval(fetchOffset, 1 * 60 * 60 * 1000); fetchOffset() }
}

module.exports = api;