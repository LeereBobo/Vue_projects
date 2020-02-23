<template>
	<div class="v-edit container">
		<Alert v-if="alert" v-bind:message="alert"></Alert>
		<h1 class="page-header">编辑用户</h1>
		<form v-on:submit.prevent="updateCustomer">
			<div class="well">
				<h4>用户信息</h4>
				<div class="form-group">
					<label>姓名</label>
					<input type="text" class="form-control" placeholder="name" v-model="customer.name" required>
				</div>
				<div class="form-group">
					<label>电话</label>
					<input type="text" class="form-control" placeholder="phone" v-model="customer.phone">
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
				<button type="submit" class="btn btn-primary">提交</button>
			</div>
		</form>
	</div>
</template>

<script>
	import Alert from './Alert.vue'
	const axios = require('axios');
	export default {
		name:"v-edit",
		data(){
			return {
				customer:{},
				id:this.$route.params.id,
				alert:''
			}
		},
		methods:{
			fetchDetail(){
				axios.get('https://vue-customers.firebaseio.com/users/'+this.id+'.json').then((res)=>{
					this.customer = res.data;
				})

			},
			updateCustomer(){
				if (!this.customer.name || !this.customer.phone || !this.customer.email) {
					this.alert = "请添加对应信息！";
				} else {
					axios.put('https://vue-customers.firebaseio.com/users/'+this.id+'.json',this.customer).then(()=>{
					// console.log(res);
						this.$router.replace({
							name:'home',
							query:{alert:"用户信息编辑成功！"}
							
							// name:'home',
							// params:{alert:"用户信息添加成功！"}
						});
					})
				}

				
				
			}
		},
		created(){
			this.fetchDetail();
		},
		components:{
			Alert
		}
	}

	
</script>