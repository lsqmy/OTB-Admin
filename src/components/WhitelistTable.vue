<template>
    <div>
      <Modal
        v-model="whitelistData.show"
        :title="whitelistData.title"
        :styles="{top:'30px'}"
        width="1200"
        @on-cancel="cancelWhite">
        <div class="container">
            <div class="layout-operate">
              <div class="btn-group">
                <Button type="primary" @click="checkPermission('1012:save',add)">新增</Button>
                <Button @click="checkPermission('1012:update',update)">修改</Button>
                <Button @click="checkPermission('1012:delete',batchDel)">删除</Button>
                <Button @click="checkPermission('1012:delete',enable)">启用</Button>
                <Button @click="checkPermission('1012:delete',disable)">禁用</Button>
              </div>
              <div class="query-group">
                <Input v-model.trim="query.fValueOne" placeholder="请输入参数值" style="width: 300px" @keyup.enter.native="checkPermission('1012:select',search)">
                  <Button type="primary" slot="append" @click="checkPermission('1012:select',search)">查询</Button>
                </Input>
                <Button @click="checkPermission('1012:select',reset)" class="btn">重置</Button>
              </div>
            </div>
            <Table :columns="columns" :data="data" stripe border height="640"
                   @on-selection-change="selection" @on-row-dblclick="dblclick" :loading="loading"></Table>
            <Page :total="page.total"  show-elevator show-sizer show-total class-name="page" :page-size-opts="page.pageSizePots"
                  @on-change="changePage" @on-page-size-change="changeNum" :current="query.pageNum"></Page>
        </div>
        <div slot="footer">
        </div>
      </Modal>
      <Row class="container-model">
        <Modal
          v-model="modalWhitelist.show"
          :title="modalWhitelist.title"
          :styles="{top:'240px'}"
          @on-cancel="cancel">
          <Form ref="formWhitelist" :model="formWhitelist" :rules="ruleValidate">
            <FormItem prop="fWhiteType">
              <Input v-model.trim="formWhitelist.fWhiteType" disabled>
              <span slot="prepend" class="model-form-head model-form-head-valid">名单类型</span>
              <Select v-model="formWhitelist.fWhiteType" slot="append" style="width:100px;text-align: left;">
                <Option value="1">IPv4</Option>
              </Select>
              </Input>
            </FormItem>
            <FormItem prop="fCheckType">
              <Input v-model.trim="formWhitelist.fCheckType" disabled>
              <span slot="prepend" class="model-form-head model-form-head-valid">核验类型</span>
              <Select v-model="formWhitelist.fCheckType" slot="append" style="width:100px;text-align: left;">
                <Option value="1">精准匹配</Option>
                <Option value="2">通配符匹配</Option>
                <Option value="3">区间范围</Option>
              </Select>
              </Input>
            </FormItem>
            <FormItem prop="fValueOne">
              <Input v-model.trim="formWhitelist.fValueOne" placeholder="请输入参数1"><span slot="prepend" class="model-form-head model-form-head-valid">参数1</span></Input>
            </FormItem>
            <FormItem prop="fValueTwo">
              <Input v-model.trim="formWhitelist.fValueTwo" placeholder="请输入参数2"><span slot="prepend" class="model-form-head model-form-head-valid">参数2</span></Input>
            </FormItem>
            <FormItem prop="fDescription">
              <Input v-model.trim="formWhitelist.fDescription" ><span slot="prepend" class="model-form-head">备注</span></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <i-button type="success" @click="confirm">确定</i-button>
            <i-button type="default" @click="cancel" class="model-btn">退出</i-button>
          </div>
        </Modal>
      </Row>
    </div>
</template>

<script>
  import {apiFetch} from "../axios/api";
  import {checkUnusualChar} from '../utils/validate'
  export default {
      name: "WhitelistTable",
      props:['whitelistData'],
      data(){
        return{
          data:[],
          columns: [
            {
              key:'fID',
              type: 'selection',
              width: 60,
              fixed:'left',
            },
            {
              title: '序号',
              key:'fID',
              width:65,
              align:'center',
              render: (h, params) => {
                return h('span', params.index + (this.query.pageNum- 1) * this.query.pageSize + 1);
              }
            },
            {
              title: '状态',
              key: 'fStatus',
              width:65,
              align:'center',
              render: (h, params) => {
                var color = '';
                var text = '';
                if(params.row.fStatus===1){
                  color = 'gray';
                  text = '保存';
                }else if(params.row.fStatus===2){
                  color = 'green';
                  text = '启用';
                }else{
                  color = 'red';
                  text = '禁用';
                }
                return h('span', {
                  style:{
                    color:color,
                  }
                }, text);
              },
            },
            {
              title: 'APPID',
              key: 'fAppID',
              width:150,
            },
            {
              title: '白名单类型',
              key: 'fWhiteType',
              width:150,
              render: (h, params) => {
                var color = '';
                var text = '';
                if(params.row.fWhiteType==="1"){
                  color = 'green';
                  text = 'IPv4';
                }else{
                  color = 'gray';
                  text = '其它';
                }
                return h('span', {
                  style:{
                    color:color,
                  }
                }, text);
              },
            },
            {
              title: '核验类型',
              key: 'fCheckType',
              width:150,
              render: (h, params) => {
                var color = '';
                var text = '';
                if(params.row.fCheckType==="1"){
                  color = 'gray';
                  text = '精准匹配';
                }else if(params.row.fStatus==="2"){
                  color = 'green';
                  text = '通配符匹配';
                }else{
                  color = 'thistle';
                  text = '区间范围';
                }
                return h('span', {
                  style:{
                    color:color,
                  }
                }, text);
              },
            },
            {
              title: '参数值1',
              key: 'fValueOne',
              width:150,
            },
            {
              title: '参数值2',
              key: 'fValueTwo',
              width:150,
            },
            {
              title: '创建者',
              key: 'fCreatorID',
              width:150,
            },
            {
              title: '创建时间',
              key: 'fCreateTime',
              width:150,
            },
            {
              title: '修改者',
              key: 'fLastUpdateUserID',
              width:150,
            },
            {
              title: '修改时间',
              key: 'fLastUpdateTime',
              width:150,
            },
            {
              title: '备注',
              key: 'fDescription',
              width:150,
            },
          ],
          page: {
            pageNum: 1,   //当前页
            total: 0,     //数据总数
            pageSize: 10,  //每页显示记录数
            pageSizePots: [10, 30, 50, 100], //页码配置
          },
          query:{},
          formWhitelist:{
            "fID": "",
            "fCreatorID": "",
            "fCreateTime": "",
            "fLastUpdateUserID": "",
            "fLastUpdateTime": "",
            "fAppID": "",
            "fWhiteType": "",
            "fCheckType": "",
            "fValueOne": "",
            "fValueTwo": "",
            "fStatus": null,
            "fDescription": ""
          },
          row:{},
          modalWhitelist:{
            show:false,
            title:'',
          },
          ruleValidate: {
            fWhiteType: [
              { required: true, message: '数据项不得为空！', trigger: 'change' },
              { type: 'string', max: 2, message: '最大长度不能超过2个字符！', trigger: 'change' },
              {validator: checkUnusualChar, trigger: 'change'},
            ],
            fCheckType: [
              { required: true, message: '数据项不得为空！', trigger: 'change' },
              { type: 'string', max: 2, message: '最大长度不能超过2个字符！', trigger: 'change' },
              {validator: checkUnusualChar, trigger: 'change'},
            ],
            fValueOne: [
              { required: true, message: '数据项不得为空！', trigger: 'change' },
              { type: 'string', max: 50, message: '最大长度不能超过50个字符！', trigger: 'change' },
              {validator: checkUnusualChar, trigger: 'change'},
            ],
            fValueTwo: [
              { required: true, message: '数据项不得为空！', trigger: 'change' },
              { type: 'string', max: 50, message: '最大长度不能超过50个字符！', trigger: 'change' },
              {validator: checkUnusualChar, trigger: 'change'},
            ],
            fDescription: [
              { type: 'string', max: 200, message: '最大长度不能超过200个字符！', trigger: 'change' },
              {validator: checkUnusualChar, trigger: 'change'},
            ],
          },
          loading:true,
          ids:[],
        }
      },
      methods:{
        //获取列表
        getList(data){
          const api = {
            url : '/app/white/selectAppInfoWhiteRuleList',
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

        //查询
        search(){
          this.query.pageNum = this.page.pageNum;
          this.query.pageSize = this.page.pageSize;
          this.query.fAppID = this.whitelistData.id;
          this.getList(this.query);
        },

        //重置
        reset(){
          this.query = {};
          this.query.pageNum = this.page.pageNum;
          this.query.pageSize = this.page.pageSize;
          this.query.fAppID = this.whitelistData.id;
          this.getList(this.query);
          this.ids=[];
          this.row={};
        },

        //新增
        add(){
          this.modalWhitelist.show = true;
          this.modalWhitelist.title = '新增';
          this.$refs.formWhitelist.resetFields();
          this.formWhitelist={};
          this.formWhitelist.fAppID = this.whitelistData.id;
        },

        //确认
        confirm(){
          this.$refs.formWhitelist.validate((valid) =>{
            if(valid){
              if(this.formWhitelist.fID){
                //修改
                const api = {
                  url : '/app/white/updateAppInfoWhiteRule',
                  method : 'post',
                  data:this.formWhitelist,
                };
                apiFetch(api).then(response => {
                  if(response.status === 200 && response.data.code === '0'){
                    this.modalWhitelist.show = false;
                    this.reset();
                  }else{
                    this.$Message.error({
                      content: response.data.message,
                    });
                  }
                }).catch(error => {
                  this.$Message.error({
                    content: error.response.data.message,
                  });
                });
              }else {
                //新增
                const api = {
                  url : '/app/white/insertAppInfoWhiteRule',
                  method : 'post',
                  data:this.formWhitelist,
                };
                apiFetch(api).then(response => {
                  if(response.status === 200 && response.data.code === '0'){
                    this.modalWhitelist.show = false;
                    this.reset();
                  }else{
                    this.$Message.error({
                      content: response.data.message,
                    });
                  }
                }).catch(error => {
                  this.$Message.error({
                    content: error.response.data.message,
                  });
                });
              }
            }else {
              return;
            }
          });
        },

        //退出
        cancel(){
          this.modalWhitelist.show = false;
          this.formWhitelist = {};
          this.reset();
        },

        //更新
        update(){
          if(this.ids.length !== 1){
            this.$Modal.error({
              content: "修改操作，只能选中一条数据进行操作！",
            });
            return;
          }
          this.modalWhitelist.show = true;
          this.modalWhitelist.title = "修改";
          this.$refs.formWhitelist.resetFields();
          this.formWhitelist ={};
          this.formWhitelist = this.row;
        },

        //双击事件
        dblclick(data,index){
          this.checkPermission("1012:update",this.check);
          this.$refs.formWhitelist.resetFields();
          this.formWhitelist={};
          this.formWhitelist = data;
        },
        check(){
          this.modalWhitelist.show = true;
          this.modalWhitelist.title = "修改";
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

        //删除
        batchDel(){
          const _this = this;
          if(_this.ids.length === 0){
            _this.$Modal.error({
              content: "删除操作，请至少选中一条数据进行操作！",
            });
            return;
          }
          _this.$Modal.confirm({
            content: '确定要删除所选中项吗？',
            onOk () {
              const api = {
                url : '/app/white/deleteAppInfoWhiteRuleBatch',
                method : 'delete',
                data:_this.ids,
              };
              apiFetch(api).then(response => {
                if(response.status === 200 && response.data.code === '0'){
                  setTimeout(()=>{
                    _this.$Modal.success({
                      content: response.data.message,
                    });
                  },500);
                }else{
                  setTimeout(()=>{
                    _this.$Modal.error({
                      content: response.data.message,
                    });
                  },500);
                }
                _this.reset();
              }).catch(error => {
                setTimeout(()=>{
                  _this.$Modal.error({
                    content: error.response.data.message,
                  });
                },500);
                _this.reset();
              });
            },
            onCancel(){
              _this.reset();
            },
          });
        },

        //启用
        enable(){
          const _this = this;
          if(_this.ids.length === 0){
            _this.$Modal.error({
              content: "启用操作，请至少选中一条数据进行操作！",
            });
            return;
          }
          _this.$Modal.confirm({
            content: '确定要启用所选中项吗？',
            onOk () {
              const api = {
                url : '/app/white/updateAppInfoWhiteRuleToEnableBatch',
                method : 'post',
                data:_this.ids,
              };
              apiFetch(api).then(response => {
                if(response.status === 200 && response.data.code === '0'){
                  setTimeout(()=>{
                    _this.$Modal.success({
                      content: response.data.message,
                    });
                  },500);
                }else{
                  setTimeout(()=>{
                    _this.$Modal.error({
                      content: response.data.message,
                    });
                  },500);
                }
                _this.reset();
              }).catch(error => {
                setTimeout(()=>{
                  _this.$Modal.error({
                    content: error.response.data.message,
                  });
                },500);
                _this.reset();
              });
            },
            onCancel(){
              _this.reset();
            },
          });
        },

        //禁用
        disable(){
          const _this = this;
          if(_this.ids.length === 0){
            _this.$Modal.error({
              content: "禁用操作，请至少选中一条数据进行操作！",
            });
            return;
          }
          _this.$Modal.confirm({
            content: '确定要禁用所选中项吗？',
            onOk () {
              const api = {
                url : '/app/white/updateAppInfoWhiteRuleToDisableBatch',
                method : 'post',
                data:_this.ids,
              };
              apiFetch(api).then(response => {
                if(response.status === 200 && response.data.code === '0'){
                  setTimeout(()=>{
                    _this.$Modal.success({
                      content: response.data.message,
                    });
                  },500);
                }else{
                  setTimeout(()=>{
                    _this.$Modal.error({
                      content: response.data.message,
                    });
                  },500);
                }
                _this.reset();
              }).catch(error => {
                setTimeout(()=>{
                  _this.$Modal.error({
                    content: error.response.data.message,
                  });
                },500);
                _this.reset();
              });
            },
            onCancel(){
              _this.reset();
            },
          });
        },

        //取消设置白名单
        cancelWhite(){
          this.whitelistData.show = false;
        }
      },
      watch:{
        'whitelistData.show': function() {
          if(this.whitelistData.show){
            this.checkPermission('1012:select',this.search);
          }
        }
      },
  }
</script>

<style scoped lang="scss">
  @import '../styles/subPublic';
</style>
