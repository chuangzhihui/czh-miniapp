import React, {forwardRef} from "react";
import {Image, View, ViewProps} from "@tarojs/components";
import "./CustomerEmptyPage.scss"
const CustomerEmptyPage=(_props:ViewProps,ref:any)=>{
  return(
      <View className={"CustomerEmptyPageContainer"} {..._props}>
        <Image className={"img"} src={require("../imgs/NO_DATA.png")}  />
      </View>
  );
}

export default forwardRef(CustomerEmptyPage);
