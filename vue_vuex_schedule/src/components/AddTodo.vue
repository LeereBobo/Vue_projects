<template>
  <div>
      <h3>添加内容</h3>
      <form @submit.prevent="onSubmit">
          <input type="text" placeholder="...请添加待办事项" v-model="title">
          <input type="submit" value="添加">
      </form>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'AddTodo',
  data(){
      return {
          title:""
      }
  },
  methods:{
      ...mapActions(['addTodo']),
      onSubmit(){
          this.addTodo(this.title);
          this.title = "";
      }
  }
  
}
</script>

<style scope>
form {
    display: flex;
}

input[type="text"]{
    flex:10;
    padding:10px;
    border:#41b883 1px solid;
    outline:0;

}

input[type="submit"]{
    flex:2;
    background: #41b883;
    color:#fff;
    border:1px solid #41b883;
    cursor:pointer;
}
</style>
