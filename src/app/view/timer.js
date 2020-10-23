export const TimerEvents = {
    tick: "TICK",

};
export class Timer{
    interval
    startTime
    tickRate
    constructor() {
        this.events = {}
    }

    start(){
        this.startTime = Date.now();
        this.interval = setInterval(()=>{
            this.dispatch(TimerEvents.tick,
                {elapsedTime: Date.now() - this.startTime }
                )},100)
    }

    stop(){
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