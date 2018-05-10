<template>
	<div id="ap" >
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>	
</template>
<style lang="sass">
@import './style/public.scss'
</style>

<script>
export default {
	name: 'app',
	components: {
	},
	beforeCreate(){
		
	},
	created(){
		
	},
	beforeMount(){
	},
	mounted(){
		
	}
} 
</script>