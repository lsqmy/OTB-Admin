<template>
  <div class="container">
    <section class="userInfoWrap">
      <Form :model="userInfo" label-position="left" :label-width="100">
        <FormItem label="用户名">
          <Input v-model="userInfo.userName" readonly></Input>
        </FormItem>
        <FormItem label="邮箱">
          <Input v-model="userInfo.email" readonly></Input>
        </FormItem>
        <FormItem label="手机号">
          <Input v-model="userInfo.phone" readonly></Input>
        </FormItem>
        <FormItem label="注册时间">
<!--          <span>{{userInfo.createTime|fmtTime}}</span>-->
          <Input :value="userInfo.createTime|fmtTime" readonly></Input>
        </FormItem>
      </Form>
    </section>
    <Row :gutter="16">
      <Col span="12">
        <Card>
          <Table :columns="siteColumn" :data="siteList"></Table>
        </Card>
      </Col>
      <Col span="12">
        <Card>
          <Table :columns="currencyColumn" :data="currencyList"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import {apiFetch} from "../../axios/api";
import {mapState} from "vuex";

export default {
  name: "Home",
  data(){
    return {
      siteColumn: [
        {
          title: '站点',
          key: 'siteName'
        },
        {
          title: '订单价格',
          key: 'orderCommission'
        },
      ],
      currencyColumn: [
        {
          title: '币种',
          key: 'currency'
        },
        {
          title: '汇率（兑人民币）',
          key: 'exchangeRate'
        },
      ],
    }
  },
  computed:{
    ...mapState(['userInfo','siteList','currencyList','platformList'])
  },
  mounted() {
    // this.getUserInfo();
    console.log(1111,this.$store.state.userInfo);
  },
  methods: {
    //获取列表
    getUserInfo(data) {
      const api = {
        url: '/ibs/user/indexInfo',
        method: 'get',
      };
      apiFetch(api).then(response => {
        if (response.status === 200 && response.data.status === 1) {
          let data = response.data.data;
          this.siteList = data.sites||[];
          this.currencyList = data.currency||[];
          this.seller = data.seller||{};
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
  }
}
</script>

<style lang="less" scoped>
 .userInfoWrap{
   padding: 15px 10px;
 }
</style>
