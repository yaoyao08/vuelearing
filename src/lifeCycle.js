import { createElementVNode, createTextVNode, patch } from "./vdom/index";
import Watcher from "./watcher";

/**
 * 生命周期函数
 */
export function mountComponent(vm, el) {
  //1.调用render产生虚拟节点，虚拟DOM，2.根据虚拟DOM生成DOM 3.DOM插入到el中
  vm.$el = el;
  const updateComponent = () => vm._update(vm._render()); //返回虚拟节点
  const watcher = new Watcher(vm, updateComponent, true); //true表示是一个用于渲染的watcher
}
export function initLifeCycle(Vue) {
  Vue.prototype._update = function (vnode) {
    const el = this.$el;
    this.$el = patch(el, vnode); //初始化、更新功能，将vnode转换为真实dom
  };
  //_c('div',{},...children);
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments);
  };
  //_v(text)
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  /**
   * 值转为字符串输出
   * @param {*} value
   */
  Vue.prototype._s = function (value) {
    if (typeof value !== "object") return value;
    return JSON.stringify(value);
  };
  Vue.prototype._render = function () {
    return this.$options.render.call(this); //返回虚拟节点,with（this）给this 赋值
  };
}
