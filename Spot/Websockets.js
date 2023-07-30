const Options = require('../essentials/Options');

const Info = require('../essentials/Info');

const { Websocket_Connection } = require('../WebsocketConnection');

const Error = require('../essentials/Error');

const { kline_interval, WS_AggTrade, WS_Trade, WS_Candlestick, WS_MiniTicker, WS_Ticker, WS_RollingWindowStats, WS_BookTicker, WS_Partial_OrderBook, WS_OrderBook, WS_userData_ACCOUNT_UPDATE, WS_userData_BALANCE_UPDATE, WS_userData_LIST_STATUS, WS_userData_ORDER_UPDATE, Spot_userData_Websocket } = require('../types/Spot');

const Spot = require('./RESTful');

class Spot_Websockets {

    baseURL = 'wss://stream.binance.com:9443';

    /**
     * @type {Options}
     */
    options;

    /**
     * @type {Info}
     */
    info;

    /**
     * @type {Spot}
     */
    Spot_RESTful;

    subscriptionConverter_functions = {
        AGGTRADE: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@aggTrade`) : '',

        TRADE: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@trade`) : '',

        CANDLESTICKS: (symbol, interval) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@${interval}`) : '',

        MINITICKER: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@miniTicker`) : '',
        ALL_MINITICKER: () => '!miniTicker@arr',

        TICKER: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@ticker`) : '',
        ALL_TICKER: () => '!ticker@arr',

        ROLLINGWINDOW_STATS: (symbol, windowSize) => typeof symbol === 'string' ? `${symbol.toLowerCase()}@ticker_${windowSize}` : '',
        ALL_ROLLINGWINDOW_STATS: (windowSize) => `!ticker_${windowSize}@arr`,

        BOOKTICKER: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@bookTicker`) : '',

        PARTIAL_ORDERBOOK: (symbol, levels, interval) => {
            if (typeof symbol !== 'string') return '';
            if (typeof levels !== 'string' && typeof levels !== 'number') return '';
            return `${symbol.toLowerCase()}@depth${levels}${interval === '100ms' ? '@100ms' : ''}`;
        },

        ORDERBOOK: (symbol, interval) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@depth${interval === '100ms' ? ('@100ms') : ''}`) : '',
    }

    constructor(options, info, Spot_RESTful) {
        this.options = options;
        this.info = info;
        this.Spot_RESTful = Spot_RESTful;
    }



    /**
     * The Aggregate Trade Streams push trade information that is aggregated for a single taker order.
     * - ***Update speed: `real-time`***
     * @param { (msg: WS_AggTrade) => void } callback 
     * @param {string} symbol 
     * @returns { Promise < Websocket_Connection | 
    *  {   
    *      subscribe: (symbol:string) => Promise< {error?: Error | undefined} >
    *      ,
    *      batch_subscribe: (...symbol:string[]) => Promise< {error?: Error | undefined} > >
    *  } 
    * >
    * }
    */
    aggTrade(callback, symbol) {

        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        return this.request(
            this.subscriptionConverter_functions.AGGTRADE(symbol)
            ,
            callback
            ,
            (msg) => this.convert_websocket_response(msg, AGGTRADE_RESPONSE_CONVERTER)
            ,
            this.subscriptionConverter_functions.AGGTRADE
        )
    }

    /**
     * The Trade Streams push raw trade information; each trade has a unique buyer and seller.
     * - ***Update speed: `real-time`***
     * @param { (msg: WS_Trade) => void } callback 
     * @param {string} symbol 
     * @returns { Promise < Websocket_Connection | 
    *  {   
    *      subscribe: (symbol:string) => Promise< {error?: Error | undefined} >
    *      ,
    *      batch_subscribe: (...symbol:string[]) => Promise< {error?: Error | undefined} > >
    *  } 
    * >
    * }
    */
    trade(callback, symbol) {

        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

        return this.request(
            this.subscriptionConverter_functions.TRADE(symbol)
            ,
            callback
            ,
            (msg) => this.convert_websocket_response(msg, TRADE_RESPONSE_CONVERTER)
            ,
            this.subscriptionConverter_functions.TRADE
        )
    }

    /**
     * The Trade Streams push raw trade information; each trade has a unique buyer and seller.
     * - ***Update speed:***
     * - - `1000ms` for `1s`
     * - - `2000ms` for the other intervals
     * - 
     * @param { (msg: WS_Candlestick) => void } callback 
     * @param {string} symbol 
     * @param {kline_interval} interval
     * @returns { Promise < Websocket_Connection | 
    *  {   
    *      subscribe: (symbol:string, interval:kline_interval) => Promise< {error?: Error | undefined} >
    *      ,
    *      batch_subscribe: (...args:[symbol:string, interval:kline_interval][]) => Promise< {error?: Error | undefined} > >
    *  } 
    * >
    * }
    */
    candlesticks(callback, symbol, interval) {
        if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');
        if (typeof interval === 'undefined') return new Error('interval', 'REQUIRED')

        return this.request(
            this.subscriptionConverter_functions.CANDLESTICKS(symbol, interval)
            ,
            callback
            ,
            (msg) => this.convert_websocket_response(msg, CANDLESTICKS_RESPONSE_CONVERTER)
            ,
            this.subscriptionConverter_functions.CANDLESTICKS
        )
    }

    /**
     * 24hr rolling window mini-ticker statistics for all symbols that changed in an array. 
     * - These are NOT the statistics of the UTC day, but a 24hr rolling window for the previous 24hrs. 
     * - Note that only tickers that have changed will be present in the array.
     * - *** Update speed: `1000ms`***
     * - 
     * @param { (msg: WS_MiniTicker) => void } callback 
     * @param {string} symbol
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...symbol:string[]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    miniTicker(callback, symbol) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.MINITICKER(symbol)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, MINITICKER_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.MINITICKER
            )
    }

    /**
     * 24hr rolling window mini-ticker statistics for all symbols that changed in an array. 
     * - These are NOT the statistics of the UTC day, but a 24hr rolling window for the previous 24hrs. 
     * - Note that only tickers that have changed will be present in the array.
     * - *** Update speed: `1000ms`***
     * - 
     * @param { (msg: WS_MiniTicker[]) => void } callback 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: () => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: () => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    miniTicker_allSymbols(callback) {

        return this.request
            (
                this.subscriptionConverter_functions.ALL_MINITICKER()
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, MINITICKER_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ALL_MINITICKER
            )
    }

    /**
     * 24hr rolling window ticker statistics for a single symbol. 
     * - These are NOT the statistics of the UTC day, but a 24hr rolling window for the previous 24hrs.
     * - *** Update speed: `1000ms`***
     * - 
     * @param { (msg: WS_Ticker) => void } callback 
     * @param {string} symbol
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (string:string) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...symbols:string[]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    ticker(callback, symbol) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.TICKER(symbol)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, TICKER_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.TICKER
            )
    }

    /**
     * 24hr rolling window ticker statistics for a single symbol. 
     * - These are NOT the statistics of the UTC day, but a 24hr rolling window for the previous 24hrs.
     * - *** Update speed: `1000ms`***
     * - 
     * @param { (msg: WS_Ticker[]) => void } callback 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: () => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: () => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    ticker_allSymbols(callback) {

        return this.request
            (
                this.subscriptionConverter_functions.ALL_TICKER()
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, TICKER_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ALL_TICKER
            )
    }

    /**
     * Rolling window ticker statistics for a single symbol, computed over multiple windows.
     * - Note:
     * - - This stream is different from the `ticker` stream. 
     * - - The open time `openTime` always starts on a minute, while the closing time `closeTime` is the current time of the update.
     * - - As such, the effective window might be up to `59999ms` wider that `windowSize`.
     * -
     * - *** Update speed: `1000ms`***
     * - 
     * @param { (msg: WS_RollingWindowStats) => void } callback 
     * @param {string} symbol
     * @param {"1h"|"4h"|"1d"} windowSize
     * @returns { Promise < Websocket_Connection | 
    *  {   
    *      subscribe: () => Promise< {error?: Error | undefined} >
    *      ,
    *      batch_subscribe: () => Promise< {error?: Error | undefined} > >
    *  } 
    * >
    * }
    */
    rollingWindow_stats(callback, symbol, windowSize) {

        if (typeof symbol !== 'string') return new Error('symbol', 'WRONG_TYPE', symbol, 'string');
        if (typeof windowSize !== 'string') return new Error('windowSize', 'WRONG_TYPE', symbol, 'string');

        return this.request
            (
                this.subscriptionConverter_functions.ROLLINGWINDOW_STATS(symbol, windowSize)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, ROLLINGWINDOW_STATS_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ROLLINGWINDOW_STATS
            )
    }

    /**
     * Rolling window ticker statistics for a single symbol, computed over multiple windows.
     * - Note:
     * - - This stream is different from the `ticker` stream. 
     * - - The open time `openTime` always starts on a minute, while the closing time `closeTime` is the current time of the update.
     * - - As such, the effective window might be up to `59999ms` wider that `windowSize`.
     * -
     * - *** Update speed: `1000ms`***
     * - 
     * @param { (msg: WS_RollingWindowStats[]) => void } callback 
     * @param {string} symbol
     * @param {"1h"|"4h"|"1d"} windowSize
     * @returns { Promise < Websocket_Connection | 
    *  {   
    *      subscribe: () => Promise< {error?: Error | undefined} >
    *      ,
    *      batch_subscribe: () => Promise< {error?: Error | undefined} > >
    *  } 
    * >
    * }
    */
    rollingWindow_stats_allSymbols(callback, windowSize) {

        if (typeof windowSize !== 'string') return new Error('windowSize', 'WRONG_TYPE', symbol, 'string');

        return this.request
            (
                this.subscriptionConverter_functions.ALL_ROLLINGWINDOW_STATS(windowSize)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, ROLLINGWINDOW_STATS_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ALL_ROLLINGWINDOW_STATS
            )
    }

    /**
     * Pushes any update to the best bid or ask's price or quantity in real-time for a specified symbol.
     * - ***Update speed: `real-time`***
     * - 
     * @param { (msg: WS_BookTicker) => void } callback 
     * @param {string} symbol
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...symbols:string[]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    bookTicker(callback, symbol) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.BOOKTICKER(symbol)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, BOOKTICKER_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.BOOKTICKER
            )
    }

    /**
     * - Top bids and asks, Valid are `5`, `10`, or `20`.
     * - ***Update speed: `1000ms` or `100ms`***
     * @param { (msg: WS_Partial_OrderBook) => void } callback 
     * @param {string} symbol
     * @param {'5'|'10'|'20'} levels
     * @param {'100ms'|'1000ms'} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, levels:'5'|'10'|'20', interval:'100ms'|'1000ms') => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[symbol:string, levels:'5'|'10'|'20', interval:'100ms'|'1000ms'][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    partialOrderBook(callback, symbol, levels, interval) {

        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');
        if (typeof levels !== 'string') return new Error(`'levels`, 'WRONG_TYPE', levels, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.PARTIAL_ORDERBOOK(symbol, levels, interval)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, PARTIAL_ORDERBOOK_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.PARTIAL_ORDERBOOK
            )
    }

    /**
     * - Order book price and quantity depth updates used to locally manage an order book.
     * - ***Update speed: `100ms` or `1000ms`***
     * @param { (msg: WS_OrderBook) => void } callback 
     * @param {string} symbol
     * @param {'100ms'|'1000ms'} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, interval:'100ms'|'1000ms') => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[symbol:string, interval:'100ms'|'1000ms'][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    orderBook_updates(callback, symbol, interval) {

        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');
        if (typeof levels !== 'string') return new Error(`'levels`, 'WRONG_TYPE', levels, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.ORDERBOOK(symbol, interval)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, ORDERBOOK_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ORDERBOOK
            )
    }




    /**
     * 
     * @param {Function} callback 
     * @param  {...string} paths 
     * @returns { Promise < Websocket_Connection > }
     */
    custom_stream(callback, ...paths) {
        return this.request(
            paths
            ,
            callback
        )
    }

    /**
     * @param { (msg: {event: 'outboundAccountPosition' | 'balanceUpdate' | 'executionReport' | 'listStatus'}) => void } callback 
     * @returns { Promise < Spot_userData_Websocket > }
     */
    async userData_stream(callback) {
        const response = await this.Spot_RESTful.listenKey_Spot();
        if (response.error) return response;

        if (typeof callback === 'undefined') return new Error(`callback`, 'REQUIRED');
        if (typeof callback !== 'function') return new Error(`callback`, 'WRONG_TYPE', callback, 'Function');

        const WS = new Spot_userData_Websocket(
            this.baseURL
            ,
            response.listenKey
            ,
            callback
            ,
            (msg) => {
                if (msg.event === WS.events.ACCOUNT_UPDATE) return this.convert_websocket_response(msg, USERDATA_RESPONSES.ACCOUNT_UPDATE);
                if (msg.event === WS.events.BALANCE_UPDATE) return this.convert_websocket_response(msg, USERDATA_RESPONSES.BALANCE_UPDATE);
                if (msg.event === WS.events.ORDER_UPDATE) return this.convert_websocket_response(msg, USERDATA_RESPONSES.ORDER_UPDATE);
                if (msg.event === WS.events.listStatus) return this.convert_websocket_response(msg, USERDATA_RESPONSES.listStatus);
                else return msg;
            }
            ,
            () => this.Spot_RESTful.keepAlive_listenKey(response.listenKey)
        );

        return new Promise(
            (resolve) => {
                WS.WS_handler.eventEmitter.once('open', () => resolve(WS))
            }
        )
    }





    /**
     * @param {string} path 
     * @param {Function} callback 
     * @param {Function} response_converter 
     * @param {Function} subscription_converter 
     * @returns {Websocket_Connection}
     */
    request(path, callback, response_converter, subscription_converter) {
        if (typeof callback === 'undefined') return new Error(`callback`, 'REQUIRED');
        if (typeof callback !== 'function') return new Error(`callback`, 'WRONG_TYPE', callback, 'Function');

        const WS = new Websocket_Connection(this.baseURL, path, callback, response_converter, subscription_converter);

        return new Promise(
            (resolve) => {
                WS.WS_handler.eventEmitter.once('open', () => resolve(WS))
            }
        )
    }

    convert_websocket_response(msg, converter_arr) {
        if (Array.isArray(msg)) return msg.map(item => this.convert_websocket_response(item, converter_arr));

        for (const [oldKey, newKey, nestedObject] of converter_arr) {
            if (typeof msg[oldKey] === 'undefined') continue;
            msg[newKey] = msg[oldKey];
            delete msg[oldKey];
            if (typeof nestedObject === 'object') this.convert_websocket_response(msg[newKey], nestedObject);
        }

        return msg;
    }

}

//// RESPONSE CONVERTERS \\\\

const USERDATA_RESPONSES = {

    ACCOUNT_UPDATE: [
        ['e', 'event'],
        ['E', 'time'],
        ['u', 'updateTime'],
        ['B', 'balances',
            [
                ['a', 'asset'],
                ['f', 'free'],
                ['l', 'locked']
            ]
        ]
    ],

    BALANCE_UPDATE: [
        ['e', 'event'],
        ['E', 'time'],
        ['a', 'asset'],
        ['d', 'balanceDelta'],
        ['T', 'clearTime']
    ],

    ORDER_UPDATE: [
        ['e', 'event'],
        ['E', 'time'],
        ['s', 'symbol'],
        ['c', 'clientOrderId'],
        ['S', 'side'],
        ['o', 'type'],
        ['f', 'timeInForce'],
        ['q', 'origQty'],
        ['p', 'price'],
        ['P', 'stopPrice'],
        ['F', 'icebergQty'],
        ['g', 'orderListId'],
        ['C', 'origClientOrderId'],
        ['x', 'executionType'],
        ['X', 'status'],
        ['r', 'rejectReason'],
        ['i', 'orderId'],
        ['l', 'lastExecutedQty'],
        ['z', 'cumQty'],
        ['L', 'lastExecutedPrice'],
        ['n', 'commission'],
        ['N', 'commissionAsset'],
        ['T', 'transactTime'],
        ['t', 'tradeId'],
        ['I', 'ignore1'],
        ['w', 'isOnBook'],
        ['m', 'isMaker'],
        ['M', 'ignore2'],
        ['O', 'orderCreationTime'],
        ['Z', 'cummulativeQuoteQty'],
        ['Y', 'lastExecutedQuoteQty'],
        ['Q', 'quoteSize'],
        ['W', 'workingTime'],
        ['V', 'selfTradePreventionMode'],

        ['d', 'trailingDelta'],
        ['D', 'trailingTime'],
        ['j', 'strategyId'],
        ['J', 'strategyType'],
        ['v', 'preventedMatchId'],
        ['A', 'preventedQty'],
        ['B', 'lastPreventedQty'],
        ['u', 'tradeGroupId'],
        ['U', 'counterOrderId']
    ],

    listStatus: [
        ['e', 'event'],
        ['E', 'time'],
        ['s', 'symbol'],
        ['g', 'orderListId'],
        ['c', 'contingencyType'],
        ['l', 'listStatusType'],
        ['L', 'listOrderStatus'],
        ['r', 'listRejectReason'],
        ['C', 'listClientOrderId'],
        ['O', 'orders',
            [
                ['s', 'symbol'],
                ['i', 'orderId'],
                ['c', 'clientOrderId']
            ]
        ]
    ]

}

const AGGTRADE_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['a', 'aggTradeId'],
    ['p', 'price'],
    ['q', 'qty'],
    ['f', 'firstTradeId'],
    ['l', 'lastTradeId'],
    ['T', 'tradeTime'],
    ['m', 'isBuyerMaker'],
    ['M', 'isBestMatch']
];

const TRADE_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['t', 'tradeId'],
    ['p', 'price'],
    ['q', 'qty'],
    ['b', 'buyerOrderId'],
    ['a', 'sellerOrderId'],
    ['T', 'tradeTime'],
    ['m', 'isBuyerMaker'],
    ['M', 'isBestMatch']
];

const CANDLESTICKS_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['k', 'candle',
        [
            ['t', 'openTime'],
            ['T', 'closeTime'],
            ['s', 'symbol'],
            ['f', 'firstTradeId'],
            ['L', 'lastTradeId'],
            ['o', 'open'],
            ['c', 'close'],
            ['h', 'high'],
            ['l', 'low'],
            ['v', 'baseAsset_volume'],
            ['n', 'tradeCount'],
            ['x', 'isCandleClosed'],
            ['q', 'quoteAsset_volume'],
            ['V', 'takerBuy_baseAsset_volume'],
            ['Q', 'takerBuy_quoteAsset_volume'],
            ['B', 'ignore']
        ]
    ]
];

const MINITICKER_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['c', 'close'],
    ['o', 'open'],
    ['h', 'high'],
    ['l', 'low'],
    ['v', 'totalTraded_baseAsset_volume'],
    ['q', 'totalTraded_quoteAsset_volume']
];

const TICKER_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['p', 'priceChange'],
    ['P', 'percentChange'],
    ['w', 'weightedAvgPrice'],
    ['x', 'firstTradeBeforeWindowOpen_price']
    ['c', 'close'],
    ['Q', 'lastQty'],
    ['b', 'bestBidPrice'],
    ['B', 'bestBidQty'],
    ['a', 'bestAskPrice'],
    ['A', 'bestAskQty'],
    ['o', 'open'],
    ['h', 'high'],
    ['l', 'low'],
    ['v', 'totalTraded_baseAsset_volume'],
    ['q', 'totalTraded_quoteAsset_volume'],
    ['O', 'openTime'],
    ['C', 'closeTime'],
    ['F', 'firstTradeId'],
    ['L', 'lastTradeId'],
    ['n', 'tradeCount']
];

const ROLLINGWINDOW_STATS_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['p', 'priceChange'],
    ['P', 'percentChange'],
    ['o', 'open'],
    ['h', 'high'],
    ['l', 'low'],
    ['c', 'close'],
    ['w', 'weightAvgPrice'],
    ['v', 'totalTraded_baseAsset_volume'],
    ['q', 'totalTraded_quoteAsset_volume'],
    ['O', 'openTime'],
    ['C', 'closeTime'],
    ['F', 'firstTradeId'],
    ['L', 'lastTradeId'],
    ['n', 'tradeCount']
];

const BOOKTICKER_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['u', 'updateId'],
    ['s', 'symbol'],
    ['b', 'bestBidPrice'],
    ['B', 'bestBidQty'],
    ['a', 'bestAskPrice'],
    ['A', 'bestAskQty']
];

const PARTIAL_ORDERBOOK_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['lastUpdateId', 'lastUpdateId'],
    ['bids', 'bids'],
    ['asks', 'asks']
];

const ORDERBOOK_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['U', 'firstUpdateId'],
    ['u', 'lastUpdateId'],
    ['b', 'bids'],
    ['a', 'asks']
];

// RESPONSE CONVERTERS ////

module.exports = Spot_Websockets;