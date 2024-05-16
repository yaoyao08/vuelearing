import Dep from "../dep";
import { newArrayProto } from "./array";

/**
 * 数据劫持
 * @param {object} data
 */
export function observe(data) {
  if (typeof data !== "object" || data == null) {
    return; //只对对象进行劫持
  }
  //如果一个对象被劫持过，就不需要再进行劫持
  data = new Observer(data);
  return data;
}
class Observer {
  constructor(data) {
    //给对象包括数组增加收集功能
    this.dep = new Dep();

    // Vue2中的数据劫持方式
    /**定义不可枚举属性 */
    Object.defineProperty(data, "__ob__", { value: this, enumerable: false });
    if (Array.isArray(data)) {
      //针对数组重写数组方法
      data.__proto__ = newArrayProto;
      this.observeArray(data);
    } else this.observer(data);
  }
  observer(data) {
    if (data && typeof data === "object") {
      // defineReactivesProxy(data);
      Object.keys(data).forEach((key) => {
        defineReactives(data, key, data[key]);
      });
    }
  }
  //监听数组中的对象
  observeArray(data) {
    data.forEach((item) => this.observer(item));
  }
}
/**
 * 对象数据劫持方法，使用defineProperty进行劫持
 * @param {object} data 劫持的对象
 * @param {string} key
 * @param {any} value
 */
export function defineReactives(data, key, value) {
  let childObj = observe(value);
  let dep = new Dep(); //为每一个属性创建一个依赖收集器dep
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend(); //增加依赖
        if (childObj) {
          childObj.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        /**
         * 如果设置的值是对象则再次进行代理
         */
        observe(value);
        value = newValue;
        dep.notify(); //通知界面进行更新
      } else return;
    },
  });
}
/**
 * Proxy对对象整体进行劫持
 * @param {object} data 要劫持的对象
 * @returns
 */
export function defineReactivesProxy(data) {
  return new Proxy(data, {
    /**
     * @param {*} target 目标对象
     * @param {*} propkey 属性名
     * @param {*} reciver Proxy实例本身
     */
    get: function (target, propkey, reciver) {
      return target[propkey];
    },
  });
}
/**
 * 对数组中的数组进行劫持
 * @param {object} value 数组
 */
function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    const current = value[i];
    value[i].__ob__ && value[i].__ob__.dep.depend();
    if (Array.isArray(current)) {
      dependArray(current);
    }
  }
}
