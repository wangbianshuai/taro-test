import Taro, { useState } from '@tarojs/taro';
import { AtInput } from 'taro-ui';
import { Common } from 'UtilsCommon';

const TextBox = (props) => {
  const { property } = props;
  const [value, setValue] = useState(getInitValue(property));

  property.getValue = () => value;

  const { name, label, controlType, placeholder } = property;
  let type = 'text';
  if (controlType) type = controlType;

  return (<AtInput
    name={name}
    title={label}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={setValue}
  />);
};

function getInitValue(property) {
  if (!Common.isNullOrEmpty(property.value)) return property.value;
  if (!Common.isNullOrEmpty(property.defalutValue)) return property.defalutValue;

  return undefined;
}

TextBox.defaultProps = { property: {}, view: {} };

export default TextBox;
