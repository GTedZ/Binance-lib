const binanceLib = require('./binanceLib')(
    '2odJcYgwLlYWTyrTZ32renKogWrJfchYJstxnmmLDi6gLMJZ4R2jpooJScZ0R44E',
    'Nd41g9cw9a1CrkNsO8Igr71vM0fwxvHLrzPOsMRWeTMq4Rj84QGRXgZ9nTLoRfKy',
    true
)

binanceLib.futuresMarketBuy('BTCUSDT',0.001,false, 'LONG ').then(x => console.log(''))