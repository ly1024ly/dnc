<template>
  <div class="pop" v-show="popup" @click.self="hide" >
    <div class="box" :slot="what">
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../style/popup.scss";
</style>

<script>
  export default {
    props:["popup","what"],
    data(){
      return {
      }
    },
    mounted(){
        console.log(this.what)
    },
    methods:{
      hide(){
        this.popup = false;
      },
    }
  }
</script>