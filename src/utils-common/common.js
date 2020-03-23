import Taro from "@tarojs/taro";

// create GUID
export function createGuid() {
  var guid = "";
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if ((i === 8) || (i === 12) || (i === 16) || (i === 20)) {
      guid += "-";
    }
  }
  return guid.toLowerCase();
}

// string remove spaces
export function trim(str) {
  return (str === undefined || str === null) ? "" : str.replace(/(^\s*)|(\s*$)/g, "").replace(new RegExp("(^　*)|(　*$)", "g"), "");
}

// whether the string is empty
export function isNullOrEmpty(value) {
  return (value === null || value === undefined) || trim(value.toString()) === ""
}

// Whether the string is empty, if it is empty, 
// only the default value is returned, otherwise the current value is returned.
export function isNullOrEmptyReturnDefault(value, defaultValue) {
  return isNullOrEmpty(value) ? defaultValue : value;
}

export function hasWindow() {
  return typeof window !== undefined;
}

//Get the query string
export function getQueryString(query) {
  let args = {};
  const location = hasWindow() ? window.location : null;
  if (location && !query) {
    query = location.search.substring(1);
    if (location.search === "") {
      const index = location.href.indexOf("?");
      if (index > 0) query = location.href.substring(index + 1);
    }
  }
  if (!query) return args;
  var pairs = query.split("&");
  for (let i = 0; i < pairs.length; i++) {
    let pos = pairs[i].indexOf('=');
    if (pos === -1) continue
    let argname = pairs[i].substring(0, pos);
    let value = pairs[i].substring(pos + 1);
    args[argname] = unescape(value);
  }
  return args;
}

export function addUrlRandom(url) {
  if (isNullOrEmpty(url)) return "";

  const rc = getRandomChars();
  const rd = Math.random();
  url += url.indexOf("?") >= 0 ? "&" : "?";
  url += `_r${rc}=${rd}`;
  return url;
}

export function addUrlParams(url, name, value, blUrl) {
  if (isNullOrEmpty(url)) return "";
  if (value === undefined || value === null) return url;
  url += url.indexOf("?") >= 0 ? "&" : "?";
  value = blUrl ? encodeURIComponent(value) : escape(value);
  url += `${name}=${value}`;
  return url;
}

export function getRandomChars(len) {
  len = len || 10;
  var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz";
  var str = [];
  for (var i = 0; i < len; i++) {
    str.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }
  return str.join("");
}

export function getStorage(key) {
  try {
    return Taro.getStorageSync(key);
  } catch (e) {
    console.warn('utils-common/common/getStorage', e);
  }
}

export function setStorage(key, value) {
  try {
    Taro.setStorageSync(key, value);
  } catch (e) {
    console.warn('utils-common/common/setStorage', e);
  }
}

export function removeStorage(key) {
  try {
    Taro.removeStorageSync(key);
  } catch (e) {
    console.warn('utils-common/common/removeStorage', e);
  }
}

export function clearStorage() {
  try {
    Taro.clearStorageSync();
  } catch (e) {
    console.warn('utils-common/common/clearStorage', e);
  }
}

//Whether array
export function isArray(obj) {
  if (obj === null || obj === undefined) return false
  return typeof (obj) === "object" && obj.length >= 0
}

export function isFunction(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}

export function isEmptyArray(obj) {
  if (!isArray(obj) || obj.length === 0) return true;
  return false;
}

export function isNoEmptyArray(obj) {
  if (isArray(obj) && obj.length > 0) return true;
  return false;
}

export function isObject(obj) {
  if (obj === null || obj === undefined) return false;
  return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
}

export function getObjValue(obj, name, defaultValue) {
  if (!isObject(obj) || isNullOrEmpty(name)) return defaultValue;

  for (let key in obj) if (key.toLowerCase() === name.toLowerCase()) return obj[key];

  return defaultValue;
}

export function isEmptyObject(obj) {
  if (!isObject(obj)) return true;

  if (Object.getOwnPropertyNames(obj).length > 0) return false;

  let blEmpty = true;
  for (let key in obj) if (key) { blEmpty = false; break; }

  return blEmpty;
}

export function copy(a, b, c) {
  if (!isObject(a) || !isObject(b)) return;

  if (isArray(c)) {
      let n = "";
      for (let i = 0; i < c.length; i++) {
          n = c[i];
          if (b[n] !== undefined) a[n] = b[n];
          else for (let k in b) if (k === n) { a[n] = b[n]; break; }
      }
  }
  else for (let k in b) a[k] = b[k];
}

export function isEquals(a, b, c) {
  if (a === undefined && b === undefined) return true;
  if (a === null && b === null) return true;
  if (a === b) return true;

  let a_isArray = isArray(a), b_isArray = isArray(b);
  let a_isObj = isObject(a), b_Obj = isObject(b);

  if ((a_isArray && !b_isArray) || (!a_isArray && b_isArray)) return false;
  if ((a_isObj && !b_Obj) || (!a_isObj && b_Obj)) return false;

  if (a_isArray && b_isArray) return isArrayEquals(a, b);
  if (a_isObj && b_Obj) return isObjectEquals(a, b);

  let sa = isNullOrEmpty(a) ? "" : a.toString();
  let sb = isNullOrEmpty(b) ? "" : b.toString();
  return c ? sa.toLowerCase() === sb.toLowerCase() : sa === sb;
}

export function isArrayEquals(a, b) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  let blEquals = true;
  for (let i = 0; i < a.length; i++) {
      blEquals = isObjectEquals(a[i], b[i]);
      if (!blEquals) break;
  }

  return blEquals;
}

export function isObjectEquals(a, b) {
  if (a === b) return true;

  let blEquals = true;

  for (let k in a) {
      blEquals = isEquals(a[k], b[k]);
      if (!blEquals) break;
  }

  if (blEquals) {
      for (let k in b) {
          if (a[k] === undefined) {
              blEquals = false;
              break;
          }
      }
  }

  return blEquals;
}

export function arrayFirst(list, fn) {
  if (!isArray(list)) return null;
  const list2 = list.filter(fn)
  return list2.length > 0 ? list2[0] : null;
}

export function getNumber(value, scale) {
  let f = parseFloat(value)
  if (Number.isNaN(f)) return 0;
  if (f === 0) return f;

  scale = (scale || 2);
  scale = Math.pow(10, scale);
  return Math.round(f * scale) / scale
}

export function toCurrency(value, blFixed2) {
  blFixed2 = blFixed2 === undefined ? true : blFixed2
  var floatValue = parseFloat(value);
  if (Number.isNaN(floatValue)) {
      return value
  }
  else {
      var flString = blFixed2 ? floatValue.toFixed(2) : floatValue.toString()
      var r = /(\d+)(\d{3})/
      while (r.test(flString)) {
          flString = flString.replace(r, "$1,$2")
      }
      return flString
  }
}

export function toFixed(value, num) {
  if (!value) return value;
  return getNumber(value).toFixed(num);
}

export function getDateString(myDate, isDate) {
  if (isNullOrEmpty(myDate)) return "";
  if (typeof (myDate) === "number") myDate = new Date(myDate);

  var year = myDate.getFullYear().toString();
  var month = (myDate.getMonth() + 1);
  month = month < 10 ? "0" + month.toString() : month.toString();
  var day = myDate.getDate();
  day = day < 10 ? "0" + day.toString() : day.toString();
  if (isDate) {
      return year + "-" + month + "-" + day;
  }
  else {
      var hh = myDate.getHours();
      hh = hh < 10 ? "0" + hh.toString() : hh.toString();
      var mm = myDate.getMinutes();
      mm = mm < 10 ? "0" + mm.toString() : mm.toString();
      var ss = myDate.getSeconds();
      ss = ss < 10 ? "0" + ss.toString() : ss.toString();
      return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
  }
}

export function getCurrentDate() {
  var myDate = new Date();
  return getDateString(myDate);
}

export function arrayMax(list, name) {
  if (list.length === 0) return null;
  list = list.sort((a, b) => a[name] > b[name] ? -1 : 1)
  return list[0]
}

export function getFloatValue(value) {
  if (typeof (value) === "number") return value;
  const f = parseFloat(value)
  return Number.isNaN(f) ? 0 : f;
}

export function getIntValue(value) {
  const i = parseInt(value, 10)
  return Number.isNaN(i) ? 0 : i;
}

export function dateFormat(date, format) {
  if (!date) return date;
  if (typeof (date) === "number") date = getDateString(new Date(date));
  if (format === "yyyy/MM/dd" || format === "yyyy-MM-dd") {
      const s = date.toString().substr(0, 10);
      const st = format === "yyyy/MM/dd" ? "/" : "-";
      return s.substr(0, 4) + st + s.substr(5, 2) + st + s.substr(8, 2);
  }
  return date;
}

export function numberToTime(surplus) {
  if (!surplus) return surplus;

  var surplusHour = parseInt((surplus / 1000) / 60 / 60);//剩余小时
  var surplusMinute = parseInt((surplus % (1000 * 60 * 60)) / (1000 * 60), 10);//剩余分
  var surplusSecond = parseInt((surplus % (1000 * 60)) / 1000, 10);//剩余秒
  if (surplusHour < 10) surplusHour = "0" + surplusHour;
  if (surplusMinute < 10) surplusMinute = "0" + surplusMinute;
  if (surplusSecond < 10) surplusSecond = "0" + surplusSecond;
  return surplusHour + ":" + surplusMinute + ":" + surplusSecond;
}

//Determine whether the input text box is a floating point number with two decimal places.
export function isDecimal2(value) {
  var reg = new RegExp("^-?\\d+$|^(-?\\d+)(\\.\\d{1})?$|^(-?\\d+)(\\.\\d{2})?$");
  return reg.test(value);
}

export function toQueryString(obj) {
  const list = [];
  let v = null;
  for (let key in obj) { v = escape(obj[key]); list.push(`${key}=${v}`); }
  return list.join("&")
}

export function setDefaultValue(obj, name, value) {
  if (obj[name] === undefined) obj[name] = value;
}

//Direct truncation without rounding
export function toCurrencyNo45(num) {
  num = getFloatValue(num).toFixed(3);
  return num.substring(0, num.lastIndexOf('.') + 3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

export function replaceDataContent(data, content, blUrl) {
  if (!content || !data) return content;

  if (content.indexOf("#{") < 0) return content;
  let keyValue = "", v = null;
  for (let key in data) {
      keyValue = "#{" + key + "}";
      v = data[key];
      v = isNullOrEmpty(v) ? "" : v.toString();
      v = unescape(v);
      content = content.replace(new RegExp(keyValue, "g"), blUrl ? escape(v) : v);
      if (content.indexOf("#{") < 0) break;
  }
  return content;
}

export function assign(a, b, c) {
  if (!isObject(a)) return a;

  const objList = [];
  if (isObject(b)) for (let k in b) a[k] = clone(b[k], objList);

  if (isObject(c)) for (let k in c) a[k] = clone(c[k], objList);

  return a;
}

export function arrayClone(a, objList) {
  if (!isArray(a)) return a;

  var dataList = [];
  for (var i = 0; i < a.length; i++) {
      dataList.push(clone(a[i], objList));
  }
  return dataList;
}

export function clone(a, objList) {
  objList = objList === undefined ? [] : objList;
  if (isArray(a)) return arrayClone(a, objList);

  if (!isObject(a)) return a;

  var blExists = false;
  for (var i = 0; i < objList.length; i++) {
      if (objList[i] === a) {
          blExists = true;
          break;
      }
  }

  if (blExists) return a;

  objList.push(a);

  var c = {};

  for (var key in a) {
      if (isArray(a[key])) {
          c[key] = arrayClone(a[key], objList);
      }
      else if (isObject(a[key])) {
          c[key] = clone(a[key], objList);
      }
      else {
          c[key] = a[key];
      }
  }

  return c;
}

export function inherit(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) return

  for (var key in obj2) if (obj1[key] === undefined) obj1[key] = obj2[key];
}