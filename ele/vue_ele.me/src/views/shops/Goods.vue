<template>
  <div class="goods" v-if="shopInfo">
    <!-- 商家推荐 -->
    <div class="recommend" v-for="(recommend,index) in shopInfo.recommend" :key="index">
      <p class="recommend-name">{{recommend.name}}</p>
      <!-- 商品滑动展示栏 -->
      <div class="recommend-wrap">
        <ul>
          <li v-for="(item,index) in recommend.items" :key="index">
            <img :src="item.image_path" alt />
            <!-- 图片加文字 -->
            <div class="recommend-food">
              <p class="recommend-food-name">{{item.name}}</p>
              <p class="recommend-food-zm">月售{{item.month_sales}} 好评率{{item.satisfy_rate}}</p>
            </div>
            <!-- 价格 -->
            <div class="recommend-food-price">
              <p>￥{{item.activity.fixed_price}}</p>
              <!-- + -->
              <CartControll :food="item" />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 商品分类 -->
    <div class="menuview">
      <!-- 左侧分类列表 -->
      <div class="menu-wrapper" ref="menuScroll">
        <ul>
          <li v-for="(item,index) in shopInfo.menu" :key="index" @click="selectMenu(index)" :class="{'current':currentIndex===index}">
            <img v-if="item.icon_url" :src="item.icon_url" alt />
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
      <!-- 右侧商品内容 -->
      <div class="foods-wrapper" ref="foodScroll">
        <ul>
          <li class="food-list-hook" v-for="(item,index) in shopInfo.menu" :key="index">
            <!-- 内容上：描述文字 -->
            <div class="category-title">
              <strong>{{item.name}}</strong>
              <span>{{item.description}}</span>
            </div>
            <!-- 内容下：商品列表 -->
            <div class="fooddetails" v-for="(food,i) in item.foods" :key="i" @click=handleFood(food)>
              <!-- 左：图片 -->
              <img :src="food.image_path" alt />
              <!-- 右 -->
              <section class="fooddetails-info">
                <h4>{{food.name}}</h4>
                <p class="fooddetails-des">{{food.description}}</p>
                <p class="fooddetails-sales">月售{{food.month_sales}}份 好评率{{food.satisfy_rate}}</p>
                <div class="fooddetails-price">
                  ￥{{food.activity.fixed_price}}
                  <CartControll :food="food" />
                </div>
              </section>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 购物车 -->
    <ShopCart :shopInfo="shopInfo"/>
    <!-- 商品详情 -->
    <Food :food="selectedFood" :isShow="showFood" @close="showFood=false"/>
  </div>
</template>

<script>
import CartControll from "../../components/shops/CartControll";
import BScroll from "better-scroll";
import ShopCart from "./ShopCart";
import Food from "./Food";
export default {
  name: "Goods",
  data() {
    return {
      shopInfo: null,
      menuScroll: {}, //左侧滚动对象
      foodScroll: {}, //右侧滚动对象
      scrollY: 0, // 右侧菜单当前滚动到的y值
      listHeight: [], // 12个分类对应的商品展示区的列表高度
      selectedFood:null,//存储已选商品的详情信息
      showFood:false//商品详情信息展示开关
    };
  },
  components: {
    CartControll,
    ShopCart,
    Food
  },
  created() {
    this.getData();
    // console.log(this)
  },
  computed: {
    // 根据右侧滚动的位置, 确定对应的索引下标
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        //判断:listHeight[i] <= 当前滚动位置pos.y < listHeight[i + 1],则所在展示区的索引为i并返回
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if(this.scrollY >=  height1 && this.scrollY < height2){
            return i;
        }
      }
      return 0;//默认展示第一个分类商品展示区，即默认给第一个分类添加灰白背景样式
    }
  },
  methods: {
    getData() {
      this.$axios.get("api/profile/batch_shop").then(res => {
        // console.log(res.data);

        // 遍历数据recommend.items,给数据中添加一个count属性，用以记录用户选择的商品数量
        res.data.recommend.forEach(recommend => {
          recommend.items.forEach(item => {
            item.count = 0;
          });
        });

        // 为foods数据添加一个count，作用同上
        res.data.menu.forEach(menu => {
          menu.foods.forEach(food => {
            food.count = 0;
          });
        });

        this.shopInfo = res.data;
        // console.log(this.shopInfo);

        // 将回调延迟到下次 DOM 更新循环之后执行。
        this.$nextTick(() => {
          // DOM已经更新
          this.initScroll();

          // 计算12个分类商品展示区的高度
          this.calculateHeight();
        });
      });
    },
    // 初始化BScroll
    initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuScroll, {
        click: true
      });
      (this.foodScroll = new BScroll(this.$refs.foodScroll, {
        probeType: 3,
        click: true
      })),
        // 通过better-scroll中的scroll事件获取滚动对象的实时坐标{x,y}
        this.foodScroll.on("scroll", pos => {
          // console.log(pos.y);
          this.scrollY = Math.abs(Math.round(pos.y));
        });
    },

    selectMenu(index) {
      // 将被点击的分类index传递过来
      // console.log(index);

      // 思路：获取到右侧商品列表的div合集，点击分类，根据传递过来的分类的索引，获取到分类所对应的商品展示页面，用scrollToElement方法直接滚动到该元素所在的位置

      let foodlist = this.$refs.foodScroll.getElementsByClassName(
        "food-list-hook"
      );
      //分类对应的商品展示页面的所有li

      let el = foodlist[index];
      this.foodScroll.scrollToElement(el, 250); //滚动动画执行时长
    },
    // 获取所有商品展示区的高度
    calculateHeight() {
      // 先获取到12个分类商品展示区的div
      let foodlist = this.$refs.foodScroll.getElementsByClassName(
        "food-list-hook"
      );

      // 第一个商品分类展示区的高度肯定为0，并将其push到存储所有高度数据的listHeight数组中去
      let height = 0; //当前展示区高度
      this.listHeight.push(height);

      // -1 是因为第一个高度值为0，已存入数组
      for (let i = 0; i < foodlist.length - 1; i++) {
        // foodlist[i].clientHeight即为索引为i的展示区的高度
        height += foodlist[i].clientHeight;
        this.listHeight.push(height);
        // console.log(this.listHeight);
      }
    },
    // 点击商品
    handleFood(food){
      // console.log(food);
      this.selectedFood = food;
      this.showFood = true;

    }
  }
};
</script>

<style scoped>
.goods {
  position: relative;
  height: calc(100% - 10.666667vw);
}
.recommend {
  padding-top: 4.266667vw;
  background-color: #fff;
}
.recommend-name {
  padding-left: 4.266667vw;
  color: #333;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 2.666667vw;
}
.recommend-wrap {
  overflow-x: scroll;
  display: flex;
  width: 100%;
}
.recommend-wrap ul {
  display: flex;
  padding-left: 4.266667vw;
}
.recommend-wrap ul li {
  flex: none; /* none -- 0 0 auto */
  width: 32vw;
  margin-right: 2.666667vw;
}
.recommend-wrap li img {
  display: block;
  width: 32vw;
  height: 32vw;
  border-top-left-radius: 0.8vw;
  border-top-right-radius: 0.8vw;
  max-width: 100%;
}
.recommend-food .recommend-food-name {
  color: #333;
  font-size: 0.8rem;
  margin: 1.866667vw 0 1.233333vw;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.recommend-food .recommend-food-zm {
  color: #999;
  font-size: 0.6rem;
  margin-bottom: 1.866667vw;
  min-height: 1em;
}
.recommend-food-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 0.266667vw;
}
.recommend-food-price p {
  font-size: 1rem;
  color: #ff5339;
}
/* 取消滚动条 */
::-webkit-scrollbar {
  width: 0 !important;
}

/* 左侧商品列表 */
.menuview {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 10.8vw;
  background-color: #fff;
  display: flex;
}
.menu-wrapper {
  overflow-y: hidden;
  /* height: 100%; */
  height: calc(100% - 12.8vw);
  background-color: #f8f8f8;
  padding-bottom: 10.666667vw;
  width: 20.533333vw;
}
.menu-wrapper li {
  padding: 4.666667vw 2vw;
  font-size: 0.6rem;
  color: #666;
  line-height: 1.2;
}
.menu-wrapper li img {
  max-width: 100%;
  width: 3.466667vw;
  height: 3.466667vw;
  vertical-align: top;
  margin-right: 0.8vw;
}
.foods-wrapper {
  overflow-y: hidden;
  /* height: 100%; */
  height: calc(100% - 12.8vw);
  width: 79.466667vw;
  padding-bottom: 10.666667vw;
}
.category-title {
  margin-left: 2.666667vw;
  padding: 2vw 8vw 2vw 0;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.category-title strong {
  margin-right: 1.333333vw;
  font-weight: 700;
  font-size: 0.8rem;
  color: #666;
  flex: none;
}
.category-title span {
  flex: 1;
  color: #999;
  font-size: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fooddetails {
  min-height: 30.666667vw;
  padding: 2.666667vw 0 2.666667vw 2.666667vw;
  margin-bottom: 0.133333vw;
  display: flex;
}
.fooddetails img {
  width: 25.333333vw;
  height: 25.333333vw;
  flex: none;
  margin-right: 2.666667vw;
  border-radius: 0.533333vw;
}
.fooddetails-info {
  flex: 1;
  padding-bottom: 6.666667vw;
  padding-right: 4vw;
}
.fooddetails-info h4 {
  padding-right: 4vw;
  font-weight: 700;
  overflow: hidden;
  font-size: 1rem;
  white-space: nowrap;
  width: 40vw;
  text-overflow: ellipsis;
  color: #333;
}
.fooddetails-des {
  margin: 1.333333vw 0;
  font-size: 0.6rem;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 42.666667vw;
}
.fooddetails-sales {
  margin: 1.733333vw 0 !important;
  color: #999;
  font-size: 0.6rem;
  line-height: 1;
  min-height: 1em;
}
.fooddetails-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3.733333vw;
}
.fooddetails-price .price {
  font-size: 1rem;
  line-height: 4.266667vw;
  color: #ff5339;
  padding-bottom: 0.933333vw;
  display: flex;
  align-items: baseline;
}

.menu-wrapper .current {
  background-color: #fff !important;
  color: #333 !important;
}
.menu-wrapper .current {
  background-color: #fff !important;
  color: #333 !important;
}
</style>