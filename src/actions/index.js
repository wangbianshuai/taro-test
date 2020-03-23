import { Common } from "UtilsCommon";
import getActionTypes from "./actionTypes/index";

const _ActionList = [];

/*
options:{name:"action name",ServiceName:"service name",MaxActionType:" max action type value",
MinActionType:"min action type value",ActionTypes:"action type value collection object"}
*/
function initAction(name, options) {
  const actionName = options ? options.name : name;
  const action = getActionByName(actionName)
  if (action) return;

  name = name.replace("_", "/");
  const Action = require(`./Actions/${name}`).default;
  options = options || {};
  _ActionList.push(new Action({ getActionTypes, invokeAction: invoke, dispatchAction, dvaActions: _DvaActions, ...options }));
}

function invoke(id, actionType, data) {
  const action = getAction(actionType);
  if (action) action.invoke(id, actionType, data);
}

function getAction(actionType) {
  return Common.arrayFirst(_ActionList, (f) => actionType >= f.minActionType && actionType <= f.maxActionType);
}

function getActionByName(name) {
  return Common.arrayFirst(_ActionList, (f) => Common.isEquals(f.name, name, true));
}

function dispatchAction(id, actionType, data) {
  const action = getAction(actionType);
  if (action) {
    id = data.action && data.action.id ? data.action.id : id;
    action.dispatch(id, actionType, data);
  }
}

function dispatch(actionType, data) {
  dispatchAction("", actionType, data);
}

function receive(name, id, fn) {
  const action = getActionByName(name)
  if (action) action.receive(id, fn);
}

function removeReceive(name, id) {
  const action = getActionByName(name)
  if (action) action.removeReceive(id);
}

var _DvaActions = {};

function initDvaActions(dvaActions) {
  const stateActionTypes = {};
  _DvaActions = dvaActions;
  _ActionList.forEach(a => {
    const obj = a.initDvaActions(dvaActions);
    for (let key in obj) {
      if (stateActionTypes[key]) stateActionTypes[key] = stateActionTypes[key].concat(obj[key]);
      else stateActionTypes[key] = obj[key];
    }
  });

  return stateActionTypes;
}

export default {
  getActionTypes,
  initAction,
  invoke,
  receive,
  removeReceive,
  initDvaActions,
  dispatch
};
