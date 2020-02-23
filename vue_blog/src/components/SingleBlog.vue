<template>
	<div id="single-blog" v-if="!deleted">
		<h1>{{blog.title}}</h1>
		<article>
			{{blog.content}}
		</article>
		<p>作者：{{blog.author}}</p>
		<div>
			<p>分类：</p>
			<ul>
				<li v-for="category in blog.categories">{{category}}</li>
			</ul>
		</div>
		<button @click="deleteSingleBlog()">删除</button>
		<router-link :to="'/edit/' + id">编辑</router-link>
	</div>

</template>

<script>
	export default {
		name:"single-blog",
		data(){
			return {
				id:this.$route.params.id,
				blog:{},
				deleted:false
			}
		},
		created(){
			this.$http.get('https://vue-blog-da925.firebaseio.com/posts/'+this.id+'.json').then(function(res){
				   // console.log(res);
				   return res.json();
			}).then((data)=>{
				// console.log(data);
				this.blog = data;
			})
		},
		methods:{
			deleteSingleBlog(){
				this.$http.delete('https://vue-blog-da925.firebaseio.com/posts/'+this.id+'.json').then((res)=>{
                    this.deleted = true;
                    alert("deleted!");
                    this.$router.replace({path:'/'});
				})
			}
		}
	}
</script>

<style>
	#single-blog {
		max-width:960px;
		margin:0 auto;
		padding: 20px;
		background: #eee;
		border:1px dotted #aaa; 
	}
</style>