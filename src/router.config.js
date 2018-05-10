import Home from './components/home.vue';
import Login from './components/login.vue';
import System from './components/system/System.vue';
import DeviceGroup from './components/system/DeviceGroup.vue'
import Systemmachine from './components/System-machine.vue';
import Authority from './components/system/authority.vue';
import AllDevice from './components/monitoring/AllDevice.vue';
import Device from './components/monitoring/Device.vue';
import Monitoring from './components/monitoring/Monitoring.vue';
import UsingHabit from './components/system/usinghabit.vue';
import UpdatePwd from './components/system/updatePwd.vue';
import Maintenance from './components/monitoring/Maintenance.vue'
import Product from './components/ProductRegister.vue';
import warning from './components/warning/warning.vue';
import allwarning from './components/warning/allwarning.vue';

const routes =[
	{
		path:'/',
		component:Home,
		children:[
			{
				path :"/system",
				name : 'system',
				component : System,
				meta: { requiresAuth: true },
				children : [
					{
						path : '/system/devicegroup', 
						component : DeviceGroup,
						name : 'DeviceGroup' 
					},
					{
						path:"/system/authority",
						component:Authority,
						name:"role"
					},
					{
						path:"/system/usinghabit",
						component:UsingHabit,
						name:"UsingHabit"
					},
					{
						path:"/system/updatepwd",
						component:UpdatePwd,
						name:"UpdatePwd"
					},
				]
			},{
				path:"/monitoring",
				name:"monitoring",
				component:Monitoring,
				meta: { requiresAuth: true },
				children:[
					{
						path:'/monitoring/all/:type',
						component:AllDevice,
						name:'alldevice'
					},
					{
						path: '/monitoring/maint',
						component:Maintenance,
						name: 'maintenance'
					},{
						path:'/monitoring/device',
						component:Device,
						name:'device'
					}
				]
			},{
				path:"/warning",
				name:"warning",
				component:warning,
				meta: { requiresAuth: true },
				children:[
					{
						path:'/warning/allwarning',
						component:allwarning,
						name:'allwarning'

					}
				]
			},{
				path:'/product',
				name:"product_register",
				meta: { requiresAuth: true },
				component:Product
			
			}
		]
	},
	{
		path:'/login',
		name:'login',
		component:Login
	},
];

export default {routes}