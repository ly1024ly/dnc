<template>
<div class="system">
    <WHeader :headerData="headerData">
        <!-- <div slot="header-tool-input">
            <el-form-item label="test">
            <el-input placeholder=""></el-input>
            </el-form-item>
        </div> -->
    </WHeader>
    
    <el-main><router-view></router-view></el-main>
</div>
</template>
<script>
import WHeader from '../common/WHeader.vue'
import Cookies from 'js-cookie';
export default {
    data(){
        return {
            headerData : [],
        }
    },
    watch:{
        lang:{
            handler(newValue, oldValue) {
                if(newValue!==oldValue){
                    this.getData()
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
    mounted(){
      let lang = Cookies.get('dnc-locale');
      if(lang===undefined||lang=="zh-CN"){
          this.$i18n.locale = 'zh-CN';
      }else{
          this.$i18n.locale = 'zh-US';
      }
      this.getData()
      //show left
      this.$emit('showleft');

    },
    components : {
        WHeader
    },
    methods :{
        getData(){
            let data = [
                { type : 'link', name : this.$st('deviceandgroup'), link : '/system/devicegroup'},
                { type : 'link', name : this.$st('userandauth'), link : '/system/authority'},
                { type : 'link', name : this.$st('usermanner'), link : '/system/usinghabit'},
                { type : 'link', name : this.$st('changepwd'), link : '/system/updatepwd'},
            ]
            let len = data.length
            for(let i=0;i<len;i++ ){
                this.$set(this.headerData,i,data[i]);
            }
        }

    }
}
</script>
