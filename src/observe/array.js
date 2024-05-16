/**
 * 重写数组中的部分方法
 */
let oldArrProto = Array.prototype; //h获取数组的原型

//newArrayProto.__proto__ = Array.prototype
export let newArrayProto = Object.create(oldArrProto);
//所有能修改原数组的方法
let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];

methods.forEach((method) => {
  // 重写了数组方法
  newArrayProto[method] = function (...params) {
    const res = oldArrProto[method].call(this, ...params);
    //需要对新增的对象再次进行劫持
    let inserted;
    switch (method) {
      case "push":
        inserted = params;
        break;
      case "splice":
        //arr.splice(0,1,{},{}...);
        inserted = params.slice(2);
        break;
      case "unshift":
        inserted = params;
        break;
    }
    if (inserted) {
      this.__ob__.observeArray(inserted);
    }
    this.__ob__.dep.notify();
    return res;
  };
});
