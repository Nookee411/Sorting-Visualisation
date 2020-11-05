import { sortEvent } from "../core/constants/sortEvent";
import { sortingState } from "../core/constants/sortingState";

export function QuickSorter(context) {
  let array;

  this.sortArray = async function () {
    array = context.getArray();
    await quickSort(0, array.length - 1);

    async function partition(left, right) {
      let pivot = array[Math.floor((right + left) / 2)]; //middle element
      let i = left; //left pointer
      let j = right; //right pointer
      while (i <= j) {
        while (array[i] < pivot && context.state == sortingState.sorting) {
          await context.sleepDuration(20).then(() => {
            context.dispatch(sortEvent.ItemScanned, {
              indexOne: i,
              indexTwo: j,
            });
            i++;
          });
        }
        while (pivot < array[j] && context.state == sortingState.sorting) {
          await context.sleepDuration(20).then(() => {
            context.dispatch(sortEvent.ItemScanned, {
              indexOne: i,
              indexTwo: j,
            });
            j--;
          });
        }
        //console.log(i + " : " + j);
        if (i <= j) {
          swap(i, j);
          context.dispatch(sortEvent.ItemSwapped, {
            indexOne: i,
            indexTwo: j,
          });
          i++;
          j--;
        }
      }
      return i;
    }

    async function quickSort(left, right) {
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
    }

    function swap(leftIndex, rightIndex) {
      let temp = array[leftIndex];
      array[leftIndex] = array[rightIndex];
      array[rightIndex] = temp;
    }
  };
}
