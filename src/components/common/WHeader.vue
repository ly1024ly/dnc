<template>
<div class="system">
    <el-header>
        <img src="../../img/logo.png" class="logo" /><span class="username" :style="userStyle">{{username}} <span class="identity" :style="identityStyle">（{{identity}}）</span></span>
        <div class="header-tool-area">
            
            <div class="header-item" :style="headStyle" v-for="(item, index) in headerData" :key=" 'headeritem' + index">
                <el-button :type="examActive(item)" :size="size">
                     <router-link :to="item.link"  v-if="item.type === 'link'" >
                     {{ item.name }}
                    </router-link>
                      <span v-else @click="item.method">
                    {{ item.name }}
                </span>            
                </el-button>
            </div>
            <div class="header-form">
                <el-form :inline="true"  class="demo-form-inline">
                    <slot name="header-tool-input"></slot>
                </el-form>
            </div>
            
        </div>
    </el-header>
</div>
</template>
<style lang="scss" scoped>
.el-header {
  width: 100%;
  min-width: 768px;
  background-color: rgba(64, 64, 64,.8);
  color: #333;
  text-align: center;
  z-index:1000;
  position: fixed;
  top: 0px;
  left: 0px;
  .logo {
    width: 60px;
    float: left;
  }
  .header-tool-area {
    display: flex;
    float: right;
    line-height: initial;
    align-items: center;
    height: 100%;
  }
  .active {
    background:#409EFF;
    color : #FFFFFF;
  }
  .username{
    position:absolute;
    left:93px;
    top:17px;
    color:#fff;
  }
  a{
    color:#606266;
  }
}
</style>

<script>
import Cookies from 'js-cookie';
export default {
  //headerData : [{ type : 'link|method',name : '',method : '' } ]
  props: ["headerData"],
  data: function() {
    return {
      data: this.headerData,
      username:Cookies.get('dnc-username'),
      size:'medium',
      locale:Cookies.get('dnc-locale'),
      id_type:Cookies.get('dnc-id_type'),
      identity:'',
      userStyle:'font-size:23px;',
      headStyle:'margin: 0 10px;',
      identityStyle:'20px',
    };
  },
  watch:{
      lang:{
        handler(newValue, oldValue) {
            if(newValue!==oldValue){
              this.changeData(newValue) 
            }
　　　　　},
　　　　　deep: true
      }
  },
  computed:{
      lang:function(){
          return this.$i18n.locale
      }
  },
  mounted() {
    let lang = Cookies.get('dnc-locale');
      if(lang===undefined||lang=="zh-CN"){
          this.$i18n.locale = 'zh-CN';
      }else{
          this.$i18n.locale = 'zh-US';
    }
    
    this.changeData(lang)
  },
  methods: {
    changeData(value){
      let identityObj = {
        admin:'管理员',
        operator:'操作员',
        observer:'观察员'
      }
      let id_type = this.id_type
      if(value==='zh-US'){
        this.identity = id_type
      }else{
        this.identity = identityObj[id_type]
      }
      let path = this.$route.path
      path = path.slice(1,path.length)
      let index = path.indexOf("/");
      let sys = path.slice(0,index)
      if(window.screen.width<=768&&sys==='system'){
        this.identityStyle = 'font-size:17px;'
        this.userStyle = 'font-size:17px;'
        if(value==='zh-US'){
          this.size = 'mini'
          this.headStyle = 'margin: 0 4px;'
        }else{
          this.size = 'small'
          this.headStyle = 'margin: 0 10px;'
        }
      }else{
        this.identityStyle = 'font-size:20px;'
        this.userStyle = 'font-size:23px;'
      }
    },
    examActive(item){
      if(item.link === this.$route.path){
        return ''
      }else {
        return ''
      }
    }
  }
};
</script>
