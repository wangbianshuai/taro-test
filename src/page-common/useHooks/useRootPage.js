import Taro, { useMemo, useEffect } from "@tarojs/taro";
import { Common, Page, EnvConfig } from "UtilsCommon";
import Actions from "Actions";
import useDvaData from "./useDvaData";

const Token = Common.getStorage("Token");

export default (mapStateToProps, pageAxis, props) => {
  const [dispatch, dispatchAction, setActionState, state] = useDvaData(mapStateToProps, Token);

  const obj = useMemo(() => { return { name: "RootPage" } }, []);

  init(obj, dispatch, dispatchAction, setActionState, pageAxis)

  useEffect(() => {
    let blChanged = false;
    if (obj.state === undefined) { initProps(state, obj.stateActionTypes); blChanged = true; }
    else blChanged = shouldComponentUpdate(state, obj.state, props, obj.stateActionTypes);

    blChanged && !EnvConfig.isProd && console.log(state);

    obj.state = state;
  }, [state, obj, props])

  return [dispatch, dispatchAction, setActionState]
}

function init(obj, dispatch, dispatchAction, setActionState, pageAxis) {
  if (!obj.isInit) obj.isInit = true; else return;

  obj.page = new Page();

  pageAxis.dispatch = dispatch;
  pageAxis.dispatchAction = dispatchAction;
  pageAxis.setActionState = setActionState;

  obj.functions = { dispatch, dispatchAction, setActionState, toLogin }
  obj.invoke = () => (name) => obj.functions[name] || function () { };

  obj.page.init();
  obj.page.initInstance(obj.name, obj.invoke());

  obj.stateActionTypes = {};
  Actions.initDvaActions(initDvaActions(obj, dispatch, dispatchAction, setActionState));

  return obj;
}


function initDvaActions(obj, dispatch, dispatchAction, setActionState) {
  return {
    dispatch,
    dispatchAction,
    setActionState,
    setStateActionTypes: setStateActionTypes(obj)
  }
}

function setStateActionTypes(obj) {
  return (stateActionTypes) => {
    for (var key in stateActionTypes) {
      if (!obj.StateActionTypes[key]) obj.StateActionTypes[key] = stateActionTypes[key];
      else obj.SetStateActionTypes[key] = obj.StateActionTypes[key].concat(stateActionTypes[key])
    }
  }
}

function setLoading(nextState) {
  if (nextState.Loading) Taro.showLoading({ title: 'loading' })
  else if (nextState.Loading === false) Taro.hideLoading();
}

function isLoginPage(props) {
  const { location: { pathname } } = props;
  let name = pathname.toLowerCase().replace(".html", "");
  return name === '/login';
}

function shouldComponentUpdate(nextState, state, props, stateActionTypes) {
  //Show while loading
  if (nextState.loading !== state.loading) setLoading(nextState);

  let blChangedProps = false;

  for (let key in nextState) {
    if (nextState[key] !== undefined && !Common.isFunction(nextState[key]) && state[key] !== nextState[key]) {
      blChangedProps = true;

      if (setResponseMessage(nextState[key], props)) blChangedProps = false;

      if (blChangedProps) break;
    }
  }

  if (blChangedProps) componentWillReceiveProps2(nextState, state, stateActionTypes);

  return blChangedProps;
}

function setResponseMessage(d, props) {
  var data = d.data ? d.data : d;
  if (Common.isArray(data) && data.length > 0) data = data[0];
  if (data && data.isReLogin && data.isSuccess === false && !isLoginPage(props)) {
    toLogin();
    return true;
  }

  if (d && !d.action && d && d.isSuccess === false && d.message) {
    showMessage(d.message);
    return true;
  }

  return false
}

function toLogin() {
  Taro.redirectTo({
    url: '/pages/login'
  });
}

function showMessage(msg) {
  Taro.showToast({ title: msg, duration: 3000, icon: 'none' });
}

function componentWillReceiveProps2(nextState, state, stateActionTypes) {
  for (let key in nextState) {
    if (nextState[key] !== state[key]) receiveActionData(key, nextState[key], stateActionTypes);
  }
}

function initProps(state, stateActionTypes) {
  for (let key in state) {
    receiveActionData(key, state[key], stateActionTypes);
  }
}

function receiveActionData(key, data, stateActionTypes) {
  if (!data) return;
  try {
    if (data.action && data.action.actionType > 0) Actions.dispatch(data.action.actionType, data);
    else if (stateActionTypes[key]) stateActionTypes[key].forEach(a => Actions.dispatch(a, data));
  }
  catch (err) {
    setResponseMessage({ isSuccess: false, message: err.message });
  }
}
