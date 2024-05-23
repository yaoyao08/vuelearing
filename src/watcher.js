import Dep, { pushTarget, removeTarget } from "./dep";
import { queueWatcher } from "./flush/index";

let id = 0;
//需要为每一个属性增加一个dep，收集依赖
/**
 * 监听器，实现依赖收集
 */
export class Watcher {
  constructor(vm, fn, flag) {
    this.id = id++;
    this.renderWatcher = flag; //标记是否为用于渲染的watcher
    this.getter = fn; //调用该函数可以取值
    //为了触发fn的取值，需要先调用一次
    this.deps = []; //实现计算属性和清理工作
    this.depsId = new Set();
    this.vm = vm;
    this.lazy = flag.lazy;
    this.dirty = this.lazy;
    this.lazy ? 1 : this.get();
  }
  get() {
    pushTarget(this); //将监听器添加到dep上
    const value = this.getter.call(this.vm);
    removeTarget(); //渲染完成后清空
    return value;
  }
  evaluate() {
    this.value = this.get(); //获取用户函数的返回值
    this.dirty = false;
  }
  addDep(dep) {
    if (!this.depsId.has(dep.id)) {
      this.deps.push(dep); //去重
      this.depsId.add(dep.id); //记录watcher包含的dep
      dep.addWatcher(this); //将dep涉及的watcher也进行记录
    }
  }
  update() {
    if (this.lazy) this.dirty = true;
    else queueWatcher(this); //对watcher去重
    // this.get(); //重新渲染，更新
  }
  run() {
    console.log("run123");
    this.get(); //
  }
  depend() {
    this.deps.map((dep) => {
      dep.depend();
    });
  }
}
