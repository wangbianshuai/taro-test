import { Common } from 'UtilsCommon';
import * as Request from '../utils/Request';

export default (serviceName, getServiceUrl) => (action) => async (payload) => {
  try {
    let url = action.url;
    payload = payload || {};

    if (url && payload.pathQuery) url += payload.pathQuery;

    if (action.isUrlParams) url = payload.url
    else if (Common.isNullOrEmpty(url) && !Common.isNullOrEmpty(payload.url)) url = payload.url;

    //IsToken:The request must have a Token, HasToken: the request has a Token plus。
    let headers = {};
    if (action.isToken && !payload.token) return Promise.resolve(undefined);
    if ((action.isToken || action.hasToken) && payload.Token) headers = { token: payload.token };

    if (payload.userAgent) { headers = headers || {}; headers["User-Agent"] = payload.userAgent; }

    let data = {};
    if (payload.url !== undefined || payload.token !== undefined || payload.action !== undefined) {
      for (let key in payload) {
        if (key !== "url" && key !== "pathQuery" && key !== "token" && key !== "action") {
          data[key] = payload[key];
        }
      }
    }
    else data = payload;

    if (url.indexOf("http") !== 0 && getServiceUrl) url = getServiceUrl() + url;

    //Multiple requests merge into one
    if (payload.requestList) {
      return Promise.all(payload.requestList.map(m => {
        var url2 = m.url;
        if (url2.indexOf("http") !== 0 && getServiceUrl) url2 = getServiceUrl() + url2;
        return requestData(m.action || action, url2, m.data, m.dataKey || action.dataKey, m.serviceName || serviceName, m.header || headers);
      }));
    }
    else return requestData(action, url, data, action.dataKey, serviceName, headers);
  }
  catch (error) {
    const res = { isSuccess: false, message: error.message || error };
    return Promise.resolve(res);
  }
}

function requestData(action, url, data, dataKey, serviceName, headers) {
  if (action.method === "GET") return Request.get(url, dataKey, serviceName, headers);
  else if (action.method === "PUT") return Request.put(url, data, dataKey, serviceName, headers);
  else if (action.method === "DELETE") return Request.delete2(url, data, dataKey, serviceName, headers);
  else if (action.isFormData) return Request.postFormData(url, data.formData, dataKey, serviceName, headers);
  else return Request.post(url, data, dataKey, serviceName, headers);
}
