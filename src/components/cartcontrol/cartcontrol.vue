<template>
  <div class="cartcontrol">
      <transition name="move">
        <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
          <transition name="inner">
          <!--内层滚动，滚动时包含字体，字体在inner中-->
            <span class="inner icon-remove_circle_outline"></span>
          </transition>
        </div>
      </transition>
    <div class="cart-count"  v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div><!--加号图标-->
  </div>
</template>
<script>
import Vue from 'vue'

export default{
  data() {
    return{
    }
  },
  props: {
    food: {
      type: Object
    }
  },
  // created() {
  //   console.log(this.food);
  // },
  methods: {
    //解决PC端双点击的问题
    addCart(event) {
      if (!event._constructed) {
        return;
      }
      // console.log('click');
      if (!this.food.count) {
        Vue.set(this.food, 'count',1)
      } else {
        this.food.count++;
      }
      this.$emit('cart-add', event.target)//添加事件，cart-add参数，event.target对象
    },
    decreaseCart(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  /* .cartcontrol
    font-size: 0
    .cart-decrease, .cart-add
      display: inline-block
      padding: 6px
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
        opacity: 1
        transform translate3d(0,0,0)
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px,0,0)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        vertical-align: top
        color: rgb(0,160,220,0.2)
        &.inner-enter-active, &.inner-leave-active
          transition: all 0.4s linear
          opacity: 1
          transform: rotate(0)
        &.inner-enter, &.inner-leave-active
          opacity: 0
          transform: rotate(180deg) */
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      .inner
        display: inline-block
        font-size: 24px
        line-height: 24px
        color: rgb(0,160,220)
      &.move-enter,&.move-leave-to
        opacity: 0
        transform: translate3d(24px,0,0)
        .inner
          transform: rotate(90deg)
      &.move-enter-to,&.move-leave
        opacity: 1
        transform: translate3d(0,0,0)
        .inner
          transform: rotate(270deg)
      &.move-enter-active,&.move-leave-active
        transition: all 0.3s linear
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147,153,159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)
</style>
