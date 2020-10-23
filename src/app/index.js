import 'regenerator-runtime/runtime';
import {Sort, SortEvent} from "./model/core/model";
import {Visualizer} from "./view/view";

// let ghPages = require('gh-pages');
// ghPages.publish('dist',callback())


let vis = new Visualizer();
let currentSize = vis.slider.value;
let sort = new Sort(currentSize);
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
        sort.applySort()
    }
})

vis.sortList.addEventListener('click',(e)=>{
    for (let child of vis.sortList.children) {
        child.className = 'foldMenu__item'
    }
    e.target.className = 'foldMenu__item active';
    sort.setCurrentSort(e.target.id);
})

function newArray(){
    sort.isSorting = false;
    vis.resetCounter()
    currentSize = vis.slider.value;
    sort.remakeArray(currentSize);
    vis.redrawVisual(sort.getArray());
}