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
        this.currentSortName = 'Bubble';
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
                        index: j+1,
                    });
                    await new Promise((res) => setTimeout(res, 10));
                }
            }
        }
        this.dispatch(SortEvent.SortingFinished,{});
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

    setCurrentSort(sortName){
        this.currentSortName = sortName;
    }

    applySort(){
        switch (this.currentSortName) {
            case "Bubble": this.bubbleSort(); break;
            case "Insertion": this.insertionSort(); break;
            case "Merge": this.mergeSort(this.array); break;
        }
    }

    async insertionSort() {
        //We are taking each element to the left until it starts to fit comparer
        this.isSorting = true;
        for (let i = 1; i < this.array.length; i++) {
            let indexOfEle = i;
            while(indexOfEle>=0&&this.array[indexOfEle]<this.array[indexOfEle-1]){
                [this.array[indexOfEle-1],this.array[indexOfEle]] =
                    [this.array[indexOfEle],this.array[indexOfEle-1]]
                indexOfEle--;
                this.dispatch(SortEvent.ItemsSorted,{
                    index: indexOfEle
                })
                await new Promise((res) => setTimeout(res, 10));
            }
        }
        this.dispatch(SortEvent.SortingFinished,{})
    }

    mergeSort(array){
        if(!array || !array.length)
            return null;
        if(array.length<=1)
            return array;

        const middle = Math.floor(array.length / 2);
        const arrLeft = array.slice(0, middle);
        const arrRight = array.slice(middle);

        return this.merge(arrLeft,arrRight)
    }


    async merge(arrFirst, arrSecond){
        const sortedArray = [];
        let j,i = j = 0;

        while (i < arrFirst.length && j < arrSecond.length) {
            sortedArray.push(
                (arrFirst[i] < arrSecond[j]) ?
                    arrFirst[i++] : arrSecond[j++]
        );
            this.dispatch(SortEvent.ItemsSorted, {
                index: this.array.indexOf((arrFirst[i] < arrSecond[j]) ? arrFirst[i]: arrSecond[j])
            });
        }
        return sortedArray;
    };
}