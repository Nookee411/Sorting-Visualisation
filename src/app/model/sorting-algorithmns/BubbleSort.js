import { BaseSort } from './BaseSorting';
import sortingState from './sortingState';

export async function BubbleSort(array) {
    __proto__: BaseSort;
    let currentSortingState = sortingState.sorting;
    this.sortArray = function(array){
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (this.#compareAndDispatch(j, j + 1)) this.swapAndDispatch(j, j + 1);
                await this.sleepDuration(config.ComparisonTime + config.SwapTime);
              }
            }
          }
    }
  
}
