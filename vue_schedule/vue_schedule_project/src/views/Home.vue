<template>
  <div id="home">
    <AddTodo @handleAdd="handleTheAdd"></AddTodo>
    <Todos :todos="todos" @deleteTodo="handleDelete"></Todos>
  </div>
</template>
<script>
import Todos from '../components/Todos'
import AddTodo from '../components/AddTodo'
import axios from 'axios'
export default {
  name:'home',
  data(){
    return {
      todos:[]
    }
  },
  components:{
    Todos,
    AddTodo 
  },
  methods:{
    handleDelete(id){
      axios
      .delete(`http://localhost:3000/posts/${id}`)
      .then(res => {  
        this.todos = this.todos.filter(todo=>todo.id != id);
      })
    },
    handleTheAdd(newTodo){
      const { title,completed } = newTodo;
      axios
      .post('http://localhost:3000/posts',{
        title,
        completed
      })
      .then(res =>{
        // this.todos.unshift(newTodo);
        this.todos = [res.data, ...this.todos];
      })
      .catch(err => console.log(err))
    }
  },
  created(){
    axios
    .get('http://localhost:3000/posts')
    .then(res => {
      // console.log(res.data);
      this.todos = res.data;
    })
    .catch(err => console.log(err));
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height:1.4;
}

.btn {
  display:inline-block;
  border:none;
  color:#fff;
  background-color: #555;
  cursor:pointer;
  padding: 7px 20px;
}

.btn:hover {
  background-color: #666;
}
</style>
