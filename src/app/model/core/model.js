export const SortEvent = {
    ItemsSorted: 'ITEMS_SORTED',
    SortingFinished: 'SORTING_FINISHED'
};

//TODO Fix multiple sorting
//TODO Fix new array creation
//TODO Change sorting visualisation

export class Sort{
    constructor(n) {
        this.array = this.initArray(n);
        this.events = {};
        this.isSorting = false;

    }
    initArray(size){
        let array = new Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = getRandomValue(10,500);
        }
        return array;
        function  getRandomValue(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }
    }


    setSize(size){
        this.array = this.initArray(size);
    }

    getArray(){
        return this.array;
    }

    remakeArray(newSize){
        this.array = this.initArray(newSize);
    }

    async bubbleSort() {

        this.isSorting = true;
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array.length - i - 1; j++) {
                if(this.isSorting) {
                    if (this.array[j] > this.array[j + 1]) {
                        [this.array[j], this.array[j + 1]] = [
                            this.array[j + 1],
                            this.array[j],
                        ];

                    }
                    this.dispatch(SortEvent.ItemsSorted, {
                        indexOne: j,
                        indexTwo: j + 1,
                    });
                    await new Promise((res) => setTimeout(res, 10));
                }
            }
        }
        this.dispatch(SortEvent.SortingFinished,{});
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