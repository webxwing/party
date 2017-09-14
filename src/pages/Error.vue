<template>
  <div class="error">
    <h1>404</h1>
    <h3 class="font-bold">页面未找到！</h3>

    <div class="error-desc">
      抱歉，页面好像去火星了~
      <el-form>
        <el-form-item>
          <el-input placeholder="搜一搜！" icon="search"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
    export default {
      name: 'error'
    }
</script>
<style scoped>
  .error {
    width: 350px;
    margin: 0 auto;
    text-align: center;
    padding-top: 7%;
  }
  h1 {
    font-size: 170px;
    color: rgb(25,51,102);
    font-weight: 100;
  }
  h3 {

  }
  .error-desc {
    width: 260px;
    margin: 15px auto;
  }
  .el-form {
    margin: 15px;
  }
</style>
