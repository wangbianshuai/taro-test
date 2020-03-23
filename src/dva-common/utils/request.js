import Taro from '@tarojs/taro';
import { Common, HttpResponse } from 'UtilsCommon';

export function get(url, resKey, serviceName, headers) {
  return request(url, null, resKey, serviceName, headers);
}

export function post(url, data, resKey, serviceName, headers) {
  return requestByMethod(url, data, resKey, serviceName, headers, "POST")
}

export function put(url, data, resKey, serviceName, headers) {
  return requestByMethod(url, data, resKey, serviceName, headers, "PUT");
}

export function delete2(url, data, resKey, serviceName, headers) {
  return requestByMethod(url, data, resKey, serviceName, headers, "DELETE");
}

export function postFormData(url, data, resKey, serviceName, headers) {
  return request(url, {
    method: "POST",
    headers: {},
    body: data,
  }, resKey, serviceName, headers);
}

export function requestByMethod(url, data, resKey, serviceName, headers, method) {
  return request(url, {
    method: method || "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    data: JSON.stringify(data)
  }, resKey, serviceName, headers);
}

function request(url, options, resKey, serviceName, headers) {
  try {
    options = setServiceHeader(options, serviceName);
    options = setParamsHeader(options, headers);
    url = getFullUrl(url);
    options.url = url;
    return Taro.request(options).then(res => setResult(res)).then(d => HttpResponse.getResponse(d, resKey), res => HttpResponse.getErrorResponse(res));
  }
  catch (error) {
    console.warn('dva-common/utils/request/request', error);
    const res = { isSuccess: false, message: error.message || error };
    return HttpResponse.getErrorResponse(res, url, options);
  }
}


function setParamsHeader(options, headers) {
  if (headers) {
    options = options || {};
    options.headers = options.headers || {};
    for (let key in headers) options.headers[key] = headers[key];
    return options;
  }

  return options;
}

function setServiceHeader(options, serviceName) {
  if (!serviceName) return options;

  return setApiServiceHeader(options, serviceName);
}

const _ClientConfig = {
};

function setApiServiceHeader(data, serviceName) {
  data = data || { headers: {}, method: "GET" };

  let clientId = "miniprogram";

  if (_ClientConfig[serviceName]) clientId = _ClientConfig[serviceName];

  data.headers.clientId = clientId;
  data.headers.clientTime = new Date().getTime();
  data.headers.requestId = Common.createGuid().replace(/-/g, "").toLowerCase();

  return data;
}

function getFullUrl(url) {
  return Common.addUrlRandom(url);
}

function setResult(res) {
  if(res.data) return Promise.resolve(res.data);
  return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.isNullOrEmptyReturnDefault(res.statusText, "Request error!")));
}
