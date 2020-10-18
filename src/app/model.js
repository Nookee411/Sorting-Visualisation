export const SortEvent = {
    ItemsSorted: 'ITEMS_SORTED',
};

export class Sort{
    constructor(n) {
        this.array = this.initArray(n);
        this.events = {};

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

    async bubbleSort() {
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array.length - i - 1; j++) {
                if (this.array[j] > this.array[j + 1]) {
                    [this.array[j], this.array[j + 1]] = [
                        this.array[j + 1],
                        this.array[j],
                    ];
                    this.dispatch(SortEvent.ItemsSorted, {
                        indexOne: j,
                        indexTwo: j + 1,
                    });
                    await new Promise((res) => setTimeout(res, 10));
                }
            }
        }
    }

    addEventListener(event, callback) {
        this.events[event] = callback;
    }

    removeEventListener(event) {
        delete this.events[event];
    }

    dispatch(event, params) {
        const callback = this.events[event];
        if (callback) {
            callback(params);
        }
    }

}