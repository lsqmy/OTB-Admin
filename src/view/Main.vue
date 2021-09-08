<template>
  <Layout>
    <!--标题栏-->
    <Header class="layout-header">
      <div>
        <img src="../assets/logo.png" style="height: 27px;margin-top:30px;float: left">
        <h1>管理端</h1>
      </div>
      <div class="content">
        <h4 class="content-user">
          <i class="iconfont icon-member icon"></i>
          <Dropdown @on-click="dropdown"
                    trigger="click">
            <label class="title">{{username}}&nbsp;&nbsp;<Icon type="arrow-down-b"></Icon></label>
            <DropdownMenu slot="list">
              <DropdownItem divided
                            name="0">个人信息修改</DropdownItem>
              <DropdownItem divided
                            name="1">密码修改</DropdownItem>
              <DropdownItem divided
                            name="2">退出登录</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </h4>
        <h4 class="content-setting">
          <i class="iconfont icon-setting icon"
          ></i>
          <label class="title" @click="setting">设置</label>
        </h4>
        <h4 class="content-about">
          <i class="iconfont icon-about icon"
          ></i>
          <label class="title" @click="about">关于</label>
        </h4>
      </div>
      <Modal v-model="model.show"
             :title="model.title"
             :styles="{top:'240px'}"
             @on-cancel="cancel">
        <Form ref="formPass"
              :model="pwdData"
              >
          <FormItem prop="oldPwd">
            <Input v-model.trim="pwdData.oldPwd" placeholder="请输入原密码" type="password"><span slot="prepend" class="model-form-head model-form-head-valid">原密码</span></Input>
          </FormItem>
          <FormItem prop="pwd">
            <Input v-model.trim="pwdData.pwd" placeholder="请输入新密码" type="password"><span slot="prepend" class="model-form-head model-form-head-valid">新密码</span></Input>
          </FormItem>
          <FormItem prop="fRePassWord">
            <Input v-model.trim="pwdData.fRePassWord" placeholder="请输入确认密码" type="password"><span slot="prepend" class="model-form-head model-form-head-valid">确认密码</span></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="success" @click="confirm">确定</Button>
          <Button type="default" @click="cancel" class="model-btn">退出</Button>
        </div>
      </Modal>
<!--      <Modal v-model="personModel.show"
             :title="personModel.title"
             :styles="{top:'240px'}"
             @on-cancel="cancel">
        <Form ref="form"
              :model="form"
              :rules="ruleValidate">
          <FormItem prop="fNumber">
            <Input v-model.trim="form.fNumber" placeholder="请输入编号" disabled><span slot="prepend" class="model-form-head model-form-head-valid">编号</span></Input>
          </FormItem>
          <FormItem prop="fName">
            <Input v-model.trim="form.fName" placeholder="请输入名称" disabled><span slot="prepend" class="model-form-head model-form-head-valid">名称</span></Input>
          </FormItem>
          <FormItem prop="fEmail">
            <Input v-model.trim="form.fEmail" placeholder="请输入用户邮箱"><span slot="prepend" class="model-form-head">邮箱</span></Input>
          </FormItem>
          <FormItem prop="fMobile">
            <Input v-model.trim="form.fMobile" placeholder="请输入用户手机号"><span slot="prepend" class="model-form-head">手机号</span></Input>
          </FormItem>
          <FormItem prop="fQQ">
            <Input v-model.trim="form.fQQ" placeholder="请输入用户QQ号"><span slot="prepend" class="model-form-head">QQ</span></Input>
          </FormItem>
          <FormItem prop="fWeiXin">
            <Input v-model.trim="form.fWeiXin" placeholder="请输入用户微信号"><span slot="prepend" class="model-form-head">微信</span></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <i-button type="success"
                    @click="personConfirm">确定</i-button>
          <i-button type="default"
                    @click="personCancel"
                    class="model-btn">退出</i-button>
        </div>
      </Modal>-->
      <Modal v-model="aboutModel.show"
             :title="aboutModel.title"
             :styles="{top:'240px'}">
        <Card>
          <p>
            <label class="about-header">系统名称:</label><span class="about-body">通用平台统一管理系统</span>
          </p>
          <p>
            <label class="about-header">系统版本:</label><span class="about-body">V1.0.0</span>
          </p>
<!--          <p>
            <label class="about-header">开发公司:</label><span class="about-body">深圳市亚略特生物识别科技有限公司</span>
          </p>-->
        </Card>
        <div slot="footer">
        </div>
      </Modal>
    </Header>

    <Layout>
      <!--导航栏-->
      <Sider ref="side"
             class="layout-sider">
        <Menu ref="menu"
              accordion
              theme="dark"
              width="auto"
              @on-select="menuSelect"
              :open-names="openNames"
              :active-name="activeName">
          <MenuItem name="index">
            <Icon type="ios-people" />
            首页
          </MenuItem>
          <MenuItem name="money">
            <Icon type="ios-people" />
            账务信息
          </MenuItem>
          <MenuItem name="task">
            <Icon type="ios-people" />
            订单列表
          </MenuItem>
          <MenuItem name="agent">
            <Icon type="ios-people" />
            代理列表
          </MenuItem>
          <MenuItem name="shop">
            <Icon type="ios-people" />
            商户列表
          </MenuItem>
          <MenuItem name="charge">
            <Icon type="ios-people" />
            商户充值
          </MenuItem>

        </Menu>
      </Sider>
      <Layout>
        <Content class="layout-content">
          <Tabs type="card"
                @on-tab-remove="handleTabRemove"
                :animated="true"
                :value="activeTab"
                @on-click="handleTabClick">
            <TabPane name="首页" label="首页"></TabPane>
            <TabPane v-for="(item,i) in tabList"
                     :key="item.fLink + i"
                     :label="item.fName"
                     :name="item.fName"
                     closable>
            </TabPane>
          </Tabs>
          <keep-alive :include="currentAlive">
            <router-view></router-view>
          </keep-alive>
        </Content>
        <Footer class="layout-footer">
<!--          <span style="opacity: .25;">
              Copyright&copy; 2019 深圳市亚略特生物识别科技有限公司 . &nbsp;&nbsp;&nbsp;&nbsp;All rights reserved
          </span>-->

        </Footer>
      </Layout>
    </Layout>
  </Layout>
</template>

<script>
import {mapActions} from 'vuex'
  import Home from '../components/Home'
  import {
    checkUnusualChar,
    checkMobile
  } from '../utils/validate'
  import md5 from 'js-md5'
  export default {
    name: "Main",
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不得为空！'));
        } else {
          if (this.form.fRePassWord !== '') {
            // 对第二个密码框单独验证
            this.$refs.formPass.validateField('fRePassWord');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('确认密码不得为空！'));
        } else if (value !== this.form.pwd) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };
      return {
        username: JSON.parse(sessionStorage.getItem("user_info")).userName,
        menuList: [],
        subMenuList: [],
        taskMonitorProgramAdd: '',
        taskMonitorProgramUrl: '',
        tabList: [],
        activeTab: '', //激活的tab
        openNames: [],
        activeName: '', //激活的menu
        aliveRoute: [{
          name: 'sales_edit',
          title: '销售编辑',
          route: 'SalesEdit'
        }], //允许缓存的路由
        currentAlive: [], //当前激活缓存的路由
        pwdData: {},
        model: {
          show: false,
          title: "",
        },
        form: {},
        personModel: {
          title: "",
          show: false,
        },
        aboutModel: {
          title: "",
          show: false,
        },
        ruleValidate: {
          oldPwd: [{
            required: true,
            message: '数据项不得为空！',
            trigger: 'change'
          }, {
            type: 'string',
            max: 100,
            message: '最大长度不能超过100个字符！',
            trigger: 'change'
          }, {
            validator: checkUnusualChar,
            trigger: 'change'
          }, ],
          pwd: [{
            required: true,
            message: '数据项不得为空！',
            trigger: 'change'
          }, {
            type: 'string',
            max: 100,
            message: '最大长度不能超过100个字符！',
            trigger: 'change'
          },{
            type: 'string',
            min: 6,
            message: '密码长度不得低于6位！',
            trigger: 'change'
          }, {
            validator: checkUnusualChar,
            trigger: 'change'
          }, {
            validator: validatePass,
            trigger: 'change'
          }, ],
          fRePassWord: [{
            required: true,
            message: '数据项不得为空！',
            trigger: 'change'
          }, {
            type: 'string',
            max: 100,
            message: '最大长度不能超过100个字符！',
            trigger: 'change'
          }, {
            validator: checkUnusualChar,
            trigger: 'change'
          }, {
            validator: validatePassCheck,
            trigger: 'change'
          }, ],
          fNumber: [{
            required: true,
            message: '数据项不得为空！',
            trigger: 'change'
          }, {
            type: 'string',
            max: 80,
            message: '编号最大长度不能超过80个字符！',
            trigger: 'change'
          }, {
            validator: checkUnusualChar,
            trigger: 'change'
          }, ],
          fName: [{
            required: true,
            message: '数据项不得为空！',
            trigger: 'change'
          }, {
            type: 'string',
            max: 100,
            message: '最大长度不能超过100个字符！',
            trigger: 'change'
          }, {
            validator: checkUnusualChar,
            trigger: 'change'
          }, ],
          fEmail: [{
            type: 'string',
            max: 100,
            message: '最大长度不能超过100个字符！',
            trigger: 'change'
          }, {
            type: 'email',
            message: '无效的邮箱格式！',
            trigger: 'change'
          }, ],
          fMobile: [{
            validator: checkMobile,
            trigger: 'change'
          }, ],
          fQQ: [{
            type: 'string',
            max: 30,
            message: '最大长度不能超过30个字符！',
            trigger: 'change'
          }, {
            validator: checkUnusualChar,
            trigger: 'change'
          }, ],
          fWeiXin: [{
            type: 'string',
            max: 80,
            message: '最大长度不能超过80个字符！',
            trigger: 'change'
          }, {
            validator: checkUnusualChar,
            trigger: 'change'
          }, ],
        },
        link: true,
      }
    },
    watch: {
      $route(route) {
        // this.updateMenu(route)
        // 插入允许缓存的路由
        this.aliveRoute.some(item => {
          if (item.name === route.name && this.currentAlive.indexOf(item.route) < 0) {
            this.currentAlive.push(item.route)
            return true
          }
        })
      }
    },
    mounted() {
      this.tabList = this.$store.state.tagsList;
      this.getSiteList();
      this.getPlatformList();
      // this.getUserMenuList()
    },
    methods: {
      ...mapActions(['getSiteList','getPlatformList']),
      //获取菜单树
      getUserMenuList() {
        const api = {
          url: '/menu/selectMenuTreeByCurrentUser',
          method: 'get'
        }
        this.$api(api).then(response => {
          if (response.data.code === '0') {
            if (response.data.data.length > 0) {
              const rightcodelist = []
              this.menuList = response.data.data[0].childList
              this.menuList.forEach(item => {
                // item.fIcon = 'iconfont icon-'+item.fIcon;
                if (item.childList) {
                  this.subMenuList = this.subMenuList.concat(item.childList)
                }
              })
              this.updateMenu(this.$route)
            }
          } else {
            this.$Message.error({
              content: response.data.message
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 更新菜单标签
      updateMenu(route) {
        let has = this.tabList.some(item => {
          if (item.fName === route.meta.title) {
            item.fNumber = route.params.fNumber
            return true
          } else {
            return false
          }
        })
        if (!has && route.name !== 'index') {
          this.$store.commit('createTag', {
            fNumber: route.params.fNumber,
            fLink: route.name,
            fName: route.meta.title
          })
        }
        this.activeTab = route.meta.title
        this.openNames = []
        this.activeName = ''
        this.menuList.some(menu => {
          if (menu.fName === route.matched[0].meta.title) {
            this.openNames.push(menu.fName)
            this.activeName = route.name.replace('_edit', '_list')
            return true
          }
        })
        this.$nextTick(() => {
          this.$refs.menu.updateOpened()
          this.$refs.menu.updateActiveName()
        })
      },
      //点击菜单事件
      menuSelect(link) {
        console.log(13123, link);
        let menuObj={
          'index':'首页',
          'money':'余额充值',
          'deal':'交易记录',
          'agent':'代理列表',
          'charge':'商户充值',
          'shop':'商户列表',
          'task':'订单列表',
        };
        console.log(link === 'index');
        if(link!=='index'&&!this.tabList.some(tab => tab.fLink === link)){
          console.log(2222);
          this.$store.commit('createTag', {
            fLink: link,
            fName: menuObj[link]
          })
        }
        this.$router.push({
          name: link
        })
      },
      //tab标签页移除切换
      handleTabRemove(name) {
        this.$store.commit('removeTag', name)
        if (this.tabList.length > 0) {
          if (name !== this.activeTab) {
            return
          }
          this.handleTabClick(this.tabList[this.tabList.length - 1].fName)
        } else {
          this.handleTabClick('首页')
        }
        // 清除已缓存的路由
        this.aliveRoute.some(item => {
          if (item.title === name) {
            this.currentAlive.splice(this.currentAlive.indexOf(item.route), 1)
            return true
          }
        })
      },
      //点击tab标签页
      handleTabClick(name) {
        if (name === this.activeTab) {
          return
        }
        if (name === '首页') {
          this.$router.push({
            name: 'index'
          })
          this.activeTab = '首页'
        } else {
          this.tabList.some(item => {
            if (item.fName === name) {
              this.$router.push({
                name: item.fLink,
                params: {
                  fNumber: item.fNumber
                }
              })
              return true
            }
          })
        }
      },


      dropdown(data) {
        if (data === "0") {
          //个人信息修改
          this.personModel.show = true;
          this.personModel.title = "个人信息修改";
          this.$refs.form.resetFields();
          this.form = {};
          this.getUserInfo();
        } else if (data === "1") {
          //密码修改
          this.model.show = true;
          this.model.title = "密码修改";
          this.$refs.formPass.resetFields();
          this.form = {};
        } else {
          this.logout();
        }
      },
      confirm() {
        this.$refs.formPass.validate((valid) => {
          //TODO 校验有问题
          if (valid) {
            this.pwdData.fRePassWord = null;
            const api = {
              url: '/ibs/user/editPwd',
              method: 'post',
              data: this.pwdData,
            };
            this.$api(api).then(response => {
              if (response.status === 200 && response.data.status === 1) {
                this.model.show = false;
                this.$Message.success({
                  content: response.data.msg,
                });
                let data = {
                  userName: this.username,
                  pwd: this.pwdData.pwd,
                };
                sessionStorage.setItem("user_info", JSON.stringify(data));
              } else {
                this.pwdData = {};
                this.$Message.error({
                  content: response.data.msg,
                });
                this.$refs.formPass.resetFields();
              }
            }).catch(error => {
              this.form = {};
              this.$Message.error({
                content: error.response.data.msg,
              });
              this.$refs.formPass.resetFields();
            });
          } else {
            return;
          }
        });
      },
      cancel() {
        this.model.show = false;
        this.$refs.formPass.resetFields();
        this.form = {};
      },
      personConfirm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const api = {
              url: '/user/updateCurrentUserInfo',
              method: 'post',
              data: this.form,
            };
            this.$api(api).then(response => {
              if (response.status === 200 && response.data.code === '0') {
                this.personModel.show = false;
                this.$Message.success({
                  content: response.data.message,
                });
              } else {
                this.$Message.error({
                  content: response.data.message,
                });
              }
            }).catch(error => {
              this.$Message.error({
                content: error.response.data.message,
              });
            });
          } else {
            return;
          }
        });
      },
      personCancel() {
        this.personModel.show = false;
        this.$refs.form.resetFields();
        this.form = {};
      },
      //退出登录
      logout() {
        const api = {
          url: '/ibs/user/quitLogin',
          method: 'get',
        };
        this.$api(api).then(response => {
          if (response.status === 200 && response.data.status === 1) {
            sessionStorage.clear();
            this.$store.state.tagsList = []
            this.$store.state.rightCodeList = []
            this.$router.push({
              name: 'login'
            });
          } else {
            this.$Message.error({
              content: response.data.message,
            });
          }
        }).catch(error => {
          this.$Message.error({
            content: error.response.data.message,
          });
        });
      },
      //设置
      setting() {
        this.menuSelect('param');
      },
      //关于
      about() {
        this.aboutModel.show = true;
        this.aboutModel.title = "关于";
      },
    },
    components: {
      home: Home,
    },
  }
</script>

<style lang="scss">
  .model-form-head {
    display: inline-block;
    width: 55px;
  }

  .model-form-head-valid {
    position: relative;
    bottom: 2px;
  }

  .model-form-head-valid:before {
    content: "*";
    color: #ff4949;
    margin-right: 2px;
    font-size: 20px;
    position: relative;
    top: 7px;
  }

  .ivu-table-fixed,
  .ivu-table-fixed-right {
    box-shadow: none;
  }

  .ivu-checkbox-indeterminate .ivu-checkbox-inner {
    background-color: #19be6b;
    border-color: #19be6b;
  }

  .about-header {
    margin-right: 15px;
    margin-top: 15px;
    width: 80px;
    font-size: 16px;
    font-weight: bolder;
    display: inline-block;
    text-align: right;
  }

  .about-body {
    font-size: 16px;
    display: inline-block;
    text-align: left;
  }


  .ivu-layout {
    height: 100%;
    background: url(../assets/main-bg.png) center top no-repeat;
  }

  .layout-sider {
    min-width: 226px !important;
    border-right: 1px solid #094175;
    background: #001a47;
    header-bg.jpg
    .sider-header {
      img {
        margin: 40px 50px;
      }
    }

    .ivu-menu-dark {
      background: none;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
      background: rgba(0, 0, 0, 0.2);
    }

    /*.menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 90px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
      }
      .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 18px;
      }*/
    .ivu-menu-submenu-title {
      img {
        margin-right: 5px;
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: middle;
      }

      label {
        display: inline-block;
        vertical-align: middle;
        font-size: 16px;

      }
    }
  }

  .layout-header {
    height: 85px;
    display: flex;
    padding: 0 50px 0 30px;
    background: url('../assets/header-bg.jpg') right top no-repeat;
    justify-content: space-between;

    h1 {
      font-weight: 500;
      margin-left: 160px;
      margin-top: 22px;
      font-size: 28px;
      color: #ffffff;
      line-height: 45px;
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .icon {
        font-size: 20px;
        color: #78C5FD;
        margin-right: 5px
      }

      h4 {
        color: #fff;
        font-size: 14px;
        font-weight: normal;
        margin-left: 30px;
        display: flex;
        align-items: center;
        height: 45px;

        img {
          margin-right: 8px;
        }

        /*.title:hover {
          cursor: pointer;
        }*/
      }
    }
  }

  .layout-content {
    margin-top: 20px;

  }

  .layout-footer {
    height: 39px;
    padding: 0;
    border: none;
    background: none;
    text-align: center;
    color: #78C5FD;
    font-size: 12px;
    line-height: 39px;
    /*opacity: .25;*/
  }
</style>
