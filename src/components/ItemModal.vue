<template>
  <Modal
    v-model="itemData.show"
    :title="itemData.title"
    :styles="{top:'100px'}"
    width="780"
    @on-cancel="cancel">
    <div class="cotainer">
      <div class="fun-query">
        <Input v-model.trim="query.fName" placeholder="请输入名称！" class="input">
        <Button type="primary" slot="append" @click="search">查询</Button>
        </Input>
        <Button @click="reset" class="btn">重置</Button>
      </div>
      <Table :columns="columns" :data="data" stripe border height="500"
             @on-selection-change="selection" :loading="loading"></Table>
      <Page :total="page.total"  show-elevator show-sizer show-total class-name="page" :page-size-opts="page.pageSizePots"
            @on-change="changePage" @on-page-size-change="changeNum" :current="query.pageNum"></Page>
    </div>
    <div slot="footer">
      <i-button type="success" @click="confirm">确定</i-button>
      <i-button type="default" @click="cancel">退出</i-button>
    </div>
  </Modal>
</template>
<script>
    import {apiFetch} from "../axios/api";
    export default {
      name: "ItemModal",
      data () {
        return {
          data:[],
          columns:[],
          page: {
            pageNum: 1,   //当前页
            total: 0,     //数据总数
            pageSize: 10,  //每页显示记录数
            pageSizePots: [10, 30, 50, 100], //页码配置
          },
          query:{},
          row:{},
          ids:[],
          loading:true,
        }
      },
      props: ['itemData'],
      methods: {
        //获取列表
        getList(data){
          const api = {
            url : this.itemData.url,
            method : 'post',
            data:data,
          };
          this.loading = true;
          apiFetch(api).then(response => {
            this.loading = false;
            if(response.status === 200 && response.data.code === '0'){
              this.data = response.data.data.list;
              this.page.total = response.data.data.total;
            }else{
              this.$Modal.error({
                content: response.data.message,
              });
            }
          }).catch(error => {
            this.loading = false;
            this.$Modal.error({
              content: error.response.data.message,
            });
          });
        },
        //切换页码
        changePage(pageNum){
          this.query.pageNum = pageNum;
          this.query.pageSize = this.page.pageSize;
          this.getList(this.query);
        },

        //切换每页显示条数
        changeNum(pageSize){
          this.query.pageNum = this.page.pageNum;
          this.query.pageSize = this.page.pageSize = pageSize;
          this.getList(this.query);
        },
        //选择行数据
        selection(data){
          this.ids = [];
          this.row = {};
          data.forEach(item => {
            this.ids.push(item.fID);
          });
          if(data.length === 1){
            this.row = data[0];
          }
        },
        confirm(){
          if(this.ids.length>1){
            this.$Message.info('只能选择一条数据！');
            return
          }
          this.$emit('transferItem',this.row);
          this.itemData.show=false;
          this.reset();
        },
        cancel () {
          this.itemData.show = false;
          this.reset();
        },
        search(){
          this.query.pageNum = this.page.pageNum;
          this.query.pageSize = this.page.pageSize;
          this.query.fStatus = 2;
          this.getList(this.query);
        },
        reset(){
          this.query = {};
          this.query.pageNum = this.page.pageNum;
          this.query.pageSize = this.page.pageSize;
          this.query.fStatus = 2;
          this.getList(this.query);
          this.ids=[];
          this.row={};
        },
      },
      watch:{
        'itemData.show': function() {
          if(this.itemData.show){
            this.columns =this.itemData.columns;
            this.query.pageNum = this.page.pageNum;
            this.query.pageSize = this.page.pageSize;
            this.query.fStatus = 2;
            this.getList(this.query);
          }
        }
      },
    }
</script>

<style scoped lang="scss">
    .cotainer{
      .fun-query{
        margin-bottom: 18px;
        display: flex;
        justify-content: flex-end;
        .input{
          width:300px;
        }
        .btn{
          margin-left: 15px;
        }
      }
      .page{
        display: flex;
        justify-content: flex-end;
        margin-top: 15px;
      }
    }
</style>
