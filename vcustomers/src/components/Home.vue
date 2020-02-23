<template>
	<div class="v-home container">
		<Alert v-if="alert" v-bind:message="alert"></Alert>
		<h1 class="page-header">用户管理系统</h1>
		<input type="text" placeholder="搜索" class="form-control" v-model="filterInput">
		<br>
		<table class="table table-striped">
			<thead>
				<tr>
					<th>姓名</th>
					<th>电话</th>
					<th>邮箱</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="customer in filterBy(customers,filterInput)" :key="customer.id">
					<td>{{customer.name}}</td>
					<td>{{customer.phone}}</td>
					<td>{{customer.email}}</td>
					<td>
						<router-link class="btn btn-default" v-bind:to="'/details/' + customer.id ">详情</router-link>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	const axios = require('axios')
	import Alert from './Alert.vue'
	export default {
		name:'v-home',
		data(){
			return {
				customers:[],
				alert:"",
				filterInput:""
			}
		},
		methods:{
			fetchCustomers:function(){
				axios.get('https://vue-customers.firebaseio.com/users.json').then((res)=>{
					var customerArray = [];
					for(let key in res.data){
						
						res.data[key].id = key;
						customerArray.push(res.data[key]);
					}
					this.customers = customerArray;
					
				})
			},
			filterBy(customers,value){
				return customers.filter(function(customer){
					return customer.name.match(value);

				})
			}
		},
		created(){
			this.fetchCustomers();
			if(this.$route.query.alert){
				this.alert = this.$route.query.alert;
				// console.log(this.$route.query.alert);
			}

			/*if(this.$route.params.alert){
				this.alert = this.$route.params.alert;
				console.log(this.$route.params.alert);
			}*/
		},
		/*updated(){
			this.fetchCustomers(); 
		},*/
		components:{
			Alert
		}
	}
</script>