<template>
  <div>
   <h3>待办事项</h3>
   <div class="legend">
       <span>双击表示完成</span>
       <span>
           <span class="incompleted_box"></span> = 未完成
       </span>
       <span>
           <span class="completed_box"></span> = 已完成
       </span>
   </div>
   <div class="todos">
       <div :class="{'is-complete':todo.completed}" class="todo" @dblclick="onDblclick(todo)"
       v-for='(todo,index) in allTodos' :key='index'>{{todo.title}}
           <i class="fas fa-trash-alt" @click='deleteTodo(todo.id)'></i>
       </div>
   </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
export default {
  name: 'Todos',
  computed:mapGetters(['allTodos']),
  methods:{
      ...mapActions(['fetchTodos','deleteTodo','updateTodo']),
      onDblclick(todo){
          const updTodo = {
              id:todo.id,
              title:todo.title,
              completed:!todo.completed
          }
        //   console.log(updTodo);
          this.updateTodo(updTodo);
      }
  },
  created(){
      this.fetchTodos();
  }

}
</script>

<style scope>
.todos {
    display:grid;
    grid-template-columns: repeat(3,1fr);
    grid-gap:1rem;
}

.todo {
    border:1px solid #ccc;
    background: #41b883;
    padding:1rem;
    border-radius:5px;
    text-align: center;
    position: relative;
    cursor:pointer;
}
i {
    position:absolute;
    bottom:10px;
    right:10px;
    color:#fff;
    cursor:pointer;
}

.is-complete {
    background: #35495e;
    color:#fff;
}

@media (max-width:500px) {
    .todos {
        grid-template-columns: 1fr;
    }
}

</style>
