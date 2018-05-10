import axios from 'axios'
axios.defaults.withCredentials = true

export default function post(url,param){
  return axios.post(url,param)
}