/**
 * 生命周期函数
 */
export function mountComponent(vm, el) {
  //1.调用render产生虚拟节点，虚拟DOM，2.根据虚拟DOM生成DOM 3.DOM插入到el中
  vm._update(vm._render.call(vm)); //返回虚拟节点
}
export function initLifeCycle(Vue) {
  Vue.prototype._update = function () {};
  Vue.prototype._render = function () {};
}
