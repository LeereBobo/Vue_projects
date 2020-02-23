<template>
  <header class="header">
      <h1>待办事项</h1>
      <router-link to="/">主页</router-link>
      <router-link to="/about">关于我们</router-link>
  </header>
</template>

<script>
export default {
  name: 'Header',
  
}
</script>


<style scoped>
    .header {
        background-color: #333;
        color:#fff;
        text-align: center;
        padding: 10px;
    }
    .header a {
      text-decoration: none;
      color:#fff;
      padding-right:5px;
    }
</style>
