import React, { useEffect } from 'react'

import { useDidShow, useDidHide } from '@tarojs/taro'
// import en from "@nutui/nutui-react-taro/dist/locales/en-US";
import en from '@nutui/nutui-react-taro/dist/es/locales/en-US'
//自定义主题
import "./theme/theme.scss"
// 全局样式
import './app.scss'
import {theme} from "./theme/theme";

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})
 console.log("入口组件",props.children)
  return(
    props.children
  );
}
export default App
