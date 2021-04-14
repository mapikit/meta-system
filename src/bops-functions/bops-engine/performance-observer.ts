import { TTLExceededError } from "@api/bops-functions/bops-engine/engine-errors/execution-time-exceeded";
import { performance, PerformanceObserver } from "perf_hooks";

class MetaSystemPerformance  {
  private startingTime : number;
  private observer : PerformanceObserver;
  constructor () {
    this.observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(() => {
        const currentClock = performance.now();
        const elapsedTime = currentClock - this.startingTime || currentClock;
        if(elapsedTime >= 5000) {
          throw new TTLExceededError(elapsedTime);
        }
      });
    });
  }

  public startClock () : void {
    this.startingTime = performance.now();
    this.observer.observe({ entryTypes: ["function"], buffered: true });
  }
}

export default new MetaSystemPerformance();
