<template>
<div class="leftSteps">
  <el-steps :space="100" direction="vertical" :active="active">
    <el-step title="考核总览"></el-step>
    <el-step title="考核体系"></el-step>
    <el-step title="评分设置"></el-step>
    <el-step title="考核对象"></el-step>
  </el-steps>
</div>
</template>
<script>
    export default {
      name: 'leftSteps',
      props:{
        activeNumb : {
          type: Number,
          default: 1
        }
      },
      data() {
        return {
          active : this.activeNumb
        }
      }
    }
</script>
<style scope>
  .leftSteps {
    width: 16%;
    float: left;
    margin: 25px;
    border-right: 2px solid  #2c3e50;
  }
</style>
