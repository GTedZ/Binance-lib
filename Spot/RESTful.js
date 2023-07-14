const Options = require('../essentials/Options');

const Info = require('../essentials/Info');

const Requests = require('../essentials/Requests');

const Error = require('../essentials/Error');

const Spot_Websockets = require('./Websockets');

const { exchangeInfo, exchangeInfo_mapped,
  ticker_24h, miniTicker_24h, bookTicker, kline_interval, orderSide, orderType, timeInForce, newOrderRespType, selfTradePreventionMode, cancelRestrictions,
  Account, Trade, AggTrade, Candlestick, Order, Account_mapped } = require('../types/Spot');

class Spot {

  /**
   * @type {string}
   */
  baseURL = 'https://api.binance.com'

  /**
   * @type {Options}
   */
  options;

  /**
   * @type {Info}
   */
  info;

  /**
   * @type {Requests}
   */
  requests;

  /**
   * @type {Spot_Websockets}
   */
  websockets;

  constructor(options, info, requests) {
    this.options = options;
    this.info = info;
    this.requests = requests;
    this.websockets = new Spot_Websockets(options, info, this);
  }

  CONSTANTS = {
    requestTypes: ['NONE', 'USER_STREAM', 'MARKET_DATA', 'TRADE', 'MARGIN', 'USER_DATA'],
    open_requestTypes: ['NONE'],
    requestTypes_APIKEY_ONLY: ['USER_STREAM', 'MARKET_DATA'],
    requestTypes_SIGNED: ['TRADE', 'MARGIN', 'USER_DATA'],


  }

  // MARKET DATA  \\\\

  /**
   * - Fetch system status.
   * - Weight(IP): `1`
   * - `status` of `0`: "normal", `1`: "system_maintenance"
   * @returns { Promise < { "status":0|1, "msg":"normal"|"system_maintenance" } > }
  */
  async check_system_status() {

    const resp = await this.request('GET', 'sapi', '/sapi/v1/system/status', {}, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
     * @param {boolean|undefined} reconnect
     * @param {number|undefined} tries
     * @returns { Promise <{latency:number}> }
     * 
     * Test connectivity to the Rest API.
     */
  async ping(reconnect = false, tries = -1) {
    const startTime = performance.now();
    const response = await this.request('GET', 'api', '/api/v3/ping', {}, 'NONE');
    if (response.error) {
      if (!reconnect || tries === 0) return response;
      return this.ping(reconnect, --tries);
    } else response.latency = performance.now() - startTime;
    return response;
  }

  /**
     * @param {boolean|undefined} reconnect
     * @param {number|undefined} tries
     * @returns { Promise.<{serverTime:number, latency:number}> }
     * 
     * Test connectivity to the Rest API and get the current server time.
     */
  async serverTime(reconnect = false, tries = -1) {
    const startTime = performance.now();
    const response = await this.request('GET', 'api', '/api/v3/time', {}, 'NONE');
    if (response.error) {
      if (!reconnect || tries === 0) return response;
      return this.serverTime(reconnect, --tries);
    } else response.latency = performance.now() - startTime;
    return response;
  }

  /**
   * - Current exchange trading rules and symbol information
   * - Weight(IP): `10`
   * - If the value provided to `symbol` or `symbols` do not exist, the endpoint will throw an error saying the symbol is invalid.
   * - All parameters are optional.
   * - `permissions` can support single or multiple values (e.g. `SPOT` , `["MARGIN","LEVERAGED"]` )
   * - If `permissions` parameter not provided, the default values will be `["SPOT","MARGIN","LEVERAGED"]` . If one wants to view all symbols on `GET /api/v`3`/exchangeInfo` , then one has to search with all permissions explicitly specified (i.e. `permissions=["SPOT","MARGIN","LEVERAGED","TRD_GRP_`002`","TRD_GRP_`003`","TRD_GRP_`004`","TRD_GRP_`005`","TRD_GRP_`006`","TRD_GRP_`007`","TRD_GRP_`008`","TRD_GRP_`009`","TRD_GRP_`010`","TRD_GRP_`011`","TRD_GRP_`012`","TRD_GRP_`013`"]` )
   * - If one wants to view all symbols on `GET /api/v`3`/exchangeInfo` , then one has to search with all permissions explicitly specified (i.e. `permissions=["SPOT","MARGIN","LEVERAGED","TRD_GRP_`002`","TRD_GRP_`003`","TRD_GRP_`004`","TRD_GRP_`005`","TRD_GRP_`006`","TRD_GRP_`007`","TRD_GRP_`008`","TRD_GRP_`009`","TRD_GRP_`010`","TRD_GRP_`011`","TRD_GRP_`012`","TRD_GRP_`013`"]` )
   * 
   * @param {string | string[] | undefined} symbol_or_symbols
   * @param {string[] | undefined} permissions
   * @returns { Promise < exchangeInfo > }
  */
  async exchangeInfo(symbol_or_symbols, permissions) {

    let symbols;
    if (typeof symbol_or_symbols === 'undefined');
    else if (typeof symbol_or_symbols === 'string') symbols = [symbol_or_symbols];
    else if (Array.isArray(symbol_or_symbols)) symbols = symbol_or_symbols;
    else return new Error('symbol_or_symbols', 'INVALID_VALUE');

    if (typeof permissions === 'undefined');
    else if (typeof permissions === 'string') permissions = [permissions];
    else if (Array.isArray(permissions));
    else return new Error('permission', 'INVALID_VALUE');

    const resp = await this.request('GET', 'api', '/api/v3/exchangeInfo', { symbols, permissions }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Current exchange trading rules and symbol information
   * - Weight(IP): `10`
   * - If the value provided to `symbol` or `symbols` do not exist, the endpoint will throw an error saying the symbol is invalid.
   * - All parameters are optional.
   * - `permissions` can support single or multiple values (e.g. `SPOT` , `["MARGIN","LEVERAGED"]` )
   * - If `permissions` parameter not provided, the default values will be `["SPOT","MARGIN","LEVERAGED"]` . If one wants to view all symbols on `GET /api/v`3`/exchangeInfo` , then one has to search with all permissions explicitly specified (i.e. `permissions=["SPOT","MARGIN","LEVERAGED","TRD_GRP_`002`","TRD_GRP_`003`","TRD_GRP_`004`","TRD_GRP_`005`","TRD_GRP_`006`","TRD_GRP_`007`","TRD_GRP_`008`","TRD_GRP_`009`","TRD_GRP_`010`","TRD_GRP_`011`","TRD_GRP_`012`","TRD_GRP_`013`"]` )
   * - If one wants to view all symbols on `GET /api/v`3`/exchangeInfo` , then one has to search with all permissions explicitly specified (i.e. `permissions=["SPOT","MARGIN","LEVERAGED","TRD_GRP_`002`","TRD_GRP_`003`","TRD_GRP_`004`","TRD_GRP_`005`","TRD_GRP_`006`","TRD_GRP_`007`","TRD_GRP_`008`","TRD_GRP_`009`","TRD_GRP_`010`","TRD_GRP_`011`","TRD_GRP_`012`","TRD_GRP_`013`"]` )
   * 
   * @param {string | string[] | undefined} symbol_or_symbols
   * @param {string[] | undefined} permissions
   * @returns { Promise < exchangeInfo_mapped > }
  */
  async exchangeInfo_mapped(symbol_or_symbols, permissions) {

    const resp = await this.exchangeInfo(symbol_or_symbols, permissions);
    if (resp.error) return resp;

    return new exchangeInfo_mapped(resp);
  }

  /**
   * - Adjusted based on the `limit`:
   * - Data Source: Memory
   * @param {string} symbol
   * @param {number | undefined} limit  - Default `100`; max `5000`. If limit > `5000`, then the response will truncate to `5000`.
   * @returns { Promise < OrderBook > }
  */
  async orderBook(symbol, limit) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/depth', { symbol, limit }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Get recent trades.
   * - Weight(IP): `1`
   * - Data Source: Memory
   * @param {string} symbol
   * @param {number | undefined} limit  - Default `500`; max `1000`.
   * @returns { Promise < Trade[] > }
  */
  async recentTrades(symbol, limit) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/trades', { symbol, limit }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES `APIKEY`
   * - Get older market trades.
   * - Weight(IP): `5`
   * - Data Source: Database
   * @param {string} symbol
   * @param {number | undefined} limit  - Default `500`; max `1000`.
   * @param {number | undefined} fromId  - Trade id to fetch from. Default gets most recent trades.
   * @returns { Promise < Trade[] > }
  */
  async historicalTrades(symbol, limit, fromId) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/historicalTrades', { symbol, limit, fromId }, 'MARKET_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated.
   * - Weight(IP): `1`
   * - Data Source: Database
   * - If `fromId`, `startTime`, and `endTime` are not sent, the most recent aggregate trades will be returned.
   * - Note that if a trade has the following values, this was a duplicate aggregate trade and marked as invalid: p = '`0`' // price q = '`0`' // qty f = -`1` // ﬁrst_trade_id l = -`1` // last_trade_id
   * - p = '`0`' // price
   * - q = '`0`' // qty
   * - f = -`1` // ﬁrst_trade_id
   * - l = -`1` // last_trade_id
   * @param {string} symbol
   * @param {number | undefined} limit  - Default `500`; max `1000`.
   * @param {number | undefined} fromId  - id to get aggregate trades from INCLUSIVE.
   * @param {number | undefined} startTime  - Timestamp in ms to get aggregate trades from INCLUSIVE.
   * @param {number | undefined} endTime  - Timestamp in ms to get aggregate trades until INCLUSIVE.
   * @returns { Promise < AggTrade[] > }
  */
  async aggTrades(symbol, limit, fromId, startTime, endTime) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/aggTrades', { symbol, limit, fromId, startTime, endTime }, 'NONE');
    if (resp.error) return resp;

    return resp.map(aggTrade => new AggTrade(aggTrade));
  }

  /**
   * - Kline/candlestick bars for a `symbol`. Klines are uniquely identified by their open time.
   * - Weight(IP): `1`
   * - Data Source: Database
   * - If `startTime` and `endTime` are not sent, the most recent klines are returned.
   * @param {string} symbol
   * @param {kline_interval} interval
   * @param {number | undefined} limit  - Default `500`; max `1000`.
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @returns { Promise < Candlestick[] > }
  */
  async candlesticks(symbol, interval, limit, startTime, endTime) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    if (typeof interval === 'undefined') return new Error('interval', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/klines', { symbol, interval, limit, startTime, endTime }, 'NONE');
    if (resp.error) return resp;

    return resp.map(candlestick => new Candlestick(candlestick));
  }

  /**
   * - The request is similar to klines having the same parameters and response.
   * - `uiKlines` return modified kline data, optimized for presentation of candlestick charts.
   * - Weight: `1`
   * - Data Source: Database
   * - If startTime and endTime are not sent, the most recent klines are returned.
   * @param {string} symbol
   * @param {ENUM} interval
   * @param {number | undefined} limit  - Default `500`; max `1000`.
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @returns { Promise < Candlestick[] > }
  */
  async UIKlines(symbol, interval, limit, startTime, endTime) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    if (typeof interval === 'undefined') return new Error('interval', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/uiKlines', { symbol, interval, limit, startTime, endTime }, 'NONE');
    if (resp.error) return resp;

    return resp.map(candlestick => new Candlestick(candlestick));
  }

  /**
   * - Current average price for a `symbol`.
   * - Weight(IP): `1`
   * - Data Source: Memory
   * @param {string} symbol
   * @returns { Promise < {"mins":5,"price":"9.35751834"} > }
  */
  async current_avgPrice(symbol) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/avgPrice', { symbol }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * `24 hour` rolling window price change statistics.
   * - Weight: `1`
   * @param {string} symbol
   * @returns {miniTicker_24h}
   */
  async miniTicker_24h(symbol) {

    if (typeof symbol !== 'string') return new Error('symbol', 'WRONG_TYPE', symbol, 'String');

    const resp = await this.request('GET', 'api', '/api/v3/ticker/24hr', { symbol, type: 'MINI' }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * `24` hour rolling window price change statistics. 
   * - Careful when accessing this with no `symbol`.
   * - Weights:
   * - - [`1`-`20`] => `1`
   * - - [`21`-`100`] => `20`
   * - - `>100` => `40` 
   * - - `symbols` omitted => `40`
   * @param {string[]} symbols - Symbols to be fetched, ignore or `undefined` for all symbols
   * @returns {miniTicker_24h[]}
   */
  async all_miniTickers_24h(symbols) {

    const resp = await this.request('GET', 'api', '/api/v3/ticker/24hr', { symbols, type: 'MINI' }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * `24 hour` rolling window price change statistics.
   * - Weight: `1`
   * @param {string} symbol
   * @returns {ticker_24h}
   */
  async ticker_24h(symbol) {

    if (typeof symbol !== 'string') return new Error('symbol', 'WRONG_TYPE', symbol, 'String');

    const resp = await this.request('GET', 'api', '/api/v3/ticker/24hr', { symbol, type: 'FULL' }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * `24` hour rolling window price change statistics. 
   * - Careful when accessing this with no `symbol`.
   * - Weights:
   * - - [`1`-`20`] => `1`
   * - - [`21`-`100`] => `20`
   * - - `>100` => `40` 
   * - - `symbols` omitted => `40`
   * @param {string[]} symbols - Symbols to be fetched, ignore or `undefined` for all symbols
   * @returns {ticker_24h[]}
   */
  async all_tickers_24h(symbols) {

    const resp = await this.request('GET', 'api', '/api/v3/ticker/24hr', { symbols, type: 'FULL' }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Latest price for a `symbol`.
   * - Weight: `1`
   * - Data Source: Memory
   * @param {string | undefined} symbol 
   * @returns { Promise < {"symbol":"LTCBTC","price":"4.00000200"} > }
  */
  async priceTicker(symbol) {

    const resp = await this.request('GET', 'api', '/api/v3/ticker/price', { symbol }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Latest price for a `symbols`.
   * - Weight: `2`
   * - Data Source: Memory
   * @param {string | undefined} symbols
   * @returns { Promise < Array<{"symbol":"LTCBTC","price":"4.00000200"}> > }
  */
  async all_priceTickers(symbols) {

    const resp = await this.request('GET', 'api', '/api/v3/ticker/price', { symbols }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Best price/qty on the order book for a `symbol`.
   * - Weight: `1`
   * - Data Source: Memory
   * @param {string | undefined} symbol 
   * @returns { Promise < bookTicker > }
  */
  async bookTicker(symbol) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/ticker/bookTicker', { symbol }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Best price/qty on the order book for `symbols` or all symbols.
   * - Weight: `2`
   * - Data Source: Memory
   * @param {string[] | undefined} symbols
   * @returns { Promise < bookTicker > }
  */
  async all_bookTickers(symbols) {

    const resp = await this.request('GET', 'api', '/api/v3/ticker/bookTicker', { symbols }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Note: This endpoint is different from the `GET /api/v`3`/ticker/`24`hr` endpoint.
   * - The window used to compute statistics will be no more than `59999`ms from the requested `windowSize` .
   * - `openTime` for `/api/v`3`/ticker` always starts on a minute, while the `closeTime` is the current time of the request. As such, the effective window will be up to `59999`ms wider than `windowSize` .
   * - E.g. If the `closeTime` is `1641287867099` (January `04`, `2022` `09`:`17`:`47`:`099` UTC) , and the `windowSize` is 1`d` . the `openTime` will be: `1641201420000` (January `3`, `2022`, `09`:`17`:`00` UTC)
   * - `2` for each requested symbol regardless of windowSize The weight for this request will cap at `100` once the number of `symbols` in the request is more than `50`.
   * - Data Source: Database
   * @param {string} symbol
   * @param {string | undefined} windowSize - Default `1d`. **`1m`, `2m`, `3m`, ..., `59m`, `1h`, `2h`, ..., `23h`, `1d`, ..., `7d`**.
   * @returns { Promise < RollingWindowStat > }
  */
  async rollingWindow_stats(symbol, windowSize) {

    const resp = await this.request('GET', 'api', '/api/v3/ticker', { symbol, windowSize }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Note: This endpoint is different from the `GET /api/v`3`/ticker/`24`hr` endpoint.
   * - The window used to compute statistics will be no more than `59999`ms from the requested `windowSize` .
   * - `openTime` for `/api/v`3`/ticker` always starts on a minute, while the `closeTime` is the current time of the request. As such, the effective window will be up to `59999`ms wider than `windowSize` .
   * - E.g. If the `closeTime` is `1641287867099` (January `04`, `2022` `09`:`17`:`47`:`099` UTC) , and the `windowSize` is 1`d` . the `openTime` will be: `1641201420000` (January `3`, `2022`, `09`:`17`:`00` UTC)
   * - `2` for each requested symbol regardless of windowSize The weight for this request will cap at `100` once the number of `symbols` in the request is more than `50`.
   * - Data Source: Database
   * @param {string[]} symbols
   * @param {string | undefined} windowSize - Default `1d`. **`1m`, `2m`, `3m`, ..., `59m`, `1h`, `2h`, ..., `23h`, `1d`, ..., `7d`**.
   * @returns { Promise < RollingWindowStat[] > }
  */
  async allRollingWindow_stats(symbols, windowSize) {

    if (typeof symbols === 'undefined');
    else if (!Array.isArray(symbols)) return new Error('symbols', 'WRONG_TYPE', symbols, "Array' or 'undefined");

    const resp = await this.request('GET', 'api', '/api/v3/ticker', { symbols, windowSize }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  // MARKET DATA  ////

  // SPOT ACCOUNT/TRADE \\\\

  /**
     * - Used to create `test` order requests:
     * -
     * - HOW TO USE:
     * - 1_ Call this function: `const testGenerator = binance.create_testOrder_generator()`
     * -
     * - 2_ Use the returned Object to call the `orderType` function you want (with await): `const testResponse = await testGenerator.<functionName>(parameters)`
     * -
     * - Since you will be using it with `batchOrder`, it is best to push it into an array:
     * @example 
     * const testGenerator = binance.futures.create_testOrder_generator();
     * console.log( await testGenerator.marketBuy('BTCUSDT', 0.01) )
     * console.log( await testGenerator.marketBuy('BNBUSDT', 0.2) )
     * console.log( await testGenerator.limitBuy('BTCUSDT', ...) )
     * console.log( await testGenerator.limitMarketBuy('BTCUSDT', ...) )
     * console.log( await testGenerator.<functionName>(parameters) )
     * 
     * @returns {Promise <Spot>}
     * @since v3.0.0
     */
  async create_testOrder_generator() {
    const Binance = require('../Binance');
    const temp_binanceSpot = new Binance().spot;
    Object.assign(
      temp_binanceSpot
      ,
      {
        request: async (method, baseURL, path, params = {}, type, pre_adapter_cb = undefined) => {
          path += '/test';

          const response = await this.request(method, baseURL, path, params, type, pre_adapter_cb);
          if (response.error) return response;
          response.testOrderAccepted = true;
          return response;
        }
      }
    );

    return temp_binanceSpot;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Send in a new order.
   * - Weight(UID): `1` Weight(IP): `1`
   * - Additional mandatory parameters based on type :
   * - Other info:
   * - Trigger order `price` rules against market `price` for both MARKET and LIMIT versions:
   * - Data Source: Matching Engine
   * - There are fields in the order responses (e.g. order placement, order query, order cancellation) that appear only if certain conditions are met.
   * - These fields can apply to OCO Orders.
   * - The fields are listed below:
   * - `LIMIT_MAKER` are `LIMIT` orders that will be rejected if they would immediately match and trade as a taker.
   * - `STOP_LOSS` and `TAKE_PROFIT` will execute a `MARKET` order when the stopPrice is reached.
   * - Any `LIMIT` or `LIMIT_MAKER` `type` order can be made an iceberg order by sending an icebergQty .
   * - Any order with an icebergQty MUST have timeInForce set to `GTC` .
   * - `MARKET` orders using the quantity field specifies the amount of the `base asset` the user wants to buy or sell at the market `price`. For example, sending a `MARKET` order on BTCUSDT will specify how much BTC the user is buying or selling.
   * - For example, sending a `MARKET` order on BTCUSDT will specify how much BTC the user is buying or selling.
   * - `MARKET` orders using quoteOrderQty specifies the amount the user wants to spend (when buying) or receive (when selling) the `quote` asset; the correct quantity will be determined based on the market liquidity and quoteOrderQty . Using BTCUSDT as an example: On the `BUY` `side`, the order will buy as many BTC as quoteOrderQty USDT can. On the `SELL` `side`, the order will sell as much BTC needed to receive quoteOrderQty USDT.
   * - Using BTCUSDT as an example: On the `BUY` `side`, the order will buy as many BTC as quoteOrderQty USDT can. On the `SELL` `side`, the order will sell as much BTC needed to receive quoteOrderQty USDT.
   * - On the `BUY` `side`, the order will buy as many BTC as quoteOrderQty USDT can.
   * - On the `SELL` `side`, the order will sell as much BTC needed to receive quoteOrderQty USDT.
   * - `MARKET` orders using quoteOrderQty will not break `LOT_SIZE` filter rules; the order will execute a quantity that will have the notional value as close as possible to quoteOrderQty .
   * - same newClientOrderId can be accepted only when the previous one is filled, otherwise the order will be rejected.
   * - For `STOP_LOSS` , `STOP_LOSS_LIMIT` , `TAKE_PROFIT_LIMIT` and `TAKE_PROFIT` orders, trailingDelta can be combined with stopPrice .
   * - Price above market `price`: `STOP_LOSS` `BUY` , `TAKE_PROFIT` `SELL`
   * - Price below market `price`: `STOP_LOSS` `SELL` , `TAKE_PROFIT` `BUY`
   * @param {string} symbol 
   * @param {orderSide} side 
   * @param {orderType} type 
   * @param {number | undefined} quantity 
   * @param {number | undefined} quoteOrderQty 
   * @param {number | undefined} price 
   * @param {number | undefined} stopPrice - Used with `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.
   * @param {timeInForce | undefined} timeInForce 
   * @param {string | undefined} newClientOrderId - A unique id among open orders. Automatically generated if not sent.
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType - The value cannot be less than `1,000,000`.
   * @param {number | undefined} trailingDelta - Used with `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders. For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {number | undefined} icebergQty - Used with `LIMIT`, `STOP_LOSS_LIMIT`, and `TAKE_PROFIT_LIMIT` to create an iceberg order.
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async new_Order(symbol, side, type, quantity, quoteOrderQty, price, stopPrice, timeInForce, newClientOrderId, strategyId, strategyType, trailingDelta, icebergQty, newOrderRespType = 'FULL', selfTradePreventionMode) {
    // Expects (HMAC SHA256)

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

    if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

    const resp = await this.request('POST', 'api', '/api/v3/order', { symbol, side, type, quantity, quoteOrderQty, price, stopPrice, timeInForce, newClientOrderId, strategyId, strategyType, trailingDelta, icebergQty, newOrderRespType, selfTradePreventionMode }, 'TRADE');
    if (resp.error) return resp;

    if (resp.testOrderAccepted) return resp;
    return newOrderRespType === 'FULL' ? new Order(resp) : resp;
  }



  /**
   * @param {string} symbol 
   * @param {orderSide} side 
   * @param {number | undefined} quantity
   * @param {number | undefined} price 
   * @param {timeInForce | undefined} timeInForce - default is `GTC`
   * @param {number | undefined} iceBergQty 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async limit_Order(symbol, side, quantity, price, timeInForce = 'GTC', iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

    return this.new_Order(symbol, side, 'LIMIT', quantity, undefined, price, undefined, timeInForce, newClientOrderId, strategyId, strategyType, undefined, iceBergQty, newOrderRespType, selfTradePreventionMode)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} price 
   * @param {timeInForce | undefined} timeInForce - default is `GTC`
   * @param {number | undefined} iceBergQty 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async limitBuy(symbol, quantity, price, timeInForce = 'GTC', iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.limit_Order(symbol, 'BUY', quantity, price, timeInForce = 'GTC', iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} price 
   * @param {timeInForce | undefined} timeInForce - default is `GTC`
   * @param {number | undefined} iceBergQty 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async limitSell(symbol, quantity, price, timeInForce = 'GTC', iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.limit_Order(symbol, 'SELL', quantity, price, timeInForce = 'GTC', iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }



  /**
   * @param {string} symbol 
   * @param {orderSide} side 
   * @param {number | undefined} quantity
   * @param {number | undefined} price 
   * @param {number | undefined} iceBergQty 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async limitMarket_Order(symbol, side, quantity, price, iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

    return this.new_Order(symbol, side, 'LIMIT_MAKER', quantity, undefined, price, undefined, undefined, newClientOrderId, strategyId, strategyType, undefined, iceBergQty, newOrderRespType, selfTradePreventionMode)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} price 
   * @param {number | undefined} iceBergQty 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async limitMarketBuy(symbol, quantity, price, iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.limitMarket_Order(symbol, 'BUY', quantity, price, iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} price 
   * @param {number | undefined} iceBergQty 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async limitMarketSell(symbol, quantity, price, iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.limitMarket_Order(symbol, 'SELL', quantity, price, iceBergQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }



  /**
   * @param {string} symbol 
   * @param {orderSide} side 
   * @param {number | undefined} quantity - Either `quantity` or `quoteOrderQty` must be sent
   * @param {number | undefined} quoteOrderQty - Either `quantity` or `quoteOrderQty` must be sent
   * @param {number | undefined} price 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async market_Order(symbol, side, quantity, quoteOrderQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined' && typeof quoteOrderQty === 'undefined') return new Error(`quantity' and/or 'quoteOrderQty`, 'REQUIRED');

    return this.new_Order(symbol, side, 'MARKET', quantity, quoteOrderQty, undefined, undefined, undefined, newClientOrderId, strategyId, strategyType, undefined, undefined, newOrderRespType, selfTradePreventionMode)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity - Either `quantity` or `quoteOrderQty` must be sent
   * @param {number | undefined} quoteOrderQty - Either `quantity` or `quoteOrderQty` must be sent
   * @param {number | undefined} price 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async marketBuy(symbol, quantity, quoteOrderQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.market_Order(symbol, 'BUY', quantity, quoteOrderQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity - Either `quantity` or `quoteOrderQty` must be sent
   * @param {number | undefined} quoteOrderQty - Either `quantity` or `quoteOrderQty` must be sent
   * @param {number | undefined} price 
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async marketSell(symbol, quantity, quoteOrderQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.market_Order(symbol, 'SELL', quantity, quoteOrderQty, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }



  /**
   * @param {string} symbol 
   * @param {orderSide} side 
   * @param {number | undefined} quantity
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async stopLossMarket_Order(symbol, side, quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof stopPrice === 'undefined' && typeof trailingDelta === 'undefined') return new Error(`stopPrice' or 'trailingDelta`, 'REQUIRED');

    return this.new_Order(symbol, side, 'STOP_LOSS', quantity, undefined, undefined, stopPrice, undefined, newClientOrderId, strategyId, strategyType, trailingDelta, undefined, newOrderRespType, selfTradePreventionMode)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async stopLossMarketBuy(symbol, quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.stopLossMarket_Order(symbol, 'BUY', quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async stopLossMarketSell(symbol, quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.stopLossMarket_Order(symbol, 'SELL', quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }



  /**
   * @param {string} symbol 
   * @param {orderSide} side 
   * @param {number | undefined} quantity
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async takeProfitMarket_Order(symbol, side, quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof stopPrice === 'undefined' && typeof trailingDelta === 'undefined') return new Error(`stopPrice' or 'trailingDelta`, 'REQUIRED');

    return this.new_Order(symbol, side, 'TAKE_PROFIT', quantity, undefined, undefined, stopPrice, undefined, newClientOrderId, strategyId, strategyType, trailingDelta, undefined, newOrderRespType, selfTradePreventionMode)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async takeProfitMarketBuy(symbol, quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.takeProfitMarket_Order(symbol, 'BUY', quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async takeProfitMarketSell(symbol, quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.takeProfitMarket_Order(symbol, 'SELL', quantity, stopPrice, trailingDelta, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType)
  }

  /**
   * @param {string} symbol 
   * @param {orderSide} side 
   * @param {number | undefined} quantity
   * @param {number | undefined} price
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {timeInForce | undefined} timeInForce - Default `GTC`
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async stopLossLimit_Order(symbol, side, quantity, price, stopPrice, trailingDelta, timeInForce = 'GTC', newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

    if (typeof stopPrice === 'undefined' && typeof trailingDelta === 'undefined') return new Error(`stopPrice' or 'trailingDelta`, 'REQUIRED');

    return this.new_Order(symbol, side, 'STOP_LOSS_LIMIT', quantity, undefined, price, stopPrice, timeInForce, newClientOrderId, strategyId, strategyType, trailingDelta, iceBergQty, newOrderRespType, selfTradePreventionMode);
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} price
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {timeInForce | undefined} timeInForce - Default `GTC`
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async stopLossLimitBuy(symbol, quantity, price, stopPrice, trailingDelta, timeInForce = 'GTC', newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.stopLossLimit_Order(symbol, 'BUY', quantity, price, stopPrice, trailingDelta, timeInForce, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType);
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} price
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {timeInForce | undefined} timeInForce - Default `GTC`
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async stopLossLimitSell(symbol, quantity, price, stopPrice, trailingDelta, timeInForce = 'GTC', newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {
    return this.stopLossLimit_Order(symbol, 'SELL', quantity, price, stopPrice, trailingDelta, timeInForce, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType);
  }



  /**
   * @param {string} symbol 
   * @param {orderSide} side 
   * @param {number | undefined} quantity
   * @param {number | undefined} price
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {timeInForce | undefined} timeInForce - Default `GTC`
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async takeProfitLimit_Order(symbol, side, quantity, price, stopPrice, trailingDelta, timeInForce = 'GTC', newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

    if (typeof stopPrice === 'undefined' && typeof trailingDelta === 'undefined') return new Error(`stopPrice' or 'trailingDelta`, 'REQUIRED');

    return this.new_Order(symbol, side, 'TAKE_PROFIT_LIMIT', quantity, undefined, price, stopPrice, timeInForce, newClientOrderId, strategyId, strategyType, trailingDelta, iceBergQty, newOrderRespType, selfTradePreventionMode);
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} price
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {timeInForce | undefined} timeInForce - Default `GTC`
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async takeProfitLimitBuy(symbol, quantity, price, stopPrice, trailingDelta, timeInForce = 'GTC', newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

    if (typeof stopPrice === 'undefined' && typeof trailingDelta === 'undefined') return new Error(`stopPrice' or 'trailingDelta`, 'REQUIRED');

    return this.takeProfitLimit_Order(symbol, 'BUY', quantity, price, stopPrice, trailingDelta, timeInForce, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType);
  }

  /**
   * @param {string} symbol 
   * @param {number | undefined} quantity
   * @param {number | undefined} price
   * @param {number | undefined} stopPrice - Either `stopPrice` or `trailingDelta` must be sent
   * @param {number | undefined} trailingDelta - For more details on SPOT implementation on trailing stops, please refer to {@link https://github.com/binance/binance-spot-api-docs/blob/master/faqs/trailing-stop-faq.md Trailing Stop FAQ}
   * @param {timeInForce | undefined} timeInForce - Default `GTC`
   * @param {string | undefined} newClientOrderId 
   * @param {number | undefined} strategyId 
   * @param {number | undefined} strategyType 
   * @param {selfTradePreventionMode | undefined} selfTradePreventionMode - The allowed enums is dependent on what is configured on the symbol.
   * @param {newOrderRespType | undefined} newOrderRespType - Default `FULL`: Set the response JSON.
   * @returns { Promise < Order > }
   */
  async takeProfitLimitSell(symbol, quantity, price, stopPrice, trailingDelta, timeInForce = 'GTC', newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType) {

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

    if (typeof stopPrice === 'undefined' && typeof trailingDelta === 'undefined') return new Error(`stopPrice' or 'trailingDelta`, 'REQUIRED');

    return this.takeProfitLimit_Order(symbol, 'SELL', quantity, price, stopPrice, trailingDelta, timeInForce, newClientOrderId, strategyId, strategyType, selfTradePreventionMode, newOrderRespType);
  }





  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Cancel an active order.
   * - Weight(IP): `1`
   * - Either orderId or origClientOrderId must be sent. If both orderId and origClientOrderId are provided, orderId takes precedence.
   * - Data Source: Matching Engine
   * - Note: The payload sample does not show all fields that can appear. Please refer to Conditional fields in Order Responses .
   * - If the cancelRestrictions value is not any of the supported values, the error will be: `{"code": -`1145`,"msg": "Invalid `cancelRestrictions`"}`
   * - `{"code": -`1145`,"msg": "Invalid `cancelRestrictions`"}`
   * - If the order did not pass the conditions for cancelRestrictions , the error will be: `{"code": -`2011`,"msg": "Order was not canceled due to cancel restrictions."}`
   * - `{"code": -`2011`,"msg": "Order was not canceled due to cancel restrictions."}`
   * @param {string} symbol
   * @param {number | undefined} orderId
   * @param {string | undefined} origClientOrderId
   * @param {string | undefined} newClientOrderId  - Used to uniquely identify this cancel. Automatically generated by default.
   * @param {cancelRestrictions | undefined} cancelRestrictions
   * @returns { Promise < Order > }
  */
  async cancelOrder(symbol, orderId, origClientOrderId, newClientOrderId, cancelRestrictions) {
    // Expects (HMAC SHA256)
    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('DELETE', 'api', '/api/v3/order', { symbol, orderId, origClientOrderId, newClientOrderId, cancelRestrictions }, 'TRADE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Cancels all active orders on a `symbol`. This includes OCO orders.
   * - Weight(IP): `1`
   * - Data Source: Matching Engine
   * @param {string} symbol
   * @returns { Promise < Order[] > }
  */
  async cancel_allOpenOrders(symbol) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('DELETE', 'api', '/api/v3/openOrders', { symbol }, 'TRADE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Check an order's status.
   * - Weight(IP): `2`
   * - Data Source: Memory => Database
   * - Either orderId or origClientOrderId must be sent.
   * - For some historical orders `cummulativeQuoteQty` will be < `0`, meaning the data is not available at this time.
   * - The payload sample does not show all fields that can appear. Please refer to Conditional fields in Order Responses .
   * @param {string} symbol
   * @param {number | undefined} orderId
   * @param {string | undefined} origClientOrderId
   * @returns { Promise <  > }
  */
  async query_order(symbol, orderId, origClientOrderId) {
    // Expects (HMAC SHA256)
    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/order', { symbol, orderId, origClientOrderId }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Cancels an existing order and places a new order on the same `symbol`.
   * - Filters and Order Count are evaluated before the processing of the cancellation and order placement occurs.
   * - A new order that was not attempted (i.e. when `newOrderResult: NOT_ATTEMPTED` ), will still increase the order count by `1`.
   * - Weight(IP): `1`
   * - Similar to `POST /api/v`3`/order` , additional mandatory parameters are determined by type .
   * - Response format varies depending on whether the processing of the message succeeded, partially succeeded, or failed.
   * - Data Source: Matching Engine
   * - Note: The payload sample does not show all fields that can appear. Please refer to Conditional fields in Order Responses .
   * @param {string} symbol
   * @param {ENUM} side
   * @param {ENUM} type
   * @param {ENUM} cancelReplaceMode  - The allowed values are: STOP_ON_FAILURE - If the cancel request fails, the new order placement will not be attempted. ALLOW_FAILURE - new order placement will be attempted even if cancel request fails.
   * @param {ENUM | undefined} timeInForce
   * @param {number | undefined} quantity
   * @param {number | undefined} quoteOrderQty
   * @param {number | undefined} price
   * @param {string | undefined} cancelNewClientOrderId  - Used to uniquely identify this cancel. Automatically generated by default.
   * @param {string | undefined} cancelOrigClientOrderId  - Either the cancelOrigClientOrderId or cancelOrderId must be provided. If both are provided, cancelOrderId takes precedence.
   * @param {number | undefined} cancelOrderId  - Either the cancelOrigClientOrderId or cancelOrderId must be provided. If both are provided, cancelOrderId takes precedence.
   * @param {string | undefined} newClientOrderId  - Used to identify the new order.
   * @param {number | undefined} strategyId
   * @param {number | undefined} strategyType  - The value cannot be less than `1000000` .
   * @param {number | undefined} stopPrice
   * @param {number | undefined} trailingDelta
   * @param {number | undefined} icebergQty
   * @param {ENUM | undefined} newOrderRespType  - Allowed values: ACK , RESULT , FULL MARKET and LIMIT orders types default to FULL ; all other orders default to ACK
   * @param {ENUM | undefined} selfTradePreventionMode  - The allowed enums is dependent on what is configured on the symbol. The possible supported values are EXPIRE_TAKER , EXPIRE_MAKER , EXPIRE_BOTH , NONE .
   * @param {ENUM | undefined} cancelRestrictions  - Supported values: ONLY_NEW - Cancel will succeed if the order status is NEW . ONLY_PARTIALLY_FILLED - Cancel will succeed if order status is PARTIALLY_FILLED . For more information please refer to Regarding cancelRestrictions
   * @returns { Promise < [Order, Order] > }
  */
  async cancelReplace_order(symbol, side, type, cancelReplaceMode, timeInForce, quantity, quoteOrderQty, price, cancelNewClientOrderId, cancelOrigClientOrderId, cancelOrderId, newClientOrderId, strategyId, strategyType, stopPrice, trailingDelta, icebergQty, newOrderRespType, selfTradePreventionMode, cancelRestrictions) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

    if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

    if (typeof cancelReplaceMode === 'undefined') return new Error('cancelReplaceMode', 'REQUIRED');

    const resp = await this.request('POST', 'api', '/api/v3/order/cancelReplace', { symbol, side, type, cancelReplaceMode, timeInForce, quantity, quoteOrderQty, price, cancelNewClientOrderId, cancelOrigClientOrderId, cancelOrderId, newClientOrderId, strategyId, strategyType, stopPrice, trailingDelta, icebergQty, newOrderRespType, selfTradePreventionMode, cancelRestrictions }, 'TRADE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Get all open orders on a `symbol`. Careful when accessing this with no `symbol`.
   * - Weight(IP): `3` for a single `symbol`; `40` when the `symbol` parameter is omitted;
   * - Data Source: Memory => Database
   * - Note: The payload sample does not show all fields that can appear. Please refer to Conditional fields in Order Responses .
   * - If the `symbol` is not sent, orders for all symbols will be returned in an array.
   * @param {string | undefined} symbol
   * @returns { Promise < Order[] > }
  */
  async current_openOrders(symbol) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'api', '/api/v3/openOrders', { symbol }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Get all account orders; active, canceled, or filled.
   * - Weight(IP): `10` with `symbol`
   * - Data Source: Database
   * - If orderId is set, it will get orders >= that orderId . Otherwise most recent orders are returned.
   * - For some historical orders `cummulativeQuoteQty` will be < `0`, meaning the data is not available at this time.
   * - If startTime and/or endTime provided, orderId is not required.
   * - The payload sample does not show all fields that can appear. Please refer to Conditional fields in Order Responses .
   * @param {string} symbol
   * @param {number | undefined} limit  - Default `500`; max `1000`.
   * @param {number | undefined} orderId
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @returns { Promise < Order[] > }
  */
  async all_orders(symbol, limit, orderId, startTime, endTime) {
    // Expects (HMAC SHA256)
    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/allOrders', { symbol, limit, orderId, startTime, endTime }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Send in a new OCO
   * - Weight(UID) : `2` Weight(IP) : `1`
   * - Parameters :
   * - Other Info:
   * - Data Source: Matching Engine
   * - Price Restrictions: `SELL` : Limit Price > Last Price > Stop Price `BUY` : Limit Price < Last Price < Stop Price
   * - `SELL` : Limit Price > Last Price > Stop Price
   * - `BUY` : Limit Price < Last Price < Stop Price
   * - Quantity Restrictions: Both legs must have the same `quantity` `ICEBERG` quantities however do not have to be the same.
   * - Both legs must have the same `quantity`
   * - `ICEBERG` quantities however do not have to be the same.
   * - Order Rate Limit `OCO` counts as `2` orders against the order rate limit.
   * - `OCO` counts as `2` orders against the order rate limit.
   * @param {string} symbol
   * @param {ENUM} side
   * @param {number} quantity
   * @param {number} price
   * @param {number} stopPrice
   * @param {string | undefined} listClientOrderId  - A unique Id for the entire orderList
   * @param {string | undefined} limitClientOrderId  - A unique Id for the limit order
   * @param {number | undefined} limitStrategyId
   * @param {number | undefined} limitStrategyType  - The value cannot be less than `1000000` .
   * @param {number | undefined} limitIcebergQty
   * @param {number | undefined} trailingDelta
   * @param {string | undefined} stopClientOrderId  - A unique Id for the stop loss/stop loss limit leg
   * @param {number | undefined} stopStrategyId
   * @param {number | undefined} stopStrategyType  - The value cannot be less than `1000000` .
   * @param {number | undefined} stopLimitPrice  - If provided, stopLimitTimeInForce is required.
   * @param {number | undefined} stopIcebergQty
   * @param {ENUM | undefined} stopLimitTimeInForce  - Valid values are GTC / FOK / IOC
   * @param {ENUM | undefined} newOrderRespType  - Set the response JSON.
   * @param {ENUM | undefined} selfTradePreventionMode  - The allowed enums is dependent on what is configured on the symbol. The possible supported values are EXPIRE_TAKER , EXPIRE_MAKER , EXPIRE_BOTH , NONE .
   * @returns { Promise <  > }
  */
  async new_oco_trade(symbol, side, quantity, price, stopPrice, listClientOrderId, limitClientOrderId, limitStrategyId, limitStrategyType, limitIcebergQty, trailingDelta, stopClientOrderId, stopStrategyId, stopStrategyType, stopLimitPrice, stopIcebergQty, stopLimitTimeInForce, newOrderRespType, selfTradePreventionMode) {
    // Expects (HMAC SHA256)
    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

    if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

    if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

    if (typeof stopPrice === 'undefined') return new Error('stopPrice', 'REQUIRED');

    const resp = await this.request('POST', 'api', '/api/v3/order/oco', { symbol, side, quantity, price, stopPrice, listClientOrderId, limitClientOrderId, limitStrategyId, limitStrategyType, limitIcebergQty, trailingDelta, stopClientOrderId, stopStrategyId, stopStrategyType, stopLimitPrice, stopIcebergQty, stopLimitTimeInForce, newOrderRespType, selfTradePreventionMode }, 'TRADE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - ` DELETE /api/v`3`/orderList (HMAC SHA`256`) ` Cancel an entire Order List.
   * - Weight(IP) : `1`
   * - Additional notes:
   * - Data Source: Matching Engine
   * - Canceling an individual leg will cancel the entire OCO
   * - If both orderListId and `listClientOrderID` are provided, `orderId` takes precedence.
   * @param {string} symbol
   * @param {number | undefined} orderListId  - Either orderListId or listClientOrderId must be provided
   * @param {string | undefined} listClientOrderId  - Either orderListId or listClientOrderId must be provided
   * @param {string | undefined} newClientOrderId  - Used to uniquely identify this cancel. Automatically generated by default
   * @returns { Promise < {"orderListId":0,"contingencyType":"OCO","listStatusType":"ALL_DONE","listOrderStatus":"ALL_DONE","listClientOrderId":"C3wyj4WVEktd7u9aVBRXcN","transactionTime":1574040868128,"symbol":"LTCBTC","orders":[{"symbol":"LTCBTC","orderId":2,"clientOrderId":"pO9ufTiFGg3nw2fOdgeOXa"},{"symbol":"LTCBTC","orderId":3,"clientOrderId":"TXOvglzXuaubXAaENpaRCB"}],"orderReports":[{"symbol":"LTCBTC","origClientOrderId":"pO9ufTiFGg3nw2fOdgeOXa","orderId":2,"orderListId":0,"clientOrderId":"unfWT8ig8i0uj6lPuYLez6","price":"1.00000000","origQty":"10.00000000","executedQty":"0.00000000","cummulativeQuoteQty":"0.00000000","status":"CANCELED","timeInForce":"GTC","type":"STOP_LOSS_LIMIT","side":"SELL","stopPrice":"1.00000000","selfTradePreventionMode":"NONE"},{"symbol":"LTCBTC","origClientOrderId":"TXOvglzXuaubXAaENpaRCB","orderId":3,"orderListId":0,"clientOrderId":"unfWT8ig8i0uj6lPuYLez6","price":"3.00000000","origQty":"10.00000000","executedQty":"0.00000000","cummulativeQuoteQty":"0.00000000","status":"CANCELED","timeInForce":"GTC","type":"LIMIT_MAKER","side":"SELL","selfTradePreventionMode":"NONE"}]} > }
  */
  async cancel_oco_trade(symbol, orderListId, listClientOrderId, newClientOrderId) {
    // Expects (HMAC SHA256)
    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('DELETE', 'api', '/api/v3/orderList', { symbol, orderListId, listClientOrderId, newClientOrderId }, 'TRADE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Retrieves a specific OCO based on provided optional parameters
   * - Weight(IP) : `2`
   * - Parameters :
   * - Data Source: Database
   * @param {number | undefined} orderListId  - Either orderListId or origClientOrderId must be provided
   * @param {string | undefined} origClientOrderId  - Either orderListId or origClientOrderId must be provided
   * @returns { Promise < {"orderListId":27,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"h2USkA5YQpaXHPIrkd96xE","transactionTime":1565245656253,"symbol":"LTCBTC","orders":[{"symbol":"LTCBTC","orderId":4,"clientOrderId":"qD1gy3kc3Gx0rihm9Y3xwS"},{"symbol":"LTCBTC","orderId":5,"clientOrderId":"ARzZ9I00CPM8i3NhmU9Ega"}]} > }
  */
  async query_oco(orderListId, origClientOrderId) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'api', '/api/v3/orderList', { orderListId, origClientOrderId }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Retrieves all OCO based on provided optional parameters
   * - Weight(IP) : `10`
   * - Data Source: Database
   * @param {number | undefined} limit  - Default Value: `500`; Max Value: `1000`
   * @param {number | undefined} fromId  - If supplied, neither startTime or endTime can be provided
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @returns { Promise < [{"orderListId":29,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"amEEAXryFzFwYF1FeRpUoZ","transactionTime":1565245913483,"symbol":"LTCBTC","orders":[{"symbol":"LTCBTC","orderId":4,"clientOrderId":"oD7aesZqjEGlZrbtRpy5zB"},{"symbol":"LTCBTC","orderId":5,"clientOrderId":"Jr1h6xirOxgeJOUuYQS7V3"}]},{"orderListId":28,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"hG7hFNxJV6cZy3Ze4AUT4d","transactionTime":1565245913407,"symbol":"LTCBTC","orders":[{"symbol":"LTCBTC","orderId":2,"clientOrderId":"j6lFOfbmFMRjTYA7rRJ0LP"},{"symbol":"LTCBTC","orderId":3,"clientOrderId":"z0KCjOdditiLS5ekAFtK81"}]}] > }
  */
  async query_all_oco(limit, fromId, startTime, endTime) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'api', '/api/v3/allOrderList', { limit, fromId, startTime, endTime }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP) : `3`
   * - Data Source: Database
   * @returns { Promise < [{"orderListId":31,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"wuB13fmulKj3YjdqWEcsnp","transactionTime":1565246080644,"symbol":"LTCBTC","orders":[{"symbol":"LTCBTC","orderId":4,"clientOrderId":"r3EH2N76dHfLoSZWIUw1bT"},{"symbol":"LTCBTC","orderId":5,"clientOrderId":"Cv1SnyPD3qhqpbjpYEHbd2"}]}] > }
  */
  async query_open_oco() {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'api', '/api/v3/openOrderList', {}, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Get current account information.
   * - Weight(IP): `10`
   * - Data Source: Memory => Database
   * @returns { Promise < Account > }
  */
  async account(activeAssetsOnly = false) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'api', '/api/v3/account', {}, 'USER_DATA');
    if (resp.error) return resp;

    if (activeAssetsOnly) resp.balances = resp.balances.filter(item => item.free != 0 || item.locked != 0)

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Get current account information.
   * - Weight(IP): `10`
   * - Data Source: Memory => Database
   * @returns { Promise < Account_mapped > }
  */
  async account_mapped(activeAssetsOnly = false) {
    // Expects (HMAC SHA256)
    const resp = await this.account(activeAssetsOnly);
    if (resp.error) return resp;

    return new Account_mapped(resp);
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Get trades for a specific account and `symbol`.
   * - Weight(IP): `10`
   * - Data Source: Memory => Database
   * - If fromId is set, it will get id >= that fromId . Otherwise most recent trades are returned.
   * - The time between startTime and endTime can't be longer than `24` hours.
   * - These are the supported combinations of all parameters: symbol symbol + orderId symbol + startTime symbol + endTime symbol + fromId symbol + startTime + endTime symbol + orderId + fromId
   * - symbol
   * - symbol + orderId
   * - symbol + startTime
   * - symbol + endTime
   * - symbol + fromId
   * - symbol + startTime + endTime
   * - symbol + orderId + fromId
   * @param {string} symbol
   * @param {number | undefined} limit  - Default `500`; max `1000`.
   * @param {number | undefined} orderId  - This can only be used in combination with symbol .
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @param {number | undefined} fromId  - TradeId to fetch from. Default gets most recent trades.
   * @returns { Promise <  > }
  */
  async userTrades(symbol, limit, orderId, startTime, endTime, fromId) {
    // Expects (HMAC SHA256)
    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/myTrades', { symbol, limit, orderId, startTime, endTime, fromId }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Displays the user's current order count usage for all intervals.
   * - Weight(IP): `20`
   * - Data Source: Memory
   * @returns { Promise < [{"rateLimitType":"ORDERS","interval":"SECOND","intervalNum":10,"limit":10000,"count":0},{"rateLimitType":"ORDERS","interval":"DAY","intervalNum":1,"limit":20000,"count":0}] > }
  */
  async current_orderCount_usage() {

    const resp = await this.request('GET', 'api', '/api/v3/rateLimit/order', {}, 'TRADE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Displays the list of orders that were expired because of STP.
   * - For additional information on what a Prevented match is, as well as Self Trade Prevention (STP), please refer to our STP FAQ page.
   * - These are the combinations supported:
   * - Database
   * - symbol + preventedMatchId
   * - symbol + orderId
   * - symbol + orderId + fromPreventedMatchId ( limit will default to `500`)
   * - symbol + orderId + fromPreventedMatchId + limit
   * @param {string} symbol
   * @param {number | undefined} limit  - Default: `500` ; Max: `1000`
   * @param {number | undefined} preventedMatchId
   * @param {number | undefined} orderId
   * @param {number | undefined} fromPreventedMatchId
   * @returns { Promise < [{"symbol":"BTCUSDT","preventedMatchId":1,"takerOrderId":5,"makerOrderId":3,"tradeGroupId":1,"selfTradePreventionMode":"EXPIRE_MAKER","price":"1.100000","makerPreventedQuantity":"1.300000","transactTime":1669101687094}] > }
  */
  async query_preventedMatches(symbol, limit, preventedMatchId, orderId, fromPreventedMatchId) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('GET', 'api', '/api/v3/myPreventedMatches', { symbol, limit, preventedMatchId, orderId, fromPreventedMatchId }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  // SPOT ACCOUNT/TRADE ////

  /**
   * Contains all the `Wallet` API requests.
   */
  Wallet = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get information of coins (available for deposit and withdraw) for user.
     * - Weight(IP): `10`
     * @returns { Promise < [{"coin":"BTC","depositAllEnable":true,"free":"0.08074558","freeze":"0.00000000","ipoable":"0.00000000","ipoing":"0.00000000","isLegalMoney":false,"locked":"0.00000000","name":"Bitcoin","networkList":[{"addressRegex":"^(bnb1)[0-9a-z]{38}$","coin":"BTC","depositDesc":"Wallet Maintenance, Deposit Suspended","depositEnable":false,"isDefault":false,"memoRegex":"^[0-9A-Za-z\\-_]{1,120}$","minConfirm":1,"name":"BEP2","network":"BNB","resetAddressStatus":false,"specialTips":"Both a MEMO and an Address are required to successfully deposit your BEP2-BTCB tokens to Binance.","unLockConfirm":0,"withdrawDesc":"Wallet Maintenance, Withdrawal Suspended","withdrawEnable":false,"withdrawFee":"0.00000220","withdrawIntegerMultiple":"0.00000001","withdrawMax":"9999999999.99999999","withdrawMin":"0.00000440","sameAddress":true,"estimatedArrivalTime":25,"busy":false},{"addressRegex":"^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1)[0-9A-Za-z]{39,59}$","coin":"BTC","depositEnable":true,"isDefault":true,"memoRegex":"","minConfirm":1,"name":"BTC","network":"BTC","resetAddressStatus":false,"specialTips":"","unLockConfirm":2,"withdrawEnable":true,"withdrawFee":"0.00050000","withdrawIntegerMultiple":"0.00000001","withdrawMax":"750","withdrawMin":"0.00100000","sameAddress":false,"estimatedArrivalTime":25,"busy":false}],"storage":"0.00000000","trading":true,"withdrawAllEnable":true,"withdrawing":"0.00000000"}] > }
    */
    all_coins_information: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/capital/config/getall', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `2400`
     * - The query time period must be less then `30` days
     * - Support query within the last one month only
     * - If `startTime` and `endTime` not sent, return records of the last `7` days by default
     * @param {string} type  - "SPOT", "MARGIN", "FUTURES"
     * @param {number | undefined} limit  - min `7`, max `30`, default `7`
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < {"code":200,"msg":"","snapshotVos":[{"data":{"balances":[{"asset":"BTC","free":"0.09905021","locked":"0.00000000"},{"asset":"USDT","free":"1.89109409","locked":"0.00000000"}],"totalAssetOfBtc":"0.09942700"},"type":"spot","updateTime":1576281599000}]} > }
     * @returns { Promise < {"code":200,"msg":"","snapshotVos":[{"data":{"marginLevel":"2748.02909813","totalAssetOfBtc":"0.00274803","totalLiabilityOfBtc":"0.00000100","totalNetAssetOfBtc":"0.00274750","userAssets":[{"asset":"XRP","borrowed":"0.00000000","free":"1.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"1.00000000"}]},"type":"margin","updateTime":1576281599000}]} > }
     * @returns { Promise < {"code":200,"msg":"","snapshotVos":[{"data":{"assets":[{"asset":"USDT","marginBalance":"118.99782335","walletBalance":"120.23811389"}],"position":[{"entryPrice":"7130.41000000","markPrice":"7257.66239673","positionAmt":"0.01000000","symbol":"BTCUSDT","unRealizedProfit":"1.24029054"}]},"type":"futures","updateTime":1576281599000}]} > }
    */
    daily_account_snapshot: async (type, limit, startTime, endTime) => {
      // Expects (HMAC SHA256)
      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/accountSnapshot', { type, limit, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - This request will disable fastwithdraw switch under your account. You need to enable "trade" option for the api key which requests this endpoint.
     * - Caution: This request will disable fastwithdraw switch under your account. You need to enable "trade" option for the api key which requests this endpoint.
     * @returns { Promise < {} > }
    */
    disable_fast_withdraw_switch: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/account/disableFastWithdrawSwitch', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - This request will enable fastwithdraw switch under your account. You need to enable "trade" option for the api key which requests this endpoint.
     * - When Fast Withdraw Switch is on, transferring funds to a Binance account will be done instantly. There is no on-chain transaction, no transaction ID and no withdrawal fee.
     * @returns { Promise < {} > }
    */
    enable_fast_withdraw_switch: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/account/enableFastWithdrawSwitch', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Submit a withdraw request.
     * - Weight(UID): `600`
     * - If network not send, return with default `network` of the `coin`.
     * - You can get network and `isDefault` in `networkList` of a `coin` in the response of `Get /sapi/v`1`/capital/config/getall (HMAC SHA`256`)` .
     * @param {string} coin
     * @param {string} address
     * @param {number} amount
     * @param {string | undefined} withdrawOrderId  - client id for withdraw
     * @param {string | undefined} network
     * @param {string | undefined} addressTag  - Secondary address identifier for coins like XRP,XMR etc.
     * @param {BOOLEAN | undefined} transactionFeeFlag  - When making internal transfer, true for returning the fee to the destination account; false for returning the fee back to the departure account. Default false .
     * @param {string | undefined} name  - Description of the address. Space in name should be encoded into %`20` .
     * @param {INTEGER | undefined} walletType  - The wallet type for withdraw,`0`-spot wallet ,`1`-funding wallet. Default walletType is the current "selected wallet" under wallet->Fiat and Spot/Funding->Deposit
     * @returns { Promise < {"id":"7213fea8e94b4a5593d507237e5a555b"} > }
    */
    withdraw: async (coin, address, amount, withdrawOrderId, network, addressTag, transactionFeeFlag, name, walletType) => {
      // Expects (HMAC SHA256)
      if (typeof coin === 'undefined') return new Error('coin', 'REQUIRED');

      if (typeof address === 'undefined') return new Error('address', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/capital/withdraw/apply', { coin, address, amount, withdrawOrderId, network, addressTag, transactionFeeFlag, name, walletType }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Fetch deposit history.
     * - Weight(IP): `1`
     * - Please notice the default startTime and endTime to make sure that time interval is within `0`-`90` days.
     * - If both startTime and endTime are sent, time between startTime and endTime must be less than `90` days.
     * @param {number | undefined} limit  - Default:`1000`, Max:`1000`
     * @param {string | undefined} coin
     * @param {number | undefined} status  - `0`(`0`:pending,`6`: credited but cannot withdraw, `7`=Wrong Deposit,`8`=Waiting User confirm, `1`:success)
     * @param {number | undefined} startTime  - Default: `90` days from current timestamp
     * @param {number | undefined} endTime  - Default: present timestamp
     * @param {number | undefined} offset  - Default:`0`
     * @param {string | undefined} txId
     * @returns { Promise < [{"id":"769800519366885376","amount":"0.001","coin":"BNB","network":"BNB","status":0,"address":"bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23","addressTag":"101764890","txId":"98A3EA560C6B3336D348B6C83F0F95ECE4F1F5919E94BD006E5BF3BF264FACFC","insertTime":1661493146000,"transferType":0,"confirmTimes":"1/1","unlockConfirm":0,"walletType":0},{"id":"769754833590042625","amount":"0.50000000","coin":"IOTA","network":"IOTA","status":1,"address":"SIZ9VLMHWATXKV99LH99CIGFJFUMLEHGWVZVNNZXRJJVWBPHYWPPBOSDORZ9EQSHCZAMPVAPGFYQAUUV9DROOXJLNW","addressTag":"","txId":"ESBFVQUTPIWQNJSPXFNHNYHSQNTGKRVKPRABQWTAXCDWOAKDKYWPTVG9BGXNVNKTLEJGESAVXIKIZ9999","insertTime":1599620082000,"transferType":0,"confirmTimes":"1/1","unlockConfirm":0,"walletType":0}] > }
     */
    deposit_history_supporting_network: async (limit, coin, status, startTime, endTime, offset, txId) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/capital/deposit/hisrec', { limit, coin, status, startTime, endTime, offset, txId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Fetch withdraw history.
     * - Weight(IP): `1`
     * - `network` may not be in the response for old withdraw.
     * - Please notice the default startTime and endTime to make sure that time interval is within `0`-`90` days.
     * - If both startTime and endTime are sent, time between startTime and endTime must be less than `90` days.
     * - If withdrawOrderId is sent, time between startTime and endTime must be less than `7` days.
     * - If withdrawOrderId is sent, startTime and endTime are not sent, will return last `7` days records by default.
     * @param {number | undefined} limit  - Default: `1000`, Max: `1000`
     * @param {string | undefined} coin
     * @param {string | undefined} withdrawOrderId
     * @param {number | undefined} status  - `0`(`0`:Email Sent,`1`:Cancelled `2`:Awaiting Approval `3`:Rejected `4`:Processing `5`:Failure `6`:Completed)
     * @param {number | undefined} offset
     * @param {number | undefined} startTime  - Default: `90` days from current timestamp
     * @param {number | undefined} endTime  - Default: present timestamp
     * @returns { Promise <  > }
     */
    withdraw_history_supporting_network: async (limit, coin, withdrawOrderId, status, offset, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/capital/withdraw/history', { limit, coin, withdrawOrderId, status, offset, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Fetch deposit address with `network`.
     * - Weight(IP): `10`.
     * - If network is not send, return with default `network` of the `coin`.
     * - You can get network and `isDefault` in `networkList` in the response of `Get /sapi/v1/capital/config/getall (HMAC SHA256)`.
     * @param {string} coin
     * @param {string | undefined} network
     * @returns { Promise <  > }
     */
    deposit_address_supporting_network: async (coin, network) => {
      // Expects (HMAC SHA256)
      if (typeof coin === 'undefined') return new Error('coin', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/capital/deposit/address', { coin, network }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Fetch account status detail.
     * - Weight(IP): `1`
     * @returns { Promise < {"data":"Normal"} > }
     */
    account_status: async () => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/account/status', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Fetch account api trading status detail.
     * - Weight(IP): `1`
     * @returns { Promise < {"data":{"isLocked":false,"plannedRecoverTime":0,"triggerCondition":{"GCR":150,"IFER":150,"UFR":300},"updateTime":1547630471725}} > }
     */
    account_api_trading_status: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/account/apiTradingStatus', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Only return last `100` records
     * - Only return records after `2020`/`12`/`01`
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise <  > }
    */
    async dustlog(startTime, endTime) {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/asset/dribblet', { startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * @returns { Promise < {"details":[{"asset":"ADA","assetFullName":"ADA","amountFree":"6.21","toBTC":"0.00016848","toBNB":"0.01777302","toBNBOffExchange":"0.01741756","exchange":"0.00035546"}],"totalTransferBtc":"0.00016848","totalTransferBNB":"0.01777302","dribbletPercentage":"0.02"} > }
    */
    get_assets_that_can_be_converted_into_bnb: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/asset/dust-btc', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Convert dust assets to BNB.
     * - Weight(UID): `10`
     * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
     * @param {ARRAY} asset  - The asset being converted. For example: asset=BTC,USDT
     * @returns { Promise < {"totalServiceCharge":"0.02102542","totalTransfered":"1.05127099","transferResult":[{"amount":"0.03000000","fromAsset":"ETH","operateTime":1563368549307,"serviceChargeAmount":"0.00500000","tranId":2970932918,"transferedAmount":"0.25000000"},{"amount":"0.09000000","fromAsset":"LTC","operateTime":1563368549404,"serviceChargeAmount":"0.01548000","tranId":2970932918,"transferedAmount":"0.77400000"},{"amount":"248.61878453","fromAsset":"TRX","operateTime":1563368549489,"serviceChargeAmount":"0.00054542","tranId":2970932918,"transferedAmount":"0.02727099"}]} > }
    */
    dust_transfer: async (asset) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/asset/dust', { asset }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Query `asset` dividend record.
     * - Weight(IP): `10`
     * - There cannot be more than `180` days between parameter startTime and endTime .
     * @param {number | undefined} limit  - Default `20`, max `500`
     * @param {string | undefined} asset
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < {"rows":[{"id":1637366104,"amount":"10.00000000","asset":"BHFT","divTime":1563189166000,"enInfo":"BHFT distribution","tranId":2968885920},{"id":1631750237,"amount":"10.00000000","asset":"BHFT","divTime":1563189165000,"enInfo":"BHFT distribution","tranId":2968885920}],"total":2} > }
    */
    asset_dividend_record: async (limit, asset, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/asset/assetDividend', { limit, asset, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Fetch details of assets supported on Binance.
     * - Weight(IP): `1`
     * - Please get network and other deposit or withdraw details from `GET /sapi/v`1`/capital/config/getall` .
     * @param {string | undefined} asset
     * @returns { Promise < {"CTR":{"minWithdrawAmount":"70.00000000","depositStatus":false,"withdrawFee":35,"withdrawStatus":true,"depositTip":"Delisted, Deposit Suspended"},"SKY":{"minWithdrawAmount":"0.02000000","depositStatus":true,"withdrawFee":0.01,"withdrawStatus":true}} > }
    */
    asset_detail: async (asset) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/asset/assetDetail', { asset }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Fetch trade fee
     * - Weight(IP): `1`
     * @param {string | undefined} symbol
     * @returns { Promise < [{"symbol":"ADABNB","makerCommission":"0.001","takerCommission":"0.001"},{"symbol":"BNBBTC","makerCommission":"0.001","takerCommission":"0.001"}] > }
    */
    trade_fee: async (symbol) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/asset/tradeFee', { symbol }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - You need to enable `Permits Universal Transfer` option for the API Key which requests this endpoint.
     * - Weight(UID): `900`
     * - toSymbol must be sent when `type` are MARGIN_ISOLATEDMARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN
     * - ENUM of transfer types:
     * - fromSymbol must be sent when `type` are ISOLATEDMARGIN_MARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN
     * - toSymbol must be sent when `type` are MARGIN_ISOLATEDMARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN
     * - ENUM of transfer types: MAIN_UMFUTURE Spot account transfer to USDⓈ-M Futures account MAIN_CMFUTURE Spot account transfer to COIN-M Futures account MAIN_MARGIN Spot account transfer to Margin（cross）account UMFUTURE_MAIN USDⓈ-M Futures account transfer to Spot account UMFUTURE_MARGIN USDⓈ-M Futures account transfer to Margin（cross）account CMFUTURE_MAIN COIN-M Futures account transfer to Spot account CMFUTURE_MARGIN COIN-M Futures account transfer to Margin(cross) account MARGIN_MAIN Margin（cross）account transfer to Spot account MARGIN_UMFUTURE Margin（cross）account transfer to USDⓈ-M Futures MARGIN_CMFUTURE Margin（cross）account transfer to COIN-M Futures ISOLATEDMARGIN_MARGIN Isolated margin account transfer to Margin(cross) account MARGIN_ISOLATEDMARGIN Margin(cross) account transfer to Isolated margin account ISOLATEDMARGIN_ISOLATEDMARGIN Isolated margin account transfer to Isolated margin account MAIN_FUNDING Spot account transfer to Funding account FUNDING_MAIN Funding account transfer to Spot account FUNDING_UMFUTURE Funding account transfer to UMFUTURE account UMFUTURE_FUNDING UMFUTURE account transfer to Funding account MARGIN_FUNDING MARGIN account transfer to Funding account FUNDING_MARGIN Funding account transfer to Margin account FUNDING_CMFUTURE Funding account transfer to CMFUTURE account CMFUTURE_FUNDING CMFUTURE account transfer to Funding account MAIN_OPTION Spot account transfer to Options account OPTION_MAIN Options account transfer to Spot account UMFUTURE_OPTION USDⓈ-M Futures account transfer to Options account OPTION_UMFUTURE Options account transfer to USDⓈ-M Futures account MARGIN_OPTION Margin（cross）account transfer to Options account OPTION_MARGIN Options account transfer to Margin（cross）account FUNDING_OPTION Funding account transfer to Options account OPTION_FUNDING Options account transfer to Funding account MAIN_PORTFOLIO_MARGIN Spot account transfer to Portfolio Margin account PORTFOLIO_MARGIN_MAIN Portfolio Margin account transfer to Spot account
     * - MAIN_UMFUTURE Spot account transfer to USDⓈ-M Futures account
     * - MAIN_CMFUTURE Spot account transfer to COIN-M Futures account
     * - MAIN_MARGIN Spot account transfer to Margin（cross）account
     * - UMFUTURE_MAIN USDⓈ-M Futures account transfer to Spot account
     * - UMFUTURE_MARGIN USDⓈ-M Futures account transfer to Margin（cross）account
     * - CMFUTURE_MAIN COIN-M Futures account transfer to Spot account
     * - CMFUTURE_MARGIN COIN-M Futures account transfer to Margin(cross) account
     * - MARGIN_MAIN Margin（cross）account transfer to Spot account
     * - MARGIN_UMFUTURE Margin（cross）account transfer to USDⓈ-M Futures
     * - MARGIN_CMFUTURE Margin（cross）account transfer to COIN-M Futures
     * - ISOLATEDMARGIN_MARGIN Isolated margin account transfer to Margin(cross) account
     * - MARGIN_ISOLATEDMARGIN Margin(cross) account transfer to Isolated margin account
     * - ISOLATEDMARGIN_ISOLATEDMARGIN Isolated margin account transfer to Isolated margin account
     * - MAIN_FUNDING Spot account transfer to Funding account
     * - FUNDING_MAIN Funding account transfer to Spot account
     * - FUNDING_UMFUTURE Funding account transfer to UMFUTURE account
     * - UMFUTURE_FUNDING UMFUTURE account transfer to Funding account
     * - MARGIN_FUNDING MARGIN account transfer to Funding account
     * - FUNDING_MARGIN Funding account transfer to Margin account
     * - FUNDING_CMFUTURE Funding account transfer to CMFUTURE account
     * - CMFUTURE_FUNDING CMFUTURE account transfer to Funding account
     * - MAIN_OPTION Spot account transfer to Options account
     * - OPTION_MAIN Options account transfer to Spot account
     * - UMFUTURE_OPTION USDⓈ-M Futures account transfer to Options account
     * - OPTION_UMFUTURE Options account transfer to USDⓈ-M Futures account
     * - MARGIN_OPTION Margin（cross）account transfer to Options account
     * - OPTION_MARGIN Options account transfer to Margin（cross）account
     * - FUNDING_OPTION Funding account transfer to Options account
     * - OPTION_FUNDING Options account transfer to Funding account
     * - MAIN_PORTFOLIO_MARGIN Spot account transfer to Portfolio Margin account
     * - PORTFOLIO_MARGIN_MAIN Portfolio Margin account transfer to Spot account
     * @param {ENUM} type
     * @param {string} asset
     * @param {number} amount
     * @param {string | undefined} fromSymbol
     * @param {string | undefined} toSymbol
     * @returns { Promise < {"tranId":13526853623} > }
    */
    user_universal_transfer: async (type, asset, amount, fromSymbol, toSymbol) => {
      // Expects (HMAC SHA256)
      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/asset/transfer', { type, asset, amount, fromSymbol, toSymbol }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - fromSymbol must be sent when `type` are ISOLATEDMARGIN_MARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN
     * - toSymbol must be sent when `type` are MARGIN_ISOLATEDMARGIN and ISOLATEDMARGIN_ISOLATEDMARGIN
     * - Support query within the last `6` months only
     * - If startTime and endTime not sent, return records of the last `7` days by default
     * @param {ENUM} type
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Default `1`
     * @param {number | undefined} size  - Default `10`, Max `100`
     * @param {string | undefined} fromSymbol
     * @param {string | undefined} toSymbol
     * @returns { Promise < {"total":2,"rows":[{"asset":"USDT","amount":"1","type":"MAIN_UMFUTURE","status":"CONFIRMED","tranId":11415955596,"timestamp":1544433328000},{"asset":"USDT","amount":"2","type":"MAIN_UMFUTURE","status":"CONFIRMED","tranId":11366865406,"timestamp":1544433328000}]} > }
    */
    query_user_universal_transfer_history: async (type, startTime, endTime, current, size, fromSymbol, toSymbol) => {
      // Expects (HMAC SHA256)
      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/asset/transfer', { type, startTime, endTime, current, size, fromSymbol, toSymbol }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Currently supports querying the following business assets:Binance Pay, Binance Card, Binance Gift Card, Stock Token
     * @param {string | undefined} asset
     * @param {string | undefined} needBtcValuation  - true or false
     * @returns { Promise < [{"asset":"USDT","free":"1","locked":"0","freeze":"0","withdrawing":"0","btcValuation":"0.00000091"}] > }
    */
    funding_wallet: async (asset, needBtcValuation) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/asset/get-funding-asset', { asset, needBtcValuation }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get user assets, just for positive data.
     * - Weight(IP): `5`
     * - If `asset` is set, then return this `asset`, otherwise return all assets positive.
     * - If `needBtcValuation` is set, then return btcValudation.
     * @param {string | undefined} asset  - If asset is blank, then query all positive assets user have.
     * @param {BOOLEAN | undefined} needBtcValuation  - Whether need btc valuation or not.
     * @returns { Promise < [{"asset":"AVAX","free":"1","locked":"0","freeze":"0","withdrawing":"0","ipoable":"0","btcValuation":"0"},{"asset":"BCH","free":"0.9","locked":"0","freeze":"0","withdrawing":"0","ipoable":"0","btcValuation":"0"},{"asset":"BNB","free":"887.47061626","locked":"0","freeze":"10.52","withdrawing":"0.1","ipoable":"0","btcValuation":"0"},{"asset":"BUSD","free":"9999.7","locked":"0","freeze":"0","withdrawing":"0","ipoable":"0","btcValuation":"0"},{"asset":"SHIB","free":"532.32","locked":"0","freeze":"0","withdrawing":"0","ipoable":"0","btcValuation":"0"},{"asset":"USDT","free":"50300000001.44911105","locked":"0","freeze":"0","withdrawing":"0","ipoable":"0","btcValuation":"0"},{"asset":"WRZ","free":"1","locked":"0","freeze":"0","withdrawing":"0","ipoable":"0","btcValuation":"0"}] > }
    */
    user_asset: async (asset, needBtcValuation) => {

      const resp = await this.request('POST', 'sapi', '/sapi/v3/asset/getUserAsset', { asset, needBtcValuation }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Convert transfer, convert between BUSD and stablecoins.
     * - Weight(UID): `5`
     * - If the `clientTranId` has been used before, will not do the convert transfer, the original transfer will be returned.
     * @param {string} clientTranId  - The unique user-defined transaction id, min length `20`
     * @param {string} asset  - The current asset
     * @param {BigDecimal} amount  - The amount must be positive number
     * @param {String} targetAsset  - Target asset you want to convert
     * @param {String | undefined} accountType  - Only MAIN and CARD , default MAIN
     * @returns { Promise < {"tranId":118263407119,"status":"S"} > }
    */
    busd_convert_trade: async (clientTranId, asset, amount, targetAsset, accountType) => {

      if (typeof clientTranId === 'undefined') return new Error('clientTranId', 'REQUIRED');

      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      if (typeof targetAsset === 'undefined') return new Error('targetAsset', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/asset/convert-transfer', { clientTranId, asset, amount, targetAsset, accountType }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `5`
     * - ENUM of types: `244` convert via sapi call `11` auto convert when deposit `32` auto convert when withdraw `34` in case withdraw failed `254` busd auto convert job
     * - `244` convert via sapi call
     * - `11` auto convert when deposit
     * - `32` auto convert when withdraw
     * - `34` in case withdraw failed
     * - `254` busd auto convert job
     * @param {number} startTime  - inclusive, unit: ms
     * @param {number} endTime  - exclusive, unit: ms
     * @param {number | undefined} tranId  - The transaction id
     * @param {string | undefined} clientTranId  - The user-defined transaction id
     * @param {string | undefined} asset  - If it is blank, we will match deducted asset and target asset.
     * @param {string | undefined} accountType  - MAIN: main account. CARD: funding account. If it is blank, we will query spot and card wallet, otherwise, we just query the corresponding wallet
     * @param {INTEGER | undefined} current  - current page, default `1`, the min value is `1`
     * @param {INTEGER | undefined} size  - page size, default `10`, the max value is `100`
     * @returns { Promise < {"total":3,"rows":[{"tranId":118263615991,"type":244,"time":1664442078000,"deductedAsset":"BUSD","deductedAmount":"1","targetAsset":"USDC","targetAmount":"1","status":"S","accountType":"MAIN"},{"tranId":118263598801,"type":244,"time":1664442061000,"deductedAsset":"BUSD","deductedAmount":"1","targetAsset":"USDC","targetAmount":"1","status":"S","accountType":"MAIN"},{"tranId":118263407119,"type":244,"time":1664441820000,"deductedAsset":"BUSD","deductedAmount":"1","targetAsset":"USDC","targetAmount":"1","status":"S","accountType":"MAIN"}]} > }
    */
    busd_convert_history: async (startTime, endTime, tranId, clientTranId, asset, accountType, current, size) => {

      if (typeof startTime === 'undefined') return new Error('startTime', 'REQUIRED');

      if (typeof endTime === 'undefined') return new Error('endTime', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/asset/convert-transfer/queryByPage', { startTime, endTime, tranId, clientTranId, asset, accountType, current, size }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - The query of Cloud-Mining payment and refund history
     * - Weight(UID): `600`
     * - Just return the SUCCESS records of payment and refund.
     * - For response, type = `248` means payment, type = `249` means refund, status =S means SUCCESS.
     * @param {number} startTime  - inclusive, unit: ms
     * @param {number} endTime  - exclusive, unit: ms
     * @param {number | undefined} tranId  - The transaction id
     * @param {string | undefined} clientTranId  - The unique flag
     * @param {string | undefined} asset  - If it is blank, we will query all assets
     * @param {INTEGER | undefined} current  - current page, default `1`, the min value is `1`
     * @param {INTEGER | undefined} size  - page size, default `10`, the max value is `100`
     * @returns { Promise < {"total":5,"rows":[{"createTime":1667880112000,"tranId":121230610120,"type":248,"asset":"USDT","amount":"25.0068","status":"S"},{"createTime":1666776366000,"tranId":119991507468,"type":249,"asset":"USDT","amount":"0.027","status":"S"},{"createTime":1666764505000,"tranId":119977966327,"type":248,"asset":"USDT","amount":"0.027","status":"S"},{"createTime":1666758189000,"tranId":119973601721,"type":248,"asset":"USDT","amount":"0.018","status":"S"},{"createTime":1666757278000,"tranId":119973028551,"type":248,"asset":"USDT","amount":"0.018","status":"S"}]} > }
    */
    get_cloud_mining_payment_and_refund_history: async (startTime, endTime, tranId, clientTranId, asset, current, size) => {

      if (typeof startTime === 'undefined') return new Error('startTime', 'REQUIRED');

      if (typeof endTime === 'undefined') return new Error('endTime', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/asset/ledger-transfer/cloud-mining/queryByPage', { startTime, endTime, tranId, clientTranId, asset, current, size }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * @returns { Promise < {"ipRestrict":false,"createTime":1623840271000,"enableWithdrawals":false,"enableInternalTransfer":true,"permitsUniversalTransfer":true,"enableVanillaOptions":false,"enableReading":true,"enableFutures":false,"enableMargin":false,"enableSpotAndMarginTrading":false,"tradingAuthorityExpirationTime":1628985600000} > }
    */
    get_api_key_permission: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/account/apiRestrictions', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get a user's auto-conversion settings in deposit/withdrawal
     * - Weight(UID): `600`
     * - Parameters: None
     * @returns { Promise < {"convertEnabled":true,"coins":["USDC","USDP","TUSD"],"exchangeRates":{"USDC":"1","TUSD":"1","USDP":"1"}} > }
    */
    query_auto_converting_stable_coins: async () => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/capital/contract/convertible-coins', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Response: Returns code `200` on success without body.
     * - User can use it to turn on or turn off the BUSD auto-conversion from/to a specific stable `coin`.
     * - Weight(UID): `600`
     * - Params need to be in the POST body
     * @param {string} coin  - Must be USDC, USDP or TUSD
     * @param {BOOLEAN} enable  - true: turn on the auto-conversion. false: turn off the auto-conversion
     * @returns { Promise <  > }
    */
    switch_on_off_busd_and_stable_coins_conversion: async (coin, enable) => {

      if (typeof coin === 'undefined') return new Error('coin', 'REQUIRED');

      if (typeof enable === 'undefined') return new Error('enable', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/capital/contract/convertible-coins', { coin, enable }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Apply deposit credit for expired address (One click arrival)
     * - Weight(IP): `1`
     * - Params need to be in the POST body
     * - The endpoints documented in this section are for Corporate Accounts .
     * - To become a corporate account, please refer to this document: Corporate Account Application
     * @param {number | undefined} depositId  - Deposit record Id, priority use
     * @param {string | undefined} txId  - Deposit txId, used when depositId is not specified
     * @param {number | undefined} subAccountId  - Sub-accountId of Cloud user
     * @param {number | undefined} subUserId  - Sub-userId of parent user
     * @returns { Promise < {"code":"000000","message":"success","data":true,"success":true} > }
    */
    one_click_arrival_deposit_apply_for_expired_address_deposit: async (depositId, txId, subAccountId, subUserId) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/capital/deposit/credit-apply', { depositId, txId, subAccountId, subUserId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }
  }

  /**
   * - Weight(IP): `1`
   * - This request will generate a virtual sub account under your master account.
   * - You need to enable "trade" option for the API Key which requests this endpoint.
   * @param {string} subAccountString  - Please input a string. We will create a virtual email using that string for you to register
   * @returns { Promise < {"email":"addsdd_virtual@aasaixwqnoemail.com"} > }
  */
  async create_a_virtual_sub_account_for_master_account(subAccountString) {
    // Expects (HMAC SHA256)
    if (typeof subAccountString === 'undefined') return new Error('subAccountString', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/virtualSubAccount', { subAccountString }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * @param {number | undefined} limit  - Default value: `1`, Max value: `200`
   * @param {string | undefined} email  - Sub-account email
   * @param {string | undefined} isFreeze  - true or false
   * @param {number | undefined} page  - Default value: `1`
   * @returns { Promise < {"subAccounts":[{"email":"testsub@gmail.com","isFreeze":false,"createTime":1544433328000,"isManagedSubAccount":false,"isAssetManagementSubAccount":false},{"email":"virtual@oxebmvfonoemail.com","isFreeze":false,"createTime":1544433328000,"isManagedSubAccount":false,"isAssetManagementSubAccount":false}]} > }
  */
  async query_sub_account_list_for_master_account(limit, email, isFreeze, page) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/list', { limit, email, isFreeze, page }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - `fromEmail` and `toEmail` cannot be sent at the same time.
   * - Return `fromEmail` equal master account email by default.
   * @param {number | undefined} limit  - Default value: `500`
   * @param {string | undefined} fromEmail
   * @param {string | undefined} toEmail
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @param {number | undefined} page  - Default value: `1`
   * @returns { Promise < [{"from":"aaa@test.com","to":"bbb@test.com","asset":"BTC","qty":"10","status":"SUCCESS","tranId":6489943656,"time":1544433328000},{"from":"bbb@test.com","to":"ccc@test.com","asset":"ETH","qty":"2","status":"SUCCESS","tranId":6489938713,"time":1544433328000}] > }
  */
  async query_sub_account_spot_asset_transfer_history_for_master_account(limit, fromEmail, toEmail, startTime, endTime, page) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/sub/transfer/history', { limit, fromEmail, toEmail, startTime, endTime, page }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * @param {string} email  - Sub-account email
   * @param {number} futuresType  - `1`:USDT-margined Futures,`2`: Coin-margined Futures
   * @param {number | undefined} limit  - Default value: `50`, Max value: `500`
   * @param {number | undefined} startTime  - Default return the history with in `100` days
   * @param {number | undefined} endTime  - Default return the history with in `100` days
   * @param {number | undefined} page  - Default value: `1`
   * @returns { Promise < {"success":true,"futuresType":2,"transfers":[{"from":"aaa@test.com","to":"bbb@test.com","asset":"BTC","qty":"1","tranId":11897001102,"time":1544433328000},{"from":"bbb@test.com","to":"ccc@test.com","asset":"ETH","qty":"2","tranId":11631474902,"time":1544433328000}]} > }
  */
  async query_sub_account_futures_asset_transfer_history_for_master_account(email, futuresType, limit, startTime, endTime, page) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof futuresType === 'undefined') return new Error('futuresType', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/futures/internalTransfer', { email, futuresType, limit, startTime, endTime, page }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - Master account can transfer max `2000` times a minute
   * - There must be sufficient margin balance in futures wallet to execute transferring.
   * @param {string} fromEmail  - Sender email
   * @param {string} toEmail  - Recipient email
   * @param {number} futuresType  - `1`:USDT-margined Futures,`2`: Coin-margined Futures
   * @param {string} asset
   * @param {number} amount
   * @returns { Promise < {"success":true,"txnId":"2934662589"} > }
  */
  async sub_account_futures_asset_transfer_for_master_account(fromEmail, toEmail, futuresType, asset, amount) {
    // Expects (HMAC SHA256)
    if (typeof fromEmail === 'undefined') return new Error('fromEmail', 'REQUIRED');

    if (typeof toEmail === 'undefined') return new Error('toEmail', 'REQUIRED');

    if (typeof futuresType === 'undefined') return new Error('futuresType', 'REQUIRED');

    if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/futures/internalTransfer', { fromEmail, toEmail, futuresType, asset, amount }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Fetch sub-account assets
   * - Weight(UID): `60`
   * @param {string} email  - Sub account email
   * @returns { Promise < {"balances":[{"asset":"ADA","free":10000,"locked":0},{"asset":"BNB","free":10003,"locked":0},{"asset":"BTC","free":11467.6399,"locked":0},{"asset":"ETH","free":10004.995,"locked":0},{"asset":"USDT","free":11652.14213,"locked":0}]} > }
  */
  async query_sub_account_assets_for_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v3/sub-account/assets', { email }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Get BTC valued asset summary of subaccounts.
   * - Weight(IP): `1`
   * @param {string | undefined} email  - Sub account email
   * @param {number | undefined} page  - default `1`
   * @param {number | undefined} size  - default `10`, max `20`
   * @returns { Promise < {"totalCount":2,"masterAccountTotalAsset":"0.23231201","spotSubUserAssetBtcVoList":[{"email":"sub123@test.com","totalAsset":"9999.00000000"},{"email":"test456@test.com","totalAsset":"0.00000000"}]} > }
  */
  async query_sub_account_spot_assets_summary_for_master_account(email, page, size) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/spotSummary', { email, page, size }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Fetch sub-account deposit address
   * - Weight(IP): `1`
   * @param {string} email  - Sub account email
   * @param {string} coin
   * @param {string | undefined} network
   * @returns { Promise <  > }
  */
  async get_sub_account_deposit_address_for_master_account(email, coin, network) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof coin === 'undefined') return new Error('coin', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/capital/deposit/subAddress', { email, coin, network }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Fetch sub-account deposit history
   * - Weight(IP): `1`
   * @param {string} email  - Sub account email
   * @param {number | undefined} limit
   * @param {string | undefined} coin
   * @param {number | undefined} status  - `0`(`0`:pending,`6`: credited but cannot withdraw,`7`:Wrong Deposit,`8`:Waiting User confirm,`1`:success)
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @param {number | undefined} offset  - default:`0`
   * @param {string | undefined} txId
   * @returns { Promise < [{"id":"769800519366885376","amount":"0.001","coin":"BNB","network":"BNB","status":0,"address":"bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23","addressTag":"101764890","txId":"98A3EA560C6B3336D348B6C83F0F95ECE4F1F5919E94BD006E5BF3BF264FACFC","insertTime":1661493146000,"transferType":0,"confirmTimes":"1/1","unlockConfirm":0,"walletType":0},{"id":"769754833590042625","amount":"0.50000000","coin":"IOTA","network":"IOTA","status":1,"address":"SIZ9VLMHWATXKV99LH99CIGFJFUMLEHGWVZVNNZXRJJVWBPHYWPPBOSDORZ9EQSHCZAMPVAPGFYQAUUV9DROOXJLNW","addressTag":"","txId":"ESBFVQUTPIWQNJSPXFNHNYHSQNTGKRVKPRABQWTAXCDWOAKDKYWPTVG9BGXNVNKTLEJGESAVXIKIZ9999","insertTime":1599620082000,"transferType":0,"confirmTimes":"1/1","unlockConfirm":0,"walletType":0}] > }
  */
  async get_sub_account_deposit_history_for_master_account(email, limit, coin, status, startTime, endTime, offset, txId) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/capital/deposit/subHisrec', { email, limit, coin, status, startTime, endTime, offset, txId }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `10`
   * - If no `email` sent, all sub-accounts' information will be returned.
   * @param {string | undefined} email  - Sub-account email
   * @returns { Promise < [{"email":"123@test.com","isSubUserEnabled":true,"isUserActive":true,"insertTime":1570791523523,"isMarginEnabled":true,"isFutureEnabled":true,"mobile":1570791523523}] > }
  */
  async get_sub_accounts_status_on_margin_futures_for_master_account(email) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/status', { email }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * @param {string} email  - Sub-account email
   * @returns { Promise < {"email":"123@test.com","isMarginEnabled":true} > }
  */
  async enable_margin_for_sub_account_for_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/margin/enable', { email }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `10`
   * @param {string} email  - Sub-account email
   * @returns { Promise < {"email":"123@test.com","marginLevel":"11.64405625","totalAssetOfBtc":"6.82728457","totalLiabilityOfBtc":"0.58633215","totalNetAssetOfBtc":"6.24095242","marginTradeCoeffVo":{"forceLiquidationBar":"1.10000000","marginCallBar":"1.50000000","normalBar":"2.00000000"},"marginUserAssetVoList":[{"asset":"BTC","borrowed":"0.00000000","free":"0.00499500","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00499500"},{"asset":"BNB","borrowed":"201.66666672","free":"2346.50000000","interest":"0.00000000","locked":"0.00000000","netAsset":"2144.83333328"},{"asset":"ETH","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"},{"asset":"USDT","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"}]} > }
  */
  async get_detail_on_sub_accounts_margin_account_for_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/margin/account', { email }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `10`
   * @returns { Promise < {"totalAssetOfBtc":"4.33333333","totalLiabilityOfBtc":"2.11111112","totalNetAssetOfBtc":"2.22222221","subAccountList":[{"email":"123@test.com","totalAssetOfBtc":"2.11111111","totalLiabilityOfBtc":"1.11111111","totalNetAssetOfBtc":"1.00000000"},{"email":"345@test.com","totalAssetOfBtc":"2.22222222","totalLiabilityOfBtc":"1.00000001","totalNetAssetOfBtc":"1.22222221"}]} > }
  */
  async get_summary_of_sub_accounts_margin_account_for_master_account() {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/margin/accountSummary', {}, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * @param {string} email  - Sub-account email
   * @returns { Promise < {"email":"123@test.com","isFuturesEnabled":true} > }
  */
  async enable_futures_for_sub_account_for_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/futures/enable', { email }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `10`
   * @param {string} email  - Sub-account email
   * @returns { Promise < {"email":"abc@test.com","asset":"USDT","assets":[{"asset":"USDT","initialMargin":"0.00000000","maintenanceMargin":"0.00000000","marginBalance":"0.88308000","maxWithdrawAmount":"0.88308000","openOrderInitialMargin":"0.00000000","positionInitialMargin":"0.00000000","unrealizedProfit":"0.00000000","walletBalance":"0.88308000"}],"canDeposit":true,"canTrade":true,"canWithdraw":true,"feeTier":2,"maxWithdrawAmount":"0.88308000","totalInitialMargin":"0.00000000","totalMaintenanceMargin":"0.00000000","totalMarginBalance":"0.88308000","totalOpenOrderInitialMargin":"0.00000000","totalPositionInitialMargin":"0.00000000","totalUnrealizedProfit":"0.00000000","totalWalletBalance":"0.88308000","updateTime":1576756674610} > }
  */
  async get_detail_on_sub_accounts_futures_account_for_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/futures/account', { email }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * @returns { Promise < {"totalInitialMargin":"9.83137400","totalMaintenanceMargin":"0.41568700","totalMarginBalance":"23.03235621","totalOpenOrderInitialMargin":"9.00000000","totalPositionInitialMargin":"0.83137400","totalUnrealizedProfit":"0.03219710","totalWalletBalance":"22.15879444","asset":"USD","subAccountList":[{"email":"123@test.com","totalInitialMargin":"9.00000000","totalMaintenanceMargin":"0.00000000","totalMarginBalance":"22.12659734","totalOpenOrderInitialMargin":"9.00000000","totalPositionInitialMargin":"0.00000000","totalUnrealizedProfit":"0.00000000","totalWalletBalance":"22.12659734","asset":"USD"},{"email":"345@test.com","totalInitialMargin":"0.83137400","totalMaintenanceMargin":"0.41568700","totalMarginBalance":"0.90575887","totalOpenOrderInitialMargin":"0.00000000","totalPositionInitialMargin":"0.83137400","totalUnrealizedProfit":"0.03219710","totalWalletBalance":"0.87356177","asset":"USD"}]} > }
  */
  async get_summary_of_sub_accounts_futures_account_for_master_account() {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/futures/accountSummary', {}, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `10`
   * @param {string} email  - Sub-account email
   * @returns { Promise < [{"entryPrice":"9975.12000","leverage":"50","maxNotional":"1000000","liquidationPrice":"7963.54","markPrice":"9973.50770517","positionAmount":"0.010","symbol":"BTCUSDT","unrealizedProfit":"-0.01612295"}] > }
  */
  async get_futures_position_risk_of_sub_account_for_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/futures/positionRisk', { email }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - You need to open Enable Spot & Margin Trading permission for the API Key which requests this endpoint.
   * @param {string} email  - Sub-account email
   * @param {string} asset  - The asset being transferred, e.g., USDT
   * @param {number} amount  - The amount to be transferred
   * @param {number} type  - `1`: transfer from subaccount's spot account to its USDT-margined futures account `2`: transfer from subaccount's USDT-margined futures account to its spot account `3`: transfer from subaccount's spot account to its COIN-margined futures account `4`:transfer from subaccount's COIN-margined futures account to its spot account
   * @returns { Promise < {"txnId":"2966662589"} > }
  */
  async futures_transfer_for_sub_account_for_master_account(email, asset, amount, type) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/futures/transfer', { email, asset, amount, type }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - You need to open Enable Spot & Margin Trading permission for the API Key which requests this endpoint.
   * @param {string} email  - Sub-account email
   * @param {string} asset  - The asset being transferred, e.g., BTC
   * @param {number} amount  - The amount to be transferred
   * @param {number} type  - `1`: transfer from subaccount's spot account to margin account `2`: transfer from subaccount's margin account to its spot account
   * @returns { Promise < {"txnId":"2966662589"} > }
  */
  async margin_transfer_for_sub_account_for_master_account(email, asset, amount, type) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/margin/transfer', { email, asset, amount, type }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - You need to open Enable Spot & Margin Trading permission for the API Key which requests this endpoint.
   * @param {string} toEmail  - Sub-account email
   * @param {string} asset
   * @param {number} amount
   * @returns { Promise < {"txnId":"2966662589"} > }
  */
  async transfer_to_sub_account_of_same_master_for_sub_account(toEmail, asset, amount) {
    // Expects (HMAC SHA256)
    if (typeof toEmail === 'undefined') return new Error('toEmail', 'REQUIRED');

    if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/transfer/subToSub', { toEmail, asset, amount }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - You need to open Enable Spot & Margin Trading permission for the API Key which requests this endpoint.
   * @param {string} asset
   * @param {number} amount
   * @returns { Promise < {"txnId":"2966662589"} > }
  */
  async transfer_to_master_for_sub_account(asset, amount) {
    // Expects (HMAC SHA256)
    if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/transfer/subToMaster', { asset, amount }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - If `type` is not sent, the records of `type` `2`: transfer out will be returned by default.
   * - If `startTime` and `endTime` are not sent, the recent `30`-day data will be returned.
   * @param {number | undefined} limit  - Default `500`
   * @param {string | undefined} asset  - If not sent, result of all assets will be returned
   * @param {number | undefined} type  - `1`: transfer in, `2`: transfer out
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @returns { Promise < [{"counterParty":"master","email":"master@test.com","type":1,"asset":"BTC","qty":"1","fromAccountType":"SPOT","toAccountType":"SPOT","status":"SUCCESS","tranId":11798835829,"time":1544433325000},{"counterParty":"subAccount","email":"sub2@test.com","type":1,"asset":"ETH","qty":"2","fromAccountType":"SPOT","toAccountType":"SPOT","status":"SUCCESS","tranId":11798829519,"time":1544433326000}] > }
  */
  async sub_account_transfer_history_for_sub_account(limit, asset, type, startTime, endTime) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/transfer/subUserHistory', { limit, asset, type, startTime, endTime }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - You need to enable "internal transfer" option for the api key which requests this endpoint.
   * - Transfer from master account by default if `fromEmail` is not sent.
   * - Transfer to master account by default if `toEmail` is not sent.
   * - At least either `fromEmail` or `toEmail` need to be sent when the `fromAccountType` and the `toAccountType` are the same.
   * - Supported transfer scenarios: `SPOT` transfer to `SPOT` , `USDT_FUTURE` , `COIN_FUTURE` (regardless of master or sub) `SPOT` , `USDT_FUTURE` , `COIN_FUTURE` transfer to `SPOT` (regardless of master or sub) Master account `SPOT` transfer to sub-account `MARGIN(Cross)` , `ISOLATED_MARGIN` Sub-account `MARGIN(Cross)` , `ISOLATED_MARGIN` transfer to master account `SPOT`
   * - `SPOT` transfer to `SPOT` , `USDT_FUTURE` , `COIN_FUTURE` (regardless of master or sub)
   * - `SPOT` , `USDT_FUTURE` , `COIN_FUTURE` transfer to `SPOT` (regardless of master or sub)
   * - Master account `SPOT` transfer to sub-account `MARGIN(Cross)` , `ISOLATED_MARGIN`
   * - Sub-account `MARGIN(Cross)` , `ISOLATED_MARGIN` transfer to master account `SPOT`
   * @param {string} fromAccountType  - "SPOT","USDT_FUTURE","COIN_FUTURE","MARGIN"(Cross),"ISOLATED_MARGIN"
   * @param {string} toAccountType  - "SPOT","USDT_FUTURE","COIN_FUTURE","MARGIN"(Cross),"ISOLATED_MARGIN"
   * @param {string} asset
   * @param {number} amount
   * @param {string | undefined} fromEmail
   * @param {string | undefined} toEmail
   * @param {string | undefined} clientTranId  - Must be unique
   * @param {string | undefined} symbol  - Only supported under ISOLATED_MARGIN type
   * @returns { Promise < {"tranId":11945860693,"clientTranId":"test"} > }
  */
  async universal_transfer_for_master_account(fromAccountType, toAccountType, asset, amount, fromEmail, toEmail, clientTranId, symbol) {
    // Expects (HMAC SHA256)
    if (typeof fromAccountType === 'undefined') return new Error('fromAccountType', 'REQUIRED');

    if (typeof toAccountType === 'undefined') return new Error('toAccountType', 'REQUIRED');

    if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/universalTransfer', { fromAccountType, toAccountType, asset, amount, fromEmail, toEmail, clientTranId, symbol }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - `fromEmail` and `toEmail` cannot be sent at the same time.
   * - Return `fromEmail` equal master account email by default.
   * - The query time period must be less then `30` days.
   * - If `startTime` and `endTime` not sent, return records of the last `30` days by default.
   * @param {number | undefined} limit  - Default `500`, Max `500`
   * @param {string | undefined} fromEmail
   * @param {string | undefined} toEmail
   * @param {string | undefined} clientTranId
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @param {number | undefined} page  - Default `1`
   * @returns { Promise < {"result":[{"tranId":92275823339,"fromEmail":"abctest@gmail.com","toEmail":"deftest@gmail.com","asset":"BNB","amount":"0.01","createTimeStamp":1640317374000,"fromAccountType":"USDT_FUTURE","toAccountType":"SPOT","status":"SUCCESS","clientTranId":"test"}],"totalCount":1} > }
  */
  async query_universal_transfer_history_for_master_account(limit, fromEmail, toEmail, clientTranId, startTime, endTime, page) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/universalTransfer', { limit, fromEmail, toEmail, clientTranId, startTime, endTime, page }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - USDT Margined Futures:
   * - COIN Margined Futures:
   * - Weight(IP): `1`
   * @param {string} email  - Sub-account email
   * @param {number} futuresType  - `1`:USDT Margined Futures, `2`:COIN Margined Futures
   * @returns { Promise < {"futureAccountResp":{"email":"abc@test.com","assets":[{"asset":"USDT","initialMargin":"0.00000000","maintenanceMargin":"0.00000000","marginBalance":"0.88308000","maxWithdrawAmount":"0.88308000","openOrderInitialMargin":"0.00000000","positionInitialMargin":"0.00000000","unrealizedProfit":"0.00000000","walletBalance":"0.88308000"}],"canDeposit":true,"canTrade":true,"canWithdraw":true,"feeTier":2,"maxWithdrawAmount":"0.88308000","totalInitialMargin":"0.00000000","totalMaintenanceMargin":"0.00000000","totalMarginBalance":"0.88308000","totalOpenOrderInitialMargin":"0.00000000","totalPositionInitialMargin":"0.00000000","totalUnrealizedProfit":"0.00000000","totalWalletBalance":"0.88308000","updateTime":1576756674610}} > }
   * @returns { Promise < {"deliveryAccountResp":{"email":"abc@test.com","assets":[{"asset":"BTC","initialMargin":"0.00000000","maintenanceMargin":"0.00000000","marginBalance":"0.88308000","maxWithdrawAmount":"0.88308000","openOrderInitialMargin":"0.00000000","positionInitialMargin":"0.00000000","unrealizedProfit":"0.00000000","walletBalance":"0.88308000"}],"canDeposit":true,"canTrade":true,"canWithdraw":true,"feeTier":2,"updateTime":1598959682001}} > }
  */
  async get_detail_on_sub_accounts_futures_account_v2_for_master_account(email, futuresType) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof futuresType === 'undefined') return new Error('futuresType', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v2/sub-account/futures/account', { email, futuresType }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - USDT Margined Futures:
   * - COIN Margined Futures:
   * - Weight(IP): `10`
   * @param {number} futuresType  - `1`:USDT Margined Futures, `2`:COIN Margined Futures
   * @param {number | undefined} limit  - default:`10`, max:`20`
   * @param {number | undefined} page  - default:`1`
   * @returns { Promise < {"futureAccountSummaryResp":{"totalInitialMargin":"9.83137400","totalMaintenanceMargin":"0.41568700","totalMarginBalance":"23.03235621","totalOpenOrderInitialMargin":"9.00000000","totalPositionInitialMargin":"0.83137400","totalUnrealizedProfit":"0.03219710","totalWalletBalance":"22.15879444","asset":"USD","subAccountList":[{"email":"123@test.com","totalInitialMargin":"9.00000000","totalMaintenanceMargin":"0.00000000","totalMarginBalance":"22.12659734","totalOpenOrderInitialMargin":"9.00000000","totalPositionInitialMargin":"0.00000000","totalUnrealizedProfit":"0.00000000","totalWalletBalance":"22.12659734","asset":"USD"},{"email":"345@test.com","totalInitialMargin":"0.83137400","totalMaintenanceMargin":"0.41568700","totalMarginBalance":"0.90575887","totalOpenOrderInitialMargin":"0.00000000","totalPositionInitialMargin":"0.83137400","totalUnrealizedProfit":"0.03219710","totalWalletBalance":"0.87356177","asset":"USD"}]}} > }
   * @returns { Promise < {"deliveryAccountSummaryResp":{"totalMarginBalanceOfBTC":"25.03221121","totalUnrealizedProfitOfBTC":"0.12233410","totalWalletBalanceOfBTC":"22.15879444","asset":"BTC","subAccountList":[{"email":"123@test.com","totalMarginBalance":"22.12659734","totalUnrealizedProfit":"0.00000000","totalWalletBalance":"22.12659734","asset":"BTC"},{"email":"345@test.com","totalMarginBalance":"0.90575887","totalUnrealizedProfit":"0.03219710","totalWalletBalance":"0.87356177","asset":"BTC"}]}} > }
  */
  async get_summary_of_sub_accounts_futures_account_v2_for_master_account(futuresType, limit, page) {
    // Expects (HMAC SHA256)
    if (typeof futuresType === 'undefined') return new Error('futuresType', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v2/sub-account/futures/accountSummary', { futuresType, limit, page }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - USDT Margined Futures:
   * - COIN Margined Futures:
   * - Weight(IP): `1`
   * @param {string} email  - Sub-account email
   * @param {number} futuresType  - `1`:USDT Margined Futures, `2`:COIN Margined Futures
   * @returns { Promise < {"futurePositionRiskVos":[{"entryPrice":"9975.12000","leverage":"50","maxNotional":"1000000","liquidationPrice":"7963.54","markPrice":"9973.50770517","positionAmount":"0.010","symbol":"BTCUSDT","unrealizedProfit":"-0.01612295"}]} > }
   * @returns { Promise < {"deliveryPositionRiskVos":[{"entryPrice":"9975.12000","markPrice":"9973.50770517","leverage":"20","isolated":"false","isolatedWallet":"9973.50770517","isolatedMargin":"0.00000000","isAutoAddMargin":"false","positionSide":"BOTH","positionAmount":"1.230","symbol":"BTCUSD_201225","unrealizedProfit":"-0.01612295"}]} > }
  */
  async get_futures_position_risk_of_sub_account_v2_for_master_account(email, futuresType) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof futuresType === 'undefined') return new Error('futuresType', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v2/sub-account/futures/positionRisk', { email, futuresType }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * @param {string} email  - Sub-account email
   * @param {BOOLEAN} enableBlvt  - Only true for now
   * @returns { Promise < {"email":"123@test.com","enableBlvt":true} > }
  */
  async enable_leverage_token_for_sub_account_for_master_account(email, enableBlvt) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof enableBlvt === 'undefined') return new Error('enableBlvt', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/sub-account/blvt/enable', { email, enableBlvt }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(UID): `3000`
   * @param {string} email  - Sub-account email
   * @param {string} subAccountApiKey
   * @returns { Promise < {"ipRestrict":"true","ipList":["69.210.67.14","8.34.21.10"],"updateTime":1636371437000,"apiKey":"k5V49ldtn4tszj6W3hystegdfvmGbqDzjmkCtpTvC0G74WhK7yd4rfCTo4lShf"} > }
  */
  async get_ip_restriction_for_a_sub_account_api_key_for_master_account(email, subAccountApiKey) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof subAccountApiKey === 'undefined') return new Error('subAccountApiKey', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/subAccountApi/ipRestriction', { email, subAccountApiKey }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(UID): `3000`
   * - You need to enable Enable Spot & Margin Trading option for the api key which requests this endpoint
   * @param {string} email  - Sub-account email
   * @param {string} subAccountApiKey
   * @param {string | undefined} ipAddress  - Can be added in batches, separated by commas
   * @returns { Promise < {"ipRestrict":"true","ipList":["69.210.67.14","8.34.21.10"],"updateTime":1636371437000,"apiKey":"k5V49ldtn4tszj6W3hystegdfvmGbqDzjmkCtpTvC0G74WhK7yd4rfCTo4lShf"} > }
  */
  async delete_ip_list_for_a_sub_account_api_key_for_master_account(email, subAccountApiKey, ipAddress) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof subAccountApiKey === 'undefined') return new Error('subAccountApiKey', 'REQUIRED');

    const resp = await this.request('DELETE', 'sapi', '/sapi/v1/sub-account/subAccountApi/ipRestriction/ipList', { email, subAccountApiKey, ipAddress }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(UID): `3000`
   * - You need to enable Enable Spot & Margin Trading option for the api key which requests this endpoint
   * -
   * @param {string} email  - Sub-account email
   * @param {string} subAccountApiKey
   * @param {string} status  - IP Restriction status. `1` = IP Unrestricted. `2` = Restrict access to trusted IPs only.
   * @param {string | undefined} ipAddress  - Insert static IP in batch, separated by commas.
   * @returns { Promise <  > }
  */
  async add_ip_restriction_for_sub_account_api_key_for_master_account(email, subAccountApiKey, status, ipAddress) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof subAccountApiKey === 'undefined') return new Error('subAccountApiKey', 'REQUIRED');

    if (typeof status === 'undefined') return new Error('status', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v2/sub-account/subAccountApi/ipRestriction', { email, subAccountApiKey, status, ipAddress }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - You need to enable `Enable Spot & Margin Trading` option for the api key which requests this endpoint
   * @param {string} toEmail
   * @param {string} asset
   * @param {number} amount
   * @returns { Promise < {"tranId":66157362489} > }
  */
  async deposit_assets_into_the_managed_sub_account_for_investor_master_account(toEmail, asset, amount) {
    // Expects (HMAC SHA256)
    if (typeof toEmail === 'undefined') return new Error('toEmail', 'REQUIRED');

    if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/managed-subaccount/deposit', { toEmail, asset, amount }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * @param {string} email
   * @returns { Promise < [{"coin":"INJ","name":"Injective Protocol","totalBalance":"0","availableBalance":"0","inOrder":"0","btcValue":"0"},{"coin":"FILDOWN","name":"FILDOWN","totalBalance":"0","availableBalance":"0","inOrder":"0","btcValue":"0"}] > }
  */
  async query_managed_sub_account_asset_details_for_investor_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/managed-subaccount/asset', { email }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `1`
   * - You need to enable `Enable Spot & Margin Trading` option for the api key which requests this endpoint
   * @param {string} fromEmail
   * @param {string} asset
   * @param {number} amount
   * @param {number | undefined} transferDate  - Withdrawals is automatically occur on the transfer date(UTC`0`). If a date is not selected, the withdrawal occurs right now
   * @returns { Promise < {"tranId":66157362489} > }
  */
  async withdrawl_assets_from_the_managed_sub_account_for_investor_master_account(fromEmail, asset, amount, transferDate) {
    // Expects (HMAC SHA256)
    if (typeof fromEmail === 'undefined') return new Error('fromEmail', 'REQUIRED');

    if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/managed-subaccount/withdraw', { fromEmail, asset, amount, transferDate }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * - Weight(IP): `2400`
   * - The query time period must be less then `30` days
   * - Support query within the last one month only
   * - If `startTime` and `endTime` not sent, return records of the last `7` days by default
   * @param {string} email
   * @param {string} type  - "SPOT", "MARGIN"（cross）, "FUTURES"（UM）
   * @param {number | undefined} limit  - min `7`, max `30`, default `7`
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @returns { Promise < {"code":200,"msg":"","snapshotVos":[{"data":{"balances":[{"asset":"BTC","free":"0.09905021","locked":"0.00000000"},{"asset":"USDT","free":"1.89109409","locked":"0.00000000"}],"totalAssetOfBtc":"0.09942700"},"type":"spot","updateTime":1576281599000}]} > }
   * @returns { Promise < {"code":200,"msg":"","snapshotVos":[{"data":{"marginLevel":"2748.02909813","totalAssetOfBtc":"0.00274803","totalLiabilityOfBtc":"0.00000100","totalNetAssetOfBtc":"0.00274750","userAssets":[{"asset":"XRP","borrowed":"0.00000000","free":"1.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"1.00000000"}]},"type":"margin","updateTime":1576281599000}]} > }
   * @returns { Promise < {"code":200,"msg":"","snapshotVos":[{"data":{"assets":[{"asset":"USDT","marginBalance":"118.99782335","walletBalance":"120.23811389"}],"position":[{"entryPrice":"7130.41000000","markPrice":"7257.66239673","positionAmt":"0.01000000","symbol":"BTCUSDT","unRealizedProfit":"1.24029054"}]},"type":"futures","updateTime":1576281599000}]} > }
  */
  async query_managed_sub_account_snapshot_for_investor_master_account(email, type, limit, startTime, endTime) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/managed-subaccount/accountSnapshot', { email, type, limit, startTime, endTime }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Investor can use this api to query managed sub account transfer log. This endpoint is available for investor of Managed Sub-Account. A Managed Sub-Account is an account type for investors who value flexibility in asset allocation and account application, while delegating trades to a professional trading team. Please refer to link
   * - Weight(IP): `1`
   * @param {string} email  - Managed Sub Account Email
   * @param {number} startTime  - Start Time
   * @param {number} endTime  - End Time (The start time and end time interval cannot exceed half a year)
   * @param {number} page  - Page
   * @param {number} limit  - Limit (Max: `500`)
   * @param {string | undefined} transfers  - Transfer Direction (FROM/TO)
   * @param {string | undefined} transferFunctionAccountType  - Transfer function account type (SPOT/MARGIN/ISOLATED_MARGIN/USDT_FUTURE/COIN_FUTURE)
   * @returns { Promise <  > }
  */
  async query_managed_sub_account_transfer_log_for_investor_master_account(email, startTime, endTime, page, limit, transfers, transferFunctionAccountType) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof startTime === 'undefined') return new Error('startTime', 'REQUIRED');

    if (typeof endTime === 'undefined') return new Error('endTime', 'REQUIRED');

    if (typeof page === 'undefined') return new Error('page', 'REQUIRED');

    if (typeof limit === 'undefined') return new Error('limit', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/managed-subaccount/queryTransLogForInvestor', { email, startTime, endTime, page, limit, transfers, transferFunctionAccountType }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Trading team can use this api to query managed sub account transfer log. This endpoint is available for trading team of Managed Sub-Account. A Managed Sub-Account is an account type for investors who value flexibility in asset allocation and account application, while delegating trades to a professional trading team. Please refer to link
   * - Weight(UID): `60`
   * @param {string} email  - Managed Sub Account Email
   * @param {number} startTime  - Start Time
   * @param {number} endTime  - End Time (The start time and end time interval cannot exceed half a year)
   * @param {number} page  - Page
   * @param {number} limit  - Limit (Max: `500`)
   * @param {string | undefined} transfers  - Transfer Direction (FROM/TO)
   * @param {string | undefined} transferFunctionAccountType  - Transfer function account type (SPOT/MARGIN/ISOLATED_MARGIN/USDT_FUTURE/COIN_FUTURE)
   * @returns { Promise <  > }
  */
  async query_managed_sub_account_transfer_log_for_trading_team_master_account(email, startTime, endTime, page, limit, transfers, transferFunctionAccountType) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof startTime === 'undefined') return new Error('startTime', 'REQUIRED');

    if (typeof endTime === 'undefined') return new Error('endTime', 'REQUIRED');

    if (typeof page === 'undefined') return new Error('page', 'REQUIRED');

    if (typeof limit === 'undefined') return new Error('limit', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/managed-subaccount/queryTransLogForTradeParent', { email, startTime, endTime, page, limit, transfers, transferFunctionAccountType }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Investor can use this api to query managed sub account futures asset details
   * - Weight(UID): `60`
   * @param {string} email  - Managed Sub Account Email
   * @returns { Promise < {"code":"200","message":"OK","snapshotVos":[{"type":"FUTURES","updateTime":1672893855394,"data":{"assets":[{"asset":"USDT","marginBalance":100,"walletBalance":120}],"position":[{"symbol":"BTCUSDT","entryPrice":17000,"markPrice":17000,"positionAmt":0.0001}]}}]} > }
  */
  async query_managed_sub_account_futures_asset_details_for_investor_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/managed-subaccount/fetch-future-asset', { email }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Investor can use this api to query managed sub account margin asset details
   * - Weight(IP): `1`
   * @param {string} email  - Managed Sub Account Email
   * @returns { Promise <  > }
  */
  async query_managed_sub_account_margin_asset_details_for_investor_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/managed-subaccount/marginAsset', { email }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Fetch sub-account assets
   * - Weight(UID): `60`
   * @param {string} email  - Managed Sub Account Email
   * @returns { Promise < {"balances":[{"asset":"ADA","free":"10000","locked":"0"},{"asset":"BNB","free":"10003","locked":"0"},{"asset":"BTC","free":"11467.6399","locked":"0"}]} > }
  */
  async query_sub_account_assets_for_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v4/sub-account/assets', { email }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Get investor's managed sub-account list.
   * - Weight(UID): `60`
   * @param {number | undefined} limit  - Default value: `20`, Max value: `20`
   * @param {string | undefined} email  - Managed sub-account email
   * @param {number | undefined} page  - Default value: `1`
   * @returns { Promise <  > }
  */
  async query_managed_sub_account_list_for_investor(limit, email, page) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/managed-subaccount/info', { limit, email, page }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Query Sub-account Transaction Tatistics (For Master Account).
   * - Weight(UID): `60`
   * @param {string} email  - Sub user email
   * @returns { Promise < {"recent30BtcTotal":"0","recent30BtcFuturesTotal":"0","recent30BtcMarginTotal":"0","recent30BusdTotal":"0","recent30BusdFuturesTotal":"0","recent30BusdMarginTotal":"0","tradeInfoVos":[]} > }
   * @returns { Promise < {"recent30BtcTotal":"0","recent30BtcFuturesTotal":"0","recent30BtcMarginTotal":"0","recent30BusdTotal":"0","recent30BusdFuturesTotal":"0","recent30BusdMarginTotal":"0","tradeInfoVos":[{"userId":1000138138384,"btc":0,"btcFutures":0,"btcMargin":0,"busd":0,"busdFutures":0,"busdMargin":0,"date":1676851200000},{"userId":1000138138384,"btc":0,"btcFutures":0,"btcMargin":0,"busd":0,"busdFutures":0,"busdMargin":0,"date":1677110400000},{"userId":1000138138384,"btc":0,"btcFutures":0,"btcMargin":0,"busd":0,"busdFutures":0,"busdMargin":0,"date":1677369600000}]} > }
  */
  async query_sub_account_transaction_statistics_for_master_account(email) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/sub-account/transaction-statistics', { email }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Get investor's managed sub-account deposit address.
   * - Weight(UID): `1`
   * - If network is not send, return with default network of the coin .
   * @param {string} email  - Sub user email
   * @param {string} coin
   * @param {string | undefined} network  - networks can be found in GET /sapi/v`1`/capital/deposit/address
   * @returns { Promise <  > }
  */
  async get_managed_sub_account_deposit_address_for_investor_master_account(email, coin, network) {
    // Expects (HMAC SHA256)
    if (typeof email === 'undefined') return new Error('email', 'REQUIRED');

    if (typeof coin === 'undefined') return new Error('coin', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/managed-subaccount/deposit/address', { email, coin, network }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }





  /**
   * Contains all `Margin` API requests.
   */
  Margin = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Execute transfer between spot account and cross margin account.
     * - Weight(IP): `600`
     * @param {string} asset  - The asset being transferred, e.g., BTC
     * @param {number} amount  - The amount to be transferred
     * @param {number} type  - `1`: transfer from main account to cross margin account `2`: transfer from cross margin account to main account
     * @returns { Promise < {"tranId":100000001} > }
    */
    cross_margin_account_transfer_margin: async (asset, amount, type) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/margin/transfer', { asset, amount, type }, 'MARGIN');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Apply for a loan.
     * - Weight(UID): `3000`
     * - If "`isIsolated`" = "TRUE", "`symbol`" must be sent
     * - "`isIsolated`" = "FALSE" for crossed margin loan
     * @param {string} asset
     * @param {number} amount
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {string | undefined} symbol  - isolated symbol
     * @returns { Promise < {"tranId":100000001} > }
    */
    margin_account_borrow_margin: async (asset, amount, isIsolated, symbol) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/margin/loan', { asset, amount, isIsolated, symbol }, 'MARGIN');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Repay loan for margin account.
     * - Weight(UID): `3000`
     * - If "`isIsolated`" = "TRUE", "`symbol`" must be sent
     * - "`isIsolated`" = "FALSE" for crossed margin repay
     * @param {string} asset
     * @param {number} amount
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {string | undefined} symbol  - isolated symbol
     * @returns { Promise < {"tranId":100000001} > }
    */
    margin_account_repay_margin: async (asset, amount, isIsolated, symbol) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/margin/repay', { asset, amount, isIsolated, symbol }, 'MARGIN');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `10`
     * @param {string} asset
     * @returns { Promise < {"assetFullName":"Binance Coin","assetName":"BNB","isBorrowable":false,"isMortgageable":true,"userMinBorrow":"0.00000000","userMinRepay":"0.00000000"} > }
    */
    query_margin_asset_market_data: async (asset) => {

      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/asset', { asset }, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `10`
     * @param {string} symbol
     * @returns { Promise < {"id":323355778339572400,"symbol":"BTCUSDT","base":"BTC","quote":"USDT","isMarginTrade":true,"isBuyAllowed":true,"isSellAllowed":true} > }
    */
    query_cross_margin_pair_market_data: async (symbol) => {

      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/pair', { symbol }, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `1`
     * - None
     * @returns { Promise < [{"assetFullName":"USD coin","assetName":"USDC","isBorrowable":true,"isMortgageable":true,"userMinBorrow":"0.00000000","userMinRepay":"0.00000000"},{"assetFullName":"BNB-coin","assetName":"BNB","isBorrowable":true,"isMortgageable":true,"userMinBorrow":"1.00000000","userMinRepay":"0.00000000"},{"assetFullName":"Tether","assetName":"USDT","isBorrowable":true,"isMortgageable":true,"userMinBorrow":"1.00000000","userMinRepay":"0.00000000"},{"assetFullName":"etherum","assetName":"ETH","isBorrowable":true,"isMortgageable":true,"userMinBorrow":"0.00000000","userMinRepay":"0.00000000"},{"assetFullName":"Bitcoin","assetName":"BTC","isBorrowable":true,"isMortgageable":true,"userMinBorrow":"0.00000000","userMinRepay":"0.00000000"}] > }
    */
    get_all_margin_assets_market_data: async () => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/allAssets', {}, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `1`
     * - None
     * @returns { Promise < [{"base":"BNB","id":351637150141315840,"isBuyAllowed":true,"isMarginTrade":true,"isSellAllowed":true,"quote":"BTC","symbol":"BNBBTC"},{"base":"TRX","id":351637923235429100,"isBuyAllowed":true,"isMarginTrade":true,"isSellAllowed":true,"quote":"BTC","symbol":"TRXBTC"},{"base":"XRP","id":351638112213990140,"isBuyAllowed":true,"isMarginTrade":true,"isSellAllowed":true,"quote":"BTC","symbol":"XRPBTC"},{"base":"ETH","id":351638524530850560,"isBuyAllowed":true,"isMarginTrade":true,"isSellAllowed":true,"quote":"BTC","symbol":"ETHBTC"},{"base":"BNB","id":376870400832855100,"isBuyAllowed":true,"isMarginTrade":true,"isSellAllowed":true,"quote":"USDT","symbol":"BNBUSDT"}] > }
    */
    get_all_cross_margin_pairs_market_data: async () => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/allPairs', {}, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `10`
     * @param {string} symbol
     * @returns { Promise < {"calcTime":1562046418000,"price":"0.00333930","symbol":"BNBBTC"} > }
    */
    query_margin_priceindex_market_data: async (symbol) => {

      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/priceIndex', { symbol }, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Post a new order for margin account.
     * - Weight(UID): `6`
     * @param {string} symbol
     * @param {ENUM} side  - BUY SELL
     * @param {ENUM} type
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {number | undefined} quantity
     * @param {number | undefined} quoteOrderQty
     * @param {number | undefined} price
     * @param {number | undefined} stopPrice  - Used with STOP_LOSS , STOP_LOSS_LIMIT , TAKE_PROFIT , and TAKE_PROFIT_LIMIT orders.
     * @param {string | undefined} newClientOrderId  - A unique id among open orders. Automatically generated if not sent.
     * @param {number | undefined} icebergQty  - Used with LIMIT , STOP_LOSS_LIMIT , and TAKE_PROFIT_LIMIT to create an iceberg order.
     * @param {ENUM | undefined} newOrderRespType  - Set the response JSON. ACK, RESULT, or FULL; MARKET and LIMIT order types default to FULL, all other orders default to ACK.
     * @param {ENUM | undefined} sideEffectType  - NO_SIDE_EFFECT, MARGIN_BUY, AUTO_REPAY; default NO_SIDE_EFFECT.
     * @param {ENUM | undefined} timeInForce  - GTC,IOC,FOK
     * @returns { Promise < {"symbol":"BTCUSDT","orderId":28,"clientOrderId":"6gCrw2kRUAF9CvJDGP16IP","isIsolated":true,"transactTime":1507725176595} > }
     * @returns { Promise < {"symbol":"BTCUSDT","orderId":28,"clientOrderId":"6gCrw2kRUAF9CvJDGP16IP","transactTime":1507725176595,"price":"1.00000000","origQty":"10.00000000","executedQty":"10.00000000","cummulativeQuoteQty":"10.00000000","status":"FILLED","timeInForce":"GTC","type":"MARKET","isIsolated":true,"side":"SELL"} > }
     * @returns { Promise < {"symbol":"BTCUSDT","orderId":28,"clientOrderId":"6gCrw2kRUAF9CvJDGP16IP","transactTime":1507725176595,"price":"1.00000000","origQty":"10.00000000","executedQty":"10.00000000","cummulativeQuoteQty":"10.00000000","status":"FILLED","timeInForce":"GTC","type":"MARKET","side":"SELL","marginBuyBorrowAmount":5,"marginBuyBorrowAsset":"BTC","isIsolated":true,"fills":[{"price":"4000.00000000","qty":"1.00000000","commission":"4.00000000","commissionAsset":"USDT"},{"price":"3999.00000000","qty":"5.00000000","commission":"19.99500000","commissionAsset":"USDT"},{"price":"3998.00000000","qty":"2.00000000","commission":"7.99600000","commissionAsset":"USDT"},{"price":"3997.00000000","qty":"1.00000000","commission":"3.99700000","commissionAsset":"USDT"},{"price":"3995.00000000","qty":"1.00000000","commission":"3.99500000","commissionAsset":"USDT"}]} > }
    */
    margin_account_new_order_trade: async (symbol, side, type, isIsolated, quantity, quoteOrderQty, price, stopPrice, newClientOrderId, icebergQty, newOrderRespType, sideEffectType, timeInForce) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/margin/order', { symbol, side, type, isIsolated, quantity, quoteOrderQty, price, stopPrice, newClientOrderId, icebergQty, newOrderRespType, sideEffectType, timeInForce }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Cancel an active order for margin account.
     * - Weight(IP): `10`
     * - Either `orderId` or `origClientOrderId` must be sent.
     * @param {string} symbol
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {number | undefined} orderId
     * @param {string | undefined} origClientOrderId
     * @param {string | undefined} newClientOrderId  - Used to uniquely identify this cancel. Automatically generated by default.
     * @returns { Promise < {"symbol":"LTCBTC","isIsolated":true,"orderId":"28","origClientOrderId":"myOrder1","clientOrderId":"cancelMyOrder1","price":"1.00000000","origQty":"10.00000000","executedQty":"8.00000000","cummulativeQuoteQty":"8.00000000","status":"CANCELED","timeInForce":"GTC","type":"LIMIT","side":"SELL"} > }
    */
    margin_account_cancel_order_trade: async (symbol, isIsolated, orderId, origClientOrderId, newClientOrderId) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('DELETE', 'sapi', '/sapi/v1/margin/order', { symbol, isIsolated, orderId, origClientOrderId, newClientOrderId }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Cancels all active orders on a `symbol` for margin account. This includes OCO orders.
     * - Weight(IP): `1`
     * @param {string} symbol
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @returns { Promise <  > }
    */
    margin_account_cancel_all_open_orders_on_a_symbol_trade: async (symbol, isIsolated) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('DELETE', 'sapi', '/sapi/v1/margin/openOrders', { symbol, isIsolated }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Response in descending order
     * - The max interval between startTime and endTime is `30` days.
     * - Returns data for last `7` days by default
     * - Set archived to `true` to query data from `6` months ago
     * @param {string | undefined} asset
     * @param {string | undefined} type  - Transfer Type: ROLL_IN, ROLL_OUT
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10` Max:`100`
     * @param {string | undefined} archived  - Default: false . Set to true for archived data from `6` months ago
     * @returns { Promise < {"rows":[{"amount":"0.10000000","asset":"BNB","status":"CONFIRMED","timestamp":1566898617,"txId":5240372201,"type":"ROLL_IN"},{"amount":"5.00000000","asset":"USDT","status":"CONFIRMED","timestamp":1566888436,"txId":5239810406,"type":"ROLL_OUT"},{"amount":"1.00000000","asset":"EOS","status":"CONFIRMED","timestamp":1566888403,"txId":5239808703,"type":"ROLL_IN"}],"total":3} > }
    */
    get_cross_margin_transfer_history: async (asset, type, startTime, endTime, current, size, archived) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/transfer', { asset, type, startTime, endTime, current, size, archived }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * - `txId` or `startTime` must be sent. `txId` takes precedence.
     * - Response in descending order
     * - If `isolatedSymbol` is not sent, crossed margin data will be returned
     * - The max interval between startTime and endTime is `30` days.
     * - If startTime and endTime not sent, return records of the last `7` days by default
     * - Set archived to `true` to query data from `6` months ago
     * @param {string} asset
     * @param {string | undefined} isolatedSymbol  - isolated symbol
     * @param {number | undefined} txId  - the tranId in POST /sapi/v`1`/margin/loan
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10` Max:`100`
     * @param {string | undefined} archived  - Default: false . Set to true for archived data from `6` months ago
     * @returns { Promise < {"rows":[{"isolatedSymbol":"BNBUSDT","txId":12807067523,"asset":"BNB","principal":"0.84624403","timestamp":1555056425000,"status":"CONFIRMED"}],"total":1} > }
    */
    query_loan_record: async (asset, isolatedSymbol, txId, startTime, endTime, current, size, archived) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/loan', { asset, isolatedSymbol, txId, startTime, endTime, current, size, archived }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * - `txId` or `startTime` must be sent. `txId` takes precedence.
     * - Response in descending order
     * - If `isolatedSymbol` is not sent, crossed margin data will be returned
     * - The max interval between startTime and endTime is `30` days.
     * - If startTime and endTime not sent, return records of the last `7` days by default
     * - Set archived to `true` to query data from `6` months ago
     * @param {string} asset
     * @param {string | undefined} isolatedSymbol  - isolated symbol
     * @param {number | undefined} txId  - return of /sapi/v`1`/margin/repay
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10` Max:`100`
     * @param {string | undefined} archived  - Default: false . Set to true for archived data from `6` months ago
     * @returns { Promise < {"rows":[{"isolatedSymbol":"BNBUSDT","amount":"14.00000000","asset":"BNB","interest":"0.01866667","principal":"13.98133333","status":"CONFIRMED","timestamp":1563438204000,"txId":2970933056}],"total":1} > }
    */
    query_repay_record: async (asset, isolatedSymbol, txId, startTime, endTime, current, size, archived) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/repay', { asset, isolatedSymbol, txId, startTime, endTime, current, size, archived }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Response in descending order
     * - If `isolatedSymbol` is not sent, crossed margin data will be returned
     * - The max interval between startTime and endTime is `30` days.
     * - If startTime and endTime not sent, return records of the last `7` days by default
     * - Set archived to `true` to query data from `6` months ago
     * - `type` in response has `4` enums: `PERIODIC` interest charged per hour `ON_BORROW` first interest charged on borrow `PERIODIC_CONVERTED` interest charged per hour converted into BNB `ON_BORROW_CONVERTED` first interest charged on borrow converted into BNB `PORTFOLIO` interest charged daily on the portfolio margin negative balance
     * - `PERIODIC` interest charged per hour
     * - `ON_BORROW` first interest charged on borrow
     * - `PERIODIC_CONVERTED` interest charged per hour converted into BNB
     * - `ON_BORROW_CONVERTED` first interest charged on borrow converted into BNB
     * - `PORTFOLIO` interest charged daily on the portfolio margin negative balance
     * @param {string | undefined} asset
     * @param {string | undefined} isolatedSymbol  - isolated symbol
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10` Max:`100`
     * @param {string | undefined} archived  - Default: false . Set to true for archived data from `6` months ago
     * @returns { Promise <  > }
    */
    get_interest_history: async (asset, isolatedSymbol, startTime, endTime, current, size, archived) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/interestHistory', { asset, isolatedSymbol, startTime, endTime, current, size, archived }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Response in descending order
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {string | undefined} isolatedSymbol
     * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10` Max:`100`
     * @returns { Promise < {"rows":[{"avgPrice":"0.00388359","executedQty":"31.39000000","orderId":180015097,"price":"0.00388110","qty":"31.39000000","side":"SELL","symbol":"BNBBTC","timeInForce":"GTC","isIsolated":true,"updatedTime":1558941374745}],"total":1} > }
    */
    get_force_liquidation_record: async (startTime, endTime, isolatedSymbol, current, size) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/forceLiquidationRec', { startTime, endTime, isolatedSymbol, current, size }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * @returns { Promise < {"borrowEnabled":true,"marginLevel":"11.64405625","totalAssetOfBtc":"6.82728457","totalLiabilityOfBtc":"0.58633215","totalNetAssetOfBtc":"6.24095242","tradeEnabled":true,"transferEnabled":true,"userAssets":[{"asset":"BTC","borrowed":"0.00000000","free":"0.00499500","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00499500"},{"asset":"BNB","borrowed":"201.66666672","free":"2346.50000000","interest":"0.00000000","locked":"0.00000000","netAsset":"2144.83333328"},{"asset":"ETH","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"},{"asset":"USDT","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"}]} > }
    */
    query_cross_margin_account_details: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/account', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * - Either `orderId` or `origClientOrderId` must be sent.
     * - For some historical orders cummulativeQuoteQty will be < `0`, meaning the data is not available at this time.
     * @param {string} symbol
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {number | undefined} orderId
     * @param {string | undefined} origClientOrderId
     * @returns { Promise < {"clientOrderId":"ZwfQzuDIGpceVhKW5DvCmO","cummulativeQuoteQty":"0.00000000","executedQty":"0.00000000","icebergQty":"0.00000000","isWorking":true,"orderId":213205622,"origQty":"0.30000000","price":"0.00493630","side":"SELL","status":"NEW","stopPrice":"0.00000000","symbol":"BNBBTC","isIsolated":true,"time":1562133008725,"timeInForce":"GTC","type":"LIMIT","updateTime":1562133008725} > }
    */
    query_margin_accounts_order: async (symbol, isIsolated, orderId, origClientOrderId) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/order', { symbol, isIsolated, orderId, origClientOrderId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * - If the `symbol` is not sent, orders for all symbols will be returned in an array.
     * - When all symbols are returned, the number of requests counted against the rate limiter is equal to the number of symbols currently trading on the exchange.
     * - If `isIsolated` ="TRUE", `symbol` must be sent.
     * @param {string | undefined} symbol
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @returns { Promise < [{"clientOrderId":"qhcZw71gAkCCTv0t0k8LUK","cummulativeQuoteQty":"0.00000000","executedQty":"0.00000000","icebergQty":"0.00000000","isWorking":true,"orderId":211842552,"origQty":"0.30000000","price":"0.00475010","side":"SELL","status":"NEW","stopPrice":"0.00000000","symbol":"BNBBTC","isIsolated":true,"time":1562040170089,"timeInForce":"GTC","type":"LIMIT","updateTime":1562040170089}] > }
    */
    query_margin_accounts_open_orders: async (symbol, isIsolated) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/openOrders', { symbol, isIsolated }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `200`
     * - If `orderId` is set, it will get orders >= that `orderId`. Otherwise most recent orders are returned.
     * - For some historical orders cummulativeQuoteQty will be < `0`, meaning the data is not available at this time.
     * @param {string} symbol
     * @param {number | undefined} limit  - Default `500`; max `500`.
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {number | undefined} orderId
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < [{"clientOrderId":"D2KDy4DIeS56PvkM13f8cP","cummulativeQuoteQty":"0.00000000","executedQty":"0.00000000","icebergQty":"0.00000000","isWorking":false,"orderId":41295,"origQty":"5.31000000","price":"0.22500000","side":"SELL","status":"CANCELED","stopPrice":"0.18000000","symbol":"BNBBTC","isIsolated":false,"time":1565769338806,"timeInForce":"GTC","type":"TAKE_PROFIT_LIMIT","updateTime":1565769342148},{"clientOrderId":"gXYtqhcEAs2Rn9SUD9nRKx","cummulativeQuoteQty":"0.00000000","executedQty":"0.00000000","icebergQty":"1.00000000","isWorking":true,"orderId":41296,"origQty":"6.65000000","price":"0.18000000","side":"SELL","status":"CANCELED","stopPrice":"0.00000000","symbol":"BNBBTC","isIsolated":false,"time":1565769348687,"timeInForce":"GTC","type":"LIMIT","updateTime":1565769352226},{"clientOrderId":"duDq1BqohhcMmdMs9FSuDy","cummulativeQuoteQty":"0.39450000","executedQty":"2.63000000","icebergQty":"0.00000000","isWorking":true,"orderId":41297,"origQty":"2.63000000","price":"0.00000000","side":"SELL","status":"FILLED","stopPrice":"0.00000000","symbol":"BNBBTC","isIsolated":false,"time":1565769358139,"timeInForce":"GTC","type":"MARKET","updateTime":1565769358139}] > }
    */
    query_margin_accounts_all_orders: async (symbol, limit, isIsolated, orderId, startTime, endTime) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/allOrders', { symbol, limit, isIsolated, orderId, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a new OCO for a margin account
     * - Weight(UID) : `6`
     * - Parameters :
     * - Other Info:
     * - Price Restrictions: `SELL` : Limit Price > Last Price > Stop Price `BUY` : Limit Price < Last Price < Stop Price
     * - `SELL` : Limit Price > Last Price > Stop Price
     * - `BUY` : Limit Price < Last Price < Stop Price
     * - Quantity Restrictions: Both legs must have the same `quantity` `ICEBERG` quantities however do not have to be the same.
     * - Both legs must have the same `quantity`
     * - `ICEBERG` quantities however do not have to be the same.
     * - Order Rate Limit `OCO` counts as `2` orders against the order rate limit.
     * - `OCO` counts as `2` orders against the order rate limit.
     * @param {string} symbol
     * @param {ENUM} side
     * @param {number} quantity
     * @param {number} price
     * @param {number} stopPrice
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {string | undefined} listClientOrderId  - A unique Id for the entire orderList
     * @param {string | undefined} limitClientOrderId  - A unique Id for the limit order
     * @param {number | undefined} limitIcebergQty
     * @param {string | undefined} stopClientOrderId  - A unique Id for the stop loss/stop loss limit leg
     * @param {number | undefined} stopLimitPrice  - If provided, stopLimitTimeInForce is required.
     * @param {number | undefined} stopIcebergQty
     * @param {ENUM | undefined} stopLimitTimeInForce  - Valid values are GTC / FOK / IOC
     * @param {ENUM | undefined} newOrderRespType  - Set the response JSON.
     * @param {ENUM | undefined} sideEffectType  - NO_SIDE_EFFECT, MARGIN_BUY, AUTO_REPAY; default NO_SIDE_EFFECT.
     * @returns { Promise < {"orderListId":0,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"JYVpp3F0f5CAG15DhtrqLp","transactionTime":1563417480525,"symbol":"LTCBTC","marginBuyBorrowAmount":"5","marginBuyBorrowAsset":"BTC","isIsolated":false,"orders":[{"symbol":"LTCBTC","orderId":2,"clientOrderId":"Kk7sqHb9J6mJWTMDVW7Vos"},{"symbol":"LTCBTC","orderId":3,"clientOrderId":"xTXKaGYd4bluPVp78IVRvl"}],"orderReports":[{"symbol":"LTCBTC","orderId":2,"orderListId":0,"clientOrderId":"Kk7sqHb9J6mJWTMDVW7Vos","transactTime":1563417480525,"price":"0.000000","origQty":"0.624363","executedQty":"0.000000","cummulativeQuoteQty":"0.000000","status":"NEW","timeInForce":"GTC","type":"STOP_LOSS","side":"BUY","stopPrice":"0.960664"},{"symbol":"LTCBTC","orderId":3,"orderListId":0,"clientOrderId":"xTXKaGYd4bluPVp78IVRvl","transactTime":1563417480525,"price":"0.036435","origQty":"0.624363","executedQty":"0.000000","cummulativeQuoteQty":"0.000000","status":"NEW","timeInForce":"GTC","type":"LIMIT_MAKER","side":"BUY"}]} > }
    */
    margin_account_new_oco_trade: async (symbol, side, quantity, price, stopPrice, isIsolated, listClientOrderId, limitClientOrderId, limitIcebergQty, stopClientOrderId, stopLimitPrice, stopIcebergQty, stopLimitTimeInForce, newOrderRespType, sideEffectType) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

      if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

      if (typeof price === 'undefined') return new Error('price', 'REQUIRED');

      if (typeof stopPrice === 'undefined') return new Error('stopPrice', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/margin/order/oco', { symbol, side, quantity, price, stopPrice, isIsolated, listClientOrderId, limitClientOrderId, limitIcebergQty, stopClientOrderId, stopLimitPrice, stopIcebergQty, stopLimitTimeInForce, newOrderRespType, sideEffectType }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Cancel an entire Order List for a margin account.
     * - Weight(UID) : `1`
     * - Additional notes:
     * - Canceling an individual leg will cancel the entire OCO
     * @param {string} symbol
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {number | undefined} orderListId  - Either orderListId or listClientOrderId must be provided
     * @param {string | undefined} listClientOrderId  - Either orderListId or listClientOrderId must be provided
     * @param {string | undefined} newClientOrderId  - Used to uniquely identify this cancel. Automatically generated by default
     * @returns { Promise < {"orderListId":0,"contingencyType":"OCO","listStatusType":"ALL_DONE","listOrderStatus":"ALL_DONE","listClientOrderId":"C3wyj4WVEktd7u9aVBRXcN","transactionTime":1574040868128,"symbol":"LTCBTC","isIsolated":false,"orders":[{"symbol":"LTCBTC","orderId":2,"clientOrderId":"pO9ufTiFGg3nw2fOdgeOXa"},{"symbol":"LTCBTC","orderId":3,"clientOrderId":"TXOvglzXuaubXAaENpaRCB"}],"orderReports":[{"symbol":"LTCBTC","origClientOrderId":"pO9ufTiFGg3nw2fOdgeOXa","orderId":2,"orderListId":0,"clientOrderId":"unfWT8ig8i0uj6lPuYLez6","price":"1.00000000","origQty":"10.00000000","executedQty":"0.00000000","cummulativeQuoteQty":"0.00000000","status":"CANCELED","timeInForce":"GTC","type":"STOP_LOSS_LIMIT","side":"SELL","stopPrice":"1.00000000"},{"symbol":"LTCBTC","origClientOrderId":"TXOvglzXuaubXAaENpaRCB","orderId":3,"orderListId":0,"clientOrderId":"unfWT8ig8i0uj6lPuYLez6","price":"3.00000000","origQty":"10.00000000","executedQty":"0.00000000","cummulativeQuoteQty":"0.00000000","status":"CANCELED","timeInForce":"GTC","type":"LIMIT_MAKER","side":"SELL"}]} > }
    */
    margin_account_cancel_oco_trade: async (symbol, isIsolated, orderListId, listClientOrderId, newClientOrderId) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('DELETE', 'sapi', '/sapi/v1/margin/orderList', { symbol, isIsolated, orderListId, listClientOrderId, newClientOrderId }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Retrieves a specific OCO based on provided optional parameters
     * - Weight(IP) : `10`
     * - Parameters :
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {string | undefined} symbol  - mandatory for isolated margin, not supported for cross margin
     * @param {number | undefined} orderListId  - Either orderListId or origClientOrderId must be provided
     * @param {string | undefined} origClientOrderId  - Either orderListId or origClientOrderId must be provided
     * @returns { Promise < {"orderListId":27,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"h2USkA5YQpaXHPIrkd96xE","transactionTime":1565245656253,"symbol":"LTCBTC","isIsolated":false,"orders":[{"symbol":"LTCBTC","orderId":4,"clientOrderId":"qD1gy3kc3Gx0rihm9Y3xwS"},{"symbol":"LTCBTC","orderId":5,"clientOrderId":"ARzZ9I00CPM8i3NhmU9Ega"}]} > }
    */
    query_margin_accounts_oco: async (isIsolated, symbol, orderListId, origClientOrderId) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/orderList', { isIsolated, symbol, orderListId, origClientOrderId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Retrieves all OCO for a specific margin account based on provided optional parameters
     * - Weight(IP) : `200`
     * @param {number | undefined} limit  - Default Value: `500`; Max Value: `1000`
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {string | undefined} symbol  - mandatory for isolated margin, not supported for cross margin
     * @param {number | undefined} fromId  - If supplied, neither startTime or endTime can be provided
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < [{"orderListId":29,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"amEEAXryFzFwYF1FeRpUoZ","transactionTime":1565245913483,"symbol":"LTCBTC","isIsolated":true,"orders":[{"symbol":"LTCBTC","orderId":4,"clientOrderId":"oD7aesZqjEGlZrbtRpy5zB"},{"symbol":"LTCBTC","orderId":5,"clientOrderId":"Jr1h6xirOxgeJOUuYQS7V3"}]},{"orderListId":28,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"hG7hFNxJV6cZy3Ze4AUT4d","transactionTime":1565245913407,"symbol":"LTCBTC","orders":[{"symbol":"LTCBTC","orderId":2,"clientOrderId":"j6lFOfbmFMRjTYA7rRJ0LP"},{"symbol":"LTCBTC","orderId":3,"clientOrderId":"z0KCjOdditiLS5ekAFtK81"}]}] > }
    */
    query_margin_accounts_all_oco: async (limit, isIsolated, symbol, fromId, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/allOrderList', { limit, isIsolated, symbol, fromId, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP) : `10`
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {string | undefined} symbol  - mandatory for isolated margin, not supported for cross margin
     * @returns { Promise < [{"orderListId":31,"contingencyType":"OCO","listStatusType":"EXEC_STARTED","listOrderStatus":"EXECUTING","listClientOrderId":"wuB13fmulKj3YjdqWEcsnp","transactionTime":1565246080644,"symbol":"LTCBTC","isIsolated":false,"orders":[{"symbol":"LTCBTC","orderId":4,"clientOrderId":"r3EH2N76dHfLoSZWIUw1bT"},{"symbol":"LTCBTC","orderId":5,"clientOrderId":"Cv1SnyPD3qhqpbjpYEHbd2"}]}] > }
    */
    query_margin_accounts_open_oco: async (isIsolated, symbol) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/openOrderList', { isIsolated, symbol }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * - If `fromId` is set, it will get trades >= that `fromId`. Otherwise most recent trades are returned.
     * @param {string} symbol
     * @param {number | undefined} limit  - Default `500`; max `1000`.
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {number | undefined} orderId
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} fromId  - TradeId to fetch from. Default gets most recent trades.
     * @returns { Promise < [{"commission":"0.00006000","commissionAsset":"BTC","id":34,"isBestMatch":true,"isBuyer":false,"isMaker":false,"orderId":39324,"price":"0.02000000","qty":"3.00000000","symbol":"BNBBTC","isIsolated":false,"time":1561973357171}] > }
    */
    query_margin_accounts_trade_list: async (symbol, limit, isIsolated, orderId, startTime, endTime, fromId) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/myTrades', { symbol, limit, isIsolated, orderId, startTime, endTime, fromId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `50`
     * - If `isolatedSymbol` is not sent, crossed margin data will be sent.
     * - `borrowLimit` is also available from https://www.binance.com/en/margin-fee
     * @param {string} asset
     * @param {string | undefined} isolatedSymbol  - isolated symbol
     * @returns { Promise < {"amount":"1.69248805","borrowLimit":"60"} > }
    */
    query_max_borrow: async (asset, isolatedSymbol) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/maxBorrowable', { asset, isolatedSymbol }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `50`
     * - If `isolatedSymbol` is not sent, crossed margin data will be sent.
     * @param {string} asset
     * @param {string | undefined} isolatedSymbol  - isolated symbol
     * @returns { Promise < {"amount":"3.59498107"} > }
    */
    query_max_transfer_out_amount: async (asset, isolatedSymbol) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/maxTransferable', { asset, isolatedSymbol }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get personal margin level information
     * - Weight(IP): `10`
     * @returns { Promise < {"normalBar":"1.5","marginCallBar":"1.3","forceLiquidationBar":"1.1"} > }
    */
    get_summary_of_margin_account: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/tradeCoeff', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `600`
     * @param {string} asset  - asset,such as BTC
     * @param {string} symbol
     * @param {string} transFrom  - "SPOT", "ISOLATED_MARGIN"
     * @param {string} transTo  - "SPOT", "ISOLATED_MARGIN"
     * @param {number} amount
     * @returns { Promise < {"tranId":100000001} > }
    */
    isolated_margin_account_transfer_margin: async (asset, symbol, transFrom, transTo, amount) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      if (typeof transFrom === 'undefined') return new Error('transFrom', 'REQUIRED');

      if (typeof transTo === 'undefined') return new Error('transTo', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/margin/isolated/transfer', { asset, symbol, transFrom, transTo, amount }, 'MARGIN');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - The max interval between startTime and endTime is `30` days.
     * - If startTime and endTime not sent, return records of the last `7` days by default
     * - Set archived to `true` to query data from `6` months ago
     * @param {string} symbol
     * @param {string | undefined} asset
     * @param {string | undefined} transFrom  - "SPOT", "ISOLATED_MARGIN"
     * @param {string | undefined} transTo  - "SPOT", "ISOLATED_MARGIN"
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Current page, default `1`
     * @param {number | undefined} size  - Default `10`, max `100`
     * @param {string | undefined} archived  - Default: false . Set to true for archived data from `6` months ago
     * @returns { Promise < {"rows":[{"amount":"0.10000000","asset":"BNB","status":"CONFIRMED","timestamp":1566898617000,"txId":5240372201,"transFrom":"SPOT","transTo":"ISOLATED_MARGIN"},{"amount":"5.00000000","asset":"USDT","status":"CONFIRMED","timestamp":1566888436123,"txId":5239810406,"transFrom":"ISOLATED_MARGIN","transTo":"SPOT"}],"total":2} > }
    */
    get_isolated_margin_transfer_history: async (symbol, asset, transFrom, transTo, startTime, endTime, current, size, archived) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/isolated/transfer', { symbol, asset, transFrom, transTo, startTime, endTime, current, size, archived }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - If "`symbols`" is not sent
     * - If "`symbols`" is sent
     * - Weight(IP): `10`
     * - If "`symbols`" is not sent, all isolated assets will be returned.
     * - If "`symbols`" is sent, only the isolated assets of the sent `symbols` will be returned.
     * @param {string | undefined} symbols  - Max `5` symbols can be sent; separated by ",". e.g. "BTCUSDT,BNBUSDT,ADAUSDT"
     * @returns { Promise < {"assets":[{"baseAsset":{"asset":"BTC","borrowEnabled":true,"borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000","netAssetOfBtc":"0.00000000","repayEnabled":true,"totalAsset":"0.00000000"},"quoteAsset":{"asset":"USDT","borrowEnabled":true,"borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000","netAssetOfBtc":"0.00000000","repayEnabled":true,"totalAsset":"0.00000000"},"symbol":"BTCUSDT","isolatedCreated":true,"enabled":true,"marginLevel":"0.00000000","marginLevelStatus":"EXCESSIVE","marginRatio":"0.00000000","indexPrice":"10000.00000000","liquidatePrice":"1000.00000000","liquidateRate":"1.00000000","tradeEnabled":true}],"totalAssetOfBtc":"0.00000000","totalLiabilityOfBtc":"0.00000000","totalNetAssetOfBtc":"0.00000000"} > }
     * @returns { Promise < {"assets":[{"baseAsset":{"asset":"BTC","borrowEnabled":true,"borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000","netAssetOfBtc":"0.00000000","repayEnabled":true,"totalAsset":"0.00000000"},"quoteAsset":{"asset":"USDT","borrowEnabled":true,"borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000","netAssetOfBtc":"0.00000000","repayEnabled":true,"totalAsset":"0.00000000"},"symbol":"BTCUSDT","isolatedCreated":true,"enabled":true,"marginLevel":"0.00000000","marginLevelStatus":"EXCESSIVE","marginRatio":"0.00000000","indexPrice":"10000.00000000","liquidatePrice":"1000.00000000","liquidateRate":"1.00000000","tradeEnabled":true}]} > }
    */
    query_isolated_margin_account_info: async (symbols) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/isolated/account', { symbols }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Disable isolated margin account for a specific `symbol`. Each trading pair can only be deactivated once every `24` hours.
     * - Weight(UID): `300`
     * @param {string} symbol
     * @returns { Promise < {"success":true,"symbol":"BTCUSDT"} > }
    */
    disable_isolated_margin_account_trade: async (symbol) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('DELETE', 'sapi', '/sapi/v1/margin/isolated/account', { symbol }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Enable isolated margin account for a specific `symbol`(Only supports activation of previously disabled accounts).
     * - Weight(UID): `300`
     * @param {string} symbol
     * @returns { Promise < {"success":true,"symbol":"BTCUSDT"} > }
    */
    enable_isolated_margin_account_trade: async (symbol) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/margin/isolated/account', { symbol }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Query enabled isolated margin account limit.
     * - Weight(IP): `1`
     * @returns { Promise < {"enabledAccount":5,"maxAccount":20} > }
    */
    query_enabled_isolated_margin_account_limit: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/isolated/accountLimit', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * @param {string} symbol
     * @returns { Promise < {"symbol":"BTCUSDT","base":"BTC","quote":"USDT","isMarginTrade":true,"isBuyAllowed":true,"isSellAllowed":true} > }
    */
    query_isolated_margin_symbol: async (symbol) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/isolated/pair', { symbol }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * @returns { Promise < [{"base":"BNB","isBuyAllowed":true,"isMarginTrade":true,"isSellAllowed":true,"quote":"BTC","symbol":"BNBBTC"},{"base":"TRX","isBuyAllowed":true,"isMarginTrade":true,"isSellAllowed":true,"quote":"BTC","symbol":"TRXBTC"}] > }
    */
    get_all_isolated_margin_symbol: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/isolated/allPairs', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - "`spotBNBBurn`" and "`interestBNBBurn`" should be sent at least one.
     * @param {string | undefined} spotBNBBurn  - "true" or "false"; Determines whether to use BNB to pay for trading fees on SPOT
     * @param {string | undefined} interestBNBBurn  - "true" or "false"; Determines whether to use BNB to pay for margin loan's interest
     * @returns { Promise < {"spotBNBBurn":true,"interestBNBBurn":false} > }
    */
    toggle_bnb_burn_on_spot_trade_and_margin_interest: async (spotBNBBurn, interestBNBBurn) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/bnbBurn', { spotBNBBurn, interestBNBBurn }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * @returns { Promise < {"spotBNBBurn":true,"interestBNBBurn":false} > }
    */
    get_bnb_burn_status: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/bnbBurn', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * @param {string} asset
     * @param {number | undefined} vipLevel  - Default: user's vip level
     * @param {number | undefined} startTime  - Default: `7` days ago
     * @param {number | undefined} endTime  - Default: present. Maximum range: `1` months.
     * @returns { Promise < [{"asset":"BTC","dailyInterestRate":"0.00025000","timestamp":1611544731000,"vipLevel":1},{"asset":"BTC","dailyInterestRate":"0.00035000","timestamp":1610248118000,"vipLevel":1}] > }
    */
    query_margin_interest_rate_history: async (asset, vipLevel, startTime, endTime) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/interestRateHistory', { asset, vipLevel, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get cross margin fee data collection with any vip level or user's current specific data as https://www.binance.com/en/margin-fee
     * - Weight(IP): `1` when `coin` is specified; `5` when the `coin` parameter is omitted
     * @param {number | undefined} vipLevel  - User's current specific margin data will be returned if vipLevel is omitted
     * @param {string | undefined} coin
     * @returns { Promise < [{"vipLevel":0,"coin":"BTC","transferIn":true,"borrowable":true,"dailyInterest":"0.00026125","yearlyInterest":"0.0953","borrowLimit":"180","marginablePairs":["BNBBTC","TRXBTC","ETHBTC","BTCUSDT"]}] > }
    */
    query_cross_margin_fee_data: async (vipLevel, coin) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/crossMarginData', { vipLevel, coin }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get isolated margin fee data collection with any vip level or user's current specific data as https://www.binance.com/en/margin-fee
     * - Weight(IP): `1` when a single is specified; `10` when the `symbol` parameter is omitted
     * @param {number | undefined} vipLevel  - User's current specific margin data will be returned if vipLevel is omitted
     * @param {string | undefined} symbol
     * @returns { Promise < [{"vipLevel":0,"symbol":"BTCUSDT","leverage":"10","data":[{"coin":"BTC","dailyInterest":"0.00026125","borrowLimit":"270"},{"coin":"USDT","dailyInterest":"0.000475","borrowLimit":"2100000"}]}] > }
    */
    query_isolated_margin_fee_data: async (vipLevel, symbol) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/isolatedMarginData', { vipLevel, symbol }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get isolated margin `tier` data collection with any `tier` as https://www.binance.com/en/margin-data
     * - Weight(IP): `1`
     * @param {string} symbol
     * @param {INTEGER | undefined} tier  - All margin tier data will be returned if tier is omitted
     * @returns { Promise < [{"symbol":"BTCUSDT","tier":1,"effectiveMultiple":"10","initialRiskRatio":"1.111","liquidationRiskRatio":"1.05","baseAssetMaxBorrowable":"9","quoteAssetMaxBorrowable":"70000"}] > }
    */
    query_isolated_margin_tier_data: async (symbol, tier) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/isolatedMarginTier', { symbol, tier }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Displays the user's current margin order count usage for all intervals.
     * - Weight(IP): `20`
     * @param {string | undefined} isIsolated  - for isolated margin or not, "TRUE", "FALSE",default "FALSE"
     * @param {string | undefined} symbol  - isolated symbol, mandatory for isolated margin
     * @returns { Promise < [{"rateLimitType":"ORDERS","interval":"SECOND","intervalNum":10,"limit":10000,"count":0},{"rateLimitType":"ORDERS","interval":"DAY","intervalNum":1,"limit":20000,"count":0}] > }
    */
    query_current_margin_order_count_usage_trade: async (isIsolated, symbol) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/rateLimit/order', { isIsolated, symbol }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Query the historical information of user's margin account small-value asset conversion BNB.
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise <  > }
    */
    margin_dustlog: async (startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/dribblet', { startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `100`
     * - Parameters: None
     * @returns { Promise < [{"collaterals":[{"minUsdValue":"0","maxUsdValue":"13000000","discountRate":"1"},{"minUsdValue":"13000000","maxUsdValue":"20000000","discountRate":"0.975"},{"minUsdValue":"20000000","discountRate":"0"}],"assetNames":["BNX"]},{"collaterals":[{"minUsdValue":"0","discountRate":"1"}],"assetNames":["BTC","BUSD","ETH","USDT"]}] > }
    */
    cross_margin_collateral_ratio_market_data: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/crossMarginCollateralRatio', {}, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Query the coins which can be small liability exchange
     * - Weight(UID): `100`
     * @returns { Promise < [{"asset":"ETH","interest":"0.00083334","principal":"0.001","liabilityAsset":"USDT","liabilityQty":0.3552}] > }
    */
    get_small_liability_exchange_coin_list: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/exchange-small-liability', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Cross Margin Small Liability Exchange
     * - Weight(UID): `3000`
     * - Only convert once within `6` hours
     * - Only liability valuation less than `10` USDT are supported
     * - The maximum number of coin is `10`
     * @param {ARRAY} assetNames  - The assets list of small liability exchange, Example: assetNames = BTC,ETH
     * @returns { Promise <  > }
    */
    small_liability_exchange_margin: async (assetNames) => {
      // Expects (HMAC SHA256)
      if (typeof assetNames === 'undefined') return new Error('assetNames', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/margin/exchange-small-liability', { assetNames }, 'MARGIN');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get Small liability Exchange History
     * - Weight(UID): `100`
     * @param {number} current  - Currently querying page. Start from `1`. Default:`1`
     * @param {number} size  - Default:`10`, Max:`100`
     * @param {number | undefined} startTime  - Default: `30` days from current timestamp
     * @param {number | undefined} endTime  - Default: present timestamp
     * @returns { Promise < {"total":1,"rows":[{"asset":"ETH","amount":"0.00083434","targetAsset":"BUSD","targetAmount":"1.37576819","bizType":"EXCHANGE_SMALL_LIABILITY","timestamp":1672801339253}]} > }
    */
    get_small_liability_exchange_history: async (current, size, startTime, endTime) => {
      // Expects (HMAC SHA256)
      if (typeof current === 'undefined') return new Error('current', 'REQUIRED');

      if (typeof size === 'undefined') return new Error('size', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/exchange-small-liability-history', { current, size, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get user the next hourly estimate interest
     * - Weight(UID): `100`
     * - The base API endpoint is: https://api.binance.com
     * - A User Data Stream `listenKey` is valid for `60` minutes after creation.
     * - Doing a `PUT` on a `listenKey` will extend its validity for `60` minutes.
     * - Doing a `DELETE` on a `listenKey` will close the stream and invalidate the `listenKey` .
     * - Doing a `POST` on an account with an active `listenKey` will return the currently active `listenKey` and extend its validity for `60` minutes.
     * - A `listenKey` is a stream.
     * - Users can listen to multiple streams.
     * - The base websocket endpoint is: wss://stream.binance.com:`9443`
     * - User Data Streams are accessed at /ws/<listenKey> or /stream?streams=<listenKey>
     * - A single connection to stream.binance.com is only valid for `24` hours; expect to be disconnected at the `24` hour mark
     * @param {String} assets  - List of assets, separated by commas, up to `20`
     * @param {Boolean} isIsolated  - for isolated margin or not, "TRUE", "FALSE"
     * @returns { Promise < [{"asset":"BTC","nextHourlyInterestRate":"0.00000571"},{"asset":"ETH","nextHourlyInterestRate":"0.00000578"}] > }
    */
    get_a_future_hourly_interest_rate: async (assets, isIsolated) => {
      // Expects (HMAC SHA256)
      if (typeof assets === 'undefined') return new Error('assets', 'REQUIRED');

      if (typeof isIsolated === 'undefined') return new Error('isIsolated', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/margin/next-hourly-interest-rate', { assets, isIsolated }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * - Start a new user data stream. The stream will close after `60` minutes unless a keepalive is sent. If the account has an active listenKey , that listenKey will be returned and its validity will be extended for `60` minutes.
   * - Weight: `1`
   * - Data Source: Memory
   * - Keepalive a user data stream to prevent a time out. User data streams will close after `60` minutes. It's recommended to send a ping about every `30` minutes.
   * - Weight: `1`
   * - Data Source: Memory
   * - Weight: `1`
   * - Data Source: Memory
   * @param {string} listenKey
   * @returns { Promise < {"listenKey":"pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a65a1"} > }
  */
  async listenKey_Spot() {

    if (typeof listenKey === 'undefined') return new Error('listenKey', 'REQUIRED');

    const resp = await this.request('POST', 'api', '/api/v3/userDataStream', { listenKey }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight: `1`
   * - NONE
   * - Weight: `1`
   * - Weight: `1`
   * @param {string} listenKey
   * @returns { Promise < {"listenKey":"T3ee22BIYuWqmvne0HNq2A2WsFlEtLhvWCtItw6ffhhdmjifQ2tRbuKkTHhr"} > }
   * @returns { Promise < {} > }
   * @returns { Promise < {} > }
  */
  async listenKey_Margin(listenKey) {

    if (typeof listenKey === 'undefined') return new Error('listenKey', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/userDataStream', { listenKey }, 'MARGIN');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight: `1`
   * - Weight: `1`
   * - Weight: `1`
   * @param {string} symbol
   * @returns { Promise < {"listenKey":"T3ee22BIYuWqmvne0HNq2A2WsFlEtLhvWCtItw6ffhhdmjifQ2tRbuKkTHhr"} > }
   * @returns { Promise < {} > }
   * @returns { Promise < {} > }
  */
  async listenKey_isolatedMargin(symbol) {

    if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/userDataStream/isolated', { symbol }, 'MARGIN');
    if (resp.error) return resp;

    return resp;
  }

  /**
  * @param {string} listenKey
  * @returns { Promise < {} > }
  */
  async keepAlive_listenKey(listenKey) {

    if (typeof listenKey === 'undefined') return new Error('listenKey', 'REQUIRED');

    const resp = await this.request('PUT', 'api', '/api/v3/userDataStream', { listenKey }, 'NONE');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * @param {ENUM | undefined} status  - "ALL", "SUBSCRIBABLE", "UNSUBSCRIBABLE"; Default: "ALL"
   * @param {string | undefined} asset
   * @param {string | undefined} featured  - "ALL", "TRUE"; Default: "ALL"
   * @param {number | undefined} current  - Current query page. Default: `1`, Min: `1`
   * @param {number | undefined} size  - Default: `50`, Max: `100`
   * @returns { Promise <  > }
  */
  async get_flexible_product_list(status, asset, featured, current, size) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/daily/product/list', { status, asset, featured, current, size }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * @param {string} productId
   * @returns { Promise < {"asset":"BUSD","leftQuota":"50000.00000000"} > }
  */
  async get_left_daily_purchase_quota_of_flexible_product(productId) {
    // Expects (HMAC SHA256)
    if (typeof productId === 'undefined') return new Error('productId', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/daily/userLeftQuota', { productId }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * - Rate Limit: `1`/`3`s per account
   * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
   * @param {string} productId
   * @param {number} amount
   * @returns { Promise < {"purchaseId":40607} > }
  */
  async purchase_flexible_product(productId, amount) {
    // Expects (HMAC SHA256)
    if (typeof productId === 'undefined') return new Error('productId', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/lending/daily/purchase', { productId, amount }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * @param {string} productId
   * @param {ENUM} type  - "FAST", "NORMAL"
   * @returns { Promise < {"asset":"USDT","dailyQuota":"10000000.00000000","leftQuota":"0.00000000","minRedemptionAmount":"0.10000000"} > }
  */
  async get_left_daily_redemption_quota_of_flexible_product(productId, type) {
    // Expects (HMAC SHA256)
    if (typeof productId === 'undefined') return new Error('productId', 'REQUIRED');

    if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/daily/userRedemptionQuota', { productId, type }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
   * @param {string} productId
   * @param {number} amount
   * @param {ENUM} type  - "FAST"
   * @returns { Promise < {} > }
  */
  async redeem_flexible_product(productId, amount, type) {
    // Expects (HMAC SHA256)
    if (typeof productId === 'undefined') return new Error('productId', 'REQUIRED');

    if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

    if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/lending/daily/redeem', { productId, amount, type }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * @param {string | undefined} asset
   * @returns { Promise < [{"tierAnnualInterestRate":{"0-5BTC":0.05,"5-10BTC":0.03,">10BTC":0.01},"annualInterestRate":"0.02599895","asset":"USDT","avgAnnualInterestRate":"0.02599895","canRedeem":true,"dailyInterestRate":"0.00007123","freeAmount":"75.46000000","freezeAmount":"0.00000000","lockedAmount":"0.00000000","productId":"USDT001","productName":"USDT","redeemingAmount":"0.00000000","todayPurchasedAmount":"0.00000000","totalAmount":"75.46000000","totalInterest":"0.22759183"}] > }
  */
  async get_flexible_product_position(asset) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/daily/token/position', { asset }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * @param {ENUM} type  - "ACTIVITY", "CUSTOMIZED_FIXED"
   * @param {string | undefined} asset
   * @param {ENUM | undefined} status  - "ALL", "SUBSCRIBABLE", "UNSUBSCRIBABLE"; default "ALL"
   * @param {BOOLEAN | undefined} isSortAsc  - default "true"
   * @param {ENUM | undefined} sortBy  - "START_TIME", "LOT_SIZE", "INTEREST_RATE", "DURATION"; default "START_TIME"
   * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
   * @param {number | undefined} size  - Default:`10`, Max:`100`
   * @returns { Promise < [{"asset":"USDT","displayPriority":1,"duration":90,"interestPerLot":"1.35810000","interestRate":"0.05510000","lotSize":"100.00000000","lotsLowLimit":1,"lotsPurchased":74155,"lotsUpLimit":80000,"maxLotsPerUser":2000,"needKyc":false,"projectId":"CUSDT90DAYSS001","projectName":"USDT","status":"PURCHASING","type":"CUSTOMIZED_FIXED","withAreaLimitation":false}] > }
  */
  async get_fixed_and_activity_project_list(type, asset, status, isSortAsc, sortBy, current, size) {
    // Expects (HMAC SHA256)
    if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/project/list', { type, asset, status, isSortAsc, sortBy, current, size }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * - Rate Limit: `1`/`3`s per account
   * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
   * @param {string} projectId
   * @param {number} lot
   * @returns { Promise < {"purchaseId":"18356"} > }
  */
  async purchase_fixed_activity_project(projectId, lot) {
    // Expects (HMAC SHA256)
    if (typeof projectId === 'undefined') return new Error('projectId', 'REQUIRED');

    if (typeof lot === 'undefined') return new Error('lot', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/lending/customizedFixed/purchase', { projectId, lot }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * @param {string | undefined} asset
   * @param {string | undefined} projectId
   * @param {ENUM | undefined} status  - "HOLDING", "REDEEMED"
   * @returns { Promise < [{"asset":"USDT","canTransfer":true,"createTimestamp":1587010770000,"duration":14,"endTime":1588291200000,"interest":"0.19950000","interestRate":"0.05201250","lot":1,"positionId":51724,"principal":"100.00000000","projectId":"CUSDT14DAYSS001","projectName":"USDT","purchaseTime":1587010771000,"redeemDate":"2020-05-01","startTime":1587081600000,"status":"HOLDING","type":"CUSTOMIZED_FIXED"}] > }
  */
  async get_fixed_activity_project_position(asset, projectId, status) {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/project/position/list', { asset, projectId, status }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * @returns { Promise < {"positionAmountVos":[{"amount":"75.46000000","amountInBTC":"0.01044819","amountInUSDT":"75.46000000","asset":"USDT"},{"amount":"1.67072036","amountInBTC":"0.00023163","amountInUSDT":"1.67289230","asset":"BUSD"}],"totalAmountInBTC":"0.01067982","totalAmountInUSDT":"77.13289230","totalFixedAmountInBTC":"0.00000000","totalFixedAmountInUSDT":"0.00000000","totalFlexibleInBTC":"0.01067982","totalFlexibleInUSDT":"77.13289230"} > }
  */
  async lending_account() {
    // Expects (HMAC SHA256)
    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/union/account', {}, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Flexible Products
   * - Fixed/Activity Products
   * - Weight(IP): `1`
   * - The time between startTime and endTime cannot be longer than `30` days.
   * - If startTime and endTime are both not sent, then the last `30` days' data will be returned.
   * @param {ENUM} lendingType  - "DAILY" for flexible, "ACTIVITY" for activity, "CUSTOMIZED_FIXED" for fixed
   * @param {string | undefined} asset
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
   * @param {number | undefined} size  - Default:`10`, Max:`100`
   * @returns { Promise < [{"amount":"100.00000000","asset":"USDT","createTime":1575018510000,"lendingType":"DAILY","productName":"USDT","purchaseId":26055,"status":"SUCCESS"}] > }
   * @returns { Promise < [{"amount":"100.00000000","asset":"USDT","createTime":1575018453000,"lendingType":"ACTIVITY","lot":1,"productName":"【Special】USDT 7D (8%)","purchaseId":36857,"status":"SUCCESS"}] > }
  */
  async get_purchase_record(lendingType, asset, startTime, endTime, current, size) {
    // Expects (HMAC SHA256)
    if (typeof lendingType === 'undefined') return new Error('lendingType', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/union/purchaseRecord', { lendingType, asset, startTime, endTime, current, size }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Flexible Products
   * - Fixed/Activity Products
   * - Weight(IP): `1`
   * - The time between startTime and endTime cannot be longer than `30` days.
   * - If startTime and endTime are both not sent, then the last `30` days' data will be returned.
   * @param {ENUM} lendingType  - "DAILY" for flexible, "ACTIVITY" for activity, "CUSTOMIZED_FIXED" for fixed
   * @param {string | undefined} asset
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
   * @param {number | undefined} size  - Default:`10`, Max:`100`
   * @returns { Promise < [{"amount":"10.54000000","asset":"USDT","createTime":1577257222000,"principal":"10.54000000","projectId":"USDT001","projectName":"USDT","status":"PAID","type":"FAST"}] > }
   * @returns { Promise < [{"amount":"0.07070000","asset":"USDT","createTime":1566200161000,"interest":"0.00070000","principal":"0.07000000","projectId":"test06","projectName":"USDT 1 day (10% anniualized)","startTime":1566198000000,"status":"PAID"}] > }
  */
  async get_redemption_record(lendingType, asset, startTime, endTime, current, size) {
    // Expects (HMAC SHA256)
    if (typeof lendingType === 'undefined') return new Error('lendingType', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/union/redemptionRecord', { lendingType, asset, startTime, endTime, current, size }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * - The time between startTime and endTime cannot be longer than `30` days.
   * - If startTime and endTime are both not sent, then the last `30` days' data will be returned.
   * @param {ENUM} lendingType  - "DAILY" for flexible, "ACTIVITY" for activity, "CUSTOMIZED_FIXED" for fixed
   * @param {string | undefined} asset
   * @param {number | undefined} startTime
   * @param {number | undefined} endTime
   * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
   * @param {number | undefined} size  - Default:`10`, Max:`100`
   * @returns { Promise < [{"asset":"BUSD","interest":"0.00006408","lendingType":"DAILY","productName":"BUSD","time":1577233578000},{"asset":"USDT","interest":"0.00687654","lendingType":"DAILY","productName":"USDT","time":1577233562000}] > }
  */
  async get_interest_history_2(lendingType, asset, startTime, endTime, current, size) {
    // Expects (HMAC SHA256)
    if (typeof lendingType === 'undefined') return new Error('lendingType', 'REQUIRED');

    const resp = await this.request('GET', 'sapi', '/sapi/v1/lending/union/interestHistory', { lendingType, asset, startTime, endTime, current, size }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * REQUIRES BOTH `APIKEY` AND `APISECRET`
   * - Weight(IP): `1`
   * - The endpoints below allow you to interact with Staking. For more information on this, please refer to the Staking page
   * - PositionId is mandatory parameter for fixed position.
   * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
   * @param {string} projectId
   * @param {number} lot
   * @param {number | undefined} positionId  - for fixed position
   * @returns { Promise < {"dailyPurchaseId":862290,"success":true,"time":1577233578000} > }
  */
  async change_fixed_activity_position_to_daily_position(projectId, lot, positionId) {
    // Expects (HMAC SHA256)
    if (typeof projectId === 'undefined') return new Error('projectId', 'REQUIRED');

    if (typeof lot === 'undefined') return new Error('lot', 'REQUIRED');

    const resp = await this.request('POST', 'sapi', '/sapi/v1/lending/positionChanged', { projectId, lot, positionId }, 'USER_DATA');
    if (resp.error) return resp;

    return resp;
  }

  /**
   * Contains all `Staking` API requests.
   */
  Staking = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get available Staking `product` list
     * - Weight(IP): `1`
     * @param {ENUM} product  - "STAKING" for Locked Staking, "F_DEFI" for flexible DeFi Staking, "L_DEFI" for locked DeFi Staking
     * @param {string | undefined} asset
     * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10`, Max:`100`
     * @returns { Promise < [{"projectId":"Axs*90","detail":{"asset":"AXS","rewardAsset":"AXS","duration":90,"renewable":true,"apy":"1.2069"},"quota":{"totalPersonalQuota":"2","minimum":"0.001"}},{"projectId":"Fio*90","detail":{"asset":"FIO","rewardAsset":"FIO","duration":90,"renewable":true,"apy":"1.0769"},"quota":{"totalPersonalQuota":"600","minimum":"0.1"}}] > }
    */
    get_staking_product_list: async (product, asset, current, size) => {
      // Expects (HMAC SHA256)
      if (typeof product === 'undefined') return new Error('product', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/staking/productList', { product, asset, current, size }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Rate Limit: `1`/`3`s per account
     * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
     * @param {ENUM} product  - "STAKING" for Locked Staking, "F_DEFI" for flexible DeFi Staking, "L_DEFI" for locked DeFi Staking
     * @param {string} productId
     * @param {number} amount
     * @param {string | undefined} renewable  - true or false, default false. Active if product is "STAKING" or "L_DEFI"
     * @returns { Promise < {"positionId":"12345","success":true} > }
    */
    purchase_staking_product: async (product, productId, amount, renewable) => {
      // Expects (HMAC SHA256)
      if (typeof product === 'undefined') return new Error('product', 'REQUIRED');

      if (typeof productId === 'undefined') return new Error('productId', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/staking/purchase', { product, productId, amount, renewable }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Redeem Staking `product`. Locked staking and Locked DeFI staking belong to early redemption, redeeming in advance will result in loss of interest that you have earned.
     * - Weight(IP): `1`
     * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
     * @param {ENUM} product  - "STAKING" for Locked Staking, "F_DEFI" for flexible DeFi Staking, "L_DEFI" for locked DeFi Staking
     * @param {string} productId
     * @param {string | undefined} positionId  - "`1234`", Mandatory if product is "STAKING" or "L_DEFI"
     * @param {number | undefined} amount  - Mandatory if product is "F_DEFI"
     * @returns { Promise < {"success":true} > }
    */
    redeem_staking_product: async (product, productId, positionId, amount) => {
      // Expects (HMAC SHA256)
      if (typeof product === 'undefined') return new Error('product', 'REQUIRED');

      if (typeof productId === 'undefined') return new Error('productId', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/staking/redeem', { product, productId, positionId, amount }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * @param {ENUM} product  - "STAKING" for Locked Staking, "F_DEFI" for flexible DeFi Staking, "L_DEFI" for locked DeFi Staking
     * @param {string | undefined} productId
     * @param {string | undefined} asset
     * @param {number | undefined} current  - Currently querying the page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10`, Max:`100`
     * @returns { Promise < [{"positionId":"123123","projectId":"Axs*90","asset":"AXS","amount":"122.09202928","purchaseTime":"1646182276000","duration":"60","accrualDays":"4","rewardAsset":"AXS","APY":"0.2032","rewardAmt":"5.17181528","extraRewardAsset":"BNB","extraRewardAPY":"0.0203","estExtraRewardAmt":"5.17181528","nextInterestPay":"1.29295383","nextInterestPayDate":"1646697600000","payInterestPeriod":"1","redeemAmountEarly":"2802.24068892","interestEndDate":"1651449600000","deliverDate":"1651536000000","redeemPeriod":"1","redeemingAmt":"232.2323","partialAmtDeliverDate":"1651536000000","canRedeemEarly":true,"renewable":true,"type":"AUTO","status":"HOLDING"}] > }
    */
    get_staking_product_position: async (product, productId, asset, current, size) => {
      // Expects (HMAC SHA256)
      if (typeof product === 'undefined') return new Error('product', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/staking/position', { product, productId, asset, current, size }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - The time between startTime and endTime cannot be longer than `3` months.
     * - If startTime and endTime are both not sent, then the last `30` days' data will be returned.
     * @param {ENUM} product  - "STAKING" for Locked Staking, "F_DEFI" for flexible DeFi Staking, "L_DEFI" for locked DeFi Staking
     * @param {ENUM} txnType  - "SUBSCRIPTION", "REDEMPTION", "INTEREST"
     * @param {string | undefined} asset
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Currently querying the page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10`, Max:`100`
     * @returns { Promise < [{"positionId":"123123","time":1575018510000,"asset":"BNB","project":"BSC","amount":"21312.23223","lockPeriod":"30","deliverDate":"1575018510000","type":"AUTO","status":"success"}] > }
    */
    get_staking_history: async (product, txnType, asset, startTime, endTime, current, size) => {
      // Expects (HMAC SHA256)
      if (typeof product === 'undefined') return new Error('product', 'REQUIRED');

      if (typeof txnType === 'undefined') return new Error('txnType', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/staking/stakingRecord', { product, txnType, asset, startTime, endTime, current, size }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Set auto staking on Locked Staking or Locked DeFi Staking
     * - Weight(IP): `1`
     * @param {ENUM} product  - "STAKING" for Locked Staking, "L_DEFI" for locked DeFi Staking
     * @param {string} positionId
     * @param {string} renewable  - true or false
     * @returns { Promise < {"success":true} > }
    */
    set_auto_staking: async (product, positionId, renewable) => {
      // Expects (HMAC SHA256)
      if (typeof product === 'undefined') return new Error('product', 'REQUIRED');

      if (typeof positionId === 'undefined') return new Error('positionId', 'REQUIRED');

      if (typeof renewable === 'undefined') return new Error('renewable', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/staking/setAutoStaking', { product, positionId, renewable }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - The endpoints below allow to interact with Binance Pool.
     * - For more information on this, please refer to the Binance Pool page
     * @param {ENUM} product  - "STAKING" for Locked Staking, "F_DEFI" for flexible DeFi Staking, "L_DEFI" for locked DeFi Staking
     * @param {string} productId
     * @returns { Promise < [{"leftPersonalQuota":"1000"}] > }
    */
    get_personal_left_quota_of_staking_product: async (product, productId) => {
      // Expects SHA256)
      if (typeof product === 'undefined') return new Error('product', 'REQUIRED');

      if (typeof productId === 'undefined') return new Error('productId', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/staking/personalLeftQuota(HMAC', { product, productId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Mining` API requests.
   */
  Mining = {

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `1`
     * - None
     * @returns { Promise < {"code":0,"msg":"","data":[{"algoName":"sha256","algoId":1,"poolIndex":0,"unit":"h/s"}]} > }
    */
    acquiring_algorithm_market_data: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/pub/algoList', {}, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `1`
     * - None
     * @returns { Promise < {"code":0,"msg":"","data":[{"coinName":"BTC","coinId":1,"poolIndex":0,"algoId":1,"algoName":"sha256"}]} > }
    */
    acquiring_coinname_market_data: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/pub/coinList', {}, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":[{"workerName":"bhdc1.16A10404B","type":"H_hashrate","hashrateDatas":[{"time":1587902400000,"hashrate":"0","reject":0},{"time":1587906000000,"hashrate":"0","reject":0}]},{"workerName":"bhdc1.16A10404B","type":"D_hashrate","hashrateDatas":[{"time":1587902400000,"hashrate":"0","reject":0},{"time":1587906000000,"hashrate":"0","reject":0}]}]} > }
    */
    request_for_detail_miner_list: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/worker/detail', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":{"workerDatas":[{"workerId":"1420554439452400131","workerName":"2X73","status":3,"hashRate":0,"dayHashRate":0,"rejectRate":0,"lastShareTime":1587712919000},{"workerId":"7893926126382807951","workerName":"AZDC1.1A10101","status":2,"hashRate":29711247541680,"dayHashRate":12697781298013.66,"rejectRate":0,"lastShareTime":1587969727000}],"totalNum":18530,"pageSize":20}} > }
    */
    request_for_miner_list: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/worker/list', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":{"accountProfits":[{"time":1586188800000,"type":31,"hashTransfer":null,"transferAmount":null,"dayHashRate":129129903378244,"profitAmount":8.6083060304,"coinName":"BTC","status":2},{"time":1607529600000,"coinName":"BTC","type":0,"dayHashRate":9942053925926,"profitAmount":0.85426469,"hashTransfer":200000000000,"transferAmount":0.02180958,"status":2},{"time":1607443200000,"coinName":"BTC","type":31,"dayHashRate":200000000000,"profitAmount":0.02905916,"hashTransfer":null,"transferAmount":null,"status":2}],"totalNum":3,"pageSize":20}} > }
    */
    earnings_list: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/payment/list', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":{"otherProfits":[{"time":1607443200000,"coinName":"BTC","type":4,"profitAmount":0.0011859,"status":2}],"totalNum":3,"pageSize":20}} > }
    */
    extra_bonus_list: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/payment/other', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":{"configDetails":[{"configId":168,"poolUsername":"123","toPoolUsername":"user1","algoName":"Ethash","hashRate":5000000,"startDay":20201210,"endDay":20210405,"status":1},{"configId":166,"poolUsername":"pop","toPoolUsername":"111111","algoName":"Ethash","hashRate":3320000,"startDay":20201226,"endDay":20201227,"status":0}],"totalNum":21,"pageSize":200}} > }
    */
    hashrate_resale_list: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/hash-transfer/config/details/list', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":{"profitTransferDetails":[{"poolUsername":"test4001","toPoolUsername":"pop","algoName":"sha256","hashRate":200000000000,"day":20201213,"amount":0.2256872,"coinName":"BTC"},{"poolUsername":"test4001","toPoolUsername":"pop","algoName":"sha256","hashRate":200000000000,"day":20201213,"amount":0.2256872,"coinName":"BTC"}],"totalNum":8,"pageSize":200}} > }
    */
    hashrate_resale_detail: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/hash-transfer/profit/details', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":171} > }
    */
    hashrate_resale_request: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/mining/hash-transfer/config', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":true} > }
    */
    cancel_hashrate_resale_configuration: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/mining/hash-transfer/config/cancel', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":{"fifteenMinHashRate":"457835490067496409.00000000","dayHashRate":"214289268068874127.65000000","validNum":0,"invalidNum":17562,"profitToday":{"BTC":"0.00314332","BSV":"56.17055953","BCH":"106.61586001"},"profitYesterday":{"BTC":"0.00314332","BSV":"56.17055953","BCH":"106.61586001"},"userName":"test","unit":"h/s","algo":"sha256"}} > }
    */
    statistic_list: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/statistics/user/status', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":[{"type":"H_hashrate","userName":"test","list":[{"time":1585267200000,"hashrate":"0.00000000","reject":"0.00000000"},{"time":1585353600000,"hashrate":"0.00000000","reject":"0.00000000"}]},{"type":"D_hashrate","userName":"test","list":[{"time":1587906000000,"hashrate":"0.00000000","reject":"0.00000000"},{"time":1587909600000,"hashrate":"0.00000000","reject":"0.00000000"}]}]} > }
    */
    account_list: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/statistics/user/list', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `5`
     * @returns { Promise < {"code":0,"msg":"","data":{"accountProfits":[{"time":1607443200000,"coinName":"BTC","type":2,"puid":59985472,"subName":"vdvaghani","amount":0.09186957}],"totalNum":3,"pageSize":20}} > }
    */
    mining_account_earning: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/mining/payment/uid', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Futures` (spot-api specific) API requests.
   */
  Futures = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Execute transfer between spot account and futures account.
     * - Weight(IP): `1`
     * - You need to open Enable Futures permission for the API Key which requests this endpoint.
     * @param {string} asset  - The asset being transferred, e.g., USDT
     * @param {number} amount  - The amount to be transferred
     * @param {number} type  - `1`: transfer from spot account to USDT-Ⓜ futures account. `2`: transfer from USDT-Ⓜ futures account to spot account. `3`: transfer from spot account to COIN-Ⓜ futures account. `4`: transfer from COIN-Ⓜ futures account to spot account.
     * @returns { Promise < {"tranId":100000001} > }
    */
    new_future_account_transfer: async (asset, amount, type) => {
      // Expects (HMAC SHA256)
      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/futures/transfer', { asset, amount, type }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * - Support query within the last `6` months only
     * @param {number} startTime
     * @param {string | undefined} asset
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
     * @param {number | undefined} size  - Default:`10` Max:`100`
     * @returns { Promise < {"rows":[{"asset":"USDT","tranId":100000001,"amount":"40.84624400","type":"1","timestamp":1555056425000,"status":"CONFIRMED"}],"total":1} > }
    */
    get_future_account_transaction_history_list: async (startTime, asset, endTime, current, size) => {
      // Expects (HMAC SHA256)
      if (typeof startTime === 'undefined') return new Error('startTime', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/futures/transfer', { startTime, asset, endTime, current, size }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * @param {number | undefined} limit  - default `500`, max `1000`
     * @param {string | undefined} coin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < {"rows":[{"confirmedTime":1582540328433,"coin":"USDT","collateralRate":"0.89991001","leftTotal":"4.5","leftPrincipal":"4.5","deadline":4736102399000,"collateralCoin":"BUSD","collateralAmount":"5.0","orderStatus":"PENDING","borrowId":"438648398970089472"}],"total":1} > }
    */
    cross_collateral_borrow_history: async (limit, coin, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/futures/loan/borrow/history', { limit, coin, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * @param {number | undefined} limit  - default `500`, max `1000`
     * @param {string | undefined} coin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < {"rows":[{"coin":"USDT","amount":"1.68","collateralCoin":"BUSD","repayType":"NORMAL","releasedCollateral":"1.80288889","price":"1.001","repayCollateral":"10010","confirmedTime":1582781327575,"updateTime":1582794387516,"status":"PENDING","repayId":"439659223998894080"}],"total":1} > }
    */
    cross_collateral_repayment_history: async (limit, coin, startTime, endTime) => {
      // Expects HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/futures/loan/repay/history', { limit, coin, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * @returns { Promise < {"totalCrossCollateral":"5.8238577133","totalBorrowed":"5.07000000","totalInterest":"0.0","interestFreeLimit":"100000","asset":"USD","crossCollaterals":[{"loanCoin":"USDT","collateralCoin":"BUSD","locked":"5.82211108","loanAmount":"5.07","currentCollateralRate":"0.87168984","interestFreeLimitUsed":"5.07","principalForInterest":"0.0","interest":"0.0"},{"loanCoin":"BUSD","collateralCoin":"BTC","locked":"0","loanAmount":"0","currentCollateralRate":"0","interestFreeLimitUsed":"0","principalForInterest":"0.0","interest":"0.0"}]} > }
    */
    async cross_collateral_wallet_v2() {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v2/futures/loan/wallet', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * - All data will be returned if `loanCoin` or `collateralCoin` is not sent
     * @param {number | undefined} limit  - default `500`, max `1000`
     * @param {string | undefined} loanCoin
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < {"rows":[{"amount":".17398184","collateralCoin":"BUSD","coin":"USDT","preCollateralRate":"0.87054861","afterCollateralRate":"0.89736451","direction":"REDUCED","status":"COMPLETED","adjustTime":1583978243588}],"total":1} > }
    */
    adjust_cross_collateral_ltv_history: async (limit, loanCoin, collateralCoin, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/futures/loan/adjustCollateral/history', { limit, loanCoin, collateralCoin, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `10`
     * - All data will be returned if `loanCoin` or `collateralCoin` is not sent
     * @param {number | undefined} limit  - default `500`, max `1000`
     * @param {string | undefined} loanCoin
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < {"rows":[{"collateralAmountForLiquidation":"10.12345678","collateralCoin":"BUSD","forceLiquidationStartTime":1583978243588,"coin":"USDT","restCollateralAmountAfterLiquidation":"15.12345678","restLoanAmount":"11.12345678","status":"PENDING"}],"total":1} > }
    */
    cross_collateral_liquidation_history: async (limit, loanCoin, collateralCoin, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/futures/loan/liquidationHistory', { limit, loanCoin, collateralCoin, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Binance Futures Execution Algorithm API solution aims to provide users ability to programmatically leverage Binance in-house algorithmic trading capability to automate order execution strategy, improve execution transparency and give users smart access to the available market liquidity.
     * - FAQ: Volume Participation(VP) Introduction
     * - FAQ: Time-Weighted Average Price(Twap) Introduction
     * @param {number | undefined} limit  - Default:`500` Max:`1000`
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Currently querying page. Start from `1`. Default:`1`
     * @returns { Promise < {"rows":[{"collateralCoin":"BUSD","interestCoin":"USDT","interest":"2.354","interestFreeLimitUsed":"0","principalForInterest":"10000","interestRate":"0.002","time":1582794387516}],"total":1} > }
    */
    cross_collateral_interest_history: async (limit, collateralCoin, startTime, endTime, current) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/futures/loan/interestHistory', { limit, collateralCoin, startTime, endTime, current }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a VP new order. Only support on USDⓈ-M Contracts.
     * - Weight(UID): `3000`
     * - Other Info:
     * - You need to enable `Futures Trading Permission` for the api key which requests this endpoint.
     * - Base URL: https://api.binance.com
     * - Total Algo open orders max allowed: 10 orders.
     * - Leverage of symbols and position mode will be the same as your futures account settings. You can set up through the trading page or fapi.
     * - Receiving `"success": true` does not mean that your order will be executed. Please use the query order endpoints（ `GET sapi/v`1`/algo/futures/openOrders` or `GET sapi/v`1`/algo/futures/historicalOrders` ） to check the order status. For example: Your futures balance is insufficient, or open position with reduce only or position `side` is inconsistent with your own setting. In these cases you will receive `"success": true` , but the order status will be `expired` after we check it.
     * @param {string} symbol  - Trading symbol eg. BTCUSDT
     * @param {ENUM} side  - Trading side ( BUY or SELL )
     * @param {number} quantity  - Quantity of base asset; The notional ( quantity * mark price(base asset) ) must be more than the equivalent of `10`,`000` USDT and less than the equivalent of `1`,`000`,`000` USDT
     * @param {ENUM} urgency  - Represent the relative speed of the current execution; ENUM: LOW, MEDIUM, HIGH
     * @param {ENUM | undefined} positionSide  - Default BOTH for One-way Mode ; LONG or SHORT for Hedge Mode. It must be sent in Hedge Mode.
     * @param {string | undefined} clientAlgoId  - A unique id among Algo orders (length should be `32` characters), If it is not sent, we will give default value
     * @param {BOOLEAN | undefined} reduceOnly  - "true" or "false". Default "false"; Cannot be sent in Hedge Mode; Cannot be sent when you open a position
     * @param {number | undefined} limitPrice  - Limit price of the order; If it is not sent, will place order by market price by default
     * @returns { Promise < {"clientAlgoId":"00358ce6a268403398bd34eaa36dffe7","success":true,"code":0,"msg":"OK"} > }
    */
    volume_participation_vp_new_order_trade: async (symbol, side, quantity, urgency, positionSide, clientAlgoId, reduceOnly, limitPrice) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

      if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

      if (typeof urgency === 'undefined') return new Error('urgency', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/algo/futures/newOrderVp', { symbol, side, quantity, urgency, positionSide, clientAlgoId, reduceOnly, limitPrice }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Send in a Twap new order. Only support on USDⓈ-M Contracts.
     * - Weight(UID): `3000`
     * - Other Info:
     * - You need to enable `Futures Trading Permission` for the api key which requests this endpoint.
     * - Base URL: https://api.binance.com
     * - Total Algo open orders max allowed: 10 orders.
     * - Leverage of symbols and position mode will be the same as your futures account settings. You can set up through the trading page or fapi.
     * - Receiving `"success": true` does not mean that your order will be executed. Please use the query order endpoints（ `GET sapi/v`1`/algo/futures/openOrders` or `GET sapi/v`1`/algo/futures/historicalOrders` ） to check the order status. For example: Your futures balance is insufficient, or open position with reduce only or position `side` is inconsistent with your own setting. In these cases you will receive `"success": true` , but the order status will be `expired` after we check it.
     * - quantity * `60` / duration should be larger than minQty
     * - duration cannot be less than `5` mins or more than `24` hours.
     * - For delivery contracts, TWAP end time should be one hour earlier than the delivery time of the `symbol`.
     * @param {string} symbol  - Trading symbol eg. BTCUSDT
     * @param {ENUM} side  - Trading side ( BUY or SELL )
     * @param {number} quantity  - Quantity of base asset; The notional ( quantity * mark price(base asset) ) must be more than the equivalent of `10`,`000` USDT and less than the equivalent of `1`,`000`,`000` USDT
     * @param {number} duration  - Duration for TWAP orders in seconds. [`300`, `86400`];Less than `5`min => defaults to `5` min; Greater than `24`h => defaults to `24`h
     * @param {ENUM | undefined} positionSide  - Default BOTH for One-way Mode ; LONG or SHORT for Hedge Mode. It must be sent in Hedge Mode.
     * @param {string | undefined} clientAlgoId  - A unique id among Algo orders (length should be `32` characters), If it is not sent, we will give default value
     * @param {BOOLEAN | undefined} reduceOnly  - "true" or "false". Default "false"; Cannot be sent in Hedge Mode; Cannot be sent when you open a position
     * @param {number | undefined} limitPrice  - Limit price of the order; If it is not sent, will place order by market price by default
     * @returns { Promise < {"clientAlgoId":"65ce1630101a480b85915d7e11fd5078","success":true,"code":0,"msg":"OK"} > }
    */
    time_weighted_average_price_twap_new_order_trade: async (symbol, side, quantity, duration, positionSide, clientAlgoId, reduceOnly, limitPrice) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

      if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

      if (typeof duration === 'undefined') return new Error('duration', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/algo/futures/newOrderTwap', { symbol, side, quantity, duration, positionSide, clientAlgoId, reduceOnly, limitPrice }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Cancel an active order.
     * - Weight(IP): `1`
     * - You need to enable `Futures Trading Permission` for the api key which requests this endpoint.
     * - Base URL: https://api.binance.com
     * @param {number} algoId  - eg. `14511`
     * @returns { Promise < {"algoId":14511,"success":true,"code":0,"msg":"OK"} > }
    */
    cancel_algo_order_trade: async (algoId) => {
      // Expects (HMAC SHA256)
      if (typeof algoId === 'undefined') return new Error('algoId', 'REQUIRED');

      const resp = await this.request('DELETE', 'sapi', '/sapi/v1/algo/futures/order', { algoId }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - You need to enable `Futures Trading Permission` for the api key which requests this endpoint.
     * - Base URL: https://api.binance.com
     * @returns { Promise < {"total":1,"orders":[{"algoId":14517,"symbol":"ETHUSDT","side":"SELL","positionSide":"SHORT","totalQty":"5.000","executedQty":"0.000","executedAmt":"0.00000000","avgPrice":"0.00","clientAlgoId":"d7096549481642f8a0bb69e9e2e31f2e","bookTime":1649756817004,"endTime":0,"algoStatus":"WORKING","algoType":"VP","urgency":"LOW"}]} > }
    */
    query_current_algo_open_orders: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/algo/futures/openOrders', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - You need to enable `Futures Trading Permission` for the api key which requests this endpoint.
     * - Base URL: https://api.binance.com
     * @param {string | undefined} symbol  - Trading symbol eg. BTCUSDT
     * @param {ENUM | undefined} side  - BUY or SELL
     * @param {number | undefined} startTime  - in milliseconds eg.`1641522717552`
     * @param {number | undefined} endTime  - in milliseconds eg.`1641522526562`
     * @param {number | undefined} page  - Default is `1`
     * @param {number | undefined} pageSize  - MIN `1`, MAX `100`; Default `100`
     * @returns { Promise < {"total":1,"orders":[{"algoId":14518,"symbol":"BNBUSDT","side":"BUY","positionSide":"BOTH","totalQty":"100.00","executedQty":"0.00","executedAmt":"0.00000000","avgPrice":"0.000","clientAlgoId":"acacab56b3c44bef9f6a8f8ebd2a8408","bookTime":1649757019503,"endTime":1649757088101,"algoStatus":"CANCELLED","algoType":"VP","urgency":"LOW"}]} > }
    */
    query_historical_algo_orders: async (symbol, side, startTime, endTime, page, pageSize) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/algo/futures/historicalOrders', { symbol, side, startTime, endTime, page, pageSize }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get respective sub orders for a specified `algoId`
     * - Weight(IP): `1`
     * - Binance Spot Execution Algorithm API solution aims to provide users ability to programmatically leverage Binance in-house algorithmic trading capability to automate order execution strategy, improve execution transparency and give users smart access to the available market liquidity. During the introductory period, there will be no additional fees for TWAP orders. Standard trading fees apply. Order size exceeds to maximum API supported size (`100`,`000` USDT). Please contact liquidity@binance.com for larger sizes.
     * - You need to enable `Futures Trading Permission` for the api key which requests this endpoint.
     * - Base URL: https://api.binance.com
     * @param {number} algoId
     * @param {number | undefined} page  - Default is `1`
     * @param {number | undefined} pageSize  - MIN `1`, MAX `100`; Default `100`
     * @returns { Promise < {"total":1,"executedQty":"1.000","executedAmt":"3229.44000000","subOrders":[{"algoId":13723,"orderId":8389765519993909000,"orderStatus":"FILLED","executedQty":"1.000","executedAmt":"3229.44000000","feeAmt":"-1.61471999","feeAsset":"USDT","bookTime":1649319001964,"avgPrice":"3229.44","side":"SELL","symbol":"ETHUSDT","subId":1,"timeInForce":"IMMEDIATE_OR_CANCEL","origQty":"1.000"}]} > }
    */
    query_sub_orders: async (algoId, page, pageSize) => {
      // Expects (HMAC SHA256)
      if (typeof algoId === 'undefined') return new Error('algoId', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/algo/futures/subOrders', { algoId, page, pageSize }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Spot Algo` API requests.
   */
  Spot_Algo = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Place a new spot TWAP order with Algo service.
     * - Weight(UID): `3000`
     * - Other Info:
     * - Total Algo open orders max allowed: 10 orders.
     * @param {string} symbol  - Trading symbol eg. BTCUSDT
     * @param {ENUM} side  - Trading side ( BUY or SELL )
     * @param {number} quantity  - Quantity of base asset; The notional (quantity * last price(base asset)) must be more than the equivalent of `1`,`000` USDT and less than the equivalent of `100`,`000` USDT
     * @param {number} duration  - Duration for TWAP orders in seconds. [`300`, `86400`]
     * @param {string | undefined} clientAlgoId  - A unique id among Algo orders (length should be `32` characters), If it is not sent, we will give default value
     * @param {number | undefined} limitPrice  - Limit price of the order; If it is not sent, will place order by market price by default
     * @returns { Promise < {"clientAlgoId":"65ce1630101a480b85915d7e11fd5078","success":true,"code":0,"msg":"OK"} > }
    */
    time_weighted_average_price_twap_new_order_trade_2: async (symbol, side, quantity, duration, clientAlgoId, limitPrice) => {
      // Expects (HMAC SHA256)
      if (typeof symbol === 'undefined') return new Error('symbol', 'REQUIRED');

      if (typeof side === 'undefined') return new Error('side', 'REQUIRED');

      if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

      if (typeof duration === 'undefined') return new Error('duration', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/algo/spot/newOrderTwap', { symbol, side, quantity, duration, clientAlgoId, limitPrice }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Cancel an open TWAP order
     * - Weight(IP): `1`
     * @param {number} algoId  - eg. `14511`
     * @returns { Promise < {"algoId":14511,"success":true,"code":0,"msg":"OK"} > }
    */
    cancel_algo_order_trade_2: async (algoId) => {
      // Expects (HMAC SHA256)
      if (typeof algoId === 'undefined') return new Error('algoId', 'REQUIRED');

      const resp = await this.request('DELETE', 'sapi', '/sapi/v1/algo/spot/order', { algoId }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Get all open SPOT TWAP orders
     * @returns { Promise < {"total":1,"orders":[{"algoId":14517,"symbol":"ETHUSDT","side":"SELL","totalQty":"5.000","executedQty":"0.000","executedAmt":"0.00000000","avgPrice":"0.00","clientAlgoId":"d7096549481642f8a0bb69e9e2e31f2e","bookTime":1649756817004,"endTime":0,"algoStatus":"WORKING","algoType":"TWAP","urgency":"LOW"}]} > }
    */
    query_current_algo_open_orders_2: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/algo/spot/openOrders', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Get all historical SPOT TWAP orders
     * @param {string | undefined} symbol  - Trading symbol eg. BTCUSDT
     * @param {ENUM | undefined} side  - BUY or SELL
     * @param {number | undefined} startTime  - in milliseconds eg.`1641522717552`
     * @param {number | undefined} endTime  - in milliseconds eg.`1641522526562`
     * @param {number | undefined} page  - Default is `1`
     * @param {number | undefined} pageSize  - MIN `1`, MAX `100`; Default `100`
     * @returns { Promise < {"total":1,"orders":[{"algoId":14518,"symbol":"BNBUSDT","side":"BUY","totalQty":"100.00","executedQty":"0.00","executedAmt":"0.00000000","avgPrice":"0.000","clientAlgoId":"acacab56b3c44bef9f6a8f8ebd2a8408","bookTime":1649757019503,"endTime":1649757088101,"algoStatus":"CANCELLED","algoType":"VP","urgency":"LOW"}]} > }
    */
    query_historical_algo_orders_2: async (symbol, side, startTime, endTime, page, pageSize) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/algo/spot/historicalOrders', { symbol, side, startTime, endTime, page, pageSize }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get respective sub orders for a specified `algoId`
     * - Weight(IP): `1`
     * - The Binance Classic Portfolio Margin Program is a cross-asset margin program supporting consolidated margin balance across trading products with over `200`+ effective crypto collaterals. It is designed for professional traders, market makers, and institutional users looking to actively trade & hedge cross-asset and optimize risk-management in a consolidated setup.
     * - FAQ: Classic Portfolio Margin Program
     * - Only Classic Portfolio Margin Account is accessible to these endpoints. To enroll, kindly refer to: How to Enroll into the Binance Portfolio Margin Program
     * @param {number} algoId
     * @param {number | undefined} page  - Default is `1`
     * @param {number | undefined} pageSize  - MIN `1`, MAX `100`; Default `100`
     * @returns { Promise < {"total":1,"executedQty":"1.000","executedAmt":"3229.44000000","subOrders":[{"algoId":13723,"orderId":8389765519993909000,"orderStatus":"FILLED","executedQty":"1.000","executedAmt":"3229.44000000","feeAmt":"-1.61471999","feeAsset":"USDT","bookTime":1649319001964,"avgPrice":"3229.44","side":"SELL","symbol":"ETHUSDT","subId":1,"timeInForce":"IMMEDIATE_OR_CANCEL","origQty":"1.000"}]} > }
    */
    query_sub_orders_2: async (algoId, page, pageSize) => {
      // Expects (HMAC SHA256)
      if (typeof algoId === 'undefined') return new Error('algoId', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/algo/spot/subOrders', { algoId, page, pageSize }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Classic Portfolio` API requests.
   */
  Classic_Portfolio = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * @returns { Promise < {"uniMMR":"5167.92171923","accountEquity":"122607.35137903","actualEquity":"142607.35137903","accountMaintMargin":"23.72469206","accountStatus":"NORMAL"} > }
    */
    get_classic_portfolio_margin_account_info: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/portfolio/account', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Classic Portfolio Margin Collateral Rate
     * - Weight(IP): `50`
     * - Parameters: None
     * @returns { Promise <  > }
    */
    classic_portfolio_margin_collateral_rate_market_data: async () => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/portfolio/collateralRate', {}, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Query Classic Portfolio Margin Bankruptcy Loan Amount
     * - Weight(UID): `500`
     * - If there’s no classic portfolio margin bankruptcy loan, the amount would be `0`
     * @returns { Promise <  > }
    */
    query_classic_portfolio_margin_bankruptcy_loan_amount: async () => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/portfolio/pmLoan', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * - Repay Classic Portfolio Margin Bankruptcy Loan
     * - Weight(UID): `3000`
     * @returns { Promise < {"tranId":58203331886213500} > }
    */
    classic_portfolio_margin_bankruptcy_loan_repay: async () => {

      const resp = await this.request('POST', 'sapi', '/sapi/v1/portfolio/repay', {}, 'NONE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Query user's porfolio margin interest history.
     * - Weight(IP): `50`
     * @param {string | undefined} asset
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} size  - Default:`10` Max:`100`
     * @returns { Promise < [{"asset":"USDT","interest":"24.4440","interestAccruedTime":1670227200000,"interestRate":"0.0001164","principal":"210000","type":"um_negative_balance"}] > }
    */
    query_classic_portfolio_margin_interest_history: async (asset, startTime, endTime, size) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/portfolio/interest-history', { asset, startTime, endTime, size }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES `APIKEY`
     * - Query Portfolio Margin Asset Index Price
     * - `1` if send `asset` or `50` if not send `asset`
     * @param {string | undefined} asset
     * @returns { Promise < [{"asset":"BTC","assetIndexPrice":"28251.9136906","time":1683518338121}] > }
    */
    query_portfolio_margin_asset_index_price_market_data: async (asset) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/portfolio/asset-index-price', { asset }, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Transfers all assets from Futures Account to Margin account
     * - `100`
     * - The BNB would not be collected from UM-PM account to the Portfolio Margin account.
     * @returns { Promise < {"msg":"success"} > }
    */
    fund_auto_collection_trade: async () => {

      const resp = await this.request('POST', 'sapi', '/sapi/v1/portfolio/auto-collection', {}, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - BNB transfer can be between Margin Account and USDM Account
     * - `100`
     * @param {number} amount
     * @param {string} transferSide  - "TO_UM","FROM_UM"
     * @returns { Promise < {"tranId":100000001} > }
    */
    bnb_transfer_trade: async (amount, transferSide) => {

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      if (typeof transferSide === 'undefined') return new Error('transferSide', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/portfolio/bnb-transfer', { amount, transferSide }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `BLVT` API requests.
   */
  BLVT = {

    /**
     * REQUIRES `APIKEY`
     * - Weight(IP): `1`
     * @param {string | undefined} tokenName  - BTCDOWN, BTCUP
     * @returns { Promise < [{"tokenName":"BTCDOWN","description":"3X Short Bitcoin Token","underlying":"BTC","tokenIssued":"717953.95","basket":"-821.474 BTCUSDT Futures","currentBaskets":[{"symbol":"BTCUSDT","amount":"-1183.984","notionalValue":"-22871089.96704"}],"nav":"4.79","realLeverage":"-2.316","fundingRate":"0.001020","dailyManagementFee":"0.0001","purchaseFeePct":"0.0010","dailyPurchaseLimit":"100000.00","redeemFeePct":"0.0010","dailyRedeemLimit":"1000000.00","timestamp":1583127900000},{"tokenName":"LINKUP","description":"3X LONG ChainLink Token","underlying":"LINK","tokenIssued":"163846.99","basket":"417288.870 LINKUSDT Futures","currentBaskets":[{"symbol":"LINKUSDT","amount":"1640883.83","notionalValue":"22596611.22293"}],"nav":"9.60","realLeverage":"2.597","fundingRate":"-0.000917","dailyManagementFee":"0.0001","purchaseFeePct":"0.0010","dailyPurchaseLimit":"100000.00","redeemFeePct":"0.0010","dailyRedeemLimit":"1000000.00","timestamp":1583127900000}] > }
    */
    get_blvt_info_market_data: async (tokenName) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/blvt/tokenInfo', { tokenName }, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - You need to open `Enable Spot&Margin Trading` permission for the API Key which requests this endpoint.
     * @param {string} tokenName  - BTCDOWN, BTCUP
     * @param {number} cost  - spot balance
     * @returns { Promise < {"id":123,"status":"S","tokenName":"LINKUP","amount":"0.95590905","cost":"9.99999995","timestamp":1600249972899} > }
    */
    subscribe_blvt: async (tokenName, cost) => {
      // Expects (HMAC SHA256)
      if (typeof tokenName === 'undefined') return new Error('tokenName', 'REQUIRED');

      if (typeof cost === 'undefined') return new Error('cost', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/blvt/subscribe', { tokenName, cost }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Only the data of the latest `90` days is available
     * @param {number | undefined} limit  - default `1000`, max `1000`
     * @param {string | undefined} tokenName  - BTCDOWN, BTCUP
     * @param {number | undefined} id
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < [{"id":1,"tokenName":"LINKUP","amount":"0.54216292","nav":"18.42621386","fee":"0.00999000","totalCharge":"9.99999991","timestamp":1599127217916}] > }
    */
    query_subscription_record: async (limit, tokenName, id, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/blvt/subscribe/record', { limit, tokenName, id, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - You need to open `Enable Spot&Margin Trading` permission for the API Key which requests this endpoint.
     * @param {string} tokenName  - BTCDOWN, BTCUP
     * @param {number} amount
     * @returns { Promise < {"id":123,"status":"S","tokenName":"LINKUP","redeemAmount":"0.95590905","amount":"10.05022099","timestamp":1600250279614} > }
    */
    redeem_blvt: async (tokenName, amount) => {
      // Expects (HMAC SHA256)
      if (typeof tokenName === 'undefined') return new Error('tokenName', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/blvt/redeem', { tokenName, amount }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - Only the data of the latest `90` days is available
     * @param {number | undefined} limit  - default `1000`, max `1000`
     * @param {string | undefined} tokenName  - BTCDOWN, BTCUP
     * @param {number | undefined} id
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < [{"id":1,"tokenName":"LINKUP","amount":"0.54216292","nav":"18.36345064","fee":"0.00995598","netProceed":"9.94602604","timestamp":1599128003050}] > }
    */
    query_redemption_record: async (limit, tokenName, id, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/blvt/redeem/record', { limit, tokenName, id, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * @param {string | undefined} tokenName  - BTCDOWN, BTCUP
     * @returns { Promise < [{"tokenName":"LINKUP","userDailyTotalPurchaseLimit":"1000","userDailyTotalRedeemLimit":"1000"},{"tokenName":"LINKDOWN","userDailyTotalPurchaseLimit":"1000","userDailyTotalRedeemLimit":"50000"}] > }
    */
    get_blvt_user_limit_info: async (tokenName) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/blvt/userLimit', { tokenName }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `BSWap` API requests.
   */
  BSwap = {

    /**
     * REQUIRES `APIKEY`
     * - Get metadata about all swap pools.
     * - Weight(IP): `1`
     * - None
     * @returns { Promise < [{"poolId":2,"poolName":"BUSD/USDT","assets":["BUSD","USDT"]},{"poolId":3,"poolName":"BUSD/DAI","assets":["BUSD","DAI"]},{"poolId":4,"poolName":"USDT/DAI","assets":["USDT","DAI"]}] > }
    */
    list_all_swap_pools_market_data: async () => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/pools', {}, 'MARKET_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get liquidity information and user share of a pool.
     * - `1` for one pool
     * - `10` when the `poolId` parameter is omitted
     * - Rate Limit: `3`/`1`s per account and per pool
     * @param {number | undefined} poolId
     * @returns { Promise < [{"poolId":2,"poolNmae":"BUSD/USDT","updateTime":1565769342148,"liquidity":{"BUSD":100000315.79,"USDT":99999245.54},"share":{"shareAmount":12415,"sharePercentage":0.00006207,"asset":{"BUSD":6207.02,"USDT":6206.95}}}] > }
    */
    get_liquidity_information_of_a_pool: async (poolId) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/liquidity', { poolId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Add liquidity to a pool.
     * - Weight(UID): `1000` (Additional: `1` request every two seconds per pool and per account)
     * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
     * @param {number} poolId
     * @param {string} asset
     * @param {number} quantity
     * @param {string | undefined} type  - "SINGLE" to add a single token; "COMBINATION" to add dual tokens. Default "SINGLE"
     * @returns { Promise < {"operationId":12341} > }
    */
    add_liquidity_trade: async (poolId, asset, quantity, type) => {
      // Expects (HMAC SHA256)
      if (typeof poolId === 'undefined') return new Error('poolId', 'REQUIRED');

      if (typeof asset === 'undefined') return new Error('asset', 'REQUIRED');

      if (typeof quantity === 'undefined') return new Error('quantity', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/bswap/liquidityAdd', { poolId, asset, quantity, type }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Remove liquidity from a pool, type include `SINGLE` and `COMBINATION` , `asset` is mandatory for single `asset` removal
     * - Weight(UID): `1000` (Additional: `1` request every two seconds per pool and per account)
     * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
     * @param {number} poolId
     * @param {string} type  - SINGLE for single asset removal, COMBINATION for combination of all coins removal
     * @param {number} shareAmount
     * @param {LIST | undefined} asset  - Mandatory for single asset removal
     * @returns { Promise < {"operationId":12341} > }
    */
    remove_liquidity_trade: async (poolId, type, shareAmount, asset) => {
      // Expects (HMAC SHA256)
      if (typeof poolId === 'undefined') return new Error('poolId', 'REQUIRED');

      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      if (typeof shareAmount === 'undefined') return new Error('shareAmount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/bswap/liquidityRemove', { poolId, type, shareAmount, asset }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get liquidity `operation` (add/remove) records.
     * - Weight(UID): `3000`
     * @param {number | undefined} limit  - default `3`, max `100`
     * @param {number | undefined} operationId
     * @param {number | undefined} poolId
     * @param {ENUM | undefined} operation  - ADD or REMOVE
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < [{"operationId":12341,"poolId":2,"poolName":"BUSD/USDT","operation":"ADD","status":1,"updateTime":1565769342148,"shareAmount":"10.1"}] > }
    */
    get_liquidity_operation_record: async (limit, operationId, poolId, operation, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/liquidityOps', { limit, operationId, poolId, operation, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Request a quote for swap quote asset (selling asset) for base asset (buying asset), essentially price/exchange rates.
     * - quoteQty is quantity of quote asset (to sell).
     * - Please be noted the quote is for reference only, the actual price will change as the liquidity changes, it's recommended to swap immediate after request a quote for slippage prevention.
     * - Weight(UID): `150`
     * - Rate Limit: `3`/`1`s per account and per pool
     * @param {string} quoteAsset
     * @param {string} baseAsset
     * @param {number} quoteQty
     * @returns { Promise < {"quoteAsset":"USDT","baseAsset":"BUSD","quoteQty":300000,"baseQty":299975,"price":1.00008334,"slippage":0.00007245,"fee":120} > }
    */
    request_quote: async (quoteAsset, baseAsset, quoteQty) => {
      // Expects (HMAC SHA256)
      if (typeof quoteAsset === 'undefined') return new Error('quoteAsset', 'REQUIRED');

      if (typeof baseAsset === 'undefined') return new Error('baseAsset', 'REQUIRED');

      if (typeof quoteQty === 'undefined') return new Error('quoteQty', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/quote', { quoteAsset, baseAsset, quoteQty }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Swap quoteAsset for baseAsset .
     * - Weight(UID): `1000` (Additional: `1` request every two seconds per pool)
     * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
     * @param {string} quoteAsset
     * @param {string} baseAsset
     * @param {number} quoteQty
     * @returns { Promise < {"swapId":2314} > }
    */
    swap_trade: async (quoteAsset, baseAsset, quoteQty) => {
      // Expects (HMAC SHA256)
      if (typeof quoteAsset === 'undefined') return new Error('quoteAsset', 'REQUIRED');

      if (typeof baseAsset === 'undefined') return new Error('baseAsset', 'REQUIRED');

      if (typeof quoteQty === 'undefined') return new Error('quoteQty', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/bswap/swap', { quoteAsset, baseAsset, quoteQty }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get swap history.
     * - Weight(UID): `3000`
     * @param {number | undefined} limit  - default `3`, max `100`
     * @param {number | undefined} swapId
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} status  - `0`: pending for swap, `1`: success, `2`: failed
     * @param {string | undefined} quoteAsset
     * @param {string | undefined} baseAsset
     * @returns { Promise < [{"swapId":2314,"swapTime":1565770342148,"status":0,"quoteAsset":"USDT","baseAsset":"BUSD","quoteQty":300000,"baseQty":299975,"price":1.00008334,"fee":120}] > }
    */
    get_swap_history: async (limit, swapId, startTime, endTime, status, quoteAsset, baseAsset) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/swap', { limit, swapId, startTime, endTime, status, quoteAsset, baseAsset }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `150`
     * @param {number | undefined} poolId
     * @returns { Promise < [{"poolId":2,"poolNmae":"BUSD/USDT","updateTime":1565769342148,"liquidity":{"constantA":2000,"minRedeemShare":0.1,"slippageTolerance":0.2},"assetConfigure":{"BUSD":{"minAdd":10,"maxAdd":20,"minSwap":10,"maxSwap":30},"USDT":{"minAdd":10,"maxAdd":20,"minSwap":10,"maxSwap":30}}}] > }
    */
    get_pool_configure: async (poolId) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/poolConfigure', { poolId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Calculate expected share amount for adding liquidity in single or dual token.
     * - Weight(IP): `150`
     * @param {number} poolId
     * @param {string} type  - "SINGLE" for adding a single token;"COMBINATION" for adding dual tokens
     * @param {string} quoteAsset
     * @param {number} quoteQty
     * @returns { Promise <  > }
    */
    add_liquidity_preview: async (poolId, type, quoteAsset, quoteQty) => {
      // Expects (HMAC SHA256)
      if (typeof poolId === 'undefined') return new Error('poolId', 'REQUIRED');

      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      if (typeof quoteAsset === 'undefined') return new Error('quoteAsset', 'REQUIRED');

      if (typeof quoteQty === 'undefined') return new Error('quoteQty', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/addLiquidityPreview', { poolId, type, quoteAsset, quoteQty }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Calculate the expected asset amount of single token redemption or dual token redemption.
     * - Weight(IP): `150`
     * @param {number} poolId
     * @param {string} type  - Type is "SINGLE", remove and obtain a single token;Type is "COMBINATION", remove and obtain dual token.
     * @param {string} quoteAsset
     * @param {number} shareAmount
     * @returns { Promise < {"quoteAsset":"USDT","baseAsset":"BUSD","quoteAmt":300000,"baseAmt":299975,"price":1.00008334,"slippage":0.00007245,"fee":120} > }
    */
    remove_liquidity_preview: async (poolId, type, quoteAsset, shareAmount) => {
      // Expects (HMAC SHA256)
      if (typeof poolId === 'undefined') return new Error('poolId', 'REQUIRED');

      if (typeof type === 'undefined') return new Error('type', 'REQUIRED');

      if (typeof quoteAsset === 'undefined') return new Error('quoteAsset', 'REQUIRED');

      if (typeof shareAmount === 'undefined') return new Error('shareAmount', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/removeLiquidityPreview', { poolId, type, quoteAsset, shareAmount }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get unclaimed rewards record.
     * - Weight(UID): `1000`
     * @param {number | undefined} type  - `0`: Swap rewards,`1`:Liquidity rewards, default to `0`
     * @returns { Promise < {"totalUnclaimedRewards":{"BUSD":100000315.79,"BNB":1e-8,"USDT":2e-8},"details":{"BNB/USDT":{"BUSD":100000315.79,"USDT":2e-8},"BNB/BTC":{"BNB":1e-8}}} > }
    */
    get_unclaimed_rewards_record: async (type) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/unclaimedRewards', { type }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Claim swap rewards or liquidity rewards
     * - Weight(UID): `1000`
     * - You need to open `Enable Spot & Margin Trading` permission for the API Key which requests this endpoint.
     * @param {number | undefined} type  - `0`: Swap rewards,`1`:Liquidity rewards, default to `0`
     * @returns { Promise < {"success":true} > }
    */
    claim_rewards_trade: async (type) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('POST', 'sapi', '/sapi/v1/bswap/claimRewards', { type }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get history of claimed rewards.
     * - Weight(UID): `1000`
     * @param {number | undefined} limit  - Default `3`, max `100`
     * @param {number | undefined} poolId
     * @param {string | undefined} assetRewards
     * @param {number | undefined} type  - `0`: Swap rewards,`1`:Liquidity rewards, default to `0`
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < [{"poolId":52,"poolName":"BNB/USDT","assetRewards":"BNB","claimTime":1565769342148,"claimAmount":2.3e-7,"status":1}] > }
    */
    get_claimed_history: async (limit, poolId, assetRewards, type, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/bswap/claimedHistory', { limit, poolId, assetRewards, type, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Fiat` API requests.
   */
  Fiat = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `90000`
     * - If `beginTime` and `endTime` are not sent, the recent `30`-day data will be returned.
     * @param {string} transactionType  - `0`-deposit,`1`-withdraw
     * @param {number | undefined} beginTime
     * @param {number | undefined} endTime
     * @param {number | undefined} page  - default `1`
     * @param {number | undefined} rows  - default `100`, max `500`
     * @returns { Promise < {"code":"000000","message":"success","data":[{"orderNo":"7d76d611-0568-4f43-afb6-24cac7767365","fiatCurrency":"BRL","indicatedAmount":"10.00","amount":"10.00","totalFee":"0.00","method":"BankAccount","status":"Expired","createTime":1626144956000,"updateTime":1626400907000}],"total":1,"success":true} > }
    */
    get_fiat_deposit_withdraw_history: async (transactionType, beginTime, endTime, page, rows) => {
      // Expects (HMAC SHA256)
      if (typeof transactionType === 'undefined') return new Error('transactionType', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/fiat/orders', { transactionType, beginTime, endTime, page, rows }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - If `beginTime` and `endTime` are not sent, the recent `30`-day data will be returned.
     * - paymentMethod: Only when requesting payments history for buy (`transactionType`=`0`), response contains paymentMethod representing the way of purchase. Now we have: Cash Balance Credit Card Online Banking Bank Transfer
     * - Cash Balance
     * - Credit Card
     * - Online Banking
     * - Bank Transfer
     * @param {string} transactionType  - `0`-buy,`1`-sell
     * @param {number | undefined} beginTime
     * @param {number | undefined} endTime
     * @param {number | undefined} page  - default `1`
     * @param {number | undefined} rows  - default `100`, max `500`
     * @returns { Promise < {"code":"000000","message":"success","data":[{"orderNo":"353fca443f06466db0c4dc89f94f027a","sourceAmount":"20.0","fiatCurrency":"EUR","obtainAmount":"4.462","cryptoCurrency":"LUNA","totalFee":"0.2","price":"4.437472","status":"Failed","paymentMethod":"Credit Card","createTime":1624529919000,"updateTime":1624529919000}],"total":1,"success":true} > }
    */
    get_fiat_payments_history: async (transactionType, beginTime, endTime, page, rows) => {
      // Expects (HMAC SHA256)
      if (typeof transactionType === 'undefined') return new Error('transactionType', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/fiat/payments', { transactionType, beginTime, endTime, page, rows }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }


  /**
   * Contains all `C2C` API requests
   */
  C2C = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `1`
     * - If `startTimestamp` and `endTimestamp` are not sent, the recent `30`-day data will be returned.
     * - The max interval between `startTimestamp` and `endTimestamp` is `30` days.
     * - Only the last `6` months of data can be retrieved. To view the complete P`2`P order history, you can download it from https://c`2`c.binance.com/en/fiatOrder
     * @param {string} tradeType  - BUY, SELL
     * @param {number | undefined} startTimestamp
     * @param {number | undefined} endTimestamp
     * @param {number | undefined} page  - default `1`
     * @param {number | undefined} rows  - default `100`, max `100`
     * @returns { Promise < {"code":"000000","message":"success","data":[{"orderNumber":"20219644646554779648","advNo":"11218246497340923904","tradeType":"SELL","asset":"BUSD","fiat":"CNY","fiatSymbol":"￥","amount":"5000.00000000","totalPrice":"33400.00000000","unitPrice":"6.68","orderStatus":"COMPLETED","createTime":1619361369000,"commission":"0","counterPartNickName":"ab***","advertisementRole":"TAKER"}],"total":1,"success":true} > }
    */
    get_c2c_trade_history: async (tradeType, startTimestamp, endTimestamp, page, rows) => {
      // Expects (HMAC SHA256)
      if (typeof tradeType === 'undefined') return new Error('tradeType', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/c2c/orderMatch/listUserOrderHistory', { tradeType, startTimestamp, endTimestamp, page, rows }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `VIP Loans` API requests
   */
  VIP_Loans = {
    // TODO missing 6/29/2023 changeLog updates

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - VIP loan is available for VIP users only.
     * - Weight(IP): `400`
     * @param {number | undefined} limit  - Default: `10`, Max: `100`
     * @param {number | undefined} orderId
     * @param {number | undefined} collateralAccountId
     * @param {string | undefined} loanCoin
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} current  - Currently querying page. Start from `1`, Default:`1`, Max: `1000`.
     * @returns { Promise <  > }
    */
    get_vip_loan_ongoing_orders: async (limit, orderId, collateralAccountId, loanCoin, collateralCoin, current) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/vip/ongoing/orders', { limit, orderId, collateralAccountId, loanCoin, collateralCoin, current }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - VIP loan is available for VIP users only.
     * - Weight(UID): `6000`
     * @param {number} orderId
     * @param {number} amount
     * @returns { Promise < {"loanCoin":"BUSD","repayAmount":"200.5","remainingPrincipal":"100.5","remainingInterest":"0","collateralCoin":"BNB,BTC,ETH","currentLTV":"0.25","repayStatus":"Repaid"} > }
    */
    vip_loan_repay_trade: async (orderId, amount) => {

      if (typeof orderId === 'undefined') return new Error('orderId', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/loan/vip/repay', { orderId, amount }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - VIP loan is available for VIP users only.
     * - Weight(IP): `400`
     * - If `startTime` and `endTime` are not sent, the recent `90`-day data will be returned
     * - The max interval between `startTime` and end Time is `180` days.
     * @param {number | undefined} limit  - Default: `10`, Max: `100`
     * @param {number | undefined} orderId
     * @param {string | undefined} loanCoin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Currently querying page. Start from `1`, Default:`1`, Max: `1000`
     * @returns { Promise < {"rows":[{"loanCoin":"BUSD","repayAmount":"10000","collateralCoin":"BNB,BTC,ETH","repayStatus":"Repaid","repayTime":"1575018510000","orderId":"756783308056935434"}],"total":1} > }
    */
    get_vip_loan_repayment_history: async (limit, orderId, loanCoin, startTime, endTime, current) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/vip/repay/history', { limit, orderId, loanCoin, startTime, endTime, current }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - VIP loan is available for VIP users only.
     * - Weight(IP): `6000`
     * - If the login account is loan account, frozen value of all collateral accounts under the loan account can be queried.
     * - If the login account is collateral account, only the frozen amount of current collateral account can be queried.
     * @param {number | undefined} orderId
     * @param {number | undefined} collateralAccountId
     * @returns { Promise <  > }
    */
    check_locked_value_of_vip_collateral_account: async (orderId, collateralAccountId) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/vip/collateral/account', { orderId, collateralAccountId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }
  }

  /**
   * Contains all `Crypto Loans` API requests.
   */
  Crypto_Loans = {
    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `6000`
     * - If `startTime` and `endTime` are not sent, the recent `7`-day data will be returned.
     * - The max interval between `startTime` and `endTime` is `30` days.
     * @param {number | undefined} limit  - default `20`, max `100`
     * @param {string | undefined} asset
     * @param {string | undefined} type  - All types will be returned by default. Enum: borrowIn , collateralSpent , repayAmount , collateralReturn (Collateral return after repayment), addCollateral , removeCollateral , collateralReturnAfterLiquidation
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise < [{"asset":"BUSD","type":"borrowIn","amount":"100","timestamp":1633771139847,"tranId":"80423589583"},{"asset":"BUSD","type":"borrowIn","amount":"100","timestamp":1634638371496,"tranId":"81685123491"}] > }
    */
    get_crypto_loans_income_history: async (limit, asset, type, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/income', { limit, asset, type, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `6000`
     * @param {string} loanCoin
     * @param {string} collateralCoin
     * @param {number} loanTerm  - `7`/`30` days
     * @param {number | undefined} loanAmount  - Mandatory when collateralAmount is empty
     * @param {number | undefined} collateralAmount  - Mandatory when loanAmount is empty
     * @returns { Promise < {"loanCoin":"BUSD","loanAmount":"100.5","collateralCoin":"BNB","collateralAmount":"50.5","hourlyInterestRate":"0.001234","orderId":"100000001"} > }
    */
    borrow_crypto_loan_borrow_trade: async (loanCoin, collateralCoin, loanTerm, loanAmount, collateralAmount) => {

      if (typeof loanCoin === 'undefined') return new Error('loanCoin', 'REQUIRED');

      if (typeof collateralCoin === 'undefined') return new Error('collateralCoin', 'REQUIRED');

      if (typeof loanTerm === 'undefined') return new Error('loanTerm', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/loan/borrow', { loanCoin, collateralCoin, loanTerm, loanAmount, collateralAmount }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `400`
     * - If `startTime` and `endTime` are not sent, the recent `90`-day data will be returned.
     * - The max interval between `startTime` and `endTime` is `180` days.
     * @param {number | undefined} limit  - Default: `10`; max: `100`.
     * @param {number | undefined} orderId  - orderId in POST /sapi/v`1`/loan/borrow
     * @param {string | undefined} loanCoin
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Current querying page. Start from `1`; default: `1`; max: `1000`.
     * @returns { Promise <  > }
    */
    borrow_get_loan_borrow_history: async (limit, orderId, loanCoin, collateralCoin, startTime, endTime, current) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/borrow/history', { limit, orderId, loanCoin, collateralCoin, startTime, endTime, current }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `300`
     * @param {number | undefined} limit  - Default: `10`; max: `100`
     * @param {number | undefined} orderId  - orderId in POST /sapi/v`1`/loan/borrow
     * @param {string | undefined} loanCoin
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} current  - Current querying page. Start from `1`; default: `1`; max: `1000`
     * @returns { Promise <  > }
    */
    borrow_get_loan_ongoing_orders: async (limit, orderId, loanCoin, collateralCoin, current) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/ongoing/orders', { limit, orderId, loanCoin, collateralCoin, current }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `6000`
     * @param {number} orderId
     * @param {number} amount
     * @param {number | undefined} type  - Default: `1`. `1` for "repay with borrowed coin"; `2` for "repay with collateral".
     * @param {BOOLEAN | undefined} collateralReturn  - Default: TRUE. TRUE: Return extra collateral to spot account; FALSE: Keep extra collateral in the order.
     * @returns { Promise <  > }
    */
    repay_crypto_loan_repay_trade: async (orderId, amount, type, collateralReturn) => {

      if (typeof orderId === 'undefined') return new Error('orderId', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/loan/repay', { orderId, amount, type, collateralReturn }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `400`
     * - If `startTime` and `endTime` are not sent, the recent `90`-day data will be returned.
     * - The max interval between `startTime` and `endTime` is `180` days.
     * @param {number | undefined} limit  - Default: `10`; max: `100`
     * @param {number | undefined} orderId
     * @param {string | undefined} loanCoin
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Current querying page. Start from `1`; default: `1`; max: `1000`
     * @returns { Promise <  > }
    */
    repay_get_loan_repayment_history: async (limit, orderId, loanCoin, collateralCoin, startTime, endTime, current) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/repay/history', { limit, orderId, loanCoin, collateralCoin, startTime, endTime, current }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `6000`
     * @param {number} orderId
     * @param {number} amount
     * @param {ENUM} direction  - "ADDITIONAL", "REDUCED"
     * @returns { Promise < {"loanCoin":"BUSD","collateralCoin":"BNB","direction":"ADDITIONAL","amount":"5.235","currentLTV":"0.52"} > }
    */
    adjust_ltv_crypto_loan_adjust_ltv_trade: async (orderId, amount, direction) => {

      if (typeof orderId === 'undefined') return new Error('orderId', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      if (typeof direction === 'undefined') return new Error('direction', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/loan/adjust/ltv', { orderId, amount, direction }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(IP): `400`
     * - If `startTime` and `endTime` are not sent, the recent `90`-day data will be returned.
     * - The max interval between `startTime` and `endTime` is `180` days.
     * @param {number | undefined} limit  - Default: `10`; max: `100`
     * @param {number | undefined} orderId
     * @param {string | undefined} loanCoin
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} current  - Current querying page. Start from `1`; default: `1`; max: `1000`
     * @returns { Promise < {"rows":[{"loanCoin":"BUSD","collateralCoin":"BNB","direction":"ADDITIONAL","amount":"5.235","preLTV":"0.78","afterLTV":"0.56","adjustTime":1575018510000,"orderId":756783308056935400}],"total":1} > }
    */
    adjust_ltv_get_loan_ltv_adjustment_history: async (limit, orderId, loanCoin, collateralCoin, startTime, endTime, current) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/ltv/adjustment/history', { limit, orderId, loanCoin, collateralCoin, startTime, endTime, current }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get interest rate and borrow limit of loanable assets. The borrow limit is shown in USD value.
     * - Weight(IP): `400`
     * @param {string | undefined} loanCoin
     * @param {number | undefined} vipLevel  - Default: user's vip level. Send "-`1`" to check specified configuration
     * @returns { Promise <  > }
    */
    get_loanable_assets_data: async (loanCoin, vipLevel) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/loanable/data', { loanCoin, vipLevel }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get LTV information and collateral limit of collateral assets. The collateral limit is shown in USD value.
     * - Weight(IP): `400`
     * @param {string | undefined} collateralCoin
     * @param {number | undefined} vipLevel  - Default: user's vip level. Send "-`1`" to check specified configuration
     * @returns { Promise <  > }
    */
    get_collateral_assets_data: async (collateralCoin, vipLevel) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/collateral/data', { collateralCoin, vipLevel }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Get the the rate of collateral coin / loan coin when using collateral repay, the rate will be valid within `8` second.
     * - Weight(IP): `6000`
     * @param {string} loanCoin
     * @param {string} collateralCoin
     * @param {number} repayAmount  - repay amount of loanCoin
     * @returns { Promise < {"loanlCoin":"BUSD","collateralCoin":"BNB","repayAmount":"1000","rate":"300.36781234"} > }
    */
    check_collateral_repay_rate: async (loanCoin, collateralCoin, repayAmount) => {

      if (typeof loanCoin === 'undefined') return new Error('loanCoin', 'REQUIRED');

      if (typeof collateralCoin === 'undefined') return new Error('collateralCoin', 'REQUIRED');

      if (typeof repayAmount === 'undefined') return new Error('repayAmount', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/loan/repay/collateral/rate', { loanCoin, collateralCoin, repayAmount }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Customize margin call for ongoing orders only.
     * - Weight(UID): `6000`
     * @param {number} marginCall
     * @param {number | undefined} orderId  - Mandatory when collateralCoin is empty. Send either orderId or collateralCoin, if both parameters are sent, take orderId only.
     * @param {string | undefined} collateralCoin  - Mandatory when orderID is empty. Send either orderId or collateralCoin, if both parameters are sent, take orderId only.
     * @returns { Promise <  > }
    */
    crypto_loan_customize_margin_call_trade: async (marginCall, orderId, collateralCoin) => {

      if (typeof marginCall === 'undefined') return new Error('marginCall', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/loan/customize/margin_call', { marginCall, orderId, collateralCoin }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Pay` API requests.
   */
  Pay = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `3000`
     * - Support for querying orders within the last `18` months.
     * - For payerInfo and receiverInfo,there are different return values in different orderTypes.
     * - Would you like to have access to Binance Convert API? Please complete the questionnaire to submit your request for access. The Convert API service is created for users who wish to automate their trading on Binance Convert. You will receive a confirmation email after we have approved your application.
     * - If `startTime` and `endTime` are not sent, the recent `90` days' data will be returned.
     * - The max interval between `startTime` and `endTime` is `90` days.
     * - Support for querying orders within the last `18` months.
     * - For payerInfo and receiverInfo,there are different return values in different orderTypes. Sender's perspective when orderType is C`2`C payerInfo : binanceId receiverInfo : name, binanceId/accountId/email/countryCode/phoneNumber/mobileCode (based on user input) Receiver's perspective when orderType is C`2`C payerInfo : name, accountId receiverInfo : binanceId Sender's perspective when orderType is CRYPTO_BOX payerInfo : binanceId receiverInfo : name(the value is always "Crypto Box") Receiver's perspective when orderType is CRYPTO_BOX payerInfo : name, accountId receiverInfo : binanceId Sender's perspective when orderType is PAY payerInfo : binanceId receiverInfo : name Receiver's perspective when orderType is PAY payerInfo : name, accountId receiverInfo : binanceId, name Sender's perspective when orderType is PAY_REFUND payerInfo : binanceId, name receiverInfo : name, accountId Receiver's perspective when orderType is PAY_REFUND payerInfo : name receiverInfo : binanceId Sender's perspective when orderType is PAYOUT payerInfo : binanceId, name receiverInfo : name, accountId Receiver's perspective when orderType is PAYOUT payerInfo : name receiverInfo : binanceId Receiver's perspective when orderType is CRYPTO_BOX_RF payerInfo : name(the value is always "Crypto Box") receiverInfo : binanceId Sender's perspective when orderType is REMITTANCE payerInfo : binanceId receiverInfo : name, institutionName, cardNumber, digitalWalletId
     * - Sender's perspective when orderType is C`2`C payerInfo : binanceId receiverInfo : name, binanceId/accountId/email/countryCode/phoneNumber/mobileCode (based on user input)
     * - payerInfo : binanceId
     * - receiverInfo : name, binanceId/accountId/email/countryCode/phoneNumber/mobileCode (based on user input)
     * - Receiver's perspective when orderType is C`2`C payerInfo : name, accountId receiverInfo : binanceId
     * - payerInfo : name, accountId
     * - receiverInfo : binanceId
     * - Sender's perspective when orderType is CRYPTO_BOX payerInfo : binanceId receiverInfo : name(the value is always "Crypto Box")
     * - payerInfo : binanceId
     * - receiverInfo : name(the value is always "Crypto Box")
     * - Receiver's perspective when orderType is CRYPTO_BOX payerInfo : name, accountId receiverInfo : binanceId
     * - payerInfo : name, accountId
     * - receiverInfo : binanceId
     * - Sender's perspective when orderType is PAY payerInfo : binanceId receiverInfo : name
     * - payerInfo : binanceId
     * - receiverInfo : name
     * - Receiver's perspective when orderType is PAY payerInfo : name, accountId receiverInfo : binanceId, name
     * - payerInfo : name, accountId
     * - receiverInfo : binanceId, name
     * - Sender's perspective when orderType is PAY_REFUND payerInfo : binanceId, name receiverInfo : name, accountId
     * - payerInfo : binanceId, name
     * - receiverInfo : name, accountId
     * - Receiver's perspective when orderType is PAY_REFUND payerInfo : name receiverInfo : binanceId
     * - payerInfo : name
     * - receiverInfo : binanceId
     * - Sender's perspective when orderType is PAYOUT payerInfo : binanceId, name receiverInfo : name, accountId
     * - payerInfo : binanceId, name
     * - receiverInfo : name, accountId
     * - Receiver's perspective when orderType is PAYOUT payerInfo : name receiverInfo : binanceId
     * - payerInfo : name
     * - receiverInfo : binanceId
     * - Receiver's perspective when orderType is CRYPTO_BOX_RF payerInfo : name(the value is always "Crypto Box") receiverInfo : binanceId
     * - payerInfo : name(the value is always "Crypto Box")
     * - receiverInfo : binanceId
     * - Sender's perspective when orderType is REMITTANCE payerInfo : binanceId receiverInfo : name, institutionName, cardNumber, digitalWalletId
     * - payerInfo : binanceId
     * - receiverInfo : name, institutionName, cardNumber, digitalWalletId
     * @param {number | undefined} limit  - default `100`, max `100`
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @returns { Promise <  > }
    */
    get_pay_trade_history: async (limit, startTime, endTime) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/pay/transactions', { limit, startTime, endTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Convert` API requests.
   */
  Convert = {

    /**
     * - Query for all convertible token pairs and the tokens’ respective upper/lower limits
     * - Weight(IP): `3000`
     * - User needs to supply either or both of the input parameter
     * - If not defined for both `fromAsset` and `toAsset`, only partial token pairs will be returned
     * @param {string} fromAsset  - User spends coin
     * @param {string} toAsset  - User receives coin
     * @returns { Promise < [{"fromAsset":"BTC","toAsset":"USDT","fromAssetMinAmount":"0.0004","fromAssetMaxAmount":"50","toAssetMinAmount":"20","toAssetMaxAmount":"2500000"}] > }
    */
    list_all_convert_pairs: async (fromAsset, toAsset) => {

      if (typeof fromAsset === 'undefined') return new Error('fromAsset', 'REQUIRED');

      if (typeof toAsset === 'undefined') return new Error('toAsset', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/convert/exchangeInfo', { fromAsset, toAsset }, 'NONE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Query for supported asset’s precision information
     * - Weight(IP): `100`
     * @returns { Promise < [{"asset":"BTC","fraction":8},{"asset":"SHIB","fraction":2}] > }
    */
    query_order_quantity_precision_per_asset: async () => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/convert/assetInfo', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Request a quote for the requested token pairs
     * - Weight(UID): `200`
     * - Either `fromAmount` or `toAmount` should be sent
     * - `quoteId` will be returned only if you have enough funds to convert
     * @param {string} fromAsset
     * @param {string} toAsset
     * @param {number} fromAmount  - When specified, it is the amount you will be debited after the conversion
     * @param {number} toAmount  - When specified, it is the amount you will be credited after the conversion
     * @param {ENUM | undefined} walletType  - SPOT or FUNDING. Default is SPOT
     * @param {ENUM | undefined} validTime  - `10`s, `30`s, `1`m, `2`m, default `10`s
     * @returns { Promise < {"quoteId":"12415572564","ratio":"38163.7","inverseRatio":"0.0000262","validTimestamp":1623319461670,"toAmount":"3816.37","fromAmount":"0.1"} > }
    */
    send_quote_request: async (fromAsset, toAsset, fromAmount, toAmount, walletType, validTime) => {

      if (typeof fromAsset === 'undefined') return new Error('fromAsset', 'REQUIRED');

      if (typeof toAsset === 'undefined') return new Error('toAsset', 'REQUIRED');

      if (typeof fromAmount === 'undefined') return new Error('fromAmount', 'REQUIRED');

      if (typeof toAmount === 'undefined') return new Error('toAmount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/convert/getQuote', { fromAsset, toAsset, fromAmount, toAmount, walletType, validTime }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Accept the offered quote by quote ID.
     * - Weight(UID): `500`
     * @param {string} quoteId
     * @returns { Promise < {"orderId":"933256278426274426","createTime":1623381330472,"orderStatus":"PROCESS"} > }
    */
    accept_quote_trade: async (quoteId) => {

      if (typeof quoteId === 'undefined') return new Error('quoteId', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/convert/acceptQuote', { quoteId }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Query order status by order ID.
     * - Weight(UID): `100`
     * @param {string | undefined} orderId  - Either orderId or quoteId is required
     * @param {string | undefined} quoteId  - Either orderId or quoteId is required
     * @returns { Promise < {"orderId":933256278426274400,"orderStatus":"SUCCESS","fromAsset":"BTC","fromAmount":"0.00054414","toAsset":"USDT","toAmount":"20","ratio":"36755","inverseRatio":"0.00002721","createTime":1623381330472} > }
    */
    order_status: async (orderId, quoteId) => {

      const resp = await this.request('GET', 'sapi', '/sapi/v1/convert/orderStatus', { orderId, quoteId }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `3000`
     * - The max interval between `startTime` and `endTime` is `30` days.
     * @param {number} startTime
     * @param {number} endTime
     * @param {number | undefined} limit  - Default `100`, Max `1000`
     * @returns { Promise < {"list":[{"quoteId":"f3b91c525b2644c7bc1e1cd31b6e1aa6","orderId":940708407462087200,"orderStatus":"SUCCESS","fromAsset":"USDT","fromAmount":"20","toAsset":"BNB","toAmount":"0.06154036","ratio":"0.00307702","inverseRatio":"324.99","createTime":1624248872184}],"startTime":1623824139000,"endTime":1626416139000,"limit":100,"moreData":false} > }
    */
    get_convert_trade_history: async (startTime, endTime, limit) => {
      // Expects (HMAC SHA256)
      if (typeof startTime === 'undefined') return new Error('startTime', 'REQUIRED');

      if (typeof endTime === 'undefined') return new Error('endTime', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/convert/tradeFlow', { startTime, endTime, limit }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Rebate` API requests
   */
  Rebate = {
    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `12000`
     * - The max interval between `startTime` and `endTime` is `30` days.
     * - If `startTime` and `endTime` are not sent, the recent `7` days' data will be returned.
     * - The earliest `startTime` is supported on June `10`, `2020`
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} page  - Default `1`
     * @returns { Promise < {"status":"OK","type":"GENERAL","code":"000000000","data":{"page":1,"totalRecords":2,"totalPageNum":1,"data":[{"asset":"USDT","type":1,"amount":"0.0001126","updateTime":1637651320000},{"asset":"ETH","type":1,"amount":"0.00000056","updateTime":1637928379000}]}} > }
    */
    get_spot_rebate_history_records: async (startTime, endTime, page) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/rebate/taxQuery', { startTime, endTime, page }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `NFT` API requests
   */
  NFT = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `3000`
     * - The max interval between `startTime` and `endTime` is `90` days.
     * - If `startTime` and `endTime` are not sent, the recent `7` days' data will be returned.
     * @param {number} orderType  - `0`: purchase order, `1`: sell order, `2`: royalty income, `3`: primary market order, `4`: mint fee
     * @param {number | undefined} limit  - Default `50`, Max `50`
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} page  - Default `1`
     * @returns { Promise < {"total":2,"list":[{"orderNo":"1_470502070600699904","tokens":[{"network":"BSC","tokenId":"216000000496","contractAddress":"MYSTERY_BOX0000087"}],"tradeTime":1626941236000,"tradeAmount":"19.60000000","tradeCurrency":"BNB"},{"orderNo":"1_488306442479116288","tokens":[{"network":"BSC","tokenId":"132900000007","contractAddress":"0xAf12111a592e408DAbC740849fcd5e68629D9fb6"}],"tradeTime":1631186130000,"tradeAmount":"192.00000000","tradeCurrency":"BNB"}]} > }
    */
    get_nft_transaction_history: async (orderType, limit, startTime, endTime, page) => {
      // Expects (HMAC SHA256)
      if (typeof orderType === 'undefined') return new Error('orderType', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/nft/history/transactions', { orderType, limit, startTime, endTime, page }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `3000`
     * - The max interval between `startTime` and `endTime` is `90` days.
     * - If `startTime` and `endTime` are not sent, the recent `7` days' data will be returned.
     * @param {number | undefined} limit  - Default `50`, Max `50`
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} page  - Default `1`
     * @returns { Promise < {"total":2,"list":[{"network":"ETH","txID":null,"contractAdrress":"0xe507c961ee127d4439977a61af39c34eafee0dc6","tokenId":"10014","timestamp":1629986047000},{"network":"BSC","txID":null,"contractAdrress":"0x058451b463bab04f52c0799d55c4094f507acfa9","tokenId":"10016","timestamp":1630083581000}]} > }
    */
    get_nft_deposit_history: async (limit, startTime, endTime, page) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/nft/history/deposit', { limit, startTime, endTime, page }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `3000`
     * - The max interval between `startTime` and `endTime` is `90` days.
     * - If `startTime` and `endTime` are not sent, the recent `7` days' data will be returned.
     * @param {number | undefined} limit  - Default `50`, Max `50`
     * @param {number | undefined} startTime
     * @param {number | undefined} endTime
     * @param {number | undefined} page  - Default `1`
     * @returns { Promise < {"total":178,"list":[{"network":"ETH","txID":"0x2be5eed31d787fdb4880bc631c8e76bdfb6150e137f5cf1732e0416ea206f57f","contractAdrress":"0xe507c961ee127d4439977a61af39c34eafee0dc6","tokenId":"1000001247","timestamp":1633674433000,"fee":0.1,"feeAsset":"ETH"},{"network":"ETH","txID":"0x3b3aea5c0a4faccd6f306641e6deb9713ab229ac233be3be227f580311e4362a","contractAdrress":"0xe507c961ee127d4439977a61af39c34eafee0dc6","tokenId":"40000030","timestamp":1633677022000,"fee":0.1,"feeAsset":"ETH"}]} > }
    */
    get_nft_withdraw_history: async (limit, startTime, endTime, page) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/nft/history/withdraw', { limit, startTime, endTime, page }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - Weight(UID): `3000`
     * - Binance Gift Card allows simple crypto transfer and exchange through secured and prepaid codes. Binance Gift Card API solution is to facilitate instant creation, redemption and value-checking for Binance Gift Card. Binance Gift Card product feature consists of two parts: “Gift Card Number” and “Binance Gift Card Redemption Code”. The Gift Card Number can be circulated in public, and it is used to verify the validity of the Binance Gift Card; Binance Gift Card Redemption Code should be kept confidential, because as long as someone knows the redemption code, that person can redeem it anytime.
     * @param {number | undefined} limit  - Default `50`, Max `50`
     * @param {number | undefined} page  - Default `1`
     * @returns { Promise < {"total":347,"list":[{"network":"BSC","contractAddress":"REGULAR11234567891779","tokenId":"100900000017"},{"network":"BSC","contractAddress":"SSMDQ8W59","tokenId":"200500000011"},{"network":"BSC","contractAddress":"SSMDQ8W59","tokenId":"200500000019"}]} > }
    */
    get_nft_asset: async (limit, page) => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/nft/user/getAsset', { limit, page }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }

  /**
   * Contains all `Binance Gift Card` related API requests
   */
  Binance_Gift_Card = {

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - This API is for creating a Binance Gift Card.
     * - To get started with, please make sure:
     * - Weight(IP): `1`
     * - You have a Binance account
     * - You have passed kyc
     * - You have a sufﬁcient balance in your Binance funding wallet
     * - You need `Enable Withdrawals` for the API Key which requests this endpoint.
     * - Daily creation volume: `2` BTC / `24`H / account
     * - Daily creation quantity: `200` Gift Cards / `24`H / account
     * @param {string} token  - The token type contained in the Binance Gift Card
     * @param {number} amount  - The amount of the token contained in the Binance Gift Card
     * @returns { Promise < {"code":"000000","message":"success","data":{"referenceNo":"0033002327977405","code":"AOGANK3NB4GIT3C6"},"success":true} > }
    */
    create_a_single_token_gift_card: async (token, amount) => {
      // Expects (HMAC SHA256)
      if (typeof token === 'undefined') return new Error('token', 'REQUIRED');

      if (typeof amount === 'undefined') return new Error('amount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/giftcard/createCode', { token, amount }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - On top of the dual-token gift card, the `discount` option allows you to create Binance Gift Cards at a `discount` within the designated `discount` limit. Discounted Binance Gift Cards are only available to selected partners. To apply, please reach out to the GIft Card team via giftcard@binance.com.
     * - To get started with, please make sure:
     * - Weight(IP): `1`
     * - This API is for creating a dual-token ( stablecoin-denominated) Binance Gift Card. You may create a gift card using USDT, BUSD or any supported fiat currency as `baseToken`, that is redeemable to another designated token (`faceToken`). For example, you can create a fixed-value BTC gift card and pay with `100` USDT. This gift card can keep the value fixed at `100` USDT before redemption, and will be redeemable to BTC equivalent to `100` USDT upon redemption.
     * - Once successfully created, the amount of `baseToken` (e.g. USDT) in the fixed-value gift card would be deducted from your funding wallet.
     * - On top of the dual-token gift card, the `discount` option allows you to create Binance Gift Cards at a `discount` within the designated `discount` limit. Discounted Binance Gift Cards are only available to selected partners. To apply, please reach out to the GIft Card team via giftcard@binance.com.
     * - To get started with, please make sure: You have a Binance account You have passed kyc You have a sufﬁcient balance in your Binance funding wallet You need Enable Withdrawals for the API Key which requests this endpoint.
     * - You have a Binance account
     * - You have passed kyc
     * - You have a sufﬁcient balance in your Binance funding wallet
     * - You need Enable Withdrawals for the API Key which requests this endpoint.
     * - Daily creation volume: `2` BTC / `24`H / account
     * - Daily creation quantity: `200` Gift Cards / `24`H / account
     * @param {string} baseToken  - The token you want to pay, example: BUSD
     * @param {string} faceToken  - The token you want to buy, example: BNB. If faceToken = baseToken, it's the same as createCode endpoint.
     * @param {number} baseTokenAmount  - The base token asset quantity, example : `1`.`002`
     * @param {number | undefined} discount  - Stablecoin-denominated card discount percentage, Example: `1` for `1`% discount. Scale should be less than `6`.
     * @returns { Promise < {"code":"000000","message":"success","data":{"referenceNo":"0033002327977405","code":"AOGANK3NB4GIT3C6"},"success":true} > }
    */
    create_a_dual_token_gift_card_fixed_value_discount_feature_trade: async (baseToken, faceToken, baseTokenAmount, discount) => {
      // Expects (HMAC SHA256)
      if (typeof baseToken === 'undefined') return new Error('baseToken', 'REQUIRED');

      if (typeof faceToken === 'undefined') return new Error('faceToken', 'REQUIRED');

      if (typeof baseTokenAmount === 'undefined') return new Error('baseTokenAmount', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/giftcard/buyCode', { baseToken, faceToken, baseTokenAmount, discount }, 'TRADE');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - This API is for redeeming a Binance Gift Card
     * - Once redeemed, the coins will be deposited in your funding wallet.
     * - Weight(IP): `1`
     * - Parameter `code` can be sent in two formats:
     * - Sending `code` in Encrypted format provides more security than sending it as a plaintext. To send card `code` in encrypted format the following steps must be followed:
     * - Parameter `code` can be sent in two formats: Plaintext Encrypted
     * - Plaintext
     * - Encrypted
     * - Sending `code` in Encrypted format provides more security than sending it as a plaintext. To send card `code` in encrypted format the following steps must be followed: Fetch RSA public key from api stated below. Use the below algorithm to encrypt the card `code` using the RSA public key fetched above: `RSA/ECB/OAEPWithSHA-`256`AndMGF`1`Padding`
     * - Fetch RSA public key from api stated below.
     * - Use the below algorithm to encrypt the card `code` using the RSA public key fetched above: `RSA/ECB/OAEPWithSHA-`256`AndMGF`1`Padding`
     * @param {string} code  - Redemption code of Binance Gift Card to be redeemed, supports both Plaintext & Encrypted code.
     * @param {string | undefined} externalUid  - Each external unique ID represents a unique user on the partner platform. The function helps you to identify the redemption behavior of different users, such as redemption frequency and amount. It also helps risk and limit control of a single account, such as daily limit on redemption volume, frequency, and incorrect number of entries. This will also prevent a single user account reach the partner's daily redemption limits. We strongly recommend you to use this feature and transfer us the User ID of your users if you have different users redeeming Binance Gift Cards on your platform. To protect user data privacy, you may choose to transfer the user id in any desired format (max. `400` characters).
     * @returns { Promise < {"code":"000000","message":"success","data":{"referenceNo":"0033002328060227","identityNo":"10317392647411060736","token":"BNB","amount":"0.00000001"},"success":true} > }
    */
    redeem_a_binance_gift_card: async (code, externalUid) => {
      // Expects (HMAC SHA256)
      if (typeof code === 'undefined') return new Error('code', 'REQUIRED');

      const resp = await this.request('POST', 'sapi', '/sapi/v1/giftcard/redeemCode', { code, externalUid }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - This API is for verifying whether the Binance Gift Card is valid or not by entering Gift Card Number.
     * - Weight(IP): `1`
     * @param {string} referenceNo  - Enter the Gift Card Number
     * @returns { Promise < {"code":"000000","message":"success","data":{"valid":true,"token":"BNB","amount":"0.00000001"},"success":true} > }
    */
    verify_binance_gift_card_by_gift_card_number: async (referenceNo) => {
      // Expects (HMAC SHA256)
      if (typeof referenceNo === 'undefined') return new Error('referenceNo', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/giftcard/verify', { referenceNo }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - This API is for fetching the RSA Public Key. This RSA Public key will be used to encrypt the card code.
     * - Weight(IP): `1`
     * @returns { Promise < {"code":"000000","message":"success","data":"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCXBBVKLAc1GQ5FsIFFqOHrPTox5noBONIKr+IAedTR9FkVxq6e65updEbfdhRNkMOeYIO2i0UylrjGC0X8YSoIszmrVHeV0l06Zh1oJuZos1+7N+WLuz9JvlPaawof3GUakTxYWWCa9+8KIbLKsoKMdfS96VT+8iOXO3quMGKUmQIDAQAB","success":true} > }
    */
    fetch_rsa_public_key: async () => {
      // Expects (HMAC SHA256)
      const resp = await this.request('GET', 'sapi', '/sapi/v1/giftcard/cryptography/rsa-public-key', {}, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    },

    /**
     * REQUIRES BOTH `APIKEY` AND `APISECRET`
     * - This API is to help you verify which tokens are available for you to create Stablecoin-Denominated gift cards as mentioned in section `2` and its’ limitation.
     * - Weight(IP): `1`
     * - The error JSON payload:
     * - Errors consist of two parts: an error code and a message. Codes are universal, but messages can vary.
     * @param {string} baseToken  - The token you want to pay, example: BUSD
     * @returns { Promise < {"code":"000000","message":"success","data":[{"coin":"BNB","fromMin":"0.01","fromMax":"1"}],"success":true} > }
    */
    fetch_token_limit: async (baseToken) => {
      // Expects (HMAC SHA256)
      if (typeof baseToken === 'undefined') return new Error('baseToken', 'REQUIRED');

      const resp = await this.request('GET', 'sapi', '/sapi/v1/giftcard/buyCode/token-limit', { baseToken }, 'USER_DATA');
      if (resp.error) return resp;

      return resp;
    }

  }










  // end of Spot API

  /**
   * @param {'GET'|'POST'|'DELETE'|'PUT'} method 
   * @param {'api'|'sapi'} baseURL
   * @param {string} path 
   * @param {Object.<string, any>} params 
   * @param {"NONE"|"USER_STREAM"|"MARKET_DATA"|"TRADE"|"USER_DATA"} type 
   * @param {Function} pre_adapter_cb
   * @returns { any }
   */
  async request(method, baseURL, path, params = {}, type, pre_adapter_cb = undefined) {
    let response;

    if (this.CONSTANTS.open_requestTypes.includes(type)) response = await this.requests.unsigned_request(method, this.baseURL, path, params, pre_adapter_cb);
    else if (this.CONSTANTS.requestTypes_APIKEY_ONLY.includes(type)) response = await this.requests.userData_request(method, this.baseURL, path, params, pre_adapter_cb);
    else if (this.CONSTANTS.requestTypes_SIGNED.includes(type)) response = await this.requests.signed_request(method, this.baseURL, path, params, pre_adapter_cb);
    if (response.isSuccess) return response.successData.data;
    else return {
      error: response.errorData
    }
  }

  // ERRORS

  ERRORS_CODES = {
    CODES: {
      '-1000': {
        code: -1000,
        name: 'UNKNOWN',
        description: [
          'An unknown error occurred while processing the request.',
          'An unknown error occurred while processing the request.[%s]'
        ]
      },
      '-1001': {
        code: -1001,
        name: 'DISCONNECTED',
        description: [
          'Internal error; unable to process your request. Please try again.'
        ]
      },
      '-1002': {
        code: -1002,
        name: 'UNAUTHORIZED',
        description: ['You are not authorized to execute this request.']
      },
      '-1003': {
        code: -1003,
        name: 'TOO_MANY_REQUESTS',
        description: [
          'Too many requests queued.',
          'Too much request weight used; current limit is %s request weight per %s. Please use WebSocket Streams for live updates to avoid polling the API.',
          'Way too much request weight used; IP banned until %s. Please use WebSocket Streams for live updates to avoid bans.'
        ]
      },
      '-1004': {
        code: -1004,
        name: 'SERVER_BUSY',
        description: ['Server is busy, please wait and try again']
      },
      '-1006': {
        code: -1006,
        name: 'UNEXPECTED_RESP',
        description: [
          'An unexpected response was received from the message bus. Execution status unknown.'
        ]
      },
      '-1007': {
        code: -1007,
        name: 'TIMEOUT',
        description: [
          'Timeout waiting for response from backend server. Send status unknown; execution status unknown.'
        ]
      },
      '-1008': {
        code: -1008,
        name: 'SERVER_BUSY',
        description: [
          'Spot server is currently overloaded with other requests. Please try again in a few minutes.'
        ]
      },
      '-1014': {
        code: -1014,
        name: 'UNKNOWN_ORDER_COMPOSITION',
        description: ['Unsupported order combination.']
      },
      '-1015': {
        code: -1015,
        name: 'TOO_MANY_ORDERS',
        description: [
          'Too many new orders.',
          'Too many new orders; current limit is %s orders per %s.'
        ]
      },
      '-1016': {
        code: -1016,
        name: 'SERVICE_SHUTTING_DOWN',
        description: ['This service is no longer available.']
      },
      '-1020': {
        code: -1020,
        name: 'UNSUPPORTED_OPERATION',
        description: ['This operation is not supported.']
      },
      '-1021': {
        code: -1021,
        name: 'INVALID_TIMESTAMP',
        description: [
          'Timestamp for this request is outside of the recvWindow.',
          "Timestamp for this request was 1000ms ahead of the server's time."
        ]
      },
      '-1022': {
        code: -1022,
        name: 'INVALID_SIGNATURE',
        description: ['Signature for this request is not valid.']
      },
      '-1099': {
        code: -1099,
        name: 'Not found, authenticated, or authorized',
        description: ['This replaces error code -1999']
      },
      '-1100': {
        code: -1100,
        name: 'ILLEGAL_CHARS',
        description: [
          'Illegal characters found in a parameter.',
          'Illegal characters found in a parameter. %s',
          'Illegal characters found in parameter %s; legal range is %s.'
        ]
      },
      '-1101': {
        code: -1101,
        name: 'TOO_MANY_PARAMETERS',
        description: [
          'Too many parameters sent for this endpoint.',
          'Too many parameters; expected %s and received %s.',
          'Duplicate values for a parameter detected.'
        ]
      },
      '-1102': {
        code: -1102,
        name: 'MANDATORY_PARAM_EMPTY_OR_MALFORMED',
        description: [
          'A mandatory parameter was not sent, was empty/null, or malformed.',
          'Mandatory parameter %s was not sent, was empty/null, or malformed.',
          'Param %s or %s must be sent, but both were empty/null!'
        ]
      },
      '-1103': {
        code: -1103,
        name: 'UNKNOWN_PARAM',
        description: ['An unknown parameter was sent.']
      },
      '-1104': {
        code: -1104,
        name: 'UNREAD_PARAMETERS',
        description: [
          'Not all sent parameters were read.',
          'Not all sent parameters were read; read %s parameter(s) but was sent %s.'
        ]
      },
      '-1105': {
        code: -1105,
        name: 'PARAM_EMPTY',
        description: ['A parameter was empty.', 'Parameter %s was empty.']
      },
      '-1106': {
        code: -1106,
        name: 'PARAM_NOT_REQUIRED',
        description: [
          'A parameter was sent when not required.',
          'Parameter %s sent when not required.'
        ]
      },
      '-1111': {
        code: -1111,
        name: 'BAD_PRECISION',
        description: ['Precision is over the maximum defined for this asset.']
      },
      '-1112': {
        code: -1112,
        name: 'NO_DEPTH',
        description: ['No orders on book for symbol.']
      },
      '-1114': {
        code: -1114,
        name: 'TIF_NOT_REQUIRED',
        description: ['TimeInForce parameter sent when not required.']
      },
      '-1115': {
        code: -1115,
        name: 'INVALID_TIF',
        description: ['Invalid timeInForce.']
      },
      '-1116': {
        code: -1116,
        name: 'INVALID_ORDER_TYPE',
        description: ['Invalid orderType.']
      },
      '-1117': {
        code: -1117,
        name: 'INVALID_SIDE',
        description: ['Invalid side.']
      },
      '-1118': {
        code: -1118,
        name: 'EMPTY_NEW_CL_ORD_ID',
        description: ['New client order ID was empty.']
      },
      '-1119': {
        code: -1119,
        name: 'EMPTY_ORG_CL_ORD_ID',
        description: ['Original client order ID was empty.']
      },
      '-1120': {
        code: -1120,
        name: 'BAD_INTERVAL',
        description: ['Invalid interval.']
      },
      '-1121': {
        code: -1121,
        name: 'BAD_SYMBOL',
        description: ['Invalid symbol.']
      },
      '-1125': {
        code: -1125,
        name: 'INVALID_LISTEN_KEY',
        description: ['This listenKey does not exist.']
      },
      '-1127': {
        code: -1127,
        name: 'MORE_THAN_XX_HOURS',
        description: [
          'Lookup interval is too big.',
          'More than %s hours between startTime and endTime.'
        ]
      },
      '-1128': {
        code: -1128,
        name: 'OPTIONAL_PARAMS_BAD_COMBO',
        description: ['Combination of optional parameters invalid.']
      },
      '-1130': {
        code: -1130,
        name: 'INVALID_PARAMETER',
        description: [
          'Invalid data sent for a parameter.',
          'Data sent for parameter %s is not valid.'
        ]
      },
      '-1131': {
        code: -1131,
        name: 'BAD_RECV_WINDOW',
        description: ['recvWindow must be less than 60000']
      },
      '-1134': {
        code: -1134,
        name: 'BAD_STRATEGY_TYPE',
        description: ['strategyType was less than 1000000.']
      },
      '-1145': {
        code: -1145,
        name: 'INVALID_CANCEL_RESTRICTIONS',
        description: [
          'cancelRestrictions has to be either ONLY_NEW or ONLY_PARTIALLY_FILLED.'
        ]
      },
      '-2010': {
        code: -2010,
        name: 'NEW_ORDER_REJECTED',
        description: ['NEW_ORDER_REJECTED']
      },
      '-2011': {
        code: -2011,
        name: 'CANCEL_REJECTED',
        description: ['CANCEL_REJECTED']
      },
      '-2013': {
        code: -2013,
        name: 'NO_SUCH_ORDER',
        description: ['Order does not exist.']
      },
      '-2014': {
        code: -2014,
        name: 'BAD_API_KEY_FMT',
        description: ['API-key format invalid.']
      },
      '-2015': {
        code: -2015,
        name: 'REJECTED_MBX_KEY',
        description: ['Invalid API-key, IP, or permissions for action.']
      },
      '-2016': {
        code: -2016,
        name: 'NO_TRADING_WINDOW',
        description: [
          'No trading window could be found for the symbol. Try ticker/24hrs instead.'
        ]
      },
      '-2021': {
        code: -2021,
        name: 'Order cancel-replace partially failed',
        description: [
          'This code is sent when either the cancellation of the order failed or the new order placement failed but not both.'
        ]
      },
      '-2022': {
        code: -2022,
        name: 'Order cancel-replace failed.',
        description: [
          'This code is sent when both the cancellation of the order failed and the new order placement failed.'
        ]
      },
      '-2026': {
        code: -2026,
        name: 'ORDER_ARCHIVED',
        description: [
          'Order was canceled or expired with no executed qty over 90 days ago and has been archived.',
          '3xxx-5xxx SAPI-specific issues'
        ]
      },
      '-3000': {
        code: -3000,
        name: 'INNER_FAILURE',
        description: ['Internal server error.']
      },
      '-3001': {
        code: -3001,
        name: 'NEED_ENABLE_2FA',
        description: ['Please enable 2FA first.']
      },
      '-3002': {
        code: -3002,
        name: 'ASSET_DEFICIENCY',
        description: ["We don't have this asset."]
      },
      '-3003': {
        code: -3003,
        name: 'NO_OPENED_MARGIN_ACCOUNT',
        description: ['Margin account does not exist.']
      },
      '-3004': {
        code: -3004,
        name: 'TRADE_NOT_ALLOWED',
        description: ['Trade not allowed.']
      },
      '-3005': {
        code: -3005,
        name: 'TRANSFER_OUT_NOT_ALLOWED',
        description: ['Transferring out not allowed.']
      },
      '-3006': {
        code: -3006,
        name: 'EXCEED_MAX_BORROWABLE',
        description: ['Your borrow amount has exceed maximum borrow amount.']
      },
      '-3007': {
        code: -3007,
        name: 'HAS_PENDING_TRANSACTION',
        description: ['You have pending transaction, please try again later.']
      },
      '-3008': {
        code: -3008,
        name: 'BORROW_NOT_ALLOWED',
        description: ['Borrow not allowed.']
      },
      '-3009': {
        code: -3009,
        name: 'ASSET_NOT_MORTGAGEABLE',
        description: [
          'This asset are not allowed to transfer into margin account currently.'
        ]
      },
      '-3010': {
        code: -3010,
        name: 'REPAY_NOT_ALLOWED',
        description: ['Repay not allowed.']
      },
      '-3011': {
        code: -3011,
        name: 'BAD_DATE_RANGE',
        description: ['Your input date is invalid.']
      },
      '-3012': {
        code: -3012,
        name: 'ASSET_ADMIN_BAN_BORROW',
        description: ['Borrow is banned for this asset.']
      },
      '-3013': {
        code: -3013,
        name: 'LT_MIN_BORROWABLE',
        description: ['Borrow amount less than minimum borrow amount.']
      },
      '-3014': {
        code: -3014,
        name: 'ACCOUNT_BAN_BORROW',
        description: ['Borrow is banned for this account.']
      },
      '-3015': {
        code: -3015,
        name: 'REPAY_EXCEED_LIABILITY',
        description: ['Repay amount exceeds borrow amount.']
      },
      '-3016': {
        code: -3016,
        name: 'LT_MIN_REPAY',
        description: ['Repay amount less than minimum repay amount.']
      },
      '-3017': {
        code: -3017,
        name: 'ASSET_ADMIN_BAN_MORTGAGE',
        description: [
          'This asset are not allowed to transfer into margin account currently.'
        ]
      },
      '-3018': {
        code: -3018,
        name: 'ACCOUNT_BAN_MORTGAGE',
        description: ['Transferring in has been banned for this account.']
      },
      '-3019': {
        code: -3019,
        name: 'ACCOUNT_BAN_ROLLOUT',
        description: ['Transferring out has been banned for this account.']
      },
      '-3020': {
        code: -3020,
        name: 'EXCEED_MAX_ROLLOUT',
        description: ['Transfer out amount exceeds max amount.']
      },
      '-3021': {
        code: -3021,
        name: 'PAIR_ADMIN_BAN_TRADE',
        description: ['Margin account are not allowed to trade this trading pair.']
      },
      '-3022': {
        code: -3022,
        name: 'ACCOUNT_BAN_TRADE',
        description: ["You account's trading is banned."]
      },
      '-3023': {
        code: -3023,
        name: 'WARNING_MARGIN_LEVEL',
        description: [
          "You can't transfer out/place order under current margin level."
        ]
      },
      '-3024': {
        code: -3024,
        name: 'FEW_LIABILITY_LEFT',
        description: ['The unpaid debt is too small after this repayment.']
      },
      '-3025': {
        code: -3025,
        name: 'INVALID_EFFECTIVE_TIME',
        description: ['Your input date is invalid.']
      },
      '-3026': {
        code: -3026,
        name: 'VALIDATION_FAILED',
        description: ['Your input param is invalid.']
      },
      '-3027': {
        code: -3027,
        name: 'NOT_VALID_MARGIN_ASSET',
        description: ['Not a valid margin asset.']
      },
      '-3028': {
        code: -3028,
        name: 'NOT_VALID_MARGIN_PAIR',
        description: ['Not a valid margin pair.']
      },
      '-3029': {
        code: -3029,
        name: 'TRANSFER_FAILED',
        description: ['Transfer failed.']
      },
      '-3036': {
        code: -3036,
        name: 'ACCOUNT_BAN_REPAY',
        description: ['This account is not allowed to repay.']
      },
      '-3037': {
        code: -3037,
        name: 'PNL_CLEARING',
        description: ['PNL is clearing. Wait a second.']
      },
      '-3038': {
        code: -3038,
        name: 'LISTEN_KEY_NOT_FOUND',
        description: ['Listen key not found.']
      },
      '-3041': {
        code: -3041,
        name: 'BALANCE_NOT_CLEARED',
        description: ['Balance is not enough']
      },
      '-3042': {
        code: -3042,
        name: 'PRICE_INDEX_NOT_FOUND',
        description: ['PriceIndex not available for this margin pair.']
      },
      '-3043': {
        code: -3043,
        name: 'TRANSFER_IN_NOT_ALLOWED',
        description: ['Transferring in not allowed.']
      },
      '-3044': {
        code: -3044,
        name: 'SYSTEM_BUSY',
        description: ['System busy.']
      },
      '-3045': {
        code: -3045,
        name: 'SYSTEM',
        description: ["The system doesn't have enough asset now."]
      },
      '-3999': {
        code: -3999,
        name: 'NOT_WHITELIST_USER',
        description: ['This function is only available for invited users.']
      },
      '-4001': {
        code: -4001,
        name: 'CAPITAL_INVALID',
        description: ['Invalid operation.']
      },
      '-4002': {
        code: -4002,
        name: 'CAPITAL_IG',
        description: ['Invalid get.']
      },
      '-4003': {
        code: -4003,
        name: 'CAPITAL_IEV',
        description: ['Your input email is invalid.']
      },
      '-4004': {
        code: -4004,
        name: 'CAPITAL_UA',
        description: ["You don't login or auth."]
      },
      '-4005': {
        code: -4005,
        name: 'CAPAITAL_TOO_MANY_REQUEST',
        description: ['Too many new requests.']
      },
      '-4006': {
        code: -4006,
        name: 'CAPITAL_ONLY_SUPPORT_PRIMARY_ACCOUNT',
        description: ['Support main account only.']
      },
      '-4007': {
        code: -4007,
        name: 'CAPITAL_ADDRESS_VERIFICATION_NOT_PASS',
        description: ['Address validation is not passed.']
      },
      '-4008': {
        code: -4008,
        name: 'CAPITAL_ADDRESS_TAG_VERIFICATION_NOT_PASS',
        description: ['Address tag validation is not passed.']
      },
      '-4010': {
        code: -4010,
        name: 'CAPITAL_WHITELIST_EMAIL_CONFIRM',
        description: ['White list mail has been confirmed.']
      },
      '-4011': {
        code: -4011,
        name: 'CAPITAL_WHITELIST_EMAIL_EXPIRED',
        description: ['White list mail is invalid.']
      },
      '-4012': {
        code: -4012,
        name: 'CAPITAL_WHITELIST_CLOSE',
        description: ['White list is not opened.']
      },
      '-4013': {
        code: -4013,
        name: 'CAPITAL_WITHDRAW_2FA_VERIFY',
        description: ['2FA is not opened.']
      },
      '-4014': {
        code: -4014,
        name: 'CAPITAL_WITHDRAW_LOGIN_DELAY',
        description: ['Withdraw is not allowed within 2 min login.']
      },
      '-4015': {
        code: -4015,
        name: 'CAPITAL_WITHDRAW_RESTRICTED_MINUTE',
        description: ['Withdraw is limited.']
      },
      '-4016': {
        code: -4016,
        name: 'CAPITAL_WITHDRAW_RESTRICTED_PASSWORD',
        description: [
          'Within 24 hours after password modification, withdrawal is prohibited.'
        ]
      },
      '-4017': {
        code: -4017,
        name: 'CAPITAL_WITHDRAW_RESTRICTED_UNBIND_2FA',
        description: [
          'Within 24 hours after the release of 2FA, withdrawal is prohibited.'
        ]
      },
      '-4018': {
        code: -4018,
        name: 'CAPITAL_WITHDRAW_ASSET_NOT_EXIST',
        description: ["We don't have this asset."]
      },
      '-4019': {
        code: -4019,
        name: 'CAPITAL_WITHDRAW_ASSET_PROHIBIT',
        description: ['Current asset is not open for withdrawal.']
      },
      '-4021': {
        code: -4021,
        name: 'CAPITAL_WITHDRAW_AMOUNT_MULTIPLE',
        description: ['Asset withdrawal must be an %s multiple of %s.']
      },
      '-4022': {
        code: -4022,
        name: 'CAPITAL_WITHDRAW_MIN_AMOUNT',
        description: ['Not less than the minimum pick-up quantity %s.']
      },
      '-4023': {
        code: -4023,
        name: 'CAPITAL_WITHDRAW_MAX_AMOUNT',
        description: ['Within 24 hours, the withdrawal exceeds the maximum amount.']
      },
      '-4024': {
        code: -4024,
        name: 'CAPITAL_WITHDRAW_USER_NO_ASSET',
        description: ["You don't have this asset."]
      },
      '-4025': {
        code: -4025,
        name: 'CAPITAL_WITHDRAW_USER_ASSET_LESS_THAN_ZERO',
        description: ['The number of hold asset is less than zero.']
      },
      '-4026': {
        code: -4026,
        name: 'CAPITAL_WITHDRAW_USER_ASSET_NOT_ENOUGH',
        description: ['You have insufficient balance.']
      },
      '-4027': {
        code: -4027,
        name: 'CAPITAL_WITHDRAW_GET_TRAN_ID_FAILURE',
        description: ['Failed to obtain tranId.']
      },
      '-4028': {
        code: -4028,
        name: 'CAPITAL_WITHDRAW_MORE_THAN_FEE',
        description: [
          'The amount of withdrawal must be greater than the Commission.'
        ]
      },
      '-4029': {
        code: -4029,
        name: 'CAPITAL_WITHDRAW_NOT_EXIST',
        description: ['The withdrawal record does not exist.']
      },
      '-4030': {
        code: -4030,
        name: 'CAPITAL_WITHDRAW_CONFIRM_SUCCESS',
        description: ['Confirmation of successful asset withdrawal.']
      },
      '-4031': {
        code: -4031,
        name: 'CAPITAL_WITHDRAW_CANCEL_FAILURE',
        description: ['Cancellation failed.']
      },
      '-4032': {
        code: -4032,
        name: 'CAPITAL_WITHDRAW_CHECKSUM_VERIFY_FAILURE',
        description: ['Withdraw verification exception.']
      },
      '-4033': {
        code: -4033,
        name: 'CAPITAL_WITHDRAW_ILLEGAL_ADDRESS',
        description: ['Illegal address.']
      },
      '-4034': {
        code: -4034,
        name: 'CAPITAL_WITHDRAW_ADDRESS_CHEAT',
        description: ['The address is suspected of fake.']
      },
      '-4035': {
        code: -4035,
        name: 'CAPITAL_WITHDRAW_NOT_WHITE_ADDRESS',
        description: [
          'This address is not on the whitelist. Please join and try again.'
        ]
      },
      '-4036': {
        code: -4036,
        name: 'CAPITAL_WITHDRAW_NEW_ADDRESS',
        description: ['The new address needs to be withdrawn in {0} hours.']
      },
      '-4037': {
        code: -4037,
        name: 'CAPITAL_WITHDRAW_RESEND_EMAIL_FAIL',
        description: ['Re-sending Mail failed.']
      },
      '-4038': {
        code: -4038,
        name: 'CAPITAL_WITHDRAW_RESEND_EMAIL_TIME_OUT',
        description: ['Please try again in 5 minutes.']
      },
      '-4039': {
        code: -4039,
        name: 'CAPITAL_USER_EMPTY',
        description: ['The user does not exist.']
      },
      '-4040': {
        code: -4040,
        name: 'CAPITAL_NO_CHARGE',
        description: ['This address not charged.']
      },
      '-4041': {
        code: -4041,
        name: 'CAPITAL_MINUTE_TOO_SMALL',
        description: ['Please try again in one minute.']
      },
      '-4042': {
        code: -4042,
        name: 'CAPITAL_CHARGE_NOT_RESET',
        description: ['This asset cannot get deposit address again.']
      },
      '-4043': {
        code: -4043,
        name: 'CAPITAL_ADDRESS_TOO_MUCH',
        description: ['More than 100 recharge addresses were used in 24 hours.']
      },
      '-4044': {
        code: -4044,
        name: 'CAPITAL_BLACKLIST_COUNTRY_GET_ADDRESS',
        description: ['This is a blacklist country.']
      },
      '-4045': {
        code: -4045,
        name: 'CAPITAL_GET_ASSET_ERROR',
        description: ['Failure to acquire assets.']
      },
      '-4046': {
        code: -4046,
        name: 'CAPITAL_AGREEMENT_NOT_CONFIRMED',
        description: ['Agreement not confirmed.']
      },
      '-4047': {
        code: -4047,
        name: 'CAPITAL_DATE_INTERVAL_LIMIT',
        description: ['Time interval must be within 0-90 days']
      },
      '-4060': {
        code: -4060,
        name: 'CAPITAL_WITHDRAW_USER_ASSET_LOCK_DEPOSIT',
        description: [
          'As your deposit has not reached the required block confirmations, we have temporarily locked {0} asset'
        ]
      },
      '-5001': {
        code: -5001,
        name: 'ASSET_DRIBBLET_CONVERT_SWITCH_OFF',
        description: ["Don't allow transfer to micro assets."]
      },
      '-5002': {
        code: -5002,
        name: 'ASSET_ASSET_NOT_ENOUGH',
        description: ['You have insufficient balance.']
      },
      '-5003': {
        code: -5003,
        name: 'ASSET_USER_HAVE_NO_ASSET',
        description: ["You don't have this asset."]
      },
      '-5004': {
        code: -5004,
        name: 'USER_OUT_OF_TRANSFER_FLOAT',
        description: [
          'The residual balances have exceeded 0.001BTC, Please re-choose.',
          'The residual balances of %s have exceeded 0.001BTC, Please re-choose.'
        ]
      },
      '-5005': {
        code: -5005,
        name: 'USER_ASSET_AMOUNT_IS_TOO_LOW',
        description: [
          'The residual balances of the BTC is too low',
          'The residual balances of %s is too low, Please re-choose.'
        ]
      },
      '-5006': {
        code: -5006,
        name: 'USER_CAN_NOT_REQUEST_IN_24_HOURS',
        description: ['Only transfer once in 24 hours.']
      },
      '-5007': {
        code: -5007,
        name: 'AMOUNT_OVER_ZERO',
        description: ['Quantity must be greater than zero.']
      },
      '-5008': {
        code: -5008,
        name: 'ASSET_WITHDRAW_WITHDRAWING_NOT_ENOUGH',
        description: ['Insufficient amount of returnable assets.']
      },
      '-5009': {
        code: -5009,
        name: 'PRODUCT_NOT_EXIST',
        description: ['Product does not exist.']
      },
      '-5010': {
        code: -5010,
        name: 'TRANSFER_FAIL',
        description: ['Asset transfer fail.']
      },
      '-5011': {
        code: -5011,
        name: 'FUTURE_ACCT_NOT_EXIST',
        description: ['future account not exists.']
      },
      '-5012': {
        code: -5012,
        name: 'FUTURE_ACCT_OR_SUBRELATION_NOT_EXIST',
        description: [
          'future account or sub relation not exists.',
          '6XXX - Savings Issues'
        ]
      },
      '-5021': {
        code: -5021,
        name: 'PARENT_SUB_HAVE_NO_RELATION',
        description: ['This parent sub have no relation']
      },
      '-6001': {
        code: -6001,
        name: 'DAILY_PRODUCT_NOT_EXIST',
        description: ['Daily product not exists.']
      },
      '-6003': {
        code: -6003,
        name: 'DAILY_PRODUCT_NOT_ACCESSIBLE',
        description: ["Product not exist or you don't have permission"]
      },
      '-6004': {
        code: -6004,
        name: 'DAILY_PRODUCT_NOT_PURCHASABLE',
        description: ['Product not in purchase status']
      },
      '-6005': {
        code: -6005,
        name: 'DAILY_LOWER_THAN_MIN_PURCHASE_LIMIT',
        description: ['Smaller than min purchase limit']
      },
      '-6006': {
        code: -6006,
        name: 'DAILY_REDEEM_AMOUNT_ERROR',
        description: ['Redeem amount error']
      },
      '-6007': {
        code: -6007,
        name: 'DAILY_REDEEM_TIME_ERROR',
        description: ['Not in redeem time']
      },
      '-6008': {
        code: -6008,
        name: 'DAILY_PRODUCT_NOT_REDEEMABLE',
        description: ['Product not in redeem status']
      },
      '-6009': {
        code: -6009,
        name: 'REQUEST_FREQUENCY_TOO_HIGH',
        description: ['Request frequency too high']
      },
      '-6011': {
        code: -6011,
        name: 'EXCEEDED_USER_PURCHASE_LIMIT',
        description: ['Exceeding the maximum num allowed to purchase per user']
      },
      '-6012': {
        code: -6012,
        name: 'BALANCE_NOT_ENOUGH',
        description: ['Balance not enough']
      },
      '-6013': {
        code: -6013,
        name: 'PURCHASING_FAILED',
        description: ['Purchasing failed']
      },
      '-6014': {
        code: -6014,
        name: 'UPDATE_FAILED',
        description: ['Exceed up-limit allowed to purchased']
      },
      '-6015': {
        code: -6015,
        name: 'EMPTY_REQUEST_BODY',
        description: ['Empty request body']
      },
      '-6016': {
        code: -6016,
        name: 'PARAMS_ERR',
        description: ['Parameter err']
      },
      '-6017': {
        code: -6017,
        name: 'NOT_IN_WHITELIST',
        description: ['Not in whitelist']
      },
      '-6018': {
        code: -6018,
        name: 'ASSET_NOT_ENOUGH',
        description: ['Asset not enough']
      },
      '-6019': { code: -6019, name: 'PENDING', description: ['Need confirm'] },
      '-6020': {
        code: -6020,
        name: 'PROJECT_NOT_EXISTS',
        description: ['Project not exists']
      },
      '-7001': {
        code: -7001,
        name: 'FUTURES_BAD_DATE_RANGE',
        description: ['Date range is not supported.']
      },
      '-7002': {
        code: -7002,
        name: 'FUTURES_BAD_TYPE',
        description: [
          'Data request type is not supported.',
          '20xxx - Futures/Spot Algo'
        ]
      },
      '-20121': { code: -20121, name: '', description: ['Invalid symbol.'] },
      '-20124': {
        code: -20124,
        name: '',
        description: ['Invalid algo id or it has been completed.']
      },
      '-20130': {
        code: -20130,
        name: '',
        description: ['Invalid data sent for a parameter.']
      },
      '-20132': {
        code: -20132,
        name: '',
        description: ['The client algo id is duplicated.']
      },
      '-20194': {
        code: -20194,
        name: '',
        description: ['Duration is too short to execute all required quantity.']
      },
      '-20195': {
        code: -20195,
        name: '',
        description: ['The total size is too small.']
      },
      '-20196': {
        code: -20196,
        name: '',
        description: ['The total size is too large.']
      },
      '-20198': {
        code: -20198,
        name: '',
        description: ['Reach the max open orders allowed.']
      },
      '-20204': {
        code: -20204,
        name: '',
        description: [
          'The notional of USD is less or more than the limit.',
          'Filter failures',
          'Error message\tDescription',
          '"Filter failure: PRICE_FILTER"\tprice is too high, too low, and/or not following the tick size rule for the symbol.',
          '"Filter failure: PERCENT_PRICE"\tprice is X% too high or X% too low from the average weighted price over the last Y minutes.',
          '"Filter failure: PERCENT_PRICE_BY_SIDE"\tprice is X% too high or Y% too low from the lastPrice on that side (i.e. BUY/SELL)',
          '"Filter failure: LOT_SIZE"\tquantity is too high, too low, and/or not following the step size rule for the symbol.',
          '"Filter failure: MIN_NOTIONAL"\tprice * quantity is too low to be a valid order for the symbol.',
          '"Filter failure: ICEBERG_PARTS"\tICEBERG order would break into too many parts; icebergQty is too small.',
          `"Filter failure: MARKET_LOT_SIZE"\tMARKET order's quantity is too high, too low, and/or not following the step size rule for the symbol.`,
          `"Filter failure: MAX_POSITION"\tThe account's position has reached the maximum defined limit.`,
          '',
          'This is composed of the sum of the balance of the base asset, and the sum of the quantity of all open BUYorders.',
          '"Filter failure: MAX_NUM_ORDERS"\tAccount has too many open orders on the symbol.',
          '"Filter failure: MAX_NUM_ALGO_ORDERS"\tAccount has too many open stop loss and/or take profit orders on the symbol.',
          '"Filter failure: MAX_NUM_ICEBERG_ORDERS"\tAccount has too many open iceberg orders on the symbol.',
          '"Filter failure: TRAILING_DELTA"\ttrailingDelta is not within the defined range of the filter for that order type.',
          '"Filter failure: EXCHANGE_MAX_NUM_ORDERS"\tAccount has too many open orders on the exchange.',
          '"Filter failure: EXCHANGE_MAX_NUM_ALGO_ORDERS"\tAccount has too many open stop loss and/or take profit orders on the exchange.',
          '10xxx - Crypto Loans'
        ]
      },
      '-10001': {
        code: -10001,
        name: 'SYSTEM_MAINTENANCE',
        description: ['The system is under maintenance, please try again later.']
      },
      '-10002': {
        code: -10002,
        name: 'INVALID_INPUT',
        description: ['Invalid input parameters.']
      },
      '-10005': {
        code: -10005,
        name: 'NO_RECORDS',
        description: ['No records found.']
      },
      '-10007': {
        code: -10007,
        name: 'COIN_NOT_LOANABLE',
        description: ['This coin is not loanable.']
      },
      '-10008': {
        code: -10008,
        name: 'COIN_NOT_LOANABLE',
        description: ['This coin is not loanable']
      },
      '-10009': {
        code: -10009,
        name: 'COIN_NOT_COLLATERAL',
        description: ['This coin can not be used as collateral.']
      },
      '-10010': {
        code: -10010,
        name: 'COIN_NOT_COLLATERAL',
        description: ['This coin can not be used as collateral.']
      },
      '-10011': {
        code: -10011,
        name: 'INSUFFICIENT_ASSET',
        description: ['Insufficient spot assets.']
      },
      '-10012': {
        code: -10012,
        name: 'INVALID_AMOUNT',
        description: ['Invalid repayment amount.']
      },
      '-10013': {
        code: -10013,
        name: 'INSUFFICIENT_AMOUNT',
        description: ['Insufficient collateral amount.']
      },
      '-10015': {
        code: -10015,
        name: 'DEDUCTION_FAILED',
        description: ['Collateral deduction failed.']
      },
      '-10016': {
        code: -10016,
        name: 'LOAN_FAILED',
        description: ['Failed to provide loan.']
      },
      '-10017': {
        code: -10017,
        name: 'REPAY_EXCEED_DEBT',
        description: ['Repayment amount exceeds debt.']
      },
      '-10018': {
        code: -10018,
        name: 'INVALID_AMOUNT',
        description: ['Invalid repayment amount.']
      },
      '-10019': {
        code: -10019,
        name: 'CONFIG_NOT_EXIST',
        description: ['Configuration does not exists.']
      },
      '-10020': {
        code: -10020,
        name: 'UID_NOT_EXIST',
        description: ['User ID does not exist.']
      },
      '-10021': {
        code: -10021,
        name: 'ORDER_NOT_EXIST',
        description: ['Order does not exist.']
      },
      '-10022': {
        code: -10022,
        name: 'INVALID_AMOUNT',
        description: ['Invalid adjustment amount.']
      },
      '-10023': {
        code: -10023,
        name: 'ADJUST_LTV_FAILED',
        description: ['Failed to adjust LTV.']
      },
      '-10024': {
        code: -10024,
        name: 'ADJUST_LTV_NOT_SUPPORTED',
        description: ['LTV adjustment not supported.']
      },
      '-10025': {
        code: -10025,
        name: 'REPAY_FAILED',
        description: ['Repayment failed.']
      },
      '-10026': {
        code: -10026,
        name: 'INVALID_PARAMETER',
        description: ['Invalid parameter.']
      },
      '-10028': {
        code: -10028,
        name: 'INVALID_PARAMETER',
        description: ['Invalid parameter.']
      },
      '-10029': {
        code: -10029,
        name: 'AMOUNT_TOO_SMALL',
        description: ['Loan amount is too small.']
      },
      '-10030': {
        code: -10030,
        name: 'AMOUNT_TOO_LARGE',
        description: ['Loan amount is too much.']
      },
      '-10031': {
        code: -10031,
        name: 'QUOTA_REACHED',
        description: ['Individual loan quota reached.']
      },
      '-10032': {
        code: -10032,
        name: 'REPAY_NOT_AVAILABLE',
        description: ['Repayment is temporarily unavailable.']
      },
      '-10034': {
        code: -10034,
        name: 'REPAY_NOT_AVAILABLE',
        description: [
          'Repay with collateral is not available currently, please try to repay with borrowed coin.'
        ]
      },
      '-10039': {
        code: -10039,
        name: 'AMOUNT_TOO_SMALL',
        description: ['Repayment amount is too small.']
      },
      '-10040': {
        code: -10040,
        name: 'AMOUNT_TOO_LARGE',
        description: ['Repayment amount is too large.']
      },
      '-10041': {
        code: -10041,
        name: 'INSUFFICIENT_AMOUNT',
        description: [
          'Due to high demand, there are currently insufficient loanable assets for {0}. Please adjust your borrow amount or try again tomorrow.'
        ]
      },
      '-10042': {
        code: -10042,
        name: 'ASSET_NOT_SUPPORTED',
        description: ['asset %s is not supported']
      },
      '-10043': {
        code: -10043,
        name: 'ASSET_NOT_SUPPORTED',
        description: ['{0} borrowing is currently not supported.']
      },
      '-10044': {
        code: -10044,
        name: 'QUOTA_REACHED',
        description: [
          'Collateral amount has reached the limit. Please reduce your collateral amount or try with other collaterals.'
        ]
      },
      '-10045': {
        code: -10045,
        name: 'COLLTERAL_REPAY_NOT_SUPPORTED',
        description: [
          'The loan coin does not support collateral repayment. Please try again later.'
        ]
      },
      '-10046': {
        code: -10046,
        name: 'EXCEED_MAX_ADJUSTMENT',
        description: [
          'Collateral Adjustment exceeds the maximum limit. Please try again.'
        ]
      },
      '-10047': {
        code: -10047,
        name: 'REGION_NOT_SUPPORTED',
        description: [
          'This coin is currently not supported in your location due to local regulations.',
          '13xxx - BLVT'
        ]
      },
      '-13000': {
        code: -13000,
        name: 'BLVT_FORBID_REDEEM',
        description: ['Redeption of the token is forbiden now']
      },
      '-13001': {
        code: -13001,
        name: 'BLVT_EXCEED_DAILY_LIMIT',
        description: ['Exceeds individual 24h redemption limit of the token']
      },
      '-13002': {
        code: -13002,
        name: 'BLVT_EXCEED_TOKEN_DAILY_LIMIT',
        description: ['Exceeds total 24h redemption limit of the token']
      },
      '-13003': {
        code: -13003,
        name: 'BLVT_FORBID_PURCHASE',
        description: ['Subscription of the token is forbiden now']
      },
      '-13004': {
        code: -13004,
        name: 'BLVT_EXCEED_DAILY_PURCHASE_LIMIT',
        description: ['Exceeds individual 24h subscription limit of the token']
      },
      '-13005': {
        code: -13005,
        name: 'BLVT_EXCEED_TOKEN_DAILY_PURCHASE_LIMIT',
        description: ['Exceeds total 24h subscription limit of the token']
      },
      '-13006': {
        code: -13006,
        name: 'BLVT_PURCHASE_LESS_MIN_AMOUNT',
        description: ['Subscription amount is too small']
      },
      '-13007': {
        code: -13007,
        name: 'BLVT_PURCHASE_AGREEMENT_NOT_SIGN',
        description: ['The Agreement is not signed', '12xxx - Liquid Swap']
      },
      '-12014': {
        code: -12014,
        name: 'TOO MANY REQUESTS',
        description: ['More than 1 request in 2 seconds', '18xxx - Binance Code']
      },
      '-18002': {
        code: -18002,
        name: '',
        description: [
          'The total amount of codes you created has exceeded the 24-hour limit, please try again after UTC 0'
        ]
      },
      '-18003': {
        code: -18003,
        name: '',
        description: [
          'Too many codes created in 24 hours, please try again after UTC 0'
        ]
      },
      '-18004': {
        code: -18004,
        name: '',
        description: [
          'Too many invalid redeem attempts in 24 hours, please try again after UTC 0'
        ]
      },
      '-18005': {
        code: -18005,
        name: '',
        description: ['Too many invalid verify attempts, please try later']
      },
      '-18006': {
        code: -18006,
        name: '',
        description: ['The amount is too small, please re-enter']
      },
      '-18007': {
        code: -18007,
        name: '',
        description: [
          'This token is not currently supported, please re-enter',
          '21xxx - Portfolio Margin Account'
        ]
      },
      '-21001': {
        code: -21001,
        name: 'USER_IS_NOT_UNIACCOUNT',
        description: ['Request ID is not a Portfolio Margin Account.']
      },
      '-21002': {
        code: -21002,
        name: 'UNI_ACCOUNT_CANT_TRANSFER_FUTURE',
        description: [
          "Portfolio Margin Account doesn't support transfer from margin to futures."
        ]
      },
      '-21003': {
        code: -21003,
        name: 'NET_ASSET_MUST_LTE_RATIO',
        description: ['Fail to retrieve margin assets.']
      },
      '-21004': {
        code: -21004,
        name: 'USER_NO_LIABILITY',
        description: ['User doesn’t have portfolio margin bankruptcy loan']
      },
      '-21005': {
        code: -21005,
        name: 'NO_ENOUGH_ASSET',
        description: [
          'User’s spot wallet doesn’t have enough BUSD to repay portfolio margin bankruptcy loan'
        ]
      },
      '-21006': {
        code: -21006,
        name: 'HAD_IN_PROCESS_REPAY',
        description: [
          'User had portfolio margin bankruptcy loan repayment in process'
        ]
      },
      '-21007': {
        code: -21007,
        name: 'IN_FORCE_LIQUIDATION',
        description: [
          'User failed to repay portfolio margin bankruptcy loan since liquidation was in process'
        ]
      }
    },
    ERRORS: {
      UNKNOWN: {
        code: -1000,
        name: 'UNKNOWN',
        description: [
          'An unknown error occurred while processing the request.',
          'An unknown error occurred while processing the request.[%s]'
        ]
      },
      DISCONNECTED: {
        code: -1001,
        name: 'DISCONNECTED',
        description: [
          'Internal error; unable to process your request. Please try again.'
        ]
      },
      UNAUTHORIZED: {
        code: -1002,
        name: 'UNAUTHORIZED',
        description: ['You are not authorized to execute this request.']
      },
      TOO_MANY_REQUESTS: {
        code: -1003,
        name: 'TOO_MANY_REQUESTS',
        description: [
          'Too many requests queued.',
          'Too much request weight used; current limit is %s request weight per %s. Please use WebSocket Streams for live updates to avoid polling the API.',
          'Way too much request weight used; IP banned until %s. Please use WebSocket Streams for live updates to avoid bans.'
        ]
      },
      SERVER_BUSY: {
        code: -1008,
        name: 'SERVER_BUSY',
        description: [
          'Spot server is currently overloaded with other requests. Please try again in a few minutes.'
        ]
      },
      UNEXPECTED_RESP: {
        code: -1006,
        name: 'UNEXPECTED_RESP',
        description: [
          'An unexpected response was received from the message bus. Execution status unknown.'
        ]
      },
      TIMEOUT: {
        code: -1007,
        name: 'TIMEOUT',
        description: [
          'Timeout waiting for response from backend server. Send status unknown; execution status unknown.'
        ]
      },
      UNKNOWN_ORDER_COMPOSITION: {
        code: -1014,
        name: 'UNKNOWN_ORDER_COMPOSITION',
        description: ['Unsupported order combination.']
      },
      TOO_MANY_ORDERS: {
        code: -1015,
        name: 'TOO_MANY_ORDERS',
        description: [
          'Too many new orders.',
          'Too many new orders; current limit is %s orders per %s.'
        ]
      },
      SERVICE_SHUTTING_DOWN: {
        code: -1016,
        name: 'SERVICE_SHUTTING_DOWN',
        description: ['This service is no longer available.']
      },
      UNSUPPORTED_OPERATION: {
        code: -1020,
        name: 'UNSUPPORTED_OPERATION',
        description: ['This operation is not supported.']
      },
      INVALID_TIMESTAMP: {
        code: -1021,
        name: 'INVALID_TIMESTAMP',
        description: [
          'Timestamp for this request is outside of the recvWindow.',
          "Timestamp for this request was 1000ms ahead of the server's time."
        ]
      },
      INVALID_SIGNATURE: {
        code: -1022,
        name: 'INVALID_SIGNATURE',
        description: ['Signature for this request is not valid.']
      },
      'Not found, authenticated, or authorized': {
        code: -1099,
        name: 'Not found, authenticated, or authorized',
        description: ['This replaces error code -1999']
      },
      ILLEGAL_CHARS: {
        code: -1100,
        name: 'ILLEGAL_CHARS',
        description: [
          'Illegal characters found in a parameter.',
          'Illegal characters found in a parameter. %s',
          'Illegal characters found in parameter %s; legal range is %s.'
        ]
      },
      TOO_MANY_PARAMETERS: {
        code: -1101,
        name: 'TOO_MANY_PARAMETERS',
        description: [
          'Too many parameters sent for this endpoint.',
          'Too many parameters; expected %s and received %s.',
          'Duplicate values for a parameter detected.'
        ]
      },
      MANDATORY_PARAM_EMPTY_OR_MALFORMED: {
        code: -1102,
        name: 'MANDATORY_PARAM_EMPTY_OR_MALFORMED',
        description: [
          'A mandatory parameter was not sent, was empty/null, or malformed.',
          'Mandatory parameter %s was not sent, was empty/null, or malformed.',
          'Param %s or %s must be sent, but both were empty/null!'
        ]
      },
      UNKNOWN_PARAM: {
        code: -1103,
        name: 'UNKNOWN_PARAM',
        description: ['An unknown parameter was sent.']
      },
      UNREAD_PARAMETERS: {
        code: -1104,
        name: 'UNREAD_PARAMETERS',
        description: [
          'Not all sent parameters were read.',
          'Not all sent parameters were read; read %s parameter(s) but was sent %s.'
        ]
      },
      PARAM_EMPTY: {
        code: -1105,
        name: 'PARAM_EMPTY',
        description: ['A parameter was empty.', 'Parameter %s was empty.']
      },
      PARAM_NOT_REQUIRED: {
        code: -1106,
        name: 'PARAM_NOT_REQUIRED',
        description: [
          'A parameter was sent when not required.',
          'Parameter %s sent when not required.'
        ]
      },
      BAD_PRECISION: {
        code: -1111,
        name: 'BAD_PRECISION',
        description: ['Precision is over the maximum defined for this asset.']
      },
      NO_DEPTH: {
        code: -1112,
        name: 'NO_DEPTH',
        description: ['No orders on book for symbol.']
      },
      TIF_NOT_REQUIRED: {
        code: -1114,
        name: 'TIF_NOT_REQUIRED',
        description: ['TimeInForce parameter sent when not required.']
      },
      INVALID_TIF: {
        code: -1115,
        name: 'INVALID_TIF',
        description: ['Invalid timeInForce.']
      },
      INVALID_ORDER_TYPE: {
        code: -1116,
        name: 'INVALID_ORDER_TYPE',
        description: ['Invalid orderType.']
      },
      INVALID_SIDE: {
        code: -1117,
        name: 'INVALID_SIDE',
        description: ['Invalid side.']
      },
      EMPTY_NEW_CL_ORD_ID: {
        code: -1118,
        name: 'EMPTY_NEW_CL_ORD_ID',
        description: ['New client order ID was empty.']
      },
      EMPTY_ORG_CL_ORD_ID: {
        code: -1119,
        name: 'EMPTY_ORG_CL_ORD_ID',
        description: ['Original client order ID was empty.']
      },
      BAD_INTERVAL: {
        code: -1120,
        name: 'BAD_INTERVAL',
        description: ['Invalid interval.']
      },
      BAD_SYMBOL: {
        code: -1121,
        name: 'BAD_SYMBOL',
        description: ['Invalid symbol.']
      },
      INVALID_LISTEN_KEY: {
        code: -1125,
        name: 'INVALID_LISTEN_KEY',
        description: ['This listenKey does not exist.']
      },
      MORE_THAN_XX_HOURS: {
        code: -1127,
        name: 'MORE_THAN_XX_HOURS',
        description: [
          'Lookup interval is too big.',
          'More than %s hours between startTime and endTime.'
        ]
      },
      OPTIONAL_PARAMS_BAD_COMBO: {
        code: -1128,
        name: 'OPTIONAL_PARAMS_BAD_COMBO',
        description: ['Combination of optional parameters invalid.']
      },
      INVALID_PARAMETER: {
        code: -10028,
        name: 'INVALID_PARAMETER',
        description: ['Invalid parameter.']
      },
      BAD_RECV_WINDOW: {
        code: -1131,
        name: 'BAD_RECV_WINDOW',
        description: ['recvWindow must be less than 60000']
      },
      BAD_STRATEGY_TYPE: {
        code: -1134,
        name: 'BAD_STRATEGY_TYPE',
        description: ['strategyType was less than 1000000.']
      },
      INVALID_CANCEL_RESTRICTIONS: {
        code: -1145,
        name: 'INVALID_CANCEL_RESTRICTIONS',
        description: [
          'cancelRestrictions has to be either ONLY_NEW or ONLY_PARTIALLY_FILLED.'
        ]
      },
      NEW_ORDER_REJECTED: {
        code: -2010,
        name: 'NEW_ORDER_REJECTED',
        description: ['NEW_ORDER_REJECTED']
      },
      CANCEL_REJECTED: {
        code: -2011,
        name: 'CANCEL_REJECTED',
        description: ['CANCEL_REJECTED']
      },
      NO_SUCH_ORDER: {
        code: -2013,
        name: 'NO_SUCH_ORDER',
        description: ['Order does not exist.']
      },
      BAD_API_KEY_FMT: {
        code: -2014,
        name: 'BAD_API_KEY_FMT',
        description: ['API-key format invalid.']
      },
      REJECTED_MBX_KEY: {
        code: -2015,
        name: 'REJECTED_MBX_KEY',
        description: ['Invalid API-key, IP, or permissions for action.']
      },
      NO_TRADING_WINDOW: {
        code: -2016,
        name: 'NO_TRADING_WINDOW',
        description: [
          'No trading window could be found for the symbol. Try ticker/24hrs instead.'
        ]
      },
      'Order cancel-replace partially failed': {
        code: -2021,
        name: 'Order cancel-replace partially failed',
        description: [
          'This code is sent when either the cancellation of the order failed or the new order placement failed but not both.'
        ]
      },
      'Order cancel-replace failed.': {
        code: -2022,
        name: 'Order cancel-replace failed.',
        description: [
          'This code is sent when both the cancellation of the order failed and the new order placement failed.'
        ]
      },
      ORDER_ARCHIVED: {
        code: -2026,
        name: 'ORDER_ARCHIVED',
        description: [
          'Order was canceled or expired with no executed qty over 90 days ago and has been archived.',
          '3xxx-5xxx SAPI-specific issues'
        ]
      },
      INNER_FAILURE: {
        code: -3000,
        name: 'INNER_FAILURE',
        description: ['Internal server error.']
      },
      NEED_ENABLE_2FA: {
        code: -3001,
        name: 'NEED_ENABLE_2FA',
        description: ['Please enable 2FA first.']
      },
      ASSET_DEFICIENCY: {
        code: -3002,
        name: 'ASSET_DEFICIENCY',
        description: ["We don't have this asset."]
      },
      NO_OPENED_MARGIN_ACCOUNT: {
        code: -3003,
        name: 'NO_OPENED_MARGIN_ACCOUNT',
        description: ['Margin account does not exist.']
      },
      TRADE_NOT_ALLOWED: {
        code: -3004,
        name: 'TRADE_NOT_ALLOWED',
        description: ['Trade not allowed.']
      },
      TRANSFER_OUT_NOT_ALLOWED: {
        code: -3005,
        name: 'TRANSFER_OUT_NOT_ALLOWED',
        description: ['Transferring out not allowed.']
      },
      EXCEED_MAX_BORROWABLE: {
        code: -3006,
        name: 'EXCEED_MAX_BORROWABLE',
        description: ['Your borrow amount has exceed maximum borrow amount.']
      },
      HAS_PENDING_TRANSACTION: {
        code: -3007,
        name: 'HAS_PENDING_TRANSACTION',
        description: ['You have pending transaction, please try again later.']
      },
      BORROW_NOT_ALLOWED: {
        code: -3008,
        name: 'BORROW_NOT_ALLOWED',
        description: ['Borrow not allowed.']
      },
      ASSET_NOT_MORTGAGEABLE: {
        code: -3009,
        name: 'ASSET_NOT_MORTGAGEABLE',
        description: [
          'This asset are not allowed to transfer into margin account currently.'
        ]
      },
      REPAY_NOT_ALLOWED: {
        code: -3010,
        name: 'REPAY_NOT_ALLOWED',
        description: ['Repay not allowed.']
      },
      BAD_DATE_RANGE: {
        code: -3011,
        name: 'BAD_DATE_RANGE',
        description: ['Your input date is invalid.']
      },
      ASSET_ADMIN_BAN_BORROW: {
        code: -3012,
        name: 'ASSET_ADMIN_BAN_BORROW',
        description: ['Borrow is banned for this asset.']
      },
      LT_MIN_BORROWABLE: {
        code: -3013,
        name: 'LT_MIN_BORROWABLE',
        description: ['Borrow amount less than minimum borrow amount.']
      },
      ACCOUNT_BAN_BORROW: {
        code: -3014,
        name: 'ACCOUNT_BAN_BORROW',
        description: ['Borrow is banned for this account.']
      },
      REPAY_EXCEED_LIABILITY: {
        code: -3015,
        name: 'REPAY_EXCEED_LIABILITY',
        description: ['Repay amount exceeds borrow amount.']
      },
      LT_MIN_REPAY: {
        code: -3016,
        name: 'LT_MIN_REPAY',
        description: ['Repay amount less than minimum repay amount.']
      },
      ASSET_ADMIN_BAN_MORTGAGE: {
        code: -3017,
        name: 'ASSET_ADMIN_BAN_MORTGAGE',
        description: [
          'This asset are not allowed to transfer into margin account currently.'
        ]
      },
      ACCOUNT_BAN_MORTGAGE: {
        code: -3018,
        name: 'ACCOUNT_BAN_MORTGAGE',
        description: ['Transferring in has been banned for this account.']
      },
      ACCOUNT_BAN_ROLLOUT: {
        code: -3019,
        name: 'ACCOUNT_BAN_ROLLOUT',
        description: ['Transferring out has been banned for this account.']
      },
      EXCEED_MAX_ROLLOUT: {
        code: -3020,
        name: 'EXCEED_MAX_ROLLOUT',
        description: ['Transfer out amount exceeds max amount.']
      },
      PAIR_ADMIN_BAN_TRADE: {
        code: -3021,
        name: 'PAIR_ADMIN_BAN_TRADE',
        description: ['Margin account are not allowed to trade this trading pair.']
      },
      ACCOUNT_BAN_TRADE: {
        code: -3022,
        name: 'ACCOUNT_BAN_TRADE',
        description: ["You account's trading is banned."]
      },
      WARNING_MARGIN_LEVEL: {
        code: -3023,
        name: 'WARNING_MARGIN_LEVEL',
        description: [
          "You can't transfer out/place order under current margin level."
        ]
      },
      FEW_LIABILITY_LEFT: {
        code: -3024,
        name: 'FEW_LIABILITY_LEFT',
        description: ['The unpaid debt is too small after this repayment.']
      },
      INVALID_EFFECTIVE_TIME: {
        code: -3025,
        name: 'INVALID_EFFECTIVE_TIME',
        description: ['Your input date is invalid.']
      },
      VALIDATION_FAILED: {
        code: -3026,
        name: 'VALIDATION_FAILED',
        description: ['Your input param is invalid.']
      },
      NOT_VALID_MARGIN_ASSET: {
        code: -3027,
        name: 'NOT_VALID_MARGIN_ASSET',
        description: ['Not a valid margin asset.']
      },
      NOT_VALID_MARGIN_PAIR: {
        code: -3028,
        name: 'NOT_VALID_MARGIN_PAIR',
        description: ['Not a valid margin pair.']
      },
      TRANSFER_FAILED: {
        code: -3029,
        name: 'TRANSFER_FAILED',
        description: ['Transfer failed.']
      },
      ACCOUNT_BAN_REPAY: {
        code: -3036,
        name: 'ACCOUNT_BAN_REPAY',
        description: ['This account is not allowed to repay.']
      },
      PNL_CLEARING: {
        code: -3037,
        name: 'PNL_CLEARING',
        description: ['PNL is clearing. Wait a second.']
      },
      LISTEN_KEY_NOT_FOUND: {
        code: -3038,
        name: 'LISTEN_KEY_NOT_FOUND',
        description: ['Listen key not found.']
      },
      BALANCE_NOT_CLEARED: {
        code: -3041,
        name: 'BALANCE_NOT_CLEARED',
        description: ['Balance is not enough']
      },
      PRICE_INDEX_NOT_FOUND: {
        code: -3042,
        name: 'PRICE_INDEX_NOT_FOUND',
        description: ['PriceIndex not available for this margin pair.']
      },
      TRANSFER_IN_NOT_ALLOWED: {
        code: -3043,
        name: 'TRANSFER_IN_NOT_ALLOWED',
        description: ['Transferring in not allowed.']
      },
      SYSTEM_BUSY: {
        code: -3044,
        name: 'SYSTEM_BUSY',
        description: ['System busy.']
      },
      SYSTEM: {
        code: -3045,
        name: 'SYSTEM',
        description: ["The system doesn't have enough asset now."]
      },
      NOT_WHITELIST_USER: {
        code: -3999,
        name: 'NOT_WHITELIST_USER',
        description: ['This function is only available for invited users.']
      },
      CAPITAL_INVALID: {
        code: -4001,
        name: 'CAPITAL_INVALID',
        description: ['Invalid operation.']
      },
      CAPITAL_IG: {
        code: -4002,
        name: 'CAPITAL_IG',
        description: ['Invalid get.']
      },
      CAPITAL_IEV: {
        code: -4003,
        name: 'CAPITAL_IEV',
        description: ['Your input email is invalid.']
      },
      CAPITAL_UA: {
        code: -4004,
        name: 'CAPITAL_UA',
        description: ["You don't login or auth."]
      },
      CAPAITAL_TOO_MANY_REQUEST: {
        code: -4005,
        name: 'CAPAITAL_TOO_MANY_REQUEST',
        description: ['Too many new requests.']
      },
      CAPITAL_ONLY_SUPPORT_PRIMARY_ACCOUNT: {
        code: -4006,
        name: 'CAPITAL_ONLY_SUPPORT_PRIMARY_ACCOUNT',
        description: ['Support main account only.']
      },
      CAPITAL_ADDRESS_VERIFICATION_NOT_PASS: {
        code: -4007,
        name: 'CAPITAL_ADDRESS_VERIFICATION_NOT_PASS',
        description: ['Address validation is not passed.']
      },
      CAPITAL_ADDRESS_TAG_VERIFICATION_NOT_PASS: {
        code: -4008,
        name: 'CAPITAL_ADDRESS_TAG_VERIFICATION_NOT_PASS',
        description: ['Address tag validation is not passed.']
      },
      CAPITAL_WHITELIST_EMAIL_CONFIRM: {
        code: -4010,
        name: 'CAPITAL_WHITELIST_EMAIL_CONFIRM',
        description: ['White list mail has been confirmed.']
      },
      CAPITAL_WHITELIST_EMAIL_EXPIRED: {
        code: -4011,
        name: 'CAPITAL_WHITELIST_EMAIL_EXPIRED',
        description: ['White list mail is invalid.']
      },
      CAPITAL_WHITELIST_CLOSE: {
        code: -4012,
        name: 'CAPITAL_WHITELIST_CLOSE',
        description: ['White list is not opened.']
      },
      CAPITAL_WITHDRAW_2FA_VERIFY: {
        code: -4013,
        name: 'CAPITAL_WITHDRAW_2FA_VERIFY',
        description: ['2FA is not opened.']
      },
      CAPITAL_WITHDRAW_LOGIN_DELAY: {
        code: -4014,
        name: 'CAPITAL_WITHDRAW_LOGIN_DELAY',
        description: ['Withdraw is not allowed within 2 min login.']
      },
      CAPITAL_WITHDRAW_RESTRICTED_MINUTE: {
        code: -4015,
        name: 'CAPITAL_WITHDRAW_RESTRICTED_MINUTE',
        description: ['Withdraw is limited.']
      },
      CAPITAL_WITHDRAW_RESTRICTED_PASSWORD: {
        code: -4016,
        name: 'CAPITAL_WITHDRAW_RESTRICTED_PASSWORD',
        description: [
          'Within 24 hours after password modification, withdrawal is prohibited.'
        ]
      },
      CAPITAL_WITHDRAW_RESTRICTED_UNBIND_2FA: {
        code: -4017,
        name: 'CAPITAL_WITHDRAW_RESTRICTED_UNBIND_2FA',
        description: [
          'Within 24 hours after the release of 2FA, withdrawal is prohibited.'
        ]
      },
      CAPITAL_WITHDRAW_ASSET_NOT_EXIST: {
        code: -4018,
        name: 'CAPITAL_WITHDRAW_ASSET_NOT_EXIST',
        description: ["We don't have this asset."]
      },
      CAPITAL_WITHDRAW_ASSET_PROHIBIT: {
        code: -4019,
        name: 'CAPITAL_WITHDRAW_ASSET_PROHIBIT',
        description: ['Current asset is not open for withdrawal.']
      },
      CAPITAL_WITHDRAW_AMOUNT_MULTIPLE: {
        code: -4021,
        name: 'CAPITAL_WITHDRAW_AMOUNT_MULTIPLE',
        description: ['Asset withdrawal must be an %s multiple of %s.']
      },
      CAPITAL_WITHDRAW_MIN_AMOUNT: {
        code: -4022,
        name: 'CAPITAL_WITHDRAW_MIN_AMOUNT',
        description: ['Not less than the minimum pick-up quantity %s.']
      },
      CAPITAL_WITHDRAW_MAX_AMOUNT: {
        code: -4023,
        name: 'CAPITAL_WITHDRAW_MAX_AMOUNT',
        description: ['Within 24 hours, the withdrawal exceeds the maximum amount.']
      },
      CAPITAL_WITHDRAW_USER_NO_ASSET: {
        code: -4024,
        name: 'CAPITAL_WITHDRAW_USER_NO_ASSET',
        description: ["You don't have this asset."]
      },
      CAPITAL_WITHDRAW_USER_ASSET_LESS_THAN_ZERO: {
        code: -4025,
        name: 'CAPITAL_WITHDRAW_USER_ASSET_LESS_THAN_ZERO',
        description: ['The number of hold asset is less than zero.']
      },
      CAPITAL_WITHDRAW_USER_ASSET_NOT_ENOUGH: {
        code: -4026,
        name: 'CAPITAL_WITHDRAW_USER_ASSET_NOT_ENOUGH',
        description: ['You have insufficient balance.']
      },
      CAPITAL_WITHDRAW_GET_TRAN_ID_FAILURE: {
        code: -4027,
        name: 'CAPITAL_WITHDRAW_GET_TRAN_ID_FAILURE',
        description: ['Failed to obtain tranId.']
      },
      CAPITAL_WITHDRAW_MORE_THAN_FEE: {
        code: -4028,
        name: 'CAPITAL_WITHDRAW_MORE_THAN_FEE',
        description: [
          'The amount of withdrawal must be greater than the Commission.'
        ]
      },
      CAPITAL_WITHDRAW_NOT_EXIST: {
        code: -4029,
        name: 'CAPITAL_WITHDRAW_NOT_EXIST',
        description: ['The withdrawal record does not exist.']
      },
      CAPITAL_WITHDRAW_CONFIRM_SUCCESS: {
        code: -4030,
        name: 'CAPITAL_WITHDRAW_CONFIRM_SUCCESS',
        description: ['Confirmation of successful asset withdrawal.']
      },
      CAPITAL_WITHDRAW_CANCEL_FAILURE: {
        code: -4031,
        name: 'CAPITAL_WITHDRAW_CANCEL_FAILURE',
        description: ['Cancellation failed.']
      },
      CAPITAL_WITHDRAW_CHECKSUM_VERIFY_FAILURE: {
        code: -4032,
        name: 'CAPITAL_WITHDRAW_CHECKSUM_VERIFY_FAILURE',
        description: ['Withdraw verification exception.']
      },
      CAPITAL_WITHDRAW_ILLEGAL_ADDRESS: {
        code: -4033,
        name: 'CAPITAL_WITHDRAW_ILLEGAL_ADDRESS',
        description: ['Illegal address.']
      },
      CAPITAL_WITHDRAW_ADDRESS_CHEAT: {
        code: -4034,
        name: 'CAPITAL_WITHDRAW_ADDRESS_CHEAT',
        description: ['The address is suspected of fake.']
      },
      CAPITAL_WITHDRAW_NOT_WHITE_ADDRESS: {
        code: -4035,
        name: 'CAPITAL_WITHDRAW_NOT_WHITE_ADDRESS',
        description: [
          'This address is not on the whitelist. Please join and try again.'
        ]
      },
      CAPITAL_WITHDRAW_NEW_ADDRESS: {
        code: -4036,
        name: 'CAPITAL_WITHDRAW_NEW_ADDRESS',
        description: ['The new address needs to be withdrawn in {0} hours.']
      },
      CAPITAL_WITHDRAW_RESEND_EMAIL_FAIL: {
        code: -4037,
        name: 'CAPITAL_WITHDRAW_RESEND_EMAIL_FAIL',
        description: ['Re-sending Mail failed.']
      },
      CAPITAL_WITHDRAW_RESEND_EMAIL_TIME_OUT: {
        code: -4038,
        name: 'CAPITAL_WITHDRAW_RESEND_EMAIL_TIME_OUT',
        description: ['Please try again in 5 minutes.']
      },
      CAPITAL_USER_EMPTY: {
        code: -4039,
        name: 'CAPITAL_USER_EMPTY',
        description: ['The user does not exist.']
      },
      CAPITAL_NO_CHARGE: {
        code: -4040,
        name: 'CAPITAL_NO_CHARGE',
        description: ['This address not charged.']
      },
      CAPITAL_MINUTE_TOO_SMALL: {
        code: -4041,
        name: 'CAPITAL_MINUTE_TOO_SMALL',
        description: ['Please try again in one minute.']
      },
      CAPITAL_CHARGE_NOT_RESET: {
        code: -4042,
        name: 'CAPITAL_CHARGE_NOT_RESET',
        description: ['This asset cannot get deposit address again.']
      },
      CAPITAL_ADDRESS_TOO_MUCH: {
        code: -4043,
        name: 'CAPITAL_ADDRESS_TOO_MUCH',
        description: ['More than 100 recharge addresses were used in 24 hours.']
      },
      CAPITAL_BLACKLIST_COUNTRY_GET_ADDRESS: {
        code: -4044,
        name: 'CAPITAL_BLACKLIST_COUNTRY_GET_ADDRESS',
        description: ['This is a blacklist country.']
      },
      CAPITAL_GET_ASSET_ERROR: {
        code: -4045,
        name: 'CAPITAL_GET_ASSET_ERROR',
        description: ['Failure to acquire assets.']
      },
      CAPITAL_AGREEMENT_NOT_CONFIRMED: {
        code: -4046,
        name: 'CAPITAL_AGREEMENT_NOT_CONFIRMED',
        description: ['Agreement not confirmed.']
      },
      CAPITAL_DATE_INTERVAL_LIMIT: {
        code: -4047,
        name: 'CAPITAL_DATE_INTERVAL_LIMIT',
        description: ['Time interval must be within 0-90 days']
      },
      CAPITAL_WITHDRAW_USER_ASSET_LOCK_DEPOSIT: {
        code: -4060,
        name: 'CAPITAL_WITHDRAW_USER_ASSET_LOCK_DEPOSIT',
        description: [
          'As your deposit has not reached the required block confirmations, we have temporarily locked {0} asset'
        ]
      },
      ASSET_DRIBBLET_CONVERT_SWITCH_OFF: {
        code: -5001,
        name: 'ASSET_DRIBBLET_CONVERT_SWITCH_OFF',
        description: ["Don't allow transfer to micro assets."]
      },
      ASSET_ASSET_NOT_ENOUGH: {
        code: -5002,
        name: 'ASSET_ASSET_NOT_ENOUGH',
        description: ['You have insufficient balance.']
      },
      ASSET_USER_HAVE_NO_ASSET: {
        code: -5003,
        name: 'ASSET_USER_HAVE_NO_ASSET',
        description: ["You don't have this asset."]
      },
      USER_OUT_OF_TRANSFER_FLOAT: {
        code: -5004,
        name: 'USER_OUT_OF_TRANSFER_FLOAT',
        description: [
          'The residual balances have exceeded 0.001BTC, Please re-choose.',
          'The residual balances of %s have exceeded 0.001BTC, Please re-choose.'
        ]
      },
      USER_ASSET_AMOUNT_IS_TOO_LOW: {
        code: -5005,
        name: 'USER_ASSET_AMOUNT_IS_TOO_LOW',
        description: [
          'The residual balances of the BTC is too low',
          'The residual balances of %s is too low, Please re-choose.'
        ]
      },
      USER_CAN_NOT_REQUEST_IN_24_HOURS: {
        code: -5006,
        name: 'USER_CAN_NOT_REQUEST_IN_24_HOURS',
        description: ['Only transfer once in 24 hours.']
      },
      AMOUNT_OVER_ZERO: {
        code: -5007,
        name: 'AMOUNT_OVER_ZERO',
        description: ['Quantity must be greater than zero.']
      },
      ASSET_WITHDRAW_WITHDRAWING_NOT_ENOUGH: {
        code: -5008,
        name: 'ASSET_WITHDRAW_WITHDRAWING_NOT_ENOUGH',
        description: ['Insufficient amount of returnable assets.']
      },
      PRODUCT_NOT_EXIST: {
        code: -5009,
        name: 'PRODUCT_NOT_EXIST',
        description: ['Product does not exist.']
      },
      TRANSFER_FAIL: {
        code: -5010,
        name: 'TRANSFER_FAIL',
        description: ['Asset transfer fail.']
      },
      FUTURE_ACCT_NOT_EXIST: {
        code: -5011,
        name: 'FUTURE_ACCT_NOT_EXIST',
        description: ['future account not exists.']
      },
      FUTURE_ACCT_OR_SUBRELATION_NOT_EXIST: {
        code: -5012,
        name: 'FUTURE_ACCT_OR_SUBRELATION_NOT_EXIST',
        description: [
          'future account or sub relation not exists.',
          '6XXX - Savings Issues'
        ]
      },
      PARENT_SUB_HAVE_NO_RELATION: {
        code: -5021,
        name: 'PARENT_SUB_HAVE_NO_RELATION',
        description: ['This parent sub have no relation']
      },
      DAILY_PRODUCT_NOT_EXIST: {
        code: -6001,
        name: 'DAILY_PRODUCT_NOT_EXIST',
        description: ['Daily product not exists.']
      },
      DAILY_PRODUCT_NOT_ACCESSIBLE: {
        code: -6003,
        name: 'DAILY_PRODUCT_NOT_ACCESSIBLE',
        description: ["Product not exist or you don't have permission"]
      },
      DAILY_PRODUCT_NOT_PURCHASABLE: {
        code: -6004,
        name: 'DAILY_PRODUCT_NOT_PURCHASABLE',
        description: ['Product not in purchase status']
      },
      DAILY_LOWER_THAN_MIN_PURCHASE_LIMIT: {
        code: -6005,
        name: 'DAILY_LOWER_THAN_MIN_PURCHASE_LIMIT',
        description: ['Smaller than min purchase limit']
      },
      DAILY_REDEEM_AMOUNT_ERROR: {
        code: -6006,
        name: 'DAILY_REDEEM_AMOUNT_ERROR',
        description: ['Redeem amount error']
      },
      DAILY_REDEEM_TIME_ERROR: {
        code: -6007,
        name: 'DAILY_REDEEM_TIME_ERROR',
        description: ['Not in redeem time']
      },
      DAILY_PRODUCT_NOT_REDEEMABLE: {
        code: -6008,
        name: 'DAILY_PRODUCT_NOT_REDEEMABLE',
        description: ['Product not in redeem status']
      },
      REQUEST_FREQUENCY_TOO_HIGH: {
        code: -6009,
        name: 'REQUEST_FREQUENCY_TOO_HIGH',
        description: ['Request frequency too high']
      },
      EXCEEDED_USER_PURCHASE_LIMIT: {
        code: -6011,
        name: 'EXCEEDED_USER_PURCHASE_LIMIT',
        description: ['Exceeding the maximum num allowed to purchase per user']
      },
      BALANCE_NOT_ENOUGH: {
        code: -6012,
        name: 'BALANCE_NOT_ENOUGH',
        description: ['Balance not enough']
      },
      PURCHASING_FAILED: {
        code: -6013,
        name: 'PURCHASING_FAILED',
        description: ['Purchasing failed']
      },
      UPDATE_FAILED: {
        code: -6014,
        name: 'UPDATE_FAILED',
        description: ['Exceed up-limit allowed to purchased']
      },
      EMPTY_REQUEST_BODY: {
        code: -6015,
        name: 'EMPTY_REQUEST_BODY',
        description: ['Empty request body']
      },
      PARAMS_ERR: {
        code: -6016,
        name: 'PARAMS_ERR',
        description: ['Parameter err']
      },
      NOT_IN_WHITELIST: {
        code: -6017,
        name: 'NOT_IN_WHITELIST',
        description: ['Not in whitelist']
      },
      ASSET_NOT_ENOUGH: {
        code: -6018,
        name: 'ASSET_NOT_ENOUGH',
        description: ['Asset not enough']
      },
      PENDING: { code: -6019, name: 'PENDING', description: ['Need confirm'] },
      PROJECT_NOT_EXISTS: {
        code: -6020,
        name: 'PROJECT_NOT_EXISTS',
        description: ['Project not exists']
      },
      FUTURES_BAD_DATE_RANGE: {
        code: -7001,
        name: 'FUTURES_BAD_DATE_RANGE',
        description: ['Date range is not supported.']
      },
      FUTURES_BAD_TYPE: {
        code: -7002,
        name: 'FUTURES_BAD_TYPE',
        description: [
          'Data request type is not supported.',
          '20xxx - Futures/Spot Algo'
        ]
      },
      '': {
        code: -18007,
        name: '',
        description: [
          'This token is not currently supported, please re-enter',
          '21xxx - Portfolio Margin Account'
        ]
      },
      SYSTEM_MAINTENANCE: {
        code: -10001,
        name: 'SYSTEM_MAINTENANCE',
        description: ['The system is under maintenance, please try again later.']
      },
      INVALID_INPUT: {
        code: -10002,
        name: 'INVALID_INPUT',
        description: ['Invalid input parameters.']
      },
      NO_RECORDS: {
        code: -10005,
        name: 'NO_RECORDS',
        description: ['No records found.']
      },
      COIN_NOT_LOANABLE: {
        code: -10008,
        name: 'COIN_NOT_LOANABLE',
        description: ['This coin is not loanable']
      },
      COIN_NOT_COLLATERAL: {
        code: -10010,
        name: 'COIN_NOT_COLLATERAL',
        description: ['This coin can not be used as collateral.']
      },
      INSUFFICIENT_ASSET: {
        code: -10011,
        name: 'INSUFFICIENT_ASSET',
        description: ['Insufficient spot assets.']
      },
      INVALID_AMOUNT: {
        code: -10022,
        name: 'INVALID_AMOUNT',
        description: ['Invalid adjustment amount.']
      },
      INSUFFICIENT_AMOUNT: {
        code: -10041,
        name: 'INSUFFICIENT_AMOUNT',
        description: [
          'Due to high demand, there are currently insufficient loanable assets for {0}. Please adjust your borrow amount or try again tomorrow.'
        ]
      },
      DEDUCTION_FAILED: {
        code: -10015,
        name: 'DEDUCTION_FAILED',
        description: ['Collateral deduction failed.']
      },
      LOAN_FAILED: {
        code: -10016,
        name: 'LOAN_FAILED',
        description: ['Failed to provide loan.']
      },
      REPAY_EXCEED_DEBT: {
        code: -10017,
        name: 'REPAY_EXCEED_DEBT',
        description: ['Repayment amount exceeds debt.']
      },
      CONFIG_NOT_EXIST: {
        code: -10019,
        name: 'CONFIG_NOT_EXIST',
        description: ['Configuration does not exists.']
      },
      UID_NOT_EXIST: {
        code: -10020,
        name: 'UID_NOT_EXIST',
        description: ['User ID does not exist.']
      },
      ORDER_NOT_EXIST: {
        code: -10021,
        name: 'ORDER_NOT_EXIST',
        description: ['Order does not exist.']
      },
      ADJUST_LTV_FAILED: {
        code: -10023,
        name: 'ADJUST_LTV_FAILED',
        description: ['Failed to adjust LTV.']
      },
      ADJUST_LTV_NOT_SUPPORTED: {
        code: -10024,
        name: 'ADJUST_LTV_NOT_SUPPORTED',
        description: ['LTV adjustment not supported.']
      },
      REPAY_FAILED: {
        code: -10025,
        name: 'REPAY_FAILED',
        description: ['Repayment failed.']
      },
      AMOUNT_TOO_SMALL: {
        code: -10039,
        name: 'AMOUNT_TOO_SMALL',
        description: ['Repayment amount is too small.']
      },
      AMOUNT_TOO_LARGE: {
        code: -10040,
        name: 'AMOUNT_TOO_LARGE',
        description: ['Repayment amount is too large.']
      },
      QUOTA_REACHED: {
        code: -10044,
        name: 'QUOTA_REACHED',
        description: [
          'Collateral amount has reached the limit. Please reduce your collateral amount or try with other collaterals.'
        ]
      },
      REPAY_NOT_AVAILABLE: {
        code: -10034,
        name: 'REPAY_NOT_AVAILABLE',
        description: [
          'Repay with collateral is not available currently, please try to repay with borrowed coin.'
        ]
      },
      ASSET_NOT_SUPPORTED: {
        code: -10043,
        name: 'ASSET_NOT_SUPPORTED',
        description: ['{0} borrowing is currently not supported.']
      },
      COLLTERAL_REPAY_NOT_SUPPORTED: {
        code: -10045,
        name: 'COLLTERAL_REPAY_NOT_SUPPORTED',
        description: [
          'The loan coin does not support collateral repayment. Please try again later.'
        ]
      },
      EXCEED_MAX_ADJUSTMENT: {
        code: -10046,
        name: 'EXCEED_MAX_ADJUSTMENT',
        description: [
          'Collateral Adjustment exceeds the maximum limit. Please try again.'
        ]
      },
      REGION_NOT_SUPPORTED: {
        code: -10047,
        name: 'REGION_NOT_SUPPORTED',
        description: [
          'This coin is currently not supported in your location due to local regulations.',
          '13xxx - BLVT'
        ]
      },
      BLVT_FORBID_REDEEM: {
        code: -13000,
        name: 'BLVT_FORBID_REDEEM',
        description: ['Redeption of the token is forbiden now']
      },
      BLVT_EXCEED_DAILY_LIMIT: {
        code: -13001,
        name: 'BLVT_EXCEED_DAILY_LIMIT',
        description: ['Exceeds individual 24h redemption limit of the token']
      },
      BLVT_EXCEED_TOKEN_DAILY_LIMIT: {
        code: -13002,
        name: 'BLVT_EXCEED_TOKEN_DAILY_LIMIT',
        description: ['Exceeds total 24h redemption limit of the token']
      },
      BLVT_FORBID_PURCHASE: {
        code: -13003,
        name: 'BLVT_FORBID_PURCHASE',
        description: ['Subscription of the token is forbiden now']
      },
      BLVT_EXCEED_DAILY_PURCHASE_LIMIT: {
        code: -13004,
        name: 'BLVT_EXCEED_DAILY_PURCHASE_LIMIT',
        description: ['Exceeds individual 24h subscription limit of the token']
      },
      BLVT_EXCEED_TOKEN_DAILY_PURCHASE_LIMIT: {
        code: -13005,
        name: 'BLVT_EXCEED_TOKEN_DAILY_PURCHASE_LIMIT',
        description: ['Exceeds total 24h subscription limit of the token']
      },
      BLVT_PURCHASE_LESS_MIN_AMOUNT: {
        code: -13006,
        name: 'BLVT_PURCHASE_LESS_MIN_AMOUNT',
        description: ['Subscription amount is too small']
      },
      BLVT_PURCHASE_AGREEMENT_NOT_SIGN: {
        code: -13007,
        name: 'BLVT_PURCHASE_AGREEMENT_NOT_SIGN',
        description: ['The Agreement is not signed', '12xxx - Liquid Swap']
      },
      'TOO MANY REQUESTS': {
        code: -12014,
        name: 'TOO MANY REQUESTS',
        description: ['More than 1 request in 2 seconds', '18xxx - Binance Code']
      },
      USER_IS_NOT_UNIACCOUNT: {
        code: -21001,
        name: 'USER_IS_NOT_UNIACCOUNT',
        description: ['Request ID is not a Portfolio Margin Account.']
      },
      UNI_ACCOUNT_CANT_TRANSFER_FUTURE: {
        code: -21002,
        name: 'UNI_ACCOUNT_CANT_TRANSFER_FUTURE',
        description: [
          "Portfolio Margin Account doesn't support transfer from margin to futures."
        ]
      },
      NET_ASSET_MUST_LTE_RATIO: {
        code: -21003,
        name: 'NET_ASSET_MUST_LTE_RATIO',
        description: ['Fail to retrieve margin assets.']
      },
      USER_NO_LIABILITY: {
        code: -21004,
        name: 'USER_NO_LIABILITY',
        description: ['User doesn’t have portfolio margin bankruptcy loan']
      },
      NO_ENOUGH_ASSET: {
        code: -21005,
        name: 'NO_ENOUGH_ASSET',
        description: [
          'User’s spot wallet doesn’t have enough BUSD to repay portfolio margin bankruptcy loan'
        ]
      },
      HAD_IN_PROCESS_REPAY: {
        code: -21006,
        name: 'HAD_IN_PROCESS_REPAY',
        description: [
          'User had portfolio margin bankruptcy loan repayment in process'
        ]
      },
      IN_FORCE_LIQUIDATION: {
        code: -21007,
        name: 'IN_FORCE_LIQUIDATION',
        description: [
          'User failed to repay portfolio margin bankruptcy loan since liquidation was in process'
        ]
      }
    }
  }

}

module.exports = Spot;