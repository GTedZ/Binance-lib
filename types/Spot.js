const { Binance_userData_WS_Connection } = require('../WebsocketConnection');

const JSON_Bigint = require('json-bigint')({ storeAsString: true });

/**
 * @type {"PRE_TRADING" | "TRADING" | "POST_TRADING" | "END_OF_DAY" | "HALT" | "AUCTION_MATCH" | "BREAK"}
 */
let symbolStatus;

/**
 * @typedef permissions
 */

/**
 * @type {"SPOT" | "MARGIN" | "LEVERAGED" | "TRD_GRP_002" | "TRD_GRP_003" | "TRD_GRP_004" | "TRD_GRP_005" | "TRD_GRP_006" | "TRD_GRP_007" | "TRD_GRP_008" | "TRD_GRP_009" | "TRD_GRP_010" | "TRD_GRP_011" | "TRD_GRP_012" | "TRD_GRP_013"}
 */
let symbolPermission;

let accountPermission = symbolPermission;

/**
 * - `NEW`: The order has been accepted by the engine.
 * - `PARTIALLY_FILLED`: A part of the order has been filled.
 * - `FILLED`: The order has been completed.
 * - `CANCELED`: The order has been canceled by the user
 * - `PENDING_CANCEL`: Currently unused
 * - `REJECTED`: The order was not accepted by the engine and not processed.
 * - `EXPIRED`: The order was canceled according to the order type's rules (e.g. `LIMIT FOK` orders with no fill, `LIMIT IOC` or `MARKET` orders that partially fill) or by the exchange, (e.g. orders canceled during liquidation, orders canceled during maintenance)The order was not accepted by the engine and not processed.
 * - `EXPIRED_IN_MATCH`: The order was canceled by the exchange due to STP trigger. (e.g. an order with `EXPIRE_TAKER` will match with existing orders on the book with the same account or same `tradeGroupId`) 
 * @type {"NEW" | "PARTIALLY_FILLED" | "FILLED" | "CANCELED" | "PENDING_CANCEL" | "REJECTED" | "EXPIRED" | "EXPIRED_IN_MATCH"}
 */
let orderStatus;

/**
 * - `RESPONSE`: This is used when the ListStatus is responding to a failed action. (E.g. Orderlist placement or cancellation)
 * - `EXEC_STARTED`: The order list has been placed or there is an update to the order list status.
 * - `ALL_DONE`: The order list has finished executing and thus no longer active.
 * @type {"RESPONSE" | "EXEC_STARTED" | "ALL_DONE"}
 */
let OCOStatus;

/**
 * - `RESPONSE`: used when ListStatus is responding to a failed action. (either order list placement or cancellation)
 * - `EXEC_STARTED`: used when an order list has been placed or there is an update to a list's status.
 * - `ALL_DONE`: used when an order list has finished executing and is no longer active.
 * @type {"RESPONSE" | "EXEC_STARTED" | "ALL_DONE"}
 */
let listStatusType;

/**
 * - `EXECUTING`: Either an order list has been placed or there is an update to the status of the list.
 * - `ALL_DONE`: An order list has completed execution and thus no longer active.
 * - `REJECT`: The List Status is responding to a failed action either during order placement or order canceled.)
 * @type {"EXECUTING" | "ALL_DONE" | "REJECT"}
 */
let OCO_orderStatus;

/**
 * - `EXECUTING`:  used when an order list has been placed or there is an update to a list's status.
 * - `ALL_DONE`: used when an order list has finished executing and is no longer active.
 * - `REJECT`: used when ListStatus is responding to a failed action. (either order list placement or cancellation)
 * @type {"EXECUTING" | "ALL_DONE" | "REJECT"}
 */
let listOrderStatus;

/**
 * @type {"OCO"}
 */
let contingencyType;

/**
 * @type {"LIMIT" | "MARKET" | "STOP_LOSS" | "STOP_LOSS_LIMIT" | "TAKE_PROFIT" | "TAKE_PROFIT_LIMIT" | "LIMIT_MAKER"}
 */
let orderType;

/**
 * @type {"ACK" | "RESULT" | "FULL"}
 */
let newOrderRespType;

/**
 * @type {"BUY"|"SELL"}
 */
let orderSide;

/**
 * - This sets how long an order will be active before expiration.
 * - `GTC`: Good Til Canceled - An order will be on the book unless the order is canceled.
 * - `IOC`: Immediate Or Cancel - An order will try to fill the order as much as it can before the order expires.
 * - `FOK`: Fill or Kill - An order will expire if the full order cannot be filled upon execution.
 * @type {"GTC" | "IOC" | "FOK"}
 */
let timeInForce;

/**
 * @type {"1s" | "1m" | "3m" | "5m" | "15m" | "30m" | "1h" | "2h" | "4h" | "6h" | "8h" | "12h" | "1d" | "3d" | "1w" | "1M"}
 */
let kline_interval;

/**
 * @type {"REQUEST_WEIGHT" | "ORDERS" | "RAW_REQUESTS"}
 */
let rateLimiter;

/**
 * @type {"SECOND" | "MINUTE" | "DAY"}
 */
let rateLimitInterval;

/**
 * @type {"NONE" | "EXPIRE_TAKER" | "EXPIRE_BOTH" | "EXPIRE_MAKER"}
 */
let selfTradePreventionMode;

/**
 * - `ONLY_NEW`: Cancel will succeed if the order status is `NEW`.
 * - `ONLY_PARTIALLY_FILLED` - Cancel will succeed if order status is `PARTIALLY_FILLED`.
 * @type {"ONLY_NEW"|"ONLY_PARTIALLY_FILLED"}
 */
let cancelRestrictions;

/**
 * @type {"PRICE_FILTER" | "PERCENT_PRICE" | "PERCENT_PRICE_BY_SIDE" | "LOT_SIZE" | "MIN_NOTIONAL" | "NOTIONAL" | "ICEBERG_PARTS" | "MARKET_LOT_SIZE" | "MAX_NUM_ORDERS" | "MAX_NUM_ALGO_ORDERS" | "MAX_NUM_ICEBERG_ORDERS" | "MAX_POSITION" | "TRAILING_DELTA"}
 */
let exchangeInfo_Symbol_filter;

class exchangeInfo {

    timezone = 'UTC';

    /**
     * @type {number}
     */
    serverTime;

    /**
     * @type {exchangeInfo_rateLimit[]}
     */
    rateLimits;

    /**
     * @type {any[]}
     */
    exchangeFilters;

    /**
     * @type {exchangeInfo_Symbol[]}
     */
    symbols;

}

class exchangeInfo_mapped {

    timezone = 'UTC';

    /**
     * @type {number}
     */
    serverTime;

    /**
     * @type {exchangeInfo_rateLimit[]}
     */
    rateLimits;

    /**
     * @type {any[]}
     */
    exchangeFilters;

    /**
     * @type {string[]}
     */
    symbols_arr;

    /**
     * @type {Object <string, exchangeInfo_Symbol_mapped>}
     */
    symbols;

    /**
     * @type { Object <string, exchangeInfo_Symbol_mapped[]> }
     * 
     * Use `statuses_arr` to access the keys (the name of the `status`) of `statuses`
     */
    statuses;

    /**
     * @type {symbolStatus[]}
     * 
     * - An array of all the symbols' `status`
     */
    statuses_arr = [];


    /**
    * @param {exchangeInfo} exchangeInfo 
    */
    constructor(exchangeInfo) {

        this.timezone = exchangeInfo.timezone;

        this.serverTime = exchangeInfo.serverTime;

        this.rateLimits = exchangeInfo.rateLimits;

        this.exchangeFilters = exchangeInfo.exchangeFilters;

        this.symbols_arr = [];
        this.symbols = {};

        const statuses_set = new Set();
        const statuses = {};

        for (const symbol_obj of exchangeInfo.symbols) {
            this.symbols_arr.push(symbol_obj.symbol);

            const newSymbol = this.symbols[symbol_obj.symbol] = {};

            const filters_arr = [];
            const filters = {};

            for (const [key, value] of Object.entries(symbol_obj)) {

                if (key === 'filters') {
                    for (const filter of value) {
                        filters_arr.push(filter.filterType);
                        filters[filter.filterType] = filter;
                    }

                    newSymbol.filters_arr = filters_arr;
                    newSymbol.filters = filters;
                } else if (key === 'status') {
                    newSymbol[key] = value;

                    if (!statuses[value]) statuses[value] = [];
                    statuses[value].push(newSymbol);
                    statuses_set.add(value);
                } else newSymbol[key] = value;

            }

            this.statuses_arr = Array.from(statuses_set);
            this.statuses = statuses;
        }

    }

}

class exchangeInfo_Symbol {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {symbolStatus}
     */
    status;

    /**
     * @type {string}
     */
    baseAsset;

    /**
     * @type {string}
     */
    quoteAsset;

    baseAssetPrecision = 8;

    quotePrecision = 8;

    quoteAssetPrecision = 8;

    /**
     * @type {orderType[]}
     */
    orderTypes;

    /**
     * @type {boolean}
     */
    icebergAllowed;

    /**
     * @type {boolean}
     */
    ocoAllowed;

    /**
     * @type {boolean}
     */
    quoteOrderQtyMarketAllowed;

    /**
     * @type {boolean}
     */
    allowTrailingStop;

    /**
     * @type {boolean}
     */
    cancelReplaceAllowed;

    /**
     * @type {boolean}
     */
    isSpotTradingAllowed;

    /**
     * @type {boolean}
     */
    isMarginTradingAllowed;

    /**
     * @type {any[]}
     */
    filters;

    /**
     * @type {symbolPermission[]}
     */
    permissions;

    /**
     * @type {selfTradePreventionMode}
     */
    defaultSelfTradePreventionMode;

    /**
     * @type {selfTradePreventionMode[]}
     */
    allowedSelfTradePreventionModes;

}

class exchangeInfo_Symbol_mapped {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {symbolStatus}
     */
    status;

    /**
     * @type {string}
     */
    baseAsset;

    /**
     * @type {string}
     */
    quoteAsset;

    baseAssetPrecision = 8;

    quotePrecision = 8;

    quoteAssetPrecision = 8;

    /**
     * @type {orderType[]}
     */
    orderTypes;

    /**
     * @type {boolean}
     */
    icebergAllowed;

    /**
     * @type {boolean}
     */
    ocoAllowed;

    /**
     * @type {boolean}
     */
    quoteOrderQtyMarketAllowed;

    /**
     * @type {boolean}
     */
    allowTrailingStop;

    /**
     * @type {boolean}
     */
    cancelReplaceAllowed;

    /**
     * @type {boolean}
     */
    isSpotTradingAllowed;

    /**
     * @type {boolean}
     */
    isMarginTradingAllowed;

    /**
     * @type {exchangeInfo_Symbol_filter[]}
     */
    filters_arr;

    /**
     * @type { {
     *      PRICE_FILTER: exchangeInfo_Filters_PRICE_FILTER | undefined,
     *      PERCENT_PRICE: exchangeInfo_Filters_PERCENT_PRICE | undefined,
     *      PERCENT_PRICE_BY_SIDE: exchangeInfo_Filters_PERCENT_PRICE_BY_SIDE | undefined,
     *      LOT_SIZE: exchangeInfo_Filters_LOT_SIZE | undefined,
     *      MIN_NOTIONAL: exchangeInfo_Filters_MIN_NOTIONAL | undefined,
     *      NOTIONAL: exchangeInfo_Filters_NOTIONAL | undefined,
     *      ICEBERG_PARTS: exchangeInfo_Filters_ICEBERG_PARTS | undefined,
     *      MARKET_LOT_SIZE: exchangeInfo_Filters_MARKET_LOT_SIZE | undefined,
     *      MAX_NUM_ORDERS: exchangeInfo_Filters_MAX_NUM_ORDERS | undefined,
     *      MAX_NUM_ALGO_ORDERS: exchangeInfo_Filters_MAX_NUM_ALGO_ORDERS | undefined,
     *      MAX_NUM_ICEBERG_ORDERS: exchangeInfo_Filters_MAX_NUM_ICEBERG_ORDERS | undefined,
     *      MAX_POSITION: exchangeInfo_Filters_MAX_POSITION | undefined,
     *      TRAILING_DELTA: exchangeInfo_Filters_TRAILING_DELTA | undefined
     *  } 
     * }
     */
    filters;

    /**
     * @type {symbolPermission[]}
     */
    permissions;

    /**
     * @type {selfTradePreventionMode}
     */
    defaultSelfTradePreventionMode;

    /**
     * @type {selfTradePreventionMode[]}
     */
    allowedSelfTradePreventionModes;

}





class exchangeInfo_rateLimit {

    /**
     * @type { "REQUEST_WEIGHT" | "ORDERS" | "RAW_REQUESTS" }
     */
    rateLimitType;

    /**
     * @type { "SECOND" | "MINUTE" | "DAY" }
     */
    interval;

    /**
     * @type {number}
     */
    intervalNum;

    /**
     * @type {number}
     */
    limit;

}

/**
 * The `PRICE_FILTER` defines the price rules for a `symbol`. There are 3 parts:
 * - 
 * - Any of the above variables can be set to 0, which disables that rule in the price filter. In order to pass the price filter, the following must be true for price/stopPrice of the enabled rules:
 * - - `price` >= `minPrice`
 * - - `price` <= `maxPrice`
 * - - `price` % `tickSize` == 0
 */
class exchangeInfo_Filters_PRICE_FILTER {

    filterType = 'PRICE_FILTER';

    /**
     * - `minPrice` defines the minimum `price`/`stopPrice` allowed; `disabled on minPrice == 0`.
     * @type {stringNumber}
     */
    minPrice;

    /**
     * - `maxPrice` defines the maximum `price`/`stopPrice` allowed; `disabled on maxPrice == 0`.
     * @type {stringNumber}
     */
    maxPrice;

    /**
     * - `tickSize` defines the intervals that a `price`/`stopPrice` can be increased/decreased by; disabled on `tickSize == 0`.
     * @type {stringNumber}
     */
    tickSize;

}

/**
 * The `PERCENT_PRICE` filter defines the valid range for the price based on the average of the previous trades. `avgPriceMins` is the number of minutes the average price is calculated over. `0` means the last price is used.
 * - In order to pass the `percent price`, the following must be true for `price`:
 * - - `price` <= `weightedAveragePrice` * `multiplierUp`
 * - - `price` >= `weightedAveragePrice` * `multiplierDown`
 */
class exchangeInfo_Filters_PERCENT_PRICE {

    filterType = 'PERCENT_PRICE';

    /**
     * @type {stringNumber}
     */
    multiplierUp;

    /**
     * @type {stringNumber}
     */
    multiplierDown;

    /**
     * @type {number}
     */
    avgPriceMins;

}

/**
 * The `PERCENT_PRICE_BY_SIDE` filter defines the valid range for the price based on the average of the previous trades.
 * - `avgPriceMins` is the number of minutes the average price is calculated over. `0` means the last price is used.
 * -
 * - There is a different range depending on whether the order is placed on the `BUY` side or the `SELL` side.
 * - `BUY` orders will succeed on this filter if:
 * - - `Order price` <= `weightedAveragePrice` * `bidMultiplierUp`
 * - - `Order price` >= `weightedAveragePrice` * `bidMultiplierDown`
 * -
 * - `SELL` orders will succeed on this filter if:
 * - - `Order Price` <= `weightedAveragePrice` * `askMultiplierUp`
 * - - `Order Price` >= `weightedAveragePrice` * `askMultiplierDown`
 */
class exchangeInfo_Filters_PERCENT_PRICE_BY_SIDE {

    filterType = 'PERCENT_PRICE_BY_SIDE';

    /**
     * @type {stringNumber}
     */
    bidMultiplierUp;

    /**
     * @type {stringNumber}
     */
    bidMultiplierDown;

    /**
     * @type {stringNumber}
     */
    askMultiplierUp;

    /**
     * @type {stringNumber}
     */
    askMultiplierDown;

    /**
     * @type {number}
     */
    avgPriceMins;

}

/**
 * The `LOT_SIZE` filter defines the quantity (aka "lots" in auction terms) rules for a symbol. There are 3 parts:
 * - - `minQty` defines the minimum `quantity`/`icebergQty` allowed.
 * - - `maxQty` defines the maximum `quantity`/`icebergQty` allowed.
 * - - `stepSize` defines the intervals that a `quantity`/`icebergQty` can be increased/decreased by.
 * -
 * - In order to pass the `lot size`, the following must be true for `quantity`/`icebergQty`:
 * - - `quantity` >= `minQty`
 * - - `quantity` <= `maxQty`
 * - - `quantity` % `stepSize` == 0
 */
class exchangeInfo_Filters_LOT_SIZE {

    filterType = 'LOT_SIZE';

    /**
     * @type {stringNumber}
     */
    minQty;

    /**
     * @type {stringNumber}
     */
    maxQty;

    /**
     * @type {stringNumber}
     */
    stepSize;

}

/**
 * The `MIN_NOTIONAL` filter defines the minimum notional value allowed for an order on a symbol. An order's notional value is the `price` * `quantity`. 
 * - If the order is an Algo order (e.g. `STOP_LOSS_LIMIT`), then the notional value of the `stopPrice` * `quantity` will also be evaluated. 
 * - If the order is an Iceberg Order, then the notional value of the `price` * `icebergQty` will also be evaluated.
 * - `applyToMarket` determines whether or not the `MIN_NOTIONAL` filter will also be applied to `MARKET` orders.
 * - Since `MARKET` orders have no price, the average price is used over the last `avgPriceMins` minutes. 
 * - `avgPriceMins` is the number of minutes the average price is calculated over. `0` means the last price is used.
 */
class exchangeInfo_Filters_MIN_NOTIONAL {

    filterType = 'MIN_NOTIONAL';

    /**
     * @type {stringNumber}
     */
    minNotional;

    /**
     * @type {boolean}
     */
    applyToMarket;

    /**
     * @type {stringNumber}
     */
    avgPriceMins;

}

/**
 * The `NOTIONAL` filter defines the acceptable notional range allowed for an order on a symbol.
 * - `applyMinToMarket` determines whether the `minNotional` will be applied to `MARKET` orders.
 * - `applyMaxToMarket` determines whether the `maxNotional` will be applied to `MARKET` orders.
 * -
 * - In order to pass the `notional`, the notional (`price * quantity`) has to pass the following conditions:
 * - - `price * quantity` <= `maxNotional`
 * - - `price * quantity` >= `minNotional`
 * -
 * - For `MARKET` orders, the average price used over the last `avgPriceMins` minutes will be used for calculation.
 * - If the `avgPriceMins` is `0`, then the last price will be used.
 */
class exchangeInfo_Filters_NOTIONAL {

    filterType = 'NOTIONAL';

    /**
     * @type {stringNumber}
     */
    minNotional;

    /**
     * @type {stringNumber}
     */
    maxNotional;

    /**
     * @type {boolean}
     */
    applyMinToMarket;

    /**
     * @type {boolean}
     */
    applyMaxToMarket;

    /**
     * @type {number}
     */
    avgPriceMins;

}

/**
 * The `ICEBERG_PARTS` filter defines the maximum parts an iceberg order can have. 
 * - The number of `ICEBERG_PARTS` is defined as `CEIL(qty / icebergQty)`.
 */
class exchangeInfo_Filters_ICEBERG_PARTS {

    filterType = 'ICEBERG_PARTS';

    /**
     * @type {number}
     */
    limit;

}

/**
 * The `MARKET_LOT_SIZE` filter defines the quantity (aka "lots" in auction terms) rules for `MARKET` orders on a symbol. There are 3 parts:
 * - `minQty` defines the minimum quantity allowed.
 * - `maxQty` defines the maximum quantity allowed.
 * - `stepSize` defines the intervals that a `quantity` can be increased/decreased by.
 * -
 * - In order to pass the `market lot size`, the following must be true for `quantity`:
 * - - `quantity` >= `minQty`
 * - - `quantity` <= `maxQty`
 * - - `quantity` % `stepSize` == 0
 */
class exchangeInfo_Filters_MARKET_LOT_SIZE {

    filterType = 'MARKET_LOT_SIZE';

    /**
     * @type {stringNumber}
     */
    minQty;

    /**
     * @type {stringNumber}
     */
    maxQty;

    /**
     * @type {stringNumber}
     */
    stepSize;

}

/**
 * The `MAX_NUM_ORDERS` filter defines the maximum number of orders an account is allowed to have open on a symbol. 
 * - Note that both "algo" orders and normal orders are counted for this filter.
 */
class exchangeInfo_Filters_MAX_NUM_ORDERS {

    filterType = 'MAX_NUM_ORDERS';

    /**
     * @type {number}
     */
    maxNumOrders;

}

/**
 * The `MAX_NUM_ALGO_ORDERS` filter defines the maximum number of "algo" orders an account is allowed to have open on a symbol. 
 * - "Algo" orders are `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.
 */
class exchangeInfo_Filters_MAX_NUM_ALGO_ORDERS {

    filterType = 'MAX_NUM_ALGO_ORDERS';

    /**
     * @type {number}
     */
    maxNumAlgoOrders;

}

/**
 * The `MAX_NUM_ICEBERG_ORDERS` filter defines the maximum number of `ICEBERG` orders an account is allowed to have open on a symbol. 
 * - An `ICEBERG` order is any order where the `icebergQty` > `0`.
 */
class exchangeInfo_Filters_MAX_NUM_ICEBERG_ORDERS {

    filterType = 'MAX_NUM_ICEBERG_ORDERS';

    /**
     * @type {number}
     */
    maxNumIcebergOrders;

}

/**
 * The `MAX_POSITION` filter defines the allowed maximum position an account can have on the base asset of a symbol. 
 * - An account's position defined as the sum of the account's:
 * - - `free` balance of the base asset
 * - - `locked` balance of the base asset
 * - - sum of the `qty` of all `OPEN` `BUY` orders
 * -
 * - `BUY` orders will be rejected if the account's position is greater than the maximum position allowed.
 * - If an order's `quantity` can cause the position to overflow, this will also fail the `MAX_POSITION` filter.
 */
class exchangeInfo_Filters_MAX_POSITION {

    filterType = 'MAX_POSITION';

    /**
     * @type {stringNumber}
     */
    maxPosition;

}

/**
 * The `TRAILING_DELTA` filter defines the minimum and maximum value for the parameter `trailingDelta`.
 * - In order for a trailing stop order to pass this filter, the following must be true:
 * -
 * - - For `STOP_LOSS BUY`, `STOP_LOSS_LIMIT_BUY`,`TAKE_PROFIT SELL` and `TAKE_PROFIT_LIMIT SELL` orders:
 * - - - `trailingDelta` >= `minTrailingAboveDelta`
 * - - - `trailingDelta` <= `maxTrailingAboveDelta`
 * -
 * - - For `STOP_LOSS SELL`, `STOP_LOSS_LIMIT SELL`, `TAKE_PROFIT BUY`, and `TAKE_PROFIT_LIMIT BUY` orders:
 * - - - `trailingDelta` >= `minTrailingBelowDelta`
 * - - - `trailingDelta` <= `maxTrailingBelowDelta`
 */
class exchangeInfo_Filters_TRAILING_DELTA {

    filterType = 'TRAILING_DELTA';

    /**
     * @type {number}
     */
    minTrailingAboveDelta;

    /**
     * @type {number}
     */
    maxTrailingAboveDelta;

    /**
     * @type {number}
     */
    minTrailingBelowDelta;

    /**
     * @type {number}
     */
    maxTrailingBelowDelta;

}

// exchange Filters \\\\

/**
 * The `EXCHANGE_MAX_NUM_ORDERS` filter defines the maximum number of orders an account is allowed to have open on the exchange. 
 * - Note that both "algo" orders and normal orders are counted for this filter.
 */
class exchangeInfo_ExchangeFilters_EXCHANGE_MAX_NUM_ORDERS {

    filterType = 'EXCHANGE_MAX_NUM_ORDERS';

    /**
     * @type {number}
     */
    maxNumOrders;

}

/**
 * The `EXCHANGE_MAX_NUM_ALGO_ORDERS` filter defines the maximum number of "algo" orders an account is allowed to have open on the exchange. 
 * - "Algo" orders are `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.
 */
class exchangeInfo_ExchangeFilters_EXCHANGE_MAX_NUM_ALGO_ORDERS {

    filterType = 'EXCHANGE_MAX_NUM_ALGO_ORDERS';

    /**
     * @type {number}
     */
    maxNumAlgoOrders;

}

/**
 * The `EXCHANGE_MAX_NUM_ICEBERG_ORDERS` filter defines the maximum number of iceberg orders an account is allowed to have open on the exchange.
 */
class exchangeInfo_ExchangeFilters_EXCHANGE_MAX_NUM_ICEBERG_ORDERS {

    filterType = 'EXCHANGE_MAX_NUM_ICEBERG_ORDERS';

    /**
     * @type {number}
     */
    maxNumIcebergOrders;

}

// exchange Filters ////



// classes \\\\

class OrderBook {

    /**
     * @type {number}
     */
    lastUpdatedId;

    /**
     * @type {Array<price:stringNumber, qty:stringNumber>}
     */
    bids;

    /**
     * @type {Array<price:stringNumber, qty:stringNumber>}
     */
    asks;

}

class Trade {

    /**
     * @type {number}
     */
    id;

    /**
     * @type {stringNumber}
     */
    price;

    /**
     * @type {stringNumber}
     */
    qty;

    /**
     * @type {stringNumber}
     */
    quoteQty;

    /**
     * @type {number}
     */
    time;

    /**
     * @type {boolean}
     */
    isBuyerMaker;

    /**
     * @type {boolean}
     */
    isBestMatch;

}

class Ticker_24h {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    priceChange;

    /**
     * @type {stringNumber}
     */
    priceChangePercent;

    /**
     * @type {stringNumber}
     */
    weightedAvgPrice;

    /**
     * @type {stringNumber}
     */
    prevClosePrice;

    /**
     * @type {stringNumber}
     */
    bidPrice;

    /**
     * @type {stringNumber}
     */
    bidQty;

    /**
     * @type {stringNumber}
     */
    askPrice;

    /**
     * @type {stringNumber}
     */
    askQty;

    /**
     * @type {stringNumber}
     */
    openPrice;

    /**
     * @type {stringNumber}
     */
    highPrice;

    /**
     * @type {stringNumber}
     */
    lowPrice;

    /**
     * @type {stringNumber}
     */
    lastPrice;

    /**
     * @type {stringNumber}
     */
    volume;

    /**
     * @type {stringNumber}
     */
    quoteVolume;

    /**
     * @type {number}
     */
    openTime;

    /**
     * @type {number}
     */
    closeTime;

    /**
     * @type {number}
     */
    firstId;

    /**
     * @type {number}
     */
    lastId;

    /**
     * @type {number}
     */
    count;

}

class AggTrade {

    /**
     * @type {number}
     */
    aggTradeId;

    /**
     * @type {stringNumber}
     */
    price;

    /**
     * @type {stringNumber}
     */
    qty;

    /**
     * @type {number}
     */
    firstTradeId;

    /**
     * @type {number}
     */
    lastTradeId;

    /**
     * @type {number}
     */
    tradeTime;

    /**
     * @type {boolean}
     */
    isBuyerMaker;

    /**
     * @type {boolean}
     */
    isBestMatch;

    constructor(aggTrade) {
        this.aggTradeId = aggTrade.a;

        this.price = aggTrade.p;

        this.qty = aggTrade.q;

        this.firstTradeId = aggTrade.f;

        this.lastTradeId = aggTrade.l;

        this.tradeTime = aggTrade.T;

        this.isBuyerMaker = aggTrade.m;

        this.isBestMatch = aggTrade.M;
    }

}

class Candlestick {

    /**
     * @type {number}
     */
    openTime;

    /**
     * @type {stringNumber}
     */
    open;

    /**
     * @type {stringNumber}
     */
    high;

    /**
     * @type {stringNumber}
     */
    low;

    /**
     * @type {stringNumber}
     */
    close;

    /**
     * @type {stringNumber}
     */
    volume;

    /**
     * @type {number}
     */
    closeTime;

    /**
     * @type {stringNumber}
     */
    quoteAsset_volume;

    /**
     * @type {number}
     */
    tradeCount;

    /**
     * @type {stringNumber}
     */
    takerBuy_baseAsset_volume;

    /**
     * @type {stringNumber}
     */
    takerBuy_quoteAsset_volume;

    constructor(candlestick) {
        this.openTime = candlestick[0];
        this.open = candlestick[1];
        this.high = candlestick[2];
        this.low = candlestick[3];
        this.close = candlestick[4];
        this.volume = candlestick[5];
        this.closeTime = candlestick[6];
        this.quoteAsset_volume = candlestick[7];
        this.tradeCount = candlestick[8];
        this.takerBuy_baseAsset_volume = candlestick[9];
        this.takerBuy_quoteAsset_volume = candlestick[10];
    }

}

class MiniTicker_24h {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    openPrice;

    /**
     * @type {stringNumber}
     */
    highPrice;

    /**
     * @type {stringNumber}
     */
    lowPrice;

    /**
     * @type {stringNumber}
     */
    lastPrice;

    /**
     * @type {stringNumber}
     */
    volume;

    /**
     * @type {stringNumber}
     */
    quoteVolume;

    /**
     * @type {number}
     */
    openTime;

    /**
     * @type {number}
     */
    closeTime;

    /**
     * @type {number}
     */
    firstId;

    /**
     * @type {number}
     */
    lastId;

    /**
     * @type {number}
     */
    count;

}

class BookTicker {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    bidPrice;

    /**
     * @type {stringNumber}
     */
    bidQty;

    /**
     * @type {stringNumber}
     */
    askPrice;

    /**
     * @type {stringNumber}
     */
    askQty;

}

class RollingWindowStat {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    priceChange;

    /**
     * @type {stringNumber}
     */
    priceChangePercent;

    /**
     * @type {stringNumber}
     */
    weightedAvgPrice;

    /**
     * @type {stringNumber}
     */
    openPrice;

    /**
     * @type {stringNumber}
     */
    highPrice;

    /**
     * @type {stringNumber}
     */
    lowPrice;

    /**
     * @type {stringNumber}
     */
    lastPrice;

    /**
     * @type {stringNumber}
     */
    volume;

    /**
     * @type {stringNumber}
     */
    quoteAsset_volume;

    /**
     * @type {number}
     */
    openTime;

    /**
     * @type {number}
     */
    closeTime;

    /**
     * @type {number}
     */
    firstId;

    /**
     * @type {number}
     */
    lastId;

    /**
     * @type {number}
     */
    count;

}

class Order {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {number}
     */
    orderId;

    /**
     * unless OCO, value will be `-1`
     * @type {number}
     */
    orderListId;

    /**
     * @type {string}
     */
    clientOrderId;

    /**
     * @type {number}
     */
    transactTime;

    /**
     * @type {stringNumber}
     */
    price;

    /**
     * @type {stringNumber}
     */
    origQty;

    /**
     * @type {stringNumber}
     */
    executedQty;

    /**
     * @type {stringNumber}
     */
    cummulativeQuoteQty;

    /**
     * @type {orderStatus}
     */
    status;

    /**
     * @type {timeInForce}
     */
    timeInForce;

    /**
     * @type {orderType}
     */
    type;

    /**
     * @type {orderSide}
     */
    side;

    /**
     * @type {number}
     */
    workingTime;

    /**
     * @type {selfTradePreventionMode}
     */
    selfTradePreventionMode;

    /**
     * @type {stringNumber}
     */
    avgPrice;

    /**
     * Contains all assets used as commission for the order
     * @type {string[]}
     */
    commissionAssets = [];

    /**
     * - An object containing every commissionAsset used along with it's total commission quantity paid
     * - `BNB` is the default commission asset for everything (along with a `25%` discount)
     * -
     * - In case you don't have any `BNB`:
     * - - `quoteAsset` is deducted for if available. 
     * - - if not, `baseAsset` will be deducted from the purchased/sold amount.
     * - 
     * @type {Object< string, number>}
     */
    commissions = {};

    /**
     * @type { Array<{price:stringNumber, qty: stringNumber, commission: stringNumber, commissionAsset: stringNumber, tradeId: number}> }
     */
    fills;

    /**
     * - Appears only if the parameter `icebergQty` was sent in the request.
     * @type {stringNumber | undefined}
     */
    icebergQty;

    /**
     * - Appears only if the order expired due to `STP`.
     * @type {number | undefined}
     */
    preventedMatchId;

    /**
     * - Appears only if the order expired due to `STP`.
     * @type {stringNumber | undefined}
     */
    preventedQuantity;

    /**
     * - Appears for `STOP_LOSS`. `TAKE_PROFIT`, `STOP_LOSS_LIMIT` and `TAKE_PROFIT_LIMIT` orders.
     * @type {stringNumber | undefined}
     */
    stopPrice;

    /**
     * - Appears if the parameter was populated in the request.
     * @type {number | undefined}
     */
    strategyId;

    /**
     * - Appears if the parameter was populated in the request.
     * @type {number | undefined}
     */
    strategyType;

    /**
     * - Appears for Trailing Stop Orders.
     * @type {number | undefined}
     */
    trailingDelta;

    /**
     * - Appears only for Trailing Stop Orders.
     * @type {number | undefined}
     */
    trailingTime;



    constructor(Order) {
        Object.assign(this, Order);

        if (!Order.fills || Order.fills.length === 0) return;

        const fills_count = Order.fills.length;

        let mult_total = 0, total_qty = 0;

        for (const fill of Order.fills) {
            mult_total += fill.price.parseFloat() * fill.qty.parseFloat();
            total_qty += fill.qty.parseFloat();
            if (!this.commissions[fill.commissionAsset]) this.commissions[fill.commissionAsset] = 0;
            this.commissions[fill.commissionAsset] += fill.commission.parseFloat();
        }

        this.avgPrice = parseFloat(((mult_total / fills_count) / total_qty).toFixed(8));

        this.commissionAssets = Object.keys(this.commissions);
    }

}

class Account {

    makerCommission;

    takerCommission;

    buyerCommission;

    sellerCommission;

    /**
     * @type { {
     *      maker: stringNumber,
     *      taker: stringNumber,
     *      buyer: stringNumber,
     *      seller: stringNumber
     *  }
     * }
     */
    commissionRates;

    /**
     * @type {boolean}
     */
    canTrade;

    /**
     * @type {boolean}
     */
    canDeposit;

    /**
     * @type {boolean}
     */
    brokered;

    /**
     * @type {boolean}
     */
    requireSelfTradePrevention;

    /**
     * @type {number}
     */
    updateTime;

    /**
     * @type {string}
     */
    accountType;

    /**
     * @type { Account_Balance[] }
     */
    balances;

    /**
     * @type {accountPermission[]}
     */
    permissions;

}

class Account_mapped {

    makerCommission;

    takerCommission;

    buyerCommission;

    sellerCommission;

    /**
     * @type { {
     *      maker: stringNumber,
     *      taker: stringNumber,
     *      buyer: stringNumber,
     *      seller: stringNumber
     *  }
     * }
     */
    commissionRates;

    /**
     * @type {boolean}
     */
    canTrade;

    /**
     * @type {boolean}
     */
    canDeposit;

    /**
     * @type {boolean}
     */
    brokered;

    /**
     * @type {boolean}
     */
    requireSelfTradePrevention;

    /**
     * @type {number}
     */
    updateTime;

    /**
     * @type {string}
     */
    accountType;

    /**
     * @type {string[]}
     */
    balances_assets = [];

    /**
     * @type { Object<string, Account_Balance> > }
     */
    balances;

    /**
     * @type {accountPermission[]}
     */
    permissions;

    /**
     * @param {Account} account
     */
    constructor(account) {

        Object.assign(this, account);

        const balances = account.balances;
        this.balances = {};

        for (const balance of balances) {
            this.balances_assets.push(balance.asset);
            this.balances[balance.asset] = balance;
        }
    }

}

class Account_Balance {

    /**
     * @type {string}
     */
    asset;

    /**
     * @type {stringNumber}
     */
    free;

    /**
     * @type {stringNumber}
     */
    locked;

}






///////////////////

class WS_AggTrade {

    event = 'aggTrade';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {number}
     */
    aggTradeId;

    /**
     * @type {stringNumber}
     */
    price;

    /**
     * @type {stringNumber}
     */
    qty;

    /**
     * @type {number}
     */
    firstTradeId;

    /**
     * @type {number}
     */
    lastTradeId;

    /**
     * @type {number}
     */
    tradeTime;

    /**
     * @type {boolean}
     */
    isBuyerMaker;

    /**
     * IGNORE
     * @type {boolean}
     */
    isBestMatch;

}
class WS_Trade {

    event = 'trade';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {number}
     */
    tradeId;

    /**
     * @type {stringNumber}
     */
    price;

    /**
     * @type {stringNumber}
     */
    qty;

    /**
     * @type {number}
     */
    buyerOrderId;

    /**
     * @type {number}
     */
    sellerOrderId;

    /**
     * @type {number}
     */
    tradeTime;

    /**
     * @type {boolean}
     */
    isBuyerMaker;

    /**
     * IGNORE
     * @type {boolean}
     */
    isBestMatch;

}

class WS_Candlestick {

    event = 'kline';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type { {
     * openTime:number,
     * closeTime:number, 
     * symbol:string, 
     * interval:kline_interval, 
     * firstTradeId:number, 
     * lastTradeId:number, 
     * open:stringNumber, 
     * close:stringNumber, 
     * high:stringNumber, 
     * low:stringNumber, 
     * baseAsset_volume:stringNumber, 
     * tradeCount:number, 
     * isCandleClosed:boolean, 
     * quoteAsset_volume:stringNumber, 
     * takerBuy_baseAsset_volume:stringNumber, 
     * takerBuy_quoteAsset_volume:stringNumber, 
     * ignore:any
     * } }
     */
    candle;

}

class WS_MiniTicker {

    event = '24hrMiniTicker';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    close;

    /**
     * @type {stringNumber}
     */
    open;

    /**
     * @type {stringNumber}
     */
    high;

    /**
     * @type {stringNumber}
     */
    low;

    /**
     * @type {stringNumber}
     */
    totalTraded_baseAsset_volume;

    /**
     * @type {stringNumber}
     */
    totalTraded_quoteAsset_volume;

}

class WS_Ticker {

    event = '24hrTicker';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    priceChange;

    /**
     * @type {stringNumber}
     */
    percentChange;

    /**
     * @type {stringNumber}
     */
    weightedAvgPrice;

    /**
     * @type {stringNumber}
     */
    firstTradeBeforeWindowOpen_price;

    /**
     * @type {stringNumber}
     */
    close;

    /**
     * @type {stringNumber}
     */
    lastQty;

    /**
     * @type {stringNumber}
     */
    bestBidPrice;

    /**
     * @type {stringNumber}
     */
    bestBidQty;

    /**
     * @type {stringNumber}
     */
    bestAskPrice;

    /**
     * @type {stringNumber}
     */
    bestAskQty;

    /**
     * @type {stringNumber}
     */
    open;

    /**
     * @type {stringNumber}
     */
    high;

    /**
     * @type {stringNumber}
     */
    low;

    /**
     * @type {stringNumber}
     */
    totalTraded_baseAsset_volume;

    /**
     * @type {stringNumber}
     */
    totalTraded_quoteAsset_volume;

    /**
     * @type {number}
     */
    openTime;

    /**
     * @type {number}
     */
    closeTime;

    /**
     * @type {number}
     */
    firstTradeId;

    /**
     * @type {number}
     */
    lastTradeId;

    /**
     * @type {number}
     */
    tradeCount

}

class WS_RollingWindowStats {

    /**
     * @type {string}
     */
    event;

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    priceChange;

    /**
     * @type {stringNumber}
     */
    percentChange;

    /**
     * @type {stringNumber}
     */
    open;

    /**
     * @type {stringNumber}
     */
    high;

    /**
     * @type {stringNumber}
     */
    low;

    /**
     * @type {stringNumber}
     */
    close;

    /**
     * @type {stringNumber}
     */
    weightedAvgPrice;

    /**
     * @type {stringNumber}
     */
    totalTraded_baseAsset_volume;

    /**
     * @type {stringNumber}
     */
    totalTraded_quoteAsset_volume;

    /**
     * @type {number}
     */
    openTime;

    /**
     * @type {number}
     */
    closeTime;

    /**
     * @type {number}
     */
    firstTradeId;

    /**
     * @type {number}
     */
    lastTradeId;

    /**
     * @type {number}
     */
    tradeCount;

}

class WS_BookTicker {

    /**
     * @type {number}
     */
    updateId;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    bestBidPrice;

    /**
     * @type {stringNumber}
     */
    bestBidQty;

    /**
     * @type {stringNumber}
     */
    bestAskPrice;

    /**
     * @type {stringNumber}
     */
    bestAskQty;

}

class WS_Partial_OrderBook {

    /**
     * @type {number}
     */
    lastUpdateId;

    /**
     * @type {Array<[price:stringNumber, qty:stringNumber]>}
     */
    bids;

    /**
     * @type {Array<[price:stringNumber, qty:stringNumber]>}
     */
    asks;

}

class WS_OrderBook {

    event = 'depthUpdate';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {number}
     */
    firstUpdateId;

    /**
     * @type {number}
     */
    lastUpdateId;

    /**
     * @type {Array<[price:stringNumber, qty:stringNumber]>}
     */
    bids;

    /**
     * @type {Array<[price:stringNumber, qty:stringNumber]>}
     */
    asks;

}

class WS_userData_ACCOUNT_UPDATE {

    event = 'outboundAccountPosition';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {number}
     */
    updateTime;

    /**
     * @type {Array < { asset:string, free:stringNumber, locked:stringNumber } > }
     */
    balances;

}

class WS_userData_BALANCE_UPDATE {

    event = 'balanceUpdate';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {stringNumber}
     */
    asset;

    /**
     * @type {stringNumber}
     */
    balanceDelta;

    /**
     * @type {number}
     */
    clearTime;

}

class WS_userData_ORDER_UPDATE {

    event = 'executionReport';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {string}
     */
    clientOrderId;

    /**
     * @type {orderSide}
     */
    side;

    /**
     * @type {orderType}
     */
    type;

    /**
     * @type {timeInForce}
     */
    timeInForce;

    /**
     * @type {stringNumber}
     */
    origQty;

    /**
     * @type {stringNumber}
     */
    price;

    /**
     * @type {stringNumber}
     */
    stopPrice;

    /**
     * @type {stringNumber}
     */
    icebergQty;

    /**
     * @type {number}
     */
    orderListId;

    /**
     * @type {string}
     */
    origClientOrderId;

    /**
     * @type {string}
     */
    executionType;

    /**
     * @type {orderStatus}
     */
    status;

    /**
     * @type {string}
     */
    rejectReason;

    /**
     * @type {number}
     */
    orderId;

    /**
     * @type {stringNumber}
     */
    lastExecutedQty;

    /**
     * @type {stringNumber}
     */
    cumQty;

    /**
     * @type {stringNumber}
     */
    lastExecutedPrice;

    /**
     * @type {stringNumber}
     */
    commission;

    /**
     * @type {string}
     */
    commissionAsset;

    /**
     * @type {number}
     */
    transactTime;

    /**
     * @type {number}
     */
    tradeId;

    ignore1;

    /**
     * @type {boolean}
     */
    isOnBook;

    /**
     * @type {boolean}
     */
    isMaker;

    ignore2;

    /**
     * @type {number}
     */
    orderCreationTime;

    /**
     * @type {stringNumber}
     */
    cummulativeQuoteQty;

    /**
     * @type {stringNumber}
     */
    lastExecutedQuoteQty;

    /**
     * @type {stringNumber}
     */
    quoteSize;

    /**
     * @type {selfTradePreventionMode}
     */
    selfTradePreventionMode;



    /**
     * @type {number | undefined}
     */
    workingTime;

    /**
     * @type {number | undefined}
     */
    trailingDelta;

    /**
     * @type {number | undefined}
     */
    trailingTime;

    /**
     * @type {number | undefined}
     */
    strategyId;

    /**
     * @type {number | undefined}
     */
    strategyType;

    /**
     * @type {number | undefined}
     */
    preventedMatchId;

    /**
     * @type {stringNumber | undefined}
     */
    preventedQty;

    /**
     * @type {stringNumber | undefined}
     */
    lastPreventedQty;

    /**
     * @type {number | undefined}
     */
    tradeGroupId;

    /**
     * @type {number | undefined}
     */
    counterOrderId

}

class WS_userData_LIST_STATUS {

    event = 'listStatus';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {number}
     */
    orderListId;

    /**
     * @type {contingencyType}
     */
    contingencyType;

    /**
     * @type {listStatusType}
     */
    listStatusType;

    /**
     * @type {listOrderStatus}
     */
    listOrderStatus;

    listRejectReason;

    /**
     * @type {string}
     */
    listClientOrderId;

    /**
     * @type { Array< { symbol:string, orderId:number, clientOrderId:string } > }
     */
    orders;

}
class Spot_userData_Websocket extends Binance_userData_WS_Connection {

    events = {
        ACCOUNT_UPDATE: 'outboundAccountPosition',
        BALANCE_UPDATE: 'balanceUpdate',
        ORDER_UPDATE: 'executionReport',
        /**
         * This event is pushed when the order is an `OCO` trade alongside `ORDER_UPDATE`
         */
        listStatus: 'listStatus'
    }

    constructor(baseURL, listenKey, callback, response_converter, keepAlive_function) {
        super(baseURL, listenKey, callback, response_converter, keepAlive_function);
    }

}


////////////////////////

class stringNumber { }

/**
 * Converts the `string` and returns the `number` value
 * @returns {number}
 */
String.prototype.parseFloat = function () {
    let i = parseFloat(this);
    if (i === i) {
        try {
            return JSON_Bigint.parse(this.valueOf());
        } catch (err) {
            return this.valueOf();
        }
    } else return this.valueOf();
};

/**
 * Converts the `string` and returns the `number` value
 * @returns {number}
 */
stringNumber.prototype.parseFloat = function () { }

/**
 * Converts the `string` and returns the `number` value
 * @returns {number}
 */
Number.prototype.parseFloat = function () { return this.valueOf(); };



module.exports = {
    symbolStatus,
    symbolPermission,
    accountPermission,
    orderStatus,
    OCOStatus,
    OCO_orderStatus,
    contingencyType,
    orderType,
    newOrderRespType,
    orderSide,
    timeInForce,
    kline_interval,
    rateLimiter,
    rateLimitInterval,
    selfTradePreventionMode,
    cancelRestrictions,
    listStatusType,
    listOrderStatus,


    exchangeInfo,
    exchangeInfo_mapped,

    exchangeInfo_rateLimit,
    exchangeInfo_Symbol,
    exchangeInfo_Symbol_mapped,

    exchangeInfo_Symbol_filter,

    exchangeInfo_Filters_PRICE_FILTER,
    exchangeInfo_Filters_PERCENT_PRICE,
    exchangeInfo_Filters_PERCENT_PRICE_BY_SIDE,
    exchangeInfo_Filters_LOT_SIZE,
    exchangeInfo_Filters_MIN_NOTIONAL,
    exchangeInfo_Filters_NOTIONAL,
    exchangeInfo_Filters_ICEBERG_PARTS,
    exchangeInfo_Filters_MARKET_LOT_SIZE,
    exchangeInfo_Filters_MAX_NUM_ORDERS,
    exchangeInfo_Filters_MAX_NUM_ALGO_ORDERS,
    exchangeInfo_Filters_MAX_NUM_ICEBERG_ORDERS,
    exchangeInfo_Filters_MAX_POSITION,
    exchangeInfo_Filters_TRAILING_DELTA,

    exchangeInfo_ExchangeFilters_EXCHANGE_MAX_NUM_ORDERS,
    exchangeInfo_ExchangeFilters_EXCHANGE_MAX_NUM_ALGO_ORDERS,
    exchangeInfo_ExchangeFilters_EXCHANGE_MAX_NUM_ICEBERG_ORDERS,


    OrderBook,
    Trade,
    AggTrade,
    Candlestick,
    Ticker_24h,
    MiniTicker_24h,
    BookTicker,
    Account,
    Account_mapped,
    Order,


    WS_AggTrade,
    WS_Trade,
    WS_Candlestick,
    WS_MiniTicker,
    WS_Ticker,
    WS_RollingWindowStats,
    WS_BookTicker,
    WS_Partial_OrderBook,
    WS_OrderBook,

    WS_userData_ACCOUNT_UPDATE,
    WS_userData_BALANCE_UPDATE,
    WS_userData_ORDER_UPDATE,
    WS_userData_LIST_STATUS,
    Spot_userData_Websocket
}