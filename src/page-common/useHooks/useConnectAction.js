import { useState, useEffect, useMemo } from "@tarojs/taro";
import Actions from "Actions";
import { Common } from "UtilsCommon";

function init(obj, name, options) {
  if (!obj.isInit) obj.isInit = true; else return;

  obj.name = options ? options.name : name;
  obj.actionTypes = Actions.getActionTypes(obj.name);

  obj.receive = receive(obj);
  obj.invoke = invoke(obj);

  Actions.initAction(name, options);
  Actions.receive(obj.name, obj.id, obj.receive);

  return obj;
}

function receive(obj) {
  return (actionType, data) => {
    if (obj.isDestory) return;
    if (data && data.action && data.data) data = data.data;
    obj.actionData = { ...obj.actionData };
    obj.actionData[actionType] = data;
    obj.setActionData(obj.actionData);
  }
}

function invoke(obj) {
  return (actionType, data) => {
    try {
      Actions.invoke(obj.id, actionType, data);
    }
    catch (err) {
      console.warn('page-common/useHooks/useConnectAction/invoke', err)
      obj.receive(actionType, { isSuccess: false, message: err.message })
    }
  }
}

function destory(obj) {
  obj.isDestory = true;
  Actions.removeReceive(obj.name, obj.id);
}

export default (name, options) => {
  const [actionData, setActionData] = useState({});
  const obj = useMemo(() => { return { isDestory: false, id: Common.createGuid() } }, []);

  init(obj, name, options);

  obj.actionData = actionData;
  obj.setActionData = setActionData;

  useEffect(() => { return () => destory(obj) }, [obj]);

  return [obj.invoke, obj.actionTypes, actionData];
}
