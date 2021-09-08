<template>
    <div class="container">
      <p style="font-size: 24px;">页面找不到了!!!<span style="color: #47cb89;font-size: 24px;margin: 0 10px;">{{countDown}}</span>秒后，页面将跳转到登录界面！！！</p>
    </div>
</template>

<script>
    export default {
        name: "Error",
        data(){
          return {
            countDown:5,
          }
        },
        created(){
          let _this = this;
          const time = setInterval(function(){
            _this.countDown--;
            if(_this.countDown===1){
              window.location.href = '/';
              clearInterval(time);
            }
          }, 1000);
        },
    }
</script>

<style scoped>
  .container{
    display: flex;
    justify-content: center;
    margin-top: 150px;
  }
</style>
