<template>
  <div id="app">
    <customer-header></customer-header>
    <router-view></router-view>
  </div>
</template>

<script>

import CustomerHeader from './components/Header.vue'
export default {
  name: 'app',
  components:{
     "customer-header":CustomerHeader,
  }
  
}
</script>

<style>

</style>
