import './styles/index.less'
import './assets/iconfont/iconfont.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'
// import 'iview/dist/styles/iview.css'
import { apiFetch } from './axios/api'

Vue.use(iView)
Vue.prototype.$api = apiFetch
Vue.config.productionTip = false
Vue.prototype.$Message.config({
  duration: 3,
});
Vue.prototype.checkPermission = function(permission, callback) {
  return true;
  let checkPermission = () => {
    const flag = store.state.rightCodeList.some(item => {
      if (item === permission) {
        return true
      }
    })
    if (flag) {
      callback()
    } else {
      this.loading = false
      this.$Message.error({
        content: '该用户没有权限！'
      })
    }
  }
  if (!store.state.rightCodeList.length) {
    store
      .dispatch('getRightCodeList')
      .then(res => {
        if (res.data.code === '0') {
          checkPermission()
        } else {
          this.$Message.error({
            content: res.data.message
          })
        }
      })
      .catch(error => {
        this.$Message.error({
          content: error.res.data.message
        })
      })
  } else {
    checkPermission()
  }
}
Date.prototype.Format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
Vue.filter('fmtTime', function(val) {
  return new Date(val).Format('yyyy-MM-dd')
})
new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.commit('setTagsList')
  }
}).$mount('#app')
