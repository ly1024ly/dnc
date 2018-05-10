<template>
  <div class="all">
    <div style="text-align:center">
      <div class="deviceData">
        <div class="statebox">
          <div class="state" v-if="deviceStatus" :style="bg"></div>
          <span class="processing">{{state}} {{formatDuring(processTime)}}</span>
        </div>
        <div class="control">
          <div style="text-align:left;margin-bottom:10px;">
            <span class="text">{{$t("message.Data_monitoring")}}:</span>
            <el-button @click="addParm" type="primary" icon="el-icon-search">{{$t('message.parameters')}}</el-button>
          </div>
          <el-table
          :data="checklist"
          height="250"
          :empty-text="nodata"
          :header-row-class-name="tablehead"
          style="width: 100%;height:100%">
          <el-table-column
            prop="alias"
            :label='progressFiles'
            width="180">
          </el-table-column>
          <el-table-column
            prop="value"
            :label='currentvalue'
            width="180">
          </el-table-column>
          <el-table-column
            prop="status"
            :label="variablename">
          </el-table-column>
        </el-table>
        </div>
      </div>
      <div class="today">
        <p style="display:none">{{haha ? haha : ""}}</p>
        <div id="techart" ref="techart"></div>
      </div>
      <div id="timeline" ref="timeline">
        <div class="log">
          <div class="first"></div>
          <div class="second"></div>
          <div class="third"></div>
          <div class="fourth" v-if="item!=null" v-html="timelineStyle">
            {{timelineStyle}}
          </div>
        </div>
        <div class="container_s">
          <div class="first_div">0:00</div>
          <div class="second_div">8:00</div>
          <div class="third_div">16:00</div>
          <div class="fouth_div">24:00</div>
        </div>
      </div>
    </div>
    <div class="warning">
      <div class="intewarning">
        <span class="text">{{$t('message.warMassage')}}:</span>
        <el-button @click="intebtn">{{$t('message.intelligentalarm')}}</el-button>
        <div class="box">
          <el-table
          :data="tableData"
          :cell-style="{height:'30px',padding:' 0'}"
          :header-row-style="{background:'#eee'}"
          style="width: 100%">
            <el-table-column
              type="index"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="file">
        <span class="text">{{$t('message.processingplan')}}:</span>
        <div class="box">
          <el-table
            :data="tableData"
            border
            :cell-style="{height:'30px',padding:'5px 0'}"
            style="width: 100%">
            <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="province"
              label="省份"
              width="120">
            </el-table-column>
            <el-table-column
              prop="city"
              label="市区"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              width="300">
            </el-table-column>
            <el-table-column
              prop="zip"
              label="邮编"
              width="120">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">{{$t('message.check')}}</el-button>
                <el-button type="text" size="small">{{ $t('message.edit') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="fileupload" v-show="loadfile">
      <p class="file"> {{$t('message.processing')}}{{filename ? filename.value : ""}}</p>
      <span style="display:inline-block;vertical-align:top;">{{$t('message.upload')}}</span>
      <el-upload
        class="upload-demo"
        action="http://nccloud.weihong.com.cn/controlapi/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="handlesuccess"
        :on-error="handleerror"
        multiple
        :data="fileupload"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">{{$t('message.Clickontheupload')}}<i class="el-icon-upload el-icon--right"></i></el-button>
        <div slot="tip" class="el-upload__tip">只能上传nc文件</div>
      </el-upload>
      <p>
        <div class="box">
          <i class="iconfont" >&#xe657;</i>
          <span>程序开始</span>
        </div>
        <div class="box">
          <i class="iconfont" >&#xe600;</i>
          <span>程序停止</span>
        </div>
        <div class="box">
          <i class="iconfont" >&#xe68a;</i>
          <span>断点继续</span>
        </div>
        <div class="box">
          <i class="iconfont" >&#xe76a;</i>
          <span>程序暂停</span>
        </div>
      </p>
    </div>
    <div class="pop" v-show="popup" @click.self="hide">
      <div class="box" >
       
        <el-table
          v-show="isShow"
          height="250"
          style="display:inline-block;"
          ref="multipleTable"
          :data="statable"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
            <template slot-scope="scope" >
              <el-checkbox v-model="scope.row.focu"  @change="checkFocu(scope.row,scope.row.focu)" ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            :label="variablename"
            width="220">
            <template slot-scope="scope">{{ scope.row.status }}</template>
          </el-table-column>
          <el-table-column
            prop="alias"
            label="名称"
            width="250">
          </el-table-column>
          <el-table-column
            prop="value"
            label="当前值"
            show-overflow-tooltip>
          </el-table-column>
          
        </el-table>
      </div>
      <div class="box" >
        <div v-show="show1">
          <el-table
            :data="tableData1"
            @cell-click="edit"
            style="width: 100%">
            <el-table-column
              prop="date"
              :label="Statevariables"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              :label="highalarmsetting"
              width="300">
              <template slot-scope="scope"><el-input></el-input></template>
            </el-table-column>
            <el-table-column
              prop="address"
              :label="lowalarmsetting">
              <template slot-scope="scope"><el-input></el-input></template>
            </el-table-column>
          </el-table>
          <div>
            <el-button type="info" plain>{{$t('message.clear')}}</el-button>
            <el-button type="info" plain>{{$t('message.abandon')}}</el-button>
            <el-button type="info" plain>{{$t('message.ok')}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../style/alldevice.scss";
</style>
<style lang="scss">
.headtable{
  background:red;
}
</style>

<script>
import NcMqttClient from '../../mqtt/mqttEchart.js';
import md5 from 'js-md5';
import * as api from '../../api/server.js';
import Cookies from 'js-cookie';

  export default{
    props:["allDevice","value6","focusdata"],
    data(){
      return {
        detailMqtt:null,
        device:null,
        bg:{background:'#fff'},
        fileList: [],
        obj:null,
        nodata:this.$t('message.nodata'),
        popup:false,
        uuid:this.$route.query.uuid,
        statable:null,
        ElpasedTime:0,
        item:null,
        filename:"",
        process:0,
        state:"",
        loadfile:true,
        header:{'Access-Control-Allow-Origin':'*'},
        fileupload:null,
        progressFiles:this.$t('message.progressFiles'),
        processingplan:this.$t('message.processingplan'),
        currentvalue:this.$t('message.currentvalue'),
        variablename:this.$t('message.variablename'),
        Statevariables:this.$t('message.Statevariables'),
        highalarmsetting:this.$t('message.highalarmsetting'),
        lowalarmsetting:this.$t('message.lowalarmsetting'),
        choosed:[],
        today:[],
        windowScreen:window.screen.width,
        whatTb:"",
        width:window.screen.width*0.8 + "px",
        slot_scop:"",
        checklist:[],
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '公司'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '公司'
        }],
        tableData1: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]       
      }
    },
    created(){
      
    },
    beforeMount(){
      //this.initData();
    },
    updated(){
      
    },
    computed:{
      haha(){
        let val = this.obj!=null ? this.obj.value : "";
        let values = this.todayData(val);
        this.$nextTick(function () {
        // DOM 更新了
          this.echartinit(values)
        })
        //this.echartinit(values)
        return values
      },
      deviceStatus(){
        if(this.device!=null){
          
          let result = this.device.find(val => {
            return val.status == "WHstatus_ExecState"
          });
          if(result){
            if(result.value == "Running"){
              this.bg = {background:"green"};
              this.state = this.$t('message.running');
            } else if(result.value == "Idle") {
              this.bg = {background:"#FFD900"};
              this.state = this.$t('message.Idle');
            } else if(result.value == "Estop") {
              this.bg = {background:"red"};
              this.state = this.$t('message.Estop');
            } else {
              this.bg = {background:"gray"};
              this.state = this.$t('message.offline');
            }
          }
          return true
       } else {
          return false
        }
      },
      processTime(){
        if(this.device!=null){
          let process = this.process;
          let result = this.device.find(val => {
            return val.status == "WHstatus_ExecState"
          });
          let re = 0;
          if(result){

          let today = new Date().getTime() + 8 * 60 * 60 * 1000;
          this.process = today - new Date(result.time).getTime() - 8 * 3600 * 1000; 
          }
       } else {
          
        }
        return this.process
      },
      ischecked(index){
        this.checklist.forEach(val => {
          if(val == index) {
            return true
          }
        })
      },
      timelineStyle(){
        var html = "";
        if(this.item){
          let values = this.timeLineMethods(this.item);
          var machine_width  = this.windowScreen*0.8;
          if(values){
            for (var i = 0; i < values.length; i++) {
              if(values[i]._value){
                var sIndex = values[i].time / (24 * 60 * 60) * machine_width;
                var sL = values[i]._timeStamp / (24 * 60 * 60) * machine_width;
                var sColor = this.getcolor(values[i]._value);
                html +=
                  "<div class='time_line_item'  style='background:" +
                  sColor +
                  ";height: 14px;position:absolute;top:0;left:" +
                  sIndex +
                  "px;width:" +
                  sL +
                  "px;'>" +
                  "</div>";
              }
            }
          }
        }
        return html;
      },
      isShow(){
        if(this.whatTb == "control"){
          return true
        } else {
          return false
        }
      },
      show1(){
        if(this.whatTb == "intel"){
          return true
        } else {
          return false
        }
      }
    },

    mounted(){
      //显示按钮
      let level = Cookies.get("dnc-username");
      let uuid = this.$route.query.uuid;
      
      api.getPerDevice(uuid).then(res => {
        if(res.data.result == "success"){
          console.log(res.data.value)
          if(res.data.value.operator == level){
            this.loadfile = true;
          } else {
            this.loadfile = false;
          }
        } else {
          this.$ssm(res.data)
        }
      });
      this.initData(this.allDevice);
      let result = this.allDevice.find(val => {
        return val.uuid == uuid
      });
      
      let process = result ? result.data.find(val => {
        return val.status == "WHstatus_ExecState";
      }) : {time:new Date()};
      let hst = process;
      
      let today = new Date().getTime() + 8 * 60 * 60 * 1000;
      this.process = today - new Date(hst.time).getTime() - 8 * 3600 * 1000; 

      let that = this;
      setInterval(function(){
        that.process = that.process + 1000;
   
      },1000)

      
     
    },
    updated(){
      
    },
    methods: {
      addParm() {
        if(this.device!==null){
          this.popup = true;
          this.whatTb = "control";
        }
      },
     tablehead({row, rowIndex}){
       
       return 'headtable'
     },
      formatDuring(msd) {  
        var time = parseFloat(msd) / 1000;  
        if (null != time && "" != time) {  
            if (time > 60 && time < 60 * 60) {  
                time = parseInt(time / 60.0) + this.$t('message.hour') + parseInt((parseFloat(time / 60.0) -  
                    parseInt(time / 60.0)) * 60) + this.$t('message.s');  
            }  
            else if (time >= 60 * 60 && time < 60 * 60 * 24) {  
                time = parseInt(time / 3600.0) + this.$t('message.hour') + parseInt((parseFloat(time / 3600.0) -  
                    parseInt(time / 3600.0)) * 60) + this.$t('message.minute') +  
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -  
                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + this.$t('message.s');  
            }  
            else {  
                time = parseInt(time) + this.$t('message.s');  
            }  
        }  
        return time;  
      },  
      initData(res){
        
        this.uuid = this.$route.query.uuid;
        let result = res.find(val => {
          return val.uuid == this.uuid
        });
        this.item = result ? result.data.find(val => {
          return val.status == "WHstatus_Timeline"
        }) : null;
        
        let obj;
        for(let i=0;i<res.length;i++){
          if(res[i].uuid == this.uuid){
            for(let j=0;j<res[i].data.length;j++){
              if(res[i].data[j].status == "WHstatus_Efficiency"){
                obj = res[i].data[j]
              }
            }
          }
          
        }
        this.obj = obj
        this.filename = result ? result.data.find(val => {
          return val.status == 'WHstatus_programName';
        }) : "";
        let s;
        if(obj!=null){
          let time = new Date(obj.time);
          let year = new Date().getFullYear();
          let month = new Date().getMonth()+1;
          let day = new Date().getDate();
          let flag = false;
          let date = new Date(year+"-"+month+"-"+day);
          //昨天的就从今天到零点的数据放在离线里
          if(obj.time !== undefined && date <= time){
          //今天还没下线
            flag = false;
          } else {
          //昨天已经下线
            let myday = new Date();
            let hour = myday.getHours() * 60 *60 *1000;
            let mint = myday.getMinutes() * 60 * 1000;
            s = myday.getSeconds() * 1000 + hour + mint;
            flag = true;
          }
          let todayRemain = 0;
  
          obj.value.forEach(val => {
            let o = {};
           
            todayRemain += val.time;
            //昨天
            if(flag) {
              if (val.status == "Running") {
                val.name = this.$t('message.running');
                val.value = 0;
              } else if (val.status == "Estop") {
                val.name = this.$t('message.estop');
                val.value = 0;
              } else if (val.status == "Idle") {
                val.name = this.$t('message.idle');
                val.value = 0;
              } else if (val.status == "Offline") {
                val.name = this.$t('message.offline');
                
                val.value = s;
                }
                todayRemain = 0;
                todayRemain += o.value;
            } else {
              if (val.status == "Running") {
                val.name = this.$t('message.running');
                val.value = val.time;
              } else if (val.status == "Estop") {
                val.name = this.$t('message.estop');
                val.value = val.time;
              } else if (val.status == "Idle") {
                val.name = this.$t('message.idle');
                val.value = val.time;
              } else if (val.status == "Offline") {
                val.name = this.$t('message.offline');
                val.value = val.time;
              }
            }
           
            this.today.push(val)
          })
          if (todayRemain > 0) {
            let val = 24 * 3600 * 1000 - todayRemain;
            let o = {
              name: this.$t('message.remaining_time'),
              value: val
            };
            
            this.today.push(o);
          }
        }      
        //******************************************* */
        this.$emit('showbtn');
        let timeline = document.getElementById("timeline");
        timeline.style.width = this.windowScreen*0.8 +"px";
        let username = Cookies.get("dnc-username");
        let that = this;
        this.uuid = this.$route.query.uuid;
        this.fileupload = {uuid:this.$route.query.uuid};
      
        window.onresize = () => {
          that.windowScreen = document.body.clientWidth;
          that.timelineStyle
        }
        this.ElpasedTime = result ? result.data.find(val => {
          if(val.status == "WHstatus_ElpasedTime"){
            return val.value
          }
        }) : undefined

        let arr = [];
        api.getFocus({username:username,uuid:this.uuid})
          .then(res => {
            if(res.data.result == "success"&&result){
              result.data.forEach(n =>{
                res.data.params.forEach(m => {
                  let sta = n.status;
                  let alias = this.$t(`message.${sta}`);
                  if(n.status == m.params){
                    n.alias = alias;
                    n.focu = m.value==1 ? true : false;
                    
                    let sta = n.status;
                    arr.push(n)
                  }
                  
                })
              })
              that.device = arr;
             
            }
          })
        this.echartinit(this.haha)
      },
      handlesuccess(response, file, fileList){
        console.log(response, file, fileList)
        let that = this;
        if(response.result =="success"){
          api.upload({uuid:this.uuid,filename:file.name}).then(res => {
            if(res.result == "success"){
              this.$message({
                showClose: true,
                message: this.$t('message.success'),
                type: 'success'
              });
            }else{
              that.$ssm(res.data) 
            }
          })   
        } 
      },
      handleerror(file){
        console.log(file)
        this.$message.error('错了哦，这是一条错误消息');
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      echartinit(res){
      
        let myechart = this.$echarts.init(this.$refs.techart);
        let legend = [];
        for(var i=0;i<res.length;i++){
          legend.push(res[i].name)
        }
        let option = {
          title : {
          text: this.$t('message.today_working_hour_distribution'),
        
          x:'right'
          },
          
          legend: {
              orient: 'vertical',
              left: 'left',
              data: legend,
              formatter:function(name){
                  let sum = 0;
                  let j=0;
                  while(j<res.length){
                      sum = sum + res[j].value;
                      j++
                  }
                  for(var i=0;i<res.length;i++){
                      if(name == res[i].name){
                        return res[i].name + " "+ (res[i].value/sum*100).toFixed(2) + "%";
                      }
                    }
              }
          },
          color:["red","#FFD900","green","gray","#ddf"],
          series : [
              {
                  name: '访问来源',
                  type: 'pie',
                  radius : '55%',
                  center: ['60%', '60%'],
                  data:res,
                  itemStyle: {
                      emphasis: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  }
              }
          ]
        }
        myechart.setOption(option)
      },
      todayData(res){
        let s;
        let arr = [];
        if(this.obj!=null){
          let time = new Date(this.obj.time);
          let year = new Date().getFullYear();
          let month = new Date().getMonth()+1;
          let day = new Date().getDate();
          let flag = false;
          let date = new Date(year+"-"+month+"-"+day);
          //昨天的就从今天到零点的数据放在离线里
          if(this.obj.time !== undefined && date <= time){
          //今天还没下线
            flag = false;
          } else {
          //昨天已经下线
            let myday = new Date();
            let hour = myday.getHours() * 60 *60 *1000;
            let mint = myday.getMinutes() * 60 * 1000;
            s = myday.getSeconds() * 1000 + hour + mint;
            flag = true;
          }
          let todayRemain = 0;
  
          res.forEach(val => {
            let o = {};
           
            todayRemain += val.time;
            //昨天
            if(flag) {
              if (val.status == "Running") {
                val.name = this.$t('message.running');
                val.value = 0;
              } else if (val.status == "Estop") {
                val.name = this.$t('message.estop');
                val.value = 0;
              } else if (val.status == "Idle") {
                val.name = this.$t('message.idle');
                val.value = 0;
              } else if (val.status == "Offline") {
                val.name = this.$t('message.offline');
                
                val.value = s;
                }
                todayRemain = 0;
                todayRemain += o.value;
            } else {
              if (val.status == "Running") {
                val.name = this.$t('message.running');
                val.value = val.time;
              } else if (val.status == "Estop") {
                val.name = this.$t('message.estop');
                val.value = val.time;
              } else if (val.status == "Idle") {
                val.name = this.$t('message.idle');
                val.value = val.time;
              } else if (val.status == "Offline") {
                val.name = this.$t('message.offline');
                val.value = val.time;
              }
            }
            arr.push(val)
          })
          if (todayRemain > 0) {
            let val = 24 * 3600 * 1000 - todayRemain;
            let o = {
              name: this.$t('message.remaining_time'),
              value: val
            };
            
            arr.push(o);
          }
        }   
        return arr   
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      getcolor(execstatus) {
        var color = "gray";
        if (execstatus == "Running") {
          color = "#00BA00";
        } else if (execstatus == "Idle") {
          color = "#FFD900";
        } else if (execstatus == "Estop") {
          color = "#FF2609";
        } 
        return color;
      },
      timeLineMethods(g_timeline) {
        var newObj = {
          value: []
        };
        var compare = function(obj1, Obj2) {
          var val1 = obj1._timeStamp;
          var val2 = Obj2._timeStamp;
          if (val1 < val2) {
            return -1;
          } else if (val1 > val2) {
            return 1;
          } else {
            return 0;
          }
        };
        //把当前的时间戳压进去,
        var current = new Date().getTime() + 8 * 60 * 60 * 1000;
        //然后转化为东八区，当前的时间;
        var currents = new Date(current).toISOString();
        currents = currents.substring(0, 19);
        currents = currents.replace(/T/," ");
        currents += ".000000";
        var b = {
          _timeStamp: currents,
          _value: ""
        };
        g_timeline.value.push(b);
        var sortObj = g_timeline.value.sort(compare);
        //判断是否在同一天
        var data1 = g_timeline.value[0]._timeStamp.substring(0, 10);
        var data2 = g_timeline.value[
          g_timeline.value.length - 1
        ]._timeStamp.substring(0, 10);
        //让不在一天以内的时间，统一到在一天以内，删除那些不在一天以内的元素；
        var time_diff1, time_diff2;
        //把数组的时间差放进数组对象里；
        for (var i = 0; i < g_timeline.value.length - 1; i++) {
          var _1 = g_timeline.value[i];
          var _2 = g_timeline.value[i + 1];
          time_diff1 = new Date(_1._timeStamp).getTime() / 1000;
          //获取数组的第一个时间的毫秒数；
          var obj0 = new Date(g_timeline.value[0]._timeStamp).getTime() / 1000;
          time_diff2 = new Date(_2._timeStamp).getTime() / 1000;
          var obj2 = {
            _timeStamp: time_diff2 - time_diff1,
            _value: _1._value,
            time: time_diff1 - obj0
          };
          newObj.value.push(obj2);
        }
        //动态生成=============================
        return newObj.value;
        newObj.value = [];
      },
      edit(val){
      },
      intebtn(){
        this.popup = true;
        this.whatTb = "intel"
      },
      indexMethod(index) {
        return index * 2;
      },
      checkFocu(obj,val){
        let result = {
          focu:val,
          alias:obj.alias,
          status:obj.status,
          time:obj.time,
          value:obj.value
        }
        let arr = [];
        let param = [];
        this.device.filter(i => {
          if(i.status == result.status) {
            arr.push(result)
            let o = {
              params:i.status,
              value:val ? 1 : 0
            }
            param.push(o)
          } else {
            let o = {
              params:i.status,
              value:i.focu ? 1 : 0
            }
            param.push(o)
            arr.push(i)
          }

        });
        let u = {
          username:Cookies.get("dnc-username"),
          uuid:this.uuid,
          params:param
        };
        api.changeFocus(u)
          .then(res => {
            if(res.data.result == "success"){
              this.device = arr;
            }
          })
        
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
        let arr = [];
        let success = this.device;
       
          success.forEach(res => {
            let o = {
              params:res.status,
              value:val.length>0 ? 1 : 0
            }
            arr.push(o)
            res.focu = val.length>0 ? true : false
          });
          let u = {
            username:Cookies.get("dnc-username"),
            uuid:this.uuid,
            params:arr
          };
          api.changeFocus(u)
            .then(res => {
              if(res.data.result == "success"){
               this.device = success
              }
            })
        this.checklist = val;
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      hide(){
        this.popup = false;
      },
      handleCheckedCitiesChange(){

      }
    },
    watch:{
      "$route"(res){
        this.uuid = res.query.uuid;
        let level = Cookies.get("dnc-name");
      
        api.getPerDevice(this.uuid).then(res => {
          if(res.data.result == "success"){
            console.log(res.data.value)
            if(res.data.value.operator == level){
              this.loadfile = true;
            } else {
              this.loadfile = false;
            }
          }
        });
    
        this.initData(this.allDevice)
      },
      device(val){
        if(val!==null&&val!==undefined){
          this.statable = val;
        }
        this.checklist = [];
        val.forEach(val => {
          if(val.focu){

            this.checklist.push(val)
          }
        })
      },
      
      allDevice(res){
        let that = this;
        setTimeout(function(){
          that.initData(res);
        },1000

        )
        console.log("iiiiiiiiiiiiiiiiiiiiiii")
      },
      statable(val){
      },
      checklist(val){
      }
    }
  }
</script>

