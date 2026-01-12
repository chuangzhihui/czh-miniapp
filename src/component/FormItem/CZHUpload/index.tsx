import {Image, Input, Text, View} from "@tarojs/components";
import {CommonFormItemProps} from "../formItemTypes";
import "./index.scss"
import Taro from "@tarojs/taro";
import {useRef, useState} from "react";
import CZHUploader, {CZHFileUploadResult} from "../../../util/Uploader";
import {forceUpdate} from "@tarojs/components/dist/types/stencil-public-runtime";
export interface CZHUploadProps extends CommonFormItemProps{
  max?:number;//最大允许上传数量 默认1
  mediaType?:number//上传类型 1图片 2视频 3图片和视频均可
}
const CZHUpload=(props:CZHUploadProps)=>{
  const {max=1,mediaType=1}=props;
 const fileListRef=useRef<CZHFileUploadResult[]>([])
  const [_, setForceUpdate] = useState({});
  const [uploading,setUploading]=useState<boolean>(false);
  const [percent,setPercent]=useState<number>(0);
  const chooseImg=()=>{
    Taro.chooseMedia({
      mediaType:mediaType===1?["image"]:(mediaType===2?["video"]:["mix"]),
      count:max-fileListRef.current.length,
      success:(res)=>{
        console.log(res);
        const files=res.tempFiles;
        doUpload(files)
      },
      fail:(err)=>{
        Taro.showModal({
          title:"错误",
          content:"选择图片失败",
          showCancel:false,
        })
      }
    })
  }
  const doUpload=(files:any[],index:number=0)=>{
    if(index>=files.length){
      setPercent(0);
      setUploading(false);
      return;
    }
    const file=files[index];
    Taro.getImageInfo({
      src:file.tempFilePath,
      success:(res)=>{
        CZHUploader({
          filePath:file.tempFilePath,
          fileWidth:res.width,
          fileHeight:res.height,
          fileSize:file.size,
          fileType:file.fileType=="image"?1:2,
          onPercent:(per:number)=>{
            setUploading(true);
            setPercent(per);
          },
          onOk:(res)=>{
            fileListRef.current.push(res);
            setForceUpdate({});
            doUpload(files,index+1);
          },
          onError:(err)=>{
            Taro.showModal({
              title:"错误",
              content:"文件上传失败",
              showCancel:false,
            })
          }
        })
      },
      fail:(err)=>{
        Taro.showModal({
          title:"错误",
          content:"获取文件信息失败",
          showCancel:false,
        })
      }
    })
  }

  const deleteFile=(index:number)=>{
    fileListRef.current.splice(index,1);
    setForceUpdate({});
  }
  //预览图片
  const previewImg=(index:number)=>{
    Taro.previewImage({
      current:fileListRef.current[index].url,
      urls:fileListRef.current.map(item=>item.url),
    })
  }
  return(
    <View className={`CZHFormItemContainer vertical`}>
      <Text className={"labelView"}>
        {props.required && <Text className={"required"}>*</Text>}
        {props.label}
      </Text>
      <View className={"contentView"}>
        {fileListRef.current.map((file,index)=>{
          return(
            <View onClick={()=>{previewImg(index)}} key={index} className={"imgItem"}>
              <Image className={"imgItem"} mode={"aspectFit"} src={file.url} />
              <Image onClick={()=>{deleteFile(index)}} src={require("./assets/closeIcon.png")}  className={"closeIcon"} />
            </View>
          )
        })}

        <View onClick={chooseImg} className={"uploadBtn"}>
          <Image src={require("./assets/camera.png")} mode={"widthFix"} className={"uploadBtnImg"} />
          {uploading &&
            <View className={"progreeView"}>
              <Text className={"progressText"}>{percent}%</Text>
            </View>
          }
        </View>
      </View>
    </View>
  );
}

export default CZHUpload;
