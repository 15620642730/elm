<template>
  <div class="">
  <div class="shopcart">
    <div class="content" @click="toggleList"><!--详情列表页-->
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right"  @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div  v-for="ball in balls" :key="ball.id">
        <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <div class="empty" @click="empty">清空</div>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
  <transition name="fade"><div class="list-mask" v-show="listShow" @click="hideList"></div></transition>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import cartcontrol from '../../components/cartcontrol/cartcontrol'

export default{
  components: {
    cartcontrol
  },
  data() {
    return{
      balls: [//小球初始隐藏
        {show: false},{show: false},{show: false},{show: false},{show: false},
      ],
      dropBalls: [],//存储已经下落的小球
      fold: true//购物车详情页列表默认折叠
    }
  },
  props: {
    selectFoods:{
      type: Array,
      default() {
        return [
          {
            price: 10,
            count: 1
          }
        ]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      })
      return count
    },
    payDesc() {
      if(this.totalPrice===0) {
        return `￥${this.minPrice}元起送`
      }else if(this.totalPrice<this.minPrice){
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      }else{
        return '去结算'
      }
    },
    payClass() {
      if(this.totalPrice< this.minPrice) {
        return 'not-enough'
      }else{
        return 'enough'
      }
    },
    listShow() {
      // 没有商品时为折叠状态
      if (!this.totalCount) {
        this.fold = true //不买商品，折叠状态
        return false;
      }
      // 有商品时用变量show做状态切换
      let show = !this.fold;//show默认false(折叠),fold为true(折叠),fold取反展开
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {//没有scroll的时候需要new
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    }
  },
  methods: {
    drop(el) {
      // console.log(el);//验证能否正确输出
      //遍历balls,拿到第一个show为false的球，做一个动画
      for (let i=0; i< this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;//显示
          ball.el = el;//保留当前的DOM对象，用来计算位置
          this.dropBalls.push(ball);//已经下落的小球
          return;
        }
      }
    },
    beforeEnter(el) {//el为当前执行transition动画的dom对象
    //先找到所有为true的小球(连续点击的情况)
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();//获得元素相当于适口的位置
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = '';//默认隐藏，设置为空
          //外层元素是纵向的动画，内层元素是横向的动画
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y},0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
          inner.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(el) {
      let rf = el.offsetHeight;//浏览器重绘,重绘之后才可以设置transform
      this.$nextTick(() => {//样式重置
        el.style.webkitTransform = 'translate3d(0,0,0)';//没有变量时只能用单引
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.getElementsByClassName('inner-hook')[0];
        inner.style.webkitTransform = 'translate3d(0,0,0)';
        inner.style.transform = 'translate3d(0,0,0)';
      })
    },
    afterEnter(el) {//动画完成
      let ball = this.dropBalls.shift();//把第一个元素删除，并返回第一个元素的值
      if (ball) {
        ball.show = false;//状态重置，重新利用
        el.style.display = 'none';
      }
    },
    toggleList() {
      if (!this.totalCount) {//购物车没有商品时不可点击
        return;
      }
      this.fold = !this.fold;//取反，当前是收起状态就展开，展开就收起
    },
    empty() {
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    hideList() {
      this.fold = true;
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;//当前价格小于最低配送价格不能结算
      }
      window.alert(`支付${this.totalPrice}元`);
      // window.alert(`支付`+this.totalPrice+`元`);
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixin.styl'

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    background: #000
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255,255,255,0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          vertical-align: top
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0,160,220)
            .icon-shopping_cart
              font-size: 24px
              color: #80858a
              line-height: 44px
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240,20,20)
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255,255,255,0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin: 12px 0 0 12px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      //外层 做纵向运动
      .ball
        position: fixed//相对于适口做布局
        left: 32px
        bottom: 22px
        z-index: 200
        //y轴 贝塞尔曲线
        /* &.drop-enter-active */
        transition: all 0.4s cubic-bezier(0.5,-0.3,0.8,0.3)
        //内层做横向运动
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0,160,220)
          //x轴只需要线性缓动
          transition: all 0.4s linear //从x轴做一个线性的过度即可
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0,-100%,0)//整个列表相对于当前自身的高度做一个偏移
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s linear
        transform: translate3d(0,-100%,0)
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0,0,0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240,20,20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)//模糊效果
    -webkit-backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7,17,27,0.6)
    &.fade-enter-active, &.fade-leave-active
      opacity: 1
      transition: all 0.5s//设置缓动效果
      background: rgba(7,17,27,0.6)
    &.fade-enter, &.fade-leave-to
      opacity: 0
      background: rgba(7,17,27,0)
</style>
