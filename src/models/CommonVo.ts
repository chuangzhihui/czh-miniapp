export interface PageInfoVo<T>{
  list: T[];//数据列表
  total: number;//总条数
}
export interface GetUploadTokenVo{
  token: string;//上传token
  host:string;//上传地址
  type:number;//上传类型 1七牛 2阿里云 3腾讯云 4本地 5火山云
}
export interface CZHFileUploadResult {
  domain:number;//文件保存在哪里的 0虚拟文件夹 1七牛 2阿里oss 3腾讯cos 4本地服务器 5火山云
  type:number;//文件类型 1图片 2视频 3 Excel 4 word 5 pdf 6 zip 7 未知类型文件 8文件夹
  name:string;//文件名
  key:string;//上传到第三方的key或者本地真实路径
  url:string;//文件URL地址
  fileWidth:number;//图片或者视频宽其它为0
  fileHeight:number;//图片或者视频宽其它为0
  fileSize:number;//文件大小kb
  thumb?:string;//缩略图
}
