import React, {useEffect, useState, forwardRef, useRef, useImperativeHandle, ForwardedRef} from 'react'
import {Image, ScrollView, StickyHeader, StickySection, View} from "@tarojs/components";
import {Empty, Grid, PullToRefresh, Sticky} from "@nutui/nutui-react-taro";
import "./index.scss"
import Taro from "@tarojs/taro";
import Masonry from 'react-masonry-css';
import {Loading1} from "@nutui/icons-react-taro";

export interface SectionItem<T>{
  title:string;//section的标题
  children:T[];//section的下属数据
}
export interface SectionListProps<T>{
  getData:(callback:(datas:SectionItem<T>[])=>void)=>void;//加载数据回调 必传
  renderItem:(item:T,index:number)=>React.ReactNode;//渲染item 必传
  renderSection:(sectionItem:SectionItem<T>,index:number)=>React.ReactNode;//渲染section 必填
  renderHeader?:()=>React.ReactNode;//渲染列表头 不传不展示
  renderEmpty?:()=>React.ReactNode;//空页面
  renderChildrenEmpty?:()=>React.ReactNode;//空页面 子项
  onSectionSelected?:(section:SectionItem<T>,index:number)=>void;
  columns?:number;//展示几列
  gap?:number;//列间距
}
export interface SectionListViewRef{
  //滚动到顶部
  scrollToTop:() => void;
  //滚动到底部
  scrollToBottom:()=>void;
  //滚动到指定section的某个item
  scrollToItem:(section:number,index:number)=>void;
  //滚动到指定section
  scrollToSection:(section:number)=>void;
  onRefresh:()=>Promise<void>;
}
type ListViewComponent<T> = (props: SectionListProps<T>, ref: ForwardedRef<SectionListViewRef>) => React.ReactElement;
const ListView:ListViewComponent<any>=<T,>(_props:SectionListProps<T>,ref:ForwardedRef<SectionListViewRef>)=>{
  const {gap=5,columns=1}=_props;
  const [list,setList]=useState<SectionItem<T>[]>([]);
  const [refreshing,setRefreshing]=useState<boolean>(false);//是否正在刷新中
  const [sid,setSid]=useState<string | undefined>(undefined);//滚动到哪个地方
  const [width,setWidth]=useState<number>(0)
  // 状态管理
  const [stickyElements, setStickyElements] = useState([]); // 吸顶元素信息（id、top）
  const [currentStickyId, setCurrentStickyId] = useState(null); // 当前吸顶元素id
  useEffect(()=>{
    setWidth(Taro.getSystemInfoSync().windowWidth)
    onRefresh();
  },[])
  useEffect(() => {
    if(list.length===0) return;
    getStickyElementsPosition()
  }, [list]);
  // 获取吸顶元素的初始位置
  const getStickyElementsPosition = () => {
    const query = Taro.createSelectorQuery();
    query
      .selectAll('.stickyItem') // 选择所有吸顶元素
      .boundingClientRect((rects:any) => {
        // 转换为包含id和top的数组（假设id从1开始）
        const elements = rects.map((rect, index) => ({
          id: index ,
          top: rect.top // 元素距离可视区域顶部的初始距离
        }));
        setStickyElements(elements);
      })
      .exec();
  };
  const onRefresh=()=>{
    setRefreshing(true);
      return new Promise<void>((resolve)=>{
        _props.getData((datas:SectionItem<T>[])=>{
          resolve();
          setRefreshing(false);
          setList(datas);
        })
      })

  }
  /**
   * 滚动到指定section的某个item
   * @param section
   * @param index
   */
  const scrollToItem=(section:number,index:number)=>{
    setSid("section"+section+"item"+index);
    setTimeout(()=>{
      setSid(undefined)
    },100)
  }
  /**
   * 滚动到指定section
   * @param section
   */
  const scrollToSection=(section:number)=>{
      setSid("section"+section);
      setTimeout(()=>{
        setSid(undefined)
      },100)
  }
  /**
   * 滚动到第一个section
   */
  const scrollToTop=()=>{
    scrollToSection(0);
  }
  /**
   * 滚动到最后一个section
   */
  const scrollToBottom=()=>{
    scrollToSection(list.length-1)
  }
  useImperativeHandle(ref,()=>({
    scrollToSection,scrollToItem,scrollToTop,scrollToBottom,onRefresh
  }))

  const renderEmpty=()=>{
    if(list.length>0) return(<></>);
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
      <Empty style={{background:"transparent"}} image={ <Image src={require("../../imgs/NO_DATA.png")} /> } />
    )
  }
  const renderChildrenEmpty=()=>{
    if(_props.renderChildrenEmpty) return  _props.renderChildrenEmpty();
    return  <Empty  style={{width:width-gap*2,marginLeft:gap,marginRight:gap,background:"transparent"}} image={<Image style={{width:160,height:160}} src={require("../../imgs/NO_DATA.png")} /> } />
  }

  // 监听ScrollView滚动
  const handleScroll = (e) => {
    const { scrollTop } = e.detail; // 当前滚动距离
    let currentId = null;
    // 遍历所有吸顶元素，找到最下方且满足吸顶条件的元素
    stickyElements.forEach((item:any) => {
      // 元素顶部 <= 滚动距离时，视为进入吸顶状态
      if (item.top <= scrollTop) {
        currentId = item.id; // 后续元素会覆盖前序，最终保留最下方的吸顶元素
      }
    });

    // 仅在状态变化时更新，避免频繁渲染
    if (currentId !== currentStickyId) {
      setCurrentStickyId(currentId);
    }
  };
  useEffect(() => {
    if(currentStickyId===null) return;
    let section=list[currentStickyId];
    _props.onSectionSelected?.(section,currentStickyId);
  }, [currentStickyId]);
  return (

    <ScrollView
      className={"listView"}
      scrollIntoView={sid || undefined}
      refresherEnabled={false}
      scrollWithAnimation={true}
      enableFlex={true}
      scrollY={true}
      enhanced={true}
      type={"custom"}
      usingSticky={true}
      onScroll={handleScroll}
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
      {_props.renderHeader?_props.renderHeader():null}
        {renderEmpty()}

      {list.map((section,index)=>{
        return(
          <React.Fragment key={index}>
            <View  className={"stickyItem"}  id={"section"+index}>{_props.renderSection(section,index)}</View>
            {section.children.length==0 && renderChildrenEmpty()}
            {section.children.length>0 &&
              <Masonry
                breakpointCols={columns}
                className={"my-masonry-grid gap"+gap}
                columnClassName={"my-masonry-grid_column gap"+gap}
              >
                   {section.children.map((item,key)=>(
                     <View  id={"section"+index+"item"+key} key={key}>
                       {_props.renderItem(item,key)}
                     </View>
                   ))}
              </Masonry>
            }
          </React.Fragment>
        );
      })}

      </PullToRefresh>
    </ScrollView>
  )
}
export const CZHSectionListView = forwardRef(ListView) as <T>(
  props: SectionListProps<T> & { ref?: ForwardedRef<SectionListViewRef> }
) => React.ReactElement;
export default CZHSectionListView;
