
function Candle(){

    this.lowest = 9999999;

    this.highest = 0.0;

    this.opening = 0.0;

    this.closing = 0.0;

    this.volume = 0.0;

    this.average = 0.0;

    this.openDate;

    this.closeDate;
    
    this.refresh = (ticker) => {
      this.lowest = ticker.last < this.lowest ? ticker.last : this.lowest;
      this.highest = ticker.last > this.highest ? ticker.last : this.highest;
      this.average = (this.highest + this.lowest) / 2;
    }

    this.open = (ticker, date) => {
        this.opening = ticker.last;
        this.openDate = date;
    }

    this.close = (ticker, date) => {
        this.closing = ticker.last;
        this.closeDate = date;
    }

}

module.exports = { Candle }