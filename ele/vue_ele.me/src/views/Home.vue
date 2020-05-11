<template>
  <div class="home">
    <!-- 定位地址展示 -->
    <div class="header">
      <!-- 路由跳转时将省市信息以参数的形式传递过去 -->
      <div
        class="address_map"
        @click="$router.push({
                name: 'address',
                params: {city: city}
            })"
      >
        <i class="fa fa-map-marker">
          <span>{{address}}</span>
          <i class="fa fa-sort-desc"></i>
        </i>
      </div>
    </div>
    <!-- 商家搜索 -->
    <div class="search_wrap" :class="{'fixedview':showFilter}" @click="$router.push('/search')">
      <div class="shop_search">
        <i class="fa fa-search"></i>
        搜索商家 商家名称
      </div>
    </div>
    <div id="container">
      <!-- 轮播图 -->
      <mt-swipe :auto="4000" class="swiper">
        <mt-swipe-item v-for="(img,index) in swipeImgs" :key="index">
          <img :src="img" alt />
        </mt-swipe-item>
      </mt-swipe>

      <!-- 分类 -->
      <mt-swipe :auto="0" class="entries">
        <mt-swipe-item v-for="(entry,i) in entries" :key="i" class="entry_wrap">
          <div class="foodentry" v-for="(item,index) in entry" :key="index">
            <div class="img_wrap">
              <img :src="item.image" alt />
            </div>
            <span>{{item.name}}</span>
          </div>
        </mt-swipe-item>
      </mt-swipe>
    </div>

    <!-- 推荐商家 -->
    <div class="shoplist-title">推荐商家</div>

    <!-- 排序导航 -->
    <FilterView :filterData="filterData" @searchFixed="showFilterView" @update="update"></FilterView>

    <!-- 商家信息 -->
    <mt-loadmore
      :top-method="loadData"
      :bottom-method="loadMore"
      :bottom-all-loaded="allLoaded"
      :auto-fill="false"
      :bottomPullText="bottomPullText"
      ref="loadmore"
    >
      <!-- 商家数据展示部分 -->
      <div class="shoplist">
        <IndexShop v-for="(item,index) in restaurants" :key="index" :restaurant="item.restaurant"></IndexShop>
      </div>
    </mt-loadmore>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Loadmore } from "mint-ui";
import FilterView from "../components/FilterView";
import IndexShop from "../components/IndexShop";
export default {
  name: "Home",
  data() {
    return {
      swipeImgs: [],
      entries: [],
      filterData: null,
      showFilter: false,
      page: 1,
      size: 5,
      restaurants: [], //存放所有商家的容器
      allLoaded: false,//数据是否全部加载完
      bottomPullText: "上拉加载更多",
      data:null//存储update方法传递过来的排序条件
    };
  },
  components: {
    FilterView,
    IndexShop
  },
  computed: {
    address() {
      return this.$store.getters.address;
    },
    // city：获取定位时所在的省市信息，在路由跳转时以参数的形式传递给Address页面，即显示当前定位的省市
    city() {
      return (
        this.$store.getters.location.addressComponent.city ||
        this.$store.getters.location.addressComponent.province
      );
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$axios("/api/profile/shopping").then(res => {
        // console.log(res.data);
        this.swipeImgs = res.data.swipeImgs;
        this.entries = res.data.entries;
      });
      // 获取筛选条件相关数据
      this.$axios("/api/profile/filter").then(res => {
        //   console.log(res.data);
        this.filterData = res.data;
      });
      // 拉取商家信息
      this.loadData();
    },
    // 下拉刷新
    loadData() {
      // 数据重新加载，从第一页开始展示
      this.page = 1;

      // 数据重新加载，可以实现上拉加载更多。
      // 若为真，则 bottomMethod 不会被再次触发，不能上拉加载更多
      this.allLoaded = false;

      this.bottomPullText = "上拉加载更多";

      // 拉取商家信息--第1页
      this.$axios
        .post(`/api/profile/restaurants/${this.page}/${this.size}`,this.data)
        .then(res => {
          // 在加载数据后需要对组件进行一些重新定位的操作
          // 不调用此方法，则一直为加载中
          this.$refs.loadmore.onTopLoaded();
          // console.log(this.data); //null

          this.restaurants = res.data;
          // console.log(this.restaurants);

        });
    },
    // 上拉加载
    loadMore() {
      // 判断数据是否加载完，若没有，每次调用page+1
      if (!this.allLoaded) {
        this.page++;
        
        // 拉取商家信息
        this.$axios
          .post(`/api/profile/restaurants/${this.page}/${this.size}`)
          .then(res => {
            // 加载完之后按不同情况重新渲染

            // 取消加载状态
            this.$refs.loadmore.onBottomLoaded();

            // 数据未完全加载完时
            if(res.data.length > 0){
              // 只要有剩余数据，全部push
              res.data.forEach(item => {
                this.restaurants.push(item);
              });

              // 默认加载5条数据，当前数据<5条时，不能再上拉加载
              if(res.data < this.size){
                this.allLoaded = true;//bottom-method不再执行
                this.bottomPullText = "没有更多了哦";
              }
            } else {
              // 数据已完全加载完时

              //当底部数据全部获取完毕时，不能再调用bottom-method实现上拉加载
              this.allLoaded = true;
              this.bottomPullText = "没有更多了哦";
            }
          });
      }
    },
    showFilterView(isShow) {
      this.showFilter = isShow;
    },
    update(condition) {
      // console.log(condition);
      this.data = condition;
      // console.log(this.data+"❀")
      
    }
  }
};
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  position: relative;
  top: 0;
  left: 0;
}

.header,
.search_wrap {
  background-color: #009eef;
  padding: 10px 16px;
}

.header .address_map {
  color: #fff;
  font-weight: bold;
}

.address_map i {
  margin: 0 3px;
  font-size: 18px;
}

.address_map span {
  display: inline-block;
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.search_wrap .shop_search {
  /* margin-top: 10px; */
  background-color: #fff;
  padding: 10px 0;
  border-radius: 4px;
  text-align: center;
  color: #aaa;
}

.search_wrap {
  position: sticky;
  top: 0px;
  z-index: 999;
  box-sizing: border-box;
}

.swiper {
  height: 100px;
}

.swiper img {
  width: 100%;
  height: 100px;
}

.entries {
  background: #fff;
  height: 47.2vw;
  text-align: center;
  overflow: hidden;
}
.foodentry {
  width: 20%;
  float: left;
  position: relative;
  margin-top: 2.933333vw;
}
.foodentry .img_wrap {
  position: relative;
  display: inline-block;
  width: 12vw;
  height: 12vw;
}
.img_wrap img {
  width: 100%;
  height: 100%;
}
.foodentry span {
  display: block;
  color: #666;
  font-size: 0.32rem;
}

/* 推荐商家 */
.shoplist-title {
  display: flex;
  align-items: flex;
  justify-content: center;
  height: 9.6vw;
  line-height: 9.6vw;
  font-size: 16px;
  color: #333;
  background: #fff;
}
.shoplist-title:after,
.shoplist-title:before {
  display: block;
  content: "一";
  width: 5.333333vw;
  height: 0.266667vw;
  color: #999;
}
.shoplist-title:before {
  margin-right: 3.466667vw;
}
.shoplist-title:after {
  margin-left: 3.466667vw;
}

.fixedview {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
}
.mint-loadmore {
  height: calc(100% - 95px);
  overflow: auto;
}
</style>