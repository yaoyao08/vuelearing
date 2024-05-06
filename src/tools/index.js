import { flushCallbacks } from "../flush/index";

/**
 * 实现异步任务降级
 */
let timerFunction;
if (Promise) {
  timerFunction = (cb) => {
    Promise.resolve().then(cb);
  };
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks);
  let textNode = document.createTextNode(1);
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunction = () => {
    textNode.textContent = 2;
  };
} else if (setImmediate) {
  timerFunction = (cb) => {
    setImmediate(cb);
  };
} else {
  timerFunction = (cb) => {
    setTimeout(cb, 0);
  };
}
export function nextTick(cb) {
  callbacks.push(cb);
  if (!waitting) {
    timerFunction(flushCallbacks);
    waitting = true;
  }
}
export default timerFunction;
