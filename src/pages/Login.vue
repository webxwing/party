<template>
<div class="login">
  <div class="img-login">
    <img src="../assets/cdivtc.png" alt="成都工业职业技术学院">
  </div>
  <el-form  label-position="right" label-width="180px">
    <el-form-item label="用户名：" >
      <el-input
        placeholder="8位英文和数字的组合"
        icon="close">
      </el-input>
    </el-form-item>
    <el-form-item label="密码：">
      <el-input
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
    export default {
      data () {
        return {
          form: { }
        }
      }
    }
</script>
<style scoped>
.login {
  width: 600px;
  margin: 0 auto;
  padding-top: 7%;
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
</style>
