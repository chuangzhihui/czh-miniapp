export interface CommonFormItemProps{
  value?:any;
  onChange?: (value:any)=>void;
  layout?:'horizontal'|'vertical';
  required?:boolean;//是否必填
  label:string;//标题

}
