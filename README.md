# Binance-lib
 A JS library for binance, only the basic features, but will solve some of the problems that 'node-binance-api' hasn't yet fixed, like receiving futures position info such as entryPrice as a response order request, and for you to add any other additional stuff easily in the files.

 ***WILL include all SPOT, MARGIN, FUTURES<a href='#futures-documentation'><sup>ref</sup></a> and EUROPEAN market/account/trade/websocket options***

 **Futures API almost fully implemented for now, documentation will come shortly**

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
    useServerTime: true,  // recommended for everyone, it syncs time to the server's time
    fetchFloats: true,    // <- **DOES NOT ALTER THE RESULTS** *HIGHLY RECOMMENDED AS IT FETCHES EVERYTHING AS INT (and obviously bigInts and strings to strings), always keep it on*
    hedgeMode: false,     // You can set the value or not, either way the library will handle it automatically if it receives an error about your hedgeMode setting not matching your request
    extraInfo: false      // <- this will return some extra data like your APIKeys' "Used Weight" and the Server Processing Time for your request and the latency (or total elapsed time from sending the request and receiving the response)
  // if you set 'extraInfo' to true, you will have to access your response data via the .data property of the response variable => 
  // let response = await binance.futuresUserTrades('BTCUSDT');
  // console.log(response.data); <= your response data is in the '.data' property
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

# ***FUTURES DOCUMENTATION:***
### All functions<a href='#All-Futures-Functions'><sup>ref</sup></a>
### Market Data<a href='#Futures-Market-Data'><sup>ref</sup></a>
### Account/Trade<a href='#Futures-Market-Trade'><sup>ref</sup></a>
### Websockets<a href='#Futures-Websockets'><sup>ref</sup></a>

## FUTURES PARAMETER EXPLANATION:
- ***side***: *"BUY"* OR *"SELL"*.
- ***type***: *each comes with additional Mandatory Parameters*:
- - **"LIMIT"**: *"timeInForce", "quantity", "price"*.
- - **"MARKET"**: *"quantity"*.
- - **"STOP"**/**"TAKE_PROFIT"**: *"quantity", "price", "stopPrice"*.
- - **"STOP_MARKET"/"TAKE_PROFIT_MARKET"**: *"stopPrice"*.
- - **"TRAILING_STOP_MARKET"**: *"callbackRate"*.
- ***type_2***: *'1' or 'increase'* or *'2' or 'reduce'*.
- ***marginType***: *"ISOLATED"* or *"CROSSED"*.
- ***positionSide***: *"LONG"* OR *"SHORT"* - it is recommended to always include it when creating new Orders, and the library will take care of removing it automatically if your account isn't on hedgeMode.
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
- ***contractType***: *"PERPETUAL", "CURRENT_QUARTER", "NEXT_QUARTER"*.
- ***startTime*** & ***endTime***<a href='#Using-startTime-and-endTime'><sup>ref</sup></a> (INTEGERS): *mostly* should be sent together, you can transform any date into UNIX time via the following: *'new Date().getTime();'* OR *'new Date('10/12/2022, 10:52:26 PM').getTime();'* (since binance uses the UNIX time system).
- ***dualSidePosition***: *"true"* or *"false"* for hedgeMode if turned on or not.
- ***multiAssetMargin***: *"true"* or *"false"* for Multi-Asset-Mode if turned on or not.
- ***incomeType***: *'TRANSFER', 'WELCOME_BONUS', 'REALIZED_PNL', 'FUNDING_FEE', 'COMMISSION', 'INSURANCE_CLEAR', 'REFERRAL_KICKBACK', 'COMMISSION_REBATE', 'MARKET_MAKER_REBATE', 'API_REBATE', 'CONTEST_REWARD', 'CROSS_COLLATERAL_TRANSFER', 'OPTIONS_PREMIUM_FEE', 'OPTIONS_SETTLE_PROFIT', 'INTERNAL_TRANSFER', 'AUTO_EXCHANGE', 'DELIVERED_SETTELMENT', 'COIN_SWAP_DEPOSIT', 'COIN_SWAP_WITHDRAW', 'POSITION_LIMIT_INCREASE_FEE'*.

## ALL FUTURES FUNCTIONS:
|FUNCTIONS                                                                                           |REQUIRED PARAMETERS<a href='#futures-Parameters-Explanation'><sup>ref</sup></a> |OPTIONAL PARAMETERS<a href='#fParameters-Explanation'><sup>ref</sup></a>|OPTIONS = {} <a href='#options--'><sup>ref</sup></a>|
|:---------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------:|:-------------------------------------------------------:|:--------------:|
|futuresPing()                                              <a href='#futuresPing'><sup>ref</sup></a>|                                                                         |reconnect, tries                                         |                |
|futuresServerTime()                                  <a href='#futuresServerTime'><sup>ref</sup></a>|                                                                         |reconnect, tries                                         |                |
|futuresExchangeInfo()                              <a href='#futuresExchangeInfo'><sup>ref</sup></a>|                                                                         |reconnect, tries                                         |(BOOLS ONLY): quantityPrecision, pricePrecision, contractType, status, baseAsset, quoteAsset, marginAsset, baseAssetPrecision, quotePrecision, minNotional, timeInForce, orderTypes, priceFilters, priceFilters, lotFilters, marketLotFilters, maxNumOrders, maxNumAlgoOrders, percentPriceFilters|
|futuresOrderBook()                                    <a href='#futuresOrderBook'><sup>ref</sup></a>|symbol                                                                   |limit                                                    |                |
|futuresRecentTrades()                              <a href='#futuresRecentTrades'><sup>ref</sup></a>|symbol                                                                   |limit                                                    |                |
|futuresHistoricalTrades()                      <a href='#futuresHistoricalTrades'><sup>ref</sup></a>|symbol                                                                   |limit, fromId                                            |                |
|futuresAggTrades()                                    <a href='#futuresAggTrades'><sup>ref</sup></a>|symbol                                                                   |limit, startTime, endTime, fromId                        |                |
|futuresCandlesticks()                              <a href='#futuresCandlesticks'><sup>ref</sup></a>|symbol, interval                                                         |limit, startTime, endTime, fromId                        |                |
|futuresContinuousCandlesticks()          <a href='#futuresContinuousCandlesticks'><sup>ref</sup></a>|pair, interval, contractType                                             |limit, startTime, endTime                                |                |
|futuresIndexPriceCandlesticks()          <a href='#futuresIndexPriceCandlesticks'><sup>ref</sup></a>|pair, interval                                                           |                                                         |                |
|futuresMarkPriceCandlesticks()            <a href='#futuresMarkPriceCandlesticks'><sup>ref</sup></a>|symbol, interval                                                         |limit, startTime, endTime                                |                |
|futuresMarkPrice()                                    <a href='#futuresMarkPrice'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresFundingRate()                                <a href='#futuresFundingRate'><sup>ref</sup></a>|                                                                         |symbol, limit, startTime, endTime                        |                |
|futures24hrTicker()                                  <a href='#futures24hrTicker'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresPrices()                                          <a href='#futuresPrices'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresOpenInterestStatistics()          <a href='#futuresOpenInterestStatistics'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresOpenInterest()                              <a href='#futuresOpenInterest'><sup>ref</sup></a>|symbol                                                                   |                                                         |                |
|futuresBookTicker()                                  <a href='#futuresBookTicker'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresTopLongShortAccountRatio()      <a href='#futuresTopLongShortAccountRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresTopLongShortPositionRatio()    <a href='#futuresTopLongShortPositionRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresGlobalLongShortAccountRatio()<a href='#futuresGlobalLongShortAccountRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresTakerlongshortRatio()                <a href='#futuresTakerlongshortRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
|futuresBLVTCandlesticks()                      <a href='#futuresBLVTCandlesticks'><sup>ref</sup></a>|symbol, interval                                                         |limit, startTime, endTime                                |                |
|futuresIndexInfo()                                    <a href='#futuresIndexInfo'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresMultiAssetModeIndex()                <a href='#futuresMultiAssetModeIndex'><sup>ref</sup></a>|                                                                         |symbol                                                   |                |
|futuresChangePositionSide()                  <a href='#futuresChangePositionSide'><sup>ref</sup></a>|dualSidePosition                                                         |                                                         |recvWindow      |
|futuresGetPositionSide()                        <a href='#futuresGetPositionSide'><sup>ref</sup></a>|multiAssetsMargin                                                        |                                                         |recvWindow      |
|futuresChangeMultiAssetMargin()          <a href='#futuresChangeMultiAssetMargin'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresGetMultiAssetMargin()                <a href='#futuresGetMultiAssetMargin'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresMarketBuy()                                    <a href='#futuresMarketBuy'><sup>ref</sup></a>|symbol, quantity                                                         |                                                         |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, recvWindow|
|futuresMarketSell()                                  <a href='#futuresMarketSell'><sup>ref</sup></a>|symbol, quantity                                                         |                                                         |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, recvWindow|
|futuresBuy()                                                <a href='#futuresBuy'><sup>ref</sup></a>|symbol, quantity, price                                                  |                                                         |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresSell()                                              <a href='#futuresSell'><sup>ref</sup></a>|symbol, quantity, price                                                  |                                                         |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresCreateOrder()                                <a href='#futuresCreateOrder'><sup>ref</sup></a>|symbol, side, type                                                       |                                                         |positionSide, reduceOnly, closePosition, quantity, price, stopPrice, activationPrice, callbackRate, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresMultipleOrders()                          <a href='#futuresMultipleOrders'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresOrder()                                            <a href='#futuresOrder'><sup>ref</sup></a>|symbol, orderId OR origClientOrderId                                     |                                                         |recvWindow      |
|futuresCancelOrder()                                <a href='#futuresCancelOrder'><sup>ref</sup></a>|symbol, orderId OR origClientOrderId                                     |                                                         |recvWindow      |
|futuresCancelAll()                                    <a href='#futuresCancelAll'><sup>ref</sup></a>|symbol                                                                   |                                                         |recvWindow      |
|futuresCancelBatchOrders()                    <a href='#futuresCancelBatchOrders'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresCountdownCancelAll()                  <a href='#futuresCountdownCancelAll'><sup>ref</sup></a>|symbol, countdownTime                                                    |                                                         |recvWindow      |
|futuresOpenOrder()                                    <a href='#futuresOpenOrder'><sup>ref</sup></a>|symbol, orderId OR origClientOrderId                                     |                                                         |recvWindow      |
|futuresOpenOrders()                                  <a href='#futuresOpenOrders'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresAllOrders()                                    <a href='#futuresAllOrders'><sup>ref</sup></a>|symbol                                                                   |orderId, limit, startTime, endTime                       |recvWindow      |
|futuresBalance()                                        <a href='#futuresBalance'><sup>ref</sup></a>|                                                                         |reconnect, tries                                         |recvWindow      |
|futuresAccount()                                        <a href='#futuresAccount'><sup>ref</sup></a>|                                                                         |(BOOLS ONLY): activePositionsOnly, activeAssets                        |recvWindow      |
|futuresLeverage()                                      <a href='#futuresLeverage'><sup>ref</sup></a>|symbol, leverage                                                         |                                                         |recvWindow      |
|futuresLeverageBrackets()                      <a href='#futuresLeverageBrackets'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresMarginType()                                  <a href='#futuresMarginType'><sup>ref</sup></a>|symbol, amount, marginType                                               |                                                         |recvWindow      |
|futuresPositionMargin()                          <a href='#futuresPositionMargin'><sup>ref</sup></a>|symbol, amount, type_2                                                   |                                                         |positionSide, recvWindow|
|futuresPositionMarginHistory()            <a href='#futuresPositionMarginHistory'><sup>ref</sup></a>|symbol                                                                   |limit, type_2, startTime, endTime                        |recvWindow      |
|futuresPositionRisk()                              <a href='#futuresPositionRisk'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |
|futuresUserTrades()                                  <a href='#futuresUserTrades'><sup>ref</sup></a>|                                                                         |symbol, limit, incomeType, startTime, endTime            |recvWindow      |
|futuresIncomeHistory()                            <a href='#futuresIncomeHistory'><sup>ref</sup></a>|                                                                         |                                                         |recvWindow      |
|futuresADLQuantileEstimation()            <a href='#futuresADLQuantileEstimation'><sup>ref</sup></a>|                                                                         |symbol                                                   |recvWindow      |

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
  console.log(exchangeInfo);
```
<details>
 <summary>View Response</summary>

 ```js
 {
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
  EOSUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'EOS',
    quoteAsset: 'USDT'
  },
  LTCUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'LTC',
    quoteAsset: 'USDT'
  },
  TRXUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'TRX',
    quoteAsset: 'USDT'
  },
  ETCUSDT: {
    quantityPrecision: 2,
    pricePrecision: 3,
    baseAsset: 'ETC',
    quoteAsset: 'USDT'
  },
  LINKUSDT: {
    quantityPrecision: 2,
    pricePrecision: 3,
    baseAsset: 'LINK',
    quoteAsset: 'USDT'
  },
  XLMUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'XLM',
    quoteAsset: 'USDT'
  },
  ADAUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'ADA',
    quoteAsset: 'USDT'
  },
  XMRUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'XMR',
    quoteAsset: 'USDT'
  },
  DASHUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'DASH',
    quoteAsset: 'USDT'
  },
  ZECUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'ZEC',
    quoteAsset: 'USDT'
  },
  XTZUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'XTZ',
    quoteAsset: 'USDT'
  },
  BNBUSDT: {
    quantityPrecision: 2,
    pricePrecision: 3,
    baseAsset: 'BNB',
    quoteAsset: 'USDT'
  },
  ATOMUSDT: {
    quantityPrecision: 2,
    pricePrecision: 3,
    baseAsset: 'ATOM',
    quoteAsset: 'USDT'
  },
  ONTUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'ONT',
    quoteAsset: 'USDT'
  },
  IOTAUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'IOTA',
    quoteAsset: 'USDT'
  },
  BATUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'BAT',
    quoteAsset: 'USDT'
  },
  VETUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'VET',
    quoteAsset: 'USDT'
  },
  NEOUSDT: {
    quantityPrecision: 2,
    pricePrecision: 3,
    baseAsset: 'NEO',
    quoteAsset: 'USDT'
  },
  QTUMUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'QTUM',
    quoteAsset: 'USDT'
  },
  IOSTUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'IOST',
    quoteAsset: 'USDT'
  },
  THETAUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'THETA',
    quoteAsset: 'USDT'
  },
  ALGOUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'ALGO',
    quoteAsset: 'USDT'
  },
  ZILUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'ZIL',
    quoteAsset: 'USDT'
  },
  KNCUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'KNC',
    quoteAsset: 'USDT'
  },
  ZRXUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'ZRX',
    quoteAsset: 'USDT'
  },
  COMPUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'COMP',
    quoteAsset: 'USDT'
  },
  OMGUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'OMG',
    quoteAsset: 'USDT'
  },
  DOGEUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'DOGE',
    quoteAsset: 'USDT'
  },
  SXPUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'SXP',
    quoteAsset: 'USDT'
  },
  KAVAUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'KAVA',
    quoteAsset: 'USDT'
  },
  BANDUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'BAND',
    quoteAsset: 'USDT'
  },
  RLCUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'RLC',
    quoteAsset: 'USDT'
  },
  WAVESUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'WAVES',
    quoteAsset: 'USDT'
  },
  MKRUSDT: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'MKR',
    quoteAsset: 'USDT'
  },
  SNXUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'SNX',
    quoteAsset: 'USDT'
  },
  DOTUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'DOT',
    quoteAsset: 'USDT'
  },
  DEFIUSDT: {
    quantityPrecision: 3,
    pricePrecision: 1,
    baseAsset: 'DEFI',
    quoteAsset: 'USDT'
  },
  YFIUSDT: {
    quantityPrecision: 3,
    pricePrecision: 1,
    baseAsset: 'YFI',
    quoteAsset: 'USDT'
  },
  BALUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'BAL',
    quoteAsset: 'USDT'
  },
  CRVUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'CRV',
    quoteAsset: 'USDT'
  },
  TRBUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'TRB',
    quoteAsset: 'USDT'
  },
  RUNEUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'RUNE',
    quoteAsset: 'USDT'
  },
  SUSHIUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'SUSHI',
    quoteAsset: 'USDT'
  },
  SRMUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'SRM',
    quoteAsset: 'USDT'
  },
  EGLDUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'EGLD',
    quoteAsset: 'USDT'
  },
  SOLUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'SOL',
    quoteAsset: 'USDT'
  },
  ICXUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'ICX',
    quoteAsset: 'USDT'
  },
  STORJUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'STORJ',
    quoteAsset: 'USDT'
  },
  BLZUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'BLZ',
    quoteAsset: 'USDT'
  },
  UNIUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'UNI',
    quoteAsset: 'USDT'
  },
  AVAXUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'AVAX',
    quoteAsset: 'USDT'
  },
  FTMUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'FTM',
    quoteAsset: 'USDT'
  },
  HNTUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'HNT',
    quoteAsset: 'USDT'
  },
  ENJUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'ENJ',
    quoteAsset: 'USDT'
  },
  FLMUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'FLM',
    quoteAsset: 'USDT'
  },
  TOMOUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'TOMO',
    quoteAsset: 'USDT'
  },
  RENUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'REN',
    quoteAsset: 'USDT'
  },
  KSMUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'KSM',
    quoteAsset: 'USDT'
  },
  NEARUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'NEAR',
    quoteAsset: 'USDT'
  },
  AAVEUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'AAVE',
    quoteAsset: 'USDT'
  },
  FILUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'FIL',
    quoteAsset: 'USDT'
  },
  RSRUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'RSR',
    quoteAsset: 'USDT'
  },
  LRCUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'LRC',
    quoteAsset: 'USDT'
  },
  MATICUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'MATIC',
    quoteAsset: 'USDT'
  },
  OCEANUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'OCEAN',
    quoteAsset: 'USDT'
  },
  CVCUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'CVC',
    quoteAsset: 'USDT'
  },
  BELUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'BEL',
    quoteAsset: 'USDT'
  },
  CTKUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'CTK',
    quoteAsset: 'USDT'
  },
  AXSUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'AXS',
    quoteAsset: 'USDT'
  },
  ALPHAUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'ALPHA',
    quoteAsset: 'USDT'
  },
  ZENUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'ZEN',
    quoteAsset: 'USDT'
  },
  SKLUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'SKL',
    quoteAsset: 'USDT'
  },
  GRTUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'GRT',
    quoteAsset: 'USDT'
  },
  '1INCHUSDT': {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: '1INCH',
    quoteAsset: 'USDT'
  },
  BTCBUSD: {
    quantityPrecision: 3,
    pricePrecision: 1,
    baseAsset: 'BTC',
    quoteAsset: 'BUSD'
  },
  CHZUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'CHZ',
    quoteAsset: 'USDT'
  },
  SANDUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'SAND',
    quoteAsset: 'USDT'
  },
  ANKRUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'ANKR',
    quoteAsset: 'USDT'
  },
  BTSUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'BTS',
    quoteAsset: 'USDT'
  },
  LITUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'LIT',
    quoteAsset: 'USDT'
  },
  UNFIUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'UNFI',
    quoteAsset: 'USDT'
  },
  REEFUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'REEF',
    quoteAsset: 'USDT'
  },
  RVNUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'RVN',
    quoteAsset: 'USDT'
  },
  SFPUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'SFP',
    quoteAsset: 'USDT'
  },
  XEMUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'XEM',
    quoteAsset: 'USDT'
  },
  BTCSTUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'BTCST',
    quoteAsset: 'USDT'
  },
  COTIUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'COTI',
    quoteAsset: 'USDT'
  },
  CHRUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'CHR',
    quoteAsset: 'USDT'
  },
  MANAUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'MANA',
    quoteAsset: 'USDT'
  },
  ALICEUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'ALICE',
    quoteAsset: 'USDT'
  },
  HBARUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'HBAR',
    quoteAsset: 'USDT'
  },
  ONEUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'ONE',
    quoteAsset: 'USDT'
  },
  LINAUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'LINA',
    quoteAsset: 'USDT'
  },
  STMXUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'STMX',
    quoteAsset: 'USDT'
  },
  DENTUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'DENT',
    quoteAsset: 'USDT'
  },
  CELRUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'CELR',
    quoteAsset: 'USDT'
  },
  HOTUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'HOT',
    quoteAsset: 'USDT'
  },
  MTLUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'MTL',
    quoteAsset: 'USDT'
  },
  OGNUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'OGN',
    quoteAsset: 'USDT'
  },
  NKNUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'NKN',
    quoteAsset: 'USDT'
  },
  SCUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'SC',
    quoteAsset: 'USDT'
  },
  DGBUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'DGB',
    quoteAsset: 'USDT'
  },
  '1000SHIBUSDT': {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: '1000SHIB',
    quoteAsset: 'USDT'
  },
  BAKEUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'BAKE',
    quoteAsset: 'USDT'
  },
  GTCUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'GTC',
    quoteAsset: 'USDT'
  },
  ETHBUSD: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'ETH',
    quoteAsset: 'BUSD'
  },
  BTCDOMUSDT: {
    quantityPrecision: 3,
    pricePrecision: 1,
    baseAsset: 'BTCDOM',
    quoteAsset: 'USDT'
  },
  TLMUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'TLM',
    quoteAsset: 'USDT'
  },
  BNBBUSD: {
    quantityPrecision: 2,
    pricePrecision: 3,
    baseAsset: 'BNB',
    quoteAsset: 'BUSD'
  },
  ADABUSD: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'ADA',
    quoteAsset: 'BUSD'
  },
  XRPBUSD: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'XRP',
    quoteAsset: 'BUSD'
  },
  IOTXUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'IOTX',
    quoteAsset: 'USDT'
  },
  DOGEBUSD: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'DOGE',
    quoteAsset: 'BUSD'
  },
  AUDIOUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'AUDIO',
    quoteAsset: 'USDT'
  },
  RAYUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'RAY',
    quoteAsset: 'USDT'
  },
  C98USDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'C98',
    quoteAsset: 'USDT'
  },
  MASKUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'MASK',
    quoteAsset: 'USDT'
  },
  ATAUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'ATA',
    quoteAsset: 'USDT'
  },
  SOLBUSD: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'SOL',
    quoteAsset: 'BUSD'
  },
  FTTBUSD: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'FTT',
    quoteAsset: 'BUSD'
  },
  DYDXUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'DYDX',
    quoteAsset: 'USDT'
  },
  '1000XECUSDT': {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: '1000XEC',
    quoteAsset: 'USDT'
  },
  GALAUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'GALA',
    quoteAsset: 'USDT'
  },
  CELOUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'CELO',
    quoteAsset: 'USDT'
  },
  ARUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'AR',
    quoteAsset: 'USDT'
  },
  KLAYUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'KLAY',
    quoteAsset: 'USDT'
  },
  ARPAUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'ARPA',
    quoteAsset: 'USDT'
  },
  CTSIUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'CTSI',
    quoteAsset: 'USDT'
  },
  LPTUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'LPT',
    quoteAsset: 'USDT'
  },
  ENSUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'ENS',
    quoteAsset: 'USDT'
  },
  PEOPLEUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'PEOPLE',
    quoteAsset: 'USDT'
  },
  ANTUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'ANT',
    quoteAsset: 'USDT'
  },
  ROSEUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'ROSE',
    quoteAsset: 'USDT'
  },
  DUSKUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'DUSK',
    quoteAsset: 'USDT'
  },
  FLOWUSDT: {
    quantityPrecision: 1,
    pricePrecision: 3,
    baseAsset: 'FLOW',
    quoteAsset: 'USDT'
  },
  IMXUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'IMX',
    quoteAsset: 'USDT'
  },
  API3USDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'API3',
    quoteAsset: 'USDT'
  },
  GMTUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'GMT',
    quoteAsset: 'USDT'
  },
  APEUSDT: {
    quantityPrecision: 0,
    pricePrecision: 4,
    baseAsset: 'APE',
    quoteAsset: 'USDT'
  },
  BNXUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'BNX',
    quoteAsset: 'USDT'
  },
  WOOUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'WOO',
    quoteAsset: 'USDT'
  },
  FTTUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'FTT',
    quoteAsset: 'USDT'
  },
  JASMYUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'JASMY',
    quoteAsset: 'USDT'
  },
  DARUSDT: {
    quantityPrecision: 1,
    pricePrecision: 4,
    baseAsset: 'DAR',
    quoteAsset: 'USDT'
  },
  GALUSDT: {
    quantityPrecision: 0,
    pricePrecision: 5,
    baseAsset: 'GAL',
    quoteAsset: 'USDT'
  },
  AVAXBUSD: {
    quantityPrecision: 1,
    pricePrecision: 6,
    baseAsset: 'AVAX',
    quoteAsset: 'BUSD'
  },
  NEARBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'NEAR',
    quoteAsset: 'BUSD'
  },
  GMTBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'GMT',
    quoteAsset: 'BUSD'
  },
  APEBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'APE',
    quoteAsset: 'BUSD'
  },
  GALBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'GAL',
    quoteAsset: 'BUSD'
  },
  FTMBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'FTM',
    quoteAsset: 'BUSD'
  },
  DODOBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'DODO',
    quoteAsset: 'BUSD'
  },
  ANCBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'ANC',
    quoteAsset: 'BUSD'
  },
  GALABUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'GALA',
    quoteAsset: 'BUSD'
  },
  TRXBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'TRX',
    quoteAsset: 'BUSD'
  },
  '1000LUNCBUSD': {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: '1000LUNC',
    quoteAsset: 'BUSD'
  },
  LUNA2BUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'LUNA2',
    quoteAsset: 'BUSD'
  },
  OPUSDT: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'OP',
    quoteAsset: 'USDT'
  },
  DOTBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'DOT',
    quoteAsset: 'BUSD'
  },
  TLMBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'TLM',
    quoteAsset: 'BUSD'
  },
  ICPBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'ICP',
    quoteAsset: 'BUSD'
  },
  WAVESBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'WAVES',
    quoteAsset: 'BUSD'
  },
  LINKBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'LINK',
    quoteAsset: 'BUSD'
  },
  SANDBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'SAND',
    quoteAsset: 'BUSD'
  },
  LTCBUSD: {
    quantityPrecision: 2,
    pricePrecision: 6,
    baseAsset: 'LTC',
    quoteAsset: 'BUSD'
  },
  MATICBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'MATIC',
    quoteAsset: 'BUSD'
  },
  CVXBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'CVX',
    quoteAsset: 'BUSD'
  },
  FILBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'FIL',
    quoteAsset: 'BUSD'
  },
  '1000SHIBBUSD': {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: '1000SHIB',
    quoteAsset: 'BUSD'
  },
  LEVERBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'LEVER',
    quoteAsset: 'BUSD'
  },
  ETCBUSD: {
    quantityPrecision: 1,
    pricePrecision: 6,
    baseAsset: 'ETC',
    quoteAsset: 'BUSD'
  },
  LDOBUSD: {
    quantityPrecision: 1,
    pricePrecision: 6,
    baseAsset: 'LDO',
    quoteAsset: 'BUSD'
  },
  UNIBUSD: {
    quantityPrecision: 1,
    pricePrecision: 6,
    baseAsset: 'UNI',
    quoteAsset: 'BUSD'
  },
  AUCTIONBUSD: {
    quantityPrecision: 1,
    pricePrecision: 7,
    baseAsset: 'AUCTION',
    quoteAsset: 'BUSD'
  },
  INJUSDT: {
    quantityPrecision: 1,
    pricePrecision: 6,
    baseAsset: 'INJ',
    quoteAsset: 'USDT'
  },
  STGUSDT: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'STG',
    quoteAsset: 'USDT'
  },
  FOOTBALLUSDT: {
    quantityPrecision: 2,
    pricePrecision: 5,
    baseAsset: 'FOOTBALL',
    quoteAsset: 'USDT'
  },
  SPELLUSDT: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'SPELL',
    quoteAsset: 'USDT'
  },
  '1000LUNCUSDT': {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: '1000LUNC',
    quoteAsset: 'USDT'
  },
  LUNA2USDT: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'LUNA2',
    quoteAsset: 'USDT'
  },
  AMBBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'AMB',
    quoteAsset: 'BUSD'
  },
  PHBBUSD: {
    quantityPrecision: 0,
    pricePrecision: 7,
    baseAsset: 'PHB',
    quoteAsset: 'BUSD'
  },
  LDOUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'LDO',
    quoteAsset: 'USDT'
  },
  CVXUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'CVX',
    quoteAsset: 'USDT'
  },
  BTCUSDT_221230: {
    quantityPrecision: 3,
    pricePrecision: 1,
    baseAsset: 'BTC',
    quoteAsset: 'USDT'
  },
  ETHUSDT_221230: {
    quantityPrecision: 3,
    pricePrecision: 2,
    baseAsset: 'ETH',
    quoteAsset: 'USDT'
  },
  ICPUSDT: {
    quantityPrecision: 0,
    pricePrecision: 6,
    baseAsset: 'ICP',
    quoteAsset: 'USDT'
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
    first_tradeId: 2950259470,
    last_tradeId: 2950259472,
    timestamp: 1665667203902,
    maker: false
  },
  {
    tradeId: 1488689112,
    price: 18278.4,
    qty: 1,
    first_tradeId: 2950259473,
    last_tradeId: 2950259473,
    timestamp: 1665667203902,
    maker: false
  },
  {
    tradeId: 1488689113,
    price: 18278.5,
    qty: 1.077,
    first_tradeId: 2950259474,
    last_tradeId: 2950259475,
    timestamp: 1665667203902,
    maker: false
  },
  {
    tradeId: 1488689114,
    price: 18278.4,
    qty: 0.018,
    first_tradeId: 2950259476,
    last_tradeId: 2950259476,
    timestamp: 1665667203952,
    maker: true
  },
  {
    tradeId: 1488689115,
    price: 18278.5,
    qty: 2.225,
    first_tradeId: 2950259477,
    last_tradeId: 2950259498,
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
  let indexPriceCandlesticks = await binance.futuresIndexPriceCandlesticks('BTCUP', '1m', 5);
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
  {
    symbol: 'CVCUSDT',
    markPrice: 0.11247608,
    indexPrice: 0.11247845,
    estimatedSettlePrice: 0.11114315,
    lastFundingRate: -0.00003552,
    interestRate: 0.0001,
    nextFundingTime: 1665676800000,
    time: 1665669251005
  },
  {
    symbol: 'BTSUSDT',
    markPrice: 0.00909415,
    indexPrice: 0.00909403,
    estimatedSettlePrice: 0,
    lastFundingRate: 0.0001,
    interestRate: 0.0001,
    nextFundingTime: 1665676800000,
    time: 1665669251005
  },
  ...
]
```
</details>



# *CONTACT ME*
### Email: <a href='gtedz1961@gmail.com'>gtedz1961@gmail.com</a>
### 