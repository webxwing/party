<template>
<div>
  <header>
    <div class="logo">党建工作过程考核系统</div>
    <div class="header-tip" v-if="$store.state.user.name">
      <span class="user">{{$store.state.user.name}}</span>
      <span class="logout"><el-button type="info" size="mini" @click="baseFun.logout">退出</el-button></span>
    </div>
  </header>
</div>
</template>
<script>
  import store from '../common/store.js'
  export default {
    name: 'header',
    data(){
      return {
        user : '游客'
      }
    },
    store
  }
</script>
<style scoped>
  header{
    position: relative;
    width: 100%;
  }
  .logo {
    float: left;
  }
  .header-tip {
    float: right;
    font-size: 16px;
    color: white;
    margin-right: 50px;
  }
  .user {
    color: #58B7FF;
  }
  .logout {
    margin: 0 5px;
    color: #FFF;
  }
</style>
