<template>
    <div>
	    <div class="habit-box">
	    	<div class="button-box">
	    		<el-button @click="clearForm">{{this.$t('message.clear')}}</el-button>
	    		<el-button @click="saveForm">{{this.$t('message.save')}}</el-button>
	    	</div>
	    	<div class="form-box">
	    		
	    		<el-form :model="passwordForm" status-icon ref="passwordForm" :rules="rules" label-width="135px" class="demo-ruleForm">
					<el-form-item :label="old_password" prop="oldpwd">
						<el-input v-model.trim="passwordForm.oldpwd" type="password"></el-input>
					</el-form-item>
					<el-form-item :label="new_password" prop="newpwd">
						<el-input v-model.trim="passwordForm.newpwd" type="password"></el-input>
					</el-form-item>
					<el-form-item :label="confirm_new_password" prop="newpwd2">
						<el-input v-model.trim="passwordForm.newpwd2" type="password"></el-input>
					</el-form-item>
	    		</el-form>
	    	</div>
	    </div>
    </div>
</template>

<style lang="scss" scoped>
	@import "../../style/updatePwd.scss";
</style>

<script type="text/javascript">
  	import * as api from '../../api/server.js';
  	import Cookies from 'js-cookie';
    import md5 from 'js-md5'
    export default{
        data(){
        	let validateOldpwd = (rule, value, callback) => {
			  	if (!value) {
		          return callback(new Error(this.$t("message.please_enter_your_old_password")));
		        }else if(value.length<6){
		        	callback(new Error(this.$t("message.the_password_length_should_not_be_less_than_6_characters")));
		        }else{
		        	callback();
		        }
	  		};
		  	let validateNewpwd = (rule, value, callback) => {
		  	
			  	if (!value) {
		          return callback(new Error(this.$t("message.please_enter_your_new_password")));
		        }else if(value.length<6){
		        	callback(new Error(this.$t("message.the_password_length_should_not_be_less_than_6_characters")));
		        }else{
		        	callback();
		        }
		  	};
		  	let validateNewpwd2 = (rule, value, callback) => {
			  	if (!value) {
		          return callback(new Error(this.$t("message.please_enter_your_new_password_again")));
		        }else if (value !== this.passwordForm.newpwd) {
		          	callback(new Error(this.$t("message.two_passwords_are_not_the_same")));
		        }else{
		        	callback();
		        }
		  	};
            return {
            	passwordForm:{
            		oldpwd:'',
            		newpwd:'',
            		newpwd2:'',
            	},
            	rules: {
		        	oldpwd: [
		        		{ validator: validateOldpwd, trigger: 'change' }
		          	],
			        newpwd: [
			        	{ validator: validateNewpwd, trigger: 'change' }
			        ],
		          	newpwd2: [
		          		{ validator: validateNewpwd2, trigger: 'change' }
		          	]

        		},

            }
        },
        computed:{
        	old_password:function(){
        		return this.$t("message.old_password")
        	},
        	new_password:function(){
        		return this.$t("message.new_password")
        	},
        	confirm_new_password:function(){
        		return this.$t("message.confirm_new_password")
        	}
        },
        mounted(){
        	
        },
        methods:{
        	saveForm(){
        		this.$refs['passwordForm'].validate((valid) => {
        			if(valid){
        				let _this = this;
        				let data = {
        					"oldpassword" : md5(_this.passwordForm.oldpwd),
        					"newpassword" : md5(_this.passwordForm.newpwd),
        					"renewpassword" : md5(_this.passwordForm.newpwd2),
        				}
        				console.log(data)
        				api.updatePassword(data).then(function(res){
        					console.log(res)
        					if(res.data.result==="success"){
        						console.log(res)
        						_this.$message({
		                          message: _this.$t("message.update_success"),
		                          type: 'success'
                      			});
                      			_this.logout()
        					}else{
        						_this.$ssm(res.data)
        					}
        					
        				})
        				
        			}
        		})
        	},
        	clearForm(){
        		this.$refs['passwordForm'].resetFields();
        	},
        	logout(){
		        Cookies.remove('dnc-username')
                Cookies.remove('dnc-id_type')
                Cookies.remove('dnc-department')
                Cookies.remove('dnc-name')
                Cookies.remove('dnc-deviceperline')
                Cookies.remove('dnc-locale')
                Cookies.remove('dnc-sortway')
		        this.$router.push({path:'/login'})
      		}

        }
    }
</script>