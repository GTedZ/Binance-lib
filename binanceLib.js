module.exports = everything;


// timeInForce is GTX for post, and GTC for limit orders apparently

function everything(APIKey, APISecret, hedge = false) {
    const axios = require('axios')
    const crypto = require('crypto');
    const bigInt = require('json-bigint')({ storeAsString: true });
    const recvWindow = 5000;
    var APIKEY = APIKey, APISECRET = APISecret;

    let base = 'https://api.binance.com';
    let wapi = 'https://api.binance.com';
    let sapi = 'https://api.binance.com';
    let fapi = 'https://fapi.binance.com';
    let dapi = 'https://dapi.binance.com';

    return {
        hedgeMode: hedge,

        futuresMarketBuy: async function (symbol, quantity, reduceOnly = false, positionSide = false) {
            let params = {
                symbol: symbol,
                quantity: quantity,
                side: 'BUY',
                type: 'MARKET',
                // timeInForce: 'GTX',
                newOrderRespType: "RESULT"
            }

            if (this.hedgeMode && positionSide) {
                console.log('setting positionSide', 'hedgeMode:', this.hedgeMode, 'positionSide', positionSide)
                params.positionSide = positionSide;
            } else {
                console.log('NOT SETTING POSITIONSIDE')
                if (reduceOnly) params.reduceOnly = 'true';
            }

            return this.createFuturesOrder(params)
        },

        futuresMarketSell: async function (symbol, quantity, reduceOnly = false, positionSide = undefined) {
            let params = {
                symbol: symbol,
                quantity: quantity,
                side: 'SELL',
                type: 'MARKET',
                // timeInForce: 'GTX',
                newOrderRespType: "RESULT"
            }

            if (this.hedgeMode && positionSide) {
                params.positionSide = positionSide;
            } else if (reduceOnly) params.reduceOnly = 'true';

            return this.createFuturesOrder(params)
        },

        createFuturesOrder: async function (params) {
            let baseURL = fapi + '/fapi/v1/order';
            let query = '', signature, URL, headers = {
                'Content-type': 'application/x-www-form-urlencoded'
            };
            headers['X-MBX-APIKEY'] = APIKEY;

            params.recvWindow = recvWindow;
            params.timestamp = new Date().getTime() + 1000;
            query = this.makeQueryString(params);
            signature = crypto.createHmac('sha256', APISECRET).update(query).digest('hex'); // HMAC hash header
            URL = `${baseURL}?${query}&signature=${signature}`;

            let response = await this.sendRequest(URL, 'post', headers);
            if (response.error) return response; else return bigInt.parse(bigInt.stringify(response.data));
        },

        makeQueryString: (q) => {
            return Object.keys(q)
                .reduce((a, k) => {
                    if (Array.isArray(q[k])) {
                        q[k].forEach(v => {
                            a.push(k + "=" + encodeURIComponent(v))
                        })
                    } else if (q[k] !== undefined) {
                        a.push(k + "=" + encodeURIComponent(q[k]));
                    }
                    return a;
                }, [])
                .join("&");

        },

        sendRequest: async function (URL, method, headers) {
            try {
                return await axios[method](URL, '', { headers: headers })
            } catch (err) {
                if (err.response && err.response.data && err.response.data.msg.includes("positionSide")) {
                    console.log('received positionSide error, switching off switching hedgeMode')
                    this.hedgeMode = this.hedgeMode ? false : true;
                    err.hedgeMode = true;
                    err.isHedgeMode = hedgeMode;
                }
                else if (err.response && err.response.data && err.response.data.msg.includes("Order's position side")) {
                    console.log('received orders position side does not match users setting, switching to hedgeMode')
                    this.hedgeMode = this.hedgeMode ? false : true;
                    err.hedgeMode = true;
                    err.isHedgeMode = this.hedgeMode;
                }
                return { error: err }
            }
        }
    }
}