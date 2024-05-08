import { mergeOptions } from "./tools/index";

export function initGlobalAPI(Vue) {
  //静态方法
  Vue.options = {};
  Vue.mixin = function (opt) {
    //将用户的options与全局options进行合并
    this.options = mergeOptions(this.options, opt);
    return this;
  };
}
