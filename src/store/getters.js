import Cookies from "js-cookie";
export default {
  getUser(state){
    return state.user
  },
  getLocale(state){
 	let locale = state.locale;
    if(!locale){
        locale = Cookies.get('dnc-locale') || ''
    }
    console.log(locale)
    return locale;
  }
}