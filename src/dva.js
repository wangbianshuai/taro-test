import Taro from '@tarojs/taro';
import { create } from 'dva-core';
import Models from './models/index';

const app = create({ initialState: {} });

// 适配支付宝小程序
if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) global = {};

if (!global.registered) Models.forEach(model => app.model(model));
global.registered = true;

app.start();

global.g_app = app;

export default app;
