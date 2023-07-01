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

        let mult_total = 0;

        for (const fill of Order.fills) {
            mult_total += fill.price.parseFloat() * fill.qty.parseFloat();
            if (!this.commissions[fill.commissionAsset]) this.commissions[fill.commissionAsset] = 0;
            this.commissions[fill.commissionAsset] += fill.commission.parseFloat();
        }

        this.avgPrice = (mult_total / fills_count).toFixed(8);
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
}