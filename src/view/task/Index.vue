<template>
  <div class="container" ref="container">
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
           :loading="loading">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="showDetail(row)">查看详情</Button>
      </template>
    </Table>
    <Page :total="page.total" show-elevator show-sizer show-total class-name="page"
          :page-size-opts="page.pageSizePots"
          @on-change="changePage" @on-page-size-change="changeNum" :current="query.pageIndex"></Page>
    <Modal
      v-model="model.show"
      :title="model.title"
      :styles="{top:'240px'}"
      width="70"
      @on-cancel="cancel">
      <Table :columns="productColumns" :data="productList" stripe border height="640"
             :loading="loading">
        <template slot-scope="{ row, index }" slot="payImg">
          <img :src="row.payImg" alt="" style="width: 100%;">
        </template>
      </Table>
    </Modal>
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
          title: '订单号',
          key: 'orderNo',
          width: 100,
        },
        {
          title: '状态',
          key: 'statusName',
          width: 100,
        },
        {
          title: '订单金额',
          key: 'orderPrice',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.orderPrice + '(' + params.row.unit + ')');
          }
        },
        {
          title: '总金额',
          key: 'totalPrice',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.totalPrice + '(元)');
          }
        },
        {
          title: '币种',
          key: 'currencyType',
          width: 100,
        },
        {
          title: '截图',
          key: 'payImg',
          slot: 'payImg',
          width: 100,
        },
        {
          title: '商铺订单号',
          key: 'shopOrderNo',
          width: 100,
        },
        {
          title: '代理',
          key: 'userNameAgent',
          width: 100,
        },
        {
          title: '刷手',
          key: 'userNameBuyer',
          width: 100,
        },
        {
          title: '平台',
          key: 'platform',
          width: 100,
        },
        {
          title: '站点',
          key: 'siteId',
          width: 100,
        },
        {
          title: '商家',
          key: 'userNameSeller',
          width: 100,
        },
        {
          title: '佣金',
          key: 'commission',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.commission + '(' + params.row.unit + ')');
          }
        },
        {
          title: 'doDate',
          key: 'doDate',
          width: 150,
        },

        {
          title: '创建时间',
          key: 'createTime',
          width: 150,
          render: (h,params)=>{
            return h('span',
              new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss')
            );
          }
        },
        {
          title: '处理时间',
          key: 'processTime',
          width: 150,
          render: (h,params)=>{
            return h('span',
              new Date(params.row.processTime).Format('yyyy-MM-dd hh:mm:ss')
            );
          }
        },
        {
          title: '提交时间',
          key: 'commitTime',
          width: 150,
          render: (h,params)=>{
            return h('span',
              new Date(params.row.commitTime).Format('yyyy-MM-dd hh:mm:ss')
            );
          }
        },
        {
          title: '完成时间',
          key: 'completeTime',
          width: 150,
          render: (h,params)=>{
            return h('span',
              new Date(params.row.completeTime).Format('yyyy-MM-dd hh:mm:ss')
            );
          }
        },
        {
          title: '操作',
          width: 150,
          slot: 'action'
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
      productColumns: [
        {
          title: '商品编号',
          key: 'productNum',
          minWidth: 150,
        },
        {
          title: 'SKU',
          key: 'productSku',
          minWidth: 150,
        },
        {
          title: '搜索关键词',
          key: 'productKeyword',
          minWidth: 150,
        },
        {
          title: '商品网址',
          key: 'productUrl',
          minWidth: 150,
        },
        {
          title: '商品名称',
          key: 'productTitle',
          minWidth: 150,
        },
        {
          title: '商品款式描述',
          key: 'productDescription',
          minWidth: 150,
        },
        {
          title: '单价',
          key: 'productPrice',
          minWidth: 150,
        },
        {
          title: '单位',
          key: 'productPriceType',
          minWidth: 150,
        },
        {
          title: '商品图片',
          slot: 'productImg',
          minWidth: 150,
        },
      ],
      productList: [],
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
        url: '/cts/order/orderList',
        method: 'post',
        data: data,
      };
      apiFetch(api).then(response => {
        if (response.status === 200 && response.data.status === 1) {
          this.data = response.data.data || [];
          this.page.total = response.data.totalCount;
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


    //退出
    cancel() {
      this.model.show = false;
      this.reset();
    },


    //更新
    showDetail(data) {
      this.model.show = true;
      this.model.title = "订单详情";
      this.productList = data.productList;
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




