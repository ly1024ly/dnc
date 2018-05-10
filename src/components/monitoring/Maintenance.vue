<template>
  <el-table :data="allGroupData">
      <el-table-column v-for="col in groupTableSetting"
          :prop="col.id"
          :key="col.id"
          :label="col.label"
          :width="col.width">
      </el-table-column>
  </el-table>
  
</template>
<script>
export default {
  data: function() {
    let groupTableSetting = [
      {
        id: "param",
        label: this.$st("param"),
        width: 100
      },
      {
        id: "alert_num",
        label: this.$st("alert_num")
      },
      {
        id: "alert_device_list",
        label : this.$st("alert_device_list")
      },
      {
        id: "use_finish_num",
        label : this.$st('use_finish_num')
      },
      {
        id: "use_finish_device",
        label : this.$st('use_finish_device')
      },
    ]
    return {
      maintData : {
      },
      groupTableSetting : groupTableSetting
    };
  },
  computed : {
    allGroupData : function(){

    },
    singleGroupData : function(){

    },
    deviceGroupData : function(){

    }
  },
  mounted : function(){
    this.$emit('toMaintenance');
  }
};
</script>
<style lang="scss" scoped>

</style>
