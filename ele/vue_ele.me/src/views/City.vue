<template>
  <div class="city">
    <!-- 搜索城市及取消搜索 -->
    <div class="search_wrap">
      <div class="search">
        <i class="fa fa-search"></i>
        <input type="text" placeholder="输入城市名称" v-model="city_val" />
      </div>
      <button @click="$router.push({name:'address',params:{city:city}})">取消</button>
    </div>
    <!-- 当前定位城市 -->
    <div style="height:100%" v-if="searchList.length == 0">
      <div class="location">
        <Location :address="city"></Location>
      </div>
      <!--  -->
      <Alphabet
        v-if="showCity"
        :cityInfo="cityInfo"
        :keys="keys"
        ref="allcity"
        @selectCity="selectCity"
      ></Alphabet>
    </div>
    <!--  -->
    <div class="search_list" v-else>
        <ul>
            <li v-for="(item,index) in searchList" :key="index" @click="selectCity(item)">{{item.name}}</li>
        </ul>
    </div>
  </div>
</template>

<script>
import Location from "../components/Location";
import Alphabet from "../components/Alphabet";
export default {
  name: "City",
  data() {
    return {
      city_val: "",
      showCity: false, //所有城市数据获取完之后，再渲染模板，以免报错
      cityInfo: null, //所有城市,key+city
      keys: [], //所有城市的key值
      allCities: [], //储存所有城市，用来搜索过滤，不含key值
      searchList: [] //搜索匹配所得的地址合集
    };
  },
  components: {
    Location,
    Alphabet
  },
  computed: {
    city() {
      return (
        this.$store.getters.location.addressComponent.city ||
        this.$store.getters.location.addressComponent.province
      );
    }
  },
  created() {
    // 获得所有城市信息
    this.getCityInfo();
  },
  watch:{
      city_val(){
        // console.log(this.city_val);
        this.searchCity();
    }
  },
  methods: {
    getCityInfo() {
      this.$axios("/api/posts/cities")
        .then(res => {
          // 获得所有城市信息
          this.cityInfo = res.data;

          // 获取key值：即所有城市名称的开头大写字母
          this.keys = Object.keys(res.data);

          //  移除keys中的hotCities
          this.keys.pop();

          //  将keys排序
          this.keys.sort();
          this.showCity = true;
          //  数据获取并渲染之后，调用better-scroll,实现城市展示页面的滑动
          this.$nextTick(() => {
            this.$refs.allcity.initScroll();
          });

          // 根据关键字检索城市
          // cityInfo:key + city,遍历得到key对应的城市合集
          
          // 存储所有城市，用来搜索过滤
          this.keys.forEach(key => {
              this.cityInfo[key].forEach(city => {
                  this.allCities.push(city);
              })
          });
        //   console.log(this.allCities);


        })
        .catch(err => {
          console.log(err);
        });
    },
    // 点击城市展示页面的某一城市，并将当前定位替换为被点击城市
    selectCity(city) {
    //   console.log(11);
      this.$router.push({ name: "address", params: { city: city.name } });
    },
    // 
    searchCity(){
        if(!this.city_val){
            // 如果搜索框为空，数组置空
            this.searchList = [];
        }else{
            // 根据输入框的关键字检索城市，如果城市名中包含搜索值，则将这个城市名存入到searchList数组中
            this.searchList = this.allCities.filter(item => {
                return item.name.indexOf(this.city_val) != -1;
            });
            // console.log(this.searchList)
        }
    }
  }
};
</script>

<style scoped>
.city {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}

.search_wrap {
  position: fixed;
  top: 0;
  height: 45px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 3px 16px;
  display: flex;
  justify-content: space-between;
}

.search {
  background-color: #eee;
  border-radius: 10px;
  line-height: 40px;
  width: 85%;
  box-sizing: border-box;
  padding: 0 16px;
}

.search input {
  background: #eee;
  outline: none;
  border: none;
  margin-left: 5px;
}

.search_wrap button {
  outline: none;
  color: #009eef;
}
.location {
  background: #fff;
  padding: 16px 8px 8px;
  /* height: 65px; */
  box-sizing: border-box;
}
.search_list {
  background: #fff;
  padding: 5px 16px;
}
.search_list li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

</style>
