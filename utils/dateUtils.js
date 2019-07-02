function DateUtils(){

    this.getCurrentDateTime = () =>{
        let current = new Date();
        return `${format(current.getDate())}/${format(current.getMonth() + 1)}/${current.getFullYear()} ${format(current.getHours())}:${format(current.getMinutes())}:${format(current.getSeconds())}`;
    }

}

function format(number) {
    return number < 10 ? `0${number}` : number;
}

module.exports = { DateUtils }