<template>
  <div v-theme:column="'narrow'" id="showBlogs">
    <h1>博客总览</h1>
    <input type="text" placeholder="搜索" v-model="search">
    <div id="singleBlog" v-for="blog in filteredBlogs">
    	<router-link v-bind:to="'/blog/'+blog.id ">  
        <h3 v-rainbow>{{blog.title | to-uppercase}}</h3>
      </router-link>  
    	<article>{{blog.content | snippet}}</article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowBlogs',
  data(){
  	return {
         blogs:[],
         search:""
  	}
  },
  created(){
  	this.$http.get('https://vue-blog-da925.firebaseio.com/posts.json').then((res)=>{
  		
      // console.log(res.json()); 
      return res.json()
      	
  	}).then((data)=>{
      // console.log(data);
      // 
      var blogsArray = [];
      for(let key in data){
        // console.log(key);
        
        // console.log(data[key]);
        data[key].id = key;

        blogsArray.push(data[key]);     
      }

      this.blogs = blogsArray;
        // console.log(this.blogs);
    })
  },
  computed:{
    filteredBlogs:function(){
      return this.blogs.filter((blog)=>{
        return blog.title.match((this.search).toLowerCase());
        //将搜索框内的输入内容转化为小写，实现输入大小写均可匹配，否则只有输入小写可匹配，因为原JSON数据为小写，匹配时是输入内容只与原数据进行匹配
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#showBlogs {
		max-width: 800px;
		margin:0 auto;
	}

	#singleBlog {
		background-color: #eee;
		padding: 20px;
		margin:20px 0;
    border:1px dotted #aaa;
	}

  #showBlogs a{
    text-decoration:none;
    cursor:pointer;
  }

  input[type="text"] {
    width:100%;
    padding:8px;
    box-sizing:border-box;
  }
</style>
