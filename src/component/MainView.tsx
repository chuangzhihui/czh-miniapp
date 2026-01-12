import React, {forwardRef, useEffect} from "react";
import {View, ViewProps} from "@tarojs/components";
import { ConfigProvider } from "@nutui/nutui-react-taro";
import {theme} from "../theme/theme";
import Taro from "@tarojs/taro";
const MainView=(_props:ViewProps,ref:any)=>{
  const [bottomOffset, setBottomOffset] = React.useState<number>(0);
  useEffect(() => {
    let systemInfo=Taro.getSystemInfoSync();
    console.log(systemInfo,"systemInfo");
    const window=Taro.getWindowInfo();
    setBottomOffset(window.screenHeight-(window.safeArea?.bottom || 0))
  }, []);
  const getBottomPadding=()=>{
    const window=Taro.getWindowInfo();
    const padding=window.screenHeight-(window.safeArea?.bottom || 0)
    return padding/2;
  }
  return(
    <ConfigProvider className={"customer"} theme={theme}>
      <View style={{width:"100vw",height:"100vh",display:"flex",flexDirection:"column",overflowY:"hidden",paddingBottom:bottomOffset/2}}  {..._props} />
    </ConfigProvider>
  );
}

export default forwardRef(MainView);
