# Binance-lib
 A JS library for binance, only the basic features, but will solve some of the problems that 'node-binance-api' hasn't yet fixed, like receiving futures position info such as entryPrice as a response order request, and for you to add any other additional stuff easily in the files.
 
 *STILL UNDER FREQUENT UPDATES AND DEVELOPMENT (Working on making every aspect of the library as intuitive as it can be, meaning I'd rather have the code do all the heavy lifting while the user just copy and pastes from this page while only doing minimal changes)*
 *This is no way shape or form a library to be used in any professional project, this is just to simplify small projects*
*If you have any issues/requests for this project, please do create a new 'issue' on github, and I will promptly get to work on implementing it*

 How to use:
```js
let hedgeMode = false;
const binance = require("binance-lib")(
   "YOUR_APIKEY",
   "YOUR_APISECRET",
   hedgeMode
);
```

and in your function, for example named CreateOrder()
```js
let reduceOnly = false, positionSide = 'LONG';
let order = await binance.futuresMarketBuy("BTCUSDT",0.001, reduceOnly, positionSide);  // you can also add a third argument as 'true', if you want it to be a reduceOnly order (order will be returned as an error if there was no position open on your account)
// it is also recommended to keep reduceOnly as 'true' or 'false' and positionSide as 'LONG' or 'SHORT' whether you are on side Buy or Sell (for hedgeMode users, because the program will automatically switch to hedgeMode for you if you forgot to specify it while loading the module)
if(order.error) {
  console.log(order.error.response);
  return;
}

// continue with your code knowing that the order was executed successfully
```
