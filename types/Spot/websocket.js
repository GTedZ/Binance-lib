const { kline_interval, orderSide, orderType, timeInForce, orderStatus, selfTradePreventionMode, contingencyType, listStatusType, listOrderStatus } = require('./types');

const JSON_Bigint = require('json-bigint')({ storeAsString: true });

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


////////////////////////

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
    WS_userData_LIST_STATUS
}