import {Input, Text, View} from "@tarojs/components";
import "./index.scss";
import {CommonFormItemProps} from "../formItemTypes";
import {Form} from "@nutui/nutui-react-taro";

import {useEffect} from "react";
export interface CZHInputProps extends CommonFormItemProps{
  placeholder?:string;
}
const CZHInput=(props:CZHInputProps)=>{

  return (
    <View className={`CZHFormItemContainer ${props.layout==="vertical"?"vertical":"horizontal"}`}>
        <Text className={"labelView"}>
          {props.required && <Text className={"required"}>*</Text>}
          {props.label}
        </Text>
        <View className={"contentView"}>
          <Input value={props.value} onInput={(e)=>{
            props.onChange?.(e.detail.value)
          }} placeholder={props.placeholder || "请输入"} />
        </View>
    </View>
  );
}

export default CZHInput;
