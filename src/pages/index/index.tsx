import React, {useEffect, useState,useRef} from 'react'
import {
  Button
} from '@nutui/nutui-react-taro'
import Taro, {useDidShow,useLoad} from "@tarojs/taro";
import {View} from "@tarojs/components";
import ListView, {ListViewRef} from "../../component/ListView/ListView";
import "./index.scss"
import {PageDto} from "../../models/CommonDto";
import {HttpResponse} from "../../util/Request";
import {PageInfoVo} from "../../models/CommonVo";
const Index = () => {
  const listRef=useRef<ListViewRef | null>(null);
  const renderItem = (data: any, index: number) => {
    return(
      <View style={{height:200,background:"red"}}>
        {index}
      </View>
    );
  }
  const getdata=(pageDto:PageDto,callback:(res:HttpResponse<PageInfoVo<any>>)=>void)=>{
      console.log("加载第"+pageDto.page+"页，size:"+pageDto.size)
      let datas:any=[];
      let all=100;
      for(var i=1;i<=pageDto.size;i++)
      {
          datas.push({
              index:(pageDto.page-1)*pageDto.size+i
          })
      }
      setTimeout(()=>{
        callback({
          code:200,
          msg:"",
          data:{
            list:datas,
            total:all
          }
        })
      },1000)
  }
  const renderHeader=()=>{
    return(
      <View  style={{height:300,background:"orange",marginBottom:10}}>
        <Button onClick={()=>{
          console.log(listRef.current)
          listRef.current?.scrollToItem(5)
        }}>滚动到index5</Button>
        <Button onClick={()=>{
          listRef.current?.scrollToTop();
        }}>滚动到顶部</Button>
        <Button onClick={()=>{
          listRef.current?.scrollToBottom();
        }}>滚动到底部</Button>
        <Button onClick={()=>{
          Taro.navigateTo({
            url:"/pages/home/index"
          })
        }}>sectionList</Button>
        <Button onClick={()=>{
          Taro.navigateTo({
            url:"/pages/tabbar/index"
          })
        }}>tabbar</Button>
      </View>
    );
  }
  return (
    <ListView<any>
      ref={listRef}
      renderHeader={renderHeader}
      renderItem={renderItem}
      getData={getdata}
    />
  )
}
export default Index
