import {theme} from "../../theme/theme";
import {View, ViewProps} from "@tarojs/components";
import {ConfigProvider} from "@nutui/nutui-react-taro";
import React from "react";
import "./index.scss"
import Taro from "@tarojs/taro";
const SafeAreaView=(_props:ViewProps)=>{
  const getBottomPadding=()=>{
    const window=Taro.getWindowInfo();
    const padding=window.screenHeight-(window.safeArea?.bottom || 0)
    return padding/2;
  }
  return(
    <ConfigProvider className={"rootConfigProvider"} theme={theme}>
      <View className={"safeAreaView"} style={{paddingBottom:getBottomPadding()}}  {..._props} />
    </ConfigProvider>
  );
}
export default SafeAreaView;
