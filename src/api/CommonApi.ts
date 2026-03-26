import {httpGet, httpPost} from "../util/Request";
import {GetUploadTokenVo} from "../models/CommonVo";

export const getUploadConfigApi=()=>{
  return httpGet<GetUploadTokenVo>("/admin/login/getUploadToken",{});
}
