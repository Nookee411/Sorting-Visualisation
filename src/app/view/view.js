import { Timer, TimerEvents } from "./timer";

const colors = {
  unsorted: "red",
  sorted: "green",
};

export function Visualizer() {
  let columnContainer = document.getElementById("visualizer");
  let timerValue = document.getElementById("timerValue");
  let swapValue = document.getElementById("shiftsValue");
  let compValue = document.getElementById("comparisonsValue");
  let columns;
  let columnWidth;
  let shifts = 0;
  let comp = 0;

  this.timer = new Timer();
  this.timer.addEventListener(TimerEvents.tick, (params) => {
    this.timerValue.innerText = `${Math.round(params.elapsedTime / 1000)}s ${
      params.elapsedTime % 1000
    }ms`;
  });
  this.sortList = document.getElementById("sortList");
  this.currentSort = document.getElementById("active");
  this.newArrayButton = document.getElementById("newArray");
  this.slider = document.getElementById("slider");
  this.sortButton = document.getElementById("sortButton");

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
      indexOfHighlightedElement < array.length &&
      indexOfHighlightedElement > 0
    )
      columns[indexOfHighlightedElement].style.backgroundColor = color;
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
      console.log(column);
      columnContainer.appendChild(column);
    }
  };

  let createColumnFromValue = function (value) {
    let column = document.createElement("div");
    column.style.height = value + "px";
    console.log(columnWidth);
    column.style.width = columnWidth + "px";
    column.style.backgroundColor = "red";
    column.style.marginLeft = "3px";
    column.style.borderRadius = columnWidth / 3 + "px";
    column.style.display = "flex";
    column.style.justifyContent = "center";
    column.style.alignItems = "center";
    if (columnWidth > 40) column.innerText = value;
    return column;
  };
}
