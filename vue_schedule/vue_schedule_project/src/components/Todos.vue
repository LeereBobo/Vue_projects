<template>
  <div class="todos">
    <div v-for="todo in todos" :key=todo.title :todo="todo">
        <todo-item :todo="todo" 
        @deleteItem="$emit('deleteTodo',todo.id)"
        ></todo-item>
    </div>
  </div>
</template>

<script>
import TodoItem from './TodoItem'
export default {
  name: 'Todos',
  props:["todos"],
  components:{
    "todo-item":TodoItem
  }
}
</script>


<style scoped>

</style>
