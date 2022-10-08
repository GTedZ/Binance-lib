const Binance = require('./binanceLib');
const binance = new Binance(
    '2odJcYgwLlYWTyrTZ32renKogWrJfchYJstxnmmLDi6gLMJZ4R2jpooJScZ0R44E',
    'Nd41g9cw9a1CrkNsO8Igr71vM0fwxvHLrzPOsMRWeTMq4Rj84QGRXgZ9nTLoRfKy',
    {
        // useServerTime: true,
        hedgeMode: false,
        extraResponseInfo: true
    }
);

// let recvWindow = 2000;
// setTimeout(hi, 5000);
// setTimeout(hi, 2000);
hi();
async function hi() {
    let x;

    //
    x = await binance.futuresUserTrades('ccc')
    //
    console.log(x);
}