<template>
  <div class="addTodo">
    <form @submit.prevent="addtodo">
        <input v-model="title" type="text" placeholder="请添加待办事项......">
        <input type="submit" value="添加" class="btn">
    </form>
  </div>
</template>

<script>
// import uuid from 'uuid'
export default {
  name: 'AddTodo',
  data(){
      return {
          title:''
      }
  },
  methods:{
      addtodo(){
        //   console.log(this.title);
        const newTodo = {
            // id:uuid.v4(),
            title:this.title,
            completed:false
        }
        // console.log(newTodo);
        this.$emit("handleAdd",newTodo);
        this.title = "";
      }
  }
  
}
</script>


<style scoped>
    form {
        display:flex;
    }
    input[type="text"]{
        flex:10;
    }
    input[type="submit"]{
        flex:1;
    }
</style>
