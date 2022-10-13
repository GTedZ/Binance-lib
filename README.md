# Binance-lib
 A JS library for binance, only the basic features, but will solve some of the problems that 'node-binance-api' hasn't yet fixed, like receiving futures position info such as entryPrice as a response order request, and for you to add any other additional stuff easily in the files.

 ***WILL include all SPOT, MARGIN, FUTURES<a href='#futures-documentation'><sup>ref</sup></a> and EUROPEAN market/account/trade/websocket options***

 **Futures API almost fully implemented for now, documentation will come shortly**

 #### Please use the <a href='#please-use-the-ref-symbols-to-navigate-through-the-documentation-as-it-is-huge'>'<sup>ref</sup></a>' symbols to navigate through the documentation, as it is huge.
 
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