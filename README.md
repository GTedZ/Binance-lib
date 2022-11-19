# Binance-lib
A FULL JS library for the binance API, currently includes the FULL Spot, Margin (including Wallet, Savings, Mining API, etc...) and Futures API support, it is much more detailed in documentation, easiest error-handling, NO try-catch blocks whatsoever.

## Currently includes:
- SPOT API (Market Data, Account/Trade)
- Margin API
- Wallet API
- Sub-Account API
- 

 ***WILL include all SPOT, MARGIN, FUTURES<a href='#futures-documentation'><sup>ref</sup></a> and EUROPEAN market/account/trade/websocket<a href='#Websockets'><sup>ref</sup></a> options***

 **Futures API FULLY IMPLEMENTED!! Full documentation below**

 #### Please use the <a href='#please-use-the-ref-symbols-to-navigate-through-the-documentation-as-it-is-huge'>'<sup>ref</sup></a>' symbols to navigate through the documentation, as it is huge.

 #### If you need help or any of my services or maybe looking for someone to implement your strategies <a href='#contact-me'>contact me via e-mail</a>
 

 *STILL UNDER FREQUENT UPDATES AND DEVELOPMENT (Working on making every aspect of the library as intuitive as it can be, meaning no try/catch blocks whatsoever, meaning I'd rather have the code do all the heavy lifting while the user just copy and pastes from this page while only doing minimal changes)*
 *This is no way shape or form a library to be used in any professional project, this is just to simplify small projects*
 *If you have any issues/requests for this project, please do create a new 'issue' on github, and I will promptly get to work on implementing it*

 How to setup:
 ```bat
  npm i binance-lib
 ```

 How to use:
```js
const Binance = require('binance-lib');
const binance = new Binance(
   '<YOUR_APIKEY>',
   '<YOUR_APISECRET>',
   {
    // these settings here are optional
    fetchFloats: true,      // <- **DOES NOT ALTER THE RESULTS** *HIGHLY RECOMMENDED AS IT FETCHES EVERYTHING AS INT (and obviously bigInts and strings to strings), always keep it on*
    hedgeMode: false,       // You can set the value or not, either way the library will handle it automatically if it receives an error about your hedgeMode setting not matching your request
    useServerTime: true,    // recommended for everyone, it syncs time to the server's time
    callback: functionName  // If you set 'useServerTime' as true, you can also use the callback function to call that function once the library is done fetching the serverTime and offsets
   }
);
```

and in your function, for example named CreateOrder()
```js
let order = await binance.futuresMarketBuy("BTCUSDT", 0.001, { positionSide: 'LONG', reduceOnly: false}); 
// if you want it to be a reduceOnly order, include in the third parameter 'reduceOnly: true' (order will be returned as an error if there was no position open on your account)
// it is also recommended to keep positionSide as 'LONG' or 'SHORT' whether you are on side Buy or Sell even if you aren't a hedgeMode user (because the program will automatically switch to hedgeMode for you if you forgot to specify it while loading the module)
if(order.error) {
  console.log(order.error); // optionally: you can have code here to handle the error
  return;
}

// continue with your code knowing that the order was executed successfully
```


### ERROR HANDLING:
All requests can be handled via checking for an error with: 'if (response.error) {...}, there are no exceptions to this, you don't need any try and catch blocks
All errors are like the following:
```js
let response = await binance.futuresMarketBuy('BTCUSDT'); // <= quantity is missing
if(response.error) {
  console.log(response);  
}

response => {
              error: {
                status: 400,
                statusText: 'Local Error',
                code: -1, // -1 is for locally rejected error (by the library)
                msg: "Parameter 'quantity' is required for this request."
              }
            }
// OR

let response = await binance.futuresMarketBuy('BTCUSDT', 100); // <= not enough funds to buy 100 Bitcoins
if(response.error) {
  console.log(response);  
}

response => {
              error: {
                status: 400,
                statusText: 'Bad Request',
                code: -2019, // any error code that is 3-digits and above are from binance
                msg: "Margin is insufficient."
              }
            }
```

### OPTIONS = {}:
In certain functions, there is a parameter called options or opts (= {} for object), the parameters that are considered as options should be wrapped inside this object parameter, they are often used for less-frequent parameters or local library parameters to tell the library what to do and what to fetch, an example for the usage:
```js
let reconnect = true, tries = 10;
let options = {symbols: true, quantityPrecision: true}
let response = await binance.futuresExchangeInfo(reconnect, tries, options); // <= 'options' here contains our parameters that are considered as options
// OR
let response = await binance.futuresExchangeInfo(true, 10, {symbols: true, quantityPrecision: true})
```

# ***SPOT DOCUMENTATION:***
### Market Data<a href='#Spot-Market-Data'><sup>ref</sup></a>
### Account/Trade<a href='#Spot-AccountTrade-Data'><sup>ref</sup></a>
### Websockets<a href='#Websocket-Spot'><sup>ref</sup></a>

## PARAMETERS EXPLANATION:
- ***reconnect***: *'true'* or *'false'* for if the library should keep sending requests until it receives a successful response
- ***tries***: Number of fails before the library should stop sending requests (Used only with reconnect as 'true'): *'0'* for unlimited tries
- ***interval***: *"1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w" or "1M"*
- ***limit***: How many samples do you want to receive from binance, ex: for binance.orderBook(), limit of '100' means you will receive 100 orders from binance
- ***permissions***: *"SPOT", "MARGIN", "LEVERAGED", "TRD_GRP_002", "TRD_GRP_003", "TRD_GRP_004", "TRD_GRP_005"*
- ***windowSize***: *'1m', '2m', '...', '59m', '1h', '2h', '...', '23h', '1d', '2d', '...' or '7d'*
- ***startTime***: A UNIX Time of when you want to start receiving samples from:
- ***endTime***: A UNIX Time of when the latest sample can be from:
  - You can get the current UNIX Time via 'Date.now()', or if you want to convert ANY time format to UNIX Time, you an use 'new Date('10/30/2022, 3:32:13 PM').getTime()'
- ***fromId***: The orderId or tradeId that you want to start receiving orders/trades from

## **SPOT MARKET DATA:**
|FUNCTIONS                                                            |REQUIRED PARAMETERS<a href='#Parameters-Explanation'><sup>ref</sup></a>|OPTIONAL PARAMETERS<a href='#Parameters-Explanation'><sup>ref</sup></a>|OPTIONS = {} <a href='#options--'><sup>ref</sup></a>|
|:--------------------------------------------------------------------|:-----------------------:|:-------------------------------:|:-----:|
|ping()                             <a href='#ping'><sup>ref</sup></a>|                         |reconnect, tries                 |       |
|serverTime()                 <a href='#serverTime'><sup>ref</sup></a>|                         |reconnect, tries                 |       |
|exchangeInfo()             <a href='#exchangeInfo'><sup>ref</sup></a>|                         |symbols, permissions             |mapped |
|orderBook()                   <a href='#orderBook'><sup>ref</sup></a>|symbol                   |limit                            |       |
|trades()                         <a href='#trades'><sup>ref</sup></a>|symbol                   |limit                            |       |
|oldTrades()                   <a href='#oldTrades'><sup>ref</sup></a>|symbol                   |limit, fromId                    |       |
|aggTrades()                   <a href='#aggTrades'><sup>ref</sup></a>|symbol                   |limit, fromId, startTime, endTime|       |
|candlesticks()             <a href='#candlesticks'><sup>ref</sup></a>|symbol, interval         |limit, startTime, endTime        |       |
|UIKlines()                     <a href='#UIKlines'><sup>ref</sup></a>|symbol, interval         |limit, startTime, endTime        |       |
|avgPrice()                     <a href='#avgPrice'><sup>ref</sup></a>|symbol                   |                                 |       |
|ticker24h()                   <a href='#ticker24h'><sup>ref</sup></a>|symbols_or_count         |                                 |       |
|price()                           <a href='#price'><sup>ref</sup></a>|                         |symbols                          |       |
|bookTicker()                 <a href='#bookTicker'><sup>ref</sup></a>|                         |symbols                          |       |
|rollingWindowStats() <a href='#rollingWindowStats'><sup>ref</sup></a>|symbols                  |windowSize, type                 |       |

### .ping():
```js
  let ping = await binance.ping();
  if(ping.error) {
    // handle error here
    console.log(ping.error);
  }
```
<details>
 <summary>View Response</summary>

 ```js
 { 
  roundtrip_time_millis: 410 // <= in millis
 }
 ```
</details>

### .serverTime():
```js
  let serverTime = await binance.serverTime(true); // function parameters: (reconnect, tries, options {})
  console.log(serverTime); // <= 1665491953938
```

### .exchangeInfo():
```js
  let exchangeInfo = await binance.exchangeInfo();
  // OR
  let exchangeInfo = await binance.exchangeInfo('BTCUSDT');
  // OR
  let exchangeInfo = await binance.exchangeInfo(['BTCUSDT', 'ETHUSDT']);
```
<details>
<summary>View Response</summary>

```js
{
  timezone: 'UTC',
  serverTime: 1667219840834,
  rateLimits: [
    {
      rateLimitType: 'REQUEST_WEIGHT',
      interval: 'MINUTE',
      intervalNum: 1,
      limit: 1200
    },
    {
      rateLimitType: 'ORDERS',
      interval: 'SECOND',
      intervalNum: 10,
      limit: 50
    },
    {
      rateLimitType: 'ORDERS',
      interval: 'DAY',
      intervalNum: 1,
      limit: 160000
    },
    {
      rateLimitType: 'RAW_REQUESTS',
      interval: 'MINUTE',
      intervalNum: 5,
      limit: 6100
    }
  ],
  exchangeFilters: [],
  symbols: [
    {
    symbol: 'BTCUSDT',
    status: 'TRADING',
    baseAsset: 'BTC',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    quoteAssetPrecision: 8,
    baseCommissionPrecision: 8,
    quoteCommissionPrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    ocoAllowed: true,
    quoteOrderQtyMarketAllowed: true,
    allowTrailingStop: true,
    cancelReplaceAllowed: true,
    isSpotTradingAllowed: true,
    isMarginTradingAllowed: true,
    filters: [
      {
      filterType: 'PRICE_FILTER',
      minPrice: 0.01,
      maxPrice: '1000000.00000000',
      tickSize: 0.01
    },
    {
      filterType: 'PERCENT_PRICE',
      multiplierUp: 5,
      multiplierDown: 0.2,
      avgPriceMins: 5
    },
    {
      filterType: 'LOT_SIZE',
      minQty: 0.00001,
      maxQty: 9000,
      stepSize: 0.00001
    },
    {
      filterType: 'MIN_NOTIONAL',
      minNotional: 10,
      applyToMarket: true,
      avgPriceMins: 5
    },
    { filterType: 'ICEBERG_PARTS', limit: 10 },
    {
      filterType: 'MARKET_LOT_SIZE',
      minQty: 0,
      maxQty: 223.31464019,
      stepSize: 0
    },
    {
      filterType: 'TRAILING_DELTA',
      minTrailingAboveDelta: 10,
      maxTrailingAboveDelta: 2000,
      minTrailingBelowDelta: 10,
      maxTrailingBelowDelta: 2000
    },
    { filterType: 'MAX_NUM_ORDERS', maxNumOrders: 200 },
    { filterType: 'MAX_NUM_ALGO_ORDERS', maxNumAlgoOrders: 5 }
    ],
    permissions: [ 'SPOT', 'MARGIN', 'TRD_GRP_004', 'TRD_GRP_005' ]
  },
    ...
  ]
}
```
</details>

**OR USING OPTIONS PARAMETERS:**
```js
  let symbols = '';
  let permissions = '';
  let exchangeInfo = await binance.exchangeInfo(symbols, permissions, {
    mapped: true
  });
```
<details>
<summary>View Response</summary>

```js
{
  symbols: [
    'ETHBTC',   'LTCBTC',   'BNBBTC',   'NEOBTC',  'QTUMETH', 'EOSETH',
    'SNTETH',   'BNTETH',   'BCCBTC',   'GASBTC',  'BNBETH',  'BTCUSDT',
    'ETHUSDT',  'HSRBTC',   'OAXETH',   'DNTETH',  'MCOETH',  'ICNETH',
    'MCOBTC',   'WTCBTC',   'WTCETH',   'LRCBTC',  'LRCETH',  'QTUMBTC',
    'YOYOBTC',  'OMGBTC',   'OMGETH',   'ZRXBTC',  'ZRXETH',  'STRATBTC',
    'STRATETH', 'SNGLSBTC', 'SNGLSETH', 'BQXBTC',  'BQXETH',  'KNCBTC',
    'KNCETH',   'FUNBTC',   'FUNETH',   'SNMBTC',  'SNMETH',  'NEOETH',
    'IOTABTC',  'IOTAETH',  'LINKBTC',  'LINKETH', 'XVGBTC',  'XVGETH',
    'SALTBTC',  'SALTETH',  'MDABTC',   'MDAETH',  'MTLBTC',  'MTLETH',
    'SUBBTC',   'SUBETH',   'EOSBTC',   'SNTBTC',  'ETCETH',  'ETCBTC',
    'MTHBTC',   'MTHETH',   'ENGBTC',   'ENGETH',  'DNTBTC',  'ZECBTC',
    'ZECETH',   'BNTBTC',   'ASTBTC',   'ASTETH',  'DASHBTC', 'DASHETH',
    'OAXBTC',   'ICNBTC',   'BTGBTC',   'BTGETH',  'EVXBTC',  'EVXETH',
    'REQBTC',   'REQETH',   'VIBBTC',   'VIBETH',  'HSRETH',  'TRXBTC',
    'TRXETH',   'POWRBTC',  'POWRETH',  'ARKBTC',  'ARKETH',  'YOYOETH',
    'XRPBTC',   'XRPETH',   'MODBTC',   'MODETH',  'ENJBTC',  'ENJETH',
    'STORJBTC', 'STORJETH', 'BNBUSDT',  'VENBNB',
    ... 2020 more items
  ],
  exchangeInfo: {
    timezone: 'UTC',
    serverTime: 1667225071843,
    rateLimits: [ [Object], [Object], [Object], [Object] ],
    exchangeFilters: []
  },
  ETHBTC: {
    symbol: 'ETHBTC',
    status: 'TRADING',
    baseAsset: 'ETH',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    quoteAssetPrecision: 8,
    baseCommissionPrecision: 8,
    quoteCommissionPrecision: 8,
    icebergAllowed: true,
    ocoAllowed: true,
    quoteOrderQtyMarketAllowed: true,
    allowTrailingStop: true,
    cancelReplaceAllowed: true,
    isSpotTradingAllowed: true,
    isMarginTradingAllowed: true,
    minNotional: 0.0001,
    icebergLimit: 10,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    trailingFilters: {
      filterType: 'TRAILING_DELTA',
      minTrailingAboveDelta: 10,
      maxTrailingAboveDelta: 2000,
      minTrailingBelowDelta: 10,
      maxTrailingBelowDelta: 2000
    },
    maxNumOrders: 200,
    maxNumAlgoOrders: 5,
    priceFilters: {
      filterType: 'PRICE_FILTER',
      minPrice: 0.000001,
      maxPrice: 922327,
      tickSize: 0.000001
    },
    percentPriceFilters: {
      filterType: 'PERCENT_PRICE',
      multiplierUp: 5,
      multiplierDown: 0.2,
      avgPriceMins: 5
    },
    lotFilters: {
      filterType: 'LOT_SIZE',
      minQty: 0.0001,
      maxQty: 100000,
      stepSize: 0.0001
    },
    notionalFilters: {
      filterType: 'MIN_NOTIONAL',
      minNotional: 0.0001,
      applyToMarket: true,
      avgPriceMins: 5
    },
    marketLotFilters: {
      filterType: 'MARKET_LOT_SIZE',
      minQty: 0,
      maxQty: 1369.19160537,
      stepSize: 0
    }
  },
  LTCUSDT: {
    ...
  },
  ...,
}
```
</details>

### .orderBook():
```js
  let BTC_orderBook = await binance.orderBook("BTCUSDT");
  // OR
  let BTC_orderBook = await binance.orderBook("BTCUSDT", 3);
  console.log(BTC_orderBook);
```
<details>
<summary>View Response</summary>

```js
{
  lastUpdateId: 26552654486,
  bids: [
    [ 20676.27, 0.23493 ], [ 20675.74, 0.73224 ], [ 20675.62, 0.00241 ],
    [ 20675.49, 0.01437 ], [ 20675.46, 0.00775 ], [ 20675.45, 0.02419 ],
    [ 20675.44, 0.003 ],   [ 20675.41, 0.02419 ], [ 20675.36, 0.02358 ],
    ...                  , ...                  , ... ,
    ...,
    ...
  ],
  asks: [
    [ 20677.54, 0.04484 ], [ 20677.76, 0.04484 ], [ 20677.89, 0.1215 ],
    [ 20678, 0.00061 ],    [ 20678.19, 0.03153 ], [ 20678.32, 0.01424 ],
    [ 20678.38, 0.00519 ], [ 20678.4, 0.02 ],     [ 20678.64, 0.01876 ],
    ...                  , ...                  , ... ,
    ...,
    ...
  ]
}
```
</details>


### .trades():
```js
  let BTC_trades = await binance.trades("BTCUSDT");
  // OR
  let BTC_trades = await binance.trades("BTCUSDT", 3);
  console.log(BTC_trades);
```
<details>
<summary>View Response</summary>

```js
[
  {
    id: 2057664850,
    price: 20652.95,
    qty: 0.93534,
    quoteQty: 19317.530253,
    time: 1667137211248,
    isBuyerMaker: true,
    isBestMatch: true
  },
  {
    id: 2057664851,
    price: 20652.95,
    qty: 0.83161,
    quoteQty: 17175.1997495,
    time: 1667137211249,
    isBuyerMaker: true,
    isBestMatch: true
  },
  {
    id: 2057664852,
    price: 20652.94,
    qty: 0.0005,
    quoteQty: 10.32647,
    time: 1667137211249,
    isBuyerMaker: true,
    isBestMatch: true
  },
  ...,
  ...
]
```
</details>

### .oldTrades():
```js
  let BTC_oldTrades = await binance.oldTrades('BTCUSDT');
  // OR
  let BTC_oldTrades = await binance.oldTrades('BTCUSDT', 5);
  // OR
  fromId = 12313912;
  let BTC_oldTrades = await binance.oldTrades('BTCUSDT', 5, fromId);
```
<details>
<summary>View Response</summary>

```js
[
  {
    id: 2057673976,
    price: 20683,
    qty: 0.00061,
    quoteQty: 12.61663,
    time: 1667137320150,
    isBuyerMaker: true,
    isBestMatch: true
  },
  {
    id: 2057673977,
    price: 20682.23,
    qty: 0.00872,
    quoteQty: 180.3490456,
    time: 1667137320171,
    isBuyerMaker: false,
    isBestMatch: true
  },
  {
    id: 2057673978,
    price: 20682.38,
    qty: 0.0073,
    quoteQty: 150.981374,
    time: 1667137320410,
    isBuyerMaker: false,
    isBestMatch: true
  },
  ...,
  ...
]
```
</details>

### .aggTrades():
- Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated.
- If startTime and endTime are sent, time between startTime and endTime must be less than 1 hour.
- If fromId, startTime, and endTime are not sent, the most recent aggregate trades will be returned.
- Note that if a trade has the following values, this was a duplicate aggregate trade and marked as invalid:
  - p = '0' // price
  - q = '0' // qty
  - f = -1 // ﬁrst_trade_id
  - l = -1 // last_trade_id
```js
  let BTC_aggTrades = await binance.aggTrades('BTCUSDT');
  // OR
  let fromId = 1293813
  let BTC_aggTrades = await binance.aggTrades('BTCUSDT', 5, fromId);
  // OR
  let startTime = new Date('10/30/2022, 3:45:13 PM').getTime()
  let endTime = new Date('10/30/2022, 2:30:00 PM').getTime()
  let BTC_aggTrades = await binance.aggTrades('BTCUSDT', 5, false, startTime, endTime);

  console.log(BTC_aggTrades);
```
<details>
<summary>View Response</summary>

```js
[
  {
    aggTradeId: 1765373713,
    price: 20658.89,
    qty: 0.04245,
    firstTradeId: 2057687959,
    lastTradeId: 2057687959,
    timestamp: 1667137561340,
    maker: false,
    isBestPriceMatch: true
  },
  {
    aggTradeId: 1765373714,
    price: 20658.89,
    qty: 0.105,
    firstTradeId: 2057687960,
    lastTradeId: 2057687960,
    timestamp: 1667137561344,
    maker: false,
    isBestPriceMatch: true
  },
  {
    aggTradeId: 1765373715,
    price: 20658.89,
    qty: 0.00096,
    firstTradeId: 2057687961,
    lastTradeId: 2057687961,
    timestamp: 1667137561345,
    maker: false,
    isBestPriceMatch: true
  },
  ...,
  ...
]
```
</details>

### .candlesticks():
```js
  let BTC_candles = await binance.candlesticks('BTCUSDT', '1m');
  console.log(BTC_candles);
```
<details>
<summary>View Response</summary>

```js
[
  {
    openTime: 1667107920000,
    open: 20768.89,
    high: 20783.94,
    low: 20767.9,
    close: 20778.5,
    volume: 157.02531,
    closeTime: 1667107979999,
    quoteAssetVolume: '3262697.34942430',
    tradesCount: 3386,
    takerBuy_baseAssetVolume: 94.70767,
    takerBuy_quoteAssetVolume: '1967798.43659910'
  },
  {
    openTime: 1667107980000,
    open: 20779.09,
    high: 20788.87,
    low: 20775.98,
    close: 20786.21,
    volume: 120.47402,
    closeTime: 1667108039999,
    quoteAssetVolume: '2503620.37108910',
    tradesCount: 3407,
    takerBuy_baseAssetVolume: 80.2267,
    takerBuy_quoteAssetVolume: '1667236.82104980'
  },
  ...,
  ...
]
```
</details>

### .UIKlines():
```js
  let BTC_UIKlines = await binance.UIKlines('BTCUSDT', '1m');
  console.log(BTC_UIKlines);
```
<details>
<summary>View Response</summary>

```js
[
  {
    openTime: 1667107980000,
    open: 20779.09,
    high: 20788.87,
    low: 20775.98,
    close: 20786.21,
    volume: 120.47402,
    closeTime: 1667108039999,
    quoteAssetVolume: '2503620.37108910',
    tradesCount: 3407,
    takerBuy_baseAssetVolume: 80.2267,
    takerBuy_quoteAssetVolume: '1667236.82104980'
  },
  {
    openTime: 1667108040000,
    open: 20786.77,
    high: 20793.84,
    low: 20783.51,
    close: 20788.87,
    volume: 181.78061,
    closeTime: 1667108099999,
    quoteAssetVolume: '3779000.16373600',
    tradesCount: 4871,
    takerBuy_baseAssetVolume: 87.91026,
    takerBuy_quoteAssetVolume: '1827607.39244490'
  },
  ...,
  ...
]
```
</details>

### .avgPrice():
```js
  let BTC_avgPrice = await binance.avgPrice("BTCUSDT");
  console.log(BTC_avgPrice);
```
<details>
<summary>View Response</summary>

```js
{ 
  mins: 5,
  price: 20682.01742593 
}
```
</details>

### .ticker24h():
```js
  let BTC_ticker = await binance.ticker24h('BTCUSDT');
  console.log(BTC_ticker);
```
<details>
<summary>View Response</summary>

```js
{
  symbol: 'BTCUSDT',
  priceChange: -90.4,
  priceChangePercent: -0.436,
  weightedAvgPrice: 20804.04211614,
  prevClosePrice: 20728.59,
  lastPrice: 20638.19,
  lastQty: 0.03213,
  bidPrice: 20636.84,
  bidQty: 0.00495,
  askPrice: 20637.97,
  askQty: 0.00062,
  openPrice: 20728.59,
  highPrice: 20982.86,
  lowPrice: 20589.18,
  volume: 221764.74157,
  quoteVolume: '4613603023.49792550',
  openTime: 1667051808417,
  closeTime: 1667138208417,
  firstId: 2052049606,
  lastId: 2057742265,
  count: 5692660
}
```
</details>

### .price():
```js
  let BTC_price = await binance.price('BTCUSDT');
  console.log(BTC_price);
```
<details>
<summary>View Response</summary>

```js
{ 
  symbol: 'BTCUSDT', 
  price: 20651.42 
}
```
</details>

### .bookTicker():
```js
  let bookTicker = await binance.bookTicker('BTCUSDT');
  // OR
  let bookTicker = await binance.bookTicker();

  console.log(BTC_bookTicker);
```
<details>
<summary>View Response</summary>

```js
{ // for single symbol
  symbol: 'BTCUSDT',
  bidPrice: 20653.65,
  bidQty: 0.0378,
  askPrice: 20653.66,
  askQty: 0.00739
}

[ // for ALL symbols
  {
    symbol: 'ETHBTC',
    bidPrice: 0.076765,
    bidQty: 33.0455,
    askPrice: 0.076766,
    askQty: 0.0453
  },
  {
    symbol: 'LTCBTC',
    bidPrice: 0.002677,
    bidQty: 64.216,
    askPrice: 0.002678,
    askQty: 6.734
  },
  {
    symbol: 'BNBBTC',
    bidPrice: 0.014934,
    bidQty: 19.961,
    askPrice: 0.014935,
    askQty: 9.705
  },
  ...,
  ...
]
```
</details>

### .rollingWindowStats():
```js
  let BTC_rollingWindowStats = await binance.rollingWindowStats('BTCUSDT', '5m');

  console.log(BTC_rollingWindowStats);
```
<details>
<summary>View Response</summary>

```js
{
  symbol: 'BTCUSDT',
  priceChange: -1.76,
  priceChangePercent: -0.009,
  weightedAvgPrice: 20639.75759793,
  openPrice: 20650.61,
  highPrice: 20661,
  lowPrice: 20589.18,
  lastPrice: 20648.85,
  volume: 1130.18702,
  quoteVolume: '23326786.13312460',
  openTime: 1667138100000,
  closeTime: 1667138413844,
  firstId: 2057730288,
  lastId: 2057756431,
  count: 26144
}
```
</details>


## **SPOT ACCOUNT/TRADE DATA**
|FUNCTIONS                                                            |REQUIRED PARAMETERS<a href='#Parameters-Explanation'><sup>ref</sup></a>|OPTIONAL PARAMETERS<a href='#Parameters-Explanation'><sup>ref</sup></a>|OPTIONS = {} <a href='#options--'><sup>ref</sup></a>|
|:--------------------------------------------------------------------|:-----------------------:|:-------------------------------:|:-----:|
// TODO



# ***FUTURES DOCUMENTATION:***
### All functions<a href='#All-Futures-Functions'><sup>ref</sup></a>
### Market Data<a href='#Futures-Market-Data'><sup>ref</sup></a>
### Account/Trade<a href='#Futures-AccountTrade-Data'><sup>ref</sup></a>
### Websockets<a href='#WebSocket-Futures'><sup>ref</sup></a>

## FUTURES PARAMETER EXPLANATION:
- ***side***: *"BUY"* OR *"SELL"*.
- ***type***: *each comes with additional Mandatory Parameters*:
- - **"LIMIT"**: *"timeInForce", "quantity", "price"*.
- - **"MARKET"**: *"quantity"*.
- - **"STOP"**/**"TAKE_PROFIT"**: *"quantity", "price", "stopPrice"*.
- - **"STOP_MARKET"/"TAKE_PROFIT_MARKET"**: *"stopPrice"*.
- - **"TRAILING_STOP_MARKET"**: *"callbackRate"*.
- ***type_2***: *'1' or 'increase'* OR *'2' or 'reduce'*.
- ***marginType***: *"ISOLATED"* or *"CROSSED"*.
- ***positionSide***: *"LONG"* OR *"SHORT"* (for hedgeMode) - but it is recommended to always include it when creating new Orders, and the library will take care of removing it automatically if your account isn't on hedgeMode.
- ***orderId***: *Created by binance, and assigned to every order, used to retrieve information about a specific order via .futuresOrder() function.*
- ***newClientOrderId***: A unique id among open orders (created automatically OR passed by the user). Can only be a string following the rule: ^[\.A-Z\:/a-z0-9_-]{1,36}$ <= meaning: maxLength is 35 - can contain all Numbers, Alphabetical Characters (upper and lowercase), '_', '-', '/', '.' and ':'.
- ***origClientOrderId***: A reference to the *'newClientOrderId'* that you created, or the one created automatically by binance.
- ***stopPrice***: Only used with orders of types *"STOP"/"STOP_MARKET" or *"TAKE_PROFIT"/"TAKE_PROFIT_MARKET"*.
- ***activationPrice***: *MUST AND ONLY* used with orders of type *"TRAILING_STOP_MARKET"*.
- ***callbackRate***: *MUST AND ONLY* used with orders of type *"TRAILING_STOP_MARKET"*, minValue is 0.1 and maxValue is 4, where 1 for 1%.
- ***workingType***: Only used when you want to specify that you want the stopPrice to be triggered by either *"MARK_PRICE"* OR *"CONTRACT_PRICE"*, default is *"CONTRACT_PRICE"*.
- ***newOrderRespType***: ***VERY IMPORTANT TO KNOW*** Defines the response type (LIBRARY DEFAULT IS **"RESULT"**):
- - **"ACK"**: new Orders will have a response with minimal information, meaning the executedPrice and other information about order fills will not be sent (orderId and other order identity information will be sent).
- - **"RESULT"**: Binance will wait until full execution of your trade before sending the response with the full information (like the average Entry Price and all other info about your order fills).
- ***interval***: *"1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"*.
- ***period***: *"5m", "15m", "30m", "1h", "2h", "4h", "6h", "12h", "1d"*
- ***contractType***: *"PERPETUAL", "CURRENT_QUARTER", "NEXT_QUARTER"*.
- ***ALL contractTypes***: *"PERPETUAL", "CURRENT_MONTH", "NEXT_MONTH", "CURRENT_QUARTER", "NEXT_QUARTER", "PERPETUAL_DELIVERING"*
- ***startTime*** & ***endTime***<a href='#Using-startTime-and-endTime'><sup>how to use</sup></a> (INTEGERS): *mostly* should be sent together, you can transform any date into UNIX time via the following: *'new Date().getTime();'* OR *'new Date('10/12/2022, 10:52:26 PM').getTime();'* (since binance uses the UNIX time system).
- ***dualSidePosition***: *"true"* or *"false"* for hedgeMode if turned on or not.
- ***multiAssetMargin***: *"true"* or *"false"* for Multi-Asset-Mode if turned on or not.
- ***incomeType***: *'TRANSFER', 'WELCOME_BONUS', 'REALIZED_PNL', 'FUNDING_FEE', 'COMMISSION', 'INSURANCE_CLEAR', 'REFERRAL_KICKBACK', 'COMMISSION_REBATE', 'MARKET_MAKER_REBATE', 'API_REBATE', 'CONTEST_REWARD', 'CROSS_COLLATERAL_TRANSFER', 'OPTIONS_PREMIUM_FEE', 'OPTIONS_SETTLE_PROFIT', 'INTERNAL_TRANSFER', 'AUTO_EXCHANGE', 'DELIVERED_SETTELMENT', 'COIN_SWAP_DEPOSIT', 'COIN_SWAP_WITHDRAW', 'POSITION_LIMIT_INCREASE_FEE'*.

## **ALL FUTURES FUNCTIONS**:
|FUNCTIONS                                                                                                    |REQUIRED PARAMETERS<a href='#futures-parameter-explanation'><sup>ref</sup></a> |OPTIONAL PARAMETERS<a href='#futures-parameter-explanation'><sup>ref</sup></a>|OPTIONS = {} <a href='#options--'><sup>ref</sup></a>|
|:------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------:|:-------------------------------------------------------:|:--------------:|
|futuresPing()                                                       <a href='#futuresPing'><sup>ref</sup></a>|                                                                         |reconnect, tries                                         |                |
|futuresServerTime()                                           <a href='#futuresServerTime'><sup>ref</sup></a>|                                                                         |reconnect, tries                                         |                |
|futuresExchangeInfo()                                       <a href='#futuresExchangeInfo'><sup>ref</sup></a>|                                                                         |reconnect, tries                                         |(BOOLS ONLY): quantityPrecision, pricePrecision, contractType, status, baseAsset, quoteAsset, marginAsset, baseAssetPrecision, quotePrecision, minNotional, timeInForce, orderTypes, priceFilters, priceFilters, lotFilters, marketLotFilters, maxNumOrders, maxNumAlgoOrders, percentPriceFilters|
|futuresOrderBook()                                             <a href='#futuresOrderBook'><sup>ref</sup></a>|symbol                                                                   |limit                                                    |                |
|futuresRecentTrades()                                       <a href='#futuresRecentTrades'><sup>ref</sup></a>|symbol                                                                   |limit                                                    |                |
|futuresHistoricalTrades()                               <a href='#futuresHistoricalTrades'><sup>ref</sup></a>|symbol                                                                   |limit, fromId                                            |                |
|futuresAggTrades()                                             <a href='#futuresAggTrades'><sup>ref</sup></a>|symbol                                                                   |limit, startTime, endTime, fromId                        |                |
|futuresCandlesticks()                                       <a href='#futuresCandlesticks'><sup>ref</sup></a>|symbol, interval                                                         |limit, startTime, endTime, fromId                        |                |
|futuresContinuousCandlesticks()                   <a href='#futuresContinuousCandlesticks'><sup>ref</sup></a>|pair, interval, contractType                                             |limit, startTime, endTime                                |                |
|futuresIndexPriceCandlesticks()                   <a href='#futuresIndexPriceCandlesticks'><sup>ref</sup></a>|pair, interval                                                           |                                                         |                |
|futuresMarkPriceCandlesticks()                     <a href='#futuresMarkPriceCandlesticks'><sup>ref</sup></a>|symbol, interval                                                         |limit, startTime, endTime                                |                |
|futuresMarkPrice()                                             <a href='#futuresMarkPrice'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresFundingRate()                                         <a href='#futuresFundingRate'><sup>ref</sup></a>|                                                                         |symbol, limit, startTime, endTime                        |                |
|futures24hrTicker()                                           <a href='#futures24hrTicker'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresPrices()                                                   <a href='#futuresPrices'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresOpenInterestStatistics()                   <a href='#futuresOpenInterestStatistics'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresOpenInterest()                                       <a href='#futuresOpenInterest'><sup>ref</sup></a>|symbol                                                                   |                                                         |                |
|futuresBookTicker()                                           <a href='#futuresBookTicker'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresTopLongShortAccountRatio()               <a href='#futuresTopLongShortAccountRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresTopLongShortPositionRatio()             <a href='#futuresTopLongShortPositionRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresGlobalLongShortAccountRatio()         <a href='#futuresGlobalLongShortAccountRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresTakerLongShortRatio()                         <a href='#futuresTakerLongShortRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresBLVTCandlesticks()                               <a href='#futuresBLVTCandlesticks'><sup>ref</sup></a>|symbol, interval                                                         |limit, startTime, endTime                                |                |
|futuresIndexInfo()                                             <a href='#futuresIndexInfo'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresMultiAssetModeIndex()                         <a href='#futuresMultiAssetModeIndex'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresChangePositionSide()                           <a href='#futuresChangePositionSide'><sup>ref</sup></a>|dualSidePosition                                                         |                                                         |recvWindow      |
|futuresGetPositionSide()                                 <a href='#futuresGetPositionSide'><sup>ref</sup></a>|multiAssetsMargin                                                        |                                                         |recvWindow      |
|futuresChangeMultiAssetMargin()                   <a href='#futuresChangeMultiAssetMargin'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresGetMultiAssetMargin()                         <a href='#futuresGetMultiAssetMargin'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresConvertToQuantity()                           <a href='#futuresGetMultiAssetMargin'><sup>ref</sup></a>|symbol, USDT_or_BUSD_margin                                              |leverage, customPrice                                    |
|futuresMarketBuy()                                             <a href='#futuresMarketBuy'><sup>ref</sup></a>|symbol, quantity                                                         |                                                         |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, recvWindow|
|futuresMarketSell()                                           <a href='#futuresMarketSell'><sup>ref</sup></a>|symbol, quantity                                                         |                                                         |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, recvWindow|
|futuresBuy()                                                         <a href='#futuresBuy'><sup>ref</sup></a>|symbol, quantity, price                                                  |                                                         |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresSell()                                                       <a href='#futuresSell'><sup>ref</sup></a>|symbol, quantity, price                                                  |                                                         |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresTakeProfit()                                           <a href='#futuresTakeProfit'><sup>ref</sup></a>|symbol, side, stopPrice                                                  |(ONE OF THE FOLLOWING) closePosition, quantity           |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresStopLoss()                                               <a href='#futuresStopLoss'><sup>ref</sup></a>|symbol, side, stopPrice                                                  |(ONE OF THE FOLLOWING) closePosition, quantity           |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresCreateOrder()                                         <a href='#futuresCreateOrder'><sup>ref</sup></a>|symbol, side, type                                                       |                                                         |positionSide, reduceOnly, closePosition, quantity, price, stopPrice, activationPrice, callbackRate, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresMultipleOrders()                                   <a href='#futuresMultipleOrders'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresOrder()                                                     <a href='#futuresOrder'><sup>ref</sup></a>|symbol, orderId OR origClientOrderId                                     |                                                         |recvWindow      |
|futuresCancelOrder()                                         <a href='#futuresCancelOrder'><sup>ref</sup></a>|symbol, orderId OR origClientOrderId                                     |                                                         |recvWindow      |
|futuresCancelAll()                                             <a href='#futuresCancelAll'><sup>ref</sup></a>|symbol                                                                   |                                                         |recvWindow      |
|futuresCancelBatchOrders()                             <a href='#futuresCancelBatchOrders'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresCountdownCancelAll()                           <a href='#futuresCountdownCancelAll'><sup>ref</sup></a>|symbol, countdownTime                                                    |                                                         |recvWindow      |
|futuresOpenOrder()                                             <a href='#futuresOpenOrder'><sup>ref</sup></a>|symbol, orderId OR origClientOrderId                                     |                                                         |recvWindow      |
|futuresOpenOrders()                                           <a href='#futuresOpenOrders'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresAllOrders()                                             <a href='#futuresAllOrders'><sup>ref</sup></a>|symbol                                                                   |orderId, limit, startTime, endTime                       |recvWindow      |
|futuresBalance()                                                 <a href='#futuresBalance'><sup>ref</sup></a>|                                                                         |reconnect, tries                                         |recvWindow      |
|futuresAccount()                                                 <a href='#futuresAccount'><sup>ref</sup></a>|                                                                         |(BOOLS ONLY): activePositionsOnly, activeAssets          |recvWindow      |
|futuresLeverage()                                               <a href='#futuresLeverage'><sup>ref</sup></a>|symbol, leverage                                                         |                                                         |recvWindow, findHighest (BOOL)|
|futuresLeverageBrackets()                               <a href='#futuresLeverageBrackets'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresMarginType()                                           <a href='#futuresMarginType'><sup>ref</sup></a>|symbol, amount, marginType                                               |                                                         |recvWindow      |
|futuresPositionMargin()                                   <a href='#futuresPositionMargin'><sup>ref</sup></a>|symbol, amount, type_2                                                   |                                                         |positionSide, recvWindow|
|futuresPositionMarginHistory()                     <a href='#futuresPositionMarginHistory'><sup>ref</sup></a>|symbol                                                                   |limit, type_2, startTime, endTime                        |recvWindow      |
|futuresPositionRisk()                                       <a href='#futuresPositionRisk'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresOpenPositions()                                     <a href='#futuresOpenPositions'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresUserTrades()                                           <a href='#futuresUserTrades'><sup>ref</sup></a>|                                                                         |symbol, limit, incomeType, startTime, endTime            |recvWindow      |
|futuresIncomeHistory()                                     <a href='#futuresIncomeHistory'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresADLQuantileEstimation()                     <a href='#futuresADLQuantileEstimation'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresForceOrders()                                         <a href='#futuresForceOrders'><sup>ref</sup></a>|                                                                         |symbol, limit, autoCloseType, startTime, endTime         |recvWindow      |
|futuresQuantitativeRules()                             <a href='#futuresQuantitativeRules'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresUserCommissionRate()                           <a href='#futuresUserCommissionRate'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresTransactionHistoryDownloadId()       <a href='#futuresTransactionHistoryDownloadId'><sup>ref</sup></a>|startTime, endTime                                                       |                                                         |recvWindow      |
|futuresGetTransactionHistoryLinkByDownloadId()<a href='#futuresGetTransactionHistoryLinkByDownloadId'><sup>ref</sup></a>|downloadId                                                  |                                                         |recvWindow      |
|futuresPortfolioMarginExchangeInfo()         <a href='#futuresPortfolioMarginExchangeInfo'><sup>ref</sup></a>|symbol                                                                   |                                                         |                |
|futuresPortfolioMarginAccountInfo()           <a href='#futuresPortfolioMarginAccountInfo'><sup>ref</sup></a>|asset                                                                    |                                                         |recvWindow      |



## **FUTURES MARKET DATA**


### .futuresPing():
```js
  let ping = await binance.futuresPing();
  if(ping.error) {
    console.log(ping.error); // check for error
  }
```
<details>
 <summary>View Response</summary>

 ```js
 { 
  roundtrip_time_millis: 410 // <= in millis
 }
 ```
</details>

or optionally, you can use the parameter 'reconnect' as true, this way the library will keep pinging until it gets a successful response, just like the following:
```js
  let ping_til_successful = await binance.futuresPing(true);
  console.log(ping_til_successful); // -> { roundtrip_time_millis: 389 } even though it took 10 consecutive tries to finally get a response
```

and finally, market data functions also have a parameter 'tries' if you want to ONLY try a specific amount of times before an error is returned, just like the following:
```js
  let ping_3tries = await binance.futuresPing(true, 3);
  if(ping_3tries.error) {
    console.log(ping_3tries); // the ping request failed 3 times with no success.
  }
```
<details>
 <summary>View Error Response</summary>
 
 ```js
 {  
  error: {  
    status: 408,  
    statusText: 'Request Timeout',  
    code: -2,  
    msg: 'No connection'  
  }  
}  
 ```
</details>

**PLEASE READ THE DOCUMENTATION FOR EVERY FUNCTION YOU EVER USE, AS I SPECIFICALLY ADD SOME FUNCTIONS THAT YOU MAY USE INSTEAD OF HAVING TO CREATE ONE YOURSELF AND RUN INTO TROUBLES. EVERY FUNCTION HAS A UNIQUE DOCUMENTATION, YOU CAN CHECK IT OUT IN VSCode BY HOVERING OVER THE FUNCTION NAME, OR CHECK IT HERE**


### .futuresServerTime():
```js
  let serverTime = await binance.futuresServerTime(true); // function parameters: (reconnect, tries, options {})
  console.log(serverTime); // <= 1665491953938
```


### .futuresExchangeInfo():
```js
  let exchangeInfo = await binance.futuresExchangeInfo(true); // function parameters: (reconnect, tries, options {})
  console.log(exchangeInfo);
```
<details>
 <summary>View Response</summary>

 ```js
{
    timezone: 'UTC',
    serverTime: 1665662448706,
    futuresType: 'U_MARGINED',
    rateLimits: [
        {
            rateLimitType: 'REQUEST_WEIGHT',
            interval: 'MINUTE',
            intervalNum: 1,
            limit: 2400
        },
        {
            rateLimitType: 'ORDERS',
            interval: 'MINUTE',
            intervalNum: 1,
            limit: 1200
        },
        {
            rateLimitType: 'ORDERS',
            interval: 'SECOND',
            intervalNum: 10,
            limit: 300
        }
    ],
    exchangeFilters: [],
    assets: [
        { asset: 'USDT', marginAvailable: true, autoAssetExchange: -10000 },
        { asset: 'BTC', marginAvailable: true, autoAssetExchange: -0.001 },
        { asset: 'BNB', marginAvailable: true, autoAssetExchange: -10 },
        { asset: 'ETH', marginAvailable: true, autoAssetExchange: -5 },
        { asset: 'XRP', marginAvailable: true, autoAssetExchange: 0 },
        { asset: 'ADA', marginAvailable: true, autoAssetExchange: 0 },
        { asset: 'DOT', marginAvailable: true, autoAssetExchange: 0 },
        { asset: 'SOL', marginAvailable: true, autoAssetExchange: 0 },
        { asset: 'BUSD', marginAvailable: true, autoAssetExchange: -10000 }
    ],
    symbols: [
        {
            symbol: 'BTCUSDT',
            pair: 'BTCUSDT',
            contractType: 'PERPETUAL',
            deliveryDate: 4133404800000,
            onboardDate: 1569398400000,
            status: 'TRADING',
            maintMarginPercent: 2.5,
            requiredMarginPercent: 5,
            baseAsset: 'BTC',
            quoteAsset: 'USDT',
            marginAsset: 'USDT',
            pricePrecision: 2,
            quantityPrecision: 3,
            baseAssetPrecision: 8,
            quotePrecision: 8,
            underlyingType: 'COIN',
            underlyingSubType: ['PoW'],
            settlePlan: 0,
            triggerProtect: 0.05,
            liquidationFee: 0.0175,
            marketTakeBound: 0.05,
            filters: [
                {
                    minPrice: 556.8,
                    maxPrice: 4529764,
                    filterType: 'PRICE_FILTER',
                    tickSize: 0.1
                },
                {
                    stepSize: 0.001,
                    filterType: 'LOT_SIZE',
                    maxQty: 1000,
                    minQty: 0.001
                },
                {
                    stepSize: 0.001,
                    filterType: 'MARKET_LOT_SIZE',
                    maxQty: 120,
                    minQty: 0.001
                },
                { limit: 200, filterType: 'MAX_NUM_ORDERS' },
                { limit: 10, filterType: 'MAX_NUM_ALGO_ORDERS' },
                { notional: 5, filterType: 'MIN_NOTIONAL' },
                {
                    multiplierDown: 0.95,
                    multiplierUp: 1.05,
                    multiplierDecimal: 4,
                    filterType: 'PERCENT_PRICE'
                }
            ],
            orderTypes: [
                'LIMIT',
                'MARKET',
                'STOP',
                'STOP_MARKET',
                'TAKE_PROFIT',
                'TAKE_PROFIT_MARKET',
                'TRAILING_STOP_MARKET'
            ],
            timeInForce: ['GTC', 'IOC', 'FOK', 'GTX']
        },
        {
            symbol: "ETHUSDT",
            ...
        },
        {
            symbol: "XRPBUSD",
            ...
        },
        ...
    ]
}
 ```
</details>

Or using the options parameters:
```js
  let exchangeInfo = await binance.futuresExchangeInfo(true, 0, {
    symbols: true,          // this is the only property that isn't included in the symbols' properties, but comes seperately as a 'symbols' property in the response
    pricePrecision: true,   // to access those values, for example for BTCUSDT, you just call exchangeInfo.BTCUSDT.pricePrecision
    quantityPrecision: true,// exchangeInfo['<SYMBOL>'].quantityPrecision OR specifically exchangeInfo['BNBUSDT'].quantityPrecision OR exchangeInfo.BNBUSDT.quantityPrecision
    baseAsset: true,
    quoteAsset: true          // you can check the rest of the options parameters in the futures functions table above
  });

  // OR

  let exchangeInfo = await binance.futuresExchangeInfo(true, 0, {
      mapped: true  // this will return the normal info
                    // BUT 
                    // The symbols will be mapped to the symbol name
                    // .symbols will be an array of all of the symbols
                    // .exchangeInfo will have the non-symbol related info in it
    })
  console.log(exchangeInfo);
```
<details>
 <summary>View Response</summary>

 ```js
 {
  symbols: [  // because of { symbols: true } <= it is the only options parameter that returns as a seperate property in this response
    'BTCUSDT',  'ETHUSDT',   'BCHUSDT',   'XRPUSDT',   'EOSUSDT',
    'LTCUSDT',  'TRXUSDT',   'ETCUSDT',   'LINKUSDT',  'XLMUSDT',
    'ADAUSDT',  'XMRUSDT',   'DASHUSDT',  'ZECUSDT',   'XTZUSDT',
    'BNBUSDT',  'ATOMUSDT',  'ONTUSDT',   'IOTAUSDT',  'BATUSDT',
    'VETUSDT',  'NEOUSDT',   'QTUMUSDT',  'IOSTUSDT',  'THETAUSDT',
    'ALGOUSDT', 'ZILUSDT',   'KNCUSDT',   'ZRXUSDT',   'COMPUSDT',
    'OMGUSDT',  'DOGEUSDT',  'SXPUSDT',   'KAVAUSDT',  'BANDUSDT',
    'RLCUSDT',  'WAVESUSDT', 'MKRUSDT',   'SNXUSDT',   'DOTUSDT',
    'DEFIUSDT', 'YFIUSDT',   'BALUSDT',   'CRVUSDT',   'TRBUSDT',
    'RUNEUSDT', 'SUSHIUSDT', 'SRMUSDT',   'EGLDUSDT',  'SOLUSDT',
    'ICXUSDT',  'STORJUSDT', 'BLZUSDT',   'UNIUSDT',   'AVAXUSDT',
    'FTMUSDT',  'HNTUSDT',   'ENJUSDT',   'FLMUSDT',   'TOMOUSDT',
    'RENUSDT',  'KSMUSDT',   'NEARUSDT',  'AAVEUSDT',  'FILUSDT',
    'RSRUSDT',  'LRCUSDT',   'MATICUSDT', 'OCEANUSDT', 'CVCUSDT',
    'BELUSDT',  'CTKUSDT',   'AXSUSDT',   'ALPHAUSDT', 'ZENUSDT',
    'SKLUSDT',  'GRTUSDT',   '1INCHUSDT', 'BTCBUSD',   'CHZUSDT',
    'SANDUSDT', 'ANKRUSDT',  'BTSUSDT',   'LITUSDT',   'UNFIUSDT',
    'REEFUSDT', 'RVNUSDT',   'SFPUSDT',   'XEMUSDT',   'BTCSTUSDT',
    'COTIUSDT', 'CHRUSDT',   'MANAUSDT',  'ALICEUSDT', 'HBARUSDT',
    'ONEUSDT',  'LINAUSDT',  'STMXUSDT',  'DENTUSDT',  'CELRUSDT',
    ...
  ],
  BTCUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'BTC',
    quoteAsset: 'USDT'
  },
  ETHUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'ETH',
    quoteAsset: 'USDT'
  },
  BCHUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'BCH',
    quoteAsset: 'USDT'
  },
  XRPUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'XRP',
    quoteAsset: 'USDT'
  },
  ...
}

// OR

{ // for mapped exchangeInfo
  symbols: [
    'BTCUSDT',  'ETHUSDT',   'BCHUSDT',   'XRPUSDT',   'EOSUSDT',
    'LTCUSDT',  'TRXUSDT',   'ETCUSDT',   'LINKUSDT',  'XLMUSDT',
    'ADAUSDT',  'XMRUSDT',   'DASHUSDT',  'ZECUSDT',   'XTZUSDT',
    'BNBUSDT',  'ATOMUSDT',  'ONTUSDT',   'IOTAUSDT',  'BATUSDT',
    'VETUSDT',  'NEOUSDT',   'QTUMUSDT',  'IOSTUSDT',  'THETAUSDT',
    'ALGOUSDT', 'ZILUSDT',   'KNCUSDT',   'ZRXUSDT',   'COMPUSDT',
    'OMGUSDT',  'DOGEUSDT',  'SXPUSDT',   'KAVAUSDT',  'BANDUSDT',
    'RLCUSDT',  'WAVESUSDT', 'MKRUSDT',   'SNXUSDT',   'DOTUSDT',
    'DEFIUSDT', 'YFIUSDT',   'BALUSDT',   'CRVUSDT',   'TRBUSDT',
    'RUNEUSDT', 'SUSHIUSDT', 'SRMUSDT',   'EGLDUSDT',  'SOLUSDT',
    'ICXUSDT',  'STORJUSDT', 'BLZUSDT',   'UNIUSDT',   'AVAXUSDT',
    'FTMUSDT',  'HNTUSDT',   'ENJUSDT',   'FLMUSDT',   'TOMOUSDT',
    'RENUSDT',  'KSMUSDT',   'NEARUSDT',  'AAVEUSDT',  'FILUSDT',
    'RSRUSDT',  'LRCUSDT',   'MATICUSDT', 'OCEANUSDT', 'CVCUSDT',
    'BELUSDT',  'CTKUSDT',   'AXSUSDT',   'ALPHAUSDT', 'ZENUSDT',
    'SKLUSDT',  'GRTUSDT',   '1INCHUSDT', 'BTCBUSD',   'CHZUSDT',
    'SANDUSDT', 'ANKRUSDT',  'BTSUSDT',   'LITUSDT',   'UNFIUSDT',
    'REEFUSDT', 'RVNUSDT',   'SFPUSDT',   'XEMUSDT',   'BTCSTUSDT',
    'COTIUSDT', 'CHRUSDT',   'MANAUSDT',  'ALICEUSDT', 'HBARUSDT',
    'ONEUSDT',  'LINAUSDT',  'STMXUSDT',  'DENTUSDT',  'CELRUSDT',
    ...
  ],
  exchangeInfo: {
    timezone: 'UTC',
    serverTime: 1667217635142,
    futuresType: 'U_MARGINED',
    rateLimits: [
      {
        rateLimitType: 'REQUEST_WEIGHT',
        interval: 'MINUTE',
        intervalNum: 1,
        limit: 2400
      },
      {
        rateLimitType: 'ORDERS',
        interval: 'MINUTE',
        intervalNum: 1,
        limit: 1200
      },
      {
        rateLimitType: 'ORDERS',
        interval: 'SECOND',
        intervalNum: 10,
        limit: 300
      }
    ],
    exchangeFilters: [],
    assets: [
      { asset: 'USDT', marginAvailable: true, autoAssetExchange: -10000 },
      { asset: 'BTC', marginAvailable: true, autoAssetExchange: -0.001 },
      { asset: 'BNB', marginAvailable: true, autoAssetExchange: -10 },
      { asset: 'ETH', marginAvailable: true, autoAssetExchange: -5 },
      { asset: 'XRP', marginAvailable: true, autoAssetExchange: 0 },
      { asset: 'ADA', marginAvailable: true, autoAssetExchange: 0 },
      { asset: 'DOT', marginAvailable: true, autoAssetExchange: 0 },
      { asset: 'SOL', marginAvailable: true, autoAssetExchange: 0 },
      { asset: 'BUSD', marginAvailable: true, autoAssetExchange: -10000 }
    ],
    // here the symbols start
    APTBUSD: {
    symbol: 'APTBUSD',
    pair: 'APTBUSD',
    contractType: 'PERPETUAL',
    deliveryDate: 4133404800000,
    onboardDate: 1666594800000,
    status: 'TRADING',
    maintMarginPercent: 2.5,
    requiredMarginPercent: 5,
    baseAsset: 'APT',
    quoteAsset: 'BUSD',
    marginAsset: 'BUSD',
    pricePrecision: 5,
    quantityPrecision: 1,
    baseAssetPrecision: 8,
    quotePrecision: 8,
    underlyingType: 'COIN',
    settlePlan: 0,
    triggerProtect: 0.1,
    liquidationFee: 0.015,
    marketTakeBound: 0.1,
    priceFilters: {
      minPrice: 0.001,
      maxPrice: 100000,
      filterType: 'PRICE_FILTER',
      tickSize: 0.001
    },
    lotFilters: {
      stepSize: 0.1,
      filterType: 'LOT_SIZE',
      maxQty: 1000000,
      minQty: 0.1
    },
    marketLotFilters: {
      stepSize: 0.1,
      filterType: 'MARKET_LOT_SIZE',
      maxQty: 5000,
      minQty: 0.1
    },
    maxNumOrders: 200,
    maxNumAlgoOrders: 10,
    minNotional: 5,
    percentPriceFilters: {
      multiplierDown: 0.9,
      multiplierUp: 1.1,
      multiplierDecimal: 4,
      filterType: 'PERCENT_PRICE'
    },
    orderTypes: [
      'LIMIT',
      'MARKET',
      'STOP',
      'STOP_MARKET',
      'TAKE_PROFIT',
      'TAKE_PROFIT_MARKET',
      'TRAILING_STOP_MARKET'
    ],
    timeInForce: [ 'GTC', 'IOC', 'FOK', 'GTX' ]
  },
  BTCUSDT: {
    ...
  },
  ...,
  ...
}
}
 ```
</details>


### .futuresOrderBook():
```js
  let orderBook = await binance.futuresOrderBook('BTCUSDT');      // <= returns the newest 500 orders
  console.log(orderBook);

  // OR

  let orderBook = await binance.futuresOrderBook('BTCUSDT', 200); // <= returns only the newest 500 orders
  console.log(orderBook);
```
<details>
 <summary>View Response</summary>

 ```js
{
  lastUpdateId: 2026353453163,
  E: 1665665760997,
  T: 1665665760986,
  bids: [
    { price: 18353.9, qty: 4.518 },
    { price: 18353.8, qty: 4.735 },
    { price: 18353.7, qty: 0.963 },
    { price: 18353.6, qty: 2.093 },
    { price: 18353.5, qty: 4.538 }
  ],
  asks: [
    { price: 18354, qty: 0.697 },
    { price: 18354.1, qty: 0.501 },
    { price: 18354.3, qty: 0.379 },
    { price: 18354.4, qty: 0.001 },
    { price: 18354.5, qty: 0.189 }
  ]
}
 ```

</details>


### .futuresRecentTrades():
```js
  let recentTrades = await binance.futuresRecentTrades('ETHUSDT');      // <= 500 newest executed trades
  // OR
  let recentTrades = await binance.futuresRecentTrades('ETHUSDT', 10); // <= 10 newest trades
```
<details>
 <summary>View Response</summary>

 ```js
 [
  {
    "id": 2947591043,
    "price": "19087.00",
    "qty": "0.004",
    "quoteQty": "76.34",
    "time": 1665635175647,
    "isBuyerMaker": false
  },
  {
    "id": 2947591044,
    "price": "19087.00",
    "qty": "0.002",
    "quoteQty": "38.17",
    "time": 1665635175686,
    "isBuyerMaker": false
  },
  {
    ...
  }
]
 ```
</details>


### .futuresHistoricalTrades():
```js
  let historicalTrades = await binance.futuresHistoricalTrades('BTCUSDT', 5);
  console.log(historicalTrades);  // older first, newest last
```

<details>
 <summary>View Response</summary>

 ```js
[
  {
    id: 2950111592,
    price: 18352.5,
    qty: 0.4,
    quoteQty: 7341,
    time: 1665665892089,  // oldest
    isBuyerMaker: true
  },
  {
    id: 2950111593,
    price: 18352.5,
    qty: 0.314,
    quoteQty: 5762.68,
    time: 1665665892089,
    isBuyerMaker: true
  },
  {
    id: 2950111594,
    price: 18352.5,
    qty: 0.001,
    quoteQty: 18.35,
    time: 1665665892099,
    isBuyerMaker: true
  },
  {
    id: 2950111595,
    price: 18352.6,
    qty: 0.304,
    quoteQty: 5579.19,
    time: 1665665892136,
    isBuyerMaker: false
  },
  {
    id: 2950111596,
    price: 18352.5,
    qty: 0.01,
    quoteQty: 183.52,
    time: 1665665892156,  // newest
    isBuyerMaker: true
  }
]
 ```
</details>


### .futuresAggTrades():
```js
  let aggTrades = await binance.futuresAggTrades('BTCUSDT', 5);
  console.log(aggTrades);
```
<details>
 <summary>View Response</summary>

 ```js
[
  {
    tradeId: 1488689111,
    price: 18278.2,
    qty: 0.286,
    firstTradeId: 2950259470,
    lastTradeId: 2950259472,
    timestamp: 1665667203902,
    maker: false
  },
  {
    tradeId: 1488689112,
    price: 18278.4,
    qty: 1,
    firstTradeId: 2950259473,
    lastTradeId: 2950259473,
    timestamp: 1665667203902,
    maker: false
  },
  {
    tradeId: 1488689113,
    price: 18278.5,
    qty: 1.077,
    firstTradeId: 2950259474,
    lastTradeId: 2950259475,
    timestamp: 1665667203902,
    maker: false
  },
  {
    tradeId: 1488689114,
    price: 18278.4,
    qty: 0.018,
    firstTradeId: 2950259476,
    lastTradeId: 2950259476,
    timestamp: 1665667203952,
    maker: true
  },
  {
    tradeId: 1488689115,
    price: 18278.5,
    qty: 2.225,
    firstTradeId: 2950259477,
    lastTradeId: 2950259498,
    timestamp: 1665667204008,
    maker: false
  }
]
 ```
</details>


#### Using startTime and endTime:
```js
  let startTime = new Date('10/13/2022, 3:22:55 PM').getTime();
  let endTime = new Date('10/13/2022, 4:23:55 PM').getTime(); // all trades within a minute
  let aggTrades = await binance.futuresAggTrades('BTCUSDT', 500, startTime, endTime);
  console.log(aggTrades);
```
OR
```js
  let startTime = new Date('10/13/2022, 3:22:55 PM').getTime();
  endTime = startTime + 500;  // within a timeframe of 500 milliseconds, should be about 10-20 trades
  let aggTrades = await binance.futuresAggTrades('BTCUSDT', 500, startTime, endTime);
  console.log(aggTrades);
```


### .futuresCandlesticks():
```js
  let candlesticks = await binance.futuresCandlesticks('BTCUSDT', '1m', 5);
  console.log(candlesticks);
```
<details>
<summary>View Response</summary>

```js
[
  {
    open_time: 1665667620000,
    open: 18308.5,
    high: 18324.4,
    low: 18301.7,
    close: 18324.2,
    volume: 659.087,
    close_time: 1665667679999,
    quote_asset_volume: 12069931.8632,
    trades_count: 4176,
    Taker_buy_base_asset_volume: 303.265,
    Taker_buy_quote_asset_volume: 5554177.2288,
    ignore: 0
  },
  {
    open_time: 1665667680000,
    open: 18324.3,
    high: 18327,
    low: 18313.8,
    close: 18314.6,
    volume: 507.953,
    close_time: 1665667739999,
    quote_asset_volume: 9305666.0267,
    trades_count: 3394,
    Taker_buy_base_asset_volume: 245.085,
    Taker_buy_quote_asset_volume: 4489933.3437,
    ignore: 0
  },
  {
    open_time: 1665667740000,
    open: 18314.5,
    high: 18314.6,
    low: 18285.2,
    close: 18302,
    volume: 906.295,
    close_time: 1665667799999,
    quote_asset_volume: 16583679.2108,
    trades_count: 5136,
    Taker_buy_base_asset_volume: 296.932,
    Taker_buy_quote_asset_volume: 5432955.6652,
    ignore: 0
  },
  {
    open_time: 1665667800000,
    open: 18302,
    high: 18320,
    low: 18270,
    close: 18314.5,
    volume: 2244.353,
    close_time: 1665667859999,
    quote_asset_volume: 41058116.2425,
    trades_count: 11247,
    Taker_buy_base_asset_volume: 1114.533,
    Taker_buy_quote_asset_volume: 20392560.448,
    ignore: 0
  },
  {
    open_time: 1665667860000,
    open: 18314.6,
    high: 18316.2,
    low: 18301.4,
    close: 18302.3,
    volume: 199.436,
    close_time: 1665667919999,
    quote_asset_volume: 3651314.3669,
    trades_count: 1136,
    Taker_buy_base_asset_volume: 87.375,
    Taker_buy_quote_asset_volume: 1599607.2908,
    ignore: 0
  }
]
```
</details>


### .futuresContinuousCandlesticks():
```js
  let contCandlesticks = await binance.futuresContinuousCandlesticks('BTCUP', '1m');
  console.log(contCandlesticks);
```
<details>
<summary>View Response</summary>

```js
[
  {
    open_time: 1665668520000,
    open: 18363.8,
    high: 18394,
    low: 18355,
    close: 18393,
    volume: 3749.998,
    close_time: 1665668579999,
    quote_asset_volume: 68919237.456,
    trades_count: 13624,
    Taker_buy_base_asset_volume: 2375.665,
    Taker_buy_quote_asset_volume: 43658320.5968,
    ignore: 0
  },
  {
    open_time: 1665668580000,
    open: 18393,
    high: 18393.1,
    low: 18360.2,
    close: 18381.3,
    volume: 1246.72,
    close_time: 1665668639999,
    quote_asset_volume: 22914351.2042,
    trades_count: 6442,
    Taker_buy_base_asset_volume: 566.069,
    Taker_buy_quote_asset_volume: 10404112.7807,
    ignore: 0
  },
  {
    open_time: 1665668640000,
    open: 18381.3,
    high: 18381.3,
    low: 18355.1,
    close: 18367.7,
    volume: 1252.831,
    close_time: 1665668699999,
    quote_asset_volume: 23010727.8257,
    trades_count: 5730,
    Taker_buy_base_asset_volume: 693.83,
    Taker_buy_quote_asset_volume: 12744150.0498,
    ignore: 0
  },
  {
    open_time: 1665668700000,
    open: 18367.8,
    high: 18390,
    low: 18355.1,
    close: 18388.9,
    volume: 1738.816,
    close_time: 1665668759999,
    quote_asset_volume: 31947839.6941,
    trades_count: 6652,
    Taker_buy_base_asset_volume: 1266.802,
    Taker_buy_quote_asset_volume: 23274400.7782,
    ignore: 0
  },
  {
    open_time: 1665668760000,
    open: 18388.9,
    high: 18418.5,
    low: 18388.8,
    close: 18401.6,
    volume: 1995.499,
    close_time: 1665668819999,
    quote_asset_volume: 36730888.7081,
    trades_count: 9241,
    Taker_buy_base_asset_volume: 1219.669,
    Taker_buy_quote_asset_volume: 22449084.2429,
    ignore: 0
  }
]
```
</details>


### .futuresIndexPriceCandlesticks():
```js
  let indexPriceCandlesticks = await binance.futuresIndexPriceCandlesticks('BTCUSDT', '1m', 5);
  console.log(indexPriceCandlesticks);
```
<details>
 <summary>View Response</summary>

 ```js
[
  {
    open_time: 1665668700000,
    open: 18374.60611354,
    high: 18399.03665601,
    low: 18365.72467163,
    close: 18397.5647953,
    ignore: 0,
    close_time: 1665668759999
  },
  {
    open_time: 1665668760000,
    open: 18398.22716751,
    high: 18418.88130404,
    low: 18398.22562579,
    close: 18417.26593521,
    ignore: 0,
    close_time: 1665668819999
  },
  {
    open_time: 1665668820000,
    open: 18424.00801333,
    high: 18431.72887525,
    low: 18413.1712703,
    close: 18431.03350516,
    ignore: 0,
    close_time: 1665668879999
  },
  {
    open_time: 1665668880000,
    open: 18429.87576499,
    high: 18438.76874095,
    low: 18426.55439659,
    close: 18437.97295329,
    ignore: 0,
    close_time: 1665668939999
  },
  {
    open_time: 1665668940000,
    open: 18438.6402853,
    high: 18467.55226191,
    low: 18437.93523335,
    close: 18465.83161211,
    ignore: 0,
    close_time: 1665668999999
  }
]
 ```
 </details>


### .futuresMarkPriceCandlesticks():
```js
  let markPriceCandlesticks = await binance.futuresMarkPriceCandlesticks('BTCUSDT', '1m', 5);
  console.log(markPriceCandlesticks);
```
<details>
 <summary>View Response</summary>

 ```js
[
  {
    open_time: 1665668760000,
    open: 18390.83034308,
    high: 18416.1,
    low: 18390.83034308,
    close: 18410.1398562,
    ignore: 0,
    close_time: 1665668819999
  },
  {
    open_time: 1665668820000,
    open: 18417.8,
    high: 18428.4,
    low: 18406.5,
    close: 18428.4,
    ignore: 0,
    close_time: 1665668879999
  },
  {
    open_time: 1665668880000,
    open: 18425,
    high: 18431.08475539,
    low: 18418.79928662,
    close: 18428.72394225,
    ignore: 0,
    close_time: 1665668939999
  },
  {
    open_time: 1665668940000,
    open: 18430.77621812,
    high: 18460.6,
    low: 18430.07116617,
    close: 18448.04953004,
    ignore: 0,
    close_time: 1665668999999
  },
  {
    open_time: 1665669000000,
    open: 18448.04953004,
    high: 18448.04953004,
    low: 18434.08339331,
    close: 18434.08339331,
    ignore: 0,
    close_time: 1665669059999
  }
]
 ```
 </details>


### .futuresMarkPrice():
```js
  let markPrice = await binance.futuresMarkPrice('XRPBUSD');
  console.log(markPrice); // <= BEWARE: markPrices aren't the executed price of the symbol, instead use .futuresPrices() for the 'last price' which is the accurate price for the symbol in order on binance.
```
<details>
 <summary>View Response</summary>

 ```js
{
  symbol: 'XRPBUSD',
  markPrice: 0.4717213,
  indexPrice: 0.47195037,
  estimatedSettlePrice: 0.46220571,
  lastFundingRate: -0.00008265,
  interestRate: 0.0001,
  nextFundingTime: 1665676800000,
  time: 1665669213008
}
 ```
</details>

OR

```js
  let markPrices = await binance.futuresMarkPrice();
  console.log(markPrices);
```

<details>
 <summary>View Response</summary>

 ```js
[
  {
    symbol: 'RAYUSDT',
    markPrice: 0.47495979,
    indexPrice: 0.47498446,
    estimatedSettlePrice: 0.47189122,
    lastFundingRate: -0.00042089,
    interestRate: 0.0001,
    nextFundingTime: 1665676800000,
    time: 1665669251005
  },
  {
    symbol: 'API3USDT',
    markPrice: 1.49386986,
    indexPrice: 1.49454814,
    estimatedSettlePrice: 1.47463299,
    lastFundingRate: 0.00000406,
    interestRate: 0.0001,
    nextFundingTime: 1665676800000,
    time: 1665669251005
  },
  {
    symbol: 'SUSHIUSDT',
    markPrice: 1.19213418,
    indexPrice: 1.19308404,
    estimatedSettlePrice: 1.16535126,
    lastFundingRate: 0.0001,
    interestRate: 0.0001,
    nextFundingTime: 1665676800000,
    time: 1665669251005
  },
  ...
]
```
</details>


### .futuresFundingRate():
```js
  let fundingRate = await binance.futuresFundingRate('BTCUSDT', 5); // last 5 fundings rates for BTCUSDT
  console.log(fundingRate);
```
<details>
 <summary>View Response</summary>

 ```js
 [
  {
    symbol: 'BTCUSDT',
    fundingTime: 1665532800014,
    fundingRate: 0.0001
  },
  {
    symbol: 'BTCUSDT',
    fundingTime: 1665561600000,
    fundingRate: 0.0001
  },
  {
    symbol: 'BTCUSDT',
    fundingTime: 1665590400000,
    fundingRate: 0.0001
  },
  {
    symbol: 'BTCUSDT',
    fundingTime: 1665619200013,
    fundingRate: 0.00007466
  },
  {
    symbol: 'BTCUSDT',
    fundingTime: 1665648000016,
    fundingRate: 0.0001
  }
]
```
</details>

OR

```js
  let fundingRates = await binance.futuresFundingRate();  // the current funding rate of ALL symbols
  console.log(fundingRate);
```

<details>
 <summary>View Response</summary>

```js
[
  {
    symbol: 'GMTBUSD',
    fundingTime: 1665648000016,
    fundingRate: -0.00030958
  },
  {
    symbol: 'GMTUSDT',
    fundingTime: 1665648000016,
    fundingRate: -0.00027327
  },
  {
    symbol: 'GRTUSDT',
    fundingTime: 1665648000016,
    fundingRate: -0.00022077
  },
  {
    symbol: 'HNTUSDT',
    fundingTime: 1665648000016,
    fundingRate: 0.00004804
  },
  ...
]
```
</details>


### .futures24hrTicker():
```js
  let btc_24hrTicker = await binance.futures24hrTicker('BTCUSDT');
  console.log(futures24hrTickers)
```
<details>
 <summary>View Response</summary>

```js
{
  symbol: 'BTCUSDT',
  priceChange: -670.9,
  priceChangePercent: -3.514,
  weightedAvgPrice: 18711.42,
  lastPrice: 18423.4,
  lastQty: 0.008,
  openPrice: 19094.3,
  highPrice: 19240,
  lowPrice: 17917.8,
  volume: 737526.522,
  quoteVolume: 13800169644.09,
  openTime: 1665586560000,
  closeTime: 1665673017810,
  firstId: 2946532401,
  lastId: 2950761732,
  count: 4214430
}
```
</details>

OR

```js
  let futures24hrTickers = await binance.futures24hrTicker();
  console.log(futures24hrTickers)
```
<details>
 <summary>View Response</summary>

```js
[
  {
    symbol: 'APEBUSD',
    priceChange: -0.352,
    priceChangePercent: -7.478,
    weightedAvgPrice: 4.4426265,
    lastPrice: 4.355,
    lastQty: 44.3,
    openPrice: 4.707,
    highPrice: 4.761,
    lowPrice: 4.136,
    volume: 8708594.3,
    quoteVolume: '38689031.8500000',
    openTime: 1665586380000,
    closeTime: 1665672783589,
    firstId: 13241478,
    lastId: 13345917,
    count: 104438
  },
  {
    symbol: 'BAKEUSDT',
    priceChange: -0.0114,
    priceChangePercent: -5.11,
    weightedAvgPrice: 0.2139,
    lastPrice: 0.2117,
    lastQty: 485,
    openPrice: 0.2231,
    highPrice: 0.2245,
    lowPrice: 0.2033,
    volume: 59131679,
    quoteVolume: 12649430.9,
    openTime: 1665586380000,
    closeTime: 1665672781614,
    firstId: 117654903,
    lastId: 117729911,
    count: 75002
  },
  {
    symbol: 'NKNUSDT',
    priceChange: -0.00573,
    priceChangePercent: -6.739,
    weightedAvgPrice: 0.08104,
    lastPrice: 0.0793,
    lastQty: 423,
    openPrice: 0.08503,
    highPrice: 0.08548,
    lowPrice: 0.0765,
    volume: 104110622,
    quoteVolume: 8436902.32,
    openTime: 1665586380000,
    closeTime: 1665672784558,
    firstId: 95007886,
    lastId: 95058339,
    count: 50446
  },
  {
    symbol: 'XEMUSDT',
    priceChange: -0.0022,
    priceChangePercent: -5.598,
    weightedAvgPrice: 0.0375,
    lastPrice: 0.0371,
    lastQty: 17212,
    openPrice: 0.0393,
    highPrice: 0.0397,
    lowPrice: 0.0357,
    volume: 417148902,
    quoteVolume: 15639026.05,
    openTime: 1665586380000,
    closeTime: 1665672782818,
    firstId: 67719844,
    lastId: 67782278,
    count: 62416
  },
  ...
]
```
</details>


### .futuresPrices():
```js
  let btcPrice = await binance.futuresPrices('BTCUSDT');  // BTC's current Price (use this and not markPrice to check your PnL or an estimation on your executed order's price)
  console.log(btcPrice);
```
<details>
<summary>View Response</summary>

```js
{ 
  symbol: 'BTCUSDT',
  price: 18406.1, 
  time: 1665673110825 
}
```
</details>

OR

```js
  let allPrices = await binance.futuresPrices();  // All symbol's currentPrice (or lastPrice)
  console.log(allPrices);
```
<details>
<summary>View Response</summary>

```js
{
  XRPBUSD: 0.4681,
  MKRUSDT: 917.5,
  SRMUSDT: 0.703,
  FILBUSD: 4.88,
  DODOBUSD: 0.1122,
  C98USDT: 0.3167,
  SFPUSDT: 0.3384,
  '1000XECUSDT': 0.03586,
  XEMUSDT: 0.0372,
  ZENUSDT: 11.886,
  ETHUSDT: 1220.35,
  MTLUSDT: 0.9363,
  BATUSDT: 0.2741,
  '1000SHIBBUSD': 0.009661,
  LDOUSDT: 1.205,
  TLMBUSD: 0.02032,
  CVXBUSD: 5.181,
  ENJUSDT: 0.4047,
  RSRUSDT: 0.006398,
  OMGUSDT: 1.495,
  ATAUSDT: 0.1339,
  ETHBUSD: 1220.49,
  IOSTUSDT: 0.01109,
  STGUSDT: 0.424,
  DOGEUSDT: 0.05717,
  AUCTIONBUSD: 5.308,
  ALGOUSDT: 0.3021,
  ANKRUSDT: 0.02616,
  FTTBUSD: 22.364,
  CHZUSDT: 0.17436,
  ZRXUSDT: 0.2376,
  AVAXUSDT: 14.93,
  SCUSDT: 0.003653,
  TOMOUSDT: 0.3854,
  ARUSDT: 9.101,
  CELOUSDT: 0.702,
  SXPUSDT: 0.3023,
  BNBBUSD: 261.84,
  OCEANUSDT: 0.14455,
  DOTUSDT: 5.881,
  UNFIUSDT: 5.189,
  ALPHAUSDT: 0.1062,
  MATICBUSD: 0.744,
  SPELLUSDT: 0.000852,
  ONEUSDT: 0.01709,
  ETHUSDT_221230: 1216.13,
  FTMBUSD: 0.1964,
  BTSUSDT: 0.01251,
  EGLDUSDT: 52.62,
  INJUSDT: 1.702,
  DUSKUSDT: 0.11336,
  RENUSDT: 0.1088,
  KAVAUSDT: 1.351,
  NEOUSDT: 7.588,
  BCHUSDT: 104.66,
  PHBBUSD: 0.5606,
  CVCUSDT: 0.11271,
  SUSHIUSDT: 1.165,
  LPTUSDT: 8.231,
  SOLUSDT: 28.97,
  WOOUSDT: 0.1362,
  NKNUSDT: 0.07931,
  FILUSDT: 4.88,
  AAVEUSDT: 68.63,
  HOTUSDT: 0.001939,
  FOOTBALLUSDT: 804.49,
  GTCUSDT: 1.532,
  APEUSDT: 4.351,
  GALAUSDT: 0.03648,
  VETUSDT: 0.02197,
  LUNA2BUSD: 2.5967,
  ANTUSDT: 1.507,
  BELUSDT: 0.511,
  LTCBUSD: 49.24,
  SNXUSDT: 2.001,
  BTCUSDT_221230: 18485.5,
  BAKEUSDT: 0.2121,
  STMXUSDT: 0.00635,
  LUNA2USDT: 2.5956,
  GMTBUSD: 0.5581,
  REEFUSDT: 0.005657,
  OGNUSDT: 0.1319,
  AMBBUSD: 0.01309,
  SANDBUSD: 0.726,
  GALUSDT: 2.249,
  UNIBUSD: 5.823,
  AVAXBUSD: 14.935,
  RLCUSDT: 1.0525,
  XTZUSDT: 1.35,
  EOSUSDT: 0.976,
  CVXUSDT: 5.182,
  COTIUSDT: 0.09764,
  STORJUSDT: 0.3915,
  NEARBUSD: 2.951,
  HNTUSDT: 4.671,
  IMXUSDT: 0.6365,
  TRXBUSD: 0.059811,
  OPUSDT: 0.6953,
  ARPAUSDT: 0.03082,
  DASHUSDT: 39.25,
  MANAUSDT: 0.61,
  CELRUSDT: 0.01341,
  GRTUSDT: 0.08511,
  '1INCHUSDT': 0.5552,
  ROSEUSDT: 0.053,
  DEFIUSDT: 621.2,
  KSMUSDT: 38.4,
  BTCBUSD: 18404.1,
  LINAUSDT: 0.00688,
  ATOMUSDT: 11,
  APEBUSD: 4.351,
  CHRUSDT: 0.1376,
  IOTXUSDT: 0.02577,
  XMRUSDT: 137.38,
  FTMUSDT: 0.1963,
  IOTAUSDT: 0.2455,
  BTCDOMUSDT: 1320.8,
  CTKUSDT: 0.809,
  UNIUSDT: 5.821,
  TRXUSDT: 0.0598,
  ONTUSDT: 0.2001,
  CRVUSDT: 0.76,
  KNCUSDT: 0.919,
  RVNUSDT: 0.02991,
  THETAUSDT: 0.958,
  ICXUSDT: 0.2106,
  SKLUSDT: 0.03329,
  API3USDT: 1.491,
  KLAYUSDT: 0.1475,
  WAVESUSDT: 3.238,
  TLMUSDT: 0.0347,
  ADAUSDT: 0.3662,
  ALICEUSDT: 1.471,
  '1000LUNCUSDT': 0.2725,
  FLOWUSDT: 1.45,
  MASKUSDT: 1.012,
  LRCUSDT: 0.2486,
  NEARUSDT: 2.951,
  '1000LUNCBUSD': 0.2724,
  DARUSDT: 0.1861,
  GALBUSD: 2.248,
  AUDIOUSDT: 0.1737,
  PEOPLEUSDT: 0.01933,
  CTSIUSDT: 0.1286,
  MATICUSDT: 0.744,
  LEVERBUSD: 0.001404,
  LDOBUSD: 1.205,
  BALUSDT: 4.692,
  WAVESBUSD: 3.238,
  ZILUSDT: 0.02904,
  ENSUSDT: 17.223,
  ETCBUSD: 21.922,
  DGBUSDT: 0.00838,
  XLMUSDT: 0.10949,
  DOTBUSD: 5.88,
  JASMYUSDT: 0.005074,
  DENTUSDT: 0.000836,
  QTUMUSDT: 2.54,
  FTTUSDT: 22.368,
  LTCUSDT: 49.24,
  FLMUSDT: 0.0998,
  RUNEUSDT: 1.418,
  ZECUSDT: 48.65,
  '1000SHIBUSDT': 0.009662,
  AXSUSDT: 10.66,
  BANDUSDT: 1.0276,
  GMTUSDT: 0.5582,
  ETCUSDT: 21.932,
  TRBUSDT: 13.36,
  DOGEBUSD: 0.05718,
  ICPUSDT: 4.855,
  COMPUSDT: 52.7,
  ANCBUSD: 0.0869,
  LINKUSDT: 6.675,
  HBARUSDT: 0.06216,
  XRPUSDT: 0.468,
  ICPBUSD: 4.856,
  BNXUSDT: 154.58,
  RAYUSDT: 0.474,
  LINKBUSD: 6.676,
  DYDXUSDT: 1.409,
  GALABUSD: 0.036483,
  YFIUSDT: 7403,
  BTCUSDT: 18401.3,
  LITUSDT: 0.673,
  SANDUSDT: 0.7249,
  BLZUSDT: 0.07313,
  BNBUSDT: 261.83,
  ADABUSD: 0.3661,
  SOLBUSD: 28.98
}
```
</details>


### .futuresBookTicker():
```js
  let btc_bookTicker = await binance.futuresBookTicker('BTCUSDT');
  console.log(btc_bookTicker);

  // OR
  
  let bookTickers = await binance.futuresBookTicker();
  console.log(bookTickers);
```
<details>
<summary>View Response</summary>

```js
{ // for symbole symbol
  symbol: 'BTCUSDT',
  bidPrice: 18414.8,
  bidQty: 4.629,
  askPrice: 18414.9,
  askQty: 24.508,
  time: 1665673452329
}

[ // for ALL symbols
  {
    symbol: 'BTCUSDT',
    bidPrice: 18419.9,
    bidQty: 52.445,
    askPrice: 18420,
    askQty: 1.158,
    time: 1665673489281
  },
  {
    symbol: 'ETHUSDT',
    bidPrice: 1222.39,
    bidQty: 167.099,
    askPrice: 1222.4,
    askQty: 0.328,
    time: 1665673489282
  },
  {
    symbol: 'BCHUSDT',
    bidPrice: 104.78,
    bidQty: 9.298,
    askPrice: 104.79,
    askQty: 0.701,
    time: 1665673489273
  },
  ...
]
```
</details>


### .futuresOpenInterest():
```js
  let BTCUSDT_openInterest = await binance.futuresOpenInterest('BTCUSDT');
  console.log(BTCUSDT_openInterest)
```
<details>
<summary>View Response</summary>

```js
{ 
  symbol: 'BTCUSDT', 
  openInterest: 157039.639, 
  time: 1665673573719
}
```
</details>


### .futuresOpenInterestStatistics():
```js
  let openInterestStats_BTCUSDT = await binance.futuresOpenInterestStatistics('BTCUSDT','5m');
  console.log(openInterestStats_BTCUSDT);
```

<details>
<summary>View Response</summary>

```js
[
  {
    symbol: 'BTCUSDT',
    sumOpenInterest: 157327.707,
    sumOpenInterestValue: '2896695782.24412300',
    timestamp: 1665672900000
  },
  {
    symbol: 'BTCUSDT',
    sumOpenInterest: 157287.549,
    sumOpenInterestValue: '2895195079.41137270',
    timestamp: 1665673200000
  },
  {
    symbol: 'BTCUSDT',
    sumOpenInterest: 157214.985,
    sumOpenInterestValue: '2896544605.13850000',
    timestamp: 1665673500000
  },
  ...
]
```
</details>


### .futuresTopLongShortAccountRatio():
```js
  let topLongShortAccountRatio_BTC = await binance.futuresTopLongShortAccountRatio('BTCUSDT','5m');
  console.log(topLongShortAccountRatio_BTC);
```
<details>
<summary>View Response</summary>

```js
[
  {
    symbol: 'BTCUSDT',
    longAccount: 0.757,
    longShortRatio: 3.1152,
    shortAccount: 0.243,
    timestamp: 1665673200000
  },
  {
    symbol: 'BTCUSDT',
    longAccount: 0.7557,
    longShortRatio: 3.0933,
    shortAccount: 0.2443,
    timestamp: 1665673500000
  },
  {
    symbol: 'BTCUSDT',
    longAccount: 0.755,
    longShortRatio: 3.0816,
    shortAccount: 0.245,
    timestamp: 1665673800000
  },
  ...
]
```
</details>


### .futuresTopLongShortPositionRatio():
```js
  let topLongShortPositionRatio_BTC = await binance.futuresTopLongShortPositionRatio('BTCUSDT','5m');
  console.log(topLongShortPositionRatio_BTC);
```
<details>
<summary>View Response</summary>

```js
[
  {
    symbol: 'BTCUSDT',
    longAccount: 0.5474,
    longShortRatio: 1.2096,
    shortAccount: 0.4526,
    timestamp: 1665672900000
  },
  {
    symbol: 'BTCUSDT',
    longAccount: 0.5475,
    longShortRatio: 1.2099,
    shortAccount: 0.4525,
    timestamp: 1665673200000
  },
  {
    symbol: 'BTCUSDT',
    longAccount: 0.5477,
    longShortRatio: 1.2108,
    shortAccount: 0.4523,
    timestamp: 1665673500000
  },
  ...
]
```
</details>


### .futuresGlobalLongShortAccountRatio():
```js
  let globalLongShortAccountRatio = await binance.futuresGlobalLongShortAccountRatio('BTCUSDT', '5m');
  console.log(globalLongShortAccountRatio)
```
<details>
<summary>View Response</summary>

```js
[
  {
    symbol: 'BTCUSDT',
    longAccount: 0.7727,
    longShortRatio: 3.3995,
    shortAccount: 0.2273,
    timestamp: 1665673200000
  },
  {
    symbol: 'BTCUSDT',
    longAccount: 0.7716,
    longShortRatio: 3.3783,
    shortAccount: 0.2284,
    timestamp: 1665673500000
  },
  {
    symbol: 'BTCUSDT',
    longAccount: 0.7753,
    longShortRatio: 3.4504,
    shortAccount: 0.2247,
    timestamp: 1665673800000
  },
  ...
]
```
</details>


### .futuresTakerLongShortRatio():
```js
  let takerLongShortRatio = await binance.futuresTakerLongShortRatio('BTCUSDT','5m');
  console.log(takerLongShortRatio);
```
<details>
<summary>View Response</summary>

```js
[
  {
    buySellRatio: 0.9968,
    sellVol: 1111.974,
    buyVol: 1108.438,
    timestamp: 1665673200000
  },
  {
    buySellRatio: 1.4123,
    sellVol: 3994.784,
    buyVol: 5641.728,
    timestamp: 1665673500000
  },
  {
    buySellRatio: 1.3328,
    sellVol: 4259.732,
    buyVol: 5677.406,
    timestamp: 1665673800000
  }
]
```
</details>


### .futuresBLVTCandlesticks():
```js
  let BLVTCandlesticks = await binance.futuresBLVTCandlesticks('BTCUP', '5m');
  console.log(BLVTCandlesticks);
```
<details>
<summary>View Response</summary>

```js
[
  {
    open_time: 1665804900000,
    open: 3.76141354,
    high: 3.76241238,
    low: 3.75766791,
    close: 3.75791761,
    real_leverage: 1.82063595,
    close_time: 1665805199999,
    ignore: 0,
    NAV_updates_count: 542
  },
  {
    open_time: 1665805200000,
    open: 3.75791761,
    high: 3.76241238,
    low: 3.75748954,
    close: 3.76034336,
    real_leverage: 1.82010657,
    close_time: 1665805499999,
    ignore: 0,
    NAV_updates_count: 543
  },
  {
    open_time: 1665805500000,
    open: 3.76034336,
    high: 3.76034336,
    low: 3.75816732,
    close: 3.75816732,
    real_leverage: 1.82058143,
    close_time: 1665805799999,
    ignore: 0,
    NAV_updates_count: 543
  },
  ...
]
```
</details>


### .futuresIndexInfo():
```js
  let indexInfo = await binance.futuresIndexInfo('DEFIUSDT');
  console.log(indexInfo);
```
<details>
<summary>View Response</summary>

```js
{
  symbol: 'DEFIUSDT',
  time: 1665806723000,
  component: 'baseAsset',
  baseAssetList: [
    {
      baseAsset: '1INCH',
      quoteAsset: 'USDT',
      weightInQuantity: 43.6850196,
      weightInPercentage: 0.038948
    },
    {
      baseAsset: 'AAVE',
      quoteAsset: 'USDT',
      weightInQuantity: 0.42680104,
      weightInPercentage: 0.04676
    },
    {
      baseAsset: 'ALGO',
      quoteAsset: 'USDT',
      weightInQuantity: 139.31950896,
      weightInPercentage: 0.066682
    },
    {
      baseAsset: 'ALPHA',
      quoteAsset: 'USDT',
      weightInQuantity: 101.78411435,
      weightInPercentage: 0.017368
    },
    ...
  ]
}
```
</details>

OR

```js
  let indexInfo = await binance.futuresIndexInfo();
  console.log(indexInfo);
```
<details>
<summary>View Response</summary>

```js
[
  {
    symbol: 'METAVERSEUSDT',
    time: 1665806857006,
    component: 'baseAsset',
    baseAssetList: [
      {
       baseAsset: 'ALICE',
        quoteAsset: 'USDT',
        weightInQuantity: 7.42311532,
       weightInPercentage: 0.011794
     },
     {
        baseAsset: 'AXS',
       quoteAsset: 'USDT',
        weightInQuantity: 20.53368238,
        weightInPercentage: 0.238923
     },
     {
       baseAsset: 'GALA',
        quoteAsset: 'USDT',
       weightInQuantity: 1697.67830568,
        weightInPercentage: 0.067185
      },
      {
       baseAsset: 'GMT',
        quoteAsset: 'USDT',
        weightInQuantity: 147.45888153,
        weightInPercentage: 0.093047
      },
     {
       baseAsset: 'MANA',
       quoteAsset: 'USDT',
       weightInQuantity: 453.93653119,
       weightInPercentage: 0.297873
     },
     {
       baseAsset: 'SAND',
       quoteAsset: 'USDT',
       weightInQuantity: 369.17874218,
       weightInPercentage: 0.291179
     }
   ]
  },
  {
    symbol: 'INFRAUSDT',
    time: 1665806945005,
    component: 'baseAsset',
    baseAssetList: [
      {
        baseAsset: 'ANKR',
        quoteAsset: 'USDT',
        weightInQuantity: 6230.2814769,
       weightInPercentage: 0.177368
      },
      {
       baseAsset: 'CTK',
        quoteAsset: 'USDT',
        weightInQuantity: 54.2498447,
        weightInPercentage: 0.046215
     },
      {
        baseAsset: 'CVC',
       quoteAsset: 'USDT',
       weightInQuantity: 646.95340264,
       weightInPercentage: 0.079766
     },
     {
       baseAsset: 'DENT',
       quoteAsset: 'USDT',
       weightInQuantity: 64618.64765845,
       weightInPercentage: 0.05758
      },
      {
        baseAsset: 'GAL',
        quoteAsset: 'USDT',
        weightInQuantity: 22.93084918,
       weightInPercentage: 0.05566
      },
      {
        baseAsset: 'GTC',
        quoteAsset: 'USDT',
        weightInQuantity: 9.24650591,
       weightInPercentage: 0.015633
     },
     {
       baseAsset: 'HNT',
       quoteAsset: 'USDT',
       weightInQuantity: 79.38445084,
       weightInPercentage: 0.367425
     },
     {
       baseAsset: 'JASMY',
        quoteAsset: 'USDT',
       weightInQuantity: 3085.9019791,
       weightInPercentage: 0.017441
     },
     {
       baseAsset: 'LPT',
       quoteAsset: 'USDT',
       weightInQuantity: 16.02965753,
       weightInPercentage: 0.14373
     },
     {
       baseAsset: 'NKN',
       quoteAsset: 'USDT',
       weightInQuantity: 453.84938228,
       weightInPercentage: 0.039181
     }
   ]
  },
  {
    symbol: 'LAYER1USDT',
    time: 1665807025000,
    component: 'baseAsset',
    baseAssetList: [
      {
        baseAsset: 'ADA',
        quoteAsset: 'USDT',
        weightInQuantity: 156.40317095,
        weightInPercentage: 0.061916
      },
      ...
    ]
  },
  {
    symbol: 'DEXUSDT',
    time: 1665807086002,
    component: 'baseAsset',
    baseAssetList: [
      ...
    ]
  },
  {
    symbol: 'STORAGEUSDT',
    ...
  },
  ...
]
```
</details>


### .futuresMultiAssetModeIndex():
```js
  let multiAssetModeIndex = await binance.futuresMultiAssetModeIndex('ADAUSD');
  console.log(multiAssetModeIndex)
```
<details>
<summary>View Response</summary>

```js
{
  symbol: 'ADAUSD',
  time: 1665807232009,
  index: 0.3685843,
  bidBuffer: 0.1,
  askBuffer: 0.1,
  bidRate: 0.33172587,
  askRate: 0.40544273,
  autoExchangeBidBuffer: 0.05,
  autoExchangeAskBuffer: 0.05,
  autoExchangeBidRate: 0.35015508,
  autoExchangeAskRate: 0.38701351
}
```
</details>

OR

```js
  let multiAssetModeIndex = await binance.futuresMultiAssetModeIndex();
  console.log(multiAssetModeIndex)
```
<details>
<summary>View Response</summary>

```js
[
  {
    symbol: 'ADAUSD',
    time: 1665807334012,
    index: 0.36855,
    bidBuffer: 0.1,
    askBuffer: 0.1,
    bidRate: 0.331695,
    askRate: 0.405405,
    autoExchangeBidBuffer: 0.05,
    autoExchangeAskBuffer: 0.05,
    autoExchangeBidRate: 0.3501225,
    autoExchangeAskRate: 0.3869775
  },
  {
    symbol: 'USDTUSD',
    time: 1665807334012,
    index: 1.000075,
    bidBuffer: 0.0001,
    askBuffer: 0.0001,
    bidRate: 0.99997499,
    askRate: 1.00017501,
    autoExchangeBidBuffer: 0.0001,
    autoExchangeAskBuffer: 0.0001,
    autoExchangeBidRate: 0.99997499,
    autoExchangeAskRate: 1.00017501
  },
  {
    symbol: 'XRPUSD',
    time: 1665807334012,
    index: 0.48776458,
    bidBuffer: 0.1,
    askBuffer: 0.1,
    bidRate: 0.43898812,
    askRate: 0.53654104,
    autoExchangeBidBuffer: 0.05,
    autoExchangeAskBuffer: 0.05,
    autoExchangeBidRate: 0.46337635,
    autoExchangeAskRate: 0.51215281
  },
  {
    symbol: 'DOTUSD',
    time: 1665807334012,
    index: 6.06341148,
    bidBuffer: 0.1,
    askBuffer: 0.1,
    bidRate: 5.45707034,
    askRate: 6.66975263,
    autoExchangeBidBuffer: 0.05,
    autoExchangeAskBuffer: 0.05,
    autoExchangeBidRate: 5.76024091,
    autoExchangeAskRate: 6.36658206
  },
  {
    symbol: 'USDCUSD',
    time: 1665807334012,
    index: 1,
    bidBuffer: 0.0001,
    askBuffer: 0.0001,
    bidRate: 0.9999,
    askRate: 1.0001,
    autoExchangeBidBuffer: 0.0001,
    autoExchangeAskBuffer: 0.0001,
    autoExchangeBidRate: 0.9999,
    autoExchangeAskRate: 1.0001
  },
  {
    symbol: 'SOLUSD',
    time: 1665807334012,
    index: 30.12532906,
    bidBuffer: 0.1,
    askBuffer: 0.1,
    bidRate: 27.11279616,
    askRate: 33.13786197,
    autoExchangeBidBuffer: 0.05,
    autoExchangeAskBuffer: 0.05,
    autoExchangeBidRate: 28.61906261,
    autoExchangeAskRate: 31.63159552
  },
  {
    symbol: 'BTCUSD',
    time: 1665807334012,
    index: 19198.02872727,
    bidBuffer: 0.05,
    askBuffer: 0.05,
    bidRate: 18238.12729091,
    askRate: 20157.93016364,
    autoExchangeBidBuffer: 0.025,
    autoExchangeAskBuffer: 0.025,
    autoExchangeBidRate: 18718.07800909,
    autoExchangeAskRate: 19677.97944545
  },
  {
    symbol: 'BNBUSD',
    time: 1665807334012,
    index: 270.51029617,
    bidBuffer: 0.05,
    askBuffer: 0.05,
    bidRate: 256.98478136,
    askRate: 284.03581098,
    autoExchangeBidBuffer: 0.05,
    autoExchangeAskBuffer: 0.05,
    autoExchangeBidRate: 256.98478136,
    autoExchangeAskRate: 284.03581098
  },
  {
    symbol: 'BUSDUSD',
    time: 1665807334012,
    index: 1,
    bidBuffer: 0,
    askBuffer: 0,
    bidRate: 1,
    askRate: 1,
    autoExchangeBidBuffer: 0,
    autoExchangeAskBuffer: 0,
    autoExchangeBidRate: 1,
    autoExchangeAskRate: 1
  },
  {
    symbol: 'ETHUSD',
    time: 1665807334012,
    index: 1299.68023945,
    bidBuffer: 0.05,
    askBuffer: 0.05,
    bidRate: 1234.69622748,
    askRate: 1364.66425143,
    autoExchangeBidBuffer: 0.025,
    autoExchangeAskBuffer: 0.025,
    autoExchangeBidRate: 1267.18823347,
    autoExchangeAskRate: 1332.17224544
  }
]
```
</details>


## **FUTURES ACCOUNT/TRADE DATA**


### .futuresChangePositionSide():
```js
  let turn_ON_HedgeMode = await binance.futuresChangePositionSide(true); // for turning hedgeMode ON
  console.log(turn_ON_HedgeMode);

  // OR

  let turn_OFF_HedgeMode = await binance.futuresChangePositionSide(false); // for turning hedgeMode OFF, or going back to One-Way Mode
  console.log(turn_OFF_HedgeMode);
```
<details>
<summary>View Responses</summary>

```js
{ 
  code: 200,
  msg: 'success' 
}
```
</details>

### .futuresGetPositionSide():
```js
  let positionSide = await binance.futuresGetPositionSide();
  console.log(positionSide);
```
<details>
<summary>View Response</summary>

```js
{ 
  dualSidePosition: false   // for One-Way Mode
}
// OR
{ 
  dualSidePosition: true    // for hedgeMode
}
```
</details>


### .futuresChangeMultiAssetMargin():
```js
  let changeMultiAssetMargin = await binance.futuresChangeMultiAssetMargin();
  console.log(changeMultiAssetMargin);
```
<details>
<summary>View Response</summary>

```js
{
    "code": 200,
    "msg": "success"
}
```
</details>

### .futuresGetMultiAssetMargin():
```js
  let multiAssetMarginMode = await binance.futuresGetMultiAssetMargin();
  console.log(multiAssetMarginMode)
```
<details>
<summary>View Response</summary>

```js
{
    "multiAssetsMargin": true // Multi-Assets Mode
}

OR

{
    "multiAssetsMargin": true // Single-Asset Mode
}
```
</details>


### .futuresConvertToQuantity():
This function is used to convert USDT or BUSD size into the quantity that you need for new Orders.
It also respects the quantityPrecision rules:
```js
  UDST_Margin = 10;   // BTCUSDT current price => 19340
  leverage = 25;      // totalSize => 250USDT
                      // Normal  calculations would return a quantity of '0.01292658' => will immediately be rejected by binance for precision error
  let quantity = await binance.futuresConvertToQuantity('BTCUSDT', USDT_Margin, leverage);  // leverage is optional, instead you can ommit it and use the total Notional size of your order
  if(quantity.error) {
    // handle error here, error might be internet disconnection, invalid symbol, or that your order doesn't fit binance's positionSize rules
    return;
  }
  // quantity of value '0' will now show up as an error
  console.log(quantity);  // => valid quantity would be 0.012, as BTCUSDT has a pricePrecision of 3
```
```js
  0.012
```


### .futuresMarketBuy():
<a href='#rules-for-futuresmarketbuyingselling'><sup>hedgeMode rules</sup></a>

```js
  let BTC_marketBuy_Order = await binance.futuresMarketBuy('BTCUSDT', 0.001);
  console.log(BTC_marketBuy_Order)

  let BTC_marketBuy_Order_hedgeMode = await binance.futuresMarketBuy('BTCUSDT', 0.001, { positionSide: 'LONG' }); // it is recommended to keep 'positionSide' as an options parameter even if you are in One-Way mode, the library will strip it if your account isn't on hedgeMode
  console.log(BTC_marketBuy_Order_hedgeMode);                                                     //or 'SHORT'
```
<details>
<summary>View Response</summary>

```js
{
  orderId: 83829581691,
  symbol: 'BTCUSDT',
  status: 'FILLED',
  clientOrderId: 'st6qVCSDtI5ZUCzEKNmytR',
  price: 0,
  avgPrice: 19179.2,
  origQty: 0.001,
  executedQty: 0.001,
  cumQty: 0.001,
  cumQuote: 19.1792,
  timeInForce: 'GTC',
  type: 'MARKET',
  reduceOnly: false,
  closePosition: false,
  side: 'BUY',
  positionSide: 'BOTH',  // "BOTH" indicating One-Way Mode
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'MARKET',
  updateTime: 1665809228639
}

// OR

{
  orderId: 83829581691,
  symbol: 'BTCUSDT',
  status: 'FILLED',
  clientOrderId: 'st6qVCSDtI5ZUCzEKNmytR',
  price: 0,
  avgPrice: 19179.2,
  origQty: 0.001,
  executedQty: 0.001,
  cumQty: 0.001,
  cumQuote: 19.1792,
  timeInForce: 'GTC',
  type: 'MARKET',
  reduceOnly: false,
  closePosition: false,
  side: 'BUY',          
  positionSide: 'LONG', // "LONG" indicating hedgeMode is enabled and that it is of side 'LONG'
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'MARKET',
  updateTime: 1665809228639
}

// OR

{
  orderId: 84110202517,
  symbol: 'BTCUSDT',
  status: 'FILLED',
  clientOrderId: 'k2aN6vP9HtDGnkzvlHorjR',
  price: 0,
  avgPrice: 19105.6,
  origQty: 0.001,
  executedQty: 0.001,
  cumQty: 0.001,
  cumQuote: 19.1056,
  timeInForce: 'GTC',
  type: 'MARKET',
  reduceOnly: false,
  closePosition: false,
  side: 'SELL',
  positionSide: 'SHORT', // "SHORT" indicating hedgeMode is enabled and that it is of side 'SHORT'
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'MARKET',
  updateTime: 1665931149668
}
```
</details>


### .futuresMarketSell():
<a href='#rules-for-futuresmarketbuyingselling'><sup>hedgeMode rules</sup></a>

```js
  let BTC_Sell_Order = await binance.futuresMarketSell('BTCUSDT', 0.001);
  console.log(BTC_marketSell_Order)

  let BTC_Sell_Order = await binance.futuresMarketSell('BTCUSDT', 0.001, { positionSide: 'SHORT' }); // it is recommended to keep 'positionSide' as an options parameter even if you are in One-Way mode, the library will strip it if your account isn't on hedgeMode
  console.log(BTC_marketSell_Order)
```
<details>
<summary>View Response</summary>

```js
{
  orderId: 83829607925,
  symbol: 'BTCUSDT',
  status: 'FILLED',
  clientOrderId: 'cZv8BU3LDB6uCsWQjfZ6Va',
  price: 0,
  avgPrice: 19179,
  origQty: 0.001,
  executedQty: 0.001,
  cumQty: 0.001,
  cumQuote: 19.179,
  timeInForce: 'GTC',
  type: 'MARKET',
  reduceOnly: false,
  closePosition: false,
  side: 'SELL',         // 'SELLING' BTCUSDT
  positionSide: 'BOTH', // <= "BOTH": One-Way Mode, and since I'm "SELLING" into it, I opened a SHORT position on BTCUSDT <==> and if you had a long position open on BTCUSDT, Selling into it means you are closing 0.001BTCUSDT of this position (and it will turn into a short position if you had a LONG position open on less than 0.001BTCUSDT)
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'MARKET',
  updateTime: 1665809241565
}

// OR

{
  orderId: 83829581691,
  symbol: 'BTCUSDT',
  status: 'FILLED',
  clientOrderId: 'st6qVCSDtI5ZUCzEKNmytR',
  price: 0,
  avgPrice: 19179.2,
  origQty: 0.001,
  executedQty: 0.001,
  cumQty: 0.001,
  cumQuote: 19.1792,
  timeInForce: 'GTC',
  type: 'MARKET',
  reduceOnly: false,
  closePosition: false,
  side: 'SELL',          // 'SELLING' BTCUSDT
  positionSide: 'SHORT', // <= "SHORT": hedgeMode, and since I'm 'SELLING' BTCUSDT, I closed a SHORT position on BTCUSDT
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'MARKET',
  updateTime: 1665809228639
}
```
</details>


### .futuresBuy():
<a href='#rules-for-futuresmarketbuyingselling'><sup>hedgeMode rules</sup></a>

```js
  // BTC price currently at 19xxx.x
  let order = await binance.futuresBuy('BTCUSDT', 0.001, 18000, { positionSide: 'LONG' });  // current BTCUSDT price is 19xxx.x, so the limit order won't trigger
  console.log(order);
```
<details>
<summary>View Response</summary>

```js
{
  orderId: 83913355604,
  symbol: 'BTCUSDT',
  status: 'NEW',
  clientOrderId: 'kcg5WNwhBDkdEXvwzdbtcO',
  price: 18000,
  avgPrice: 0,
  origQty: 0.003,
  executedQty: 0,
  cumQty: 0,
  cumQuote: 0,
  timeInForce: 'GTC',
  type: 'LIMIT',
  reduceOnly: false,
  closePosition: false,
  side: 'BUY',
  positionSide: 'BOTH',
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'LIMIT',
  updateTime: 1665844166659
}
```
</details>


### .futuresSell():
<a href='#rules-for-futuresmarketbuyingselling'><sup>hedgeMode rules</sup></a>

```js
  // BTC price currently at 19xxx.x
  let order = await binance.futuresSell('BTCUSDT', 0.001, 20000, { positionSide: 'LONG' });  // current BTCUSDT price is 19xxx.x, so the limit order won't trigger
  console.log(order);
```
<details>
<summary>View Response</summary>

```js
{
  orderId: 83913415163,
  symbol: 'BTCUSDT',
  status: 'NEW',
  clientOrderId: 'dllor2nUwUnNo408IeJRld',
  price: 20000,
  avgPrice: 0,
  origQty: 0.003,
  executedQty: 0,
  cumQty: 0,
  cumQuote: 0,
  timeInForce: 'GTC',
  type: 'LIMIT',
  reduceOnly: false,
  closePosition: false,
  side: 'SELL',
  positionSide: 'BOTH',
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'LIMIT',
  updateTime: 1665844193051
}
```
</details>


#### Rules for futuresMarketBuying/Selling:
```js
  // SAME RULES FOR .futuresBuy()/futuresSell() and futuresCreateOrder()

  // FOR One-Way Mode \

  .futuresMarketBuy()   => OPENS position or increases your LONG position if no prior SHORT position is open.
  .futuresMarketBuy()   => DECREASES your SHORT position *OR* CLOSES it if quantity is same *OR* CLOSES and opens a LONG position if quantity is higher than the SHORT position quantity

  .futuresMarketSell()  => OPENS position or increases your SHORT position if no prior LONG position is open.
  .futuresMarketSell()  => DECREASES your LONG position *OR* CLOSES it if quantity is same *OR* CLOSES and opens a SHORT position if quantity is higher than the LONG position quantity

  // FOR One-Way Mode /

  //

  // FOR hedgeMode \

    // for positionSide "LONG" \
    .futuresMarketBuy()   => OPENS a position or increases your LONG position no matter if you have a SHORT position or not.
    .futuresMarketSell()  => CLOSES or DECREASES your LONG position *OR* REJECTS it if there are no LONG positions open.
    // for positionSide "LONG" /


    // for positionSide "SHORT" \
    .futuresMarketBuy()   => CLOSES a position your SHORT position  *OR* REJECTS it if there are no SHORT positions open.
    .futuresMarketSell()  => OPENS or increases your SHORT position no matter if you have a LONG position or not.
    // for positionSide "SHORT" /

  // FOR hedgeMode /
```


### .futuresTakeProfit():
<a href='#Rules-for-TPSL'><sup>TP/SL rules</sup></a>

```js
  // current BTCUSDT price: 19xxx.x

  // for LONG positions \
  let TP_reduce = await binance.futuresTakeProfit('BTCUSDT', 'SELL', 20000, 0.001); => will reduce position at 20000 by 0.001BTC
  let TP_close = await binance.futuresTakeProfit('BTCUSDT', 'SELL', 20000);         => will sell the position at 20000
  // for LONG positions /

  // for SHORT positions \
  let TP_reduce = await binance.futuresTakeProfit('BTCUSDT', 'BUY', 18000, 0.001);  => will reduce position at 18000 by 0.001BTC
  let TP_close = await binance.futuresTakeProfit('BTCUSDT', 'BUY', 18000);          => will sell the position at 20000
  // for SHORT positions /


  // for hedgeMode

  // for LONG positions \

  let TP_reduce = await binance.futuresTakeProfit('BTCUSDT', 'SELL', 20000, 0.001, {positionSide: 'LONG'}) => will reduce the position at 20000 bt 0.001BTC
  let TP_close = await binance.futuresTakeProfit('BTCUSDT', 'SELL', 20000, false, {positionSide: 'LONG'})  => will close the position at 20000

  let illegal_1 = await binance.futuresTakeProfit('BTCUSDT', 'BUY', 20000, 0.001, {positionSide: 'LONG'}) => futuresTakeProfit for side 'BUY' is illegal and will be rejected
  let illegal_2 = await binance.futuresTakeProfit('BTCUSDT', 'BUY', 20000, false, {positionSide: 'LONG'}) => futuresTakeProfit for side 'BUY' is illegal and will be rejected

  // for LONG positions /

  // for SHORT positions \

  let TP_reduce = await binance.futuresTakeProfit('BTCUSDT', 'BUY', 18000, 0.001, {positionSide: 'SHORT'}) => will reduce the position at 18000 bt 0.001BTC
  let TP_close = await binance.futuresTakeProfit('BTCUSDT', 'BUY', 18000, false, {positionSide: 'SHORT'})  => will close the position at 18000

  let illegal_1 = await binance.futuresTakeProfit('BTCUSDT', 'SELL', 18000, 0.001, {positionSide: 'SHORT'}) => futuresTakeProfit for side 'SELL' is illegal and will be rejected
  let illegal_2 = await binance.futuresTakeProfit('BTCUSDT', 'SELL', 18000, false, {positionSide: 'SHORT'}) => futuresTakeProfit for side 'SELL' is illegal and will be rejected

  // for SHORT positions /
```


### .futuresStopLoss():
<a href='#Rules-for-TPSL'><sup>TP/SL rules</sup></a>

```js
  // for LONG positions \
  let SL_reduce = await binance.futuresStopLoss('BTCUSDT', 'SELL', 18000, 0.001); => will reduce position at 18000 by 0.001BTC
  let SL_close = await binance.futuresStopLoss('BTCUSDT', 'SELL', 18000);         => will sell the position at 18000
  // for LONG positions /

  // for SHORT positions \
  let SL_reduce = await binance.futuresStopLoss('BTCUSDT', 'BUY', 20000, 0.001);  => will reduce position at 20000 by 0.001BTC
  let SL_close = await binance.futuresStopLoss('BTCUSDT', 'BUY', 20000);         => will sell the position at 20000
  // for SHORT positions /


  // for hedgeMode

  // for LONG positions \

  let SL_reduce = await binance.futuresStopLoss('BTCUSDT', 'SELL', 18000, 0.001, {positionSide: 'LONG'}) => will reduce the position at 18000 bt 0.001BTC
  let SL_close = await binance.futuresStopLoss('BTCUSDT', 'SELL', 18000, false, {positionSide: 'LONG'})  => will close the position at 18000

  let illegal_1 = await binance.futuresStopLoss('BTCUSDT', 'BUY', 18000, 0.001, {positionSide: 'LONG'}) => futuresTakeProfit for side 'BUY' is illegal and will be rejected
  let illegal_2 = await binance.futuresStopLoss('BTCUSDT', 'BUY', 18000, false, {positionSide: 'LONG'}) => futuresTakeProfit for side 'BUY' is illegal and will be rejected

  // for LONG positions /

  // for SHORT positions \

  let SL_reduce = await binance.futuresStopLoss('BTCUSDT', 'BUY', 20000, 0.001, {positionSide: 'SHORT'}) => will reduce the position at 18000 bt 0.001BTC
  let SL_close = await binance.futuresStopLoss('BTCUSDT', 'BUY', 20000, false, {positionSide: 'SHORT'})  => will close the position at 18000

  let illegal_1 = await binance.futuresStopLoss('BTCUSDT', 'SELL', 20000, 0.001, {positionSide: 'SHORT'}) => futuresTakeProfit for side 'SELL' is illegal and will be rejected
  let illegal_2 = await binance.futuresStopLoss('BTCUSDT', 'SELL', 20000, false, {positionSide: 'SHORT'}) => futuresTakeProfit for side 'SELL' is illegal and will be rejected

  // for SHORT positions /
```

#### Rules for TP/SL:
```js
  'closePosition=true' can be send with any of those orders, but 'quantity' and 'reduceOnly' should be omitted when doing so.

  // for futuresTakeProfit() \

    // for One-Way Mode \

      if parameter 'side' == 'BUY':   current_price <= stopPrice, if not then it will be rejected

      if parameter 'side' == 'SHORT': current_price >= stopPrice, if not then it will be rejected

    // for One-Way Mode /
    // for hedgeMode \
      
      parameter 'side' == 'BUY' and positionSide as 'LONG' are not allowed
      parameter 'side' == 'SELL' and positionSide as 'LONG' are not allowed

    // for hedgeMode /

  // for futuresTakeProfit() /

  // TODO finish documentation for for futuresStopLoss()
```

### .futuresCreateOrder():
```
  futuresCreateOrder() is your playground of creating orders, the library offers some error messages for some parameters missing, it mostly handles LIMIT orders, TP and SL orders and market orders
  If you are SURE that the library cannot handle some of your more advanced orders, please do raise an issue on github and I will fix the error, my vision is for this function to handle all user errors and help the user set up his order easily (and of course, futuresMarketBuy/Sell, futuresBuy/Sell, and futuresTakeProfit/StopLoss and maybe in the future 'futuresTrailing' use this function as a backbone)
```
#### Mandatory parameters for ALL order requests:
- ***symbol***
- ***side***: *"BUY" or "SELL"*
- ***type***: *"LIMIT", "MARKET", "STOP", "TAKE_PROFIT", "STOP_MARKET", "TAKE_PROFIT_MARKET", "TRAILING_STOP_MARKET"*
  
#### Types of orders that you can use and the parameters that are mandatory for each: 
- ***LIMIT***:	*"timeInForce", "quantity", "price"*
- ***MARKET***: *"quantity"*
- ***STOP/TAKE_PROFIT***: *"quantity", "price", "stopPrice"*
- ***STOP_MARKET/TAKE_PROFIT_MARKET***: *"stopPrice"*
- ***TRAILING_STOP_MARKET***: *"callbackRate"*
  

### .futuresMultipleOrders():
```
  Not yet implemented, the limit on binance's side is 5 orders per batch, I want to make it so that the array of orders passed by the user will be chopped up into groups of 5 and sent to binance
  If you are interested in helping out, please fork this project and make a pull request with the necessary changes (Once .futuresCreateOrder() has all the necessary error checks for all, we can then take the batch, pass it into a duplicate function that ONLY checks for errors and return 'true' if there is no error, and returns 'false' along with the errors which then we can return to the user to fix all his orders)
  Maybe I'm going too far into this whole "checking for errors" thing, but I think it's what I would've wanted when I started using public libraries (we can also have a parameter in the futuresMultipleOrders() function where the user can disable checking for errors)
```


### .futuresOrder():
```js
  let orderId = '83913355604'
  let order1 = await binance.futuresOrder('BTCUSDT', orderId);

  // SAME AS

  let origClientOrderId = 'kcg5WNwhBDkdEXvwzdbtcO';
  let order2 = await binance.futuresOrder('BTCUSDT', false, origClientOrderId);
```
<details>
<summary>View Responses</summary>

```js
order1 =>
{
  orderId: 83913355604,
  symbol: 'BTCUSDT',
  status: 'CANCELED',
  clientOrderId: 'kcg5WNwhBDkdEXvwzdbtcO',
  price: 18000,
  avgPrice: 0,
  origQty: 0.003,
  executedQty: 0,
  cumQuote: 0,
  timeInForce: 'GTC',
  type: 'LIMIT',
  reduceOnly: false,
  closePosition: false,
  side: 'BUY',
  positionSide: 'BOTH',
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'LIMIT',
  time: 1665844166659,
  updateTime: 1665844189280
}

// SAME AS

order2 =>
{
  orderId: 83913355604,
  symbol: 'BTCUSDT',
  status: 'CANCELED',
  clientOrderId: 'kcg5WNwhBDkdEXvwzdbtcO',
  price: 18000,
  avgPrice: 0,
  origQty: 0.003,
  executedQty: 0,
  cumQuote: 0,
  timeInForce: 'GTC',
  type: 'LIMIT',
  reduceOnly: false,
  closePosition: false,
  side: 'BUY',
  positionSide: 'BOTH',
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'LIMIT',
  time: 1665844166659,
  updateTime: 1665844189280
}
```
</details>


### .futuresCancelOrder():
```js
  let orderId = '83913355604'
  let order1 = await binance.futuresOrder('BTCUSDT', orderId);

  let origClientOrderId = 'kcg5WNwhBDkdEXvwzdbtcO'
  let order1 = await binance.futuresOrder('BTCUSDT', false, origClientOrderId);
```
<details>
<summary>View Responses</summary>

```js
{
  orderId: 84237713406,
  symbol: 'BTCUSDT',
  status: 'CANCELED',
  clientOrderId: 'nuasZzBQ2Hry54Kr75Xs9y',
  price: 18000,
  avgPrice: 0,
  origQty: 0.001,
  executedQty: 0,
  cumQty: 0,
  cumQuote: 0,
  timeInForce: 'GTC',
  type: 'LIMIT',
  reduceOnly: false,
  closePosition: false,
  side: 'BUY',
  positionSide: 'BOTH',
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'LIMIT',
  updateTime: 1665977280395
}

// SAME AS

{
  orderId: 84237713406,
  symbol: 'BTCUSDT',
  status: 'CANCELED',
  clientOrderId: 'nuasZzBQ2Hry54Kr75Xs9y',
  price: 18000,
  avgPrice: 0,
  origQty: 0.001,
  executedQty: 0,
  cumQty: 0,
  cumQuote: 0,
  timeInForce: 'GTC',
  type: 'LIMIT',
  reduceOnly: false,
  closePosition: false,
  side: 'BUY',
  positionSide: 'BOTH',
  stopPrice: 0,
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'LIMIT',
  updateTime: 1665977280395
}
```
</details>


### .futuresCancelAll():
```js
  let cancelAllOrder = await binance.futuresCancelAll('BTCUSDT'); // TODO will include a 'cancelAll' for all symbols (not natively supported by binance)
  console.log(cancelAllOrder)
```
<details>
<summary>View Response</summary>

```js
{
    "code": "200", 
    "msg": "The operation of cancel all open order is done."
}
```
</details>


### .futuresCancelBatchOrders():
**Currently not working** // TODO
```js
  let orderIdList = [84237713406, 84237714515, 84237714598]; // TODO current max is 10 orders per request (binance limit), need to support unlimited amount
  let batchOrderIdCancel = await binance.futuresCancelBatchOrders('BTCUSDT', orderIdList);

  let clientOrderIdList = ['kMsiXpzWq91237xX', 'IwnaKlMyslf'];
  let batchClientOrderIdList = await binance.futuresCancelBatchOrders('BTCUSDT', batchClientOrderIdList);
```
<details>
<summary>View Response</summary>

```js
[
    {
        "clientOrderId": "myOrder1",
        "cumQty": "0",
        "cumQuote": "0",
        "executedQty": "0",
        "orderId": 283194212,
        "origQty": "11",
        "origType": "TRAILING_STOP_MARKET",
        "price": "0",
        "reduceOnly": false,
        "side": "BUY",
        "positionSide": "SHORT",
        "status": "CANCELED",
        "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET
        "closePosition": false,   // if Close-All
        "symbol": "BTCUSDT",
        "timeInForce": "GTC",
        "type": "TRAILING_STOP_MARKET",
        "activatePrice": "9020",            // activation price, only returned with TRAILING_STOP_MARKET order
        "priceRate": "0.3",                 // callback rate, only returned with TRAILING_STOP_MARKET order
        "updateTime": 1571110484038,
        "workingType": "CONTRACT_PRICE",
        "priceProtect": false            // if conditional order trigger is protected   
    },
    {
        "code": -2011,
        "msg": "Unknown order sent."
    }
]
```
</details>


### .futuresCountdownCancelAll():
```js
  let countDown = await binance.futuresCountdownCancelAll('BTCUSDT', 60 * 1000); // 60 second countdown, if I want to get the timer to get overridden, I can just send another function with another time (or same time), and the timer will reset to the new time
```


### .futuresOpenOrder():
```js
  let latestOpenOrder = await binance.futuresOpenOrder('BTCUSDT');
  let latestOpenOrder_orderId = await binance.futuresOpenOrder('BTCUSDT', orderId);
  let latestOpenOrder_clientOrderId = await binance.futuresOpenOrder('BTCUSDT', false, origClientOrderId);
```
<details>
<summary>View Response</summary>

```js
  {
    "avgPrice": "0.00000",              
    "clientOrderId": "abc",             
    "cumQuote": "0",                        
    "executedQty": "0",                 
    "orderId": 1917641,                 
    "origQty": "0.40",                      
    "origType": "TRAILING_STOP_MARKET",
    "price": "0",
    "reduceOnly": false,
    "side": "BUY",
    "positionSide": "SHORT",
    "status": "NEW",
    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET
    "closePosition": false,             // if Close-All
    "symbol": "BTCUSDT",
    "time": 1579276756075,              // order time
    "timeInForce": "GTC",
    "type": "TRAILING_STOP_MARKET",
    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order
    "priceRate": "0.3",                 // callback rate, only return with TRAILING_STOP_MARKET order                       
    "updateTime": 1579276756075,        
    "workingType": "CONTRACT_PRICE",
    "priceProtect": false            // if conditional order trigger is protected           
}

// OR

{
  msg: "Order does not exist"
}
```
</details>


### .futuresOpenOrders():
```js
  let allOpenOrders = await binance.futuresOpenOrders();
  let allOpenOrders_BTC = await binance.futuresOpenOrders('BTCUSDT');
```
<details>
<summary>View Response</summary>

```js
[
  {
    "avgPrice": "0.00000",
    "clientOrderId": "abc",
    "cumQuote": "0",
    "executedQty": "0",
    "orderId": 1917641,
    "origQty": "0.40",
    "origType": "TRAILING_STOP_MARKET",
    "price": "0",
    "reduceOnly": false,
    "side": "BUY",
    "positionSide": "SHORT",
    "status": "NEW",
    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET
    "closePosition": false,   // if Close-All
    "symbol": "BTCUSDT",
    "time": 1579276756075,              // order time
    "timeInForce": "GTC",
    "type": "TRAILING_STOP_MARKET",
    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order
    "priceRate": "0.3",                 // callback rate, only return with TRAILING_STOP_MARKET order
    "updateTime": 1579276756075,        // update time
    "workingType": "CONTRACT_PRICE",
    "priceProtect": false            // if conditional order trigger is protected   
  },
  ...
]
```
</details>


### .futuresAllOrders():
```js
  let allOrders = await binance.futuresAllOrders('BTCUSDT', 5);
  console.log(allOrders);
```
<details>
<summary>View Response</summary>

```js
[
  {
    "avgPrice": "0.00000",
    "clientOrderId": "abc",
    "cumQuote": "0",
    "executedQty": "0",
    "orderId": 1917641,
    "origQty": "0.40",
    "origType": "TRAILING_STOP_MARKET",
    "price": "0",
    "reduceOnly": false,
    "side": "BUY",
    "positionSide": "SHORT",
    "status": "NEW",
    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET
    "closePosition": false,   // if Close-All
    "symbol": "BTCUSDT",
    "time": 1579276756075,              // order time
    "timeInForce": "GTC",
    "type": "TRAILING_STOP_MARKET",
    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order
    "priceRate": "0.3",                 // callback rate, only return with TRAILING_STOP_MARKET order
    "updateTime": 1579276756075,        // update time
    "workingType": "CONTRACT_PRICE",
    "priceProtect": false            // if conditional order trigger is protected   
  },
  ...,
  ...,
  ...,
  ....
]
```
</details>


### .futuresBalance():
```js
  let balance = await binance.futuresBalance();
  console.log(balance);
```
<details>
<summary>View Response</summary>

```js
[
    {
        "accountAlias": "SgsR",    // unique account code
        "asset": "USDT",    // asset name
        "balance": "122607.35137903", // wallet balance || OBVIOUSLY not my account
        "crossWalletBalance": "23.72469206", // crossed wallet balance
        "crossUnPnl": "0.00000000"  // unrealized profit of crossed positions
        "availableBalance": "23.72469206",       // available balance
        "maxWithdrawAmount": "23.72469206",     // maximum amount for transfer out
        "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode
        "updateTime": 1617939110373
    },
    ...
]
```
</details>


### .futuresAccount():
```js
  let futuresAccount = await binance.futuresAccount();  // returns usual account info, and an array of account assets and positions (all of them, open and not)
  console.log(futuresAccount);

  // alternatively we can set 'activePositionsOnly' and/or 'activeAssets' parameters as 'true', like the following
  let futuresAccount_activePositionsOnly = await binance.futuresAccount(true);
  let futuresAccount_activeAssetsOnly = await binance.futuresAccount(false, true);
  let futuresAccount_activePositions_activeAssets = await binance.futuresAccount(true, true);
```
<details>
<summary>View Response</summary>

```js
{   
    "feeTier": 0,       // account commission tier 
    "canTrade": true,   // if can trade
    "canDeposit": true,     // if can transfer in asset
    "canWithdraw": true,    // if can transfer out asset
    "updateTime": 0,        // reserved property, please ignore 
    "totalInitialMargin": "0.00000000",    // total initial margin required with current mark price (useless with isolated positions), only for USDT asset
    "totalMaintMargin": "0.00000000",     // total maintenance margin required, only for USDT asset
    "totalWalletBalance": "23.72469206",     // total wallet balance, only for USDT asset
    "totalUnrealizedProfit": "0.00000000",   // total unrealized profit, only for USDT asset
    "totalMarginBalance": "23.72469206",     // total margin balance, only for USDT asset
    "totalPositionInitialMargin": "0.00000000",    // initial margin required for positions with current mark price, only for USDT asset
    "totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price, only for USDT asset
    "totalCrossWalletBalance": "23.72469206",      // crossed wallet balance, only for USDT asset
    "totalCrossUnPnl": "0.00000000",      // unrealized profit of crossed positions, only for USDT asset
    "availableBalance": "23.72469206",       // available balance, only for USDT asset
    "maxWithdrawAmount": "23.72469206"     // maximum amount for transfer out, only for USDT asset
    "assets": [
        {
            "asset": "USDT",            // asset name
            "walletBalance": "23.72469206",      // wallet balance
            "unrealizedProfit": "0.00000000",    // unrealized profit
            "marginBalance": "23.72469206",      // margin balance
            "maintMargin": "0.00000000",        // maintenance margin required
            "initialMargin": "0.00000000",    // total initial margin required with current mark price 
            "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price
            "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price
            "crossWalletBalance": "23.72469206",      // crossed wallet balance
            "crossUnPnl": "0.00000000"       // unrealized profit of crossed positions
            "availableBalance": "23.72469206",       // available balance
            "maxWithdrawAmount": "23.72469206",     // maximum amount for transfer out
            "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode
            "updateTime": 1625474304765 // last update time 
        },
        {
            "asset": "BUSD",            // asset name
            "walletBalance": "103.12345678",      // wallet balance
            "unrealizedProfit": "0.00000000",    // unrealized profit
            "marginBalance": "103.12345678",      // margin balance
            "maintMargin": "0.00000000",        // maintenance margin required
            "initialMargin": "0.00000000",    // total initial margin required with current mark price 
            "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price
            "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price
            "crossWalletBalance": "103.12345678",      // crossed wallet balance
            "crossUnPnl": "0.00000000"       // unrealized profit of crossed positions
            "availableBalance": "103.12345678",       // available balance
            "maxWithdrawAmount": "103.12345678",     // maximum amount for transfer out
            "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode
            "updateTime": 1625474304765 // last update time
        },
        ...
    ],
    "positions": [  // positions of all symbols in the market are returned
        // only "BOTH" positions will be returned with One-way mode
        // only "LONG" and "SHORT" positions will be returned with Hedge mode
        {
            "symbol": "BTCUSDT",    // symbol name
            "initialMargin": "0",   // initial margin required with current mark price 
            "maintMargin": "0",     // maintenance margin required
            "unrealizedProfit": "0.00000000",  // unrealized profit
            "positionInitialMargin": "0",      // initial margin required for positions with current mark price
            "openOrderInitialMargin": "0",     // initial margin required for open orders with current mark price
            "leverage": "100",      // current initial leverage
            "isolated": true,       // if the position is isolated
            "entryPrice": "0.00000",    // average entry price
            "maxNotional": "250000",    // maximum available notional with current leverage
            "bidNotional": "0",  // bids notional, ignore
            "askNotional": "0",  // ask notional, ignore
            "positionSide": "BOTH",     // position side
            "positionAmt": "0",         // position amount
            "updateTime": 0           // last update time
        },
        ...
    ]
}
```
</details>


### .futuresLeverage():
```js
  let levResponse = await binance.futuresLeverage('BTCUSDT', 5);
  console.log(levResponse);

  // alternatively, if you do not know the max leverage of a symbol, and are afraid to get your request rejected, use the third parameter 'findHighestWorkingLeverage' as true
  let XRPBUSD_lev = await binance.futuresLeverage('XRPBUSD', 125); // even tho XRPBUSD's max lev is x20
  console.log(XRPBUSD_lev)
```
<details>
<summary>View Response</summary>

```js
{
    "leverage": 5,
    "maxNotionalValue": "50000000",
    "symbol": "BTCUSDT"
}

// and for XRPBUSD
{
    "leverage": 20,
    "maxNotionalValue": "100000",
    "symbol": "XRPBUSD"
}
```
</details>


### .futuresLeverageBrackets():
```js
  let BTC_leverageBrackets = await binance.futuresLeverageBrackets('BTCUSDT');

  let leverageBrackets = await binance.futuresLeverageBrackets();
```
<details>
<summary>View Response</summary>

```js
// BTC_leverageBrackets
{
  symbol: 'BTCUSDT',
  brackets: [
    {
      bracket: 1,
      initialLeverage: 125,
      notionalCap: 50000,
      notionalFloor: 0,
      maintMarginRatio: 0.004,
      cum: 0
    },
    {
      bracket: 2,
      initialLeverage: 100,
      notionalCap: 250000,
      notionalFloor: 50000,
      maintMarginRatio: 0.005,
      cum: 50
    },
    {
      bracket: 3,
      initialLeverage: 50,
      notionalCap: 1000000,
      notionalFloor: 250000,
      maintMarginRatio: 0.01,
      cum: 1300
    },
    {
      bracket: 4,
      initialLeverage: 20,
      notionalCap: 10000000,
      notionalFloor: 1000000,
      maintMarginRatio: 0.025,
      cum: 16300
    },
    {
      bracket: 5,
      initialLeverage: 10,
      notionalCap: 20000000,
      notionalFloor: 10000000,
      maintMarginRatio: 0.05,
      cum: 266300
    },
    {
      bracket: 6,
      initialLeverage: 5,
      notionalCap: 50000000,
      notionalFloor: 20000000,
      maintMarginRatio: 0.1,
      cum: 1266300
    },
    {
      bracket: 7,
      initialLeverage: 4,
      notionalCap: 100000000,
      notionalFloor: 50000000,
      maintMarginRatio: 0.125,
      cum: 2516300
    },
    {
      bracket: 8,
      initialLeverage: 3,
      notionalCap: 200000000,
      notionalFloor: 100000000,
      maintMarginRatio: 0.15,
      cum: 5016300
    },
    {
      bracket: 9,
      initialLeverage: 2,
      notionalCap: 300000000,
      notionalFloor: 200000000,
      maintMarginRatio: 0.25,
      cum: 25016300
    },
    {
      bracket: 10,
      initialLeverage: 1,
      notionalCap: '9223372036854776000',
      notionalFloor: 300000000,
      maintMarginRatio: 0.5,
      cum: 100016300
    }
  ]
}


// for ALL leverage Brackets => it returns a map of the objects
{
  "BTCUSDT": {
    symbol: "BTCUSDT",
    brackets: [
      ...,
      ...
    ] 
  },

  "ETHUSDT": {
    symbol: "ETHUSDT",
    brackets: [
      ...,
      ...
    ]
  },
  "XRPBUSD": ...,
  ...,
  ...
}
```
</details>


### .futuresMarginType():
```js
  let changeMarginToISO = await binance.futuresMarginType('BTCUSDT', 'ISOLATED');

  let changeMarginToCROSS = await binance.futuresMarginType('XRPBUSD', 'CROSSED');
```
<details>
<summary>View Response</summary>

```js
{
    "code": 200,
    "msg": "success"
}

// and

{
    "code": 200,
    "msg": "success"
}
```
</details>


### .futuresPositionMargin():
```js
  let increasePositionMargin = await binance.futuresPositionMargin('BTCUSDT', 0.002, 1); // '1' for 'increase': could also be 'ADD', 'INCREASE' or 'BUY'

  let reducePositionMargin = await binance.futuresPositionMargin('BTCUSDT', 0.001, 2); // '2' for decrease: could also be 'REDUCE' or 'SELL'
```
<details>
<summary>View Response</summary>

```js
{ // for INCREASE
    "amount": 0.002,
    "code": 200,
    "msg": "Successfully modify position margin.",
    "type": 1
}

{ // for DECREASE
    "amount": 0.001,
    "code": 200,
    "msg": "Successfully modify position margin.",
    "type": 2
}
```
</details>


### .futuresPositionMarginHistory():
```js
  let positionMarginHistory = await binance.futuresPositionMarginHistory('BTCUSDT', 5);  // returns both INCREASE and DECREASE history
  let positionMarginHistory = await binance.futuresPositionMarginHistory('BTCUSDT', 5, 1); // '1' for 'increase': could also be 'ADD', 'INCREASE' or 'BUY'
  let positionMarginHistory = await binance.futuresPositionMarginHistory('BTCUSDT', 5, 2); // '2' for decrease: could also be 'REDUCE' or 'SELL'
```
<details>
<summary>View Response</summary>

```js
[
    {
        "amount": "23.36332311",
        "asset": "USDT",
        "symbol": "BTCUSDT",
        "time": 1578047897183,
        "type": 1,
        "positionSide": "BOTH"
    },
    {
        "amount": "100",
        "asset": "USDT",
        "symbol": "BTCUSDT",
        "time": 1578047900425,
        "type": 1,
        "positionSide": "LONG"
    },
    ...
]
```
</details>


### .futuresPositionRisk():
```js
  let BTC_positions = await binance.futuresPositionRisk('BTCUSDT');
  console.log(BTC_positions);

  // OR

  let allPositions = await binance.futuresPositionRisk();
  console.log(allPositions);
```
<details>
<summary>View Response</summary>

```js
// for One-Way Mode:
[
    {
        "entryPrice": "0.00000",
        "marginType": "isolated", 
        "isAutoAddMargin": "false",
        "isolatedMargin": "0.00000000", 
        "leverage": "10", 
        "liquidationPrice": "0", 
        "markPrice": "6679.50671178",   
        "maxNotionalValue": "20000000", 
        "positionAmt": "0.000",
        "notional": "0",, 
        "isolatedWallet": "0",
        "symbol": "BTCUSDT", 
        "unRealizedProfit": "0.00000000", 
        "positionSide": "BOTH",
        "updateTime": 0
    }
]

// for hedgeMode:
[
    {
        "symbol": "BTCUSDT",
        "positionAmt": "0.001",
        "entryPrice": "22185.2",
        "markPrice": "21123.05052574",
        "unRealizedProfit": "-1.06214947",
        "liquidationPrice": "19731.45529116",
        "leverage": "4",
        "maxNotionalValue": "100000000",
        "marginType": "cross",
        "isolatedMargin": "0.00000000",
        "isAutoAddMargin": "false",
        "positionSide": "LONG",
        "notional": "21.12305052",
        "isolatedWallet": "0",
        "updateTime": 1655217461579
    },
    {
        "symbol": "BTCUSDT",
        "positionAmt": "0.000",
        "entryPrice": "0.0",
        "markPrice": "21123.05052574",
        "unRealizedProfit": "0.00000000",
        "liquidationPrice": "0",
        "leverage": "4",
        "maxNotionalValue": "100000000",
        "marginType": "cross",
        "isolatedMargin": "0.00000000",
        "isAutoAddMargin": "false",
        "positionSide": "SHORT",
        "notional": "0",
        "isolatedWallet": "0",
        "updateTime": 0
    }
]

// for allOpenPositions
[
    {
        "entryPrice": "0.00000",
        "marginType": "isolated", 
        "isAutoAddMargin": "false",
        "isolatedMargin": "0.00000000", 
        "leverage": "10", 
        "liquidationPrice": "0", 
        "markPrice": "6679.50671178",   
        "maxNotionalValue": "20000000", 
        "positionAmt": "0.000",
        "notional": "0",, 
        "isolatedWallet": "0",
        "symbol": "BTCUSDT", 
        "unRealizedProfit": "0.00000000", 
        "positionSide": "BOTH",
        "updateTime": 0
    },
    {
        "entryPrice": "0.00000",
        "marginType": "isolated", 
        "isAutoAddMargin": "false",
        "isolatedMargin": "0.00000000", 
        "leverage": "10", 
        "liquidationPrice": "0", 
        "markPrice": "1400.50671178",   
        "maxNotionalValue": "20000000", 
        "positionAmt": "0.000",
        "notional": "0",, 
        "isolatedWallet": "0",
        "symbol": "ETHUSDT", 
        "unRealizedProfit": "2.41424600", 
        "positionSide": "BOTH",
        "updateTime": 0
    },
    {
      "symbol": "XRPUSDT",
      ...
    },
    ...
]
```
</details>


### .futuresOpenPositions():
```js
  // same as .futuresPositionRisk(), but returns only the OPEN positions
  let openBTC_positions = await binance.futuresOpenPositions('BTCUSDT');
  console.log(openBTC_positions);

  // OR

  let allOpenPositions = await binance.futuresOpenPositions();
  console.log(allOpenPositions);

  // alternatively, you can check if there are or aren't positions open via .length
  if(openBTC_positions.length != 0) {
    // do something knowing you have an OPEN BTC position
  }

  if(allOpenPositions.length != 0) {
    // do something knowing you have at least 1 open position, like for example
    allOpenPositions.forEach(position => {
      console.log(position);  // here it iterates over each position
    })
  }
```
<details>
<summary>View Response</summary>

```js
[] // empty for no positions open

// and of course, not empty for when there are positions open
[
  {
        "symbol": "BTCUSDT",
        "positionAmt": "0.001",
        "entryPrice": "22185.2",
        "markPrice": "21123.05052574",
        "unRealizedProfit": "-1.06214947",
        "liquidationPrice": "19731.45529116",
        "leverage": "4",
        "maxNotionalValue": "100000000",
        "marginType": "cross",
        "isolatedMargin": "0.00000000",
        "isAutoAddMargin": "false",
        "positionSide": "LONG",
        "notional": "21.12305052",
        "isolatedWallet": "0",
        "updateTime": 1655217461579
    }
]
```
</details>


### .futuresUserTrades():
```js
  let last_5_BTC_Trades = await binance.futuresUserTrades('BTCUSDT', 5);
  console.log(last_5_BTC_Trades)
```
<details>
<summary>View Response</summary>

```js
  [
  {
    symbol: 'BTCUSDT',
    id: 2961149985,
    orderId: 84194677836,
    side: 'BUY',
    price: 19274.1,
    qty: 0.004,
    realizedPnl: -0.0508,
    marginAsset: 'USDT',
    quoteQty: 77.0964,
    commission: 0.03083856,
    commissionAsset: 'USDT',
    time: 1665961810765,
    positionSide: 'BOTH',
    buyer: true,
    maker: false
  },
  {
    symbol: 'BTCUSDT',
    id: 2961150750,
    orderId: 84194766995,
    side: 'BUY',
    price: 19279.2,
    qty: 0.004,
    realizedPnl: 0,
    marginAsset: 'USDT',
    quoteQty: 77.1168,
    commission: 0.03084672,
    commissionAsset: 'USDT',
    time: 1665961837679,
    positionSide: 'BOTH',
    buyer: true,
    maker: false
  },
  {
    symbol: 'BTCUSDT',
    id: 2961151059,
    orderId: 84194809331,
    side: 'SELL',
    price: 19279.6,
    qty: 0.001,
    realizedPnl: 0.0004,
    marginAsset: 'USDT',
    quoteQty: 19.2796,
    commission: 0.00771184,
    commissionAsset: 'USDT',
    time: 1665961847666,
    positionSide: 'BOTH',
    buyer: false,
    maker: false
  },
  {
    symbol: 'BTCUSDT',
    id: 2961151060,
    orderId: 84194809331,
    side: 'SELL',
    price: 19279.6,
    qty: 0.001,
    realizedPnl: 0.0004,
    marginAsset: 'USDT',
    quoteQty: 19.2796,
    commission: 0.00771184,
    commissionAsset: 'USDT',
    time: 1665961847666,
    positionSide: 'BOTH',
    buyer: false,
    maker: false
  },
  {
    symbol: 'BTCUSDT',
    id: 2961151061,
    orderId: 84194809331,
    side: 'SELL',
    price: 19279.6,
    qty: 0.002,
    realizedPnl: 0.0008,
    marginAsset: 'USDT',
    quoteQty: 38.5592,
    commission: 0.01542368,
    commissionAsset: 'USDT',
    time: 1665961847666,
    positionSide: 'BOTH',
    buyer: false,
    maker: false
  }
]
```
</details>


### .futuresIncomeHistory():
```js
  let last_2_BTC_income_histories = await binance.futuresIncomeHistory('BTCUSDT', 2);

  let last_5_income_histories = await binance.futuresIncomeHistory(false, 5);
```
<details>
<summary>View Response</summary>

```js
[
  {
    symbol: 'BTCUSDT',
    incomeType: 'REALIZED_PNL',
    income: 0.0008,
    asset: 'USDT',
    time: 1665961847000,
    info: 2961151061,
    tranId: 900302961151061,
    tradeId: -1333816235
  },
  {
    symbol: 'BTCUSDT',
    incomeType: 'COMMISSION',
    income: -0.01542368,
    asset: 'USDT',
    time: 1665961847000,
    info: 2961151061,
    tranId: 900302961151061,
    tradeId: -1333816235
  }
]

// and for all

[
  {
    symbol: 'BTCUSDT',
    incomeType: 'COMMISSION',
    income: -0.00771184,
    asset: 'USDT',
    time: 1665961847000,
    info: 2961151059,
    tranId: 900302961151059,
    tradeId: -1333816237
  },
  {
    symbol: 'BTCUSDT',
    incomeType: 'REALIZED_PNL',
    income: 0.0004,
    asset: 'USDT',
    time: 1665961847000,
    info: 2961151060,
    tranId: 900302961151060,
    tradeId: -1333816236
  },
  {
    symbol: 'BTCUSDT',
    incomeType: 'COMMISSION',
    income: -0.00771184,
    asset: 'USDT',
    time: 1665961847000,
    info: 2961151060,
    tranId: 900302961151060,
    tradeId: -1333816236
  },
  {
    symbol: 'BTCUSDT',
    incomeType: 'REALIZED_PNL',
    income: 0.0008,
    asset: 'USDT',
    time: 1665961847000,
    info: 2961151061,
    tranId: 900302961151061,
    tradeId: -1333816235
  },
  {
    symbol: 'BTCUSDT',
    incomeType: 'COMMISSION',
    income: -0.01542368,
    asset: 'USDT',
    time: 1665961847000,
    info: 2961151061,
    tranId: 900302961151061,
    tradeId: -1333816235
  }
]
```
</details>


### .futuresADLQuantileEstimation():
```js
  let ADLQuantile = await binance.futuresADLQuantileEstimation();

  let BTC_ADLQuantile = await binance.futuresADLQuantileEstimation('BTCUSDT');
```
<details>
<summary>View Response</summary>

```js
[
    {
        "symbol": "ETHUSDT", 
        "adlQuantile": 
            {
                // if the positions of the symbol are crossed margined in Hedge Mode, "LONG" and "SHORT" will be returned a same quantile value, and "HEDGE" will be returned instead of "BOTH".
                "LONG": 3,  
                "SHORT": 3, 
                "HEDGE": 0   // only a sign, ignore the value
            }
        },
    {
        "symbol": "BTCUSDT", 
        "adlQuantile": 
            {
                // for positions of the symbol are in One-way Mode or isolated margined in Hedge Mode
                "LONG": 1,  // adl quantile for "LONG" position in hedge mode
                "SHORT": 2,     // adl qauntile for "SHORT" position in hedge mode
                "BOTH": 0       // adl qunatile for position in one-way mode
            }
    },
    ...
 ]
```
</details>

### .futuresForceOrders():
```js
  let forceOrders = await binance.futuresForceOrders();

  let BTC_last_5_forceOrders = await binance.futuresForceOrders('BTCUSDT', 5);

  let BTC_last_5_LIQ_orders_only = await binance.futuresForceOrders('BTCUSDT', 5, 'LIQUIDATION');
```
<details>
<summary>View Response</summary>

```js
[
  {
    "orderId": 6071832819, 
    "symbol": "BTCUSDT", 
    "status": "FILLED", 
    "clientOrderId": "autoclose-1596107620040000020", 
    "price": "10871.09", 
    "avgPrice": "10913.21000", 
    "origQty": "0.001", 
    "executedQty": "0.001", 
    "cumQuote": "10.91321", 
    "timeInForce": "IOC", 
    "type": "LIMIT", 
    "reduceOnly": false, 
    "closePosition": false, 
    "side": "SELL", 
    "positionSide": "BOTH", 
    "stopPrice": "0", 
    "workingType": "CONTRACT_PRICE", 
    "origType": "LIMIT", 
    "time": 1596107620044, 
    "updateTime": 1596107620087
  }
  {
    "orderId": 6072734303, 
    "symbol": "BTCUSDT", 
    "status": "FILLED", 
    "clientOrderId": "adl_autoclose", 
    "price": "11023.14", 
    "avgPrice": "10979.82000", 
    "origQty": "0.001", 
    "executedQty": "0.001", 
    "cumQuote": "10.97982", 
    "timeInForce": "GTC", 
    "type": "LIMIT", 
    "reduceOnly": false, 
    "closePosition": false, 
    "side": "BUY", 
    "positionSide": "SHORT", 
    "stopPrice": "0", 
    "workingType": "CONTRACT_PRICE", 
    "origType": "LIMIT", 
    "time": 1596110725059, 
    "updateTime": 1596110725071
  },
  ...
]
```
</details>

### .futuresQuantitativeRules():
```js
  let APITradingStatus = await binance.futuresQuantitativeRules();

  let BTC_APITradingStatus = await binance.futuresQuantitativeRules('BTCUSDT');
```
<details>
<summary>View Response</summary>

```js
{
    "indicators": { // indicator: quantitative rules indicators, value: user's indicators value, triggerValue: trigger indicator value threshold of quantitative rules. 
        "BTCUSDT": [
            {
                "isLocked": true,
                "plannedRecoverTime": 1545741270000,
                "indicator": "UFR",  // Unfilled Ratio (UFR)
                "value": 0.05,  // Current value
                "triggerValue": 0.995  // Trigger value
            },
            {
                "isLocked": true,
                "plannedRecoverTime": 1545741270000,
                "indicator": "IFER",  // IOC/FOK Expiration Ratio (IFER)
                "value": 0.99,  // Current value
                "triggerValue": 0.99  // Trigger value
            },
            {
                "isLocked": true,
                "plannedRecoverTime": 1545741270000,
                "indicator": "GCR",  // GTC Cancellation Ratio (GCR)
                "value": 0.99,  // Current value
                "triggerValue": 0.99  // Trigger value
            },
            {
                "isLocked": true,
                "plannedRecoverTime": 1545741270000,
                "indicator": "DR",  // Dust Ratio (DR)
                "value": 0.99,  // Current value
                "triggerValue": 0.99  // Trigger value
            }
        ],
        "ETHUSDT": [
            {
                "isLocked": true,
                "plannedRecoverTime": 1545741270000,
                "indicator": "UFR",
                "value": 0.05,
                "triggerValue": 0.995
            },
            {
                "isLocked": true,
                "plannedRecoverTime": 1545741270000,
                "indicator": "IFER",
                "value": 0.99,
                "triggerValue": 0.99
            },
            {
                "isLocked": true,
                "plannedRecoverTime": 1545741270000,
                "indicator": "GCR",
                "value": 0.99,
                "triggerValue": 0.99
            }
            {
                "isLocked": true,
                "plannedRecoverTime": 1545741270000,
                "indicator": "DR",
                "value": 0.99,
                "triggerValue": 0.99
            }
        ]
    },
    "updateTime": 1545741270000
}
```
***Or (Account violation triggered):***
```js
{
    "indicators":{
        "ACCOUNT":[
            {
                "indicator":"TMV",  //  Too many violations under multiple symbols trigger account violation
                "value":10,
                "triggerValue":1,
                "plannedRecoverTime":1644919865000,
                "isLocked":true
            }
        ]
    },
    "updateTime":1644913304748
}
```
</details>

### .futuresUserCommissionRate():
```js
  let BTC_CommissionRate = await binance.futuresUserCommissionRate('BTCUSDT');
```
<details>
<summary>View Response</summary>

```js
{
  symbol: 'BTCUSDT',
  makerCommissionRate: 0.0002,  // For LIMIT orders
  takerCommissionRate: 0.0004   // For MARKET orders
}
```
</details>

### .futuresTransactionHistoryDownloadId():
```js
  const startTime = Date.now() - (5 * 24 * 60 * 60 * 1000); // last 5 days
  const endTime = Date.now();

  let TxHistoryDownloadId = await binance.futuresTransactionHistoryDownloadId(startTime, endTime);
```
<details>
<summary>View Response</summary>

```js
{
    "avgCostTimestampOfLast30d":7241837, // Average time taken for data download in the past 30 days
    "downloadId":"545923594199212032",
}
```
</details>

### .futuresGetTransactionHistoryLinkByDownloadId():
```js
  let downloadLink = await binance.futuresGetTransactionHistoryLinkByDownloadId(TxHistoryDownloadId); // which is '545923594199212032' from the last request above
```
<details>
<summary>View Response</summary>

```js
{
    "downloadId":"545923594199212032",
    "status":"completed",     // Enum：completed，processing
    "url":"www.binance.com",  // The link is mapped to download id
    "notified":true,          // ignore
    "expirationTimestamp":1645009771000,  // The link would expire after this timestamp
    "isExpired":null,
}

// OR when server is still processing
{
    "downloadId":"545923594199212032",
    "status":"processing",
    "url":"", 
    "notified":false,
    "expirationTimestamp":-1
    "isExpired":null,
}
```
</details>

### .futuresPortfolioMarginExchangeInfo():
```js
  let portfolioMarginAccountInfo = await binance.futuresPortfolioMarginExchangeInfo('BTCUSDT');
  
  let FULL_portfolioMarginAccountInfo = await binance.futuresPortfolioMarginExchangeInfo();
```
<details>
<summary>View Response</summary>

```js
{ // for single symbol
  notionalLimits: 
    [ 
      { 
        symbol: 'BTCUSDT', notionalLimit: 100000000 
      } 
    ] 
}

{ // for ALL symbols
  notionalLimits: [
    { symbol: 'BTCUSDT', notionalLimit: 100000000 },
    { symbol: 'ETHUSDT', notionalLimit: 20000000 },
    { symbol: 'BCHUSDT', notionalLimit: 3000000 },
    { symbol: 'XRPUSDT', notionalLimit: 6000000 },
    { symbol: 'EOSUSDT', notionalLimit: 3000000 },
    { symbol: 'LTCUSDT', notionalLimit: 3000000 },
    { symbol: 'TRXUSDT', notionalLimit: 3000000 },
    { symbol: 'ETCUSDT', notionalLimit: 3000000 },
    { symbol: 'LINKUSDT', notionalLimit: 6000000 },
    { symbol: 'XLMUSDT', notionalLimit: 3000000 },
    { symbol: 'ADAUSDT', notionalLimit: 6000000 },
    { symbol: 'XMRUSDT', notionalLimit: 3000000 },
    { symbol: 'DASHUSDT', notionalLimit: 1000000 },
    { symbol: 'ZECUSDT', notionalLimit: 2000000 },
    { symbol: 'XTZUSDT', notionalLimit: 3000000 },
    { symbol: 'BNBUSDT', notionalLimit: 3000000 },
    ...,
    ...,
  ]
}
```
</details>

### .futuresPortfolioMarginAccountInfo():
```js
  let BTC_marginAccountInfo = await binance.futuresPortfolioMarginAccountInfo('BTC');
```
<details>
<summary>View Response</summary>

```js
{
    "maxWithdrawAmountUSD": "1627523.32459208", // Portfolio margin maximum virtual amount for transfer out in USD
    "asset": "BTC",                             // asset name
    "maxWithdrawAmount": "27.43689636",         // maximum amount for transfer out
}
```
</details>



# ***WEBSOCKETS***:
## SPOT<a href='#WebSocket-Spot'><sup>ref</sup></a>
## FUTURES<a href='#WebSocket-Futures'><sup>ref</sup></a>

### How to Use<a href='#How-To-Use'><sup>ref</sup></a>
### How to Subscribe to a new Stream<a href='#How-To-Subscribe'><sup>ref</sup></a>
### How to Close<a href='#How-To-Close'><sup>ref</sup></a>
### How to Unsubscribe<a href='#How-To-Unsubscribe'><sup>ref</sup></a>
### How to Add Additional Streams to a Connection (***VERY USEFUL***)<a href='#Add-Streams-To-Socket'><sup>ref</sup></a>
### Handling Websocket Errors<a href='#Handling-Websocket-Errors'><sup>ref</sup></a>

### Websocket Parameter Explanation<a href='#Websocket-Parameters-Explanation'><sup>ref</sup></a>


## HOW TO USE:
- All websockets are divided into 'blocks' for '*SPOT*', '*FUTURES*', etc...
```js
  binance.websockets.spot     // 'spot' is a block, containing all of the spot-related websocket connections

  binance.websockets.futures  // 'futures' is a block, containing all of the futures-related websocket connections
```
- All websocket streams are accessed via the binance.websockets property:
```js
  binance.websockets.spot.'<streamFunctionName>'
  // OR
  binance.websockets.futures.'<streamFunctionName>'
```
- Each function has AT LEAST 1 mandatory parameter ***callback***, and can have optional parameters:
- - Mandatory parameters are always the first parameters to be passed to the function.
- - But if there are other mandatory parameters than ***callback***, they will come first, that is the reason why ***callback*** sometimes comes first, and sometimes comes last
- - Some examples:
```js
  await binance.websockets.futures.candlesticks(symbol, interval, callback); <= callback comes last because all the others are mandatory

  await binance.websockets.futures.miniTicker(callback, [symbol]) <= callback comes first, because symbol is NOT mandatory
```

## HOW TO SUBSCRIBE:
There are two main ways to subscribe:
- You can either use the built-in library functions:
```js
  let aggTrade_stream = await binance.websockets.futures.aggTrade('BTCUSDT', handleAggTrades);

  function handleAggTrades(data) { // <= this is your 'callback' function, which is called everytime there is new data sent by binance
    console.log(data);
  }
```
- Or you can subscribe youself via the `.subscribe()` method of each websocket block:
```js
  let aggTrade = await binance.websockets.futures.subscribe('btcusdt@aggTrade');
  // It is NOT RECOMMENDED to use this method, as it will not come with the added benefits of having the library rename the properties of the message
  // The library renames all the properties of the websocket response for clarity, it is instead recommended to use one of the other methods
```

## HOW TO CLOSE:
- All Websocket functions return an object that you can use to close the connection completely, just like the following:
```js
  const candlestick_stream = await binance.websockets.futures.candlesticks('BTCUSDT', '1m', console.log);
  
  candlestick_stream.close(); // this closes the connection permanently, the callback function will not be triggered anymore
```

## HOW TO UNSUBSCRIBE:
- All Websocket functions return an object that you can use to unsubscribe from a stream, just like the following:
```js
  const aggTrades_stream = await binance.websockets.futures.aggTrade("BTCUSDT", (data) => {
    // to something here with the data
  });
  
  const subscriptions = await aggTrades_stream.subscriptions(); // this function returns the subscriptions in an array
  aggTrades_stream.unsubscribe(subscriptions); // This here is how you unsubscribe from a subscription, or array of subscriptions
```

- Or you can unsubscribe using the await binance.websockets.spot/futures.subscriptions:
```js
  let subscriptions = await binance.websockets.futures.subscriptions();

  await binance.websockets.futures.unsubscribe(subscriptions);
  // OR
  // for example: subscriptions => ['btcusdt@aggTrade', ...];
  await binance.websockets.futures.unsubscribe('btcusdt@aggTrade'); // or of course instead using the full array or any specific element   of that array
```

## ADD STREAMS TO SOCKET:
- ***IMPORTANT***: **ONLY SUBSCRIBE TO THE SAME TYPES OF STREAMS, ONLY SIMILAR-TYPE STREAMS CAN BE ACCESSED VIA THE SAME SOCKET OBJECT:**
```js
  const lastPrice_stream = await binance.websockets.futures.lastPrice(console.log, 'BTCUSDT');

  // using the `.subscribe()` function, you only subscribe to additional `lastPrice` streams, and not any other type

  lastPrice_stream.subscribe('ETHUSDT');
```
- All Websocket function return an object that you can use to subscribe to a new stream
- The library renames the properties for more clarity, so subscribing to the same streams via the websocket is recommended
- To use the `.subscribe()` function correctly, all you need to do is pass the same parameters the original(in the same order too) except for the callback function.
```js
  let lastPrice_stream = await binance.websockets.futures.lastPrice((data) => {
    // do something with the data
  }, 'BTCUSDT');


  // now remember, .lastPrice(<callback>, [symbol], [isFast]) has 1 mandatory parameters, but ignoring 'callback' since it isnt needed, we only need to pass the optional parameters
  lastPrice_stream.subscribe('ETHUSDT');
  lastPrice_stream.subscribe('XRPUSDT', true);
```
- Another example with the more 'complicated' functions:
```js
  let continuousKline_stream = await binance.websockets.futures.continuousContractKline('BTCUSDT','PERPETUAL', '1m', (data) => {
    // do something with the data
  });

  // the function has 3 parameters, all of them mandatory => pair, contractType, interval
  continuousKline_stream.subscribe('ETHUSDT','PERPETUAL', '1m');
  continuousKline_stream.subscribe('XRPUSDT','PERPETUAL', '3m');
```
- Same for optional parameters:
```js
  let miniTicker_stream = binance.websockets.futures.miniTicker('BTCUSDT', (data) => console.log());

  miniTicker_stream.unsubscribe(await miniTicker_stream.subscriptions()); // unsubscribing from the single stream to sub to the main stream on the next request
  miniTicker_stream.subscribe('');  // Because symbol is an 'optional' parameter, the function will accept an empty symbol as a parameter and will subscribe to the ALL symbols' stream

  // .markPrice() also has 0 mandatory parameters, and 2 optional parameters, you can also enter blank parameters, or none at all(since there's no mandatory parameter needed)
```

## HANDLING WEBSOCKET ERRORS:
- All Websocket functions return an object that can be used for many purposes, like `.subscribe()`, `.unsubscribe()` and fetching subscriptions via the `.subscriptions()`
- All of those functions return promises that can be handled via the `await` keyword
- Opening the stream:
```js
  // use this when you are still testing out the function or checking if the parameters are valid
  let stream = await binance.websockets.futures.aggTrade('', (data) => console.log()); // '' is not a valid argument for lastPrice(), since 'symbol' is mandatory
  if (stream.error) {
    console.log(stream);
    // handle the error here, or just reset and check the parameters
  }
```
<details>
<summary>View the Error Response</summary>

```js
{
  error: {
    status: 400,
    statusText: 'Websocket Error',
    code: -3,
    msg: "Parameter 'symbol' is required for this request."
  }
}
```
</details>

- All requests that awaits for 'data'(Like for .subscriptions(), which returns the subscriptions in the socket) will return as normal
- But all requests that do not anticipate a reply of data(Like for .subscribe() or .unsubscribe()) will instead only need to be checked for .error property if it is urgent to know that it was a success:
- - `.subscriptions()`:
```js
  let stream = await binance.websockets.futures...;
  // ...
  // ...
  let subscriptions = await stream.subscriptions(); // this returns a list of all the subscriptions in the CURRENT socket `stream`
  console.log(subscriptions);
```
- - `.unsubscribe()`:
```js
  // assuming we have the subscriptions from the .subscriptions() method
  let response = await stream.unsubscribe(subscriptions);
  if(response.error) {
    // this means an error happened, altho very unlikely since the connection is already established
  }
```
- - same for `.subscribe()`

## WEBSOCKET PARAMETERS EXPLANATION:
- ***callback***: It's a function that you define anywhere (can be a simple arrow function), that is passed to the websocket function, that will be called on every message received from the websocket connection, for example:
```js
  let callbackFunc = (msg) => {
    console.log(msg);
  }
  let websocketStream = await binance.futures.websockets.markPrice('BTCUSDT', callbackFunc);

  // OR

  function callbackFunc(msg) {
    console.log(msg)
  }
  let websocketStream = await binance.futures.websockets.markPrice('BTCUSDT', callbackFunc);

  // OR SIMPLY

  let websocketStream = await binance.futures.websockets.markPrice('BTCUSDT', (msg) => {
    console.log(msg)
  }); // simple arrow function :D
```


## WEBSOCKET SPOT:
|FUNCTIONS                                                                             |REQUIRED PARAMETERS<a href='#Websocket-Parameters-Explanation'><sup>ref</sup></a> |OPTIONAL PARAMETERS                               |
|:-------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------:|:------------------------------------------------:|
|aggTrade()                                 <a href='#spot-aggTrade'><sup>ref</sup></a>|symbol, callback                                                                  |                                                  |
|trade()                                       <a href='#spot-trade'><sup>ref</sup></a>|symbol, callback                                                                  |                                                  |
|candlesticks()                         <a href='#spot-candlesticks'><sup>ref</sup></a>|symbol, interval, callback                                                        |                                                  |
|lastPrice()                               <a href='#spot-lastPrice'><sup>ref</sup></a>|callback                                                                          |symbol, isFast                                    |
|miniTicker()                             <a href='#spot-miniTicker'><sup>ref</sup></a>|callback                                                                          |symbol                                            |
|ticker()                                     <a href='#spot-ticker'><sup>ref</sup></a>|callback                                                                          |symbol                                            |
|rollingWindowStats()             <a href='#spot-rollingWindowStats'><sup>ref</sup></a>|windowSize, callback                                                              |symbol                                            |
|bookTicker()                             <a href='#spot-bookTicker'><sup>ref</sup></a>|callback                                                                          |symbol                                            |
|partialBookTicker()               <a href='#spot-partialBookTicker'><sup>ref</sup></a>|symbol, levels, speed, callback                                                   |                                                  |
|diffBookTicker()                     <a href='#spot-diffBookTicker'><sup>ref</sup></a>|symbol, speed, callback                                                           |                                                  |
|subscribe()                               <a href='#spot-subscribe'><sup>ref</sup></a>|subscriptions, callback                                                           |                                                  |
|userData()                                 <a href='#spot-userData'><sup>ref</sup></a>|callback                                                                          |tries (how many times to try to get the listenKey)|

### spot .aggTrade():
**Update Speed**: *Realtime*
```js
  let BTC_aggTrade_stream = await binance.websockets.spot.aggTrade('BTCUSDT', (data) => {
    // do something with data
  });
```
```js
{
  event: 'aggTrade',
  time: 1666293658302,
  symbol: 'BTCUSDT',
  aggTradeId: 1716672848,
  price: 19058.2,
  qty: 0.00055,
  firstTradeId: 1999307772,
  lastTradeId: 1999307772,
  tradeTime: 1666293658301,
  maker: true
}
```


### spot .trade():
**Update Speed**: *Realtime*
```js
  let BTC_trade_stream = await binance.websockets.spot.trade('BTCUSDT', (data) => {
    // do something with data
  })
```
```js
{
  event: 'trade',
  time: 1666293759825,
  symbol: 'BTCUSDT',
  tradeId: 1666293759824,
  price: 19046.8,
  qty: 0.02719,
  buyOrderId: 14566746661,
  sellerOrderId: 14566746646,
  maker: false
}
```


### spot .candlesticks():
**Update Speed**: 2000ms
```js
let BTC_candlesticks_stream = await binance.websockets.spot.candlesticks('BTCUSDT', '1m', handleCandlestick)
```
```js
{
  event: 'kline',
  time: 1666294256274,
  symbol: 'BTCUSDT',
  candle: {
    startTime: 1666294200000,
    closeTime: 1666294259999,
    symbol: 'BTCUSDT',
    interval: '1m',
    firstTradeId: 1999341425,
    lastTradeId: 1999344534,
    open: 19061.89,
    close: 19052.14,
    high: 19062.45,
    low: 19049.69,
    baseAssetVolume: 154.66546,
    tradeCount: 3110,
    closed: false,
    quoteAssetVolume: '2947278.84130180',
    takerBuy_baseAssetVolume: 56.94057,
    takerBuy_quoteAssetVolume: '1085117.01622170'
  }
}
```


### spot .lastPrice():
```js
  let allSymbols_lastPrice = await binance.websockets.spot.lastPrice(console.log);
  // OR
  let BTC_lastPrice = await binance.websockets.spot.lastPrice(console.log, 'BTCUSDT');
  // OR
  let BTC_fast_lastPrice = await binance.websockets.spot.lastPrice(console.log, 'BTCUSDT', true); // This uses the trades stream to get the lastPrice, very effective and fast paced
```
```js
{ // for ALL symbols, there will be 25-60 of those symbols per second
  LTCBTC: 0.002735 
}

// OR

{ // for single symbols
  BTCUSDT: 19352.85   // update speed: 1000ms
}

{
  BTCUSDT: 19352.85   // Realtime: approx 5-15 updates per second
}
```


### spot .miniTicker():
**Update Speed**: 1000ms
```js
  let BTCUSDT_miniTicker_stream = await binance.websockets.spot.miniTicker(handleMiniTicker, 'BTCUSDT');
  // OR
  let miniTicker_stream = await binance.websockets.spot.miniTicker(handleMiniTicker);
```
```js
{ // for single symbol
  event: '24hrMiniTicker',
  time: 1666294374003,
  symbol: 'BTCUSDT',
  close: 19042.03,
  open: 19172.67,
  high: 19347.82,
  low: 18900,
  totalTraded_baseAssetVolume: 216268.00257,
  totalTraded_quoteAssetVolume: '4140935865.70499410'
}

[ // for ALL symbols
  {
    event: '24hrMiniTicker',
    time: 1666294314794,
    symbol: 'ETHBTC',
    close: 0.067511,
    open: 0.067452,
    high: 0.06794,
    low: 0.067055,
    totalTraded_baseAssetVolume: 68875.9389,
    totalTraded_quoteAssetVolume: 4643.41581216
  },
  {
    event: '24hrMiniTicker',
    time: 1666294313975,
    symbol: 'BNBETH',
    close: 0.209,
    open: 0.211,
    high: 0.2146,
    low: 0.2083,
    totalTraded_baseAssetVolume: 15973.316,
    totalTraded_quoteAssetVolume: 3368.1945322
  },
  {
    event: '24hrMiniTicker',
    time: 1666294314801,
    symbol: 'BTCUSDT',
    close: 19044.34,
    open: 19177.12,
    high: 19347.82,
    low: 18900,
    totalTraded_baseAssetVolume: 216204.06213,
    totalTraded_quoteAssetVolume: '4139727803.27516700'
  },
  ...,
  ...
]
```


### spot .ticker():
**Update Speed**: 1000ms
```js
  let BTC_ticker_stream = await binance.websockets.spot.ticker(handleTicker, 'BTCUSDT');
  // OR
  let icker_stream = await binance.websockets.spot.ticker(handleTicker);
```
```js
{ // for single symbol
  event: '24hrTicker',
  time: 1666294976775,
  symbol: 'BTCUSDT',
  priceChange: -153.6,
  percentChange: -0.8,
  weightedAvgPrice: 19146.39703697,
  previousStream_firstTradePrice: 19191.59,
  lastQty: 0.0016,
  bestBidPrice: 19038,
  bestBidQty: 0.00891,
  bestAskPrice: 19038.7,
  bestAskQty: 0.00055,
  open: 19191.6,
  close: 19038,
  high: 19347.82,
  low: 18900,
  totalTraded_baseAssetVolume: 216742.85344,
  totalTraded_quoteAssetVolume: '4149844726.88706700',
  stats_openTime: 1666208576337,
  stats_closeTime: 1666294976337,
  firstTradeId: 1994024008,
  lastTradedId: 1999382907,
  tradeCount: 5358900
}

[ // for ALL symbols
  {
    event: '24hrTicker',
    time: 1666295010157,
    symbol: 'ETHBTC',
    priceChange: -0.000121,
    percentChange: -0.179,
    weightedAvgPrice: 0.06741717,
    previousStream_firstTradePrice: 0.067472,
    lastQty: 0.0321,
    bestBidPrice: 0.067351,
    bestBidQty: 0.0019,
    bestAskPrice: 0.067352,
    bestAskQty: 59.8183,
    open: 0.067473,
    close: 0.067352,
    high: 0.06794,
    low: 0.067055,
    totalTraded_baseAssetVolume: 68985.2712,
    totalTraded_quoteAssetVolume: 4650.79172966,
    stats_openTime: 1666208610093,
    stats_closeTime: 1666295010093,
    firstTradeId: 382460653,
    lastTradedId: 382610810,
    tradeCount: 150158
  },
  {
    event: '24hrTicker',
    time: 1666295010138,
    symbol: 'LTCBTC',
    priceChange: -0.000004,
    percentChange: -0.149,
    weightedAvgPrice: 0.00268402,
    previousStream_firstTradePrice: 0.002678,
    lastQty: 0.038,
    bestBidPrice: 0.002674,
    bestBidQty: 7.94,
    bestAskPrice: 0.002675,
    bestAskQty: 46.051,
    open: 0.002678,
    close: 0.002674,
    high: 0.002707,
    low: 0.002653,
    totalTraded_baseAssetVolume: 36319.646,
    totalTraded_quoteAssetVolume: 97.48269106,
    stats_openTime: 1666208607011,
    stats_closeTime: 1666295007011,
    firstTradeId: 84336390,
    lastTradedId: 84349163,
    tradeCount: 12774
  },
  ...,
  ...
]
```


### spot .rollingWindowStats():
**Update Speed**: 1000ms

**Window Sizes**: 1h,4h,1d

**Note**: This stream is different from the `ticker()` stream. The open time `.close` always starts on a minute, while the closing time `.close` is the current time of the update.
As such, the effective window might be up to 59999ms wider that <window_size>.
```js
  let 4h_windowStat_stream = await binance.websockets.spot.rollingWindowStats('BTCUSDT', '4h', console.log)
  // OR
  let 4h_windowStat_stream = await binance.websockets.spot.rollingWindowStats('', '4h', console.log)
```
```js
{ // for single symbol
  event: '4hTicker',
  time: 1666535268773,
  symbol: 'BTCUSDT',
  priceChange: 6.42,
  percentChange: 0.033,
  open: 19176.98,
  high: 19210.54,
  low: 19070.11,
  lastPrice: 19183.4,
  weightedAvgPrice: 19153.32130309,
  totalTraded_baseAssetVolume: 23573.27327,
  totalTraded_quoteAssetVolume: '451506477.10578530',
  stats_openTime: 1666520820000,
  stats_closeTime: 1666535268511,
  firstTradeId: 2009712739,
  lastTradeId: 2010333945,
  tradeCount: 621207
}

[ // for ALL symbols
  {
    event: '4hTicker',
    time: 1666535310775,
    symbol: 'BNBBTC',
    priceChange: 0.00001,
    percentChange: 0.071,
    open: 0.014067,
    high: 0.014096,
    low: 0.014045,
    lastPrice: 0.014077,
    weightedAvgPrice: 0.01407548,
    totalTraded_baseAssetVolume: 2711.348,
    totalTraded_quoteAssetVolume: 38.16352924,
    stats_openTime: 1666520880000,
    stats_closeTime: 1666535310610,
    firstTradeId: 206189368,
    lastTradeId: 206194077,
    tradeCount: 4710
  },
  {
    event: '4hTicker',
    time: 1666535310775,
    symbol: 'BTCUSDT',
    priceChange: 7.84,
    percentChange: 0.041,
    open: 19176.17,
    high: 19210.54,
    low: 19070.11,
    lastPrice: 19184.01,
    weightedAvgPrice: 19153.30896216,
    totalTraded_baseAssetVolume: 23549.83751,
    totalTraded_quoteAssetVolume: '451057313.83759810',
    stats_openTime: 1666520880000,
    stats_closeTime: 1666535310761,
    firstTradeId: 2009714306,
    lastTradeId: 2010335189,
    tradeCount: 620884
  },
  ...,
  ...
]
```


### spot .bookTicker():
**Update Speed**: *Realtime*
```js
  let bookTicker_BTC_stream = await binance.websockets.spot.bookTicker(handleBookTicker, 'BTCUSDT');
  // OR
  let bookTicker_stream = await binance.websockets.spot.bookTicker(handleBookTicker); // this will be removed in November 2022 by binance
```
```js
{
  updateId: 26122319805,
  symbol: 'BTCUSDT',
  bestBidPrice: 19183.98,
  bestBidQty: 0.0026,
  bestAskPrice: 19184.32,
  bestAskQty: 0.01796
}
```


### spot .partialBookTicker():
**Update Speed**: 1000ms or 100ms
```js
  let partialBookTicker_BTC_5_100ms_stream = await binance.websockets.spot.partialBookTicker('BTCUSDT', 5, '100ms', console.log);
  // OR
  let partialBookTicker_BTC_10_1000ms_stream = await binance.websockets.spot.partialBookTicker('BTCUSDT', 10, '1000ms', console.log);
```
```js
{
  lastUpdateId: 26123167083,
  bids: [
    [ 19202.51, 0.09507 ],
    [ 19202.5, 0.01401 ],
    [ 19202.48, 0.48268 ],
    [ 19202.47, 0.04646 ],
    [ 19202.46, 0.48329 ]
  ],
  asks: [
    [ 19203.19, 0.7855 ],
    [ 19203.24, 0.46866 ],
    [ 19203.25, 0.46862 ],
    [ 19203.26, 0.03222 ],
    [ 19203.27, 0.008 ]
  ]
}
```

### spot .diffBookTicker():
**Update Speed**: 1000ms or 100ms

***HOW TO MANAGE A LOCAL ORDER BOOK CORRECTLY***

1. Open a stream via `binance.websockets.spot.diffBookTicker()`.

2. Buffer the events you receive from the stream.

3. Get a depth snapshot from https://api.binance.com/api/v3/depth?symbol=BNBBTC&limit=1000.  // unfortunately spot isn't supported in the library yet, so will need to do that manually

4. Drop any event where `finalUpdateId` is <= lastUpdateId in the snapshot.

5. The first processed event should have `firstUpdateId` <= lastUpdateId+1 AND `finalUpdateId` >= lastUpdateId+1.

6. While listening to the stream, each new event's `firstUpdateId` should be equal to the previous event's `finalUpdateId` + 1.

- The data in each event is the absolute quantity for a price level.

- **If the quantity is 0, remove the price level.**

- Receiving an event that removes a price level that is not in your local order book can happen and is normal.

***Note***: Due to depth snapshots having a limit on the number of price levels, a price level outside of the initial snapshot that doesn't have a quantity change won't have an update in the Diff. Depth Stream. Consequently, those price levels will not be visible in the local order book even when applying all updates from the Diff. Depth Stream correctly and cause the local order book to have some slight differences with the real order book. However, for most use cases the depth limit of 5000 is enough to understand the market and trade effectively.

```js
  let diffBookTicker_BTC_100ms_stream = await binance.websockets.spot.diffBookTicker('BTCUSDT', '100ms', console.log)
  // OR
  let diffBookTicker_BTC_1000ms_stream = await binance.websockets.spot.diffBookTicker('BTCUSDT', '1000ms', console.log)
```
```js
{
  event: 'depthUpdate',
  time: 1666537508157,
  symbol: 'BTCUSDT',
  firstUpdateId: 26123220498,
  finalUpdateId: 26123220915,
  bids: [
    [ 19198.45, 0.39239 ], [ 19198.44, 0.01283 ], [ 19198.37, 0.02 ],
    [ 19198.3, 0.02 ],     [ 19198.22, 0.02 ],    [ 19198.13, 0.23642 ],
    [ 19198.1, 0.33518 ],  [ 19198.09, 0.04497 ], [ 19198.08, 0.21981 ],
    [ 19198.07, 0.0129 ],  [ 19198.06, 0.02604 ], [ 19198.05, 0 ],
    [ 19198.04, 0 ],       [ 19197.98, 0 ],       [ 19197.91, 0.18957 ],
    [ 19197.9, 0.21579 ],  [ 19197.87, 0.02603 ], [ 19197.82, 0.001 ],
    [ 19197.8, 0.39999 ],  [ 19197.79, 0.00277 ], [ 19197.75, 0.02604 ],
    [ 19197.67, 0 ],       [ 19197.66, 0 ],       [ 19197.63, 0 ],
    [ 19197.62, 0 ],       [ 19197.6, 0.076 ],    [ 19197.55, 0.05267 ],
    [ 19197.36, 0 ],       [ 19197.35, 0 ],       [ 19197.16, 0.10023 ],
    [ 19197.15, 0.08386 ], [ 19197.12, 0 ],       [ 19197.08, 0 ],
    [ 19197.07, 0 ],       [ 19197.05, 0 ],       [ 19197.04, 0.00271 ],
    [ 19197.03, 0.01716 ], [ 19197.01, 0.0172 ],  [ 19196.99, 0.01762 ],
    [ 19196.96, 0.1009 ],  [ 19196.95, 0 ],       [ 19196.94, 0 ],
    ...,                   ...,                   ...,
    ...
  ],
  asks: [
    [ 19198.72, 0 ],       [ 19198.73, 0 ],       [ 19198.74, 0 ],
    [ 19198.75, 0 ],       [ 19198.76, 0 ],       [ 19198.77, 0 ],
    [ 19198.78, 0 ],       [ 19198.79, 0 ],       [ 19199.02, 0.00173 ],
    [ 19199.03, 0.00061 ], [ 19199.08, 0 ],       [ 19199.1, 0 ],
    [ 19199.15, 0.001 ],   [ 19199.19, 0 ],       [ 19199.23, 0.04975 ],
    [ 19199.24, 0.00156 ], [ 19199.39, 0 ],       [ 19199.43, 0.00499 ],
    [ 19199.49, 0.00499 ], [ 19199.59, 0.39698 ], [ 19199.6, 0.19551 ],
    [ 19199.61, 0.19979 ], [ 19199.62, 0 ],       [ 19199.63, 0.0008 ],
    [ 19199.64, 0 ],       [ 19199.65, 0 ],       [ 19199.77, 0.0054 ],
    [ 19199.78, 0.0052 ],  [ 19199.79, 0.10009 ], [ 19199.8, 0.05725 ],
    [ 19199.81, 0 ],       [ 19199.82, 0 ],       [ 19199.83, 0.43191 ],
    [ 19199.92, 0.015 ],   [ 19199.99, 0 ],       [ 19200.07, 0.00056 ],
    [ 19200.1, 0.00057 ],  [ 19200.34, 0.00523 ], [ 19200.35, 0.05555 ],
    [ 19200.49, 0 ],       [ 19200.68, 0 ],       [ 19200.71, 0 ],
    [ 19200.93, 0 ],       [ 19201.06, 0.04 ],    [ 19201.2, 0.00572 ],
    ...,                   ...,                   ...,
    ...
  ]
}
```


### spot .userData():
```js
  let userData = await binance.websockets.spot.userData((data) => {
    if(data.event == 'outboundAccountPosition') handleAccountPositions(data);
    else if(data.event == 'balanceUpdate') handleBalanceUpdates(data);
    else if(data.event == 'executionReport') handleExecutionReports(data);
    else if(data.event == 'listStatus') handleListStatuses(data);
  })
```
- `outboundAccountPosition` is sent any time an account balance has changed and contains the assets that were possibly changed by the event that generated the balance change.
```js
{
  event: 'outboundAccountPosition',
  time: 1564034571105,
  lastAccountUpdateTime: 1564034571073,
  balances: [ { asset: 'ETH', free: '10000.000000', locked: '0.000000' } ]
}
```
- `balanceUpdate` occurs during the following:
- - Deposits or withdrawals from the account
- - Transfer of funds between accounts (e.g. Spot to Margin)
```js
{
  event: 'balanceUpdate',
  time: 1573200697110,
  asset: 'BTC',
  balanceDelta: '100.00000000',
  clearTime: 1573200697068
}
```
- Orders are updated with the `executionReport` event.
- Check the <a href='https://binance-docs.github.io/apidocs/spot/en/#public-api-definitions'>Public API Definitions</a> and below for relevant enum definitions.
- Average price can be found by doing `cumulative_quoteAssetTransactedQty` divided by `cumulativeFilledQty`.
- ***Execution Types:***
- - **NEW** - The order has been accepted into the engine.
- - **CANCELED** - The order has been canceled by the user.
- - **REPLACED** (currently unused)
- - **REJECTED** - The order has been rejected and was not processed. (This is never pushed into the User Data Stream)
- - **TRADE** - Part of the order or all of the order's quantity has filled.
- - **EXPIRED** - The order was canceled according to the order type's rules (e.g. LIMIT FOK orders with no fill, LIMIT IOC or MARKET orders that partially fill) or by the exchange, (e.g. orders canceled during liquidation, orders canceled during maintenance)
- If the order is an OCO, an event will be displayed named `listStatus` in addition to the `executionReport` event.

***executionReport:***
```js
{
  event: 'executionReport',
  time: 1499405658658,
  symbol: 'ETHBTC',
  clientOrderId: 'mUvoqJxFIILMdfAW5iGSOW',
  side: 'BUY',
  orderType: 'LIMIT',
  timeInForce: 'GTC',
  qty: '1.00000000',
  price: '0.10264410',
  stopPrice: '0.00000000',
  trailingDelta: 4,
  icebergQty: '0.00000000',
  orderListId: -1,
  origClientOrderId: '',
  currentExecutionType: 'NEW',
  currentOrderType: 'NEW',
  orderRejectReason: 'NONE',
  orderId: 4293153,
  lastExecutedQty: '0.00000000',
  cumulativeFilledQty: '0.00000000',
  lastExecutedPrice: '0.00000000',
  commissionAmount: '0',
  commissionAsset: null,
  transactionId: 1499405658657,
  tradeId: -1,
  isOrderInBook: true,
  maker: false,
  orderCreationTime: 1499405658657,
  cumulative_quoteAssetTransactedQty: '0.00000000',
  lastQuote_assetTrasactedQty: '0.00000000',
  quoteOrderQty: '0.00000000',
  strategyId: 1,
  strategyType: 1000000
}
```

***listStatus:***
```js
{
  event: 'listStatus',
  time: 1564035303637,
  symbol: 'ETHBTC',
  orderListId: 2,
  contingencyType: 'OCO',
  listStatusType: 'EXEC_STARTED',
  listOrderStatus: 'EXECUTING',
  listRejectReason: 'NONE',
  listClientOrderId: 'F4QN4G8DlFATFlIUQ0cjdD',
  transactionTime: 1564035303625,
  orders: [
    {
      symbol: 'ETHBTC',
      orderId: 17,
      clientOrderId: 'AJYsMjErWJesZvqlJCTUgL'
    },
    {
      symbol: 'ETHBTC',
      orderId: 18,
      clientOrderId: 'bfYPSQdLoqAJeNrOr9adzq'
    }
  ]
}
```


## WEBSOCKET FUTURES:
|FUNCTIONS                                                                             |REQUIRED PARAMETERS<a href='#Websocket-Parameters-Explanation'><sup>ref</sup></a> |OPTIONAL PARAMETERS                               |
|:-------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------:|:------------------------------------------------:|
|aggTrade()                              <a href='#futures-aggTrade'><sup>ref</sup></a>|symbol, callback                                                                  |                                                  |
|markPrice()                            <a href='#futures-markPrice'><sup>ref</sup></a>|callback                                                                          |symbol, slow(bool)                                |
|lastPrice()                            <a href='#futures-lastPrice'><sup>ref</sup></a>|callback                                                                          |symbol, isFast                                    |
|candlesticks()                      <a href='#futures-candlesticks'><sup>ref</sup></a>|symbol, interval, callback                                                        |                                                  |
|continuousContractKline()<a href='#futures-continuousContractKline'><sup>ref</sup></a>|pair, contractType, interval, callback                                            |                                                  |
|miniTicker()                          <a href='#futures-miniTicker'><sup>ref</sup></a>|callback                                                                          |symbol                                            |
|ticker()                                  <a href='#futures-ticker'><sup>ref</sup></a>|callback                                                                          |symbol                                            |
|bookTicker()                          <a href='#futures-bookTicker'><sup>ref</sup></a>|callback                                                                          |symbol                                            |
|liquidationOrders()            <a href='#futures-liquidationOrders'><sup>ref</sup></a>|callback                                                                          |symbol                                            |
|partialBookTicker()            <a href='#futures-partialBookTicker'><sup>ref</sup></a>|symbol, levels, speed, callback                                                   |                                                  |
|diffBookTicker()                  <a href='#futures-diffBookTicker'><sup>ref</sup></a>|symbol, speed, callback                                                           |                                                  |
|compositeIndexSymbol()      <a href='#futures-compositeIndexSymbol'><sup>ref</sup></a>|symbol, callback                                                                  |                                                  |
|subscribe()                               <a href='#spot-subscribe'><sup>ref</sup></a>|subscriptions, callback                                                           |                                                  |
|userData()                              <a href='#futures-userData'><sup>ref</sup></a>|callback                                                                          |tries (how many times to try to get the listenKey)|


### futures .aggTrade():
**Update Speed**: 100ms
```js
  let aggTrade_stream = await binance.websockets.futures.aggTrade('BTCUSDT', (data) => {
    // do something with the data
  });

  // OR

  let aggTrade_stream = await binance.websockets.futures.aggTrade('BTCUSDT', handleAggTrade);

  function handleAggTrade(data) {
    // do something with the data
  }
```
```js
{
  event: 'aggTrade',
  time: 1666065747727,
  symbol: 1492881301,
  aggTradeId: 'BTCUSDT',
  price: 19546.9,
  qty: 0.003,
  firstTradeId: 2964443439,
  lastTradeId: 2964443441,
  timestamp: 1666065747676,
  maker: true
}
```


### futures .markPrice():
**Update Speed**: 1000ms or 3000ms
'markPrice' is NOT the price with which binance executes your order with, instead use 'lastPrice()'
```js
  function handleMarkPrices(data) {
    // do something with the data
  }

  let markPrice_BTC_stream = await binance.websockets.futures.markPrice(handleMarkPrices, 'BTCUSDT');

  // OR

  let markPrices_stream = await binance.websockets.futures.markPrice(handleMarkPrices);
```
```js
{
  event: 'markPriceUpdate',
  time: 1666065821008,
  symbol: 'BTCUSDT',
  markPrice: 19544.48555407,
  indexPrice: 19524.91580127,
  estimatedSettlePrice: 19551.29863959,
  fundingRate: 0.0001,
  nextFundingTime: 1666080000000
}

// OR for markPrices

[
  {
    event: 'markPriceUpdate',
    time: 1666065858000,
    symbol: 'BTCUSDT',
    markPrice: 19546.51780165,
    indexPrice: 19525.45782647,
    estimatedSettlePrice: 19553.14987671,
    fundingRate: 0.0001,
    nextFundingTime: 1666080000000
  },
  {
    event: 'markPriceUpdate',
    time: 1666065858000,
    symbol: 'ETHUSDT',
    markPrice: 1332.18367392,
    indexPrice: 1331.70486451,
    estimatedSettlePrice: 1332.77557051,
    fundingRate: -5.7e-7,
    nextFundingTime: 1666080000000
  },
  {
    event: 'markPriceUpdate',
    time: 1666065858000,
    symbol: 'BCHUSDT',
    markPrice: 110.55,
    indexPrice: 110.23708497,
    estimatedSettlePrice: 110.58666965,
    fundingRate: 0.00002857,
    nextFundingTime: 1666080000000
  },
  ...
]
```


### futures .lastPrice():
**Update Speed**: 1000ms, 250ms or 100ms
```js
  let allSymbols_lastPrice = await binance.websockets.futures.lastPrice(console.log);     // Update Speed: 1000ms
  // OR
  let BTC_lastPrice = await binance.websockets.futures.lastPrice(console.log, 'BTCUSDT'); // Update Speed: 250ms
  // OR
  let BTC_fast_lastPrice = await binance.websockets.futures.lastPrice(console.log, 'BTCUSDT', true);  // Update Speed: 100ms
```
```js
{ BTCUSDT: 19849.1 }
```


### futures .candlesticks():
**Update Speed**: 250ms
```js
  let candleSticks_1m = await binance.websockets.futures.candlesticks('BTCUSDT', '1m', (data) => {
    //  do something with the data
  });
  // OR
  let candleSticks_3m = await binance.websockets.futures.candlesticks('BTCUSDT', '3m', ...);
  // OR
  ...
  // OR
  let candleSticks_1w = await binance.websockets.futures.candlesticks('BTCUSDT', '1w', ...);
```
```js
{
  event: 'kline',
  time: 1666106237760,
  symbol: 'BTCUSDT',
  candle: {
    startTime: 1666106220000,
    closeTime: 1666106279999,
    symbol: 'BTCUSDT',
    interval: '1m',
    firstTradeId: 2966120155,
    lastTradeId: 2966122134,
    open: 19336.3,
    close: 19334.3,
    high: 19341.4,
    low: 19330,
    baseAssetVolume: 400.183,
    tradesCount: 1980,
    closed: false,
    quoteAssetVolume: 7737017.6763,
    takerBuy_baseAssetVolume: 149.955,
    takerBuy_quoteAssetVolume: 2899194.6344
  }
}
```


### futures .continuousContractKline():
**Update Speed**: 250ms
```js
  let contractType = 'PERPETUAL' /*OR*/ 'CURRENT_QUARTER' /*OR*/ 'NEXT_QUARTER';  // PERPETUAL in this example

  let contKline_stream = await binance.websockets.futures.continuousContractKline('BTCUSDT', contractType, '1m', (data) => {
    // do something with the data
  })
```
```js
{
  event: 'continuous_kline',
  time: 1666118290399,
  pair: 'BTCUSDT',
  contractType: 'PERPETUAL',
  candle: {
    startTime: 1666118280000,
    closeTime: 1666118339999,
    interval: '1m',
    firstTradeId: 2044061809633,
    lastTradeId: 2044062485620,
    open: 19324.7,
    close: 19337.5,
    high: 19338.6,
    low: 19324.7,
    volume: 139.873,
    tradesCount: 722,
    closed: false,
    quoteAssetVolume: 2704114.6268,
    takerBuy_volume: 2248131.7085
  }
}
```


### futures .miniTicker():
**Update Speed**: 500ms with symbol, 1000ms without
```js
  let miniTicker_BTC_stream = await binance.websockets.futures.miniTicker(handleMiniTicker, 'BTCUSDT');

  // OR

  let miniTickers_stream = await binance.websockets.futures.miniTicker(handleMiniTicker);

  function handleMiniTicker(data) { 
    /* Do something with data */ 
  }
```
```js
{ // for single symbol
  event: '24hrMiniTicker',
  time: 1666119496218,
  symbol: 'BTCUSDT',
  close: 19202.4,
  open: 19514.3,
  high: 19706.4,
  low: 19168.1,
  totalTraded_baseAssetVolume: 558641.933,
  totalTraded_quoteAsset: 10888962515.54
}

// for all symbols
[
  {
    event: '24hrMiniTicker',
    time: 1666119533798,
    symbol: 'IOTXUSDT',
    close: 0.02622,
    open: 0.02693,
    high: 0.0275,
    low: 0.02615,
    totalTraded_baseAssetVolume: 206315637,
    totalTraded_quoteAsset: 5547764.12
  },
  {
    event: '24hrMiniTicker',
    time: 1666119534207,
    symbol: 'BTCUSDT',
    close: 19210,
    open: 19514.3,
    high: 19706.4,
    low: 19168.1,
    totalTraded_baseAssetVolume: 559208.14,
    totalTraded_quoteAsset: 10899835981.56
  },
  {
    event: '24hrMiniTicker',
    time: 1666119534031,
    symbol: 'C98USDT',
    close: 0.3273,
    open: 0.3372,
    high: 0.3439,
    low: 0.3264,
    totalTraded_baseAssetVolume: 36659846,
    totalTraded_quoteAsset: 12302196.56
  },
  ...,
  ...
]
```


### futures .ticker():
**Update Speed**: 500ms with symbol, 1000ms without

***Differs from .miniTicker() by the fact that it includes some extra info***
```js
  let ticker_BTC_stream = await binance.websockets.futures.miniTicker(handleMiniTicker, 'BTCUSDT');

  // OR

  let tickers_stream = await binance.websockets.futures.miniTicker(handleMiniTicker);

  function handleTicker(data) { 
    /* Do something with data */ 
  }
```
```js
{ // for single symbol
  event: '24hrTicker',
  time: 1666120161238,
  symbol: 'BTCUSDT',
  priceChange: -328.4,
  percentChange: -1.685,
  weightedAvgPrice: 19484.22,
  lastPrice: 19160.5,
  lastQty: 0.132,
  open: 19488.9,
  high: 19706.4,
  low: 19120,
  totalTraded_baseAssetVolume: 568874.014,
  totalTraded_quoteAssetVolume: 11084066938.98,
  stats_openTime: 1666033740000,
  stats_closeTime: 1666120161232,
  firstTradeId: 2963698045,
  lastTradeId: 2966851613,
  tradesCount: 3153559
}

// for ALL symbols
[
  {
    event: '24hrTicker',
    time: 1666120234860,
    symbol: 'IOTXUSDT',
    priceChange: -0.00067,
    percentChange: -2.492,
    weightedAvgPrice: 0.02688,
    lastPrice: 0.02622,
    lastQty: 1089,
    open: 0.02689,
    high: 0.0275,
    low: 0.02615,
    totalTraded_baseAssetVolume: 208375799,
    totalTraded_quoteAssetVolume: 5601158.57,
    stats_openTime: 1666033800000,
    stats_closeTime: 1666120234855,
    firstTradeId: 105814832,
    lastTradeId: 105848644,
    tradesCount: 33813
  },
  {
    event: '24hrTicker',
    time: 1666120235211,
    symbol: 'DOGEBUSD',
    priceChange: -0.00078,
    percentChange: -1.312,
    weightedAvgPrice: 0.059659,
    lastPrice: 0.05867,
    lastQty: 13898,
    open: 0.05945,
    high: 0.06111,
    low: 0.0585,
    totalTraded_baseAssetVolume: 322261316,
    totalTraded_quoteAssetVolume: 19225848.87,
    stats_openTime: 1666033800000,
    stats_closeTime: 1666120235201,
    firstTradeId: 58055156,
    lastTradeId: 58105191,
    tradesCount: 50036
  },
  ...,
  ...
]
```


### futures .bookTicker():
**Update Speed**: *Realtime*: approx 5000 updates/second for ALL symbols, but each symbol differs immensely, BTCUSDT averages 300 updates/second
```js
  let bookTicker_BTC_stream = await binance.websockets.futures.bookTicker(handleBookTicker, 'BTCUSDT');

  // OR

  let bookTicker_stream = await binance.websockets.futures.bookTicker(handleBookTicker);
```
```js
{
  event: 'bookTicker',
  updateId: 2047601210938,
  time: 1666205026117,
  transactionTime: 1666205026113,
  symbol: 'THETAUSDT',
  bestBidPrice: 1.011,
  bestBidQty: 26445.9,
  bestAskPrice: 1.012,
  bestAskQty: 60875.7
}
```


### futures .liquidationOrders():
**Update Speed**: 1000ms
```js
  let liquidations_BTC_stream = await binance.websockets.futures.liquidationOrders(handleLiquidations, 'BTCUSDT');

  // OR

  let liquidations_stream = await binance.websockets.futures.liquidationOrders(handleLiquidations);

  function handleLiquidations(data) {
    // do something with the data
  }
```
```js
{
  event: 'forceOrder',
  time: 1666138368392,
  order: {
    symbol: 'ANKRUSDT',
    side: 'SELL',
    orderType: 'LIMIT',
    timeInForce: 'IOC',
    Qty: 153515,
    price: 0.031913,
    avgPrice: 0.032262,
    status: 'FILLED',
    order_lastFilledQty: 33073,
    order_filledAccumulatedQty: 153515,
    order_tradeTime: 1666138368387
  }
}
```


### futures .partialBookTicker():
**Update Speed**: 500ms, 250ms or 100ms

***HOW TO MANAGE A LOCAL ORDER BOOK CORRECTLY***

1. Open a stream via partialBookTicker("SYMBOL", ...)

2. Buffer the events you receive from the stream. For same price, latest received update covers the previous one.

3. Get a depth snapshot from futuresOrderBook("SYMBOL", 1000).

4. Drop any event where `finalUpdateId` is < `lastUpdateId` in the snapshot.

5. The first processed event should have `firstUpdateId` <= `lastUpdateId` AND `finalUpdateId` >= `lastUpdateId`

6. While listening to the stream, each new event's `previousStream_finalUpdateId` should be equal to the previous event's `finalUpdateId`, otherwise initialize the process from step 3.

- The data in each event is the absolute quantity for a price level.

- If the quantity is 0, remove the price level.

- Receiving an event that removes a price level that is not in your local order book can happen and is normal.

**Maybe when I use this and understand this better myself, I can add this to the library, send me a message if you are interested in me adding this.**
```js
  await .futures.partialBookTicker('BTCUSDT', 5, '500ms', handleBookTickers);
  // OR
  await binance.websockets.futures.partialBookTicker('BTCUSDT', 5, '250ms', handleBookTickers);
  // OR
  await binance.websockets.futures.partialBookTicker('BTCUSDT', 5, '100ms', handleBookTickers);
```
```js
{
  U: 2050041436271,   // idk what those are, so it was hard to rename them, so I kept them as they are
  u: 2050041447559,   // idk what those are, so it was hard to rename them, so I kept them as they are
  pu: 2050041436200,  // idk what those are, so it was hard to rename them, so I kept them as they are
  event: 'depthUpdate',
  time: 1666268277100,
  transactionTime: 1666268277094,
  symbol: 'BTCUSDT',
  bids: [
    [ 19216.1, 20.283 ],
    [ 19216, 0.213 ],
    [ 19215.8, 3.19 ],
    [ 19215.7, 9.11 ],
    [ 19215.6, 0.142 ],
    ...
  ],
  asks: [
    [ 19216.2, 1.412 ],
    [ 19216.4, 1.416 ],
    [ 19216.8, 0.008 ],
    [ 19216.9, 0.381 ],
    [ 19217, 1 ],
    ...
  ]
}
```


### futures .compositeIndexSymbol():
**Update Speed**: 1000ms
```js
  let DEFI_compositeIndex_stream = await binance.websockets.futures.compositeIndexSymbol('BTCUSDT', handleCompositeIndex);
```
```js
{
  event: 'compositeIndex',
  time: 1666269777010,
  symbol: 'DEFIUSDT',
  price: 659.52193937,
  baseAsset: 'baseAsset',
  composition: [
    {
      b: '1INCH',
      quoteAsset: 'USDT',
      weightInQty: 35.2790071,
      weightInPercentage: 0.030245,
      indexPrice: 0.56507234
    },
    {
      b: 'AAVE',
      quoteAsset: 'USDT',
      weightInQty: 0.43612226,
      weightInPercentage: 0.054492,
      indexPrice: 82.28923147
    },
    {
      b: 'ALGO',
      quoteAsset: 'USDT',
      weightInQty: 133.17753636,
      weightInPercentage: 0.062715,
      indexPrice: 0.31164673
    },
    {
      b: 'ALPHA',
      quoteAsset: 'USDT',
      weightInQty: 125.56278837,
      weightInPercentage: 0.020528,
      indexPrice: 0.10853437
    },
    ...,
    ...
  ]
}
```


### futures .userData():
**Update Speed**: *Realtime*
```js
  let userData = await binance.websockets.futures.userData((data) => {
    if(data.event == 'MARGIN_CALL') handleMarginCall(data);
    else if(data.event == 'ACCOUNT_UPDATE') handleAccountUpdate(data);
    else if(data.event == 'ORDER_TRADE_UPDATE') handleOrderUpdate(data);
    else if(data.event == 'ACCOUNT_CONFIG_UPDATE') handleConfigUpdate(data);
  })
```

#### These are the possible updates and their functions:

#### MARGIN_CALL:
- When the user's position risk ratio is too high, this stream will be pushed.
- This message is only used as risk guidance information and is not recommended for investment strategies.
- In the case of a highly volatile market, there may be the possibility that the user's position has been liquidated at the same time when this stream is pushed out.
##### handleMarginCall():
```js
  function handleMarginCall(data) {
    // do something with the Margin Call data...
  }
```
***This is the data received on MARGIN_CALL updates***:
```js
{
    "event": "MARGIN_CALL",                  // Event Type
    "time": 1587727187525,                   // Event Time
    "crossWalletBalance": 3.16812045,        // Cross Wallet Balance. Only pushed with crossed position margin call
    "positions":      
    [                                       // Position(s) of Margin Call         
      {
        "symbol": "ETHUSDT",                      // Symbol
        "positionSide": "LONG",                   // Position Side
        "positionAmt": 1.327,                     // Position Amount
        "marginType": "CROSSED",                  // Margin Type
        "isolatedWallet": 0,                      // Isolated Wallet (if isolated position)
        "markPrice": 187.17127,                   // Mark Price
        "unrealizedPnl": -1.166074,               // Unrealized PnL
        "maintenanceMarginRequired": 1.614445     // Maintenance Margin Required
      },
      ...,
      ...
    ]
}  
```


#### ACCOUNT_UPDATE:
- When balance or position get updated, this event will be pushed.
- - ***ACCOUNT_UPDATE*** will be pushed only when update happens on user's account, including changes on **balances**, **positions**, or **margin** type.
- - **Unfilled orders** or **cancelled orders** will not make the event ***ACCOUNT_UPDATE*** pushed, since there's **no change on positions**.
- - "**positions**" in ***ACCOUNT_UPDATE***: Only **symbols** of **changed positions** will be pushed.
- When "**FUNDING FEE**" changes to the user's balance, the event will be pushed with the brief message:
- - When "**FUNDING FEE**" occurs in a crossed position, ACCOUNT_UPDATE will be pushed with only the balance(including the "**FUNDING FEE**" asset only), without any position message.
- - When "**FUNDING FEE**" occurs in an isolated position, ACCOUNT_UPDATE will be pushed with only the balance(including the "**FUNDING FEE**" asset only) and the relative position message( including the isolated position on which the "**FUNDING FEE**" occurs only, without any other position message ).
- The field "eventType" represents the reason type for the event and may shows the following possible types:
- - *DEPOSIT*
- - *WITHDRAW*
- - *ORDER*
- - *FUNDING_FEE*
- - *WITHDRAW_REJECT*
- - *ADJUSTMENT*
- - *INSURANCE_CLEAR*
- - *ADMIN_DEPOSIT*
- - *ADMIN_WITHDRAW*
- - *MARGIN_TRANSFER*
- - *MARGIN_TYPE_CHANGE*
- - *ASSET_TRANSFER*
- - *OPTIONS_PREMIUM_FEE*
- - *OPTIONS_SETTLE_PROFIT*
- - *AUTO_EXCHANGE*
- The field "balanceChange" represents the balance change except for PnL and commission.
#### handleAccountUpdate():
```js
  function handleAccountUpdate(data) {
    // do something with the Account Update data...
  }
```
***This is the data received on ACCOUNT_UPDATE updates***:
```js
{
  "event": "ACCOUNT_UPDATE",
  "time": 1666197269367,
  "transactionTime": 1666197269362,
  "updateData": {
    "eventType": "ORDER",
    "balances": [
      {
        "asset": "USDT",
        "walletBalance": -7.20740215,
        "crossWalletBalance": -7.20740215,
        "balanceChange": 0
      }
    ],
    "positions": [  // <= THIS FIELD CAN BE OMITTED BY BINANCE ON SOME REQUESTS
      {
        "symbol": "BTCUSDT",
        "quoteAsset": "USDT",
        "positionAmt": 0,
        "entryPrice": 0,
        "accumulatedRealized": 0.5417,
        "unrealizedPnl": 0,
        "marginType": "cross",
        "isolatedWallet": 0,
        "positionSide": "BOTH"
      },
      {
        "symbol": "BTCUSDT",
        "quoteAsset": "USDT",
        "positionAmt": 0.001,
        "entryPrice": 19212.1,
        "accumulatedRealized": -0.4172,
        "unrealizedPnl": 1e-8,
        "marginType": "cross",
        "isolatedWallet": 0,
        "positionSide": "LONG"
      },
      {
        "symbol": "BTCUSDT",
        "quoteAsset": "USDT",
        "positionAmt": 0,
        "entryPrice": 0,
        "accumulatedRealized": -0.0081,
        "unrealizedPnl": 0,
        "marginType": "cross",
        "isolatedWallet": 0,
        "positionSide": "SHORT"
      }
    ]
  }
}
```


#### ORDER_TRADE_UPDATE:
When new order created, order status changed will push such event. event type is ***ORDER_TRADE_UPDATE***.

**Side**
- *BUY*
- *SELL*

**Order Type**
- *MARKET*
- *LIMIT*
- *STOP*
- *TAKE_PROFIT*
- *LIQUIDATION*

**Execution Type**
- *NEW*
- *CANCELED*
- *CALCULATED* - Liquidation Execution
- *EXPIRED*
- *TRADE*

**Order Status**
*NEW*
*PARTIALLY_FILLED*
*FILLED*
*CANCELED*
*EXPIRED*
*NEW_INSURANCE* - Liquidation with Insurance Fund
*NEW_ADL* - Counterparty Liquidation`

**Time in force**
- *GTC*
- *IOC*
- *FOK*
- *GTX*

**Working Type**
- *MARK_PRICE*
- *CONTRACT_PRICE*

**Liquidation and ADL**:
- If user gets liquidated due to insufficient margin balance:
- - If liquidation Counterparty is market: **clientOrderId** shows as "**autoclose***-XXX*", **orderStatus** shows as "**NEW**"
- - If liquidation Counterparty is insurance fund: **clientOrderId** shows as "**autoclose***-XXX*", **orderStatus** shows as "**NEW_INSURANCE**"
- - If liquidation Counterparty is ADL counterparty: **clientOrderId** shows as "**autoclose***-XXX*", **orderStatus** shows as "**NEW_ADL**"
- If user has enough margin balance but gets ADL:
- - **clientOrderId** shows as "**adl_autoclose**", **orderStatus** shows as "**NEW**"
#### handleOrderUpdate():
```js
  function handleOrderUpdate(data) {
    // do something with the Account Order Update data
  }
```
***This is the data received on ORDER_TRADE_UPDATE updates***:
```js
{
  "event": "ORDER_TRADE_UPDATE",
  "time": 1666199193550,
  "transactionTime": 1666199193546,
  "order": {
    "symbol": "BTCBUSD",
    "clientOrderId": "ios_sSjEWbH5Q0dccSEDxssv",
    "side": "BUY",
    "orderType": "MARKET",
    "timeInForce": "GTC",
    "origQty": 0.001,
    "origPrice": 0,
    "avgPrice": 19131.8,
    "stopPrice": 0,
    "executionType": "TRADE",
    "orderStatus": "FILLED",
    "orderId": 15945747278,
    "lastFilledQty": 0.001,
    "filledAccumulatedQty": 0.001,
    "lastFilledPrice": 19131.8,
    "commissionAsset": "BUSD",
    "commission": 0.00573954,
    "tradeTime": 1666199193546,
    "tradeId": 317896923,
    "bidsNotional": 0,
    "askNotional": 0,
    "maker": false,
    "reduceOnly": false,
    "stopPrice_workingType": "CONTRACT_PRICE",
    "originalOrderType": "MARKET",
    "positionSide": "LONG",
    "closeAll": false,
    "realizedProfit": 0
  }
}
```









# *CONTACT ME*
### Email: <a href='gtedz1961@gmail.com'>gtedz1961@gmail.com</a>
### 
