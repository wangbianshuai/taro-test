import { useMemo } from "@tarojs/taro";
import { useSelector, useDispatch } from '@tarojs/redux';
import { Common } from "UtilsCommon";

export default (mapStateToProps, token) => {
  const props = useSelector((state) => setMapStateToProps(state, mapStateToProps(state)));

  const dispatch = useDispatch();

  const obj = useMemo(() => { return {} }, []);

  init(obj, dispatch, token);

  return [obj.dispatch, obj.dispatchAction, obj.setActionState, props];
}

function init(obj, dispatch, token) {
  if (!obj.isInit) obj.isInit = true; else return;

  obj.dispatch = getDispatch(dispatch, token);
  obj.dispatchAction = dispatchAction(dispatch, token);
  obj.setActionState = setActionState(dispatch);
}

function setMapStateToProps(state, props) {
  let loading = false;
  for (let key in state) {
    if (state[key] && state[key].loading) { loading = true; break; }
  }
  props.Loading = loading;

  return props;
}

function getDispatch(dispatch, token) {
  return (name, actionName, payload) => {
    let isloading = true;
    payload = payload || {};

    const action = getModelAction(name, actionName);
    if (action !== null) {
      if (action.isOperation) setActionState(dispatch)(name, actionName);
    }
    else return Promise.reject({ isSuccess: false, message: `${name}/${actionName} the method doesn't exist!` });

    if (action.isToken && !payload.token) payload.token = token;
    if (action.isLoading === false) isloading = false;
    return dispatch({ type: name + "/" + actionName, payload, isloading });
  }
}

function dispatchAction(dispatch, token) {
  return (name, actionName, payload) => {
    return getDispatch(dispatch, token)(name, actionName, payload).then(res => Promise.resolve(res), res => Promise.resolve(res));
  }
}

function setActionState(dispatch) {
  return (name, actionName, payload) => {
    return dispatch({ type: name + "/Set_" + actionName, payload })
  }
}

function getModelAction(name, actionName) {
  const _models = global.g_app ? global.g_app._models : null;
  if (!_models) return null;
  const model = Common.arrayFirst(_models, f => f.namespace === name);
  if (model && model.actions) return Common.arrayFirst(model.actions, f => f.actionName === actionName);
  return null;
}
