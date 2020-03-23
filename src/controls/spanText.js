import Taro, { useMemo, useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Common } from 'UtilsCommon';

const SpanText = (props) => {
  const { property } = props;
  const [visible, setVisible] = useState(property.visible !== false);

  const obj = useMemo(() => ({
    id: Common.createGuid(),
  }), []);

  init(obj, property, setVisible);

  if (!visible) return <View />;

  const { className, style, text } = property;

  return <View className={className} style={style}><Text>{text}</Text></View>

};

function init(obj, property, setVisible) {
  if (property.id && !obj.isInit) obj.isInit = true; else return;

  property.setVisible = setVisible;
}

SpanText.defaultProps = { property: {}, view: {} };

export default SpanText;
