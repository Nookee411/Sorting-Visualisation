import { Timer, TimerEvents } from "./timer";

const colors = {
  unsorted: "red",
  sorted: "green",
};

export class Visualizer {
  constructor() {
    this.visualizer = document.getElementById("visualizer");
    this.newArrayButton = document.getElementById("newArray");
    this.slider = document.getElementById("slider");
    this.sortButton = document.getElementById("sortButton");
    this.timerValue = document.getElementById("timerValue");
    this.shifts = 0;
    this.swapValue = document.getElementById("shiftsValue");
    this.comp = 0;
    this.compValue = document.getElementById("comparisonsValue");
    this.timer = new Timer();
    this.timer.addEventListener(TimerEvents.tick, (params) => {
      this.timerValue.innerText = `${Math.round(params.elapsedTime / 1000)}s ${
        params.elapsedTime % 1000
      }ms`;
    });
    this.sortList = document.getElementById("sortList");
    this.currentSort = document.getElementById("active");
  }

  resetStats() {
    this.shifts = 0;
    this.swapValue.innerText = "0";
    this.timerValue.innerText = "0s 0ms";
    this.comp = 0;
    this.compValue.innerText = "0";
  }

  updateCounter() {
    this.swapValue.innerText = (++this.shifts).toString();
  }

  updateComparisons() {
    this.compValue.innerText = (++this.comp).toString();
  }

  updateVisual(array, highlight, color) {
    let columns = this.visualizer.childNodes;
    let columnWidth = this.visualizer / array.length;
    for (let i = 0; i < array.length; i++) {
      let currentColor = colors.unsorted;
      columns[i].style.height = array[i] + "px";
      columns[i].style.backgroundColor = currentColor;
      if (columnWidth > 40) columns[i].innerText = array[i];
    }
    if (highlight < array.length && highlight > 0)
      columns[highlight].style.backgroundColor = color;
  }

  createVisual(array) {
    this.visualizer.innerHTML = "";
    let width = this.visualizer.clientWidth / array.length;
    for (let i = 0; i < array.length; i++) {
      let height = array[i];
      let column = createColumn(width, height);
      if (this.visualizer.clientWidth / array.length > 40)
        column.innerText = height;

      this.visualizer.appendChild(column);
    }

    function createColumn(width, height) {
      let column = document.createElement("div");
      column.style.height = height + "px";
      column.style.width = width + "px";
      column.style.backgroundColor = "red";
      column.style.marginLeft = "3px";
      column.style.borderRadius = width / 3 + "px";
      column.style.display = "flex";
      column.style.justifyContent = "center";
      column.style.alignItems = "center";
      return column;
    }
  }
}
