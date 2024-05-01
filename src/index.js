import { initMixin } from "./init";
import { initLifeCycle } from "./lifeCycle";
function Vue(options) {
  this._init(options);
}
initMixin(Vue); //初始化
initLifeCycle(Vue); //生命周期函数
export default Vue;
