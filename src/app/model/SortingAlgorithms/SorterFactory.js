import { BubbleSorter } from "./BubbleSorter";
import { InsertionSorter } from "./InsertionSorter";
import { sortingState } from "../core/constants/sortingState";
import { SelectionSorter } from "./SelectionSorter";
import { MergeSorter } from "./MergeSorter";
import { QuickSorter } from "./QuickSorter";
import { HeapSorter } from "./HeapSorter";
import { sortEvent } from "../core/constants/sortEvent";

export function SorterFactory(context) {
  this.applySort = async function (currentSortName) {
    let sortResult;
    context.state = sortingState.sorting;
    let sorter;
    switch (currentSortName) {
      case "Bubble":
        sorter = new BubbleSorter(context);
        break;
      case "Insertion":
        sorter = new InsertionSorter();
        break;
      case "Selection":
        sorter = new SelectionSorter();
        break;
      case "Merge":
        sorter = new MergeSorter(context);
        break;
      case "Quick":
        sorter = new QuickSorter(context);
      case "Heap":
        sorter = new HeapSorter(context);
    }
    sortResult = await sorter.sortArray.call(context);
    console.log(sortResult);
    // sortResult.then(() => context.dispatch(sortEvent.SortingFinished, {}));
    return sortResult;
  };
}
