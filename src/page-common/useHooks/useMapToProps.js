import { useMemo } from "@tarojs/taro";
import { Page } from "UtilsCommon";

export default actionNames => {
    return useMemo(() => actionNames.map(m => Page.current.invoke("rootPage", m)), [actionNames]);
}
