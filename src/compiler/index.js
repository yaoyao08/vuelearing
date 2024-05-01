/**
 * 模板编译文件
 * _v创建字符串内容 _s解析变量为字符创 _c创建元素
 */
import { parseHTML } from "./createAST";
import { createElement } from "./parseAST";

export function compile2Function(template) {
  //template转换为ast语法树
  let ast = parseHTML(template);
  //render方法,根据ast解析语法树
  // let code = createElement(ast);
  // code = `with(this){return ${code}}`;
  return new Function(`with(this){return ${createElement(ast)}}`);
}
