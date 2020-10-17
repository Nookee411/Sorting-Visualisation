let visualizer = document.getElementById('visualizer');
let newArrayButton = document.getElementById('newArray');
let array = initArray(10);
redrawVisual(array);

newArrayButton.addEventListener('click',(e)=>{
    if(e.button ===0){
        array = initArray(10);
        redrawVisual(array);
    }
})


function redrawVisual(array){
    visualizer.childNodes.forEach((x)=>{x.remove()});
    array.forEach((height)=>visualizer.appendChild(createColumn(height)));
}

function createColumn(height){
    let column = document.createElement("div");
    column.style.height = height +'px';
    column.style.width = '10px';
    column.style.backgroundColor = 'red';
    column.style.marginLeft = '3px';
    column.style.borderRadius = "5px";
    return column;
}

function initArray(n){
    let array = new Array(n);
    for (let i = 0; i < n; i++) {
        array[i] =getRandomValue(10,500);
    }
    return array;
}

function getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
}