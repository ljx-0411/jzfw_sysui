<template>
  <div class="login-container">
    <div class="bg"></div>
    <div class="header">
      <div class="title">
        家政服务后台管理系统
      </div>
    </div>
    <!-- 中间 -->
    <div class="center">
      <!-- 表单 -->
      <div class="form">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
          <div style="text-align:center;height:60px;line-height:60px;font-weight:bold">用户登录
            <i id="cartoo"><img src="./images/05.gif" alt=""></i>
          </div>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="Username" type="text" ref="username" />
          </el-form-item>
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Password" />
            </el-form-item>
          </el-tooltip>
          <div>
            <el-button :loading="loading"  style="width:100%;" @click.native.prevent="handleLogin">登录</el-button>
          </div>
        </el-form>
        <!-- 表单 -->
      </div>
    </div>
    <div class="footer">
      家政服务管理平台

    </div>
  </div>
</template>

<script>
import {post} from '@/utils/request'
export default {
  name: 'Login',
  data() {
    
    const validateUsername = (rule, value, callback) => {
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      callback()
    }
    return {
      visible:false,
      form:{},
      rules:{
        username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
        realname: [ { required: true, message: '请输入姓名', trigger: 'blur' } ],
        password: [ { required: true, message: '请输入密码', trigger: 'blur' } ]
      },
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    // 提交注册
    submitHandler(){
      this.$refs['registerForm'].validate((valid) => {
        if (valid) {
          let url = '/user/register'
          post(url,this.form).then(response => {
            this.$message({type:"success",message:response.message})
            this.visible = false;
          })
        } else {
          return false;
        }
      });
    },
    // 重置表单校验
    clearValidate() {
      this.$refs['registerForm'].clearValidate();
    },
    // 去保存
    toRegisterHandler(){
      this.form = {};
      this.visible = true;
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>

/* reset element-ui css */
.login-container {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #4fbcb6;
  overflow: hidden;
  .bg {
    height: 400px;
    background-color:  #4fbcb6;
    position: absolute;
    width: 3000px;
    top: -100px;
    right: -200px;
    transform: rotate(10deg);
  }
  .header {
    height: 300px;
    background-color: #4fbcb6;
    position: relative;
    color: #ffffff;
    .title {
      text-align: center;
      position: absolute;
      bottom: 170px;
      width: 100%;
      font-size: 2em;
    }
  }
  .center{
    box-sizing: border-box;
    position: relative;
    top: -120px;
    background-color: #ffffff;
    width: 500px;
    margin: 0 auto;
    border-radius: 5px;
    padding: 2em;
    box-shadow: 0 0 10px #ccc;
    opacity: 0.9;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    line-height: 3em;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    background-color: #ffffff;
  }
  #cartoo img{
    width: 250px;
    height: 250px;
    position: absolute;
    right: -370px;
    bottom: -80px;
  }
}
</style>
