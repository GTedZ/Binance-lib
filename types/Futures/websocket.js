const {
    Futures_interval,
    Futures_OrderSide,
    Futures_OrderType,
    Futures_TimeInForce,
    Futures_OrderStatus,
    Futures_contractType,
    Futures_contractStatus
} = require('./types')

const JSON_Bigint = require('json-bigint')

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




class stringNumber { }

/**
 * Converts the `string` and returns the `number` value
 * @returns {number}
 */
String.prototype.parseFloat = function () {
    let i = parseFloat(this);
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
    console.log('hello!')
    let i = parseFloat(this);
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