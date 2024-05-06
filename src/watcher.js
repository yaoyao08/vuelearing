import Dep from "./dep";
import { queueWatcher } from "./flush/index";

let id = 0;
//需要为每一个属性增加一个dep，收集依赖
/**
 * 监听器，实现依赖收集
 */
export default class Watcher {
  constructor(vm, fn, flag) {
    this.id = id++;
    this.renderWatcher = flag; //标记是否为用于渲染的watcher
    this.getter = fn; //调用该函数可以取值
    //为了触发fn的取值，需要先调用一次
    this.deps = []; //实现计算属性和清理工作
    this.depsId = new Set();
    this.get();
  }
  get() {
    Dep.target = this; //静态属性
    this.getter();
    Dep.target = null; //渲染完成后清空
  }
  addDep(dep) {
    if (!this.depsId.has(dep.id)) {
      this.deps.push(dep); //去重
      this.depsId.add(dep.id); //记录watcher包含的dep
      dep.addWatcher(this); //将dep涉及的watcher也进行记录
    }
  }
  update() {
    queueWatcher(this); //对watcher去重
    // this.get(); //重新渲染，更新
  }
  run() {
    console.log("run123");
    this.get(); //
  }
}
