<template>
  <div class="system">
    <WHeader :headerData="headerData">
      <el-select v-model="item" placeholder="请选择设备" slot="header-tool-input" >
        <el-option v-for="item in groupshow" :key="item.value" :label="item.label" :value="item">
          
        </el-option>
      </el-select>
    </WHeader>

    <el-main>
      <router-view  v-on:hidebtn = "hideBtnOnNav"
                    v-on:showbtn = "showBtnNav"
                    v-on:toMaintenance = "showMaintenance"
                    v-on:resetItem = "resetItem"
                    :showtype = "showtype" 
                    :groupdata = "groupdata"  
                    :devicedata = "devicedata"
                    :sel="item"
                    :value6="value6"
                    :allDevice="allDevice"
                    :deviceofgroupdata = "deviceofgroupdata">

      </router-view>
    </el-main> 
  </div>
</template>

<style lang="scss" scoped>
@import "../../style/monitoring.scss";
</style>

<script type="text/javascript">
import WHeader from "../common/WHeader.vue";
import * as api from "../../api/server.js";
import NcMqttClient from "../../mqtt/mqttEchart.js";
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
  delDeviceFromGroups,
} from "../../api/server";
export default {
  data: function() {
    return {
      headerData: [
        { type: "link", name: this.$st("alldevice"), link: "/monitoring/all" },
        {
          type: "link",
          name: this.$st("userandauth"),
          link: "/system/authority"
        }
      ],
      deviceofgroupdata: [],
      devicedata: [],
      groupdata: [],
      group_sel: [],
      value6: "",
      device: [],
      item: { label: "全部", type: "ALL",value:'all' },
      str: "",
      //route view show types
      showtype:"ALL",
      allDevice: [],
      uuidQuery : '',
    };
  },
  computed: {
    groupshow: function() {
      let baseList = [
        { label: "全部", type: "ALL",value:'all' },
        { label: "全部(带分组)", type: "ALL-GROUP",value :'all-group' },
      ];
      let groupList = this.groupdata.map(child => {
        return {
          label: child.group_name,
          value: child._id,
          _id : child._id,
          type: "GROUP"
        };
      });
      let deviceList = this.devicedata.map(child => {
        return {
          label: child.alias,
          value: child.uuid,
          alias: child.alias,
          uuid:child.uuid,
          type: "DEVICE"
        };
      });

      return baseList.concat(groupList, deviceList);
    }
  },
  updated (){
    //获取设备uuid,因为设备信息不是同步传入，所以需要在每个数据变化时，进行设置 
    let newuuidQuery = this.$route.query.uuid;
    if(this.$route.path === '/monitoring/device'){
      this.resetItem('DEVICE', {uuid : newuuidQuery})
    }
  },
  methods: {
    select(res) {
      console.log(res);
    }
  },
  beforeMount(){
    
  },
  mounted() {
    
    this.getGroupData();
    this.getDeviceData();
    this.getDeviceGroupData();
    let uuid = this.$route.query ? this.$route.query.uuid : undefined;
    if(uuid){
      this.chang({uuid:uuid});
      this.uuidQuery = uuid;
    }
    this.$emit('hideleft')
    //刷新或者初始时(主要为分组和全部 ，设备详情在update中获取异步的选项进行设置)
    let type = this.$route.params.type;
    if(typeof type !== 'undefined'){
      this.setItemByType(type,this.$route.query);
    }
  },
  components: {
    WHeader
  },
  methods: {
    /**@desc 隐藏nav按钮 */
    hideBtnOnNav() {
      this.headerData = [];
    },
    Brokennetwork() {

    },
    /**@desc 显示单机监控的 nav 按钮*/
    showBtnNav() {
      this.headerData = [
        { type: "method", name: this.$st("alldevice"),method:"Brokennetwork"},
        {
          type: "link",
          name: this.$st("allparameter"),
          link: "/system/authority"
        }
      ]
    },
    /**@desc 显示维修保养nav btn */
    showMaintenance(){
      this.headerData = [
        { type: "link", name: '刷新数据', link: "/monitoring/maintenance" },
      ]
    },
     /**@desc 请求所有分组数据 */
    getGroupData() {
      getGroup().then(res => {
        console.log(res)
        if (res.data.result === "success") {
          this.groupdata = res.data.value;
        }else{
          this.$ssm(res.data)
        }
      });
    },
    /**@desc 获取设备数据 */
    getDeviceData() {
      getDevice().then(res => {
        if (res.data.result === "success") {
          this.devicedata = res.data.value;
          this.devicedata.forEach((item)=>{ 
              this.chang(item);          
          })
        }
      });
    },
    /**@desc 获取分组设备关系数据 */
    getDeviceGroupData() {
      getDeviceOfGroups().then(res => {
        if (res.data.result === "success") {
          this.deviceofgroupdata = res.data.value;
        }
      });
    },
    sortData(uuid, status, value, time) {
      if (this.allDevice.length == 0) {
        let obj = {
          uuid: uuid,
          data: [{ status: status, value: value, time: time }]
        };
        this.allDevice.push(obj);
      } else {
        let flagid = true;
        this.allDevice.forEach(val => {
          if (val.uuid == uuid) {
            let flag = true;
            flagid = false;
            val.data.forEach(re => {
              if (re.status == status) {
                flag = false;
                re.status = status;
                re.value = value;
                re.time = time;
              }
            });
            if (flag) {
              let o = {
                status: status,
                value: value,
                time: time
              };
              val.data.push(o);
            }
          }
        });
        if(flagid){
          let obj = {
            uuid:uuid,
            data:[{
              status:status,
              value:value,
              time:time
            }]
          }
          this.allDevice.push(obj);
        }
      }
    },
    chang(res) {
      
      this.value6 = res.uuid;  
      let that = this;
      let detailMqtt = new NcMqttClient("WEIHONG", "WEIHONG@123", function(
        _1,
        _2,
        _3,
        _4
      ) {
        let ar = [_1, _2, _3, _4];
        _3 = that.$format(_2,_3);
        that.sortData(_1, _2, _3, _4); 
      });
      detailMqtt.connect([
        {
          uuid: res.uuid,
          enable: true,
          item: "+"
        }
      ]);
    },
    /**@desc 重新设置选项 */
    resetItem(type,res){
      if(type == 'DEVICE'){
        //当已经设置完成后，不进行操作
        if(this.item.uuid){return}
        else{
          //找到对应的下拉选项
          let restitem = this.groupshow.find((child)=>{
            return child.uuid == res.uuid
          })
          //当找到时，设置该选项为当前选项
          if(typeof restitem !== 'undefined'){
            this.item = restitem;
          }
        }
      }else {
        //当为其他类型是直接设置
        this.setItemByType(type,res);
      }
    },
    setItemByType(type,data){
      if(type == 'ALL') {
        this.item = { label: "全部", type: "ALL",value:'all'}
      }else if(type =='ALL-GROUP') {
        this.item = { label: "全部(带分组)", type: "ALL-GROUP",value :'all-group' }
      }else if(type == 'GROUP'){
        this.item = data;
      }
    }
  },
  watch: {
    /** @desc 监控显示方式的改变  */
    item(res) {
      //修改显示方式
      this.showtype = res&&res.type;
      //当res 为空时返回
      if(typeof res  === 'undefined'){ return  }
      //当res 为单个设备时
      if(res.type == "DEVICE"){
        //跳转 设备详情页 query 为 设备uuid
        this.$router.push({path : '/monitoring/device', query : {
          uuid : res.uuid
        }});
      }else if(res.type == "GROUP"){
        //当选择单个分组的时
        //判断是否有变化 如无变化则不进行操作
        if(this.$route.query._id !== res._id){
          //更改 url query为分组数据
          this.$router.push( {path : '/monitoring/all/GROUP', query : {
            _id : res._id,
            label : res.label,
            type : res.type,
            value : res.value
          }})
        }
      }else {
        //判断是否有变化
        if(this.$route.params.type !== res.type){
          //全部 和 全部带分组
          this.$router.push({path : `/monitoring/all/${res.type}`})
        }
      }
    },
    //监控路由变化
    $route(res){
      //当无query时
      if(typeof res.query.uuid == 'undefined' ){
        this.resetItem(res.params.type,res.query);
      }
    },
    allDevice(val) {
     
      val[0].data.forEach(val => {
      });
    }
  }
};
</script>
