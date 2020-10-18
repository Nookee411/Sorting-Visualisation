
export class Visualizer{
    constructor() {
        this.visualizer = document.getElementById('visualizer');
        this.newArrayButton = document.getElementById('newArray');
        this.slider = document.getElementById('slider');
    }

    redrawVisual(array){
        this.visualizer.innerHTML ='';
        array.forEach((height)=>this.visualizer.appendChild(createColumn(height)));

        function createColumn(height){
            let column = document.createElement("div");
            column.style.height = height +'px';
            column.style.width = '10px';
            column.style.backgroundColor = 'red';
            column.style.marginLeft = '3px';
            column.style.borderRadius = "5px";
            return column;
        }
    }

}