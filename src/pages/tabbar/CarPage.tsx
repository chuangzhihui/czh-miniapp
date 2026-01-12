import React, {forwardRef, useState,useRef} from 'react'
import {View,Text} from "@tarojs/components";
import "./car.scss"
import {AnimatingNumbers, Button} from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";
import CZHUploader from "../../util/Uploader";
const CarPage=(_props:any, ref:any)=>{
  const chooseFile=()=>{
    Taro.chooseMedia({
      mediaType:["mix"],
      success:(res)=>{
        console.log(res);
        const tempFiles=res.tempFiles;
        for(let i=0;i<tempFiles.length;i++){
          let file=tempFiles[i];
          // CZHUploader({
          //   filePath:file.tempFilePath,
          //   onPercent:(percent)=>{
          //     console.log("上传进度",percent);
          //   }
          // })
          // if(file.fileType==="image")
          // {
          //   Taro.getImageInfo({
          //     src:file.tempFilePath,
          //     success:(res)=>{
          //       console.log("getImageInfo",res);
          //     }
          //   })
          // }
        }
      }
    })
  }
  const doUpload=(files)=>{

  }
  return(
    <View style={{flex:1}}>

      <AnimatingNumbers.CountUp value="678.94" />
      <Button onClick={chooseFile}>上传</Button>
    </View>
  );
}
export default forwardRef(CarPage);
