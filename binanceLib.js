module.exports = everything;


// timeInForce is GTX for post, and GTC for limit orders apparently

function everything(APIKey, APISecret) {
    const axios = require('axios')
    const crypto = require('crypto');
    const recvWindow = 5000;
    var APIKEY = APIKey, APISECRET = APISecret;
    console.log({ APIKEY }, '\n', { APISECRET })

    let base = 'https://api.binance.com';
    let wapi = 'https://api.binance.com';
    let sapi = 'https://api.binance.com';
    let fapi = 'https://fapi.binance.com';
    let dapi = 'https://dapi.binance.com';

    return {
        futuresMarketBuy: async function (symbol, quantity) {
            let params = {
                symbol: symbol,
                quantity: quantity,
                side: 'BUY',
                type: 'MARKET',
                // timeInForce: 'GTX',
                newOrderRespType: "RESULT"
            }

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
            console.log(query)
            return this.sendRequest(URL, 'post', headers);
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
                return err
            }
        }
    }
}