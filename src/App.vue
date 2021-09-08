<template>
<!--<div id="container">-->
  <router-view></router-view>
<!--</div>-->
</template>

<script>
export default {
  data() {
    return {
      timeout: 20 * 60 * 1000 //默认设置为：20*60*1000
    };
  },
  mounted() {
    this.getToken()
  },
  methods: {
    //定时获取token
    getToken() {
      setInterval(() => {
        if (!sessionStorage.getItem("user_info")) {
          return
        }
        //实现获取token的方法
        this.$store.dispatch("setToken", sessionStorage.getItem("user_info")).then(res => {
          if (res.status !== 200 || res.data.code !== "0") {
            sessionStorage.clear()
            this.$router.push("/")
          }
        }).catch(error => {
          sessionStorage.clear()
          this.$router.push("/")
        });
      }, this.timeout)
    }
  }
}
</script>
