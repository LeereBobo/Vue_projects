<template>
  <div :class="{'open':isSort || isScreen}" @click.self="hideView">
    <!-- 导航 -->
    <div class="filter_wrap" v-if="filterData">
      <aside class="filter">
        <div
          class="filter-nav"
          v-for="(item,index) in filterData.navTab"
          :key="index"
          :class="{'filter-bold':currentFilter==index}"
          @click="filterSort(index)"
        >
          <span>{{item.name}}</span>
          <i v-if="item.icon" :class="'fa fa-'+item.icon"></i>
        </div>
      </aside>
    </div>
    <!-- 排序 -->
    <section class="filter-extend" v-if="isSort">
      <ul>
        <li
          v-for="(item,index) in filterData.sortBy"
          :key="index"
          @click="selectSort(item,index)"
          :class="{'selectName':currentSort == index}"
        >
          <span>{{item.name}}</span>
          <span class="fa fa-check" v-show="currentSort == index"></span>
        </li>
      </ul>
    </section>
    <!-- 筛选 -->
    <section class="filter-extend" v-if="isScreen">
      <div class="filter-sort">
        <div v-for="(screen,index) in filterData.screenBy" :key="index" class="morefilter">
          <p class="title">{{screen.title}}</p>
          <ul>
            <li
              v-for="(item,i) in screen.data"
              :key="i"
              :class="{'selected':item.select}"
              @click="selectScreen(screen,item)"
            >
              <img v-if="item.icon" :src="item.icon" alt />
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="morefilter-btn">
        <span class="morefilter-clear" :class="{'edit':edit}" @click="clearFilter">清空</span>
        <span class="morefilter-ok" @click="filterOk">确定</span>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "FilterView",
  data() {
    return {
      currentFilter: 0, //被点击的导航索引
      isSort: false, //展示蒙版
      currentSort: 0, //综合排序中被选中的选项的索引
      isScreen: false //点击筛选展示蒙版
    };
  },
  props: {
    filterData: Object
  },
  computed: {
    edit() {
      // 选中某一筛选条件时，改变清空按钮样式
      let edit = false;
      this.filterData.screenBy.forEach(screen => {
        screen.data.forEach(item => {
          if (item.select) {
            edit = true;
          }
        });
      });
      return edit;
    }
  },
  methods: {
    filterSort(index) {
      this.currentFilter = index;
      switch (index) {
        case 0:
          this.isSort = true;
          this.$emit("searchFixed", true); //搜索框置顶
          break;
        case 1:
          this.$emit("update", {
            condition: this.filterData.navTab[1].condition
          });
          this.hideView();
          break;
        case 2:
          this.$emit("update", {
            condition: this.filterData.navTab[2].condition
          });
          this.hideView();
          break;
        case 3:
          this.isScreen = true;
          this.isSort = false;
          this.$emit("searchFixed", true);
          break;
        default:
          this.hideView();
          break;
      }
    },
    // 隐藏蒙版
    hideView() {
      this.isSort = false;
      this.isScreen = false;
      this.$emit("searchFixed", false);
    },
    selectSort(item, index) {
      this.currentSort = index;
      this.filterData.navTab[0].name = this.filterData.sortBy[index].name;
      this.hideView();
      // 更新数据 item.code--更新条件
      this.$emit("update", { condition: item.code });
    },
    // 选择筛选条件
    selectScreen(screen, item) {
      // 优惠活动和人均消费选择单选
      if (screen.id !== "MPI") {
        // 单选
        screen.data.forEach(ele => {
          ele.select = false;
        });
      }
      item.select = !item.select;
    },
    // 清空
    clearFilter() {
      this.filterData.screenBy.forEach(screen => {
        screen.data.forEach(item => {
          item.select = false;
        });
      });
    },
    /* 
    确定：
        1.综合排序，距离最近，品质联盟，筛选的本质都是按照筛选条件更新数据。
        
        2. 每一个筛选条件数据中都有一个code，是每个筛选条件所对应的数据展示方式，点击确定时，获得被点击筛选条件的code，注册一个数据更新函数，将其code传递给该函数，然后商家展示模块根据筛选条件code展示相应的数据。
        
        3.点击确定时，分两种情况：
            A.单选所得筛选条件 
            B.多选所得筛选条件
     */
    filterOk() {
        // 定义被传递的筛选条件
        // let codeStr = ""

        // 定义筛选条件所属的父级选项，将所得筛选条件按类别传递
        let screenData = {
            MPI:"",
            offer:"",
            per:""
        }

        // 1.点击确定首先要确保选中了某个筛选条件
        this.filterData.screenBy.forEach(screen => {
            screen.data.forEach((item) => {
                if(item.select){
                   if (screen.id !== "MPI") {
                        // 单选
                        // codeStr = item.code;
                        console.log(screen.id);//被点击筛选条件所属的父级选项
                        screenData[screen.id] = item.code;
                   } else {
                        // 多选 
                        // codeStr += item.code + ","
                        screenData[screen.id] += item.code + ","
                   }
                }
            })
        })

        this.$emit('update',{condition:screenData});
        this.hideView();
    }
  }
};
</script>

<style scoped>
.filter_wrap {
  background: #fff;
  position: sticky;
  top: 54px;
  z-index: 10;
}
.filter {
  position: relative;
  border-bottom: 1px solid #ddd;
  line-height: 10.4vw;
  z-index: 101;
  height: 10.666667vw;
  display: flex;
  justify-content: space-around;
}
.filter-nav {
  flex: 1;
  text-align: center;
  color: #666;
  font-size: 0.8333rem;
}
.filter-nav i {
  width: 1.6vw;
  height: 0.8vw;
  margin-left: 1.333333vw;
  margin-bottom: 0.533333vw;
  fill: #333;
  will-change: transform;
}
.filter-bold {
  font-weight: 600;
  color: #333;
}
.open {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease-in-out;
  z-index: 3;
}

.filter-extend {
  width: 100%;
  background-color: #fff;
  color: #333;
  padding-top: 2.133333vw;
  z-index: 4;
  position: absolute;
  left: 0;
  top: 24.533333vw;
}
.filter-extend li {
  position: relative;
  padding-left: 5.333333vw;
  line-height: 10.666667vw;
  overflow: hidden;
}
.fa-check {
  float: right;
  color: #009eef;
  margin-right: 3.733333vw;
  line-height: 10.666667vw;
}
.selectName {
  color: #009eef;
}
/* 筛选 */
.filter-sort {
  background: #fff;
  padding: 0 2.666667vw;
  line-height: normal;
}
.morefilter {
  margin: 2.666667vw 0;
  overflow: hidden;
}
.morefilter .title {
  margin-bottom: 2vw;
  color: #666;
  font-size: 0.5rem;
}
.morefilter ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 0.8rem;
}
.morefilter li {
  box-sizing: border-box;
  width: 30%;
  height: 9.333333vw;
  line-height: 9.333333vw;
  margin: 0.8vw 1%;
  background: #fafafa;
}
.morefilter li img {
  width: 3.466667vw;
  height: 3.466667vw;
  vertical-align: middle;
  margin-right: 0.8vw;
}
.morefilter li span {
  margin-left: 2%;
  vertical-align: middle;
}
.morefilter-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fafafa;
  box-shadow: 0 -0.266667vw 0.533333vw 0 #ededed;
  line-height: 11.466667vw;
  box-sizing: border-box;
}
.morefilter-btn span {
  font-size: 0.826667rem;
  text-align: center;
  text-decoration: none;
  flex: 1;
}
.morefilter-clear {
  color: #ddd;
  background: #fff;
}
.morefilter-ok {
  color: #fff;
  background: #00d762;
  border: 0.133333vw solid #00d762;
}
.selected {
  color: #3190e8 !important;
  background-color: #edf5ff !important;
}

.edit {
  color: #333 !important;
}
</style>