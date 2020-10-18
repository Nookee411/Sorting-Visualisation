import 'regenerator-runtime/runtime';
import {Sort, SortEvent} from "./model";
import {Visualizer} from "./view";

let sort = new Sort(10);
let vis = new Visualizer();
let currentSize = 50;

vis.redrawVisual(sort.getArray())

sort.addEventListener(SortEvent.ItemsSorted, (params) => {
    vis.redrawVisual(sort.getArray(), params.indexTwo);
})

vis.slider.addEventListener('input',(e)=>{
    currentSize = vis.slider.value;
    sort.setSize(currentSize);
    vis.redrawVisual(sort.getArray());
})

vis.newArrayButton.addEventListener('click',(e)=>{
    sort.remakeArray();
    vis.redrawVisual(sort.getArray());
})

vis.sortButton.addEventListener('click',(e)=>{
    sort.bubbleSort()
    vis.redrawVisual(sort.getArray())
})
