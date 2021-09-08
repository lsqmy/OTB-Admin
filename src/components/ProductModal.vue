<template>
  <Modal
    v-model="productModelShow"
    title="新增商品"
    :styles="{top:'5vh'}"
    width="70">
    <Form ref="form" :label-width="100" :model="productData" :rules="ruleValidate" class="">
      <Row style="width: 100%;">
        <Col span="8">
          <div class="demo-upload-list" v-if="productData.productImgs!=null">
            <template>
              <img :src="productData.productImgs">
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
        <Col span="16" class="wrap">
          <FormItem prop="site" label="商品名称">
            <Input v-model.trim="productData.productTitle"></Input>
          </FormItem>
          <FormItem prop="productNum" label="商品编号">
            <Input v-model.trim="productData.productNum"></Input>
          </FormItem>
          <FormItem prop="site" label="SKU">
            <Input v-model.trim="productData.productSku"></Input>
          </FormItem>
          <FormItem prop="productCount" label="商品数量">
            <Input v-model.trim="productData.productCount"></Input>
          </FormItem>
        </Col>
      </Row>
      <FormItem prop="productStyle" label="商品风格">
        <Input v-model.trim="productData.productStyle"></Input>
      </FormItem>
      <FormItem prop="site" label="搜索关键词">
        <Input v-model.trim="productData.productKeyword"></Input>
      </FormItem>
      <FormItem prop="site" label="商品网址">
        <Input v-model.trim="productData.productUrl"></Input>
      </FormItem>
      <FormItem prop="site" label="商品款式描述">
        <Input v-model.trim="productData.productDescription"></Input>
      </FormItem>
      <Row>
        <Col span="12">
          <FormItem prop="site" label="单价">
            <Input v-model.trim="productData.productPrice"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem prop="platform" label="单位">
            <Select v-model.trim="productData.productPriceType">
              <Option v-for="item in currencyList" :key="item.currencyId" :value="item.currencyId">
                {{ item.currency }}
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="success" @click="productConfirm">确定</Button>
    </div>
  </Modal>
</template>
<script>
    import {apiFetch} from "../axios/api";
    import store from "../store";
    export default {
      name: "ProductModal",
      data () {
        return {
          uploadHeader: {
            token: store.state.token
          },
          productModelShow: false,
          productData: {},
        }
      },
      props: ['itemData'],
      methods: {

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
