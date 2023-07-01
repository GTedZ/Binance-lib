const { Futures_contractType, Futures_contractStatus } = require("./types");


class Futures_exchangeInfo {

    /**
     * @type {"UTC"}
     */
    timezone;

    /**
     * @type {number}
     */
    serverTime;

    /**
     * @type {"U_MARGINED"}
     */
    futuresType;

    /**
     * @type { Futures_exchangeInfo_RateLimit[] }
     */
    rateLimits;

    /**
     * @type {any[]}
     */
    exchangeFilters;

    /**
     * @type { Futures_exchangeInfo_Asset[] }
     */
    assets;

    /**
     * @type { Futures_exchangeInfo_Symbol[] }
     */
    symbols;
}

class Futures_exchangeInfo_mapped {

    /**
     * @type {"UTC"}
     */
    timezone;

    /**
     * @type {number}
     */
    serverTime;

    /**
     * @type {"U_MARGINED"}
     */
    futuresType;

    /**
     * @type { Futures_exchangeInfo_RateLimit[] }
     */
    rateLimits;

    /**
     * @type {any[]}
     */
    exchangeFilters;

    /**
     * @type { string[] }
     * 
     * - An array of all the assets available
     * - `['BTC', 'ETH', 'XRP', ...]`
     */
    assets_arr;

    /**
     * @type { Object.<string, Futures_exchangeInfo_Asset> }
     * 
     * Use `assets_arr` to access the keys (the name of the `asset`) of `assets`
     */
    assets;

    /**
     * @type { string[] }
     * 
     * - An array of all the symbols available
     * - `['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'BTCUSDT_230630', ...]`
     */
    symbols_arr;

    /**
     * @type { Object.<string, Futures_exchangeInfo_Symbol_mapped }
     * 
     * Use `symbols_arr` to access the keys (the name of the `symbol`) of `symbols`
     */
    symbols;

    /**
     * @type { Futures_contractType[] }
     * 
     * - An array of all the symbols' `contractType`s
     */
    contractTypes_arr;

    /**
     * @type { Object.<string, Futures_exchangeInfo_Symbol_mapped[]> }
     * 
     * Use `contractTypes_arr` to access the keys (the name of the `contractType`) of `contractTypes`
     */
    contractTypes;

    /**
     * @type { Futures_exchangeInfo_Symbol_underlyingType[] }
     * 
     * - An array of all the symbols' `underlyingType`s
     */
    underlyingTypes_arr;

    /**
     * @type { Object.<string, Futures_exchangeInfo_Symbol_mapped[]> }
     * 
     * Use `underlyingTypes_arr` to access the keys (the name of the `underlyingType`) of `underlyingTypes`
     */
    underlyingTypes;

    /**
     * @type { Futures_exchangeInfo_Symbol_underlyingSubType[] }
     * 
     * - An array of all the symbols' `underlyingSubType`s
     */
    underlyingSubTypes_arr;

    /**
     * @type { Object.<string, Futures_exchangeInfo_Symbol_mapped[]> }
     * 
     * Use `underlyingSubTypes_arr` to access the keys (the name of the `underlyingSubType`) of `underlyingSubTypes`
     */
    underlyingSubTypes;

    constructor(response) {
        // this is coded for readability, not optimization (still not readable much)
        const contractTypes_set = new Set();
        const contractTypes = {};

        const underlyingTypes_set = new Set();
        const underlyingTypes = {};

        const underlyingSubTypes_set = new Set();
        const underlyingSubTypes = {};

        const symbols_arr = [];
        const symbols = {};
        for (const symbol of response.symbols) {
            symbols_arr.push(symbol.symbol);
            symbols[symbol.symbol] = {};
            const currentSymbol = symbols[symbol.symbol];
            const filters_arr = [];
            const filters = {};

            for (const [key, value] of Object.entries(symbol)) {
                if (key === 'filters') {

                    for (const filter of symbol.filters) {
                        filters_arr.push(filter.filterType);
                        filters[filter.filterType] = filter;
                    }

                    currentSymbol.filters_arr = filters_arr;
                    currentSymbol.filters = filters;

                } else if (key === 'contractType') {
                    currentSymbol[key] = value;

                    if (!contractTypes[value]) contractTypes[value] = [];
                    contractTypes[value].push(currentSymbol);
                    contractTypes_set.add(value);
                } else if (key === 'underlyingType') {
                    currentSymbol[key] = value;

                    if (!underlyingTypes[value]) underlyingTypes[value] = [];
                    underlyingTypes[value].push(currentSymbol);
                    underlyingTypes_set.add(value);
                } else if (key === 'underlyingSubType') {
                    currentSymbol[key] = value;

                    for (const subType of value) {
                        if (!underlyingSubTypes[subType]) underlyingSubTypes[subType] = [];
                        underlyingSubTypes[subType].push(currentSymbol);
                        underlyingSubTypes_set.add(subType);
                    }
                } else currentSymbol[key] = value;
            }
        }



        for (const [key, value] of Object.entries(response)) {
            if (key === 'assets') {
                const assets_arr = [];
                const assets = {}

                for (const asset of value) {
                    assets_arr.push(asset.asset);
                    assets[asset.asset] = asset;
                }

                this.assets_arr = assets_arr;
                this.assets = assets;
            } else if (key === 'symbols') {
                this.symbols_arr = symbols_arr;
                this.symbols = symbols;
            } else this[key] = value;
        }

        this.contractTypes_arr = Array.from(contractTypes_set);
        this.contractTypes = contractTypes

        this.underlyingTypes_arr = Array.from(underlyingTypes_set);
        this.underlyingTypes = underlyingTypes;

        this.underlyingSubTypes_arr = Array.from(underlyingSubTypes_set);
        this.underlyingSubTypes = underlyingSubTypes;
    }

}


//// subTypes

class Futures_exchangeInfo_RateLimit {
    /**
     * @type {'REQUEST_WEIGHT' | 'ORDERS'}
     */
    rateLimitType;

    /**
     * @type {"MINUTE"|"SECOND"}
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


class Futures_exchangeInfo_Asset {

    /**
     * @type {string} 
     * 
     * - name of the coin - `BTC`, `ETH`, `XRP`...
     * - These assets are notable coins (around 12 specific coins) popular enough to be used as assets.
     */
    asset;

    /**
     * @type {boolean}
     * 
     * whether the asset can be used as margin in Multi-Assets mode.
     */
    marginAvailable;

    /**
     * @type {stringNumber|string|null}
     * 
     * auto-exchange threshold in Multi-Assets margin mode.
     */
    autoAssetExchange;

}

class Futures_exchangeInfo_Symbol {

    /**
     * @type {string}
     * 
     * - Name of the pair
     * - Mostly `<baseAsset><quoteAsset>`, like `BTCUSDT`, where `BTC` is the `baseAsset` and `USDT` is the `quoteAsset`
     * - But for non-`PERPETUAL` symbols, symbols may be followed by an underscore `_` and digits, like `BTCUSDT_230630`
     */
    symbol;

    /**
     * @type {string}
     * 
     * - Simply the name of the two pairs: `<baseAsset><quoteAsset>`, meaning even non-`PERPETUAL` symbols will not have any digits following the names.
     */
    pair;

    /**
     * @type { Futures_contractType }
     */
    contractType;

    /**
     * @type {number}
     */
    deliveryDate;

    /**
     * @type {number}
     * 
     * - Should be the date when the symbol was listed on the `Futures` exchange
     * - Not completely sure as the data shows that `BTCUSDT` was listed on `8/9/2019`, while its `onBoardDate` says that it was listed on `25/9/2019`.
     */
    onboardDate;

    /**
     * @type { Futures_contractStatus }
     */
    status;

    /**
     * @type {stringNumber|string}
     * 
     * - ignore as Binance says so.
     */
    maintMarginPercent;

    /**
     * @type {stringNumber|string}
     * 
     * - ignore as Binance says so.
     */
    requiredMarginPercent;

    /**
     * @type {string}
     * 
     * - Refers to the asset that is the quantity of a symbol.
     */
    baseAsset;

    /**
     * @type {string}
     * 
     * - Refers to the asset that is the price of a symbol.
     */
    quoteAsset;

    /**
     * @type {string}
     * 
     * - Usually is the `quoteAsset` of the symbol.
     */
    marginAsset;

    /**
     * @type {number}
     * 
     * - The precision for the prices shown in the symbol's prices, and subsequently its candles.
     * - Do not use as tickSize, as the tickSize can be different.
     */
    pricePrecision;

    /**
     * @type {number}
     * 
     * - The precision for the quantities for the volumes/transactions on the symbol.
     * - Do not use as stepSize, as the stepSize can be different.
     */
    quantityPrecision;

    /**
     * @type {number}
     * 
     * - The precision for the account balances.
     * - Currently always `8`.
     */
    baseAssetPrecision = 8;

    /**
     * @type {number}
     * 
     * - Currently always `8`
     */
    quoteAssetPrecision = 8;

    /**
     * @type { Futures_exchangeInfo_Symbol_underlyingType }
     */
    underlyingType;

    /**
     * @type { Futures_exchangeInfo_Symbol_underlyingSubType[] }
     */
    underlyingSubType;

    /**
     * @type {number}
     */
    settlePlan;

    /**
     * @type {stringNumber}
     * - Threshold for algo order with "priceProtect".
     */
    triggerProtect;

    /**
     * @type {stringNumber}
     * - Liquidation fee rate.
     */
    liquidationFee;

    /**
     * @type {stringNumber}
     * - The maximum price difference rate (from `markprice`) a market order can make.
     */
    marketTakeBound;

    /**
     * @type {number}
     */
    maxMoveOrderLimit;

    /**
     * @type { [ 
     * Futures_exchangeInfo_Filters_PRICE_FILTER | undefined, 
     * Futures_exchangeInfo_Filters_LOT_SIZE | undefined, 
     * Futures_exchangeInfo_Filters_MARKET_LOT_SIZE | undefined, 
     * Futures_exchangeInfo_Filters_MAX_NUM_ORDERS | undefined, 
     * Futures_exchangeInfo_Filters_MAX_NUM_ALGO_ORDERS | undefined, 
     * Futures_exchangeInfo_Filters_MIN_NOTIONAL | undefined, 
     * Futures_exchangeInfo_Filters_PERCENT_PRICE | undefined
     * ] }
     */
    filters;

}

class Futures_exchangeInfo_Symbol_mapped {

    /**
     * @type {string}
     * 
     * - Name of the pair
     * - Mostly `<baseAsset><quoteAsset>`, like `BTCUSDT`, where `BTC` is the `baseAsset` and `USDT` is the `quoteAsset`
     * - But for non-`PERPETUAL` symbols, symbols may be followed by an underscore `_` and digits, like `BTCUSDT_230630`
     */
    symbol;

    /**
     * @type {string}
     * 
     * - Simply the name of the two pairs: `<baseAsset><quoteAsset>`, meaning even non-`PERPETUAL` symbols will not have any digits following the names.
     */
    pair;

    /**
     * @type { Futures_contractType }
     */
    contractType;

    /**
     * @type {number}
     */
    deliveryDate;

    /**
     * @type {number}
     * 
     * - Should be the date when the symbol was listed on the `Futures` exchange
     * - Not completely sure as the data shows that `BTCUSDT` was listed on `8/9/2019`, while its `onBoardDate` says that it was listed on `25/9/2019`.
     */
    onboardDate;

    /**
     * @type { Futures_contractStatus }
     */
    status;

    /**
     * @type {stringNumber|string}
     * 
     * - ignore as Binance says so.
     */
    maintMarginPercent;

    /**
     * @type {stringNumber|string}
     * 
     * - ignore as Binance says so.
     */
    requiredMarginPercent;

    /**
     * @type {string}
     * 
     * - Refers to the asset that is the quantity of a symbol.
     */
    baseAsset;

    /**
     * @type {string}
     * 
     * - Refers to the asset that is the price of a symbol.
     */
    quoteAsset;

    /**
     * @type {string}
     * 
     * - Usually is the `quoteAsset` of the symbol.
     */
    marginAsset;

    /**
     * @type {number}
     * 
     * - The precision for the prices shown in the symbol's prices, and subsequently its candles.
     * - Do not use as tickSize, as the tickSize can be different.
     */
    pricePrecision;

    /**
     * @type {number}
     * 
     * - The precision for the quantities for the volumes/transactions on the symbol.
     * - Do not use as stepSize, as the stepSize can be different.
     */
    quantityPrecision;

    /**
     * @type {number}
     * 
     * - The precision for the account balances.
     * - Currently always `8`.
     */
    baseAssetPrecision = 8;

    /**
     * @type {number}
     * 
     * - Currently always `8`
     */
    quoteAssetPrecision = 8;

    /**
     * @type { Futures_exchangeInfo_Symbol_underlyingType }
     */
    underlyingType;

    /**
     * @type { Futures_exchangeInfo_Symbol_underlyingSubType[] }
     */
    underlyingSubType;

    /**
     * @type {number}
     */
    settlePlan;

    /**
     * @type {stringNumber}
     * - Threshold for algo order with "priceProtect".
     */
    triggerProtect;

    /**
     * @type {stringNumber}
     * - Liquidation fee rate.
     */
    liquidationFee;

    /**
     * @type {stringNumber}
     * - The maximum price difference rate (from `markprice`) a market order can make.
     */
    marketTakeBound;

    /**
     * @type {number}
     */
    maxMoveOrderLimit;

    /**
     * @type { Futures_exchangeInfo_Symbol_filter[] }
     */
    filters_arr;

    /**
     * @type { { 
     * "PRICE_FILTER": Futures_exchangeInfo_Filters_PRICE_FILTER, 
     * "LOT_SIZE": Futures_exchangeInfo_Filters_LOT_SIZE, 
     * "MARKET_LOT_SIZE": Futures_exchangeInfo_Filters_MARKET_LOT_SIZE, 
     * "MAX_NUM_ORDERS": Futures_exchangeInfo_Filters_MAX_NUM_ORDERS, 
     * "MAX_NUM_ALGO_ORDERS": Futures_exchangeInfo_Filters_MAX_NUM_ALGO_ORDERS, 
     * "MIN_NOTIONAL": Futures_exchangeInfo_Filters_MIN_NOTIONAL, 
     * "PERCENT_PRICE": Futures_exchangeInfo_Filters_PERCENT_PRICE 
     * } }
     */
    filters;

}



/**
 * The `PRICE_FILTER` defines the `price` rules for a symbol.
 * 
 * - Any of the properties can be set to 0, which disables that rule in the price filter. In order to pass the price filter, the following must be true for `price`/`stopPrice` of the enabled rules:
 * - - `price` >= `minPrice`
 * - - `price` <= `maxPrice`
 * - - (`price`-`minPrice`) % `tickSize` == `0`
 * @property {"PRICE_FILTER"} filterType
 * @property {stringNumber} minPrice
 * @property {stringNumber} maxPrice
 * @property {stringNumber} tickSize
 */
class Futures_exchangeInfo_Filters_PRICE_FILTER {

    /**
     * @type {"PRICE_FILTER"}
     * 
     * - Defines the filterType
     */
    filterType = 'PRICE_FILTER';

    /**
     * @type {stringNumber}
     * 
     * - Defines the minimum price/stopPrice allowed; disabled on minPrice == 0.
     */
    minPrice;

    /**
     * @type {stringNumber}
     * 
     * - Defines the maximum price/stopPrice allowed; disabled on maxPrice == 0.
     */
    maxPrice;

    /**
     * @type {stringNumber}
     * 
     * - Defines the intervals that a price/stopPrice can be increased/decreased by; disabled on tickSize == 0.
     */
    tickSize;

}

/**
 * The `LOT_SIZE` filter defines the `quantity` (aka `lots` in auction terms) rules for a symbol.
 * 
 * - In order to pass the `lot size`, the following must be true for `quantity`:
 * 
 * - - `quantity` >= `minQty`.
 * - - `quantity` <= `maxQty`.
 * - - (`quantity`-`minQty`) % `stepSize` == `0`
 * @property {"LOT_SIZE"} filterType
 * @property {stringNumber} minQty
 * @property {stringNumber} maxQty
 * @property {stringNumber} stepSize
 */
class Futures_exchangeInfo_Filters_LOT_SIZE {

    /**
     * @type {"LOT_SIZE"}
     * 
     * - Defines the filterType
     */
    filterType = 'LOT_SIZE';

    /**
     * @type {stringNumber}
     * 
     * - `minQty` defines the minimum `quantity` allowed.
     */
    minQty;

    /**
     * @type {stringNumber}
     * 
     * - `maxQty` defines the maximum `quantity` allowed.
     */
    maxQty;

    /**
     * @type {stringNumber}
     * 
     * - `stepSize` defines the intervals that a `quantity` can be increased/decreased by.
     */
    stepSize;
}

/**
 * The MARKET_LOT_SIZE filter defines the quantity (aka "lots" in auction terms) rules for MARKET orders on a symbol.
 * 
 * - In order to pass the `market lot size`, the following must be true for `quantity`:
 * 
 * - - `quantity` >= `minQty`.
 * - - `quantity` <= `maxQty`.
 * - - (`quantity`-`minQty`) % `stepSize` == `0`
 * @property {"MARKET_LOT_SIZE"} filterType
 * @property {stringNumber} minQty
 * @property {stringNumber} maxQty
 * @property {stringNumber} stepSize 
 * 
 */
class Futures_exchangeInfo_Filters_MARKET_LOT_SIZE {

    /**
     * @type {"MARKET_LOT_SIZE"}
     * 
     * - Defines the filterType
     */
    filterType = 'MARKET_LOT_SIZE';

    /**
     * @type {stringNumber}
     * 
     * - `minQty` defines the minimum `quantity` allowed.
     */
    minQty;

    /**
     * @type {stringNumber}
     * 
     * - `maxQty` defines the maximum `quantity` allowed.
     */
    maxQty;

    /**
     * @type {stringNumber}
     * 
     * - `stepSize` defines the intervals that a `quantity` can be increased/decreased by.
     */
    stepSize;
}

/**
 * The `MAX_NUM_ORDERS` filter defines the maximum number of orders an account is allowed to have open on the symbol.
 * - Note that both `algo` orders and normal orders are counted for this filter.
 * 
 * @property {"MAX_NUM_ORDERS"} filterType
 * @property {number} limit
 */
class Futures_exchangeInfo_Filters_MAX_NUM_ORDERS {

    /**
     * @type {"MAX_NUM_ORDERS"}
     * 
     * - Defines the filterType
     */
    filterType = "MAX_NUM_ORDERS";

    /**
     * @type {number}
     * 
     * - Defines the maximum number of orders an account is allowed to have open on the symbol.
     */
    limit;

}

/**
 * The `MAX_NUM_ALGO_ORDERS` filter defines the maximum number of all kinds of algo orders an account is allowed to have open on the symbol.
 * - Note that the algo orders include `STOP`, `STOP_MARKET`, `TAKE_PROFIT`, `TAKE_PROFIT_MARKET`, and `TRAILING_STOP_MARKET` orders.
 * 
 * @property {"MAX_NUM_ALGO_ORDERS"} filterType
 * @property {number} limit
 */
class Futures_exchangeInfo_Filters_MAX_NUM_ALGO_ORDERS {

    /**
     * @type {"MAX_NUM_ALGO_ORDERS"}
     * 
     * - Defines the filterType
     */
    filterType = "MAX_NUM_ALGO_ORDERS";

    /**
     * @type {number}
     * 
     * - Defines the maximum number of all kinds of algo orders an account is allowed to have open on the symbol.
     */
    limit;

}

/**
 * The `MIN_NOTIONAL` filter defines the minimum notional value allowed for an order on a symbol. 
 * - An order's `notional` value is the `price` * `quantity`.
 * 
 * - In order to pass the `min notional`, the following must be true for `price` and `quantity`:
 * - - `price` * `quantity` >= `notional`
 * - - - Since `MARKET` orders have no price, the `mark price` is used.
 * 
 * @property {"MIN_NOTIONAL"} filterType
 * @property {stringNumber} notional
 */
class Futures_exchangeInfo_Filters_MIN_NOTIONAL {

    /**
     * @type {"MIN_NOTIONAL"}
     * 
     * - Defined the filterType
     */
    filterType;

    /**
     * @type {stringNumber}
     * 
     * - The following has to be true to be valid: `price` * `quantity` >= `notional`.
     * - - If the order is any `MARKET` order, then the `mark price` is used, since it is a `MARKET` order
     */
    notional;

}

/**
 * The `PERCENT_PRICE` filter defines valid range for a price based on the mark price.
 * 
 * - In order to pass the `percent price`, the following must be true for `price`:
 * - - BUY: `price` <= `markPrice` * `multiplierUp`
 * - - `price` >= `markPrice` * `multiplierDown`
 * 
 * @property {"PERCENT_PRICE"} filterType
 * @property {stringNumber} multiplierUp
 * @property {stringNumber} multiplierDown
 * @property {number} multiplierDecimal
 */
class Futures_exchangeInfo_Filters_PERCENT_PRICE {

    /**
     * @type {"PERCENT_PRICE"}
     * 
     * - Defines the filterType
     */
    filterType = 'PERCENT_PRICE'

    /**
     * @type {stringNumber}
     * 
     * - Has to be true for `BUY`: `price` <= `markPrice` * `multiplierUp`
     */
    multiplierUp;

    /**
     * @type {stringNumber}
     * 
     * - Has to be true for `SELL`: `price` >= `markPrice` * `multiplierDown`
     */
    multiplierDown;

    /**
     * @type {number}
     */
    multiplierDecimal;

}


/**
 * @type {"PRICE_FILTER"|"LOT_SIZE"|"MARKET_LOT_SIZE"|"MAX_NUM_ORDERS"|"MAX_NUM_ALGO_ORDERS"|"MIN_NOTIONAL"|"PERCENT_PRICE"}
 */
let Futures_exchangeInfo_Symbol_filter;

/**
 * @type { 'COIN'|'INDEX' }
 */
let Futures_exchangeInfo_Symbol_underlyingType;

/**
 * @type { 'PoW'|'Layer-1'|'Payment'|'Oracle'|'Layer-2'|'Privacy'|'Infrastructure'|'NFT'|'DeFi'|'DEX'|'Meme'|'Index'|'Storage'|'AI'|'Metaverse'|'BUSD'|'DEFI'|'DAO'|'CEX'|'Cross Pair' }
 */
let Futures_exchangeInfo_Symbol_underlyingSubType;



module.exports = {
    Futures_exchangeInfo,
    Futures_exchangeInfo_mapped,

    Futures_exchangeInfo_RateLimit,
    Futures_exchangeInfo_Asset,
    Futures_exchangeInfo_Symbol,
    Futures_exchangeInfo_Symbol_mapped,

    Futures_exchangeInfo_Symbol_filter,
    Futures_exchangeInfo_Symbol_underlyingType,
    Futures_exchangeInfo_Symbol_underlyingSubType,

    Futures_exchangeInfo_Filters_PRICE_FILTER,
    Futures_exchangeInfo_Filters_LOT_SIZE,
    Futures_exchangeInfo_Filters_MARKET_LOT_SIZE,
    Futures_exchangeInfo_Filters_MAX_NUM_ORDERS,
    Futures_exchangeInfo_Filters_MAX_NUM_ALGO_ORDERS,
    Futures_exchangeInfo_Filters_MIN_NOTIONAL,
    Futures_exchangeInfo_Filters_PERCENT_PRICE
}
