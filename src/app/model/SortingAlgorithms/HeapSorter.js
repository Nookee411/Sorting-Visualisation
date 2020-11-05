import { sortEvent } from "../core/constants/sortEvent";
import { sortingState } from "../core/constants/sortingState";
import { config } from "../core/config";

export function HeapSorter(context) {
  let array;

  this.sortArray = async function () {
    array = context.getArray();

    await heapSort();

    async function heapSort() {
      await makeMaxHeap();
      await applyHeapSort();
    }

    async function makeMaxHeap() {
      let middle = Math.floor(array.length / 2);
      for (let i = middle; i >= 0; i--) {
        await pushToMaxArray(array, i);
      }
    }

    async function applyHeapSort() {
      let heapContainer = [...array];
      for (let i = 0; heapContainer.length > 0; i++) {
        array[i] = heapContainer[0]; //Extracting max
        heapContainer[0] = heapContainer[heapContainer.length - 1]; //swap small element to the top
        heapContainer.pop();
        pushToMaxArray(heapContainer, 0);
        await context.sleepDuration(config.ComparisonTime);
        context.dispatch(sortEvent.ItemSwapped, { indexOne: i });
      }
    }

    async function pushToMaxArray(array, i) {
      let leftChildIndex = (i + 1) * 2 - 1;
      let rightChildInex = (i + 1) * 2;
      let maxChildIndex =
        array[leftChildIndex] > array[rightChildInex]
          ? leftChildIndex
          : rightChildInex; //max of child if element exists, undefined if element has no child

      if (
        array[maxChildIndex] != undefined &&
        array[i] < array[maxChildIndex]
      ) {
        [array[i], array[maxChildIndex]] = [array[maxChildIndex], array[i]];
        context.dispatch(sortEvent.ItemSwapped, {
          indexOne: maxChildIndex,
          indexTwo: i,
        });
        pushToMaxArray(array, maxChildIndex);
        await context.sleepDuration(config.SwapTime);
      }
    }
  };
}
