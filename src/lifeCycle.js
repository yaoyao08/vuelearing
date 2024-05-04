import { createElementVNode, createTextVNode } from "./vdom/index";

/**
 * 生命周期函数
 */
export function mountComponent(vm, el) {
  //1.调用render产生虚拟节点，虚拟DOM，2.根据虚拟DOM生成DOM 3.DOM插入到el中
  vm.$el = el;
  vm._update(vm._render()); //返回虚拟节点
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

export function patch(oldVnode, vnode) {
  //初次渲染流程
  //判断oldVnode是否为真实元素
  const isRealElement = oldVnode.nodeType; //原生为1
  if (isRealElement) {
    const elm = oldVnode;
    const parent = elm.parentNode; //获取父节点
    //根据虚拟机节点创建真实元素
    let newElm = createElm(vnode);
    parent.insertBefore(newElm, elm.nextSibling);
    parent.removeChild(elm);
    return newElm;
  } else {
    //diff
  }
}
function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag); //真实节点与虚拟节点对应，方便实现虚拟dom的diff
    patchProps(vnode.el, data); //更新属性
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
function patchProps(el, props) {
  for (const key in props) {
    if (key === "style") {
      for (const styleItem in props.style) {
        el.style[styleItem] = props.style[styleItem];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}
