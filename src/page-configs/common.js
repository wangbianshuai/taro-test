function getProperty(name, label, dataType, isNullable, maxLength, scale) {
  dataType = dataType || "string";
  isNullable = isNullable === undefined ? true : isNullable;
  maxLength = maxLength || 50;
  scale = scale || 2
  return { name, label, dataType, isNullable, maxLength, scale }
}

function getButton(name, text, buttonType, x, y) {
  return { name, text, type: "Button", buttonType, x, y, isDisabled: true }
}

var guidId = 100000000;
var Guids = {};
var guidIndex = 1;

function createGuid(name) {
  if (name) {
    if (!Guids[name]) { guidIndex += 1; Guids[name] = guidIndex * 100000000; }
    var id = Guids[name];
    id += 1;
    Guids[name] = id;
    return id.toString();
  }
  else {
    guidId += 1;
    return guidId.toString();
  }
}

function assignProporties(entity, list) {
  const pList = [];

  let p2 = null;
  list.forEach((p, i) => {
    if (typeof p === "string") p2 = getEntityProperty(entity, p);
    else {
      p2 = getEntityProperty(entity, p.name)
      if (p2 === null) p2 = p;
      else p2 = { ...p2, ...p };
    }
    if (p2 !== null) {
      p2.x = p2.x || i + 1;
      p2.y = p2.y || 1;
      p2.rowId = createGuid(entity.name);
      p2.colId = createGuid(entity.name);
      p2.id = createGuid(entity.name);
      p2.isNullable = p2.isNullable === undefined ? true : p2.isNullable
      if (p2.dataType === "float" && !p2.scale) p2.scale = 2;
      pList.push(p2);
    }
  });

  return pList;
}

function isObject(obj) {
  if (obj === null || obj === undefined) return false;
  return typeof (obj) === "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
}

function isEmptyObject(obj) {
  if (!isObject(obj)) return true

  if (Object.getOwnPropertyNames(obj).length > 0) return false;

  let blEmpty = true;
  for (let key in obj) if (key) { blEmpty = false; break; }

  return blEmpty;
}

function getEntityProperty(entity, name) {
  if (isEmptyObject(entity) || !entity.Properties) return null;
  const list = entity.Properties.filter(f => f.name === name);
  if (list && list.length === 1) return Object.assign({}, list[0]);
  return null;
}

function getRadio(name, label, DataSource, x, y, defaultValue, buttonWidth) {
  return { name, label, type: "Radio", DataSource, x, y, isButton: true, defaultValue, buttonWidth }
}

function getTextBox(name, label, controlType, x, y, placeholder, maxLength) {
  return { name, label, type: "TextBox", controlType, placeholder, x, y, maxLength }
}

function getSelect(name, label, DataSource, x, y, defaultValue) {
  return { name, label, type: "Select", DataSource, x, y, defaultValue }
}

function getSelect2(name, label, serviceDataSource, x, y, defaultValue) {
  return { name, label, type: "Select", serviceDataSource, x, y, defaultValue }
}

function getAutoComplete(name, label, serviceDataSource, x, y, defaultValue) {
  return { name, label, type: "AutoComplete", serviceDataSource, x, y, defaultValue }
}


function getDatePicker(name, label, x, y, defaultValue) {
  return { name, label, type: "DatePicker", x, y, defaultValue }
}

const regExpress = {};

//非数字与字母,用于替换
regExpress.noNumberChar = "[^0-9a-zA-Z]";

//只能输入数字与字母，用于键盘输入keypress
regExpress.inputNumberChar = "^[0-9a-zA-Z]+$";

//非数字,用户于替换
regExpress.noNumber = "[^\\d]";

//只能输入数字，用于键盘输入keypress
regExpress.inputNumber = "^[\\d]+$";

export {
  getAutoComplete,
  getButton,
  getDatePicker,
  getEntityProperty,
  getProperty,
  getRadio,
  getSelect,
  getSelect2,
  getTextBox,
  assignProporties,
  regExpress,
  isObject,
  isEmptyObject,
  createGuid
}
