import Cookies from 'js-cookie'
var authMannger = {}
authMannger.install = function(Vue, options){

    let show = false;


    Vue.directive('authiden', {
        bind(el, binding, vnode, oldNode){
            
        },
        //虚拟dom插入的时候
        inserted(el, binding, vnode, oldNode){
            let id_type = Cookies.get('dnc-id_type');
            if(id_type&&id_type === 'admin'){
                show = true;
            }else{
                show = false;
            }
            if(!show){
                if(el){
                    el.parentNode.removeChild(el);
                }
            }
        },
        update(el, binding, vnode, oldNode){
            let id_type = Cookies.get('dnc-id_type');
            if(id_type&&id_type === 'admin'){
                show = true
            }
            if(!show){
                if(el){
                  
                }
            }
        }
    })

    //只读
    Vue.directive('authread', {
        bind(el, binding, vnode, oldNode){
            
        },
        //虚拟dom插入的时候
        inserted(el, binding, vnode, oldNode){
            let id_type = Cookies.get('dnc-id_type');
            if(id_type&&id_type === 'admin'){
                show = true;
            }else{
                show = false;
            }
            if(!show){
                let inputEle = el.getElementsByTagName('input');
                if(inputEle !== null){
                    inputEle[0].readOnly = true;
                }
            }
        },
        update(el, binding, vnode, oldNode){
            let id_type = Cookies.get('dnc-id_type');
            if(id_type&&id_type === 'admin'){
                show = true
            }
            if(!show){
                if(el){
                  
                }
            }
        }
    })
    Vue.prototype.$auth = function (methodOptions) {
        let id_type = methodOptions||'admin';
        return Cookies.get('dnc-id_type') === id_type;
    }
}
export default authMannger;