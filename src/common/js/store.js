export function saveToLocal(id,key,value) {
  let seller = window.localStorage._seller_;
  //首先外层有个seller，双下划线私有的,把所有的东西存到_seller_里面
  if (!seller) {
    seller = {};
    seller[id] = {};//每个seller有不同id，把id存一下，
  } else {//如果localStorage下面已经有个seller，走else
    seller = JSON.parse(seller);//seller是个字符串，
    if (!seller[id]) {//拿到这个，判断,若没有这个商家
      seller[id] = {};//存储对象
    }
  }
  seller[id][key] = value;//这样赋值到每个商家下面，id相关联,执行
  localStorage._seller_=JSON.stringify(seller);
  //我们要存储的是个字符串,在localStorage下边是不允许直接存储字符串的
};
export function loadFormLocal(id,key,def) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    return def;//完全没有存储过，去读取，是默认值
  }
  seller = JSON.parse(seller)[id];//转化成json对象，同时拿到对应的id
  if (!seller) {
    return def;//空的话，返回默认值，
  }
  let ret = seller[key];//否则，返回id对应的key
  return ret || def;//ret没有的话，返回默认值
};
