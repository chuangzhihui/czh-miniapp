import {httpGet, httpPost} from "../util/Request";

export const getUploadConfigApi=()=>{
  return httpGet<any>("/admin/login/getUploadToken",{});
}
/**
 * 获取火山云上传地址
 */
export const getTosSignUrlApi=(params:any)=>{
  return httpPost<any>("/admin/login/getTosSignUrl",params);
}
