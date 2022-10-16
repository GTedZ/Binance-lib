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
### Account/Trade<a href='#Futures-AccountTrade-Data'><sup>ref</sup></a>
### Websockets<a href='#Futures-Websockets'><sup>ref</sup></a>

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
|futuresTakerLongShortRatio()                <a href='#futuresTakerLongShortRatio'><sup>ref</sup></a>|symbol, period                                                           |limit, startTime, endTime                                |                |
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
|futuresTakeProfit()                                  <a href='#futuresTakeProfit'><sup>ref</sup></a>|symbol, side, stopPrice                                                  |(ONE OF THE FOLLOWING) closePosition, quantity           |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
|futuresStopLoss()                                      <a href='#futuresStopLoss'><sup>ref</sup></a>|symbol, side, stopPrice                                                  |(ONE OF THE FOLLOWING) closePosition, quantity           |positionSide, reduceOnly, newClientOrderId, priceProtect, newOrderRespType, workingType, timeInForce|
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
|futuresAccount()                                        <a href='#futuresAccount'><sup>ref</sup></a>|                                                                         |(BOOLS ONLY): activePositionsOnly, activeAssets          |recvWindow      |
|futuresLeverage()                                      <a href='#futuresLeverage'><sup>ref</sup></a>|symbol, leverage                                                         |                                                         |recvWindow, findHighest (BOOL)|
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
```
<details>
<summary>View Response</summary>

```js
{
  symbol: 'BTCUSDT',
  bidPrice: 18414.8,
  bidQty: 4.629,
  askPrice: 18414.9,
  askQty: 24.508,
  time: 1665673452329
}
```
</details>

OR

<details>
<summary>View Response</summary>

```js
[
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
      
      if parameter 'side' == 'BUY' and positionSide as 'LONG' are not allowed
      if parameter 'side' == 'SELL' and positionSide as 'LONG' are not allowed

    // for hedgeMode /

  // for futuresTakeProfit() /

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
<summary>View Response</summary>

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





# *CONTACT ME*
### Email: <a href='gtedz1961@gmail.com'>gtedz1961@gmail.com</a>
### 