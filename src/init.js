/**
 * 初始化Vue
 */
import { compile2Function } from "./compiler/index";
import { mountComponent } from "./lifeCycle";
import initState from "./state";
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options || {};
    //初始化状态
    initState(vm);
    if (vm.$options.el) {
      vm.$mount(options.el); //实现数据的挂载
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
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
  };
}
