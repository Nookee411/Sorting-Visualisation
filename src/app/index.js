import "regenerator-runtime/runtime";
import { Sort, SortEvent } from "./model/core/model";
import { Visualizer } from "./view/view";
// console.log(modelImplementation.number);
let vis = new Visualizer();
let currentSize = vis.slider.value;
let sort = new Sort(currentSize);
vis.createVisual(sort.getArray());

sort.addEventListener(SortEvent.ItemSwapped, (params) => {
  vis.updateVisual(sort.getArray(), params.index, "yellow");
  vis.updateCounter();
});

sort.addEventListener(SortEvent.ItemScanned, (params) => {
  vis.updateVisual(sort.getArray(), params.index, "gray");
  vis.updateComparisons();
});

sort.addEventListener(SortEvent.SortingFinished, (params) => {
  vis.updateVisual(sort.getArray());
  vis.timer.stop();
});

vis.slider.addEventListener("input", (e) => {
  newArray();
});

vis.newArrayButton.addEventListener("click", (e) => {
  newArray();
});

vis.sortButton.addEventListener("click", (e) => {
  if (!sort.isSorting) {
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
  sort.isSorting = false;
  vis.resetStats();
  currentSize = vis.slider.value;
  sort.remakeArray(currentSize);
  vis.createVisual(sort.getArray());
}
