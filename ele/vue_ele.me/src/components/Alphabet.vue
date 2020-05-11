<template>
  <div class="alphabet" ref="area_scroll">
    <div class="scroll_wrap">
      <!-- 热门城市 -->
      <div class="hot_wrap">
        <div class="title">热门城市</div>
        <ul class="hot_city cityList">
          <li v-for="(item,index) in cityInfo.hotCities" :key="index" @click="$emit('selectCity',item)">{{item.name}}</li>
        </ul>
      </div>

      <!-- 所有城市 -->
      <div class="city_wrap">
        <!-- 遍历按字母排序的key，item为每一个key值 -->
        <div class="city_content cityList" v-for="(item,index) in keys" :key="index">
          <div class="title">{{item}}</div>
          <!-- 遍历每个key所对应的所有城市 -->
          <ul>
            <li v-for="(cityItem,index) in cityInfo[item]" :key="index" @click="$emit('selectCity',cityItem)">{{cityItem.name}}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 右侧字母侧边栏 -->
    <div class="area_keys">
        <ul>
            <li @click="selectKey(0)">#</li>
            <li @click="selectKey(index+1)" v-for="(item,index) in keys" :key="index">{{item}}</li>
        </ul>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: "Alphabet",
  data(){
      return{
          scroll:null
      }
  },
  props: {
    cityInfo: Object,
    keys: Array,
  },
  methods:{
    //   better-scroll实现字母表滚动
      initScroll(){
          this.scroll = new BScroll(this.$refs.area_scroll,{
              click:true,
              mouseWheel: true //pc端响应鼠标滚轮滚动
          });
      },
    //   点击右侧字母表，左侧城市滚动到被点击字母对应的城市位置
      selectKey(index){
        
        //点击事件传递被点击字母的下标值
        // console.log(index);
        
        const cityList = this.$refs.area_scroll.getElementsByClassName('cityList');
        
        //返回下标为0~23的数组，数组元素为：热门城市与每个字母对应城市的最外层div
        // console.log(cityList);
        
        // 根据点击事件传递的，被点击字母的下标，找到与其下标一致的城市div
        const el = cityList[index];
        
        // 滚动到点击字母对应的城市展示div，250为滚动实施的限定时间
        this.scroll.scrollToElement(el,250);
      }
  }
};
</script>

<style scoped>
.alphabet {
  margin-top: 10px;
  box-sizing: border-box;
  padding: 0 16px;
  background: #fff;
  height: calc(100% - 65px);
  overflow: hidden;
}
.scroll_wrap {
  background: #fff;
  overflow: auto;
}

.title {
  color: #aaa;
  padding: 15px 0;
}

.hot_city {
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.hot_city li {
  width: 30%;
  background: red;
  background: #f1f1f1;
  margin: 0 10px 10px 0;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
}
.city_content li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.area_keys {
    position: fixed;
    right: 0;
    top:25%;
    color:#aaa;
    font-size: 12px;
    line-height:1.4;
    text-align: center;
    padding:0 5px;
}
</style>