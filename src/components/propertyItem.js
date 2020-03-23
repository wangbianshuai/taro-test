import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { View2 } from "Components"
import { Button2, SpanText, TextBox } from "Controls";
import { Common } from 'UtilsCommon';

const PropertyItem = (props) => {
  const { property, pageId, view } = props;

  if (!pageId) return <View></View>

  if (!property.id) property.id = Common.createGuid();

  const props2 = { property, key: property.id, view: view || {}, pageId }

  const { type } = property;

  if (type === 'View') return <View2 {...props2} />
  if (type === 'PropertyItem') return <PropertyItem {...props2} />

  if (type === 'Button') return <Button2 {...props2} />
  if (type === 'SpanText') return <SpanText {...props2} />
  if (type === 'TextBox') return <TextBox {...props2} />

  return <View />;
};

PropertyItem.defaultProps = { property: {}, view: {} };

export default PropertyItem;
