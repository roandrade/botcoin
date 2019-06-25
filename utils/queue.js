function Queue(){

    this.lista = new Array();
 
    this.Inserir = function(obj){
        this.lista[this.lista.length] = obj;
    }
 
    this.RemoverPrimeiro = function(){
        if(this.lista.length > 0){
            var obj = this.lista[0];
            this.lista.splice(0,1);
            return obj;    
        }else{
            console.log("Não há objetos na fila.")
        }
    }
 
    this.LerPrimeiro = function(){
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
        if(posistion >=0 && position < this.lista.length && this.lista.length > 0){
            return this.lista[position];
        }else{
            console.log('Posicao incorreta ou lista vazia.')
        }
    }
}