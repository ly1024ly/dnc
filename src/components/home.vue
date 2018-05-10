<template>
  <div>
    <el-container>
      <el-header><img src="../img/logo.png" class="logo" /></el-header>
      <el-container>
        <el-aside width="200px" class="aside-menu">
          <div  style="margin-bottom: 20px;">
          <el-menu default-active="1-4-1" class="el-menu-vertical-demo" 
            @open="handleOpen" 
            @close="handleClose" 
            :collapse="isCollapse" >
            <div @mouseover="handleOpen" 
            @mouseout="handleClose">
            <router-link to="/warning/allwarning">
            <el-menu-item index="1">
              <i class="iconfont">&#xe756;</i>
              <span slot="title">{{$t('message.warMassage')}}</span>
            </el-menu-item>
            </router-link>
            <router-link to="/monitoring/all/ALL">
            <el-menu-item index="2">
              <i class="iconfont">&#xe629;</i>
              <span slot="title">{{$t('message.equipmentmonitoring')}}</span>
            </el-menu-item>
            </router-link>
            <router-link to="/monitoring/maint">
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span slot="title">{{$t('message.maintenance')}}</span>
            </el-menu-item>
            </router-link>
            <router-link to="/system/devicegroup">
            <el-menu-item index="4">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">{{$t('message.Productregistration')}}</span>
            </el-menu-item>
            </router-link>
            <router-link to="/system/devicegroup">
            <el-menu-item index="5">
              <i class="el-icon-setting"></i>
              <span slot="title">{{$t('message.System_Setup')}}</span>
            </el-menu-item>
            </router-link>
            <el-menu-item index="6" @click="logout">
              <i class="icon-exit"></i>
              <span slot="title">{{$t('message.LEAVE_SAFELY')}}</span>
            </el-menu-item>
            </div>
          </el-menu>
          </div>
        </el-aside>
        <el-main ref="main">
          <transition-group name="fade" mode="out-in">
            <router-view v-on:hideleft="hideLeftMargin" v-on:showleft="showLeftMargin" key="1"  :lang="language" v-on:success="success"></router-view>
          </transition-group>         
        </el-main>
      </el-container>
      <div  class='zaochen' v-show="loading"><i class="el-icon-loading"></i></div>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
  .el-header, .el-footer {
    width:100%;
    background-color: #404040;
    color: #333;
    text-align: center;
    display:none;
    position: fixed;
    top:0px;
    left:0px;
  }
  .el-main {
    height:94vh;
    color: #333;
    text-align: center;
    margin-left:150px;
    margin-top:6vh;
  }
  body > .el-container {
    margin-bottom: 40px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .logo{
    width: 60px;
    float:left;
  }
  .el-aside{
    position: fixed;
    top:60px;
    left:0px;
    overflow-x: hidden;
  }
  .el-menu--collapse{
   
    height:100vh;
   
  }
  .el-menu-vertical-demo.el-menu{
    
    height:100vh;
   
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .zaochen{
    width:100%;
    height:100vh;
    background-color:rgba(0,0,0,.4);
    z-index:100;
    position:absolute;
    top:0;
    left:0;
    text-align:center;
    padding-top:16%;
    .el-icon-loading{
      font-size:20px;
      z-index:110;
    }
  }
@import "../font/iconfont.css";
@import '../icon/stylus/style.scss';
</style>

<script>
  import Cookies from 'js-cookie';
  import * as api from '../api/server.js';
  export default{
    data(){
      return {
        cn:'zh-CN',
        en:'zh-US',
        language:'多语言',
        isCollapse: true,
        loading:false,
      }
    },
    mounted(){
      console.log(this.$i18n.locale)
      let lang = Cookies.get('dnc-locale');
      if(lang===undefined||lang=="zh-CN"){
          this.$i18n.locale = 'zh-CN';
      }else{
          this.$i18n.locale = 'zh-US';
      }
      this.getParamList();
    },
    methods:{
      changeLang(command){

      },
      collpapse(){
        this.isCollapse = false;
      },
      handleOpen(key, keyPath) {
        this.isCollapse = false;
      },
      handleClose(key, keyPath) {
        this.isCollapse = true;
      },
      getParamList(){
        api.getParamList().then((res)=>{
          if(res.data.result == 'success'){
            window.sessionStorage.setItem('formatData', JSON.stringify(res.data.params))
          }
        })
      },
      logout(){
        Cookies.remove('dnc-username')
        Cookies.remove('dnc-id_type')
        Cookies.remove('dnc-department')
        Cookies.remove('dnc-name')
        Cookies.remove('dnc-deviceperline')
        Cookies.remove('dnc-locale')
        Cookies.remove('dnc-sortway')
        let _this = this
        api.signout().then(function(res){
          if(res.data.result==="success"){
            console.log(res)
            _this.$message({
              message: _this.$t("message.exit_success"),
              type: 'success'
            });
          }
          _this.$router.push({path:'/login'})
        })
        
      },
      /**监听函数 隐藏el-main左侧外边距 */
      hideLeftMargin(){
        this.$nextTick(()=>{
          this.$refs.main.$el.style.marginLeft = '15px';
        })
      },
       /**监听函数 显示el-main左侧外边距 */
      showLeftMargin(){
        this.$nextTick(()=>{
          this.$refs.main.$el.style.marginLeft = '150px';
        })
      },
      success(value){
        if(value=="success"){
          this.loading = false;
        }else{
          this.loading = true;
        }
      }
    }
  }
</script>