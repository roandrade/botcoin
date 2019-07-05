function DateUtils(){

    this.getCurrentDateTime = () => {
        let current = new Date();
        return `${format(current.getDate())}/${format(current.getMonth() + 1)}/${current.getFullYear()} ${format(current.getHours())}:${format(current.getMinutes())}:${format(current.getSeconds())}`;
    }

    this.getDateFrom = (timestamp) => {
        let date = new Date();
        let hours = new Date(timestamp);
        date.setHours(hours.getHours());
        date.setMinutes(hours.getMinutes());
        date.setSeconds(0);
    }

    this.isTimeToOpenClose = () => {
        let hours = new Date();
        console.log(hours)
        if(process.env.CANDLE_LENGTH == "1"){
            let times = [0];
            return  times.find(t => t == hours.getSeconds()) !== undefined;
        }
        if(process.env.CANDLE_LENGTH == "15"){
            let times = [0, 15, 30, 45];
            return  times.find(t => t == hours.getMinutes()) !== undefined;
        }
        if(process.env.CANDLE_LENGTH == "30"){
            let times = [0, 30];
            return  times.find(t => t == hours.getMinutes()) !== undefined;
        }
        if(process.env.CANDLE_LENGTH == "60"){
            let times = [0];
            return  times.find(t => t == hours.getMinutes()) !== undefined;
        }
    }

}

function format(number) {
    return number < 10 ? `0${number}` : number;
}

module.exports = { DateUtils }