export function getResponseData(d, resKey) {
  const blSuccess = d && d.isSuccess === false ? false : true;

  if (!blSuccess) return d;

  let obj = null;

  if (d.Exception || d.Message) {
    const msg = d.Exception || d.Message;
    obj = { isSuccess: false, message: msg };
    if (d.isReLogin) obj.isReLogin = true;
  }
  else if (resKey) {
    if (d && d[resKey]) obj = d[resKey];
    else obj = d;
  }
  else if (d) obj = d;
  else obj = { isSuccess: false, message: "Request exception!" };

  return obj;
}

export function getResponse(d, resKey) {
  return Promise.resolve(getResponseData(d, resKey));
}

export function getErrorResponse(res) {
  let msg;
  if (res && res.errMsg) msg = res.errMsg;
  else if (res && res.message) msg = res.message
  else msg = res;

  return Promise.resolve({ isSuccess: false, message: msg });
}
