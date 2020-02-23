<template>
  <div class="todoItem">
    <p :class="{'is-complete':todo.completed}">
        <input type="checkbox" @change="markComplete">
        {{todo.title}}
        <button class="del" @click="$emit('deleteItem',todo.id)">X</button>
    </p> 
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props:["todo"],
  methods:{
      markComplete(){
        //   console.log(this.todo.id)
        this.todo.completed = !this.todo.completed;
      }
  }
}
</script>


<style scoped>
    .todoItem {
        background-color: #f4f4f4;
        padding: 10px;
        border-bottom:1px dotted #ccc;
    }
    .is-complete {
        text-decoration:line-through;
    }
    .del {
        float:right;
        background-color: #ff0000;
        color:#fff;
        border-radius: 50%;
        padding:5px 9px;
        border:none;
        cursor:pointer;
    }


</style>
