const Options = require('../essentials/Options');

const Info = require('../essentials/Info');

const { Websocket_Connection, Binance_userData_WS_Connection } = require('../WebsocketConnection');

const Error = require('../essentials/Error');

const Types = require('../types/Futures');

const Futures = require('./RESTful');

const JSON_Bigint = require('json-bigint')({ storeAsString: true });

class Futures_Websockets {

    baseURL = 'wss://fstream.binance.com';

    /**
     * @type {Options}
     */
    options;

    /**
     * @type {Info}
     */
    info;

    /**
     * @type {Futures}
     */
    Futures_RESTful;

    subscriptionConverter_functions = {
        AGGTRADE: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@aggTrade`) : '',

        MARKPRICE: (symbol, interval) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@markPrice${interval === '1s' ? '@1s' : ''}`) : '',
        ALL_MARKPRICE: (interval) => `!markPrice@arr${interval === '1s' ? '@1s' : ''}`,

        CANDLESTICKS: (symbol, interval) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@${interval}`) : '',

        CONTINUOUSCANDLESTICKS: (pair, contractType, interval) => typeof pair === 'string' ? (`${pair.toLowerCase()}_${contractType}@continuousKline_${interval}`) : '',

        MINITICKER: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@miniTicker`) : '',
        ALL_MINITICKER: () => '!miniTicker@arr',

        TICKER: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@ticker`) : '',
        ALL_TICKER: () => '!ticker@arr',

        BOOKTICKER: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@bookTicker`) : '',
        ALL_BOOKTICKER: () => '!bookTicker',

        LIQUIDATION: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@forceOrder`) : '',
        ALL_LIQUIDATION: () => '!forceOrder@arr',

        PARTIAL_ORDERBOOK: (symbol, levels, interval) => {
            if (typeof symbol !== 'string') return '';
            if (typeof levels !== 'string' && typeof levels !== 'number') return '';
            return `${symbol.toLowerCase()}@depth${levels}${interval === '100ms' ? ('@100ms') : (interval === '500ms' ? '@500ms' : '')}`;
        },
        ORDERBOOK: (symbol, interval) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@depth${interval === '100ms' ? ('@100ms') : (interval === '500ms' ? '@500ms' : '')}`) : '',

        COMPOSITEINDEX: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@compositeIndex`) : '',

        CONTRACTINFO: () => '!contractInfo',

        MULTIASSETMODE_ASSETINDEX: (symbol) => typeof symbol === 'string' ? (`${symbol.toLowerCase()}@assetIndex`) : '',
        ALL_MULTIASSETMODE_ASSETINDEX: () => '!assetIndex@arr',
    }

    constructor(options, info, Futures_RESTful) {
        this.options = options;
        this.info = info;
        this.Futures_RESTful = Futures_RESTful;
    }

    /**
     * - ***Update speed: `100ms`***
     * @param {Function} callback 
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
        if (typeof symbol !== 'string') return new Error('symbol', 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.AGGTRADE(symbol)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, AGGTRADE_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.AGGTRADE
            );
    }

    /**
     * - ***Update speed: `3000ms` or `1000ms`***
     * @param {Function} callback 
     * @param {string} symbol 
     * @param {'1s'|'3s'|undefined} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, interval:'1s'|'3s'|undefined) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[symbol:string, interval:'1s'|'3s'|undefined][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    markPrice(callback, symbol, interval) {
        if (typeof symbol !== 'string') return new Error('symbol', 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.MARKPRICE(symbol, interval)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, MARKPRICE_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.MARKPRICE
            );
    }

    /**
     * @param {Function} callback 
     * @param {'1s'|'3s'|undefined} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (interval:'1s'|'3s'|undefined) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...interval:'1s'|'3s'|undefined) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    markPrice_allSymbols(callback, interval) {

        return this.request
            (
                this.subscriptionConverter_functions.ALL_MARKPRICE(interval)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, MARKPRICE_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ALL_MARKPRICE
            )
    }

    /**
     * @param {Function} callback 
     * @param {string} symbol
     * @param {Types.Futures_interval} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, interval:Types.Futures_interval) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[symbol:string, interval:Types.Futures_interval][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    candlesticks(callback, symbol, interval) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
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
     * @param {Function} callback 
     * @param {string} pair
     * @param {'PERPETUAL'|'CURRENT_QUARTER'|'NEXT_QUARTER'} contractType
     * @param {Types.Futures_interval} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (pair:string, contractType:'PERPETUAL'|'CURRENT_QUARTER'|'NEXT_QUARTER', interval:Types.Futures_interval) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[pair:string, contractType:'PERPETUAL'|'CURRENT_QUARTER'|'NEXT_QUARTER', interval:Types.Futures_interval][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    continuousCandlesticks(callback, pair, contractType, interval) {
        if (typeof pair !== 'string') return new Error(`'pair`, 'WRONG_TYPE', pair, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.CONTINUOUSCANDLESTICKS(pair, contractType, interval)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, CONTINUOUSCANDLESTICKS_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.CONTINUOUSCANDLESTICKS
            )
    }

    /**
     * @param {Function} callback 
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
     * @param {Function} callback 
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
     * @param {Function} callback 
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
     * @param {Function} callback 
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
     * @param {Function} callback 
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
     * @param {Function} callback 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: () => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: () => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    bookTicker_allSymbols(callback) {

        return this.request
            (
                this.subscriptionConverter_functions.ALL_BOOKTICKER()
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, BOOKTICKER_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ALL_BOOKTICKER
            )
    }

    /**
     * @param {Function} callback 
     * @param {string} symbol
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, interval:Types.Futures_interval) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...symbols:string[]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    liquidationOrders(callback, symbol) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.LIQUIDATION(symbol)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, LIQUIDATION_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.LIQUIDATION
            )
    }

    /**
     * @param {Function} callback 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: () => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: () => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    liquidationOrders_allSymbols(callback) {

        return this.request
            (
                this.subscriptionConverter_functions.ALL_LIQUIDATION()
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, LIQUIDATION_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ALL_LIQUIDATION
            )
    }

    /**
     * @param {Function} callback 
     * @param {string} symbol
     * @param {'5'|'10'|'20'} levels
     * @param {'100ms'|'250ms'|'500ms'} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, levels:'5'|'10'|'20', interval:'100ms'|'250ms'|'500ms') => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[symbol:string, levels:'5'|'10'|'20', interval:'100ms'|'250ms'|'500ms'][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    partialOrderBook(callback, symbol, levels, interval) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

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
     * @param {Function} callback 
     * @param {string} symbol
     * @param {'100ms'|'250ms'|'500ms'} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, interval:'100ms'|'250ms'|'500ms') => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[symbol:string, interval:'100ms'|'250ms'|'500ms'][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    orderBook_updates(callback, symbol, interval) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

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
     * @param {Function} callback 
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
    compositeIndex_symbolInfo(callback, symbol) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.COMPOSITEINDEX(symbol)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, COMPOSITEINDEX_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.COMPOSITEINDEX
            )
    }

    /**
     * @param {Function} callback 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, interval:Types.Futures_interval) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[symbol:string, interval:Types.Futures_interval][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    contractInfo(callback) {

        return this.request
            (
                this.subscriptionConverter_functions.CONTRACTINFO()
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, CONTRACTINFO_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.CONTRACTINFO
            )
    }

    /**
     * @param {Function} callback 
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
    multiAssetMode_assetIndex(callback, symbol) {
        if (typeof symbol !== 'string') return new Error(`'symbol`, 'WRONG_TYPE', symbol, 'String');

        return this.request
            (
                this.subscriptionConverter_functions.MULTIASSETMODE_ASSETINDEX(symbol, interval)
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, MULTIASSETMODE_ASSETINDEX_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.MULTIASSETMODE_ASSETINDEX
            )
    }

    /**
     * @param {Function} callback 
     * @param {string} symbol
     * @param {Types.Futures_interval} interval 
     * @returns { Promise < Websocket_Connection | 
     *  {   
     *      subscribe: (symbol:string, interval:Types.Futures_interval) => Promise< {error?: Error | undefined} >
     *      ,
     *      batch_subscribe: (...args:[symbol:string, interval:Types.Futures_interval][]) => Promise< {error?: Error | undefined} > >
     *  } 
     * >
     * }
     */
    multiAssetMode_assetIndex_allSymbols(callback) {

        return this.request
            (
                this.subscriptionConverter_functions.ALL_MULTIASSETMODE_ASSETINDEX()
                ,
                callback
                ,
                (msg) => this.convert_websocket_response(msg, MULTIASSETMODE_ASSETINDEX_RESPONSE_CONVERTER)
                ,
                this.subscriptionConverter_functions.ALL_MULTIASSETMODE_ASSETINDEX
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
     * @param {Function} callback 
     * @returns { Promise < Futures_userData_Websocket > }
     */
    async userData_stream(callback) {
        const response = await this.Futures_RESTful.start_userData_stream();
        if (response.error) return response;

        if (typeof callback === 'undefined') return new Error(`callback`, 'REQUIRED');
        if (typeof callback !== 'function') return new Error(`callback`, 'WRONG_TYPE', callback, 'Function');

        const WS = new Futures_userData_Websocket(
            this.baseURL
            ,
            response.listenKey
            ,
            callback
            ,
            (msg) => {
                if (msg.e === WS.events.MARGIN_CALL) return this.convert_websocket_response(msg, USERDATA_RESPONSES.MARGIN_CALL)
                else if (msg.e === WS.events.ACCOUNT_UPDATE) return this.convert_websocket_response(msg, USERDATA_RESPONSES.ACCOUNT_UPDATE)
                else if (msg.e === WS.events.ORDER_TRADE_UPDATE) return this.convert_websocket_response(msg, USERDATA_RESPONSES.ORDER_TRADE_UPDATE)
                else if (msg.e === WS.events.ACCOUNT_CONFIG_UPDATE) return this.convert_websocket_response(msg, USERDATA_RESPONSES.ACCOUNT_CONFIG_UPDATE)
                else if (msg.e === WS.events.STRATEGY_UPDATE) return this.convert_websocket_response(msg, USERDATA_RESPONSES.STRATEGY_UPDATE)
                else if (msg.e === WS.events.GRID_UPDATE) return this.convert_websocket_response(msg, USERDATA_RESPONSES.GRID_UPDATE)
                else if (msg.e === WS.events.CONDITIONAL_ORDER_TRIGGER_REJECT) return this.convert_websocket_response(msg, USERDATA_RESPONSES.CONDITIONAL_ORDER_TRIGGER_REJECT)
                else return msg;
            }
            ,
            () => this.Futures_RESTful.keepAlive_userData_stream()
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
            // if (typeof msg[oldKey] === 'undefined') continue;
            msg[newKey] = msg[oldKey];
            delete msg[oldKey];
            if (typeof nestedObject === 'object') this.convert_websocket_response(msg[newKey], nestedObject);
        }

        return msg;
    }

}

class Futures_userData_Websocket extends Binance_userData_WS_Connection {

    events = {
        LISTENKEY_EXPIRED: 'listenKeyExpired',
        MARGIN_CALL: 'MARGIN_CALL',
        ACCOUNT_UPDATE: 'ACCOUNT_UPDATE',
        ORDER_TRADE_UPDATE: 'ORDER_TRADE_UPDATE',
        ACCOUNT_CONFIG_UPDATE: 'ACCOUNT_CONFIG_UPDATE',
        STRATEGY_UPDATE: 'STRATEGY_UPDATE',
        GRID_UPDATE: 'GRID_UPDATE',
        CONDITIONAL_ORDER_TRIGGER_REJECT: 'CONDITIONAL_ORDER_TRIGGER_REJECT'
    }

    constructor(baseURL, listenKey, callback, response_converter, keepAlive_function) {
        super(baseURL, listenKey, callback, response_converter, keepAlive_function);
    }

    /**
     * @returns { Promise <  
    *  {
    *      req:"<listenKey>@account",
    *      res: {
    *           accountAlias:string,
    *           feeTier:number,
    *           canTrade:boolean,
    *           canDeposit:boolean,
    *           canWithdraw:boolean,
    *      } 
    *  }  
    * > }
    */
    async get_accountDetail() {
        const response = await this.WS_handler.sendPrivateMessage(
            {
                "method": "REQUEST",
                "params":
                    [
                        `${this.listenKey}@account`
                    ]
            }
        );
        if (response.error) return response;
        return response.result[0];
    }

    /**
     * @returns { Promise <  
     *  {
     *      req:"<listenKey>@balance",
     *      res: {
     *          accountAlias:string,
     *          balances: { 
     *              asset:string,
     *              balance:stringNumber,
     *              crossWalletBalance:stringNumber,
     *              crossUnPnL:stringNumber,
     *              availableBalance:stringNumber,
     *              maxWithdrawAmount:stringNumber,
     *              updateTime:number
     *          }[]
     *      } 
     *  }  
     * > }
     */
    async get_accountBalance() {
        const response = await this.WS_handler.sendPrivateMessage(
            {
                "method": "REQUEST",
                "params":
                    [
                        `${this.listenKey}@balance`
                    ]
            }
        );
        if (response.error) return response;
        return response.result[0];
    }

}



// RESPONSES BELOW \\\\

const USERDATA_RESPONSES = {

    MARGIN_CALL: [
        ['e', 'event'],
        ['E', 'time'],
        ['cw', 'crossWalletBalance'],
        ['p', 'positions',
            [
                ['s', 'symbol'],
                ['ps', 'positionSide'],
                ['pa', 'positionAmt'],
                ['mt', 'marginType'],
                ['iw', 'isolatedWallet'],
                ['mp', 'markPrice'],
                ['up', 'unrealizedPnL'],
                ['mm', 'maintMargin']
            ]
        ]
    ],

    ACCOUNT_UPDATE: [
        ['e', 'event'],
        ['E', 'time'],
        ['T', 'transactTime'],
        ['a', 'updateData',
            [
                ['m', 'eventReason'],
                ['B', 'balances',
                    [
                        ['a', 'asset'],
                        ['wb', 'walletBalance'],
                        ['cw', 'crossWalletBalance'],
                        ['bc', 'balanceChange']
                    ]
                ],
                ['P', 'positions',
                    [
                        ['s', 'symbol'],
                        ['ma', 'marginAsset'],
                        ['pa', 'positionAmt'],
                        ['ep', 'entryPrice'],
                        ['cr', 'accumulatedRealized'],
                        ['up', 'unrealizedPnL'],
                        ['mt', 'marginType'],
                        ['iw', 'isolatedWallet'],
                        ['ps', 'positionSide']
                    ]
                ]
            ]
        ]
    ],

    ORDER_TRADE_UPDATE: [
        ['e', 'event'],
        ['E', 'time'],
        ['T', 'transactTime'],
        ['o', 'order',
            [
                ['s', 'symbol'],
                ['c', 'clientOrderId'],
                ['S', 'side'],
                ['o', 'type'],
                ['f', 'timeInForce'],
                ['q', 'origQty'],
                ['p', 'price'],
                ['ap', 'avgPrice'],
                ['sp', 'stopPrice'],
                ['x', 'executionType'],
                ['X', 'status'],
                ['i', 'orderId'],
                ['l', 'lastFilledQty'],
                ['z', 'cumQty'],
                ['L', 'lastFilledPrice'],
                ['N', 'commissionAsset'],
                ['n', 'commission'],
                ['T', 'tradeTime'],
                ['t', 'tradeId'],
                ['b', 'bidsNotional'],
                ['a', 'askNotional'],
                ['m', 'isMaker'],
                ['R', 'isReduceOnly'],
                ['wt', 'workingType'],
                ['ot', 'origOrderType'],
                ['ps', 'positionSide'],
                ['cp', 'closePosition'],
                ['AP', 'activationPrice'],
                ['cr', 'callbackRate'],
                ['rp', 'realizedProfit'],
                ['pP', 'ignore0'],
                ['si', 'ignore1'],
                ['ss', 'ignore2']
            ]
        ]
    ],

    ACCOUNT_CONFIG_UPDATE: [
        ['e', 'event'],
        ['E', 'time'],
        ['T', 'transactTime'],
        ['ac', 'leverageChange',
            [
                ['s', 'symbol'],
                ['l', 'leverage']
            ]
        ],
        ['ai', 'multiAssetModeChange',
            [
                ['j', 'multiAssetMode']
            ]
        ]
    ],

    STRATEGY_UPDATE: [
        ['e', 'event'],
        ['E', 'time'],
        ['T', 'transactTime'],
        ['su', 'strategyUpdate',
            [
                ['si', 'strategyId'],
                ['st', 'strategyType'],
                ['ss', 'strategyStatus'],
                ['s', 'symbol'],
                ['ut', 'updateTime'],
                ['c', 'opCode']
            ]
        ]
    ],

    GRID_UPDATE: [
        ['e', 'event'],
        ['E', 'time'],
        ['T', 'transactTime'],
        ['gu', 'gridUpdate',
            [
                ['si', 'strategyId'],
                ['st', 'strategyType'],
                ['ss', 'strategyStatus'],
                ['s', 'symbol'],
                ['r', 'realizedPnL'],
                ['up', 'unmatchedAvgPrice'],
                ['uq', 'unmatchedQty'],
                ['uf', 'unmatchedFee'],
                ['mp', 'matchedPnL'],
                ['ut', 'updateTime']
            ]
        ]
    ],

    CONDITIONAL_ORDER_TRIGGER_REJECT: [
        ['e', 'event'],
        ['E', 'time'],
        ['T', 'messageSendTime'],
        ['or', 'order',
            [
                ['s', 'symbol'],
                ['i', 'orderId'],
                ['r', 'reason']
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
    ['m', 'isBuyerMaker']
];

const MARKPRICE_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['p', 'price'],
    ['i', 'indexPrice'],
    ['P', 'estimatedSettlePrice'],
    ['r', 'fundingRate'],
    ['T', 'next_fundingTime']
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
            ['i', 'interval'],
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

const CONTINUOUSCANDLESTICKS_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['ps', 'pair'],
    ['ct', 'contractType'],
    ['k', 'candle',
        [
            ['t', 'openTime'],
            ['T', 'closeTime'],
            ['s', 'symbol'],
            ['i', 'interval'],
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
            ['V', 'talerBuy_baseAsset_volume'],
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
    ['w', 'weightedAveragePrice'],
    ['c', 'close'],
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

const BOOKTICKER_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['u', 'updateId'],
    ['T', 'transactTime'],
    ['b', 'bestBidPrice'],
    ['B', 'bestBidQty'],
    ['a', 'bestAskPrice'],
    ['A', 'bestAskQty']
];

const LIQUIDATION_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['o', 'order',
        [
            ['s', 'symbol'],
            ['S', 'side'],
            ['o', 'type'],
            ['f', 'timeInForce'],
            ['q', 'origQty'],
            ['p', 'price'],
            ['ap', 'avgPrice'],
            ['X', 'status'],
            ['l', 'lastFilledQty'],
            ['z', 'cumQty'],
            ['T', 'tradeTime']
        ]
    ]
];

const PARTIAL_ORDERBOOK_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['T', 'transactTime'],
    ['s', 'symbol'],
    ['U', 'firstUpdateId'],
    ['u', 'lastUpdateId'],
    ['pu', 'previous_lastUpdateId'],
    ['b', 'bids'],
    ['a', 'asks']
];

const ORDERBOOK_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['T', 'transactTime'],
    ['s', 'symbol'],
    ['U', 'firstUpdateId'],
    ['u', 'lastUpdateId'],
    ['pu', 'previous_lastUpdateId'],
    ['b', 'bids'],
    ['a', 'asks']
];

const COMPOSITEINDEX_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['p', 'price'],
    ['C', 'component'],
    ['c', 'composition',
        [
            ['b', 'baseAsset'],
            ['q', 'quoteAsset'],
            ['w', 'weightInQty'],
            ['W', 'weightInPercent'],
            ['i', 'indexPrice']
        ]
    ]
];

const CONTRACTINFO_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['ps', 'pair'],
    ['ct', 'contractType'],
    ['dt', 'deliveryDate'],
    ['ot', 'onboardDate'],
    ['cs', 'contractStatus'],
    ['bks', 'brackets',
        [
            ['bs', 'bracket'],
            ['bnf', 'notionalFloor'],
            ['bnc', 'notionalCap'],
            ['mmr', 'maintMarginRatio'],
            ['cf', 'cum'],
            ['mi', 'minLeverage'],
            ['ma', 'maxLeverage']
        ]
    ]
];

const MULTIASSETMODE_ASSETINDEX_RESPONSE_CONVERTER = [
    ['e', 'event'],
    ['E', 'time'],
    ['s', 'symbol'],
    ['i', 'indexPrice'],
    ['b', 'bidBuffer'],
    ['a', 'askBuffer'],
    ['B', 'bidRate'],
    ['A', 'askRate'],
    ['q', 'autoExchange_bidBuffer'],
    ['g', 'autoExchange_askBuffer'],
    ['Q', 'autoExchange_bidRate'],
    ['G', 'autoExchange_askRate']
];




class stringNumber { }

/**
 * Converts the `string` and returns the `number` value
 * @returns {number}
 */
String.prototype.parseFloat = function () {
    const i = parseFloat(this);
    if (i == i) {
        try {
            return JSON_Bigint.parse(this);
        } catch (err) {
            return this;
        }
    } else return this;
};
/**
 * Converts the `string` and returns the `number` value
 * @returns {number}
 */
stringNumber.prototype.parseFloat = function () {
    const i = parseFloat(this);
    if (i == i) {
        try {
            return JSON_Bigint.parse(this);
        } catch (err) {
            return this;
        }
    } else return this;
}
/**
 * Converts the `string` and returns the `number` value
 * @returns {number}
 */
Number.prototype.parseFloat = function () { return this; };

module.exports = Futures_Websockets;