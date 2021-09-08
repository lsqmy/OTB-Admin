<template>
  <div class="login-container">
    <div>
      <img src="../assets/logo.png" style="height: 35px;margin:60px 15px 0 40px;float: left">
    </div>
    <div class="login-title">
      <p>通用平台统一管理系统</p>
    </div>
    <div class="login-content">
      <h4 class="login-content-title">用户注册</h4>
      <div class="login-content-body"
           @keydown.enter="handleSubmit(1)">
        <Form ref="form"
              :model="form"
              :rules="rules">
          <FormItem prop="userName">
            <Input v-model="form.userName"
                   placeholder="请输入用户名"
                   class="formItem">
          <span slot="prepend">
            <i class="iconfont icon-username"
               style="color: #008BF6;font-size:30px;"></i>
          </span>
            </Input>
          </FormItem>
          <FormItem prop="pwd">
            <Input type="password"
                   v-model="form.pwd"
                   placeholder="请输入密码"
                   class="formItem">
          <span slot="prepend">
            <i class="iconfont icon-password"
               style="color: #008BF6;font-size: 30px;"></i>
          </span>
            </Input>
          </FormItem>
          <FormItem prop="pwd2">
            <Input type="password"
                   v-model="form.pwd2"
                   placeholder="请再次输入密码"
                   class="formItem">
          <span slot="prepend">
            <i class="iconfont icon-password"
               style="color: #008BF6;font-size: 30px;"></i>
          </span>
            </Input>
          </FormItem>
          <FormItem prop="email">
            <Input type="email"
                   v-model="form.email"
                   placeholder="请输入邮箱"
                   class="formItem">
          <span slot="prepend">
            <Icon type="ios-mail-outline" style="color: #008BF6;font-size: 30px;"/>
          </span>
            </Input>
          </FormItem>
          <FormItem prop="phone">
            <Input type="tel"
                   v-model="form.phone"
                   placeholder="请输入手机号"
                   class="formItem">
          <span slot="prepend">
            <Icon type="ios-call-outline" style="color: #008BF6;font-size: 30px;"/>
          </span>
            </Input>
          </FormItem>
        </Form>
      </div>
      <div class="login-content-btn">
        <Button type="primary"
                size="large"
                long
                @click="handleSubmit(1)">注册</Button>
      </div>
    </div>
    <h1 class="company">深圳市亚略特生物识别科技有限公司</h1>
  </div>
</template>

<script>
import md5 from "js-md5";
import {apiFetch} from "../axios/api";
export default {
  data() {
    return {
      form: {
        userName: "admin",
        pwd: "123456",
        pwd2: "123456",
        email:'123@123.com',
        phone:'19089898989',
        realName:'aaa'
      },
      rules: {
        userName: [{
          required: true,
          message: "请填写用户名",
          trigger: "blur"
        }],
        pwd: [{
          required: true,
          message: "请填写密码",
          trigger: "blur"
        }, {
          type: "string",
          min: 6,
          message: "密码长度不能小于6位",
          trigger: "blur"
        }],
        pwd2: [{
          required: true,
          message: "请再次密码",
          trigger: "blur"
        }, {
          type: "string",
          min: 6,
          message: "密码长度不能小于6位",
          trigger: "blur"
        }],
      }
    };
  },
  methods: {
    handleSubmit(){
      let _this=this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          const api = {
            url : '/ibs/sos/register',
            method : 'post',
            data:_this.form,
          };
          console.log(123, api);
          _this.$api(api).then(response => {
            console.log(123131, response);
            if(response.status === 200 && response.data.code === '0'){

            }else{
              _this.$Modal.error({
                content: response.data.message,
              });
            }
          }).catch(error => {
            _this.$Modal.error({
              content: error.response,
            });
          })
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
      right: 10%;
      top: 50%;
      //margin-right: -770px;
      margin-top: -258px;
      width: 500px;
      //height: 516px;
      background: white;
      border-radius: 8px;

      .login-content-title {
        text-align: center;
        color: #008BF6;
        font-size: 30px;
        margin-top:20px;
        font-weight: normal;
      }

      .login-content-body {
        margin-top: 20px;
        padding: 0 40px;

        .formItem {
          border: 1px solid #dddee1;
          border-radius: 6px;
          overflow: hidden;
        }

        .formItem:hover {
          border: 1px solid #008BF6;
        }
      }

      .login-content-btn {
        margin: 25px 0;
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
