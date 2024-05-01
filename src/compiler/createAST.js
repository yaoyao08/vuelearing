//
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //标签名不能以数字开头，字符或下划线
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); //匹配标签名 <div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); //匹配标签名结束符 </div>
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //匹配属性值 a = b
const startTagClose = /^\s*(\/?)>/; //匹配自闭合标签
/**
 * 解析DOM节点
 * @param {string} template
 */
export function parseHTML(html) {
  const ELEMENT_TYPE = 1; //元素类型
  const TEXT_TYPE = 3; //文本类型
  const stack = []; //用于存放元素
  let currentParent; //指向栈中的最后一个元素
  let root; //ast语法树的根节点
  /**
   * 创建一个AST抽象语法树元素
   * @param {string} tag 标签名
   * @param {Array} attrs 属性
   */
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    };
  }
  /**
   * 处理获取的标签开始
   * @param {string} tag 标签名
   * @param {Array} attrs 属性值
   */
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs);
    if (!root) root = node;
    if (currentParent) {
      node.parent = currentParent;
      currentParent.children.push(node);
    }
    stack.push(node);
    currentParent = node;
  }
  /**
   * 处理结束标签
   * @param {string} tag 标签
   */
  function end(tag) {
    stack.pop();
    currentParent = stack[stack.length - 1];
  }
  /**
   * 处理标签中间的文本值
   * @param {string} text 文本值
   */
  function char(text) {
    text = text.replace(/\s/g, "");
    text &&
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentParent,
      });
  }

  /**
   * 在html字符串中删除已经匹配过的字符串
   * @param {number} n
   */
  function advance(n) {
    html = html.substring(n);
  }
  /**
   * 匹配标签内容
   * @returns boolean
   */
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);
      //如果不是当前标签的结束就一直匹配
      let attr, end;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true,
        });
      }
      if (end) advance(end[0].length);
      return match;
    }
    return false; //不是开始标签则直接返回
  }
  while (html) {
    //如果是0代表是标签的起始位置，如果>0代表是前一个标签内容的结束位置
    const textEnd = html.indexOf("<");
    if (textEnd == 0) {
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        //解析到的开始标签
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        //处理结束标签
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd);
      if (text) {
        char(text);
        advance(text.length); //解析到的文本
      }
    }
  }
  return root; //返回ast语法树
}
