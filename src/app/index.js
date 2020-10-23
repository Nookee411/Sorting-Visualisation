import 'regenerator-runtime/runtime';
import {Sort, SortEvent} from "./model/core/model";
import {Visualizer} from "./view/view";

let ghpages = require('gh-pages');
ghpages.publish('dist',callback())


let vis = new Visualizer();
let currentSize = vis.slider.value;
let sort = new Sort(currentSize);
let callback = function (err){};
vis.redrawVisual(sort.getArray())

sort.addEventListener(SortEvent.ItemsSorted, (params) => {
    vis.redrawVisual(sort.getArray(), params.indexTwo);
    vis.updateCounter()
})

sort.addEventListener(SortEvent.SortingFinished,(params)=>{
    vis.redrawVisual((sort.getArray()))
    vis.timer.stop()
})

vis.slider.addEventListener('input',(e)=>{
   newArray()
})

vis.newArrayButton.addEventListener('click',(e)=>{
    newArray()
})

vis.sortButton.addEventListener('click',(e)=>{
    if(!sort.isSorting) {
        vis.timer.start()
        sort.bubbleSort()
    }
})

function newArray(){
    sort.isSorting = false;
    vis.resetCounter()
    currentSize = vis.slider.value;
    sort.remakeArray(currentSize);
    console.log(sort.getArray().length);
    vis.redrawVisual(sort.getArray());
}