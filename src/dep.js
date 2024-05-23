let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.watchers = []; //当前属性对应的watcher
  }
  depend() {
    Dep.target.addDep(this); //避免重复记录同一个watcher
  }
  addWatcher(watcher) {
    this.watchers.push(watcher);
  }
  notify() {
    this.watchers.forEach((watcher) => watcher.update());
  }
}
Dep.target = null;
const stack = [];
/**
 * 添加监听器
 * @param {*} watcher 监听器
 */
export function pushTarget(watcher) {
  stack.push(watcher);
  Dep.target = watcher;
}
/**
 * 移除监听器，渲染完成之后出栈
 */
export function removeTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}
export default Dep;
