import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// types：下文中action提交的mutation，以对象的形式集体命名,方便浏览器根据type查看相关数据
const types = {
  SET_LOCATION: "SET_LOCATION",
  SET_ADDRESS: "SET_ADDRESS",
  ORDER_INFO: 'ORDER_INFO',
  USER_INFO: 'USER_INFO',
  REMARK_INFO: 'REMARK_INFO'

}

// 1.state：设置数据
const state = {
  location: {}, //省市信息
  address: "", //定位到的详细地址
  orderInfo: null, //结算时的订单商品
  userInfo: null,//最后收货地址
  remarkInfo:{
    tableware: "", //餐具份数
    remark:""//订单备注
  }
}

// 2.getter：获取到被设置的数据，以便进行操作
const getters = {
  location: (state, location) => state.location,
  address: (state, address) => state.address,
  orderInfo: state => state.orderInfo,
  userInfo: state => state.userInfo,
  totalPrice: state => {
    let price = 0;
    if (state.orderInfo) {
      const selectFoods = state.orderInfo.selectFoods;
      selectFoods.forEach(food => {
        price += food.activity.fixed_price * food.count;
      });
      price += state.orderInfo.shopInfo.float_delivery_fee;
    }
    return price;
  },
  remarkInfo: state => state.remarkInfo
}

// 4.mutation:如果定位成功，获取到location和address，将其赋值给state的location和address

/* 参数解析：
   1.state： 自设数据，用以接受新数据；
   2. location / address： 非state所设，而是action被分发时传递过来的实参，即所得定位数据
*/

const mutations = {
  [types.SET_LOCATION](state, location) {
    if (location) {
      state.location = location;
    } else {
      state.location = null;
    }
  },
  [types.SET_ADDRESS](state, address) {
    if (address) {
      state.address = address;
    } else {
      state.address = "";
    }
  },
  [types.ORDER_INFO](state, orderInfo) {
    if (orderInfo) {
      state.orderInfo = orderInfo;
    } else {
      state.orderInfo = null;
    }
  },
  [types.USER_INFO](state, userInfo) {
    if (userInfo) {
      state.userInfo = userInfo;
    } else {
      state.userInfo = null;
    }
  },
  [types.REMARK_INFO](state, remarkInfo) {
    if (remarkInfo) {
      state.remarkInfo = remarkInfo;
    } else {
      state.remarkInfo = null;
    }
  }
}

// 3.action：定位成功时被分发，并将获取到的数据location，以参数的形式传递给mutation
const actions = {
  setLocation: ({
    commit
  }, location) => {
    commit(types.SET_LOCATION, location);
  },
  setAddress: ({
    commit
  }, address) => {
    commit(types.SET_ADDRESS, address);
  },
  setOrderInfo: ({
    commit
  }, orderInfo) => {
    commit(types.ORDER_INFO, orderInfo);
  },
  setUserInfo: ({
    commit
  }, userInfo) => {
    commit(types.USER_INFO,
      userInfo)
  },
  setUserInfo: ({
    commit
  }, userInfo) => {
    commit(types.USER_INFO,
      userInfo)
  },
  setRemarkInfo: ({
    commit
  }, remarkInfo) => {
    commit(types.REMARK_INFO,
      remarkInfo)
  }
}


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})