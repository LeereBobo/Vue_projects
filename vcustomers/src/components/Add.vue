<template>
	<div class="v-add container">
		<h1 class="page-header">添加用户</h1>
		<form v-on:submit.prevent="addCustomer">
			<div class="well">
				<h4>用户信息</h4>
				<div class="form-group">
					<label>姓名</label>
					<input type="text" class="form-control" placeholder="name" v-model="customer.name" required>
				</div>
				<div class="form-group">
					<label>电话</label>
					<input type="text" class="form-control" placeholder="phone" v-model="customer.phone" required>
				</div>
				<div class="form-group">
					<label>邮箱</label>
					<input type="text" class="form-control" placeholder="email" v-model="customer.email" required>
				</div>
				<div class="form-group">
					<label>学历</label>
					<input type="text" class="form-control" placeholder="education" v-model="customer.education">
				</div>
				<div class="form-group">
					<label>毕业学校</label>
					<input type="text" class="form-control" placeholder="graduationschool" v-model="customer.graduationschool">
				</div>
				<div class="form-group">
					<label>职业</label>
					<input type="text" class="form-control" placeholder="profession" v-model="customer.profession ">
				</div>
				<div class="form-group">
					<label>个人简介</label>
					<textarea rows="10" class="form-control" v-model="customer.profile"></textarea>
				</div>
				<button type="submit" class="btn btn-primary">添加</button>
			</div>
		</form>
	</div>
</template>

<script>
	// import Home from './Home.vue'
	const axios = require('axios');
	export default {
		name:"v-add",
		data(){
			return {
				customer:{}
			}
		},
		methods:{
			addCustomer(){
				axios.post('https://vue-customers.firebaseio.com/users.json',this.customer).then((res)=>{
					console.log(res);
					this.$router.replace({
						name:'home',
						query:{alert:"用户信息添加成功！"}
				
						// name:'home',
						// params:{alert:"用户信息添加成功！"}
					});
				})
			}
		}
	}

	
</script>