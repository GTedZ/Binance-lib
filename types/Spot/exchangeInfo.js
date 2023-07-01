const JSON_Bigint = require('json-bigint')({ storeAsString: true });

const { symbolStatus, orderType, symbolPermission, selfTradePreventionMode } = require("./types");

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
    * @param {exchangeInfo} exchangeInfo 
    */
    constructor(exchangeInfo) {

        this.timezone = exchangeInfo.timezone;

        this.serverTime = exchangeInfo.serverTime;

        this.rateLimits = exchangeInfo.rateLimits;

        this.exchangeFilters = exchangeInfo.exchangeFilters;

        this.symbols_arr = [];

        this.symbols = {};

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
                } else newSymbol[key] = value;

            }

            newSymbol.filters_arr = filters_arr;
            newSymbol.filters = filters;
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

module.exports = {
    exchangeInfo,
    exchangeInfo_mapped,

    exchangeInfo_rateLimit,
    exchangeInfo_Symbol,

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
    exchangeInfo_ExchangeFilters_EXCHANGE_MAX_NUM_ICEBERG_ORDERS
}