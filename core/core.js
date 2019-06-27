const Queue = require('../utils/queue').Queue
const DateUtils = require('../utils/dateUtils').DateUtils;

function Core(queueLength, configParams) {

    this.queueLength = queueLength;

    this.configParams = configParams;
    
    this.queue = new Queue();

    this.dateUtils = new DateUtils();

    this.minPriceAverage;

    this.lastPrice;

    this.currentPrice;

    this.bought = false;

    this.buyPrice = 0.0;

    this.sellPrice = 0.0;

    this.refreshData = (ticker) => {
        let atualizou = this.queue.inserirDiferente(ticker);
        if(atualizou)
            console.log(`Queue atualizada: ${this.queue.lista.length}`)
        else
            console.log(`Queue não atualizada, tickers iguais.`)
        if(this.queue.lista.length > queueLength){

            this.queue.removerPrimeiro()
            let sum = this.queue.lista.reduce((tickerA,tickerB) => tickerA.last + tickerB.last, 0)
            this.mimPriceAverage = sum / this.queue.lista.length
            this.lastPrice = this.queue.lerNaPosicao(this.queue.lista.length - 2).last;
            this.currentPrice = ticker.last;
            Console.log(`Valores: 
                Ultimo preço: ${this.lastPrice}
                Valor atual: ${this.currentPrice}
                Média do menor preço: ${this.mimPriceAverage}`)

        }        
    }

    this.canBuy = () => {
        return this.lastPrice <= this.mimPriceAverage 
                && !this.bought;
    }

    this.canSell = () =>{        
        if(this.bought 
                && this.currentPrice > this.getMinPriceToSell()){
            console.log(`Já estou no lucro! Agora vou esperar começar a cair pra vender.
                        Preço atual: ${this.currentPrice}
                        Mínimo preço de venda: ${this.getMinPriceToSell()}`);
            if(this.currentPrice < this.lastPrice 
                    && this.currentPrice <= this.getPriceMinusTolerance()){
                        console(`Vou vender!
                                Preço de venda: ${this.currentPrice}
                                Preço menos a tolerância de queda: ${this.getPriceMinusTolerance()}`)
                        return true;
                    }
        }
        console.log(`Comprei: ${this.bought}`);
        if(this.bought){
            console.log(`
                Ainda não é uma boa pra vender.
                Preço atual: ${this.currentPrice}
                Preço com lucro: ${this.getMinPriceToSell()}`)
        }
        return false;
    }

    this.getPriceMinusTolerance = () => {
        return this.currentPrice - this.currentPrice * configParams.tolerance;
    }

    this.getMinPriceToSell = () =>{
        return this.buyPrice * configParams.taxes * configParams.profit;
    }

    this.execute = (ticker) => {
        this.refreshData(ticker);
        if(this.canBuy()){
            console.log(`Criaria uma ordem de compra às ${this.dateUtils.getCurrentDateTime()} com o preço de ${this.currentPrice}`);
            this.buyPrice = this.currentPrice;
            this.bought = true;
        }else if(this.canSell()){
            console.log(`Criei uma ordem de venda às ${this.dateUtils.getCurrentDateTime()} com o preço de ${this.currentPrice}`);
            this.sellPrice = this.currentPrice;
            this.bought = false;
        }
    }

}

module.exports = { Core }