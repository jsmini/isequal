# 文档

支持复杂数据的值比较

## isEqual

递归判断两个变量是否相等，支持自定义比较函数

支持的类型和比较情况如下：

- 转换为数字比较：Boolean, Number, new Date
- 转换为字符串比较：String, regexp, new RegExp
- 递归比较：array, object, set, map
- 全等比较：undefined, null, number, boolean, string, symbol, function等

可以使用自定义比较函数改变比较方式，比如function等

函数参数和返回值

- @param {\*} value 要判断的参数
- @param {\*} object 要判断的另一个参数
- @param {function} enhancer 自定义比较函数或中间件
- @return {boolean} 是否相等

举个例子（要包含代码用例）

```js
import { isEqual } from '@jsmini/isequal';

var a = { a: 1 };
var b = { a: 1 };

a === b; // false
isEqual(a, b); // true
```

自定义比较函数

```js
var c = function a() {};
var d = function a() {};

isEqual(c, d); // false
isEqual(c, d, function (o, t, next) {
  if (typeof o === 'function' && typeof t === 'function') {
    return o.toString() === t.toString();
  }

  return next();
}); // true
```

使用中间件

- functionMiddleware 支持函数的字符串化比较

```js
import { compose, functionMiddleware } from '@jsmini/isequal';

var c = function a() {}
var d = function a() {}

isEqual(c, d); // false
// 单个中间件
isEqual(c, d, functionMiddleware()); // true
// 多个中间件
isEqual(c, d, compose(functionMiddleware(), functionMiddleware()); // true
```

## isEqualJSON

判断两个变量是否相等，内部使用`JSON.stringify`序列化变量，再做比较

函数参数和返回值

- @param {\*} value 要判断的参数
- @param {\*} object 要判断的另一个参数
- @param {function|array} replacer 同JSON.stringify的replacer
- @return {boolean} 是否相等

举个例子（要包含代码用例）

```js
import { isEqualJSON } from '@jsmini/isequal';

var a = { a: 1 };
var b = { a: 1 };

a === b; // false
isEqualJSON(a, b); // true
```

自定义替换函数

```js
var c = function a() {};
var d = function b() {};

isEqualJSON(c, d); // true
isEqualJSON(c, d, function (k, v) {
  if (typeof v === 'function') {
    return v.toString();
  }

  return v;
}); // false
```
