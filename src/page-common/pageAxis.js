/*
Through-page flow object.
Each component can call methods on the page through the page axis object.
*/
import Taro from "@tarojs/taro";
import { Common, Page } from "UtilsCommon";
import EventActions from "EventActions";
import getPageConfig from '../page-configs/index';

const _PageAxisList = {};

export default class PageAxis {
  constructor(id, ) {
    this.id = id;
    this.props = {};
  }

  static getPageAxis(id) {
    if (!id) return;
    if (!_PageAxisList[id]) _PageAxisList[id] = new PageAxis(id);
    return _PageAxisList[id];
  }

  static removePageAxis(id) {
    if (_PageAxisList[id]) delete _PageAxisList[id];
  }

  invoke() {
    return (name) => this[name] ? this[name].bind(this) : function () { };
  }

  expandMethod(methods) {
    for (let key in methods) this[key] = methods[key](this)
  }

  receiveActionData(nextProps) {
    if (this.actionTypes) {
      let name = "", value = 0;
      for (let key in this.actionTypes) {
        name = `receive${key}`;
        value = this.actionTypes[key];
        if (nextProps[value] !== this.props[value]) {
          if (this[name]) this[name](nextProps[value]);
          else if (this.receives[value]) this.receives[value](nextProps[value]);
        }
      }
    }
    this.props = nextProps;
  }

  judgeLogin() {
    if (!this.token) this.toLogin();
  }

  toLogin() {
    Taro.redirectTo({
      url: '/pages/login'
    });
  }

  showMessage(msg) {
    Taro.showToast({ title: msg, duration: 3000, icon: 'none' });
  }

  getConfig() {
    this.pageConfig = Common.clone(getPageConfig(this.name));
  }

  initSet(name, invokeDataAction, actionTypes, expandInit) {
    if (!this.isInit) this.isInit = true; else return;

    this.name = name;
    this.invokeDataAction = invokeDataAction;
    this.actionTypes = actionTypes;

    //this.token = Common.GetCookie("Token");
    this.pageConfig = {};
    this.receives = {};
    this.controls = [];
    this.components = [];
    this.getConfig();
    this.eventActionsConfig = Common.clone(this.pageConfig.eventActions);
    if (this.pageConfig.actionOptions) this.actionTypes = this.pageConfig.actionOptions.actionTypes;

    this.pageData = {};
    this.pageData.token = this.Token;;

    this.eventActions = {};
    for (let key in EventActions) this.eventActions[key] = new EventActions[key]();

    if (expandInit) expandInit(this);
  }

  setModalDialog() {
    return Page.current.invoke("RootPage", "setModalDialog");
  }

  setloginUserId() {
    //if (!this.userId) this.userId = Common.getStorage("LoginUserId");
    return this.userId;
  }

  getProperty(name) {
    let p = this.getControl(name);
    if (!p) p = this.getComponent(name);
    if (!p) p = this.getViewProperty(this.pageConfig, name);
    return p;
  }

  getRight(name) {
    return !!name;
  }

  getFunction(name) {
    if (!name || !this[name]) return null;
    return (params) => this[name](params);
  }

  getView(name) {
    return this.getViewProperty(this.pageConfig, name);
  }

  getViewProperty(view, name) {
    if (view.name === name) return view;

    if (view.properties) {
      let v = null;
      for (let i = 0; i < view.properties.length; i++) {
        v = this.getViewProperty2(view.properties[i], name);
        if (v !== null) break;
      }
      if (v != null) return v;
    }
    if (this.pageConfig.dialogViews) {
      let v = null;
      for (let i = 0; i < this.pageConfig.dialogViews.length; i++) {
        v = this.getViewProperty2(this.pageConfig.dialogViews[i], name);
        if (v !== null) break;
      }
      if (v != null) return v;
    }
    return null;
  }

  getViewProperty2(view, name) {
    if (view.name === name) return view;

    if (view.properties) {
      let v = null;
      for (let i = 0; i < view.properties.length; i++) {
        v = this.getViewProperty2(view.properties[i], name);
        if (v !== null) break;
      }
      return v;
    }

    return null;
  }

  toPage(url) {
    Taro.redirectTo({ url });
  }

  openPage(url) {
    Taro.redirectTo({ url });
  }

  alert(msg, title) {
    if (global.g_isModalInfo) return;
    global.g_isModalInfo = true;
    Taro.showModal({
      title: title || "提示",
      content: msg,
      showCancel: false,
    }).then(() => {
      global.g_isModalInfo = false;
    });
  }

  alertSuccess(msg, onOk) {
    Taro.showModal({
      title: '成功',
      content: msg,
      showCancel: false,
    }).then((res) => {
      if (res.confirm) onOk();
    });
  }

  confirm(msg, onOk) {
    Taro.showModal({
      title: '确认',
      content: msg,
      showCancel: true,
    }).then((res) => {
      if (res.confirm) onOk();
    });
  }

  getControl(name) {
    return Common.arrayFirst(this.controls, (f) => f.name === name);
  }

  getComponent(name) {
    return Common.arrayFirst(this.components, (f) => f.name === name);
  }

  invokeEventAction(name, props) {
    const e = this.getEventAction(name);
    if (e != null) e.invoke(props, e);
  }

  getEventAction(name) {
    if (this[name]) return { invoke: (a, b) => this[name](a, b) };

    if (this.eventActionsConfig) {
      const e = Common.arrayFirst(this.eventActionsConfig, (f) => f.name === name);
      if (e != null && e.invoke === undefined) {
        e.invoke = (() => {
          const names = e.type.split("/");
          const n1 = names[0], n2 = names[1];
          if (this.eventActions[n1] && this.eventActions[n1][n2]) return (a, b) => this.eventActions[n1][n2](a, b);
          else return function () { }
        })();
      }
      return e;
    }
    return null;
  }
}

