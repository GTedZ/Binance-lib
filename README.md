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
    useServerTime: true, // recommended for everyone, it syncs time to the server's time
    hedgeMode: false, // You can set the value or not, either way the library will handle it automatically if it receives an error about your hedgeMode setting not matching your request

    extraInfo: false // <- this will return some extra data like your APIKeys' "Used Weight" and the Server Processing Time for your request and the latency (or total elapsed time from sending the request and receiving the response)
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
- ***startTime*** & ***endTime*** (INTEGERS): *mostly* should be sent together, you can transform any date into UNIX time via the following: *'new Date().getTime();'* OR *'new Date('10/12/2022, 10:52:26 PM').getTime();'* (since binance uses the UNIX time system).
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

{<br/>
  "timezone": "UTC",<br/>
  "serverTime": 1665626426405,<br/>
  "futuresType": "U_MARGINED",<br/>
  "rateLimits": [<br/>
    {<br/>
      "rateLimitType": "REQUEST_WEIGHT",<br/>
      "interval": "MINUTE",<br/>
      "intervalNum": 1,<br/>
      "limit": 2400<br/>
    },<br/>
    {<br/>
      "rateLimitType": "ORDERS",<br/>
      "interval": "MINUTE",<br/>
      "intervalNum": 1,<br/>
      "limit": 1200<br/>
    },<br/>
    {<br/>
      "rateLimitType": "ORDERS",<br/>
      "interval": "SECOND",<br/>
      "intervalNum": 10,<br/>
      "limit": 300<br/>
    }<br/>
  ],<br/>
  "exchangeFilters": [],<br/>
  "assets": [<br/>
    {<br/>
      "asset": "USDT",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "-10000"<br/>
    },<br/>
    {<br/>
      "asset": "BTC",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "-0.00100000"<br/>
    },<br/>
    {<br/>
      "asset": "BNB",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "-10"<br/>
    },<br/>
    {<br/>
      "asset": "ETH",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "-5"<br/>
    },<br/>
    {<br/>
      "asset": "XRP",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "0"<br/>
    },<br/>
    {<br/>
      "asset": "ADA",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "0"<br/>
    },<br/>
    {<br/>
      "asset": "DOT",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "0"<br/>
    },<br/>
    {<br/>
      "asset": "SOL",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "0"<br/>
    },<br/>
    {<br/>
      "asset": "BUSD",<br/>
      "marginAvailable": true,<br/>
      "autoAssetExchange": "-10000"<br/>
    }<br/>
  ],<br/>
  "symbols": [<br/>
    {<br/>
      "symbol": "BTCUSDT",<br/>
      "pair": "BTCUSDT",<br/>
      "contractType": "PERPETUAL",<br/>
      "deliveryDate": 4133404800000,<br/>
      "onboardDate": 1569398400000,<br/>
      "status": "TRADING",<br/>
      "maintMarginPercent": "2.5000",<br/>
      "requiredMarginPercent": "5.0000",<br/>
      "baseAsset": "BTC",<br/>
      "quoteAsset": "USDT",<br/>
      "marginAsset": "USDT",<br/>
      "pricePrecision": 2,<br/>
      "quantityPrecision": 3,<br/>
      "baseAssetPrecision": 8,<br/>
      "quotePrecision": 8,<br/>
      "underlyingType": "COIN",<br/>
      "underlyingSubType": [<br/>
        "PoW"<br/>
      ],<br/>
      "settlePlan": 0,<br/>
      "triggerProtect": "0.0500",<br/>
      "liquidationFee": "0.017500",<br/>
      "marketTakeBound": "0.05",<br/>
      "filters": [<br/>
        {<br/>
          "minPrice": "556.80",<br/>
          "maxPrice": "4529764",<br/>
          "filterType": "PRICE_FILTER",<br/>
          "tickSize": "0.10"<br/>
        },<br/>
        {<br/>
          "stepSize": "0.001",<br/>
          "filterType": "LOT_SIZE",<br/>
          "maxQty": "1000",<br/>
          "minQty": "0.001"<br/>
        },<br/>
        {<br/>
          "stepSize": "0.001",<br/>
          "filterType": "MARKET_LOT_SIZE",<br/>
          "maxQty": "120",<br/>
          "minQty": "0.001"<br/>
        },<br/>
        {<br/>
          "limit": 200,<br/>
          "filterType": "MAX_NUM_ORDERS"<br/>
        },<br/>
        {<br/>
          "limit": 10,<br/>
          "filterType": "MAX_NUM_ALGO_ORDERS"<br/>
        },<br/>
        {<br/>
          "notional": "5",<br/>
          "filterType": "MIN_NOTIONAL"<br/>
        },<br/>
        {<br/>
          "multiplierDown": "0.9500",<br/>
          "multiplierUp": "1.0500",<br/>
          "multiplierDecimal": "4",<br/>
          "filterType": "PERCENT_PRICE"<br/>
        }<br/>
      ],<br/>
      "orderTypes": [<br/>
        "LIMIT",<br/>
        "MARKET",<br/>
        "STOP",<br/>
        "STOP_MARKET",<br/>
        "TAKE_PROFIT",<br/>
        "TAKE_PROFIT_MARKET",<br/>
        "TRAILING_STOP_MARKET"<br/>
      ],<br/>
      "timeInForce": [<br/>
        "GTC",<br/>
        "IOC",<br/>
        "FOK",<br/>
        "GTX"<br/>
      ]<br/>
    },<br/>
    {<br/>
      "symbol": "ETHUSDT",<br/>
      ...<br/>
    },<br/>
    {<br/>
      "symbol": "XRPBUSD",<br/>
      ...<br/>
    }<br/>
  ]<br/>
}

 ```
 </details>

```js
  let exchangeInfo = await binance.futuresExchangeInfo(true, 0, {
    pricePrecision: true,
    quantityPrecision: true,
    baseAsset: true,
    quoteAsset: true          // you can check the rest of the options parameters in the futures functions table above
  });
  console.log(exchangeInfo);
```
<details>
 <summary>View Response</summary>
 ```js
 {
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


# *CONTACT ME*
### Email: <a href='gtedz1961@gmail.com'>gtedz1961@gmail.com</a>
### 