export default class Page {
  getModel() {
      return {}
  }

  init() {
      Page.current = this;
  }

  initInvoke(name, fn) {
      const obj = this.getInstance(name);
      if (obj.isInstance) fn(obj);
      else obj.initFnList.push(fn);
  }

  getInstance(name) {
      if (!this[name]) this[name] = { initFnList: [] };
      return this[name];
  }

  initInstance(name, invoke) {
      const obj = this.getInstance(name);

      obj.isInstance = true;
      obj.invoke = invoke;
      obj.initFnList.forEach(f => f(obj));

      return this[name];
  }

  invoke(name, fnName) {
      const obj = this.getInstance(name);
      if (obj.isInstance) return obj.invoke(fnName);
      return function () { };
  }
}

Page.Current = null;