export function MergeSorter(context) {
  let array;
  this.sortArray = async function () {
    array = context.getArray();
    mergeSort.call(this, array, 0);
  };

  let mergeSort = async function (splittedArray, startIndex) {
    //recursion exit if array contains only one value
    if (splittedArray.length <= 1) return splittedArray;
    let middle = Math.floor(splittedArray.length / 2);
    let leftArr = splittedArray.slice(0, middle);
    let rightArr = splittedArray.slice(middle);
    return mergeArrays(
      await mergeSort(leftArr, startIndex),
      await mergeSort(rightArr, startIndex + middle),
      startIndex
    );
  };

  let mergeArrays = async function (leftArr, rightArr, startIndex) {
    let mergedArray = [];
    let i = 0;
    let j = 0;
    //Two finger method
    while (i < leftArr.length && j < rightArr.length) {
      //setting pause before each iteration
      //Comparator usage
      await context.sleepDuration(100).then(() => {
        if (leftArr[i] < rightArr[j]) mergedArray.push(leftArr[i++]);
        else mergedArray.push(rightArr[j++]);
        context.dispatch(sortEvent.ItemScanned, {
          indexOne: startIndex + mergedArray.length,
          indexTwo: startIndex,
        });
      });
    }
    mergedArray = mergedArray.concat(
      leftArr.slice(i).concat(rightArr.slice(j))
    );
    for (
      let i = 0;
      i < mergedArray.length && sortState == sortingState.sorting;
      i++
    ) {
      sleepDuration(config.SwapTime).then((resolve) => {
        array[i + startIndex] = mergedArray[i];
        dispatch(sortEvent.ItemSwapped, { indexOne: i + startIndex });
      });
    }
    return mergedArray;
  };
}
