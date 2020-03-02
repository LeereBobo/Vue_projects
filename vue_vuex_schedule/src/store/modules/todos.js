const state = {
    todos:[]
};

const getters = {
    allTodos:state => state.todos
};

const mutations = {
    setTodos: (state, todos) => (state.todos = todos),
    newTodo:(state,todo) => state.todos.unshift(todo),
    removeTodo:(state,id) => (state.todos = state.todos.filter(todo => todo.id !== id)),
    putTodo: (state, updTodo) => {
        const index = state.todos
        .findIndex(todo => todo.id === updTodo.id);
        if(index !== -1){
            state.todos.splice(index,1,updTodo);
        }
    }

};

const actions = {
    // 获取数据
    async fetchTodos({commit}){
        const response = await axios.get('http://jsonplaceholder.typicode.com/todos');
        // console.log(response);
        commit('setTodos', response.data);

    },

    // 添加数据
    async addTodo({commit},title){
        const response = await axios.post('http://jsonplaceholder.typicode.com/todos',{title,complated:false});
        commit('newTodo',response.data);
    },

    // 删除数据
    async deleteTodo({commit},id){
        await axios.delete(`http://jsonplaceholder.typicode.com/todos/${id}`);
        commit('removeTodo',id);
    },

    // 筛选数据
    async FilterTodos({commit},count){
        const response = await axios.get(`http://jsonplaceholder.typicode.com/todos?_limit=${count}`);
        commit('setTodos',response.data);
    },

    // 更新数据
    async updateTodo({commit},updTodo){
        const response = await axios.put(`http://jsonplaceholder.typicode.com/todos/${updTodo.id}`, updTodo);
        commit("putTodo", response.data);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};

