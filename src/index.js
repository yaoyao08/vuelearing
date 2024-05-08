import { initGlobalAPI } from "./globalAPI";
import { initMixin } from "./init";
import { initLifeCycle } from "./lifeCycle";
function Vue(options) {
  this._init(options);
}
initMixin(Vue); //初始化
initLifeCycle(Vue); //生命周期函数
initGlobalAPI(Vue);
export default Vue;
