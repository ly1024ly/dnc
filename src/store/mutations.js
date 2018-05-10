import {
  USER_INFO,
  FOCUS_MACHINE,
  MQTT,
  CHANGEALIAS
} from './mutation-types.js'
import NcMqttClient from '../mqtt/mqttEchart.js';
import md5 from 'js-md5'

export default {
	[USER_INFO](state,user){
    state.user = user;
  },
  [FOCUS_MACHINE](state,machine){  
    state.focMachine = machine;
  },
  [MQTT](state,arr){
    let pass = md5("ly1024");
    let ar = [];
    var productionMqtt = new NcMqttClient("ly1024", pass, function(_1, _2, _3, _4) {
      ar = [_1, _2, _3, _4];
      console.log("mqtt",ar)
      state.mqtt = ar;
    });
        
    productionMqtt.connect(arr)
  },
  [CHANGEALIAS](state,arr){
    state.aliasMqtt = arr;
  }
}