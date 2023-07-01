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
    Futures_userData_CONDITIONAL_ORDER_TRIGGER_REJECT
}