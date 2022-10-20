// timeInForce is GTX for post, and GTC for limit orders apparently


let api = function everything(APIKEY = false, APISecret = false, options = { hedgeMode: false, recvWindow: 5000 }) {
    if (!new.target) return new api(options); // Legacy support for calling the constructor without 'new';
    const axios = require('axios')
    const crypto = require('crypto');
    const ws = require('ws')
    const bigInt = require('json-bigint')({ storeAsString: true });
    const binance = this;

    const base = 'https://api.binance.com';
    const wapi = 'https://api.binance.com';
    const sapi = 'https://api.binance.com';
    const fapi = 'https://fapi.binance.com';
    const dapi = 'https://dapi.binance.com';

    const sWSS = 'wss://stream.binance.com:9443'
    const fWSS = 'wss://fstream.binance.com';


    const intervals = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"];
    const incomeTypes = ['TRANSFER', 'WELCOME_BONUS', 'REALIZED_PNL', 'FUNDING_FEE', 'COMMISSION', 'INSURANCE_CLEAR', 'REFERRAL_KICKBACK', 'COMMISSION_REBATE', 'MARKET_MAKER_REBATE', 'API_REBATE', 'CONTEST_REWARD', 'CROSS_COLLATERAL_TRANSFER', 'OPTIONS_PREMIUM_FEE', 'OPTIONS_SETTLE_PROFIT', 'INTERNAL_TRANSFER', 'AUTO_EXCHANGE', 'DELIVERED_SETTELMENT', 'COIN_SWAP_DEPOSIT', 'COIN_SWAP_WITHDRAW', 'POSITION_LIMIT_INCREASE_FEE']
    const contractTypes = ["PERPETUAL", "CURRENT_MONTH", "NEXT_MONTH", "CURRENT_QUARTER", "NEXT_QUARTER", "PERPETUAL_DELIVERING"]
    const shortenedContractTypes = ["PERPETUAL", "CURRENT_QUARTER", "NEXT_QUARTER"]
    const periods = ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"];
    const bools = [true, false];

    this.APIKEY = APIKEY; contractTypes
    this.APISECRET = APISecret;
    this.APIKEYSInfo = {}
    this.timestamp_offset = 0;
    this.ping = 0;

    if (options.callback) this.callback = options.callback; else this.callback = () => { };
    if (options.timeout) this.timeout = options.timeout; else this.timeout = 500;
    if (options.hedgeMode == true) this.hedgeMode = true; else this.hedgeMode = false;
    if (options.fetchFloats == true) this.fetchFloats = true; else this.fetchFloats = false;
    if (options.recvWindow) this.recvWindow = options.recvWindow; else this.recvWindow = 5000;
    if (options.query) this.query = true; else this.query = false;
    if (options.extraResponseInfo) this.extraResponseInfo = true; else this.extraResponseInfo = false;  // will cause errors, do not use it except for dev-testing
    if (options.ws) this.ws = true; else this.ws = false;

    // public functions ////



    // futures \\\\

    // futures Market DATA \\\\

    this.futuresPing = async (reconnect = false, tries = -1) => {
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

        if (resp.error) {
            tries--;
            if (reconnect == false || tries == 0) return resp;
            else {
                await delay(50);
                return this.futuresPing(reconnect, tries);
            }
        }
        resp.roundtrip_time_millis = endTime - startTime;
        this.ping = resp.roundtrip_time_millis;
        return resp;
    }

    this.futuresServerTime = async (reconnect = false, tries = -1) => {
        let resp;
        resp = await request(
            {
                baseURL: fapi,
                path: '/fapi/v1/time',
                method: 'get'
            });

        if (resp.error) {
            tries--;
            if (reconnect == false || tries == 0) return resp;
            else {
                await delay(50);
                return this.futuresServerTime(reconnect, tries);
            }
        }

        return resp.serverTime;
    }

    /**
     * Returns the futures exchange's general info, like assets/symbols and their info, like Price Precisions, Quantity Precisions, min and max notionals and quantities.
     * @param {Boolean} reconnect - optional: Default is 'false'; 'true' if you want the library to keep requesting the info in case of a connection error
     * @param {Number} tries - optional: Default is 0 (for infinite); The maximum number of tries before an error is returned
     * @options All the parameters below are optional and should be wrapped in an object along with their property name, these options can be used to selectively choose the properties that you want to receive, and not all of the data that binance usually returns
     * @param symbols - if 'true', returns an array of all the exchange's symbols
     * @rest the rest of the parameters will be returned as an object with it's properties as the symbols' names
     * @param {Boolean} quantityPrecision - returns all symbols' Quantity Precisions (decimal places that binance can handle)
     * @param {Boolean} pricePrecision - returns all symbol' Price Precisions
     * @param {Boolean} contractType - returns the contractType of the symbols
     * @param {Boolean} status - returns the symbols' status in the binance exchange
     * @param {Boolean} baseAsset - the name of the coin, without the quotePair, meaning 'BTC' instead of 'BTCUSDT' or 'BTCBUSD'
     * @param {Boolean} quoteAsset  - the quote asset, meaning 'USDT' instead of 'BTCUSDT' or 'BUSD' instead of 'BTCBUSD'
     * @param {Boolean} marginAsset
     * @param {Boolean} baseAssetPrecision - not really relevant, I only ever saw it equal to 8
     * @param {Boolean} quotePrecision - same as baseAssetPrecision
     * @param {Boolean} priceFilters - minPrice, maxPrice, tickSize (0.10, meaning that you can only increment the quote/USDT/BUSD size by 0.10 => 50USDT, 50.10USDT, 50.20USDT or 50.30USDT for buying BTCUSDT)
     * @param {Boolean} lotFilters - minQty, maxQty, stepSize (0.001 for BTCUSDT, meaning you can only increment your BTC size by 0.001 at a time => 0.02BTC, 0.021BTC or 0.022BTC)
     * @param {Boolean} marketLotFilters - same as lotFilters, but for MARKET orders (they differ mostly by the maxQty)
     * @param {Boolean} minNotional - contains the minimum notional
     * @param {Boolean} maxNumOrders - contains the max number of orders
     * @param {Boolean} maxNumAlgoOrders - contains the max number of whatever Algo Orders are
     * @param {Boolean} percentPriceFilters - multiplierDown, multiplierUp, multiplierDecimal
     * @param {Boolean} orderTypes - 'LIMIT', 'MARKET', 'STOP', 'STOP_MARKET', 'TAKE_PROFIT', 'TAKE_PROFIT_MARKET', etc...
     * @param {Boolean} timeInForce - 'GTC', 'IOC', 'FOK', 'GTX'
     */
    this.futuresExchangeInfo = async (reconnect = false, tries = 0, options = {}) => {
        let altResponse = false;
        let resp = await request(
            {
                baseURL: fapi,
                path: '/fapi/v1/exchangeInfo',
                method: 'get'
            });

        if (resp.error) {
            tries--;
            if (reconnect == false || tries == 0) return resp;
            else {
                await delay(50);
                return this.futuresExchangeInfo(reconnect, tries, options);
            }
        }

        if (typeof options == 'object' && Object.keys(options).length != 0) {
            altResponse = {};

            if (options.symbols) altResponse.symbols = resp.symbols.map(symbol => symbol.symbol);

            resp.symbols.forEach(item => {
                let symbol = item.symbol;
                altResponse[symbol] = {};
                if (options.quantityPrecision == true) altResponse[symbol].quantityPrecision = item.quantityPrecision;
                if (options.pricePrecision == true) altResponse[symbol].pricePrecision = item.pricePrecision;
                if (options.contractType == true) altResponse[symbol].contractType = item.contractType;
                if (options.status == true) altResponse[symbol].status = item.status;
                if (options.baseAsset == true) altResponse[symbol].baseAsset = item.baseAsset;
                if (options.quoteAsset == true) altResponse[symbol].quoteAsset = item.quoteAsset;
                if (options.marginAsset == true) altResponse[symbol].marginAsset = item.marginAsset;
                if (options.baseAssetPrecision == true) altResponse[symbol].baseAssetPrecision = item.baseAssetPrecision;
                if (options.quotePrecision == true) altResponse[symbol].quotePrecision = item.quotePrecision;
                if (options.timeInForce == true) altResponse[symbol].timeInForce = item.timeInForce;
                if (options.orderTypes == true) altResponse[symbol].orderTypes = item.orderTypes;
                if (options.priceFilters == true) altResponse[symbol].priceFilters = item.filters[0];
                if (options.lotFilters == true) altResponse[symbol].lotFilters = item.filters[1];
                if (options.marketLotFilters == true) altResponse[symbol].marketLotFilters = item.filters[2];
                if (options.maxNumOrders == true) altResponse[symbol].maxNumOrders = item.filters[3].limit;
                if (options.maxNumAlgoOrders == true) altResponse[symbol].maxNumAlgoOrders = item.filters[4].limit;
                if (options.minNotional == true) altResponse[symbol].minNotional = item.filters[5].notional;
                if (options.percentPriceFilters == true) altResponse[symbol].percentPriceFilters = item.filters[6];

                if (Object.keys(altResponse[symbol]).length == 0) delete altResponse[symbol];
            })
        }

        if (altResponse != false && Object.keys(altResponse).length != 0) return altResponse;
        return resp;
    }

    this.futuresOrderBook = async (symbol, limit = 500) => {
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

        let resp = await request(params, options);
        if (resp.error) return resp;
        resp.bids = handleArrayResponse(resp.bids, ['price', 'qty'])
        resp.asks = handleArrayResponse(resp.asks, ['price', 'qty'])

        return resp;
    }

    this.futuresRecentTrades = async (symbol, limit = 500) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/trades',
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

        return request(params, options, 'DATA');
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

        let resp = await request(params, options);
        if (resp.error) return resp;

        return renameObjectProperties(resp, ['tradeId', 'price', 'qty', 'first_tradeId', 'last_tradeId', 'timestamp', 'maker'])
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
        if (!equal(interval, intervals)) return ERR('interval', 'value', false, intervals)
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
        if (!equal(interval, intervals)) return ERR('interval', 'value', false, intervals);
        if (!equal(contractType, shortenedContractTypes)) return ERR('contractType', 'value', false, shortenedContractTypes)
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
        if (!equal(interval, intervals)) return ERR('interval', 'value', 'intervals');
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
        if (data.error) return data;
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

        return request(params, options);
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

        return request(params, options);
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
        if (!equal(period, periods)) return ERR('period', 'value', false, periods)


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options);
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
        if (!equal(period, periods)) return ERR('period', 'value', false, periods)


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options);
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
        if (!equal(period, periods)) return ERR('period', 'value', false, periods)


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options);
    }

    this.futuresGlobalLongShortAccountRatio = async (symbol, period, limit = 30, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/futures/data/globalLongShortAccountRatio',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (period == undefined) return ERR('period', 'required');
        if (!equal(period, periods)) return ERR('period', 'value', false, periods)


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options);
    }

    this.futuresTakerLongShortRatio = async (symbol, period, limit = 30, startTime = 0, endTime = 0) => {
        let params = {
            baseURL: fapi,
            path: '/futures/data/takerlongshortRatio',
            method: 'get'
        }

        if (symbol == undefined) return ERR('symbol', 'required');
        if (period == undefined) return ERR('period', 'required');
        if (!equal(period, periods)) return ERR('period', 'value', false, periods)


        let options = {
            symbol: symbol,
            period: period,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options);
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
        if (!equal(interval, intervals)) return ERR('interval', 'value', false, intervals);
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

        return request(params, options);
    }

    // futures Market DATA ////

    // futures Account/Trade Endpoints \\\\

    this.futuresChangePositionSide = function (dualSidePosition, opts = {}) {
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
        if (!equal(dualSidePosition, bools)) return ERR('dualSidePosition', 'value', false, ['true', 'false', 'for setting hedgeMode on or off'])
        return request(params, options, 'SIGNED');
    }

    this.futuresGetPositionSide = function (opts = {}) {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/positionSide/dual',
            method: 'get'
        }

        let options = {}
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresChangeMultiAssetMargin = function (multiAssetsMargin, opts = {}) {
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
        if (!equal(multiAssetsMargin)) return ERR('multiAssetsMargin', 'value', false, ['true', 'false', 'for Multi-Asset Mode to be turned on or off'])

        return request(params, options, 'SIGNED');
    }

    this.futuresGetMultiAssetMargin = function (opts = {}) {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/multiAssetsMargin',
            method: 'get'
        }

        let options = {}
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresMarketBuy = async (symbol, quantity, opts = {}) => {
        return futuresMarket(symbol, quantity, 'BUY', opts);
    }

    this.futuresMarketSell = async (symbol, quantity, opts = {}) => {
        return futuresMarket(symbol, quantity, 'SELL', opts);
    }

    const futuresMarket = (symbol, quantity, side, opts) => {
        let options = {
            quantity: quantity,
            side: side
        }
        Object.assign(options, opts);

        if (!quantity) return ERR('quantity', 'required');
        if (!number(quantity)) return ERR('quantity', 'type', 'Number');

        return this.futuresCreateOrder(symbol, 'SELL', 'MARKET', options);
    }

    this.futuresBuy = async (symbol, quantity, price, opts = {}) => {
        return futuresLimit(symbol, quantity, price, 'BUY', opts);
    }

    this.futuresSell = async (symbol, quantity, price, opts = {}) => {
        return futuresLimit(symbol, quantity, price, 'SELL', opts);
    }

    const futuresLimit = (symbol, quantity, price, side, opts) => {
        let options = {
            quantity: quantity,
            price: price
        }
        Object.assign(options, opts);

        if (!quantity) return ERR('quantity', 'required');
        if (!number(quantity)) return ERR('quantity', 'type', 'Number');
        if (!price) return ERR('price', 'required');
        if (!number(price)) return ERR('price', 'type', 'Number');

        return this.futuresCreateOrder(symbol, side, 'LIMIT', options);
    }

    this.futuresTakeProfit = async (symbol, side, stopPrice, quantity = false, options = {}) => {
        if (!stopPrice) return ERR('stopPrice', 'required');
        if (!number(stopPrice)) return ERR('stopPrice', 'type', 'Number');
        options.stopPrice = stopPrice;
        if (quantity) {
            if (!number(quantity)) return ERR('quantity', 'type', 'Number');
            options.quantity = quantity;
        } else options.closePosition = true;

        return this.futuresCreateOrder(symbol, side, 'TAKE_PROFIT_MARKET', options);
    }

    this.futuresStopLoss = async (symbol, side, stopPrice, quantity = false, options = {}) => {
        if (!stopPrice) return ERR('stopPrice', 'required');
        if (!number(stopPrice)) return ERR('stopPrice', 'type', 'Number');
        options.stopPrice = stopPrice;
        if (quantity) {
            if (!number(quantity)) return ERR('quantity', 'type', 'Number');
            options.quantity = quantity;
        }
        else options.closePosition = true;

        return this.futuresCreateOrder(symbol, side, 'STOP_MARKET', options);
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
        side = fixValue(side, "BUY", ['long', 'buy']);
        side = fixValue(side, "BUY", ['short', 'sell']);
        if (!equal(side, ['BUY', 'SELL'])) return ERR('side', 'value', false, ['BUY', 'SELL'])
        if (!type) return ERR('type', 'required');
        if (this.hedgeMode) {
            if (!options.positionSide) return ERR('positionSide', 'required', false, ['LONG', 'SHORT']);
            if (number(options.positionSide)) return ERR('positionSide', 'type', 'String');
            options.positionSide = fixValue(options.positionSide, 'LONG', ['long', 'buy']);
            options.positionSide = fixValue(options.positionSide, 'SHORT', ['short', 'sell']);
            if (!equal(options.positionSide, ['LONG', 'SHORT'])) return ERR('positionSide', 'value', false, ['LONG', 'SHORT']);
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

        return response;
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
        if (!options.orderId && !options.origClientOrderId) return ERR(`Either 'orderId' or 'origClientOrderId' need to be sent for this request.`);

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
        if (!orderId && !origClientOrderId) return ERR(`Either 'orderId' or 'origClientOrderId' need to be sent for this request.`);
        // if (orderId && origClientOrderId)
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

    this.futuresCancelBatchOrders = async (symbol, orderIdList, origClientOrderIdList, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/batchOrders',
            method: 'delete'
        }

        let options = {
            symbol: symbol
        }
        if (!orderIdList && !origClientOrderIdList) return ERR(`Either 'orderIdList' or 'origClientOrderIdList' need to be sent for this request.`);
        if (orderIdList) {
            if (!Array.isArray(orderIdList)) return ERR('orderIdList', 'type', 'Array');
            options.orderIdList = orderIdList;
        } else if (origClientOrderIdList) {
            if (!Array.isArray(origClientOrderIdList)) return ERR('orderIdList', 'type', 'Array');
            options.origClientOrderIdList = origClientOrderIdList;
        }

        return request(params, options, 'SIGNED');
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

    this.futuresOpenOrder = (symbol, orderId, origClientOrderId, opts = {}) => {
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

    this.futuresAllOrders = (symbol, limit = 500, orderId = 0, startTime = 0, endTime = 0, opts = {}) => {
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

    this.futuresBalance = async (options = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v2/balance',
            method: 'get'
        }

        return request(params, options, 'SIGNED');
    }

    /**
     * Returns account info, along with all your assets and positions
     * @param {boolean} activePositionsOnly - optional: returns only your current open positions
     * @param {boolean} activeAssets - optional: not recommended, it will only returns NON-ZERO assets
     * @options {recvWindow}
     */
    this.futuresAccount = async (activePositionsOnly = false, activeAssets = false, options = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v2/account',
            method: 'get'
        }

        let resp = await request(params, options, 'SIGNED');
        if (resp.error) return resp;
        if (activePositionsOnly == true) resp.positions = resp.positions.filter(position => position.positionAmt != 0);
        if (activeAssets == true) resp.assets = resp.assets.filter(asset => asset.walletBalance != 0 || asset.availableBalance != 0 || asset.marginBalance != 0);
        return resp;
    }

    this.futuresLeverage = async (symbol, leverage, findHighestWorkingLeverage = false, opts = {}) => {
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

        if (!findHighestWorkingLeverage) return request(params, options, 'SIGNED');

        let response = await request(params, options, 'SIGNED');
        if (response.error) {
            if (response.error.code == -4028) {
                leverage = lowerBracket(leverage);
                return this.futuresLeverage(symbol, leverage, findHighestWorkingLeverage, opts);
            }
        }
        return response;
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
        if (!equal(options.marginType, ['ISOLATED', 'CROSSED'])) return ERR('marginType', 'value', false, ['ISOLATED', 'CROSSED']);

        return request(params, options, 'SIGNED');
    }

    /**
     * Change an ISOLATED position's margin
     */
    this.futuresPositionMargin = (symbol, amount, type, opts = { positionSide: undefined }) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/positionMargin',
            method: 'post'
        }

        let options = {
            symbol: symbol,
            amount: amount
        }

        Object.assign(options, opts);
        if (symbol == undefined) return ERR('symbol', 'required');
        if (!amount) return ERR('amount', 'required');
        if (!number(amount)) return ERR('amount', 'type', 'Number');
        if (this.hedgeMode && !options.positionSide) return ERR('positionSide', 'required', false, ['LONG', 'SHORT']);
        type = fixValue(type, '1', ['1', 'add', 'ADD', 'increase', 'INCREASE', 'buy', 'long']);
        type = fixValue(type, '2', ['2', 'reduce', 'REDUCE', 'sell', 'short']);
        if (!equal(type, ['1', '2'])) return ERR('type', 'value', false, ['INCREASE', 'REDUCE']);
        options.type = type;

        return request(params, options, 'SIGNED');
    }

    this.futuresPositionMarginHistory = (symbol, limit = 500, type, startTime = 0, endTime = 0, opts = {}) => {
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
            if (!equal(options.type, ['1', '2'])) return ERR('type', 'value', false, ['INCREASE', 'REDUCE']);
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
     * @returns Arrays of Objects (each is a seperate position, 1pos per symbol for One-Way Mode, 2 for hedgeMode)
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

    /**
     * returns your current futures positions/position information
     * @param {string} symbol - optional
     * @options The parameters below should be wrapped in an object
     * @param {number} recvWindow - number
     * @returns Arrays of 1 Object for One-way-mode
     * @or 
     * @returns Arrays of 2 Objects for hedgeMode
     */
    this.futuresOpenPositions = async (symbol = false, opts = {}) => {
        let response = await binance.futuresPositionRisk(symbol, opts);
        if (response.error) return response;

        return response.filter(position => position.positionAmt != 0);
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

    this.futuresIncomeHistory = (symbol = false, limit = 100, incomeType = undefined, startTime = 0, endTime = 0, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/income',
            method: 'get'
        }

        let options = {
            limit: limit
        }
        Object.assign(options, opts);

        if (symbol) options.symbol = symbol;
        if (incomeType) {
            if (!equal(incomeType), incomeTypes) return ERR('incomeType', 'value', false, incomeTypes);
            options.incomeType = incomeType;
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options, 'SIGNED');
    }

    this.futuresLeverageBrackets = async (symbol = undefined, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/leverageBracket',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;
        Object.assign(options, opts);

        let response = await request(params, options, 'SIGNED');
        if (response.error) return response;
        if (symbol) return response[0];
        let levBracketObject = {};
        response.forEach(bracket => {
            levBracketObject[bracket.symbol] = bracket;
        });

        return levBracketObject;
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

    // TODO theres 3 or more functions left to include

    // futures Account/Trade Endpoints ////

    // websockets \\\\

    this.websockets = {

        // spot websockets \\\\

        spot: {

            aggTrade: function (symbol, callback) {
                if (!symbol) { ERROR('symbol', 'required'); return; }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!callback) { ERROR('callback', 'required'); return; }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: `${symbol.toLowerCase()}@aggTrade`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    'a=aggTradeId',
                    'p=price',
                    'q=qty',
                    'f=firstTradeId',
                    'l=lastTradeId',
                    'T=tradeTime',
                    'm=maker',
                    'M=ignore'
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format)
            },

            trade: function (symbol, callback) {
                if (!symbol) { ERROR('symbol', 'required'); return; }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!callback) { ERROR('callback', 'required'); return; }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: `${symbol.toLowerCase()}@trade`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    't=tradeId',
                    'p=price',
                    'q=qty',
                    'b=buyOrderId',
                    'a=sellerOrderId',
                    'T=tradeId',
                    'm=maker',
                    'M=ignore'
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format)
            },

            candlesticks: function (symbol, interval, callback) {
                if (!symbol) { ERROR('symbol', 'required'); return; }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!interval) { ERROR('interval', 'required'); return; }
                if (!equal(interval, intervals)) return ERROR('interval', 'value', false, intervals)

                if (!callback) { ERROR('callback', 'required'); return; }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: `${symbol.toLowerCase()}@kline_${interval}`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    [
                        'k=candle',
                        't=startTime',
                        'T=closeTime',
                        's=symbol',
                        'i=interval',
                        'f=firstTradeId',
                        'L=lastTradeId',
                        'o=open',
                        'c=close',
                        'h=high',
                        'l=low',
                        'v=baseAssetVolume',
                        'n=tradeCount',
                        'x=closed',
                        'q=quoteAssetVolume',
                        'V=takerBuy_baseAssetVolume',
                        'Q=takerBuy_quoteAssetVolume',
                        'B=ignore'
                    ]
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            miniTicker: function (callback, symbol = false) {
                if (!callback) { ERROR('callback', 'required'); return; }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: '!miniTicker@arr'
                }
                if (symbol) params.path = `${symbol.toLowerCase()}@miniTicker`;

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    'c=close',
                    'o=open',
                    'h=high',
                    'l=low',
                    'v=totalTraded_baseAssetVolume',
                    'q=totalTraded_quoteAssetVolume'
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            ticker: function (callback, symbol = false) {
                if (!callback) { ERROR('callback', 'required'); return; }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: '!ticker@arr'
                }
                if (symbol) params.path = `${symbol.toLowerCase()}@ticker`;

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    'p=priceChange',
                    'P=percentChange',
                    'w=weightedAvgPrice',
                    'x=previousStream_firstTradePrice',
                    'Q=lastQty',
                    'b=bestBidPrice',
                    'B=bestBidQty',
                    'a=bestAskPrice',
                    'A=bestAskQty',
                    'o=open',
                    'c=close',
                    'h=high',
                    'l=low',
                    'v=totalTraded_baseAssetVolume',
                    'q=totalTraded_quoteAssetVolume',
                    'O=stats_openTime',
                    'C=stats_closeTime',
                    'F=firstTradeId',
                    'L=lastTradedId',
                    'n=tradeCount'
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            }

        },

        // spot websockets ////

        // futures websocket \\\\
        futures: {

            aggTrade: function (symbol, callback) {
                if (!symbol) { ERROR('symbol', 'required'); return; }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');
                if (!callback) { ERROR('callback', 'required'); return; }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                symbol = symbol.toLowerCase();
                const params = {
                    baseURL: fWSS,
                    path: `${symbol}@aggTrade`
                }

                const newKeys =
                    [
                        'e=event',
                        'E=time',
                        's=symbol',
                        'a=aggTradeId',
                        'p=price',
                        'q=qty',
                        'f=firstTradeId',
                        'l=lastTradeId',
                        'T=timestamp',
                        'm=maker'
                    ]

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                };
                return connect(params, this.format);
            },

            markPrice: function (callback, symbol = false, slow = false) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `!markPrice@arr@1s`
                }

                if (symbol) params.path = `${symbol.toLowerCase()}@markPrice@1s`
                if (slow) params.path = params.path.slice(0, -3);

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    'p=markPrice',
                    'i=indexPrice',
                    'P=estimatedSettlePrice',
                    'r=fundingRate',
                    'T=nextFundingTime'
                ]

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );

                    callback(msg);
                }

                return connect(params, this.format);
            },

            lastPrice: function (symbol, callback) {
                if (!symbol) return ERROR('symbol', 'required');
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');
                symbol = symbol.toLowerCase();
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `${symbol}@kline_1m`
                }

                this.format = (msg) => {
                    let obj = {};
                    obj[msg.s] = msg.k.c;
                    callback(obj);
                }

                return connect(params, this.format)
            },

            /**
             * @param {String} symbol - required
             * @param {String} interval - required: "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M" 
             * @param {Function} callback - required
             */
            candlesticks: function (symbol, interval, callback) {
                if (!symbol) return ERROR('symbol', 'required');
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');
                symbol = symbol.toLowerCase();
                if (!equal(interval, intervals)) return ERROR('interval', 'value', false, intervals);
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `${symbol}@kline_${interval}`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    [
                        'k=candle',
                        't=startTime',
                        'T=closeTime',
                        's=symbol',
                        'i=interval',
                        'f=firstTradeId',
                        'L=lastTradeId',
                        'o=open',
                        'c=close',
                        'h=high',
                        'l=low',
                        'v=baseAssetVolume',
                        'n=tradesCount',
                        'x=closed',
                        'q=quoteAssetVolume',
                        'V=takerBuy_baseAssetVolume',
                        'Q=takerBuy_quoteAssetVolume',
                        'B=ignore'
                    ]
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format)
            },

            continuousContractKline: function (pair, contractType, interval, callback) {
                if (!pair) return ERROR('pair', 'required');
                if (typeof pair != 'string') return ERROR('pair', 'type', 'String');
                pair = pair.toLowerCase();

                if (!contractType) return ERROR('contractType', 'required');
                if (!equal(contractType, shortenedContractTypes)) return ERROR('contractType', 'value', false, shortenedContractTypes);

                if (!interval) return ERROR('contractType', 'required');
                if (!equal(interval, intervals)) return ERROR('contractType', 'value', false, intervals);

                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                let params = {
                    baseURL: fWSS,
                    path: `${pair}_${contractType.toLowerCase()}@continuousKline_${interval}`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    'ps=pair',
                    'ct=contractType',
                    [
                        'k=candle',
                        't=startTime',
                        'T=closeTime',
                        'i=interval',
                        'f=firstTradeId',
                        'L=lastTradeId',
                        'o=open',
                        'c=close',
                        'h=high',
                        'l=low',
                        'v=volume',
                        'n=tradesCount',
                        'x=closed',
                        'q=quoteAssetVolume',
                        'V=takerBuy_volume',
                        'Q=takerBuy_volume',
                        'B=ignore'  // anything that is 'ignore' will be ignored
                    ]
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format)
            },

            miniTicker: function (callback, symbol = false) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                let params = {
                    baseURL: fWSS,
                    path: '!miniTicker@arr'
                }

                if (symbol) {
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'Number');
                    params.path = `${symbol.toLowerCase()}@miniTicker`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    'c=close',
                    'o=open',
                    'h=high',
                    'l=low',
                    'v=totalTraded_baseAssetVolume',
                    'q=totalTraded_quoteAsset'
                ]

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            ticker: function (callback, symbol = false) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                let params = {
                    baseURL: fWSS,
                    path: '!ticker@arr'
                }

                if (symbol) {
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'Number');
                    params.path = `${symbol.toLowerCase()}@ticker`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    'p=priceChange',
                    'P=percentChange',
                    'w=weightedAvgPrice',
                    'c=lastPrice',
                    'Q=lastQty',
                    'o=open',
                    'h=high',
                    'l=low',
                    'v=totalTraded_baseAssetVolume',
                    'q=totalTraded_quoteAssetVolume',
                    'O=stats_openTime',
                    'C=stats_closeTime',
                    'F=firstTradeId',
                    'L=lastTradeId',
                    'n=tradesCount'
                ]

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            bookTicker: function (callback, symbol = false) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                let params = {
                    baseURL: fWSS,
                    path: '!bookTicker'
                }

                if (symbol) {
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'Number');
                    params.path = `${symbol.toLowerCase()}@bookTicker`
                }

                const newKeys = [
                    'e=event',
                    'u=updateId',
                    'E=time',
                    'T=transactionTime',
                    's=symbol',
                    'b=bestBidPrice',
                    'B=bestBidQty',
                    'a=bestAskPrice',
                    'A=bestAskQty',
                ]

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            liquidationOrders: function (callback, symbol = false) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                let params = {
                    baseURL: fWSS,
                    path: '!forceOrder@arr'
                }

                if (symbol) {
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'Number');
                    params.path = `${symbol.toLowerCase()}@forceOrder`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    [
                        'o=order',
                        's=symbol',
                        'S=side',
                        'o=orderType',
                        'f=timeInForce',
                        'q=qty',
                        'p=price',
                        'ap=avgPrice',
                        'X=status',
                        'l=order_lastFilledQty',
                        'z=order_filledAccumulatedQty',
                        'T=order_tradeTime',
                    ]
                ]

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            partialBookTicker: function (symbol, levels, speed, callback) {
                if (!symbol) return ERROR('symbol', 'required');
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!levels) return ERROR('levels', 'required', false, [5, 10, 20]);
                if (!equal(levels, [5, 10, 20])) return ERROR('levels', 'value', false, [5, 10, 20]);

                if (!speed) return ERROR('speed', 'required', false, ['500ms', '250ms', '100ms']);
                if (!equal(speed, ['500ms', '250ms', '100ms'])) return ERROR('levels', 'value', false, ['500ms', '250ms', '100ms']);

                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `${symbol.toLowerCase()}@depth${levels}`
                }
                if (speed != '250ms') params.path += '@' + speed;

                const newKeys = [
                    'e=event',
                    'E=time',
                    'T=transactionTime',
                    's=symbol',
                    'U=firstUpdateId',
                    'u=finalUpdateId',
                    'pu=previousStream_finalUpdateId',
                    [
                        'b=bids'
                    ],
                    [
                        'a=asks'
                    ]
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            diffBookTicker: function (symbol, speed, callback) {
                if (!symbol) return ERROR('symbol', 'required');
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!speed) return ERROR('speed', 'required', false, ['500ms', '250ms', '100ms']);
                if (!equal(speed, ['500ms', '250ms', '100ms'])) return ERROR('levels', 'value', false, ['500ms', '250ms', '100ms']);

                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `${symbol.toLowerCase()}@depth`
                }
                if (speed != '250ms') params.path += '@' + speed;

                const newKeys = [
                    'e=event',
                    'E=time',
                    'T=transationTime',
                    's=symbol',
                    'U=firstUpdateId',
                    'u=finalUpdateId',
                    'pu=previousStream_finalUpdateId',
                    [
                        'b=bids'
                    ],
                    [
                        'a=asks'
                    ]
                ];

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            compositeIndexSymbol: function (symbol, callback) {
                if (!symbol) return ERROR('symbol', 'required');
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `${symbol.toLowerCase()}@compositeIndex`
                }

                const newKeys = [
                    'e=event',
                    'E=time',
                    's=symbol',
                    'p=price',
                    'C=baseAsset',
                    [
                        'c=composition',
                        'q=quoteAsset',
                        'w=weightInQty',
                        'W=weightInPercentage',
                        'i=indexPrice'
                    ]
                ]

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        newKeys
                    );
                    callback(msg);
                }

                return connect(params, this.format);
            },

            userData: async function (callback, tries = 2) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const reqParams = {
                    baseURL: fapi,
                    path: '/fapi/v1/listenKey'
                }
                const postParams = {
                    ...reqParams,
                    method: 'post'
                }
                const putParams = {
                    ...reqParams,
                    method: 'put'
                }
                const deleteParams = {
                    ...reqParams,
                    method: 'delete'
                }

                let resp = await request(postParams, {}, 'DATA');
                if (resp.error) {
                    if (tries < 0) return ERROR(`Couldn't connect to get the listenKey.`);
                    return userData(callback, --tries);
                }
                resp.deleteKey = () => request(deleteParams, {}, 'DATA');
                resp.interval = setInterval(() => request(putParams, {}, 'DATA'), 15 * 60 * 1000);

                const params = {
                    baseURL: fWSS,
                    path: resp.listenKey
                }


                const marginCallKeys = [
                    'e=event',
                    'E=time',
                    'cw=crossWalletBalance',
                    [
                        'p=positions',    // this is the main object key before the subkeys
                        's=symbol',
                        'ps=positionSide',
                        'pa=positionAmt',
                        'mt=marginType',
                        'iw=isolatedWallet',
                        'mp=markPrice',
                        'up=unrealizedPnl',
                        'mm=maintenanceMarginRequired'
                    ]
                ];

                const accountUpdateKeys = [
                    'e=event',
                    'E=time',
                    'T=transactionTime',
                    [
                        'a=updateData',
                        'm=eventType',
                        [
                            'B=balances',
                            'a=asset',
                            'wb=walletBalance',
                            'cw=crossWalletBalance',
                            'bc=balanceChange'
                        ],
                        [
                            'P=positions',
                            's=symbol',
                            'ma=quoteAsset',
                            'pa=positionAmt',
                            'ep=entryPrice',
                            'cr=accumulatedRealized',
                            'up=unrealizedPnl',
                            'mt=marginType',
                            'iw=isolatedWallet',
                            'ps=positionSide'
                        ]
                    ]
                ];

                const orderTradeUpdateKeys = [
                    'e=event',
                    'E=time',
                    'T=transactionTime',
                    [
                        'o=order',
                        's=symbol',
                        'c=clientOrderId',
                        'S=side',
                        'o=orderType',
                        'f=timeInForce',
                        'q=origQty',
                        'p=origPrice',
                        'ap=avgPrice',
                        'sp=stopPrice',
                        'x=executionType',
                        'X=orderStatus',
                        'i=orderId',
                        'l=lastFilledQty',
                        'z=filledAccumulatedQty',
                        'L=lastFilledPrice',
                        'N=commissionAsset',
                        'n=commission',
                        'T=tradeTime',
                        't=tradeId',
                        'b=bidsNotional',
                        'a=askNotional',
                        'm=maker',
                        'R=reduceOnly',
                        'wt=stopPrice_workingType',
                        'ot=originalOrderType',
                        'ps=positionSide',
                        'cp=closeAll',
                        'AP=activationPrice',
                        'cr=callbackRate',
                        'rp=realizedProfit',
                        'pP=ignore',
                        'si=ignore',
                        'ss=ignore'
                    ]
                ];

                const accountConfigLeverageChangeKeys = [
                    'e=event',
                    'E=time',
                    'T=transactionTime',
                    [
                        'ac=newLeverage',
                        's=symbol',
                        'l=leverage'
                    ]
                ];

                const accountConfigMarginModeChangeKeys = [
                    'e=event',
                    'E=time',
                    'T=transactionTime',
                    [
                        'ai=newMarginMode',
                        'j=mode'
                    ]
                ];

                this.format = (msg) => {
                    if (msg.e == 'MARGIN_CALL') {
                        msg = advancedRenameObjectProperties(msg, marginCallKeys);
                        callback(msg);
                    } else if (msg.e == 'ACCOUNT_UPDATE') {
                        msg = advancedRenameObjectProperties(msg, accountUpdateKeys);
                        callback(msg);
                    } else if (msg.e == 'ORDER_TRADE_UPDATE') {
                        msg = advancedRenameObjectProperties(msg, orderTradeUpdateKeys);
                        callback(msg);
                    } else if (msg.e == 'ACCOUNT_CONFIG_UPDATE') {
                        if (msg.ac) {
                            msg = advancedRenameObjectProperties(msg, accountConfigLeverageChangeKeys);
                            callback(msg);
                        } else if (msg.ai) {
                            msg = advancedRenameObjectProperties(msg, accountConfigMarginModeChangeKeys);
                            callback(msg);
                        }
                    } else callback(msg);
                }

                return connect(params, this.format);
            }

        }

    }

    // futures websocket ////


    // functions necessary for websocket

    connect = (params, callback) => {
        if (!params.path) { ERROR('streamName', 'required'); return; }
        if (!callback) { ERROR('callback', 'required'); return; }
        const object = {
            unsubscribe: () => {
                object.alive = false;
                object.socket.close();
            },
            close: () => {
                object.alive = false;
                object.socket.close();
                if (object.interval) {
                    clearInterval(object.interval);
                    object.deleteKey();
                }
            },
            alive: true,
            socket: {}
        }

        new newSocket(params, callback, object);

        return object;
    }

    newSocket = function (params, callback, object) {
        object.socket = new ws(params.baseURL + '/ws/' + params.path);
        let socket = object.socket;

        socket.on('open', () => {
            if (binance.ws) console.log(params.path + ' is open')
            // TODO add conditions to add the correct subscriptions to the right futures/spot object
        })

        socket.on('message', (msg) => {
            if (binance.ws) console.log(params.path + ' new message')
            callback(parseSocketMessage(msg));
        })

        socket.on('error', () => {
            if (binance.ws) console.log(params.path + ' ERROR');
        })

        socket.on('close', () => {
            if (binance.ws) console.log(params.path + ' Closed!');

            setTimeout(() => {
                if (object.alive) newSocket(params, callback, object);
            }, binance.timeout)
        })

        socket.on('ping', () => {
            if (binance.ws) console.log(params.path + ' pinged.')
            socket.pong();
        })

        socket.on('pong', () => {
            if (binance.ws) console.log(params.path + ' ponged.')
        })
    }

    parseSocketMessage = (msg) => {
        if (binance.fetchFloats) return parseAllPropertiesToFloat(JSON.parse(msg.toString()));
        else return JSON.parse(msg.toString());

    }

    // websockets ////

    // private functions \\\\

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
            let signature = crypto.createHmac('sha256', this.APISECRET).update(query).digest('hex');
            options.signature = signature;
        }

        if (this.query) console.log(params.baseURL + params.path, options);
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

            let data = {};
            if (response.headers['x-mbx-used-weight-1m']) data['x-mbx-used-weight-1m'] = response.headers['x-mbx-used-weight-1m'];
            if (response.headers['x-mbx-order-count-10s']) data['x-mbx-order-count-10s'] = response.headers['x-mbx-order-count-10s'];
            if (response.headers['x-mbx-order-count-1m']) data['x-mbx-order-count-1m'] = response.headers['x-mbx-order-count-1m'];
            if (response.headers['x-response-time']) data['server-process-time'] = response.headers['x-response-time'];
            data.latency_millis = latency;

            this.APIKEYSInfo = { ...this.APIKEYSInfo, ...data };
            if (this.extraResponseInfo) {
                if (this.fetchFloats) data.data = parseAllPropertiesToFloat(response.data);
                else data.data = response.data;
                return data;
            }

            if (this.fetchFloats) return parseAllPropertiesToFloat(response.data); else return response.data;

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
            } else error = {
                status: 408,
                statusText: 'Request Timeout'
            };
            if (!err.code || err.code == 'ENOTFOUND') error.code = -2;
            if (!err.msg) error.msg = 'No connection'
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
        if (this.query) {
            console.log({ deltaTime: (delta * 2).toFixed() }, { timestamp_offset: this.timestamp_offset })
        }
        if (tries < 3) fetchOffset(++tries); else this.callback();
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

    const renameObjectProperties = (obj, keys) => {
        if (Array.isArray(obj)) {
            for (let ind in obj) {
                obj[ind] = renameObjectProperties(obj[ind], keys);
            }
        } else {
            let oldKeys = Object.keys(obj);
            let newObj = {};

            for (let x in keys) {
                let newKey = keys[x];
                let oldKey = oldKeys[x];
                if (newKey == 'ignore') continue;

                if (Array.isArray(newKey)) {
                    let newArr = [...newKey]
                    let newObjKey = newArr.shift();
                    newObj[newObjKey] = renameObjectProperties(obj[oldKey], newArr);
                } else newObj[newKey] = obj[oldKey];
            }
            obj = newObj;
        }
        return obj;
    }

    /**
     * Renames your object keys, it accepts objects, and arrays of objects
     * @param {Object} obj - This is the object that you want to change (You will lose your original object when you use this function)
     * @param {Array} keys - These are your keys that you will send, and since this is the 'advanced' rename, it will follow these rules:
     * - "oldKey=newKey" - This basically means that any element in the array that is a string, will be split into oldKey and newKey, where it will replace the 'oldKey' propertyName, by the 'newKey' propertyName
     * - ["oldKey=newKey", "oldKey=newKey",...] - This is when you have a subObject in your original object, which needs to have its properties renamed:
     * This array will contain: at index 0, it will contain the 'oldKey' of the original Object's property, that will be renamed to 'newKey'
     *  And then the rest (index 1 and above) will be the oldKeys and newKeys of that subObject's properties, and those properties can be arrays themselves too, the function handles recursion
     */
    const advancedRenameObjectProperties = (obj, keys) => {
        if (Array.isArray(obj)) {
            for (let ind in obj) {
                obj[ind] = advancedRenameObjectProperties(obj[ind], keys);
            }
        } else {
            for (let key of keys) {
                if (Array.isArray(key)) {
                    let newArr = [...key];  // this is because 'key' is a reference to an array that will be used by any other subsequent message from the websocket, so if it is changed here (via .shift()), it will lose its value, and only the first websocket message will have its full info, any other will not
                    let mainKey = newArr.shift().split('=');
                    let oldKey = mainKey[0];
                    let newKey = mainKey[1];
                    obj[newKey] = advancedRenameObjectProperties(obj[oldKey], newArr);
                    delete obj[oldKey];
                } else {
                    key = key.split('=');
                    let oldKey = key[0];
                    let newKey = key[1];
                    if (newKey != 'ignore') obj[newKey] = obj[oldKey];
                    delete obj[oldKey];
                }
            }
        }
        return obj;
    }

    const parseAllPropertiesToFloat = (obj) => {
        if (Array.isArray(obj)) for (let index in obj) obj[index] = parseAllPropertiesToFloat(obj[index], index)
        else if (typeof obj == 'object') for (let key of Object.keys(obj)) obj[key] = parseAllPropertiesToFloat(obj[key], key);
        else obj = getNumberOrString(obj);
        return obj;
    }

    const getNumberOrString = (item) => {
        let i = parseFloat(item);
        if (i == i) {
            try {
                return bigInt.parse(item);
            } catch (err) {
                return item;
            }
        } else return item;
    }

    const number = (num) => {
        return parseFloat(num) == parseFloat(num);
    }

    const equal = (variable, possibilities) => {
        return possibilities.filter(a => variable == a).length != 0;
    }

    const fixValue = (variable, end_value, possibilities) => {
        if (variable == undefined) return variable;
        possibilities.push(end_value.toLowerCase());

        let lower = variable.toLowerCase();
        if (possibilities.filter(a => lower == a.toLowerCase()).length != 0) {
            return end_value;
        }

        return variable;
    }

    const lowerBracket = (lev) => {
        if (lev <= 20) return lev; // impossible basically
        if (lev <= 25) return 20;
        if (lev <= 50) return 25;
        if (lev <= 75) return 50;
        if (lev <= 100) return 75;
        if (lev <= 125) return 100;
        return 125;
    }

    const ERR = (msg, errType = false, requiredType = false, possibilities = []) => {
        if (errType) {
            if (errType.toLowerCase() == 'required') msg = `Parameter '${msg}' is required for this request.`;
            if (errType.toLowerCase() == 'type') msg = `Parameter '${msg}' should be of type '${requiredType}'.`;
            if (errType.toLowerCase() == 'value') msg = `Parameter '${msg}' is invalid.`
            if (possibilities.length != 0) msg += ` Possible options:${possibilities.map(a => ` '${a}'`)}.`
        }

        return {
            error: {
                status: 400,
                statusText: 'Local Error',
                code: -1,
                msg: msg
            }
        }
    }

    const ERROR = (msg, errType = false, requiredType = false, possibilities = []) => {
        if (errType) {
            if (errType.toLowerCase() == 'required') msg = `${msg == 'callback' ? 'A callback function' : `Parameter '${msg}'`} is required for this request.`;

            if (errType.toLowerCase() == 'type') msg = `Parameter '${msg}' should be of type '${requiredType}'.`;
            if (errType.toLowerCase() == 'value') msg = `Parameter '${msg}' is invalid.`
            if (possibilities.length != 0) msg += ` Possible options:${possibilities.map(a => ` '${a}'`)}.`
        }

        console.error({
            error: {
                status: 400,
                statusText: 'Websocket Error',
                code: -3,
                msg: msg
            }
        });
    }

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    // private functions \\\\

    if (options.useServerTime && options.useServerTime == true) { setInterval(fetchOffset, 1 * 60 * 60 * 1000); fetchOffset() }

    this.test = () => {
        let obj = {
            hi: 100,
            hi2: 200,
            hi3: 300,
            obj: {
                hi: 200,
                hi2: 300,
                hi3: 400,
                hi5: 123810
            },
            hi5: 'fuck you',
            someObj: {
                hi: 10,
                ho: 200
            },

            obj2: {
                x: 100
            }
        }

        let newKey = [
            'hi=lol',
            'hi2=lol2',
            'hi3=lol3',
            [
                'obj=obj1',
                'hi=lol',
                'hi2=lol2',
                'hi3=lol3',
            ],
            [
                'obj2=someNewObjectIDontKnowMuchAbout',
                'x=singleObjectIknowAbout'
            ]
        ]

        let resp = advancedRenameObjectProperties(obj, newKey);
        console.log(resp);
    }
}

module.exports = api;