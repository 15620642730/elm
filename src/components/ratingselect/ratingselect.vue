<template lang="html">
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" :class="{'active':sType===2}" class="block positive">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" :class="{'active':sType===0}" class="block positive">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" :class="{'active':sType===1}" class="block negative">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent($event)" class="switch" :class="{'on':oContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script>

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    selectType: { //全部，满意，不满意
      type: Number,
      default: ALL //默认情况时ALL，值为2
    },
    onlyContent: { //只看有内容的评价还是所有的评价
      type: Boolean,
      default: false //设置为可以看到所有的评价
    },
    desc: {
      type: Object,
      default() { //默认desc是这三种，在商品详情页的时候传入推荐或者吐槽
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        };
      }
    }
  },
  computed: {
    positives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    select (type, event) {//点击的时候外层是有一个BScroll的，所以要传递event阻止默认冒泡
      if (!event._constructed) {//浏览器直接return掉
        return;
      }
      this.sType = type;
      // console.log('ratingselect.vue' + type);
      //this.$emit('se-type',type)
      this.$emit('increment','selectType', this.sType);
    },
    toggleContent (event) {
      if (!event._constructed) {
        return;
      }
      this.oContent = !this.oContent;
      // console.log('ratingselect.vue' + this.oContent);
      //this.$emit('toggle-content',this.oContent);
      this.$emit('increment','onlyContent', this.oContent);
    }
  },
  data() {
    return {
      sType: this.selectType,
      oContent: this.onlyContent
    };
  },
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px//保证横线的长度
      border-1px(rgba(7,17,27,0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        font-size: 12px
        border-radius: 1px
        color: rgb(77,85,93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0,160,220,0.2)
          &.active
            background: rgb(0,160,220)
        &.negative
          background: rgba(77,85,93,0.2)
          &.active
            background: rgb(77,85,93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7,17,27,0.1)
      color: rgb(147,153,159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>
