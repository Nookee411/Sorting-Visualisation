import { max } from "moment";
import { SorterFactory } from "../SortingAlgorithms/SorterFactory";
import { sortEvent } from "./constants/sortEvent";
import { sortingState } from "./constants/sortingState";
import { BubbleSorter } from "./Sorter";

const config = {
  ComparisonTime: 20,
  SwapTime: 100,
};

export function SortManager(n, sortName) {
  let getRandomValue = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
  let initArray = function (size) {
    let array = new Array(size);
    for (let i = 0; i < size; i++) {
      array[i] = getRandomValue(10, 500);
    }
    return array;
  };
  let array = initArray(n);
  let events = {};
  let protectedMethods = {};
  let sortState = sortingState.stopped;
  let currentSortName = sortName;

  this.getArray = function () {
    return array;
  };

  this.setCurrentSort = function (sortName) {
    currentSortName = sortName;
  };

  this.remakeArray = function (newSize) {
    array = initArray(newSize);
  };

  Object.defineProperty(this, "size", {
    get: function () {
      return array.length;
    },
    set: function (value) {
      this.array = initArray(value);
    },
  });

  this.addEventListener = function (eventName, callback) {
    events[eventName] = callback;
  };

  this.removeEventListener = function (eventName) {
    delete events[eventName];
  };

  protectedMethods.dispatch = function (eventName, params) {
    const callback = events[eventName];
    if (callback) {
      callback(params);
    }
  };

  Object.defineProperty(this, "state", {
    get: function () {
      return sortState;
    },
    set: function (value) {
      sortState = value;
    },
  });

  this.stopSorting = function () {
    sortState = sortingState.stopped;
  };

  this.applySort = function () {
    let sorter = new SorterFactory(Object.assign(this, protectedMethods));
    let sortResult;
    this.state = sortingState.sorting;
    let ctx = new BubbleSorter();
    switch (currentSortName) {
      // case "Merge":
      //   sortResult = mergeSort(array, 0);
      //   break;
      case "Quick":
        sortResult = quickSort(0, array.length - 1);
        break;
      case "Heap":
        sortResult = heapSort();
        break;
      default:
        sorter.applySort(currentSortName);
        break;
    }
    // sortResult.then(() =>
    //   protectedMethods.dispatch(sortEvent.SortingFinished, {})
    // );
  };

  // let mergeSort = async function (splittedArray, startIndex) {
  //   //recursion exit if array contains only one value

  //   if (splittedArray.length <= 1) return splittedArray;
  //   let middle = Math.floor(splittedArray.length / 2);
  //   let leftArr = splittedArray.slice(0, middle);
  //   let rightArr = splittedArray.slice(middle);

  //   return mergeArrays(
  //     await mergeSort(leftArr, startIndex),
  //     await mergeSort(rightArr, startIndex + middle),
  //     startIndex
  //   );
  // };

  // let mergeArrays = async function (leftArr, rightArr, startIndex) {
  //   if (sortState == sortingState.sorting) {
  //     let mergedArray = [];
  //     let i = 0;
  //     let j = 0;
  //     //Two finger method
  //     while (i < leftArr.length && j < rightArr.length) {
  //       //setting pause before each iteration
  //       //Comparator usage
  //       await protectedMethods.sleepDuration(config.ComparisonTime).then(() => {
  //         if (leftArr[i] < rightArr[j]) mergedArray.push(leftArr[i++]);
  //         else mergedArray.push(rightArr[j++]);
  //         protectedMethods.dispatch(sortEvent.ItemScanned, {
  //           indexOne: startIndex + mergedArray.length,
  //           indexTwo: startIndex,
  //         });
  //       });
  //     }
  //     mergedArray = mergedArray.concat(
  //       leftArr.slice(i).concat(rightArr.slice(j))
  //     );
  //     for (
  //       let i = 0;
  //       i < mergedArray.length && sortState == sortingState.sorting;
  //       i++
  //     ) {
  //       protectedMethods.sleepDuration(config.SwapTime).then((resolve) => {
  //         array[i + startIndex] = mergedArray[i];
  //         protectedMethods.dispatch(sortEvent.ItemSwapped, {
  //           indexOne: i + startIndex,
  //         });
  //       });
  //     }
  //     return mergedArray;
  //   }
  // };

  let partition = async function (left, right) {
    let pivot = array[Math.floor((right + left) / 2)]; //middle element
    let i = left; //left pointer
    let j = right; //right pointer
    while (i <= j) {
      while (array[i] < pivot && sortState == sortingState.sorting) {
        await protectedMethods.sleepDuration(config.ComparisonTime).then(() => {
          protectedMethods.dispatch(sortEvent.ItemScanned, {
            indexOne: i,
            indexTwo: j,
          });
          i++;
        });
      }
      while (pivot < array[j] && sortState == sortingState.sorting) {
        await protectedMethods.sleepDuration(config.ComparisonTime).then(() => {
          protectedMethods.dispatch(sortEvent.ItemScanned, {
            indexOne: i,
            indexTwo: j,
          });
          j--;
        });
      }
      //console.log(i + " : " + j);
      if (i <= j) {
        swap(i, j);
        protectedMethods.dispatch(sortEvent.ItemSwapped, {
          indexOne: i,
          indexTwo: j,
        });
        i++;
        j--;
      }
    }
    return i;
  };

  let quickSort = async function (left, right) {
    let index;
    if (array.length > 1) {
      index = await partition(left, right); //index returned from partition
      if (left < index - 1) {
        //more elements on the left side of the pivot
        await quickSort(left, index - 1);
      }
      if (index < right) {
        //more elements on the right side of the pivot
        await quickSort(index, right);
      }
    }
    return array;
  };

  let heapSort = async function () {
    await makeMaxHeap();
    await applyHeapSort();
  };

  let makeMaxHeap = async function () {
    let middle = Math.floor(array.length / 2);
    for (let i = middle; i >= 0; i--) {
      await pushToMaxArray(array, i);
    }
  };

  let applyHeapSort = async function () {
    let heapContainer = [...array];
    for (let i = 0; heapContainer.length > 0; i++) {
      array[i] = heapContainer[0]; //Extracting max
      heapContainer[0] = heapContainer[heapContainer.length - 1]; //swap small element to the top
      heapContainer.pop();
      pushToMaxArray(heapContainer, 0);
      await protectedMethods.sleepDuration(config.ComparisonTime);
      // dispatch(sortEvent.ItemSwapped, { indexOne: i });
    }
  };

  let pushToMaxArray = async function (array, i) {
    let leftChildIndex = (i + 1) * 2 - 1;
    let rightChildInex = (i + 1) * 2;
    let maxChildIndex =
      array[leftChildIndex] > array[rightChildInex]
        ? leftChildIndex
        : rightChildInex; //max of child if element exists, undefined if element has no child

    if (array[maxChildIndex] != undefined && array[i] < array[maxChildIndex]) {
      [array[i], array[maxChildIndex]] = [array[maxChildIndex], array[i]];
      protectedMethods.dispatch(sortEvent.ItemSwapped, {
        indexOne: maxChildIndex,
        indexTwo: i,
      });
      pushToMaxArray(array, maxChildIndex);
      await protectedMethods.sleepDuration(config.SwapTime);
    }
  };

  let swap = function (leftIndex, rightIndex) {
    let temp = array[leftIndex];
    array[leftIndex] = array[rightIndex];
    array[rightIndex] = temp;
  };

  protectedMethods.sleepDuration = async function (durationTime) {
    await new Promise((resolve) => setTimeout(resolve, durationTime));
  };

  protectedMethods.swapAndDispatch = async function (firstIndex, secondIndex) {
    if (sortState == sortingState.sorting) {
      await protectedMethods.sleepDuration(config.SwapTime);
      [array[firstIndex], array[secondIndex]] = [
        array[secondIndex],
        array[firstIndex],
      ];
      protectedMethods.dispatch(sortEvent.ItemSwapped, {
        indexOne: firstIndex,
        indexTwo: secondIndex,
      });
    }
  };

  protectedMethods.compareAndDispatch = async function (
    firstIndex,
    secondIndex
  ) {
    if (sortState == sortingState.sorting) {
      await protectedMethods.sleepDuration(config.ComparisonTime);
      protectedMethods.dispatch(sortEvent.ItemScanned, {
        indexOne: firstIndex,
        indexTwo: secondIndex,
      });
      return array[firstIndex] > array[secondIndex];
    }
  };
}
