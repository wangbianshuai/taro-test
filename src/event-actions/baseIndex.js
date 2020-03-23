import { Common, Validate } from "UtilsCommon";

export default class BaseIndex {

    isSuccessNextsProps(obj, alert, alertMessage) {
        let isSuccess = obj && obj.isSuccess !== false;
        let msg = "";
        if (!isSuccess) msg = obj.message;
        if (isSuccess && obj.code !== undefined) {
            isSuccess = Common.getIntValue(obj.code) === 0;
            if (!isSuccess) msg = obj.message;
        }
        if (!isSuccess && msg) this.alert(msg, alert, alertMessage);

        return isSuccess;
    }

    alert(msg, alert2, alertMessage) {
        if (alertMessage) alertMessage.setValue(msg);
        else if (alert2) alert2(msg);
        else alert(msg);
    }

    isSuccessNextsProps2(obj) {
        return obj && obj.isSuccess !== false;
    }

    getSelectToList(list, names) {
        const selectList = [];
        list.forEach(p => names.indexOf(p.Name) >= 0 && selectList.push(p))
        return selectList;
    }

    getPropertyValues(properties, pageAxis) {
        const data = {};
        let name = "", p = null, v = null, msg = "";

        for (let i = 0; i < properties.length; i++) {
            p = properties[i];
            name = p.propertyName || p.name;

            if (p.getDisabled && p.getDisabled()) {
                if (p.getValueToData) p.getValueToData(data)
                else data[name] = null;
                continue;
            }

            if (p.getValueToData) {
                if (p.getValueToData(data) === false) {
                    msg = p.tipMessage;
                    break;
                }
            }
            else if (p.getValue) {
                v = p.getValue();
                let isNullable = p.isJudgeNullable === false || p.isNullable;
                if (!isNullable && p.dataType === "Array" && (Common.isNullOrEmpty(v) || v.length === 0)) {
                    msg = p.nullTipMessage || "请选择" + p.label + "！"
                    break;
                }
                else if (!isNullable && p.Type === "Select" && Common.isNullOrEmpty(v)) {
                    msg = p.nullTipMessage || "请选择" + p.label + "！"
                    break;
                }
                else if (!isNullable && Common.isNullOrEmpty(v)) {
                    msg = p.nullTipMessage || p.label + "不能为空！"
                    break;
                }
                else if (!isNullable && p.judgeNullable) {
                    msg = p.judgeNullable(v);
                    if (!Common.isNullOrEmpty(msg)) break;
                }
                else if (!Common.isNullOrEmpty(v) && p.ValidateNames) {
                    for (let j = 0; j < p.ValidateNames.length; j++) {
                        msg = this.validateNames(p.validateNames[j], v, p);
                        if (Common.isNullOrEmpty(msg)) break;
                    };

                    if (!Common.isNullOrEmpty(msg)) break;
                }

                data[name] = v;

                //目前主要是文本框带单位选择
                if (p.propertyName2 && p.getValue2) {
                    data[p.propertyName2] = p.getValue2();
                }
            }
        }

        if (!Common.isNullOrEmpty(msg)) { pageAxis.alert(msg); return false; }

        return data;
    }

    validateValue(validateName, v, p) {
        if (!Validate[validateName]) return "";

        var msg = Validate[validateName](v);
        if (msg === true) msg = ""
        else if (p.validateTipMessage) msg = p.validateTipMessage;

        return msg;
    }

    setViewPropertiesDisabled(properties) {
        properties.forEach(p => {
            if (p.isEdit || p.isDisabled) {
                if (p.setDisabled) p.setDisabled(true);
                else p.disabled = true;
            }
        });
    }

    SetViewPropertiesVisible(properties, visible) {
        properties.forEach(p => {
            if (p.setVisible) p.setVisible(visible);
            else p.visible = visible;
        });
    }

    setViewPropertiesExpanded(properties, isExpanded) {
        properties.forEach(p => {
            if (p.setExpanded) p.setExpanded(isExpanded);
            else p.isExpanded = isExpanded;
        });
    }

    setPropertiesValue(properties, data, isUpdateReadOnly) {
        data = data || {};

        const isDefault = Common.isEmptyObject(data);

        let name = "", v = null;
        properties.forEach(p => {
            if (p.setValueByData) p.setValueByData(data)
            else {
                name = p.propertyName || p.name;
                v = data[name];
                if ((v === null || v === undefined) && p.defaultValue && (isDefault || p.isDefault)) v = p.defaultValue;
                if (p.setValue) p.setValue(v);
                else p.value = v;

                //目前主要是文本框带单位选择
                if (p.propertyName2) {
                    v = data[p.propertyName2];
                    if ((v === null || v === undefined) && p.defaultValue2) v = p.defaultValue2;
                    if (p.setValue2) p.setValue2(v);
                    else p.value2 = v;
                }
            }

            if (isUpdateReadOnly && p.isUpdateReadOnly) {
                if (p.setReadOnly) p.setReadOnly(true);
                else p.isReadOnly = true;
            }
        })
    }

    getViewPropertiesValue(properties, pageAxis) {
        const editProperties = properties.filter(f => f.isEdit && !f.isView && f.visible !== false);

        let entityData = this.getPropertyValues(editProperties, pageAxis);

        if (entityData === false) return entityData;

        //视图作为控件，把视图属性值平移到父级上
        const viewProperties = properties.filter(f => f.IsEdit && f.IsView && f.visible !== false);

        let viewPropertyData = null;
        for (let i = 0; i < viewProperties.length; i++) {
            viewPropertyData = this.getViewPropertiesValue(viewProperties[i].properties, pageAxis);
            if (viewPropertyData === false) { entityData = viewPropertyData; break; }
            else for (let key in viewPropertyData) entityData[key] = viewPropertyData[key];
        }

        return entityData;
    }

    setViewPropertiesValue(properties, data, isUpdateReadOnly) {
        this.setPropertiesValue(properties, data, isUpdateReadOnly);

        const viewProperties = properties.filter(f => f.IsView);

        for (let i = 0; i < viewProperties.length; i++) {
            this.setViewPropertiesValue(viewProperties[i].properties, data, isUpdateReadOnly);
        }
    }
}
