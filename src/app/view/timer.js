export const TimerEvents = {
  tick: "TICK",
};
//TODO Find solution to stop timer while browser is not active
export function Timer() {
  let interval;
  const tickRate = 1000 / 20;
  let elapsedTime;
  let events = {};

  this.start = function () {
    elapsedTime = 0;
    defineInterval();
  };

  let defineInterval = function () {
    interval = setInterval(() => {
      dispatch(TimerEvents.tick, {
        elapsedTime: (elapsedTime += tickRate),
      });
    }, tickRate);
  };

  this.stop = function () {
    clearInterval(interval);
  };

  this.addEventListener = function (eventName, callback) {
    events[eventName] = callback;
    console.log(events);
  };

  this.removeEventListener = function (eventName) {
    delete events[eventName];
  };

  let dispatch = function (eventName, params) {
    let callback = events[eventName];
    if (callback) callback(params);
  };
}
