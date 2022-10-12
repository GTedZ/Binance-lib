# Binance-lib
 A JS library for binance, only the basic features, but will solve some of the problems that 'node-binance-api' hasn't yet fixed, like receiving futures position info such as entryPrice as a response order request, and for you to add any other additional stuff easily in the files.

 ***WILL include all SPOT, MARGIN, FUTURES and EUROPEAN market/account/trade/websocket options***

 **Futures API almost fully implemented for now, documentation will come shortly**
 
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
All requests can be handled via checking for an error with: 'if (response.error) {...}, there are no exceptions to this, you don't need any try and catch blocks


***FUTURES DOCUMENTATION:***

|ALL FUTURES FUNCTIONS               |REQUIRED PARAMETERS|OPTIONAL PARAMETERS|OPTIONS = {}    |
|:-----------------------------------|:-----------------:|:-----------------:|:-------------: |
|futuresPing()                       |                   |reconnect, tries   |                |
|futuresServerTime()                 |none|reconnect, tries|none|
|futuresExchangeInfo()               ||||
|futuresOrderBook()                  ||||
|futuresRecentTrades()               ||||
|futuresHistoricalTrades()           ||||
|futuresAggTrades()                  ||||
|futuresCandlesticks()               ||||
|futuresContinuousCandlesticks()     ||||
|futuresIndexPriceCandlesticks()     ||||
|futuresMarkPriceCandlesticks()      ||||
|futuresMarkPrice()                  ||||
|futuresFundingRate()                ||||
|futures24hrTicker()                 ||||
|futuresPrices()                     ||||
|futuresBookTicker()                 ||||
|futuresOpenInterest()               ||||
|futuresOpenInterestStatistics()     ||||
|futuresTopLongShortAccountRatio()   ||||
|futuresTopLongShortPositionRatio()  ||||
|futuresGlobalLongShortAccountRatio()||||
|futuresTakerlongshortRatio()        ||||
|futuresBLVTCandlesticks()           ||||
|futuresIndexInfo()                  ||||
|futuresMultiAssetModeIndex()        ||||
|futuresChangePositionSide()         ||||
|futuresGetPositionSide()            ||||
|futuresChangeMultiAssetMargin()     ||||
|futuresGetMultiAssetMargin()        ||||
|futuresMarketBuy()                  ||||
|futuresMarketSell()                 ||||
|futuresBuy()                        ||||
|futuresSell()                       ||||
|futuresCreateOrder()                ||||
|futuresMultipleOrders()             ||||
|futuresOrder()                      ||||
|futuresCancelOrder()                ||||
|futuresCancelAll()                  ||||
|futuresCancelBatchOrders()          ||||
|futuresCountdownCancelAll()         ||||
|futuresOpenOrder()                  ||||
|futuresOpenOrders()                 ||||
|futuresAllOrders()                  ||||
|futuresBalance()                    ||||
|futuresAccount()                    ||||
|futuresMarginType()                 ||||
|futuresPositionMargin()             ||||
|futuresPositionMarginHistory()      ||||
|futuresPositionRisk()               ||||
|futuresUserTrades()                 ||||
|futuresIncomeHistory()              ||||
|futuresLeverageBrackets()           ||||
|futuresADLQuantileEstimation()      ||||

**FUTURES MARKET DATA**
 
.futuresPing():
```js
  let ping = await binance.futuresPing();
  if(ping.error) {
    console.log(ping.error); // check for error
  }
  console.log(ping); // -> { roundtrip_time_millis: 389 }
```

or optionally, you can use the parameter 'reconnect' as true, this way the library will keep pinging until it gets a successful response, just like the following:
```js
  let ping_til_successful = await binance.futuresPing(true);
  console.log(ping_til_successful); // -> { roundtrip_time_millis: 389 } even though it took 10 consecutive tries to finally get a response
```

and finally, market data functions also have a parameter 'tries' if you want to ONLY try a specific amount of times before an error is returned, just like the following:
```js
  let ping_3tries_max = await binance.futuresPing(true, 3);
  if(ping_3tries_max.error) {
    // the ping request failed 3 times with no success.
  }
```
**PLEASE READ THE DOCUMENTATION FOR EVERY FUNCTION YOU EVER USE, AS I SPECIFICALLY ADD SOME FUNCTIONS THAT YOU MAY USE INSTEAD OF HAVING TO CREATE ONE YOURSELF AND RUN INTO TROUBLES. EVERY FUNCTION HAS A UNIQUE DOCUMENTATION, YOU CAN CHECK IT OUT IN VSCode BY HOVERING OVER THE FUNCTION NAME, OR CHECK IT HERE**

.futuresServerTime():
```js
  let serverTime = await binance.futuresServerTime(true); // function parameters: (reconnect, tries, options {})
  console.log(serverTime); // <= 1665491953938
```

.futuresExchangeInfo():
```js
  let exchangeInfo = await binance.futuresExchangeInfo(true); // function parameters: (reconnect, tries, options {})
  console.log(exchangeInfo);
```