const Queue = require('../utils/queue')
const DateUtils = require('../utils/dateUtils');

var Core = (queueLength, configParams) => {
    
    this.queue = new Queue();

    this.dateUtils = new DateUtils();

    this.minPriceAverage;

    this.lastPrice;

    this.currentPrice;

    this.bought = false;

    this.buyPrice = 0.0;

    this.sellPrice = 0.0;

    this.refreshData = (ticker) => {
        queue.inserir(ticker);
        if(queue.lista.length > queueLength){

            queue.removerPrimeiro()
            let sum = queue.lista.reduce((tickerA,tickerB) => tickerA.low + tickerB.low, 0)
            this.mimPriceAverage = sum / queue.lista.length
            this.lastPrice = queue.lerNaPosicao(queue.lista.length - 2).last;
            this.currentPrice = ticker.last;

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
        console.log(`Comprei: ${this.bought}
                     Ainda não é uma boa pra vender.
                     Preço atual: ${this.currentPrice}
                     Preço com lucro: ${this.getMinPriceToSell()}`)
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