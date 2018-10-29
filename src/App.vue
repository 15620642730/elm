<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link tag="a" to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link tag="a" to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link tag="a" to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import header from './components/header/header'
import {urlParse} from 'common/js/util'
import data from '../data.json'
// const ERR_OK = 0

export default {
  name: 'App',
  components: {
    'v-header':header,
  },
  data() {
    return {
      seller: {
        id:(() => {
          let queryParam = urlParse();////解析urlParse,把id传给seller,seller取到
          // console.log(queryParam);
          return queryParam.id;
          //取到以后，发送请求的时候，我们需要把api给带上
        })()
      }
    }
  },
  created() {
    // this.$http.get('/api/seller')
    // .then(response => {
    //   // console.log(response)
    //   this.seller = response.data
    // }),response => {
    //   console.log(error)
    // }
    // this.$http.get('/api/seller').then(res => {
    //   console.log(res)
    //   this.seller = this.res.body.data
    // })
    // .catch(error => {
    //   console.log(error)
    // })
    // this.$http.get('/api/seller?id=' + this.seller.id).then((res) => {
    //   res = res.body;
    //   if(res.errno === ERR_OK) {
    //     // this.seller = res.data;
    //     this.seller = Object.assign({}, this.seller,res.data)
    //     // console.log(this.seller.id);
    //   }
    // })
    this.seller = data.seller;
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  /* @import "./common/stylus/icon.styl" */

  .tab
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    /* border-bottom: 1px solid rgba(7,17,27,0.1); */
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77,85,93)
        &.active
          color: rgb(240,20,20)
</style>
