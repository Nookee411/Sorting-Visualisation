import { sortingState } from "./constants/sortingState";

export function BubbleSorter() {
  this.sortArray = async function () {
    console.log(this.sortState);
    let array = this.getArray();
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (this.state == sortingState.sorting) {
          if (await compareAndDispatch(j, j + 1))
            await swapAndDispatch(j, j + 1);
        }
      }
    }
    console.log(array);
  };
}
