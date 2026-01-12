import {Image, Text, View} from "@tarojs/components";
import {CommonFormItemProps} from "../formItemTypes";
import "./index.scss"
import Taro from "@tarojs/taro";
import {useRef, useState} from "react";
import CZHUploader, {CZHFileItem, CZHFileUploadResult, UploadStatus} from "../../../util/Uploader";

export interface CZHUploadProps extends CommonFormItemProps{
  max?:number;//最大允许上传数量 默认1
  mediaType?:number//上传类型 1图片 2视频 3图片和视频均可
}
const CZHUpload=(props:CZHUploadProps)=>{
  const {max=1,mediaType=1}=props;
 const fileListRef=useRef<CZHFileItem[]>([])
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
        for(let i=0;i<files.length;i++){
          const file=files[i];
          if(file.fileType==="image")
          {
            Taro.getImageInfo({
              src:file.tempFilePath,
              success:(imageInfo)=>{
                let fileItem:CZHFileItem={
                  fileType:1,
                  tempFilePath:file.tempFilePath,
                  fileWidth:imageInfo.width,
                  fileHeight:imageInfo.height,
                  fileSize:file.size,
                  uploadStatus:UploadStatus.UPLOADING
                }
                fileListRef.current.push(fileItem);
                doUpload(fileItem,fileListRef.current.length-1);
              }
            })
          }else{
            console.log(file)
            //视频
            let fileItem:CZHFileItem={
              fileType:2,
              tempFilePath:file.tempFilePath,
              thumbTempFilePath:file.thumbTempFilePath,
              fileWidth:file.width,
              fileHeight:file.height,
              fileSize:file.size,
              uploadStatus:UploadStatus.UPLOADING
            }
            fileListRef.current.push(fileItem);
            doUpload(fileItem,fileListRef.current.length-1);
          }
        }
      },
      fail:(err)=>{
        // Taro.showModal({
        //   title:"错误",
        //   content:"选择图片失败",
        //   showCancel:false,
        // })
      }
    })
  }
  const doUpload=(file:CZHFileItem,index:number)=>{
    file.uploadTask=CZHUploader({
      filePath:file.tempFilePath || "",
      fileType:file.fileType,
      onOk:(result:CZHFileUploadResult)=>{
        file.url=result.url;
        file.thumb=result.thumb;
        file.uploadStatus=UploadStatus.SUCCESS;
        fileListRef.current[index]=file;
        setForceUpdate({});
      },
      onError:(err)=>{
        file.uploadStatus=UploadStatus.FAIL;
        fileListRef.current[index]=file;
        setForceUpdate({});
        Taro.showModal({
          title:"错误",
          content:"文件上传失败",
          confirmText:"确定",
          showCancel:false,
        })
      },
      onPercent:(per:number)=>{
        file.uploadStatus=UploadStatus.UPLOADING;
        file.progress=per;
        console.log("上传进度:"+per)
        fileListRef.current[index]=file;
        setForceUpdate({});
      }
    })
    // let per=0;
    // let timer=setInterval(()=>{
    //   per+=1;
    //       file.uploadStatus=UploadStatus.UPLOADING;
    //       file.progress=per;
    //       console.log("上传进度:"+per)
    //       fileListRef.current[index]=file;
    //       console.log(fileListRef.current)
    //       setForceUpdate({});
    //
    // },1000)
    fileListRef.current[index]=file;
    setForceUpdate({});
  }


  const deleteFile=(index:number)=>{
    const fileItem=fileListRef.current[index];
    if(fileItem.uploadStatus===UploadStatus.UPLOADING && fileItem.uploadTask){
      fileItem.uploadTask.abort();
    }
    fileListRef.current.splice(index,1);
    setForceUpdate({});
  }
  //预览图片
  const prevMedia=(index:number)=>{
    const source:any[]=[];
    for(let i=0;i<fileListRef.current.length;i++){
      let file=fileListRef.current[i];
      let  url=file.url || file.tempFilePath || "";;
      if(url)
      {
        source.push({
          url,
          mediaType:file.fileType===1?"image":"video",
          poster:file.thumb || file.tempFilePath
        })
      }

    }
    Taro.previewMedia({
      sources:source,
      current:index
    })
    // Taro.previewImage({
    //   current:fileListRef.current[index].url,
    //   urls:fileListRef.current.map(item=>{
    //     return item.url || item.tempFilePath || "";
    //   }),
    // })
  }
  return(
    <View className={`CZHFormItemContainer vertical`}>
      <Text className={"labelView"}>
        {props.required && <Text className={"required"}>*</Text>}
        {props.label}
      </Text>
      <View className={"contentView"}>
        {fileListRef.current.map((file,index)=>{
          let url="";
          if(file.fileType===1)
          {
            url=file.thumb || file.url || file.tempFilePath || "";
          }else{
            //视频
            url=file.thumb || file.thumbTempFilePath || "";
          }
          return(
            <View onClick={()=>{prevMedia(index)}} key={index} className={`imgItem ${file.uploadStatus===UploadStatus.FAIL?"uploadFail":""}`}>
              <Image className={"imgItem"} mode={"aspectFit"} src={url} />
              {file.uploadStatus!=UploadStatus.UPLOADING &&   <Image onClick={()=>{deleteFile(index)}} src={require("./assets/closeIcon.png")}  className={"closeIcon"} />}
              {file.uploadStatus===UploadStatus.UPLOADING &&
                <View className={"progreeView"}>
                  <Text className={"progressText"}>{file.progress || 0}%</Text>
                </View>
              }
            </View>
          )
        })}

        <View onClick={chooseImg} className={"uploadBtn"}>
          <Image src={require("./assets/camera.png")} mode={"widthFix"} className={"uploadBtnImg"} />
        </View>
      </View>
    </View>
  );
}

export default CZHUpload;
