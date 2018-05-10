<template>
	<div class="login">
    <div class="all-login">
      <div class="header">
        <div class="lg-logo">
          <img src="../img/logo.png" width="90" />
          <span class="website-banner-name">
            维宏群控DNC
          </span>
        </div>
        <div class="choose-lang">
          <el-dropdown @command="changeLang">
            <span class="el-dropdown-link">
              {{loginlan}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="cn">中文</el-dropdown-item>
              <el-dropdown-item :command="en">英文(English)</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="dec-box">
        <div class="dec">应用丰富，功能更强大</div>
        <div class="dec">内置模块，联网更轻松</div>
        <div class="dec">全面采集，管理更高效</div>
        
      </div>
      <div class="box">
        <p class="login-title">{{$t('message.login')}}</p>
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="95px" class="demo-ruleForm">
          <el-form-item :label='$t("message.account")' prop="username">
              <el-input type="text" v-model="ruleForm2.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label='$t("message.password")' prop="checkPass">
              <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <div class="submit-btn">
              <el-button type="primary" @click="submitForm('ruleForm2')">{{ $t("message.submit") }}</el-button>
          </div>  
        </el-form>
      </div>
    </div>
	</div>
</template>
<style lang="scss" scoped>
  @import "../style/login.scss"
</style>
<script>
  import * as api from '../api/server.js';
  import Cookies from 'js-cookie';
  import md5 from 'js-md5'
  export default {
    data() {
      let checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('message.account_be_filled')));
        } else {
            callback();
        }       
      };
      let checkPass = (rule,value,callback) => {
        if(!value){
          callback(new Error(this.$t('message.password_be_filled')))
        }else if(value.length < 6){
          callback(new Error(this.$t('message.the_minimum_length_is_6_characters')))
        }else{
          callback();
        }
      };
      return {
        account:this.$t("message.account"),
        password:this.$t("message.password"),
        loginlan:"Language",
        cn:'zh-CN',
        en:'zh-US',
        ruleForm2: {
          username: '',
          checkPass: '',
        },
        rules2: {
          username: [
            { validator: checkUsername, trigger: 'blur' }
          ],
          checkPass: [
            {  validator: checkPass, trigger: 'blur'}
          ],
        }
      };
    },
    mounted(){
      let id_type = Cookies.get("dnc-id_type");
      let username = Cookies.get("dnc-username");
      let name = Cookies.get("dnc-name");
      if(id_type&&username&&name){
        this.$router.push({path:'/monitoring/all/ALL'})
      }
      let lang = Cookies.get('dnc-locale');
      if(lang===undefined||lang=="zh-CN"){
          this.$i18n.locale = 'zh-CN';
      }else{
          this.$i18n.locale = 'zh-US';
      }
    },
    methods: {
        changeLang(command){
          console.log(command)
          this.$i18n.locale = command;
          Cookies.set('dnc-locale',command);
          if(command=="zh-CN"){
            this.loginlan = "中文";
          }else{
            this.loginlan = "English";
          }
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let _this = this;
              let data = {
                username : _this.ruleForm2.username,
                password : md5(_this.ruleForm2.checkPass)

              }
              api.login(data).then(function(res){
                  console.log(res)
                 if(res.data.result==='success'){
                    let data = {
                      'dnc-department':res.data.value.department,
                      'dnc-id_type':res.data.value.id_type,
                      'dnc-name':res.data.value.name,
                      'dnc-username':res.data.value.username
                    }
                    _this.setCookies(data);
                    
                    if(res.data.value.personalset){
                      let o = {
                        'dnc-deviceperline':res.data.value.personalset.deviceperline,
                        'dnc-sortway':res.data.value.personalset.sortway
                      }
                       _this.setCookies(o);
                    }
                    _this.$router.push({path:'/monitoring/all/ALL'})
                 }else{
                    _this.$ssm(res.data) 
                 }
              })
            }
          });
        },
        setCookies(obj){
          var day = new Date();
          var str = "";
          day.setTime(day.getTime() + 7*24*60*60*1000);
          for(var key in obj){
            Cookies.set(key,obj[key],{expires:7});
          }
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
      }
    }
</script>