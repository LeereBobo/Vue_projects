<template>
  <div class="Rating-gray">
    <i class="fa" v-for="(item,index) in itemClasses" :key="index" :class="item"></i>
  </div>
</template>

<script>
// 星星长度
const LENGTH = 5;

// 星星对应class
const CLS_ON = "fa-star"; //全星
const CLS_HALF = "fa-star-half-empty"; //半星
const CLS_OFF = "fa-star-o"; //填充

export default {
  name: "Rating",
  props: {
    rating: Number //以4.8为例
  },
  computed: {
    itemClasses() {
      //   4.8 四个全星 一个半星
      let result = []; //存放统计完后的全星，半星与空星

      /* 
        4.5及以上为四星半，4.5以下为四星
        小数部分<0.5,无星；0.5<=小数部分<1,半星
        
        4.8向下取整：4
        4.3向下取整：4
       
        所以，对分数进行处理：
        向下取整，让所得结果均为0.5的倍数
        4.8 * 2 向下取整 / 2 ：    4.5
        4.3 * 2 向下取整 / 2 ：    4
        3.8 * 2 向下取整 / 2 ：    3.5
        2.3 * 2 向下取整 / 2 ：    2
      */
      let score = Math.floor(this.rating * 2) / 2;
     
      // 控制半星：有半星返回true
      let hasDecimal = score % 1 !== 0;
      
      // 控制全星：统计全星个数
      let integer = Math.floor(score);

      // 全星按个数放入到数组中
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON);
      }

      // 若有半星，放入数组
      if (hasDecimal) {
        result.push(CLS_HALF);
      }

      // 补齐：当数组的星星个数少于5时，用空星星补充至五个
      while (result.length < LENGTH) {
        result.push(CLS_OFF);
      }
      return result;
    }
  }
};
</script>

<style scoped>
.Rating-gray {
  margin-right: 1.066667vw;
  color: #ffbe00;
  display: inline-block;
}
</style>