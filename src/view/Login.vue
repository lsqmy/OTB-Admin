<template>
  <div class="login-container">
    <div>
      <img src="../assets/logo.png" style="height: 35px;margin:60px 15px 0 40px;float: left">
    </div>
    <div class="login-title">
      <p>管理端</p>
    </div>
    <div class="login-content">
      <h4 class="login-content-title">用户登录</h4>
      <div class="login-content-body"
           @keydown.enter="handleSubmit(1)">
        <Form ref="form"
              :model="form"
              :rules="rules">
          <FormItem prop="username">
            <Input v-model="form.username"
                   placeholder="请输入用户名"
                   class="formItem">
          <span slot="prepend">
            <i class="iconfont icon-username"
               style="color: #008BF6;font-size:30px;"></i>
          </span>
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password"
                   v-model="form.password"
                   placeholder="请输入密码"
                   class="formItem">
          <span slot="prepend">
            <i class="iconfont icon-password"
               style="color: #008BF6;font-size: 30px;"></i>
          </span>
            </Input>
          </FormItem>
        </Form>
      </div>
      <div class="login-content-btn">
        <Button type="primary"
                size="large"
                long
                @click="handleSubmit(1)">登录</Button>
        <router-link to="register">注册新用户</router-link>
      </div>
    </div>
<!--    <h1 class="company">深圳市亚略特生物识别科技有限公司</h1>-->
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "admin"
      },
      rules: {
        username: [{
          required: true,
          message: "请填写用户名",
          trigger: "blur"
        }],
        password: [{
          required: true,
          message: "请填写密码",
          trigger: "blur"
        }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            userName: this.form.username,
            pwd: md5(this.form.password)
          };
          sessionStorage.time = new Date().getTime();
          console.log(11111, data);
          this.$store.dispatch("setToken", data).then(res => {
            this.$store.state.tagsList = []
            this.$store.state.rightCodeList = []
            if (res.data.status === 1) {
              sessionStorage.setItem("user_info", JSON.stringify(data));
              this.$router.push({
                name: "index"
              });
            } else {
              this.$Message.error({
                content: res.data.message
              });
            }
          }).catch(error => {
            this.$Message.error({
              content: '认证失败'
            });
          });
        }
      })

    }
  }
};
</script>

<style lang="scss">
  .login-container {
    position: relative;
    height: 100%;
    background: url('../assets/bg.png') center center no-repeat;

    .ivu-input {
      height: 57px;
      font-size: 20px;
      padding-left: 5px;
      border: none;
      background-color: #fff;
      color: #333;
    }

    .ivu-input:focus {
      box-shadow: none;
    }

    .ivu-form-item-error .ivu-input {
      border-left: none;
    }

    .ivu-form-item-error .ivu-input:focus {
      box-shadow: none;
    }

    .ivu-form-item-error .ivu-input {
      border: none;
    }

    .ivu-form-item-error .ivu-input-group-append,
    .ivu-form-item-error .ivu-input-group-prepend {
      border-radius:10px;
      border: none;
    }

    .ivu-input-group-append,
    .ivu-input-group-prepend {
      padding-right: 15px;
      padding-left: 15px;
      background-color: #ffffff;
      border: none;
    }

    .ivu-btn-large {
      height: 57px;
      font-size: 28px;
      border-radius: 8px;
    }

    .login-title {
      padding-top: 50px;
      margin-left: 100px;

      p {
        color: #ffffff;
        font-size: 39px;
        letter-spacing: 1px
      }
    }

    .login-content {
      position: absolute;
      right: 50%;
      top: 50%;
      margin-right: -770px;
      margin-top: -258px;
      width: 500px;
      height: 516px;
      background: white;
      border-radius: 8px;

      .login-content-title {
        text-align: center;
        color: #008BF6;
        font-size: 30px;
        margin-top: 71px;
        font-weight: normal;
      }

      .login-content-body {
        margin-top: 69px;
        padding: 0 40px;

        .formItem {
          margin-bottom: 25px;
          border: 1px solid #dddee1;
          border-radius: 6px;
          overflow: hidden;
        }

        .formItem:hover {
          border: 1px solid #008BF6;
        }
      }

      .login-content-btn {
        margin-top: 30px;
        padding: 0 40px;
      }
    }

    .company {
      text-align: center;
      color: #fff;
      font-size: 20px;
      font-weight: normal;
      position: fixed;
      bottom: 20px;
      left: 0;
      right: 0;
    }
  }
</style>
