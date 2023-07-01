console.log('RUNNING GLOBALS TEST:\n\n');

// TODO

const Binance = require('../Binance');
const binance = new Binance(
    '',
    '',
    {
        fetchFloats: true,
        extraTimestampOffset: 0,
        recvWindow: 5000,
        showQueries: true,
        showWSQueries: true,
        useServerTime: false
    }
);

binance.futures.ping().then(console.log)