
import {Timer,TimerEvents} from "./timer";

export class Visualizer{
    constructor() {
        this.visualizer = document.getElementById('visualizer');
        this.newArrayButton = document.getElementById('newArray');
        this.slider = document.getElementById('slider');
        this.sortButton = document.getElementById('sortButton');
        this.timerValue = document.getElementById('timerValue');
        this.shifts = 0;
        this.shiftsValue = document.getElementById('shiftsValue')
        this.timer = new Timer();
        this.timer.addEventListener(TimerEvents.tick,(params)=>{
            this.timerValue.innerText = `${Math.round(params.msFromStart/1000)}s ${params.msFromStart % 1000}ms`;
        })
        this.sortList = document.getElementById('sortList')
        this.currentSort = document.getElementById('active')
    }

    resetCounter(){
        this.shifts = 0
        this.shiftsValue.innerText = '0'
    }

    updateCounter(){
        this.shiftsValue.innerText = (++this.shifts).toString()
    }

    clearStats(){
        this.timerValue.innerText = '0s 0ms'
    }

    redrawVisual(array, highlight){
        this.visualizer.innerHTML ='';
        for (let i = 0; i < array.length; i++){
            let height = array[i];

        let column = createColumn(this.visualizer.clientWidth/array.length, height);
            if(this.visualizer.clientWidth/array.length>40)
                column.innerText = height;
            if(i === highlight)
                column.style.backgroundColor = "yellow";
            this.visualizer.appendChild(column);
        }

        function createColumn(width, height){
            let column = document.createElement("div");
            column.style.height = height +'px';
            column.style.width = width +'px';
            column.style.backgroundColor = 'red';
            column.style.marginLeft = '3px';
            column.style.borderRadius = width/3+"px";
            column.style.display = 'flex';
            column.style.justifyContent = 'center';
            column.style.alignItems = 'center';
            return column;
        }
    }
}