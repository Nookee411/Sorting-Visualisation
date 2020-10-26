export const SortEvent = {
    ItemsSorted: 'ITEMS_SORTED',
    SortingFinished: 'SORTING_FINISHED',
    ItemScanned: 'ITEM_SCANNED'
};

const config = {
    ComparisonTime: 20,
    SwapTime: 100

}


//TODO Fix multiple sorting
//TODO Fix new array creation
//TODO Change sorting visualisation

export class Sort{
    constructor(n) {
        this.array = this.initArray(n);
        this.events = {};
        this.isSorting = false;
        this.currentSortName = 'Insertion';
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
        console.log(this.array);
        switch (this.currentSortName) {
            case "Bubble": this.bubbleSort(); break;
            case "Insertion": this.insertionSort(); break;
            case "Selection": this.selectionSort(); break;
            case "Merge": this.mergeSort(this.array,0); break;
        }
        this.dispatch(SortEvent.SortingFinished,{});
    }
    async selectionSort() {
        this.isSorting = true;
        for (let i = 0; i < this.array.length&&this.isSorting; i++) {

                let res = await this.findMaxValue(i)
                this.dispatch(SortEvent.ItemsSorted, {index: res});
                await new Promise((resolve => {
                    setTimeout(resolve, config.SwapTime)
                }));
            if(this.isSorting) {
                [this.array[res], this.array[i]] = [this.array[i], this.array[res]];
            }
        }
        this.dispatch(SortEvent.SortingFinished, {});
    }

    async findMaxValue(startIndex){
        let maxIndex;
        let maxValue = Number.MIN_SAFE_INTEGER
        for (let i = startIndex; i < this.array.length&&this.isSorting; i++) {
            if(this.isSorting){
                if (maxValue < this.array[i]) {
                    maxIndex = i;
                    maxValue = this.array[i]
                }
            }
            await new Promise(resolve => {setTimeout(resolve, config.ComparisonTime)});
            this.dispatch(SortEvent.ItemScanned, {index: i});
        }
        return maxIndex
    }


    async insertionSort() {
        //We are taking each element to the left until it starts to fit comparer
        this.isSorting = true;
        for (let i = 1; i < this.array.length; i++) {
            let indexOfEle = i;
            while(indexOfEle>=0&&this.array[indexOfEle]<this.array[indexOfEle-1] &&
            this.isSorting){
                [this.array[indexOfEle - 1], this.array[indexOfEle]] =
                        [this.array[indexOfEle], this.array[indexOfEle - 1]]
                    indexOfEle--;
                    this.dispatch(SortEvent.ItemsSorted, {
                        index: indexOfEle
                    })
                    await new Promise((res) => setTimeout(res, 10));
            }
        }
        this.dispatch(SortEvent.SortingFinished,{});
    }

    // async mergeSort(arr, indexInWhole){
    //     if (arr.length <= 1) return arr;
    //
    //     let mid = Math.floor(arr.length / 2),
    //         left = this.mergeSort(arr.slice(0, mid),indexInWhole),
    //         right = this.mergeSort(arr.slice(mid),indexInWhole+mid);
    //
    //
    //     return res(left, right,indexInWhole)
    //
    //     let res = async function merge(leftArr, rightArr,startInWhole){
    //         let mergedArr = []
    //         let i,j;
    //         i=j=0
    //         while (i<leftArr.length && j<rightArr.length) {
    //             if (leftArr[0] > rightArr[0]) {
    //                 mergedArr.push(leftArr.shift());
    //
    //             }
    //             else {
    //                 mergedArr.push(rightArr.shift());
    //             }
    //             [this.array[startInWhole],this.array[startInWhole+1]]=
    //                 [this.array[startInWhole+1],this.array[startInWhole]]
    //             this.dispatch(SortEvent.ItemsSorted, {index: this.array.indexOf(mergedArr[mergedArr.length-1])})
    //             await new Promise(res=>setTimeout(res,100))
    //         }
    //         return mergedArr.concat(leftArr.slice().concat(rightArr.slice()));
    //     }
    // }

    async mergeSort(splittedArray,generalIndex){
        //recursion exit if array contains only one value
        this.isSorting = true
        if(splittedArray.length <=1)
            return splittedArray
        let middle = Math.floor(splittedArray.length/2);
        let leftArr = splittedArray.slice(0,middle)
        let rightArr = splittedArray.slice(middle)
        let merged;
        await this.mergeArrays(
            await this.mergeSort(leftArr,generalIndex),
            await this.mergeSort(rightArr, generalIndex+middle),
        ).then(resolve=> {merged = resolve});
        console.log(merged);
        return merged
    }

    async mergeArrays(leftArr, rightArr, indexInGeneral) {

        let kek;
        let mergedArray = []
        let i = 0;
        let j = 0;
        //Two finger method
        while (i < leftArr.length && j < rightArr.length && this.isSorting) {
            //setting pause before each iteration
            //Comparator usage
            if (leftArr[i] < rightArr[j]) {
                mergedArray.push(leftArr[i++]);
            } else {

                mergedArray.push(rightArr[j++]);
            }
            this.dispatch(SortEvent.ItemScanned, {index: indexInGeneral})
            await new Promise(resolve => setTimeout(resolve, config.ComparisonTime));
        }
        mergedArray = mergedArray.concat(leftArr.slice(i).concat(rightArr.slice(j)))
        for (let i = 0; i < mergedArray.length; i++)
            setTimeout(() => {
                this.array[i + indexInGeneral] = mergedArray[i];
                this.dispatch(SortEvent.ItemsSorted, {index: i + indexInGeneral});
            }, config.SwapTime)
        return mergedArray

    }

    swap(a,b){
        [a,b] = [b,a]
    }

    async bubbleSort() {
        this.isSorting = true;
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array.length - i - 1; j++) {
                if(this.isSorting) {
                    this.dispatch(SortEvent.ItemScanned, {index: j+1});
                    if (this.array[j] > this.array[j + 1]){
                        [this.array[j], this.array[j + 1]] = [
                            this.array[j + 1],
                            this.array[j],
                        ];
                        this.dispatch(SortEvent.ItemsSorted, {
                            index: j + 1,
                        });


                    }
                    await new Promise((res) => setTimeout(res, config.SwapTime));
                }
                }
            }
        this.dispatch(SortEvent.SortingFinished,{});
    }

}