import { flushCallbacks } from "../flush/index";

//策略模式
const strategies = {};
const LIFECYCLE = [
  "beforeCreate",
  "created",
  "beforeUpdate",
  "beforeMount",
  "updated",
  "mounted",
  "destroyed",
  "beforeDestroy",
];
//钩子函数中将新旧mixin复合在一起
LIFECYCLE.forEach((hook) => {
  strategies[hook] = function (p, c) {
    if (c) {
      if (p) {
        return p.concat(c);
      } else {
        return Array.isArray(c) ? c : [c];
      }
    } else {
      return p;
    }
  };
});

export function nextTick(cb) {
  callbacks.push(cb);
  if (!waitting) {
    timerFunction(flushCallbacks);
    waitting = true;
  }
}
/**
 * mixin方法合并新老属性
 * @param {object} mixinOld 旧的options
 * @param {object} mixinNew 新的options
 * @returns
 */
export function mergeOptions(mixinOld, mixinNew = {}) {
  const options = {};
  for (const key in mixinOld) {
    mergeFiled(key);
  }
  for (const key in mixinNew) {
    if (!mixinOld.hasOwnProperty(key)) {
      mergeFiled(key);
    }
  }
  function mergeFiled(key) {
    //策略模式
    if (strategies[key]) {
      options[key] = strategies[key](mixinOld[key], mixinNew[key]);
    } else options[key] = mixinNew[key] || mixinOld[key];
  }
  return options;
}
