import Taro from "@tarojs/taro";

const serviceConfig = {
  ApiService: getApiSericeUrl
};

const envConfig = {
  getServiceUrl,
  setEnv,
  env: null,
  isProd: false
}

//ctx koa object，ctx is not empty to indicate that it is a server
function setEnv() {
  envConfig.env = getWebEnv();
  envConfig.isProd = envConfig.env === "prd";
}

function getWebEnv() {
  let h = "localhost";
  if (typeof window !== undefined) h = window.location.hostname.toLowerCase();
  return getEnv(h);
}

function getEnv(h) {
  if (h.indexOf("localhost") >= 0) return "local"
  else if (h.indexOf("dev") >= 0) return "dev"
  else if (h.indexOf("test") >= 0) return "test"
  else return "prd";
}

function getApiSericeUrl() {
  return "/api/";
}

function getServiceUrl(serverName) {
  return () => {
    let hostName = ""
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) hostName = 'http://101.132.74.208:8096'
    return hostName + serviceConfig[serverName]();
  }
}

export default envConfig;
