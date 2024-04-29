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
}
class Observer {
  constructor(data) {
    // Vue2中的数据劫持方式
    this.observer(data);
  }
  observer(data) {
    if (data && typeof data === "object") {
      // defineReactivesProxy(data);
      Object.keys(data).forEach((key) => {
        defineReactives(data, key, data[key]);
      });
    }
  }
}
/**
 * 对象数据劫持方法，使用defineProperty进行劫持
 * @param {object} data 劫持的对象
 * @param {string} key
 * @param {any} value
 */
export function defineReactives(data, key, value) {
  observe(value);
  Object.defineProperty(data, key, {
    get() {
      console.log(12);
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        /**
         * 如果设置的值是对象则再次进行代理
         */
        observe(value);
        value = newValue;
      } else return;
    },
  });
}
/**
 * Proxy对对象整体进行劫持
 * @param {object} data
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