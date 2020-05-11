<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    this.getLocation();
  },
  methods: {
    // 1.获取定位
    getLocation() {
      const self = this;
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);

        function onComplete(data) {
          // data是具体的定位信息 精准定位
          console.log(data);

          // 精准定位成功，分发action，获取定位数据
          self.$store.dispatch('setLocation',data);
          self.$store.dispatch('setAddress',data.formattedAddress);

        }

        function onError(data) {
          // 定位出错  非精准定位
          // console.log(data);
          self.getLngLatLocation();
        }
      });
    },
    // 2.定位失败，IP定位获取当前城市信息
    getLngLatLocation() {
      const self = this;
      AMap.plugin("AMap.CitySearch", function() {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            // console.log(result+"🍑");
            // 3.逆向地理编码，将所得地理坐标（经纬度）转换成地址描述信息
            AMap.plugin("AMap.Geocoder", function() {
              var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: result.adcode
              });

              var lnglat = result.rectangle.split(";")[0].split(",");

              geocoder.getAddress(lnglat, function(status, data) {
                if (status === "complete" && data.info === "OK") {
                  // data为对应的地理位置详细信息
                  // console.log(data+"🍌");
                  // 非精准定位成功，分发action，获取定位数据
                  self.$store.dispatch('setLocation',{
                    addressComponent:{
                      city: result.city,
                      province:result.province
                    },
                    formattedAddress:data.regeocode.formattedAddress
                  });

                  self.$store.dispatch("setAddress",data.regeocode.formattedAddress);
                }
              });
            });
          }
        });
      });
    }
  }
};
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  font-size: 14px;
  background: #f1f1f1;
}
</style>
