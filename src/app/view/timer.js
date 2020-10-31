export const TimerEvents = {
  tick: "TICK",
};
export class Timer {
  interval;
  tickRate;
  elapsedTime;
  constructor() {
    this.events = {};
    this.tickRate = 1000 / 20;
  }

  start() {
    this.elapsedTime = 0;
    this.interval = setInterval(() => {
      this.dispatch(TimerEvents.tick, {
        elapsedTime: (this.elapsedTime += this.tickRate),
      });
    }, this.tickRate);
  }

  stop() {
    clearInterval(this.interval);
  }

  addEventListener(event, callback) {
    this.events[event] = callback;
  }

  removeEventListener(event) {
    delete this.events[event];
  }

  dispatch(event, params) {
    let callback = this.events[event];
    if (callback) callback(params);
  }
}
