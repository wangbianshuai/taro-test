import { EnvConfig } from "UtilsCommon";
import Service from "./services/index";

export default (config) => {
  const actionList = config.actionList || [];
  const service = Service(config.serviceName, EnvConfig.getServiceUrl(config.serviceName));

  const state = { loading: false };
  const effects = {};
  const reducers = { changeLoading };

  actionList.forEach(a => {
    //state
    state[a.stateName] = a.defaultValue;
    //effects
    if (a.isRequest === false) effects[a.actionName] = invokeAction(a.actionName);
    else effects[a.actionName] = invokeService(service(a), a.actionName);
    //reducers
    setState(reducers, a.actionName, a.stateName)
  });

  return { namespace: config.name, state, effects, reducers, actions: actionList };
}

function invokeService(fn, type) {
  return function* ({ payload, isloading }, { call, put }) {
    if (isloading !== false) yield put({ type: "ChangeLoading", payload: true });

    let action = null;
    if (payload.action) action = payload.action;

    let response = yield call(fn, payload);

    if (action && response !== undefined) {
      if (response && response.isSuccess === false) response.action = action;
      else response = { action, data: response };
    }

    if (isloading !== false) yield put({ type: "ChangeLoading", payload: false });

    yield put({ type: `Set_${type}`, payload: response });

    return response;
  }
}

function setState(reducers, actionName, stateName) {
  const key = `Set_${actionName}`;

  reducers[key] = (state, action) => {
    state = { ...state };

    state[stateName] = action.payload;

    return state
  }
}

function changeLoading(state, action) {
  return {
    ...state,
    loading: action.payload
  }
}

function invokeAction(type) {
  return function* ({ payload }, { put }) {
    yield put({ type: `Set_${type}`, payload: payload })
  }
}
