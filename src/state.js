import { observe } from "./observe/index";

/**
 * 初始化状态
 * @param {object} vm 实例
 */
function initState(vm) {
  const options = vm.$options || {};
  options.data && initData(vm);
}
/**
 * 初始化data
 * @param {object} vm 实例
 */
function initData(vm) {
  let data = vm.$options.data || {};
  data = typeof data === "function" ? data.call(vm) : data;
  /**
   * 响应式劫持代理
   */
  //将vm.data.xxx代理到vm.xxx
  observe(data);
  defineReactivesProxy(vm, data);
}
/**
 * Proxy对对象整体进行劫持
 * @param {object} data
 * @returns
 */
function defineReactivesProxy(vm, data) {
  // return new Proxy(vm, {
  //   /**
  //    * @param {*} target 目标对象
  //    * @param {*} propkey 属性名
  //    * @param {*} reciver Proxy实例本身
  //    */
  //   get: function (target, propkey, reciver) {
  //     console.log(target);
  //     return target["data"][propkey];
  //   },
  // });
  for (let key in data) {
    Object.defineProperty(vm, key, {
      get() {
        return vm["$options"]["data"][key];
      },
      set(newValue) {
        if (newValue !== vm["$options"]["data"][key])
          vm["$options"]["data"][key] = newValue;
        else return;
      },
    });
  }
}
export default initState;
