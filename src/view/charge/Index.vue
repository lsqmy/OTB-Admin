<template>
  <div class="container" ref="container">
    <Modal
      v-model="model.show"
      :title="model.title"
      :styles="{top:'5vh'}"
      width="70">
      <Form ref="form" :label-width="100" :model="productData" :rules="ruleValidate" class="">
<!--        <Row style="width: 100%;">-->
<!--          <Col span="8">-->
<!--            <div class="demo-upload-list" v-if="productData.productImgs!=null">-->
<!--              <template>-->
<!--                <img :src="productData.productImgs">-->
<!--                <div class="demo-upload-list-cover">-->
<!--                  <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>-->
<!--                </div>-->
<!--              </template>-->
<!--            </div>-->
<!--            <Upload-->
<!--              v-else-->
<!--              ref="upload"-->
<!--              :show-upload-list="false"-->
<!--              :on-success="handleSuccess"-->
<!--              :format="['jpg','jpeg','png']"-->
<!--              :max-size="2048"-->
<!--              :on-format-error="handleFormatError"-->
<!--              :on-exceeded-size="handleMaxSize"-->
<!--              type="drag"-->
<!--              action="/sss/common/upload"-->
<!--              :headers="uploadHeader"-->
<!--              style="display: inline-block;width:100%;">-->
<!--              <div style="width: 100%;height:100%;line-height: 205px;">-->
<!--                <Icon type="ios-add" size="40"></Icon>-->
<!--              </div>-->
<!--            </Upload>-->
<!--          </Col>-->
<!--          <Col span="16" class="wrap">-->
<!--            <FormItem prop="shopId" label="所属店铺">-->
<!--              <Select v-model.trim="productData.shopId">-->
<!--                <Option v-for="item in shopList" :key="item.shopId" :value="item.shopId">-->
<!--                  {{ item.shopName }}({{item.siteName}})-->
<!--                </Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
<!--            <FormItem prop="site" label="商品名称">-->
<!--              <Input v-model.trim="productData.productTitle"></Input>-->
<!--            </FormItem>-->
<!--            <FormItem prop="productNum" label="商品编号">-->
<!--              <Input v-model.trim="productData.productNum"></Input>-->
<!--            </FormItem>-->
<!--            <FormItem prop="site" label="SKU">-->
<!--              <Input v-model.trim="productData.productSku"></Input>-->
<!--            </FormItem>-->
<!--            <FormItem prop="productCount" label="商品数量">-->
<!--              <Input v-model.trim="productData.productCount"></Input>-->
<!--            </FormItem>-->
<!--          </Col>-->
<!--        </Row>-->
        <FormItem prop="productStyle" label="商户">
          <Select v-model.trim="productData.userNameSeller" filterable >
            <Option v-for="item in shopList" :key="item.userName" :value="item.userName">
              {{ item.userName }}({{ item.realName }})
            </Option>
          </Select>
        </FormItem>
        <FormItem prop="site" label="充值金额">
          <InputNumber :min="1" v-model="productData.amount"></InputNumber>
        </FormItem>
        <FormItem prop="site" label="充值方式">
          <Select v-model.trim="productData.from">
            <Option value="1">微信</Option>
            <Option value="2">支付宝</Option>
          </Select>
        </FormItem>
<!--        <Row>-->
<!--          <Col span="12">-->
<!--            <FormItem prop="site" label="单价">-->
<!--              <Input v-model.trim="productData.productPrice"></Input>-->
<!--            </FormItem>-->
<!--          </Col>-->
<!--          <Col span="12">-->
<!--            <FormItem prop="platform" label="单位">-->
<!--              <Select v-model.trim="productData.productPriceType">-->
<!--                <Option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId">-->
<!--                  {{ item.currency }}-->
<!--                </Option>-->
<!--              </Select>-->
<!--            </FormItem>-->
<!--          </Col>-->
<!--        </Row>-->
      </Form>
      <div slot="footer">
        <Button type="success" @click="productConfirm">确定</Button>
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
        <Button class="btn" type="primary" @click="add">新增</Button>
      </div>
      <div class="query-group" v-if="!queryFlag">
        <Input v-model.trim="query.fSuggestion" placeholder="请输入反馈意见内容！" style="width: 300px">
          <Button type="primary" slot="append" @click="search">查询</Button>
        </Input>
        <Button @click="reset" class="btn">重置</Button>
        <Button @click="more(true)" class="btn">更多查询</Button>
      </div>
    </div>
    <Table :columns="columns" :data="data" stripe border height="640" :loading="loading">
      <template slot-scope="{ row, index }" slot="img">
        <img :src="row.shopLogo" alt="" style="width: 100%;">
      </template>
    </Table>
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
          title: '创建时间',
          key: 'createTime',
          render: (h,params)=>{
            return h('span',
              new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss')
            );
          }
        },
        {
          title: '姓名',
          key: 'realName',
          render: (h, params) => {
            return h('span', params.row.realName + '(' + params.row.userName + ')');
          }
        },
        {
          title: '金额',
          key: 'amount',
          render: (h, params) => {
            return h('span', params.row.amount + '(元)');
          }
        },
        {
          title: '状态',
          key: 'statusName',
          align: 'center',
        },
        {
          title: '类型 ',
          key: 'typeName',
        },
        {
          title: '充值id',
          key: 'payId',
        },
        {
          title: '充值截图',
          key: 'payImgUrl',
          align: 'center',
          minWidth:150,
          slot:'img'
        },
        {
          title: '处理时间',
          key: 'processTime',
          minWidth:120,
          render: (h,params)=>{
            return h('span',
              new Date(params.row.processTime).Format('yyyy-MM-dd hh:mm:ss')
            );
          }
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
      shopList:[],
      productData: {},

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
  computed:{
    ...mapState(['siteList','currencyList','platformList'])
  },
  created() {
    this.search();
    this.getShopList();
  },
  methods: {
    //获取列表
    getList(data) {
      const api = {
        url: '/cts/seller/balanceInList',
        method: 'post',
        data: data,
      };
      apiFetch(api).then(response => {
        if (response.status === 200 && response.data.status === 1) {
          this.data = response.data.data
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
    getShopList() {
      const api = {
        url: '/cts/seller/list',
        method: 'post',
        data: {
          pageNum:1,
          pageSize:1000
        },
      };
      apiFetch(api).then(response => {
        if (response.status === 200 && response.data.status === 1) {
          this.shopList = response.data.data
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
      this.productData = {};
    },

    //确认
    productConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const api = {
            url: '/cts/seller/addBalanceIn',
            method: 'post',
            data: this.productData,
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
      this.productData = {};
      this.reset();
    },



    //更新
    update(data) {
      this.model.show = true;
      this.model.title = "修改";
      this.$refs.form.resetFields();
      this.productData = {...data};
    },

    //删除
    delProductById(productId) {
      const _this = this;
      _this.$Modal.confirm({
        content: '确定要删除所选中项吗？',
        onOk() {
          const api = {
            url: '/feedback/deleteFeedbackBatch',
            method: 'delete',
            data: productId,
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
      this.$set(this.productData, "productImgs", null);
    },
    handleSuccess(res, file) {
      this.$set(this.productData, "productImgs", res.data);
      console.log(this.productData.productImgs)
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
  .wrap{
    display: flex;
    flex-wrap: wrap;
    .ivu-form-item{
      width: 50%;
      flex-shrink: 0;
    }
  }
  .ivu-form-item{
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
.ivu-icon-ios-trash-outline{
  line-height: 100px;
  font-size: 30px !important;
}
</style>
