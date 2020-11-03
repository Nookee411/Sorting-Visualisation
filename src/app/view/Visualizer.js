import { Timer, TimerEvents } from "./timer";

export const colors = {
  unsorted: "cadetblue",
  sorted: "green",
  swapped: "DeepPink",
  scanned: "gray",
};

const elementIDs = {
  COLUMN_CONTAINER: "visualizer",
  TIMER_VALUE: "timerValue",
  SWAP_VALUE: "shiftsValue",
  COMPARATIONS_VALUE: "comparisonsValue",
  SORT_LIST: "sortList",
  ACTIVE_SORT_ALGO: "active",
  NEW_ARRAY_BUTTON: "newArray",
  ARRAY_SIZE_SLIDER: "slider",
  START_SORT_BUTTON: "sortButton",
};

export function Visualizer() {
  let columnContainer = document.getElementById(elementIDs.COLUMN_CONTAINER);
  let timerValue = document.getElementById(elementIDs.TIMER_VALUE);
  let swapValue = document.getElementById(elementIDs.SWAP_VALUE);
  let compValue = document.getElementById(elementIDs.COMPARATIONS_VALUE);
  let columns;
  let columnWidth;
  let shifts = 0;
  let comp = 0;

  this.sortList = document.getElementById(elementIDs.SORT_LIST);
  this.currentSort = document.getElementById(elementIDs.ACTIVE_SORT_ALGO);
  this.newArrayButton = document.getElementById(elementIDs.NEW_ARRAY_BUTTON);
  this.slider = document.getElementById(elementIDs.ARRAY_SIZE_SLIDER);
  this.sortButton = document.getElementById(elementIDs.START_SORT_BUTTON);
  this.timer = new Timer();
  this.timer.addEventListener(TimerEvents.tick, (params) => {
    timerValue.innerText = `${Math.round(params.elapsedTime / 1000)}s ${
      params.elapsedTime % 1000
    }ms`;
  });

  this.resetStats = function () {
    shifts = 0;
    swapValue.innerText = "0";
    timerValue.innerText = "0s 0ms";
    comp = 0;
    compValue.innerText = "0";
  };
  this.increaseSwapCounter = function () {
    swapValue.innerText = (++shifts).toString();
  };

  this.updateComparisons = function () {
    compValue.innerText = (++comp).toString();
  };

  this.updateVisual = function (array, indexOfHighlightedElement, color) {
    defineColumnNumber();
    defineColumnWidth(array.length);
    for (let i = 0; i < array.length; i++) {
      setColumnStyle(array, i);
    }
    if (
      indexOfHighlightedElement.indexTwo < array.length &&
      indexOfHighlightedElement.indexTwo > 0
    )
      columns[indexOfHighlightedElement.indexTwo].style.backgroundColor = color;
    if (
      indexOfHighlightedElement.indexOne < array.length &&
      indexOfHighlightedElement.indexOne > 0
    )
      columns[indexOfHighlightedElement.indexOne].style.backgroundColor = color;
  };

  let defineColumnNumber = function () {
    columns = columnContainer.childNodes;
  };

  let defineColumnWidth = function (arrayLength) {
    columnWidth = columnContainer.offsetWidth / arrayLength;
  };

  let setColumnStyle = function (array, columnIndex) {
    let currentColor = colors.unsorted;
    columns[columnIndex].style.height = array[columnIndex] + "px";
    columns[columnIndex].style.backgroundColor = currentColor;
    if (columnWidth > 40) columns[columnIndex].innerText = array[columnIndex];
  };

  this.createVisual = function (array) {
    defineColumnWidth(array.length);
    columnContainer.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
      let column = createColumnFromValue(array[i]);
      columnContainer.appendChild(column);
    }
  };

  let createColumnFromValue = function (value) {
    let column = document.createElement("div");
    column.style.height = value + "px";
    column.style.width = columnWidth + "px";
    column.style.backgroundColor = colors.unsorted;
    column.style.marginLeft = "3px";
    column.style.borderRadius = columnWidth / 3 + "px";
    column.style.display = "flex";
    column.style.justifyContent = "center";
    column.style.alignItems = "center";
    if (columnWidth > 40) column.innerText = value;
    return column;
  };
}
