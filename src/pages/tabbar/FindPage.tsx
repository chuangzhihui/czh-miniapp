import React, {forwardRef, useState,useRef} from 'react'
import {View} from "@tarojs/components";
import {Button, Form} from "@nutui/nutui-react-taro";
import "./findPage.scss"
import CZHInput from "../../component/FormItem/CZHInput";
import CZHUpload from "../../component/FormItem/CZHUpload";
const FindPage=(_props:any, ref:any)=>{
  const [form] = Form.useForm();
  const [loading,setLoading]=useState<boolean>(false)
  const onFinishFailed=(values:any,errorFields: any)=>{
    console.error(values,errorFields)
  }
  const onFinish=(data)=>{
    console.log(data)
  }
  return(
    <Form
      form={form}
      onFinishFailed={onFinishFailed}
      onFinish={onFinish}
      className={"container"}  >
      {/*<FormItem.InputItem*/}
      {/*  name={"name1"} rules={[{required:true,message:"请输入名称"}]}*/}
      {/*  formRef={form} label={"名称"}   placeholder={"请输入名称"}*/}
      {/*/>*/}

      {/*<Form.Item noStyle name={"name"} rules={[{required:true,message:"请输入名称"}]}  >*/}
      {/*  <CZHInput layout={"vertical"} label={"名称"} placeholder={"请输入名称"} required />*/}
      {/*</Form.Item>*/}
      <Form.Item noStyle name={"name"} rules={[{required:true,message:"请输入名称"}]}  >
        <CZHUpload max={4}  required label={"上传图片"} />
      </Form.Item>
      {/*<Form.Item noStyle name={"station_id"} rules={[{required:true,message:"请选择站点"}]}  >*/}
      {/*  <FormItem formRef={form} label={"站点名称"}  required={true} type={"stationList"} mode={2} placeholder={"请选择站点"} />*/}
      {/*</Form.Item>*/}
      {/*<View className={"uploadView"}>*/}
      {/*  <Text className={"label"}>上传照片</Text>*/}
      {/*  <Form.Item noStyle name={"imgs"}   >*/}
      {/*    <CustomerUploader multiple={true} maxCount={4} />*/}
      {/*  </Form.Item>*/}
      {/*</View>*/}
      {/*<Form.Item noStyle name={"content"}   >*/}
      {/*  <TextArea placeholder={"报修详情描述"} showCount={!alipay} maxLength={100} className={"detailArea"} />*/}
      {/*</Form.Item>*/}
      <Button loading={loading} nativeType={"submit"} size={"large"} type={"primary"}    block className={"addBtn"}>提交报修</Button>
    </Form>
  );
}
export default forwardRef(FindPage);
