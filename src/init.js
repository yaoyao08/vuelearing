/**
 * 初始化Vue
 */
import { compile2Function } from "./compiler/index";
import { nextTick } from "./flush/index";
import { callHook, mountComponent } from "./lifeCycle";
import { initState } from "./state";
import { mergeOptions } from "./tools/index";
import { Watcher } from "./watcher";
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = mergeOptions(this.constructor.options, options);
    callHook(vm, "beforeCreate");
    //初始化状态,初始化计算属性、watcher
    initState(vm);
    callHook(vm, "created");
    if (vm.$options.el) {
      vm.$mount(options.el); //实现数据的挂载
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    callHook(vm, "beforeMount");
    el = document.querySelector(el);
    if (!vm.$options.render) {
      let template;
      if (!vm.$options.template && el) {
        //没有用template，但是写了el
        template = el.outerHTML;
      } else {
        template = vm.$options.template;
      }
      //模板编译
      if (template) {
        const render = compile2Function(template);
        vm.$options.render = render;
      }
    }
    mountComponent(vm, el); //组件挂载
    callHook(vm, "mounted");
  };
  Vue.prototype.$nextTick = nextTick;
  /**
   * 监听
   * @param {string|Function} expOrFn 函数或者字段名
   * @param {Function} cb 回调函数
   * @param {object} options 可选项
   */
  Vue.prototype.$watch = function (expOrFn, cb, options = {}) {
    new Watcher(this, expOrFn, { user: true, ...options }, cb);
  };
}
