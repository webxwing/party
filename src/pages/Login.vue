<template>
<div class="login">
  <div class="img-login">
    <img src="../assets/cdivtc.png" alt="成都工业职业技术学院">
  </div>
  <el-form ref="form" label-position="right" label-width="180px" :rules="rules" :model="form">
    <el-form-item label="用户名:" prop="username">
      <el-input v-model="form.username"
        placeholder="请输入你的用户名"
        icon="close">
      </el-input>
    </el-form-item>
    <el-form-item label="密 码：" prop="password">
      <el-input v-model="form.password"
        placeholder="请输入你的密码"
        type="password"
        icon="close">
      </el-input>
    </el-form-item>
    <el-form-item label="部 门：" prop="selectDepart">
      <el-select v-model="form.selectDepart" placeholder="请选择">
        <el-option v-for="depart in departments"
        :key="depart.department"
        :label="depart.department"
        :value="depart.department">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="角 色：">
      <el-select v-model="form.selectActor" placeholder="请选择用户的类型">
        <el-option key="admin" value="管理员">管理员</el-option>
        <el-option key="grade" value="评分人">评分人</el-option>
        <el-option key="user" value="普通用户">普通用户</el-option>
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
    data () {
      return {
        form: { username:'',password:'',selectDepart:'',selectActor:'普通用户' },
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
      login(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let loading = this.$loading({text:"加载中..."});
            let postUrl = '/webapi/login';
            this.$http.post(postUrl,qs.stringify({usercode:this.form.username,pwd:this.form.password})).then((d) => {
              if (d !== undefined && d.data.msg == 'success') {
                loading.close();
                this.$message({
                  message: '登录成功！',
                  type: 'success',
                  duration: 1500
                });
                //存储信息
                window.sessionStorage.setItem('sessionID',d.data.value);
                window.sessionStorage.setItem('name',this.form.username);
                window.sessionStorage.setItem('department',this.form.selectDepart);
                this.$store.state.user.sessionID = d.data.value;
                this.$store.state.user.name = this.form.username;
                this.$store.state.user.department =  this.form.selectDepart;
                if(this.form.selectActor == '管理员'){
                  this.baseFun.gotoLink({ path:'/admin/main' });
                }else if(this.form.selectActor == '普通用户'){
                  this.baseFun.gotoLink({ path:'/user/main' });
                }else if(this.form.selectActor == '评分人'){
                  this.baseFun.gotoLink({ path:'/grade/index' });
                }else{
                  this.$message({message:'没有选择任何角色!',type:'error',duration:1500});
                }
              } else {
                loading.close();
                this.$message({
                  message: '账号密码不正确！',
                  type: 'warning',
                  duration: 1500
                });
              }
            }).catch((err) => {
              this.$message({ message:'服务器'+err,type:'error',duration:1500 });
            });
          } else {
            return false;
          }

        });

      }
    },
    created(){
      let departUrl = '/webapi/get_LoginDepartment';
      this.$http.post(departUrl).then((d)=>{
        if(d!=undefined && d.data.msg == 'success'){
          //console.log(d.data.value);
          this.departments = JSON.parse(d.data.value) ;
        }
      })
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
.el-input,.el-select {
  width: 280px;
}
</style>
