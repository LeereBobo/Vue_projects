<template>
  <transition name="fade">
    <div class="info-model" v-show="showInfoModel">
      <div class="brief-model">
        <h2>
          <i v-if="rst.is_premium">品牌</i>
          <span>{{rst.name}}</span>
        </h2>
        <ul>
          <li>
            <h3>{{rst.rating}}</h3>
            <p>评分</p>
          </li>
          <li>
            <h3>{{rst.recent_order_num}}</h3>
            <p>月售</p>
          </li>
          <li v-if="rst.delivery_mode">
            <h3>蜂鸟转送</h3>
            <p>约{{rst.order_lead_time}}分钟</p>
          </li>

          <li>
            <h3>¥{{rst.float_delivery_fee}}元</h3>
            <p>配送费</p>
          </li>
          <li>
            <h3>{{(rst.distance / 1000).toFixed(1) }}km</h3>
            <p>距离</p>
          </li>
        </ul>
        <h3 class="promotion">
          <span>公告</span>
        </h3>
        <p class="brief-model-yx">{{rst.promotion_info}}</p>
      </div>
      <!-- X号 -->
      <div class="brief-model-close" @click="$emit('close')">
        <img
          src="https://fuss10.elemecdn.com/8/ba/bcfa8cc62b20e044bd2ea1c1c7f3dpng.png?imageMogr/format/webp/"
          alt
        />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "InfoModel",
  props: {
    rst: Object,
    showInfoModel: Boolean
  }
};
</script>

<style>
.info-model {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.brief-model {
  position: relative;
  width: 80%;
  max-height: 85.333333vw;
  padding: 7.066667vw 6.666667vw 7.466667vw;
  border-radius: 1.066667vw;
  overflow: hidden;
  background: #fff;
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.brief-model h2 {
  font-size: 1.4rem;
  line-height: 6.666667vw;
  color: #333;
  text-align: center;
  font-weight: bolder;
}
.brief-model h2 i {
  position: relative;
  top: -0.533333vw;
  margin-right: 1.6vw;
  border-radius: 0.266667vw;
  background-image: linear-gradient(90deg, #fff100, #ffe339);
  color: #6a3709;
  font-style: normal;
  padding: 0.8vw;
  font-weight: 700;
  font-size: 0.8rem;
}
.brief-model ul {
  display: flex;
  margin: 5.066667vw -6.666667vw 0;
}
.brief-model ul li {
  flex: 1;
  text-align: center;
}
.brief-model ul li h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.6vw;
}
.brief-model ul li p {
  font-size: 0.293333rem;
  color: #999;
}
.brief-model .promotion {
  position: relative;
  text-align: center;
  margin: 4.8vw auto 2.666667vw;
  width: 20.266667vw;
  background-image: linear-gradient(90deg, #fff, #333 50%, #fff);
  background-size: 100% 1px;
  background-position: 50%;
  background-repeat: no-repeat;
}
.brief-model .promotion span {
  font-size: 0.8rem;
  padding: 0 1.066667vw;
  color: #999;
  background-color: #fff;
}
.brief-model-yx {
  font-size: 0.8rem;
  line-height: 1.54;
  color: #333;
  max-height: 26.666667vw;
  overflow-y: auto;
}
.brief-model-close {
  margin-top: 8vw;
  width: 8vw;
  height: 8vw;
}
.brief-model-close img {
  width: 100%;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>