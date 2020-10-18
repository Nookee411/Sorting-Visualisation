
export class Sort extends EventTarget{
    constructor(n) {
        super();
        this.array = this.initArray(n);
        this.arrayChangeEvent = new CustomEvent('change',{'changedIndex1': 0,'changedIndex2' : 0});

    }
    initArray(size){
        let array = new Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = this.getRandomValue(10,500);
        }
        return array;
    }
    getRandomValue(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    setSize(size){
        this.array = this.initArray(size);
    }

    getArray(){
        return this.array;
    }

    remakeArray(){
        this.array = this.initArray(this.array.length);
    }

    async bubbleSort(){
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array.length; j++) {
                if(this.array[i]<this.array[j]){
                    [this.array[i],this.array[j]] = [this.array[j],this.array[i]];
                    this.arrayChangeEvent.changedIndex1 = i;
                    this.arrayChangeEvent.changedIndex2 = j;
                    dispatchEvent(this.arrayChangeEvent);
                    await new Promise(r => setTimeout(r, 2000));
                }
            }
        }
    }

}