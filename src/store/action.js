import * as types from './mutation-types.js';
export default {
	saveUser({commit,state},obj){
    commit(types.USER_INFO,obj)
  }
}