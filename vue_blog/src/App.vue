<template>
  <div id="app">
    <blog-header></blog-header>
    <router-view></router-view>	
  </div>
</template>

<script>

import AddBlog from './components/AddBlog.vue'
import ShowBlogs from './components/ShowBlogs.vue'
import BlogHeader from './components/BlogHeader.vue'


export default {
  name: 'app',
  components:{
    "add-blog":AddBlog,
    "show-blogs":ShowBlogs,
    "blog-header":BlogHeader
  }
  
}
</script>

<style>

</style>
