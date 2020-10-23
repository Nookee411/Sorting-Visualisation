export const TimerEvents = {
    tick: "TICK",

};
export class Timer{
    interval
    elapsedTime
    constructor() {
        this.events = {}

    }

    start(){
        this.elapsedTime = 0;
        this.interval = setInterval(()=>{
            this.elapsedTime+=100;
            this.dispatch(TimerEvents.tick,
                {elapsedTime: this.elapsedTime,}
                )},100)
    }

    stop(){
        this.elapsedTime =0;
        clearInterval(this.interval)
    }

    addEventListener(event,callback){
        this.events[event] = callback;
    }

    removeEventListener(event){
        delete this.events[event];
    }

    dispatch(event,params){
        let callback = this.events[event];
        if(callback)
            callback(params);
    }

}