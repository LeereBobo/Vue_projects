<template>
	<div class="v-details container">
		<router-link to='/' class='btn btn-default'>返回主页</router-link>
		<h1 class="page-header">
		{{customer.name}}
		<span class="pull-right">
			<router-link class='btn btn-primary' v-bind:to="'/edit/' + this.id">编辑</router-link>
			<button class="btn btn-danger" @click="deleteCustomer()">删除</button>
		</span>
	</h1>
		<ul class="list-group">
			<li class="list-group-item">
				<span class="glyphicon glyphicon-phone-alt">
					{{customer.phone}}
				</span>
			</li>
			<li class="list-group-item">
				<span class="glyphicon glyphicon-envelope">
					{{customer.email}}
				</span>
			</li>
		</ul>
		<ul class="list-group">
			<li class="list-group-item">
				<span class="glyphicon glyphicon-folder-open">
					{{customer.education}}
				</span>
			</li>
			<li class="list-group-item">
				<span class="glyphicon glyphicon-file">
					{{customer.graduationschool}}
				</span>
			</li>
			<li class="list-group-item">
				<span class="glyphicon glyphicon-print">
					{{customer.profession}}
				</span>
			</li>
			<li class="list-group-item">
				<span class="glyphicon glyphicon-tag">
					{{customer.profile}}
				</span>
			</li>
		</ul>
	</div>
</template>

<script>
	const axios = require('axios')
	export default {
		name:"v-details",
		data(){
			return{
				customer:{},
				id:this.$route.params.id
			}
		},
		created(){
            // console.log(this.id)
			axios.get('https://vue-customers.firebaseio.com/users/'+this.id+'.json').then((res)=>{
				// console.log(res)
				this.customer = res.data;
				// console.log(this.customer)
			})

		},
		methods:{
			deleteCustomer(){
				axios.delete('https://vue-customers.firebaseio.com/users/'+this.id+'.json').then(()=>{
					this.$router.replace({
						path:'/',
						query:{alert:"用户删除成功！"}
					})
				})
			}
		}
	}
</script>