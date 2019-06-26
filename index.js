require("dotenv-safe").load()

const MercadoBitcoin = require("./api").MercadoBitcoin
const MercadoBitcoinTrade = require("./api").MercadoBitcoinTrade
const Core = require('./core/core').Core
const DateUtils = require('./utils/dateUtils').DateUtils

var infoApi = new MercadoBitcoin({ currency: 'LTC' })
var tradeApi = new MercadoBitcoinTrade({
    currency: 'LTC',
    key: process.env.KEY,
    secret: process.env.SECRET,
    pin: process.env.PIN
})
var configParams = {
    taxes: process.env.TAXES,
    profit: process.env.PROFIT,
    tolerance: process.env.TOLERANCE
}
var core = new Core(process.env.QUEUE_LENGTH, configParams);
var dateUtils = new DateUtils();
//espera a moeda que estamos negociando, o preço de uma unidade dela, se é uma compra ou venda (true/false) e um callback.
function getQuantity(coin, price, isBuy, callback){
    price = parseFloat(price)
    coin = isBuy ? 'brl' : coin.toLowerCase()

    tradeApi.getAccountInfo((response_data) => {
        var balance = parseFloat(response_data.balance[coin].available).toFixed(5)
		balance = parseFloat(balance)
        if(isBuy && balance < 50) return console.log('Sem saldo disponível para comprar!')
        console.log(`Saldo disponível de ${coin}: ${balance}`)
        
        if(isBuy) balance = parseFloat((balance / price).toFixed(5))
        callback(parseFloat(balance) - 0.00001)//tira a diferença que se ganha no arredondamento
    }, 
    (data) => console.log(data))
}

setInterval(() => 
   infoApi.ticker((response) => {
       console.log(`Comecei a rodar ${dateUtils.getCurrentDateTime()}`)
       console.log(response.ticker)
       core.execute(response.ticker)

       //importante acertar o valor da moeda
/*       if(response.ticker.sell <= valor_moeda){
           getQuantity('BRL', response.ticker.sell, true, (qty) => {
                tradeApi.placeBuyOrder(qty, response.ticker.sell, 
                    (data) => {
                        console.log('Ordem de compra inserida no livro. ' + data)
                        //operando em STOP
                        tradeApi.placeSellOrder(data.quantity, response.ticker.sell * parseFloat(process.env.PROFITABILITY), 
                            (data) => console.log('Ordem de venda inserida no livro. ' + data),
                            (data) => console.log('Erro ao inserir ordem de venda no livro. ' + data))
                    },
                    (data) => console.log('Erro ao inserir ordem de compra no livro. ' + data))
           })
       }
       else
            console.log('Ainda muito alto, vamos esperar pra comprar depois.')*/
   }),
   process.env.CRAWLER_INTERVAL
)
