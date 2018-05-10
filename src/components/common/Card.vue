<template>
  <div @click="clickCallback" class="device-card" :style="width">
    <el-card>
      <!-- card header --> 
      <div slot="header" :style="getHeaderStyle(cardData.runstate)" class="clearfix device-card-header">
        <span>{{ cardData.alias }}</span>
      </div>
      <!-- card body -->
      <div v-for="(value, index) in  cardData.status" :key="index">
        {{$st(value.status)}} : {{ value.value }} 
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" >
.device-card .el-card {
  width: 100%;
  height: 170px;
}
.device-card .el-card__header {
  padding: 0px;
}
.device-card .device-card-header {
  padding: 5px;
}
</style>

<script>
export default {
  props: ["cardData", "clickCallback", "width"],
  data: function() {
    return {};
  },
  methods: {
    getHeaderStyle(state) {
      let style = {
        backgroundColor: "gray",
        color: "#FFF"
      };
      if (state) {
        let runstate = state.value;
        if (runstate == "Idle") {
          style = {
            backgroundColor: "#FFD900",
            color: "#FFF"
          };
        } else if (runstate == "Estop") {
          style = {
            backgroundColor: "red",
            color: "#FFF"
          };
        } else if (runstate == "Running") {
          style = {
            backgroundColor: "green",
            color: "#FFF"
          };
        } else {
          style = {
            backgroundColor: "gray",
            color: "#FFF"
          };
        }
      }

      return style;
    }
  }
};
</script>
