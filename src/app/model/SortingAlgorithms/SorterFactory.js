import { BubbleSorter } from "./BubbleSorter";
import { InsertionSorter } from "./InsertionSorter";
import { sortingState } from "../core/constants/sortingState";
import { SelectionSorter } from "./SelectionSorter";
import { MergeSorter } from "./MergeSorter";

export function SorterFactory(context) {
  this.applySort = function (currentSortName) {
    let sortResult;
    context.state = sortingState.sorting;
    let sorter;
    switch (currentSortName) {
      case "Bubble":
        sorter = new BubbleSorter();
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
    }
    sorter.sortArray.call(context);
    return sortResult;
  };
}
