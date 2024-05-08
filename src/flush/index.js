/**
 * 实现Vue的异步更新
 */
let queue = [];
let has = new Set();
let pending = false; //防抖
export function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has.has(id)) {
    queue.push(watcher);
    has.add(id);
    console.log(queue);
    if (!pending) {
      nextTick(flushSchedulerQueue);
      pending = true;
    }
  }
}
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
/**
 * 异步更新队列
 */
export function flushSchedulerQueue() {
  let flushQueue = queue.slice(0);
  pending = false;
  queue = [];
  has.clear();
  flushQueue.forEach((q) => q.run());
}
let callbacks = []; //回调函数列表
let waitting = false;
/**
 * 批任务队列执行
 */
export function flushCallbacks() {
  let cbs = callbacks.slice(0);
  waitting = false;
  callbacks = [];
  cbs.forEach((cb) => cb());
}
/**
 * 批任务执行
 * @param {function} cb 回调函数
 */
export function nextTick(cb) {
  callbacks.push(cb);
  if (!waitting) {
    timerFunction(flushCallbacks);
    waitting = true;
  }
}
