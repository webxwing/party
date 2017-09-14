<template>
<div class="main">
  <leftSteps :active-numb="1"></leftSteps>
  <div class="rightContent">
    <div class="topContent">
      <h2>新建过程考核</h2>
    </div>
    <div class="bodyContent">
      <div class="menu">
        <div class="info">

        </div>
        <div class="button-group">
          <el-button-group>
            <el-tooltip class="item" effect="light" content="回到主页" placement="top">
              <el-button type="success"  size="small" >放弃</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="完成并进入考核体系设置" placement="top">
              <el-button type="primary"  size="small" >下一步</el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div class="form">
        <el-form  label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="年度">
            <el-select v-model="form.region" placeholder="请选择年度">
              <el-option label="2017" value="2017"></el-option>
              <el-option label="2016" value="2016"></el-option>
              <el-option label="2015" value="2015"></el-option>
              <el-option label="2014" value="2014"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考核时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="开始日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">--</el-col>
            <el-col :span="11">
              <el-time-picker type="fixed-time" placeholder="结束日期" v-model="form.date2" style="width: 100%;"></el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.resource">
              <el-radio label="维护"></el-radio>
              <el-radio label="发布"></el-radio>
              <el-radio label="完成"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>

</div>
</template>
<script>
  import leftSteps from '../components/LeftSteps.vue'
    export default {
      name: 'new',
      data() {
        return {
          form: {
            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
          }
        }
      },
      components: { leftSteps },
      methods: {
        onSubmit(){
          console.log('s');
        }
      }
    }
</script>
<style scoped>


.form {
  margin-right: 30px;
}

</style>
