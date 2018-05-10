<template>

  <div class="devices" ref="device_container">
    <template v-if="showtype=='ALL'">
      <div class="group-all">
        <Card :width="cardWidthStyle" class="" v-for="(item, index) in devicedataHasParam" :key="index" :clickCallback="()=>{deviceCardClick(item)}" :cardData="item">
        </Card>
      </div>
    </template>
    <template v-if="showtype=='ALL-GROUP'">
      <div class="group" v-for="(item, index) in groupshow" :key="'group'+index">
        <div class="group-title"> {{ item.group&&item.group.group_name }} </div>
        <div class="group-item">
          <Card :width="cardWidthStyle" class="" v-for="(child, i) in item.devices" :key="'device'+i" :cardData="child" :clickCallback="()=>{deviceCardClick(child)}">
          </Card>
        </div>
      </div>
    </template>
    <template v-if="showtype=='GROUP'">
      <div class="group" v-for="(item, index) in groupItemshow" :key="'group'+index">
        <div class="group-title"> {{ item.group&&item.group.group_name }} </div>
        <div class="group-item">
          <Card :width="cardWidthStyle" class="" v-for="(child, i) in item.devices" :key="'device'+i" :cardData="child" :clickCallback="()=>{deviceCardClick(child)}">
          </Card>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.group-all {
  display: flex;
  flex-wrap: wrap;
}
.group-item {
  display: flex;
  flex-wrap: wrap;
}
.group {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
  border-image: initial;
  border-radius: 10px;
  margin-bottom: 20px;
  background: #ffffff;
}

.group-title {
  height: 40px;
  border-radius: 10px 10px 0 0;
  line-height: 40px;
  text-align: left;
  padding: 0 10px;
  color: #fff;
  background-color: #b3c0d1;
}
.group-item {
  padding: 10px;
}
</style>

<script>
import Card from "../common/Card.vue";
import NcMqttClient from "../../mqtt/mqttEchart.js";
import md5 from "js-md5";
import WHeader from "../common/WHeader.vue";
import cookies from "js-cookie";
import _ from "lodash";
import {
  getGroup,
  getDevice,
  getDeviceOfGroups,
  getDevicesOfGroup,
  newGroup,
  newDevice,
  newDeviceToGroups,
  updateGroup,
  findUserByType,
  delGroup,
  delDevice,
  delDeviceFromGroups
} from "../../api/server";
export default {
  props: [
    "uuid",
    "allDevice",
    "sel",
    "showtype",
    "groupdata",
    "devicedata",
    "deviceofgroupdata"
  ],
  data() {
    return {
      value: "",
      options: [
        {
          label: "群组",
          value: ""
        }
      ],
      group_sel: [],
      //设备参数选择显示
      key_sel: ["WHstatus_programName", "WHstatus_TotalCompletedCount"],
      /** 分组样式初始化参数 */
      perLineNum: 3,
      sortStyle: 0,
      mincardWidth: 355,
      cardWidthStyle: { width: "355px" }
      /** end */
    };
  },
  mounted() {
    this.$emit("hidebtn");
    //隐藏左侧边距
    this.$emit('hideleft');
    //获取排序方式和每行个数
    this.perLineNum = cookies.get("dnc-deviceperline") || 3;
    this.sortStyle = cookies.get("dnc-sortway");
    //监听窗体变化
    this.$nextTick(this.styleInit);
    window.onresize = ()=>{
      this.$nextTick( this.styleInit);
    }
  },
  computed: {
    //每台设备根据选择参数 和 mqtt 推送数据进行显示
    devicedataHasParam: function(type) {
      //设备不为空
      if (this.devicedata.length > 0) {
        let nosort_data = this.devicedata.map(item => {
          let param1 = item.params[0];
          let param2 = item.params[1];
          //mqtt推送数据不为空
          if (this.allDevice.length > 0) {
            //每台设备的所有mqtt数据
            let devicestatus = this.allDevice.find(child => {
              return item.uuid === child.uuid;
            });
            //当该设备的mqtt数据不为空
            if (typeof devicestatus != "undefined") {
              //获取指定参数的状态数据
              let status = devicestatus.data.filter(child => {
                return (
                  child.status === param1 ||
                  child.status === param2 ||
                  child.status === "WHstatus_ExecState"
                );
              });
              item.status = [];
              status.forEach(child => {
                if (child.status === "WHstatus_ExecState") {
                  //将设备的运行状态挂载
                  item.runstate = child;
                  //当设备的运行状态同时为选中状态时需要放到选中状态中
                  if (status.length == 2) {
                    item.status.push(child);
                  }
                } else {
                  //填充选中状态
                  item.status.push(child);
                }
              });
            }
          } else {
            //返回空状态
            item.status = [];
          }
          return item;
        });
        //按照设置规则排序排序
        return _.sortBy(nosort_data, o => {
          return this.sortStyle == 0 ? o.alias : o.uuid;
        });
      } else {
        return [];
      }
    },

    //所有分组 以及 分组内设备
    groupshow: function() {
      return this.groupdata.map(item => {
        let group_device = this.deviceofgroupdata.find((child)=>{
          if(typeof child == 'undefined') {return false}
          else{return  child._id === item._id }
        });
        let child_devices_uuids = group_device ? group_device.uuids : [];
        let child_devices = child_devices_uuids.map( child =>{
          return this.devicedataHasParam.find((device)=>{
            return device.uuid == child;
          })
        })
        child_devices =  _.sortBy(child_devices, o => {
          return this.sortStyle == 0 ? o.alias : o.uuid;
        });
        return {
          group : item,
          devices: child_devices
        }
      })
    },
    //所选分组 以及 该分组内设备
    groupItemshow: function() {
      return this.groupshow.filter(item => {
        if(typeof item.group === 'undefined'){ return false }
        return item.group._id == this.sel._id;
      });
    }
  },
  methods: {
    /**@desc 卡片点击回调 */
    deviceCardClick(item) {
      this.$router.push({
        path: "/monitoring/device",
        query: { uuid: item.uuid }
      });
    },
    /**@desc 样式显示初始化*/
    styleInit() {
      this.$nextTick(function() {
        this.containerWidth = this.$refs.device_container.clientWidth;
        let real_intcolnum, cardWidth;
        let floatcolnum = this.containerWidth / this.mincardWidth;
        let intcolnum = parseInt(floatcolnum);
        let max_intcolnum = intcolnum == 0 ? 1 : intcolnum;
        real_intcolnum =
          this.perLineNum > max_intcolnum ? max_intcolnum : this.perLineNum;
        cardWidth = this.containerWidth / real_intcolnum - 20;
        if (cardWidth < this.mincardWidth) {
          cardWidth = this.mincardWidth;
        }
        this.cardWidthStyle = {
          width: cardWidth + "px"
        };
      });
    }
  },

  components: {
    WHeader,
    Card
  },
  watch: {}
};
</script>

