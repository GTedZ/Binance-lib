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
- ***startTime*** & ***endTime***<a href='#Using-startTime-and-endTime'><sup>how to use</sup></a> (INTEGERS): *mostly* should be sent together, you can transform any date into UNIX time via the following: *'new Date().getTime();'* OR *'new Date('10/12/2022, 10:52:26 PM').getTime();'* (since binance uses the UNIX time system).
- ***dualSidePosition***: *"true"* or *"false"* for hedgeMode if turned on or not.
- ***multiAssetMargin***: *"true"* or *"false"* for Multi-Asset-Mode if turned on or not.
- ***incomeType***: *'TRANSFER', 'WELCOME_BONUS', 'REALIZED_PNL', 'FUNDING_FEE', 'COMMISSION', 'INSURANCE_CLEAR', 'REFERRAL_KICKBACK', 'COMMISSION_REBATE', 'MARKET_MAKER_REBATE', 'API_REBATE', 'CONTEST_REWARD', 'CROSS_COLLATERAL_TRANSFER', 'OPTIONS_PREMIUM_FEE', 'OPTIONS_SETTLE_PROFIT', 'INTERNAL_TRANSFER', 'AUTO_EXCHANGE', 'DELIVERED_SETTELMENT', 'COIN_SWAP_DEPOSIT', 'COIN_SWAP_WITHDRAW', 'POSITION_LIMIT_INCREASE_FEE'*.

## ALL FUTURES FUNCTIONS:
|FUNCTIONS                                                                                           |REQUIRED PARAMETERS<a href='#futures-parameter-explanation'><sup>ref</sup></a> |OPTIONAL PARAMETERS<a href='#futures-parameter-explanation'><sup>ref</sup></a>|OPTIONS = {} <a href='#options--'><sup>ref</sup></a>|
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
  ...
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



# *CONTACT ME*
### Email: <a href='gtedz1961@gmail.com'>gtedz1961@gmail.com</a>
### 