<template>
	<div>
		<div class="allwarning" v-if="showtype=='ALL'">
			<card  v-for="(item,index) in deviceAlarm" :item="item.arr" :alias="item.alias" :key="index"></card>
		</div>
		<div class="allwarning" v-if="showtype=='ALL-GROUP'">
			<div class="group-box" v-for="(item, index) in groupshow" :key="'all-group'+index" >
				<div class="head-name"><span>{{item.group.group_name}}</span></div>
				<card v-for="(data,index) in item.devices" :item="data.arr" :alias="data.alias" :key="'data'+index"></card>
			</div>
		</div>
		<div  class="allwarning" v-if="showtype=='GROUP'"  v-for="(item, index) in groupItemshow" :key="'group'+index">
			<card v-for="(data,index) in item.devices" :item="data.arr" :alias="data.alias" :key="'item'+index" v-if="item"></card>
			<div v-else>555</div>
		</div>
		<div v-if="groupItemshow.length===0&&showtype==='GROUP'">{{$t('message.The_group_has_no_device')}}</div>
		<div class="allwarning" v-if="showtype=='DEVICE'">
			<card v-for="(item,index) in itemShow" :item="item.arr" :alias="item.alias" :key="'device'+index"></card>
		</div>							
	</div>
</template>
<style lang="scss" scoped>
	@import "../../style/allwarning.scss";
</style>
<script type="text/javascript">
import card from "../common/warning-card.vue";
import * as api from "../../api/server.js";
	export default {
		components: { 
			card
		},
		props: ["showtype","groupdata","devicedata","deviceofgroupdata","groupinfo","deviceAlarm"],
		data() {
			return {
			}
		},
		computed: {
			groupshow : function(){
		      	return this.deviceofgroupdata.map((item)=>{
		        	let group = this.groupdata.filter((groupitem)=>{
		          		return groupitem._id == item._id;
		        	})[0];
		        	let child_devices = item.uuids.map((uuidchild) => {
				        return this.deviceAlarm.filter((devicechild)=>{
				           return devicechild.uuid === uuidchild
				        })[0]
        			})
			        return {
			          group : group,
			          devices : child_devices
			        }
		      })
    		},
    		groupItemshow : function(){
		      	return this.groupshow.filter((item)=>{
		      		if(item.group){
		      			return item.group._id == this.groupinfo._id;
		      		}
		      	});
    		},
    		itemShow : function(){
    			let arr = []
    			let _this = this
    			this.deviceAlarm.forEach(function(val){
    				if(val.uuid == _this.groupinfo.uuid){
    					arr.push(val)
    				}
    			})
    			return arr
    		}

		},
		mounted() {

		},
		methods:{
			

		}
	}
</script>