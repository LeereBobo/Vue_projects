<template>
  <div class="address">
    <!-- 1.头部：选择收货地址并返回 -->
    <Header :isLeft="true" title="选择收货地址"></Header>

    <!-- 2.地址搜索框 -->
    <div class="city_search">
      <div class="search">
        <!-- 当前定位城市 -->
        <span class="city" @click="$router.push('/city')">
          {{city}}
          <i class="fa fa-angle-down"></i>
        </span>
        <!-- 地址搜索 -->
        <i class="fa fa-search"></i>
        <input type="text" v-model="search_val" placeholder="小区/写字楼/学校等" />
      </div>

      <!-- 3.当前定位信息展示 -->
      <Location :address="address"></Location>
    </div>

    <!-- 4.展示输入地址匹配到的相关地址信息 -->
    <div class="area">
        <ul class="area_list" v-for="(item,index) in areaList" :key="index">
            <li @click="selectAddress(item)">
                <h4>{{item.name}}</h4>
                <p>{{item.district}}{{item.address}}</p>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import Location from "../components/Location";
export default {
  name: "Address",
  components: {
    Header,
    Location
  },
  data() {
    return {
      city: "", //定位的当前城市
      search_val: "", //搜索框输入地址
      areaList:[] //根据输入地址匹配到的地址合集
    };
  },
  // 在渲染该组件的对应路由被confirm前调用,this不可调用
  beforeRouteEnter(to, from, next) {
    next(vm => {
    //   console.log(to.params.city+"🍉");
      vm.city = to.params.city;
    });
  },
  computed: {
    address() {
      return this.$store.getters.location.formattedAddress;
    }
  },
  // 地址搜索：监听输入的地址
  watch: {
    search_val() {
      this.searchPlace();
    }
  },
  methods: {
    // 监听地址时调用高德插件，获得匹配地址合集
    searchPlace() {
      const self = this;
      AMap.plugin("AMap.Autocomplete", function() {
        // 实例化Autocomplete
        var autoOptions = {
          //city 限定城市，默认全国
          city: self.city
        };
        var autoComplete = new AMap.Autocomplete(autoOptions);
        autoComplete.search(self.search_val, function(status, result) {
          // 搜索成功时，result即是对应的匹配数据
          console.log(result);
          self.areaList = result.tips;
        });
      });
    },
    // 点击所得匹配地址，获取并用以替换原有定位地址，然后跳转至home页面
    selectAddress(item){
        // 重新分发action，替换原有定位地址
        this.$store.dispatch("setAddress",item.district + item.address + item.name);
        // 跳转home页面
        this.$router.push('/home');

    }
  }
};
</script>

<style scoped>
.address {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding-top: 45px;
}

.city_search {
  background-color: #fff;
  padding: 10px 20px;
  color: #333;
}

.search {
  background-color: #eee;
  height: 40px;
  border-radius: 10px;
  box-sizing: border-box;
  line-height: 40px;
}

.search .city {
  padding: 0 10px;
}

.city i {
  margin-right: 10px;
}

.search input {
  margin-left: 5px;
  background-color: #eee;
  outline: none;
  border: none;
}

.area {
  margin-top: 16px;
  background: #fff; 
}

.area li {
  border-bottom: 1px solid #eee;
  padding: 8px 16px;
  color: #aaa;
}
.area li h4 {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
</style>