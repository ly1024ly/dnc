require('es6-promise').polyfill()
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import routes from './router.config'
import echarts from 'echarts'
import ServerLang from './util/ServerLang'
import FrontLog from './util/FrontLog'
import Auth from './util/authMannger'
import Cookies from 'js-cookie'
const router = new VueRouter(routes)
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueI18n);
Vue.use(ServerLang); 
Vue.prototype.$echarts = echarts
Vue.component(CollapseTransition.name, CollapseTransition)


const i18n = new VueI18n({
  locale:'zh-CN',
  messages:{
    'zh-CN':require('./i18n/lang/cn.js'),
    'zh-US':require('./i18n/lang/en.js')
  }
});

Vue.use(Auth);

const vLogger = Vue.use(FrontLog, { 
  prefix: () => new Date(),
  dev: true,
  shortname: true,
  levels: ['log', 'warn', 'debug', 'error', 'dir']
})

export default i18n;

//判断用户是否登录，未登录跳转到登录页
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        let username = Cookies.get('dnc-username');
        if (!username) {
            next({
                path: '/login',
            })
        } else {
            next()
        }
    } else {
        next() 
    }
})

new Vue({
  	el: '#app',
  	store,
  	router,
    i18n:i18n,
    components:{
    	"v-app":App
    }
});