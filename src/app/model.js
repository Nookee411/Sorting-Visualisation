import {Visualizer} from "./view";

export class Sort{
    constructor(n) {
        this.array = this.initArray(n);
        this.visualizer = new Visualizer();
        this.visualizer.redrawVisual(this.array);


    }
    initArray(size){
        let array = new Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = this.getRandomValue(10,500);
        }
        return array;
    }
    getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
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
}