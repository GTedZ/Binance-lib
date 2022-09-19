# Binance-lib
 A JS library for binance, only the basic features, but will solve some of the problems that 'node-binance-api' hasn't yet fixed, like receiving futures position info such as entryPrice as a response order request, and for you to add any other additional stuff easily in the files.
 
 How to use:
```js
const binance = require("binance-lib")(
   "YOUR_APIKEY",
   "YOUR_APISECRET"
);
```

and in your function, for example named CreateOrder()
```js
let order = await binance.futuresMarketBuy("BTCUSDT",0.001);
if(order.error) {
  console.log(order.error.response);
  return;
}

// continue with your code knowing that the order was executed successfully
```
