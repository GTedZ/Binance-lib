module.exports = everything;


// timeInForce is GTX for post, and GTC for limit orders apparently

function everything(APIKey, APISecret) {
    const crypto = require('crypto');
    const recvWindow = 5000;
    const APIKey = APIKey, APISecret = APISecret;

    return {
        futuresMarketBuy: async (symbol, quantity) => {
            let params = {
                symbol: symbol,
                quantity: quantity,
                side: 'BUY',
                type: 'MARKET',
                timeInForce: 'GTX'
            }

            return this.createFuturesOrder(params,)
        },

        createFuturesOrder: async (params) => {
            let query = '', headers = {
                'User-Agent': userAgent,
                'Content-type': 'application/x-www-form-urlencoded'
            };
            headers['X-MBX-APIKEY'] = APIKey;

            params.recvWindow = recvWindow;
            params.timestamp = new Date().getTime() + Binance.info.timeOffset;
            query = this.makeQueryString(params);

            console.log(query)
        },

        makeQueryString: (q) => {
            Object.keys(q)
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

        }
    }
}