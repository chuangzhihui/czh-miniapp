import React, {forwardRef, useState,useRef} from 'react'
import {View} from "@tarojs/components";
import Taro, { useDidShow, useDidHide,useLoad } from '@tarojs/taro'
import {Button} from "@nutui/nutui-react-taro";
import dataList from "../index/data";
import SectionListView, {SectionItem, SectionListViewRef} from "../../component/ListView/SectionListView";

const HomePage=(_props:any, ref:any)=>{
  /**
   * 组件内不能使用load show等方法
   */
  useLoad((param)=>{
      console.log("加载HomePage",param)
  });
  useDidShow((param)=>{
    console.log("展示HomePage",param)
  })
  const listRef=useRef<SectionListViewRef | null>(null);
  const renderHeader=()=>{
    return(
      <View onClick={()=>{
      }} style={{height:300,background:"orange"}}>
        <Button onClick={()=>{
          console.log(listRef.current)
          listRef.current?.scrollToSection(3)
        }}>滚动到Section3</Button>
        <Button onClick={()=>{
          console.log(listRef.current)
          listRef.current?.scrollToItem(0,1)
        }}>滚动到S0I1</Button>
        <Button onClick={()=>{
          listRef.current?.scrollToTop();
        }}>滚动到顶部</Button>
        <Button onClick={()=>{
            // Taro.showLoading()
            // Request.POST("admin/login/login",{
            //   username:"admin",
            //   password:"zx123456",
            //   code:"1234",
            //   uuid:"edfsdfsdfsdf"
            // }).then(res=>{
            //   Taro.hideLoading()
            //   console.log("res",res)
            // })
        }}>网络请求</Button>
      </View>
    );
  }
  const renderSection=(section,index)=>{
    return(
      <View style={{height:50,background:"#ccc"}}>
        Section{index}
      </View>
    );
  }
  const renderItem = (data: any, index: number) => {
    return(
      <View style={{height:200,background:"red"}}>
        Item{index}
      </View>
    );
  }
  const getData=(callback:(datas:SectionItem<any>[])=>void)=>{
    setTimeout(()=>{
      console.log(dataList)
      callback(dataList as any)
    },1000)
  }
  return (
    <SectionListView<any>
      ref={listRef}
      renderHeader={renderHeader}
      renderItem={renderItem}
      renderSection={renderSection}
      getData={getData}
      onSectionSelected={(section:any,index:number)=>{
        console.log(section,index);
      }}
      columns={2}
    />
  )
}
export default forwardRef(HomePage);
