<template>
  <div class="login">
    <div class="img-login">
      <img src="../assets/cdivtc.png" alt="成都工业职业技术学院">
    </div>
    <h2 class="title">用户登录</h2>
    <el-form  label-position="right" label-width="180px" :model="form" :rule="rules">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="form.username"
          placeholder="请输入你的用户名"
          icon="close">
        </el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password"
          placeholder="请输入你的密码"
          type="password"
          icon="close">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search">登录</el-button>
        <el-button type="text">找回密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import router from '../router'
  import config from '../common/config'

  export default {
    name:'userLogin',
    data () {
      return {
        form: { username:'',password:'' },
        rules: {
          username: [
            { required:true,message:'用户名不能为空',trigger:'blur' }
          ],
          password:[
            { required:true,message:'密码不能为空',trigger:'blur' }
          ]
        }
      }
    },
    methods: {
      login(){


      }
    }
  }
</script>
<style scoped>
  .login {
    width: 600px;
    margin: 0 auto;
    padding-top: 5%;
  }
  .img-login {
    width:240px;
    margin:0 auto;
    margin-bottom: 23px;
  }
  .img-login img {
    width: 100%;
    height: 100%;
  }
  .el-input {
    width: 280px;
  }
  h2.title{
    width: 100%;
    margin: 0 auto 10px auto;
    text-align: center;
  }
</style>
