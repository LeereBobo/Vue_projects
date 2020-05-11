<template>
    <div class="login">
        <div class="logo">
            <img src="../assets/logo.jpg" alt="my login image">
        </div>

        <!-- 手机号输入框 -->
       <InputGroup
            v-model="phone"
            type="number"
            placeholder="手机号"
            :btnTitle="btnTitle"
            :disabled="disabled"
            :error="errors.phone"
            @btnClick="getVerifyCode"
       />
       
        <!-- 验证码输入框 -->
       <InputGroup
            type="number"
            v-model="verifyCode"
            placeholder="验证码"
            :error="errors.code"
       />

       <!-- 用户服务协议 -->
       <div class="login_des">
            <p>
                新用户登录即自动注册，表示已同意
                <span>《用户服务协议》</span>
            </p>
       </div>
       
        <!-- 登录按钮 -->
        <div class="login_btn">
            <button :disabled="btnClick" @click="handleLogin">登录</button>
        </div>
    </div>
</template>

<script>
import InputGroup from '../components/InputGroup'
export default {
    name:'Login',
    components:{
        InputGroup
    },
    data(){
        return {
            phone:"",
            btnTitle:"获取验证码",
            disabled:false,
            errors:{},
            verifyCode:""

        }
    },
    computed:{
        // 手机号或验证码一者为空时，不可登录
        btnClick(){
            if(!this.verifyCode || !this.phone) return true;
            else return false;
        }
    },
    methods:{
        // 4.实现验证码登录并跳转
        handleLogin(){
            this.errors = {};
            this.$axios.post('/api/posts/sms_back',{
                phone:this.phone,
                code:this.verifyCode
            }).then((res) => {
                console.log(res);
                // 检验成功，设置登录状态并跳转到 "/"
                localStorage.setItem("ele_login",res.data.user._id);
                this.$router.push('/');
            }).catch(err => {
                // 返回错误信息
                this.errors = {
                    code:err.response.data.msg
                }
            })
        },

        // 3.发送验证码倒计时
        verifyCountDown(){
            let time = 60;
            let timer = setInterval(() => {
                if(time == 0){
                    clearInterval(timer);
                    this.disabled = false;
                    this.btnTitle = "获取验证码";
                    this.phone = "";
                }else{
                    this.btnTitle = time + "秒后重试";
                    this.disabled = true;
                    time--;

                }
            },1000);
        },
        // 2.点击获取验证码
        getVerifyCode(){
            if(this.validatePhone()){
                this.$axios.post("/api/posts/sms_send",{
                    sid:"22f0d7360811afee49a59acb9c92adbd",
                    token:"f1fdbe3b3cf3200f613e4b0a6a7c1042",
                    appid:"d4a43a30f82d42dfbe9c1333eb6320d6",
                    templateid:"534366",
                    phone:this.phone
                }).then(res => {
                    // console.log(res);
                    this.verifyCountDown();
                }).catch(err => console.log(err));   
            }
        },
        // 1.验证手机号码
        validatePhone(){
            // 手机号输入为空
            if (!this.phone) {
                this.errors = {
                    phone:"手机号码不能为空"
                };
                return false;
            } else if(!(/^1[3456789]\d{9}$/.test(this.phone))) {
                // 手机号输入格式有误
                this.errors = {
                    phone:"请输入正确的手机号码"
                };
                return false;
                
            }else{
                // 手机号非空又无误
                this.errors = {};
                return true;


            }
        }
    }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background: #fff;
}

.logo {
  text-align: center;
}
.logo img {
  width: 150px;
}
.text_group,
.login_des,
.login_btn {
  margin-top: 20px;
}
.login_des {
  color: #aaa;
  line-height: 22px;
}
.login_des span {
  color: #4d90fe;
}
.login_btn button {
  width: 100%;
  height: 40px;
  background-color: #48ca38;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
}
.login_btn button[disabled] {
  background-color: #8bda81;
}

</style>