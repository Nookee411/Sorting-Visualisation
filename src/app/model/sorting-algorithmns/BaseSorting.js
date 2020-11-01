import { sortingState } from "./sortingState";
import { SortEvents } from "../core/model";
export function BaseSort() {
  let currentSortingState;
  let sortArray = function (array) {};
  let events = {};

  this.stopSorting = function () {
    currentSortingState = sortingState.stopped;
  };
  this.addEventListener = function (eventName, callBack) {
    events = even;
  };
  this.removeEventListener = function (eventName) {
    delete events[eventName];
  };

  let dispatch = function (eventName, params) {
    const callback = events[eventName];
    if (callback) callback(params);
  };
}
