import { assignProporties, getTextBox, getButton } from '../common'

//登录 4000-4099
const DataActionTypes = {
  //获取实体数据
  Login: 4000
}

export default {
  name: "LoginView",
  type: "View",
  eventActions: getEventActions(),
  saveEntityDataActionType: DataActionTypes.Login,
  properties: assignProporties({ name: "LoginView" }, getProperties())
}

function getProperties() {
  return [
    {
      name: "LoginTitle", type: "SpanText", x: 1, y: 1, text: "账户登录", className: "loginHeader"
    },
    getTextBox2("LoginName", "", 1, 1, "", "请输入登录名", 50, false, "user"),
    getTextBox2("LoginPassword", "", 2, 1, "password", "请输入登录密码", 50, false, "lock"),
    getButton2("Login", "登录", "primary", 3, 1)
  ]
}

function getTextBox2(name, label, x, y, contorlType, placeholder, maxLength, isNullable, icon) {
  return {
    ...getTextBox(name, label, contorlType, x, y, placeholder, maxLength || 50),
    isFormItem: true,
    isEdit: true,
    pressEnterEventActionName: "Login",
    pressEnterEventPropertyName: "Login",
    prefixIcon: { type: icon },
    isNullable,
    nullTipMessage: placeholder
  }
}

function getButton2(name, label, buttonType, x, y) {
  return {
    ...getButton(name, label, buttonType, x, y),
    size: "normal",
    eventActionName: "Login",
    style: { width: "100%" }
  }
}

function getEventActions() {
  return [{
    name: "Login",
    type: "EntityEdit/saveEntityData",
    editView: "LoginView",
    successCallback: "loginSuccess"
  }]
}
