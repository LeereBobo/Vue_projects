<template class="search">
  <div>
    <Header :isLeft="true" title="搜索"></Header>
    <div class="search_header">
      <form class="search_wrap">
        <i class="fa fa-search"></i>
        <input type="text" v-model="key_word" placeholder="输入商家，商品信息" />
        <button @click.prevent="searchHandle">搜索</button>
      </form>
    </div>
    <!-- 展示搜索结果 -->
    <div class="shop" v-if="result && !showShop">
      <!-- 没有相匹配搜索结果时 -->
      <div class="empty_wrap" v-if="empty">
        <img src="https://fuss10.elemecdn.com/d/60/70008646170d1f654e926a2aaa3afpng.png" alt />
        <div class="empty_txt">
          <h4>附近没有搜索结果</h4>
          <span>换个关键词试试吧</span>
        </div>
      </div>
      <!-- 有相匹配搜索结果时，展示搜索结果 -->
      <div v-else>
        <SearchIndex :data="result.restaurants" @listClick="$router.push('/shop')"></SearchIndex>
        <SearchIndex :data="result.words" @listClick="showItemClick"></SearchIndex>
      </div>
    </div>
    <!-- 点击搜索结果，跳转到搜索结果展示页面 -->
    <div class="container" v-if="showShop">
      <!-- 排序导航 -->
      <FilterView :filterData="filterData" @update="update"></FilterView>
      <!-- 商家数据展示部分 -->
      <div class="shoplist" 
          v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading">
        <IndexShop v-for="(item,index) in restaurants" :key="index" :restaurant="item.restaurant"></IndexShop>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import SearchIndex from "../components/SearchIndex";
import FilterView from "../components/FilterView";
import IndexShop from "../components/IndexShop";
import { InfiniteScroll } from "mint-ui";

export default {
  name: "Search",
  data() {
    return {
      key_word: "",
      result: null, //搜索框输入值匹配的接口数据
      empty: false, //展示无搜索结果提示页面
      showShop: false, //展示搜索结果页面
      filterData: null,
      restaurants: [],
      page: 0,
      size: 7,
      loading: false, //自动加载时判断数据是否加载完
      data: null
    };
  },
  components: {
    Header,
    SearchIndex,
    FilterView,
    IndexShop
  },
  watch: {
    key_word() {
      this.empty = false; //优化：每次搜索新内容时，都应隐藏之前的未搜到内容效果
      this.showShop = false;
      this.keyWordchange();
    }
  },
  created() {
    //  获取筛选导航所需数据
    this.$axios("/api/profile/filter").then(res => {
      // console.log(res.data);
      this.filterData = res.data;
    });
  },

  methods: {
    // 根据输入的关键字获取匹配的接口数据
    keyWordchange() {
      // console.log(this.key_word);
      this.$axios(`/api/profile/typeahead/${this.key_word}`)
        .then(res => {
          // console.log(res.data);
          this.result = res.data;
        })
        .catch(err => {
          this.result = null;
        });
    },
    // 判断搜索框输入内容是否有相匹配的接口数据
    searchHandle() {
      // 搜索框未输入搜索内容
      if (!this.key_word) return;

      // 搜索框已输入搜索内容
      if (
        (this.result && this.result.restaurants.length > 0) ||
        this.result.words > 0
      ) {
        // console.log("yes")
        this.showItemClick();
      } else {
        this.empty = true;
      }
    },
    // 点击搜索或搜索结果，跳转到结果展示页面
    showItemClick() {
      this.page = 0; //初始化数据
      this.restaurants = []; //初始化数据
      this.showShop = true;
    },
    update(condition) {
      this.data = condition;
      // console.log(condition);
      this.showItemClick(); //update函数本来用于获取（按筛选条件condition获取到的）相关数据，此处无实际用途，可写可不写
    },
    loadMore() {
      this.page++;
      this.$axios
        .post(`/api/profile/restaurants/${this.page}/${this.size}`, this.data)
        .then(res => {
          // this.restaurants = res.data;
          // console.log(this.restaurants);
          // console.log(this.data);
          if (res.data.length > 0) {
            res.data.forEach(item => {
              this.restaurants.push(item);
            });
          } else {
            this.loading = true;
          }
        });
    }
  }
};
</script>

<style scoped>
.search {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.search_header {
  margin-top: 45px;
  background: #fff;
  padding: 0 4.266667vw;
}
.search_header .search_wrap {
  padding: 2.933333vw 2.933333vw 2.933333vw 0;
  display: flex;
  align-items: center;
  position: relative;
}
.search_wrap .fa-search {
  width: 2.933333vw;
  height: 2.933333vw;
  color: #888;
  position: absolute;
  top: 4.6666666vw;
  left: 2.933333vw;
}
.search_wrap input {
  flex-grow: 1;
  border-radius: 0.266667vw;
  background-color: #f8f8f8;
  padding: 1.733333vw 4vw 1.733333vw 8.8vw;
  color: #666;
  outline: none;
  border: none;
}
.search_wrap button {
  outline: none;
  border: none;
  color: #333;
  font-size: 0.426667rem;
  background: #fff;
  font-weight: 700;
  margin-left: 2.933333vw;
  font-size: 14px;
}
.shop {
  height: calc(100% - 95px);
  width: 100%;
  overflow: auto;
}
.empty_wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fff;
  display: flex;
  justify-content: center;
}
.empty_wrap img {
  width: 35vw;
  height: 35vw;
}
.empty_txt h4 {
  color: #666;
  font-size: 1rem;
  margin: 12vw 0 2vw 0;
}
.empty_txt span {
  color: #999;
  font-size: 0.8rem;
}
</style>