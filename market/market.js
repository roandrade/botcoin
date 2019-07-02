const Queue = require('../utils/queue').Queue

function Market(){

    this.shortTermPrices = new Queue();

    this.longTermPrices = new Queue();

    this.hasShortTermAverage = false;

    this.hasLongTermAverage = false;

    this.lastPrice = 0.0;

    this.currentPrice = 0.0;

    this.refresh = (ticker) => {
        this.shortTermPrices.inserirDiferente(ticker);
        this.currentPrice = ticker.last;
        this.lastPrice = this.shortTermPrices.length() > 1 ? this.shortTermPrices.lerNaPosicao(this.shortTermPrices.length() - 2).last : 0.0;
        if(this.shortTermPrices.length() > parseInt(process.env.SHORT_QUEUE_LENGTH)){
            this.shortTermPrices.removerPrimeiro();
            this.hasShortTermAverage = true;
        }
        this.longTermPrices.inserirDiferente(ticker);
        if(this.longTermPrices.length() > parseInt(process.env.LONG_QUEUE_LENGTH)){
            this.longTermPrices.removerPrimeiro();
            this.hasLongTermAverage = true;
        }
    }

    this.getShortTermAverage = () => {
        if(this.hasShortTermAverage){
            let sum = this.shortTermPrices.lista.reduce((acumulator, currentTicker) => acumulator + parseFloat(currentTicker.last), 0);
            return sum / this.shortTermPrices.length();
        }
        return `Ainda não há média de curto prazo: ${this.shortTermPrices.length()} preços`;
    }

    this.getLongTermAverage = () => {
        if(this.hasLongTermAverage){
            let sum = this.longTermPrices.lista.reduce((acumulator, currentTicker) => acumulator + parseFloat(currentTicker.last), 0);
            return sum / this.longTermPrices.length();        
        }
        return `Ainda não há média de longo prazo: ${this.longTermPrices.length()} preços`;
    }

    this.isAveragesReady = () => {
        return this.hasLongTermAverage && this.hasShortTermAverage;
    }
}

module.exports = { Market }