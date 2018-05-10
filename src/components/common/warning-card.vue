<template>
		<div class="card-box">
			<el-card>
				<div  class="star">
				    <span  class="status-circle">{{alias}}</span>
				</div>
				<div class="all-warning-content" v-if="item.length!==0">
		          	<div class="warning-content" v-for="(i,index) in item" :key="index" >
	          			<div class="warning-info">{{i.value}}</div>
	          			<div class="warning-time">{{i.timeStamp.split('T').join(' ').split('.')[0]}}</div>
		          	</div>		          	
				</div>
				<div class="all-warning-content" v-else >
					<div class="warning-content" style="text-align:center;font-size:12px;padding-left:20px;" >
						{{$t('message.No_historical_news')}}
		          	</div>
				</div>
			</el-card>
		</div>
</template>
<style lang="scss" scoped>
@import "../../style/warning-card.scss";
</style>
<script type="text/javascript">
export default {
	props: ["item","alias"],
	data() {
		return {

		}
	},
	computed: {
	},
	mounted() {

	},
	methods:{
		

	}
}
</script>