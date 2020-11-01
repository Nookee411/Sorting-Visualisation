import "regenerator-runtime/runtime";
import { SortManager } from "./model/core/SortManager";
import { sortEvent } from "./model/core/constants/sortEvent";
import { Visualizer } from "./view/Visualizer";
import { sortingState } from "./model/core/constants/sortingState";

let vis = new Visualizer();
let currentSize = vis.slider.value;
let sort = new SortManager(currentSize, "Bubble");
vis.createVisual(sort.getArray());

sort.addEventListener(sortEvent.ItemSwapped, (params) => {
  vis.updateVisual(
    sort.getArray(),
    { indexOne: params.indexOne, indexTwo: params.indexTwo },
    "cyan"
  );
  vis.increaseSwapCounter();
});

sort.addEventListener(sortEvent.ItemScanned, (params) => {
  vis.updateVisual(
    sort.getArray(),
    { indexOne: params.indexOne, indexTwo: params.indexTwo },
    "gray"
  );
  vis.updateComparisons();
});

sort.addEventListener(sortEvent.SortingFinished, (params) => {
  vis.updateVisual(sort.getArray(), { indexOne: -1, indexTwo: -1 });
  vis.timer.stop();
});

vis.slider.addEventListener("input", (e) => {
  newArray();
});

vis.newArrayButton.addEventListener("click", (e) => {
  newArray();
});

vis.sortButton.addEventListener("click", (e) => {
  if (sort.state == sortingState.stopped) {
    vis.timer.start();
    sort.applySort();
  }
});

vis.sortList.addEventListener("click", (e) => {
  for (let child of vis.sortList.children) {
    child.className = "foldMenu__item";
  }
  e.target.className = "foldMenu__item active";
  sort.setCurrentSort(e.target.id);
  newArray();
});

function newArray() {
  vis.timer.stop();
  vis.resetStats();
  sort.stopSorting();
  currentSize = vis.slider.value;
  sort.remakeArray(currentSize);
  vis.createVisual(sort.getArray());
}
