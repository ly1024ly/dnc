<template>
    <div class="authority">
        <div class="role">
            <div class="tree">
                <div class="left">{{$t('message.userandauth')}}</div>
                <el-tree :data="data" :props="defaultProps" default-expand-all highlight-current @node-click="handleNodeClick" ></el-tree>
            </div>
            <div class="table">
                <div class="middle">
                    <el-input v-model="searchname" :placeholder="$t('message.please_enter_username')"></el-input>
                </div>
                <div class="search">
                    <el-button type="primary" @click="searchUser">{{$t('message.serach')}}</el-button>
                </div>
                <div class="right" :style="rightStyle">{{$t('message.describe')}}：具有设备的操作权和日常监控权<br/>{{$t('message.number')}}：{{userNum}}</div>
                <el-table
                    :data="tableData"
                    border
                    :stripe = true
                    size = "small"
                    :header-cell-class-name="tableheaderClassName"
                    height="700"
                    :style="styleTable">
                    <el-table-column
                        fixed
                        prop="username"
                        :label="$t('message.username')"
                        width="180"
                        header-align="center"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        :label="$t('message.name')"
                        width="250"
                        header-align="center"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="department"
                        :label="$t('message.department')"
                        width="300"
                        header-align="center"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        :label="$t('message.operation')"
                        width="100"
                        header-align="center"
                        v-if="id_type==='admin'"
                    >
                    <template slot-scope="scope">
                        <el-button @click="editUser(scope.row.username)" type="text" size="small" v-if="scope.row.username">{{$t('message.edit')}}</el-button>
                        <el-button type="text" size="small" v-if="scope.row.username" @click="deleteUser(scope.row.username)">{{$t('message.delete')}}</el-button>
                       
                        <el-button type="text" size="small" v-if="scope.row.username===''" @click="addPerson">{{$t('message.add')}}</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog :visible.sync="dialogShow" style="max-width:1000px;min-width:800px;margin:0 auto;" center :title="formTitle" @close="cancelButton">
              <el-form :model="form" :rules="rules2" ref="ruleForm2" :label-width="labelWidth" style="padding-right:20px;">
                <el-form-item :label="$t('message.username')" prop="username">
                  <el-input v-model="form.username" :placeholder="$t('message.please_enter_username')" :disabled="disabledShow"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.name')" prop="name">
                  <el-input v-model="form.name" :placeholder="$t('message.please_enter_name')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.password')" prop="password" v-if="disabledShow">
                  <el-input v-model="form.password" type="password"  :placeholder="$t('message.please_enter_password')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.department')" prop="department">
                  <el-input v-model="form.department" :placeholder="$t('message.please_enter_department')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.roleandauth')" prop="role">
                    <el-select v-model="form.role"  :placeholder="$t('message.please_select')" style="width:100%">
                        <el-option  v-for="(item,index) in role" :key="index"  :label="item.label" :value="item.value"  >
                        </el-option>
                    </el-select>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer" style="padding-bottom:40px;">
                <el-button @click="cancelButton">{{$t('message.cancel')}}</el-button>
                <el-button type="primary" @click="getAddForm(type)">{{$t('message.ok')}}</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
@import "../../style/authority.scss";
</style>
<style lang="scss">
.el-table{
    .table-head-th{
         /* background-color:#eff9ff; */
         background-color:#f0f7ff;
    }
}
</style>

<script type="text/javascript">
    import * as api from '../../api/server.js';
    import Cookies from "js-cookie";
    export default{
        data(){
            let validatUsername = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error(this.$t('message.please_enter_username')));
                }else{
                    callback();
                }
            };
            let validatName = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error(this.$t('message.please_enter_name')));
                }else{
                    callback();
                }
            };
            let validatDepartment = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error(this.$t('message.please_enter_department')));
                }else{
                    callback();
                }
            };
            let validatRole = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error(this.$t('message.please_select_role')));
                }else{
                    callback();
                }
            };
            let validatPassword = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error(this.$t('message.please_enter_password')));
                }else{
                    callback();
                }
            };
            return {
                disabledShow:false,
                dialogShow:false,
                type:'add',
                userNum:0,
                formTitle:'',
                labelWidth:'90px',
                searchname:'',
                styleTable:'width:840px;top:58px',
                rightStyle:'left:800px;',
                id_type:Cookies.get('dnc-id_type'),
                form:{
                    username:'',
                    name:'',
                    department:'',
                    role:'',
                    password:''
                },
                role:[],
                data: [{
                label: '',
                    children: []
                }],
                rules2:{
                    username: [
                        { validator: validatUsername, trigger: 'change' }
                    ],
                    name: [
                        { validator: validatName, trigger: 'change' }
                    ],
                    department: [
                        { validator: validatDepartment, trigger: 'change' }
                    ],
                    role: [
                        { validator: validatRole, trigger: 'change' }
                    ],
                    password:[
                        { validator: validatPassword, trigger: 'change' }
                    ]

                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                tableData: [],
                roleType:'',           
            }
        },
        mounted(){
            if(this.id_type!=='admin'){
                this.styleTable = 'width:731px;top:58px'
                this.rightStyle = 'left:690px;'
            }
            console.log(window.screen.width)
            let lang = Cookies.get('dnc-locale');
            if(lang===undefined||lang=="zh-CN"){
              this.$i18n.locale = 'zh-CN';
            }else{
              this.$i18n.locale = 'zh-US';
            }
            this.fillData()
            this.getUser()

        },
        methods:{
            fillData(){
                let data = [{
                        value:'admin',
                        label:this.$t('message.administrator'),
                    },{
                        value:'operator',
                        label:this.$t('message.operator'),
                    },{
                        value:'observer',
                        label:this.$t('message.observer'),
                    }]
                let data2 = [{
                        id:'admin',
                        label: this.$t('message.administrator'),
                    },{
                        id:'operator',
                        label:this.$t('message.operator'),
                    },{
                        id:'observer',
                        label:this.$t('message.observer')
                    }]
                this.data[0].label = this.$t('message.alluser')
                let len = data.length
                for(let i=0;i<len;i++ ){
                    this.$set(this.role,i,data[i]);
                    this.$set(this.data[0].children,i,data2[i]);
                }

            },
            handleNodeClick(data) {
                console.log(data);
                this.searchname = ''
                this.getUser(data.id)
                this.roleType = data.id
            },
            tableheaderClassName(){
                return "table-head-th";
            },
            getLang(){
                let lang = Cookies.get('dnc-locale')
                console.log(lang)
                if(lang ==='zh-US'){
                    this.labelWidth = '105px'
                }else{
                    this.labelWidth = '90px'
                }
            },
            addPerson(){
                this.dialogShow = true
                this.type = 'add'
                this.formTitle = this.$t('message.add_user')
                this.disabledShow = false
                if (this.$refs['ruleForm2']!==undefined) {
                    this.$refs['ruleForm2'].resetFields();
                }
                this.getLang()
                this.form = {
                    username:'',
                    name:'',
                    department:'',
                    role:'',
                    password:''
                }
            },
            cancelButton(){
                this.dialogShow = false
                this.$refs['ruleForm2'].resetFields();
            },
            getUser(role){
                let data = {
                    "id_type":''
                }
                if(role){
                    data.id_type = role
                }
                let _this = this
                _this.tableData = []
                console.log(data)
                api.findUserByIdtype(data).then(function(res){
                    console.log(res)
                    if(res.data.result==="success"){
                        res.data.userinfo.forEach(function(val) {
                            let data = {
                                username:val.username,
                                name:val.name,
                                department:val.department,
                            }
                            _this.tableData.push(data);
                        })
                        _this.userNum = res.data.userinfo.length
                        if(_this.id_type==='admin'){
                            _this.pushArray(_this.tableData)
                        }
                    }else{
                        _this.$ssm(res.data) 
                    }
                })

            },
            getAddForm(type){
                this.$refs['ruleForm2'].validate((valid) => {
                    if(valid){
                        let data = {
                            "username":this.form.username,
                            "name":this.form.name,
                            "password":this.form.password,
                            "department":this.form.department,
                            "id_type":this.form.role
                        }
                        let _this = this
                        if(_this.type==='add'){
                            api.addUser(data).then(function(res){
                                console.log(res)
                                if(res.data.result==="success"){
                                    _this.$message({
                                        message: _this.$t('message.operation_success'),
                                        type: 'success'
                                    });
                                    _this.cancelButton()
                                    _this.getUser(_this.roleType)
                                }else{
                                    _this.$ssm(res.data)

                                }
                            })

                        }else if(_this.type==='edit'){
                            api.modifyuser(data).then(function(res){
                                if(res.data.result==="success"){
                                    _this.$message({
                                        message: _this.$t('message.operation_success'),
                                        type: 'success'
                                    });
                                    _this.cancelButton()
                                    if(_this.searchname){
                                        _this.searchUser()
                                    }else{
                                        _this.getUser(_this.roleType)
                                    }
                                    
                                }else{
                                    _this.$ssm(res.data)

                                }
                            })

                        }
                    }
                })
            },
            pushArray(arr){
                let data = {
                    username:'',
                    name:'',
                    department:'',
                }
                arr.push(data)
            },
            deleteUser(username){
                let data = {
                    username:username
                }
                let _this = this
                this.$confirm(this.$t('message.do_you_want_to_delete_this_user'), this.$t('message.warm_tips'), {
                  confirmButtonText: _this.$t('message.ok'),
                  cancelButtonText: _this.$t('message.cancel'),
                  type: 'warning',
                  center: true
                }).then(() => {
                    api.deleteUser(data).then(function(res){
                        console.log(res)
                        if(res.data.result==="success"){
                            _this.$message({
                                message: _this.$t('message.operation_success'),
                                type: 'success'
                            });
                            _this.getUser()
                        }else{
                            _this.$ssm(res.data)

                        }
                    })
                },()=>{})
            },
            editUser(username){
                this.getLang()
                let data = {
                    username:username
                }
                let _this = this
                api.finduser(data).then(function(res){
                   if(res.data.result==="success"){
                    console.log(res)
                    _this.dialogShow = true
                    _this.disabledShow = true
                    _this.type = 'edit'
                    _this.formTitle = _this.$t('message.update_user')
                    _this.form.username = res.data.value.username
                    _this.form.name = res.data.value.name
                    _this.form.department = res.data.value.department
                    _this.form.role = res.data.value.id_type
                    _this.form.password = res.data.value.password
                   }else{
                    _this.$ssm(res.data) 
                   }
                })
            },
            searchUser(){
                let searchname = this.searchname
                if(searchname){
                    let data = {
                        username:searchname
                    }
                    let _this = this
                    api.finduser(data).then(function(res){
                        console.log(res)
                        _this.tableData = []
                       if(res.data.result==="success"){
                        console.log('222')
                            let data = {
                                username:res.data.value.username,
                                name:res.data.value.name,
                                department:res.data.value.department,
                            }
                            _this.tableData.push(data); 
                            _this.pushArray(_this.tableData)
                       }else{
                        _this.$ssm(res.data)
                       }
                    })

                }

            }
        }
    }
</script>