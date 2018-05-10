<template>
    <div>
	    <div class="habit-box">
	    	<div class="button-box">
	    		<el-button @click="clearForm">{{this.$t('message.clear')}}</el-button>
	    		<el-button @click="saveForm">{{this.$t('message.save')}}</el-button>
	    	</div>
	    	<div class="form-box" :style="formStyle">
	    		<el-form :model="habitForm" status-icon ref="habitForm" :rules="rules" :label-width="labelwidth" class="demo-ruleForm">
					<el-form-item :label='$t("message.the_number_of_devices_displayed_on_each_line")' prop="num">
						<el-select v-model="habitForm.num" :placeholder='$t("message.please_choose")' :style="selectStyle">
						      <el-option label="1" value="1"></el-option>
						      <el-option label="2" value="2"></el-option>
						      <el-option label="3" value="3"></el-option>
						      <el-option label="4" value="4"></el-option>
						      <el-option label="5" value="5"></el-option>
	    				</el-select>
					</el-form-item>
					<el-form-item :label='$t("message.group_sort_in_group")' prop="sort">
					    <el-radio-group v-model="habitForm.sort">
						      <el-radio label="0" >{{this.$t("message.alphabetical_order")}}</el-radio>
						      <el-radio label="1">{{this.$t("message.device_number_ordering")}}</el-radio>
    					</el-radio-group>
					</el-form-item>
                    <el-form-item :label='$t("message.language")'>
                        <el-radio-group v-model="habitForm.language" :style="radioStyle">
                              <el-radio label="zh-CN" >{{this.$t("message.chinese")}}</el-radio>
                              <el-radio label="zh-US">{{this.$t("message.english")}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
	    		</el-form>
	    	</div>
	    </div>
    </div>
</template>

<style lang="scss" scoped>
	@import "../../style/usinghabit.scss";
</style>

<script type="text/javascript">
    import * as api from '../../api/server.js';
    import Cookies from 'js-cookie';
    export default{
        data(){
        	let validateNum = (rule, value, callback) => {
        		if (!value) {
		          	return callback(new Error(this.$t("message.please_select_the_number_of_devices_to_be_displayed")));
		        }else{
		        	callback();
		        }
        	};
        	let validateSort = (rule, value, callback) => {
        		if (!value) {
		          	return callback(new Error(this.$t("message.please_select_the_within_group_sort")));
		        }else{
		        	callback();
		        }
        	};
            return {
                labelwidth:'240px',
                formStyle:'',
                selectStyle:'',
                radioStyle:'',
            	habitForm:{
            		num:'',
            		sort:'',
                    language:'',
            	},
                lang:'',
            	rules: {
		        	num: [
		        		{ validator: validateNum, trigger: 'change' }
		          	],
			        sort: [
			        	{ validator: validateSort, trigger: 'change' }
			        ],

        		},

            }
        },
        watch:{
            lang:function(res){
                if(res==='zh-US'){
                    this.labelwidth = '316px'
                    this.formStyle = 'width:700px;'
                    this.selectStyle = 'left:-70px;'
                    this.radioStyle = 'position:absolute;left:10px;top:14px'
                }else{
                    this.labelwidth = '240px'
                    this.formStyle = ''
                    this.selectStyle = ''
                    this.radioStyle = ''
                }
            }
        },
        mounted(){
            
            this.finduser()
        },
        methods:{
        	saveForm(){
        		this.$refs['habitForm'].validate((valid) => {
        			if(valid){
        				let _this = this
                        let data = {
                            "deviceperline":_this.habitForm.num,
                            "sortway":_this.habitForm.sort
                        }
                        if(_this.habitForm.language){
                            _this.lang = _this.habitForm.language
                            Cookies.set('dnc-locale',_this.habitForm.language);
                            _this.$i18n.locale = _this.habitForm.language;
                        }
                        api.modifyPerset(data).then(function(res){
                            if(res.data.result==="success"){
                                Cookies.set('dnc-deviceperline',_this.habitForm.num);
                                Cookies.set('dnc-sortway',_this.habitForm.sort);
                                _this.$message({
                                  message: _this.$t('message.setup_success'),
                                  type: 'success'
                                });
                            }else{
                                _this.$ssm(res.data) 
                            }
                           

                        })

        			}
        		})
        	},
        	clearForm(){
        		this.$refs['habitForm'].resetFields();
        	},
            finduser(){
                this.lang = Cookies.get('dnc-locale');
                if(this.lang==='zh-US'){
                    this.labelwidth = '316px'
                    this.formStyle = 'width:700px;'
                    this.selectStyle = 'left:-70px;'
                    this.radioStyle = 'position:absolute;left:10px;top:14px'
                }
                let deviceperline = Cookies.get('dnc-deviceperline')
                let sortway = Cookies.get('dnc-sortway')
                if(deviceperline){
                    this.habitForm.num = deviceperline
                }
                if(sortway){
                    this.habitForm.sort = sortway
                }
                if(this.lang===undefined||this.lang=="zh-CN"){
                    this.habitForm.language = "zh-CN"
                }else{
                    this.habitForm.language = this.lang
                }
                
            }

        }
    }
</script>