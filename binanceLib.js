// timeInForce is GTX for post, and GTC for limit orders apparently

let api = function everything(APIKEY = false, APISecret = false, options = { hedgeMode: false, fetchFloats: false, useServerTime: false, recvWindow: 5000 }) {
    if (!new.target) return new api(APIKEY, APISecret, options); // Legacy support for calling the constructor without 'new';
    const axios = require('axios')
    const crypto = require('crypto');
    const ws = require('ws')
    const bigInt = require('json-bigint')({ storeAsString: true });
    const binance = this;

    const
        api = 'https://api.binance.com',
        sapi = 'https://api.binance.com',
        fapi = 'https://fapi.binance.com',
        dapi = 'https://dapi.binance.com',
        wapi = 'https://api.binance.com';
    ;

    const
        WS = 'wss://ws-api.binance.com:443/ws-api/v3',
        sWSS = 'wss://stream.binance.com:443',
        fWSS = 'wss://fstream.binance.com';
    ;


    const SPOT_ORDERTYPES = ['LIMIT', 'MARKET', 'STOP_LOSS', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT', 'LIMIT_MAKER'];


    const intervals = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"];
    const incomeTypes = ['TRANSFER', 'WELCOME_BONUS', 'REALIZED_PNL', 'FUNDING_FEE', 'COMMISSION', 'INSURANCE_CLEAR', 'REFERRAL_KICKBACK', 'COMMISSION_REBATE', 'MARKET_MAKER_REBATE', 'API_REBATE', 'CONTEST_REWARD', 'CROSS_COLLATERAL_TRANSFER', 'OPTIONS_PREMIUM_FEE', 'OPTIONS_SETTLE_PROFIT', 'INTERNAL_TRANSFER', 'AUTO_EXCHANGE', 'DELIVERED_SETTELMENT', 'COIN_SWAP_DEPOSIT', 'COIN_SWAP_WITHDRAW', 'POSITION_LIMIT_INCREASE_FEE']
    const contractTypes = ["PERPETUAL", "CURRENT_MONTH", "NEXT_MONTH", "CURRENT_QUARTER", "NEXT_QUARTER", "PERPETUAL_DELIVERING"]
    const shortenedContractTypes = ["PERPETUAL", "CURRENT_QUARTER", "NEXT_QUARTER"]
    const periods = ["5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"];
    const bools = [true, false];

    const SPOT_EXCHANGEINFO_PERMISSIONS = ["SPOT", "MARGIN", "LEVERAGED", "TRD_GRP_002", "TRD_GRP_003", "TRD_GRP_004", "TRD_GRP_005"]

    this.APIKEY = APIKEY; contractTypes
    this.APISECRET = APISecret;
    this.APIKEYSInfo = {};
    this.timestamp_offset = 0;
    this.ping = 0;

    this.orderCount_10s = 0;
    this.orderCount_1m = 0;
    this.usedWeight = 0;

    if (options.callback) this.callback = options.callback; else this.callback = () => { };
    if (options.timeout) this.timeout = options.timeout; else this.timeout = 500;
    if (options.hedgeMode == true) this.hedgeMode = true; else this.hedgeMode = false;
    if (options.fetchFloats == true) this.fetchFloats = true; else this.fetchFloats = false;
    if (options.recvWindow) this.recvWindow = options.recvWindow; else this.recvWindow = 8000;
    if (options.query) this.query = true; else this.query = false;
    if (options.extraResponseInfo) this.extraResponseInfo = true; else this.extraResponseInfo = false;  // will cause errors, do not use it except for dev-testing
    if (options.ws) this.ws = options.ws; else this.ws = false;
    if (options.test) this.test = true; else this.test = false;

    const SECOND = 1000,
        MINUTE = 60 * SECOND,
        HOUR = 60 * MINUTE,
        DAY = 24 * HOUR;
    ;

    // public functions ////



    // spot \\\\

    // spot Market DATA \\\\

    this.ping = async (reconnect = false, tries = -1) => {
        let resp;
        let startTime = Date.now();
        resp = await request(
            {
                baseURL: api,
                path: '/api/v3/ping',
                method: 'get'
            }
        );
        let endTime = Date.now();

        if (resp.error) {
            tries--;
            if (reconnect == false || tries == 0) return resp;
            else {
                await delay(binance.timeout);
                return this.ping(reconnect, tries);
            }
        }
        resp.roundtrip_time_millis = endTime - startTime;
        this.ping = resp.roundtrip_time_millis;
        return resp;
    }

    this.serverTime = async (reconnect = false, tries = -1) => {
        let resp;
        resp = await request(
            {
                baseURL: api,
                path: '/api/v3/time',
                method: 'get'
            });

        if (resp.error) {
            tries--;
            if (reconnect == false || tries == 0) return resp;
            else {
                await delay(binance.timeout);
                return this.serverTime(reconnect, tries);
            }
        }

        return resp.serverTime;
    }

    this.exchangeInfo = async (symbols = false, permissions = false, opts = { mapped: false }) => {
        const params = {
            baseURL: api,
            path: '/api/v3/exchangeInfo',
            method: 'get'
        }

        let options = {}
        if (symbols) {
            if (typeof symbols == 'string') options.symbol = symbols;
            else if (Array.isArray(symbols)) options.symbols = `[${symbols.map(symbol => `"${symbol}"`).toString()}]`;
        }
        if (permissions) {
            if (typeof permissions == 'string') if (!equal(permissions, SPOT_EXCHANGEINFO_PERMISSIONS)) return ERR('permissions', 'value', false, SPOT_EXCHANGEINFO_PERMISSIONS); else options.permissions = permissions;
            else options.permissions = `[${permissions.map(permissions => `"${permissions}"`).toString()}]`;
        }

        let resp = await request(params, options);

        if (resp.error) return resp;

        options = opts;
        let altResponse = false;
        if (typeof options == 'object' && Object.keys(options).length != 0) {
            altResponse = {};

            if (options.symbols || options.mapped) altResponse.symbols = resp.symbols.map(symbol => symbol.symbol);

            if (options.mapped) {
                let altResponse = {};
                altResponse.symbols = [];
                altResponse.exchangeInfo = {};
                altResponse.exchangeInfo.timezone = resp.timezone;
                altResponse.exchangeInfo.serverTime = resp.serverTime;
                altResponse.exchangeInfo.rateLimits = resp.rateLimits;
                altResponse.exchangeInfo.exchangeFilters = resp.exchangeFilters;


                resp.symbols.forEach(item => {
                    let symbol = item.symbol;
                    altResponse.symbols.push(symbol);
                    altResponse[symbol] = {};
                    for (let key of Object.keys(item)) {
                        let value = item[key];
                        if (key == 'filters') {
                            altResponse[symbol].filters = {};
                            item.filters.forEach(filter => {
                                const name = filter.filterType;
                                delete filter.filterType;
                                altResponse[symbol].filters[name] = filter;
                                if (name == 'LOT_SIZE' || name == 'PRICE_FILTER') {
                                    let keyName = 'pricePrecision';
                                    if (name == 'LOT_SIZE') keyName = 'quantityPrecision';
                                    const splitResult = filter.tickSize ? filter.tickSize.toString().split('.') : filter.stepSize.toString().split('.');
                                    const precision = splitResult.length == 1 ? splitResult[0].split('e').length == 1 ? parseInt(-(splitResult[0].length - 1)) : -parseInt(splitResult[0].split('e')[1]) : splitResult[1].length;
                                    altResponse[symbol][keyName] = precision;
                                }
                            });
                        } else {
                            altResponse[symbol][key] = value;
                        }
                    }
                    altResponse[symbol].orderTypes = item.orderTypes;

                });
                resp = altResponse;
            }
        }
        return resp;
    }

    this.orderBook = (symbol, limit = 100) => {
        if (!symbol) return ERR('symbol', 'required');
        if (!limit) return ERR('limit', 'required');

        const params = {
            baseURL: api,
            path: '/api/v3/depth',
            method: 'get'
        }

        const options = {
            symbol: symbol,
            limit: limit
        }

        return request(params, options);
    }

    this.trades = (symbol, limit = 500) => {
        if (!symbol) return ERR('symbol', 'required');
        if (!limit) return ERR('limit', 'required');

        const params = {
            baseURL: api,
            path: '/api/v3/trades',
            method: 'get'
        }

        const options = {
            symbol: symbol,
            limit: limit
        }

        return request(params, options);
    }

    this.oldTrades = (symbol, limit = 500, fromId = 0) => {
        if (!symbol) return ERR('symbol', 'required');
        if (!limit) return ERR('limit', 'required');

        const params = {
            baseURL: api,
            path: '/api/v3/historicalTrades',
            method: 'get'
        }

        const options = {
            symbol: symbol,
            limit: limit
        }

        if (fromId) options.fromId = fromId;

        return request(params, options, 'DATA');
    }

    this.aggTrades = async (symbol, limit = 500, fromId = 0, startTime = 0, endTime = 0) => {
        if (!symbol) return ERR('symbol', 'required');
        if (!limit) return ERR('limit', 'required');

        const params = {
            baseURL: api,
            path: '/api/v3/aggTrades',
            method: 'get'
        }

        const options = {
            symbol: symbol,
            limit: limit
        }

        if (fromId) options.fromId = fromId;
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let resp = await request(params, options);

        return renameObjectProperties(
            resp,
            [
                'aggTradeId',
                'price',
                'qty',
                'firstTradeId',
                'lastTradeId',
                'timestamp',
                'maker',
                'isBestPriceMatch'
            ]
        )
    }

    this.candlesticks = async (symbol, interval, limit = 500, startTime = 0, endTime = 0) => {
        if (!symbol) return ERR('symbol', 'required');
        if (!equal(interval, intervals)) return ERR('interval', 'value', false, intervals)
        if (!limit) return ERR('limit', 'required');

        const params = {
            baseURL: api,
            path: '/api/v3/klines',
            method: 'get'
        }

        const options = {
            symbol: symbol,
            interval: interval,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let resp = await request(params, options);

        return handleArrayResponse(
            resp,
            [
                'openTime',
                'open',
                'high',
                'low',
                'close',
                'volume',
                'closeTime',
                'quoteAssetVolume',
                'tradesCount',
                'takerBuy_baseAssetVolume',
                'takerBuy_quoteAssetVolume',
                'ignore'
            ]
        )
    }

    this.UIKlines = async (symbol, interval, limit = 500, startTime = 0, endTime = 0) => {
        if (!symbol) return ERR('symbol', 'required');
        if (!equal(interval, intervals)) return ERR('interval', 'value', false, intervals)
        if (!limit) return ERR('limit', 'required');

        const params = {
            baseURL: api,
            path: '/api/v3/uiKlines',
            method: 'get'
        }

        const options = {
            symbol: symbol,
            interval: interval,
            limit: limit
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        let resp = await request(params, options);

        return handleArrayResponse(
            resp,
            [
                'openTime',
                'open',
                'high',
                'low',
                'close',
                'volume',
                'closeTime',
                'quoteAssetVolume',
                'tradesCount',
                'takerBuy_baseAssetVolume',
                'takerBuy_quoteAssetVolume',
                'ignore'
            ]
        )
    }

    this.avgPrice = (symbol) => {
        if (!symbol) return ERR('symbol', 'required');
        const params = {
            baseURL: api,
            path: '/api/v3/avgPrice',
            method: 'get'
        }

        return request(params, { symbol: symbol });
    }

    this.ticker24h = (symbols_or_count = false) => {
        const params = {
            baseURL: api,
            path: '/api/v3/ticker/24hr',
            method: 'get'
        }

        const options = {}

        if (symbols_or_count) {
            if (typeof symbols_or_count == 'string') options.symbol = symbols_or_count;
            else if (Array.isArray(symbols_or_count)) options.symbols = `[${symbols_or_count.map(symbol => `"${symbol}"`).toString()}]`;
        }

        return request(params, options)
    }

    this.prices = async (symbols = false) => {
        const params = {
            baseURL: api,
            path: '/api/v3/ticker/price',
            method: 'get'
        }

        const options = {}

        if (symbols) {
            if (typeof symbols == 'string') options.symbol = symbols;
            else if (Array.isArray(symbols)) options.symbols = `[${symbols.map(symbol => `"${symbol}"`).toString()}]`;
        }

        let data = await request(params, options);
        if (data.error) return data;

        return Array.isArray(data) ? data.reduce((out, i) => ((out[i.symbol] = parseFloat(i.price)), out), {}) : { symbol: data.symbol, price: parseFloat(data.price) };
    }

    this.bookTicker = (symbols = false) => {
        const params = {
            baseURL: api,
            path: '/api/v3/ticker/bookTicker',
            method: 'get'
        }

        const options = {}
        if (symbols) {
            if (typeof symbols == 'string') options.symbol = symbols;
            else if (Array.isArray(symbols)) options.symbols = `[${symbols.map(symbol => `"${symbol}"`).toString()}]`;
        }

        return request(params, options);
    }

    this.rollingWindowStats = (symbols, windowSize = false, type = false) => {
        if (!symbols) return ERR('symbol', 'required');

        const params = {
            baseURL: api,
            path: '/api/v3/ticker',
            method: 'get'
        }

        const options = {}
        if (symbols) {
            if (typeof symbols == 'string') options.symbol = symbols;
            else if (Array.isArray(symbols)) options.symbols = `[${symbols.map(symbol => `"${symbol}"`).toString()}]`;
        }

        if (windowSize) {
            if (!windowSize.includes('m') && !windowSize.includes('h') && !windowSize.includes('d')) return ERR('windowSize', 'value', false, ['1m', '2m', '...', '59m', '1h', '2h', '...', '23h', '1d', '2d', '...', '7d'])
            options.windowSize = windowSize;
        }

        if (type) {
            if (!equal(type, ['FULL', 'MINI'])) return ERR('type', 'value', false, ['FULL', 'MINI'])
            options.type = type;
        }

        return request(params, options);
    }

    this.convertToQuantity = (symbol, quoteSize, customPrice = false) => {
        return this.convertToQty(symbol, quoteSize, customPrice);
    }

    this.convertToQty = async (symbol, quoteSize, customPrice = false) => {
        if (typeof spot_exchangeInfo != 'object' || !spot_exchangeInfo[symbol]) {
            spot_exchangeInfo = await this.exchangeInfo('', '', { mapped: true });

            if (spot_exchangeInfo.error) return ERR('Unexpected error, please try again');
            if (!spot_exchangeInfo.symbols.includes(symbol)) return ERR('It looks like the symbol is invalid, please check the symbol and try again');
        };

        if (customPrice) {
            if (!number(customPrice)) return ERR('customPrice', 'type', 'Number');
            return bigInt.parse((quoteSize / customPrice).toFixedNoRounding(spot_exchangeInfo[symbol].quantityPrecision))
        }

        const symbolPriceObj = await this.prices(symbol);
        if (symbolPriceObj.error) {
            if (symbolPriceObj.error.code == -1121) return ERR(`'${symbol}' is an invalid symbol.`);
            else return symbolPriceObj;
        }
        if (!symbolPriceObj.price) return ERR('Error fetching price of symbol, please check the symbol and try again.');

        return bigInt.parse((quoteSize / symbolPriceObj.price).toFixedNoRounding(spot_exchangeInfo[symbol].quantityPrecision))

    }

    // spot Market DATA ////

    // spot Account/Trade \\\\

    this.marketBuy = (symbol, quantity = false, quoteOrderQty = false, opts = {}) => {    // quantity quoteOrderQty
        return market(symbol, quantity, quoteOrderQty, 'BUY', opts);
    }

    this.marketSell = (symbol, quantity = false, quoteOrderQty = false, opts = {}) => {
        return market(symbol, quantity, quoteOrderQty, 'SELL', opts);
    }

    const market = (symbol, quantity, quoteOrderQty, side, opts) => {
        if (!quantity && !quoteOrderQty) return ERR(`Either 'quantity' or 'quoteOrderQty' need to be sent for this request.`);
        if (typeof opts != 'object') return ERR('opts', 'type', 'Object', ['{}', `{positionSide: 'LONG'}`], `Or just leave it blank.`);

        const options = {}
        if (quantity) options.quantity = quantity;
        else options.quoteOrderQty = quoteOrderQty;
        Object.assign(options, opts);

        return this.createOrder(symbol, side, 'MARKET', options);
    }

    this.buy = (symbol, quantity = false, quoteOrderQty = false, price, opts = {}) => {
        return limit(symbol, quantity, quoteOrderQty, price, 'BUY', opts);
    }

    this.sell = (symbol, quantity = false, quoteOrderQty = false, price, opts = {}) => {
        return limit(symbol, quantity, quoteOrderQty, price, 'SELL', opts);
    }

    const limit = (symbol, quantity, quoteOrderQty, price, side, opts) => {
        if (!quantity && !quoteOrderQty) return ERR(`Either 'quantity' or 'quoteOrderQty' need to be sent for this request.`);
        if (!price) return ERR('price', 'required');
        if (!number(price)) return ERR('price', 'type', 'Number');
        if (typeof opts != 'object') return ERR('opts', 'type', 'Object', ['{}', `{positionSide: 'LONG'}`], `Or just don't pass it.`);

        const options = {
            price: price
        }
        if (quantity) options.quantity;
        else options.quoteOrderQty = quoteOrderQty;
        Object.assign(options, opts);

        return this.createOrder(symbol, side, 'LIMIT', options);
    }

    this.createOrder = async (symbol, side, type, opts = {}) => {
        if (!symbol) return ERR('symbol', 'required');
        if (!equal(side, ['BUY', 'SELL'])) return ERR('side', 'value', false, ['BUY', 'SELL']);
        if (!equal(type, SPOT_ORDERTYPES)) return ERR('type', 'value', false, SPOT_ORDERTYPES);

        const params = {
            baseURL: sapi,
            path: '/api/v3/order',
            method: 'post'
        }

        if (binance.test) params.path += '/test';

        const options = {
            symbol: symbol,
            side: side,
            type: type,
            newOrderRespType: 'FULL'
        }
        if (type == "LIMIT") options.timeInForce = 'GTC';
        Object.assign(options, opts);


        if (!binance.test) {
            const resp = await request(params, options, 'SIGNED');
            if (resp.error) return resp;

            if (resp.fills) {
                resp.avgPrice = 0;
                let totalQty = 0;
                let total_forAvg = 0;

                resp.commissions = {};
                resp.commissions.assets = new Set();

                resp.fills.forEach(fill => {
                    totalQty += fill.qty;
                    total_forAvg += fill.qty * fill.price;

                    resp.commissions.assets.add(fill.commissionAsset);

                    if (!resp.commissions[fill.commissionAsset]) resp.commissions[fill.commissionAsset] = 0;
                    resp.commissions[fill.commissionAsset] += fill.commission
                });

                resp.commissions.assets = Array.from(resp.commissions.assets);
                resp.avgPrice = parseFloat((total_forAvg / totalQty).toFixed(14));
            }

            return resp;
        }

        let resp = await request(params, options, 'SIGNED');
        if (resp.error) return resp;
        return {
            success: {
                status: 200,
                statusText: 'Success',
                code: 0,
                msg: 'Order accepted'
            }
        }
    }

    this.cancelOrder = (symbol, orderId = 0, origClientOrderId = 0, newClientOrderId = 0, opts = {}) => {
        if (!symbol) return ERR('symbol', 'required');
        const params = {
            baseURL: api,
            path: '/api/v3/order',
            method: 'delete'
        }

        const options = {
            symbol: symbol
        }
        Object.assign(options, opts);
        if (orderId) options.orderId = orderId;
        if (origClientOrderId) options.origClientOrderId = origClientOrderId;
        if (newClientOrderId) options.newClientOrderId = newClientOrderId;

        return request(params, options, 'SIGNED');
    }

    this.cancelOpenOrders = (symbol, opts = {}) => {
        if (!symbol) return ERR('symbol', 'required');
        const params = {
            baseURL: api,
            path: '/api/v3/openOrders',
            method: 'delete'
        }

        const options = {}
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.orderStatus = (symbol, orderId = 0, origClientOrderId = 0, opts = {}) => {
        return this.order(symbol, orderId, origClientOrderId, opts);
    }

    this.order = (symbol, orderId = 0, origClientOrderId = 0, opts = {}) => {
        if (!symbol) return ERR('symbol', 'required');
        const params = {
            baseURL: api,
            path: '/api/v3/order',
            method: 'get'
        }

        const options = {
            symbol: symbol
        }
        Object.assign(options, opts);
        if (orderId) options.orderId = orderId;
        if (origClientOrderId) options.origClientOrderId = origClientOrderId;

        return request(params, options, 'SIGNED');
    }

    this.openOrders = (symbol = false, opts = {}) => {
        const params = {
            baseURL: api,
            path: '/api/v3/openOrders',
            method: 'get'
        }

        const options = {}
        Object.assign(options, opts);
        if (symbol) options.symbol = symbol;

        return request(params, options, 'SIGNED');
    }

    this.cancelReplace = () => {    // TODO

    }

    this.allOrders = (symbol, limit = 500, orderId = 0, startTime = 0, endTime = 0, opts = {}) => {
        if (!symbol) return ERR('symbol', 'required');
        const params = {
            baseURL: api,
            path: '/api/v3/allOrders',
            method: 'get'
        }

        const options = {
            limit: limit
        }
        Object.assign(options, opts);
        if (symbol) options.symbol = symbol;
        if (orderId) options.orderId = orderId;
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options, 'SIGNED');
    }

    this.newOCO = () => {
        // TODO
    }

    this.cancelOCO = () => {
        // TODO
    }

    this.OCOStatus = () => {
        // TODO
    }

    this.allOCO = () => {
        // TODO
    }

    this.allOpenOCO = () => {
        // TODO
    }

    this.account = async (mappedBalance = false, activeAssetsOnly = false, opts = {}) => {
        const params = {
            baseURL: api,
            path: '/api/v3/account',
            method: 'get'
        }

        const options = {};
        Object.assign(options, opts);

        let resp = await request(params, options, 'SIGNED');
        if (resp.error) return resp;

        if (activeAssetsOnly) resp.balances = resp.balances.filter(balance => balance.locked != 0 || balance.free != 0);
        if (!mappedBalance) return resp;
        const newObj = { ...resp }
        newObj.balances = {};
        for (let item of resp.balances) newObj.balances[item.asset] = item;
        return newObj;
    }

    this.userTrades = (symbol, limit = 500, orderId = 0, fromId = 0, startTime = 0, endTime = 0, opts = {}) => {
        if (!symbol) return ERR('symbol', 'required');

        const params = {
            baseURL: api,
            path: '/api/v3/myTrades',
            method: 'get'
        }

        const options = {
            symbol: symbol,
            limit: limit
        }
        Object.assign(options, opts);

        if (orderId) options.orderId = orderId;
        if (fromId) options.fromId = fromId;
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;

        return request(params, options, 'SIGNED');
    }

    this.userOrderCountUsage = (options = {}) => {
        const params = {
            baseURL: api,
            path: '/api/v3/rateLimit/order',
            method: 'get'
        }
        return request(params, options, 'SIGNED')
    }

    // spot Account/Trade ////

    // spot ////

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
                await delay(binance.timeout);
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
                await delay(binance.timeout);
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
     * @rest the rest of the parameters are bools and will be returned as an object with it's properties as the symbols' names
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
    this.futuresExchangeInfo = async (reconnect = false, tries = 0, options = { mapped: false }) => {
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
                await delay(binance.timeout);
                return this.futuresExchangeInfo(reconnect, tries, options);
            }
        }

        if (typeof options == 'object' && Object.keys(options).length != 0) {
            altResponse = {};

            if (options.symbols || options.mapped) altResponse.symbols = resp.symbols.map(symbol => symbol.symbol);

            if (options.mapped) {
                altResponse.exchangeInfo = {};
                altResponse.exchangeInfo.timezone = resp.timezone;
                altResponse.exchangeInfo.serverTime = resp.serverTime;
                altResponse.exchangeInfo.futuresType = resp.futuresType;
                altResponse.exchangeInfo.rateLimits = resp.rateLimits;
                altResponse.exchangeInfo.exchangeFilters = resp.exchangeFilters;
                altResponse.exchangeInfo.assets = resp.assets;


                resp.symbols.forEach(item => {
                    let symbol = item.symbol;
                    altResponse[symbol] = {};
                    for (let key of Object.keys(item)) {
                        let value = item[key];
                        if (!Array.isArray(value)) {
                            altResponse[symbol][key] = value;
                        }
                    }
                    altResponse[symbol].priceFilters = item.filters[0];
                    altResponse[symbol].lotFilters = item.filters[1];
                    altResponse[symbol].marketLotFilters = item.filters[2];
                    altResponse[symbol].maxNumOrders = item.filters[3].limit;
                    altResponse[symbol].maxNumAlgoOrders = item.filters[4].limit;
                    altResponse[symbol].minNotional = item.filters[5].notional;
                    altResponse[symbol].percentPriceFilters = item.filters[6];

                    altResponse[symbol].orderTypes = item.orderTypes;
                    altResponse[symbol].timeInForce = item.timeInForce;
                });
            } else resp.symbols.forEach(item => {
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
    this.futuresPrices = async (symbol = undefined, withTime = false) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/ticker/price',
            method: 'get'
        }

        let options = {};
        if (symbol) options.symbol = symbol;

        let data = await request(params, options);
        if (data.error) return data;
        return Array.isArray(data) ? withTime ? data.reduce((out, i) => ((out[i.symbol] = { price: parseFloat(i.price), time: i.time }), out), {}) : data.reduce((out, i) => ((out[i.symbol] = parseFloat(i.price)), out), {}) : { symbol: data.symbol, price: parseFloat(data.price), time: data.time };
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

    this.futuresConvertToQuantity = async (symbol, USDT_or_BUSD_margin, leverage = 1, customPrice = false) => {
        return this.futuresConvertToQty(symbol, USDT_or_BUSD_margin, leverage, customPrice);
    }

    this.futuresConvertToQty = async (symbol, USDT_or_BUSD_margin, leverage = 1, customPrice = false) => {
        if (!symbol) return ERR('symbol', 'required');
        if (!USDT_or_BUSD_margin) return ERR('USDT_or_BUSD_margin', 'required');
        if (!number(USDT_or_BUSD_margin)) return ERR('USDT_or_BUSD_margin', 'type', 'Number');
        if (!number(leverage)) return ERR('leverage', 'type', 'Number');

        if (typeof futures_exchangeInfo != 'object' || !futures_exchangeInfo[symbol]) {
            futures_exchangeInfo = await this.futuresExchangeInfo(true, 3,
                {
                    symbols: true,
                    quantityPrecision: true,
                    pricePrecision: true,

                }
            );

            if (futures_exchangeInfo.error) return ERR('Unexpected error, please try again');
            if (!futures_exchangeInfo.symbols.includes(symbol)) return ERR('It looks like the symbol is invalid, please check the symbol and try again');
        };

        const totalQuoteSize = USDT_or_BUSD_margin * leverage;
        if (totalQuoteSize < 5) return ERR('The total position size cannot be lower than 5USDT');

        if (customPrice) {
            if (!number(customPrice)) return ERR('customPrice', 'type', 'Number');
            return bigInt.parse((totalQuoteSize / customPrice).toFixedNoRounding(futures_exchangeInfo[symbol].quantityPrecision))
        }

        const symbolPriceObj = await this.futuresPrices(symbol);
        if (symbolPriceObj.error) {
            if (symbolPriceObj.error.code == -1121) return ERR(`'${symbol}' is an invalid symbol.`);
            else return symbolPriceObj;
        }
        if (!symbolPriceObj.price) return ERR('Error fetching price of symbol, please check the symbol and try again.');

        return bigInt.parse((totalQuoteSize / symbolPriceObj.price).toFixedNoRounding(futures_exchangeInfo[symbol].quantityPrecision))
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
            quantity: quantity
        }
        Object.assign(options, opts);

        if (!quantity) return ERR('quantity', 'required');
        if (!number(quantity)) return ERR('quantity', 'type', 'Number');

        return this.futuresCreateOrder(symbol, side, 'MARKET', options);
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
            options.reduceOnly = true;
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
            options.reduceOnly = true;
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
        if (!this.hedgeMode) delete options.positionSide; else delete options.reduceOnly;

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
    this.futuresMultipleOrders = async (orders, serialize = false, opts = { recvWindow: 10000 }) => {
        if (orders.length > 5) {
            console.log('more than 5!')
            if (serialize == false) return ERR(`A maximum of 5 orders per batch is allowed. To avoid this, send the second parameter 'serialize' as 'true' to serialize the batches`);
            let Batches = [];
            for (let x = 0; x < orders.length; x++) {
                let batchNumber = Math.floor(x / 5);
                if (!Batches[batchNumber]) Batches[batchNumber] = [];
                Batches[batchNumber].push(orders[x]);
            }

            let responses = [];
            for await (let batch of Batches) {
                let resp = await binance.futuresMultipleOrders(batch);
                console.log(resp);
                resp.forEach(responses.push);
            }
            return responses;
        }

        console.log(orders);

        const params = {
            baseURL: fapi,
            path: '/fapi/v1/batchOrders',
            method: 'post'
        }

        const options = {
            batchOrders: orders
        }

        Object.assign(options, opts);

        // return request(params, options, 'SIGNED', true);
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
        return ERR('This request currently isnt working (in library)'); // TODO
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/batchOrders',
            method: 'delete'
        }

        let options = {
            symbol: symbol
        }
        // if (!orderIdList && !origClientOrderIdList) return ERR(`Either 'orderIdList' or 'origClientOrderIdList' need to be sent for this request.`);
        // if (orderIdList) {
        //     if (!Array.isArray(orderIdList)) return ERR('orderIdList', 'type', 'Array');
        //     options.orderIdList = orderIdList;
        // } else if (origClientOrderIdList) {
        //     if (!Array.isArray(origClientOrderIdList)) return ERR('orderIdList', 'type', 'Array');
        //     options.origClientOrderIdList = origClientOrderIdList;
        // }

        // options.orderIdList = orderIdList.join('%')

        params.data = { orderIdList: [128731, 1238712] }

        return request(params, options, 'SIGNED', { 'Content-Type': 'application/x-www-form-urlencoded' });
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

    this.futuresForceOrders = (symbol = false, limit = 50, autoCloseType = '', startTime = 0, endTime = 0, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/forceOrders',
            method: 'get'
        }

        let options = {
            limit: limit
        }
        if (symbol) options.symbol = symbol;
        if (autoCloseType) {
            if (!equal(autoCloseType, ['LIQUIDATION', 'ADL'])) return ERR('autoCloseType', 'value', false, ['LIQUIDATION', 'ADL'])
            options.autoCloseType = autoCloseType;
        }
        if (startTime) options.startTime = startTime;
        if (endTime) options.endTime = endTime;
        Object.assign(options, opts);

        return request(params, options, 'SIGNED')
    }

    this.futuresQuantitativeRules = (symbol = false, opts = {}) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/apiTradingStatus',
            method: 'get'
        }

        let options = {}
        if (symbol) options.symbol;
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresUserCommissionRate = (symbol, opts = {}) => {
        if (!symbol) return ERR('symbol', 'required');
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/commissionRate ',
            method: 'get'
        }

        let options = {
            symbol: symbol
        }
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresTransactionHistoryDownloadId = (startTime, endTime, opts = {}) => {
        if (!startTime) return ERR('startTime', 'required');
        if (!endTime) return ERR('endTime', 'required');

        let params = {
            baseURL: fapi,
            path: '/fapi/v1/income/asyn',
            method: 'get'
        }

        let options = {
            startTime: startTime,
            endTime: endTime
        }
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresGetTransactionHistoryLinkByDownloadId = (downloadId, opts = {}) => {
        if (!downloadId) return ERR('downloadId', 'required');
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/income/asyn/id',
            method: 'get'
        }

        let options = {
            downloadId: downloadId
        }
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    this.futuresPortfolioMarginExchangeInfo = (symbol) => {
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/pmExchangeInfo',
            method: 'get'
        }

        let options = {}
        if (symbol) options.symbol = symbol;

        return request(params, options, 'SIGNED');
    }

    this.futuresPortfolioMarginAccountInfo = (asset, opts = {}) => {
        if (!asset) return ERR('asset', 'required');
        let params = {
            baseURL: fapi,
            path: '/fapi/v1/pmAccountInfo',
            method: 'get'
        }

        let options = {
            asset: asset
        }
        Object.assign(options, opts);

        return request(params, options, 'SIGNED');
    }

    // futures Account/Trade Endpoints ////

    // websockets \\\\

    this.websockets = {

        // spot websockets \\\\

        spot: {

            /**
             * Subscribes to any stream, not recommended as it will not rename the properties, for better clarity, please use the relevant websocket function
             * @param {String, Array} subscriptions - string OR array
             * @param {Function} callback - the callback function that will be called on any new websocket message
             */
            subscribe: async function (subscriptions, callback) {
                const params = {
                    baseURL: fWSS,
                    path: subscriptions
                }

                return connect(params, callback, (path) => { return path });
            },

            aggTrade: async function (symbol, callback) {
                if (!symbol) { return ERROR('symbol', 'required'); }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: `${symbol.toLowerCase()}@aggTrade`
                }

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        SPOT_AGGTRADE_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol) => {
                    if (symbol && symbol.includes('@aggTrade')) return symbol;

                    if (!symbol) { return ERROR('symbol', 'required'); }
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');
                    return `${symbol.toLowerCase()}@aggTrade`;
                }

                return connect(params, this.format, this.formPath)
            },

            trade: async function (symbol, callback) {
                if (!symbol) { return ERROR('symbol', 'required'); }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: `${symbol.toLowerCase()}@trade`
                }

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        SPOT_TRADE_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol) => {
                    if (symbol && symbol.includes('@trade')) return symbol;

                    if (!symbol) { return ERROR('symbol', 'required'); }
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');
                    return `${symbol.toLowerCase()}@trade`;
                }

                return connect(params, this.format, this.formPath)
            },

            candlesticks: async function (symbol, interval, callback) {
                if (!symbol) { return ERROR('symbol', 'required'); }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!interval) { return ERROR('interval', 'required'); }
                if (!equal(interval, intervals)) return ERROR('interval', 'value', false, intervals)

                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: `${symbol.toLowerCase()}@kline_${interval}`
                }

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        SPOT_CANDLESTICKS_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol, interval) => {
                    if (symbol && symbol.includes('@kline_')) return symbol;

                    if (!symbol) { return ERROR('symbol', 'required'); }
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                    if (!interval) { return ERROR('interval', 'required'); }
                    if (!equal(interval, intervals)) return ERROR('interval', 'value', false, intervals)

                    return `${symbol.toLowerCase()}@kline_${interval}`;
                }

                return connect(params, this.format, this.formPath)
            },

            lastPrice: async function (callback, symbol = false, isFast = false, withTime = false) {
                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS
                }

                let formatFunction = (msg) => {
                    if (Array.isArray(msg)) {
                        for (const item of msg) {
                            const obj = {};
                            if (withTime) {
                                obj.symbol = item.s;
                                obj.price = item.c;
                                obj.time = item.E;
                            } else {
                                obj[item.s] = item.c;
                            }
                            callback(obj);
                        }
                    } else if (msg.p) {
                        const obj = {};
                        if (withTime) {
                            obj.symbol = msg.s;
                            obj.price = msg.p;
                            obj.time = msg.E;
                        } else {
                            obj[msg.s] = msg.p;
                        }
                        callback(obj);
                    } else {
                        const obj = {};
                        if (withTime) {
                            obj.symbol = msg.s;
                            obj.price = msg.c;
                            obj.time = msg.E;
                        } else {
                            obj[msg.s] = msg.c;
                        }
                        callback(obj);
                    }
                };

                if (!symbol) params.path = '!miniTicker@arr';
                else if (isFast) params.path = `${symbol.toLowerCase()}@trade`;
                else params.path = `${symbol.toLowerCase()}@miniTicker`;

                this.formPath = (symbol = false, isFast = false) => {
                    if ((symbol && symbol.includes('miniTicker')) || (symbol && symbol.includes('trade'))) return symbol;
                    if (!symbol) return '!miniTicker@arr';
                    if (isFast) return `${symbol.toLowerCase()}@trade`;
                    return `${symbol.toLowerCase()}@miniTicker`;
                }

                return connect(params, formatFunction, this.formPath);
            },

            miniTicker: async function (callback, symbol = false) {
                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: '!miniTicker@arr'
                }
                if (symbol) params.path = `${symbol.toLowerCase()}@miniTicker`;

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        SPOT_MINITICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol = false) => {
                    if (symbol && symbol.includes('miniTicker')) return symbol;
                    let origPath = '!miniTicker@arr';
                    if (symbol) origPath = `${symbol.toLowerCase()}@miniTicker`;
                    return origPath;
                }

                return connect(params, this.format, this.formPath)
            },

            ticker: async function (callback, symbol = false) {
                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: '!ticker@arr'
                }
                if (symbol) params.path = `${symbol.toLowerCase()}@ticker`;

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        SPOT_TICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol = false) => {
                    if (symbol && symbol.includes('ticker')) return symbol;
                    let origPath = '!ticker@arr';
                    if (symbol) origPath = `${symbol.toLowerCase()}@ticker`;;
                    return origPath;
                }

                return connect(params, this.format, this.formPath)
            },

            rollingWindowStats: async function (symbol = false, windowSize, callback) {
                if (!windowSize) { return ERROR('windowSize', 'required', false, ['1h', '4h', '1d']); }
                if (!equal(windowSize, ['1h', '4h', '1d'])) return ERROR('windowSize', 'value', false, ['1h', '4h', '1d'])

                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: `!ticker_${windowSize}@arr`
                }
                if (symbol) params.path = `${symbol.toLowerCase()}@ticker_${windowSize.toLowerCase()}`;

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        SPOT_ROLLINGWINDOWSTATS_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol = false, windowSize) => {
                    if (symbol.includes('ticker_')) return symbol;

                    if (!windowSize) { return ERROR('windowSize', 'required'); }
                    if (!equal(windowSize, ['1h', '4h', '1d'])) return ERROR('windowSize', 'value', false, ['1h', '4h', '1d'])
                    let origPath = `!ticker_${windowSize.toLowerCase()}@arr`;
                    if (symbol) origPath = `${symbol.toLowerCase()}@ticker_${windowSize.toLowerCase()}`;
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            bookTicker: async function (callback, symbol = false) {
                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: '!bookTicker'
                }
                if (symbol) params.path = `${symbol.toLowerCase()}@bookTicker`;

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        SPOT_BOOKTICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol) => {
                    if (symbol.includes('ticker_')) return symbol;

                    let origPath = '!bookTicker';
                    if (symbol) origPath = `${symbol.toLowerCase()}@bookTicker`;
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            partialBookTicker: async function (symbol, levels, speed, callback) {
                if (!symbol) { return ERROR('symbol', 'required'); }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!levels) { return ERROR('levels', 'required', false, [5, 10, 20]); }
                if (!equal(levels, [5, 10, 20])) return ERROR('levels', 'value', false, [5, 10, 20])

                if (!speed) { return ERROR('speed', 'required', false, ['100ms', '1000ms']); }
                if (!equal(speed, ['100ms', '1000ms'])) return ERROR('speed', 'value', false, ['100ms', '1000ms'])

                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: sWSS,
                    path: `${symbol.toLowerCase()}@depth${levels}`
                }
                if (speed == '100ms') params.path += '@100ms';

                this.format = (msg) => {
                    callback(msg);
                }

                this.formPath = (symbol, levels, speed) => {
                    if (symbol.includes('depth')) return symbol;

                    if (!symbol) { return ERROR('symbol', 'required'); }
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                    if (!levels) { return ERROR('levels', 'required', false, [5, 10, 20]); }
                    if (!equal(levels, [5, 10, 20])) return ERROR('levels', 'value', false, [5, 10, 20])

                    if (!speed) { return ERROR('speed', 'required', false, ['100ms', '1000ms']); }
                    if (!equal(speed, ['100ms', '1000ms'])) return ERROR('speed', 'value', false, ['100ms', '1000ms'])

                    let origPath = `${symbol.toLowerCase()}@depth${levels}`;
                    if (speed == '100ms') origPath += '@100ms';
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            diffBookTicker: async function (symbol, speed, callback) {
                if (!symbol) { return ERROR('symbol', 'required'); }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!speed) { return ERROR('speed', 'required', false, ['100ms', '1000ms']); }
                if (!equal(speed, ['100ms', '1000ms'])) return ERROR('speed', 'value', false, ['100ms', '1000ms'])

                const params = {
                    baseURL: sWSS,
                    path: `${symbol.toLowerCase()}@depth`
                }
                if (speed == '100ms') params.path += '@100ms';

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        SPOT_DIFFBOOKTICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol, speed) => {
                    if (symbol.includes('depth')) return symbol;

                    if (!symbol) { return ERROR('symbol', 'required'); }
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                    if (!speed) { return ERROR('speed', 'required', false, ['100ms', '1000ms']); }
                    if (!equal(speed, ['100ms', '1000ms'])) return ERROR('speed', 'value', false, ['100ms', '1000ms'])

                    let origPath = `${symbol.toLowerCase()}@depth`;
                    if (speed == '100ms') origPath += '@100ms';
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            userData: async function (callback, tries = 10) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const reqParams = {
                    baseURL: api,
                    path: '/api/v3/userDataStream'
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
                    if (resp.error.code == -1) return resp;
                    await delay(binance.timeout)
                    if (tries < 0) return ERROR(`Couldn't connect to get the listenKey.`);
                    return binance.websockets.spot.userData(callback, --tries);
                }

                const params = {
                    baseURL: sWSS,
                    path: resp.listenKey
                }

                this.format = (msg) => {
                    if (msg.e == 'outboundAccountPosition ') {
                        msg = advancedRenameObjectProperties(msg, SPOT_OUTBOUNDACCOUNTPOSITION_KEYS);
                        callback(msg);
                    } else if (msg.e == 'balanceUpdate') {
                        msg = advancedRenameObjectProperties(msg, SPOT_BALANCEUPDATE_KEYS);
                        callback(msg);
                    } else if (msg.e == 'executionReport') {
                        msg = advancedRenameObjectProperties(msg, SPOT_EXECUTIONREPORT_KEYS);
                        callback(msg);
                    } else if (msg.e == 'listStatus') {
                        msg = advancedRenameObjectProperties(msg, SPOT_LISTSTATUS_KEYS);
                        callback(msg);
                    } else callback(msg);
                }

                let obj = await connect(params, this.format, () => { return resp.listenKey });

                obj.deleteKey = () => request(deleteParams, {}, 'DATA');
                obj.interval = setInterval(() => request(putParams, {}, 'DATA'), 15 * 60 * 1000);

                return obj;
            }

        },

        // spot websockets ////

        // futures websocket \\\\
        futures: {

            /**
             * Subscribes to any stream, not recommended as it will not rename the properties, for better clarity, please use the relevant websocket function
             * @param {String, Array} subscriptions - string OR array
             * @param {Function} callback - the callback function that will be called on any new websocket message
             */
            subscribe: async function (subscriptions, callback) {
                const params = {
                    baseURL: fWSS,
                    path: subscriptions
                }

                return connect(params, callback, (path) => { return path });
            },

            aggTrade: async function (symbol, callback) {
                if (!symbol) { return ERROR('symbol', 'required'); }
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');
                if (!callback) { return ERROR('callback', 'required'); }
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `${symbol.toLowerCase()}@aggTrade`
                }

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_AGGTRADE_KEYS
                    );
                    callback(msg);
                };

                this.formPath = (symbol) => {
                    if (symbol && symbol.includes('aggTrade')) return symbol;

                    if (!symbol) { ERROR('symbol', 'required'); return; }
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');
                    return `${symbol.toLowerCase()}@aggTrade`;
                }

                return connect(params, this.format, this.formPath);
            },

            markPrice: async function (callback, symbol = false, slow = false) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `!markPrice@arr@1s`
                }

                if (symbol) params.path = `${symbol.toLowerCase()}@markPrice@1s`
                if (slow) params.path = params.path.slice(0, -3);

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_MARKPRICE_KEYS
                    );

                    callback(msg);
                }

                this.formPath = (symbol = false, slow = false) => {
                    if (symbol && symbol.includes('markPrice')) return symbol;

                    let origPath = `!markPrice@arr@1s`;
                    if (symbol) origPath = `${symbol.toLowerCase()}@markPrice@1s`
                    if (slow) origPath = origPath.slice(0, -3);
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            lastPrice: async function (callback, symbol = false, isFast = false, withTime = false) {
                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS
                }

                let formatFunction = (msg) => {
                    if (Array.isArray(msg)) {
                        for (const item of msg) {
                            const obj = {};
                            if (withTime) {
                                obj.symbol = item.s;
                                obj.price = item.c;
                                obj.time = item.E;
                            } else {
                                obj[item.s] = item.c;
                            }
                            callback(obj);
                        }
                    } else if (msg.k) {
                        const obj = {};
                        if (withTime) {
                            obj.symbol = msg.s;
                            obj.price = msg.k.c;
                            obj.time = msg.E
                        } else {
                            obj[msg.s] = msg.k.c;
                        }
                        callback(obj);
                    } else {
                        const obj = {};
                        if (withTime) {
                            obj.symbol = msg.s;
                            obj.price = msg.p;
                            obj.time = msg.E;
                        } else {
                            obj[msg.s] = msg.p;
                        }
                        callback(obj);
                    }
                };

                if (!symbol) params.path = '!miniTicker@arr';
                else if (!isFast) params.path = `${symbol.toLowerCase()}@kline_1m`;
                else params.path = `${symbol.toLowerCase()}@aggTrade`;

                this.formPath = (symbol = false, isFast = false) => {
                    if (symbol && symbol.includes('miniTicker') || symbol.includes('kline') || symbol.includes('aggTrade')) return symbol;

                    if (!symbol) return '!miniTicker@arr';
                    if (!isFast) return `${symbol.toLowerCase()}@kline_1m`;
                    return `${symbol.toLowerCase()}@aggTrade`;
                }

                return connect(params, formatFunction, this.formPath)
            },

            /**
             * @param {String} symbol - required
             * @param {String} interval - required: "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M" 
             * @param {Function} callback - required
             */
            candlesticks: async function (symbol, interval, callback) {
                if (!symbol) return ERROR('symbol', 'required');
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!equal(interval, intervals)) return ERROR('interval', 'value', false, intervals);

                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `${symbol.toLowerCase()}@kline_${interval}`
                }

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_CANDLESTICKS_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol, interval) => {
                    if (symbol && symbol.includes('kline_')) return symbol;

                    if (!symbol) return ERROR('symbol', 'required');
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');
                    if (!equal(interval, intervals)) return ERROR('interval', 'value', false, intervals);
                    return `${symbol.toLowerCase()}@kline_${interval}`;
                }

                return connect(params, this.format, this.formPath);
            },

            continuousContractKline: async function (pair, contractType, interval, callback) {
                if (!pair) return ERROR('pair', 'required');
                if (typeof pair != 'string') return ERROR('pair', 'type', 'String');

                if (!contractType) return ERROR('contractType', 'required');
                if (!equal(contractType, shortenedContractTypes)) return ERROR('contractType', 'value', false, shortenedContractTypes);

                if (!interval) return ERROR('contractType', 'required');
                if (!equal(interval, intervals)) return ERROR('contractType', 'value', false, intervals);

                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                let params = {
                    baseURL: fWSS,
                    path: `${pair.toLowerCase()}_${contractType.toLowerCase()}@continuousKline_${interval}`
                }

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_CONTINUOUSCONTRACTKLINE_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (pair, contractType, interval) => {
                    if (pair && pair.includes('continuousKline_')) return pair;

                    if (!pair) return ERROR('pair', 'required');
                    if (typeof pair != 'string') return ERROR('pair', 'type', 'String');

                    if (!contractType) return ERROR('contractType', 'required');
                    if (!equal(contractType, shortenedContractTypes)) return ERROR('contractType', 'value', false, shortenedContractTypes);

                    if (!interval) return ERROR('contractType', 'required');
                    if (!equal(interval, intervals)) return ERROR('contractType', 'value', false, intervals);
                    return `${pair.toLowerCase()}_${contractType.toLowerCase()}@continuousKline_${interval}`;
                }

                return connect(params, this.format, this.formPath);
            },

            miniTicker: async function (callback, symbol = false) {
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

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_MINITICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol = false) => {
                    if (symbol && symbol.includes('miniTicker')) return symbol;

                    let origPath = '!miniTicker@arr';
                    if (symbol && typeof symbol != 'string') return ERROR('symbol', 'type', 'Number');
                    if (symbol) origPath = params.path = `${symbol.toLowerCase()}@miniTicker`;
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            ticker: async function (callback, symbol = false) {
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

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_TICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol = false) => {
                    if (symbol && symbol.includes('ticker')) return symbol;

                    let origPath = '!ticker@arr';
                    if (symbol && typeof symbol != 'string') return ERROR('symbol', 'type', 'Number');
                    if (symbol) origPath = params.path = `${symbol.toLowerCase()}@ticker`;
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            bookTicker: async function (callback, symbol = false) {
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

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_BOOKTICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol = false) => {
                    if (symbol && symbol.includes('bookTicker')) return symbol;

                    let origPath = '!bookTicker';
                    if (symbol && typeof symbol != 'string') return ERROR('symbol', 'type', 'Number');
                    if (symbol) origPath = `${symbol.toLowerCase()}@bookTicker`;
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            liquidationOrders: async function (callback, symbol = false) {
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

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_LIQUIDATIONORDERS_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol = false) => {
                    if (symbol && symbol.includes('forceOrder')) return symbol;

                    let origPath = '!forceOrder@arr';
                    if (symbol && typeof symbol != 'string') return ERROR('symbol', 'type', 'Number');
                    if (symbol) origPath = `${symbol.toLowerCase()}@forceOrder`;
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            partialBookTicker: async function (symbol, levels, speed, callback) {
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

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_PARTIALBOOKTICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol, levels, speed) => {
                    if (symbol && symbol.includes('@depth')) return symbol;

                    if (!symbol) return ERROR('symbol', 'required');
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                    if (!levels) return ERROR('levels', 'required', false, [5, 10, 20]);
                    if (!equal(levels, [5, 10, 20])) return ERROR('levels', 'value', false, [5, 10, 20]);

                    if (!speed) return ERROR('speed', 'required', false, ['500ms', '250ms', '100ms']);
                    if (!equal(speed, ['500ms', '250ms', '100ms'])) return ERROR('levels', 'value', false, ['500ms', '250ms', '100ms']);
                    let origPath = `${symbol.toLowerCase()}@depth${levels}`;
                    if (speed != '250ms') origPath += '@' + speed;
                    return origPath;

                }

                return connect(params, this.format, this.formPath);
            },

            diffBookTicker: async function (symbol, speed, callback) {
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

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_DIFFBOOKTICKER_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol, speed) => {
                    if (symbol && symbol.includes('@depth')) return symbol;

                    if (!symbol) return ERROR('symbol', 'required');
                    if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                    if (!speed) return ERROR('speed', 'required', false, ['500ms', '250ms', '100ms']);
                    if (!equal(speed, ['500ms', '250ms', '100ms'])) return ERROR('levels', 'value', false, ['500ms', '250ms', '100ms']);
                    let origPath = `${symbol.toLowerCase()}@depth`;
                    if (speed != '250ms') origPath += '@' + speed;
                    return origPath;
                }

                return connect(params, this.format, this.formPath);
            },

            compositeIndexSymbol: async function (symbol, callback) {
                if (!symbol) return ERROR('symbol', 'required');
                if (typeof symbol != 'string') return ERROR('symbol', 'type', 'String');

                if (!callback) return ERROR('callback', 'required');
                if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

                const params = {
                    baseURL: fWSS,
                    path: `${symbol.toLowerCase()}@compositeIndex`
                }

                this.format = (msg) => {
                    msg = advancedRenameObjectProperties(
                        msg,
                        FUTURES_COMPOSITEINDEXSYMBOL_KEYS
                    );
                    callback(msg);
                }

                this.formPath = (symbol) => {
                    if (symbol && symbol.includes('@compositeIndex')) return symbol;

                    if (!symbol) return ERROR('symbol', 'required');
                    return `${symbol.toLowerCase()}@compositeIndex`;
                }

                return connect(params, this.format, this.formPath);
            },

            userData: async function (callback, tries = 10) {
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
                    if (resp.error.code == -1) return resp;
                    await delay(binance.timeout)
                    if (tries < 0) return ERROR(`Couldn't connect to get the listenKey.`);
                    return binance.websockets.futures.userData(callback, --tries);
                }

                const params = {
                    baseURL: fWSS,
                    path: resp.listenKey
                }

                this.format = (msg) => {
                    if (msg.e == 'MARGIN_CALL') {
                        msg = advancedRenameObjectProperties(msg, FUTURES_MARGINCALL_KEYS);
                        callback(msg);
                    } else if (msg.e == 'ACCOUNT_UPDATE') {
                        msg = advancedRenameObjectProperties(msg, FUTURES_ACCOUNTUPDATE_KEYS);
                        callback(msg);
                    } else if (msg.e == 'ORDER_TRADE_UPDATE') {
                        msg = advancedRenameObjectProperties(msg, FUTURES_ORDERTRADEUPDATE_KEYS);
                        callback(msg);
                    } else if (msg.e == 'ACCOUNT_CONFIG_UPDATE') {
                        if (msg.ac) {
                            msg = advancedRenameObjectProperties(msg, FUTURES_ACCOUNTCONFIGLEVERAGECHANGE_KEYS);
                            callback(msg);
                        } else if (msg.ai) {
                            msg = advancedRenameObjectProperties(msg, FUTURES_ACCOUNTCONFIGMARGINMODECHANGE_KEYS);
                            callback(msg);
                        }
                    } else callback(msg);
                }

                let obj = connect(params, this.format, () => { return resp.listenKey });

                obj.deleteKey = () => request(deleteParams, {}, 'DATA');
                obj.interval = setInterval(() => request(putParams, {}, 'DATA'), 15 * 60 * 1000);

                return obj;
            }

        },

        /**
         * @returns { Promise < { 
         * sendPing: Promise < { result: {}, rateLimits: Array } | { error: { status: Integer, error: String, rateLimits: Array } } >, 
         * serverTime: Promise < { result: { serverTime: UNIX_timestamp }, rateLimits: Array } | { error: {status: Integer, error: String, rateLimits: Array} } > 
         * exchangeInfo(symbol_or_symbols:undefined|String|Array<String>, permissions:undefined|String|Array<String>, options: {mapped: boolean|undefined}): Promise < { result, rateLimits: Array } | { error: {status: Integer, error: String, rateLimits: Array} } >
         * account(mappedBalance: Boolean|undefined, activeAssetsOnly: boolean|undefined, opts: {recvWindow: Integer} |undefined): Promise < { result, rateLimits: Array } | { error: {status:Integer, error: String, rateLimits: Array} } > 
         * > } object }
         */
        websocketAPI: async function () {
            // if (!callback) return ERROR('callback', 'required');
            // if (typeof callback != 'function') return ERROR('callback', 'type', 'Function');

            const newPromise = (object, id) => {
                return new Promise((res) => {
                    object.resolves[id] = res;
                    setTimeout(() => {
                        if (object.resolves[id] && object.resolves[id] != undefined && typeof object.resolves[id] == 'function')
                            object.resolves[id](ERROR('No response was received from websocket endpoint within 10 seconds'))
                    }, 10000)
                });
            }

            const params = {
                baseURL: WS,
                path: ''
            }

            const WS_Object = await connect(params, () => { }, () => { }, true);
            delete WS_Object.subscribe;
            delete WS_Object.unsubscribe;
            delete WS_Object.subscriptions;
            delete WS_Object.privateMessage;

            WS_Object.sendPrivateMessage = async (OBJ, signed = false) => {
                const id = randomNumber(0, 1000000000000);

                const newOBJ = {
                    id,
                    method: OBJ.method
                }
                if (OBJ.params) newOBJ.params = OBJ.params;
                if (signed) {
                    const signature = createSignature(OBJ.params);
                    OBJ.params.signature = signature;
                }

                try {
                    const msg = JSON.stringify(newOBJ)
                    await WS_Object.socket.send(msg);
                    return newPromise(WS_Object, id);
                } catch (err) {
                    if (binance.ws) console.log(`error in: WS_Object.sendPrivateMessage()`);
                    await delay(binance.timeout);
                    return WS_Object.sendPrivateMessage(OBJ, signed);
                }
            }

            WS_Object.privateMessage = (msg) => {
                if (binance.fetchFloats) msg = parseAllPropertiesToFloat(msg);
                const requestWeight_1min = msg.rateLimits?.filter(element => element.rateLimitType == 'REQUEST_WEIGHT' && element.interval == 'MINUTE' && element.intervalNum == 1);
                if (Array.isArray(requestWeight_1min)) {
                    binance.usedWeight = requestWeight_1min[0].count;
                }
                const ID = msg.id;
                delete msg.id;
                if (msg.status != 200 || msg.error) {
                    WS_Object.resolves[ID]({ error: msg });
                }
                delete msg.status;

                WS_Object.resolves[ID](msg);
            }

            PREP_WS_OBJECT(WS_Object);

            return WS_Object;

            function createQueryString(q) {
                return Object.keys(q).sort()
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

            function createSignature(params) {
                const query = createQueryString(params);
                return crypto.createHmac('sha256', binance.APISECRET).update(query).digest('hex');
            }
        }

    }

    // futures websocket ////


    // functions necessary for websocket    \\\\

    /**
     * @return { Promise <{  close: Function ,  subscribe:Function, unsubscribe: Function, subscriptions: Function }> }
     */
    const connect = async (params, callback, formMessageFunc, override = false) => {
        if (!params.path && !override) { return ERROR('streamName', 'required'); }
        if (!callback) { return ERROR('callback', 'required'); }

        const newPromise = (object, id) => {
            return new Promise((res) => {
                object.resolves[id] = res;
                setTimeout(() => {
                    if (object.resolves[id] && object.resolves[id] != undefined && typeof object.resolves[id] == 'function')
                        object.resolves[id](ERROR('No response was received from websocket endpoint within 10 seconds'))
                }, 10000)
            });
        }

        const object = {
            alive: true,
            socket: {},
            cachedSubscriptions: Array.isArray(params.path) ? new Set(params.path) : new Set().add(params.path),
            close: () => {
                object.alive = false;
                object.socket.close();
                clearInterval(object.sendPingInterval);
                clearInterval(object.checkHeartBeatInterval);
                if (object.interval) {
                    clearInterval(object.interval);
                    object.deleteKey();
                }
            },
            // extras
            subscribe: async (...params) => {
                const formedWSPath = formMessageFunc(...params);
                if (formedWSPath.error) return formedWSPath;
                object.cachedSubscriptions.add(formedWSPath)


                const id = randomNumber(0, 1000000000);
                const msg = JSON.stringify
                    ({
                        "method": "SUBSCRIBE",
                        "params":
                            [
                                formedWSPath
                            ],
                        "id": id
                    });
                try {
                    object.socket.send(msg);
                    return newPromise(object, id);
                } catch (err) {
                    if (binance.ws) console.log(`error in: socket.subscribe():\n${err}`);
                    await delay(binance.timeout);
                    return object.subscribe(...params);
                }
            },
            unsubscribe: async (subscriptions) => {
                if (!subscriptions) return ERROR('subscription', 'type', `String' or 'Array`);
                const id = randomNumber(0, 1000000000);

                // deleting keys
                if (Array.isArray(subscriptions)) {
                    subscriptions.forEach(sub => object.cachedSubscriptions.delete(sub))
                } else object.cachedSubscriptions.delete(subscriptions);
                //


                const msg = JSON.stringify
                    ({
                        "method": "UNSUBSCRIBE",
                        "params":
                            Array.isArray(subscriptions) ? subscriptions :
                                [
                                    subscriptions
                                ],
                        "id": id
                    });
                try {
                    await object.socket.send(msg);
                    return newPromise(object, id);
                } catch (err) {
                    if (binance.ws) console.log(`error in: socket.unsubscribe()`)
                    await delay(binance.timeout);
                    return object.unsubscribe(subscriptions);
                }
            },
            subscriptions: async () => {
                const id = randomNumber(0, 1000000000);
                const msg = JSON.stringify
                    (
                        {
                            "method": "LIST_SUBSCRIPTIONS",
                            "id": id
                        }
                    );

                try {
                    object.socket.send(msg);
                    return newPromise(object, id);
                } catch (err) {
                    if (binance.ws) console.log(`error in: socket.subscriptions()`)
                    await delay(binance.timeout);
                    return object.subscriptions();
                }
            },
            privateMessage: (msg) => {
                if (typeof object.resolves[msg.id] != 'function') return;
                // For subscriptions \\
                if (Array.isArray(msg.result)) {
                    object.resolves[msg.id](msg.result);
                    delete object.resolves[msg.id];
                }
                // For subscriptions //

                // For non .subscriptions() requests \\\\
                else {
                    object.resolves[msg.id]('success!');
                    delete object.resolves[msg.id];
                }
                // For non .subscriptions() requests ////
            },
            resolves: {},
            originalResolve: -1,

            lastHeartBeat: Date.now(),
            sendPingInterval: setInterval(() => {
                if (object.alive) object.ping();
                else if (!object.alive) {
                    clearInterval(object.sendPingInterval);
                    return;
                }
            }, 2 * MINUTE),
            checkHeartBeatInterval: setInterval(() => {
                if (!object.alive) {
                    clearInterval(object.checkHeartBeatInterval);
                    return;
                }
                if (Date.now() - object.lastHeartBeat > 10 * MINUTE) {
                    if (binance.ws) console.log(`Didn't receive ANY updates for over 15 minutes, so restarting the websocket for ${params.path}`);
                    params.path = object.cachedSubscriptions.size == 1 ? Array.from(object.cachedSubscriptions)[0] : Array.from(object.cachedSubscriptions);
                    newSocket(params, callback, object);
                }
            }, 15 * MINUTE),

            ping: async (tries = 1) => {
                try {
                    object.socket.ping();
                } catch (err) {
                    if (tries < 0) return;
                    await delay(binance.timeout);
                    object.ping(--tries);
                }
            }
        }


        new newSocket(params, callback, object);

        return new Promise(res => {
            object.originalResolve = res;
        })
    }

    const newSocket = function (params, callback, object) {
        if (binance.ws) console.log({ path: params.path })
        let streamPath = params.path, allSubsDone = true;
        if (Array.isArray(streamPath)) {
            allSubsDone = false;
            streamPath = params.path[0];
        }

        object.socket = new ws(params.baseURL + `${streamPath ? `/ws/${streamPath}` : ''}`);
        let socket = object.socket;

        socket.on('open', () => {
            if (typeof object.originalResolve == 'function') object.originalResolve(object);
            object.originalResolve = -1;
            if (binance.ws) console.log(streamPath + ' is open');
            if (!allSubsDone) {
                allSubsDone = true;
                serializedSubscribe([...params.path], object);
            }
        })

        socket.on('message', (msg) => {
            const obj = parseSocketMessage(msg);

            if (Object.keys(obj).includes('id') && Object.keys(obj).includes('result') || Object.keys(obj).includes('id') && Object.keys(obj).includes('status')) {
                if (binance.ws) console.log('Private response to websocket message was received');
                object.privateMessage(obj);
                return;
            } else if (Object.keys(obj).includes('code') && Object.keys(obj).includes('msg') && Object.keys(obj).length == 2) {
                if (binance.ws) console.log('Error code from websocket message was received');
                if (typeof object.resolves[obj.id] == 'function') object.resolves[obj.id]({
                    error: {
                        status: 400,
                        statusText: 'Bad Websocket Request',
                        ...obj
                    }
                });
                return;
            }
            // normal websocket messages here \\
            if (binance.ws && typeof binance.ws == 'boolean') console.log(params.path + ' new message');
            callback(obj);
            // normal websocket messages here //
        })

        socket.on('error', () => {
            if (binance.ws) console.log(params.path + ' ERROR');
        })

        socket.on('close', () => {
            if (binance.ws) console.log(params.path + ' Closed!');
            if (!object.alive) return;
            setTimeout(() => {
                params.path = object.cachedSubscriptions.size == 1 ? Array.from(object.cachedSubscriptions)[0] : Array.from(object.cachedSubscriptions);
                newSocket(params, callback, object);
            }, binance.timeout);
            object.lastHeartBeat = Date.now();
        })

        socket.on('ping', () => {
            if (binance.ws) console.log(params.path + ' pinged.')
            socket.pong();
        })

        socket.on('pong', () => {
            if (binance.ws) console.log(params.path + ' ponged.');
            object.lastHeartBeat = Date.now();
        })
    }

    parseSocketMessage = (msg) => {
        const obj = JSON.parse(msg.toString());
        if (obj.id && obj.result) return obj;
        if (binance.fetchFloats) return parseAllPropertiesToFloat(obj);
        else return obj;
    }

    serializedSubscribe = async (arr, object) => {
        for await (const path of arr) {
            let resp = object.subscribe(path);
            await delay(150);
            let streamName = `subTo: ${path}`;
            let obj = {}; obj[streamName] = resp;
            if (binance.ws) console.log(obj)
        }
    }

    // functions necessary for websocket    ////

    // private functions \\\\

    const request = async (params, options = {}, type = 'default') => {
        params.headers = axios.defaults.headers[params.method];
        params.headers['Accept-Encoding'] = 'application/json';
        if (type == "DATA" || type == 'SIGNED') {
            if (!this.APIKEY) return ERR('APIKEY is required for this request');
            params.headers['X-MBX-APIKEY'] = this.APIKEY;
        }

        let query;
        if (type == "SIGNED") {
            if (!options.recvWindow) options.recvWindow = this.recvWindow;
            if (!this.APISECRET) return ERR('APISECRET is required for this request.');
            options.timestamp = Date.now() + this.timestamp_offset;
            query = makeQueryString(options);
            let signature = crypto.createHmac('sha256', this.APISECRET).update(query).digest('hex');
            options.signature = signature;
        }

        if (this.query) {
            if (query) console.log(query)
        }
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
            if (response.headers['x-mbx-order-count-10s']) {
                data['x-mbx-order-count-10s'] = response.headers['x-mbx-order-count-10s'];
                binance.orderCount_10s = response.headers['x-mbx-order-count-10s'];
            }
            if (response.headers['x-mbx-order-count-1m']) {
                data['x-mbx-order-count-1m'] = response.headers['x-mbx-order-count-1m'];
                binance.orderCount_1m = response.headers['x-mbx-order-count-1m'];
            }
            if (response.headers['x-mbx-used-weight-1m']) {
                data['x-mbx-used-weight-1m'] = response.headers['x-mbx-used-weight-1m'];
                binance.usedWeight = parseInt(response.headers['x-mbx-used-weight-1m']);
            }
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
                if (typeof err.response.data == 'object') Object.assign(error, err.response.data);
                else Object.assign(error, { code: -1, msg: 'Endpoint not found' });
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
        let time = await this.futuresServerTime(true, 3);
        if (time.error) return;
        let currentTime = Date.now();
        let delta = (currentTime - startTime) / 2;
        this.timestamp_offset = time + parseInt(delta) - currentTime;
        if (this.query) {
            console.log({ deltaTime: (delta * 2).toFixed() }, { timestamp_offset: this.timestamp_offset })
        }
        if (tries < 3) fetchOffset(++tries); else this.callback();
    }

    const handleArrayResponse = (Arr, keys, type = 'number') => {
        return Arr.map(item => {
            let ret = {};
            keys.forEach((key, c) => {
                if (key == 'ignore') return;
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

            for (let x = 0; x < keys.length; x++) {
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
                    const [oldKey, newKey] = newArr.shift().split('=');
                    obj[newKey] = advancedRenameObjectProperties(obj[oldKey], newArr);
                    delete obj[oldKey];
                } else {
                    const [oldKey, newKey] = key.split('=');
                    if (newKey != 'ignore') obj[newKey] = obj[oldKey];
                    delete obj[oldKey];
                }
            }
        }
        return obj;
    }

    const parseAllPropertiesToFloat = (obj) => {
        if (obj == null) return obj;
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

    const randomNumber = (lower, higher) => {
        return parseInt(Math.random() * (higher - lower) + lower);
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

    const ERR = (msg, errType = false, requiredType = false, possibilities = [], extraMsg = false) => {
        if (errType) {
            if (errType.toLowerCase() == 'required') msg = `Parameter '${msg}' is required for this request.`;
            if (errType.toLowerCase() == 'type') msg = `Parameter '${msg}' should be of type '${requiredType}'.`;
            if (errType.toLowerCase() == 'value') msg = `Parameter '${msg}' is invalid.`
            if (possibilities.length != 0) msg += ` Possible options:${possibilities.map(a => ` '${a}'`)}.`
            if (extraMsg) msg += ` ${extraMsg}`
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

        return {
            error: {
                status: 400,
                statusText: 'Websocket Error',
                code: -3,
                msg: msg
            }
        };
    }

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    // private functions ////

    // constants \\\\

    // SPOT WEBSOCKET KEYS \\\\

    function PREP_WS_OBJECT(WS_Object) {

        WS_Object.sendPing = () => {
            const obj = {
                method: 'ping'
            }
            return WS_Object.sendPrivateMessage(obj)
        }

        WS_Object.serverTime = () => {
            const obj = {
                method: 'time'
            }
            return WS_Object.sendPrivateMessage(obj)
        }

        WS_Object.exchangeInfo = async (symbol_or_symbols = false, permissions = false, options = { mapped: false }) => {
            const obj = {
                method: 'exchangeInfo'
            }
            if (symbol_or_symbols && typeof symbol_or_symbols != 'string' && !Array.isArray(symbol_or_symbols)) return ERROR('symbol_or_symbols', 'type', `String' or 'Array`);
            if (permissions && typeof permissions != 'string' && !Array.isArray(permissions)) return ERROR('permissions', 'type', `String' or 'Array`);
            if (symbol_or_symbols || permissions) obj.params = {};
            if (symbol_or_symbols) {
                obj.params.symbols = [];
                if (typeof symbol_or_symbols == 'string') obj.params.symbols.push(symbol_or_symbols);
                else obj.params.symbols.push(...symbol_or_symbols);
            } else if (permissions) {
                obj.params.permissions = [];
                if (typeof permissions == 'string') obj.params.permissions.push(permissions);
                else obj.params.permissions.push(...permissions);
            }
            const resp = await WS_Object.sendPrivateMessage(obj);
            if (resp.error) return resp;

            if (options.mapped) {
                let altResponse = {};
                altResponse.symbols = [];
                altResponse.exchangeInfo = {};
                altResponse.exchangeInfo.timezone = resp.result.timezone;
                altResponse.exchangeInfo.serverTime = resp.result.serverTime;
                altResponse.exchangeInfo.rateLimits = resp.result.rateLimits;
                altResponse.exchangeInfo.exchangeFilters = resp.result.exchangeFilters;


                resp.result.symbols.forEach(item => {
                    let symbol = item.symbol;
                    altResponse.symbols.push(symbol);
                    altResponse[symbol] = {};
                    for (let key of Object.keys(item)) {
                        let value = item[key];
                        if (key == 'filters') {
                            altResponse[symbol].filters = {};
                            item.filters.forEach(filter => {
                                const name = filter.filterType;
                                delete filter.filterType;
                                altResponse[symbol].filters[name] = filter;
                                if (name == 'LOT_SIZE' || name == 'PRICE_FILTER') {
                                    let keyName = 'pricePrecision';
                                    if (name == 'LOT_SIZE') keyName = 'quantityPrecision';
                                    const splitResult = filter.tickSize ? filter.tickSize.toString().split('.') : filter.stepSize.toString().split('.');
                                    const precision = splitResult.length == 1 ? splitResult[0].split('e').length == 1 ? parseInt(-(splitResult[0].length - 1)) : -parseInt(splitResult[0].split('e')[1]) : splitResult[1].length;
                                    altResponse[symbol][keyName] = precision;
                                }
                            });
                        } else {
                            altResponse[symbol][key] = value;
                        }
                    }
                    altResponse[symbol].orderTypes = item.orderTypes;

                });
                resp.result = altResponse;
            }

            return resp;
        }

        WS_Object.account = async (mappedBalance = false, activeAssetsOnly = false, opts = {}) => {
            let obj = {
                method: 'account.status',
                params: {
                    apiKey: binance.APIKEY,
                    timestamp: Date.now() + binance.timestamp_offset,
                    ...opts
                }
            }

            const resp = await WS_Object.sendPrivateMessage(obj, 'SIGNED');
            if (resp.error) return resp;

            if (activeAssetsOnly) resp.result.balances = resp.result.balances.filter(balance => balance.locked != 0 || balance.free != 0);
            if (!mappedBalance) return resp;
            const balances = [...resp.result.balances];
            const newObj = { ...resp }
            newObj.result.balances = {};
            for (let item of balances) newObj.result.balances[item.asset] = item;
            return newObj;
        }

        WS_Object.marketBuy = (symbol, quantity, quoteOrderQty, opts = {}) => {
            return market(symbol, quantity, quoteOrderQty, 'BUY', opts);
        }

        WS_Object.marketSell = (symbol, quantity, quoteOrderQty, opts = {}) => {
            return market(symbol, quantity, quoteOrderQty, 'SELL', opts);
        }

        // function market(symbol, quantity, quoteOrderQty, side, opts) {
        //     if (!quantity && !quoteOrderQty) return ERROR(`Either 'quantity' or 'quoteOrderQty' need to be sent for this request.`);
        //     if (typeof opts != 'object') return ERROR('opts', 'type', 'Object', ['{}', `{positionSide: 'LONG'}`], `Or just leave it blank.`);

        //     const options = {}
        //     if (quantity) options.quantity = quantity;
        //     else options.quoteOrderQty = quoteOrderQty;
        //     Object.assign(options, opts);

        //     return createOrder(symbol, side, 'MARKET', options);
        // }

        // async function createOrder(symbol, side, type, opts = {}) {
        //     if (!symbol) return ERROR('symbol', 'required');
        //     if (!equal(side, ['BUY', 'SELL'])) return ERROR('side', 'value', false, ['BUY', 'SELL']);
        //     if (!equal(type, SPOT_ORDERTYPES)) return ERROR('type', 'value', false, SPOT_ORDERTYPES);

        //     const params = {
        //         baseURL: sapi,
        //         path: '/api/v3/order',
        //         method: 'post'
        //     }

        //     if (binance.test) params.path += '/test';

        //     const options = {
        //         symbol: symbol,
        //         side: side,
        //         type: type,
        //         newOrderRespType: 'FULL'
        //     }
        //     if (type == "LIMIT") options.timeInForce = 'GTC';
        //     Object.assign(options, opts);


        //     if (!binance.test) {
        //         const resp = await request(params, options, 'SIGNED');
        //         if (resp.error) return resp;

        //         if (resp.fills) {
        //             resp.avgPrice = 0;
        //             let totalQty = 0;
        //             let total_forAvg = 0;

        //             resp.commissions = {};
        //             resp.commissions.assets = new Set();

        //             resp.fills.forEach(fill => {
        //                 totalQty += fill.qty;
        //                 total_forAvg += fill.qty * fill.price;

        //                 resp.commissions.assets.add(fill.commissionAsset);

        //                 if (!resp.commissions[fill.commissionAsset]) resp.commissions[fill.commissionAsset] = 0;
        //                 resp.commissions[fill.commissionAsset] += fill.commission
        //             });

        //             resp.commissions.assets = Array.from(resp.commissions.assets);
        //             resp.avgPrice = parseFloat((total_forAvg / totalQty).toFixed(14));
        //         }

        //         return resp;
        //     }

        //     let resp = await request(params, options, 'SIGNED');
        //     if (resp.error) return resp;
        //     return {
        //         success: {
        //             status: 200,
        //             statusText: 'Success',
        //             code: 0,
        //             msg: 'Order accepted'
        //         }
        //     }
        // }
    }

    const SPOT_AGGTRADE_KEYS = [
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

    const SPOT_TRADE_KEYS = [
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

    const SPOT_CANDLESTICKS_KEYS = [
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

    const SPOT_MINITICKER_KEYS = [
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

    const SPOT_TICKER_KEYS = [
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

    const SPOT_ROLLINGWINDOWSTATS_KEYS = [
        'e=event',
        'E=time',
        's=symbol',
        'p=priceChange',
        'P=percentChange',
        'o=open',
        'h=high',
        'l=low',
        'c=lastPrice',
        'w=weightedAvgPrice',
        'v=totalTraded_baseAssetVolume',
        'q=totalTraded_quoteAssetVolume',
        'O=stats_openTime',
        'C=stats_closeTime',
        'F=firstTradeId',
        'L=lastTradeId',
        'n=tradeCount'
    ];

    const SPOT_BOOKTICKER_KEYS = [
        'u=updateId',
        's=symbol',
        'b=bestBidPrice',
        'B=bestBidQty',
        'a=bestAskPrice',
        'A=bestAskQty'
    ];

    const SPOT_PARTIALBOOKTICKER_KEYS = [
        // not in use, for now
    ];

    const SPOT_DIFFBOOKTICKER_KEYS = [
        'e=event',
        'E=time',
        's=symbol',
        'U=firstUpdateId',
        'u=finalUpdateId',
        [
            'b=bids'
        ],
        [
            'a=asks'
        ]
    ];

    // SPOT USERDATA KEYS \\\\

    const SPOT_OUTBOUNDACCOUNTPOSITION_KEYS = [
        'e=event',
        'E=time',
        'u=lastAccountUpdateTime',
        [
            'B=balances',
            'a=asset',
            'f=free',
            'l=locked'
        ]
    ];

    const SPOT_BALANCEUPDATE_KEYS = [
        'e=event',
        'E=time',
        'a=asset',
        'd=balanceDelta',
        'T=clearTime'
    ];

    const SPOT_EXECUTIONREPORT_KEYS = [
        'e=event',
        'E=time',
        's=symbol',
        'c=clientOrderId',
        'S=side',
        'o=orderType',
        'f=timeInForce',
        'q=qty',
        'p=price',
        'P=stopPrice',
        'd=trailingDelta',
        'F=icebergQty',
        'g=orderListId',
        'C=origClientOrderId',
        'x=currentExecutionType',
        'X=currentOrderType',
        'r=orderRejectReason',
        'i=orderId',
        'l=lastExecutedQty',
        'z=cumulativeFilledQty',
        'L=lastExecutedPrice',
        'n=commissionAmount',
        'N=commissionAsset',
        'T=transactionId',
        't=tradeId',
        'I=ignore',
        'w=isOrderInBook',
        'm=maker',
        'M=ignore',
        'O=orderCreationTime',
        'Z=cumulative_quoteAssetTransactedQty',
        'Y=lastQuote_assetTrasactedQty',
        'Q=quoteOrderQty',
        'j=strategyId',
        'J=strategyType'
    ];

    const SPOT_LISTSTATUS_KEYS = [
        'e=event',
        'E=time',
        's=symbol',
        'g=orderListId',
        'c=contingencyType',
        'l=listStatusType',
        'L=listOrderStatus',
        'r=listRejectReason',
        'C=listClientOrderId',
        'T=transactionTime',
        [
            'O=orders',
            's=symbol',
            'i=orderId',
            'c=clientOrderId'
        ]
    ];

    // SPOT USERDATA KEYS ////


    // SPOT WEBSOCKET KEYS ////


    //////////////////////////////////////////////////////////////////////////////////////


    // FUTURES WEBSOCKET KEYS \\\\

    const FUTURES_AGGTRADE_KEYS = [
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
    ];

    const FUTURES_MARKPRICE_KEYS = [
        'e=event',
        'E=time',
        's=symbol',
        'p=markPrice',
        'i=indexPrice',
        'P=estimatedSettlePrice',
        'r=fundingRate',
        'T=nextFundingTime'
    ];

    const FUTURES_CANDLESTICKS_KEYS = [
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

    const FUTURES_CONTINUOUSCONTRACTKLINE_KEYS = [
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

    const FUTURES_MINITICKER_KEYS = [
        'e=event',
        'E=time',
        's=symbol',
        'c=close',
        'o=open',
        'h=high',
        'l=low',
        'v=totalTraded_baseAssetVolume',
        'q=totalTraded_quoteAsset'
    ];

    const FUTURES_TICKER_KEYS = [
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
    ];

    const FUTURES_BOOKTICKER_KEYS = [
        'e=event',
        'u=updateId',
        'E=time',
        'T=transactionTime',
        's=symbol',
        'b=bestBidPrice',
        'B=bestBidQty',
        'a=bestAskPrice',
        'A=bestAskQty',
    ];

    const FUTURES_LIQUIDATIONORDERS_KEYS = [
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
    ];

    const FUTURES_PARTIALBOOKTICKER_KEYS = [
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

    const FUTURES_DIFFBOOKTICKER_KEYS = [
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

    const FUTURES_COMPOSITEINDEXSYMBOL_KEYS = [
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
    ];

    // FUTURES USERDATA KEYS \\\\

    const FUTURES_MARGINCALL_KEYS = [
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

    const FUTURES_ACCOUNTUPDATE_KEYS = [
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

    const FUTURES_ORDERTRADEUPDATE_KEYS = [
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

    const FUTURES_ACCOUNTCONFIGLEVERAGECHANGE_KEYS = [
        'e=event',
        'E=time',
        'T=transactionTime',
        [
            'ac=newLeverage',
            's=symbol',
            'l=leverage'
        ]
    ];

    const FUTURES_ACCOUNTCONFIGMARGINMODECHANGE_KEYS = [
        'e=event',
        'E=time',
        'T=transactionTime',
        [
            'ai=newMarginMode',
            'j=mode'
        ]
    ];

    // FUTURES USERDATA KEYS ////

    // FUTURES WEBSOCKET KEYS ////

    // constants ////



    // library-reserved variables \\\\

    let spot_exchangeInfo;

    let futures_exchangeInfo;

    // library-reserved variables ////

    // prototypes \\\\

    Number.prototype.toFixedNoRounding = function (n) {
        const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g")
        const a = this.toString().match(reg)[0];
        const dot = a.indexOf(".");
        if (dot === -1) { // integer, insert decimal dot and pad up zeros
            return a + "." + "0".repeat(n);
        }
        const b = n - (a.length - dot) + 1;
        return b > 0 ? (a + "0".repeat(b)) : a;
    }

    // prototypes ////


    this.testing = () => {

    }
    if (options.useServerTime && options.useServerTime == true) { setInterval(fetchOffset, 1 * 60 * 60 * 1000); fetchOffset() }
}

module.exports = api;