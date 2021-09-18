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
      <template slot-scope="{ row, index }" slot="actions">
        <Button type="primary" size="small" style="margin-right: 5px" @click="update(row.settlementId)">详情</Button>
        <Button type="error" size="small" @click="giveMoneyById(row.settlementId)">结算</Button>
      </template>
    </Table>
    <Page :total="page.total" show-elevator show-sizer show-total class-name="page"
          :page-size-opts="page.pageSizePots"
          @on-change="changePage" @on-page-size-change="changeNum" :current="query.pageIndex"></Page>
    <Modal
      v-model="model.show"
      :title="model.title"
      :styles="{top:'5vh'}"
      width="70"
      @on-cancel="cancel">
      <Table :columns="detailColumns" :data="detailData" stripe border height="640"
             :loading="loading">
        <template slot-scope="{ row, index }" slot="payImg">
          <img :src="row.payImg" alt="" style="width: 100%;">
        </template>
      </Table>
      <Page :total="model.page.total" show-elevator show-sizer show-total class-name="page"
            :page-size-opts="model.page.pageSizePots"
            @on-change="changePage2" @on-page-size-change="changeNum2" :current="model.page.pageIndex"></Page>
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
          title: '序号',
          key: 'settlementId',
          width: 65,
          align: 'center',
          render: (h, params) => {
            return h('span', params.index + (this.query.pageNum - 1) * this.query.pageSize + 1);
          }
        },
        {
          title: '状态',
          key: 'statusName',
          align: 'center',
        },
        {
          title: '用户名',
          key: 'userName',
          render: (h, params) => {
            return h('span', params.row.userName + '(' + params.row.realName + ')');
          }
        },
        {
          title: '电话',
          key: 'phone',
        },
        {
          title: '订单总金额',
          key: 'orderPriceTotal',
          render: (h, params) => {
            return h('span', params.row.orderPriceTotal + '(' + params.row.unit + ')');
          }
        },
        {
          title: '佣金',
          key: 'commission',
          render: (h, params) => {
            return h('span', params.row.commission + '(' + params.row.unit + ')');
          }
        },
        {
          title: '账单时间',
          key: 'createTime',
          render: (h,params)=>{
            return h('span',
              new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss')
            );
          }
        },
        {
          title: '结算时间',
          key: 'processTime',
          render: (h,params)=>{
            return h('span',
              new Date(params.row.processTime).Format('yyyy-MM-dd hh:mm:ss')
            );
          }
        },
        {
          title: '操作',
          fixed: 'right',
          slot: 'actions'
        }
      ],
      page: {
        pageNum: 1,   //当前页
        total: 0,     //数据总数
        pageSize: 10,  //每页显示记录数
        pageSizePots: [10, 30, 50, 100], //页码配置
        sort: '',     //排序列
        order: 'desc', //排序规则
      },
      query: {
        pageNum: 1,
        pageSize: 10
      },

      detailColumns: [
        {
          title: '订单号',
          key: 'orderNo',
          width: 100,
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
        },
        {
          title: '订单金额',
          key: 'orderPrice',
          width: 100,
        },
        {
          title: '总金额',
          key: 'totalPrice',
          width: 100,
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
      ],
      detailData: [],
      query2: {},
      model: {
        show: false,
        title: '',
        page: {
          pageNum: 1,   //当前页
          total: 0,     //数据总数
          pageSize: 10,  //每页显示记录数
          pageSizePots: [10, 30, 50, 100], //页码配置
          sort: '',     //排序列
          order: 'desc', //排序规则
        },
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
        url: '/cts/settlement/buyAgentSettlementList',
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

    changePage2(pageNum) {
      this.query2.pageIndex = pageNum;
      this.query2.pageSize = this.model.page.pageSize;
      this.getDetailList(this.query2);
    },

    //切换每页显示条数
    changeNum2(pageSize) {
      this.query2.pageIndex = this.model.page.pageNum;
      this.query2.pageSize = this.model.page.pageSize = pageSize;
      this.getDetailList(this.query2);
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
    },


    //退出
    cancel() {
      this.model.show = false;
      this.reset();
    },


    //更新
    update(settlementId) {
      this.model.show = true;
      this.model.title = "结算单详情";
      this.query2.settlementId = settlementId;
      this.getDetailList();
    },
    //获取列表
    getDetailList(settlementId) {
      const api = {
        url: '/cts/settlement/buyAgentSettlementOrderList',
        method: 'post',
        data: this.query2,
      };
      apiFetch(api).then(response => {
        if (response.status === 200 && response.data.status === 1) {
          this.detailData = response.data.data || [];
          this.model.page.total = response.data.totalCount;
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

    //删除
    giveMoneyById(settlementId) {
      const _this = this;
      _this.$Modal.confirm({
        content: '确定要结算所选中项吗？',
        onOk() {
          let data=new FormData();
          data.append('settlementId',settlementId);
          const api = {
            url: '/cts/settlement/settlementForBuyerAgent',
            method: 'post',
            data: data,
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
