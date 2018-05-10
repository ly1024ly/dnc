import axios from 'axios'


export default function del(url,param){
  return axios.delete(url,{data:param})
}