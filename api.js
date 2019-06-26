//MERCADO BITCOIN
// tricker- retorna estado atual do mercado
//     sell- menor valor de venda
//     buy- maior valor de compra
//     last- valor da ultima transação
//     high- maior valor da moeda nas últimas 24h
//     low- maior valor da moeda nas últimas 24h
//orderbook- retorna o livro de ordens( ordens de compra decrecente e ordens de venda crescentes )
//trades- retorna ultimas operações realizadas 

const unirest = require('unirest')
const crypto = require('crypto')
const qs = require('querystring')

const ENDPOINT_API = 'https://www.mercadobitcoin.com.br/api/'
const ENDPOINT_TRADE_PATH = "/tapi/v3/"
const ENDPOINT_TRADE_API = 'https://www.mercadobitcoin.net' + ENDPOINT_TRADE_PATH


var MercadoBitcoinTrade = function (config) {
    this.config = {
        KEY: config.key,
        SECRET: config.secret,
        PIN: config.pin,
        CURRENCY: config.currency
    }
}

var MercadoBitcoin = function (config) {
    this.config = {
        CURRENCY: config.currency
    }
}

MercadoBitcoinTrade.prototype = {

    //pega informações da sua conta, especialmente o seu saldo atual em cada moeda, incluindo BRL;
    getAccountInfo: function (success, error) {
        this.call('get_account_info', {}, success, error)
    },

    //traz as suas últimas ordens no mercado, tanto de compra quanto de venda 
    //e incluindo as que estão pendentes e canceladas, sendo que você pode filtrar livremente pelos parâmetros que discutirei mais tarde;
    listMyOrders: function (parameters, success, error) {
        this.call('list_orders', parameters, success, error)
    },
    //criar uma nova ordem de compra no livro de negociações. Caso haja disponibilidade (tem moedas sendo vendidas ao preço que deseja pagar), 
    //a ordem será executada imediatamente. Caso contrário, ela vai pro livro e seu saldo fica bloqueado para honrar a compra;
    placeBuyOrder: function (qty, limit_price, success, error) {
        this.call('place_buy_order', { coin_pair: `BRL${this.config.CURRENCY}`, quantity: ('' + qty).substr(0, 10), limit_price: '' + limit_price }, success, error)
    },
    //cria uma nova ordem de venda no livro de negociações. Caso haja disponibilidade (tem ordens de compra ao preço que você deseja vender), 
    //a ordem será executada imediatamente. Caso contrário, ela vai pro livro e seu saldo na criptomoeda fica bloqueado para honrar a venda;
    placeSellOrder: function (qty, limit_price, success, error) {
        this.call('place_sell_order', { coin_pair: `BRL${this.config.CURRENCY}`, quantity: ('' + qty).substr(0, 10), limit_price: '' + limit_price }, success, error)
    },

    //cancela uma ordem sua no livro de negociações;
    cancelOrder: function (orderId, success, error) {
        this.call('cancel_order', { coin_pair: `BRL${this.config.CURRENCY}`, order_id: orderId }, success, error)
    },

    call: function (method, parameters, success, error) {
        var now = Math.round(new Date().getTime() / 1000)
        var queryString = qs.stringify({ 'tapi_method': method, 'tapi_nonce': now })
        if (parameters) queryString += '&' + qs.stringify(parameters)

        var signature = crypto.createHmac('sha512', this.config.SECRET)
            .update(ENDPOINT_TRADE_PATH + '?' + queryString)
            .digest('hex')

        unirest.post(ENDPOINT_TRADE_API)
            .headers({ 'TAPI-ID': this.config.KEY })
            .headers({ 'TAPI-MAC': signature })
            .send(queryString)
            .end(function (response) {
                if (response.body) {
                    if (response.body.status_code === 100 && success)
                        success(response.body.response_data)
                    else if (error)
                        error(response.body.error_message)
                    else
                        console.log(response.body)
                }
                else console.log(response)
            })
    }
}

MercadoBitcoin.prototype = {

    ticker: function (success) {
        this.call('ticker', success);
    },

    orderBook: function (success) {
        this.call('orderbook', success);
    },

    trades: function (success) {
        this.call('trades', success);
    },

    call: function (method, success) {

        unirest.get(ENDPOINT_API + this.config.CURRENCY + '/' + method)
            .headers('Accept', 'application/json')
            .end(function (response) {
                try {
                    success(JSON.parse(response.raw_body));
                }
                catch (ex) { console.log(ex) }
            });
    }
}

module.exports = { MercadoBitcoin, MercadoBitcoinTrade }