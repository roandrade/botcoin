const Queue = require('../utils/queue').Queue
const Candle = require('./candle').Candle;
const DateUtils = require('../utils/dateUtils').DateUtils;

function Market(){

    this.dateUtils = new DateUtils();

    this.hasAverages = false;

    this.candles = new Queue();

    this.openedCandle;

    this.getLastPrice = () => {
        return this.candles.lerNaPosicao(this.candles.length() - 1) ? 
                    this.candles.lerNaPosicao(this.candles.length() - 1).average :
                    'Não há preço anterior';
    };

    this.getCurrentPrice = () => {
        return this.candles.lerNaPosicao(this.candles.length()) ? 
                    this.candles.lerNaPosicao(this.candles.length()).average : 
                    'Não há último preço';
    };

    this.refresh = (ticker) => {

        if(this.dateUtils.isTimeToOpenClose(ticker.date)){
            console.log('Abri ou fechei um candle.')
            if(this.openedCandle){
                this.closeCandle(ticker);
                this.hasAverages = parseInt(process.env.LONG_QUEUE_LENGTH) == this.candles.length();
                if(this.candles.length() > parseInt(process.env.LONG_QUEUE_LENGTH)){
                    this.candles.removerPrimeiro();
                }
            }
            this.openedCandle = new Candle();
            this.openedCandle.open(ticker);
        }

    }

    this.createCandle = (ticker) => {
        let candle = new Candle();
        candle.open(ticker, this.dateUtils.getDateFrom(ticker.date));        
    }

    this.closeCandle = (ticker) => {
        candle.close(ticker, this.dateUtils.getDateFrom(ticker.date));
        this.candles.inserir(candle);
    }

    this.getShortTermAverage = () => {
        if(this.hasAverages){
            let shortTermPrices = this.candles.lista.slice(this.candles.length() - parseInt(process.env.SHORT_QUEUE_LENGTH), this.candles.length());
            let sum = shortTermPrices.lista.reduce((acumulator, currentTicker) => acumulator + parseFloat(currentTicker.last), 0);
            return sum / shortTermPrices.length();
        }
        return `Ainda não há média de curto prazo: ${this.candles.length()} candles`;
    }

    this.getLongTermAverage = () => {
        if(this.hasAverages){
            let longTermPrices = this.candles.lista.slice(this.candles.length() - parseInt(process.env.LONG_QUEUE_LENGTH), this.candles.length());
            let sum = longTermPrices.lista.reduce((acumulator, currentTicker) => acumulator + parseFloat(currentTicker.last), 0);
            return sum / longTermPrices.length();        
        }
        return `Ainda não há média de longo prazo: ${this.candles.length()} candles`;
    }

    this.isAveragesReady = () => {
        return this.hasAverages;
    }
}

module.exports = { Market }