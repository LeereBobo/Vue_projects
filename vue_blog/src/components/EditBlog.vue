<template>
  <div id="edit-blog">
    
    <form v-if="!submited">
    	<!-- 编辑博客 -->
    	<h2>编辑博客</h2>

    	<label>博客标题</label>
    	<input type="text" v-model="blog.title" required>
		
		<label>博客内容</label>
		<textarea v-model="blog.content" required></textarea>

		<div id="checkboxes">
			<label>Vue.js</label>
			<input type="checkbox" value="vue.js" v-model="blog.categories">

			<label>Node.js</label>
			<input type="checkbox" value="Node.js" v-model="blog.categories">

			<label>React.js</label>
			<input type="checkbox" value="React.js" v-model="blog.categories">

			<label>Angular</label>
			<input type="checkbox" value="Angular" v-model="blog.categories">
		</div>

		<label>作者：</label>
		<select v-model="blog.author">
			<option v-for="author in authors" >{{author}}</option>
		</select>

		<button @click.prevent="edit">编辑博客</button>
	  	
    </form>

    
    <!-- 博客编辑成功 -->
    <div v-if="submited">
    	<h3>您的博客编辑成功！</h3>
    </div>
   

    <!-- 博客总览 -->
    <div id="preview">
    	<h3>博客总览</h3>
    	<p>博客标题：{{blog.title}}</p>
    	<p>博客内容：{{blog.content}}</p>
    	<p>博客分类：</p>
    	<ul>
    		<li v-for="category in blog.categories">{{category}}</li>
    	</ul>
    	<p>作者：{{blog.author}}</p>
    </div>

    


  </div>
</template>

<script>
export default {
  name: 'edit-blog',
  data:function(){
  	return {
  		id:this.$route.params.id,
  		blog:{},
  		authors:["Herny","Bucky","Guagua"],
  		submited:false
  	}
  },
  methods:{
  	fetchData:function(){
  		this.$http.get('https://vue-blog-da925.firebaseio.com/posts/'+this.id+'.json').then(res=>{
  			// console.log(res.body);
  			this.blog = res.body;
  			// console.log(this.blog);

  		})
  	},
  	edit:function(){
  		this.$http.put('https://vue-blog-da925.firebaseio.com/posts/'+this.id+'.json',this.blog).then((data)=>{
  			// console.log(data);
  			this.submited = true;
  		})
  	}
  },
  created(){
      this.fetchData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#addBlog,* {
		box-sizing: border-box;
	}

	#addBlog {
		margin: 20px auto;
		max-width: 600px;

	}

	label {
		display: block;
		margin:20px 0 10px;

	}

	input[type="text"],textarea,select {
		width: 100%;
		display: block;
	}

	textarea {
		height: 200px;
	}

	#checkboxes label {
		display: inline-block;
		margin-top: 0;
		 
	}

	#checkboxes input {
		margin-right: 20px;
	}

	button {
		display: block;
		margin: 20px 0;
		background-color: crimson;
		color:#fff;
		border:0;
		padding: 14px;
		border-radius: 4px;
		font-size: 18px;
		cursor:pointer;
	}

	#preview {
		 padding: 10px 20px;
		 border:1px dotted #ccc; 
		 margin: 30px 0;
	}

	h3 {
		margin-top: 10px;
	}


</style>
