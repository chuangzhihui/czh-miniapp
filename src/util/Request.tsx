import Taro from "@tarojs/taro";

export interface HttpResponse<T>{
  code:number;//状态码 200成功 非200失败
  msg:string;//错误信息
  data:T;//数据包
}
type Method="POST" | "GET";
//接口域名
const API_URL="http://127.0.0.1:8081";
export function httpPost<T>(url:string,data:any):Promise<HttpResponse<T>>{
  return httpRequest(url,data,"POST");
}
export function httpGet<T>(url:string,data:any={}):Promise<HttpResponse<T>>{
  return httpRequest(url,data,"GET");
}
function httpRequest<T>(url:string,data:any,method:Method):Promise<HttpResponse<T>>{
  if(method==="GET")
  {
    const query=new URLSearchParams(data);
    if(query.toString())
    {
      url+="?"+query.toString();
    }
  }
  return new Promise<HttpResponse<T>>((resolve)=>{
    Taro.request({
      url: API_URL+url, //仅为示例，并非真实的接口地址
      data,
      timeout:3000,//超时时间
      header: {
        'content-type': 'application/json', // 默认值
        "token":Taro.getStorageSync("token")
      },
      method:method,
      dataType:"json",
      success: function (res) {
        let result:HttpResponse<T>={
          code:res.data.code,
          msg:res.data.msg,
          data:res.data.data
        }
        resolve(result)
      },
      fail:(err)=>{
        Taro.showToast({
          title:err.errMsg,
          icon:"none"
        })
        let result:HttpResponse<any>={
          code:0,
          msg:err.errMsg,
          data:[]
        }
        resolve(result)
      }
    })
  })
}

