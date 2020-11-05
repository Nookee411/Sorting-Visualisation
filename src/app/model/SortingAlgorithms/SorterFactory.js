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
        sorter = new InsertionSorter(context);
        break;
      case "Selection":
        sorter = new SelectionSorter(context);
        break;
      case "Merge":
        sorter = new MergeSorter(context);
        break;
      case "Quick":
        sorter = new QuickSorter(context);
        break;
      case "Heap":
        sorter = new HeapSorter(context);
        break;
    }
    sorter
      .sortArray()
      .then(() => context.dispatch(sortEvent.SortingFinished, {}));
    return sortResult;
  };
}
