/**
 * rollup 配置文件，对象形式
 */
import babel from "rollup-plugin-babel";
export default {
  input: "./src/index.js", //打包文件的入口文件
  output: [
    {
      file: "./dist/vue.esm.js", //出口文件
      name: "Vue", //打包后全局新增一个名字叫Vue的对象,global.Vue
      format: "esm", //打包格式 esm es6 umd commonjs等
      sourcemap: true, //可以调试源码
    },
  ],
  plugins: [
    babel({
      exclude: "node_modules/**", ///排除nodemodules
    }),
  ],
};
