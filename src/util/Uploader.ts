import {getTosSignUrlApi, getUploadConfigApi} from "../api/CommonApi";
import Taro from "@tarojs/taro";
import {HttpResponse} from "./Request";

export interface CZHUploaderProps{
  filePath:string;//文件路径
  onPercent?:(percent:number) => void;//进度回调
  onOk?:(res:CZHFileUploadResult)=>void;
  onError?:(error:string) => void;//上传错误回调
  fileType:number;//文件类型 1图片，2视频
  fileWidth:number;//图片或者视频宽其它为0
  fileHeight:number;//图片或者视频宽其它为0
  fileSize:number;//文件大小kb
}
export interface CZHFileUploadResult{
  url:string;//文件地址
  fileWidth:number;//图片或者视频宽其它为0
  fileHeight:number;//图片或者视频宽其它为0
  fileSize:number;//文件大小kb
  fileType:number;//文件类型 1图片，2视频
  thumb?:string;//缩略图
}
const CZHUploader=async (props:CZHUploaderProps)=>{
    const res = await  getUploadConfigApi();
    if(res.code!==200) {
      Taro.showModal({
        title: '提示',
        showCancel:false,
        content: "获取token失败",
      })
      return;
    }
    let url="";//上传地址
    let key=getFileKey(props.filePath);
    let header:TaroGeneral.IAnyObject={
      'Content-Type': 'multipart/form-data',
    };
    let formData:TaroGeneral.IAnyObject={};
    const visible=res.data.visible;
    const baseUrl=visible===4?"":(res.data.domain+"/");
    if (res.data.visible === 1) {  // 七牛
      url = 'https://'+res.data.endpoint;
      formData={
        "token":res.data.token,
        "key":key
      }
    } else if (res.data.visible === 2) {  //阿里oss
      url = res.data.domain;
      formData={
        "policy":res.data.policy,
        "OSSAccessKeyId":res.data.OSSAccessKeyId,
        "signature":res.data.signature,
        key:key
      };
    } else if (res.data.visible === 3) {  //腾讯
      url = res.data.path;
      console.log("暂未实现")
    } else if (res.data.visible === 4) {  // 本地服务器
      url =res.data.uploadUrl;
      header={
        "token":res.data.token,
        ...header
      }
    }else if(res.data.visible === 5) {  // 火山云
      const tosConfig=await getTosSignUrlApi({key:key});
      url=tosConfig.data.url;
      header={
        'Content-Type':'application/octet-stream'
      }
      formData={
        "key":key
      }
    }
    console.log("formData",formData,"url",url)
    Taro.uploadFile({
      url,
      filePath:props.filePath,
      name:"file",
      header,
      formData,
      success:(res)=>{
        console.log("上传成功",res);
        const okCode=visible===2?204:200;
        let url="";
        let thumb="";
        if(res.statusCode===okCode){

          if(visible===4)
          {
            let response:HttpResponse<any>=JSON.parse(res.data);
            if(response.code===200)
            {
              url=response.data.url;
              thumb=response.data.thumb;
            }
          }else{
            url=baseUrl+key;
            if(props.fileType===1)
            {
              if(visible===1)
              {
                thumb=url+"?imageView2/1/w/160/h/160/q/50";
              }else if(visible===2)
              {
                //阿里云
                thumb=url+"?x-oss-process=image/resize,h_160";
              }else if(visible===3)
              {
                //腾讯云
                thumb=url+"?imageMogr2/w/300/h/200";
              }else if(visible===5)
              {
                //火山云
                thumb=url+"?imageMogr2/thumbnail/160x160";
              }
            }else{
              //视频
              if(visible===1)
              {
                thumb=url+"?vframe/jpg/offset/1";
              }else if(visible===2)
              {
                //阿里云
                thumb=url+"?x-oss-process=video/snapshot,t_1,f_jpg";
              }else if(visible===3)
              {
                //腾讯云
                thumb=url+"?ci-process=snapshot&time=1&format=jpg";
              }else if(visible===5)
              {
                //火山云
                thumb=url+"?x-tos-process=video/snapshot,t_100";
              }
            }
          }
        }
        if(url)
        {
          props.onOk?.({
            url: url,
            fileWidth:props.fileWidth,
            fileHeight:props.fileHeight,
            fileSize:props.fileSize,
            fileType:props.fileType,
            thumb:baseUrl+key
          });
        }else{
          props.onError?.("上传失败");
        }
      },
      fail:(error)=>{
        console.log("上传失败",error);
          props.onError?.(error.errMsg);
      }
    }).progress(({progress})=>{
      props.onPercent?.(progress);
    });
}

const getFileKey=(path:string)=>{
  let fileNames=path.split("/")

  let name=fileNames[fileNames.length-1];
  var nameList =name.split('.');
  let houzui = nameList[nameList.length - 1];
  return Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + '.' + houzui;
}
export default CZHUploader;
