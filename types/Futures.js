const JSON_Bigint = require('json-bigint')({ storeAsString: true });

/**
 * - `GTC`: Good Til Cancel
 * - `IOC`: Immediate or Cancel
 * - `FOK`: Fill or Kill
 * - `GTX`: Good Til Crossing (Post Only)
 * @type {'GTC'|'IOC'|'FOK'|'GTX'}
 */
let Futures_TimeInForce;

/**
 * @type {'NEW'|'PARTIALLY_FILLED'|'FILLED'|'CANCELED'|'REJECTED'|'EXPIRED'}
 */
let Futures_OrderStatus;

/**
 * @type {'LIMIT'|'MARKET'|'STOP'|'STOP_MARKET'|'TAKE_PROFIT'|'TAKE_PROFIT_MARKET'|"TRAILING_STOP_MARKET"}
 */
let Futures_OrderType;

/**
 * @type {'BUY'|'SELL'}
 */
let Futures_OrderSide;

/**
 * @type {'BOTH'|'LONG'|'SHORT'}
 */
let Futures_PositionSide;

/**
 * @type {'MARK_PRICE'|'CONTRACT_PRICE'}
 */
let Futures_WorkingType;

/**
 * @type {'1m'|'3m'|'5m'|'15m'|'30m'|'1h'|'2h'|'4h'|'6h'|'8h'|'12h'|'1d'|'3d'|'1w'|'1M'}
 */
let Futures_interval;

/**
 * @type {"5m"|"15m"|"30m"|"1h"|"2h"|"4h"|"6h"|"12h"|"1d"}
 */
let Futures_period;

/**
 * @type {'PERPETUAL'|'CURRENT_MONTH'|'NEXT_MONTH'|'CURRENT_QUARTER'|'NEXT_QUARTER'|'PERPETUAL_DELIVERING'}
 */
let Futures_contractType;

/**
 * @type {'PENDING_TRADING'|'TRADING'|'PRE_DELIVERING'|'DELIVERING'|'DELIVERED'|'PRE_SETTLE'|'SETTLING'|'CLOSE'}
 */
let Futures_contractStatus;

/**
 * @type {'ISOLATED'|'CROSSED'}
 */
let Futures_marginType;

/**
 * - `CALCULATED`: Liquidation Execution
 * - `AMENDMENT`: Order Modified
 * @type {"NEW"|"CANCELED"|"CALCULATED"|"EXPIRED"|"TRADE"|"AMENDMENT"}
 */
let Futures_executionType;

/**
 * @type {"NEW"|"WORKING"|"CANCELLED"|"EXPIRED"}
 */
let Futures_strategyStatus;

/**
 * @type {"ACK" | "RESULT"}
 */
let Futures_newOrderRespType;

/**
 * @type {'TRANSFER' | 'WELCOME_BONUS' | 'REALIZED_PNL' | 'FUNDING_FEE' | 'COMMISSION' | 'INSURANCE_CLEAR' | 'REFERRAL_KICKBACK' | 'COMMISSION_REBATE' | 'API_REBATE' | 'CONTEST_REWARD' | 'CROSS_COLLATERAL_TRANSFER' | 'OPTIONS_PREMIUM_FEE' | 'OPTIONS_SETTLE_PROFIT' | 'INTERNAL_TRANSFER' | 'AUTO_EXCHANGE' | 'DELIVERED_SETTELMENT' | 'COIN_SWAP_DEPOSIT' | 'COIN_SWAP_WITHDRAW' | 'POSITION_LIMIT_INCREASE_FEE'}
 */
let Futures_incomeType;

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




// classes  \\\\

class Futures_orderBook {

    /**
     * @type {number}
     */
    lastUpdateId;

    /**
     * @type {number}
     * 
     * Message Output Time
     */
    time;

    /**
     * @type {number}
     * 
     * Transaction Time
     */
    transactTime;

    /**
     * @type { [price:stringNumber, quantity:stringNumber][] }
     */
    bids;

    /**
     * @type { [price:stringNumber, quantity:stringNumber][] }
     */
    asks;

    constructor(orderBook) {
        this.lastUpdateId = orderBook.lastUpdateId;
        this.time = orderBook.E;
        this.transactTime = orderBook.T;
        this.bids = orderBook.bids;
        this.asks = orderBook.asks;
    }

}

class Futures_trade {
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
    quoteQty

    /**
     * @type {number}
     */
    time;

    /**
     * @type {boolean}
     */
    isBuyerMaker;
}

class Futures_aggTrade {
    /**
     * @type {number}
     * 
     * Aggregate tradeId
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
    firstTradeId

    /**
     * @type {number}
     */
    lastTradeId;

    /**
     * @type {number}
     */
    time;

    /**
     * @type {boolean}
     */
    isBuyerMaker;

    constructor(aggTrade) {
        this.aggTradeId = aggTrade.a;
        this.price = aggTrade.p;
        this.qty = aggTrade.q;
        this.firstTradeId = aggTrade.f;
        this.lastTradeId = aggTrade.l;
        this.time = aggTrade.T;
        this.isBuyerMaker = aggTrade.m
    }
}


class Futures_candlestick {

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
     * @type {number}
     */
    closeTime;

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
    tradeCount;

    /**
     * @type {stringNumber}
     */
    takerBuy_baseAsset_volume;

    /**
     * @type {stringNumber}
     */
    takerBuy_quoteAsset_volume;


    /**
     * @param {Array} candlestick 
     */
    constructor(candlestick) {
        this.openTime = candlestick[0];
        this.open = candlestick[1];
        this.high = candlestick[2];
        this.low = candlestick[3];
        this.close = candlestick[4];
        this.volume = candlestick[5];
        this.closeTime = candlestick[6];
        this.quoteAssetVolume = candlestick[7];
        this.tradeCount = candlestick[8];
        this.takerBuy_baseAsset_volume = candlestick[9];
        this.takerBuy_quoteAsset_volume = candlestick[10];
        // this.ignored_value = candlestick[11]; // ignored value
    }

}

class Futures_indexCandlestick {

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
     * close price or latest price
     * @type {stringNumber}
     */
    close

    /**
     * @type {number}
     */
    closeTime;

    constructor(candlestick) {
        this.openTime = candlestick[0];
        this.open = candlestick[1];
        this.high = candlestick[2];
        this.low = candlestick[3];
        this.close = candlestick[4];

        this.closeTime = candlestick[6];
    }

}

class Futures_markCandlestick {

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
     * close price or latest price
     * @type {stringNumber}
     */
    close

    /**
     * @type {number}
     */
    closeTime;

    constructor(candlestick) {
        this.openTime = candlestick[0];
        this.open = candlestick[1];
        this.high = candlestick[2];
        this.low = candlestick[3];
        this.close = candlestick[4];

        this.closeTime = candlestick[6];
    }

}

class Futures_markPrice {

    /**
     * @type {string}
     */
    symbol;

    /**
     * mark price
     * @type {stringNumber}
     */
    markPrice;

    /**
     * index price
     * @type {stringNumber}
     */
    indexPrice;

    /**
     * @type {stringNumber}
     */
    estimatedSettlePrice;

    /**
     * @type {stringNumber}
     */
    lastFundingRate;

    /**
     * @type {number}
     */
    nextFundingTime;

    /**
     * @type {stringNumber}
     */
    interestRate;

    /**
     * @type {number}
     */
    time;

}

class Futures_fundingRate {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    fundingRate;

    /**
     * @type {number}
     */
    fundingTime;

}

class Futures_ticker24h {

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
    lastPrice;

    /**
     * @type {stringNumber}
     */
    lastQty;

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
     * First Trade ID
     */
    firstId;

    /**
     * @type {number}
     * Last Trade ID
     */
    lastId;

    /**
     * @type {number}
     * Total Trade Count
     */
    count;

}

class Futures_priceTicker {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    price;

    /**
     * @type {number}
     * Last Transaction Time
     */
    time;

}

class Futures_symbolOrderBookTicker {

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

    /**
     * @type {number}
     */
    time;

}

class Futures_openInterest {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    openInterest;

    /**
     * @type {number}
     * Last Transaction Time
     */
    time;

}

class Futures_openInterest_statistics {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    sumOpenInterest;

    /**
     * @type {stringNumber}
     */
    sumOpenInterestValue;

    /**
     * @type {stringNumber}
     */
    timestamp;

}

class Futures_Long_Short_Ratio {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    longShortRatio;

    /**
     * @type {stringNumber}
     */
    longAccount;

    /**
     * @type {stringNumber}
     */
    shortAccount;

    /**
     * @type {stringNumber}
     */
    timestamp;

}

class Futures_taker_buySell_ratio {

    /**
     * @type {stringNumber}
     */
    buySellRatio;

    /**
     * @type {stringNumber}
     */
    buyVol

    /**
     * @type {stringNumber}
     */
    sellVol;

    /**
     * @type {stringNumber}
     */
    timestamp;

}

class Futures_historical_BLVT_NAV_candlestick {

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
     * - Real Leverage
     */
    leverage;

    /**
     * @type {number}
     */
    closeTime;

    /**
     * @type {number}
     */
    NAV_updateCount;

    constructor(candlestick) {
        this.openTime = candlestick[0];
        this.open = candlestick[1];
        this.high = candlestick[2];
        this.low = candlestick[3];
        this.close = candlestick[4];
        this.leverage = candlestick[5];
        this.closeTime = candlestick[6];

        this.NAV_updateCount = candlestick[8];
    }

}

class Futures_compositeIndex_Symbol {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     * - Component Asset
     */
    component;

    /**
     * @type {Futures_compositeIndex_baseAsset[]}
     */
    baseAssetList;

}

class Futures_compositeIndex_baseAsset {

    /**
     * @type {string}
     */
    baseAsset;

    /**
     * @type {string}
     */
    quoteAsset;

    /**
     * @type {stringNumber}
     */
    weightInQuantity;

    /**
     * @type {stringNumber}
     */
    weightInPercentage;

}

class Futures_multiAssetMode_assetIndex {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {number}
     */
    time;

    /**
     * @type {stringNumber}
     */
    index;

    /**
     * @type {stringNumber}
     */
    bidBuffer;

    /**
     * @type {stringNumber}
     */
    askBuffer;

    /**
     * @type {stringNumber}
     */
    bidRate;

    /**
     * @type {stringNumber}
     */
    askRate;

    /**
     * @type {stringNumber}
     */
    autoExchangeBidBuffer;

    /**
     * @type {stringNumber}
     */
    autoExchangeAskBuffer;

    /**
     * @type {stringNumber}
     */
    autoExchangeBidRate;

    /**
     * @type {stringNumber}
     */
    autoExchangeAskRate;

}

class Futures_Order {

    /**
     * @type {number}
     */
    symbol;

    /**
     * @type {number}
     */
    orderId;

    /**
     * @type {string}
     */
    clientOrderId;

    /**
     * @type {number}
     */
    updateTime;

    /**
     * @type {Futures_OrderSide}
     */
    side;

    /**
     * @type {Futures_PositionSide}
     */
    positionSide;

    /**
     * @type {Futures_OrderType}
     */
    origType;

    /**
     * @type {Futures_OrderType}
     */
    type;

    /**
     * @type {stringNumber}
     */
    avgPrice;

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
    cumQty;

    /**
     * @type {stringNumber}
     */
    cumQuote;

    /**
     * @type {stringNumber}
     */
    executedQty;

    /**
     * @type {Futures_OrderStatus}
     */
    status;

    /**
     * please ignore when order type is `TRAILING_STOP_MARKET`
     * @type {stringNumber}
     */
    stopPrice;

    /**
     * @type {boolean}
     */
    closePosition;

    /**
     * @type {boolean}
     */
    reduceOnly;

    /**
     * @type {Futures_TimeInForce}
     */
    timeInForce;

    /**
     * activation price, only return with `TRAILING_STOP_MARKET` order
     * @type {stringNumber|undefined}
     */
    activatePrice;

    /**
     * callback rate, only return with `TRAILING_STOP_MARKET` order
     * @type {stringNumber|undefined}
     */
    priceRate;

    /**
     * @type {Futures_WorkingType}
     */
    workingType;

    /**
     * - returned if conditional order trigger is protected 
     * @type {boolean|undefined}
     */
    priceProtect;

}

class Futures_Balance {

    /**
     * - unique account code
     * @type {string}
     */
    accountAlias;

    /**
     * @type {string}
     */
    asset;

    /**
     * - Wallet balance
     * @type {stringNumber}
     */
    balance;

    /**
     * - Crossed wallet balance
     * @type {stringNumber}
     */
    crossWalletBalance;

    /**
     * - unrealized profit of crossed positions
     * @type {stringNumber}
     */
    crossUnPnL;

    /**
     * @type {stringNumber}
     */
    availableBalance;

    /**
     * @type {stringNumber}
     */
    maxWithdrawAmount;

    /**
     * - whether the asset can be used as margin in Multi-Assets mode
     * @type {stringNumber}
     */
    marginAvailable;

    /**
     * @type {number}
     */
    updateTime;

}

class Futures_Account {

    /**
     * - account commission tier 
     * @type {number}
     */
    feeTier;

    /**
     * @type {boolean}
     */
    canTrade;

    /**
     * - if can transfer in asset
     * @type {boolean}
     */
    canDeposit;

    /**
     * - if can transfer out asset
     * @type {boolean}
     */
    canWithdraw;

    /**
     * - reserved property, please ignore
     * @type {number}
     */
    updateTime;

    /**
     * @type {boolean}
     */
    multiAssetsMargin;

    /**
     * total initial margin required with current mark price (useless with `ISOLATED` positions), only for `USDT` asset
     * @type {stringNumber}
     */
    totalInitialMargin;

    /**
     * - total maintenance margin required, only for USDT asset
     * @type {stringNumber}
     */
    totalMaintMargin;

    /**
     * - total wallet balance, only for USDT asset
     * @type {stringNumber}
     */
    totalWalletBalance;

    /**
     * - total unrealized profit, only for USDT asset
     * @type {stringNumber}
     */
    totalUnrealizedProfit;

    /**
     * - total margin balance, only for USDT asset
     * @type {stringNumber}
     */
    totalMarginBalance;

    /**
     * - initial margin required for positions with current mark price, only for USDT asset
     * @type {stringNumber}
     */
    totalPositionInitialMargin;

    /**
     * - initial margin required for open orders with current mark price, only for USDT asset
     * @type {stringNumber}
     */
    totalOpenOrderInitialMargin;

    /**
     * - crossed wallet balance, only for USDT asset
     * @type {stringNumber}
     */
    totalCrossWalletBalance;

    /**
     * - unrealized profit of crossed positions, only for USDT asset
     * @type {stringNumber}
     */
    totalCrossUnPnl;

    /**
     * - available balance, only for USDT asset
     * @type {stringNumber}
     */
    availableBalance;

    /**
     * - maximum amount for transfer out, only for USDT asset
     * @type {stringNumber}
     */
    maxWithdrawAmount;

    /**
     * @type {Futures_Asset[]}
     */
    assets;

    /**
     * - positions of all symbols in the market are returned
     * - only `BOTH` positions will be returned with `One-way mode`
     * - only `LONG` and `SHORT` positions will be returned with `Hedge mode`
     * @type {Futures_Position[]}
     */
    positions;

}

class Futures_Asset {

    /**
     * @type {string}
     */
    asset;

    /**
     * @type {stringNumber}
     */
    walletBalance;

    /**
     * @type {stringNumber}
     */
    unrealizedProfit;

    /**
     * @type {stringNumber}
     */
    marginBalance;

    /**
     * @type {stringNumber}
     */
    maintMargin;

    /**
     * @type {stringNumber}
     */
    initialMargin;

    /**
     * - initial margin required for positions with current mark price
     * @type {stringNumber}
     */
    positionInitialMargin;

    /**
     * - initial margin required for open orders with current mark price
     * @type {stringNumber}
     */
    openOrderInitialMargin;

    /**
     * @type {stringNumber}
     */
    crossWalletBalance;

    /**
     * - unrealized profit of crossed positions
     * @type {stringNumber}
     */
    crossUnPnl;

    /**
     * @type {stringNumber}
     */
    availableBalance;

    /**
     * @type {stringNumber}
     */
    maxWithdrawAmount;

    /**
     * - whether the asset can be used as margin in Multi-Assets mode
     * @type {boolean}
     */
    marginAvailable;

    /**
     * @type {number}
     */
    updateTime;

}

class Futures_Position {

    /**
     * @type {string}
     */
    symbol;

    /**
     * - initial margin required with current mark price
     * @type {stringNumber}
     */
    initialMargin;

    /**
     * - maintenance margin required
     * @type {stringNumber}
     */
    maintMargin;

    /**
     * @type {stringNumber}
     */
    unrealizedProfit;

    /**
     * - initial margin required for positions with current mark price
     * @type {stringNumber}
     */
    positionInitialMargin;

    /**
     * - initial margin required for open orders with current mark price
     * @type {stringNumber}
     */
    openOrderInitialMargin;

    /**
     * - current initial leverage
     * @type {stringNumber}
     */
    leverage;

    /**
     * - if the position is isolated
     * @type {boolean}
     */
    isolated;

    /**
     * - average entry price
     * @type {stringNumber}
     */
    entryPrice;

    /**
     * - maximum available notional with current leverage
     * @type {stringNumber}
     */
    maxNotional;

    /**
     * IGNORE
     * @type {stringNumber}
     */
    bidNotional;

    /**
     * IGNORE
     * @type {stringNumber}
     */
    askNotional;

    /**
     * @type {Futures_PositionSide}
     */
    positionSide;

    /**
     * @type {stringNumber}
     */
    positionAmt;

    /**
     * @type {number}
     */
    updateTime;

}

class Futures_PositionInfo {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    entryPrice;

    /**
     * @type {'isolated'|'crossed'}
     */
    marginType;

    /**
     * @type {'true'|'false'}
     */
    isAutoAddMargin;

    /**
     * @type {stringNumber}
     */
    isolatedMargin;

    /**
     * @type {stringNumber}
     */
    leverage;

    /**
     * @type {stringNumber}
     */
    liquidationPrice;

    /**
     * @type {stringNumber}
     */
    markPrice;

    /**
     * @type {stringNumber}
     */
    maxNotionalValue;

    /**
     * @type {stringNumber}
     */
    positionAmt;

    /**
     * @type {stringNumber}
     */
    notional;

    /**
     * @type {stringNumber}
     */
    isolatedWallet;

    /**
     * @type {stringNumber}
     */
    unRealizedProfit;

    /**
     * @type {Futures_PositionSide}
     */
    positionSide;

    /**
     * @type {number}
     */
    updateTime;

}


class Futures_userTrade {

    /**
     * The trading symbol.
     * @type {string}
     */
    symbol;

    /**
     * The ID of the trade.
     * @type {number}
     */
    id;

    /**
     * The ID of the order associated with the trade.
     * @type {number}
     */
    orderId;

    /**
     * The side of the trade (BUY or SELL).
     * @type {Futures_OrderSide}
     */
    side;

    /**
     * The position side of the trade (LONG or SHORT).
     * @type {Futures_PositionSide}
     */
    positionSide;

    /**
     * Whether the user is the buyer in the trade.
     * @type {boolean}
     */
    buyer;

    /**
     * The commission amount for the trade.
     * @type {stringNumber}
     */
    commission;

    /**
     * The asset used for commission payment.
     * @type {string}
     */
    commissionAsset;

    /**
     * Whether the user is the maker in the trade.
     * @type {boolean}
     */
    maker;

    /**
     * The price at which the trade occurred.
     * @type {stringNumber}
     */
    price;

    /**
     * The quantity of the asset traded.
     * @type {stringNumber}
     */
    qty;

    /**
     * The quote quantity of the asset traded.
     * @type {stringNumber}
     */
    quoteQty;

    /**
     * The realized profit or loss from the trade.
     * @type {stringNumber}
     */
    realizedPnL;

    /**
     * The timestamp of the trade.
     * @type {number}
     */
    time;
}

class Futures_Leverage_Notional {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {Futures_Leverage_Notional_Bracket[]}
     */
    brackets;

}

class Futures_Leverage_Notional_Bracket {

    /**
     * Notional bracket #
     * @type {number}
     */
    bracket;

    /**
     * - Max initial leverage for this bracket
     * @type {number}
     */
    initialLeverage;

    /**
     * - Cap notional of this bracket
     * @type {number}
     */
    notionalCap;

    /**
     * - Notional threshold of this bracket
     * @type {number}
     */
    notionalFloor;

    /**
     * - Maintenance ratio for this bracket
     * @type {number}
     */
    maintMarginRatio;

    /**
     * Auxiliary number for quick calculation 
     * @type {number}
     */
    cum;

}












// userData \\\\

/**
 * - When the user's position risk ratio is too high, this stream will be pushed.
 * - This message is only used as risk guidance information and is not recommended for investment strategies.
 * - In the case of a highly volatile market, there may be the possibility that the user's position has been liquidated at the same time when this stream is pushed out.
 */
class Futures_userData_MARGIN_CALL {

    event = 'MARGIN_CALL';

    /**
     * @type {number}
     */
    time;

    /**
     * - Only pushed with `CROSSED` position margin call
     * @type {stringNumber|undefined}
     */
    crossWalletBalance;

    /**
     * - Position(s) of the Margin Call
     * @type { Futures_userData_MARGIN_CALL_Position[] }
     */
    positions;

}

class Futures_userData_MARGIN_CALL_Position {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {Futures_PositionSide}
     */
    positionSide;

    /**
     * @type {stringNumber}
     */
    positionAmt;

    /**
     * @type {Futures_marginType}
     */
    marginType;

    /**
     * - if `ISOLATED` position
     * @type {stringNumber}
     */
    isolatedWallet;

    /**
     * @type {stringNumber}
     */
    markPrice;

    /**
     * @type {stringNumber}
     */
    unrealizedPnL;

    /**
     * - Maintenance Margin Required
     * @type {stringNumber}
     */
    maintMargin;

}



/**
 * When balance or position get updated, this event will be pushed.
 * - `ACCOUNT_UPDATE` will be pushed only when update happens on user's account, including changes on balances, positions, or margin type.
 * - Unfilled orders or cancelled orders will not make the event `ACCOUNT_UPDATE` pushed, since there's no change on positions.
 * - `positions` in `ACCOUNT_UPDATE`: **ONLY** symbols of **CHANGED* positions will be pushed.
 * 
 * When `FUNDING FEE` changes to the user's balance, the event will be pushed with the brief message:
 * - When `FUNDING FEE` occurs in a `CROSSED` position, `ACCOUNT_UPDATE` will be pushed with only the `balances` (including the `FUNDING FEE` asset only), without any `positions`.
 * - When `FUNDING FEE` occurs in an `ISOLATED` position, `ACCOUNT_UPDATE` will be pushed with only the `balances` (including the `FUNDING FEE` asset only) and the relative `positions` (including the isolated position on which the `FUNDING FEE` occurs only, without any other `positions`).
 * 
 * The field `eventReason` represents the reason type (present in the intellisense documentation for the message object)
 * 
 * The field `balanceChange` represents the balance change except for PnL and commission.
 */
class userData_Futures_ACCOUNT_UPDATE {

    event = 'ACCOUNT_UPDATE';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {number}
     */
    transactTime;

    /**
     * @type {userData_Futures_ACCOUNT_UPDATE_updateData}
     */
    updateData;

}

/**
 * 
 */
class userData_Futures_ACCOUNT_UPDATE_updateData {

    /**
     * - Represents the reason type for the event and may shows the following possible types:
     * @type {"DEPOSIT"|"WITHDRAW"|"ORDER"|"FUNDING_FEE"|"WITHDRAW_REJECT"|"ADJUSTMENT"|"INSURANCE_CLEAR"|"ADMIN_DEPOSIT"|"ADMIN_WITHDRAW"|"MARGIN_TRANSFER"|"MARGIN_TYPE_CHANGE"|"ASSET_TRANSFER"|"OPTIONS_PREMIUM_FEE"|"OPTIONS_SETTLE_PROFIT"|"AUTO_EXCHANGE"|"COIN_SWAP_DEPOSIT"|"COIN_SWAP_WITHDRAW"}
     */
    eventReason;

    /**
     * @type {userData_Futures_ACCOUNT_UPDATE_updateData_Balance[]}
     */
    balances;

    /**
     * - `positions` in `ACCOUNT_UPDATE`: **ONLY** symbols of **CHANGED** positions will be pushed.
     * When `FUNDING FEE` changes to the user's balance, the event will be pushed with the brief message:
     * - When `FUNDING FEE` occurs in a `CROSSED` position, `ACCOUNT_UPDATE` will be pushed with only the `balances` (including the `FUNDING FEE` asset only), without any `positions`.
     * - When `FUNDING FEE` occurs in an `ISOLATED` position, `ACCOUNT_UPDATE` will be pushed with only the `balances` (including the `FUNDING FEE` asset only) and the relative `positions` (including the isolated position on which the `FUNDING FEE` occurs only, without any other `positions`).
     * @type {userData_Futures_ACCOUNT_UPDATE_updateData_Position[]|undefined}
     */
    positions;

}

class userData_Futures_ACCOUNT_UPDATE_updateData_Balance {

    /**
     * @type {string}
     */
    asset;

    /**
     * @type {stringNumber}
     */
    walletBalance;

    /**
     * @type {stringNumber}
     */
    crossWalletBalance;

    /**
     * - Balance Change except PnL and Commission
     * @type {stringNumber}
     */
    balanceChange;

}

class userData_Futures_ACCOUNT_UPDATE_updateData_Position {

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {string}
     */
    marginAsset;

    /**
     * @type {stringNumber}
     */
    positionAmt;

    /**
     * @type {stringNumber}
     */
    entryPrice;

    /**
     * @type {stringNumber}
     */
    accumulatedRealized;

    /**
     * @type {stringNumber}
     */
    unrealizedPnL;

    /**
     * @type {Futures_marginType}
     */
    marginType;

    /**
     * @type {stringNumber}
     */
    isolatedWallet;

    /**
     * @type {Futures_PositionSide}
     */
    positionSide;

}


/**
 * - When new order created, order status changed will push such event. event type is `ORDER_TRADE_UPDATE`.
 * 
 * - If user gets liquidated due to insufficient margin balance:
 * - - `clientOrderId` shows as `autoclose-<clientOrderId>`, `status` shows as `NEW`.
 * - If user has enough margin balance but gets ADL:
 * - - `clientOrderId` shows as `adl_autoclose`, `status` shows as `NEW`.
 * - If settlement or delisting or delivery happens:
 * - - `settlement_autoclose-<clientOrderId>`.
 */
class userData_Futures_ORDER_TRADE_UPDATE {

    event = 'ORDER_TRADE_UPDATE';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {number}
     */
    transactTime;

    /**
     * @type {userData_Futures_ACCOUNT_UPDATE_Order}
     */
    order;

}

class userData_Futures_ACCOUNT_UPDATE_Order {

    /**
     * @type {string}
     */
    symbol;

    /**
     * - special client order id:
     * - - starts with "autoclose-": liquidation order
     * - - `adl_autoclose`: ADL auto close order
     * - - starts with `settlement_autoclose-`: Settlement order for Delisting or Delivery
     * @type {string}
     */
    clientOrderId;

    /**
     * @type {Futures_OrderSide}
     */
    side;

    /**
     * @type {Futures_OrderType}
     */
    type;

    /**
     * @type {Futures_TimeInForce}
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
    avgPrice;

    /**
     * @type {stringNumber}
     */
    stopPrice;

    /**
     * @type {Futures_executionType}
     */
    executionType;

    /**
     * @type {Futures_OrderStatus}
     */
    status;

    /**
     * @type {number}
     */
    orderId;

    /**
     * @type {stringNumber}
     */
    lastFilledQty;

    /**
     * @type {stringNumber}
     */
    cumQty;

    /**
     * @type {stringNumber}
     */
    lastFilledPrice;

    /**
     * @type {string}
     */
    commissionAsset;

    /**
     * @type {stringNumber}
     */
    commission;

    /**
     * @type {number}
     */
    tradeTime;

    /**
     * @type {number}
     */
    tradeId;

    /**
     * @type {stringNumber}
     */
    bidsNotional;

    /**
     * @type {stringNumber}
     */
    askNotional;

    /**
     * @type {boolean}
     */
    isMaker;

    /**
     * @type {boolean}
     */
    isReduceOnly;

    /**
     * @type {Futures_WorkingType}
     */
    workingType;

    /**
     * @type {Futures_OrderType}
     */
    origOrderType;

    /**
     * @type {Futures_PositionSide}
     */
    positionSide;

    /**
     * @type {boolean}
     */
    closePosition;

    /**
     * @type {stringNumber}
     */
    activationPrice;

    /**
     * @type {stringNumber}
     */
    callbackRate;

    /**
     * @type {stringNumber}
     */
    realizedProfit;

}




/**
 * When the account configuration is changed, the event type will be pushed as `ACCOUNT_CONFIG_UPDATE`:
 * - When the `leverage` of a `pair` changes, the payload will contain the object `leverageChange` to represent the account configuration of the `pair`, where `symbol` represents the specific `pair` and `leverage` for its new leverage.
 * - When the user Multi-Assets margin mode changes the payload will contain the object `multiAssetModeChange` representing the user account configuration, where `multiAssetMode` represents the user Multi-Assets margin mode
 */
class Futures_userData_ACCOUNT_CONFIG_UPDATE {

    event = 'ACCOUNT_CONFIG_UPDATE';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {number}
     */
    transactTime;

    /**
     * - **ONLY** pushed if the leverage was changed for any symbol
     * @type { {symbol:string, leverage:number} | undefined }
     */
    leverageChange;

    /**
     * - **ONLY** pushed if the multiAssetMode was changed
     * @type { {multiAssetMode:boolean} | undefined }
     */
    multiAssetModeChange;

}


/**
 * `STRATEGY_UPDATE` is pushed when a strategy is created/cancelled/expired, ...etc.
 */
class Futures_userData_STRATEGY_UPDATE {

    event = 'STRATEGY_UPDATE';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {number}
     */
    transactTime;

    /**
     * @type {Futures_userData_STRATEGY_UPDATE_strategyUpdate}
     */
    strategyUpdate;

}

class Futures_userData_STRATEGY_UPDATE_strategyUpdate {

    /**
     * @type {number}
     */
    strategyId;

    /**
     * @type {string}
     */
    strategyType;

    /**
     * @type {Futures_strategyStatus}
     */
    strategyStatus

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {number}
     */
    updateTime;

    /**
     * - `8001`: The strategy params have been updated
     * - `8002`: User cancelled the strategy
     * - `8003`: User manually placed or cancelled an order
     * - `8004`: The stop limit of this order reached
     * - `8005`: User position liquidated
     * - `8006`: Max open order limit reached
     * - `8007`: New grid order
     * - `8008`: Margin not enough
     * - `8009`: Price out of bounds
     * - `8010`: Market is closed or paused
     * - `8011`: Close position failed, unable to fill
     * - `8012`: Exceeded the maximum allowable notional value at current leverage
     * - `8013`: Grid expired due to incomplete KYC verification or access from a restricted jurisdiction
     * - `8014`: Violated Futures Trading Quantitative Rules. Strategy stopped
     * - `8015`: User position empty or liquidated
     * @type {number}
     */
    opCode;

}

class Futures_userData_GRID_UPDATE {

    event = 'GRID_UPDATE';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {number}
     */
    transactTime;

    /**
     * @type {Futures_userData_GRID_UPDATE_GridUpdate}
     */
    gridUpdate;

}

class Futures_userData_GRID_UPDATE_GridUpdate {

    /**
     * @type {number}
     */
    strategyId;

    /**
     * @type {string}
     */
    strategyType;

    /**
     * @type {Futures_strategyStatus}
     */
    strategyStatus

    /**
     * @type {string}
     */
    symbol;

    /**
     * @type {stringNumber}
     */
    realizedPnL;

    /**
     * @type {stringNumber}
     */
    unmatchedAvgPrice;

    /**
     * @type {stringNumber}
     */
    unmatchedQty;

    /**
     * @type {stringNumber}
     */
    unmatchedFee;

    /**
     * @type {stringNumber}
     */
    matchedPnL;

    /**
     * @type {number}
     */
    updateTime;

}

class Futures_userData_CONDITIONAL_ORDER_TRIGGER_REJECT {

    event = 'CONDITIONAL_ORDER_TRIGGER_REJECT';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {number}
     */
    messageSendTime;

    /**
     * @type { {symbol:string, orderId:number, reason:string} }
     */
    order;

}













///////////////////////////



class Futures_WS_aggTrade {

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

}

class Futures_WS_markPrice {

    event = 'markPriceUpdate';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    symbol;

    /**
     * - Mark Price
     * @type {stringNumber}
     */
    price;

    /**
     * @type {stringNumber}
     */
    indexPrice;

    /**
     * - Estimated Settle Price, only useful in the last hour before the settlement starts
     * @type {stringNumber}
     */
    estimateSettlePrice;

    /**
     * eg: 
     * - `'0.00038167'`
     * - `'0.00030000'`
     * @type {stringNumber}
     */
    fundingRate;

    /**
     * @type {number}
     */
    next_fundingTime;

}

class Futures_WS_candlestick {

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
     * interval: Futures_interval,
     * firstTradeId:number,
     * lastTradeId:number,
     * open:stringNumber,
     * close:stringNumber,
     * high:stringNumber;
     * low:stringNumber,
     * baseAsset_volume:stringNumber,
     * tradeCount:number,
     * isCandleClosed:boolean,
     * quoteAsset_volume:stringNumber,
     * takerBuy_baseAsset_volume:stringNumber,
     * takerBuy_quoteAsset_volume:stringNumber,
     * ignore:ignore
     * } }
     */
    candle;

}

class Futures_WS_continuousCandlestick {

    event = 'continuous_kline';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {string}
     */
    pair;

    /**
     * @type {"PERPETUAL"|'CURRENT_QUARTER'|'NEXT_QUARTER'}
     */
    contractType;

    /**
     * @type { {
     * openTime:number, 
     * closeTime:number, 
     * symbol:string,
     * interval: Futures_interval,
     * firstTradeId:number,
     * lastTradeId:number,
     * open:stringNumber,
     * close:stringNumber,
     * high:stringNumber;
     * low:stringNumber,
     * baseAsset_volume:stringNumber,
     * tradeCount:number,
     * isCandleClosed:boolean,
     * quoteAsset_volume:stringNumber,
     * takerBuy_baseAsset_volume:stringNumber,
     * takerBuy_quoteAsset_volume:stringNumber,
     * ignore:ignore
     * } }
     */
    candle;

}

class Futures_WS_miniTicker {

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
    totalTraded_quoteAsset_volume

}

class Futures_WS_ticker {

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
    weightedAveragePrice;

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

class Futures_WS_bookTicker {

    event = 'bookTicker';

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
    updateId;

    /**
     * @type {number}
     */
    transactTime;

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

class Futures_WS_liquidationOrder {

    event = 'forceOrder';

    /**
     * @type {number}
     */
    time;

    /**
     * @type { {
     *      symbol:stringNumber,
     *      side:Futures_OrderSide,
     *      type:Futures_OrderType,
     *      timeInForce:Futures_TimeInForce,
     *      origQty:stringNumber,
     *      price:stringNumber,
     *      avgPrice:stringNumber,
     *      status:Futures_OrderStatus,
     *      lastFilledQty:stringNumber,
     *      cumQty:stringNumber,
     *      tradeTime:number
     *  } 
     * }
     */
    order;

}

class Futures_WS_partialOrderBook {

    event = 'depthUpdate';

    /**
     * @type {number}
     */
    time;

    /**
     * @type {number}
     */
    transactTime;

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
     * Final update Id in last stream(meaning `lastUpdateId` in last stream)
     * @type {number}
     */
    previous_lastUpdateId;

    /**
     * @type {[price:stringNumber, qty:stringNumber][]}
     */
    bids;

    /**
     * @type {[price:stringNumber, qty:stringNumber][]}
     */
    asks;

}

const Futures_WS_orderBook = Futures_WS_partialOrderBook

class Futures_WS_compositeIndex {

    event = 'compositeIndex';

    /**
     * @type {number}
     */
    time;

    symbol;

    price;

    component;

    /**
     * @type { {
     *      baseAsset:string,
     *      quoteAsset:string,
     *      weightInQty:stringNumber,
     *      weightInPercent:stringNumber,
     *      indexPrice:stringNumber
     *  } 
     * }
     */
    composition;

}

class Futures_WS_contractInfo {

    event = 'contractInfo';

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
    pair;

    /**
     * @type {Futures_contractType}
     */
    contractType;

    /**
     * @type {number}
     */
    deliveryDate;

    /**
     * @type {number}
     */
    onboardDate;

    /**
     * @type {Futures_contractStatus}
     */
    contractStatus;

    /**
     * @type { {
     *      bracket:number,
     *      notionalFloor:number,
     *      notionalCap:number,
     *      maintMarginRatio:number,
     *      cum:number,
     *      minLeverage:number,
     *      maxLeverage:number
     *  }
     * }
     */
    brackets;

}

class Futures_WS_multiAssetMode_assetIndex {

    event = 'assetIndexUpdate';

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
    indexPrice;

    /**
     * @type {stringNumber}
     */
    bidBuffer;

    /**
     * @type {stringNumber}
     */
    askBuffer;

    /**
     * @type {stringNumber}
     */
    bidRate;

    /**
     * @type {stringNumber}
     */
    askRate;

    /**
     * @type {stringNumber}
     */
    autoExchange_bidBuffer;

    /**
     * @type {stringNumber}
     */
    autoExchange_askBuffer;

    /**
     * @type {stringNumber}
     */
    autoExchange_bidRate;

    /**
     * @type {stringNumber}
     */
    autoExchange_askRate;

}


//////////////////

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
    Futures_exchangeInfo_Filters_PERCENT_PRICE,

    Futures_orderBook,
    Futures_trade,
    Futures_aggTrade,
    Futures_candlestick,
    Futures_indexCandlestick,
    Futures_markCandlestick,
    Futures_markPrice,
    Futures_fundingRate,
    Futures_ticker24h,
    Futures_priceTicker,
    Futures_symbolOrderBookTicker,
    Futures_openInterest,
    Futures_openInterest_statistics,
    Futures_Long_Short_Ratio,
    Futures_taker_buySell_ratio,
    Futures_historical_BLVT_NAV_candlestick,
    Futures_compositeIndex_Symbol,
    Futures_compositeIndex_baseAsset,
    Futures_multiAssetMode_assetIndex,
    Futures_Order,
    Futures_Balance,
    Futures_Account,
    Futures_PositionInfo,
    Futures_userTrade,
    Futures_Leverage_Notional,
    Futures_Leverage_Notional_Bracket,

    Futures_interval,
    Futures_period,
    Futures_TimeInForce,
    Futures_OrderStatus,
    Futures_OrderType,
    Futures_OrderSide,
    Futures_PositionSide,
    Futures_WorkingType,
    Futures_contractType,
    Futures_contractStatus,
    Futures_marginType,
    Futures_executionType,
    Futures_strategyStatus,
    Futures_newOrderRespType,
    Futures_incomeType,

    Futures_userData_MARGIN_CALL,
    userData_Futures_ACCOUNT_UPDATE,
    userData_Futures_ORDER_TRADE_UPDATE,
    Futures_userData_ACCOUNT_CONFIG_UPDATE,
    Futures_userData_STRATEGY_UPDATE,
    Futures_userData_GRID_UPDATE,
    Futures_userData_CONDITIONAL_ORDER_TRIGGER_REJECT,


    Futures_WS_aggTrade,
    Futures_WS_markPrice,
    Futures_WS_candlestick,
    Futures_WS_continuousCandlestick,
    Futures_WS_miniTicker,
    Futures_WS_ticker,
    Futures_WS_bookTicker,
    Futures_WS_liquidationOrder,
    Futures_WS_partialOrderBook,
    Futures_WS_orderBook,
    Futures_WS_compositeIndex,
    Futures_WS_contractInfo,
    Futures_WS_multiAssetMode_assetIndex
}