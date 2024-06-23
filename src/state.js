import Dep from "./dep";
import { observe } from "./observe/index";
import { Watcher } from "./watcher";

/**
 * 初始化状态
 * @param {object} vm 实例
 */
export function initState(vm) {
  const options = vm.$options || {};
  options.data && initData(vm);
  options.computed && initComputed(vm);
  options.watch && initWatch(vm);
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
/**
 * 初始化计算属性
 * @param {object} vm Vue实例
 */
function initComputed(vm) {
  watchers = vm._computeWatchers = {};
  const computed = vm.$options.computed;
  for (const key in computed) {
    let userDef = computed[key];
    defineComputed(vm, key, userDef);
  }
}
let watchers;
/**
 * 定义计算属性
 * @param {object} target vm实例
 * @param {string} key 计算属性名
 * @param {object} userDef 计算属性
 */
function defineComputed(target, key, userDef) {
  const getter = typeof userDef === "function" ? userDef : userDef.get;
  const setter = userDef.set || function () {};
  //监听计算属性中get的变化
  watchers[key] = new Watcher(target, getter, { lazy: true }); //不立即执行fn
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter,
  });
}
/**
 * 检测是否执行getter
 * @param {string} key
 */
function createComputedGetter(key) {
  return function () {
    const watcher = this._computeWatchers[key]; //获取计算属性的watcher
    if (watcher.dirty) {
      //如果是脏值，执行用户传入函数
      watcher.evaluate(); //初次求值后dirty改为false，后续不再走getter
    }
    //说明计算属性出栈后还有渲染watcher，需要将计算属性里面的属性也收集渲染watcher
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  };
}
function initWatch(vm) {
  let watch = vm.$options.watch;
  for (let key in watch) {
    //字符串 数组 函数
    // TODO判断类型
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatch(vm, key, handler[i]);
      }
    } else {
      createWatch(vm, key, handler);
    }
  }
}
/**
 * 处理watch字段对应的变量
 * @param {object} vm 实例
 * @param {string} key 键名
 * @param {Function|string} handler 方法或方法名
 */
function createWatch(vm, key, handler) {
  const type = typeof handler;
  switch (type) {
    case "string":
      handler = vm[handler];
      break;
    default:
      break;
  }
  return vm.$watch(key, handler);
}
