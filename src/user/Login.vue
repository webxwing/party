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
      <el-form-item label="部门：" prop="selectDepart">
        <el-select v-model="form.selectDepart" placeholder="请选择">
          <el-option v-for="depart in departments"
                     :key="depart.department"
                     :label="depart.department"
                     :value="depart.department">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="login('form')">登录</el-button>
        <el-button type="text"  @click="$message({message:'功能还在完善中'})">找回密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import store from '../common/store.js'
  import baseFun from '../common/baseFun.js'
  import qs from 'qs'
  export default {
    name:'userLogin',
    data () {
      return {
        form: { username:'',password:'',selectDepart:'' },
        departments:[],
        rules: {
          username: [
            { required:true,message:'用户名不能为空',trigger:'blur' }
          ],
          password:[
            { required:true,message:'密码不能为空',trigger:'blur' }
          ],
          selectDepart:[
            { required:true,message:'请选择部门',trigger:'change' }
          ]
        }
      }
    },
    store,
    beforeCreate(){
      store.commit('initialUser');
//      if(this.baseFun.isLogin()){
//        let loginLoading = this.$loading({text:"登录中..."});
//        setTimeout(function(){
//          loginLoading.close();
//          baseFun.gotoLink({ path:'/admin/main' });
//        },1800);
//      }

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
