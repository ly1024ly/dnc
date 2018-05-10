 import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import Cookies from 'js-cookie';
export function showSuccess(data){
	Message.success(data);
}
export function showError(data){
	Message.error(data);
}
//根据服务端返回的错误数据中的错误码，显示对应的错误信息。
export  function showServerError(data,vm){
    if(data.result === "fail"){
        if(data.errorno) {
        	if(data.errorno===8||data.errorno===15){
        		MessageBox.alert(vm.$t('message.error_no_' + data.errorno),vm.$t('message.warm_tips'),{
                  confirmButtonText: '确定',
                  showClose:false,
                  callback: action => {
                  	Cookies.remove('dnc-username')
      			        Cookies.remove('dnc-id_type')
      			        Cookies.remove('dnc-department')
      			        Cookies.remove('dnc-name')
                    Cookies.remove('dnc-deviceperline')
                    Cookies.remove('dnc-locale')
                    Cookies.remove('dnc-sortway')
                    vm.$router.push({path:'/login'})
                  }
                })

        	}else{
        		Message.error(vm.$t('message.error_no_' + data.errorno));
			} 
		}	
	}
}