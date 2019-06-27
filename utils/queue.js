function Queue(){

    this.lista = new Array();
 
    this.inserir = (obj) => {
        this.lista[this.lista.length] = obj;
    }

    this.inserirDiferente = (obj) => {
        if(!this.objIsEquals(obj)){
            this.inserir(obj)
            return true;
        }
        return false;
    }

    this.objIsEquals = (newObj) => {
        let oldObj = this.lerUltimo();
        return oldObj != undefined 
                && newObj.last === oldObj.last
    }
 
    this.removerPrimeiro = function(){
        if(this.lista.length > 0){
            var obj = this.lista[0];
            this.lista.splice(0,1);
            return obj;    
        }else{
            console.log("Não há objetos na fila.")
        }
    }
 
    this.lerPrimeiro = function(){
        if(this.lista.length > 0){
            return this.lista[0];
        }else{
            console.log("Não há objetos na fila.")
        }
    }

    this.lerUltimo = () => {
        if(this.lista.length > 0){
            return this.lista[this.lista.length - 1];
        }else{
            console.log('Não há objetos na fila.')
        }
    }

    this.lerNaPosicao = (position) =>{
        if(position >=0 && position < this.lista.length && this.lista.length > 0){
            return this.lista[position];
        }else{
            console.log('Posicao incorreta ou lista vazia.')
        }
    }
}

module.exports = { Queue }