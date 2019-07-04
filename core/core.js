const Market = require('../market/market').Market;
const DateUtils = require('../utils/dateUtils').DateUtils;
const Email = require('../mail/email').Email;

function Core(configParams) {

    this.configParams = configParams;
    
    this.dateUtils = new DateUtils();

    this.market = new Market();

    this.bought = false;

    this.buyPrice = 0.0;

    this.sellPrice = 0.0;

    this.emailService = new Email();

    this.refresh = (ticker) => {

        this.market.refresh(ticker);
        console.log(`Valores: 
            Ultimo preço: ${this.market.lastPrice}
            Valor atual: ${this.market.currentPrice}
            Média de curto prazo: ${this.market.getShortTermAverage()}
            Média de longo prazo: ${this.market.getLongTermAverage()}`)

    }

    this.canBuy = () => {
        return !this.bought 
                && this.market.isAveragesReady() 
                && this.market.getShortTermAverage() > this.market.getLongTermAverage()
                && this.market.currentPrice > this.market.lastPrice; // preço não pode estar em queda.
    }

    this.canSell = () =>{        
        if(this.bought 
                && this.market.currentPrice > this.getMinPriceToSell()){
            console.log(`Já estou no lucro! Agora vou esperar começar a cair pra vender.
                        Preço atual: ${this.market.currentPrice}
                        Mínimo preço de venda: ${this.getMinPriceToSell()}`);
            if(this.market.currentPrice < this.market.lastPrice 
                    && this.market.currentPrice <= this.getPriceMinusTolerance()){
                        console(`Vou vender!
                                Preço de venda: ${this.market.currentPrice}
                                Preço menos a tolerância de queda: ${this.getPriceMinusTolerance()}`)
                        return true;
                    }                    
        }
        return false;
    }

    this.getPriceMinusTolerance = () => {
        return parseFloat(this.market.lastPrice) - parseFloat(this.market.lastPrice) * parseFloat(this.configParams.tolerance);
    }

    this.getMinPriceToSell = () =>{
        return parseFloat(this.buyPrice) * parseFloat(this.configParams.taxes) * parseFloat(this.configParams.profit);
    }

    this.execute = (ticker) => {
        this.refresh(ticker);
        if(this.canBuy()){
            console.log(`Criaria uma ordem de compra às ${this.dateUtils.getCurrentDateTime()} com o preço de ${this.market.currentPrice}`);
            this.buyPrice = this.market.currentPrice;
            this.bought = true;
            this.emailService.setSubject('Ordem de compra!');
            this.emailService.setBody(`<p><b>Criação de ordem de compra!</b><p>
                                       <p>Preço de compra: ${this.market.currentPrice}</p>
                                       <p>Hora da compra: ${this.dateUtils.getCurrentDateTime()}</p>`);
            this.emailService.send();
        } else if(!this.bought){
            console.log(`Não compensa comprar ainda. Veja as médias!`);
        }
        if(this.canSell()){
            console.log(`Criei uma ordem de venda às ${this.dateUtils.getCurrentDateTime()} com o preço de ${this.market.currentPrice}`);
            this.sellPrice = this.market.currentPrice;
            this.bought = false;
            this.emailService.setSubject('Ordem de venda!');
            this.emailService.setBody(`<p><b>Criação de ordem de venda!</b><p>
                                       <p>Preço de venda: ${this.market.currentPrice}</p>
                                       <p>Hora da venda: ${this.dateUtils.getCurrentDateTime()}</p>`);
            this.emailService.send();
        } else if(this.bought){
            console.log(`
                Comprei, mas ainda não é uma boa pra vender.
                Preço atual: ${this.market.currentPrice}
                Preço com lucro: ${this.getMinPriceToSell()}
                Preço de compra: ${this.buyPrice}
                Taxa de lucro: ${this.configParams.profit}
                Taxa de imposto: ${this.configParams.taxes}`)
        }
    }

}

module.exports = { Core }
