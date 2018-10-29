/*
解析url参数
@example ?id=12345&a=b
@return Object {id:12345,a:b}
*/
export function urlParse() {
  let url = window.location.search;
  //从url拿到字符串,要把字符串变成object
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;//解析字符串
  //正则解释：第一个中括号匹配的是问号，第二个中括号匹配的是id，第三个中括号匹配的是12345,加号一个或多个
  let arr = url.match(reg);
  //['?id=12345','&a=b'],数组拿到了，遍历这个对象
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      //定义临时数组，每个元素再拆分为数组，去掉问号
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;//得到obj，拿到了key和value,返回即可
    });
  };
  return obj;
}
