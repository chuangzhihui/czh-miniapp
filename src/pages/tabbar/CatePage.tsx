import React, {forwardRef, useState,useRef} from 'react'
import {View} from "@tarojs/components";
import {Button} from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";
import ListView, {ListViewRef} from "../../component/ListView/ListView";
import {PageDto} from "../../models/CommonDto";

const CatePage=(_props:any, ref:any)=>{
  const listRef=useRef<ListViewRef | null>(null);
  const itemVariable = (data: any, index: number) => {
    return(
      <View style={{height:200,background:"red"}}>
        {index}
      </View>
    );
  }
  const getData11=(pageDto:PageDto,callback:(res:any)=>void)=>{
    console.log("加载第"+pageDto.page+"页，size:"+pageDto.size)
    let datas:any[]=[];
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
        data:{
          all,list:datas
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
    <ListView
      ref={listRef}
      renderHeader={renderHeader}
      renderItem={itemVariable}
      getData={getData11}
    />
  )
}
export default forwardRef(CatePage);
