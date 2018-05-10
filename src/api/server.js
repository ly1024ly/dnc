import post from './post.js';
import get from './get.js';
import put from './put.js';
import del from './delete.js';
import Cookies from 'js-cookie'

const baseUrl = "http://nccloud.weihong.com.cn/deviceapi/";
const userUrl = "http://nccloud.weihong.com.cn/userapi/"
const domain = "http://nccloud.weihong.com.cn/";
var baseUrl1 = "https://nccloud.weihong.com.cn/nccloudpdcapi/";



const url = {
  Group:"group",
  getDevice:"device/settings",
  singleDevice : "device/setting",
  uuidgroups:"device/uuidgroups",
  uuidgroup : 'device/uuidgroup',
  devstatus : '/device/devstatus',
  homeparams : 'device/homeparams',
  paramlist : 'device/paramlist',
  logn:"userapi/login",
  updatePassword:"userapi/updatepassword",
  modifyPerset:"userapi/modifyperset",
  signout:"userapi/signout",
  finduser:"userapi/finduser",
  addUser:"userapi/adduser",
  findUserByIdtype:'userapi/getuser',
  deleteUser:'userapi/deleteuser',
  modifyuser:'userapi/modifyuser',
  getParm:'device/supportparams',
  getIntelligentAlarm:"web/config/getdata",
  getFocus:"devparams",
  changeFocus:'fixdevparams',
  fomatData: baseUrl1 + "web/home/allparam",
  alarminfo:'deviceapi/device/alarminfo'
}

const user = {
  username:Cookies.get("dnc-username"),
  department:Cookies.get("dnc-department"),
  name:Cookies.get("dnc-name")
}

const users = {
  finduserbyidtype  : 'finduserbyidtype',
  getuser : "getuser" 
}

const app ={
  id : 123456,
  secret : 123456
}

const query_string = ``

// const resPro = (pro) => {
//   return new Promise((resolve,reject)=>{
//     pro.then((res)=>{
//       if(res.data.result === 'success'){
//         resolve(res.data);
//       }else{
//         reject(res.data)
//       }
//     });
//   }) 
// }

export const upload = param => {
  return post(`http://nccloud.weihong.com.cn/controlapi/upload/loadfile`,param)
}
//所有参数单位
export const format = param => {
  get(`${url.fomatData}`)
}

export const newGroup = (param) =>{
  return post(`${baseUrl}${url.Group}`,param)
}
export const getGroup = (param) => {
  return  get(`${baseUrl}${url.Group}`)
}
export const updateGroup = (param) => {
  return put(`${baseUrl}${url.Group}`, param)
}
export const delGroup = (param) => {
  return del(`${baseUrl}${url.Group}`, param)
}

//新建一个设备设置信息
export const newDevice = param => {
  return post(`${baseUrl}${url.singleDevice}`,param)
}

export const delDevice = param => {
  return del(`${baseUrl}${url.singleDevice}`,param)
}
export const getPerDevice = param => {
  return get(`${baseUrl}${url.singleDevice}?uuid=${param}`)
}
export const getDevice = param => {
  return get(`${baseUrl}${url.getDevice}`)
}

export const getDeviceOfGroups = param => {
  return get(`${baseUrl}${url.uuidgroups}`)
}
export const getDevicesOfGroup = param => {
  return get(`${baseUrl}${url.uuidgroup}/uuids?groupid=${param._id}`)
}

//获取设备状态
export const getDeviceStatus = param =>{
  return get(`${baseUrl}${url.devstatus}?uuid=${param}`)
} 

//添加一个设备到设备分组
export const newDeviceToGroups = param => {
  return post(`${baseUrl}${url.uuidgroup}`,param)
}
export const delDeviceFromGroups = param => {
  return del(`${baseUrl}${url.uuidgroup}`, param)
}
//编辑设备显示参数
export const editHomeParams = param =>{
  return put(`${baseUrl}${url.homeparams}`,param)
}
//获取所有设备参数
export const getParamList = param =>{
  return get(`${baseUrl}${url.paramlist}`);
}
//查询用户信息
//根据用户类型查询用户
export const findUserByType = param => {
  return get(`${userUrl}${users.getuser}?id_type=${param}`)
}
export const uuidgroups = param => {
  return get(`${baseUrl}${url.uuidgroups}?appid=${param.appid}&appsecret=${param.appsecret}`)
}

export const login = param => {
  return post(`${domain}${url.logn}`,param)
}

export const updatePassword = param => {
  return post(`${domain}${url.updatePassword}`,param)
}

export const modifyPerset = param => {
  return post(`${domain}${url.modifyPerset}`,param)
}

export const signout = () => {
  return get(`${domain}${url.signout}`)
}

export const finduser = param => {
  return get(`${domain}${url.finduser}?username=${param.username}`)
}

export const addUser = param => {
  return post(`${domain}${url.addUser}`,param)
}

export const findUserByIdtype = param => {
  if(param.id_type){
    return get(`${domain}${url.findUserByIdtype}?id_type=${param.id_type}`)
  }else{
    return get(`${domain}${url.findUserByIdtype}`)
  }
  
}

export const deleteUser = param => {
  return del(`${domain}${url.deleteUser}`,param)
}

export const modifyuser = param => {
  return post(`${domain}${url.modifyuser}`,param)
}

export const getParm = param => {
  return get(`${baseUrl}${url.getParm}?uuid=${param.uuid}`)
}

export const getIntelligentAlarm = param => {
  return get(`${baseUrl}${url.getIntelligentAlarm}`)
}

export const getFocus = param =>　{
  return get(`${userUrl}${url.getFocus}?username=${param.username}&uuid=${param.uuid}`)
}

export const changeFocus = param => {
  return post(`${userUrl}${url.changeFocus}`,param)
}

export const alarminfo = param => {
  return post(`${domain}${url.alarminfo}`,param)
}