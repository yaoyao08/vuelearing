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
export default Dep;
