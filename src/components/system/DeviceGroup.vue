<template>
  <div class="device-group">

    <div class="device-group-toolbar">

      <el-button v-authiden type="primary" size="mini" @click="openEditGroup('new',{_id : 0})">{{$t('message.addgroup')}}</el-button>

      <el-button v-authiden type="primary" size="mini" @click="openNewDevice('clear', {})">{{$t('message.adddevice') }}</el-button>

      <el-button type="primary" size="mini" @click="getAllDeviceStatus('all')">{{$t('message.examconnect') }}</el-button>

    </div>

    <div class="device-group-content">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="device-group-tree">
            <el-tree :data="treedata" node-key="_id" @node-click="handleNodeClick" :default-expand-all="true" :expand-on-click-node="true" :highlight-current="true" :render-content="renderContent">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="20">
          <div class="divice-group-table">
            <el-table :data="tabledata" stripe ref="devicesTable" row-class-name="dragable-row" height="57vh" :cell-style="{height : '30px',padding : '10px 0'}" border style="width: 100%">
              <el-table-column fixed="left" :label="$st('alias')" width="150">
                <template slot-scope="scope">
                  <div :draggable="$auth()" :style="{ cursor:  $auth() ? 'move': 'auto'} " @dragstart="(event)=>{dragDeviceToGroup(scope.row.uuid,scope.row.alias,event)}" @dragend="dragEndDeviceToGroup">
                    {{ scope.row.alias }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="uuid" :label="$st('uuid')" width="180">
              </el-table-column>
              <el-table-column prop="params" :formatter=" row => paramsFormater(row, 0)" :label="$st('param')">
              </el-table-column>
              <el-table-column prop="params" :formatter="row => paramsFormater(row, 1)" :label="$st('param')">
              </el-table-column>
              <el-table-column prop="devstatus.status" :formatter="statusFormater" :label="$st('connectstatus')">
              </el-table-column>
              <el-table-column prop="describe" width="200" :label="$st('description')">
              </el-table-column>
              <el-table-column prop="operator" :formatter="row => operatorFormater(row)" :label="$st('operator')">
              </el-table-column>
              <el-table-column fixed="right" :label="$st('operate')" width="150">
                <template slot-scope="scope">
                  <template v-if="scope.row.uuid">
                    <el-button v-authiden v-if="group_sel.id != 0" size="mini" type="text" 
                      @click="deleteConfirm(()=>{ removeDeviceFromGroupClick(scope.row.uuid) }, 
                                                  $st('confirm_outgroup',{res:scope.row.alias}))">
                      {{ $st('outgroup') }}
                    </el-button>
                    <el-button size="mini" type="text" @click="openNewDevice('edit',scope.row)">
                      {{ $st('edit') }}
                    </el-button>
                    <el-button v-authiden size="mini" type="text" @click="deleteConfirm(()=>{deleteDeviceClick(scope.row.uuid)})">
                      {{ $st('delete') }}
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button v-authiden size="mini" type="text" @click="openDeviceGroup">
                      {{ $st('joingroup') }}
                    </el-button>
                  </template>
                </template>

              </el-table-column>
            </el-table>
          </div>

          <div class="device-group-desc">
            <p>{{$st('group')}} : {{ group_sel.group_name }}</p>
            <p>{{$st('description')}} : {{ group_sel.describe }}</p>
            <p>{{$st('number')}} : {{ devicedata_sel.length }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- add group dialog  -->
    <el-dialog :title="this.group_edit_type === 'new'? $st('addgroup') : $t('message.editgroup')" :visible.sync="editgroupdialog" width="50%">
      <el-form :model="editgroupdata" ref="editgroupdata" :rules="grouprule" label-width="80px">
        <el-form-item :label="$t('message.groupname')" prop="group_name" required>
          <el-input v-model="editgroupdata.group_name" auto-complete="off">

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('message.description')" prop="description" required>
          <el-input v-model="editgroupdata.description" placeholder=""></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="closeNewGroup">{{ $t('message.abandon') }}</el-button>
        <el-button type="primary" @click="editgroupdialogOkBtnClick('editgroupdata')">{{ $t('message.ok') }}</el-button>
      </span>
    </el-dialog>
    <!-- add device dialog  -->
    <el-dialog :title="$t('message.editdevice')" :visible.sync="editdevicedialog" width="30%">
      <el-form :model="editdevicedata" ref="editdevicedata" :rules="devicerule" label-width="80px">
        <el-form-item :label="$st('uuid')" prop="uuid">
          <el-input v-model="editdevicedata.uuid" v-authread></el-input>
        </el-form-item>
        <el-form-item :label="$st('ipaddress')" prop="ip">
          <el-input v-model="editdevicedata.ip" v-authread></el-input>
        </el-form-item>
        <el-form-item :label="$st('devicename')" prop="alias">
          <el-input v-model="editdevicedata.alias" v-authread></el-input>
        </el-form-item>
        <el-form-item label="面板参数1" v-show="showParamSet">
          <el-select v-model="param1" placeholder="">
            <el-option v-for="item in paramoptions" :key="item" :label="$st(item)" :value="item">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="面板参数2" v-show="showParamSet">
          <el-select v-model="param2" placeholder="">
            <el-option v-for="item in paramoptions" :key="item" :label="$st(item)" :value="item">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item v-for="(item, index) in devicegroup" :key=" 'group' + index" :label="$st('group')">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-input :disabled="true" :value="item&&item.group_name">
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click="delGroupForDevice()" v-authiden>{{$st('deletegroup')}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$st('devicegroup')" v-authiden>
          <el-row :gutter="20">
            <el-col :span="16">
              <el-select v-model="devicegroup_new" placeholder="" value-key="group_name">
                <el-option v-for="(item,index) in getOtherGrop()" :key="index" :label="item.group_name" :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button @click="addGroupForDevice()">{{$st('addgroup')}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$st('description')" prop="describe">
          <el-input v-model="editdevicedata.describe" v-authread></el-input>
        </el-form-item>
        <el-form-item :label="$st('operator')">
          <el-select v-model="editdevicedata.operator" placeholder="" v-authread>
            <el-option v-authiden v-for="(item,index) in operatorList" :key="index" :label="item.name" :value="item.username">
            </el-option>
          </el-select>

        </el-form-item>
        <p>连接{{ editdevicedata.status ? $st('normal') : $st('abnormal') }}</p>
      </el-form>

      <span slot="footer">
        <el-button @click="()=>{examDeviceStatus(editdevicedata.uuid)}">{{ $st('exam') }} </el-button>
        <el-button type="primary" @click="newDevice('editdevicedata')">{{ $st('ok') }}</el-button>
        <el-button @click="editdevicedialog = false">{{ $st('abandon') }}</el-button>
      </span>
    </el-dialog>
    <!-- edit group 加群 -->
    <el-dialog :title="$st('groupdevice')" :visible.sync="groupdevicedialog" width="30%">
      <el-table :data="devicedata" ref="addGroupTable" @selection-change="handleSelectionChange">
        <el-table-column v-for="(col,index) in groupdevicetabledata" :prop="col.id" :key="col.id+index" :type="col.type||''" :label="col.label" :width="col.width">
        </el-table-column>
      </el-table>

      <span slot="footer">
        <el-button @click="defaultSel"> {{$st('selected_by_default')}} </el-button>
        <el-button @click="()=>{this.groupdevicedialog = false}"> {{$st('abandon')}} </el-button>
        <el-button @click="addGroupOKBtnClick" type=""> {{ $st('ok') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import {
  getGroup,
  getDevice,
  getDeviceOfGroups,
  getDevicesOfGroup,
  newGroup,
  newDevice,
  newDeviceToGroups,
  updateGroup,
  getDeviceStatus,
  findUserByType,
  delGroup,
  delDevice,
  delDeviceFromGroups,
  getParm,
  editHomeParams
} from "../../api/server";
import _ from "lodash";
import cookies from "js-cookie";
export default {
  data() {
    const groupdevicetabledata = [
      {
        id: "alias",
        label: this.$st(" alias"),
        width: 100
      },
      {
        id: "uuid",
        label: this.$st("uuid")
      },
      {
        id: "sel",
        label: "",
        width: 50,
        type: "selection"
      }
    ];

    //分组姓名rule
    var validateGroupName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$st('group_name_not_null')));
      }else{
        callback()
      }
    };
    var validatePass = (rule, value, callback) => {
      if (!value) {
       return callback(new Error(this.$st('group_desc_not_null')));
      }else{
        callback()
      }
    };
    var valicateUuid = (rule, value, callback) => {
      if (value === "") {
       return callback(new Error(this.$st('device_uuid_not_null')));
      }
      callback();
    };
    var valicateIp = (rule, value, callback) => {
      if (value === "") {
       return callback(new Error(this.$st('device_ip_not_null')));
      }
      callback();
    };
    var validevicename = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error(this.$st('device_name_not_null')));
      }
      callback();
    };
    var validescr = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error(this.$st('device_desc_not_null')));
      }
      callback();
    };

    return {
      group_sel: {
        id: 0,
        group_name: this.$st("all"),
        describe: this.$st("all_equipment")
      },
      groupdata: [],
      group_edit_id: "",
      group_edit_type: "",
      devicedata: [],
      devicedata_sel: [],
      deviceofgroupdata: [],
      groupdevicetabledata,
      groupdevicedata: [],
      deviceStatusData: [],
      editgroupdialog: false,
      editdevicedialog: false,
      groupdevicedialog: false,
      devicegroupsel: [],
      dragHoverAreaId: "",
      operatorList: [],
      /**sort style */
      sortStyle : 0,
      editgroupdata: {
        group_name: "",
        description: ""
      },
      devicegroup_new: {
        group_name: "",
        uuid: ""
      },
      devicegroup: [],
      editdevicedata: {
        uuid: "",
        ip: "",
        alias: "",
        describe: "",
        operator: ""
      },
      devicegroupSelected: [],
      //设备状态参数列表
      paramoptions: [],
      //设置参数是否显示
      showParamSet: false,
      //选择参数1
      param1: "WHstatus_programName",
      param2: "WHstatus_TotalCompletedCount",
      param1Default: "WHstatus_programName",
      param2Default: "WHstatus_TotalCompletedCount",
      //RULES
      //group for rule
      grouprule: {
        group_name: [{ validator: validateGroupName, trigger: "blur" }],
        description: [{ validator: validatePass, trigger: "blur" }]
      },
      devicerule: {
        uuid: [{ validator: valicateUuid, trigger: "blur" }],
        ip: [{ validator: valicateIp, trigger: "blur" }],
        alias: [{ validator: validevicename, trigger: "blur" }],
        describe: [{ validator: validescr, trigger: "blur" }]
      }
    };
  },
  created() {
    this.getGroupData();
    this.getDeviceGroupData();
    this.getDeviceData();
    this.findOperater();
    this.getAllDeviceStatus("all");
  },
  mounted(){
    this.sortStyle = cookies.get("dnc-sortway");
  },
  computed: {
    treedata() {
      let data = this.groupdata;
      let devicedata = this.devicedata;
      let nongroup = {
        id: 2,
        group_name: this.$st("unclassified"),
        describe: this.$st("unclassified")
      };
      //let nongroupDevice = _.dropWhile(devicedata, (child)=>{ return child.groups.length > 0});
      let dataHadNoNGroup = _.concat(data, nongroup);
      return [
        {
          id: 0,
          group_name: this.$st("all"),
          describe: this.$st("all_equipment"),
          children: dataHadNoNGroup
        }
      ];
    },
    tabledata() {
      //连接状态改变
      let deviceHadLinkStatus = this.devicedata_sel.map(child => {
        if (this.deviceStatusData.length > 0) {
          let devstatus = this.deviceStatusData.find(item => {
            return item.uuid == child.uuid;
          });
          child.devstatus = devstatus;
        } else {
          child.devstatus = [];
        }
        return child;
      });
      //排序
      deviceHadLinkStatus = _.sortBy(deviceHadLinkStatus, (o)=>{
        return this.sortStyle == 0 ? o.alias : o.uuid ;
      })
      //非全部或未分组情况下
      if (this.group_sel.id != 0 && this.group_sel.id != 2) {
        let contactTab = [];
        return contactTab.concat(deviceHadLinkStatus, {});
      } else {
        return deviceHadLinkStatus;
      }
    }
  },
  methods: {
    /**@desc 获取加群增加和删除的设备 */
    getGroupToggleArray() {
      //已经在分组内部的设备
      let old_data = this.devicedata_sel;
      //已经选择的设备（包含新的 和 旧的）
      let new_data = this.devicegroupsel;

      let sub_data = [];
      //将旧的数据中没有变化的和删除的标记，同时删除新的数组中旧的数据
      for (let i = 0; i < old_data.length; i++) {
        let is_exist = false;
        for (let j = 0; j < new_data.length; j++) {
          if (old_data[i].uuid == new_data[j].uuid) {
            is_exist = true;
            old_data[i].opt_type = "NOC";
            new_data.splice(j, 1);
            break;
          }
        }
        if (is_exist == false) {
          old_data[i].opt_type = "DEL";
        }
      }
      //将处理过的新的数据全部标志为 新增，并将两部分数据结合
      return sub_data.concat(
        old_data,
        new_data.map(child => {
          child.opt_type = "NEW";
          return child;
        })
      );
    },
    /**@desc 当表格内数据选择修改时 */
    handleSelectionChange(val) {
      this.devicegroupsel = val;
    },
    /**
    @method
    @description 清空或者填充新建设备表单
    */
    clearDeviceForm(type, data) {
      //类型为清空，即新建设备
      if (type == "clear") {
        //隐藏参数设置
        this.showParamSet = false;
        //新建设备室设置默认参数
        this.param1 = this.param1Default;
        this.param2 = this.param2Default;
        this.editdevicedata = {
          uuid: "",
          ip: "",
          alias: "",
          describe: "",
          operator: "",
          status: ""
        };
        this.devicegroup = [];
      } else {
        //编辑设备时
        //获取参数列表

        this.getDeviceParamList(data.uuid);
        //显示设置参数
        this.showParamSet = true;
        //填充表单
        this.param1 = data.params[0];
        this.param2 = data.params[1];
        //其他类型（填充）
        this.editdevicedata = {
          uuid: data.uuid,
          ip: data.ip,
          alias: data.alias,
          describe: data.describe,
          operator: data.operator,
          status: data.devstatus.status
        };
        //设置参数显示
        // TODO
        this.devicegroup = data.groups.map(item => {
          return this.groupdata.find(child => {
            return child._id === item;
          });
        });
      }
    },
    //请求接口刷新分组显示
    refreshGroupData() {
      this.getGroupData();
      this.getDeviceGroupData();
      //关闭对话框
      this.editgroupdialog = false;
    },
    //根据 当前选择的分组 进行刷新表格
    refreshDeviceTable() {
      this.getDeviceData();
      this.findDevicesByGroup(this.group_sel);
    },
    /**@desc 获取设备支持的所有参数 */
    getDeviceParamList(uuid) {
      getParm({ uuid }).then(res => {
        if (res.data.result == "success") {
          this.paramoptions = res.data.params;
        }else{
          this.$ssm(res.data)
        }
      });
    },

    //自定义树组件渲染
    renderContent(h, { node, data, store }) {
      let nodeStyle = {
        display: "flex",
        width: "80%",
        padding: "0 10px",
        justifyContent: "space-between"
      };
      let dragHoverStyle = {
        display: "flex",
        width: "80%",
        padding: "5px",
        justifyContent: "space-between",
        border: "1px #000 dashed"
      };
      return (
        <span
          style={
            this.dragHoverAreaId === data._id && data.id !== 0
              ? dragHoverStyle
              : nodeStyle
          }
          onDragleave={() => {
            this.dragHoverAreaId = "";
          }}
          onDragenter={event => this.dragHover(data._id, event)}
          onDrop={event => this.dropToGroup(data._id, event)}
        >
          <span> {data.group_name} </span>
          {data.id == 0 || data.id == 2 || !this.$auth("admin") ? (
            ""
          ) : (
            <span>
              <el-button
                size="mini"
                type="text"
                on-click={() => this.openEditGroup("update", data)}
              >
                {this.$st("edit")}
              </el-button>
              <el-button
                size="mini"
                type="text"
                on-click={() =>this.deleteConfirm(()=>{ this.delGroup(data._id, data.group_name)})}
              >
                {this.$st("delete")}
              </el-button>
            </span>
          )}
        </span>
      );
    },
    /**@desc 删除确认 */
    deleteConfirm(callback, content) {
      this.$confirm(content||this.$st('confirm_delete'), this.$st('alert_title'), {
          confirmButtonText: this.$st('ok'),
          cancelButtonText: this.$st('cancel'),
          type: 'warning'
        }).then(() => {
          callback()
        }).catch(() => {
        });
    },

    
  
    /**@desc 请求所有分组数据 */
    getGroupData() {
      getGroup().then(res => {
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
          if (this.group_sel.id === 0) {
            this.devicedata_sel = this.devicedata;
          }
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
    /**@desc 新建分组 */
    newGroup() {
      newGroup({
        group_name: this.editgroupdata.group_name,
        describe: this.editgroupdata.description || ""
      }).then(res => {
        if (res.data.result == "success") {
          this.refreshGroupData();
        }else{
          this.$ssm(res.data)
        }
      });
    },
    /**@desc 获取设备状态 */
    getAllDeviceStatus(param) {
      getDeviceStatus(param).then(res => {
        if (res.data.result === "success") {
          this.deviceStatusData = res.data.value;
          this.$message.success(this.$st("refresh_status_succeeded"));
        }
      });
    },
    /**@desc 编辑分组信息 */
    editGroup(_id) {
      updateGroup({
        _id,
        group_name: this.editgroupdata.group_name,
        describe: this.editgroupdata.description
      }).then(res => {
        if (res.data.result == "success") {
          this.refreshGroupData();
          this.$message.success(this.$st("edutgroup_info_successful"));
        }else{
          this.$ssm(res.data)
        }
      });
    },
    /**@desc 删除分组 */
    delGroup(_id, group_name) {
      delGroup({
        _id,
        group_name
      }).then(res => {
        if (res.data.result == "success") {
          this.refreshGroupData();
          this.$message.success(this.$st("delete_group_info_success"));
        }else{
          this.$ssm(res.data)
        }
      });
    },
    /**@desc 添加设备 */
    newDevice(formname) {
      console.log(formname);

      this.$refs[formname].validate(valid => {
        if (valid) {
          let newdevicedata = this.editdevicedata;
          if (this.$auth("admin")) {
            newdevicedata.labels = [];
            newdevicedata.groups = this.devicegroup.map(item => {
              return item._id;
            });
            newdevicedata.params = [this.param1, this.param2];
            newDevice(newdevicedata).then(res => {
              if (res.data.result == "success") {
                this.$message.success(this.$st("add_device_success"));
                this.devicegroup = [];
                this.editdevicedialog = false;
                this.refreshDeviceTable();
              }else{
                this.$ssm(res.data)
              }
            });
          } else {
            let parmsdata = {
              uuid: newdevicedata.uuid,
              params: [this.param1, this.param2]
            };
            editHomeParams(parmsdata).then(res => {
              if (res.data.result === "success") {
                this.$message.success(this.$st("编辑参数成功"));
                this.devicegroup = [];
                this.editdevicedialog = false;
                this.refreshDeviceTable();
              }else{
                this.$ssm(res.data)
              }
            });
          }
        }
      });
    },
    /**@desc 拖动设备到群组 */
    dragDeviceToGroup(uuid, name, ev) {
      if (this.$auth()) {
        ev.dataTransfer.effectAllowed = "move";
        ev.dataTransfer.dropEffect = "move";
        ev.dataTransfer.setData("uuid", uuid);

        ev.dataTransfer.setDragImage(ev.target, 50, 50);
        console.log("开始拖拽");
        return true;
      } else {
        return false;
      }
    },
    dragEndDeviceToGroup(ev) {
      return false;
    },
    /**@desc 检测单个设备的状态 */
    examDeviceStatus(uuid) {
      getDeviceStatus(uuid).then(res => {
        if (res.data.result === "success") {
          this.editdevicedata.status = res.data.value;
        }else{
          this.$ssm(res.data)
        }
      });
    },
    //tab col formater
    statusFormater(row) {
      if (typeof row.devstatus === "undefined") {
        return "";
      } else if (row.devstatus.status) {
        return this.$st("normal");
      } else {
        return this.$st("abnormal");
      }
    },
    //params col formater
    paramsFormater(row, index) {
      if (typeof row.params === "undefined" || !row.uuid) {
        return "";
      } else {
        return this.$st(row.params[index]);
      }
    },
    operatorFormater(row){
      if(row.operator){
        return this.operatorList.find((item)=>{
          return item.username == row.operator
        }).name;
      }
    },
    dragHover(id, ev) {
      if (this.$auth) {
        this.dragHoverAreaId = id;
        ev.preventDefault();
      }
    },
    dropToGroup(id, ev) {
      if (this.$auth) {
        let uuid = ev.dataTransfer.getData("uuid");
        if (uuid) {
          this.dragHoverAreaId = "";
          let groupid = id;
          this.deviceAddGroup({
            uuid,
            groupid
          });
        }
      }
    },
    /**@desc 删除设备 */
    delDevice(uuid) {
      delDevice({
        uuid
      }).then(res => {
        if ((res.data.result = "success")) {
          this.$message.success(this.$st("successfully_deleted"));
        }else{
          this.$ssm(res.data)
        }
      });
    },
    /**@desc 根据分组获取对应设备 */
    findDevicesByGroup(group) {
      let _id = group._id;
      if (typeof _id !== "undefined") {
        getDevicesOfGroup(group).then(res => {
          if (res.data.result == "success") {
            this.devicedata_sel = res.data.value;
          }else{
            this.$ssm(res.data)
          }
        });
      } else {
        this.getDeviceData();
      }
    },
    /**@desc 设备加群 */
    deviceAddGroup(uuidgroup) {
      newDeviceToGroups(uuidgroup).then(res => {
        if (res.data.result == "success") {
          this.$message.success(this.$st("success_add_device_to_group"));
        }else{
          this.$ssm(res.data)
        }
      });
    },
    getNonGroupDevice() {
      let filterdata = [];
    },
    /**@desc 设备退组 */
    deviceOutGroup(uuid, groupid) {
      delDeviceFromGroups({
        uuid,
        groupid
      }).then(res => {
        if (res.data.result == "success") {
          this.refreshDeviceTable();
          this.$message.success(this.$st("success_retired_the_device"));
        }else{
          this.$ssm(res.data)
        }
      });
    },
    /**@desc 获取操作员列表 */
    findOperater() {
      findUserByType("operator").then(res => {
        if (res.data.result == "success") {
          this.operatorList = res.data.userinfo;
        }
      });
    },
    /**@desc 树组件点击节点事件 */
    handleNodeClick(data) {
      if (data.id != 0 && data.id != 2) {
        //设置当前选择分组id
        this.group_sel = data;
        this.findDevicesByGroup(data);
      } else if (data.id == 0) {
        this.group_sel = data;
        this.devicedata_sel = this.devicedata;
      } else if (data.id == 2) {
        this.group_sel = data;
        this.devicedata_sel = _.dropWhile(this.devicedata, child => {
          return child.groups.length > 0;
        });
      }
    },
    /**@desc 分组对话框点击事件 分为新建和编辑 */
    editgroupdialogOkBtnClick(name) {
      console.log(name);
      this.$refs[name].validate( (valid) => {
        if (valid) {
          //type new
          if (this.group_edit_type == "new") {
            this.newGroup();
          } else if (this.group_edit_type == "update") {
            //type update
            this.editGroup(this.group_edit_id);
          }
        } else {
          return false;
        }
      });
    },
    /**@desc 设备退组点击事件 */
    removeDeviceFromGroupClick(uuid) {
      this.deviceOutGroup(uuid, this.group_sel._id);
    },
    /**@desc 加群确认按钮点击事件 */
    addGroupOKBtnClick() {
      let sub_list = this.getGroupToggleArray();
      sub_list.forEach(item => {
        let data = {
          uuid: item.uuid,
          groupid: this.group_sel._id
        };
        //为新增设备到分组时
        if (item.opt_type == "NEW") {
          this.deviceAddGroup(data);
        } else if (item.opt_type == "DEL") {
          //为删除设备到分组时
          this.deviceOutGroup(item.uuid, this.group_sel._id);
        }
      });
      //关闭加群对话框
      this.groupdevicedialog = false;
      setTimeout(() => {
        this.refreshDeviceTable();
      }, 2000);
    },
    /**@desc 设备删除点击事件 */
    deleteDeviceClick(uuid) {
      this.delDevice(uuid);
    },
    /**@desc */
    handleClick(i) {
      console.log(i);
    },
    /**@description 添加分组打开dialog */
    openEditGroup(type, data) {
      //设置分组id 分组类型 当为新建分组时_id为 0
      this.group_edit_id = data._id;
      this.group_edit_type = type;
      //自动填充
      this.editgroupdata.group_name = data.group_name;
      this.editgroupdata.description = data.describe;
      //打开edit group dialog
      this.editgroupdialog = true;
      //重置校验
      this.$nextTick(()=>{
        if(this.$refs.editgroupdata){
          this.$refs.editgroupdata.clearValidate();
        }
      })
    },
    closeNewGroup() {
      this.editgroupdialog = false;
    },
    /**@desc 打开编辑设备对话框*/
    openNewDevice(type, device) {
      //清空或填充
      this.clearDeviceForm(type, device);
      this.editdevicedialog = true;
      //重置校验
      this.$nextTick(()=>{
        if(this.$refs.editdevicedata){
          this.$refs.editdevicedata.clearValidate();
        }
      })
    },
    //打开加群设备列表，进行加群操作
    openDeviceGroup() {
      this.getDeviceData();
      this.groupdevicedialog = true;
      //设置默认选中

      // this.devicegroup.map((child,index)=>{
      //   if(child.uuid == )
      // })

      this.$nextTick(() => {
        this.$refs.addGroupTable.clearSelection();
        setTimeout(this.defaultSel, 1000);
      });
    },
    //默认选中
    defaultSel() {
      this.$nextTick(() => {
        this.devicedata_sel.forEach(item => {
          let data = this.devicedata.find(child => {
            return child.uuid === item.uuid;
          });
          if (typeof data != "undefined") {
            this.$refs.addGroupTable.toggleRowSelection(data, true);
          }
        });
      });
    },
    addGroupForDevice() {
      if(this.devicegroup_new.group_name){
        this.devicegroup.push(this.devicegroup_new);
        this.devicegroup_new = {
          group_name: ""
        };
      }else{
        this.$message.error('请选择分组');
      }
    },
    getOtherGrop(){
      return _.differenceWith(this.groupdata,this.devicegroup,(a, b)=>{ return a._id === b._id })
    },
    delGroupForDevice() {
      this.devicegroup.shift();
    },
    addGroup() {
      this.treedata[0].children.splice(this.treedata[0].children.length, 1, {
        label: "12",
        id: "21"
      });
      this.closeNewGroup();
    }
  }
};
</script>
<style lang="scss" >
@import "../../style/devicegroup.scss";
.group-tree-node {
  display: flex;
  width: 80%;
  justify-content: space-between;
}
</style>