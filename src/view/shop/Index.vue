<template>
  <div class="container" ref="container">
    <Modal
      v-model="model.show"
      :title="model.title"
      :styles="{top:'240px'}"
      width="70"
      @on-cancel="cancel">
      <Form ref="form" :label-width="80" :model="shopData" :rules="ruleValidate">
        <Row>
          <Col span="8">
            <div class="demo-upload-list" v-if="shopData.shopLogo">
              <template>
                <img :src="shopData.shopLogo">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
                </div>
              </template>
            </div>
            <Upload
              v-else
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              type="drag"
              action="/sss/common/upload"
              :headers="uploadHeader"
              style="display: inline-block;width:100%;">
              <div style="width: 100%;height:100%;line-height: 205px;">
                <Icon type="ios-add" size="40"></Icon>
              </div>
            </Upload>
          </Col>
          <Col span="16">
            <FormItem prop="site" label="店铺站点">
              <Select v-model.trim="shopData.siteId">
                <Option v-for="item in siteList" :key="item.siteId" :value="item.siteId">{{ item.siteName }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="shopName" label="店铺名称">
              <Input v-model.trim="shopData.shopName"></Input>
            </FormItem>
            <FormItem prop="remark" label="备注">
              <Input v-model.trim="shopData.remark"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <i-button type="success" @click="confirm">确定</i-button>
        <i-button type="default" @click="cancel" class="model-btn">退出</i-button>
      </div>
    </Modal>
    <Form :model="query" v-if="queryFlag" class="layout-form">
      <FormItem label="反馈意见:" class="form-item-body">
        <Input v-model.trim="query.fSuggestion" placeholder="请输入反馈意见内容！"></Input>
      </FormItem>
      <FormItem label="创建时间:">
        <date-picker v-model.trim="query.startDate" @on-change="start"
                     type="datetime" format="yyyy-MM-dd HH:mm:ss"
                     :editable="false" placement="bottom"
                     placeholder="选择开始日期"></date-picker>
        <span>—</span>
        <date-picker v-model.trim="query.endDate" @on-change="end"
                     type="datetime" format="yyyy-MM-dd HH:mm:ss"
                     :editable="false" placement="bottom"
                     placeholder="选择结束日期"></date-picker>
      </FormItem>
      <FormItem>
        <Button @click="search" class="btn">查询</Button>
        <Button @click="reset" class="btn">重置</Button>
        <Button @click="more(false)" class="btn">隐藏</Button>
      </FormItem>
    </Form>
    <div class="layout-operate">
      <div class="btn-group">
<!--        <Button class="btn" type="primary" @click="add">新增</Button>-->
      </div>
      <div class="query-group" v-if="!queryFlag">
        <Input v-model.trim="query.fSuggestion" placeholder="请输入反馈意见内容！" style="width: 300px">
          <Button type="primary" slot="append" @click="search">查询</Button>
        </Input>
        <Button @click="reset" class="btn">重置</Button>
        <Button @click="more(true)" class="btn">更多查询</Button>
      </div>
    </div>
    <Table :columns="columns" :data="data" stripe border height="640"
           :loading="loading"></Table>
    <Page :total="page.total" show-elevator show-sizer show-total class-name="page"
          :page-size-opts="page.pageSizePots"
          @on-change="changePage" @on-page-size-change="changeNum" :current="query.pageIndex"></Page>
  </div>
</template>

<script>
import {apiFetch} from "../../axios/api";
import {checkUnusualChar} from '../../utils/validate'
import {mapState} from "vuex";
import store from "../../store";

export default {
  name: "shop",
  data() {
    return {
      uploadHeader: {
        token: store.state.token
      },
      data: [],
      columns: [
        {
          title: '姓名',
          key: 'realName',
          minWidth:100
        },
        {
          title: '电话',
          key: 'phone',
          minWidth:150
        },
        {
          title: '邮箱',
          key: 'email',
          minWidth:200
        },
        {
          title: '账户总金额',
          key: 'balance',
          align: 'center',
          minWidth:150
        },
        {
          title: '累计消费金额',
          key: 'cumulativeConsumption',
          align: 'center',
          minWidth:150
        },
        {
          title: '累计充值金额 ',
          key: 'cumulativeRecharge',
          minWidth:150
        },
        {
          title: '当前冻结金额（待结算）',
          key: 'frozenAmount',
          minWidth:200
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth:120
        },
      ],
      page: {
        pageNum: 1,   //当前页
        total: 0,     //数据总数
        pageSize: 10,  //每页显示记录数
        pageSizePots: [10, 30, 50, 100], //页码配置
        sort: '',     //排序列
        order: 'desc', //排序规则
      },
      query: {},
      shopData: {
        shopName: '',
        siteId: '',
        shopLogo: '',
        remark: '',
      },

      model: {
        show: false,
        title: '',
      },
      ruleValidate: {
        fSuggestion: [
          {required: true, message: '数据项不得为空！', trigger: 'change'},
          {type: 'string', max: 200, message: '最大长度不能超过200个字符！', trigger: 'change'},
          {validator: checkUnusualChar, trigger: 'change'},
        ],
        fDescription: [
          {type: 'string', max: 200, message: '最大长度不能超过200个字符！', trigger: 'change'},
          {validator: checkUnusualChar, trigger: 'change'},
        ],
      },
      loading: true,
      queryFlag: false,
    }
  },
  computed: {
    ...mapState(['siteList', 'currencyList', 'platformList'])
  },
  created() {
    this.search();
  },
  methods: {
    //获取列表
    getList(data) {
      const api = {
        url: '/cts/seller/list',
        method: 'post',
        data: data,
      };
      apiFetch(api).then(response => {
        if (response.status === 200 && response.data.status === 1) {
          this.data = response.data.data||[];
          this.page.total=response.data.totalCount;
          this.loading = false;
        } else {
          this.$Modal.error({
            content: response.data.msg,
          });
        }
      }).catch(error => {
        this.$Modal.error({
          content: error.response.data.msg,
        });
      });
    },

    //切换页码
    changePage(pageNum) {
      this.query.pageIndex = pageNum;
      this.query.pageSize = this.page.pageSize;
      this.getList(this.query);
    },

    //切换每页显示条数
    changeNum(pageSize) {
      this.query.pageIndex = this.page.pageNum;
      this.query.pageSize = this.page.pageSize = pageSize;
      this.getList(this.query);
    },

    //查询
    search() {
      this.query.pageIndex = this.page.pageNum;
      this.query.pageSize = this.page.pageSize;
      this.getList(this.query);
    },

    //更多查询
    more(data) {
      this.queryFlag = data;
    },

    start(dateFormat) {
      this.query.startDate = dateFormat;
    },

    end(dateFormat) {
      this.query.endDate = dateFormat;
    },

    //重置
    reset() {
      this.query = {};
      this.query.pageIndex = this.page.pageNum;
      this.query.pageSize = this.page.pageSize;
      this.getList(this.query);
    },

    //新增
    add() {
      this.model.show = true;
      this.model.title = '新增';
      this.$refs.form.resetFields();
      this.shopData = {
        shopName: '',
        siteId: '',
        shopLogo: '',
        remark: '',
      };
    },

    //确认
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const api = {
            url: '/ibs/product/addOrEditShopInfo',
            method: 'post',
            data: this.shopData,
          };
          apiFetch(api).then(response => {
            if (response.status === 200 && response.data.status === 1) {
              this.cancel()
            } else {
              this.$Message.error({
                content: response.data.msg,
              });
            }
          }).catch(error => {
            this.$Message.error({
              content: error.response.data.msg,
            });
          });
        }
      });
    },

    //退出
    cancel() {
      this.model.show = false;
      this.shopData = {
        shopName: '',
        siteId: '',
        shopLogo: '',
        remark: '',
      };
      this.reset();
    },


    //更新
    update(data) {
      this.model.show = true;
      this.model.title = "修改";
      this.$refs.form.resetFields();
      this.shopData = {...data};
    },

    //删除
    delShopById(shopId) {
      const _this = this;
      _this.$Modal.confirm({
        content: '确定要删除所选中项吗？',
        onOk() {
          const api = {
            url: '/feedback/deleteFeedbackBatch',
            method: 'delete',
            data: shopId,
          };
          apiFetch(api).then(response => {
            if (response.status === 200 && response.data.code === '0') {
              setTimeout(() => {
                _this.$Modal.success({
                  content: response.data.message,
                });
              }, 500);
            } else {
              setTimeout(() => {
                _this.$Modal.error({
                  content: response.data.message,
                });
              }, 500);
            }
            _this.reset();
          }).catch(error => {
            setTimeout(() => {
              _this.$Modal.error({
                content: error.response.data.message,
              });
            }, 500);
            _this.reset();
          });
        },
        onCancel() {
          _this.reset();
        },
      });
    },

    handleRemove() {
      this.$set(this.shopData, "shopLogo", null);
    },
    handleSuccess(res, file) {
      this.$set(this.shopData, "shopLogo", res.data);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      });
    },
  },
}
</script>

<style scoped lang="scss">
@import './../../styles/subPublic';

.layout-form {
  .wrap {
    display: flex;
    flex-wrap: wrap;

    .ivu-form-item {
      width: 50%;
      flex-shrink: 0;
    }
  }

  .ivu-form-item {
    width: 33%;
  }
}

.demo-upload-list {
  display: inline-block;
  width: 100%;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.ivu-icon-ios-trash-outline {
  line-height: 100px;
  font-size: 30px !important;
}
</style>




