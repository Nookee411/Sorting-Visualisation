export const SortEvent = {
    ItemSwapped: 'ITEMS_SORTED',
    SortingFinished: 'SORTING_FINISHED',
    ItemScanned: 'ITEM_SCANNED',
};

const config = {
    ComparisonTime: 20,
    SwapTime: 100

}


//TODO Fix multiple sorting
//TODO Fix new array creation
//TODO Change sorting visualisation

export class Sort {
    constructor(n) {
        this.array = this.initArray(n);
        this.events = {};
        this.isSorting = false;
        this.currentSortName = 'Insertion';
    }

    initArray(size) {
        let array = new Array(size);
        for (let i = 0; i < size; i++) {
            array[i] = getRandomValue(10, 500);
        }
        return array;

        function getRandomValue(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }
    }


    setSize(size) {
        this.array = this.initArray(size);
    }

    getArray() {
        return this.array;
    }

    remakeArray(newSize) {
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

    setCurrentSort(sortName) {
        this.currentSortName = sortName;

    }

    // sortResult.then(()=>{
    applySort() {
        let sortResult
        switch (this.currentSortName) {
            case "Bubble":
                sortResult = this.bubbleSort();
                break;
            case "Insertion":
                sortResult = this.insertionSort();
                break;
            case "Selection":
                sortResult = this.selectionSort();
                break;
            case "Merge":
                sortResult = this.mergeSort(this.array, 0);
                break;
            case "Quick":
                sortResult = this.quickSort(0, this.array.length - 1);
                break;

        }
        sortResult
            .then(()=>this.dispatch(SortEvent.SortingFinished, {}));


    }

    async selectionSort() {
        this.isSorting = true;
        for (let i = 0; i < this.array.length && this.isSorting; i++) {

            let res = await this.findMaxValue(i)
            this.dispatch(SortEvent.ItemSwapped, {index: res});
            await new Promise((resolve => {
                setTimeout(resolve, config.SwapTime)
            }));
            if (this.isSorting) {
                this.swapAndDispatch(i, res)
            }
        }
    }

    async findMaxValue(startIndex) {
        let maxIndex;
        let maxValue = Number.MIN_SAFE_INTEGER
        for (let i = startIndex; i < this.array.length && this.isSorting; i++) {
            if (this.isSorting) {
                if (maxValue < this.array[i]) {
                    maxIndex = i;
                    maxValue = this.array[i]
                }
            }
            await new Promise(resolve => {
                setTimeout(resolve, config.ComparisonTime)
            });
            this.dispatch(SortEvent.ItemScanned, {index: i});
        }
        return maxIndex
    }


    async insertionSort() {
        //We are taking each element to the left until it starts to fit comparer
        this.isSorting = true;
        for (let i = 1; i < this.array.length; i++) {
            let indexOfEle = i;
            while (indexOfEle > 0 && !this.compareAndDispatch(indexOfEle, indexOfEle - 1) &&
            this.isSorting) {
                this.swapAndDispatch(indexOfEle - 1, indexOfEle)
                indexOfEle--;
                await new Promise((res) => setTimeout(res, 10));
            }
        }
    }

    async mergeSort(splittedArray, startIndex) {
        //recursion exit if array contains only one value
        this.isSorting = true
        if (splittedArray.length <= 1)
            return splittedArray;
        let middle = Math.floor(splittedArray.length / 2);
        let leftArr = splittedArray.slice(0, middle)
        let rightArr = splittedArray.slice(middle)

        return this.mergeArrays(
            await this.mergeSort(leftArr, startIndex),
            await this.mergeSort(rightArr, startIndex + middle),
            startIndex
        );
    }

    async mergeArrays(leftArr, rightArr, startIndex) {

        if (this.isSorting) {
            let mergedArray = []
            let i = 0;
            let j = 0;
            //Two finger method
            while (i < leftArr.length && j < rightArr.length && this.isSorting) {
                //setting pause before each iteration
                //Comparator usage
                await this.sleepDuration(config.ComparisonTime).then(() => {
                    if (leftArr[i] < rightArr[j])
                        mergedArray.push(leftArr[i++]);
                    else
                        mergedArray.push(rightArr[j++]);
                    this.dispatch(SortEvent.ItemScanned, {index: startIndex + mergedArray.length})
                })
            }
            mergedArray = mergedArray.concat(leftArr.slice(i).concat(rightArr.slice(j)))
            for (let i = 0; i < mergedArray.length && this.isSorting; i++) {
                this.sleepDuration(config.SwapTime)
                    .then((resolve) => {
                        this.array[i + startIndex] = mergedArray[i];
                        this.dispatch(SortEvent.ItemSwapped, {index: i + startIndex});
                    })
            }
            return mergedArray
        }
    }


    async sleepDuration(durationTime) {
        await new Promise(resolve => setTimeout(resolve, durationTime));
    }

    async bubbleSort() {
        this.isSorting = true;
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array.length - i - 1; j++) {
                if (this.isSorting) {
                    if (this.compareAndDispatch(j, j + 1))
                        this.swapAndDispatch(j, j + 1)
                    await new Promise((res) => setTimeout(res, config.SwapTime));
                }
            }
        }
    }

    swap(leftIndex, rightIndex){
        let temp = this.array[leftIndex];
        this.array[leftIndex] = this.array[rightIndex];
        this.array[rightIndex] = temp;
    }
    async partition(left, right) {
        let pivot = this.array[Math.floor((right + left) / 2)];//middle element
        let i = left; //left pointer
        let j = right; //right pointer
        while (i <= j&&this.isSorting) {
            while (this.array[i] < pivot && this.isSorting) {
                await this.sleepDuration(config.ComparisonTime)
                    .then(() => {
                        this.dispatch(SortEvent.ItemScanned,{index: i})
                        i++;
                    });

            }
            while (pivot < this.array[j] && this.isSorting) {
                await this.sleepDuration(config.ComparisonTime)
                    .then(() => {
                        this.dispatch(SortEvent.ItemScanned, {index: j});
                        j--;
                    });
            }
            //console.log(i + " : " + j);
            if (i <= j && this.isSorting) {
                this.swap(i, j);
                this.dispatch(SortEvent.ItemSwapped,{index: i});
                i++;
                j--;
            }
        }
        return i;
    }

    async quickSort(left, right) {
        this.isSorting = true;
        let index;
        if (this.array.length > 1 && this.isSorting) {
            index = await this.partition(left, right); //index returned from partition
            if (left < index - 1) { //more elements on the left side of the pivot
                this.quickSort(left, index - 1);
            }
            if (index < right) { //more elements on the right side of the pivot
                this.quickSort(index, right);
            }
        }
        return this.array;
    }

    swapAndDispatch(firstIndex, secondIndex) {
        [this.array[firstIndex], this.array[secondIndex]] =
            [this.array[secondIndex], this.array[firstIndex]]
        this.dispatch(SortEvent.ItemSwapped, {index: secondIndex})
    }

    compareAndDispatch(firstIndex, secondIndex) {
        this.dispatch(SortEvent.ItemScanned, {index: secondIndex});
        return this.array[firstIndex] > this.array[secondIndex];
    }
}