import { getUploadConfigApi} from "../api/CommonApi";
import Taro from "@tarojs/taro";
import {HttpResponse} from "./Request";

export interface CZHUploaderProps{
  filePath:string;//文件路径
  fileType:number;//文件类型 1图片，2视频
  onPercent?:(percent:number) => void;//进度回调
  onOk?:(res:CZHFileUploadResult)=>void;
  onError?:(error:string) => void;//上传错误回调

}
export enum UploadStatus{
  SUCCESS=1,//上传成功
  FAIL=2,//上传失败
  UPLOADING=3,//上传中
}
export interface CZHFileItem{
  url?:string;//文件地址
  thumb?:string;//缩略图
  fileWidth:number;//图片或者视频宽其它为0
  fileHeight:number;//图片或者视频宽其它为0
  fileSize:number;//文件大小kb
  fileType:number;//文件类型 1图片，2视频
  tempFilePath?:string;//临时文件路径
  thumbTempFilePath?:string;//临时缩略图路径
  uploadStatus:UploadStatus;//上传状态
  progress?:number;//上传进度
  uploadTask?:any;//上传任务
}
export interface CZHFileUploadResult{
  url:string;//文件地址
  thumb?:string;//缩略图
}
const CZHUploader=async (props:CZHUploaderProps)=>{
    const res = await  getUploadConfigApi();
    if(res.code!==200) {
      props.onError?.("获取token失败");
      return;
    }
    const uploadTokenVo=res.data;
    let header:TaroGeneral.IAnyObject={
      'Content-Type': 'multipart/form-data',
      'token':uploadTokenVo.token
    };
    let formData:TaroGeneral.IAnyObject={
      dir:"miniapp",
      type:props.fileType,
    };
    const uploadTask=Taro.uploadFile({
      url:uploadTokenVo.host,
      filePath:props.filePath,
      name:"file",
      header,
      formData,
      success:(res)=>{
        console.log("上传成功",res);
        if(res.statusCode===200){
          let response:HttpResponse<CZHFileUploadResult>=JSON.parse(res.data);
          if(response.code===200)
          {
            props.onOk?.({
              url:response.data.url,thumb:response.data.thumb
            });
            return;
          }
        }
        props.onError?.("上传失败");
      },
      fail:(error)=>{
        console.log("上传失败",error);
          props.onError?.(error.errMsg);
      }
    });
    uploadTask.progress(({progress})=>{
      props.onPercent?.(progress);
    });
    return uploadTask;
}

export default CZHUploader;
