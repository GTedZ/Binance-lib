const ws = require('ws');
const EventEmitter = require('events');

const Error = require('../essentials/Error');


const SECOND = 1000;
const MINUTE = 60 * SECOND;

const TIMEOUT = 500;


class WS {

    /**
     * @type {ws.WebSocket}
     */
    socket = null;

    /**
     * @type {EventEmitter}
     */
    mainObj_eventEmitter;

    connectionHealth_interval;

    /**
     * @param {string} baseURL 
     * @param {Set} paths_set 
     * @param {EventEmitter} mainObj_eventEmitter 
     */
    constructor(baseURL, paths_set, mainObj_eventEmitter) {
        this.mainObj_eventEmitter = mainObj_eventEmitter;

        let pathString = '';

        const paths_arr = Array.from(paths_set);
        if (paths_arr.length === 0) pathString = '';
        else if (paths_arr.length === 1) pathString = '/ws/';
        else pathString = '/stream?streams=';

        pathString += paths_arr.join('/');

        this.socket = new ws(baseURL + pathString);

        this.setUpListeners();
        this.setUp_ping_pong_listeners();
    }

    setUpListeners() {
        this.socket.on(
            'open'
            ,
            () => this.mainObj_eventEmitter.emit('open')
        );

        this.socket.on(
            'error'
            ,
            () => this.mainObj_eventEmitter.emit('error')
        );

        this.socket.on(
            'close'
            ,
            () => this.mainObj_eventEmitter.emit('close')
        );

        this.socket.on(
            'message'
            ,
            (msg) => this.mainObj_eventEmitter.emit('msg', msg)
        )
    }

    setUp_ping_pong_listeners() {
        this.socket.on(
            'ping'
            ,
            () => {
                this.socket.pong();
            }
        );

        this.connectionHealth_interval = setInterval(
            async () => {

                const isConnectionHealthy = await new Promise(
                    (resolve) => {
                        let ponged = false;

                        setTimeout(() => resolve(false), 15 * SECOND);

                        this.socket.once(
                            'pong'
                            ,
                            () => {
                                ponged = true;
                                resolve(true);
                            }
                        );

                        if (this.socket.readyState === this.socket.OPEN) this.socket.ping();

                        setTimeout(
                            () => {
                                if (!ponged && this.socket.readyState === this.socket.OPEN) this.socket.ping();
                            }
                            ,
                            1 * SECOND
                        );
                        setTimeout(
                            () => {
                                if (!ponged && this.socket.readyState === this.socket.OPEN) this.socket.ping();
                            }
                            ,
                            5 * SECOND
                        );
                        setTimeout(
                            () => {
                                if (!ponged && this.socket.readyState === this.socket.OPEN) this.socket.ping();
                            }
                            ,
                            10 * SECOND
                        );
                    }
                )

                if (!isConnectionHealthy) this.socket.close();

            }
            ,
            2 * MINUTE
        )
    }

    /**
     * @param {Object|string} object 
     * @param {function} cb_onError
     */
    async send(object, cb_onError) {
        const msg = typeof object === 'object' ? JSON.stringify(object) : object;

        if (this.socket.readyState !== ws.OPEN) {
            await delay(TIMEOUT);
            this.send(msg);
            return
        }

        this.socket.send(
            msg
            ,
            (err) => {
                if (err) {
                    console.log({ errFrom_websocket_send: err })
                    if (typeof cb_onError === 'function') cb_onError(err);
                }
            }
        );
    }

    close() {
        clearInterval(this.connectionHealth_interval);
        this.socket.close();
    }

}

/////////////

class WS_Connection {

    isAlive = true;

    /**
     * @fires #open
     * @fires #message
     * @fires #close
     * @fires #error
     * @fires #reconnecting
     * @fires #reconnected
     * @listens #msg
     */
    eventEmitter = new EventEmitter();

    /**
     * @type {WS}
     */
    Websocket = null;

    /**
     * @type {string}
     */
    baseURL;

    /**
     * @type {Set}
     */
    paths = new Set();

    /**
     * @type { Map <number|string, { resolve:function }> }
     */
    IDs_awaitingResponse = new Map();


    constructor(baseURL, path_or_paths) {
        this.baseURL = baseURL;
        if (Array.isArray(path_or_paths)) for (const path of path_or_paths) this.paths.add(path);
        else this.paths.add(path_or_paths)

        this.Websocket = new WS(baseURL, this.paths, this.eventEmitter);

        this.eventEmitter.on(
            'close'
            ,
            () => setTimeout(() => this.reconnect(), 500)
        )

        this.eventEmitter.on(
            'error'
            ,
            () => { }
        )

        this.eventEmitter.on(
            'msg'
            ,
            (message) => {
                try {
                    const object = JSON.parse(message);

                    if (typeof object.id !== 'undefined' && (typeof object.result !== 'undefined' || typeof object.error !== 'undefined')) {
                        const ID = this.IDs_awaitingResponse.get(object.id);
                        if (!ID) return;
                        this.IDs_awaitingResponse.delete(object.id);
                        ID.resolve(object);
                        return;
                    }
                    if (typeof object.stream !== 'undefined' && typeof object.data !== 'undefined') return this.eventEmitter.emit('message', object.data);

                    return this.eventEmitter.emit('message', object);

                } catch (err) {
                    return;
                }
            }
        )
    }

    /**
     * - Closes the websocket connection and terminates it FOR GOOD
     */
    close() {
        this.isAlive = false;
        this.Websocket.close();
    }

    /**
     * **IGNORE**
     * - This force closes and reconnects the websocket connection
     * - DOES NOT WORK IF `.close()` was ever called.
     */
    reconnect() {
        if (!this.isAlive) return;

        this.Websocket.close();

        this.eventEmitter.emit('reconnecting');

        this.Websocket = new WS(this.baseURL, this.paths, this.eventEmitter);

        this.Websocket.socket.once('open', () => this.eventEmitter.emit('reconnected'));
    }

    /**
     * @param {object} object 
     */
    async sendPrivateMessage(object) {
        if (!this.isAlive) return;

        let ID;
        while (this.IDs_awaitingResponse.has(ID = Math.floor(Math.random() * 1_000_000))) { }
        object.id = ID;

        return new Promise(
            (resolve) => {
                this.IDs_awaitingResponse.set(ID, { resolve });

                setTimeout(
                    () => {
                        resolve(
                            {
                                error: {
                                    code: -1,
                                    msg: 'No response was received within 10 seconds'
                                }
                            }
                        )
                    },
                    10 * SECOND
                );

                this.Websocket.send(
                    object
                    ,
                    (err) => resolve(
                        {
                            error: {
                                code: -1,
                                msg: `Websocket was unable to send the message: ${err}`
                            }
                        }
                    )
                );
            }
        )
    }

}

/**
 * This is for normal websocket connections
 */
class Binance_WS_Connection extends WS_Connection {

    constructor(baseURL, path_or_paths) {
        super(baseURL, path_or_paths)
    }

    /**
     * @param {string|string[]} paths 
     */
    subscribe(paths) {
        if (typeof paths === 'undefined') return new Error('paths', 'REQUIRED');

        if (typeof paths === 'string') paths = [paths];
        if (!Array.isArray(paths)) return new Error(`'paths' must be an Array or a String`);

        return this.sendPrivateMessage(
            {
                method: 'SUBSCRIBE',
                params: paths
            }
        )
    }

    /**
     * @param {string|string[]} paths 
     */
    unsubscribe(paths) {
        if (typeof paths === 'undefined') return new Error('paths', 'REQUIRED');

        if (typeof paths === 'string') paths = [paths];
        if (!Array.isArray(paths)) return new Error(`'paths' must be an Array or a String`);

        return this.sendPrivateMessage(
            {
                method: 'UNSUBSCRIBE',
                params: paths
            }
        )
    }

    list_subscriptions() {
        return this.sendPrivateMessage(
            {
                method: 'LIST_SUBSCRIPTIONS'
            }
        )
    }

    set_property() {

    }

    get_property() {

    }

}

function delay(ms) {
    return new Promise(r => setTimeout(ms, r));
}


module.exports = {
    WS_Connection,
    Binance_WS_Connection
};