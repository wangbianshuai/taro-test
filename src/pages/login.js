import Taro, { useEffect, useMemo } from "@tarojs/taro";
import { View } from '@tarojs/components';
import { PageAxis, useRootPage, useConnectAction } from "PageCommon";
import { Common } from "UtilsCommon";
import { PropertyItem } from 'Components';
import '../style/login.scss';

const _Name = "login";

const Login = (props) => {
  const [invoke, actionTypes, actionData] = useConnectAction(_Name);
  const pageId = useMemo(() => Common.createGuid(), []);
  const pageAxis = PageAxis.getPageAxis(pageId);

  useRootPage(mapStateToProps, pageAxis, props);

  pageAxis.initSet(_Name, invoke, actionTypes, init);

  useEffect(() => { return () => PageAxis.removePageAxis(pageId) }, [pageId]);

  useEffect(() => pageAxis.receiveActionData(actionData), [pageAxis, actionData]);

  return (
    <View className='divContainer'>
      <View className='divLogin'>
        <PropertyItem property={pageAxis.pageConfig} pageId={pageId} />
      </View>
    </View>
  )
}

Login.config = {
  navigationBarTitleText: '登录'
};

function init(pageAxis) {
  Common.removeStorage("Token");
  pageAxis.setActionState("ApiService", "Login");

  pageAxis.expandMethod({ loginSuccess });
  return pageAxis;
}

function loginSuccess(pageAxis) {
  return ({ data }) => {
    Common.setStorage("LoginUserInfo", JSON.stringify(data))
    Common.setStorage("LoginUserId", data.UserId)
    pageAxis.toPage("/pages/index/index");
  }
}

function mapStateToProps(state) {
  return {
    login: state.ApiService.login
  }
}

export default Login;
