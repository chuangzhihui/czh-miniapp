import React, {useEffect, useState, forwardRef, useRef, useImperativeHandle, ForwardedRef} from 'react'
import {Image, ScrollView, ScrollViewProps, Text, View} from "@tarojs/components";
import {Empty, PullToRefresh, Loading} from "@nutui/nutui-react-taro";
import { Loading1 } from '@nutui/icons-react-taro'
import Masonry from 'react-masonry-css';
import "./index.scss"
import {HttpResponse} from "../../util/Request";
import {PageInfoVo} from "../../models/CommonVo";
import {PageDto} from "../../models/CommonDto";
//定义props参数
export  interface ListViewProps<T> extends ScrollViewProps{
  getData:(pageDto:PageDto,callBack:(res:HttpResponse<PageInfoVo<T>>)=>void)=>void;//加载数据回调 必传
  renderItem:(item:T,key:number)=>React.ReactNode;//渲染item 必传
  renderHeader?:()=>React.ReactNode;//渲染列表头 不传不展示
  renderEmpty?:()=>React.ReactNode;//空页面
  columns?:number;//展示几列
  gap?:number;//列间距
  pageSize?:number;//每页展示数据
}
//定义导出方法
export interface ListViewRef{

  onRefresh:()=>Promise<void>;//刷新数据
  scrollToItem:(index:number)=>void;//滚动到指定item
  scrollToTop:()=>void;//滚动到顶部
  scrollToBottom:()=>void;//滚动到底部
}
type ListViewComponent<T> = (props: ListViewProps<T>, ref: ForwardedRef<ListViewRef>) => React.ReactElement;
const ListView:ListViewComponent<any>=<T,>(_props:ListViewProps<T>,ref:ForwardedRef<ListViewRef>)=>{
  const {gap=5,columns=1,pageSize=10}=_props;
  const [datas,setDatas]=useState<T[]>([]);
   const [page,setPage]=useState<number>(1);
  const [hasMore,setHasMore]=useState<boolean>(true);
  const [refreshing,setRefreshing]=useState<boolean>(false);//正在刷新中
  const[loading,setLoading]=useState<boolean>(false);//是否正在刷新中
  const [sid,setSid]=useState<string | null>(null);//滚动到哪个地方
  useEffect(()=>{
    onRefresh();
  },[])
  //刷新数据
  const onRefresh=()=>{
     return loadData(1)
  }
  const loadMore=()=>{
      if(!hasMore) return;
      loadData(page);
  }
  const loadData=(loadPage:number)=>{
    return  new Promise<void>((resolve)=>{
      if(loadPage==1)
      {
        setRefreshing(true);
      }else{
        setLoading(true);
      }
      _props.getData({page:loadPage,size:pageSize,orderBy:""},(res:HttpResponse<PageInfoVo<T>>)=>{
        if(loadPage==1)
        {
          setRefreshing(false);

        }else{
          setLoading(false);
        }
        resolve();
        console.log(res)
        if(res.code===200)
        {
          let sourceDatas=loadPage==1?res.data.list:datas.concat(res.data.list || []);
          setDatas(sourceDatas);
          setPage(loadPage+1);
          setHasMore(datas?.length<res.data.total)
        }else{
          setHasMore(false);
        }
      });
    })
  }
  //滚动到指定item
  const scrollToItem=(index:number)=>{
      setSid("item"+index);
      setTimeout(()=>{
        setSid(null)
      },100)
  }
  //滚动到顶部
  const scrollToTop=()=>{
    scrollToItem(0);
  }
  //滚动到底部
  const scrollToBottom=()=>{
    scrollToItem(datas.length-1)
  }
  useImperativeHandle(ref,()=>({
    scrollToItem,scrollToTop,scrollToBottom,onRefresh
  }))

  const renderLoading=()=>{
    return(
      <Loading style={{marginTop:20}}><Text style={{color: "#333", fontSize: 16}}>正在加载中</Text></Loading>
    );
  }
  const renderNoMore=()=>{
    return(
      <Text style={{color:"#333",fontSize:16}}>没有更多了</Text>
    );
  }
  const renderEmpty=()=>{
    console.log(datas)
    if(datas.length>0) return(<></>);
    if(refreshing){
      return(
        <View style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <Loading1 size={40} className='nut-icon-am-rotate nut-icon-am-infinite' />
        </View>
      );
    }
    if(_props.renderEmpty)
    {
      return _props.renderEmpty();
    }
    return(
      <Empty image={ <Image src={require("../../imgs/NO_DATA.png")} /> } />
    )
  }

  return (
      <ScrollView
        scrollIntoView={sid || ""}
        refresherEnabled={false}
        scrollWithAnimation={true}
        className={"listView"}
        enableFlex={true}
        scrollY={true}
        enhanced={true}
        usingSticky={true}
        refresherTriggered={refreshing}
        onRefresherRefresh={onRefresh}
        onScrollToLower={loadMore}
        {..._props}
      >
        <PullToRefresh
          className={"refreshControl"}
          canReleaseText={"松开刷新"}
          completeText={"刷新中"}
          pullingText={"下拉刷新"}
          refreshingText={"加载中"}
          completeDelay={60}
          onRefresh={onRefresh}
        >
        {_props.renderHeader&&_props.renderHeader()}
          {renderEmpty()}
        <Masonry
          breakpointCols={columns}
          className={"my-masonry-grid gap"+gap}
          columnClassName={"my-masonry-grid_column gap"+gap}
        >
          {datas.map((item,key)=>(
              <View  id={"item"+key} key={key}>
                {_props.renderItem(item,key)}
              </View>
          ))}
        </Masonry>
        <view className={"footView"}>
          {loading && renderLoading()}
          {!hasMore && renderNoMore()}
        </view>
        </PullToRefresh>
      </ScrollView>
  )
}
export const CZHListView = forwardRef(ListView) as <T>(
  props: ListViewProps<T> & { ref?: ForwardedRef<ListViewRef> }
) => React.ReactElement;
export default CZHListView;
