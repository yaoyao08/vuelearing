/**
 * 根据AST生成元素
 * @param {object} ast 抽象语法树
 */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //匹配{{x}}
export function createElement(ast) {
  let children = parseChildren(ast);
  let code = `_c('${ast.tag}',${
    ast.attrs.length > 0 ? parseProps(ast.attrs) : "null"
  }),${ast.children.length > 0 ? children : ""}`;
  return code;
}
/**
 * 解析属性值
 * @param {Array} attrs
 */
function parseProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    //style以对象形式处理
    let styleItem = {};
    if (attr.name === "style") {
      console.log(attr.value);
      attr.value
        .toString()
        .split(";")
        .forEach((prop) => {
          let [key, val] = prop.split(":");
          styleItem[key] = val;
        });
      attr.value = styleItem;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
/**
 * 解析children节点列表
 * @param {object} ast 抽象语法树
 */
function parseChildren(ast) {
  if (ast.children.length > 0) {
    const children = ast.children;
    return children.map((child) => parseChild(child)).join(",");
  } else return "";
}
/**
 * 解析child元素
 * @param {object} child child子节点
 */
function parseChild(child) {
  if (child.type === 1) {
    return createElement(child);
  } else {
    let text = child.text;
    //文本节点：1.{{xx}}变量2.xxx纯文本
    //判断是否是纯文本节点
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      let tokens = []; //分割的变量与文本
      let match; //正则匹配捕获的结果
      defaultTagRE.lastIndex = 0;
      let lastIndex = 0;
      while ((match = defaultTagRE.exec(text))) {
        /**match: ["{{age}}","age"]*/
        let index = match.index;
        if (index > lastIndex) {
          tokens.push(`"${text.slice(lastIndex, index)}"`);
        }
        tokens.push(`_s(${match[1].replace(/\s/g, "")})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(`"${text.slice(lastIndex)}"`);
      }
      return `_v(${tokens.join("+")})`;
    }
  }
}
