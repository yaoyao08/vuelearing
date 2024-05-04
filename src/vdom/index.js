//h() _c()
export function createElementVNode(vm, tag, data, ...children) {
  if (data === null) data = {};
  let key = data.key;
  if (key) delete data.key;
  return vnode(vm, tag, key, data, children);
}
// _v()
export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, key, data, children, text = "") {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
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
