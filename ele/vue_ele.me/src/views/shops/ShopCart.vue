<template>
  <div class="shopcart">
    <!-- 购物车商品展示 -->
    <transition name="fade">
      <div
        class="cartview-cartmask"
        @click.self="showCartView=false"
        v-if="showCartView && !isEmpty"
      >
        <div class="cartview-cartbody">
          <div class="cartview-cartheader">
            <span>已选商品</span>
            <button @click="clearFoods">
              <i class="fa fa-trash-o"></i>
              <span>清空</span>
            </button>
          </div>
          <div class="entityList-cartbodyScroller">
            <ul class="entityList-cartlist">
              <li class="entityList-entityrow" v-for="(food,index) in selectFoods" :key="index">
                <h4>
                  <span>{{food.name}}</span>
                </h4>
                <span class="entityList-entitytotal">{{food.activity.fixed_price}}</span>
                <CartControll :food="food" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <!-- 购物车 -->
    <div class="bottomNav-cartfooter" :class="{'bottomNav-carticon-empty':isEmpty}">
      <!-- 购物车图标 -->
      <span class="bottomNav-carticon" @click="showCartView=!showCartView">
        <i class="fa fa-cart-plus"></i>
        <span v-if="totalCount">{{totalCount}}</span>
      </span>

      <!-- 购物车文字部分 -->
      <div class="bottomNav-cartInfo" @click="showCartView = !showCartView">
        <p class="bottomNav-carttotal">
          <span v-if="isEmpty">未选购商品</span>
          <span v-else>￥{{totalPrice.toFixed(2)}}</span>
        </p>
        <p class="bottomNav-cartdelivery">另需配送费{{shopInfo.rst.float_delivery_fee}}元</p>
      </div>

      <!-- 购物车结算按钮 -->
      <button class="submit-btn">
        <span v-if="isEmpty">￥{{shopInfo.rst.float_minimum_order_amount}}元起送</span>
        <span v-else @click="settlement">去结算</span>
      </button>
    </div>
  </div>
</template>

<script>
import CartControll from "../../components/shops/CartControll";
export default {
  name: "ShopCart",
  data() {
    return {
      totalCount: 0, //已选商品的总数量
      totalPrice: 0, //已选商品的总价格
      selectFoods: [], //存储已选购的商品
      showCartView: false //显示或隐藏购物车商品列表的开关
    };
  },
  props: {
    shopInfo: Object
  },
  components: {
    CartControll
  },
  computed: {
    isEmpty() {
      // 每次统计前，先初始化数据
      let empty = true;
      this.totalCount = 0;
      this.totalPrice = 0;
      this.selectFoods = [];

      //统计已选商品的总数量与总价，有商家推荐和菜单两部分组成

      //   商家推荐
      this.shopInfo.recommend.forEach(recommend => {
        recommend.items.forEach(item => {
          if (item.count) {
            empty = false;
            // 计算已选商品的件数与总价
            this.totalCount += item.count;
            this.totalPrice += item.activity.fixed_price * item.count;
            // 记录已选商品都有哪些
            this.selectFoods.push(item);
          }
        });
      });

      //   菜单点餐
      this.shopInfo.menu.forEach(menu => {
        menu.foods.forEach(food => {
          if (food.count) {
            empty = false;
            // 计算已选商品的件数与总价
            this.totalCount += food.count;
            this.totalPrice += food.activity.fixed_price * food.count;
            // 记录已选商品都有哪些
            this.selectFoods.push(food);
          }
        });
      });

      return empty;
    }
  },
  methods: {
    //   清空购物车
    clearFoods() {
      this.shopInfo.recommend.forEach(recommend => {
        recommend.items.forEach(item => {
          item.count = 0;
        });
      });
      this.shopInfo.menu.forEach(menu => {
        menu.foods.forEach(food => {
          food.count = 0;
        });
      });
    },
    // 去结算
    settlement() {
      // 将店铺信息和已选商品添加进store中，方便操作
      this.$store.dispatch("setOrderInfo", {
        shopInfo: this.shopInfo.rst,
        selectFoods: this.selectFoods
      });
      this.$router.push("/settlement");
    }
  }
};
</script>

<style scoped>
.bottomNav-cartfooter {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding-left: 21.066667vw;
  background-color: rgba(61, 61, 63, 0.9);
  height: 12.8vw;
  z-index: 1000;
}

.bottomNav-carticon {
  position: absolute;
  left: 3.2vw;
  bottom: 2vw;
  width: 13.333333vw;
  height: 13.333333vw;
  box-sizing: border-box;
  border-radius: 100%;
  background-color: #3190e8;
  border: 1.333333vw solid #444;
  box-shadow: 0 -0.8vw 0.533333vw 0 rgba(0, 0, 0, 0.1);
}
.bottomNav-carticon > i {
  position: absolute;
  top: 7px;
  right: 0;
  bottom: 0;
  left: 7px;
  color: #fff;
  font-size: 1.6rem;
}
.bottomNav-cartInfo {
  flex: 1;
}
.bottomNav-carttotal {
  font-size: 0.8rem;
  line-height: normal;
  color: #fff;
}
.bottomNav-cartdelivery {
  color: #999;
  font-size: 0.6rem;
}
.submit-btn {
  height: 100%;
  width: 28vw;
  background-color: #38ca73;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 12.8vw;
  border: none;
  outline: none;
}

.bottomNav-carticon-empty > span {
  background-image: radial-gradient(circle, #363636 6.266667vw, #444 0);
}
.bottomNav-carticon-empty > span > i {
  color: #606065 !important;
}
.bottomNav-carticon-empty .bottomNav-carttotal > span {
  color: #999;
}
.bottomNav-carticon-empty .submit-btn {
  background-color: #535356 !important;
}

.bottomNav-carticon > span {
  position: absolute;
  right: -1.2vw;
  top: -1.333333vw;
  line-height: 1;
  background-image: linear-gradient(-90deg, #ff7416, #ff3c15 98%);
  color: #fff;
  border-radius: 3.2vw;
  padding: 0.833333vw 1.333333vw;
  font-size: 0.6rem;
}

.cartview-cartmask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 200;
}
.cartview-cartbody {
  position: fixed;
  left: 0;
  width: 100%;
  background-color: #fff;
  bottom: 12.8vw;
  z-index: 201;
  opacity: 1;
  font-size: 1rem;
}
.cartview-cartheader {
  display: flex;
  align-items: center;
  padding: 0 4vw;
  border-bottom: 0.133333vw solid #ddd;
  background-color: #eceff1;
  color: #666;
  height: 10.666667vw;
}
.cartview-cartheader > span {
  flex: 1;
  display: flex;
  align-items: center;
}
.cartview-cartheader > button {
  border: none;
  outline: none;
  flex: none;
  display: flex;
  align-items: center;
  padding-left: 4vw;
  color: #666;
  text-decoration: none;
  font-size: 0.8rem;
  line-height: 4vw;
  background: none;
}
.cartview-cartheader > button > span {
  margin-left: 0.8vw;
}
.entityList-cartbodyScroller {
  overflow: auto;
  max-height: 80vw;
}
.entityList-entityrow {
  border-bottom: 0.133333vw solid #eee;
  display: flex;
  align-items: center;
  padding: 2vw 3.333333vw 2vw 0;
  min-height: 12.666667vw;
  margin-left: 3.333333vw;
}
.entityList-entityrow > h4 {
  flex: 5.5;
  line-height: normal;
}
.entityList-entityrow > h4 > span {
  display: inline-block;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  max-width: 46.666667vw;
}
.entityList-entitytotal {
  color: rgb(255, 83, 57);
  flex: 2.5;
  text-align: left;
  white-space: nowrap;
  font-weight: 700;
}
.entityList-entitytotal::before {
  content: "\A5";
  font-size: 0.6rem;
  color: currentColor;
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