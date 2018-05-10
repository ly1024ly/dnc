import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)
const state = {
  num:'',
  user:null,
  focMachine:null,
  mqtt:null,
  progress:'',
  aliasMqtt:[],
  locale:'',
} 

console.log('555')

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
})