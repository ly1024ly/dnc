'use strict'
var mqtt = require('mqtt')
const NCMQTTURL = "wss://mqtt.nccloud.weihong.com.cn";
const NCMQTTPORT = Number(8883);
class NcMqttClient {
  constructor(username, password, cb) {
    this.username = username;
    this.password = password;
    this.mqttoptions = {
      port: NCMQTTPORT,
      reconnectPeriod: 1000 * 10,
      username: this.username,
      password: this.password,
      clientId: this.username + new Date().getTime()
    };
    this.mqttclient = null;
    this.msgcb = cb;
    this.errorflag = false;
  }
  connect(focusitems) {
    this.focusitems = focusitems;
    var that = this;
    if(this.mqttclient == null) {
      this.mqttclient = mqtt.connect(NCMQTTURL, this.mqttoptions);
      this.mqttclient.on('connect', function() {
        for(var i = 0; i < that.focusitems.length; i++) {
          if(that.focusitems[i].enable) {
            if(that.focusitems[i].item instanceof Array) {
              for(var j = 0; j < that.focusitems[i].item.length; j++) {
                that.mqttclient.subscribe('device/wh/' + that.focusitems[i].uuid + '/status/' + that.focusitems[i].item[j]);
              }
            } else {
              that.mqttclient.subscribe('device/wh/' + that.focusitems[i].uuid + '/status/' + that.focusitems[i].item);
            }
            for(var a in that.extendItems) {
              that.mqttclient.subscribe('device/wh/' + that.focusitems[i].uuid + '/status/' + a);
            }
            
            if (that.errorflag) {
              that.mqttclient.subscribe('device/wh/' + that.username + '/status/' + that.focusitems[i].uuid + '/WHstatus_Error');
            }
          }
        }
      });
      this.mqttclient.on('message', function(topic, payload) {
        var obj = eval("(" + payload + ")");
        if(typeof(obj.status) !== 'undefined') {
          that.msgcb(obj.uuid, obj.status, obj.value, obj.timeStamp);
        } else if(typeof(obj.conditiontype) !== 'undefined') {
          that.msgcb(obj.uuid, obj.conditiontype, obj.value, obj.timeStamp,obj.msgid);
        }
      });
      this.mqttclient.on('error', this.onError);
      this.mqttclient.on('reconnect', this.onReconnecting);
    }
  }
  setExtendItem(items) {
    this.extendItems = items;
  }
  onFail(msg) {
    console.log(msg);
  }
  onReconnecting() {
    console.log("reconnecting!");
  }
  onError(error) {
    console.log(error);
  }
  
  setErrorFlag(flag) {
    this.errorflag = flag;
  }
};
module.exports = NcMqttClient;