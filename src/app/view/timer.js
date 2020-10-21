export const TimerEvents = {
    tick: "TICK",

};
export class Timer{
    interval
    startTime
    constructor() {
        this.events = {}

    }

    start(){
        if(!this.startTime)
            this.startTime = Date.now()
        this.interval = setInterval(()=>
            this.dispatch(TimerEvents.tick,
                {msFromStart: (Date.now() -this.startTime),
                         timeFromStart: this.startTime
                } ),100)
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