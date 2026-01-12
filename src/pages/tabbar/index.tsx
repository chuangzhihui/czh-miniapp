import React, {useEffect, useState,useRef} from 'react'
import { useDidShow, useDidHide,useLoad } from '@tarojs/taro'
import {
  Button, Tabbar
} from '@nutui/nutui-react-taro'
import {Text, View} from "@tarojs/components";
import { Cart, Category,Gift, Home, User } from '@nutui/icons-react-taro'
import HomePage from "./HomePage"
import CatePage from "./CatePage";
import FindPage from "./FindPage";
import CarPage from "./CarPage";
import MyPage from "./MyPage";
import SafeAreaView from "../../component/SafeAreaView";
const Index = (_props:any,ref:any) => {
  console.log(_props,"_props")
  const [index,setIndex]=useState<number>(2)
  const Components=[
    HomePage,CatePage,FindPage,CarPage,MyPage
  ];
  const renderPage=()=>{
    var MyComponentt= Components[index];
    return(
        <MyComponentt props={_props} />
    );
  }
  useLoad((param:any)=>{
    console.log("load",param)
  });

  return (
    <SafeAreaView >
      <View style={{flex:1,display:'flex',overflowY:"scroll"}}>
        {renderPage()}
      </View>
      <Tabbar
        safeArea={true}
        value={index}
        style={{background:"#fff"}}
        onSwitch={(value) => {
          setIndex(value)
          console.log(value)
        }}
      >
        <Tabbar.Item title="首页" icon={<Home size={18} />} value={9} />
        <Tabbar.Item title="分类" icon={<Category size={18} />} />
        <Tabbar.Item title="发现" icon={<Gift size={18} />} />
        <Tabbar.Item title="购物车" icon={<Cart size={18} />} />
        <Tabbar.Item title="我的" icon={<User size={18} />} />
      </Tabbar>
    </SafeAreaView>
  )
}
export default Index
