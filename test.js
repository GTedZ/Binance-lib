const Binance = require('./binanceLibCopy');
const binance = new Binance(
    '2odJcYgwLlYWTyrTZ32renKogWrJfchYJszxnmmLDi6gLMJZ4R2jpooJScZ0R44E',
    '9KdJcYgwLlYWTyrTZ3gWrJfchYOajKwhJstxnmmLDi6gLMJZ4R2jpooJScZ0R44E',
    {
        useServerTime: true
    }
);

let recvWindow = 2000;
setTimeout(hi, 5000);
async function hi() {
    console.log(recvWindow)
    let resp;
    resp = await binance.userTrades('ANTUSDT', 5, { recvWindow: recvWindow });
    console.log(resp.error);
    recvWindow-=100;
    hi();
}