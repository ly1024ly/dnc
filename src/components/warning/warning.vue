<template>
  <div class="system">
    <WHeader :headerData="headerData">
      <el-select v-model="groupinfo"  slot="header-tool-input" @change = "getName(groupinfo)">
        <el-option v-for="(item,index) in groupshow" :key="index" :label="item.label" :value="item">
          
        </el-option>
      </el-select>
    </WHeader>
    <el-main>
      <router-view 
        :showtype="showtype"
        :groupdata ="groupdata"  
        :devicedata = "devicedata"
        :deviceofgroupdata = "deviceofgroupdata"
        :groupinfo = "groupinfo"
        :deviceAlarm = "deviceAlarm"
      >
        
      </router-view>
    </el-main>
   </div>
</template>
<script type="text/javascript">
import WHeader from "../common/WHeader.vue";
import * as api from "../../api/server.js";
export default {
  components: {
    WHeader
  },
  data: function() {
    return {
      headerData: [
      ],
      devicedata: [],
      groupdata: [],
      groupinfo: { label: this.$t("message.all"), type: "ALL",value:'all' },
      showtype:"ALL",
      deviceofgroupdata:[],
      deviceUuid:[],
      deviceAlarm:[],
      
    }
  },
  created(){
    this.$emit("success","fail");
  },
  computed: {
    groupshow: function() {
      let baseList = [
        { label: this.$t("message.all"), type: "ALL",value:'all' },
        { label: this.$t("message.all_group"), type: "ALL-GROUP",value :'all-group' },
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
      let groupArray = this.changeData(this.deviceofgroupdata,groupList,deviceList,baseList)
      return groupArray
      //return baseList.concat(groupList, deviceList)
    }
  },
  mounted() {
    this.getGroupData();
    this.getDeviceData();
    this.getDeviceGroupData();   
  },
  methods:{
     /**@desc 请求所有分组数据 */
    getGroupData() {
      api.getGroup().then(res => {
        if (res.data.result === "success") {
          console.log('11')
          console.log(res.data.value)
          this.groupdata = res.data.value;
        }else{
          this.$ssm(res.data)
        }
      });
    },
    /**@desc 获取设备数据 */
    getDeviceData() {
      let _this = this
      api.getDevice().then(res => {
        if (res.data.result === "success") {
          console.log('22')
          console.log(res.data.value)
          this.devicedata = res.data.value;
          res.data.value.forEach(function(val){
            if(val){
              let data = {
                'uuid':val.uuid,
                'alias':val.alias,
              }
              _this.deviceUuid.push(data)
            }
          })
          _this.getAlarmInfo(_this.deviceUuid)
        }
      });
    },
    /**@desc 获取分组设备关系数据 */
    getDeviceGroupData() {
      api.getDeviceOfGroups().then(res => {
        console.log('33')
        console.log(res.data.value)
        if (res.data.result === "success") {
          this.deviceofgroupdata = res.data.value;
        }
      });
    },
    getName(val){
      console.log(val)
      this.showtype = val.type;
    },
    getAlarmInfo(arr){
        let serviceArr = []
        arr.forEach(function(val){
          serviceArr.push(val.uuid)
        })
        let data = {
          'uuid':serviceArr
        }
        let _this = this
        api.alarminfo(data).then(function(res){
          if(res.data.result==='success'){
             _this.$emit("success","success");
             let dataObj = {
              'arr':[],
              'uuid':'',
              'alias':'',
             }
             let arrValue = []
             let len = res.data.value.length
             let arrlen = arr.length
             for(let i = 0 ; i < arrlen; i++){
                for(let j = 0 ; j <len  ; j++){
                  if(res.data.value[j].uuid===arr[i].uuid){
                    arrValue.push(res.data.value[j])
                  }
                }
                dataObj.uuid = arr[i].uuid
                dataObj.alias = arr[i].alias
                dataObj.arr = arrValue
                _this.deviceAlarm.push(dataObj)
                dataObj = {
                  'arr':[],
                  'uuid':'',
                  'alias':'',
                }
                arrValue = []
             }
             console.log('8888')
             console.log(res.data)
         }else{
          _this.$ssm(res.data)
        }
        })
      },
      changeData(relationArr,groupArr,deviceArr,resultArr){
          let relationArrLen = relationArr.length
          let groupArrLen = groupArr.length
          let deviceArrLen = deviceArr.length
          let usedRelation = []
          let deviceRelation = []
          for(let i=0;i<relationArrLen;i++){
            for(let j=0;j<groupArrLen;j++){
              if(relationArr[i]._id == groupArr[j]._id){
                resultArr.push(groupArr[j])
                usedRelation.push(i)
                let uuidLen = relationArr[i].uuids.length
                for(let m=0;m<uuidLen;m++){
                  for(let k=0;k<deviceArrLen;k++){
                    if(relationArr[i].uuids[m]==deviceArr[k].uuid){
                      resultArr.push(deviceArr[k])
                      deviceRelation.push(deviceArr[k])
                    }
                  }
                }
              }
            } 
          }
          for(let i=0;i<groupArrLen;i++){
            let isUsed = 0
            for(let j=0;j<usedRelation.length;j++){
              if(groupArr[i]._id==relationArr[usedRelation[j]]._id){
                isUsed=1
              }
            }
            if(isUsed==0){
              resultArr.push(groupArr[i])
            }
          }
          let weiArr = { label: this.$t('message.unclassified'), value: "", _id: "", type: "GROUP"}
          resultArr.push(weiArr)
          for(let i=0;i<deviceArrLen;i++){
            let isUsed = 0
            for(let j=0;j<deviceRelation.length;j++){
              if(deviceArr[i].uuid==deviceRelation[j].uuid){
                isUsed=1
              }
            }
            if(isUsed==0){
              resultArr.push(deviceArr[i])
            }
          }
        return  resultArr
      }

  }

}
</script>